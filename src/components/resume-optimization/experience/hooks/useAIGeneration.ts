
import { useState } from 'react';
import { callGenerativeAI } from '../../utils/ai-helper';
import { generateJobDutySuggestion } from '../../utils/description-generator';
import { useToast } from '@/hooks/use-toast';

export const useAIGeneration = (title: string, description: string) => {
  const [suggestedDuty, setSuggestedDuty] = useState('');
  const [isEnhancingDuty, setIsEnhancingDuty] = useState(false);
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
        const duty = await generateJobDutySuggestion(title);
        setSuggestedDuty(duty);
      }
    } catch (error) {
      console.error("Error generating duty suggestion:", error);
      // Fallback to pre-defined suggestions
      const duty = await generateJobDutySuggestion(title);
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
  
  const handleEnhanceDescription = async (onDescriptionChange: (value: string) => void) => {
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
  
  const clearSuggestedDuty = () => {
    setSuggestedDuty('');
  };
  
  return {
    suggestedDuty,
    isEnhancingDuty,
    isEnhancingText,
    handleGenerateDutySuggestion,
    handleEnhanceDescription,
    clearSuggestedDuty
  };
};
