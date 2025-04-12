
import React from 'react';
import { SectionAnalysisGrid } from './structure/SectionAnalysisGrid';
import { ImprovementAreas } from './structure/ImprovementAreas';
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

export const StructureAnalysisSection: React.FC<StructureAnalysisSectionProps> = ({ 
  sectionAnalysis, 
  improvementPotential 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Document Structure Analysis</h3>
      
      <SectionAnalysisGrid sectionAnalysis={sectionAnalysis} />

      {improvementPotential && (
        <ImprovementAreas improvementPotential={improvementPotential} />
      )}
    </div>
  );
};
