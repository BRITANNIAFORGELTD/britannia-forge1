// CustomerDetailsStep - Phase 2 Enhanced Customer Information Collection
// Professional form with comprehensive validation and mobile-first design

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, Mail, Phone, Home, MessageSquare, 
  Shield, CheckCircle, AlertCircle
} from 'lucide-react';

interface CustomerDetailsStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  isLoading?: boolean;
}

export default function CustomerDetailsStep({ data, onUpdate, isLoading }: CustomerDetailsStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    onUpdate({ [field]: checked });
  };

  // Validation helpers
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
  };

  const getFieldError = (field: string, value: any) => {
    if (!value || value.trim() === '') return 'This field is required';
    
    if (field === 'email' && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    
    if (field === 'phone' && !isValidPhone(value)) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Details</h2>
        <p className="text-gray-600">We need some information to complete your booking</p>
      </div>

      {/* Quote Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Selected Package</h3>
                <p className="text-sm text-gray-600">
                  {data.selectedPackage ? 
                    `${data.selectedPackage.charAt(0).toUpperCase() + data.selectedPackage.slice(1)} Package` : 
                    'No package selected'
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                £{data.finalPrice?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">inc. VAT</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-base font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={data.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mt-1"
              />
              {data.firstName !== undefined && getFieldError('firstName', data.firstName) && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('firstName', data.firstName)}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName" className="text-base font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={data.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="mt-1"
              />
              {data.lastName !== undefined && getFieldError('lastName', data.lastName) && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('lastName', data.lastName)}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-base font-medium">
              Email Address *
            </Label>
            <div className="relative mt-1">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={data.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {data.email !== undefined && getFieldError('email', data.email) && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('email', data.email)}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-base font-medium">
              Phone Number *
            </Label>
            <div className="relative mt-1">
              <Input
                id="phone"
                type="tel"
                placeholder="07123 456789"
                value={data.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
              />
              <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {data.phone !== undefined && getFieldError('phone', data.phone) && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('phone', data.phone)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Installation Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-blue-600" />
            <span>Installation Address</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Street Address */}
          <div>
            <Label htmlFor="address" className="text-base font-medium">
              Street Address *
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Example Street"
              value={data.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-1"
            />
            {data.address !== undefined && getFieldError('address', data.address) && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('address', data.address)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <Label htmlFor="city" className="text-base font-medium">
                City *
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="London"
                value={data.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="mt-1"
              />
              {data.city !== undefined && getFieldError('city', data.city) && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('city', data.city)}
                </div>
              )}
            </div>

            {/* Postcode (auto-filled) */}
            <div>
              <Label htmlFor="postcodeConfirm" className="text-base font-medium">
                Postcode *
              </Label>
              <Input
                id="postcodeConfirm"
                type="text"
                value={data.postcode || ''}
                onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                className="mt-1"
                placeholder="SW1A 1AA"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Additional Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="specialRequests" className="text-base font-medium">
              Special Requirements or Notes (Optional)
            </Label>
            <Textarea
              id="specialRequests"
              placeholder="Any special access requirements, preferred times, or other notes for the engineer..."
              value={data.specialRequests || ''}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={data.acceptTerms || false}
                onCheckedChange={(checked) => handleCheckboxChange('acceptTerms', checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I accept the Terms & Conditions and Privacy Policy *
                </Label>
                <p className="text-xs text-gray-600">
                  By proceeding, you agree to our installation terms and privacy policy.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={data.acceptMarketing || false}
                onCheckedChange={(checked) => handleCheckboxChange('acceptMarketing', checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                  I would like to receive maintenance reminders and service updates
                </Label>
                <p className="text-xs text-gray-600">
                  Optional: Receive helpful maintenance tips and service notifications.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">Your Information is Secure</p>
              <p className="text-gray-600">
                All personal information is encrypted and stored securely. We never share your details with third parties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}