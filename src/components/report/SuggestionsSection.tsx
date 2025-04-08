
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SuggestionsSectionProps {
  suggestions: string[];
}

export const SuggestionsSection = ({ suggestions }: SuggestionsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Improvement Suggestions</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <ul className="space-y-2 list-disc pl-5">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-muted-foreground">{suggestion}</li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
