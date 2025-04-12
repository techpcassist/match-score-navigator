
import React from 'react';
import { Label } from '@/components/ui/label';
import { useAIGeneration } from './hooks/useAIGeneration';
import { JobDetailsActionButtons } from './components/JobDetailsActionButtons';
import { SuggestedDutyDisplay } from './components/SuggestedDutyDisplay';
import { JobDetailsInputs } from './components/JobDetailsInputs';
import { DescriptionTextarea } from './components/DescriptionTextarea';
import { JobDetailsTips } from './components/JobDetailsTips';
import { useSuggestionDisplay } from './hooks/useSuggestionDisplay';

interface JobDetailsFieldsProps {
  id: string;
  title: string;
  teamName: string;
  teamSize: number;
  projectName: string;
  description: string;
  isGenerating: boolean;
  onTeamNameChange: (value: string) => void;
  onTeamSizeChange: (value: number) => void;
  onProjectNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenerateDescription: () => void;
}

export const JobDetailsFields: React.FC<JobDetailsFieldsProps> = ({
  id,
  title,
  teamName,
  teamSize,
  projectName,
  description,
  isGenerating,
  onTeamNameChange,
  onTeamSizeChange,
  onProjectNameChange,
  onDescriptionChange,
  onGenerateDescription
}) => {
  const {
    suggestedDuty,
    isEnhancingDuty,
    isEnhancingText,
    handleGenerateDutySuggestion,
    handleEnhanceDescription,
    clearSuggestedDuty
  } = useAIGeneration(title, description);
  
  const {
    showAddDuty,
    setShowAddDuty,
    handleAddDuty,
    handleAddCustomDuty
  } = useSuggestionDisplay({
    clearSuggestedDuty,
    description,
    onDescriptionChange,
    suggestedDuty
  });
  
  const handleEnhanceText = () => {
    handleEnhanceDescription(onDescriptionChange);
  };

  return (
    <div className="space-y-2">
      <Label>Job Details (for AI-generated description)</Label>
      
      <JobDetailsInputs
        id={id}
        teamName={teamName}
        teamSize={teamSize}
        projectName={projectName}
        onTeamNameChange={onTeamNameChange}
        onTeamSizeChange={onTeamSizeChange}
        onProjectNameChange={onProjectNameChange}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <DescriptionTextarea
            id={id}
            description={description}
            onDescriptionChange={onDescriptionChange}
          />
          
          <JobDetailsActionButtons
            id={id}
            title={title}
            description={description}
            isGenerating={isGenerating}
            isEnhancingDuty={isEnhancingDuty}
            isEnhancingText={isEnhancingText}
            showPopover={showAddDuty}
            onPopoverChange={setShowAddDuty}
            onGenerateDescription={onGenerateDescription}
            onGenerateDutySuggestion={handleGenerateDutySuggestion}
            onEnhanceText={handleEnhanceText}
            onAddCustomDuty={handleAddCustomDuty}
          />
        </div>
        
        <SuggestedDutyDisplay
          suggestedDuty={suggestedDuty}
          onDismiss={clearSuggestedDuty}
          onAdd={handleAddDuty}
        />
      </div>
      
      <JobDetailsTips />
    </div>
  );
};
