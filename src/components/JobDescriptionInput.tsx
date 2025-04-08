
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label htmlFor="jd-input" className="text-lg font-semibold">Job Description</Label>
          <Textarea
            id="jd-input"
            placeholder="Paste the job description here..."
            className="h-48 resize-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;
