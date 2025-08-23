import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuickstartHighlight } from '../hooks/useQuickstartHighlight';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'tools', label: 'Tools' },
];

export function SectionNavigator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const labelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { shouldHighlight, markAsInteracted } = useQuickstartHighlight();

  const activeSectionRef = useRef(activeSection);
  const isScrollingRef = useRef(isScrolling);

  activeSectionRef.current = activeSection;
  isScrollingRef.current = isScrolling;

  const resetFadeTimer = useCallback(() => {
    setIsNavVisible(true);
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    fadeTimeoutRef.current = setTimeout(() => {
      setIsNavVisible(false);
    }, 3000);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsScrolling(true);
    setActiveSection(sectionId);
    markAsInteracted();
    resetFadeTimer();

    setShowLabel(true);
    if (labelTimeoutRef.current) {
      clearTimeout(labelTimeoutRef.current);
    }
    labelTimeoutRef.current = setTimeout(() => setShowLabel(false), 2000);

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => setIsScrolling(false), 1000);
  };

  const getStoplightColor = (sectionId: string, index: number) => {
    if (activeSection === sectionId) {
      if (index === 0) return 'bg-red-400 shadow-red-400/50';
      if (index === 1) return 'bg-yellow-400 shadow-yellow-400/50';
      if (index === 2) return 'bg-green-400 shadow-green-400/50';
    } else {
      if (index === 0) return 'bg-red-900/30';
      if (index === 1) return 'bg-yellow-900/30';
      if (index === 2) return 'bg-green-900/30';
    }
    return 'bg-gray-400';
  };

  const getStoplightTextColor = (index: number) => {
    if (index === 0) return 'text-red-400';
    if (index === 1) return 'text-yellow-400';
    if (index === 2) return 'text-green-400';
    return 'text-green-400';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      let currentSection = sections[0].id;
      let minDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top);

          if (distance < minDistance) {
            minDistance = distance;
            currentSection = section.id;
          }
        }
      }

      if (currentSection !== activeSectionRef.current) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (labelTimeoutRef.current) {
        clearTimeout(labelTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    resetFadeTimer();
  }, [resetFadeTimer]);

  return (
    <>
      {/* Mobile Navigation - Top Left, Vertical Stack */}
      <nav className="fixed top-6 left-4 z-50 block 2xl:hidden">
        <div
          className={`mobile-nav-bg backdrop-blur-sm border rounded-2xl p-3 transition-opacity duration-500 ${
            isNavVisible ? 'opacity-100' : 'opacity-35'
          }`}
          onTouchStart={resetFadeTimer}
          onMouseEnter={resetFadeTimer}
        >
          <div className="flex flex-col space-y-3">
            {sections.map((section, index) => {
              const isQuickstart = section.id === 'quickstart';
              const shouldShowYellowBlink = isQuickstart && shouldHighlight;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? 'mobile-nav-button-active'
                      : 'mobile-nav-button-inactive mobile-nav-button-hover'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                      shouldShowYellowBlink
                        ? 'quickstart-highlight-dot'
                        : getStoplightColor(section.id, index)
                    } ${
                      activeSection === section.id && !shouldShowYellowBlink ? 'animate-pulse' : ''
                    }`}
                  ></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Temporary section label for mobile */}
        {showLabel && isNavVisible && (
          <div className="absolute top-0 left-20 mobile-nav-label-bg backdrop-blur-sm border rounded-lg px-3 py-2">
            <span
              className={`terminal-mono text-sm whitespace-nowrap ${getStoplightTextColor(
                sections.findIndex((s) => s.id === activeSection)
              )}`}
            >
              {sections.find((s) => s.id === activeSection)?.label}
            </span>
          </div>
        )}
      </nav>

      {/* Desktop Navigation - Top Left */}
      <nav className="fixed top-6 left-6 z-50 hidden 2xl:block">
        <div className="theme-bg-secondary backdrop-blur-sm theme-border border rounded-xl p-8 min-w-72">
          <div className="flex flex-col space-y-3">
            {sections.map((section) => {
              const isQuickstart = section.id === 'quickstart';
              const isHighlighted = isQuickstart && shouldHighlight;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center space-x-5 p-3 rounded-lg transition-all duration-300 w-full ${
                    activeSection === section.id
                      ? 'theme-bg-tertiary theme-text-primary'
                      : 'bg-transparent theme-text-secondary hover:theme-text-primary hover:theme-bg-tertiary/50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      isHighlighted
                        ? 'quickstart-highlight-dot'
                        : activeSection === section.id
                          ? 'theme-text-primary shadow-lg animate-pulse'
                          : 'bg-gray-500'
                    }`}
                    style={{
                      backgroundColor:
                        !isHighlighted && activeSection === section.id
                          ? 'var(--jarvis-blue)'
                          : !isHighlighted
                            ? '#6b7280'
                            : undefined,
                      boxShadow:
                        activeSection === section.id && !isHighlighted
                          ? '0 0 10px var(--jarvis-blue-glow)'
                          : 'none',
                    }}
                  ></div>

                  <span
                    className={`terminal-mono text-lg font-medium ${
                      isHighlighted ? 'quickstart-highlight-text' : ''
                    }`}
                  >
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
