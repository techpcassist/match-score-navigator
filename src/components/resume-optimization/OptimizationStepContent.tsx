
import React from 'react';
import { Step1MissingSections } from './steps/Step1MissingSections';
import { Step2WorkExperience } from './steps/Step2WorkExperience';
import { Step3Education } from './steps/Step3Education';
import { Step4Projects } from './steps/Step4Projects';
import { Step5Suggestions } from './steps/Step5Suggestions';
import { Step6FinalizeResume } from './steps/Step6FinalizeResume';
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

export const OptimizationStepContent: React.FC<OptimizationStepContentProps> = ({
  currentStep,
  missingSections,
  workExperienceEntries,
  educationEntries,
  projectEntries,
  keywordSuggestions,
  formatSuggestions,
  sectionSuggestions,
  optimizedResume,
  onSectionSelection,
  onWorkExperienceUpdate,
  onEducationUpdate,
  onProjectsUpdate,
  onSuggestionAction,
  onResumeContentChange,
  analysisReport
}) => {
  switch (currentStep) {
    case 1:
      return (
        <Step1MissingSections 
          missingSections={missingSections} 
          onSelectionChange={onSectionSelection}
        />
      );
    case 2:
      return (
        <Step2WorkExperience 
          entries={workExperienceEntries}
          onChange={onWorkExperienceUpdate}
        />
      );
    case 3:
      return (
        <Step3Education
          entries={educationEntries}
          onChange={onEducationUpdate}
        />
      );
    case 4:
      return (
        <Step4Projects 
          projects={projectEntries}
          jobKeywords={analysisReport.keywords?.hard_skills
            .filter((skill: any) => skill.matched)
            .map((skill: any) => skill.term) || []}
          onChange={onProjectsUpdate}
        />
      );
    case 5:
      return (
        <Step5Suggestions 
          keywordSuggestions={keywordSuggestions}
          formatSuggestions={formatSuggestions}
          sectionSuggestions={sectionSuggestions}
          onSuggestionAction={onSuggestionAction}
        />
      );
    case 6:
      return (
        <Step6FinalizeResume 
          initialContent={optimizedResume}
          onChange={onResumeContentChange}
        />
      );
    default:
      return null;
  }
};
