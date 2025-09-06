const ReturnAndRefunds = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center'>
        Returns and Refunds
      </h2>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>INTRODUCTION</h3>
        <p className='text-gray-700'>
          At QuantaPC, we want you to be totally satisfied with your purchase.
          If you encounter issues with your order, we are here to help. Please
          read our Return and Refund Policy carefully.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>ELIGIBILITY FOR RETURNS</h3>
        <p className='text-gray-700'>You may request a return or refund if:</p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>Your order has not yet been marked as fulfilled.</li>
          <li>
            You received a wrong, defective, or damaged product upon delivery.
          </li>
          <li>Your order is missing components or incomplete.</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>CONDITIONS FOR RETURNS</h3>
        <p className='text-gray-700'>To qualify for a return:</p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            You must request the return within 7 days of receiving the item.
          </li>
          <li>
            The item must be in its original condition, unused, and with all
            manuals, accessories, and original packaging intact.
          </li>
          <li>The serial number must match the one on the product box.</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          NON-RETURNABLE / NON-REFUNDABLE ITEMS
        </h3>
        <p className='text-gray-700'>
          The following items cannot be returned or refunded:
        </p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>Digital goods, software, and activation codes.</li>
          <li>Clearance items, "as-is," or "open-box" products.</li>
          <li>
            Items damaged due to mishandling, misuse, modification, or improper
            installation after delivery.
          </li>
          <li>
            Orders that have been marked as out for delivery but are
            refused/unpaid (will have to follow the return shipping/shipping
            fee).
          </li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>REFUND PROCESS</h3>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            Approved refunds will be processed within 7-14 business days after
            we receive and inspect the returned item.
          </li>
          <li>
            Refunds will be credited via your original payment method (e.g.,
            GCash, bank transfer, credit card).
          </li>
          <li>
            For COD orders, refunds will be sent via bank transfer or GCash.
          </li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>REPLACEMENTS</h3>
        <p className='text-gray-700'>
          If your item arrived DOA (Dead on Arrival) or defective, we will
          replace it at no cost to you. If a replacement is not available, we
          will issue a full refund.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>HOW TO REQUEST A REFUND</h3>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            Contact us via email at support@quantapc.com.ph with the following
            subject and details:
            <ul className='list-disc list-inside ml-6 mt-2 space-y-2'>
              <li>Subject: Refund Request</li>
              <li>Body: Order Number, Refund Amount, Customer Name</li>
            </ul>
          </li>
          <li>
            Our support team will review your request and provide instructions
            for returning the item.
          </li>
          <li>
            Our QuantaPC Online Sales Representative will call you to confirm
            details of the request to process your additional details needed for
            the request.
          </li>
          <li>
            We understand the importance of this request and we want to assure
            you that we are committed to addressing your request as quickly as
            possible.
          </li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>HOW TO RETURN AN ITEM</h3>
        <p className='text-gray-700'>
          Before you return an item, please coordinate first with us by
          messaging us at support@quantapc.com.ph and wait for our go signal or
          instruction on how to return the item.
        </p>
        <p className='text-gray-700 mt-2'>
          You may return your item here. Or log in to our website and go to My
          Account - Return Order.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>CANCELLATION VS RETURNS</h3>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            Orders in Pending status can be canceled directly in the "My Orders"
            section.
          </li>
          <li>
            Orders that have been fulfilled or shipped may no longer be canceled
            but may still qualify for a return or replacement under this policy.
          </li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>STORE'S RIGHT TO CANCEL</h3>
        <p className='text-gray-700'>
          We reserve the right to cancel orders under the following cases:
        </p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>The item is out of stock or discontinued.</li>
          <li>The order was flagged as fraudulent.</li>
          <li>We are unable to deliver to the provided address.</li>
          <li>Other unforeseen issues that prevent order fulfillment.</li>
        </ul>
      </section>

      <section>
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
      </section>
    </div>
  );
};

export default ReturnAndRefunds;
