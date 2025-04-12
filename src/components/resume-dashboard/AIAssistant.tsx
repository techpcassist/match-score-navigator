
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callGenerativeAI } from '@/components/resume-optimization/utils/ai-helper';

interface AIAssistantProps {
  sectionType: string;
  sectionId: string;
  existingContent: string;
  onSuggestionApply: (sectionId: string, suggestion: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  sectionType,
  sectionId,
  existingContent,
  onSuggestionApply
}) => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const { toast } = useToast();

  const generateSuggestion = async () => {
    setIsGenerating(true);
    setSuggestion('');
    
    try {
      // Create a prompt based on the section type
      let prompt = '';
      
      switch (sectionType) {
        case 'summary':
          prompt = `Generate a professional summary for a resume. If the following content is provided, enhance it: "${existingContent}"`;
          break;
        case 'experience':
          prompt = `Generate professional work experience bullet points for a resume. If the following content is provided, enhance it with more impact and quantifiable achievements: "${existingContent}"`;
          break;
        case 'skills':
          prompt = `Generate a well-organized skills section for a resume, grouped by categories. If the following content is provided, enhance it: "${existingContent}"`;
          break;
        case 'education':
          prompt = `Generate an education section for a resume with appropriate formatting. If the following content is provided, enhance it: "${existingContent}"`;
          break;
        case 'projects':
          prompt = `Generate project descriptions for a resume that highlight technical skills and achievements. If the following content is provided, enhance it: "${existingContent}"`;
          break;
        default:
          prompt = `Generate professional content for a ${sectionType} section in a resume. If the following content is provided, enhance it: "${existingContent}"`;
      }
      
      const generatedText = await callGenerativeAI(prompt);
      
      if (generatedText) {
        setSuggestion(generatedText);
      } else {
        throw new Error('Failed to generate suggestion');
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate a suggestion. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      onSuggestionApply(sectionId, suggestion);
      setShowAssistant(false);
      setSuggestion('');
    }
  };

  return (
    <div className="mt-2">
      {!showAssistant ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowAssistant(true);
            generateSuggestion();
          }}
          className="w-full"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get AI Suggestions
        </Button>
      ) : (
        <div className="bg-muted/30 rounded-md p-3 space-y-3 border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Suggestion
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateSuggestion}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAssistant(false);
                  setSuggestion('');
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApplySuggestion}
                disabled={!suggestion || isGenerating}
              >
                Apply
              </Button>
            </div>
          </div>
          
          {isGenerating ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Generating suggestions...</span>
            </div>
          ) : (
            <Textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="AI suggestions will appear here..."
              className="min-h-[100px]"
              readOnly={false}
            />
          )}
        </div>
      )}
    </div>
  );
};
