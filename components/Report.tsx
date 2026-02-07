import React from "react";
import { RepoAnalysis } from "../types";
import {
  ShieldAlert,
  Layers,
  Code2,
  BookOpen,
  CheckCircle,
  FileCode,
} from "lucide-react";

interface ReportProps {
  data: RepoAnalysis;
}

const SeverityBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    Low: "bg-blue-900/50 text-blue-300 border-blue-700",
    Medium: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
    High: "bg-orange-900/50 text-orange-300 border-orange-700",
    Critical: "bg-red-900/50 text-red-300 border-red-700",
  };

  const style = colors[level] || colors.Low;

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs border ${style} font-mono uppercase`}
    >
      {level}
    </span>
  );
};

export const Report: React.FC<ReportProps> = ({ data }) => {
  const hasLanguages = data.languages && data.languages.length > 0;
  const hasModules = data.key_modules && data.key_modules.length > 0;
  const hasRisks =
    data.risks_and_antipatterns &&
    data.risks_and_antipatterns.length > 0;
  const hasFiles = data.file_tree && data.file_tree.length > 0;
  const hasOnboarding =
    data.onboarding_guide && data.onboarding_guide.length > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="glass-panel p-6 rounded-lg border-l-4 border-cyber-accent">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Autonomous Repository Analysis
        </h2>

        <p className="text-gray-300 leading-relaxed text-lg">
          RepoMind Agent has generated a system-level understanding of this
          codebase, including architecture, risks, and onboarding guidance.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          {hasLanguages ? (
            data.languages!.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 bg-cyber-800 rounded-full text-xs font-mono text-cyber-accent border border-cyber-700"
              >
                {lang}
              </span>
            ))
          ) : (
            <span className="text-xs italic text-gray-500">
              Languages inferred by agent
            </span>
          )}

          {data.confidence_level && (
            <span className="px-3 py-1 bg-cyber-800 rounded-full text-xs font-mono text-gray-400 border border-cyber-700 ml-auto">
              Confidence:{" "}
              <span
                className={
                  data.confidence_level === "High"
                    ? "text-green-400"
                    : data.confidence_level === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                }
              >
                {data.confidence_level}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Architecture + Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Architecture */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center mb-4 text-cyber-accent">
            <Layers className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">
              System Architecture
            </h3>
          </div>

          {data.architecture_overview ? (
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {data.architecture_overview}
            </p>
          ) : (
            <p className="text-gray-500 italic text-sm">
              Architecture overview not provided by agent.
            </p>
          )}
        </div>

        {/* Modules */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center mb-4 text-cyber-success">
            <Code2 className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">
              Key Modules & Responsibilities
            </h3>
          </div>

          {hasModules ? (
            <ul className="space-y-3">
              {data.key_modules!.map((mod, idx) => (
                <li
                  key={idx}
                  className="flex flex-col border-b border-cyber-800 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-white font-mono font-bold text-sm">
                    {mod.name || "Unnamed module"}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {mod.responsibility || "No responsibility description"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-sm">
              No key modules identified.
            </p>
          )}
        </div>
      </div>

      {/* Risks + File Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risks */}
        <div className="glass-panel p-6 rounded-lg lg:col-span-2">
          <div className="flex items-center mb-4 text-cyber-danger">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">
              Risks & Anti-Patterns
            </h3>
          </div>

          {hasRisks ? (
            <div className="space-y-4">
              {data.risks_and_antipatterns!.map((risk, idx) => (
                <div
                  key={idx}
                  className="flex items-start bg-cyber-900/50 p-3 rounded border border-cyber-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-200 font-semibold text-sm">
                        {risk.title || "Unnamed risk"}
                      </span>
                      {risk.severity && (
                        <SeverityBadge level={risk.severity} />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">
                      {risk.description ||
                        "No detailed description provided."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">
              No major risks detected by agent.
            </p>
          )}
        </div>

        {/* File Tree */}
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex items-center mb-4 text-gray-300">
            <FileCode className="w-5 h-5 mr-2" />
            <h3 className="font-bold uppercase tracking-widest text-sm">
              Ingested Files
            </h3>
          </div>

          <div className="font-mono text-xs text-gray-500 space-y-1">
            {hasFiles ? (
              data.file_tree!.map((file, i) => (
                <div
                  key={i}
                  className="hover:text-cyber-accent transition-colors"
                >
                  {i === data.file_tree!.length - 1 ? "└─ " : "├─ "}
                  {file}
                </div>
              ))
            ) : (
              <div className="italic opacity-50">
                File tree inferred by agent
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding */}
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex items-center mb-4 text-blue-400">
          <BookOpen className="w-5 h-5 mr-2" />
          <h3 className="font-bold uppercase tracking-widest text-sm">
            Onboarding Guide
          </h3>
        </div>

        {hasOnboarding ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.onboarding_guide!.map((step, idx) => (
              <div key={idx} className="flex items-start">
                <CheckCircle className="w-4 h--4 text-cyber-800 bg-cyber-success rounded-full mr-3 mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">{step}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">
            No onboarding steps generated.
          </p>
        )}
      </div>
    </div>
  );
};