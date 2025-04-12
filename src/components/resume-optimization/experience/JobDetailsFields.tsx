
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, FileText, Wand2 } from 'lucide-react';
import { generateJobDescription, generateJobDutySuggestion } from '../utils/description-generator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { callGenerativeAI } from '../utils/ai-helper';
import { useToast } from '@/hooks/use-toast';

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
  const [suggestedDuty, setSuggestedDuty] = useState('');
  const [isEnhancingDuty, setIsEnhancingDuty] = useState(false);
  const [showAddDuty, setShowAddDuty] = useState(false);
  const [isEnhancingText, setIsEnhancingText] = useState(false);
  const { toast } = useToast();
  
  const handleGenerateDutySuggestion = async () => {
    if (!title) return;
    
    setIsEnhancingDuty(true);
    try {
      // Try to use AI-generated duty if available
      const aiSuggestion = await callGenerativeAI(`Generate a specific job duty or achievement for a ${title} position that includes a measurable outcome or metric. The duty should be 1-2 sentences maximum and start with an action verb.`);
      
      if (aiSuggestion) {
        setSuggestedDuty(aiSuggestion);
      } else {
        // Fallback to pre-defined suggestions if AI call fails
        const duty = generateJobDutySuggestion(title);
        setSuggestedDuty(duty);
      }
    } catch (error) {
      console.error("Error generating duty suggestion:", error);
      // Fallback to pre-defined suggestions
      const duty = generateJobDutySuggestion(title);
      setSuggestedDuty(duty);
      
      toast({
        title: "Error",
        description: "Failed to generate AI suggestion. Using fallback content.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancingDuty(false);
    }
  };
  
  const handleEnhanceDescription = async () => {
    if (!description || !title) return;
    
    setIsEnhancingText(true);
    try {
      const prompt = `Enhance the following job description for a ${title} position to be more compelling, professional, and include specific achievements with metrics where possible. Maintain the original meaning but make it more impressive for a resume:
      
      "${description}"
      
      Please use bullet points (•) for each point and ensure all bullet points start with powerful action verbs. Limit to 4-6 bullet points total.`;
      
      const enhancedText = await callGenerativeAI(prompt);
      
      if (enhancedText) {
        onDescriptionChange(enhancedText);
      } else {
        toast({
          title: "Enhancement Failed",
          description: "Could not enhance description. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast({
        title: "Error",
        description: "Failed to enhance description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancingText(false);
    }
  };
  
  const handleAddDuty = () => {
    if (!suggestedDuty) return;
    
    // Add the suggested duty to the current description
    const updatedDescription = description 
      ? `${description}\n• ${suggestedDuty}` 
      : `• ${suggestedDuty}`;
      
    onDescriptionChange(updatedDescription);
    setSuggestedDuty(''); // Clear the suggestion after adding
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
  
  // Create a simple form for adding custom duties
  const CustomDutyForm = () => {
    const [customDuty, setCustomDuty] = useState('');
    
    return (
      <div className="space-y-2">
        <Label htmlFor={`${id}-custom-duty`}>Add Custom Duty</Label>
        <Textarea
          id={`${id}-custom-duty`}
          value={customDuty}
          onChange={(e) => setCustomDuty(e.target.value)}
          placeholder="Describe a specific duty or achievement..."
          className="min-h-[80px]"
        />
        <div className="flex justify-end">
          <Button 
            size="sm" 
            onClick={() => handleAddCustomDuty(customDuty)}
            disabled={!customDuty}
          >
            Add Duty
          </Button>
        </div>
      </div>
    );
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
                    onClick={handleGenerateDutySuggestion}
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
                    onClick={handleEnhanceDescription}
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
            
            <Popover open={showAddDuty} onOpenChange={setShowAddDuty}>
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
                <CustomDutyForm />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Suggestion display area */}
        {suggestedDuty && (
          <div className="bg-muted p-3 rounded-md mt-2">
            <p className="text-sm font-medium mb-2">Suggested Job Duty:</p>
            <p className="text-sm italic mb-2">{suggestedDuty}</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuggestedDuty('')}
              >
                Dismiss
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddDuty}
              >
                Add to Description
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Pro tip: Add job details above and use "Generate Full" for a complete description, "Suggest Duty" for specific responsibilities, or "Enhance Text" to improve existing content.
      </p>
    </div>
  );
};
