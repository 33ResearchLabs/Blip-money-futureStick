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
      link: "https://t.me/+3DpHLzc2BfJhOWEx",
    },
    {
      label: "Twitter",
      icon: BsTwitterX,
      link: "https://x.com/blipmoney_",
    },
  ];

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[9999] flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.a
          key={i}
          href={item.link}
          target="_blank"
          variants={{
            initial: { x: 0 },
            hover: { width: 0, x: 170 },
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut", // 👈 NO MORE SPRING EFFECT
          }}
          initial="initial"
          whileHover="hover"
          className="relative cursor-pointer flex items-center justify-end "
        >
          <motion.div
            variants={{
              initial: { x: 0 },
              hover: { x: -100 },
            }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
            className="bg-black text-white font-bold px-1 py-3 rounded-l-xl shadow-lg flex items-center gap-3 ml-auto"
          >
            <motion.span
              variants={{
                initial: { opacity: 0, width: 0, marginRight: 0 },
                hover: { opacity: 1, width: "auto", marginRight: 12 },
              }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="whitespace-nowrap overflow-hidden block"
            >
              {item.label}
            </motion.span>
            <item.icon className="w-6 h-6 flex-shrink-0" />
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
};
