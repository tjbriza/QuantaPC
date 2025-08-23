import React, { useState } from 'react';

export default function TestInvoice() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const createTestInvoice = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/createInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 25000,
          description: 'Test Invoice from React Component',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const invoice = await response.json();
      setResult(invoice);

      // If there's an invoice URL, you can open it
      if (invoice.invoice_url) {
        console.log('Payment URL:', invoice.invoice_url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-4'>Test Xendit Invoice API</h2>

      <button
        onClick={createTestInvoice}
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-medium text-white ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Creating Invoice...' : 'Create Test Invoice'}
      </button>

      {error && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          <h3 className='font-bold'>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className='mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
          <h3 className='font-bold'>Success! Invoice Created:</h3>
          <div className='mt-2 space-y-2'>
            <p>
              <strong>Invoice ID:</strong> {result.id}
            </p>
            <p>
              <strong>External ID:</strong> {result.external_id}
            </p>
            <p>
              <strong>Amount:</strong> {result.amount} {result.currency}
            </p>
            <p>
              <strong>Status:</strong> {result.status}
            </p>
            {result.invoice_url && (
              <div>
                <p>
                  <strong>Payment URL:</strong>
                </p>
                <a
                  href={result.invoice_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline break-all'
                >
                  {result.invoice_url}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {result && (
        <details className='mt-4'>
          <summary className='cursor-pointer font-medium'>
            View Full Response
          </summary>
          <pre className='mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm'>
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
