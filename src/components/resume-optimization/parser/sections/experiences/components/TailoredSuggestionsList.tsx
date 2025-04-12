
import React from 'react';
import { Button } from '@/components/ui/button';

interface TailoredSuggestionsListProps {
  suggestions: string[];
  jobTitle: string;
  onAddSuggestion: (suggestion: string) => void;
  onClose: () => void;
  show: boolean;
}

export const TailoredSuggestionsList: React.FC<TailoredSuggestionsListProps> = ({
  suggestions,
  jobTitle,
  onAddSuggestion,
  onClose,
  show
}) => {
  if (!show || suggestions.length === 0) return null;

  return (
    <div className="bg-muted p-4 rounded-lg mt-2">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm">Tailored Suggestions for {jobTitle}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          Close
        </Button>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-2 bg-card p-2 rounded-md">
            <p className="text-sm flex-grow">{suggestion}</p>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => onAddSuggestion(suggestion)}
              className="shrink-0"
            >
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
