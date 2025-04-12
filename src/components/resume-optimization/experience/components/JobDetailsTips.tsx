
import React from 'react';
import { AlertCircle, InfoIcon, BookmarkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      
      <p className="text-xs text-muted-foreground flex items-start gap-1">
        <BookmarkIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span>Once you've optimized your resume, visit the <Link to="/resumes" className="text-blue-500 hover:underline">Resume Dashboard</Link> to manage, edit, and export your polished resumes.</span>
      </p>
    </div>
  );
};
