
import React, { useState } from 'react';
import { UserRole } from '@/components/RoleSelectionModal';
import { useAnalysis } from './AnalysisProvider';
import { JobTitleCompanyForm } from '@/components/report/JobTitleCompanyForm';
import RoleSelectionModal from '@/components/RoleSelectionModal';
import ReportView from '@/components/ReportView';

interface AnalysisWorkflowProps {
  showJobTitleCompanyForm: boolean;
  onCloseJobTitleForm: () => void;
}

export const AnalysisWorkflow: React.FC<AnalysisWorkflowProps> = ({
  showJobTitleCompanyForm,
  onCloseJobTitleForm,
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [jobTitleCompanyInfo, setJobTitleCompanyInfo] = useState({
    jobTitle: '',
    companyName: ''
  });

  const {
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
    await performAnalysis(role, jobTitleCompanyInfo.jobTitle, jobTitleCompanyInfo.companyName);
  };

  return (
    <>
      <JobTitleCompanyForm 
        open={showJobTitleCompanyForm}
        onClose={onCloseJobTitleForm}
        onSubmit={handleJobTitleCompanySubmit}
        jobTitle=""
        companyName=""
      />
      
      {showRoleModal && (
        <RoleSelectionModal 
          key={`role-modal-${showRoleModal}`}
          isOpen={showRoleModal} 
          onClose={() => setShowRoleModal(false)} 
          onConfirm={handleRoleConfirm}
        />
      )}
      
      {matchScore !== null && report && (
        <ReportView 
          matchScore={matchScore} 
          report={report}
          userRole={selectedRole}
          resumeText={finalProcessedResumeText}
          jobDescriptionText={finalProcessedJobText}
        />
      )}
    </>
  );
};
