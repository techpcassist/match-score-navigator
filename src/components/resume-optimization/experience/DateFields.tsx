
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DateFieldsProps {
  id: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateFields: React.FC<DateFieldsProps> = ({
  id,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`${id}-start-date`}>Start Date (MM/YYYY)</Label>
        <Input
          id={`${id}-start-date`}
          value={startDate || ''}
          onChange={(e) => onStartDateChange(e.target.value)}
          placeholder="MM/YYYY"
          className={!startDate ? "border-red-300" : ""}
        />
        {!startDate && (
          <p className="text-xs text-red-500 mt-1">Start date is required</p>
        )}
      </div>
      <div>
        <Label htmlFor={`${id}-end-date`}>End Date (MM/YYYY or "Present")</Label>
        <Input
          id={`${id}-end-date`}
          value={endDate || ''}
          onChange={(e) => onEndDateChange(e.target.value)}
          placeholder="MM/YYYY or Present"
          className={!endDate ? "border-red-300" : ""}
        />
        {!endDate && (
          <p className="text-xs text-red-500 mt-1">End date is required</p>
        )}
      </div>
    </div>
  );
};
