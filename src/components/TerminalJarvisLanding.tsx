import { useState, useEffect } from 'react';
import { terminalClient, type ToolsResponse, type LiveUpdates } from '../api/terminalClient';
import { ToolsShowcase } from './ToolsShowcase';
import { TJarvisRetroLogo } from './TJarvisRetroLogo';
import { SectionNavigator } from './SectionNavigator';

/**
 * Terminal Jarvis Landing Page
 * Main landing page showcasing Terminal Jarvis CLI tool capabilities
 */
export function TerminalJarvisLanding() {
  const [tools, setTools] = useState<ToolsResponse | null>(null);
  const [liveStats, setLiveStats] = useState<LiveUpdates | null>(null);
  const [loading, setLoading] = useState(true);
  const [jarvisAlive, setJarvisAlive] = useState(false);
  const [selectedInstallMethod, setSelectedInstallMethod] = useState('npx');

  useEffect(() => {
    // Ensure page starts at top on mount
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);

    const initializeJarvis = async () => {
      setJarvisAlive(true);
      
      // For development, use mock data directly to avoid API calls
      setTools(terminalClient.getMockTools());
      
      // Fetch live statistics using Clean-API pattern
      const { data: statsData, error: statsError } = await terminalClient.getLiveStats();
      if (statsData) {
        setLiveStats(statsData);
      } else if (statsError) {
        console.warn('Live stats unavailable:', statsError.message);
      }
      
      setTimeout(() => setLoading(false), 1500);
    };

    initializeJarvis();
  }, []);

  const installMethods = [
    { 
      id: 'npx', 
      label: 'Try Instantly', 
      command: 'npx terminal-jarvis',
      description: 'No installation required'
    },
    { 
      id: 'npm', 
      label: 'Install via NPM', 
      command: 'npm install -g terminal-jarvis',
      description: 'For regular use'
    },
    { 
      id: 'cargo', 
      label: 'Install via Cargo', 
      command: 'cargo install terminal-jarvis',
      description: 'Rust users'
    },
    { 
      id: 'brew', 
      label: 'Install via Homebrew', 
      command: 'brew install terminal-jarvis',
      description: 'macOS/Linux'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="terminal-title text-cyan-400 text-2xl mb-8 electric-glow">
            TERMINAL JARVIS INITIALIZING...
          </div>
          <div className="w-96 h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full loading-bar"></div>
          </div>
          <div className="terminal-mono text-slate-400 text-sm">
            DISCOVERING AI CODING TOOLS...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Section Navigator */}
      <SectionNavigator />

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center py-responsive-xl">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md text-center">
          <div className="mb-8">
            {jarvisAlive && (
              <div className="flex items-center justify-center mt-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2 shadow-lg shadow-green-400/50"></div>
                <span className="terminal-mono text-green-400 text-sm">SYSTEM ONLINE</span>
              </div>
            )}
          </div>

          <h1 className="terminal-text text-4xl-responsive md:text-5xl-responsive text-white mb-responsive-md leading-tight">
            YOUR AI TOOLS HEADQUARTERS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 electric-glow">
              ALL IN ONE TERMINAL
            </span>
          </h1>

          <p className="terminal-body text-lg-responsive text-slate-300 mb-responsive-sm max-w-responsive-4xl mx-auto leading-relaxed">
            Terminal Jarvis was designed to be your centralized hub for AI coding tools. 
            Instead of juggling multiple CLIs, authentication tokens, and command syntaxes, 
            everything flows through one beautiful, unified interface.
          </p>

          <p className="terminal-body text-base-responsive text-slate-400 mb-responsive-lg max-w-responsive-3xl mx-auto">
            Switch between {liveStats?.toolStatus.supportedTools.join(', ') || 'Claude, Gemini, Qwen, OpenCode, LLXPRT, Codex, and Crush'} AI coding assistants 
            seamlessly. One installation, one interface, {liveStats?.toolStatus.totalToolCount || '7'} tools integrated.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="terminal-mono bg-orange-500 text-white px-3 py-1 rounded text-sm">
              NPM v{liveStats?.version || '0.0.55'}
            </div>
            <div className="terminal-mono bg-green-500 text-white px-3 py-1 rounded text-sm">
              {liveStats ? `${Math.round(liveStats.downloadStats.npmWeeklyDownloads / 1000 * 10) / 10}K/week` : '2.2K/week'} Downloads
            </div>
            <div className="terminal-mono bg-blue-500 text-white px-3 py-1 rounded text-sm">
              {liveStats?.communityStats.githubStars || '48'} GitHub Stars
            </div>
            <div className="terminal-mono bg-purple-500 text-white px-3 py-1 rounded text-sm">
              Homebrew Available
            </div>
          </div>

          <div className="mb-responsive-lg">
            <TJarvisRetroLogo width={600} height={180} />
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="terminal-body text-lg-responsive text-slate-300 mb-responsive-md leading-relaxed">
              Think of this tool as the ultimate way to sample AI tools to get started, and then swap between them once you find your preferred flow. Which helps you SAVE TIME! Start up your favorite AI tool 
              quickly, and swap to another one just as fast!
            </p>
            <p className="terminal-body text-base-responsive text-slate-400 leading-relaxed">
              <span className="text-cyan-400 font-semibold">Under the hood:</span> Terminal Jarvis is a 
              Rust-based CLI wrapper that provides a unified interface to install, update, and run AI coding 
              tools seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="quickstart" className="relative z-10 min-h-screen flex items-center justify-center bg-slate-900/40 backdrop-blur-sm py-responsive-xl">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md w-full">
          <h3 className="terminal-title text-3xl-responsive text-center text-white mb-responsive-2xl">
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
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-cyan-300 hover:bg-slate-600'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* Command Display */}
          <div className="bg-slate-900/80 border border-slate-600 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="terminal-mono text-cyan-400 text-sm mb-1">
                  {installMethods.find(m => m.id === selectedInstallMethod)?.description}
                </div>
                <div className="terminal-mono text-slate-400 text-xs">
                  Copy and paste into your terminal
                </div>
              </div>
              <button className="terminal-mono text-xs bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-1 rounded transition-colors">
                COPY
              </button>
            </div>
            <div className="terminal-mono text-lg">
              <span className="text-cyan-400">$</span>
              <span className="text-white ml-3">
                {installMethods.find(m => m.id === selectedInstallMethod)?.command}
              </span>
            </div>
          </div>

          {/* Interactive Mode Preview */}
          <div className="mt-12 bg-slate-900/80 border border-slate-600 rounded-xl p-6 max-w-4xl mx-auto">
            <h4 className="terminal-text text-cyan-400 text-lg mb-4">
             ENTER INTERACTIVE MODE (RECOMMENDED FOR NEW USERS)
            </h4>
            <div className="terminal-mono text-sm space-y-2">
              <div>
                <span className="text-cyan-400">$</span>
                <span className="text-white ml-2">terminal-jarvis</span>
              </div>
              <div className="text-slate-400 pl-4">
                # Type this in your Terminal to enter interactive mode and explore all tools
              </div>
            </div>

            <h4 className="terminal-text text-cyan-400 text-lg mb-4 mt-8">
              DIRECT TOOL EXECUTION EXAMPLES
            </h4>
            <div className="terminal-mono text-sm space-y-1">
              <div>
                <span className="text-cyan-400">$</span>
                <span className="text-white ml-2">terminal-jarvis run claude --prompt "Explain this code"</span>
              </div>
              <div>
                <span className="text-cyan-400">$</span>
                <span className="text-white ml-2">terminal-jarvis run gemini --file src/main.rs</span>
              </div>
              <div>
                <span className="text-cyan-400">$</span>
                <span className="text-white ml-2">terminal-jarvis run qwen --analyze</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative z-10 min-h-screen flex items-center justify-center bg-slate-900/60 backdrop-blur-sm py-responsive-xl">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md text-center w-full">
          {tools && <ToolsShowcase tools={tools} />}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-responsive-2xl border-t border-slate-700">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md text-center">
          <div className="terminal-mono text-slate-400 mb-responsive-sm text-base-responsive">
            BUILT BY BRANDON CALDERÓN-MORALES
          </div>
          <div className="flex justify-center space-x-responsive-md text-sm-responsive mb-responsive-sm">
            <a href="https://github.com/BA-CalderonMorales/terminal-jarvis/tree/develop" target="_blank" rel="noopener noreferrer" className="terminal-mono text-slate-500 hover:text-cyan-400 transition-colors">DOCUMENTATION</a>
            <a href="https://github.com/BA-CalderonMorales/terminal-jarvis" target="_blank" rel="noopener noreferrer" className="terminal-mono text-slate-500 hover:text-cyan-400 transition-colors">GITHUB</a>
            <a href="https://www.npmjs.com/package/terminal-jarvis" target="_blank" rel="noopener noreferrer" className="terminal-mono text-slate-500 hover:text-cyan-400 transition-colors">NPM</a>
            <a href="https://crates.io/crates/terminal-jarvis" target="_blank" rel="noopener noreferrer" className="terminal-mono text-slate-500 hover:text-cyan-400 transition-colors">CRATES.IO</a>
          </div>
          <div className="text-xs-responsive text-slate-600">
            Frontend by <a href="https://angel-vazquez.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 transition-colors">angel-vazquez.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}