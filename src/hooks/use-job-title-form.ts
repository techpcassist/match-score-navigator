
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ReportData } from '@/components/report/types';

interface JobTitleInfo {
  jobTitle: string;
  companyName: string;
}

export function useJobTitleForm(report: ReportData) {
  const [showJobTitleForm, setShowJobTitleForm] = useState(false);
  const [jobTitleInfo, setJobTitleInfo] = useState<JobTitleInfo>({
    jobTitle: '',
    companyName: ''
  });

  useEffect(() => {
    if (report && report.job_title_analysis) {
      const { job_title, company_name } = report.job_title_analysis;
      
      if (job_title === "unknown" || company_name === "unknown") {
        setShowJobTitleForm(true);
      } else {
        setJobTitleInfo({
          jobTitle: job_title,
          companyName: company_name
        });
      }
    }
  }, [report]);

  const handleJobTitleSubmit = (jobTitle: string, companyName: string) => {
    setJobTitleInfo({ jobTitle, companyName });
    setShowJobTitleForm(false);
    toast({
      title: "Information Updated",
      description: "Job title and company name have been added to your analysis.",
    });
  };

  return {
    showJobTitleForm,
    setShowJobTitleForm,
    jobTitleInfo,
    handleJobTitleSubmit
  };
}
