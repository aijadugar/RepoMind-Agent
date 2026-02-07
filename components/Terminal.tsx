import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-cyber-900 border border-cyber-700 rounded-lg overflow-hidden shadow-2xl font-mono text-sm">
      <div className="flex items-center px-4 py-2 bg-cyber-800 border-b border-cyber-700 select-none">
        <TerminalIcon className="w-4 h-4 text-cyber-accent mr-2" />
        <span className="text-gray-400 font-semibold tracking-wider text-xs">REPOMIND_KERNEL_V4.2.0</span>
        <div className="ml-auto flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyber-700"></div>
          <div className="w-2 h-2 rounded-full bg-cyber-700"></div>
          <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 scrollbar-thin">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start animate-fade-in-up">
            <span className="text-gray-600 mr-2 shrink-0">[{log.timestamp}]</span>
            {log.tool && (
              <span className="text-purple-400 font-bold mr-2 shrink-0">[{log.tool}]</span>
            )}
            <span
              className={`
                ${log.type === 'error' ? 'text-cyber-danger' : ''}
                ${log.type === 'warning' ? 'text-cyber-warning' : ''}
                ${log.type === 'success' ? 'text-cyber-success' : ''}
                ${log.type === 'info' ? 'text-gray-300' : ''}
                ${log.type === 'system' ? 'text-cyber-accent font-bold' : ''}
                break-all
              `}
            >
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};