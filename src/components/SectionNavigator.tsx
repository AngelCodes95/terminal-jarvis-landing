import React, { useState, useEffect, useCallback } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'tools', label: 'Tools' }
];

export function SectionNavigator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [labelTimeout, setLabelTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [fadeTimeout, setFadeTimeout] = useState<NodeJS.Timeout | null>(null);

  const resetFadeTimer = useCallback(() => {
    setIsNavVisible(true);
    if (fadeTimeout) clearTimeout(fadeTimeout);
    const timeout = setTimeout(() => {
      setIsNavVisible(false);
    }, 3000);
    setFadeTimeout(timeout);
  }, [fadeTimeout]);

  const scrollToSection = (sectionId: string) => {
    setIsScrolling(true);
    setActiveSection(sectionId);
    
    // Reset fade timer when user interacts
    resetFadeTimer();
    
    // Show section label temporarily on mobile
    setShowLabel(true);
    if (labelTimeout) clearTimeout(labelTimeout);
    const timeout = setTimeout(() => {
      setShowLabel(false);
    }, 2000);
    setLabelTimeout(timeout);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  const getStoplightColor = (sectionId: string, index: number) => {
    
    if (activeSection === sectionId) {
      // Active section gets bright color
      if (index === 0) return 'bg-red-400 shadow-red-400/50'; // Top - Red
      if (index === 1) return 'bg-yellow-400 shadow-yellow-400/50'; // Middle - Yellow  
      if (index === 2) return 'bg-green-400 shadow-green-400/50'; // Bottom - Green
    } else {
      // Dim the other lights
      if (index === 0) return 'bg-red-900/30'; // Dim red
      if (index === 1) return 'bg-yellow-900/30'; // Dim yellow
      if (index === 2) return 'bg-green-900/30'; // Dim green
    }
    
    return 'bg-slate-500';
  };

  const getStoplightTextColor = (index: number) => {
    if (index === 0) return 'text-red-400'; // Top - Red
    if (index === 1) return 'text-yellow-400'; // Middle - Yellow
    if (index === 2) return 'text-green-400'; // Bottom - Green
    return 'text-green-400'; // fallback
  };

  useEffect(() => {
    // Initialize fade timer on mount
    resetFadeTimer();
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      const viewportHeight = window.innerHeight;
      let currentSection = sections[0].id;
      let maxVisibility = 0;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;
          
          const visibleTop = Math.max(0, -elementTop);
          const visibleBottom = Math.min(viewportHeight, elementBottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibilityRatio = visibleHeight / viewportHeight;
          
          if (visibilityRatio > maxVisibility) {
            maxVisibility = visibilityRatio;
            currentSection = section.id;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (labelTimeout) clearTimeout(labelTimeout);
    };
  }, [activeSection, isScrolling, resetFadeTimer, fadeTimeout, labelTimeout]);

  return (
    <>
      {/* Mobile Navigation - Bottom Right, Vertical Stack */}
      <nav className="fixed bottom-6 right-4 z-50 md:hidden">
        <div className={`bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-2xl p-3 transition-opacity duration-500 ${
          isNavVisible ? 'opacity-100' : 'opacity-35'
        }`}
        onTouchStart={resetFadeTimer}
        onMouseEnter={resetFadeTimer}>
          <div className="flex flex-col space-y-3">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-slate-700/50'
                    : 'bg-transparent hover:bg-slate-800/50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                  getStoplightColor(section.id, index)
                } ${
                  activeSection === section.id ? 'animate-pulse' : ''
                }`}></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Temporary section label for mobile */}
        {showLabel && isNavVisible && (
          <div className="absolute bottom-0 right-20 bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-2">
            <span className={`terminal-mono text-sm whitespace-nowrap ${
              getStoplightTextColor(sections.findIndex(s => s.id === activeSection))
            }`}>
              {sections.find(s => s.id === activeSection)?.label}
            </span>
          </div>
        )}
      </nav>

      {/* Desktop Navigation - Top Left */}
      <nav className="fixed top-responsive-md left-responsive-md z-50 hidden md:block">
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-xl p-responsive-sm min-w-48">
          <div className="flex flex-col space-y-responsive-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center space-x-responsive-sm p-responsive-xs rounded-lg transition-all duration-300 w-full ${
                  activeSection === section.id
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-transparent text-slate-400 hover:text-green-300 hover:bg-slate-800/50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-green-400 shadow-lg shadow-green-400/50 animate-pulse'
                    : 'bg-slate-500'
                }`}></div>
                
                <span className="terminal-mono text-sm-responsive font-medium">
                  {section.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}