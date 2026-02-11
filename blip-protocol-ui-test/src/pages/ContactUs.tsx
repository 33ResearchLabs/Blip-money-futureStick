import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Send,
  Copy,
  Check,
  ChevronDown,
  Lock,
  Globe,
  Zap,
  Mail,
  MapPin,
  Users,
  MessageSquare,
} from "lucide-react";
import { sendFormNotification } from "@/api/telegram";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";
import dubai from '../../public/Dubai.jpeg'

/* ============================================
   AWARD-WINNING CONTACT PAGE
   Cinematic design with smooth animations
   ============================================ */

const smoothConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

/* ============================================
   SECTION 1: CINEMATIC HERO
   ============================================ */

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 150]),
    smoothConfig,
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.section
      ref={ref}
      className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden mt-12"
      style={{ opacity }}
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2874&auto=format&fit=crop"
          alt="Modern office"
          className="w-full h-full object-cover"
          onContextMenu={(e) => e.stopPropagation()}
          draggable="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/60 to-[#FAF8F5] dark:from-black/80 dark:via-black/60 dark:to-black" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-[14px] text-black/70 dark:text-white/70 font-medium tracking-wide">
            System Status: Active
          </span>
        </motion.div>

        {/* Headlines */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-[1.20] tracking-[-0.04em] "
          >
            <span className="block text-black dark:text-white">Protocol</span>

            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #e5e5e5 50%, #ffffff 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Gateway
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl text-black/50 dark:text-white/50 max-w-xl mx-auto"
        >
          Direct peer-to-protocol messaging. Encrypted by default.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute top-[380px] sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-[#ff6b35]" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ============================================
   SECTION 2: CONTACT OPTIONS
   ============================================ */

const ContactOptionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
    sounds.click();
  };

  const channels = [
    { icon: Globe, label: "Merchant", desc: "Onboarding inquiries" },
    { icon: Zap, label: "Liquidity", desc: "Provider partnerships" },
    { icon: Lock, label: "Security", desc: "Vulnerability disclosure" },
    { icon: Users, label: "Partners", desc: "Protocol integration" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-24 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 dark:bg-white/5 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs uppercase tracking-[0.3em] text-black/60 dark:text-white/60 mb-6 block">
                Get in Touch
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight mb-6">
                Connect
                <br />
                <span className="text-black/30 dark:text-white/30">Directly.</span>
              </h2>
              <p className="text-lg text-black/50 dark:text-white/50 mb-10 max-w-md">
                Routed through the global Blip validator network. Privacy-first,
                always.
              </p>
            </motion.div>

            {/* Channel cards */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {channels.map((channel, i) => (
                <motion.div
                  key={channel.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="group p-5 rounded-2xl cursor-pointer transition-all duration-300"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                  onMouseEnter={() => sounds.hover()}
                >
                  <channel.icon className="w-5 h-5 text-black dark:text-[#ffffff] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                    {channel.label}
                  </h3>
                  <p className="text-xs text-black/40 dark:text-white/40">{channel.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                onClick={() => copyToClipboard("support@blip.money", "email")}
                className="w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-black/20 dark:group-hover:bg-[#ffffff]/20 transition-colors">
                    <Mail className="w-5 h-5 text-black dark:text-[#ffffff]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 block">
                      Digital Gateway
                    </span>
                    <span className="text-black dark:text-white">support@blip.money</span>
                  </div>
                </div>
                {copied.email ? (
                  <Check className="w-4 h-4 text-black/60 dark:text-white/60" />
                ) : (
                  <Copy className="w-4 h-4 text-black/30 dark:text-white/30 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors" />
                )}
              </motion.button>

              <motion.a
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                // href="https://www.google.com/maps/search/?api=1&query=JLT+Cluster+Y+Dubai"
                // target="_blank"
                // rel="noopener noreferrer"
                className="w-full flex items-center p-5 rounded-2xl transition-all duration-300 group"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
                onMouseEnter={() => sounds.hover()}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-black/20 dark:group-hover:bg-[#ffffff]/20 transition-colors">
                    <MapPin className="w-5 h-5 text-black dark:text-[#ffffff]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 block">
                      Location
                    </span>
                    <span className="text-black dark:text-white">
                      Blip Money, JLT Cluster Y, Dubai
                    </span>
                  </div>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Right: Form */}
          <ContactForm isInView={isInView} />
        </div>
      </div>
    </section>
  );
};

/* ============================================
   CONTACT FORM COMPONENT
   ============================================ */

interface ContactFormProps {
  isInView: boolean;
}

const ContactForm = ({ isInView }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "general",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inquiryTypes = [
    { value: "merchant", label: "Merchant Onboarding" },
    { value: "liquidity", label: "Liquidity Participation" },
    { value: "partnership", label: "Protocol Partnership" },
    { value: "security", label: "Vulnerability Disclosure" },
    { value: "general", label: "General Inquiry" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const telegramData = {
        name: formData.name || "Anonymous",
        email: formData.email,
        companyName: formData.inquiryType,
        website: window.location.origin,
        goals: formData.message,
      };

      await sendFormNotification(telegramData);
      sounds.click();

      setTimeout(() => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        setFormData({
          name: "",
          email: "",
          inquiryType: "general",
          message: "",
        });
      }, 1000);
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Failed to send message. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl overflow-hidden p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 rounded-full2 bg-black/20 dark:bg-[#ffffff]/20 flex items-center justify-center mb-8"
        >
          <Check className="w-12 h-12 text-black/60 dark:text-white/60" />
        </motion.div>
        <h3 className="text-3xl font-semibold text-black dark:text-white mb-4">Message Sent</h3>
        <p className="text-black/50 dark:text-white/50 mb-8">We'll get back to you shortly.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-black/60 dark:text-white/60 text-sm font-medium hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-black/60 dark:text-white/60" />
          <span className="text-sm font-medium text-black dark:text-white">Secure Channel</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3 text-black/40 dark:text-white/40" />
          <span className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider">
            Encrypted
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1  gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40">
              Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Anonymous"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-black dark:focus:border-[#ffffff] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/60 dark:text-white/60">
              Email (Required)
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-transparent border-b border-black/20 dark:border-white/20 py-3 text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-black dark:focus:border-[#ffffff] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40">
            Inquiry Type
          </label>
          <div className="relative">
            <select
              value={formData.inquiryType}
              onChange={(e) =>
                setFormData({ ...formData, inquiryType: e.target.value })
              }
              className="w-full appearance-none bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl px-4 py-4 text-sm text-black/80 dark:text-white/80 focus:outline-none focus:border-black/50 dark:focus:border-[#ffffff]/50 cursor-pointer"
            >
              {inquiryTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  className="bg-white dark:bg-black"
                >
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40">
            Message
          </label>
          <textarea
            required
            rows={5}
            placeholder="Your message..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-xl p-4 text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-black/50 dark:focus:border-[#ffffff]/50 transition-colors resize-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden group bg-black hover:bg-black/90 dark:bg-[#ffffff]/80 dark:hover:bg-white text-white dark:text-black font-semibold py-5 rounded-full transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed "
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10 flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
            {isSubmitting ? "Sending..." : "Send Message"}
            <Send className="w-4 h-4" />
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
};

/* ============================================
   SECTION 3: MAP / VISUAL
   ============================================ */

const VisualSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, -100]),
    smoothConfig,
  );

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-24 bg-[#FAF8F5] dark:bg-black overflow-hidden "
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/60 dark:text-white/60 mb-6 block">
            Global Network
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Dubai
            <br />
            <span className="text-black/30 dark:text-white/30">Headquarters</span>
          </h2>
        </motion.div>

        <motion.div
          className="relative aspect-[21/9] rounded-3xl overflow-hidden"
          style={{ y }}
        >
          <img
            // src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2940&auto=format&fit=crop"
            src={dubai}
            alt="Dubai skyline"
            className="w-full h-full object-cover"
            onContextMenu={(e) => e.stopPropagation()}
            draggable="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/80 via-[#FAF8F5]/20 dark:from-black/80 dark:via-black/20 to-transparent" />

          {/* Location pin */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-black/20 dark:bg-[#ffffff]/20 animate-ping absolute inset-0" />
              <div className="w-20 h-20 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center relative">
                <div className="w-8 h-8 rounded-full bg-[#ffffff] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute bottom-1 left-4 md:p-4 p-2 rounded-2xl backdrop-blur-xl max-w-sm"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 className="md:text-lg text-xs font-semibold text-white mb-2">
              Blip Money HQ
            </h3>
            <p className="text-white/60 md:text-sm text-[10px]">
              JLT Cluster Y, Dubai, UAE
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Contact Blip Money | Get in Touch with Our Team"
        description="Contact Blip Money for support, partnerships, or general inquiries. Our team is here to help."
        canonical="https://blip.money/contact"
      />
      <HreflangTags path="/contact" />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <ContactOptionsSection />
        <VisualSection />
      </div>
      
    </>
  );
};

export default ContactUs;
