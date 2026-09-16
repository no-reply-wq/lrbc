import { motion } from "motion/react";

export default function SlideText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block h-5 w-full overflow-hidden">
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={{ y: 0 }}
        whileHover={{ y: "-100%" }}
        transition={{
          duration: 0.3,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {children}
      </motion.span>

      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={{ y: "100%" }}
        whileHover={{ y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}