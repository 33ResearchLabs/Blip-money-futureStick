import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function Ventures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const sectors = [
    {
      title: 'Artificial Intelligence',
      description: 'Machine learning, LLMs, computer vision, and AI-native applications transforming industries.',
      size: 'large',
    },
    {
      title: 'Web3 & Blockchain',
      description: 'DeFi protocols, infrastructure, and decentralized applications.',
      size: 'normal',
    },
    {
      title: 'Developer Tools',
      description: 'Infrastructure and tools that make developers 10x more productive.',
      size: 'normal',
    },
    {
      title: 'FinTech',
      description: 'Payments, embedded finance, and crypto-native financial products.',
      size: 'normal',
    },
  ]

  return (
    <section id="focus" className="py-32 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
            <span className="text-white/40 text-sm tracking-widest uppercase">Focus</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight max-w-4xl">
            Where we invest.
          </h2>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Large featured card */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:row-span-2 glass-card p-10 md:p-12 flex flex-col justify-between min-h-[400px] group relative overflow-hidden"
          >
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <span className="text-7xl md:text-8xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500">
                AI
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                {sectors[0].title}
              </h3>
              <p className="text-white/50 text-lg leading-relaxed">
                {sectors[0].description}
              </p>
            </div>
          </motion.div>

          {/* Smaller cards */}
          {sectors.slice(1).map((sector, index) => (
            <motion.div
              key={sector.title}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 md:p-10 group"
            >
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/80 transition-colors">
                {sector.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {sector.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 mb-6">
            Building something in these spaces?
          </p>
          <a href="#contact" className="btn-secondary">
            Let's Talk
          </a>
        </motion.div>
      </div>
    </section>
  )
}
