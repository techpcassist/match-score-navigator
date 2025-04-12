
import { useCallback } from 'react';
import { 
  WorkExperienceEntry, 
  ProjectEntry, 
  MissingSection, 
  Education,
} from '../types';
import { createSectionSuggestions } from '../utils/resume-parsing';
import { OptimizationAction } from './OptimizationReducer';

export const useOptimizationHandlers = (
  dispatch: React.Dispatch<OptimizationAction>,
  state: {
    missingSections: MissingSection[];
  }
) => {
  const handleSectionSelection = useCallback((selectedSections: string[]) => {
    // Update the missingSections state based on user selection
    const filteredSections = state.missingSections.filter(
      section => selectedSections.includes(section.id)
    );
    
    dispatch({ type: 'SET_MISSING_SECTIONS', payload: filteredSections });
    
    // Update section suggestions based on new missing sections
    const newSuggestions = createSectionSuggestions(filteredSections);
    dispatch({ type: 'UPDATE_SECTION_SUGGESTIONS', payload: newSuggestions });
  }, [state.missingSections, dispatch]);
  
  const handleWorkExperienceUpdate = useCallback((updatedEntries: WorkExperienceEntry[]) => {
    dispatch({ type: 'SET_WORK_EXPERIENCE', payload: updatedEntries });
  }, [dispatch]);
  
  const handleEducationUpdate = useCallback((updatedEntries: Education[]) => {
    dispatch({ type: 'SET_EDUCATION', payload: updatedEntries });
  }, [dispatch]);
  
  const handleProjectsUpdate = useCallback((updatedProjects: ProjectEntry[]) => {
    dispatch({ type: 'SET_PROJECTS', payload: updatedProjects });
  }, [dispatch]);
  
  const handleSuggestionAction = useCallback((id: string, action: 'accept' | 'edit' | 'ignore') => {
    if (action === 'accept' || action === 'edit') {
      dispatch({ type: 'APPLY_SUGGESTION', payload: id });
    }
  }, [dispatch]);
  
  const addCompletedStep = useCallback((step: number) => {
    dispatch({ type: 'ADD_COMPLETED_STEP', payload: step });
  }, [dispatch]);
  
  return {
    handleSectionSelection,
    handleWorkExperienceUpdate,
    handleEducationUpdate,
    handleProjectsUpdate,
    handleSuggestionAction,
    addCompletedStep
  };
};
