import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./TechCube.css";
import { categoryImages } from "@/lib/categoryImages";
import { Link } from "react-router-dom";

type Face = {
  key: string;
  title: string;
  tagline: string;
  image: string;
};

const faces: Face[] = [
  { key: "security", title: "Security Solutions", tagline: "CCTV, access control and integrated security.", image: categoryImages.security },
  { key: "consultancy", title: "Consultancy for Companies", tagline: "Business registration, compliance and tendering support.", image: categoryImages.consultancy },
  { key: "tendering", title: "Tendering & Procurement", tagline: "Professional bid management and procurement workflows.", image: categoryImages.tender },
  { key: "it", title: "IT Solutions", tagline: "Cloud, networks and enterprise-grade support.", image: categoryImages.it },
  { key: "electrical", title: "Electrical Installation", tagline: "Design, installation and maintenance services.", image: categoryImages.electrical },
  { key: "smart", title: "Smart Infrastructure", tagline: "IoT, automation and intelligent building systems.", image: categoryImages.smart }
];

const TechCube: React.FC = () => {
  // phases: rotate -> explode -> cards -> implode
  const [phase, setPhase] = useState<"rotate" | "explode" | "cards" | "implode">("rotate");
  const [paused, setPaused] = useState(false);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const cubeRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  const reducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Durations (ms)
  const rotateDuration = 12000; // one full rotation duration
  const explodeDuration = 700;
  const cardsDuration = 3800;
  const implodeDuration = 700;

  const clearTimers = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };

  // Phase loop
  useEffect(() => {
    if (paused || reducedMotion) return;
    clearTimers();

    if (phase === "rotate") {
      const t = window.setTimeout(() => setPhase("explode"), rotateDuration);
      timers.current.push(t);
    } else if (phase === "explode") {
      const t = window.setTimeout(() => setPhase("cards"), explodeDuration);
      timers.current.push(t);
    } else if (phase === "cards") {
      const t = window.setTimeout(() => setPhase("implode"), cardsDuration);
      timers.current.push(t);
    } else if (phase === "implode") {
      const t = window.setTimeout(() => setPhase("rotate"), implodeDuration);
      timers.current.push(t);
    }

    return () => clearTimers();
  }, [phase, paused, reducedMotion]);

  // Auto-advance activeIndex while rotating (for keyboard/dots UX)
  useEffect(() => {
    if (reducedMotion) return;
    if (paused) return;
    if (phase !== "rotate") return;
    if (manualIndex != null) return;
    const iv = window.setInterval(() => setActiveIndex((s) => (s + 1) % faces.length), 4000);
    return () => window.clearInterval(iv);
  }, [phase, manualIndex, paused, reducedMotion]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setManualIndex((m) => (m == null ? (activeIndex - 1 + faces.length) % faces.length : (m - 1 + faces.length) % faces.length));
      if (e.key === "ArrowRight") setManualIndex((m) => (m == null ? (activeIndex + 1) % faces.length : (m + 1) % faces.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex]);

  // if manualIndex set, reflect in activeIndex
  useEffect(() => { if (manualIndex != null) setActiveIndex(manualIndex); }, [manualIndex]);

  // when user selects a dot while in cards phase, scroll that card into view
  useEffect(() => {
    if (phase !== 'cards') return;
    if (manualIndex == null) return;
    scrollToCard(manualIndex);
  }, [manualIndex, phase]);

  const onEnter = () => { setPaused(true); };
  const onLeave = () => { setPaused(false); };

  // scroll helpers for the cards row (used during cards phase)
  const scrollCardsBy = (distance: number) => {
    const el = cardsRef.current;
    if (!el) return;
    try { el.scrollBy({ left: distance, behavior: 'smooth' }); } catch { el.scrollLeft += distance; }
  };

  const scrollToCard = (index: number) => {
    const el = cardsRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    const cardWidth = child.getBoundingClientRect().width;
    const containerWidth = el.getBoundingClientRect().width;
    const target = Math.max(0, Math.round((cardWidth * index) - (containerWidth - cardWidth) / 2));
    try { el.scrollTo({ left: target, behavior: 'smooth' }); } catch { el.scrollLeft = target; }
  };

  // compute face transforms for the exploded/cards layout
  const faceTransforms = useMemo(() => {
    const faceEl = cubeRef.current?.querySelector<HTMLDivElement>(".cube-face");
    const faceW = faceEl ? faceEl.clientWidth : 300;
    const gap = Math.round(faceW * 0.12) + 20;
    const cardSpacing = faceW + gap;
    return faces.map((_, i) => {
      const center = (faces.length - 1) / 2; // 2.5
      const offsetIndex = i - center;
      const offsetX = Math.round(offsetIndex * cardSpacing);
      if (phase === "rotate") return undefined;
      return `translateX(${offsetX}px) translateZ(0px) rotateY(0deg) rotateX(0deg)`;
    });
  }, [phase]);

  // inline style for cube when rotating: pass duration to CSS
  const cubeInlineStyle: React.CSSProperties = {};
  if (phase === "rotate") cubeInlineStyle["--rotate-duration" as any] = `${rotateDuration}ms`;

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    setPaused(true);
  };

  const closeModal = () => {
    setModalClosing(true);
    window.setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setModalIndex(null);
      setPaused(false);
    }, 200);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [modalOpen]);

  return (
    <div className="techcube-section" role="region" aria-label="Comprehensive Technology Solutions">
      <div className="section-title text-center mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">Comprehensive Technology Solutions — Innovating Your Business Landscape</h3>
      </div>

      <div className="techcube-box">
        <div className="cube-viewport">
          {/* 3D cube container */}
          <div
            ref={cubeRef}
            data-phase={phase}
            className={`cube ${phase === "rotate" && !reducedMotion && !paused ? "auto-rotate" : ""}`}
            style={cubeInlineStyle}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onFocus={onEnter}
            onBlur={onLeave}
          >
            {faces.map((f, i) => (
              <div
                key={f.key}
                className={`cube-face face-${i}`}
                style={{
                  backgroundImage: `url(${f.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: faceTransforms[i] ?? undefined,
                  transition: phase === 'rotate' ? undefined : 'transform 800ms cubic-bezier(.2,.9,.2,1), opacity 400ms ease',
                }}
                role="button"
                tabIndex={0}
                onClick={() => openModal(i)}
                onKeyDown={(e) => { if (e.key === 'Enter') openModal(i); }}
              >
                <div className="face-inner">
                  <div className="face-overlay">
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="text-sm mt-1">{f.tagline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay: horizontal scrollable cards displayed during exploded/cards phases */}
          {(phase === "explode" || phase === "cards" || phase === "implode") && (
            <div className={`cards-row-wrapper ${phase === 'cards' ? 'active' : ''}`}>
              <button aria-hidden={false} className="cards-scroll-btn left" onClick={() => scrollCardsBy(-320)} aria-label="Scroll left">‹</button>
              <div className="cards-row" ref={cardsRef} role="list" aria-label="Service cards">
                {faces.map((f, i) => (
                  <article key={f.key} role="listitem" className={`card`} tabIndex={0} onClick={() => openModal(i)} onKeyDown={(e) => { if (e.key === 'Enter') openModal(i); }}>
                    <div className="card-media" style={{ backgroundImage: `url(${f.image})` }} />
                    <div className="card-body">
                      <h3 className="card-title">{f.title}</h3>
                      <p className="card-tagline">{f.tagline}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button aria-hidden={false} className="cards-scroll-btn right" onClick={() => scrollCardsBy(320)} aria-label="Scroll right">›</button>
            </div>
          )}
        </div>
      </div>

      <div className="cube-shadow" aria-hidden={true} />

      <div className="cube-controls" role="tablist" aria-label="Cube controls">
        <button className="tc-dot" aria-label="previous" onClick={() => setManualIndex((m) => (m == null ? (activeIndex - 1 + faces.length) % faces.length : (m - 1 + faces.length) % faces.length))} />
        {faces.map((f, i) => (
          <button
            key={f.key}
            className={`tc-dot ${manualIndex === i ? "active" : ""}`}
            aria-label={`Show ${f.title}`}
            onClick={() => setManualIndex(i)}
          />
        ))}
        <button className="tc-dot" aria-label="next" onClick={() => setManualIndex((m) => (m == null ? (activeIndex + 1) % faces.length : (m + 1) % faces.length))} />
      </div>

      <div className="text-center mt-6">
        <Link to="/services" className="inline-flex items-center px-5 py-2 rounded-md bg-primary text-white font-medium shadow-sm hover:opacity-95" aria-label="Explore Services">
          Explore More
        </Link>
      </div>

      {modalOpen && modalIndex != null && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className={"absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity " + (modalClosing ? 'opacity-0' : 'opacity-100')} onClick={closeModal} />
          <div className={"relative bg-background rounded-lg shadow-2xl max-w-4xl w-11/12 md:w-3/4 p-6 transform transition-all " + (modalClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100')}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2 w-full h-64 bg-gray-100 rounded overflow-hidden">
                <img src={faces[modalIndex].image} alt={faces[modalIndex].title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-2">{faces[modalIndex].title}</h2>
                <p className="text-muted-foreground mb-4">{faces[modalIndex].tagline}</p>
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

export default TechCube;
