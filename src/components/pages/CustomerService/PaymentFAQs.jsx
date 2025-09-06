const PaymentFAQs = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center'>Payment FAQs</h2>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>Xendit</h3>
        <p className='text-gray-700'>
          Using Xendit as a payment method doesn't require you to sign up for a
          separate account. You'll simply be directed to the checkout page or a
          payment link to complete your transaction.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          WHAT TO EXPECT DURING PAYMENT
        </h3>
        <ul className='list-disc list-inside ml-4 space-y-2 text-gray-700'>
          <li>
            <strong>Information Needed:</strong> You'll only need to provide the
            information required by your chosen payment method. For instance, if
            you use a debit card, you'll need to enter your card details.
          </li>
          <li>
            <strong>Verification:</strong> The verification process depends on
            the payment method you choose. For example, a service like GCash
            might send you a one-time password (OTP) to confirm your payment.
          </li>
          <li>
            <strong>Fees:</strong> There are no extra fees for you to use
            Xendit. Any transaction fees for successful payments are paid by the
            merchant.
          </li>
        </ul>
      </section>

      <section className='mb-6'>
        <h4 className='text-lg font-bold mb-2'>
          Important Note for Card Payments
        </h4>
        <p className='text-gray-700'>
          "If you pay for an order with a credit or debit card, be ready to show
          the card you used and a valid ID when your package is delivered. If
          the card isn't in your name, you must provide an authorization letter
          from the cardholder explaining the purpose of the transaction. If you
          can't do this, your order may be canceled."
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          WHAT PAYMENT METHODS DO YOU ACCEPT?
        </h3>
        <p className='text-gray-700'>
          We accept multiple payment options for your convenience:
        </p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            <strong>GCash / Maya</strong>
          </li>
          <li>
            <strong>Bank Transfer</strong> (BPI, BDO, UnionBank, etc.)
          </li>
          <li>
            <strong>Debit/Credit Card</strong> (Visa, Mastercard)
          </li>
          <li>
            <strong>COD (Cash on Delivery)</strong> – for select locations only
          </li>
        </ul>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>HOW DO I CONFIRM MY PAYMENT?</h3>
        <p className='text-gray-700'>
          For online transfers (GCash/Bank), please send us your proof of
          payment via:
        </p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>Email</li>
          <li>Facebook Messenger</li>
          <li>Upload section in your account (if available)</li>
        </ul>
        <p className='text-gray-700 mt-2'>
          We will verify and confirm your order within 24 hours.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>CAN I PAY IN CASH?</h3>
        <p className='text-gray-700'>
          Yes. You can choose <strong>Cash on Delivery (COD)</strong> if it's
          available in your area.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>IS MY PAYMENT SECURE?</h3>
        <p className='text-gray-700'>
          Absolutely. All online payments are processed through secure,
          encrypted gateways to protect your personal and financial information.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          CAN I CANCEL OR REFUND MY ORDER AFTER PAYMENT
        </h3>
        <p className='text-gray-700'>
          Yes, you may cancel your order before shipping for a full refund. In
          special cases, we may be able to reschedule a delivery if you contact
          us promptly. Once the order is shipped, you may request a refund or
          replacement following our{' '}
          <a
            href='/customer-service/return-and-refunds'
            className='text-indigo-600 hover:text-indigo-800'
          >
            return and refunds
          </a>
          ,{' '}
          <a
            href='/customer-service/cancellation-policy'
            className='text-indigo-600 hover:text-indigo-800'
          >
            cancellation policy
          </a>
          , and warranty policy.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          WHAT IF MY PAYMENT DIDN'T GO THROUGH?
        </h3>
        <p className='text-gray-700'>
          If your payment fails, try again or use a different method. If you
          were charged but didn't receive an order confirmation, contact our
          support team with your payment proof so we can verify it manually.
        </p>
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

export default PaymentFAQs;
