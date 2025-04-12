
import React from 'react';

export const EditorLoading: React.FC = () => {
  return (
    <div className="container mx-auto py-4 flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading resume...</p>
      </div>
    </div>
  );
};
