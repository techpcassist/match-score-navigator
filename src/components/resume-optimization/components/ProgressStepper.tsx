
import { useOptimizationContext } from '../context/OptimizationContext';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  isMobile?: boolean;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ isMobile = false }) => {
  const { currentStep, completedSteps } = useOptimizationContext();
  
  const steps = [
    'Missing Sections',
    'Work Experience',
    'Education',
    'Projects',
    'Suggestions',
    'Finalize'
  ];

  return (
    <div className={`flex ${isMobile ? 'overflow-x-auto' : ''} gap-4 p-4 border-b`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = completedSteps.includes(stepNumber);
        
        return (
          <div
            key={stepNumber}
            className={`flex items-center ${isMobile ? 'flex-shrink-0' : ''}`}
          >
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-colors
                ${isActive ? 'bg-primary text-primary-foreground' : ''}
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
              `}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
            </div>
            <span className={`ml-2 text-sm ${isActive ? 'font-medium' : ''}`}>
              {step}
            </span>
            {stepNumber < steps.length && (
              <div className="w-8 h-px bg-border mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};
