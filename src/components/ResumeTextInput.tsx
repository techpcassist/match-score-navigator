
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ResumeTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ResumeTextInput = ({ value, onChange }: ResumeTextInputProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label htmlFor="resume-input" className="text-lg font-semibold">Resume Text</Label>
          <Textarea
            id="resume-input"
            placeholder="Paste your resume content here..."
            className="h-48 resize-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeTextInput;
