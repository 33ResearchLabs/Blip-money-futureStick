import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import AuthCardStack from "./AuthCardStack";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  badge?: string;
  heading?: string;
  headingAccent?: string;
  description?: string;
  variant?: "merchant" | "user";
  bottomContent?: React.ReactNode;
}

export default function AuthPageLayout({
  children,
  badge,
  heading,
  headingAccent,
  description,
  variant = "user",
  bottomContent,
}: AuthPageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-0 py-10 ">
        {/* RIGHT: Form side */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:pl-12 flex flex-col justify-center">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-black/10 dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02]"
            >
              <Globe
                className="w-3.5 h-3.5 text-black/60 dark:text-white/70"
                strokeWidth={2}
              />
              <span className="text-[11px] font-semibold text-black/70 dark:text-white/80 uppercase tracking-[0.18em]">
                {badge}
              </span>
            </motion.div>
          )}

          {heading && (
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-3 ">
              {heading}
              {headingAccent && (
                <>
                  <br />
                  <span className="dark:text-white/70  text-lg md:text-xl">{headingAccent}</span>
                </>
              )}
            </h2>
          )}

          {/* {description && (
            <p className="text-black/60 dark:text-white/60 mb-10 leading-relaxed">
              {description}
            </p>
          )} */}

          {children}
        </div>

        {/* LEFT: Card visual + tagline (hidden below lg) */}
        <div className="hidden lg:flex  flex-col items-start justify-start overflow-hidden pl-4 ml-8 pt-6">
          <AuthCardStack variant={variant} className="" />
          {/* <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl lg:text-6xl xl:text-7xl font-bold text-black dark:text-white leading-[1.05] tracking-tight"
          >
            Pay anyone,
            <br />
            anywhere
            <br />
            <span className="text-black/85 dark:text-white/50">in a blip.</span>
          </motion.h1> */}
        </div>
      </div>

      {/* Optional bottom content (feature grids, etc.) */}
      {bottomContent}
    </motion.div>
  );
}
