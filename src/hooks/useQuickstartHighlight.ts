import { useState, useEffect } from 'react';

export function useQuickstartHighlight() {
  const [shouldHighlight, setShouldHighlight] = useState(true);

  useEffect(() => {
    localStorage.removeItem('quickstart-interacted');
    setShouldHighlight(true);

    const handleHighlightRemoval = () => {
      setShouldHighlight(false);
      localStorage.setItem('quickstart-interacted', 'true');
      window.removeEventListener('scroll', handleHighlightRemoval);
    };

    window.addEventListener('scroll', handleHighlightRemoval, { passive: true });
    return () => window.removeEventListener('scroll', handleHighlightRemoval);
  }, []);

  const markAsInteracted = () => {
    setShouldHighlight(false);
    localStorage.setItem('quickstart-interacted', 'true');
  };

  return { shouldHighlight, markAsInteracted };
}
