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

// cors headers
const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
};

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    console.log('=== ORDER CREATE DEBUG ===');
    console.log('userId:', userId);
    console.log('items count:', items?.length);
    console.log('subtotal:', subtotal);
    console.log('shippingFee:', shippingFee);
    console.log('total:', total);
    console.log('items', items);
    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !customerEmail
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const invalidItems = items.filter(
      (item) =>
        !item.product_id ||
        !item.quantity ||
        !item.product_price ||
        typeof item.quantity !== 'number' ||
        typeof item.product_price !== 'number' ||
        item.quantity <= 0 ||
        item.product_price <= 0,
    );
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid item data - missing or invalid product_id, quantity, or product_price',
      });
    }

    const requiredAddressFields = [
      'full_name',
      'phone_number',
      'city',
      'house_number',
      'street_name',
      'barangay',
    ];
    const missingFields = requiredAddressFields.filter(
      (field) => !shippingAddress[field],
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required address fields: ${missingFields.join(', ')}`,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    console.log('Creating order:', orderNumber);

    const formattedItems = items.map((item) => ({
      product_id: item.product_id,
      quantity: parseInt(item.quantity),
      product_price: parseInt(item.product_price),
      product_name: item.product_name || 'Unknown Product',
    }));

    console.log('Calling createOrderTransaction RPC...');
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'createOrderTransaction',
      {
        p_user_id: userId,
        p_order_number: orderNumber,
        p_items: formattedItems,
        p_subtotal: parseInt(subtotal),
        p_shipping_fee: parseInt(shippingFee),
        p_total_amount: parseInt(total),
        p_customer_email: customerEmail,
        p_shipping_address: shippingAddress,
      },
    );

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      return res.status(500).json({
        success: false,
        message: 'Database error while creating order',
        details: rpcError.message,
      });
    }

    console.log('RPC raw result:', rpcResult);

    if (!rpcResult || !rpcResult.success) {
      return res.status(400).json({
        success: false,
        message: rpcResult?.message || 'Order RPC failed',
      });
    }

    const orderId = rpcResult.id;
    console.log('Order created in database:', orderId, rpcResult.order_number);

    const externalId = `order-${orderNumber}`;

    console.log('Creating Xendit invoice...');
    const invoice = await xenditInvoiceClient.createInvoice({
      data: {
        externalId,
        payerEmail: customerEmail,
        amount: total,
        description: `Order ${orderNumber} - ${items.length} items`,
        currency: 'PHP',
        shouldSendEmail: true,
        successRedirectUrl: `${
          process.env.FRONTEND_URL || 'http://localhost:5173'
        }/orders/${orderNumber}/success`,
        failureRedirectUrl: `${
          process.env.FRONTEND_URL || 'http://localhost:5173'
        }/orders/${orderNumber}/failed`,
        invoiceDuration: 86400,
        customer: {
          id: shippingAddress.user_id,
          phoneNumber: shippingAddress.phone_number,
          givenNames: shippingAddress.full_name.split(' ')[0],
          surname:
            shippingAddress.full_name.split(' ').slice(1).join(' ') || '',
          email: customerEmail,
          mobileNumber: shippingAddress.phone_number,
          addresses: [
            {
              street:
                shippingAddress.house_number +
                ' ' +
                shippingAddress.street_name,
              city: shippingAddress.city,
              province: shippingAddress.province,
              postalCode: shippingAddress.postal_code,
              country: shippingAddress.country,
            },
          ],
        },
      },
    });
    console.log('user details:', shippingAddress);
    console.log('Xendit invoice created:', invoice.id);
    console.log('full invoice:', invoice);
    const { data: updated, error: updateError } = await supabase
      .from('orders')
      .update({
        xendit_invoice_id: invoice.id,
        xendit_invoice_url: invoice.invoiceUrl,
        expires_at: invoice.expiryDate,
        payment_method: null,
      })
      .eq('id', orderId)
      .select();

    if (updateError) {
      console.error('Failed to update order with Xendit details:', updateError);
    } else {
      console.log('Updated order with Xendit details:', updated);
    }

    return res.status(200).json({
      success: true,
      orderNumber,
      invoiceUrl: invoice.invoiceUrl,
      orderId,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('=== CREATE ORDER ERROR ===', error);

    let errorMessage = 'Failed to create order';
    let statusCode = 500;

    if (error.message && error.message.includes('xendit')) {
      errorMessage = 'Payment processing error. Please try again.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
      statusCode = 503;
    } else if (error.response && error.response.status === 400) {
      errorMessage = 'Invalid payment information. Please check your details.';
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        debug: error.message,
        stack: error.stack,
      }),
    });
  }
}
