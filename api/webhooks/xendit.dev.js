import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

    const { id, status, external_id } = event;

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

      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('order_number', orderNumber)
        .select('id')
        .single();

      if (error) {
        console.error('Database update error:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log('Order updated successfully:', data);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
}
