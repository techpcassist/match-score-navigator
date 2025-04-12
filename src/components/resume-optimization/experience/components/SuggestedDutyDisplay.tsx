
import React from 'react';
import { Button } from '@/components/ui/button';

interface SuggestedDutyDisplayProps {
  suggestedDuty: string;
  onDismiss: () => void;
  onAdd: () => void;
}

export const SuggestedDutyDisplay: React.FC<SuggestedDutyDisplayProps> = ({
  suggestedDuty,
  onDismiss,
  onAdd
}) => {
  if (!suggestedDuty) return null;
  
  return (
    <div className="bg-muted p-3 rounded-md mt-2">
      <p className="text-sm font-medium mb-2">Suggested Job Duty:</p>
      <p className="text-sm italic mb-2">{suggestedDuty}</p>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onAdd}
        >
          Add to Description
        </Button>
      </div>
    </div>
  );
};
