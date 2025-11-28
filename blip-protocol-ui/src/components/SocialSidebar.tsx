import { motion } from "framer-motion";
import { Twitter, X } from "lucide-react";
import { RiTelegram2Fill } from "react-icons/ri";
import { BsTwitterX } from "react-icons/bs";
import React from "react";

export const SocialSidebar = () => {
  const items = [
    {
      label: "Telegram",
      icon: RiTelegram2Fill,
      link: "https://t.me/+Pi3Ijs3Q5-ZjZTAx",
    },
    {
      label: "Twitter",
      icon: BsTwitterX,
      link: "https://x.com/blipmoney_",
    },
  ];

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[9999]  flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.a
          key={i}
          href={item.link}
          target="_blank"
          initial="initial"
          whileHover="hover"
          variants={{
            initial: { x: 0 },
            hover: { x: -20 }, // ⬅ move green background to the left by 20px
          }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="relative bg-[#2BFF88] text-black font-bold px-4 py-3 rounded-l-xl shadow-lg
             cursor-pointer flex items-center overflow-visible"
        >
          <motion.div
            variants={{
              initial: { x: 0 },
              hover: { x: -120 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="flex items-center gap-2"
          >
            <item.icon className="w-6 h-6" />
          </motion.div>

          <motion.span
            variants={{
              initial: { opacity: 0, x: 20 },
              hover: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute -left-5 whitespace-nowrap text-sm text-green-500"
          >
            {item.label}
          </motion.span>
        </motion.a>
      ))}
    </div>
  );
};
