
import React from 'react';
import { StepViewer } from './step-renderer/StepViewer';
import { useOptimizationContext } from './context/OptimizationContext';

export const OptimizationStepContent: React.FC = () => {
  const { 
    currentStep,
    optimizedResume,
    workExperienceEntries,
    educationEntries,
    projectEntries,
    missingSections,
    keywordSuggestions,
    formatSuggestions,
    sectionSuggestions,
    setOptimizedResume,
    handleSectionSelection,
    handleWorkExperienceUpdate,
    handleEducationUpdate,
    handleProjectsUpdate,
    handleSuggestionAction
  } = useOptimizationContext();

  return (
    <StepViewer 
      currentStep={currentStep}
      resumeText={optimizedResume}
      jobDescriptionText=""
      missingSections={missingSections}
      workExperienceEntries={workExperienceEntries}
      educationEntries={educationEntries}
      projectEntries={projectEntries}
      keywordSuggestions={keywordSuggestions}
      formatSuggestions={formatSuggestions}
      sectionSuggestions={sectionSuggestions}
      optimizedResume={optimizedResume}
      onSectionSelection={handleSectionSelection}
      onWorkExperienceUpdate={handleWorkExperienceUpdate}
      onEducationUpdate={handleEducationUpdate}
      onProjectsUpdate={handleProjectsUpdate}
      onSuggestionAction={handleSuggestionAction}
      onResumeContentChange={setOptimizedResume}
      analysisReport={null}
    />
  );
};
