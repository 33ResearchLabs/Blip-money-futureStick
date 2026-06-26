import { useEffect, useState } from "react";
import SEO from "./SEO";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "what-are-cookies", title: "What Are Cookies?" },
  { id: "types", title: "Types of Cookies We Use" },
  { id: "similar-tech", title: "Similar Technologies" },
  { id: "how-we-use", title: "How We Use Cookies" },
  { id: "third-party-analytics", title: "Third-Party Analytics" },
  { id: "managing", title: "Managing Cookies" },
  { id: "dnt", title: "Do Not Track Signals" },
  { id: "retention", title: "Data Retention" },
  { id: "changes", title: "Changes to This Cookie Policy" },
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
      const offset = 30;
      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="Blip Money – Cookie Policy "
        description="Learn how Blip Money uses cookies and similar technologies to improve user experience, enhance security, and analyze website performance."
        canonical="https://www.blip.money/cookies"
      />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Cookie Policy
            </h1>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="">
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
                            : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2"
                        }`}
                      >
                        {section.id === "introduction"
                          ? section.title
                          : `${index}. ${section.title}`}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Introduction */}
                <section id="introduction" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Introduction</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This Cookie Policy explains how Blip.money ("blip.money",
                    "we", "our", or "us") uses cookies and similar technologies
                    when you access or use our website, applications, interfaces,
                    and related services (collectively, the "Services").
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    By continuing to use the Services, you consent to the use of
                    cookies and similar technologies in accordance with this
                    Cookie Policy.
                  </p>
                </section>

                {/* Section 1 */}
                <section id="what-are-cookies" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. What Are Cookies?
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Cookies are small text files stored on your device when you
                    visit a website.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Cookies help websites:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Remember user preferences.</li>
                    <li>Maintain sessions.</li>
                    <li>Improve functionality.</li>
                    <li>Analyze traffic.</li>
                    <li>Enhance user experience.</li>
                    <li>Detect errors and abuse.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Cookies do not typically contain sensitive information and
                    cannot access information stored elsewhere on your device.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="types" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Types of Cookies We Use
                  </h2>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Essential Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These cookies are necessary for the operation of the
                    Services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Examples include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Authentication sessions.</li>
                    <li>Wallet connection preferences.</li>
                    <li>Security protections.</li>
                    <li>Fraud prevention mechanisms.</li>
                    <li>User settings.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Disabling these cookies may prevent parts of the Services
                    from functioning properly.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Performance and Analytics Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These cookies help us understand how users interact with the
                    Services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Information collected may include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Pages visited.</li>
                    <li>Device information.</li>
                    <li>Browser information.</li>
                    <li>Session duration.</li>
                    <li>Traffic sources.</li>
                    <li>Error logs.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This information helps us improve platform performance and
                    user experience.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Functional Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Functional cookies enable:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Language preferences.</li>
                    <li>Theme settings.</li>
                    <li>Region settings.</li>
                    <li>Interface customizations.</li>
                    <li>Previously selected options.</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Security Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Security cookies help:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Detect suspicious activity.</li>
                    <li>Prevent abuse.</li>
                    <li>Protect against unauthorized access.</li>
                    <li>Improve system integrity.</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Third-Party Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Certain third-party service providers may place cookies
                    through the Services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These providers may include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Analytics providers.</li>
                    <li>Hosting providers.</li>
                    <li>Infrastructure providers.</li>
                    <li>Content delivery networks.</li>
                    <li>Customer support tools.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not control third-party cookies and users
                    should review the privacy policies of those providers
                    separately.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="similar-tech" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Similar Technologies
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    In addition to cookies, blip.money may use:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Local storage.</li>
                    <li>Session storage.</li>
                    <li>Pixels.</li>
                    <li>Web beacons.</li>
                    <li>Device identifiers.</li>
                    <li>Log files.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These technologies serve similar purposes to cookies and help
                    provide, secure, and improve the Services.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="how-we-use" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. How We Use Cookies
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Cookies may be used to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Operate the Services.</li>
                    <li>Maintain security.</li>
                    <li>Improve website performance.</li>
                    <li>Analyze traffic patterns.</li>
                    <li>Remember user preferences.</li>
                    <li>Diagnose technical issues.</li>
                    <li>Prevent fraud and abuse.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Cookies are not used to access private wallet information or
                    private keys.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="third-party-analytics" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Third-Party Analytics
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may utilize third-party analytics and
                    infrastructure providers.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Such providers may collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>IP addresses.</li>
                    <li>Device information.</li>
                    <li>Browser type.</li>
                    <li>Session information.</li>
                    <li>Usage patterns.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This information is used solely for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Performance analysis.</li>
                    <li>Error monitoring.</li>
                    <li>Service improvements.</li>
                    <li>Security purposes.</li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="managing" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Managing Cookies
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Most browsers allow users to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>View cookies.</li>
                    <li>Delete cookies.</li>
                    <li>Block cookies.</li>
                    <li>Configure cookie preferences.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users can manage cookies through browser settings.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blocking certain cookies may affect the availability and
                    functionality of the Services.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="dnt" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Do Not Track Signals
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Some browsers transmit "Do Not Track" signals.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Because there is currently no universally accepted standard
                    regarding such signals, blip.money may not respond to Do Not
                    Track requests.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="retention" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Data Retention
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Cookies may remain on your device:
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Session Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Deleted automatically when your browser closes.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Persistent Cookies
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Remain until:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Expiration periods end.</li>
                    <li>They are manually deleted.</li>
                    <li>Browser settings remove them.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Retention periods may vary depending on their purpose.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Changes to This Cookie Policy
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may update this Cookie Policy from time to time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Changes become effective immediately upon publication.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services after changes are posted
                    constitutes acceptance of the revised Cookie Policy.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding this Cookie Policy may be directed to:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=privacy@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      privacy@blip.money
                    </a>
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      support@blip.money
                    </a>
                  </p>
                </section>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  By accessing or using the Services, you acknowledge that you
                  have read and understood this Cookie Policy and consent to the
                  use of cookies and similar technologies as described herein.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cookies;
