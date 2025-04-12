
import React, { useEffect } from 'react';
import { renderStep, StepProps } from './index';
import { useToast } from '@/components/ui/use-toast';

interface StepViewerProps extends StepProps {
  currentStep: number;
}

export const StepViewer: React.FC<StepViewerProps> = ({
  currentStep,
  resumeText,
  jobDescriptionText,
  analysisReport,
  ...stepProps
}) => {
  const { toast } = useToast();

  // Effect to show guidance toasts when entering certain steps
  useEffect(() => {
    if (currentStep === 1) {
      toast({
        title: "Let's optimize your resume",
        description: "Select the sections you want to add or improve to tailor your resume for this job.",
      });
    } else if (currentStep === 5) {
      toast({
        title: "Review AI suggestions",
        description: "Accept, edit, or ignore each suggestion to optimize your resume for ATS compatibility and job relevance.",
      });
    }
  }, [currentStep, toast]);

  // Provide progress feedback based on the current step
  const getProgressMessage = () => {
    switch(currentStep) {
      case 1:
        return "Analyzing your resume structure...";
      case 2:
        return "Review and enhance your work experience details...";
      case 3:
        return "Optimizing your education information...";
      case 4:
        return "Adding relevant projects to showcase your skills...";
      case 5:
        return "Reviewing AI-generated suggestions for ATS optimization...";
      case 6:
        return "Finalizing your optimized resume...";
      default:
        return "";
    }
  };

  return (
    <div className="step-content">
      <p className="text-sm text-muted-foreground mb-4">{getProgressMessage()}</p>
      {renderStep(currentStep, { 
        resumeText, 
        jobDescriptionText, 
        analysisReport,
        ...stepProps 
      })}
    </div>
  );
};
