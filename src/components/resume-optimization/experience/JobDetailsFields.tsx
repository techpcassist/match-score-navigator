
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAIGeneration } from './hooks/useAIGeneration';
import { JobDetailsActionButtons } from './components/JobDetailsActionButtons';
import { SuggestedDutyDisplay } from './components/SuggestedDutyDisplay';

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
  const [showAddDuty, setShowAddDuty] = useState(false);
  
  const {
    suggestedDuty,
    isEnhancingDuty,
    isEnhancingText,
    handleGenerateDutySuggestion,
    handleEnhanceDescription,
    clearSuggestedDuty
  } = useAIGeneration(title, description);
  
  const handleAddDuty = () => {
    if (!suggestedDuty) return;
    
    // Add the suggested duty to the current description
    const updatedDescription = description 
      ? `${description}\n• ${suggestedDuty}` 
      : `• ${suggestedDuty}`;
      
    onDescriptionChange(updatedDescription);
    clearSuggestedDuty(); // Clear the suggestion after adding
  };
  
  const handleAddCustomDuty = (customDuty: string) => {
    if (!customDuty) return;
    
    // Add the custom duty to the current description
    const updatedDescription = description 
      ? `${description}\n• ${customDuty}` 
      : `• ${customDuty}`;
      
    onDescriptionChange(updatedDescription);
    setShowAddDuty(false); // Close the popover after adding
  };
  
  const handleEnhanceText = () => {
    handleEnhanceDescription(onDescriptionChange);
  };

  return (
    <div className="space-y-2">
      <Label>Job Details (for AI-generated description)</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        <div>
          <Input
            id={`${id}-team-name`}
            value={teamName || ''}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Team Name"
          />
        </div>
        <div>
          <Input
            id={`${id}-team-size`}
            value={teamSize || ''}
            onChange={(e) => onTeamSizeChange(parseInt(e.target.value) || 0)}
            placeholder="Team Size"
            type="number"
          />
        </div>
        <div>
          <Input
            id={`${id}-project-name`}
            value={projectName || ''}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="Project Name"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <Label htmlFor={`${id}-description`}>Description & Achievements</Label>
            <Textarea
              id={`${id}-description`}
              value={description || ''}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Include your responsibilities and quantifiable achievements"
              rows={5}
            />
          </div>
          
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
      
      <p className="text-xs text-muted-foreground">
        Pro tip: Add job details above and use "Generate Full" for a complete description, "Suggest Duty" for specific responsibilities, or "Enhance Text" to improve existing content.
      </p>
    </div>
  );
};
