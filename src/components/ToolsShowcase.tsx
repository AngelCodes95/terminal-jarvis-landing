import React from 'react';
import { type ToolsResponse } from '../api/terminalClient';

interface ToolsShowcaseProps {
  tools: ToolsResponse;
}

function getToolUseCase(toolName: string): string {
  const useCases: { [key: string]: string } = {
    'claude': 'Debug React hooks',
    'gemini': 'Explain complex code',
    'qwen': 'Algorithm analysis',
    'opencode': 'Generate clean code',
    'llxprt': 'Expert code review',
    'codex': 'Natural language to code',
    'crush': 'Optimize performance'
  };
  
  return useCases[toolName] || 'Code assistance';
}

export function ToolsShowcase({ tools }: ToolsShowcaseProps) {
  return (
    <div className="w-full">
      <div className="max-w-responsive-6xl mx-auto px-responsive-md">
        <div className="text-center mb-12">
          <h3 className="terminal-title text-3xl-responsive text-white mb-responsive-sm">
            SUPPORTED TOOLS ({tools.totalCount})
          </h3>
          <p className="terminal-body text-base-responsive text-slate-400 max-w-responsive-2xl mx-auto">
            All tools accessible through one unified command interface
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-responsive-lg">
          {tools.tools.map((tool, index) => (
            <div
              key={tool.name}
              className="group bg-slate-900/80 border border-slate-600 rounded-lg p-5 hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Tool header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                  tool.status === 'active' ? 'bg-green-400 shadow-green-400/50' :
                  tool.status === 'loading' ? 'bg-yellow-400 shadow-yellow-400/50 animate-spin' :
                  'bg-slate-500 shadow-slate-500/30'
                }`}></div>
                <span className="terminal-mono text-xs text-slate-500 uppercase">
                  {tool.category}
                </span>
              </div>

              {/* Tool name */}
              <h4 className="terminal-text text-lg text-white mb-2 group-hover:text-cyan-400 transition-all duration-300 group-hover:glow">
                {tool.name}
                <span className="ml-2 opacity-0 group-hover:opacity-100 text-xs text-cyan-400 transition-opacity duration-300">●</span>
              </h4>

              {/* Description */}
              <p className="terminal-mono text-xs text-slate-400 mb-3 leading-relaxed">
                {tool.description}
              </p>

              {/* Use case example */}
              <div className="bg-slate-950/80 rounded px-3 py-2 border border-slate-700 group-hover:border-cyan-400/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="terminal-mono text-xs text-cyan-300 group-hover:text-cyan-200">
                    {getToolUseCase(tool.name)}
                  </span>
                  <div className="flex space-x-1">
                    <div className={`w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 ${tool.status === 'active' ? 'animate-pulse' : ''}`}></div>
                    <div className={`w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-75 transition-all duration-300 delay-200 ${tool.status === 'active' ? 'animate-pulse' : ''}`}></div>
                    <div className={`w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-50 transition-all duration-300 delay-300 ${tool.status === 'active' ? 'animate-pulse' : ''}`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-responsive-2xl grid grid-cols-1 md:grid-cols-3 gap-responsive-md max-w-responsive-4xl mx-auto">
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive text-cyan-400 mb-responsive-xs">
              {tools.totalCount}
            </div>
            <div className="terminal-mono text-sm-responsive text-slate-400">
              AI TOOLS INTEGRATED
            </div>
          </div>
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive text-cyan-400 mb-responsive-xs">
              {tools.totalCount}
            </div>
            <div className="terminal-mono text-sm-responsive text-slate-400">
              TOOLS AVAILABLE
            </div>
          </div>
          <div className="text-center">
            <div className="terminal-title text-2xl-responsive text-cyan-400 mb-responsive-xs">
              MIT
            </div>
            <div className="terminal-mono text-sm-responsive text-slate-400">
              OPEN SOURCE LICENSE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}