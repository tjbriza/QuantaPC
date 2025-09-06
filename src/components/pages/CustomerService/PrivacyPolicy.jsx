const PrivacyPolicy = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-center'>Privacy Policy</h2>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          PERSONAL INFORMATION WE COLLECT
        </h3>
        <p className='text-gray-700'>
          When you use our site, we automatically gather certain data about your
          device. This includes things like your IP address, web browser, time
          zone, and any cookies on your device. As you browse, we also track
          which pages you visit, the websites or searches that led you to our
          site, and how you interact with it. We call this Device Information.
        </p>
        <p className='text-gray-700 mt-2'>
          We use several tools to collect this data:
        </p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            <strong>Cookies:</strong> These are small data files placed on your
            computer that help us identify you.
          </li>
          <li>
            <strong>Log files:</strong> These track activity on our site, like
            your IP address, browser type, and when you visit.
          </li>
          <li>
            <strong>Web beacons, tags, and pixels:</strong> These are electronic
            files that record how you browse our site.
          </li>
        </ul>
        <p className='text-gray-700 mt-2'>
          When you make or try to make a purchase, we also collect your Order
          Information. This includes your name, address, email, phone number,
          and payment details (such as credit card numbers or other payment
          methods). Together, your Device Information and Order Information make
          up what we call your Personal Information in this policy.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          HOW DO WE USE YOUR PERSONAL INFORMATION?
        </h3>
        <p className='text-gray-700'>
          We use the Order Information you provide to process your purchases,
          which includes handling payments, shipping your items, and sending you
          confirmations. We also use this information to:
        </p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>Contact you.</li>
          <li>Check for potential fraud or risk in your orders.</li>
          <li>
            Send you information or ads about our products and services, but
            only if you've given us permission to do so.
          </li>
        </ul>
        <p className='text-gray-700 mt-2'>
          We use Device Information to help us detect fraud (specifically, your
          IP address) and to improve our website. This includes analyzing how
          people browse and interact with our site and measuring the success of
          our advertising efforts.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          SHARING YOUR PERSONAL INFORMATION
        </h3>
        <p className='text-gray-700'>
          We share your Personal Information with other companies that help us
          use your data.
        </p>
        <p className='text-gray-700 mt-2'>
          For instance, we use Google Analytics to understand how customers use
          our site. You can read more about how Google handles your information
          by following the link provided:{' '}
          <a
            href='https://www.google.com/intl/en/policies/privacy/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-indigo-600 hover:text-indigo-800'
          >
            https://www.google.com/intl/en/policies/privacy/
          </a>
          . If you prefer, you can also opt-out of Google Analytics.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          INFORMATION WE OBTAIN FROM THIRD PARTIES
        </h3>
        <p className='text-gray-700'>
          We may also receive information about you from other companies,
          including vendors and service providers who collect data for us.
        </p>
        <p className='text-gray-700 mt-2'>
          For example, our payment processors collect your payment details (like
          bank account or credit card numbers and billing address) to process
          your orders.
        </p>
        <p className='text-gray-700 mt-2'>
          Additionally, when you visit our site, see our emails, or interact
          with our services and ads, we—or our third-party partners—may
          automatically collect certain information using tracking technologies
          like pixels, web beacons, and cookies.
        </p>
        <p className='text-gray-700 mt-2'>
          Any information we get from third parties is handled according to our
          Privacy Policy. However, we are not responsible for the accuracy of
          the information or for the policies of those third-party companies.
          For more details, please see the section on "Third-Party Websites and
          Links."
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>
          THIRD-PARTY WEBSITES AND LINKS
        </h3>
        <p className='text-gray-700'>
          Our site may contain links to other websites. If you click on these
          third-party links, be aware that we are not responsible for the
          privacy or security of those sites. We recommend you read their
          policies and terms before sharing any information.
        </p>
        <p className='text-gray-700 mt-2'>
          Information you share on public platforms, like social media, may be
          seen by others. We are not responsible for what happens to the
          information you share on those sites. Our inclusion of a link does not
          mean we endorse the content or the people who run those sites.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>CHILDREN’S DATA</h3>
        <p className='text-gray-700'>
          Our services are not intended for children. We do not knowingly
          collect personal information from anyone under the age of 18. If you
          are a parent or guardian and find that your child has provided us with
          their personal information, you can ask us to remove it. If we learn
          that we have collected personal information from a child without
          consent, we will remove it. As of the effective date of this Privacy
          Policy, we are not aware of any instances where we have "shared" or
          "sold" the personal information of individuals under 16, as those
          terms are defined by applicable law.
        </p>
      </section>

      <section className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>COMPLAINTS</h3>
        <p className='text-gray-700'>
          If you have any complaints about how we handle your personal
          information, please get in touch with us using the contact details
          provided. If you are not happy with our response, you may have the
          right to appeal our decision or file a complaint with your local data
          protection authority, depending on where you live.
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

export default PrivacyPolicy;
