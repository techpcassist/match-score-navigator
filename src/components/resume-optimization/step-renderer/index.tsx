
import React from 'react';
import { Step1MissingSections } from '../steps/Step1MissingSections';
import { Step2WorkExperience } from '../steps/Step2WorkExperience';
import { Step3Education } from '../steps/Step3Education';
import { Step4Projects } from '../steps/Step4Projects';
import { Step5Suggestions } from '../steps/Step5Suggestions';
import { Step6FinalizeResume } from '../steps/Step6FinalizeResume';
import { 
  WorkExperienceEntry, 
  Education, 
  ProjectEntry, 
  MissingSection,
  KeywordSuggestion,
  FormattingSuggestion,
  SectionSuggestion
} from '../types';

export interface StepProps {
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

export const renderStep = (currentStep: number, props: StepProps): React.ReactNode => {
  switch (currentStep) {
    case 1:
      return (
        <Step1MissingSections 
          missingSections={props.missingSections} 
          onSelectionChange={props.onSectionSelection}
        />
      );
    case 2:
      return (
        <Step2WorkExperience 
          entries={props.workExperienceEntries}
          onChange={props.onWorkExperienceUpdate}
        />
      );
    case 3:
      return (
        <Step3Education
          entries={props.educationEntries}
          onChange={props.onEducationUpdate}
        />
      );
    case 4:
      return (
        <Step4Projects 
          projects={props.projectEntries}
          jobKeywords={props.analysisReport?.keywords?.hard_skills
            ?.filter((skill: any) => skill.matched)
            ?.map((skill: any) => skill.term) || []}
          onChange={props.onProjectsUpdate}
        />
      );
    case 5:
      return (
        <Step5Suggestions 
          keywordSuggestions={props.keywordSuggestions}
          formatSuggestions={props.formatSuggestions}
          sectionSuggestions={props.sectionSuggestions}
          onSuggestionAction={props.onSuggestionAction}
        />
      );
    case 6:
      return (
        <Step6FinalizeResume 
          initialContent={props.optimizedResume}
          onChange={props.onResumeContentChange}
        />
      );
    default:
      return null;
  }
};
