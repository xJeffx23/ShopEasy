"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
type Contrast = 'normal' | 'high';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  contrast: Contrast;
  setContrast: (contrast: Contrast) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  highContrastMode: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [contrast, setContrastState] = useState<Contrast>('normal');
  const [reducedMotion, setReducedMotionState] = useState(false);

  // Cargar configuración desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem('fontSize') as FontSize;
      const savedContrast = localStorage.getItem('contrast') as Contrast;
      const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';

      if (savedFontSize && ['small', 'medium', 'large', 'extra-large'].includes(savedFontSize)) {
        setFontSizeState(savedFontSize);
      }
      if (savedContrast && ['normal', 'high'].includes(savedContrast)) {
        setContrastState(savedContrast);
      }
      setReducedMotionState(savedReducedMotion);
    }
  }, []);

  // Aplicar configuración al documento
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Aplicar tamaño de fuente
      root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
      root.classList.add(`text-${fontSize}`);
      
      // Aplicar contraste
      root.classList.remove('contrast-normal', 'contrast-high');
      root.classList.add(`contrast-${contrast}`);
      
      // Aplicar movimiento reducido
      if (reducedMotion) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
      
      // Guardar en localStorage
      localStorage.setItem('fontSize', fontSize);
      localStorage.setItem('contrast', contrast);
      localStorage.setItem('reducedMotion', reducedMotion.toString());
    }
  }, [fontSize, contrast, reducedMotion]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setContrast = (newContrast: Contrast) => {
    setContrastState(newContrast);
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
  };

  const highContrastMode = contrast === 'high';

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      contrast,
      setContrast,
      reducedMotion,
      setReducedMotion,
      highContrastMode
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
