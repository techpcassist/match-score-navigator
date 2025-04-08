
import FileUploader from '@/components/FileUploader';
import { FileText, FilePlus } from 'lucide-react';

interface UploadTabContentProps {
  resumeFile: File | null;
  jobDescriptionFile: File | null;
  setResumeFile: (file: File | null) => void;
  setJobDescriptionFile: (file: File | null) => void;
}

const UploadTabContent = ({ 
  resumeFile, 
  jobDescriptionFile, 
  setResumeFile, 
  setJobDescriptionFile 
}: UploadTabContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUploader 
        title="Upload Resume" 
        description="PDF or DOCX format" 
        icon={<FileText className="h-8 w-8 text-muted-foreground" />}
        onFileSelected={setResumeFile}
        acceptedTypes=".pdf,.docx,.txt"
        selectedFile={resumeFile}
      />
      
      <FileUploader 
        title="Upload Job Description" 
        description="PDF or DOCX format" 
        icon={<FilePlus className="h-8 w-8 text-muted-foreground" />}
        onFileSelected={setJobDescriptionFile}
        acceptedTypes=".pdf,.docx,.txt"
        selectedFile={jobDescriptionFile}
      />
    </div>
  );
};

export default UploadTabContent;
