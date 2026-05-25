'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

const TOTAL_SLIDES = 8

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animClass, setAnimClass] = useState('')
  const isTransitioning = useRef(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
      })),
    []
  )

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning.current) return
      if (index === currentSlide || index < 0 || index >= TOTAL_SLIDES) return

      isTransitioning.current = true
      setIsAnimating(true)
      setAnimClass('slide-exit')

      setTimeout(() => {
        setCurrentSlide(index)
        setAnimClass('slide-enter')

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimClass('slide-visible')
            setTimeout(() => {
              setIsAnimating(false)
              isTransitioning.current = false
            }, 450)
          })
        })
      }, 300)
    },
    [currentSlide]
  )

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prevSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  const touchStart = useRef<number | null>(null)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }, [])
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) return
      const diff = touchStart.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide()
        else prevSlide()
      }
      touchStart.current = null
    },
    [nextSlide, prevSlide]
  )

  return (
    <div
      className="presentation-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-gradient">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="slide-counter">
        <span className="counter-current">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="counter-separator">/</span>
        <span className="counter-total">{String(TOTAL_SLIDES).padStart(2, '0')}</span>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%` }}
        />
      </div>

      <div className="slide-viewport">
        <div key={currentSlide} className={`slide-content ${animClass}`}>
          {currentSlide === 0 && <CoverSlide onNext={nextSlide} />}
          {currentSlide === 1 && <WhatSlide />}
          {currentSlide === 2 && <MissionSlide />}
          {currentSlide === 3 && <VisionSlide />}
          {currentSlide === 4 && <ValuesSlide />}
          {currentSlide === 5 && <StructureSlide />}
          {currentSlide === 6 && <OrgChartSlide />}
          {currentSlide === 7 && <ClosingSlide />}
        </div>
      </div>

      <div className="nav-controls">
        <button
          className="nav-btn"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          aria-label="Diapositiva anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="nav-dots">
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === currentSlide ? 'active' : ''} ${i < currentSlide ? 'visited' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Ir a diapositiva ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="nav-btn"
          onClick={nextSlide}
          disabled={currentSlide === TOTAL_SLIDES - 1}
          aria-label="Siguiente diapositiva"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          overflow: hidden;
          height: 100%;
          -webkit-tap-highlight-color: transparent;
        }

        .presentation-container {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          position: relative;
          font-family: 'Poppins', sans-serif;
          background: #0a0a0f;
          color: #ffffff;
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: floatOrb 12s ease-in-out infinite;
        }

        .orb-1 {
          width: 40vw; height: 40vw;
          max-width: 500px; max-height: 500px;
          background: radial-gradient(circle, #0d9488, transparent);
          top: -10%; right: -10%;
        }
        .orb-2 {
          width: 35vw; height: 35vw;
          max-width: 400px; max-height: 400px;
          background: radial-gradient(circle, #14b8a6, transparent);
          bottom: -10%; left: -10%;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 30vw; height: 30vw;
          max-width: 350px; max-height: 350px;
          background: radial-gradient(circle, #5eead4, transparent);
          top: 40%; left: 40%;
          animation-delay: -8s;
          opacity: 0.2;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 30px) scale(1.02); }
        }

        .particles-container {
          position: absolute; inset: 0;
          z-index: 1; pointer-events: none;
        }
        .particle {
          position: absolute;
          background: rgba(94, 234, 212, 0.3);
          border-radius: 50%;
          animation: particleFloat 8s ease-in-out infinite;
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-15px); opacity: 0.2; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.5; }
        }

        .slide-counter {
          position: fixed; top: 1.25rem; right: 1.25rem; z-index: 100;
          font-size: 0.8rem; font-weight: 600;
          display: flex; align-items: baseline; gap: 0.3rem;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          padding: 0.4rem 0.8rem; border-radius: 2rem;
          border: 1px solid rgba(255,255,255,0.1);
        }
        @media (min-width: 768px) {
          .slide-counter { top: 2rem; right: 2rem; font-size: 0.9rem; padding: 0.5rem 1rem; }
        }
        .counter-current { font-size: 1.1rem; color: #5eead4; }
        .counter-separator { color: rgba(255,255,255,0.3); }
        .counter-total { color: rgba(255,255,255,0.4); }

        .progress-bar-container {
          position: fixed; top: 0; left: 0; right: 0;
          height: 3px; background: rgba(255,255,255,0.05); z-index: 100;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #0d9488, #5eead4);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 10px rgba(94, 234, 212, 0.5);
        }

        .slide-viewport {
          position: relative; z-index: 10;
          width: 100%; height: 100vh; height: 100dvh;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        @media (min-width: 768px) { .slide-viewport { padding: 2rem; } }

        /* ===== TRANSITIONS ===== */
        .slide-content {
          width: 100%; max-width: 1100px;
          max-height: calc(100dvh - 100px);
          overflow-y: auto; overflow-x: hidden;
          display: flex; flex-direction: column; justify-content: center;
          will-change: opacity; opacity: 1; transform: none;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-content.slide-exit { opacity: 0; }
        .slide-content.slide-enter { opacity: 0; }
        .slide-content.slide-visible { opacity: 1; }
        .slide-content::-webkit-scrollbar { width: 4px; }
        .slide-content::-webkit-scrollbar-track { background: transparent; }
        .slide-content::-webkit-scrollbar-thumb { background: rgba(94, 234, 212, 0.2); border-radius: 4px; }

        /* ===== NAVIGATION ===== */
        .nav-controls {
          position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);
          z-index: 100; display: flex; align-items: center; gap: 0.75rem;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          padding: 0.5rem 1rem; border-radius: 3rem;
          border: 1px solid rgba(255,255,255,0.1);
          max-width: calc(100vw - 2rem);
        }
        @media (min-width: 768px) {
          .nav-controls { bottom: 2rem; gap: 1.5rem; padding: 0.75rem 1.5rem; }
        }
        .nav-btn {
          background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; padding: 0.5rem; border-radius: 50%;
          transition: all 0.3s ease; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .nav-btn:hover:not(:disabled) { color: #5eead4; background: rgba(94, 234, 212, 0.1); }
        .nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .nav-dots { display: flex; gap: 0.35rem; align-items: center; max-width: 200px; }
        @media (min-width: 768px) { .nav-dots { gap: 0.5rem; max-width: none; } }
        .nav-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: none; cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 0; flex-shrink: 0;
        }
        @media (min-width: 768px) { .nav-dot { width: 8px; height: 8px; } }
        .nav-dot.active {
          width: 24px; border-radius: 4px;
          background: linear-gradient(90deg, #0d9488, #5eead4);
          box-shadow: 0 0 12px rgba(94, 234, 212, 0.4);
        }
        @media (min-width: 768px) { .nav-dot.active { width: 28px; } }
        .nav-dot.visited { background: rgba(94, 234, 212, 0.4); }
        .nav-dot:hover:not(.active) { background: rgba(255,255,255,0.4); transform: scale(1.3); }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        /* ===== SHARED ===== */
        .slide-tag {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          background: rgba(94, 234, 212, 0.1);
          border: 1px solid rgba(94, 234, 212, 0.2);
          border-radius: 2rem; font-size: 0.65rem; font-weight: 600;
          color: #5eead4; text-transform: uppercase; letter-spacing: 0.1em;
          animation: fadeInDown 0.4s ease both;
        }
        @media (min-width: 768px) {
          .slide-tag { font-size: 0.75rem; padding: 0.4rem 1rem; gap: 0.5rem; }
        }
        .slide-title {
          font-family: 'Playfair Display', serif; font-weight: 800; line-height: 1.1;
          animation: fadeInUp 0.5s ease both; animation-delay: 0.06s;
        }
        .slide-subtitle {
          font-size: 0.9rem; color: rgba(255,255,255,0.6); font-weight: 300;
          line-height: 1.7; animation: fadeInUp 0.5s ease both; animation-delay: 0.12s;
        }
        @media (min-width: 768px) { .slide-subtitle { font-size: 1.1rem; } }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1rem; padding: 1.25rem;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        @media (min-width: 768px) { .glass-card { padding: 1.5rem; } }
        .glass-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(94, 234, 212, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(94, 234, 212, 0.1);
        }

        .icon-circle {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; flex-shrink: 0;
        }
        @media (min-width: 768px) { .icon-circle { width: 48px; height: 48px; font-size: 1.3rem; } }

        /* ===== COVER ===== */
        .cover-slide {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 1rem; padding: 1rem 0;
        }
        @media (min-width: 768px) { .cover-slide { gap: 1.5rem; } }

        .cover-logo {
          width: 90px; height: 90px; border-radius: 50%; object-fit: cover;
          border: 3px solid rgba(94, 234, 212, 0.3);
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          box-shadow: 0 0 40px rgba(94, 234, 212, 0.2);
        }
        @media (min-width: 768px) { .cover-logo { width: 120px; height: 120px; } }

        .cover-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 6vw, 4.5rem); font-weight: 900;
          line-height: 1.05; animation: fadeInUp 0.6s ease both; animation-delay: 0.12s;
        }
        .cover-title .highlight {
          background: linear-gradient(135deg, #5eead4, #14b8a6, #0d9488);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cover-subtitle {
          font-size: clamp(0.85rem, 2.5vw, 1.2rem); color: rgba(255,255,255,0.5);
          font-weight: 400; animation: fadeInUp 0.6s ease both; animation-delay: 0.2s;
          letter-spacing: 0.03em; max-width: 500px;
        }
        .cover-tagline {
          font-size: 1rem; color: rgba(255,255,255,0.4); font-weight: 300;
          font-style: italic; animation: fadeInUp 0.6s ease both; animation-delay: 0.28s;
          letter-spacing: 0.05em;
        }
        @media (min-width: 768px) { .cover-tagline { font-size: 1.2rem; } }

        .cover-decoration {
          display: flex; gap: 0.5rem;
          animation: fadeInUp 0.6s ease both; animation-delay: 0.35s;
        }
        .cover-decoration span {
          width: 8px; height: 8px; border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        .cover-decoration span:nth-child(1) { background: #0d9488; }
        .cover-decoration span:nth-child(2) { background: #14b8a6; animation-delay: 0.3s; }
        .cover-decoration span:nth-child(3) { background: #5eead4; animation-delay: 0.6s; }

        .cover-start { margin-top: 0.5rem; animation: fadeInUp 0.6s ease both; animation-delay: 0.42s; }
        @media (min-width: 768px) { .cover-start { margin-top: 1rem; } }
        .cover-start-btn {
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.15), rgba(13, 148, 136, 0.15));
          border: 1px solid rgba(94, 234, 212, 0.3); color: #5eead4;
          padding: 0.65rem 1.5rem; border-radius: 3rem; font-size: 0.8rem;
          font-weight: 600; cursor: pointer; transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif; letter-spacing: 0.05em;
        }
        @media (min-width: 768px) { .cover-start-btn { padding: 0.75rem 2rem; font-size: 0.9rem; } }
        .cover-start-btn:hover {
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.25), rgba(13, 148, 136, 0.25));
          border-color: rgba(94, 234, 212, 0.5); transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(94, 234, 212, 0.2);
        }

        /* ===== WHAT SLIDE ===== */
        .what-intro {
          display: grid; grid-template-columns: 1fr; gap: 0.75rem;
          margin-top: 1rem;
        }
        @media (min-width: 640px) {
          .what-intro { grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.25rem; }
        }
        .what-axis {
          display: flex; gap: 0.75rem; align-items: flex-start;
          animation: fadeInLeft 0.45s ease both;
        }
        .what-axis:nth-child(1) { animation-delay: 0.08s; }
        .what-axis:nth-child(2) { animation-delay: 0.12s; }
        .what-axis:nth-child(3) { animation-delay: 0.16s; }
        .what-axis-icon {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.15), rgba(13, 148, 136, 0.15));
          border: 1px solid rgba(94, 234, 212, 0.15);
        }
        @media (min-width: 768px) {
          .what-axis-icon { width: 48px; height: 48px; border-radius: 14px; font-size: 1.4rem; }
        }
        .what-axis-text h3 { font-size: 0.85rem; font-weight: 700; margin-bottom: 0.2rem; color: #5eead4; }
        @media (min-width: 768px) { .what-axis-text h3 { font-size: 0.95rem; } }
        .what-axis-text p { font-size: 0.75rem; color: rgba(255,255,255,0.5); line-height: 1.5; }
        @media (min-width: 768px) { .what-axis-text p { font-size: 0.82rem; } }

        .what-section-label {
          margin-top: 1.5rem; margin-bottom: 0.75rem;
          font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.15em;
          animation: fadeInUp 0.4s ease both; animation-delay: 0.2s;
        }
        @media (min-width: 768px) {
          .what-section-label { margin-top: 2rem; margin-bottom: 1rem; font-size: 0.75rem; }
        }

        .what-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (min-width: 640px) { .what-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; } }
        @media (min-width: 1024px) { .what-grid { grid-template-columns: repeat(6, 1fr); } }

        .what-service {
          animation: fadeInUp 0.4s ease both;
          text-align: center; padding: 1rem 0.5rem;
        }
        .what-service:nth-child(1) { animation-delay: 0.22s; }
        .what-service:nth-child(2) { animation-delay: 0.25s; }
        .what-service:nth-child(3) { animation-delay: 0.28s; }
        .what-service:nth-child(4) { animation-delay: 0.31s; }
        .what-service:nth-child(5) { animation-delay: 0.34s; }
        .what-service:nth-child(6) { animation-delay: 0.37s; }

        @media (min-width: 768px) { .what-service { padding: 1.25rem 0.75rem; } }

        .what-service .icon-circle {
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.12), rgba(13, 148, 136, 0.12));
          margin: 0 auto 0.5rem;
        }
        .what-service h4 {
          font-size: 0.72rem; font-weight: 700; color: #ffffff; margin-bottom: 0.25rem;
          line-height: 1.3;
        }
        @media (min-width: 768px) { .what-service h4 { font-size: 0.8rem; } }
        .what-service p {
          font-size: 0.65rem; color: rgba(255,255,255,0.45); line-height: 1.4;
          display: none;
        }
        @media (min-width: 768px) { .what-service p { display: block; font-size: 0.7rem; } }

        /* ===== MISSION ===== */
        .mission-content {
          display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;
        }
        @media (min-width: 768px) { .mission-content { gap: 1.5rem; margin-top: 2rem; } }

        .mission-point {
          display: flex; gap: 1rem; align-items: flex-start;
          animation: fadeInLeft 0.45s ease both;
        }
        .mission-point:nth-child(1) { animation-delay: 0.08s; }
        .mission-point:nth-child(2) { animation-delay: 0.16s; }
        .mission-point:nth-child(3) { animation-delay: 0.24s; }

        .mission-icon {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.12), rgba(13, 148, 136, 0.12));
          border: 1px solid rgba(94, 234, 212, 0.15);
        }
        @media (min-width: 768px) {
          .mission-icon { width: 52px; height: 52px; border-radius: 16px; font-size: 1.5rem; }
        }
        .mission-text h3 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.3rem; color: #5eead4; }
        @media (min-width: 768px) { .mission-text h3 { font-size: 1rem; } }
        .mission-text p { font-size: 0.82rem; color: rgba(255,255,255,0.6); line-height: 1.7; }
        @media (min-width: 768px) { .mission-text p { font-size: 0.9rem; } }

        /* ===== VISION ===== */
        .vision-center {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; margin-top: 1.5rem; gap: 1.5rem;
        }
        @media (min-width: 768px) { .vision-center { margin-top: 2.5rem; gap: 2rem; } }

        .vision-cards { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; }
        @media (min-width: 768px) { .vision-cards { gap: 1.5rem; } }

        .vision-card {
          position: relative; width: 100%; max-width: 750px; margin: 0 auto;
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .vision-card:nth-child(1) { animation-delay: 0.1s; }
        .vision-card:nth-child(2) { animation-delay: 0.2s; }
        .vision-card::before {
          content: '\\201C'; position: absolute; top: -0.5rem; left: 0.75rem;
          font-family: 'Playfair Display', serif; font-size: 3rem;
          color: rgba(94, 234, 212, 0.2); line-height: 1;
        }
        @media (min-width: 768px) { .vision-card::before { font-size: 5rem; left: 0; } }
        .vision-card p {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.95rem, 2.5vw, 1.35rem);
          font-weight: 500; line-height: 1.65; color: rgba(255,255,255,0.85);
          font-style: italic;
        }

        .vision-pillars {
          display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;
          animation: fadeInUp 0.45s ease both; animation-delay: 0.3s;
        }
        .vision-pillar {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(94, 234, 212, 0.08);
          border: 1px solid rgba(94, 234, 212, 0.15);
          border-radius: 2rem; font-size: 0.75rem; color: rgba(255,255,255,0.7);
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .vision-pillar { gap: 0.6rem; padding: 0.6rem 1.2rem; font-size: 0.85rem; }
        }
        .vision-pillar:hover {
          background: rgba(94, 234, 212, 0.15);
          border-color: rgba(94, 234, 212, 0.3); transform: translateY(-2px);
        }
        .vision-pillar span { font-size: 1rem; }
        @media (min-width: 768px) { .vision-pillar span { font-size: 1.1rem; } }

        /* ===== VALUES ===== */
        .values-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem; margin-top: 1.25rem;
        }
        @media (min-width: 640px) { .values-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; } }
        @media (min-width: 1024px) { .values-grid { grid-template-columns: repeat(5, 1fr); gap: 1.25rem; } }

        .value-card {
          text-align: center; padding: 1.25rem 0.75rem;
          animation: scaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .value-card:nth-child(1) { animation-delay: 0.08s; }
        .value-card:nth-child(2) { animation-delay: 0.12s; }
        .value-card:nth-child(3) { animation-delay: 0.16s; }
        .value-card:nth-child(4) { animation-delay: 0.2s; }
        .value-card:nth-child(5) { animation-delay: 0.24s; }
        @media (min-width: 768px) { .value-card { padding: 2rem 1.25rem; } }

        .value-emoji {
          font-size: 2rem; margin-bottom: 0.75rem; display: block;
          animation: breathe 3s ease-in-out infinite;
        }
        @media (min-width: 768px) { .value-emoji { font-size: 2.5rem; margin-bottom: 1rem; } }
        .value-name { font-size: 0.82rem; font-weight: 700; color: #5eead4; margin-bottom: 0.35rem; }
        @media (min-width: 768px) { .value-name { font-size: 1rem; margin-bottom: 0.5rem; } }
        .value-desc { font-size: 0.7rem; color: rgba(255,255,255,0.5); line-height: 1.5; }
        @media (min-width: 768px) { .value-desc { font-size: 0.8rem; } }

        /* ===== STRUCTURE ===== */
        .structure-tabs {
          display: flex; gap: 0.5rem; margin-top: 1.25rem; margin-bottom: 1rem;
          animation: fadeInUp 0.5s ease both; animation-delay: 0.1s;
          flex-wrap: wrap;
        }
        @media (min-width: 768px) {
          .structure-tabs { margin-top: 2rem; margin-bottom: 1.5rem; gap: 0.75rem; }
        }
        .structure-tab {
          padding: 0.45rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }
        @media (min-width: 768px) { .structure-tab { padding: 0.5rem 1.25rem; font-size: 0.85rem; } }
        .structure-tab.active {
          background: rgba(94, 234, 212, 0.12);
          border-color: rgba(94, 234, 212, 0.3); color: #5eead4;
        }
        .structure-tab:hover:not(.active) { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }

        .structure-content { animation: fadeInUp 0.4s ease both; animation-delay: 0.15s; }

        .structure-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .structure-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.85rem 1rem; border-radius: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) { .structure-item { padding: 1rem 1.25rem; } }
        .structure-item:hover {
          background: rgba(94, 234, 212, 0.06);
          border-color: rgba(94, 234, 212, 0.15); transform: translateX(6px);
        }
        .structure-item-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; background: rgba(94, 234, 212, 0.1); flex-shrink: 0;
        }
        @media (min-width: 768px) { .structure-item-icon { width: 40px; height: 40px; font-size: 1.2rem; } }
        .structure-item-text h4 { font-size: 0.82rem; font-weight: 600; margin-bottom: 0.15rem; }
        @media (min-width: 768px) { .structure-item-text h4 { font-size: 0.9rem; } }
        .structure-item-text p { font-size: 0.72rem; color: rgba(255,255,255,0.45); line-height: 1.4; }
        @media (min-width: 768px) { .structure-item-text p { font-size: 0.78rem; } }

        /* ===== ORG CHART ===== */
        .orgchart-container {
          display: flex; flex-direction: column; align-items: center;
          margin-top: 1.25rem; gap: 0;
        }
        @media (min-width: 768px) { .orgchart-container { margin-top: 2rem; } }

        .org-level {
          display: flex; justify-content: center; gap: 0.75rem;
          position: relative; animation: fadeInUp 0.45s ease both; flex-wrap: wrap;
        }
        @media (min-width: 768px) { .org-level { gap: 1.5rem; } }
        .org-level:nth-child(1) { animation-delay: 0.08s; }
        .org-level:nth-child(3) { animation-delay: 0.16s; }
        .org-level:nth-child(5) { animation-delay: 0.24s; }

        .org-node {
          padding: 0.75rem 1rem; border-radius: 0.75rem;
          text-align: center; min-width: 110px;
          transition: transform 0.3s ease; font-size: 0.75rem;
        }
        @media (min-width: 768px) {
          .org-node { padding: 1rem 1.5rem; min-width: 150px; font-size: inherit; }
        }
        .org-node:hover { transform: translateY(-4px); }

        .org-node-top {
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          color: #ffffff; font-weight: 700; font-size: 0.85rem;
          box-shadow: 0 4px 20px rgba(13, 148, 136, 0.3);
        }
        @media (min-width: 768px) { .org-node-top { font-size: 1rem; } }

        .org-node-mid {
          background: rgba(94, 234, 212, 0.1);
          border: 1px solid rgba(94, 234, 212, 0.2);
          color: #5eead4; font-weight: 600; font-size: 0.8rem;
        }
        @media (min-width: 768px) { .org-node-mid { font-size: 0.9rem; } }

        .org-node-bottom {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7); font-weight: 500; font-size: 0.7rem;
        }
        @media (min-width: 768px) { .org-node-bottom { font-size: 0.85rem; } }

        .org-connector {
          width: 2px; height: 18px;
          background: linear-gradient(180deg, rgba(94, 234, 212, 0.4), rgba(94, 234, 212, 0.1));
          margin: 0 auto; animation: fadeInUp 0.4s ease both;
        }
        .org-connector:nth-child(2) { animation-delay: 0.12s; }
        .org-connector:nth-child(4) { animation-delay: 0.2s; }
        @media (min-width: 768px) { .org-connector { height: 22px; } }

        /* ===== CLOSING ===== */
        .closing-slide {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 1rem; padding: 1rem 0;
        }
        @media (min-width: 768px) { .closing-slide { gap: 1.5rem; } }

        .closing-heart { font-size: 3rem; animation: pulse 2s ease-in-out infinite; }
        @media (min-width: 768px) { .closing-heart { font-size: 4rem; } }

        .closing-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800;
          animation: fadeInUp 0.5s ease both; animation-delay: 0.1s;
        }
        .closing-title .highlight {
          background: linear-gradient(135deg, #5eead4, #14b8a6, #0d9488);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .closing-quote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.9rem, 2.5vw, 1.2rem);
          font-style: italic; color: rgba(255,255,255,0.6);
          max-width: 500px; line-height: 1.7;
          animation: fadeInUp 0.5s ease both; animation-delay: 0.2s;
          position: relative; padding: 1.5rem;
        }
        .closing-quote::before {
          content: '\\201C'; position: absolute; top: -0.2rem; left: 0;
          font-family: 'Playfair Display', serif; font-size: 3rem;
          color: rgba(94, 234, 212, 0.2); line-height: 1;
        }
        .closing-info { animation: fadeInUp 0.5s ease both; animation-delay: 0.25s; }
        .closing-info-item {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.8rem; color: rgba(255,255,255,0.5);
          margin-bottom: 0.4rem; justify-content: center;
        }
        @media (min-width: 768px) {
          .closing-info-item { font-size: 0.9rem; gap: 0.6rem; margin-bottom: 0.5rem; }
        }
        .closing-info-item span:first-child { font-size: 1rem; }
        @media (min-width: 768px) { .closing-info-item span:first-child { font-size: 1.1rem; } }
        .closing-hashtag {
          font-size: 0.8rem; color: #5eead4; font-weight: 600;
          letter-spacing: 0.05em; animation: fadeInUp 0.5s ease both; animation-delay: 0.3s;
        }
        @media (min-width: 768px) { .closing-hashtag { font-size: 0.85rem; } }
        .closing-dots {
          display: flex; gap: 0.5rem;
          animation: fadeInUp 0.5s ease both; animation-delay: 0.35s;
        }
        .closing-dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(94, 234, 212, 0.4); animation: breathe 2s ease-in-out infinite;
        }
        .closing-dots span:nth-child(2) { animation-delay: 0.5s; }
        .closing-dots span:nth-child(3) { animation-delay: 1s; }
      `}</style>
    </div>
  )
}

/* ==================== SLIDE COMPONENTS ==================== */

function CoverSlide({ onNext }: { onNext: () => void }) {
  return (
    <div className="cover-slide">
      <img src="/kavac-logo.png" alt="Centro de Atención Kavac" className="cover-logo" />
      <h1 className="cover-title">
        Informe de Pasantías:<br />
        Centro <span className="highlight">Kavac</span>
      </h1>
      <p className="cover-subtitle">
        Estructura Organizacional y Filosofía Institucional
      </p>
      <p className="cover-tagline">Un Espacio para Crecer</p>
      <div className="cover-decoration">
        <span />
        <span />
        <span />
      </div>
      <div className="cover-start">
        <button className="cover-start-btn" onClick={onNext}>
          Comenzar Presentación →
        </button>
      </div>
    </div>
  )
}

function WhatSlide() {
  const axes = [
    {
      icon: '🏥',
      title: 'Atención Clínica',
      desc: 'Servicios especializados en prevención y rehabilitación.',
    },
    {
      icon: '🧭',
      title: 'Orientación',
      desc: 'Apoyo continuo a familias, instituciones y a la comunidad.',
    },
    {
      icon: '🤲',
      title: 'Inclusión',
      desc: 'Oportunidades para el desarrollo humano pleno e integración social.',
    },
  ]

  const services = [
    { icon: '🧠', title: 'Psicología Clínica', desc: 'Enfoques terapéuticos para necesidades emocionales y conductuales.' },
    { icon: '✋', title: 'Terapia Ocupacional', desc: 'Rehabilitación y desarrollo de habilidades funcionales.' },
    { icon: '📚', title: 'Psicopedagogía', desc: 'Evaluación e intervención en dificultades de aprendizaje.' },
    { icon: '👨‍👩‍👧‍👦', title: 'Orientación Familiar', desc: 'Estrategias de regulación emocional y crianza respetuosa.' },
    { icon: '💊', title: 'Psiquiatría', desc: 'Diagnóstico y tratamiento médico integral en salud mental.' },
    { icon: '🗣️', title: 'Terapia del Lenguaje', desc: 'Intervención en trastornos de la comunicación.' },
  ]

  return (
    <div>
      <div className="slide-tag">📌 Institución</div>
      <h2
        className="slide-title"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}
      >
        ¿Qué es el Centro <span style={{ color: '#5eead4' }}>Kavac</span>?
      </h2>
      <p className="slide-subtitle" style={{ maxWidth: '650px' }}>
        Es una institución dedicada al{' '}
        <strong style={{ color: 'rgba(255,255,255,0.85)' }}>abordaje integral y terapéutico</strong>{' '}
        de niños, adolescentes y adultos.
      </p>

      {/* 3 main axes from prima's info */}
      <div className="what-intro">
        {axes.map((a, i) => (
          <div key={i} className="what-axis">
            <div className="what-axis-icon">{a.icon}</div>
            <div className="what-axis-text">
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 6 detailed services from original */}
      <div className="what-section-label">Servicios Especializados</div>
      <div className="what-grid">
        {services.map((s, i) => (
          <div key={i} className="what-service glass-card">
            <div className="icon-circle">{s.icon}</div>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MissionSlide() {
  const points = [
    {
      icon: '⭐',
      title: 'Atención Integral',
      text: 'Brindar atención integral a niños, adolescentes y adultos a través de la orientación clínica, la prevención y la rehabilitación.',
    },
    {
      icon: '🔗',
      title: 'Interconsulta',
      text: 'Promover la interconsulta como la herramienta clave para lograr intervenciones eficaces.',
    },
    {
      icon: '👏',
      title: 'Inclusión y Desarrollo',
      text: 'Generar espacios de inclusión que impulsen el desarrollo humano pleno, educando en emociones, valores y habilidades, respetando siempre la individualidad de cada ser.',
    },
  ]

  return (
    <div>
      <div className="slide-tag">🎯 Misión</div>
      <h2
        className="slide-title"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}
      >
        Nuestra <span style={{ color: '#5eead4' }}>Misión</span>
      </h2>
      <p className="slide-subtitle" style={{ maxWidth: '600px' }}>
        Ir más allá de lo académico, es educar en emociones, valores y habilidades, respetando la
        individualidad del ser.
      </p>
      <div className="mission-content">
        {points.map((p, i) => (
          <div key={i} className="mission-point glass-card">
            <div className="mission-icon">{p.icon}</div>
            <div className="mission-text">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisionSlide() {
  return (
    <div>
      <div className="slide-tag">🔭 Visión</div>
      <h2
        className="slide-title"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}
      >
        Nuestra <span style={{ color: '#5eead4' }}>Visión</span>
      </h2>
      <div className="vision-center">
        <div className="vision-cards">
          <div className="vision-card glass-card">
            <p>
              Ser un centro de referencia en la atención integral y terapéutica, reconocido por ir
              más allá de lo académico y convencional.
            </p>
          </div>
          <div className="vision-card glass-card">
            <p>
              Consolidar un modelo de intervención interdisciplinario (interconsulta) que trascienda
              e impacte positivamente en las familias y las instituciones, logrando una sociedad más
              inclusiva y empática con la diversidad del desarrollo humano.
            </p>
          </div>
        </div>
        <div className="vision-pillars">
          <div className="vision-pillar"><span>🌍</span> Centro de referencia</div>
          <div className="vision-pillar"><span>🤝</span> Interdisciplinario</div>
          <div className="vision-pillar"><span>💚</span> Empatía</div>
          <div className="vision-pillar"><span>✨</span> Inclusión</div>
        </div>
      </div>
    </div>
  )
}

function ValuesSlide() {
  const values = [
    {
      emoji: '🔄',
      name: 'Integralidad',
      desc: 'Abordaje completo del individuo (emociones, habilidades y salud).',
    },
    {
      emoji: '🦋',
      name: 'Individualidad',
      desc: 'Respeto absoluto al ritmo, esencia y necesidades de cada persona.',
    },
    {
      emoji: '🤝',
      name: 'Colaboración',
      desc: 'Trabajo en equipo entre especialistas (interconsulta) para el éxito terapéutico.',
    },
    {
      emoji: '❤️',
      name: 'Empatía y Calidez',
      desc: 'Educación y atención basada en las emociones y el desarrollo humano.',
    },
    {
      emoji: '🌱',
      name: 'Compromiso Social',
      desc: 'Promoción de la inclusión en la población general.',
    },
  ]

  return (
    <div>
      <div className="slide-tag">💎 Valores</div>
      <h2
        className="slide-title"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}
      >
        Valores <span style={{ color: '#5eead4' }}>Fundamentales</span>
      </h2>
      <p className="slide-subtitle" style={{ maxWidth: '600px' }}>
        Los principios que guían cada una de nuestras acciones y decisiones.
      </p>
      <div className="values-grid">
        {values.map((v, i) => (
          <div key={i} className="value-card glass-card">
            <span className="value-emoji" style={{ animationDelay: `${i * 0.5}s` }}>
              {v.emoji}
            </span>
            <div className="value-name">{v.name}</div>
            <div className="value-desc">{v.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StructureSlide() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      label: 'Administración',
      desc: 'Eje Directivo y Administrativo: encargado de la gestión de recursos, planificación estratégica y soporte operativo del centro.',
      items: [
        { icon: '📊', name: 'Gestión Administrativa', desc: 'Manejo de recursos financieros y operativos del centro' },
        { icon: '📋', name: 'Planificación Estratégica', desc: 'Diseño y seguimiento de objetivos institucionales' },
        { icon: '📎', name: 'Recursos Humanos', desc: 'Gestión del talento humano y bienestar del equipo' },
        { icon: '💻', name: 'Sistemas y Registro', desc: 'Control de expedientes clínicos y datos de pacientes' },
      ],
    },
    {
      label: 'Coordinación',
      desc: 'Eje de Coordinación: enlace clave que supervisa la gestión clínica, asegura la calidad del servicio y fomenta la práctica de la interconsulta.',
      items: [
        { icon: '🔗', name: 'Coordinación Clínica', desc: 'Articulación entre especialidades para atención integral' },
        { icon: '📅', name: 'Programación de Citas', desc: 'Organización de agendas y flujo de pacientes' },
        { icon: '🤝', name: 'Interconsulta', desc: 'Promoción de la interconsulta como herramienta de intervención' },
        { icon: '📈', name: 'Seguimiento de Casos', desc: 'Monitoreo continuo del progreso terapéutico' },
      ],
    },
    {
      label: 'Especialidades',
      desc: 'Eje de Especialidades (Área Clínica): cuerpo profesional encargado de la atención directa, evaluación y tratamiento de los usuarios.',
      items: [
        { icon: '🧠', name: 'Psicología Clínica', desc: 'Enfoques terapéuticos para necesidades emocionales y conductuales' },
        { icon: '✋', name: 'Terapia Ocupacional', desc: 'Desarrollo de habilidades funcionales e integración' },
        { icon: '📚', name: 'Psicopedagogía', desc: 'Intervención en dificultades de aprendizaje' },
        { icon: '💊', name: 'Psiquiatría', desc: 'Diagnóstico y tratamiento médico en salud mental' },
        { icon: '🗣️', name: 'Terapia del Lenguaje', desc: 'Intervención en trastornos de comunicación' },
        { icon: '👨‍👩‍👧‍👦', name: 'Orientación Familiar', desc: 'Estrategias de crianza y regulación emocional' },
      ],
    },
  ]

  return (
    <div>
      <div className="slide-tag">🏗️ Estructura</div>
      <h2
        className="slide-title"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}
      >
        Estructura y <span style={{ color: '#5eead4' }}>Departamentos</span>
      </h2>
      <p className="slide-subtitle" style={{ maxWidth: '600px' }}>
        Tres ejes fundamentales sostienen el funcionamiento del Centro Kavac.
      </p>
      <div className="structure-tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`structure-tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="structure-content" key={activeTab}>
        <p style={{
          fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6, marginBottom: '0.75rem', fontStyle: 'italic',
        }}>
          {tabs[activeTab].desc}
        </p>
        <div className="structure-list">
          {tabs[activeTab].items.map((item, i) => (
            <div key={i} className="structure-item">
              <div className="structure-item-icon">{item.icon}</div>
              <div className="structure-item-text">
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrgChartSlide() {
  return (
    <div>
      <div className="slide-tag">🏢 Organigrama</div>
      <h2
        className="slide-title"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', marginTop: '0.5rem' }}
      >
        <span style={{ color: '#5eead4' }}>Organigrama</span> Institucional
      </h2>
      <p className="slide-subtitle">Estructura jerárquica del Centro de Atención Kavac.</p>
      <div className="orgchart-container">
        <div className="org-level">
          <div className="org-node org-node-top">🏛️ Administración</div>
        </div>
        <div className="org-connector" />
        <div className="org-level">
          <div className="org-node org-node-mid">🔗 Coordinación</div>
        </div>
        <div className="org-connector" />
        <div className="org-level">
          <div className="org-node org-node-bottom">🧠 Psicología</div>
          <div className="org-node org-node-bottom">✋ Terapia Ocupacional</div>
          <div className="org-node org-node-bottom">🗣️ Terapia del Lenguaje</div>
          <div className="org-node org-node-bottom">📚 Psicopedagogía</div>
          <div className="org-node org-node-bottom">💊 Psiquiatría</div>
          <div className="org-node org-node-bottom">👨‍👩‍👧‍👦 Orientación Familiar</div>
        </div>
      </div>
    </div>
  )
}

function ClosingSlide() {
  return (
    <div className="closing-slide">
      <div className="closing-heart">💚</div>
      <h2 className="closing-title">
        ¡<span className="highlight">Muchas Gracias</span>!
      </h2>
      <div className="closing-quote glass-card">
        <p>&ldquo;Educar en emociones, valores y habilidades, respetando la individualidad del ser.&rdquo;</p>
      </div>
      <div className="closing-info">
        <div className="closing-info-item"><span>📍</span> Los Colorados, Valencia, Estado Carabobo</div>
        <div className="closing-info-item"><span>🏫</span> Desde el corazón de la UE Kavac</div>
        <div className="closing-info-item"><span>📱</span> @centrokavac</div>
      </div>
      <div className="closing-hashtag">#UnEspacioParaCrecer</div>
      <div className="closing-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
