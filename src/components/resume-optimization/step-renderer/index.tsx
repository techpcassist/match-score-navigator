import React from 'react';
import { StepViewer } from './StepViewer';

// Export the StepViewer component as the default
export { StepViewer };

// Keep the types for reference (even though they're no longer directly used in renderer)
export interface StepProps {
  resumeText: string;
  jobDescriptionText: string;
  missingSections: any[];
  workExperienceEntries: any[];
  educationEntries: any[];
  projectEntries: any[];
  keywordSuggestions: any[];
  formatSuggestions: any[];
  sectionSuggestions: any[];
  optimizedResume: string;
  onSectionSelection: (selectedSections: string[]) => void;
  onWorkExperienceUpdate: (entries: any[]) => void;
  onEducationUpdate: (entries: any[]) => void;
  onProjectsUpdate: (projects: any[]) => void;
  onSuggestionAction: (id: string, action: 'accept' | 'edit' | 'ignore') => void;
  onResumeContentChange: (content: string) => void;
  analysisReport: any;
}
