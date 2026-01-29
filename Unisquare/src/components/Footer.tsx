import { Link } from 'react-router-dom'
import { Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="text-2xl font-semibold text-white mb-6 block">
              UniSquare
            </Link>
            <p className="text-white/40 max-w-sm leading-relaxed">
              Investing in founders building the future of AI and Web3.
              One venture at a time.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <p className="text-white/30 text-sm uppercase tracking-wider mb-6">Navigation</p>
            <div className="flex flex-col gap-4">
              <Link to="/#about" className="text-white/60 hover:text-white transition-colors duration-300">
                About
              </Link>
              <Link to="/#focus" className="text-white/60 hover:text-white transition-colors duration-300">
                Focus
              </Link>
              <Link to="/team" className="text-white/60 hover:text-white transition-colors duration-300">
                Team
              </Link>
              <Link to="/#contact" className="text-white/60 hover:text-white transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <p className="text-white/30 text-sm uppercase tracking-wider mb-6">Connect</p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/unisquare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com/company/unisquare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            © {currentYear} UniSquare. All rights reserved.
          </p>
          <p className="text-sm text-white/30">
            Dubai, UAE
          </p>
        </div>
      </div>
    </footer>
  )
}
