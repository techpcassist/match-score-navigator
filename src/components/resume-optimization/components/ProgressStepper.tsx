
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useOptimizationContext } from '../context/OptimizationContext';

export const ProgressStepper: React.FC = () => {
  const { 
    currentStep, 
    completedSteps, 
    setCurrentStep 
  } = useOptimizationContext();
  
  const totalSteps = 6; // Total number of steps in the optimization process

  return (
    <div className="flex items-center space-x-2 mb-6">
      {Array.from({length: totalSteps}, (_, i) => i + 1).map(step => (
        <div 
          key={step} 
          className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
            completedSteps.includes(step) 
              ? 'bg-green-100 text-green-600 border border-green-500' 
              : currentStep === step 
                ? 'bg-blue-100 text-blue-600 border border-blue-500' 
                : 'bg-gray-100 text-gray-500 border border-gray-300'
          }`}
          onClick={() => completedSteps.includes(step) || currentStep >= step ? setCurrentStep(step) : null}
          style={{ cursor: completedSteps.includes(step) || currentStep >= step ? 'pointer' : 'default' }}
        >
          {completedSteps.includes(step) ? <CheckCircle className="h-4 w-4" /> : step}
        </div>
      ))}
    </div>
  );
};
