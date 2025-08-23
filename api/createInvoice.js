//uses xendit-node api integration to handle payments (gumana na yey)
import { Invoice } from 'xendit-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const xenditInvoiceClient = new Invoice({
      secretKey: process.env.XENDIT_API_KEY,
    });

    const invoice = await xenditInvoiceClient.createInvoice({
      data: {
        externalId: 'test-' + Date.now(),
        amount,
        description,
        currency: 'PHP',
        shouldSendEmail: false,
      },
    });

    return res.status(200).json(invoice);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
}
