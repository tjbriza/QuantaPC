import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers['x-callback-token'];
    if (token !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Invalid webhook token' });
    }

    const event = req.body;
    console.log('Received Xendit webhook:', JSON.stringify(event, null, 2));

    const {
      id,
      status,
      external_id,
      payment_method,
      payment_method_type,
      payment_channel,
      payment_method_id,
      paid_at,
    } = event;

    if (!id || !external_id) {
      console.error('Missing required fields:', { id, external_id });
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    let orderNumber;
    if (external_id.startsWith('order-')) {
      orderNumber = external_id.replace('order-', '');
    } else {
      console.log('Test webhook received, external_id:', external_id);
      return res
        .status(200)
        .json({ success: true, message: 'Test webhook processed' });
    }

    let newStatus = null;
    if (status === 'PAID') newStatus = 'paid';
    if (status === 'EXPIRED') newStatus = 'expired';
    if (status === 'FAILED') newStatus = 'failed';

    if (newStatus) {
      console.log(`Updating order ${orderNumber} to status: ${newStatus}`);

      let derivedPaymentMethod = null;
      if (payment_method) derivedPaymentMethod = payment_method;
      else if (payment_method_type) derivedPaymentMethod = payment_method_type;
      else if (payment_channel) derivedPaymentMethod = payment_channel;
      else if (payment_method_id) derivedPaymentMethod = payment_method_id;

      const updatePayload = { status: newStatus };
      if (derivedPaymentMethod) {
        updatePayload.payment_method =
          String(derivedPaymentMethod).toLowerCase();
      }

      if (newStatus === 'paid') {
        // attempt to avoid overwriting an existing paid_at value
        try {
          const { data: existing, error: existingErr } = await supabase
            .from('orders')
            .select('paid_at')
            .eq('order_number', orderNumber)
            .single();
          if (!existingErr && !existing?.paid_at) {
            updatePayload.paid_at = paid_at || new Date().toISOString();
          }
        } catch (e) {
          console.error('paid_at lookup error (non-fatal):', e);
          if (!updatePayload.paid_at) {
            updatePayload.paid_at = paid_at || new Date().toISOString();
          }
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('order_number', orderNumber)
        .select('id')
        .single();

      if (error) {
        console.error('Database update error:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log('Order updated successfully:', data, updatePayload);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
}
