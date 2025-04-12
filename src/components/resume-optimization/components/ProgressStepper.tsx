
import React from 'react';
import { useOptimizationContext } from '../context/OptimizationContext';

interface ProgressStepperProps {
  isMobile?: boolean;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ isMobile }) => {
  const { 
    currentStep, 
    completedSteps
  } = useOptimizationContext();
  
  const totalSteps = 6; // Total number of steps
  
  // Generate array of step numbers
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className={`${isMobile ? 'py-3' : 'py-6'} px-4`}>
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`
                flex items-center justify-center
                h-8 w-8 rounded-full 
                ${currentStep === step 
                  ? 'bg-primary text-primary-foreground' 
                  : completedSteps.includes(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {step}
            </div>
            {!isMobile && (
              <span className="mt-2 text-xs">
                Step {step}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* Progress Line */}
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="h-0.5 w-full bg-muted"></div>
        </div>
        <div 
          className="absolute inset-0 flex items-center" 
          style={{ 
            width: `${(((currentStep - 1) / (totalSteps - 1)) * 100)}%` 
          }}
        >
          <div className="h-0.5 w-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};
