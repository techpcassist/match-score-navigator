
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MissingInfo } from './types';

interface MissingInfoFormProps {
  missingInfo: MissingInfo[];
  onSubmit: (data: Record<string, any>) => void;
}

export const MissingInfoForm = ({ missingInfo, onSubmit }: MissingInfoFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const handleChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };
  
  const isFormComplete = () => {
    return missingInfo.every(item => {
      const itemData = formData[item.id];
      if (!itemData) return false;
      
      return item.fields.every(field => 
        itemData[field] && itemData[field].trim() !== ''
      );
    });
  };
  
  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (missingInfo.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">No additional information is needed.</p>
        <Button onClick={() => onSubmit({})}>Continue to Editor</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Please provide the following information to enhance your resume:
      </p>
      
      {missingInfo.map(info => (
        <Card key={info.id}>
          <CardContent className="pt-4">
            <h3 className="text-base font-medium mb-2">{info.description}</h3>
            
            {info.type === 'dates' && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label htmlFor={`${info.id}-startDate`}>Start Date (MM/YYYY)</Label>
                  <Input
                    id={`${info.id}-startDate`}
                    placeholder="MM/YYYY"
                    value={(formData[info.id]?.startDate || '')}
                    onChange={(e) => handleChange(info.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${info.id}-endDate`}>End Date (MM/YYYY or "Present")</Label>
                  <Input
                    id={`${info.id}-endDate`}
                    placeholder="MM/YYYY or Present"
                    value={(formData[info.id]?.endDate || '')}
                    onChange={(e) => handleChange(info.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {info.type === 'metrics' && (
              <div className="mt-3">
                <Label htmlFor={`${info.id}-metric`}>Achievement Metric</Label>
                <Textarea
                  id={`${info.id}-metric`}
                  placeholder="e.g., Increased sales by 25%, Reduced costs by $10,000"
                  value={(formData[info.id]?.metric || '')}
                  onChange={(e) => handleChange(info.id, 'metric', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} disabled={!isFormComplete()}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
};
