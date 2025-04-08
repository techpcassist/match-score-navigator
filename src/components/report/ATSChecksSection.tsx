
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ATSCheck } from './types';

interface ATSChecksSectionProps {
  checks: ATSCheck[];
}

export const ATSChecksSection = ({ checks }: ATSChecksSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">ATS Compatibility Checks</h3>
      <div className="space-y-3">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
            {check.status === 'pass' && (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            {check.status === 'warning' && (
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            )}
            {check.status === 'fail' && (
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{check.check_name}</p>
              <p className="text-sm text-muted-foreground">{check.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
