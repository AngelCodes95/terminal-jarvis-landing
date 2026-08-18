import { useState, useEffect } from 'react';
import { realDataService, type LiveUpdates, type ToolsResponse } from '../api';
import { ToolsShowcase } from './ToolsShowcase';
import { SectionNavigator } from './SectionNavigator';

const SAMPLE_READY_HARNESSES = ['claude', 'codex', 'gemini', 'aider', 'goose', 'opencode'];

export function TerminalJarvisLanding() {
  // Seeded synchronously so the page renders real content on the first
  // paint instead of gating everything behind a loading screen; the effect
  // below swaps in live data in place once the network calls resolve.
  const [tools, setTools] = useState<ToolsResponse>(() => realDataService.getFallbackTools());
  const [liveStats, setLiveStats] = useState<LiveUpdates | null>(null);
  const [selectedInstallMethod, setSelectedInstallMethod] = useState('npx');
  const [currentVersion, setCurrentVersion] = useState('0.1.15');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const loadLiveData = async () => {
      const { data: toolsData } = await realDataService.getTools();
      if (toolsData) setTools(toolsData);

      const { data: statsData } = await realDataService.getLiveStats();
      if (statsData) {
        setLiveStats(statsData);
        if (statsData.downloadStats.npmVersion) {
          setCurrentVersion(statsData.downloadStats.npmVersion);
        }
      }
    };

    loadLiveData().catch((err) => console.error('Failed to load live data:', err));
  }, []);

  const copyTextToClipboard = async () => {
    const selectedMethod = installMethods.find((m) => m.id === selectedInstallMethod);
    if (!selectedMethod) return;

    const textToCopy = selectedMethod.command;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy operation failed:', err);
    }
  };

  const installMethods = [
    {
      id: 'npx',
      label: 'Try instantly',
      command: 'npx terminal-jarvis',
      description: 'No installation required',
    },
    {
      id: 'npm',
      label: 'npm',
      command: 'npm install -g terminal-jarvis',
      description: 'For regular use',
    },
    {
      id: 'cargo',
      label: 'Cargo',
      command: 'cargo install terminal-jarvis',
      description: 'Rust users',
    },
    {
      id: 'brew',
      label: 'Homebrew',
      command: 'brew install BA-CalderonMorales/homebrew-terminal-jarvis/terminal-jarvis',
      description: 'macOS/Linux',
    },
  ];

  const formatDownloads = (count?: number) => {
    if (!count) return '—';
    if (count >= 1000) return `${Math.round((count / 1000) * 10) / 10}K`;
    return `${count}`;
  };

  const stats = [
    { label: 'Version', value: `v${liveStats?.downloadStats.npmVersion || currentVersion}` },
    {
      label: 'Weekly downloads',
      value: formatDownloads(liveStats?.downloadStats.npmWeeklyDownloads),
    },
    { label: 'GitHub stars', value: `${liveStats?.communityStats.githubStars ?? 131}` },
    { label: 'Harnesses', value: `${liveStats?.toolStatus.totalToolCount || 25}` },
  ];

  return (
    <div className="w-full theme-bg-primary pt-14">
      <SectionNavigator />

      {/* Hero */}
      <section id="hero" className="relative min-h-[90vh] flex items-center py-responsive-2xl">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md w-full">
          <div className="grid lg:grid-cols-2 gap-responsive-2xl items-center">
            <div>
              <p className="terminal-mono text-xs theme-accent tracking-wide uppercase mb-responsive-sm">
                Command-line orchestration
              </p>
              <h1 className="terminal-title text-4xl-responsive md:text-5xl-responsive theme-text-primary mb-responsive-md">
                One terminal. Every coding agent.
              </h1>
              <p className="terminal-body text-lg-responsive theme-text-secondary mb-responsive-lg leading-relaxed max-w-responsive-lg">
                {liveStats?.toolStatus.totalToolCount || 25} AI coding-agent harnesses — Claude,
                Codex, Gemini, Aider, and more — the same install, update, and run surface, plus
                an optional local security gate before anything executes.
              </p>

              <div className="theme-bg-secondary theme-border border rounded-lg p-4 mb-responsive-md max-w-responsive-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="terminal-mono text-xs theme-text-secondary">
                    {installMethods.find((m) => m.id === selectedInstallMethod)?.description}
                  </span>
                  <button
                    onClick={copyTextToClipboard}
                    className="terminal-mono text-xs theme-text-secondary hover:theme-text-primary transition-colors"
                  >
                    {copySuccess ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="terminal-mono text-sm theme-text-primary">
                  <span className="theme-text-secondary">$</span>{' '}
                  {installMethods.find((m) => m.id === selectedInstallMethod)?.command}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-responsive-lg">
                {installMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedInstallMethod(method.id)}
                    className={`terminal-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                      selectedInstallMethod === method.id
                        ? 'theme-border-primary theme-text-primary'
                        : 'theme-border theme-text-secondary hover:theme-text-primary'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-responsive-lg">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="terminal-title text-xl-responsive theme-text-primary">
                      {stat.value}
                    </div>
                    <div className="terminal-body text-xs theme-text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="theme-bg-secondary theme-border border rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b theme-border">
                <div className="w-2.5 h-2.5 rounded-full theme-bg-tertiary" />
                <div className="w-2.5 h-2.5 rounded-full theme-bg-tertiary" />
                <div className="w-2.5 h-2.5 rounded-full theme-bg-tertiary" />
              </div>
              <div className="p-5 terminal-mono text-sm space-y-1.5">
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis tui</span>
                </div>
                <div className="theme-text-secondary pt-2">terminal-jarvis v{currentVersion}</div>
                <div className="theme-text-secondary mb-2">
                  {liveStats?.toolStatus.totalToolCount || 25} harnesses available · gate: off
                </div>
                {SAMPLE_READY_HARNESSES.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <span style={{ color: 'var(--success)' }}>›</span>
                    <span className="theme-text-primary">{name}</span>
                    <span className="theme-text-secondary text-xs ml-auto">ready</span>
                  </div>
                ))}
                <p className="terminal-body text-xs theme-text-secondary opacity-60 pt-3">
                  Illustrative session output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section
        id="quickstart"
        className="relative theme-bg-secondary border-y theme-border py-responsive-2xl"
      >
        <div className="max-w-responsive-6xl mx-auto px-responsive-md">
          <h2 className="terminal-title text-2xl-responsive text-center theme-text-primary mb-responsive-2xl">
            From zero to a running agent
          </h2>

          <div className="grid md:grid-cols-3 gap-responsive-lg">
            <div>
              <h3 className="terminal-text text-sm theme-text-primary mb-responsive-sm">
                Interactive mode
              </h3>
              <div className="terminal-mono text-xs space-y-1 theme-bg-primary theme-border border rounded-md p-3">
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis tui</span>
                </div>
                <div className="theme-text-secondary">
                  Opens the chat-style switcher (bare "tj" works too)
                </div>
              </div>
            </div>

            <div>
              <h3 className="terminal-text text-sm theme-text-primary mb-responsive-sm">
                Discover and inspect
              </h3>
              <div className="terminal-mono text-xs space-y-1.5 theme-bg-primary theme-border border rounded-md p-3">
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis list</span>
                </div>
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis show opencode</span>
                </div>
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis plan codex headless</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="terminal-text text-sm theme-text-primary mb-responsive-sm">
                Select, verify, gate
              </h3>
              <div className="terminal-mono text-xs space-y-1.5 theme-bg-primary theme-border border rounded-md p-3">
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis use opencode</span>
                </div>
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis check</span>
                </div>
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis gate enable trivy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="relative py-responsive-2xl">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md">
          <h2 className="terminal-title text-2xl-responsive text-center theme-text-primary mb-responsive-sm">
            An optional gate before anything runs
          </h2>
          <p className="terminal-body text-base-responsive theme-text-secondary mb-responsive-xl max-w-responsive-lg mx-auto text-center leading-relaxed">
            Terminal Jarvis hands real commands to real AI agents, so it ships a local Trivy-based
            gate to check them first. Off by default — it never installs a scanner or sends
            workspace data anywhere on its own.
          </p>

          <div className="grid lg:grid-cols-2 gap-responsive-lg items-start">
            <div className="space-y-responsive-sm">
              <div className="theme-bg-secondary theme-border border rounded-lg p-5">
                <h3 className="terminal-text text-sm theme-text-primary mb-2">
                  Pre-install package check
                </h3>
                <p className="terminal-body text-sm theme-text-secondary leading-relaxed">
                  Before an npm-backed harness installs or updates, the gate resolves its
                  dependency tree and scans it with Trivy. A clean verdict proceeds silently.
                </p>
              </div>
              <div className="theme-bg-secondary theme-border border rounded-lg p-5">
                <h3 className="terminal-text text-sm theme-text-primary mb-2">
                  Fail-closed by default
                </h3>
                <p className="terminal-body text-sm theme-text-secondary leading-relaxed">
                  HIGH or CRITICAL findings print the Trivy report and ask before continuing.
                  Noninteractive runs stay blocked unless explicitly overridden.
                </p>
              </div>
              <div className="theme-bg-secondary theme-border border rounded-lg p-5">
                <h3 className="terminal-text text-sm theme-text-primary mb-2">
                  Scans the workspace too
                </h3>
                <p className="terminal-body text-sm theme-text-secondary leading-relaxed">
                  Once enabled, <code className="terminal-mono">run</code>, direct harness
                  invocation, and <code className="terminal-mono">update</code> all scan before
                  the harness command starts.
                </p>
              </div>
            </div>

            <div className="theme-bg-secondary theme-border border rounded-lg overflow-hidden">
              <div className="p-5 terminal-mono text-sm space-y-1">
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis gate enable trivy</span>
                </div>
                <div style={{ color: 'var(--success)' }}>gate set to: trivy</div>
                <div className="pt-3">
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis run claude</span>
                </div>
                <div style={{ color: 'var(--success)' }}>security scan (trivy) ... passed</div>
                <div style={{ color: 'var(--success)' }}>package check .......... clean</div>
                <div className="theme-text-secondary">→ launching claude</div>
              </div>
              <div className="border-t theme-border p-5 terminal-mono text-sm space-y-1">
                <div>
                  <span className="theme-text-secondary">$</span>{' '}
                  <span className="theme-text-primary">terminal-jarvis install some-agent</span>
                </div>
                <div style={{ color: 'var(--danger)' }}>
                  security scan (trivy) ... 2 HIGH findings
                </div>
                <div className="theme-text-secondary">Continue installing anyway? [y/N]</div>
              </div>
              <p className="terminal-body text-xs theme-text-secondary opacity-60 px-5 pb-4">
                Illustrative output, styled to match the real gate verdict cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section
        id="tools"
        className="relative theme-bg-secondary border-y theme-border py-responsive-2xl"
      >
        <div className="max-w-responsive-6xl mx-auto px-responsive-md">
          <ToolsShowcase tools={tools} />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-responsive-xl">
        <div className="max-w-responsive-6xl mx-auto px-responsive-md flex flex-col sm:flex-row items-center justify-between gap-responsive-md">
          <div className="terminal-mono text-xs theme-text-secondary">terminal-jarvis</div>
          <div className="flex gap-responsive-md text-xs-responsive">
            <a
              href="https://github.com/BA-CalderonMorales/terminal-jarvis/tree/main#terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-body theme-text-secondary hover:theme-text-primary transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/BA-CalderonMorales/terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-body theme-text-secondary hover:theme-text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-body theme-text-secondary hover:theme-text-primary transition-colors"
            >
              npm
            </a>
            <a
              href="https://crates.io/crates/terminal-jarvis"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-body theme-text-secondary hover:theme-text-primary transition-colors"
            >
              crates.io
            </a>
          </div>
          <div className="terminal-body text-xs-responsive theme-text-secondary">
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
