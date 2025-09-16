import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.FRONTEND_URL || 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
};

function generateServiceNumber() {
  const ts = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SR-${date}-${rand}`;
}

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (process.env.ADMIN_API_TOKEN) {
      const token = req.headers['x-admin-token'];
      if (token !== process.env.ADMIN_API_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const { limit = 200 } = req.body || {};

    // Fetch records missing service_number
    const { data: missing, error } = await supabase
      .from('service_requests')
      .select('id')
      .is('service_number', null)
      .order('created_at', { ascending: true })
      .limit(Math.min(Number(limit) || 200, 1000));

    if (error) return res.status(500).json({ error: error.message });
    if (!missing || missing.length === 0) {
      return res.status(200).json({ updated: 0 });
    }

    let updated = 0;
    for (const row of missing) {
      let assigned = false;
      for (let i = 0; i < 3 && !assigned; i++) {
        const candidate = generateServiceNumber();
        const { data: upd, error: upErr } = await supabase
          .from('service_requests')
          .update({ service_number: candidate })
          .eq('id', row.id)
          .is('service_number', null) // avoid overwriting anything set concurrently
          .select('service_number')
          .single();
        if (!upErr && upd?.service_number) {
          updated += 1;
          assigned = true;
        } else if (upErr && !upErr.message?.toLowerCase()?.includes('unique')) {
          // unexpected error, stop early to avoid loops
          break;
        }
      }
    }

    return res.status(200).json({ updated });
  } catch (err) {
    console.error('ensureServiceNumbers error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
