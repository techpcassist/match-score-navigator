
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Step1MissingSections } from '../steps/Step1MissingSections';
import { Step2WorkExperience } from '../steps/Step2WorkExperience';
import { Step3Education } from '../steps/Step3Education';
import { Step4Projects } from '../steps/Step4Projects';
import { Step5Suggestions } from '../steps/Step5Suggestions';
import { Step6FinalizeResume } from '../steps/Step6FinalizeResume';
import { useOptimizationContext } from '../context/OptimizationContext';

export const StepViewer: React.FC = () => {
  const { currentStep } = useOptimizationContext();
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1MissingSections />;
      case 2:
        return <Step2WorkExperience />;
      case 3:
        return <Step3Education />;
      case 4:
        return <Step4Projects />;
      case 5:
        return <Step5Suggestions />;
      case 6:
        return <Step6FinalizeResume />;
      default:
        return null;
    }
  };

  return (
    <div className="step-content">
      <p className="text-sm text-muted-foreground mb-4 px-6">{getProgressMessage()}</p>
      {renderStep()}
    </div>
  );
};
