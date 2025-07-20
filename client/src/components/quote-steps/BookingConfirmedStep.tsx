// BookingConfirmedStep - Installation Confirmation and Customer Dashboard Preview
// Success state with next steps and engineer assignment

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, Calendar, User, Phone, Mail, 
  MapPin, Clock, FileText, Wrench, Star,
  Download, MessageCircle, Shield, Home
} from 'lucide-react';

interface BookingConfirmedStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  isLoading?: boolean;
}

export default function BookingConfirmedStep({ data, onUpdate, isLoading }: BookingConfirmedStepProps) {
  const selectedPackage = data.selectedPackage;
  const intelligentQuote = data.intelligentQuote;
  const selectedOption = intelligentQuote?.boilerOptions[selectedPackage];
  
  // Generate booking reference
  const bookingRef = `BF${Date.now().toString().slice(-6)}`;
  
  // Mock engineer assignment (this would come from the backend in a real system)
  const assignedEngineer = {
    name: 'James Mitchell',
    gasafeId: '12345678',
    rating: 4.9,
    reviews: 247,
    phone: '07123 456789',
    email: 'james.mitchell@britanniaforge.co.uk',
    experience: '12+ years',
    specialties: ['Combi Boilers', 'System Boilers', 'Worcester Bosch', 'Vaillant']
  };

  const nextSteps = [
    {
      step: 1,
      title: 'Engineer Assignment Confirmed',
      description: 'Your Gas Safe engineer has been assigned',
      status: 'completed',
      icon: User
    },
    {
      step: 2,
      title: 'Pre-Installation Survey',
      description: 'Engineer will contact you within 24 hours',
      status: 'next',
      icon: Phone
    },
    {
      step: 3,
      title: 'Materials Delivery',
      description: 'Boiler and components delivered to site',
      status: 'pending',
      icon: Wrench
    },
    {
      step: 4,
      title: 'Installation Day',
      description: 'Professional installation completed',
      status: 'pending',
      icon: Home
    }
  ];

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Booking Confirmed!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-4"
        >
          Your boiler installation has been successfully booked
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium"
        >
          <FileText className="w-5 h-5" />
          Booking Reference: {bookingRef}
        </motion.div>
      </motion.div>

      {/* Installation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Installation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">System Specification</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Boiler Type:</span>
                      <span className="font-medium">{intelligentQuote?.recommendedBoilerType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Output:</span>
                      <span className="font-medium">{intelligentQuote?.recommendedBoilerSize}kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{selectedOption?.boiler.make} {selectedOption?.boiler.model}</span>
                    </div>
                    {intelligentQuote?.cylinderSize && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cylinder:</span>
                        <span className="font-medium">{intelligentQuote.cylinderSize}L</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Installation Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {data.installationDate ? data.installationDate.toLocaleDateString() : 'To be confirmed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {data.timePreference === 'morning' && '8:00 AM - 12:00 PM'}
                        {data.timePreference === 'afternoon' && '12:00 PM - 5:00 PM'}
                        {data.timePreference === 'flexible' && 'Flexible (8:00 AM - 5:00 PM)'}
                        {!data.timePreference && 'To be confirmed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Complexity:</span>
                      <span className="font-medium">{intelligentQuote?.installationComplexity}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium capitalize">{selectedPackage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">£{data.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Today:</span>
                      <span className="font-medium text-green-600">£{data.paymentAmount?.toLocaleString()}</span>
                    </div>
                    {data.paymentMethod !== 'full' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-medium">£{(data.totalAmount - data.paymentAmount)?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{data.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{data.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{data.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assigned Engineer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <User className="w-5 h-5" />
              Your Assigned Engineer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">{assignedEngineer.name}</h3>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{assignedEngineer.rating} stars ({assignedEngineer.reviews} reviews)</span>
                </div>
                <div className="text-sm text-blue-600">
                  Gas Safe ID: {assignedEngineer.gasafeId} • {assignedEngineer.experience} experience
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-blue-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{assignedEngineer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{assignedEngineer.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {assignedEngineer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-200 text-blue-800">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              What Happens Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={step.step} className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${step.status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : step.status === 'next'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      step.status === 'next' ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {step.status === 'completed' && (
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  )}
                  {step.status === 'next' && (
                    <Badge className="bg-blue-100 text-blue-800">Next</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" />
          Download Summary
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => window.location.href = '/contact'}
        >
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </Button>
        
        <Button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => window.location.href = '/customer-dashboard'}
        >
          <Shield className="w-4 h-4" />
          Go to Dashboard
        </Button>
      </motion.div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Important Information
            </h4>
            <div className="space-y-2 text-sm text-amber-800">
              <p>
                <strong>Before Installation:</strong> Please ensure clear access to your boiler area and 
                remove any valuables from the vicinity.
              </p>
              <p>
                <strong>On the Day:</strong> Our engineer will arrive with all necessary materials and 
                equipment. The installation typically takes 1-2 days depending on complexity.
              </p>
              <p>
                <strong>After Installation:</strong> You'll receive all warranties, certificates, and 
                operating instructions. A demonstration of your new system is included.
              </p>
              <p>
                <strong>Customer Support:</strong> Available 24/7 for any questions or concerns about 
                your installation.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}