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

    // Validate required fields
    if (!id || !status || !external_id) {
      console.log('Missing required fields:', { id, status, external_id });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!external_id.startsWith('order-')) {
      return res.status(200).json({ success: true, message: 'Test webhook' });
    }

    const orderNumber = external_id.replace('order-', '');

    // map status
    let newStatus = null;
    if (status === 'PAID') newStatus = 'paid';
    if (status === 'EXPIRED') newStatus = 'expired';
    if (status === 'FAILED') newStatus = 'failed';

    if (newStatus) {
      console.log(
        `Processing webhook for order ${orderNumber} with status: ${newStatus}`
      );

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderNumber)
        .single();

      if (orderError) {
        console.error('Order lookup error:', orderError);
        return res.status(404).json({ error: 'Order not found' });
      }

      if (!orderData?.id) {
        console.error('No order ID found for order number:', orderNumber);
        return res.status(404).json({ error: 'Order not found' });
      }

      // update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderData.id);

      if (updateError) {
        console.error('Order status update error:', updateError);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`Order ${orderNumber} status updated to ${newStatus}`);

      // stock restoration for failed/expired orders
      if (newStatus === 'failed' || newStatus === 'expired') {
        try {
          const { error: restoreError } = await supabase.rpc(
            'restoreOrderStock',
            {
              p_order_id: orderData.id,
            }
          );

          if (restoreError) {
            console.error('Stock restoration error:', restoreError);
          } else {
            console.log(`Stock restored for order ${orderNumber}`);
          }
        } catch (restoreError) {
          console.error('Stock restoration exception:', restoreError);
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
