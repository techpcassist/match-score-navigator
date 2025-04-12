
import React, { useState, useEffect } from "react";
import ReportViewMain from "./report/ReportViewMain";
import ResumeOptimizationHandler from "./report/ResumeOptimizationHandler";

const ReportView = ({ matchScore, report, userRole, resumeText, jobDescriptionText }) => {
  const [localResumeText, setLocalResumeText] = useState('');
  const [localJobText, setLocalJobText] = useState('');

  // Use effect to update local state when props change
  useEffect(() => {
    console.log("ReportView: Received resumeText prop:", resumeText ? `Present (length: ${resumeText.length})` : "Not present");
    console.log("ReportView: Received jobDescriptionText prop:", jobDescriptionText ? `Present (length: ${jobDescriptionText.length})` : "Not present");
    
    if (resumeText && resumeText.trim() !== '') {
      console.log("ReportView: Updating localResumeText from props");
      setLocalResumeText(resumeText);
    }
    
    if (jobDescriptionText && jobDescriptionText.trim() !== '') {
      console.log("ReportView: Updating localJobText from props");
      setLocalJobText(jobDescriptionText);
    }
  }, [resumeText, jobDescriptionText]);

  return (
    <ResumeOptimizationHandler
      resumeText={resumeText}
      jobDescriptionText={jobDescriptionText}
      localResumeText={localResumeText}
      localJobText={localJobText}
    >
      {(handleParseResume) => (
        <ReportViewMain
          matchScore={matchScore}
          report={report}
          userRole={userRole}
          resumeText={resumeText}
          localResumeText={localResumeText}
          onParseResume={handleParseResume}
        />
      )}
    </ResumeOptimizationHandler>
  );
};

export default ReportView;
