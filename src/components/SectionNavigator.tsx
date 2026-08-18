import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'security', label: 'Security' },
  { id: 'tools', label: 'Harnesses' },
];

export function SectionNavigator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);

  const activeSectionRef = useRef(activeSection);
  const isScrollingRef = useRef(isScrolling);

  activeSectionRef.current = activeSection;
  isScrollingRef.current = isScrolling;

  const scrollToSection = (sectionId: string) => {
    setIsScrolling(true);
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => setIsScrolling(false), 1000);
  };

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      if (isScrollingRef.current) return;

      let currentSection = sections[0].id;
      let minDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 56);

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

    // requestAnimationFrame-throttled: each tick reads layout
    // (getBoundingClientRect) for every section, which forces a synchronous
    // reflow. Running that on every raw scroll event (fired many times per
    // second during trackpad momentum scrolling) can churn the main thread
    // badly enough on lower-power hardware that the page appears to stop
    // responding to scroll input entirely.
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 theme-bg-primary border-b theme-border">
      <div className="max-w-responsive-6xl mx-auto px-responsive-md h-full flex items-center justify-between gap-4">
        <button
          onClick={() => scrollToSection('hero')}
          className="terminal-mono text-sm theme-text-primary font-medium tracking-tight"
        >
          terminal-jarvis
        </button>

        <nav className="flex items-center gap-4 sm:gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`terminal-body text-xs sm:text-sm transition-colors ${
                activeSection === section.id
                  ? 'theme-text-primary font-medium'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
