
import { useState } from 'react';

interface UseSuggestionDisplayProps {
  clearSuggestedDuty: () => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  suggestedDuty: string;
}

export const useSuggestionDisplay = ({
  clearSuggestedDuty,
  description,
  onDescriptionChange,
  suggestedDuty
}: UseSuggestionDisplayProps) => {
  const [showAddDuty, setShowAddDuty] = useState(false);
  
  const handleAddDuty = () => {
    if (!suggestedDuty) return;
    
    // Add the suggested duty to the current description
    const updatedDescription = description 
      ? `${description}\n• ${suggestedDuty}` 
      : `• ${suggestedDuty}`;
      
    onDescriptionChange(updatedDescription);
    clearSuggestedDuty(); // Clear the suggestion after adding
  };
  
  const handleAddCustomDuty = (customDuty: string) => {
    if (!customDuty) return;
    
    // Add the custom duty to the current description
    const updatedDescription = description 
      ? `${description}\n• ${customDuty}` 
      : `• ${customDuty}`;
      
    onDescriptionChange(updatedDescription);
    setShowAddDuty(false); // Close the popover after adding
  };
  
  return {
    showAddDuty,
    setShowAddDuty,
    handleAddDuty,
    handleAddCustomDuty
  };
};
