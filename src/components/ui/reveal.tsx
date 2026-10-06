import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Fades + slides an element up into place the first time it scrolls into
// view. This is what makes a page feel "alive" instead of everything just
// being present on load — the one ingredient the previous passes were
// missing entirely.
const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    variants={variants}
  >
    {children}
  </motion.div>
);

export default Reveal;
