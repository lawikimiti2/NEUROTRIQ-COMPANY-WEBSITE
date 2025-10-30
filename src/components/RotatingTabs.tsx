import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-tech.jpg";

type Service = {
  title: string;
  description: string;
  image: string;
  icon?: React.ReactNode;
};

type Props = {
  items: Service[];
  interval?: number; // ms
};

const RotatingTabs: React.FC<Props> = ({ items, interval = 5000 }) => {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const timerRef = useRef<number | null>(null);
  const manualPauseTimer = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [prevActive, setPrevActive] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // build a map of all asset images served by Vite so we can pick dynamically
  const allImages = (import.meta as any).glob('/src/assets/**/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }) as Record<string,string>;
  const defaultSvgDataUrl = React.useMemo(() => {
    const svg = encodeURIComponent(`<?xml version="1.0"?><svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#0ea5a4' offset='0'/><stop stop-color='#0b7285' offset='1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial' font-size='28'>NeuroTriQ</text></svg>`);
    return `data:image/svg+xml;charset=utf-8,${svg}`;
  }, []);

  useEffect(() => {
    // Respect user's motion preference
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const setPref = () => setReducedMotion(Boolean(mq?.matches));
    setPref();
    if (mq?.addEventListener) mq.addEventListener("change", setPref);
    else if (mq?.addListener) mq.addListener(setPref);
    return () => {
      if (mq?.removeEventListener) mq?.removeEventListener("change", setPref);
      else if (mq?.removeListener) mq?.removeListener(setPref);
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1 || reducedMotion) return;

    const startAuto = () => {
      if (timerRef.current) return;
      timerRef.current = window.setInterval(() => {
        if (!paused.current) setActive((s) => (s + 1) % items.length);
      }, interval);
    };

    const stopAuto = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    startAuto();
    return () => stopAuto();
  }, [items.length, interval, reducedMotion]);

  // preload next/prev images for smoother transitions
  useEffect(() => {
    const next = (active + 1) % items.length;
    const prev = (active - 1 + items.length) % items.length;
    const preload = (src?: string) => { if (!src) return; const img = new Image(); img.src = src; };
    preload(findImageForService(items[next].title, items[next].image));
    preload(findImageForService(items[prev].title, items[prev].image));
  }, [active]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (manualPauseTimer.current) window.clearTimeout(manualPauseTimer.current);
    };
  }, []);

  const go = (index: number) => {
    setPrevActive(active);
    setActive(index);
    // manual navigation: pause auto-rotation for 6s
    paused.current = true;
    if (manualPauseTimer.current) window.clearTimeout(manualPauseTimer.current);
    manualPauseTimer.current = window.setTimeout(() => { paused.current = false; manualPauseTimer.current = null; }, 6000);
  };

  const handleMouseEnter = () => (paused.current = true);
  const handleMouseLeave = () => (paused.current = false);

  // swipe handling for touch devices
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchDelta.current = 0; touchStartTime.current = Date.now(); };
  const onTouchMove = (e: React.TouchEvent) => { if (touchStartX.current != null) touchDelta.current = e.touches[0].clientX - touchStartX.current; };
  const onTouchEnd = () => {
    const dx = touchDelta.current;
    const dt = Math.max(1, Date.now() - touchStartTime.current);
    const velocity = Math.abs(dx) / dt; // px per ms
    const threshold = 40;
    const fastFlick = velocity > 0.6 && Math.abs(dx) > 50; // momentum swipe
    if (dx > threshold || (fastFlick && dx > 0)) go((active - 1 + items.length) % items.length);
    else if (dx < -threshold || (fastFlick && dx < 0)) go((active + 1) % items.length);
    touchStartX.current = null; touchDelta.current = 0;
  };

  // helper to find best image for a service using globbed assets
  const findImageForService = (title: string, fallback?: string) => {
    const t = title.toLowerCase();
    // prefer exact folder names supplied in the requirements
    const preferredFolders = [
      'src/assets/consultancy',
      'src/assets/tendering',
      'src/assets/it-solutions',
      'src/assets/electrical',
      'src/assets/security-solutions',
      'src/assets/smart-infrastructure',
    ];

    const entries = Object.entries(allImages || {});

    // additional mappings to support current repository folder naming
    const repoFolders = [
      'src/assets/CONSULTANCY WORKS',
      'src/assets/SECURITY SOLUTIONS',
      'src/assets/SMART INFRASTRUCTURE',
      'src/assets/I T AND NETWORKING',
      'src/assets/electrical',
    ];

    // first pass: if title maps clearly to a folder token, try that
    const mapping: Record<string,string> = {
      'consultancy': 'consultancy',
      'consult': 'consultancy',
      'tender': 'tendering',
      'procure': 'tendering',
      'it': 'it-solutions',
      'it solutions': 'it-solutions',
      'elect': 'electrical',
      'electrical': 'electrical',
      'security': 'security-solutions',
      'smart': 'smart-infrastructure',
      'infrastructure': 'smart-infrastructure'
    };

    for (const [key, folder] of Object.entries(mapping)) {
      if (t.includes(key)) {
        const found = entries.find(([path]) => path.toLowerCase().includes(folder));
        if (found) return found[1];
        // try repo-specific folders as well
        const repoFound = entries.find(([path]) => repoFolders.some(rf => path.toLowerCase().includes(rf.toLowerCase())));
        if (repoFound) return repoFound[1];
      }
    }

    // second pass: try preferred folder list order
    for (const folder of preferredFolders) {
      const found = entries.find(([path]) => path.toLowerCase().includes(folder));
      if (found) return found[1];
    }

    // third pass: try repository folders seen in this project
    for (const folder of repoFolders) {
      const found = entries.find(([path]) => path.toLowerCase().includes(folder.toLowerCase()));
      if (found) return found[1];
    }

    // last resort: any image that includes a token from title
    for (const token of t.split(/\s+/)) {
      const found = entries.find(([path]) => path.toLowerCase().includes(token));
      if (found) return found[1];
    }

    // explicit fallback file if present
    const defaultCard = Object.entries(allImages).find(([p]) => p.toLowerCase().endsWith('src/assets/default-card.jpg'))?.[1];
    if (defaultCard) return defaultCard;
    // fallback to provided image string, else a lightweight svg data url
    return fallback || defaultSvgDataUrl;
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    // pause auto-rotation while modal is open
    paused.current = true;
  };

  const closeModal = () => {
    setModalClosing(true);
    window.setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setModalIndex(null);
      // resume auto-rotation immediately
      paused.current = false;
      if (manualPauseTimer.current) { window.clearTimeout(manualPauseTimer.current); manualPauseTimer.current = null; }
    }, 200);
  };

  // keyboard navigation: left/right arrows for carousel; Escape to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go((active - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') go((active + 1) % items.length);
      if (e.key === 'Escape' && modalOpen) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, modalOpen, items.length]);

  // focus management & body scroll lock when modal is open
  const previousActive = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (modalOpen) {
      previousActive.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      try { previousActive.current?.focus(); } catch {}
    }
  }, [modalOpen]);

  // trap focus and allow ESC to close while modal open
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
      if (e.key === 'Tab' && modalRef.current) {
        const nodes = Array.from(modalRef.current.querySelectorAll<HTMLElement>('a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (activeEl === first) { e.preventDefault(); last.focus(); }
        } else {
          if (activeEl === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', onKey);
    // focus first focusable on next tick
    setTimeout(() => {
      const first = modalRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      first?.focus();
    }, 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  return (
    <div
      className="w-full relative z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Tabs defaultValue={`tab-${active}`} value={`tab-${active}`} onValueChange={(v) => {
        const index = Number(v.replace("tab-", ""));
        setActive(index);
      }}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left: image */}
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden relative" style={{ perspective: 1200 }}>
            {/* subtle section background to reflect innovation */}
            <img
              src={heroImage}
              alt="technology background"
              aria-hidden={true}
              className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              loading="lazy"
              decoding="async"
            />

            {items.map((it, idx) => {
              const direction = active === idx ? (prevActive < active || (prevActive === items.length - 1 && active === 0) ? 1 : -1) : 0;
              const isActive = active === idx;
              const base = "w-full h-64 md:h-80 bg-gray-100 object-cover absolute inset-0 transition-transform rounded-lg shadow-md hover:shadow-xl";
              const transformIn = reducedMotion ? "" : `rotateY(0deg)`;
              const transformOutLeft = reducedMotion ? "" : `rotateY(-90deg)`;
              const transformOutRight = reducedMotion ? "" : `rotateY(90deg)`;
              const startingTransform = prevActive < active ? transformOutRight : transformOutLeft;
              return (
                <div
                  key={idx}
                  aria-hidden={!isActive}
                  className={cn(base, isActive ? "opacity-100 z-10" : "opacity-0 z-0")}
                  style={{
                    transform: isActive ? transformIn : startingTransform,
                    transitionDuration: `${reducedMotion ? 0 : 700}ms`,
                    transitionProperty: "opacity, transform",
                    willChange: "opacity, transform",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={it.image || findImageForService(it.title)}
                    alt={it.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            })}
          </div>

          {/* Right: content */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <TabsList aria-label="Service categories" className="space-x-2 bg-background/80 backdrop-blur border border-border shadow-sm rounded-xl">
                {items.map((it, idx) => (
                  <TabsTrigger
                    key={idx}
                    value={`tab-${idx}`}
                    onClick={() => go(idx)}
                    className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">{it.icon}</div>
                      <div className="text-sm font-medium">{it.title}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center space-x-2">
                <button
                  className="p-2 rounded-md hover:bg-muted"
                  onClick={() => go((active - 1 + items.length) % items.length)}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-md hover:bg-muted"
                  onClick={() => go((active + 1) % items.length)}
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  role="tabpanel"
                  aria-hidden={active !== idx}
                  className={cn(
                    "",
                    active === idx ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 absolute inset-0"
                  )}
                  style={{
                    pointerEvents: active === idx ? undefined : "none",
                    minHeight: 160,
                    transitionDuration: `${reducedMotion ? 0 : 560}ms`,
                    transitionProperty: "opacity, transform",
                    willChange: "opacity, transform"
                  }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{it.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{it.description}</p>
                  <div>
                    <button onClick={() => openModal(idx)} className="inline-flex items-center text-primary font-medium">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex items-center space-x-2 mt-6">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Show ${idx + 1}`}
                  onClick={() => go(idx)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    active === idx ? "bg-primary scale-110" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </Tabs>

      {modalOpen && modalIndex != null && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className={cn("absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity", modalClosing ? "opacity-0" : "opacity-100")} onClick={closeModal} />
          <div ref={modalRef} className={cn("relative bg-background rounded-lg shadow-2xl max-w-4xl w-11/12 md:w-3/4 p-6 transform transition-all", modalClosing ? "opacity-0 scale-95" : "opacity-100 scale-100") }>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2 w-full h-64 bg-gray-100 rounded overflow-hidden">
                <img src={findImageForService(items[modalIndex].title, items[modalIndex].image)} alt={items[modalIndex].title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-2">{items[modalIndex].title}</h2>
                <p className="text-muted-foreground mb-4">{items[modalIndex].description || 'We provide comprehensive services tailored to your needs. Contact us for detailed proposals and project scoping.'}</p>
                <div className="flex justify-end gap-2">
                  <button onClick={closeModal} className="px-4 py-2 rounded-md bg-primary text-white">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </div>
  );
};

export default RotatingTabs;

