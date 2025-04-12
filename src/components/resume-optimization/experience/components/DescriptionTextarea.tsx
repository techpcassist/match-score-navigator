
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

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
  // Check if we're potentially offline or if there are API limitations
  const [connectionStatus, setConnectionStatus] = React.useState<'online' | 'offline' | 'limited'>('online');
  
  React.useEffect(() => {
    // Update online status
    const handleStatusChange = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };

    // Listen for online/offline events
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    // Initial check
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Function to handle API rate limit detection
  React.useEffect(() => {
    // Check for a flag in localStorage that might have been set during API errors
    const checkApiLimits = () => {
      const apiLimitReached = localStorage.getItem('ai_api_limit_reached');
      if (apiLimitReached) {
        setConnectionStatus('limited');
        
        // Clear this flag after a reasonable time (e.g., 1 hour)
        const timestamp = parseInt(apiLimitReached, 10);
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - timestamp > oneHour) {
          localStorage.removeItem('ai_api_limit_reached');
          setConnectionStatus(navigator.onLine ? 'online' : 'offline');
        }
      }
    };
    
    checkApiLimits();
    const interval = setInterval(checkApiLimits, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow">
      <div className="flex justify-between items-center">
        <Label htmlFor={`${id}-description`}>Description & Achievements</Label>
        {connectionStatus !== 'online' && (
          <span className={`text-xs font-medium flex items-center gap-1 ${
            connectionStatus === 'offline' ? 'text-amber-500' : 'text-orange-500'
          }`}>
            <AlertCircle className="h-3 w-3" />
            {connectionStatus === 'offline' 
              ? 'Offline Mode - Using Fallback Content' 
              : 'API Limit Reached - Using Fallback Content'}
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
