// BookingPaymentStep - Phase 2 Enhanced Booking with Date/Time Selection
// Professional scheduling with multiple date options and clear payment structure

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon, Clock, ChevronDown, 
  CreditCard, Banknote, Calculator, CheckCircle,
  AlertCircle, Info
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingPaymentStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  isLoading?: boolean;
}

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (8am-12pm)', description: 'Early start for full day work' },
  { value: 'afternoon', label: 'Afternoon (12pm-5pm)', description: 'Afternoon installation' },
  { value: 'flexible', label: 'Flexible', description: 'Engineer will contact to arrange' }
];

const PAYMENT_OPTIONS = [
  {
    id: 'deposit',
    title: 'Pay Deposit Only',
    subtitle: 'Secure your booking with 10% deposit',
    description: 'Pay the remaining balance on completion',
    icon: CreditCard,
    percentage: 10,
    recommended: true
  },
  {
    id: 'materials',
    title: 'Pay for Materials',
    subtitle: 'Cover materials cost upfront',
    description: 'Pay labour costs on completion',
    icon: Calculator,
    percentage: 60,
    recommended: false
  },
  {
    id: 'full',
    title: 'Pay in Full',
    subtitle: 'Complete payment now',
    description: 'No additional payment required',
    icon: Banknote,
    percentage: 100,
    recommended: false
  }
];

export default function BookingPaymentStep({ data, onUpdate, isLoading }: BookingPaymentStepProps) {
  const [selectedDates, setSelectedDates] = useState({
    preferred: data.preferredDate || null,
    alternative1: data.alternativeDate1 || null,
    alternative2: data.alternativeDate2 || null
  });

  const [selectedTimes, setSelectedTimes] = useState({
    preferred: data.preferredTime || '',
    alternative1: data.alternativeTime1 || '',
    alternative2: data.alternativeTime2 || ''
  });

  const handleDateSelect = (dateType: string, date: Date | undefined) => {
    const newDates = { ...selectedDates, [dateType]: date };
    setSelectedDates(newDates);
    onUpdate({
      preferredDate: newDates.preferred,
      alternativeDate1: newDates.alternative1,
      alternativeDate2: newDates.alternative2
    });
  };

  const handleTimeSelect = (dateType: string, time: string) => {
    const newTimes = { ...selectedTimes, [dateType]: time };
    setSelectedTimes(newTimes);
    onUpdate({
      preferredTime: newTimes.preferred,
      alternativeTime1: newTimes.alternative1,
      alternativeTime2: newTimes.alternative2
    });
  };

  const handlePaymentOptionSelect = (option: any) => {
    const finalPrice = data.finalPrice || 0;
    const paymentAmount = Math.round(finalPrice * (option.percentage / 100));
    
    onUpdate({
      paymentOption: option.id,
      paymentAmount: paymentAmount,
      paymentPercentage: option.percentage
    });
  };

  const calculatePaymentAmount = (percentage: number) => {
    const finalPrice = data.finalPrice || 0;
    return Math.round(finalPrice * (percentage / 100));
  };

  const isMinimumDate = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return date >= tomorrow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Installation</h2>
        <p className="text-gray-600">Choose your preferred dates and payment option</p>
      </div>

      {/* Installation Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>Installation Dates & Times</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Date */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Preferred Installation Date *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.preferred ? format(selectedDates.preferred, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDates.preferred}
                      onSelect={(date) => handleDateSelect('preferred', date)}
                      disabled={(date) => !isMinimumDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Time Preference</Label>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot.value}
                      variant={selectedTimes.preferred === slot.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTimeSelect('preferred', slot.value)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Dates */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Alternative Dates (Optional but Recommended)
            </Label>
            
            {/* Alternative Date 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Alternative Date 1</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.alternative1 ? format(selectedDates.alternative1, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDates.alternative1}
                      onSelect={(date) => handleDateSelect('alternative1', date)}
                      disabled={(date) => !isMinimumDate(date) || date === selectedDates.preferred}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Time Preference</Label>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot.value}
                      variant={selectedTimes.alternative1 === slot.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTimeSelect('alternative1', slot.value)}
                      size="sm"
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alternative Date 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Alternative Date 2</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.alternative2 ? format(selectedDates.alternative2, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDates.alternative2}
                      onSelect={(date) => handleDateSelect('alternative2', date)}
                      disabled={(date) => 
                        !isMinimumDate(date) || 
                        date === selectedDates.preferred || 
                        date === selectedDates.alternative1
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Time Preference</Label>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot.value}
                      variant={selectedTimes.alternative2 === slot.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTimeSelect('alternative2', slot.value)}
                      size="sm"
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Payment Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {PAYMENT_OPTIONS.map((option) => {
            const amount = calculatePaymentAmount(option.percentage);
            const IconComponent = option.icon;
            const isSelected = data.paymentOption === option.id;
            
            return (
              <Card
                key={option.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' 
                    : 'hover:bg-gray-50 border-gray-200'
                } ${option.recommended ? 'ring-1 ring-green-400' : ''}`}
                onClick={() => handlePaymentOptionSelect(option)}
              >
                {option.recommended && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Recommended
                    </span>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <IconComponent className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.subtitle}</p>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        £{amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.percentage}% now
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-2" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 mt-1" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-2">Important Information:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Installation typically takes 1-2 days depending on complexity</li>
                <li>• Engineer will contact you 24 hours before installation to confirm</li>
                <li>• Please ensure clear access to boiler location and utilities</li>
                <li>• Payment is processed securely via Stripe</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {!selectedDates.preferred && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Please select a preferred installation date</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!data.paymentOption && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Please select a payment option</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}