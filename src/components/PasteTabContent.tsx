
import ResumeTextInput from '@/components/ResumeTextInput';
import JobDescriptionInput from '@/components/JobDescriptionInput';

interface PasteTabContentProps {
  resumeText: string;
  jobDescriptionText: string;
  setResumeText: (text: string) => void;
  setJobDescriptionText: (text: string) => void;
}

const PasteTabContent = ({ 
  resumeText, 
  jobDescriptionText, 
  setResumeText, 
  setJobDescriptionText 
}: PasteTabContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResumeTextInput
        value={resumeText}
        onChange={setResumeText}
      />
      
      <JobDescriptionInput
        value={jobDescriptionText}
        onChange={setJobDescriptionText}
      />
    </div>
  );
};

export default PasteTabContent;
