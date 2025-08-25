import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // token verification
    const token = req.headers['x-callback-token'];
    if (token !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Invalid webhook token' });
    }

    const { id, status, external_id } = req.body;

    if (!external_id?.startsWith('order-')) {
      return res.status(200).json({ success: true, message: 'Test webhook' });
    }

    const orderNumber = external_id.replace('order-', '');

    // map status
    let newStatus = null;
    if (status === 'PAID') newStatus = 'paid';
    if (status === 'EXPIRED') newStatus = 'expired';
    if (status === 'FAILED') newStatus = 'failed';

    if (newStatus) {
      // update order status
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('order_number', orderNumber);

      if (error) {
        return res.status(500).json({ error: 'Database update failed' });
      }

      // stock restoration for failed/expired orders
      if (newStatus === 'failed' || newStatus === 'expired') {
        await supabase.rpc('restoreOrderStock', {
          p_order_id: (
            await supabase
              .from('orders')
              .select('id')
              .eq('order_number', orderNumber)
              .single()
          ).data.id,
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
