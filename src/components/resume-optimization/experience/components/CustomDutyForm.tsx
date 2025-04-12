
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CustomDutyFormProps {
  id: string;
  onAddDuty: (duty: string) => void;
}

export const CustomDutyForm: React.FC<CustomDutyFormProps> = ({ id, onAddDuty }) => {
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
          onClick={() => {
            onAddDuty(customDuty);
            setCustomDuty('');
          }}
          disabled={!customDuty}
        >
          Add Duty
        </Button>
      </div>
    </div>
  );
};
