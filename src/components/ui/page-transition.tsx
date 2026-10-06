import { motion } from "framer-motion";
import { ReactNode } from "react";

// Wraps a page's content so it fades/slides in on mount — since React
// Router mounts a fresh component instance for every route, this fires
// naturally both on first load and on every in-app navigation, with no
// router-level transition plumbing needed.
const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
