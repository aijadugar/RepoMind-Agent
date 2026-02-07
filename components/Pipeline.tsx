import React from 'react';
import { AnalysisStage } from '../types';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface PipelineProps {
  currentStage: AnalysisStage;
}

const STEPS = [
  { id: AnalysisStage.PLANNING, label: 'PLAN' },
  { id: AnalysisStage.INGESTING, label: 'INGEST' },
  { id: AnalysisStage.ANALYZING, label: 'ANALYZE' },
  { id: AnalysisStage.GENERATING, label: 'GENERATE' },
  { id: AnalysisStage.VERIFYING, label: 'VERIFY' },
  { id: AnalysisStage.FINALIZING, label: 'FINALIZE' },
];

export const Pipeline: React.FC<PipelineProps> = ({ currentStage }) => {
  const getStatus = (stepId: AnalysisStage) => {
    const order = [
      AnalysisStage.IDLE,
      AnalysisStage.PLANNING,
      AnalysisStage.INGESTING,
      AnalysisStage.ANALYZING,
      AnalysisStage.GENERATING,
      AnalysisStage.VERIFYING,
      AnalysisStage.FINALIZING,
      AnalysisStage.COMPLETE
    ];
    
    const currentIndex = order.indexOf(currentStage);
    const stepIndex = order.indexOf(stepId);

    if (currentStage === AnalysisStage.COMPLETE || currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-between w-full px-2 py-6">
      {STEPS.map((step, index) => {
        const status = getStatus(step.id);
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="relative flex flex-col items-center group">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-cyber-900
                ${status === 'completed' ? 'border-cyber-success text-cyber-success shadow-[0_0_15px_rgba(5,213,250,0.5)]' : ''}
                ${status === 'active' ? 'border-cyber-accent text-cyber-accent animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.3)]' : ''}
                ${status === 'pending' ? 'border-cyber-700 text-cyber-700' : ''}
              `}>
                {status === 'completed' && <CheckCircle2 size={18} />}
                {status === 'active' && <Loader2 size={18} className="animate-spin" />}
                {status === 'pending' && <Circle size={18} />}
              </div>
              <span className={`
                absolute top-12 text-xs font-bold tracking-widest transition-colors duration-300
                ${status === 'completed' ? 'text-cyber-success' : ''}
                ${status === 'active' ? 'text-cyber-accent' : ''}
                ${status === 'pending' ? 'text-gray-600' : ''}
              `}>
                {step.label}
              </span>
            </div>
            
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 bg-cyber-800 relative overflow-hidden">
                <div className={`
                  absolute inset-0 h-full bg-cyber-success transition-all duration-500 ease-out
                  ${status === 'completed' ? 'w-full' : 'w-0'}
                `}/>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};