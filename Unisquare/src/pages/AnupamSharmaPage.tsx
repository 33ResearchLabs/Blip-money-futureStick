import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Linkedin, Twitter, ArrowLeft, ExternalLink, Award, Briefcase, GraduationCap, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export function AnupamSharmaPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const achievements = [
    {
      icon: Award,
      title: 'Pioneer in Cyber Security',
      description: 'One of the first ethical hackers to expose SIM card vulnerabilities, with research published on Hacking.org',
    },
    {
      icon: Briefcase,
      title: 'Serial Entrepreneur',
      description: 'Founded multiple successful ventures since age 18, spanning AI, Web3, cybersecurity, and blockchain',
    },
    {
      icon: Lightbulb,
      title: 'Web3 Thought Leader',
      description: 'Leading the crypto evolution by developing AI-powered Web3 solutions and investing in DeFi projects',
    },
    {
      icon: GraduationCap,
      title: 'Tech Expert',
      description: 'EC-Council certified with deep expertise in AI, ML, blockchain, and cybersecurity technologies',
    },
  ]

  const timeline = [
    {
      year: '2020 - Present',
      role: 'Co-Founder & CEO',
      company: 'UniSquare',
      description: 'Leading a venture studio that invests in and mentors AI and Web3 startups globally.',
    },
    {
      year: '2020 - Present',
      role: 'Chapter Director',
      company: 'Startup Grind',
      description: 'Hosting Fireside Chats for crypto entrepreneurs and building the startup ecosystem.',
    },
    {
      year: '2019 - Present',
      role: 'Founder & CEO',
      company: 'ESPL',
      description: 'Blockchain-based service company focused on DeFi and decentralized solutions.',
    },
    {
      year: '2014 - 2016',
      role: 'CEO',
      company: 'Hacksurance',
      description: 'Founded one of the first cyber insurance and hacking insurance providers globally.',
    },
    {
      year: '2015 - 2016',
      role: 'Co-founder & CEO',
      company: 'MPAS Worldwide',
      description: 'Developed innovative software solutions including Online Crime Investigation tools.',
    },
    {
      year: '2012 - 2014',
      role: 'Managing Director',
      company: 'Aorso Technologies',
      description: 'Led technology development and business strategy for enterprise software solutions.',
    },
  ]

  const press = [
    {
      outlet: 'Entrepreneur',
      title: 'Contributing Author & Featured Entrepreneur',
      url: 'https://www.entrepreneur.com/en-in/author/anupam-sharma',
    },
    {
      outlet: 'Inc91',
      title: 'How to Find Opportunity in Cryptoverse and Stay Ahead of the Crowd',
      url: 'https://www.inc91.com/anupam-sharma-how-to-find-opportunity-in-cryptoverse-and-stay-ahead-of-the-crowd',
    },
    {
      outlet: 'Weekday',
      title: 'Featured Entrepreneur Profile',
      url: 'https://www.weekday.works/people/anupam-sharma-anupamsharma01',
    },
  ]

  const expertise = [
    'Artificial Intelligence',
    'Machine Learning',
    'Web3 & Blockchain',
    'DeFi & Crypto',
    'Cybersecurity',
    'Venture Capital',
    'Startup Mentorship',
    'AR/VR Technologies',
  ]

  return (
    <>
      <Helmet>
        <title>Anupam Sharma - Entrepreneur, Investor & CEO | UniSquare</title>
        <meta name="description" content="Anupam Sharma is a serial entrepreneur and investor with 7+ years experience in AI, Web3, and cybersecurity. Co-Founder & CEO of UniSquare venture studio based in Dubai." />
        <meta name="keywords" content="Anupam Sharma, entrepreneur, investor, CEO, UniSquare, venture capital, AI, Web3, blockchain, Dubai, startup mentor, cybersecurity expert" />

        <meta property="og:title" content="Anupam Sharma - Entrepreneur, Investor & CEO" />
        <meta property="og:description" content="Serial entrepreneur with 7+ years experience building ventures in AI, Web3, and cybersecurity. Co-Founder & CEO of UniSquare." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://unisquare.io/anupam-sharma" />

        <meta name="twitter:title" content="Anupam Sharma - Entrepreneur, Investor & CEO" />
        <meta name="twitter:description" content="Serial entrepreneur with 7+ years experience building ventures in AI, Web3, and cybersecurity." />

        <link rel="canonical" href="https://unisquare.io/anupam-sharma" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Anupam Sharma",
            "jobTitle": "Co-Founder & CEO",
            "worksFor": {
              "@type": "Organization",
              "name": "UniSquare"
            },
            "description": "Serial entrepreneur and investor with 7+ years of experience in AI, Web3, and cybersecurity",
            "url": "https://unisquare.io/anupam-sharma",
            "sameAs": [
              "https://linkedin.com/in/anupamsharma01",
              "https://twitter.com/anupam_enlte",
              "https://www.entrepreneur.com/en-in/author/anupam-sharma"
            ],
            "knowsAbout": ["Artificial Intelligence", "Web3", "Blockchain", "Venture Capital", "Cybersecurity"],
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Chitkara University"
            }
          })}
        </script>
      </Helmet>

      <section className="pt-32 pb-20 min-h-screen relative" ref={ref}>
        {/* Subtle glow */}
        <div className="glow-blur top-0 right-1/4 animate-pulse-glow" />
        <div className="glow-blur bottom-1/4 left-0 animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Team
            </Link>
          </motion.div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
            {/* Avatar & Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4"
            >
              <div className="glass-card p-8 md:p-10 sticky top-32">
                {/* Avatar */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center mb-8 mx-auto">
                  <span className="text-4xl md:text-5xl font-bold text-black">AS</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-2">
                  Anupam Sharma
                </h1>
                <p className="text-white/40 text-sm uppercase tracking-wider text-center mb-6">
                  Co-Founder & CEO
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">7+</p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">10+</p>
                    <p className="text-white/40 text-xs uppercase tracking-wider">Ventures Founded</p>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-3">
                  <a
                    href="https://linkedin.com/in/anupamsharma01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="https://twitter.com/anupam_enlte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
                <span className="text-white/40 text-sm tracking-widest uppercase">About</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight mb-8">
                Entrepreneur, Investor &
                <br />
                <span className="text-white/30">Technology Visionary.</span>
              </h2>

              <div className="space-y-6 text-lg text-white/60 leading-relaxed mb-12">
                <p>
                  Anupam Sharma is a serial entrepreneur who began his entrepreneurial journey at the age of 18.
                  With over 7 years of experience at the intersection of technology and venture capital, he has
                  founded multiple successful ventures spanning AI, Web3, cybersecurity, and blockchain technologies.
                </p>
                <p>
                  As Co-Founder and CEO of UniSquare, Anupam leads a venture studio that invests in and mentors
                  early-stage AI and Web3 startups. His portfolio companies have collectively reached valuations
                  exceeding $50 million, reflecting his keen eye for identifying breakthrough technologies early.
                </p>
                <p>
                  Recognized as one of the first ethical hackers to expose SIM card vulnerabilities, Anupam has
                  published research in leading cybersecurity publications. His deep technical background combined
                  with his entrepreneurial vision makes him a unique force in the venture ecosystem.
                </p>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-3">
                {expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm hover:border-white/30 hover:text-white transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Achievements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
              <span className="text-white/40 text-sm tracking-widest uppercase">Achievements</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-8 group"
                >
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors duration-300">
                    <item.icon size={24} className="text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Career Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
              <span className="text-white/40 text-sm tracking-widest uppercase">Career Journey</span>
            </div>

            <div className="space-y-4">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.company}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center group"
                >
                  <div className="md:col-span-3">
                    <p className="text-white/30 text-sm font-medium">{item.year}</p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.role}</h3>
                    <p className="text-white/50 text-sm mb-2">{item.company}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Press & Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px bg-gradient-to-r from-white/50 to-transparent" />
              <span className="text-white/40 text-sm tracking-widest uppercase">Featured In</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {press.map((item, index) => (
                <motion.a
                  key={item.outlet}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-6 md:p-8 group hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                      {item.outlet}
                    </span>
                    <ExternalLink size={18} className="text-white/30 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                    {item.title}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-border p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Let's Connect
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Interested in discussing investment opportunities, partnerships, or just want to connect?
              I'm always open to conversations with fellow entrepreneurs and innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contact" className="btn-primary inline-flex items-center justify-center gap-2 group">
                Get in Touch
                <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://linkedin.com/in/anupamsharma01"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Linkedin size={18} />
                Connect on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
