
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImprovementPotential } from './types';

interface StructureAnalysisSectionProps {
  sectionAnalysis: {
    education: string;
    experience: string;
    skills: string;
    projects: string;
  };
  improvementPotential?: ImprovementPotential;
}

export const StructureAnalysisSection = ({ 
  sectionAnalysis, 
  improvementPotential 
}: StructureAnalysisSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Document Structure Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <AlertTitle>Education</AlertTitle>
          <AlertDescription>{sectionAnalysis.education}</AlertDescription>
        </Alert>
        
        <Alert>
          <AlertTitle>Experience</AlertTitle>
          <AlertDescription>{sectionAnalysis.experience}</AlertDescription>
        </Alert>
        
        <Alert>
          <AlertTitle>Skills</AlertTitle>
          <AlertDescription>{sectionAnalysis.skills}</AlertDescription>
        </Alert>
        
        <Alert>
          <AlertTitle>Projects</AlertTitle>
          <AlertDescription>{sectionAnalysis.projects}</AlertDescription>
        </Alert>
      </div>

      {improvementPotential && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Areas for Improvement</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center mb-1">
                <span className="font-medium mr-2">Keyword Optimization:</span>
                <Badge 
                  className={`${
                    improvementPotential.keyword_optimization.level === 'high' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : improvementPotential.keyword_optimization.level === 'medium'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                  }`}
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
                  className={`${
                    improvementPotential.structure_optimization.level === 'high' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : improvementPotential.structure_optimization.level === 'medium'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                  }`}
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
                  className={`${
                    improvementPotential.achievement_emphasis.level === 'high' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
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
      )}
    </div>
  );
};
