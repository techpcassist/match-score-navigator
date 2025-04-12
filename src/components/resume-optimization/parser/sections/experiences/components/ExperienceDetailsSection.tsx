
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Plus, Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Experience } from '../../types';
import { callGenerativeAI } from '@/components/resume-optimization/utils/ai-helper';
import { toast } from '@/hooks/use-toast';

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

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`responsibilities-${experience.id}`}>Responsibilities & Achievements</Label>
          <div className="flex gap-2">
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
        
        <p className="text-xs text-muted-foreground">
          Pro tip: Use "Enhance" to improve your current description, "Add Suggestion" for job-specific duties, or "Add Custom" to add your own responsibilities.
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
