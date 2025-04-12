
import React from 'react';
import { AlertCircle, InfoIcon } from 'lucide-react';

export const JobDetailsTips: React.FC = () => {
  // Check if API limit has been reached
  const [isApiLimited, setIsApiLimited] = React.useState(false);
  
  React.useEffect(() => {
    const apiLimitReached = localStorage.getItem('ai_api_limit_reached');
    if (apiLimitReached) {
      setIsApiLimited(true);
      
      // Check if it's been more than an hour since the limit was reached
      const timestamp = parseInt(apiLimitReached, 10);
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - timestamp > oneHour) {
        localStorage.removeItem('ai_api_limit_reached');
        setIsApiLimited(false);
      }
    }
  }, []);

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-start gap-1">
        <InfoIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span>Add job details above and use "Generate Full" for a complete description, "Suggest Duty" for specific responsibilities, or "Enhance Text" to improve existing content.</span>
      </p>
      
      {isApiLimited ? (
        <p className="text-xs flex items-start gap-1 text-orange-500">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>AI service is currently rate-limited. The app is using smart fallback templates until limits reset. Your experience won't be affected.</span>
        </p>
      ) : (
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <InfoIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>If AI generation fails, the app will use built-in templates as a fallback. No internet connection is needed for basic functionality.</span>
        </p>
      )}
    </div>
  );
};
