import { useEffect, useState } from "react";
import SEO from "./SEO";

const sections = [
  { id: "philosophy", title: "Our Philosophy" },
  { id: "what-we-use", title: "What Cookies We Use" },
  { id: "third-party", title: "Third-Party Cookies" },
  { id: "control", title: "How to Control Cookies" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

const Cookies = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="Blip Money – Cookie Policy "
        description="Learn how Blip Money uses cookies and similar technologies to improve user experience, enhance security, and analyze website performance."
        canonical="https://blip.money/cookies"
      />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0b] text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Cookie Policy
            </h1>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="bg-gray-50 dark:bg-[#111111]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex gap-16">
              {/* Left Sidebar */}
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="text-xs font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                    Contents
                  </p>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block text-sm transition-all text-left w-full rounded-md ${
                          activeSection === section.id
                            ? "text-black dark:text-white font-bold bg-black/10 dark:bg-white/10 px-3 py-2"
                            : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2"
                        }`}
                      >
                        {index + 1}. {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Intro */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  This Cookie Policy explains how Blip.money (we, us, our) uses
                  cookies and similar technologies on our website. This policy
                  is designed to be transparent about our practices, in line
                  with our core principle of user privacy and data minimization.
                </p>

                {/* Section 1 */}
                <section id="philosophy" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Our Philosophy on Cookies
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Our goal is to build a privacy-preserving financial
                    protocol. As such, we are committed to using as few cookies
                    as possible. The Blip.money protocol itself is a
                    decentralized application and does not use cookies. This
                    policy applies only to the Blip.money informational website.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="what-we-use" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. What Cookies We Use and Why
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    We use only strictly necessary cookies to provide basic
                    website functionality. We do not use cookies for:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>
                      <span className="text-black dark:text-white">
                        Analytics or Tracking:
                      </span>{" "}
                      We do not track your browsing behavior across our site or
                      the web.
                    </li>
                    <li>
                      <span className="text-black dark:text-white">
                        Advertising:
                      </span>{" "}
                      We do not use cookies to serve targeted advertisements.
                    </li>
                    <li>
                      <span className="text-black dark:text-white">
                        Personalization:
                      </span>{" "}
                      We do not use cookies to store personal preferences or
                      identify you on return visits.
                    </li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    The types of cookies we may use are:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>
                      <span className="text-black dark:text-white">
                        Session Cookies:
                      </span>{" "}
                      These are temporary cookies that are essential for the
                      technical operation of the website, such as managing
                      traffic and ensuring site security. They are deleted once
                      you close your browser.
                    </li>
                    <li>
                      <span className="text-black dark:text-white">
                        Functionality Cookies:
                      </span>{" "}
                      We may use cookies to remember settings that improve your
                      experience, such as language preference, but these do not
                      contain personal information.
                    </li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="third-party" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Third-Party Cookies
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    We do not use any third-party services on our website that
                    would place tracking or advertising cookies on your browser.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="control" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. How to Control Cookies
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    You can control and/or delete cookies as you wish. Most web
                    browsers allow you to manage your cookie preferences through
                    their settings. You can typically:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>View the cookies stored on your device.</li>
                    <li>Delete some or all cookies.</li>
                    <li>Block third-party cookies.</li>
                    <li>Block all cookies.</li>
                    <li>Receive a notification when a cookie is issued.</li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Please note that if you choose to block all cookies, our
                    website may not function as intended, as you would be
                    disabling strictly necessary cookies required for its
                    operation.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Changes to This Policy
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    We may update this Cookie Policy from time to time. Any
                    changes will be posted on this page with an updated "Last
                    Updated" date.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="contact">
                  <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    If you have any questions about our use of cookies, please
                    contact us through our official channels.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cookies;
