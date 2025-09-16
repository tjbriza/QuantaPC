import { Invoice } from 'xendit-node';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const xenditInvoiceClient = new Invoice({
  secretKey: process.env.XENDIT_API_KEY,
});

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
    // Optional simple admin guard (can be replaced with Supabase RLS/auth as needed)
    if (process.env.ADMIN_API_TOKEN) {
      const token = req.headers['x-admin-token'];
      if (token !== process.env.ADMIN_API_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const {
      serviceRequestId,
      serviceNumber: inputServiceNumber,
      amount, // required, in PHP
      payerEmail,
      description,
    } = req.body || {};

    if (!serviceRequestId && !inputServiceNumber) {
      return res
        .status(400)
        .json({ error: 'serviceRequestId or serviceNumber is required' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Load the service request
    const { data: sr, error: srErr } = await supabase
      .from('service_requests')
      .select(
        'id, service_number, contact_email, contact_name, quote_amount, status',
      )
      .match(
        inputServiceNumber
          ? { service_number: inputServiceNumber }
          : { id: serviceRequestId },
      )
      .single();

    if (srErr || !sr) {
      return res
        .status(404)
        .json({ error: 'Service request not found', debug: srErr });
    }

    // Ensure service_number exists
    let serviceNumber = sr.service_number;
    if (!serviceNumber) {
      // retry a couple of times to avoid rare unique collisions
      for (let i = 0; i < 3 && !serviceNumber; i++) {
        const candidate = generateServiceNumber();
        const { data: upd, error: upErr } = await supabase
          .from('service_requests')
          .update({ service_number: candidate })
          .eq('id', sr.id)
          .select('service_number')
          .single();
        if (!upErr && upd?.service_number) {
          serviceNumber = upd.service_number;
        }
      }
      if (!serviceNumber) {
        return res
          .status(500)
          .json({ error: 'Failed to assign service number' });
      }
    }

    const email = payerEmail || sr.contact_email;
    if (!email) {
      return res
        .status(400)
        .json({ error: 'payerEmail is required (no contact_email on record)' });
    }

    const desc = description || `Service request ${serviceNumber}`;
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/services/${serviceNumber}/success`;
    const failureUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/services/${serviceNumber}/failed`;

    // Create Xendit invoice
    const invoicePayload = {
      externalId: `svc-${serviceNumber}`,
      payerEmail: email,
      amount,
      description: desc,
      currency: 'PHP',
      shouldSendEmail: true,
      successRedirectUrl: successUrl,
      failureRedirectUrl: failureUrl,
      invoiceDuration: 86400, // 24h
      customer: {
        givenNames: sr.contact_name?.split(' ')[0] || '',
        surname: sr.contact_name?.split(' ').slice(1).join(' ') || '-',
        email,
      },
    };

    const invoice = await xenditInvoiceClient.createInvoice({
      data: invoicePayload,
    });

    // Update service request with quote+invoice details
    const { error: updateErr } = await supabase
      .from('service_requests')
      .update({
        quote_amount: amount,
        status: 'quoted',
        xendit_invoice_id: invoice.id,
        xendit_invoice_url: invoice.invoiceUrl,
        expires_at: invoice.expiryDate,
      })
      .eq('id', sr.id);

    if (updateErr) {
      return res
        .status(500)
        .json({
          error: 'Failed to update service request with invoice',
          debug: updateErr,
        });
    }

    return res.status(200).json({
      success: true,
      serviceRequestId: sr.id,
      serviceNumber,
      invoiceUrl: invoice.invoiceUrl,
      xenditInvoiceId: invoice.id,
    });
  } catch (error) {
    console.error('Service invoice creation error:', error);
    return res.status(500).json({ error: 'Failed to create service invoice' });
  }
}
