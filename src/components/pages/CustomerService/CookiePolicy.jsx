const CookiePolicy = () => {
  return (
    <>
      <h2 className='text-2xl font-bold mb-6 text-center'>Cookie Policy</h2>

      <section id='introduction' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>INTRODUCTION</h3>
        <p className='text-gray-700'>
          This Cookie Policy explains how QuantaPC ("we," "our," "us") uses
          cookies and similar technologies when you visit our website. By
          continuing to use our site, you agree to the use of cookies as
          described below.
        </p>
      </section>

      <section id='what-are-cookies' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>WHAT ARE COOKIES?</h3>
        <p className='text-gray-700'>
          Cookies are small text files stored on your computer or mobile device
          when you visit a website. They help us recognize your browser,
          remember your preferences, and improve your overall shopping
          experience.
        </p>
      </section>

      <section id='how-we-use-cookies' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>HOW WE USE COOKIES</h3>
        <p className='text-gray-700'>We use cookies to:</p>
        <ul className='list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700'>
          <li>
            <strong>Enable Essential Functions:</strong> To keep items in your
            cart, maintain login sessions, and process orders securely.
          </li>
          <li>
            <strong>Improve Website Performance:</strong> To understand how our
            site is used and optimize loading speed.
          </li>
          <li>
            <strong>Personalize Your Experience:</strong> To remember your
            preferences and suggest products relevant to you.
          </li>
          <li>
            <strong>Analytics & Marketing:</strong> To measure traffic, analyze
            trends, and deliver relevant ads through trusted partners (e.g.,
            Google Analytics, Meta Pixel).
          </li>
        </ul>
      </section>

      <section id='type-of-cookies-we-use' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>TYPE OF COOKIES WE USE</h3>
        <p className='text-gray-700'>
          <strong>Strictly Necessary Cookies:</strong> Required for the website
          to function properly.
        </p>
        <p className='text-gray-700 mt-2'>
          <strong>Performance Cookies:</strong> Help us analyze site performance
          and user behavior.
        </p>
        <p className='text-gray-700 mt-2'>
          <strong>Functional Cookies:</strong> Remember your preferences (like
          region, currency, and language).
        </p>
      </section>

      <section id='third-party-cookies' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>THIRD-PARTY COOKIES</h3>
        <p className='text-gray-700'>
          We may allow trusted third-party services (e.g., Google, Facebook) to
          place cookies to help us with analytics and marketing. These third
          parties may collect information about your browsing habits across
          websites.
        </p>
      </section>

      <section id='managing-cookies' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>MANAGING COOKIES</h3>
        <p className='text-gray-700'>
          You can manage or disable cookies anytime by adjusting your browser
          settings. Please note that some features of our website may not work
          properly if you disable cookies.
        </p>
      </section>

      <section id='update-to-this-policy' className='mb-6'>
        <h3 className='text-xl font-bold mb-2'>UPDATE TO THIS POLICY</h3>
        <p className='text-gray-700'>
          We may update this Cookie Policy from time to time. Changes will be
          posted on this page with the updated date.
        </p>
      </section>

      <section id='contact'>
        <h3 className='text-xl font-bold mb-2'>CONTACT</h3>
        <p className='text-gray-700'>
          Should you have any questions about our privacy practices or this
          Privacy Policy, or if you would like to exercise any of the rights
          available to you, please{' '}
          <a href='/contact' className='text-indigo-600 hover:text-indigo-800'>
            contact us
          </a>
          .
        </p>
      </section>
    </>
  );
};

export default CookiePolicy;
