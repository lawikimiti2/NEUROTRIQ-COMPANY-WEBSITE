import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Slide = {
  src: string;
  alt: string;
};

// Crossfades through a handful of photos inside whatever container wraps it
// (the container owns the shape/sizing — e.g. the circular hero frame on
// Home). Pauses when the tab isn't visible so it doesn't burn cycles in a
// background tab.
const HeroSlider = ({ slides, intervalMs = 4000 }: { slides: Slide[]; intervalMs?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        <motion.img
          key={index}
          src={slides[index].src}
          alt={slides[index].alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

export default HeroSlider;
