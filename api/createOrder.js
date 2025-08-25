import { Invoice } from 'xendit-node';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const xenditInvoiceClient = new Invoice({
  secretKey: process.env.XENDIT_API_KEY,
});

const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.FRONTEND_URL || 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const { items, shippingAddress, customerEmail } = req.body;

    // basic validation
    if (!items?.length || !shippingAddress || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // get user id from session
    const userId = req.body.userId;

    // fetch current prices from database
    const productIds = items.map((item) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity')
      .in('id', productIds);

    if (productsError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
      });
    }

    // validate stock and calculate server-side totals
    let subtotal = 0;
    const formattedItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product_id} not found`,
        });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Use server price, not client price
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      formattedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        product_price: product.price, // Server-determined price
        product_name: product.name,
      });
    }

    const shippingFee = 50;
    const total = subtotal + shippingFee;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    // Create order in database
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'createOrderTransaction',
      {
        p_user_id: userId,
        p_order_number: orderNumber,
        p_items: formattedItems,
        p_subtotal: subtotal,
        p_shipping_fee: shippingFee,
        p_total_amount: total,
        p_customer_email: customerEmail,
        p_shipping_address: shippingAddress,
      }
    );

    if (rpcError || !rpcResult?.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create order',
      });
    }

    // Create Xendit invoice
    const invoice = await xenditInvoiceClient.createInvoice({
      data: {
        externalId: `order-${orderNumber}`,
        payerEmail: customerEmail,
        amount: total,
        description: `Order ${orderNumber}`,
        currency: 'PHP',
        shouldSendEmail: true,
        successRedirectUrl: `${process.env.FRONTEND_URL}/orders/${orderNumber}/success`,
        failureRedirectUrl: `${process.env.FRONTEND_URL}/orders/${orderNumber}/failed`,
        invoiceDuration: 86400,
        customer: {
          givenNames: shippingAddress.full_name.split(' ')[0],
          surname:
            shippingAddress.full_name.split(' ').slice(1).join(' ') || '',
          email: customerEmail,
          mobileNumber: shippingAddress.phone_number,
          addresses: [
            {
              street: `${shippingAddress.house_number} ${shippingAddress.street_name}`,
              city: shippingAddress.city,
              province: shippingAddress.province,
              postalCode: shippingAddress.postal_code,
              country: shippingAddress.country,
            },
          ],
        },
      },
    });

    // Update order with invoice details
    await supabase
      .from('orders')
      .update({
        xendit_invoice_id: invoice.id,
        xendit_invoice_url: invoice.invoiceUrl,
        expires_at: invoice.expiryDate,
      })
      .eq('id', rpcResult.id);

    return res.status(200).json({
      success: true,
      orderNumber,
      invoiceUrl: invoice.invoiceUrl,
      orderId: rpcResult.id,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
}
