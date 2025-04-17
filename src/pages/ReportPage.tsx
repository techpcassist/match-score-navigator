
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ReportView from '@/components/report/ReportView';
import { Button } from '@/components/ui/button';
import { FileText, FileDown } from 'lucide-react';
import { resumeExporter } from '@/utils/resumeExporter';
import { parseContentIntoSections } from '@/utils/resumeParser';

const ReportPage = () => {
  const location = useLocation();
  const state = location.state as {
    matchScore: number;
    report: any;
    userRole: string;
    resumeText: string;
    jobDescriptionText: string;
  } | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const handleExportPdf = async () => {
    const sections = parseContentIntoSections(state.resumeText);
    await resumeExporter.exportToPdf("Resume", sections);
  };

  const handleExportDocx = async () => {
    const sections = parseContentIntoSections(state.resumeText);
    await resumeExporter.exportToDocx("Resume", sections);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={handleExportDocx}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export DOCX
        </Button>
        <Button 
          onClick={handleExportPdf}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <ReportView
        matchScore={state.matchScore}
        report={state.report}
        userRole={state.userRole}
        resumeText={state.resumeText}
        jobDescriptionText={state.jobDescriptionText}
      />
    </div>
  );
};

export default ReportPage;
