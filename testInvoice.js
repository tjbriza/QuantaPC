import { Invoice as InvoiceClient } from 'xendit-node';
import 'dotenv/config'; // loads .env automatically

async function run() {
  const xenditInvoiceClient = new InvoiceClient({
    secretKey: process.env.XENDIT_API_KEY,
  });

  const data = {
    externalId: 'test1234',
    amount: 5100,
    description: 'Test Purchase',
    currency: 'PHP',
    shouldSendEmail: false,
  };

  try {
    const invoice = await xenditInvoiceClient.createInvoice({ data });
    console.log(invoice);
  } catch (err) {
    console.error(err);
  }
}

run();

// gumagana na yey :)
