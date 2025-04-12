
import { 
  WorkExperienceEntry, 
  ProjectEntry, 
  MissingSection, 
  Education,
} from '../types';

export interface OptimizationContextType {
  // State
  currentStep: number;
  optimizedResume: string;
  appliedSuggestions: string[];
  workExperienceEntries: WorkExperienceEntry[];
  projectEntries: ProjectEntry[];
  educationEntries: Education[];
  missingSections: MissingSection[];
  completedSteps: number[];
  keywordSuggestions: any[];
  formatSuggestions: any[];
  sectionSuggestions: any[];
  usingAIParsing: boolean;
  analysisReport: any;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setOptimizedResume: (resume: string) => void;
  setWorkExperienceEntries: (entries: WorkExperienceEntry[]) => void;
  setEducationEntries: (entries: Education[]) => void;
  setProjectEntries: (entries: ProjectEntry[]) => void;
  setCompletedSteps: (steps: number[]) => void;
  setMissingSections: (sections: MissingSection[]) => void;
  handleSectionSelection: (selectedSections: string[]) => void;
  handleWorkExperienceUpdate: (updatedEntries: WorkExperienceEntry[]) => void;
  handleEducationUpdate: (updatedEntries: Education[]) => void;
  handleProjectsUpdate: (updatedProjects: ProjectEntry[]) => void;
  handleSuggestionAction: (id: string, action: 'accept' | 'edit' | 'ignore') => void;
  addCompletedStep: (step: number) => void;
}

export interface OptimizationProviderProps {
  children: React.ReactNode;
  resumeText: string;
  jobDescriptionText: string;
  analysisReport: any;
  onClose: () => void;
}
