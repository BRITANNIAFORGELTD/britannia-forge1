// Enhanced QuoteWizard - Phase 2 Implementation
// High-fidelity React UI consuming the Intelligent Quote Engine

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import step components
import PropertyDetailsStep from './quote-steps/PropertyDetailsStep';
import PhotoUploadStep from './quote-steps/PhotoUploadStep';
import QuotePresentationStep from './quote-steps/QuotePresentationStep';
import CustomerDetailsStep from './quote-steps/CustomerDetailsStep';
import BookingPaymentStep from './quote-steps/BookingPaymentStep';
import BookingConfirmedStep from './quote-steps/BookingConfirmedStep';

// Types
interface QuoteData {
  // Property Details
  postcode: string;
  propertyType: 'House' | 'Flat' | '';
  bedrooms: string;
  bathrooms: string;
  occupants: string;
  currentBoiler: string;
  flueLocation: string;
  flueExtension: string;
  drainNearby: string;
  moveBoiler: string;
  parkingSituation: string;
  parkingDistance: string;
  floorLevel?: string;
  hasLift?: boolean;
  
  // NEW - Phase 2 Requirements
  hasFusedSwitch?: boolean;
  fusedSwitchCost?: number;
  
  // Photo Requirements (Enhanced)
  photos: {
    boilerCloseup?: File;
    boilerDistant?: File;
    pipework?: File;
    flue?: File;
    gasMeter?: File;
    electricalMeter?: File;  // NEW
    waterStopcock?: File;    // NEW
    additional1?: File;
    additional2?: File;
    additional3?: File;      // NEW
    additional4?: File;      // NEW
  };
  
  // Quote Results
  intelligentQuote?: any;
  selectedPackage?: 'budget' | 'midRange' | 'premium';
  selectedBoiler?: any;
  finalPrice?: number;
  
  // Customer Details (Enhanced)
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  specialRequests?: string;
  acceptTerms?: boolean;
  acceptMarketing?: boolean;
  
  // Booking & Payment (Enhanced)
  preferredDate?: Date;
  alternativeDate1?: Date;
  alternativeDate2?: Date;
  preferredTime?: string;
  alternativeTime1?: string;
  alternativeTime2?: string;
  paymentOption?: 'deposit' | 'materials' | 'full';
  paymentAmount?: number;
  paymentPercentage?: number;
}

const STEPS = [
  { id: 1, name: 'Property Details', component: PropertyDetailsStep },
  { id: 2, name: 'Photo Upload', component: PhotoUploadStep },
  { id: 3, name: 'Quote Selection', component: QuotePresentationStep },
  { id: 4, name: 'Customer Details', component: CustomerDetailsStep },
  { id: 5, name: 'Booking & Payment', component: BookingPaymentStep },
  { id: 6, name: 'Confirmation', component: BookingConfirmedStep }
];

export default function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    postcode: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    occupants: '',
    currentBoiler: '',
    flueLocation: '',
    flueExtension: '0',
    drainNearby: '',
    moveBoiler: '',
    parkingSituation: '',
    parkingDistance: '',
    photos: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  // Update quote data
  const updateQuoteData = (updates: Partial<QuoteData>) => {
    setQuoteData(prev => ({ ...prev, ...updates }));
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Property Details (Phase 2 Enhanced)
        return !!(
          quoteData.postcode &&
          quoteData.propertyType &&
          quoteData.bedrooms &&
          quoteData.bathrooms &&
          quoteData.occupants &&
          quoteData.currentBoiler &&
          quoteData.flueLocation &&
          quoteData.drainNearby &&
          quoteData.moveBoiler &&
          quoteData.parkingSituation &&
          quoteData.parkingDistance &&
          quoteData.hasFusedSwitch !== undefined  // NEW - Fused switch question
        );
      
      case 2: // Photo Upload (Phase 2 Enhanced)
        return !!(
          quoteData.photos.boilerCloseup &&
          quoteData.photos.boilerDistant &&
          quoteData.photos.pipework &&
          quoteData.photos.flue &&
          quoteData.photos.gasMeter &&
          quoteData.photos.electricalMeter &&  // NEW
          quoteData.photos.waterStopcock       // NEW
        );
      
      case 3: // Quote Selection
        return !!(quoteData.selectedPackage && quoteData.intelligentQuote);
      
      case 4: // Customer Details (Phase 2 Enhanced)
        return !!(
          quoteData.firstName &&
          quoteData.lastName &&
          quoteData.email &&
          quoteData.phone &&
          quoteData.address &&
          quoteData.city &&
          quoteData.postcode &&
          quoteData.acceptTerms
        );
      
      case 5: // Booking & Payment (Phase 2 Enhanced)
        return !!(
          quoteData.preferredDate &&
          quoteData.paymentOption &&
          quoteData.paymentAmount
        );
      
      default:
        return true;
    }
  };

  // Generate intelligent quote
  const generateIntelligentQuote = async () => {
    if (currentStep !== 2) return; // Only generate after photo upload
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/calculate-intelligent-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to generate quote`);
      }
      
      const intelligentQuote = await response.json();
      
      if (!intelligentQuote) {
        throw new Error('Invalid quote data received');
      }
      
      updateQuoteData({ intelligentQuote });
      
      toast({
        title: "Quote Generated",
        description: "Your personalized quote is ready!",
      });
    } catch (error) {
      console.error('Quote generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Quote Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Generate quote after photo upload
    if (currentStep === 2 && !quoteData.intelligentQuote) {
      await generateIntelligentQuote();
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Get current step component
  const CurrentStepComponent = STEPS[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
          >
            Get Your Boiler Quote
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Professional boiler installation with intelligent pricing
          </motion.p>
        </div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center max-w-20">
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    data={quoteData}
                    onUpdate={updateQuoteData}
                    isLoading={isLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-8"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Quote...
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/customer-dashboard'}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}