
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionTextareaProps {
  id: string;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const DescriptionTextarea: React.FC<DescriptionTextareaProps> = ({
  id,
  description,
  onDescriptionChange
}) => {
  // Check if we're potentially offline (this is a basic check, not comprehensive)
  const [isOffline, setIsOffline] = React.useState(false);
  
  React.useEffect(() => {
    // Update online status
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <div className="flex-grow">
      <div className="flex justify-between items-center">
        <Label htmlFor={`${id}-description`}>Description & Achievements</Label>
        {isOffline && (
          <span className="text-xs text-amber-500 font-medium">
            Offline Mode - Using Fallback Content
          </span>
        )}
      </div>
      <Textarea
        id={`${id}-description`}
        value={description || ''}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Include your responsibilities and quantifiable achievements"
        rows={5}
      />
    </div>
  );
};
