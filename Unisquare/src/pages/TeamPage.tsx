import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Linkedin, Twitter, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export function TeamPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const team = [
    {
      name: 'Anupam Sharma',
      role: 'Co-Founder & CEO',
      bio: 'Serial entrepreneur with 7+ years experience at the intersection of technology and venture capital. Led investments with portfolio valuations exceeding $50 million.',
      link: '/anupam-sharma',
      social: {
        linkedin: 'https://linkedin.com/in/anupamsharma01',
        twitter: 'https://twitter.com/anupam_enlte',
      },
    },
  ]

  return (
    <>
      <Helmet>
        <title>Our Team - UniSquare | AI & Web3 Venture Studio Dubai</title>
        <meta name="description" content="Meet the team behind UniSquare - entrepreneurs, investors, and technology visionaries building the future of AI and Web3 in Dubai and globally." />
        <meta name="keywords" content="UniSquare team, venture capital team, AI investors, Web3 investors, Dubai venture studio, Anupam Sharma" />
        <link rel="canonical" href="https://unisquare.io/team" />

        <meta property="og:title" content="Our Team - UniSquare" />
        <meta property="og:description" content="Meet the entrepreneurs and investors building the future of AI and Web3." />
        <meta property="og:url" content="https://unisquare.io/team" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "UniSquare",
            "url": "https://unisquare.io",
            "member": [
              {
                "@type": "Person",
                "name": "Anupam Sharma",
                "jobTitle": "Co-Founder & CEO",
                "url": "https://unisquare.io/anupam-sharma"
              }
            ]
          })}
        </script>
      </Helmet>

      <section className="pt-32 pb-20 min-h-screen relative" ref={ref}>
        {/* Subtle glow */}
        <div className="glow-blur top-0 right-1/4 animate-pulse-glow" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
              <span className="text-white/40 text-sm tracking-widest uppercase">Team</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight mb-8">
              The people behind
              <br />
              <span className="text-gradient-subtle">UniSquare.</span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl leading-relaxed">
              A dedicated team of investors and operators committed to backing
              the next generation of founders.
            </p>
          </motion.div>

          {/* Team grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-8 md:p-10 group"
                >
                  {/* Avatar */}
                  <Link to={member.link}>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 cursor-pointer">
                      <span className="text-3xl font-bold text-black">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </Link>

                  <Link to={member.link} className="block group/name">
                    <h3 className="text-2xl font-semibold text-white mb-2 group-hover/name:text-white/80 transition-colors inline-flex items-center gap-2">
                      {member.name}
                      <ArrowRight size={18} className="opacity-0 group-hover/name:opacity-100 group-hover/name:translate-x-1 transition-all" />
                    </h3>
                  </Link>
                  <p className="text-white/40 text-sm uppercase tracking-wider mb-6">{member.role}</p>
                  <p className="text-white/50 leading-relaxed mb-8">
                    {member.bio}
                  </p>

                  {/* View Profile Link */}
                  <Link
                    to={member.link}
                    className="text-white/60 hover:text-white text-sm inline-flex items-center gap-2 mb-6 transition-colors"
                  >
                    View Full Profile
                    <ArrowRight size={14} />
                  </Link>

                  {/* Social links */}
                  <div className="flex gap-3">
                    {member.social?.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {member.social?.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                        aria-label="Twitter"
                      >
                        <Twitter size={18} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-border p-12 md:p-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Join our network
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl">
              We're always looking for exceptional advisors and partners
              who share our vision of building the future.
            </p>
            <a href="/#contact" className="btn-primary inline-flex items-center gap-2 group">
              Get in Touch
              <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
