import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
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

    const {
      id,
      status,
      external_id,
      payment_method,
      payment_method_type,
      payment_channel,
      payment_method_id,
      paid_at,
    } = req.body;

    // Validate required fields
    if (!id || !status || !external_id) {
      console.log('Missing required fields:', { id, status, external_id });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isOrder = external_id.startsWith('order-');
    const isService = external_id.startsWith('svc-');
    if (!isOrder && !isService) {
      return res
        .status(200)
        .json({
          success: true,
          message: 'Ignored webhook (unrecognized external_id)',
        });
    }

    const orderNumber = isOrder ? external_id.replace('order-', '') : null;
    const serviceNumber = isService ? external_id.replace('svc-', '') : null;

    // map status
    let newStatus = null;
    if (status === 'PAID') newStatus = 'paid';
    if (status === 'EXPIRED') newStatus = 'expired';
    if (status === 'FAILED') newStatus = 'failed';

    if (newStatus) {
      if (isOrder) {
        console.log(
          `Processing webhook for order ${orderNumber} with status: ${newStatus}`,
        );

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('id')
          .eq('order_number', orderNumber)
          .single();

        if (orderError || !orderData?.id) {
          console.error('Order lookup error:', orderError);
          return res.status(404).json({ error: 'Order not found' });
        }

        // derive payment method string (fallback order)
        let derivedPaymentMethod = null;
        if (payment_method) derivedPaymentMethod = payment_method;
        else if (payment_method_type)
          derivedPaymentMethod = payment_method_type;
        else if (payment_channel) derivedPaymentMethod = payment_channel;
        else if (payment_method_id) derivedPaymentMethod = payment_method_id; // last resort id

        const updatePayload = { status: newStatus };
        if (derivedPaymentMethod) {
          updatePayload.payment_method =
            String(derivedPaymentMethod).toLowerCase();
        }

        // only set paid_at when transitioning to paid; don't overwrite if already set
        if (newStatus === 'paid') {
          try {
            // fetch existing paid_at to avoid overwriting in case of duplicate webhook delivery
            const { data: existing, error: existingErr } = await supabase
              .from('orders')
              .select('paid_at')
              .eq('id', orderData.id)
              .single();
            if (!existingErr && !existing?.paid_at) {
              updatePayload.paid_at = paid_at || new Date().toISOString();
            }
          } catch (e) {
            console.error('paid_at fetch error (non-fatal):', e);
            // fallback: still set if not provided
            if (!updatePayload.paid_at) {
              updatePayload.paid_at = paid_at || new Date().toISOString();
            }
          }
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update(updatePayload)
          .eq('id', orderData.id);

        if (updateError) {
          console.error('Order status update error:', updateError);
          return res.status(500).json({ error: 'Database update failed' });
        }

        console.log(
          `Order ${orderNumber} status updated to ${newStatus}${updatePayload.payment_method ? ' payment_method=' + updatePayload.payment_method : ''}${updatePayload.paid_at ? ' paid_at=' + updatePayload.paid_at : ''}`,
        );

        // stock restoration for failed/expired orders
        if (newStatus === 'failed' || newStatus === 'expired') {
          try {
            const { error: restoreError } = await supabase.rpc(
              'restoreOrderStock',
              { p_order_id: orderData.id },
            );
            if (restoreError)
              console.error('Stock restoration error:', restoreError);
            else console.log(`Stock restored for order ${orderNumber}`);
          } catch (restoreError) {
            console.error('Stock restoration exception:', restoreError);
          }
        }
      } else if (isService) {
        console.log(
          `Processing webhook for service ${serviceNumber} with status: ${newStatus}`,
        );

        const { data: srData, error: srError } = await supabase
          .from('service_requests')
          .select('id, paid_at')
          .eq('service_number', serviceNumber)
          .single();

        if (srError || !srData?.id) {
          console.error('Service request lookup error:', srError);
          return res.status(404).json({ error: 'Service request not found' });
        }

        // derive payment method string (reuse same logic)
        let derivedPaymentMethod = null;
        if (payment_method) derivedPaymentMethod = payment_method;
        else if (payment_method_type)
          derivedPaymentMethod = payment_method_type;
        else if (payment_channel) derivedPaymentMethod = payment_channel;
        else if (payment_method_id) derivedPaymentMethod = payment_method_id;

        const updatePayload = { status: newStatus };
        if (derivedPaymentMethod) {
          updatePayload.payment_method =
            String(derivedPaymentMethod).toLowerCase();
        }
        if (newStatus === 'paid' && !srData.paid_at) {
          updatePayload.paid_at = paid_at || new Date().toISOString();
        }

        const { error: updateErr } = await supabase
          .from('service_requests')
          .update(updatePayload)
          .eq('id', srData.id);

        if (updateErr) {
          console.error('Service request update error:', updateErr);
          return res.status(500).json({ error: 'Database update failed' });
        }

        console.log(
          `Service ${serviceNumber} status updated to ${newStatus}${updatePayload.payment_method ? ' payment_method=' + updatePayload.payment_method : ''}${updatePayload.paid_at ? ' paid_at=' + updatePayload.paid_at : ''}`,
        );
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
