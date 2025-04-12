
import React from 'react';
import { renderStep, StepProps } from './index';

interface StepViewerProps extends StepProps {
  currentStep: number;
}

export const StepViewer: React.FC<StepViewerProps> = ({
  currentStep,
  ...stepProps
}) => {
  return (
    <div className="step-content">
      {renderStep(currentStep, stepProps)}
    </div>
  );
};
