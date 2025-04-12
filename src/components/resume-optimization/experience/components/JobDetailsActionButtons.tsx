
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, FileText, Wand2, Plus } from 'lucide-react';
import { CustomDutyForm } from './CustomDutyForm';

interface JobDetailsActionButtonsProps {
  id: string;
  title: string;
  description: string;
  isGenerating: boolean;
  isEnhancingDuty: boolean;
  isEnhancingText: boolean;
  showPopover: boolean;
  onPopoverChange: (open: boolean) => void;
  onGenerateDescription: () => void;
  onGenerateDutySuggestion: () => void;
  onEnhanceText: () => void;
  onAddCustomDuty: (duty: string) => void;
}

export const JobDetailsActionButtons: React.FC<JobDetailsActionButtonsProps> = ({
  id,
  title,
  description,
  isGenerating,
  isEnhancingDuty,
  isEnhancingText,
  showPopover,
  onPopoverChange,
  onGenerateDescription,
  onGenerateDutySuggestion,
  onEnhanceText,
  onAddCustomDuty
}) => {
  return (
    <div className="flex flex-col gap-2 mb-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateDescription}
              disabled={isGenerating || !title}
              className="h-9"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Full'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate a complete job description</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateDutySuggestion}
              disabled={isEnhancingDuty || !title}
              className="h-9"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isEnhancingDuty ? 'Suggesting...' : 'Suggest Duty'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get a suggestion for a specific duty or achievement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onEnhanceText}
              disabled={isEnhancingText || !description || !title}
              className="h-9"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isEnhancingText ? 'Enhancing...' : 'Enhance Text'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Improve your current description with AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Popover open={showPopover} onOpenChange={onPopoverChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <CustomDutyForm id={id} onAddDuty={onAddCustomDuty} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
