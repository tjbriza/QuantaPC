//uses xendit-node api integration to handle payments (gumana na yey)
import { Invoice } from 'xendit-node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const xenditInvoiceClient = new Invoice({
  secretKey: process.env.XENDIT_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
      customerEmail,
    } = req.body;

    if (!userId || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    // Create Xendit invoice first
    const externalId = `order-${orderNumber}`;
    const invoice = await xenditInvoiceClient.createInvoice({
      data: {
        externalId,
        amount: total,
        description: `Order ${orderNumber} - ${items.length} items`,
        currency: 'PHP',
        shouldSendEmail: false,
        successRedirectUrl: `${process.env.FRONTEND_URL}/orders/${orderNumber}/success`,
        failureRedirectUrl: `${process.env.FRONTEND_URL}/orders/${orderNumber}/failed`,
        invoiceDuration: 86400, // 24 hours
        customer: {
          email: customerEmail,
        },
      },
    });

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          order_number: orderNumber,
          xendit_invoice_id: invoice.id,
          xendit_invoice_url: invoice.invoice_url,
          subtotal,
          shipping_fee: shippingFee,
          total_amount: total,
          customer_email: customerEmail,
          status: 'pending',
          expires_at: invoice.expiry_date,
          // Denormalized shipping info
          shipping_full_name: shippingAddress.full_name,
          shipping_phone: shippingAddress.phone_number,
          shipping_address_line: `${shippingAddress.house_number} ${shippingAddress.street_name}, ${shippingAddress.barangay}`,
          shipping_city: shippingAddress.city,
          shipping_province: shippingAddress.province,
          shipping_postal_code: shippingAddress.postal_code,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Create order items
    const orderItemsData = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_snapshot: item.product_price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Try to clean up the order if items insertion fails
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error('Failed to create order items');
    }

    // Clear user's cart after successful order creation
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .in(
        'product_id',
        items.map((item) => item.product_id)
      )
      .eq(
        'cart_id',
        (
          await supabase
            .from('carts')
            .select('id')
            .eq('user_id', userId)
            .single()
        ).data?.id
      );

    if (cartError) {
      console.error('Cart clearing error:', cartError);
      // Don't fail the order for this, just log it
    }

    return res.status(200).json({
      success: true,
      orderNumber,
      invoiceUrl: invoice.invoice_url,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
}
