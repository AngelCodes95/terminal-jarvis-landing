import { type ToolsResponse, type TerminalTool } from '../api';

interface ToolsShowcaseProps {
  tools: ToolsResponse;
}

export function ToolsShowcase({ tools }: ToolsShowcaseProps) {
  return (
    <div className="w-full">
      <div className="max-w-responsive-6xl mx-auto px-responsive-md">
        <div className="text-center mb-12">
          <h3 className="terminal-title text-3xl-responsive theme-text-primary mb-responsive-sm">
            {tools.totalCount} harnesses, one interface
          </h3>
          <p className="terminal-body text-base-responsive theme-text-secondary max-w-responsive-2xl mx-auto">
            Every coding agent below is reachable through the same install, update, and run
            commands.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-responsive-md">
          {tools.tools.map((tool: TerminalTool) => (
            <div
              key={tool.name}
              className="theme-bg-secondary theme-border border rounded-lg p-4 hover:theme-border-primary transition-colors duration-150"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="terminal-text text-sm theme-text-primary">{tool.name}</h4>
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--success)' }}
                  aria-hidden="true"
                />
              </div>
              <p className="terminal-body text-xs theme-text-secondary leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
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
