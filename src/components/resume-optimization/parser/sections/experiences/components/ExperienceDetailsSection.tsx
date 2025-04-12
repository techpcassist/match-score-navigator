
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Plus, Sparkles, BookOpen } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Experience } from '../../types';
import { callGenerativeAI } from '@/components/resume-optimization/utils/ai-helper';
import { toast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ExperienceDetailsSectionProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: any) => void;
}

export const ExperienceDetailsSection: React.FC<ExperienceDetailsSectionProps> = ({ 
  experience, 
  onUpdate 
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [showAddDuty, setShowAddDuty] = useState(false);
  const [customDuty, setCustomDuty] = useState('');
  const [isGeneratingTailored, setIsGeneratingTailored] = useState(false);
  const [tailoredSuggestions, setTailoredSuggestions] = useState<string[]>([]);
  const [showTailoredSuggestions, setShowTailoredSuggestions] = useState(false);

  // Generate tailored suggestions when job title changes
  useEffect(() => {
    if (experience.job_title && experience.job_title.trim() !== '') {
      // Clear old suggestions
      setTailoredSuggestions([]);
    }
  }, [experience.job_title]);

  const handleEnhanceResponsibilities = async () => {
    if (!experience.job_title || !experience.responsibilities_text) {
      toast({
        title: "Missing information",
        description: "Please add a job title and some responsibilities before enhancing.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const prompt = `Enhance the following job description for a ${experience.job_title} position to be more compelling, professional, and include specific achievements with metrics where possible. Maintain the original meaning but make it more impressive for a resume:
      
      "${experience.responsibilities_text}"
      
      Please use bullet points (•) for each point and ensure all bullet points start with powerful action verbs. Limit to 4-6 bullet points total.`;
      
      const enhancedText = await callGenerativeAI(prompt);
      
      if (enhancedText) {
        onUpdate('responsibilities_text', enhancedText);
        toast({
          title: "Text enhanced",
          description: "Your responsibilities have been professionally enhanced.",
        });
      } else {
        toast({
          title: "Enhancement failed",
          description: "Could not enhance description. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error enhancing text:", error);
      toast({
        title: "Error",
        description: "Failed to enhance text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateSuggestion = async () => {
    if (!experience.job_title) {
      toast({
        title: "Missing job title",
        description: "Please add a job title before generating suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSuggestion(true);
    try {
      const prompt = `Generate a specific job duty or achievement for a ${experience.job_title} position that includes a measurable outcome or metric. The duty should be 1-2 sentences maximum and start with an action verb.`;
      
      const suggestion = await callGenerativeAI(prompt);
      
      if (suggestion) {
        // Add the suggested duty to the current description
        const updatedDescription = experience.responsibilities_text 
          ? `${experience.responsibilities_text}\n• ${suggestion}` 
          : `• ${suggestion}`;
          
        onUpdate('responsibilities_text', updatedDescription);
        toast({
          title: "Suggestion added",
          description: "A new duty has been added to your responsibilities.",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Could not generate suggestion. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const handleAddCustomDuty = () => {
    if (!customDuty.trim()) {
      toast({
        title: "Empty duty",
        description: "Please enter a duty before adding.",
        variant: "destructive"
      });
      return;
    }

    // Add the custom duty to the current description
    const updatedDescription = experience.responsibilities_text 
      ? `${experience.responsibilities_text}\n• ${customDuty}` 
      : `• ${customDuty}`;
      
    onUpdate('responsibilities_text', updatedDescription);
    setCustomDuty('');
    setShowAddDuty(false);
    
    toast({
      title: "Duty added",
      description: "Your custom duty has been added.",
    });
  };

  const generateTailoredSuggestions = async () => {
    if (!experience.job_title) {
      toast({
        title: "Missing job title",
        description: "Please add a job title to generate tailored suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingTailored(true);
    try {
      const prompt = `Generate 5 specific responsibilities and achievements for a ${experience.job_title} position. 
      Each should be concise (one sentence), start with a strong action verb, and include quantifiable metrics where possible.
      Format as a list with each item on a new line, without bullet points or numbers. 
      Make them impressive for a resume.`;
      
      const result = await callGenerativeAI(prompt);
      
      if (result) {
        // Split into array and clean up
        const suggestions = result
          .split('\n')
          .filter(item => item.trim() !== '')
          .map(item => item.replace(/^[•-]\s*/, '').trim());
        
        setTailoredSuggestions(suggestions);
        setShowTailoredSuggestions(true);
        
        toast({
          title: "Suggestions generated",
          description: "Tailored suggestions for your role are ready to review.",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Could not generate tailored suggestions. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating tailored suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate tailored suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTailored(false);
    }
  };

  const addTailoredSuggestion = (suggestion: string) => {
    // Add the selected suggestion to the responsibilities
    const updatedDescription = experience.responsibilities_text
      ? `${experience.responsibilities_text}\n• ${suggestion}`
      : `• ${suggestion}`;
      
    onUpdate('responsibilities_text', updatedDescription);
    
    toast({
      title: "Suggestion added",
      description: "The selected suggestion has been added to your responsibilities.",
    });
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`responsibilities-${experience.id}`}>Responsibilities & Achievements</Label>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateTailoredSuggestions}
                    disabled={isGeneratingTailored || !experience.job_title}
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
              onClick={handleEnhanceResponsibilities}
              disabled={isEnhancing || !experience.responsibilities_text}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isEnhancing ? 'Enhancing...' : 'Enhance'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSuggestion}
              disabled={isGeneratingSuggestion || !experience.job_title}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingSuggestion ? 'Generating...' : 'Add Suggestion'}
            </Button>
            
            <Popover open={showAddDuty} onOpenChange={setShowAddDuty}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-duty">Add Custom Duty</Label>
                    <Textarea
                      id="custom-duty"
                      placeholder="Enter a custom job duty or achievement..."
                      value={customDuty}
                      onChange={(e) => setCustomDuty(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddCustomDuty}>
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Textarea
          id={`responsibilities-${experience.id}`}
          value={experience.responsibilities_text || ''}
          onChange={(e) => onUpdate('responsibilities_text', e.target.value)}
          placeholder="Describe your role, responsibilities, and key achievements..."
          className="min-h-[150px]"
        />
        
        {/* Tailored Suggestions Panel */}
        {showTailoredSuggestions && tailoredSuggestions.length > 0 && (
          <div className="bg-muted p-4 rounded-lg mt-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm">Tailored Suggestions for {experience.job_title}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTailoredSuggestions(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-2">
              {tailoredSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 bg-card p-2 rounded-md">
                  <p className="text-sm flex-grow">{suggestion}</p>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => addTailoredSuggestion(suggestion)}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
