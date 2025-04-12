
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Experience } from '../../types';
import { useExperienceEnhancement } from './hooks/useExperienceEnhancement';
import { ResponsibilityActionButtons } from './ResponsibilityActionButtons';
import { TailoredSuggestionsList } from './TailoredSuggestionsList';

interface ExperienceDetailsSectionProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: any) => void;
}

export const ExperienceDetailsSection: React.FC<ExperienceDetailsSectionProps> = ({ 
  experience, 
  onUpdate 
}) => {
  const {
    isEnhancing,
    isGeneratingSuggestion,
    isGeneratingTailored,
    tailoredSuggestions,
    showTailoredSuggestions,
    setShowTailoredSuggestions,
    handleEnhanceResponsibilities,
    handleGenerateSuggestion,
    generateTailoredSuggestions,
    addTailoredSuggestion
  } = useExperienceEnhancement(experience, onUpdate);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`responsibilities-${experience.id}`}>Responsibilities & Achievements</Label>
          <ResponsibilityActionButtons 
            jobTitle={experience.job_title}
            responsibilitiesText={experience.responsibilities_text || ''}
            isEnhancing={isEnhancing}
            isGeneratingSuggestion={isGeneratingSuggestion}
            isGeneratingTailored={isGeneratingTailored}
            onEnhance={handleEnhanceResponsibilities}
            onGenerateSuggestion={handleGenerateSuggestion}
            onGenerateTailoredSuggestions={generateTailoredSuggestions}
            onUpdateResponsibilities={(text) => onUpdate('responsibilities_text', text)}
            experienceId={experience.id || ''}
          />
        </div>
        
        <Textarea
          id={`responsibilities-${experience.id}`}
          value={experience.responsibilities_text || ''}
          onChange={(e) => onUpdate('responsibilities_text', e.target.value)}
          placeholder="Describe your role, responsibilities, and key achievements..."
          className="min-h-[150px]"
        />
        
        <TailoredSuggestionsList 
          suggestions={tailoredSuggestions}
          jobTitle={experience.job_title}
          onAddSuggestion={addTailoredSuggestion}
          onClose={() => setShowTailoredSuggestions(false)}
          show={showTailoredSuggestions}
        />
        
        <p className="text-xs text-muted-foreground">
          Pro tip: Use "Role Suggestions" for job-specific duties, "Enhance" to improve your current description, "Add Suggestion" for a single duty, or "Add Custom" to add your own responsibilities.
        </p>
      </div>
      
      <div>
        <Label htmlFor={`skills-${experience.id}`}>Skills & Tools Used</Label>
        <Textarea
          id={`skills-${experience.id}`}
          value={experience.skills_tools_used || ''}
          onChange={(e) => onUpdate('skills_tools_used', e.target.value)}
          placeholder="List skills and tools you used in this role (comma separated)..."
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};
