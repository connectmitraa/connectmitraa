import React, { useEffect, useRef } from 'react';
import { animate, utils } from 'animejs';

export function LoadingFallback({ title = "Loading StudyLoop Module..." }) {
  const squareRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    let animSquare;
    let animDots;

    try {
      if (squareRef.current) {
        animSquare = animate(squareRef.current, {
          rotate: '1turn',
          scale: [0.85, 1.15, 0.85],
          borderRadius: ['20%', '50%', '20%'],
          duration: 1600,
          loop: true,
          ease: 'inOutQuad',
        });
      }

      if (dotsRef.current) {
        const dots = dotsRef.current.querySelectorAll('.dot');
        if (dots.length > 0) {
          const staggerFn = utils?.stagger ? utils.stagger(150) : 150;
          animDots = animate(dots, {
            translateY: [-6, 6, -6],
            delay: staggerFn,
            duration: 1000,
            loop: true,
            ease: 'inOutSine',
          });
        }
      }
    } catch (e) {
      console.warn('Animation engine note:', e);
    }

    return () => {
      if (animSquare && animSquare.pause) animSquare.pause();
      if (animDots && animDots.pause) animDots.pause();
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh', 
      gap: '1.25rem',
      color: 'var(--text-secondary, #94a3b8)'
    }}>
      <div 
        ref={squareRef} 
        className="square studyloop-loading-square" 
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '24%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
        }} 
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
          {title}
        </span>
        <div ref={dotsRef} className="studyloop-loading-dots" style={{ display: 'flex', gap: '5px' }}>
          <span className="dot dot-1" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
          <span className="dot dot-2" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
          <span className="dot dot-3" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899', display: 'inline-block' }} />
        </div>
      </div>
    </div>
  );
}
