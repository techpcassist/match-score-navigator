
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOptimizationContext } from '../context/OptimizationContext';

interface OptimizationControlsProps {
  onClose: () => void;
  onFinalize: () => void;
}

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({ onClose, onFinalize }) => {
  const { 
    currentStep, 
    setCurrentStep, 
    addCompletedStep
  } = useOptimizationContext();
  
  const totalSteps = 6; // Total number of steps

  const handleNextStep = () => {
    // Mark current step as completed
    addCompletedStep(currentStep);
    
    // Move to next step
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="p-6 flex justify-between">
      <Button 
        variant="outline" 
        onClick={currentStep === 1 ? onClose : handlePreviousStep}
      >
        {currentStep === 1 ? 'Cancel' : (
          <>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </>
        )}
      </Button>
      <Button 
        onClick={currentStep === totalSteps ? onFinalize : handleNextStep}
      >
        {currentStep === totalSteps ? 'Finalize Resume' : (
          <>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
