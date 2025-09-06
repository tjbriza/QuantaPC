const CancellationPolicy = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center'>
        Cancellation Policy
      </h2>
      <ol className='list-decimal list-inside space-y-4 text-gray-700'>
        <li>
          Customers can cancel an order as long as it's still in pending status.
          The cancellation option will be available in the "My Orders" section.
        </li>
        <li>
          Once an order has been marked as fulfilled, you can no longer cancel
          it through the "My Orders" section. If this happens, you will need to
          contact us by chatting on our website or emailing
          support@quantapc.com.ph. Please note that once an item is out for
          delivery, it cannot be canceled.
        </li>
        <li>
          Cancellation may no longer be requested once the item is out for
          delivery. In special situations, we may be able to reschedule a
          delivery. If you need to do this, please contact us directly.
        </li>
        <li>
          We may also cancel orders for the following reasons:
          <ul className='list-disc list-inside ml-6 mt-2 space-y-2'>
            <li>The item you ordered is out of stock.</li>
            <li>We were unable to deliver your order successfully.</li>
            <li>The order is identified as fraudulent.</li>
            <li>
              Other issues that prevent us from fulfilling the order, such as
              out-of-stock items or pre-order items that are no longer
              available.
            </li>
          </ul>
        </li>
      </ol>
      <div className='mt-8'>
        <h3 className='text-xl font-bold mb-2'>CONTACT</h3>
        <p className='text-gray-700'>
          Should you have any questions about our privacy practices or this
          Privacy Policy, or if you would like to exercise any of the rights
          available to you, please{' '}
          <a
            href='/customer-service/contact-us'
            className='text-indigo-600 hover:text-indigo-800'
          >
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default CancellationPolicy;
