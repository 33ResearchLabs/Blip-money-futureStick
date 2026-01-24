import React, { useEffect } from "react";
import SEO from "./SEO";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Cookie Policy | Blip Money"
        description="Understand how Blip Money uses cookies to improve user experience and website functionality."
        canonical="https://blip.money/cookies"
      />

      <div className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            Cookie Policy for Blip.money
          </h1>

          {/* Intro */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            This Cookie Policy explains how Blip.money (we, us, our) uses
            cookies and similar technologies on our website. This policy is
            designed to be transparent about our practices, in line with our
            core principle of user privacy and data minimization.
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              1. Our Philosophy on Cookies
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Our goal is to build a privacy-preserving financial protocol. As
              such, we are committed to using as few cookies as possible. The
              Blip.money protocol itself is a decentralized application and does
              not use cookies. This policy applies only to the Blip.money
              informational website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              2. What Cookies We Use and Why
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              We use only strictly necessary cookies to provide basic website
              functionality. We do not use cookies for:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>
                <span className="text-white">Analytics or Tracking:</span> We do
                not track your browsing behavior across our site or the web.
              </li>
              <li>
                <span className="text-white">Advertising:</span> We do not use
                cookies to serve targeted advertisements.
              </li>
              <li>
                <span className="text-white">Personalization:</span> We do not
                use cookies to store personal preferences or identify you on
                return visits.
              </li>
            </ul>

            <p className="text-gray-400 mb-4  leading-relaxed">
              The types of cookies we may use are:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <span className="text-white">Session Cookies:</span> These are
                temporary cookies that are essential for the technical operation
                of the website, such as managing traffic and ensuring site
                security. They are deleted once you close your browser.
              </li>
              <li>
                <span className="text-white">Functionality Cookies:</span> We
                may use cookies to remember settings that improve your
                experience, such as language preference, but these do not
                contain personal information.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              3. Third-Party Cookies
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We do not use any third-party services on our website that would
              place tracking or advertising cookies on your browser.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              4. How to Control Cookies
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              You can control and/or delete cookies as you wish. Most web
              browsers allow you to manage your cookie preferences through their
              settings. You can typically:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>View the cookies stored on your device.</li>
              <li>Delete some or all cookies.</li>
              <li>Block third-party cookies.</li>
              <li>Block all cookies.</li>
              <li>Receive a notification when a cookie is issued.</li>
            </ul>

            <p className="text-gray-400 leading-relaxed">
              Please note that if you choose to block all cookies, our website
              may not function as intended, as you would be disabling strictly
              necessary cookies required for its operation.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              5. Changes to This Policy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes
              will be posted on this page with an updated "Last Updated" date.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any questions about our use of cookies, please contact
              us through our official channels.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Cookies;
