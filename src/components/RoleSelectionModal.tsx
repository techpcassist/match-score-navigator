
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UserCircle, Briefcase } from 'lucide-react';

export type UserRole = 'job_seeker' | 'recruiter';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
}

const RoleSelectionModal = ({ isOpen, onClose, onConfirm }: RoleSelectionModalProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onConfirm(selectedRole);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Analyze as:</DialogTitle>
          <DialogDescription>
            Choose your perspective to tailor the analysis report
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedRole || ''} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 mb-3 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="job_seeker" id="job_seeker" className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="job_seeker" className="text-base font-medium flex items-center">
                    <UserCircle className="mr-2 h-5 w-5" />
                    Job Seeker
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimizing my resume for this job position
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="recruiter" id="recruiter" className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <Label htmlFor="recruiter" className="text-base font-medium flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Recruiter
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Evaluating a candidate for this position
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedRole}
            className="ml-2"
          >
            Start Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal;
