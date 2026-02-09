import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "dark" | "accent";
    hoverEffect?: boolean;
}

export const GlassCard = ({
    children,
    className,
    variant = "default",
    hoverEffect = true,
    ...props
}: GlassCardProps) => {
    const baseStyles = "relative overflow-hidden border transition-all duration-500";

    const variants = {
        default: "bg-white/60 dark:bg-white/[0.03] border-black/[0.08] dark:border-white/[0.08] backdrop-blur-xl shadow-[0_4px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-lg",
        dark: "bg-white/40 dark:bg-black/40 border-black/[0.06] dark:border-white/[0.05] backdrop-blur-2xl shadow-[0_4px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-xl",
        accent: "bg-primary/10 border-primary/20 backdrop-blur-xl shadow-[0_0_30px_-5px_var(--primary-glow)]",
    };

    const hoverStyles = hoverEffect
        ? "group hover:bg-white/70 dark:hover:bg-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] dark:hover:shadow-glow-orange/20 hover:-translate-y-1"
        : "";

    return (
        <motion.div
            className={cn(baseStyles, variants[variant], hoverStyles, className)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            {...props}
        >
            {/* Shine effect on hover */}
            {hoverEffect && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shimmer" />
                </div>
            )}

            {children}
        </motion.div>
    );
};
