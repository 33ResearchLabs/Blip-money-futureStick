import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-32 relative" ref={ref}>
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
            <span className="text-white/40 text-sm tracking-widest uppercase">About</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight max-w-4xl">
            More than capital.
            <br />
            <span className="text-white/30">We build together.</span>
          </h2>
        </motion.div>

        {/* Two column content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <p className="text-xl text-white/60 leading-relaxed">
              UniSquare is a venture studio that invests in and mentors early-stage
              companies at the intersection of artificial intelligence and Web3.
            </p>
            <p className="text-xl text-white/60 leading-relaxed">
              We partner with exceptional founders who are building breakthrough
              technologies that will define the next decade.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <p className="text-xl text-white/60 leading-relaxed">
              With a global network spanning five continents and deep expertise in
              emerging technologies, we provide more than funding.
            </p>
            <p className="text-xl text-white/60 leading-relaxed">
              We provide the resources, connections, and guidance founders need
              to build category-defining companies.
            </p>
          </motion.div>
        </div>

        {/* Feature cards - Bento grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              title: 'Strategic Investment',
              description: 'We identify breakthrough technologies early and provide patient capital to ambitious founders.',
              icon: '01',
            },
            {
              title: 'Hands-on Support',
              description: 'We work closely with portfolio companies on strategy, product, hiring, and go-to-market.',
              icon: '02',
            },
            {
              title: 'Global Network',
              description: 'Access to our network of founders, operators, and investors across major tech hubs.',
              icon: '03',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 md:p-10 group"
            >
              <span className="text-5xl font-bold text-white/10 mb-6 block group-hover:text-white/20 transition-colors duration-500">
                {item.icon}
              </span>
              <h3 className="text-xl font-semibold text-white mb-4">
                {item.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
