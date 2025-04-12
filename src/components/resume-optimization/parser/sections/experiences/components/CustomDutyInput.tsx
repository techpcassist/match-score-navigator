
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomDutyInputProps {
  experienceId: string;
  responsibilitiesText: string;
  onUpdateResponsibilities: (text: string) => void;
}

export const CustomDutyInput: React.FC<CustomDutyInputProps> = ({ 
  experienceId, 
  responsibilitiesText, 
  onUpdateResponsibilities 
}) => {
  const [showAddDuty, setShowAddDuty] = useState(false);
  const [customDuty, setCustomDuty] = useState('');

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
    const updatedDescription = responsibilitiesText 
      ? `${responsibilitiesText}\n• ${customDuty}` 
      : `• ${customDuty}`;
      
    onUpdateResponsibilities(updatedDescription);
    setCustomDuty('');
    setShowAddDuty(false);
    
    toast({
      title: "Duty added",
      description: "Your custom duty has been added.",
    });
  };

  return (
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
            <Label htmlFor={`custom-duty-${experienceId}`}>Add Custom Duty</Label>
            <Textarea
              id={`custom-duty-${experienceId}`}
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
  );
};
