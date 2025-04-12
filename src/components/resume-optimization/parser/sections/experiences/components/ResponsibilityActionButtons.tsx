
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles, BookOpen } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { CustomDutyInput } from './CustomDutyInput';

interface ResponsibilityActionButtonsProps {
  jobTitle: string;
  responsibilitiesText: string;
  isEnhancing: boolean;
  isGeneratingSuggestion: boolean;
  isGeneratingTailored: boolean;
  onEnhance: () => void;
  onGenerateSuggestion: () => void;
  onGenerateTailoredSuggestions: () => void;
  onUpdateResponsibilities: (text: string) => void;
  experienceId: string;
}

export const ResponsibilityActionButtons: React.FC<ResponsibilityActionButtonsProps> = ({
  jobTitle,
  responsibilitiesText,
  isEnhancing,
  isGeneratingSuggestion,
  isGeneratingTailored,
  onEnhance,
  onGenerateSuggestion,
  onGenerateTailoredSuggestions,
  onUpdateResponsibilities,
  experienceId
}) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateTailoredSuggestions}
              disabled={isGeneratingTailored || !jobTitle}
              className="relative"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isGeneratingTailored ? 'Generating...' : 'Role Suggestions'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get tailored suggestions for this job title</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onEnhance}
        disabled={isEnhancing || !responsibilitiesText}
      >
        <Wand2 className="h-4 w-4 mr-2" />
        {isEnhancing ? 'Enhancing...' : 'Enhance'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onGenerateSuggestion}
        disabled={isGeneratingSuggestion || !jobTitle}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isGeneratingSuggestion ? 'Generating...' : 'Add Suggestion'}
      </Button>
      
      <CustomDutyInput 
        experienceId={experienceId} 
        responsibilitiesText={responsibilitiesText} 
        onUpdateResponsibilities={onUpdateResponsibilities} 
      />
    </div>
  );
};
