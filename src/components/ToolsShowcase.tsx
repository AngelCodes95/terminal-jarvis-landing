import { useState } from 'react';
import { type ToolsResponse, type TerminalTool } from '../api';
import { copyToClipboard } from '../utils/clipboard';

interface ToolsShowcaseProps {
  tools: ToolsResponse;
}

export function ToolsShowcase({ tools }: ToolsShowcaseProps) {
  const [copiedTool, setCopiedTool] = useState<string | null>(null);

  const handleCardClick = async (tool: TerminalTool) => {
    try {
      await copyToClipboard(tool.command);
      setCopiedTool(tool.name);
      setTimeout(
        () => setCopiedTool((current) => (current === tool.name ? null : current)),
        2000
      );
    } catch (err) {
      console.error('Copy operation failed:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-responsive-6xl mx-auto px-responsive-md">
        <div className="text-center mb-12">
          <h3 className="terminal-title text-3xl-responsive theme-text-primary mb-responsive-sm">
            {tools.totalCount} harnesses, one interface
          </h3>
          <p className="terminal-body text-base-responsive theme-text-secondary max-w-responsive-2xl mx-auto">
            Every coding agent below is reachable through the same install, update, and run
            commands. Click a card to copy its inspect command.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-responsive-md">
          {tools.tools.map((tool: TerminalTool) => {
            const isCopied = copiedTool === tool.name;
            return (
              <button
                key={tool.name}
                onClick={() => handleCardClick(tool)}
                className="group text-left theme-bg-secondary theme-border border rounded-lg p-4 hover:theme-border-primary transition-colors duration-150 w-full"
                aria-label={`Copy setup command for ${tool.name}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="terminal-text text-sm theme-text-primary">{tool.name}</h4>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--success)' }}
                    aria-hidden="true"
                  />
                </div>
                <p className="terminal-body text-xs theme-text-secondary leading-relaxed mb-2">
                  {tool.description}
                </p>
                <p
                  className={`terminal-mono text-xs truncate transition-opacity duration-150 ${
                    isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                  }`}
                  style={{ color: isCopied ? 'var(--success)' : undefined }}
                >
                  {isCopied ? 'Copied' : tool.command}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-responsive-2xl flex flex-wrap justify-center gap-responsive-2xl max-w-responsive-2xl mx-auto">
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive theme-text-primary mb-responsive-xs">
              {tools.totalCount}
            </div>
            <div className="terminal-body text-sm-responsive theme-text-secondary">
              AI coding harnesses
            </div>
          </div>
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive theme-text-primary mb-responsive-xs">
              MIT
            </div>
            <div className="terminal-body text-sm-responsive theme-text-secondary">
              Open source license
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
