
import React from 'react';
import { Card } from '@/components/ui/card';
import { OptimizationStepContent } from './OptimizationStepContent';
import { OptimizationProvider } from './context/OptimizationContext';
import { OptimizationHeader } from './components/OptimizationHeader';
import { ProgressStepper } from './components/ProgressStepper';
import { OptimizationControls } from './components/OptimizationControls';

interface OptimizationPanelProps {
  resumeText: string;
  jobDescriptionText: string;
  analysisReport: any;
  onClose: () => void;
}

export const OptimizationPanel = ({ 
  resumeText, 
  jobDescriptionText, 
  analysisReport, 
  onClose 
}: OptimizationPanelProps) => {
  const handleFinalize = () => {
    // In a real implementation, this would save the finalized resume
    onClose();
  };

  return (
    <OptimizationProvider 
      resumeText={resumeText}
      jobDescriptionText={jobDescriptionText}
      analysisReport={analysisReport}
      onClose={onClose}
    >
      <Card className="w-full">
        <OptimizationHeader />
        <ProgressStepper />
        
        <OptimizationStepContent />
        
        <OptimizationControls 
          onClose={onClose}
          onFinalize={handleFinalize}
        />
      </Card>
    </OptimizationProvider>
  );
};
