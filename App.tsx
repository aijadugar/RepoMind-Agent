import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal } from './components/Terminal';
import { Pipeline } from './components/Pipeline';
import { Report } from './components/Report';
import { analyzeRepository } from './services/gemini';
import { AnalysisStage, LogEntry, RepoAnalysis } from './types';
import { Search, BrainCircuit, Activity } from 'lucide-react';

const INITIAL_LOG: LogEntry = {
  id: 'init',
  timestamp: new Date().toLocaleTimeString(),
  message: 'RepoMind Agent initialized. Awaiting target coordinates.',
  type: 'system'
};

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [stage, setStage] = useState<AnalysisStage>(AnalysisStage.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([INITIAL_LOG]);
  const [report, setReport] = useState<RepoAnalysis | null>(null);
  
  // Ref to hold the raw URL for internal processing without re-renders
  const processingUrlRef = useRef('');

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', tool?: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      tool
    }]);
  }, []);

  const handleSimulatedDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runAnalysis = async () => {
    if (!repoUrl.trim()) return;
    if (stage !== AnalysisStage.IDLE && stage !== AnalysisStage.COMPLETE && stage !== AnalysisStage.ERROR) return;

    processingUrlRef.current = repoUrl;
    setStage(AnalysisStage.PLANNING);
    setReport(null);
    setLogs([]); // Clear previous logs
    addLog(`Target acquired: ${repoUrl}`, 'system');
    addLog('Initiating Deep Analysis Protocol...', 'system');

    try {
      // --- STAGE: PLANNING ---
      await handleSimulatedDelay(1000);
      addLog('Parsing repository metadata...', 'info', 'TOOL:INGEST_REPO');
      addLog(`Identified host: GitHub`, 'info');
      addLog(`Protocol: HTTPS`, 'info');
      
      // --- STAGE: INGESTING ---
      setStage(AnalysisStage.INGESTING);
      await handleSimulatedDelay(1200);
      addLog('Cloning virtual reference...', 'info', 'TOOL:INGEST_REPO');
      addLog('Indexing file tree structure...', 'info');
      addLog('Detecting primary languages...', 'info');
      
      // --- STAGE: ANALYZING ---
      setStage(AnalysisStage.ANALYZING);
      addLog('Building Abstract Syntax Trees (AST)...', 'info', 'TOOL:ANALYZE');
      await handleSimulatedDelay(1000);
      addLog('Tracing data flow paths...', 'info');
      addLog('Identifying architectural boundaries...', 'info');
      addLog('Scanning for security hotspots...', 'warning');

      // --- STAGE: GENERATING (The real AI call) ---
      setStage(AnalysisStage.GENERATING);
      addLog('Synthesizing intelligence artifacts...', 'system', 'TOOL:GENERATE_ARTIFACTS');
      
      // Trigger Gemini
      const result = await analyzeRepository(processingUrlRef.current);
      
      addLog('Artifacts generated successfully.', 'success');
      
      // --- STAGE: VERIFYING ---
      setStage(AnalysisStage.VERIFYING);
      addLog('Cross-referencing conclusions...', 'info', 'TOOL:SELF_VERIFY');
      await handleSimulatedDelay(1500);
      addLog(`Confidence Score: ${result.confidence}`, 'info');
      
      if (result.confidence === 'Low') {
        addLog('Confidence low. Re-evaluating critical paths...', 'warning');
        await handleSimulatedDelay(1000);
      }

      // --- STAGE: FINALIZING ---
      setStage(AnalysisStage.FINALIZING);
      addLog('Formatting final output report...', 'info');
      setReport(result);
      await handleSimulatedDelay(800);
      
      setStage(AnalysisStage.COMPLETE);
      addLog('Mission Complete. Report Rendered.', 'success');

    } catch (error: any) {
      console.error(error);
      setStage(AnalysisStage.ERROR);
      addLog(`Analysis Failed: ${error.message || 'Unknown error'}`, 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') runAnalysis();
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-cyber-accent selection:text-black">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-cyber-800 bg-cyber-900/80 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <BrainCircuit className="w-6 h-6 text-cyber-accent" />
          <h1 className="text-xl font-bold tracking-widest text-white">
            REPOMIND<span className="text-cyber-accent">.AGENT</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${stage === AnalysisStage.IDLE || stage === AnalysisStage.COMPLETE ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
            STATUS: {stage}
          </div>
          <div className="hidden md:block">SYS.LOAD: 12%</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-8">
        
        {/* Input Section */}
        <section className="max-w-3xl mx-auto w-full">
           <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-accent to-cyber-danger rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative flex items-center bg-cyber-900 rounded-lg p-2 border border-cyber-700">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input 
                type="text" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ENTER REPOSITORY TARGET (e.g., https://github.com/facebook/react)"
                className="w-full bg-transparent border-none focus:ring-0 text-white font-mono px-4 py-2 placeholder-gray-600"
                disabled={stage !== AnalysisStage.IDLE && stage !== AnalysisStage.COMPLETE && stage !== AnalysisStage.ERROR}
              />
              <button 
                onClick={runAnalysis}
                disabled={stage !== AnalysisStage.IDLE && stage !== AnalysisStage.COMPLETE && stage !== AnalysisStage.ERROR}
                className="px-6 py-2 bg-cyber-800 hover:bg-cyber-700 text-cyber-accent border border-cyber-700 rounded font-mono text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Engage
              </button>
            </div>
           </div>
        </section>

        {/* Pipeline Visualizer */}
        <section className="w-full">
          <Pipeline currentStage={stage} />
        </section>

        {/* Split View: Terminal & Report */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px] lg:h-[700px]">
          
          {/* Left: Terminal Log */}
          <div className={`lg:col-span-4 h-full transition-all duration-500 ${report ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                   <Activity className="w-3 h-3 mr-1" /> Operation Logs
                 </h3>
              </div>
              <Terminal logs={logs} />
            </div>
          </div>

          {/* Right: Report View (Appears only when done) */}
          {report && (
            <div className="lg:col-span-8 h-full overflow-y-auto pr-2 scrollbar-thin animate-fade-in-right">
               <Report data={report} />
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;