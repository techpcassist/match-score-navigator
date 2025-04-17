
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JobTitleCompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (jobTitle: string, companyName: string) => void;
  jobTitle?: string;
  companyName?: string;
}

export const JobTitleCompanyForm: React.FC<JobTitleCompanyFormProps> = ({
  open,
  onClose,
  onSubmit,
  jobTitle = '',
  companyName = ''
}) => {
  const [jobTitleInput, setJobTitleInput] = useState(jobTitle);
  const [companyNameInput, setCompanyNameInput] = useState(companyName);

  useEffect(() => {
    if (open) {
      setJobTitleInput(jobTitle);
      setCompanyNameInput(companyName);
    }
  }, [open, jobTitle, companyName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jobTitleInput, companyNameInput);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Job Position Details</DialogTitle>
          <DialogDescription>
            Please provide the job title and company name to receive personalized insights from a hiring manager's perspective, including:
            • Required technical and soft skills
            • Expected qualifications and experience
            • Company culture fit analysis
            • Industry-specific expectations
            • Career growth opportunities
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTitle" className="text-right">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">
                Company
              </Label>
              <Input
                id="companyName"
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Tech Solutions Inc."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Continue Analysis</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
