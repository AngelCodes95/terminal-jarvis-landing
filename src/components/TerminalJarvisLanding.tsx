import { useState, useEffect } from 'react';
import { realDataService, type LiveUpdates, type ToolsResponse } from '../api';
import { ToolsShowcase } from './ToolsShowcase';
import { TJarvisRetroLogo } from './TJarvisRetroLogo';
import { SectionNavigator } from './SectionNavigator';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export function TerminalJarvisLanding() {
  const { theme } = useTheme();
  const [tools, setTools] = useState<ToolsResponse | null>(null);
  const [liveStats, setLiveStats] = useState<LiveUpdates | null>(null);
  const [loading, setLoading] = useState(true);
  const [jarvisAlive, setJarvisAlive] = useState(false);
  const [selectedInstallMethod, setSelectedInstallMethod] = useState('npx');
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(80);
  const [currentVersion, setCurrentVersion] = useState('2.1.0');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Ensure page starts at top on mount
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);

    const initializeJarvis = async () => {
      setJarvisAlive(true);
      setError(null);

      // Start progress animation - smoother and faster
      setTimeout(() => setLoadingProgress(85), 600);
      setTimeout(() => setLoadingProgress(92), 1000);
      setTimeout(() => setLoadingProgress(97), 1400);
      setTimeout(() => setLoadingProgress(100), 1800);

      try {
        // Fetch tools data using real data service
        const { data: toolsData, error: toolsError } = await realDataService.getTools();
        if (toolsData) {
          setTools(toolsData);
          if (toolsError) {
            console.warn('Using fallback tools data:', toolsError.message);
          }
        }

        // Fetch live statistics using real data service (includes version)
        const { data: statsData, error: statsError } = await realDataService.getLiveStats();
        if (statsData) {
          setLiveStats(statsData);
          // Update version from live data if available
          if (statsData.downloadStats.npmVersion) {
            setCurrentVersion(statsData.downloadStats.npmVersion);
          }
          if (statsError) {
            console.warn('Using fallback stats data:', statsError.message);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to initialize Terminal Jarvis data';
        setError(errorMessage);
        console.error('Initialization error:', err);
      } finally {
        setTimeout(() => setLoading(false), 2500);
      }
    };

    initializeJarvis();
  }, []);

  // Clipboard functionality with modern API and fallback
  const copyTextToClipboard = async () => {
    const selectedMethod = installMethods.find((m) => m.id === selectedInstallMethod);
    if (!selectedMethod) return;

    const textToCopy = selectedMethod.command;

    try {
      // Modern Clipboard API for secure contexts
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Provide user feedback
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy operation failed:', err);
    }
  };

  const installMethods = [
    {
      id: 'npx',
      label: 'Try Instantly',
      command: 'npx terminal-jarvis',
      description: 'No installation required',
    },
    {
      id: 'npm',
      label: 'Install via NPM',
      command: 'npm install -g terminal-jarvis',
      description: 'For regular use',
    },
    {
      id: 'cargo',
      label: 'Install via Cargo',
      command: 'cargo install terminal-jarvis',
      description: 'Rust users',
    },
    {
      id: 'brew',
      label: 'Install via Homebrew',
      command: 'brew install terminal-jarvis',
      description: 'macOS/Linux',
    },
  ];

  // Helper functions for dynamic progress bars
  const getProgressBar = (progress: number) => {
    const totalBars = 20;
    const filledBars = Math.floor((progress / 100) * totalBars);
    const filled = '█'.repeat(filledBars);
    const empty = '░'.repeat(totalBars - filledBars);
    return filled + empty;
  };

  const getDialupDots = (progress: number) => {
    const totalDots = 33;
    const filledDots = Math.floor((progress / 100) * totalDots);
    const filled = '●'.repeat(filledDots);
    const empty = '○'.repeat(totalDots - filledDots);
    return filled + empty;
  };

  if (loading) {
    const isLight = theme === 'light';

    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center font-mono transition-all duration-300 ${
          isLight ? 'theme-bg-primary' : 'theme-bg-primary'
        }`}
        style={{
          background: isLight
            ? 'var(--bg-primary)'
            : 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
        }}
      >
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Dialup Header */}
          <div
            className={`text-xl mb-8 font-bold tracking-wider transition-all duration-300 ${
              isLight ? 'text-[var(--jarvis-navy)]' : 'text-[var(--jarvis-cyan)]'
            }`}
            style={{
              textShadow: isLight ? 'none' : '0 0 20px var(--jarvis-cyan-glow)',
            }}
          >
            TERMINAL JARVIS v{currentVersion}
          </div>

          {/* Connection Sequence */}
          <div
            className="text-left p-6 mb-6 text-sm border rounded transition-all duration-300"
            style={{
              backgroundColor: isLight ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
              borderColor: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)',
              boxShadow: isLight
                ? '0 0 10px rgba(79, 209, 199, 0.2)'
                : '0 0 15px var(--jarvis-cyan-glow)',
            }}
          >
            <div
              className="mb-2 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              Initializing connection...
            </div>
            <div
              className="mb-2 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              AT&amp;F OK
            </div>
            <div
              className="mb-2 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              ATDT 1-800-TERMINAL
            </div>
            <div
              className="mb-2 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              <span
                className="animate-pulse"
                style={{
                  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                CONNECT 56000/ARQ/V90/LAPM/V42BIS
              </span>
            </div>
            <div
              className="mb-2 transition-colors duration-300"
              style={{
                color: isLight ? 'var(--jarvis-cyan)' : '#ffd700',
                textShadow: isLight ? 'none' : '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
            >
              ♪♫ BEEP BOOP SCREECH STATIC ♫♪
            </div>
            <div
              className="mb-2 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              Handshake successful...
            </div>
            <div
              className="mb-2 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              Authenticating user credentials...
            </div>
            <div
              className="mb-1 transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              {error ? 'Loading cached tools database...' : 'Downloading coding tools index...'}
            </div>
          </div>

          {/* ASCII Art Progress Bar */}
          <div
            className="text-xs mb-4 font-mono transition-all duration-300"
            style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan)' }}
          >
            <div className="mb-2 font-bold">
              <span
                style={{ color: isLight ? 'var(--text-secondary)' : 'var(--jarvis-cyan-light)' }}
              >
                Progress: [
              </span>
              <span
                style={{
                  color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)',
                  textShadow: isLight ? 'none' : '0 0 5px var(--jarvis-cyan-glow)',
                }}
              >
                {getProgressBar(loadingProgress)}
              </span>
              <span
                style={{ color: isLight ? 'var(--text-secondary)' : 'var(--jarvis-cyan-light)' }}
              >
                ] {loadingProgress}%
              </span>
            </div>
            <div
              className="text-center transition-all duration-500"
              style={{
                borderColor: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)',
                filter: isLight ? 'none' : 'drop-shadow(0 0 3px var(--jarvis-cyan-glow))',
              }}
            >
              <span style={{ color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)' }}>
                ┌─────────────────────────────────────┐
              </span>
              <br />
              <span style={{ color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)' }}>
                │
              </span>{' '}
              <span
                style={{
                  color:
                    loadingProgress === 100
                      ? isLight
                        ? 'var(--jarvis-cyan)'
                        : 'var(--jarvis-cyan)'
                      : isLight
                        ? 'var(--text-secondary)'
                        : 'var(--jarvis-cyan-light)',
                  textShadow:
                    loadingProgress === 100 && !isLight
                      ? '0 0 8px var(--jarvis-cyan-glow)'
                      : 'none',
                }}
              >
                {getDialupDots(loadingProgress)}
              </span>{' '}
              <span style={{ color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)' }}>
                │
              </span>
              <br />
              <span style={{ color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)' }}>
                │
              </span>{' '}
              <span
                className={loadingProgress === 100 ? 'animate-pulse' : ''}
                style={{
                  color:
                    loadingProgress === 100
                      ? isLight
                        ? 'var(--jarvis-cyan)'
                        : 'var(--jarvis-cyan)'
                      : isLight
                        ? 'var(--text-secondary)'
                        : 'var(--jarvis-cyan-light)',
                  textShadow:
                    loadingProgress === 100 && !isLight
                      ? '0 0 10px var(--jarvis-cyan-glow)'
                      : 'none',
                }}
              >
                {loadingProgress < 100
                  ? 'Establishing secure connection...'
                  : 'Connection established!'}
              </span>{' '}
              <span style={{ color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)' }}>
                │
              </span>
              <br />
              <span style={{ color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)' }}>
                └─────────────────────────────────────┘
              </span>
            </div>
          </div>

          {/* Status Messages */}
          <div className="text-left text-xs space-y-1 mb-6">
            <div
              className="transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              ✓ Modem initialized
            </div>
            <div
              className="transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              ✓ Dialing ISP...
            </div>
            <div
              className="transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              ✓ Connected at 56k
            </div>
            <div
              className="transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              ✓ PPP link established
            </div>
            <div
              className="animate-pulse transition-colors duration-300"
              style={{
                color: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)',
                textShadow: isLight ? 'none' : '0 0 8px var(--jarvis-cyan-glow)',
                animation: 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              ⟳ Downloading tool manifest...
            </div>
            <div
              className="transition-colors duration-300"
              style={{ color: isLight ? 'var(--jarvis-navy)' : 'var(--jarvis-cyan-light)' }}
            >
              ✓ DNS lookup successful
            </div>
            {error && (
              <div
                className="transition-colors duration-300"
                style={{
                  color: isLight ? 'var(--jarvis-cyan)' : '#ffd700',
                  textShadow: isLight ? 'none' : '0 0 10px rgba(255, 215, 0, 0.5)',
                }}
              >
                ⚠ Using offline cache
              </div>
            )}
          </div>

          {/* Connection Info */}
          <div
            className="text-xs opacity-70 border-t pt-4 transition-all duration-300"
            style={{
              color: isLight ? 'var(--text-secondary)' : 'var(--jarvis-cyan-lighter)',
              borderColor: isLight ? 'var(--jarvis-cyan)' : 'var(--jarvis-cyan)',
            }}
          >
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <div>Baud Rate: 56,000</div>
                <div>Protocol: V.90</div>
                <div>Compression: V.42bis</div>
              </div>
              <div>
                <div>Session Time: 00:00:03</div>
                <div>Bytes Sent: 1,247</div>
                <div>Bytes Received: 8,934</div>
              </div>
            </div>
          </div>

          {/* Bottom Status */}
          <div className={`mt-6 text-xs animate-pulse ${isLight ? 'text-black' : 'text-cyan-400'}`}>
            Please wait while Terminal Jarvis establishes connection...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full theme-bg-primary">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Section Navigator */}
      <SectionNavigator />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative z-10 min-h-screen flex items-center justify-center py-responsive-xl"
      >
        <div className="max-w-responsive-6xl mx-auto px-responsive-md text-center">
          <div className="mb-8">
            {jarvisAlive && (
              <div className="flex items-center justify-center mt-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2 shadow-lg shadow-green-400/50"></div>
                <span className="terminal-mono text-green-400 text-sm">SYSTEM ONLINE</span>
              </div>
            )}
          </div>

          <h1 className="terminal-text text-4xl-responsive md:text-5xl-responsive theme-text-accent theme-text-stroke mb-responsive-md leading-tight">
            YOUR TOOLS HEADQUARTERS
            <br />
            <span
              className="theme-text-primary"
              style={{ textShadow: '0 0 20px var(--jarvis-blue-glow)' }}
            >
              ALL IN ONE TERMINAL
            </span>
          </h1>

          <p className="terminal-body text-lg-responsive theme-text-secondary theme-text-stroke mb-responsive-sm max-w-responsive-4xl mx-auto leading-relaxed">
            Terminal Jarvis was designed to be your centralized hub for coding tools. Instead of
            juggling multiple CLIs, authentication tokens, and command syntaxes, everything flows
            through one beautiful, unified interface.
          </p>

          <p className="terminal-body text-base-responsive theme-text-secondary theme-text-stroke mb-responsive-lg max-w-responsive-3xl mx-auto">
            Switch between{' '}
            {liveStats?.toolStatus.supportedTools.join(', ') ||
              'Claude, Gemini, Qwen, OpenCode, LLXPRT, Codex, and Crush'}{' '}
            coding assistants seamlessly. One installation, one interface,{' '}
            {liveStats?.toolStatus.totalToolCount || '7'} tools integrated.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="terminal-mono bg-orange-500 text-white px-3 py-1 rounded text-sm">
              NPM v{liveStats?.downloadStats.npmVersion || '0.0.55'}
            </div>
            <div className="terminal-mono bg-green-500 text-white px-3 py-1 rounded text-sm">
              {liveStats
                ? `${Math.round((liveStats.downloadStats.npmWeeklyDownloads / 1000) * 10) / 10}K/week`
                : '2.2K/week'}{' '}
              Downloads
            </div>
            <div className="terminal-mono bg-blue-500 text-white px-3 py-1 rounded text-sm">
              {liveStats?.communityStats.githubStars || '48'} GitHub Stars
            </div>
            <div className="terminal-mono bg-purple-500 text-white px-3 py-1 rounded text-sm">
              Crates v{liveStats?.downloadStats.cratesVersion || '0.0.55'}
            </div>
          </div>

          <div className="mb-responsive-lg">
            <TJarvisRetroLogo width={600} height={180} />
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="terminal-body text-lg-responsive theme-text-secondary theme-text-stroke mb-responsive-md leading-relaxed">
              Think of this tool as the ultimate way to sample AI tools to get started, and then
              swap between them once you find your preferred flow. Which helps you SAVE TIME! Start
              up your favorite AI tool quickly, and swap to another one just as fast!
            </p>
            <p className="terminal-body text-base-responsive theme-text-secondary theme-text-stroke leading-relaxed">
              <span className="theme-text-primary font-semibold">Under the hood:</span> Terminal
              Jarvis is a Rust-based CLI wrapper that provides a unified interface to install,
              update, and run AI coding tools seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section
        id="quickstart"
        className="relative z-10 min-h-screen flex items-center justify-center theme-bg-primary py-responsive-xl"
      >
        <div className="max-w-responsive-6xl mx-auto px-responsive-md w-full">
          <h3 className="terminal-title text-3xl-responsive text-center theme-text-accent theme-text-stroke mb-responsive-2xl">
            QUICK START
          </h3>

          {/* Installation Method Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {installMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedInstallMethod(method.id)}
                className={`terminal-mono px-4 py-2 rounded transition-all duration-300 ${
                  selectedInstallMethod === method.id
                    ? 'theme-text-accent'
                    : 'theme-text-primary hover:theme-bg-tertiary'
                }`}
                style={{
                  backgroundColor:
                    selectedInstallMethod === method.id
                      ? 'var(--jarvis-blue)'
                      : 'var(--bg-tertiary)',
                  color:
                    selectedInstallMethod === method.id
                      ? 'var(--text-accent)'
                      : 'var(--text-primary)',
                }}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* Command Display */}
          <div className="theme-bg-tertiary theme-border border rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="terminal-mono theme-text-primary text-sm mb-1">
                  {installMethods.find((m) => m.id === selectedInstallMethod)?.description}
                </div>
                <div className="terminal-mono theme-text-secondary text-xs">
                  Copy and paste into your terminal
                </div>
              </div>
              <button
                onClick={copyTextToClipboard}
                className="terminal-mono text-xs theme-bg-secondary hover:theme-bg-tertiary theme-text-primary px-3 py-1 rounded transition-colors"
              >
                {copySuccess ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <div className="terminal-mono text-lg">
              <span className="theme-text-primary">$</span>
              <span className="theme-text-accent theme-text-stroke ml-3">
                {installMethods.find((m) => m.id === selectedInstallMethod)?.command}
              </span>
            </div>
          </div>

          {/* Interactive Mode Preview */}
          <div className="mt-12 theme-bg-tertiary theme-border border rounded-xl p-6 max-w-4xl mx-auto">
            <h4 className="terminal-text theme-text-primary text-lg mb-4">
              ENTER INTERACTIVE MODE (RECOMMENDED FOR NEW USERS)
            </h4>
            <div className="terminal-mono text-sm space-y-2">
              <div>
                <span className="theme-text-primary">$</span>
                <span className="theme-text-accent ml-2">terminal-jarvis</span>
              </div>
              <div className="theme-text-secondary pl-4">
                # Type this in your Terminal to enter interactive mode and explore all tools
              </div>
            </div>

            <h4 className="terminal-text theme-text-primary text-lg mb-4 mt-8">
              DIRECT TOOL EXECUTION EXAMPLES
            </h4>
            <div className="terminal-mono text-sm space-y-1">
              <div>
                <span className="theme-text-primary">$</span>
                <span className="theme-text-accent ml-2">
                  terminal-jarvis run claude --prompt "Explain this code"
                </span>
              </div>
              <div>
                <span className="theme-text-primary">$</span>
                <span className="theme-text-accent ml-2">
                  terminal-jarvis run gemini --file src/main.rs
                </span>
              </div>
              <div>
                <span className="theme-text-primary">$</span>
                <span className="theme-text-accent ml-2">terminal-jarvis run qwen --analyze</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section
        id="tools"
        className="relative z-10 min-h-screen flex items-center justify-center theme-bg-primary backdrop-blur-sm py-responsive-xl"
      >
        <div className="max-w-responsive-6xl mx-auto px-responsive-md text-center w-full">
          {tools && <ToolsShowcase tools={tools} />}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-responsive-2xl border-t theme-border">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md text-center">
          <div className="terminal-mono theme-text-secondary mb-responsive-sm text-base-responsive">
            BUILT BY THE TERMINAL JARVIS TEAM
          </div>
          <div className="flex justify-center space-x-responsive-md text-sm-responsive mb-responsive-sm">
            <a
              href="https://github.com/BA-CalderonMorales/terminal-jarvis/tree/main#terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-mono theme-text-secondary hover:theme-text-primary transition-colors"
            >
              DOCUMENTATION
            </a>
            <a
              href="https://github.com/BA-CalderonMorales/terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-mono theme-text-secondary hover:theme-text-primary transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://www.npmjs.com/package/terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-mono theme-text-secondary hover:theme-text-primary transition-colors"
            >
              NPM
            </a>
            <a
              href="https://crates.io/crates/terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-mono theme-text-secondary hover:theme-text-primary transition-colors"
            >
              CRATES.IO
            </a>
          </div>
          
          {/* Contribution Links */}
          <div className="flex justify-center space-x-responsive-lg text-sm-responsive mb-responsive-sm">
            <a
              href="https://github.com/AngelCodes95/terminal-jarvis-landing/blob/development/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-mono font-semibold contribute-link"
            >
              CONTRIBUTE TO THIS LANDING PAGE
            </a>
            <a
              href="https://github.com/BA-CalderonMorales/terminal-jarvis/blob/develop/docs/CONTRIBUTIONS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-mono font-semibold contribute-cli-link"
            >
              CONTRIBUTE TO TERMINAL JARVIS CLI
            </a>
          </div>
          {import.meta.env?.PROD === false && (
            <div className="text-center mb-responsive-sm">
              <div className="inline-block bg-yellow-900/20 border border-yellow-500/30 rounded px-3 py-1">
                <span className="terminal-mono text-yellow-400 text-xs">
                  DEVELOPMENT MODE: Using dynamic mock data (refresh to see changes)
                </span>
              </div>
            </div>
          )}
          <div className="text-xs-responsive theme-text-secondary">
            Frontend by{' '}
            <a
              href="https://angel-vazquez.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:theme-text-primary transition-colors"
            >
              angel-vazquez.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
