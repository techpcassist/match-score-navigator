
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { OptimizationContextType, OptimizationProviderProps } from './OptimizationContextTypes';
import { optimizationReducer, OptimizationState } from './OptimizationReducer';
import { useOptimizationHandlers } from './OptimizationContextHooks';
import {
  initializeWorkExperience,
  initializeEducation,
  initializeMissingSections,
  initializeKeywordSuggestions,
  initializeFormatSuggestions,
  initializeSectionSuggestions,
  checkAIParsing
} from './optimizationUtils';

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

export const useOptimizationContext = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimizationContext must be used within an OptimizationProvider');
  }
  return context;
};

export const OptimizationProvider: React.FC<OptimizationProviderProps> = ({ 
  children,
  resumeText,
  jobDescriptionText,
  analysisReport,
  onClose
}) => {
  const initialState: OptimizationState = {
    currentStep: 1,
    optimizedResume: resumeText,
    appliedSuggestions: [],
    workExperienceEntries: [],
    projectEntries: [],
    educationEntries: [],
    missingSections: [],
    completedSteps: [],
    keywordSuggestions: [],
    formatSuggestions: [],
    sectionSuggestions: [],
    usingAIParsing: false,
    analysisReport
  };

  const [state, dispatch] = useReducer(optimizationReducer, initialState);
  
  // Get all the handler functions
  const handlers = useOptimizationHandlers(dispatch, state);
  
  // Initialize data on component mount
  useEffect(() => {
    // Check if we have AI-parsed data
    const usingAI = checkAIParsing(analysisReport);
    
    // Parse work experience data
    const workExperience = initializeWorkExperience(resumeText, analysisReport);
    dispatch({ type: 'SET_WORK_EXPERIENCE', payload: workExperience });
    
    // Parse education data
    const education = initializeEducation(resumeText, analysisReport);
    dispatch({ type: 'SET_EDUCATION', payload: education });
    
    // Identify missing sections
    const missingSectionsList = initializeMissingSections(resumeText, jobDescriptionText, analysisReport);
    dispatch({ type: 'SET_MISSING_SECTIONS', payload: missingSectionsList });
    
    // Initialize suggestions with AI-enhanced data
    const keywordSugs = initializeKeywordSuggestions(analysisReport);
    const formatSugs = initializeFormatSuggestions(analysisReport);
    const sectionSugs = initializeSectionSuggestions(missingSectionsList);
    
    // Mark first step as viewed
    if (!state.completedSteps.includes(1)) {
      dispatch({ type: 'ADD_COMPLETED_STEP', payload: 1 });
    }
  }, [resumeText, jobDescriptionText, analysisReport]);

  // Create setter functions that dispatch actions
  const setCurrentStep = (step: number) => dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  const setOptimizedResume = (resume: string) => dispatch({ type: 'SET_OPTIMIZED_RESUME', payload: resume });
  const setWorkExperienceEntries = (entries: any[]) => dispatch({ type: 'SET_WORK_EXPERIENCE', payload: entries });
  const setEducationEntries = (entries: any[]) => dispatch({ type: 'SET_EDUCATION', payload: entries });
  const setProjectEntries = (entries: any[]) => dispatch({ type: 'SET_PROJECTS', payload: entries });
  const setCompletedSteps = (steps: number[]) => dispatch({ type: 'SET_COMPLETED_STEPS', payload: steps });
  const setMissingSections = (sections: any[]) => dispatch({ type: 'SET_MISSING_SECTIONS', payload: sections });

  const value: OptimizationContextType = {
    ...state,
    
    // Simple setters
    setCurrentStep,
    setOptimizedResume,
    setWorkExperienceEntries,
    setEducationEntries,
    setProjectEntries,
    setCompletedSteps,
    setMissingSections,
    
    // Complex handlers
    ...handlers
  };

  return (
    <OptimizationContext.Provider value={value}>
      {children}
    </OptimizationContext.Provider>
  );
};
