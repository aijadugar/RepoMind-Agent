import React from 'react';
import { RepoAnalysis } from '../types';
import { ShieldAlert, Layers, Code2, BookOpen, CheckCircle, FileCode } from 'lucide-react';

interface ReportProps {
  data: RepoAnalysis;
}

const SeverityBadge = ({ level }: { level: string }) => {
  const colors = {
    Low: 'bg-blue-900/50 text-blue-300 border-blue-700',
    Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    High: 'bg-orange-900/50 text-orange-300 border-orange-700',
    Critical: 'bg-red-900/50 text-red-300 border-red-700'
  };
  // @ts-ignore
  const style = colors[level] || colors.Low;
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${style} font-mono uppercase`}>
      {level}
    </span>
  );
};

export const Report: React.FC<ReportProps> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="glass-panel p-6 rounded-lg border-l-4 border-cyber-accent">
        <h2 className="text-2xl font-bold text-white mb-2 font-sans tracking-tight">Executive Summary</h2>
        <p className="text-gray-300 leading-relaxed text-lg">{data.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
           {data.languages.map(lang => (
             <span key={lang} className="px-3 py-1 bg-cyber-800 rounded-full text-xs font-mono text-cyber-accent border border-cyber-700">
               {lang}
             </span>
           ))}
           <span className="px-3 py-1 bg-cyber-800 rounded-full text-xs font-mono text-gray-400 border border-cyber-700 ml-auto">
             Confidence: <span className={data.confidence === 'High' ? 'text-green-400' : 'text-yellow-400'}>{data.confidence}</span>
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Architecture */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center mb-4 text-cyber-accent">
            <Layers className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">System Architecture</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {data.architecture}
          </p>
        </div>

        {/* Modules */}
        <div className="glass-panel p-6 rounded-lg">
           <div className="flex items-center mb-4 text-cyber-success">
            <Code2 className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Key Modules</h3>
          </div>
          <ul className="space-y-3">
            {data.modules.map((mod, idx) => (
              <li key={idx} className="flex flex-col border-b border-cyber-800 pb-2 last:border-0 last:pb-0">
                <span className="text-white font-mono font-bold text-sm">{mod.name}</span>
                <span className="text-gray-400 text-xs">{mod.responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risks */}
        <div className="glass-panel p-6 rounded-lg lg:col-span-2">
          <div className="flex items-center mb-4 text-cyber-danger">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Identified Risks & Anti-Patterns</h3>
          </div>
          <div className="space-y-4">
            {data.risks.map((risk, idx) => (
              <div key={idx} className="flex items-start bg-cyber-900/50 p-3 rounded border border-cyber-800">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-gray-200 font-semibold text-sm">{risk.title}</span>
                     <SeverityBadge level={risk.severity} />
                  </div>
                  <p className="text-gray-400 text-xs">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Tree Mock */}
        <div className="glass-panel p-6 rounded-lg">
           <div className="flex items-center mb-4 text-gray-300">
            <FileCode className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Ingested Files</h3>
          </div>
          <div className="font-mono text-xs text-gray-500 space-y-1">
            {data.file_tree.map((file, i) => (
              <div key={i} className="hover:text-cyber-accent cursor-default transition-colors">
                {i === data.file_tree.length - 1 ? '└─ ' : '├─ '} {file}
              </div>
            ))}
            {data.file_tree.length > 0 && <div className="pl-4 opacity-50">...</div>}
          </div>
        </div>
      </div>

      {/* Onboarding */}
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex items-center mb-4 text-blue-400">
          <BookOpen className="w-5 h-5 mr-2" />
          <h3 className="font-bold uppercase tracking-widest text-sm">Onboarding Protocol</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.onboarding.map((step, idx) => (
            <div key={idx} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-cyber-800 bg-cyber-success rounded-full mr-3 mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};