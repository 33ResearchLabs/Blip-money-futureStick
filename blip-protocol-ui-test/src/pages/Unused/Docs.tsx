import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, ChevronRight, Copy, Check, Menu, X } from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";

/* ============================================
   API DOCUMENTATION DATA
   ============================================ */

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  request?: string;
  response: string;
}

interface WebhookEvent {
  event: string;
  description: string;
  payload: string;
}

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/trades",
    description: "Initiate a new trade between two parties. Creates an escrow contract and returns the trade object with a unique identifier.",
    request: `{
  "sender_currency": "USDC",
  "receiver_currency": "AED",
  "amount": 1000,
  "receiver_address": "0x1a2b3c...",
  "callback_url": "https://your-app.com/webhook"
}`,
    response: `{
  "id": "trd_8xKp2mNqR4",
  "status": "pending",
  "sender_currency": "USDC",
  "receiver_currency": "AED",
  "amount": 1000,
  "rate": 3.6725,
  "escrow_address": "0x9f8e7d...",
  "expires_at": "2025-06-15T12:00:00Z",
  "created_at": "2025-06-15T11:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/trades/:id",
    description: "Retrieve the current status and details of a specific trade by its unique identifier.",
    response: `{
  "id": "trd_8xKp2mNqR4",
  "status": "completed",
  "sender_currency": "USDC",
  "receiver_currency": "AED",
  "amount": 1000,
  "rate": 3.6725,
  "escrow_address": "0x9f8e7d...",
  "settled_at": "2025-06-15T11:45:00Z",
  "created_at": "2025-06-15T11:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/trades",
    description: "List all trades associated with your account. Supports pagination and filtering by status.",
    response: `{
  "data": [
    {
      "id": "trd_8xKp2mNqR4",
      "status": "completed",
      "amount": 1000,
      "created_at": "2025-06-15T11:00:00Z"
    },
    {
      "id": "trd_3yLm7pQsT1",
      "status": "pending",
      "amount": 500,
      "created_at": "2025-06-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 47
  }
}`,
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    description: "Register a new webhook endpoint to receive real-time notifications about trade and escrow events.",
    request: `{
  "url": "https://your-app.com/blip-webhook",
  "events": [
    "trade.created",
    "trade.completed",
    "escrow.locked",
    "escrow.released"
  ],
  "secret": "whsec_your_signing_secret"
}`,
    response: `{
  "id": "whk_4nRt9vXwP2",
  "url": "https://your-app.com/blip-webhook",
  "events": [
    "trade.created",
    "trade.completed",
    "escrow.locked",
    "escrow.released"
  ],
  "active": true,
  "created_at": "2025-06-15T11:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/rates",
    description: "Get the current exchange rates for all supported currency pairs. Rates are updated every 30 seconds.",
    response: `{
  "rates": {
    "USDC_AED": 3.6725,
    "USDC_SAR": 3.7510,
    "USDT_AED": 3.6720,
    "USDT_SAR": 3.7505
  },
  "updated_at": "2025-06-15T11:59:30Z"
}`,
  },
];

const webhookEvents: WebhookEvent[] = [
  {
    event: "trade.created",
    description: "Fired when a new trade is initiated and the escrow contract is created.",
    payload: `{
  "event": "trade.created",
  "data": {
    "id": "trd_8xKp2mNqR4",
    "status": "pending",
    "amount": 1000
  },
  "timestamp": "2025-06-15T11:00:00Z"
}`,
  },
  {
    event: "trade.completed",
    description: "Fired when a trade is fully settled and funds have been released to the receiver.",
    payload: `{
  "event": "trade.completed",
  "data": {
    "id": "trd_8xKp2mNqR4",
    "status": "completed",
    "amount": 1000,
    "settled_at": "2025-06-15T11:45:00Z"
  },
  "timestamp": "2025-06-15T11:45:00Z"
}`,
  },
  {
    event: "trade.disputed",
    description: "Fired when either party raises a dispute on an active trade.",
    payload: `{
  "event": "trade.disputed",
  "data": {
    "id": "trd_8xKp2mNqR4",
    "status": "disputed",
    "reason": "Payment not received",
    "disputed_by": "sender"
  },
  "timestamp": "2025-06-15T12:00:00Z"
}`,
  },
  {
    event: "escrow.locked",
    description: "Fired when funds are successfully locked in the escrow smart contract.",
    payload: `{
  "event": "escrow.locked",
  "data": {
    "trade_id": "trd_8xKp2mNqR4",
    "escrow_address": "0x9f8e7d...",
    "amount": 1000,
    "currency": "USDC"
  },
  "timestamp": "2025-06-15T11:01:00Z"
}`,
  },
  {
    event: "escrow.released",
    description: "Fired when escrowed funds are released to the intended recipient.",
    payload: `{
  "event": "escrow.released",
  "data": {
    "trade_id": "trd_8xKp2mNqR4",
    "escrow_address": "0x9f8e7d...",
    "amount": 1000,
    "released_to": "0x1a2b3c..."
  },
  "timestamp": "2025-06-15T11:45:00Z"
}`,
  },
];

const rateLimits = [
  { tier: "Free", requests: "100 / hour", burst: "10 / sec", notes: "For development and testing" },
  { tier: "Starter", requests: "1,000 / hour", burst: "50 / sec", notes: "For small production apps" },
  { tier: "Growth", requests: "10,000 / hour", burst: "200 / sec", notes: "For growing businesses" },
  { tier: "Enterprise", requests: "Unlimited", burst: "Custom", notes: "Contact sales for details" },
];

const navSections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "authentication", label: "Authentication" },
  { id: "api-reference", label: "API Reference" },
  { id: "webhooks", label: "Webhooks" },
  { id: "sdks", label: "SDKs" },
  { id: "rate-limits", label: "Rate Limits" },
];

/* ============================================
   HELPER COMPONENTS
   ============================================ */

const MethodBadge = ({ method }: { method: "GET" | "POST" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
      method === "POST"
        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
        : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
    }`}
  >
    {method}
  </span>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.success();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => sounds.hover()}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-white/40" />
      )}
    </button>
  );
};

const CodeBlock = ({ code, label }: { code: string; label?: string }) => (
  <div className="relative mt-4">
    {label && (
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-2">
        {label}
      </div>
    )}
    <div className="relative rounded-xl bg-[#0D0D0D] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] overflow-hidden">
      <CopyButton text={code} />
      <pre className="p-4 pr-12 overflow-x-auto text-[13px] leading-relaxed">
        <code className="text-emerald-300 dark:text-emerald-300/90 font-mono">
          {code}
        </code>
      </pre>
    </div>
  </div>
);

/* -- Animated Section Wrapper -- */
const DocSection = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="scroll-mt-28"
    >
      {children}
    </motion.section>
  );
};

/* ============================================
   MAIN DOCS PAGE
   ============================================ */

export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  /* -- Track active section on scroll -- */
  useEffect(() => {
    const handleScroll = () => {
      const sections = navSections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      sounds.click();
      el.scrollIntoView({ behavior: "smooth" });
      setMobileNavOpen(false);
    }
  };

  return (
    <>
      <SEO
        title="Developer Documentation - Blip Money API"
        description="Build on top of Blip's settlement protocol. Comprehensive API documentation for integrating trades, escrow, webhooks, and real-time rates."
        canonical="https://blip.money/docs"
        keywords="Blip Money API, developer documentation, settlement protocol API, escrow API, crypto payments API"
      />
      <HreflangTags path="/docs" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Documentation" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-white/40 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API v1
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Developer Documentation
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mx-auto leading-relaxed">
                Build on top of Blip's settlement protocol. Integrate escrow-backed
                trades, real-time rates, and webhook notifications into your application.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mobile nav toggle */}
        <div className="lg:hidden sticky top-20 z-30 px-4 sm:px-6 mb-6">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              sounds.click();
              setMobileNavOpen(!mobileNavOpen);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] text-sm font-medium text-black dark:text-white"
          >
            <span className="flex items-center gap-2">
              {mobileNavOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
              Navigation
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                mobileNavOpen ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-2 rounded-xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]"
            >
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => sounds.hover()}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "text-black dark:text-white bg-black/[0.04] dark:bg-white/[0.06] font-medium"
                      : "text-gray-500 dark:text-white/40 hover:text-black dark:hover:text-white/70"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Main layout: sidebar + content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex gap-12">
            {/* Desktop sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="hidden lg:block w-56 flex-shrink-0"
            >
              <nav className="sticky top-32 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30 mb-3 px-3">
                  On this page
                </div>
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    onMouseEnter={() => sounds.hover()}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                      activeSection === section.id
                        ? "text-black dark:text-white bg-black/[0.04] dark:bg-white/[0.06] font-medium"
                        : "text-gray-400 dark:text-white/35 hover:text-gray-600 dark:hover:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {activeSection === section.id && (
                        <span className="w-1 h-1 rounded-full bg-black dark:bg-white" />
                      )}
                      {section.label}
                    </span>
                  </button>
                ))}
              </nav>
            </motion.aside>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-16">
              {/* ---- Getting Started ---- */}
              <DocSection id="getting-started">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Getting Started
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-6">
                  The Blip API allows you to programmatically create and manage escrow-backed trades,
                  query real-time exchange rates, and subscribe to webhook events. All API
                  communication is over HTTPS and returns JSON responses.
                </p>

                <div className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] mb-6">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-3">
                    Base URL
                  </h3>
                  <div className="rounded-lg bg-[#0D0D0D] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.06] px-4 py-3">
                    <code className="text-[14px] text-emerald-300 font-mono">
                      https://api.blip.money/api/v1
                    </code>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-3">
                    Quick Start
                  </h3>
                  <ol className="space-y-3 text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/[0.06] dark:bg-white/[0.06] flex items-center justify-center text-[12px] font-bold text-black dark:text-white">
                        1
                      </span>
                      Create an account at{" "}
                      <code className="text-[13px] font-mono bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded">
                        blip.money/signup
                      </code>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/[0.06] dark:bg-white/[0.06] flex items-center justify-center text-[12px] font-bold text-black dark:text-white">
                        2
                      </span>
                      Generate an API key from your dashboard settings
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/[0.06] dark:bg-white/[0.06] flex items-center justify-center text-[12px] font-bold text-black dark:text-white">
                        3
                      </span>
                      Include the API key in your request headers and start making calls
                    </li>
                  </ol>
                </div>
              </DocSection>

              {/* ---- Authentication ---- */}
              <DocSection id="authentication">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Authentication
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-6">
                  All API requests must include your API key in the{" "}
                  <code className="text-[13px] font-mono bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded text-black dark:text-white">
                    Authorization
                  </code>{" "}
                  header using a Bearer token. API keys are scoped to your account and can be
                  rotated at any time from the dashboard.
                </p>

                <CodeBlock
                  label="Request header"
                  code={`curl -X GET https://api.blip.money/api/v1/trades \\
  -H "Authorization: Bearer blip_sk_live_your_api_key_here" \\
  -H "Content-Type: application/json"`}
                />

                <div className="mt-6 p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 dark:border-amber-500/20">
                  <p className="text-[14px] text-amber-700 dark:text-amber-300/80 leading-relaxed">
                    <strong className="font-semibold">Security note:</strong> Never expose your API key in
                    client-side code. Always make API calls from your server and keep keys in environment
                    variables.
                  </p>
                </div>
              </DocSection>

              {/* ---- API Reference ---- */}
              <DocSection id="api-reference">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  API Reference
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-8">
                  Complete reference for all available endpoints. Each request must include valid
                  authentication headers.
                </p>

                <div className="space-y-6">
                  {endpoints.map((endpoint, idx) => {
                    const endpointRef = useRef(null);
                    const endpointInView = useInView(endpointRef, {
                      once: true,
                      margin: "-40px",
                    });

                    return (
                      <motion.div
                        key={idx}
                        ref={endpointRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={endpointInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: idx * 0.06,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/[0.12] transition-colors duration-300"
                      >
                        {/* Method + Path */}
                        <div className="flex items-center gap-3 mb-3">
                          <MethodBadge method={endpoint.method} />
                          <code className="text-[14px] font-mono font-semibold text-black dark:text-white">
                            {endpoint.path}
                          </code>
                        </div>

                        {/* Description */}
                        <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
                          {endpoint.description}
                        </p>

                        {/* Request body */}
                        {endpoint.request && (
                          <CodeBlock code={endpoint.request} label="Request body" />
                        )}

                        {/* Response */}
                        <CodeBlock code={endpoint.response} label="Response" />
                      </motion.div>
                    );
                  })}
                </div>
              </DocSection>

              {/* ---- Webhooks ---- */}
              <DocSection id="webhooks">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Webhooks
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-4">
                  Webhooks allow your application to receive real-time notifications when events
                  occur in the Blip system. Register an endpoint and we will send a POST request
                  with the event payload each time a subscribed event fires.
                </p>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-8">
                  Each webhook request includes an{" "}
                  <code className="text-[13px] font-mono bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded text-black dark:text-white">
                    X-Blip-Signature
                  </code>{" "}
                  header containing an HMAC-SHA256 signature. Verify this signature using your
                  webhook secret to ensure the request is authentic.
                </p>

                <div className="space-y-6">
                  {webhookEvents.map((evt, idx) => {
                    const evtRef = useRef(null);
                    const evtInView = useInView(evtRef, {
                      once: true,
                      margin: "-40px",
                    });

                    return (
                      <motion.div
                        key={idx}
                        ref={evtRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={evtInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: idx * 0.05,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/[0.12] transition-colors duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                            Event
                          </span>
                          <code className="text-[14px] font-mono font-semibold text-black dark:text-white">
                            {evt.event}
                          </code>
                        </div>
                        <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
                          {evt.description}
                        </p>
                        <CodeBlock code={evt.payload} label="Payload" />
                      </motion.div>
                    );
                  })}
                </div>
              </DocSection>

              {/* ---- SDKs ---- */}
              <DocSection id="sdks">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  SDKs
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-6">
                  Official SDK libraries to simplify integration with the Blip API. SDKs handle
                  authentication, request signing, error handling, and webhook verification
                  out of the box.
                </p>

                <div className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/15 flex items-center justify-center text-[18px] font-bold text-yellow-600 dark:text-yellow-400">
                      JS
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-black dark:text-white">
                        JavaScript / TypeScript SDK
                      </h3>
                      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-amber-600 dark:text-amber-400">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-4">
                    Full-featured Node.js / browser SDK with TypeScript definitions,
                    automatic retries, and webhook verification helpers.
                  </p>

                  <CodeBlock
                    code={`# Install via npm (coming soon)
npm install @blip-money/sdk

# Or using yarn
yarn add @blip-money/sdk`}
                    label="Installation"
                  />

                  <div className="mt-4">
                    <CodeBlock
                      code={`import { BlipClient } from '@blip-money/sdk';

const blip = new BlipClient({
  apiKey: process.env.BLIP_API_KEY,
});

// Create a trade
const trade = await blip.trades.create({
  senderCurrency: 'USDC',
  receiverCurrency: 'AED',
  amount: 1000,
  receiverAddress: '0x1a2b3c...',
});

console.log(trade.id); // trd_8xKp2mNqR4`}
                      label="Usage example"
                    />
                  </div>
                </div>
              </DocSection>

              {/* ---- Rate Limits ---- */}
              <DocSection id="rate-limits">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Rate Limits
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed mb-6">
                  API rate limits are applied per API key. Exceeding the limit returns a{" "}
                  <code className="text-[13px] font-mono bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded text-black dark:text-white">
                    429 Too Many Requests
                  </code>{" "}
                  response with a{" "}
                  <code className="text-[13px] font-mono bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded text-black dark:text-white">
                    Retry-After
                  </code>{" "}
                  header indicating when you can retry.
                </p>

                <div className="rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                          <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
                            Tier
                          </th>
                          <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
                            Requests
                          </th>
                          <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
                            Burst
                          </th>
                          <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30 hidden sm:table-cell">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rateLimits.map((tier, idx) => (
                          <tr
                            key={tier.tier}
                            className={
                              idx < rateLimits.length - 1
                                ? "border-b border-black/[0.04] dark:border-white/[0.04]"
                                : ""
                            }
                          >
                            <td className="px-5 py-4 text-[14px] font-semibold text-black dark:text-white">
                              {tier.tier}
                            </td>
                            <td className="px-5 py-4 text-[14px] font-mono text-gray-600 dark:text-white/50">
                              {tier.requests}
                            </td>
                            <td className="px-5 py-4 text-[14px] font-mono text-gray-600 dark:text-white/50">
                              {tier.burst}
                            </td>
                            <td className="px-5 py-4 text-[14px] text-gray-400 dark:text-white/30 hidden sm:table-cell">
                              {tier.notes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 dark:border-blue-500/20">
                  <p className="text-[14px] text-blue-700 dark:text-blue-300/80 leading-relaxed">
                    <strong className="font-semibold">Tip:</strong> Include caching logic for
                    the rates endpoint to minimize unnecessary requests. Rates only update every 30 seconds.
                  </p>
                </div>
              </DocSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
