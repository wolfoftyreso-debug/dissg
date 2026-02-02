/**
 * INSTITUTIONAL BRIEF PRESENTER
 * 
 * Full presentation mode for the 3 slides.
 * Keyboard navigation, fullscreen support.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { InstitutionalSlide } from './InstitutionalSlide';
import { INSTITUTIONAL_BRIEF_SLIDES } from '@/config/institutionalBriefConfig';

interface InstitutionalBriefPresenterProps {
  language?: 'en' | 'sv';
  startSlide?: number;
  onClose?: () => void;
}

export function InstitutionalBriefPresenter({
  language = 'en',
  startSlide = 0,
  onClose,
}: InstitutionalBriefPresenterProps) {
  const [currentSlide, setCurrentSlide] = useState(startSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = INSTITUTIONAL_BRIEF_SLIDES.length;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          if (onClose) onClose();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case '1':
          goToSlide(0);
          break;
        case '2':
          goToSlide(1);
          break;
        case '3':
          goToSlide(2);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, onClose, toggleFullscreen]);

  const slide = INSTITUTIONAL_BRIEF_SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Main Slide */}
      <InstitutionalSlide
        slide={slide}
        language={language}
        variant="presentation"
      />

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-background/80 backdrop-blur border-t border-border">
        {/* Slide Progress */}
        <div className="flex items-center gap-2">
          {INSTITUTIONAL_BRIEF_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-3 h-3 transition-all
                ${index === currentSlide 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-mono">
            {currentSlide + 1} / {totalSlides}
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 text-sm border border-border disabled:opacity-30 hover:bg-muted"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="px-3 py-1.5 text-sm border border-border disabled:opacity-30 hover:bg-muted"
            >
              →
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 text-sm border border-border hover:bg-muted"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? '⊡' : '⊞'}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-border hover:bg-muted"
              title="Close (Esc)"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="fixed top-4 right-4 text-xs text-muted-foreground/50 font-mono">
        ← → navigate • F fullscreen • Esc close
      </div>
    </div>
  );
}
