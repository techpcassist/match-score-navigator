
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateResume: (title: string) => void;
}

export const NewResumeDialog: React.FC<NewResumeDialogProps> = ({ 
  open, 
  onOpenChange, 
  onCreateResume 
}) => {
  const [newResumeTitle, setNewResumeTitle] = useState('');

  const handleCreate = () => {
    onCreateResume(newResumeTitle);
    setNewResumeTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Give your resume a title to help you identify it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="resumeTitle">Resume Title</Label>
          <Input
            id="resumeTitle"
            value={newResumeTitle}
            onChange={(e) => setNewResumeTitle(e.target.value)}
            placeholder="e.g., Software Developer Resume"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
