import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react'

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Using Web3Forms - free email API service
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY', // Replace with actual key from web3forms.com
          subject: `New Contact from ${formData.name} - UniSquare`,
          from_name: formData.name,
          to: 'contact@unisquare.io',
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Not provided',
          message: formData.message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', company: '', message: '' })
      } else {
        // Fallback to mailto if API fails
        const mailtoLink = `mailto:contact@unisquare.io?subject=New Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`
        )}`
        window.location.href = mailtoLink
        setIsSubmitted(true)
      }
    } catch {
      // Fallback to mailto on error
      const mailtoLink = `mailto:contact@unisquare.io?subject=New Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`
      )}`
      window.location.href = mailtoLink
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
              <span className="text-white/40 text-sm tracking-widest uppercase">Contact</span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight mb-8">
              Let's talk.
            </h2>

            <p className="text-xl text-white/50 leading-relaxed mb-12">
              Whether you're a founder building something ambitious or an investor
              looking to co-invest, we'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div>
                <p className="text-white/30 text-sm uppercase tracking-wider mb-2">Email</p>
                <a
                  href="mailto:contact@unisquare.io"
                  className="text-xl text-white hover:text-white/70 transition-colors"
                >
                  contact@unisquare.io
                </a>
              </div>
              <div>
                <p className="text-white/30 text-sm uppercase tracking-wider mb-2">Location</p>
                <p className="text-xl text-white">Dubai, UAE</p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {isSubmitted ? (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8"
                >
                  <CheckCircle className="text-black" size={40} />
                </motion.div>
                <h3 className="text-3xl font-semibold text-white mb-4">
                  Message sent
                </h3>
                <p className="text-white/50 text-lg">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-white/30 uppercase tracking-wider mb-3">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/30 uppercase tracking-wider mb-3">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/30 uppercase tracking-wider mb-3">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/30 uppercase tracking-wider mb-3">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Tell us about what you're building..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
