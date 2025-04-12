
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { useOptimizationContext } from '../context/OptimizationContext';

export const OptimizationHeader: React.FC = () => {
  const { completedSteps, usingAIParsing } = useOptimizationContext();
  const totalSteps = 6; // Total number of steps in the optimization process
  
  // Calculate progress percentage
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  return (
    <div className="px-6 pt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Resume Optimization</h2>
          {usingAIParsing && (
            <div className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Enhanced
            </div>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Progress:</span>
          <Progress value={progressPercentage} className="w-[100px]" />
          <span className="text-sm ml-2">{Math.round(progressPercentage)}%</span>
        </div>
      </div>
    </div>
  );
};
