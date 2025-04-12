
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ContactDetails {
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  linkedin?: string;
}

interface ContactDetailsSectionProps {
  contactDetails: ContactDetails;
  onChange: (contactDetails: ContactDetails) => void;
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({ contactDetails = {}, onChange }) => {
  // Initialize with empty object if not provided
  const details: ContactDetails = {
    full_name: contactDetails?.full_name || '',
    email: contactDetails?.email || '',
    phone: contactDetails?.phone || '',
    whatsapp: contactDetails?.whatsapp || '',
    linkedin: contactDetails?.linkedin || ''
  };
  
  const handleChange = (field: keyof ContactDetails, value: string) => {
    onChange({
      ...details,
      [field]: value
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Alert variant="default" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Provide your contact information so employers can reach you. 
              Make sure your email and phone number are accurate.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={details.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={details.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number (if different from phone)</Label>
              <Input
                id="whatsapp"
                value={details.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            
            <div>
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                value={details.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="www.linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetailsSection;
