
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

interface JobTitleFormProps {
  jobTitle: string;
  companyName: string;
  onSubmit: (jobTitle: string, companyName: string) => void;
}

export const JobTitleForm: React.FC<JobTitleFormProps> = ({
  jobTitle,
  companyName,
  onSubmit
}) => {
  const [title, setTitle] = React.useState(jobTitle);
  const [company, setCompany] = React.useState(companyName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, company);
  };

  return (
    <div className="space-y-4 mb-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please provide the job title and company name to enhance your analysis.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Corporation"
            required
          />
        </div>
        
        <Button type="submit">Update Analysis</Button>
      </form>
    </div>
  );
};
