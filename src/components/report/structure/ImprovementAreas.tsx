
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ImprovementPotential } from '../types';

interface ImprovementAreasProps {
  improvementPotential: ImprovementPotential;
}

export const ImprovementAreas: React.FC<ImprovementAreasProps> = ({ 
  improvementPotential 
}) => {
  const getBadgeColor = (level: string) => {
    switch(level) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">Areas for Improvement</h4>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center mb-1">
            <span className="font-medium mr-2">Keyword Optimization:</span>
            <Badge 
              className={getBadgeColor(improvementPotential.keyword_optimization.level)}
            >
              {improvementPotential.keyword_optimization.level}
            </Badge>
          </div>
          {improvementPotential.keyword_optimization.details.missing_technical.length > 0 && (
            <div className="text-sm text-muted-foreground ml-4">
              <div>Missing technical skills: {improvementPotential.keyword_optimization.details.missing_technical.join(', ')}</div>
            </div>
          )}
          {improvementPotential.keyword_optimization.details.missing_soft.length > 0 && (
            <div className="text-sm text-muted-foreground ml-4">
              <div>Missing soft skills: {improvementPotential.keyword_optimization.details.missing_soft.join(', ')}</div>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <span className="font-medium mr-2">Structure Optimization:</span>
            <Badge 
              className={getBadgeColor(improvementPotential.structure_optimization.level)}
            >
              {improvementPotential.structure_optimization.level}
            </Badge>
          </div>
          {improvementPotential.structure_optimization.issues.length > 0 && (
            <div className="text-sm text-muted-foreground ml-4">
              Missing: {improvementPotential.structure_optimization.issues.join(', ')}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <span className="font-medium mr-2">Achievement Emphasis:</span>
            <Badge 
              className={getBadgeColor(improvementPotential.achievement_emphasis.level)}
            >
              {improvementPotential.achievement_emphasis.level}
            </Badge>
          </div>
          {improvementPotential.achievement_emphasis.issues.length > 0 && (
            <div className="text-sm text-muted-foreground ml-4">
              Missing: {improvementPotential.achievement_emphasis.issues.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
