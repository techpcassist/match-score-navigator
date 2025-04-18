
import React from 'react';
import { TrophyIcon } from 'lucide-react';

interface ReportHeaderProps {
  userRole?: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ userRole }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2 md:mb-0">Analysis Report</h2>
      {userRole === "recruiter" && (
        <div className="flex items-center text-sm text-muted-foreground">
          <TrophyIcon className="mr-2 h-4 w-4" />
          Recruiter View
        </div>
      )}
    </div>
  );
};
