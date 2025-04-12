
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SectionAnalysisGridProps {
  sectionAnalysis: {
    education: string;
    experience: string;
    skills: string;
    projects: string;
  };
}

export const SectionAnalysisGrid: React.FC<SectionAnalysisGridProps> = ({ 
  sectionAnalysis 
}) => {
  return (
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
  );
};
