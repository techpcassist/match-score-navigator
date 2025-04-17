
import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jobTitleInput, companyNameInput);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Job Information</DialogTitle>
          <DialogDescription>
            Please provide the job title and company name to enhance your analysis.
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
                placeholder="e.g. Software Engineer"
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
                placeholder="e.g. Acme Corporation"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
