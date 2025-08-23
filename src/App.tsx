import { TerminalJarvisLanding } from './components/TerminalJarvisLanding';
import { useTheme } from './hooks/useTheme';
import './App.css';

/**
 * Terminal Jarvis Landing Page Application
 * Entry point for the Terminal Jarvis CLI tool showcase
 */
function TerminalJarvisApp() {
  const { isLoaded } = useTheme();

  // Prevent flash of incorrect theme
  if (!isLoaded) {
    return null;
  }

  return <TerminalJarvisLanding />;
}

export default TerminalJarvisApp;
