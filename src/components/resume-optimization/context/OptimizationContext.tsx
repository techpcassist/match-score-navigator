
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  WorkExperienceEntry, 
  ProjectEntry, 
  MissingSection, 
  Education,
} from '../types';
import { 
  parseResumeForWorkExperience,
  parseResumeForEducation,
  identifyMissingSections,
  extractKeywordSuggestions,
  extractFormatSuggestions,
  createSectionSuggestions,
} from '../utils/resume-parsing';

interface OptimizationContextType {
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
  analysisReport: any; // Add the analysisReport property
  
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

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

export const useOptimizationContext = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimizationContext must be used within an OptimizationProvider');
  }
  return context;
};

interface OptimizationProviderProps {
  children: ReactNode;
  resumeText: string;
  jobDescriptionText: string;
  analysisReport: any;
  onClose: () => void;
}

export const OptimizationProvider: React.FC<OptimizationProviderProps> = ({ 
  children,
  resumeText,
  jobDescriptionText,
  analysisReport,
  onClose
}) => {
  // Main state for the optimization process
  const [currentStep, setCurrentStep] = useState(1);
  const [optimizedResume, setOptimizedResume] = useState(resumeText);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [workExperienceEntries, setWorkExperienceEntries] = useState<WorkExperienceEntry[]>([]);
  const [projectEntries, setProjectEntries] = useState<ProjectEntry[]>([]);
  const [educationEntries, setEducationEntries] = useState<Education[]>([]);
  const [missingSections, setMissingSections] = useState<MissingSection[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Suggestions state
  const [keywordSuggestions, setKeywordSuggestions] = useState<any[]>([]);
  const [formatSuggestions, setFormatSuggestions] = useState<any[]>([]);
  const [sectionSuggestions, setSectionSuggestions] = useState<any[]>([]);
  
  // Flag to indicate if we're using AI parsing
  const [usingAIParsing, setUsingAIParsing] = useState(false);

  // Initialize data on component mount
  React.useEffect(() => {
    // Check if we have AI-parsed data
    const hasAIWorkExperience = analysisReport?.parsed_data?.work_experience?.length > 0;
    const hasAIEducation = analysisReport?.parsed_data?.education?.length > 0;
    
    setUsingAIParsing(hasAIWorkExperience || hasAIEducation);
    
    // Parse work experience data - pass the analysisReport to use AI parsed data if available
    const workExperience = parseResumeForWorkExperience(resumeText, analysisReport);
    setWorkExperienceEntries(workExperience);
    
    // Parse education data - pass the analysisReport to use AI parsed data if available
    const education = parseResumeForEducation(resumeText, analysisReport);
    setEducationEntries(education);
    
    // Identify missing sections
    const missingSectionsList = identifyMissingSections(resumeText, jobDescriptionText, analysisReport);
    setMissingSections(missingSectionsList);
    
    // Initialize suggestions with AI-enhanced data
    const keywordSugs = extractKeywordSuggestions(analysisReport);
    setKeywordSuggestions(keywordSugs);
    
    const formatSugs = extractFormatSuggestions(analysisReport);
    setFormatSuggestions(formatSugs);
    
    const sectionSugs = createSectionSuggestions(missingSectionsList);
    setSectionSuggestions(sectionSugs);
    
    // Mark first step as viewed
    if (!completedSteps.includes(1)) {
      setCompletedSteps(prev => [...prev, 1]);
    }
  }, [resumeText, jobDescriptionText, analysisReport]);

  // Add a step to completed steps if not already there
  const addCompletedStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleSectionSelection = (selectedSections: string[]) => {
    // Update the missingSections state based on user selection
    setMissingSections(prev => 
      prev.filter(section => selectedSections.includes(section.id))
    );
    
    // Update section suggestions based on new missing sections
    setSectionSuggestions(
      createSectionSuggestions(
        missingSections.filter(section => selectedSections.includes(section.id))
      )
    );
  };
  
  const handleWorkExperienceUpdate = (updatedEntries: WorkExperienceEntry[]) => {
    setWorkExperienceEntries(updatedEntries);
  };
  
  const handleEducationUpdate = (updatedEntries: Education[]) => {
    setEducationEntries(updatedEntries);
  };
  
  const handleProjectsUpdate = (updatedProjects: ProjectEntry[]) => {
    setProjectEntries(updatedProjects);
  };
  
  const handleSuggestionAction = (id: string, action: 'accept' | 'edit' | 'ignore') => {
    if (action === 'accept' || action === 'edit') {
      setAppliedSuggestions(prev => [...prev, id]);
    }
  };

  const value = {
    currentStep,
    optimizedResume,
    appliedSuggestions,
    workExperienceEntries,
    projectEntries,
    educationEntries,
    missingSections,
    completedSteps,
    keywordSuggestions,
    formatSuggestions,
    sectionSuggestions,
    usingAIParsing,
    analysisReport, // Add the analysisReport to the context value
    
    setCurrentStep,
    setOptimizedResume,
    setWorkExperienceEntries,
    setEducationEntries,
    setProjectEntries,
    setCompletedSteps,
    setMissingSections,
    handleSectionSelection,
    handleWorkExperienceUpdate,
    handleEducationUpdate,
    handleProjectsUpdate,
    handleSuggestionAction,
    addCompletedStep
  };

  return (
    <OptimizationContext.Provider value={value}>
      {children}
    </OptimizationContext.Provider>
  );
};
