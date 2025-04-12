
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRIES, STATES_BY_COUNTRY } from '../utils/location-data';
import { Location } from '../types';

interface CompanyFieldsProps {
  id: string;
  company: string;
  title: string;
  companyLocation: Location;
  onCompanyChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onLocationChange: (field: keyof Location, value: string) => void;
}

export const CompanyFields: React.FC<CompanyFieldsProps> = ({
  id,
  company,
  title,
  companyLocation,
  onCompanyChange,
  onTitleChange,
  onLocationChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${id}-company`}>Company</Label>
          <Input
            id={`${id}-company`}
            value={company || ''}
            onChange={(e) => onCompanyChange(e.target.value)}
            placeholder="Company name"
          />
        </div>
        <div>
          <Label htmlFor={`${id}-title`}>Job Title</Label>
          <Input
            id={`${id}-title`}
            value={title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Your position"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Company Location</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Select
              value={companyLocation?.country || ''}
              onValueChange={(value) => onLocationChange('country', value)}
            >
              <SelectTrigger id={`${id}-country`}>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {companyLocation?.country && (
            <div>
              <Select
                value={companyLocation?.state || ''}
                onValueChange={(value) => onLocationChange('state', value)}
              >
                <SelectTrigger id={`${id}-state`}>
                  <SelectValue placeholder="Select State/Province" />
                </SelectTrigger>
                <SelectContent>
                  {(STATES_BY_COUNTRY[companyLocation.country] || []).map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Input
              id={`${id}-city`}
              value={companyLocation?.city || ''}
              onChange={(e) => onLocationChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
        </div>
      </div>
    </>
  );
};
