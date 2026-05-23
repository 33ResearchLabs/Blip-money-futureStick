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
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:pl-12 flex flex-col justify-start">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2 border border-black/10 dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02]"
            >
              <Globe
                className="w-3 h-3 text-black/60 dark:text-white/70"
                strokeWidth={2}
              />
              <span className="text-[10px] font-semibold text-black/70 dark:text-white/80 uppercase tracking-[0.18em]">
                {badge}
              </span>
            </motion.div>
          )}

          {heading && (
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1 ">
              {heading}
              {headingAccent && (
                <>
                  
                  <span className="dark:text-white/70 block  text-lg ">
                    {headingAccent}
                  </span>
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
        <div className="hidden lg:flex  flex-col items-start justify-start overflow-hidden  p-8">
          <AuthCardStack variant={variant} className="" />
        </div>
      </div>

      {/* Optional bottom content (feature grids, etc.) */}
      {/* {bottomContent} */}
    </motion.div>
  );
}
