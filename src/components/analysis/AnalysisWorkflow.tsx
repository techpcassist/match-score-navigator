
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/components/RoleSelectionModal';
import { useAnalysis } from './AnalysisProvider';
import { JobTitleCompanyForm } from '@/components/report/JobTitleCompanyForm';
import RoleSelectionModal from '@/components/RoleSelectionModal';
import { Progress } from '@/components/ui/progress';

interface AnalysisWorkflowProps {
  showJobTitleCompanyForm: boolean;
  onCloseJobTitleForm: () => void;
}

export const AnalysisWorkflow: React.FC<AnalysisWorkflowProps> = ({
  showJobTitleCompanyForm,
  onCloseJobTitleForm,
}) => {
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [jobTitleCompanyInfo, setJobTitleCompanyInfo] = useState({
    jobTitle: '',
    companyName: ''
  });

  const {
    isAnalyzing,
    matchScore,
    report,
    finalProcessedResumeText,
    finalProcessedJobText,
    performAnalysis
  } = useAnalysis();

  const handleJobTitleCompanySubmit = async (jobTitle: string, companyName: string) => {
    setJobTitleCompanyInfo({ jobTitle, companyName });
    onCloseJobTitleForm();
    setShowRoleModal(true);
  };

  const handleRoleConfirm = async (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    console.log("Role selected:", role);
    console.log("Job title:", jobTitleCompanyInfo.jobTitle);
    console.log("Company name:", jobTitleCompanyInfo.companyName);
    await performAnalysis(role, jobTitleCompanyInfo.jobTitle, jobTitleCompanyInfo.companyName);
  };

  // Navigate to report page when analysis is complete
  React.useEffect(() => {
    if (matchScore !== null && report && !isAnalyzing) {
      navigate('/report', {
        state: {
          matchScore,
          report,
          userRole: selectedRole,
          resumeText: finalProcessedResumeText,
          jobDescriptionText: finalProcessedJobText,
          jobTitle: jobTitleCompanyInfo.jobTitle,
          companyName: jobTitleCompanyInfo.companyName
        }
      });
    }
  }, [matchScore, report, isAnalyzing, navigate, selectedRole, finalProcessedResumeText, finalProcessedJobText, jobTitleCompanyInfo]);

  return (
    <>
      <JobTitleCompanyForm 
        open={showJobTitleCompanyForm}
        onClose={onCloseJobTitleForm}
        onSubmit={handleJobTitleCompanySubmit}
        jobTitle={jobTitleCompanyInfo.jobTitle}
        companyName={jobTitleCompanyInfo.companyName}
      />
      
      {showRoleModal && (
        <RoleSelectionModal 
          key={`role-modal-${showRoleModal}`}
          isOpen={showRoleModal} 
          onClose={() => setShowRoleModal(false)} 
          onConfirm={handleRoleConfirm}
        />
      )}
      
      {isAnalyzing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-center mb-4">Analyzing Resume Match</h3>
            <Progress value={100} className="w-full animate-pulse" />
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we analyze your resume...
            </p>
          </div>
        </div>
      )}
    </>
  );
};
