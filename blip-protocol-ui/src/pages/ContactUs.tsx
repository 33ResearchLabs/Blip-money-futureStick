import React, { useState, useEffect } from "react";
import {
  Send,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Radio,
  Mail,
  MapPin,
} from "lucide-react";
import { sendFormNotification } from "@/api/telegram";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "general",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inquiryTypes = [
    { value: "merchant", label: "Merchant Onboarding" },
    { value: "liquidity", label: "Liquidity Participation" },
    { value: "partnership", label: "Protocol Partnership" },
    { value: "security", label: "Vulnerability Disclosure" },
    { value: "general", label: "General Inquiry" },
  ];

  const handleCopyEns = () => {
    const ensText = "blipmoney.eth";
    const textArea = document.createElement("textarea");
    textArea.value = ensText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setStatus("ENCRYPTING...");

    try {
      // Prepare data for Telegram
      const telegramData = {
        name: formData.name || "Anonymous",
        email: formData.email,
        companyName: formData.inquiryType,
        website: window.location.origin,
        goals: formData.message,
      };

      // Send to Telegram
      await sendFormNotification(telegramData);

      // Show success animation
      setTimeout(() => {
        setIsSubmitted(true);
        setStatus("TRANSMITTED");
        setIsSubmitting(false);

        // Reset form data
        setFormData({
          name: "",
          email: "",
          inquiryType: "general",
          message: "",
        });
      }, 1500);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(
        "Failed to send message. Please try again or contact us directly."
      );
      setStatus("ACTIVE");
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, key) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white  selection:bg-[#00FF00]/30 overflow-hidden relative selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Radial Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00FF00]/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00FF00]/10 rounded-full blur-[140px]" />

        {/* Tactical Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00FF00 1px, transparent 1px), linear-gradient(90deg, #00FF00 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Scanning Line */}
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FF00]/20 to-transparent top-0 animate-[scan_8s_linear_infinite]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* LEFT: CONTENT (Col Span 5) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              {/* Protocol Badge */}
              <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#2BFF88]/10 to-transparent blur-[80px] animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-fullbg-gradient-to-b from-[#2BFF88]/10 to-transparent blur-[80px]0" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#00FF94]">
                  System Status: {status}
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none">
                Protocol <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                  Gateway
                </span>
              </h1>

              <div className="flex items-center space-x-4 group">
                <div className="h-[1px] w-12 bg-[#02BFF88] group-hover:w-20 transition-all duration-500 shadow-[0_0_10px_#00FF00]" />
                <p className="text-[#00FF94] font-mono text-lg tracking-widest uppercase">
                  In a Blip.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-gray-400 text-lg leading-relaxed max-w-md font-light">
                Direct peer-to-protocol messaging. Encrypted by default. Routed
                through the global Blip validator network.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Merchant", icon: Globe },
                  { label: "Liquidity", icon: Radio },
                  { label: "Security", icon: Lock },
                  { label: "Partners", icon: Zap },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00FF00]/30 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[#00FF94]" />
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                  Contact Us
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {/* Email Node */}
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard("contact@blip.money", "email")
                    }
                    className="w-full flex items-center justify-between p-4 rounded-xl
        bg-white/[0.02] border border-white/5
        hover:border-[#00FF94]/30 transition-all
        cursor-pointer group"
                    aria-label="Copy email address"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-[#00FF94]/5 flex items-center justify-center border border-[#00FF94]/10 group-hover:bg-[#00FF94]/10 transition-colors">
                        <Mail className="w-4 h-4 text-[#00FF94]" />
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">
                          Digital Gateway
                        </span>
                        <span className="text-sm text-white tracking-tight">
                          contact@blip.money
                        </span>
                      </div>
                    </div>

                    {copied.email ? (
                      <Check className="w-4 h-4 text-[#00FF94]" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-700 group-hover:text-[#00FF94]" />
                    )}
                  </button>

                  {/* Location Node */}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=JLT+Cluster+Y+Dubai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-4 p-4 rounded-xl
        bg-white/[0.02] border border-white/5
        hover:border-[#00FF94]/30 transition-all
        cursor-pointer group"
                    aria-label="Open location in Google Maps"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#00FF94]/5 flex items-center justify-center border border-[#00FF94]/10 group-hover:bg-[#00FF94]/10 transition-colors">
                      <MapPin className="w-4 h-4 text-[#00FF94]" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">
                        Location
                      </span>
                      <span className="text-sm text-white tracking-tight leading-snug">
                        Blip Money, 9th Floor,
                        <br />
                        JLT Cluster Y, Dubai, UAE
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: THE INTERFACE (Col Span 7) */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-10 bg-[#00FF94] rounded-full blur-[100px] pointer-events-none" />

            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
              {/* UI Header / Top Bar */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/20" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                  <div className="w-2 h-2 rounded-full bg-[#00FF00]/20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-3 h-3 text-gray-600" />
                  <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                    RSA-4096 Encrypted
                  </span>
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-20 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-[#00FF94] blur-xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-[#00FF94] rounded-full flex items-center justify-center">
                      <Check className="w-12 h-12 text-black stroke-[3]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight">
                      Transmission Success
                    </h3>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-wider">
                      Hash: 0x{Math.random().toString(16).slice(2, 10)}...
                      {Math.random().toString(16).slice(2, 6)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setStatus("ACTIVE");
                    }}
                    className="text-xs uppercase tracking-widest font-black text-[#00FF94] hover:text-white transition-colors"
                  >
                    Open New Channel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 group-focus-within:text-[#00FF94] transition-colors">
                        Ident_Name (Opt)
                      </label>
                      <input
                        type="text"
                        placeholder="ANONYMOUS"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder:text-gray-800 focus:outline-none focus:border-[#00FF94] transition-all  text-sm"
                      />
                    </div>
                    <div className="group space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] text-[#00FF94]">
                        Endpoint_Addr (Req)
                      </label>
                      <input
                        required
                        type="email"
                        placeholder=" EMAIL"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder:text-gray-800 focus:outline-none focus:border-[#00FF94] transition-all  text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 group-focus-within:text-[#00FF94] transition-colors">
                      Route_Selection
                    </label>
                    <div className="relative">
                      <select
                        value={formData.inquiryType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inquiryType: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-white/[0.03] border border-white/5 rounded-lg px-4 py-4 text-sm text-gray-300 focus:outline-none focus:border-[#00FF94]/50 cursor-pointer uppercase tracking-widest font-bold"
                      >
                        {inquiryTypes.map((type) => (
                          <option
                            key={type.value}
                            value={type.value}
                            className="bg-[#0A0A0A]"
                          >
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 group-focus-within:text-[#00FF94] transition-colors">
                      Secure_Payload
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="ENTER MESSAGE CONTENT..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/5 rounded-lg p-4 text-sm text-white placeholder:text-gray-800 focus:outline-none focus:border-[#00FF94]/50 transition-all resize-none "
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 group/tip">
                      <ShieldCheck className="w-4 h-4 text-gray-700 group-hover/tip:text-[#00FF94] transition-colors" />
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        Privacy Guard Active
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-700  italic">
                      No tracking cookies present.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group/btn bg-[#00FF94] hover:bg-[#00FF94] text-black font-black py-5 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center justify-center uppercase tracking-[0.2em] text-sm">
                      {isSubmitting
                        ? "Transmitting..."
                        : "Establish Secure Connection"}
                      <Send className="w-4 h-4 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  {/* <div className="flex flex-col items-center space-y-4 pt-6">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <button
                      type="button"
                      onClick={handleCopyEns}
                      className="flex items-center space-x-4 px-6 py-2 rounded-full border border-white/5 hover:border-[#00FF94]/40 hover:bg-[#00FF94]/5 transition-all group/ens"
                    >
                      <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest group-hover/ens:text-gray-400">
                        ENS Lookup
                      </span>
                      <span className="text-sm font-mono text-white">
                        blipmoney.eth
                      </span>
                      {copied ? (
                        <Check className="w-3 h-3 text-[#00FF94]" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-600" />
                      )}
                    </button>
                  </div> */}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `,
        }}
      />
    </div>
  );
};

export default ContactUs;
