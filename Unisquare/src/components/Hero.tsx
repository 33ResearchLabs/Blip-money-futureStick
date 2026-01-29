import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated glow orbs */}
      <div className="glow-blur top-1/4 left-1/4 animate-pulse-glow" />
      <div className="glow-blur bottom-1/4 right-1/4 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm text-white/70">Venture Studio</span>
          </motion.div>

          {/* Main headline - massive and impactful */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-white mb-8"
          >
            <span className="block">We invest in</span>
            <span className="block text-gradient-subtle">the future.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-white/40 leading-relaxed mb-14 max-w-xl mx-auto"
          >
            Backing exceptional founders building breakthrough AI and Web3 companies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="btn-primary group"
            >
              Get in Touch
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="btn-secondary">
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Stats - Bento style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '$50M+', label: 'Portfolio Value' },
            { value: '25+', label: 'Companies' },
            { value: '5', label: 'Continents' },
            { value: '10+', label: 'Years' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-6 md:p-8 text-center"
            >
              <div className="stat-number text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-white/60"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
