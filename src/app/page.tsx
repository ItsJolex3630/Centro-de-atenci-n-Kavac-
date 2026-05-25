'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

// Slide data
const SLIDES = [
  {
    id: 0,
    type: 'cover',
  },
  {
    id: 1,
    type: 'what',
  },
  {
    id: 2,
    type: 'mission',
  },
  {
    id: 3,
    type: 'vision',
  },
  {
    id: 4,
    type: 'values',
  },
  {
    id: 5,
    type: 'orgchart',
  },
  {
    id: 6,
    type: 'structure',
  },
  {
    id: 7,
    type: 'closing',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }))
  , [])

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide || index < 0 || index >= SLIDES.length) return
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSlide(index)
        setTimeout(() => setIsAnimating(false), 600)
      }, 100)
    },
    [currentSlide, isAnimating]
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

  return (
    <div className="presentation-container">
      {/* Animated background */}
      <div className="bg-gradient">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      {/* Floating particles */}
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

      {/* Slide counter */}
      <div className="slide-counter">
        <span className="counter-current">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="counter-separator">/</span>
        <span className="counter-total">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Main slide area */}
      <div className="slide-viewport">
        <div
          className="slide-content"
          style={{
            animation: isAnimating
              ? 'none'
              : 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          key={currentSlide}
        >
          {currentSlide === 0 && <CoverSlide onNext={nextSlide} />}
          {currentSlide === 1 && <WhatSlide />}
          {currentSlide === 2 && <MissionSlide />}
          {currentSlide === 3 && <VisionSlide />}
          {currentSlide === 4 && <ValuesSlide />}
          {currentSlide === 5 && <OrgChartSlide />}
          {currentSlide === 6 && <StructureSlide />}
          {currentSlide === 7 && <ClosingSlide />}
        </div>
      </div>

      {/* Navigation */}
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
          {SLIDES.map((_, i) => (
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
          disabled={currentSlide === SLIDES.length - 1}
          aria-label="Siguiente diapositiva"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .presentation-container {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          font-family: 'Poppins', sans-serif;
          background: #0a0a0f;
          color: #ffffff;
        }

        /* Animated gradient background */
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
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #0d9488, transparent);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #14b8a6, transparent);
          bottom: -100px;
          left: -100px;
          animation-delay: -4s;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #5eead4, transparent);
          top: 40%;
          left: 40%;
          animation-delay: -8s;
          opacity: 0.2;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 30px) scale(1.02); }
        }

        /* Particles */
        .particles-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
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

        /* Slide counter */
        .slide-counter {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 100;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: baseline;
          gap: 0.3rem;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .counter-current {
          font-size: 1.2rem;
          color: #5eead4;
        }

        .counter-separator {
          color: rgba(255,255,255,0.3);
        }

        .counter-total {
          color: rgba(255,255,255,0.4);
        }

        /* Progress bar */
        .progress-bar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.05);
          z-index: 100;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #0d9488, #5eead4);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 10px rgba(94, 234, 212, 0.5);
        }

        /* Slide viewport */
        .slide-viewport {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .slide-content {
          width: 100%;
          max-width: 1100px;
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Navigation */
        .nav-controls {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          padding: 0.75rem 1.5rem;
          border-radius: 3rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .nav-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover:not(:disabled) {
          color: #5eead4;
          background: rgba(94, 234, 212, 0.1);
        }

        .nav-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .nav-dots {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
        }

        .nav-dot.active {
          width: 28px;
          border-radius: 4px;
          background: linear-gradient(90deg, #0d9488, #5eead4);
          box-shadow: 0 0 12px rgba(94, 234, 212, 0.4);
        }

        .nav-dot.visited {
          background: rgba(94, 234, 212, 0.4);
        }

        .nav-dot:hover:not(.active) {
          background: rgba(255,255,255,0.4);
          transform: scale(1.3);
        }

        /* ==================== SLIDE STYLES ==================== */

        /* Shared animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes rotate360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(94, 234, 212, 0.1); }
          50% { box-shadow: 0 0 20px rgba(94, 234, 212, 0.3); }
        }

        .slide-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: rgba(94, 234, 212, 0.1);
          border: 1px solid rgba(94, 234, 212, 0.2);
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #5eead4;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: fadeInDown 0.6s ease forwards;
        }

        .slide-title {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          line-height: 1.1;
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.15s;
          opacity: 0;
        }

        .slide-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          font-weight: 300;
          line-height: 1.7;
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(94, 234, 212, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(94, 234, 212, 0.1);
        }

        .icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        /* COVER SLIDE */
        .cover-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
        }

        .cover-logo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(94, 234, 212, 0.3);
          animation: scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-shadow: 0 0 40px rgba(94, 234, 212, 0.2);
        }

        .cover-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.05;
          animation: fadeInUp 1s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .cover-title .highlight {
          background: linear-gradient(135deg, #5eead4, #14b8a6, #0d9488);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cover-tagline {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.5);
          font-weight: 300;
          font-style: italic;
          animation: fadeInUp 1s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
          letter-spacing: 0.05em;
        }

        .cover-decoration {
          display: flex;
          gap: 0.5rem;
          animation: fadeInUp 1s ease forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }

        .cover-decoration span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .cover-decoration span:nth-child(1) { background: #0d9488; animation-delay: 0s; }
        .cover-decoration span:nth-child(2) { background: #14b8a6; animation-delay: 0.3s; }
        .cover-decoration span:nth-child(3) { background: #5eead4; animation-delay: 0.6s; }

        .cover-start {
          margin-top: 1rem;
          animation: fadeInUp 1s ease forwards;
          animation-delay: 0.9s;
          opacity: 0;
        }

        .cover-start-btn {
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.15), rgba(13, 148, 136, 0.15));
          border: 1px solid rgba(94, 234, 212, 0.3);
          color: #5eead4;
          padding: 0.75rem 2rem;
          border-radius: 3rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.05em;
        }

        .cover-start-btn:hover {
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.25), rgba(13, 148, 136, 0.25));
          border-color: rgba(94, 234, 212, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(94, 234, 212, 0.2);
        }

        /* WHAT SLIDE */
        .what-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-top: 2rem;
        }

        .what-card {
          animation: fadeInUp 0.7s ease forwards;
          opacity: 0;
        }

        .what-card:nth-child(1) { animation-delay: 0.3s; }
        .what-card:nth-child(2) { animation-delay: 0.45s; }
        .what-card:nth-child(3) { animation-delay: 0.6s; }
        .what-card:nth-child(4) { animation-delay: 0.75s; }

        .what-card .icon-circle {
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.15), rgba(13, 148, 136, 0.15));
          margin-bottom: 1rem;
        }

        .what-card h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .what-card p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }

        /* MISSION SLIDE */
        .mission-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .mission-point {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          animation: fadeInLeft 0.7s ease forwards;
          opacity: 0;
        }

        .mission-point:nth-child(1) { animation-delay: 0.3s; }
        .mission-point:nth-child(2) { animation-delay: 0.5s; }
        .mission-point:nth-child(3) { animation-delay: 0.7s; }

        .mission-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(94, 234, 212, 0.12), rgba(13, 148, 136, 0.12));
          border: 1px solid rgba(94, 234, 212, 0.15);
        }

        .mission-text h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
          color: #5eead4;
        }

        .mission-text p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
        }

        /* VISION SLIDE */
        .vision-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 2.5rem;
          gap: 2rem;
        }

        .vision-quote {
          position: relative;
          max-width: 700px;
          padding: 2.5rem;
          animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .vision-quote::before {
          content: '"';
          position: absolute;
          top: -0.5rem;
          left: 0;
          font-family: 'Playfair Display', serif;
          font-size: 5rem;
          color: rgba(94, 234, 212, 0.2);
          line-height: 1;
        }

        .vision-quote p {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 500;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
          font-style: italic;
        }

        .vision-pillars {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeInUp 0.7s ease forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .vision-pillar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.2rem;
          background: rgba(94, 234, 212, 0.08);
          border: 1px solid rgba(94, 234, 212, 0.15);
          border-radius: 2rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          transition: all 0.3s ease;
        }

        .vision-pillar:hover {
          background: rgba(94, 234, 212, 0.15);
          border-color: rgba(94, 234, 212, 0.3);
          transform: translateY(-2px);
        }

        .vision-pillar span {
          font-size: 1.1rem;
        }

        /* VALUES SLIDE */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-top: 2rem;
        }

        .value-card {
          text-align: center;
          padding: 2rem 1.25rem;
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .value-card:nth-child(1) { animation-delay: 0.2s; }
        .value-card:nth-child(2) { animation-delay: 0.35s; }
        .value-card:nth-child(3) { animation-delay: 0.5s; }
        .value-card:nth-child(4) { animation-delay: 0.65s; }
        .value-card:nth-child(5) { animation-delay: 0.8s; }

        .value-emoji {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
          animation: breathe 3s ease-in-out infinite;
        }

        .value-name {
          font-size: 1rem;
          font-weight: 700;
          color: #5eead4;
          margin-bottom: 0.5rem;
        }

        .value-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        /* ORG CHART SLIDE */
        .orgchart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2rem;
          gap: 0;
        }

        .org-level {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          position: relative;
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .org-level:nth-child(1) { animation-delay: 0.3s; }
        .org-level:nth-child(2) { animation-delay: 0.5s; }
        .org-level:nth-child(3) { animation-delay: 0.7s; }
        .org-level:nth-child(4) { animation-delay: 0.9s; }

        .org-node {
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          text-align: center;
          min-width: 160px;
          transition: all 0.3s ease;
        }

        .org-node:hover {
          transform: translateY(-4px);
        }

        .org-node-top {
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 4px 20px rgba(13, 148, 136, 0.3);
        }

        .org-node-mid {
          background: rgba(94, 234, 212, 0.1);
          border: 1px solid rgba(94, 234, 212, 0.2);
          color: #5eead4;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .org-node-bottom {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          font-size: 0.85rem;
        }

        .org-connector {
          width: 2px;
          height: 25px;
          background: linear-gradient(180deg, rgba(94, 234, 212, 0.4), rgba(94, 234, 212, 0.1));
          margin: 0 auto;
          animation: fadeInUp 0.4s ease forwards;
          opacity: 0;
        }

        .org-connector:nth-child(2) { animation-delay: 0.4s; }
        .org-connector:nth-child(4) { animation-delay: 0.6s; }

        .org-hline {
          position: relative;
          width: 300px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(94, 234, 212, 0.3), transparent);
          margin: 0 auto;
        }

        /* STRUCTURE SLIDE */
        .structure-tabs {
          display: flex;
          gap: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.6s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .structure-tab {
          padding: 0.5rem 1.25rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .structure-tab.active {
          background: rgba(94, 234, 212, 0.12);
          border-color: rgba(94, 234, 212, 0.3);
          color: #5eead4;
        }

        .structure-tab:hover:not(.active) {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
        }

        .structure-content {
          animation: fadeInUp 0.5s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .structure-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .structure-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }

        .structure-item:hover {
          background: rgba(94, 234, 212, 0.06);
          border-color: rgba(94, 234, 212, 0.15);
          transform: translateX(8px);
        }

        .structure-item-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: rgba(94, 234, 212, 0.1);
          flex-shrink: 0;
        }

        .structure-item-text h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .structure-item-text p {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.4;
        }

        /* CLOSING SLIDE */
        .closing-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
        }

        .closing-heart {
          font-size: 4rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .closing-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .closing-title .highlight {
          background: linear-gradient(135deg, #5eead4, #14b8a6, #0d9488);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .closing-info {
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .closing-info-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.5rem;
          justify-content: center;
        }

        .closing-info-item span:first-child {
          font-size: 1.1rem;
        }

        .closing-hashtag {
          font-size: 0.85rem;
          color: #5eead4;
          font-weight: 600;
          letter-spacing: 0.05em;
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }

        .closing-dots {
          display: flex;
          gap: 0.5rem;
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 0.9s;
          opacity: 0;
        }

        .closing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(94, 234, 212, 0.4);
          animation: breathe 2s ease-in-out infinite;
        }

        .closing-dots span:nth-child(2) { animation-delay: 0.5s; }
        .closing-dots span:nth-child(3) { animation-delay: 1s; }

        /* Responsive */
        @media (max-width: 768px) {
          .slide-content {
            padding: 1rem;
          }

          .cover-title {
            font-size: clamp(2rem, 8vw, 3rem);
          }

          .what-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .org-level {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .org-node {
            min-width: 140px;
          }

          .vision-quote p {
            font-size: 1.2rem;
          }

          .structure-tabs {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .nav-controls {
            bottom: 1rem;
            padding: 0.5rem 1rem;
            gap: 1rem;
          }

          .slide-counter {
            top: 1rem;
            right: 1rem;
            font-size: 0.8rem;
          }

          .values-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
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
        Centro de Atención<br />
        <span className="highlight">Kavac</span>
      </h1>
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
  const services = [
    {
      icon: '🧠',
      title: 'Psicología Clínica',
      desc: 'Diversos enfoques terapéuticos para abordar las necesidades emocionales y conductuales de niños, adolescentes y adultos.',
    },
    {
      icon: '✋',
      title: 'Terapia Ocupacional',
      desc: 'Rehabilitación y desarrollo de habilidades funcionales para la integración plena en la vida diaria.',
    },
    {
      icon: '📚',
      title: 'Psicopedagogía',
      desc: 'Evaluación e intervención en dificultades de aprendizaje, potenciando las capacidades académicas.',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Orientación Familiar',
      desc: 'Acompañamiento a las familias con estrategias de regulación emocional y crianza respetuosa.',
    },
    {
      icon: '💊',
      title: 'Psiquiatría',
      desc: 'Atención médica especializada en salud mental con diagnóstico y tratamiento integral.',
    },
    {
      icon: '🗣️',
      title: 'Terapia del Lenguaje',
      desc: 'Intervención en trastornos de la comunicación y lenguaje para un desarrollo óptimo.',
    },
  ]

  return (
    <div>
      <div className="slide-tag">📌 Institución</div>
      <h2 className="slide-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
        ¿Qué hace la <span style={{ color: '#5eead4' }}>Institución</span>?
      </h2>
      <p className="slide-subtitle" style={{ maxWidth: '650px' }}>
        Centro de Atención Kavac brinda atención integral en diversas áreas de la salud mental
        y el neurodesarrollo, desde el corazón de la Unidad Educativa Kavac en Valencia, Carabobo.
      </p>
      <div className="what-grid">
        {services.map((s, i) => (
          <div key={i} className="what-card glass-card">
            <div className="icon-circle">{s.icon}</div>
            <h3>{s.title}</h3>
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
      text: 'Brindar atención en diversas áreas, enfocada en el abordaje integral de niños, adolescentes y adultos.',
    },
    {
      icon: '👥',
      title: 'Orientación Clínica',
      text: 'Ofreciendo a las familias, instituciones y población en general la orientación clínica, tanto en prevención como rehabilitación; promoviendo la importancia de la interconsulta como herramienta para lograr una intervención eficaz.',
    },
    {
      icon: '👏',
      title: 'Inclusión y Desarrollo',
      text: 'Generando instancias y oportunidades de inclusión y desarrollo humano pleno.',
    },
  ]

  return (
    <div>
      <div className="slide-tag">🎯 Misión</div>
      <h2 className="slide-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
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
      <h2 className="slide-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
        Nuestra <span style={{ color: '#5eead4' }}>Visión</span>
      </h2>
      <div className="vision-center">
        <div className="vision-quote glass-card">
          <p>
            Ser el centro de referencia en atención integral de salud mental y neurodesarrollo en la
            región central de Venezuela, reconocido por nuestro enfoque humano, interdisciplinario y
            comprometido con la inclusión social y el desarrollo pleno de cada persona.
          </p>
        </div>
        <div className="vision-pillars">
          <div className="vision-pillar">
            <span>🌍</span> Referencia regional
          </div>
          <div className="vision-pillar">
            <span>🤝</span> Enfoque interdisciplinario
          </div>
          <div className="vision-pillar">
            <span>💚</span> Compromiso humano
          </div>
          <div className="vision-pillar">
            <span>✨</span> Inclusión social
          </div>
          <div className="vision-pillar">
            <span>🌱</span> Desarrollo pleno
          </div>
        </div>
      </div>
    </div>
  )
}

function ValuesSlide() {
  const values = [
    { emoji: '❤️', name: 'Empatía', desc: 'Comprender y acompañar desde la sensibilidad humana' },
    { emoji: '🤝', name: 'Respeto', desc: 'Valorar la individualidad de cada ser' },
    { emoji: '🌟', name: 'Integridad', desc: 'Actuar con ética y transparencia profesional' },
    { emoji: '🔬', name: 'Profesionalismo', desc: 'Compromiso con la excelencia clínica' },
    { emoji: '🧩', name: 'Inclusión', desc: 'Generar oportunidades para el desarrollo humano pleno' },
  ]

  return (
    <div>
      <div className="slide-tag">💎 Valores</div>
      <h2 className="slide-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
        Nuestros <span style={{ color: '#5eead4' }}>Valores</span>
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

function OrgChartSlide() {
  return (
    <div>
      <div className="slide-tag">🏢 Organigrama</div>
      <h2 className="slide-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
        <span style={{ color: '#5eead4' }}>Organigrama</span> Institucional
      </h2>
      <p className="slide-subtitle" style={{ maxWidth: '600px' }}>
        Estructura organizativa del Centro de Atención Kavac.
      </p>
      <div className="orgchart-container">
        <div className="org-level">
          <div className="org-node org-node-top">🏛️ Dirección General</div>
        </div>
        <div className="org-connector" />
        <div className="org-level">
          <div className="org-node org-node-mid">📋 Administración</div>
          <div className="org-node org-node-mid">🎯 Coordinación</div>
        </div>
        <div className="org-connector" />
        <div className="org-level">
          <div className="org-node org-node-bottom">🧠 Psicología</div>
          <div className="org-node org-node-bottom">✋ Terapia Ocupacional</div>
          <div className="org-node org-node-bottom">📚 Psicopedagogía</div>
        </div>
        <div className="org-connector" style={{ height: '15px' }} />
        <div className="org-level">
          <div className="org-node org-node-bottom">💊 Psiquiatría</div>
          <div className="org-node org-node-bottom">🗣️ Terapia del Lenguaje</div>
          <div className="org-node org-node-bottom">👨‍👩‍👧‍👦 Orientación Familiar</div>
        </div>
      </div>
    </div>
  )
}

function StructureSlide() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      label: 'Administración',
      items: [
        { icon: '📊', name: 'Gestión Administrativa', desc: 'Manejo de recursos financieros y operativos del centro' },
        { icon: '📋', name: 'Planificación Estratégica', desc: 'Diseño y seguimiento de objetivos institucionales' },
        { icon: '📎', name: 'Recursos Humanos', desc: 'Gestión del talento humano y bienestar del equipo' },
        { icon: '💻', name: 'Sistemas y Registro', desc: 'Control de expedientes clínicos y datos de pacientes' },
      ],
    },
    {
      label: 'Coordinación',
      items: [
        { icon: '🔗', name: 'Coordinación Clínica', desc: 'Articulación entre especialidades para atención integral' },
        { icon: '📅', name: 'Programación de Citas', desc: 'Organización de agendas y flujo de pacientes' },
        { icon: '🤝', name: 'Interconsulta', desc: 'Promoción de la interconsulta como herramienta de intervención' },
        { icon: '📈', name: 'Seguimiento de Casos', desc: 'Monitoreo continuo del progreso terapéutico' },
      ],
    },
    {
      label: 'Especialidades',
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
      <h2 className="slide-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '0.75rem' }}>
        Estructura y <span style={{ color: '#5eead4' }}>Departamentos</span>
      </h2>
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

function ClosingSlide() {
  return (
    <div className="closing-slide">
      <div className="closing-heart">💚</div>
      <h2 className="closing-title">
        ¡<span className="highlight">Gracias</span>!
      </h2>
      <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, animation: 'fadeInUp 0.8s ease forwards', animationDelay: '0.4s', opacity: 0 }}>
        Centro de Atención Kavac
      </p>
      <div className="closing-info">
        <div className="closing-info-item">
          <span>📍</span> Los Colorados, Valencia, Estado Carabobo
        </div>
        <div className="closing-info-item">
          <span>🏫</span> Desde el corazón de la UE Kavac
        </div>
        <div className="closing-info-item">
          <span>📱</span> @centrokavac
        </div>
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
