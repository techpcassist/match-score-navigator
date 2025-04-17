
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Award, ChevronUp, ChevronDown, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { AdvancedCriterionEntry } from './types';

interface AdvancedCriteriaSectionProps {
  criteria: AdvancedCriterionEntry[];
}

export const AdvancedCriteriaSection = ({ criteria }: AdvancedCriteriaSectionProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Award className="h-5 w-5" />
          Advanced Matching Criteria
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isAdvancedOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="space-y-3">
          {criteria.map((criteria, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              {criteria.status === 'matched' && (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              {criteria.status === 'partial' && (
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              )}
              {criteria.status === 'missing' && (
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{criteria.name}</p>
                <p className="text-sm text-muted-foreground">{criteria.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
