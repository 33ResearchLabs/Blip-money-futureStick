import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Focus', href: '/#focus' },
    { name: 'Team', href: '/team' },
  ]

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        window.location.href = href
      } else {
        const element = document.querySelector(href.replace('/', ''))
        element?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-white">
            UniSquare
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-white/60 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="/#contact"
              onClick={() => handleNavClick('/#contact')}
              className="btn-primary text-sm"
            >
              Contact
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-black"
          >
            <div className="pt-24 px-6">
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-3xl font-medium text-white"
                  >
                    {link.name}
                  </Link>
                ))}
                <a
                  href="/#contact"
                  onClick={() => handleNavClick('/#contact')}
                  className="btn-primary inline-block text-center mt-4 w-fit"
                >
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
