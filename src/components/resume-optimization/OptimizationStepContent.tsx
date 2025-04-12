
import React from 'react';
import { StepViewer } from './step-renderer/StepViewer';
import { 
  WorkExperienceEntry, 
  Education, 
  ProjectEntry, 
  MissingSection,
  KeywordSuggestion,
  FormattingSuggestion,
  SectionSuggestion
} from './types';

interface OptimizationStepContentProps {
  currentStep: number;
  resumeText: string;
  jobDescriptionText: string;
  missingSections: MissingSection[];
  workExperienceEntries: WorkExperienceEntry[];
  educationEntries: Education[];
  projectEntries: ProjectEntry[];
  keywordSuggestions: KeywordSuggestion[];
  formatSuggestions: FormattingSuggestion[];
  sectionSuggestions: SectionSuggestion[];
  optimizedResume: string;
  onSectionSelection: (selectedSections: string[]) => void;
  onWorkExperienceUpdate: (entries: WorkExperienceEntry[]) => void;
  onEducationUpdate: (entries: Education[]) => void;
  onProjectsUpdate: (projects: ProjectEntry[]) => void;
  onSuggestionAction: (id: string, action: 'accept' | 'edit' | 'ignore') => void;
  onResumeContentChange: (content: string) => void;
  analysisReport: any;
}

export const OptimizationStepContent: React.FC<OptimizationStepContentProps> = (props) => {
  return (
    <StepViewer 
      currentStep={props.currentStep}
      resumeText={props.resumeText}
      jobDescriptionText={props.jobDescriptionText}
      missingSections={props.missingSections}
      workExperienceEntries={props.workExperienceEntries}
      educationEntries={props.educationEntries}
      projectEntries={props.projectEntries}
      keywordSuggestions={props.keywordSuggestions}
      formatSuggestions={props.formatSuggestions}
      sectionSuggestions={props.sectionSuggestions}
      optimizedResume={props.optimizedResume}
      onSectionSelection={props.onSectionSelection}
      onWorkExperienceUpdate={props.onWorkExperienceUpdate}
      onEducationUpdate={props.onEducationUpdate}
      onProjectsUpdate={props.onProjectsUpdate}
      onSuggestionAction={props.onSuggestionAction}
      onResumeContentChange={props.onResumeContentChange}
      analysisReport={props.analysisReport}
    />
  );
};
