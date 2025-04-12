
import React from 'react';

export const JobDetailsTips: React.FC = () => {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        Pro tip: Add job details above and use "Generate Full" for a complete description, "Suggest Duty" for specific responsibilities, or "Enhance Text" to improve existing content.
      </p>
      <p className="text-xs text-muted-foreground">
        Note: If AI generation fails, the app will use built-in templates as a fallback. No internet connection is needed for basic functionality.
      </p>
    </div>
  );
};
