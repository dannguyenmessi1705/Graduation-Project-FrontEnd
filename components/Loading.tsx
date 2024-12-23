import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingProps {
  size?: number;
  color?: string;
}

export function Loading({ size = 24, color = "currentColor" }: LoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={size} className={`text-${color}`} />
      </motion.div>
    </motion.div>
  );
}
