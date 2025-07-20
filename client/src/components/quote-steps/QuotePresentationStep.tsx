// QuotePresentationStep - Phase 3 Complete: Real CSV Data Integration
// Intelligent quotation engine with authentic UK market pricing

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, Check, ChevronDown, ChevronUp, Zap, Shield, 
  Award, Info, Calculator, Wrench, Home, Droplets,
  Car, AlertCircle, Clock, Settings, ThermometerSun,
  Flame, Package, Building2
} from 'lucide-react';
import type { QuoteData, IntelligentQuoteResult, QuoteOption } from '@/types/quote';

interface QuotePresentationStepProps {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  isLoading?: boolean;
}

interface PackageCardProps {
  tier: 'budget' | 'standard' | 'premium';
  option: QuoteOption & { breakdown: any };
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  intelligentQuote: IntelligentQuoteResult;
}

const PackageCard = ({ tier, option, isSelected, isRecommended, onSelect, intelligentQuote }: PackageCardProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const tierConfig = {
    budget: {
      name: 'Budget Package',
      color: 'bg-green-50 border-green-200',
      selectedColor: 'bg-green-100 border-green-400',
      icon: Calculator,
      description: 'Essential quality at competitive price',
      highlight: 'Best Price'
    },
    standard: {
      name: 'Standard Package',
      color: 'bg-blue-50 border-blue-200',
      selectedColor: 'bg-blue-100 border-blue-400',
      icon: Star,
      description: 'Perfect balance of quality and value',
      highlight: 'Most Popular'
    },
    premium: {
      name: 'Premium Package',
      color: 'bg-purple-50 border-purple-200',
      selectedColor: 'bg-purple-100 border-purple-400',
      icon: Award,
      description: 'Top-tier performance and features',
      highlight: 'Best Quality'
    }
  };

  const config = tierConfig[tier];
  const IconComponent = config.icon;
  
  // Use real breakdown data from Phase 3 intelligent engine
  const breakdown = option.breakdown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: tier === 'budget' ? 0 : tier === 'midRange' ? 0.1 : 0.2 }}
    >
      <Card 
        className={`relative cursor-pointer transition-all duration-300 ${
          isSelected ? config.selectedColor : config.color
        } hover:shadow-lg ${isRecommended ? 'ring-2 ring-blue-400' : ''}`}
        onClick={onSelect}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Best Value
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-white/80'}`}>
                <IconComponent className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{config.name}</CardTitle>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
            </div>
            {isSelected && (
              <Check className="w-6 h-6 text-green-600" />
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Phase 3: Real Boiler Specifications */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{breakdown.boilerMake} {breakdown.boilerModel}</h4>
                <p className="text-sm text-gray-600">{breakdown.boilerWarranty} year warranty • {option.boilerSpec.efficiency} efficiency</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">£{option.price.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Inc. VAT</div>
              </div>
            </div>
            
            {/* Key Specifications */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm">{breakdown.heatOutputKw}kW Output</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{breakdown.waterFlowRate}L/min Flow</span>
              </div>
              {breakdown.cylinderCapacity > 0 && (
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{breakdown.cylinderCapacity}L Cylinder</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">{breakdown.labourLocation}</span>
              </div>
            </div>
            
            {/* Installation Type */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Wrench className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">{breakdown.labourType}</div>
                  <div className="text-sm text-blue-700">{breakdown.recommendationReason}</div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">What's Included:</h5>
              <div className="space-y-1">
                {option.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {option.features.length > 4 && (
                  <div className="text-sm text-blue-600 cursor-pointer" onClick={() => setShowBreakdown(!showBreakdown)}>
                    +{option.features.length - 4} more features
                  </div>
                )}
              </div>
            </div>

            {/* Parking Note */}
            {breakdown.parkingNote && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Car className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">{breakdown.parkingNote}</div>
                </div>
              </div>
            )}

            {/* Detailed Breakdown Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full"
            >
              {showBreakdown ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Price Breakdown
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Price Breakdown
                </>
              )}
            </Button>

            {/* Phase 3: Detailed Component Breakdown */}
            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <h6 className="font-medium text-gray-900 mb-3">Detailed Price Breakdown</h6>
                
                {/* Group components by category */}
                {Object.entries(
                  breakdown.components.reduce((acc, component) => {
                    if (!acc[component.category]) acc[component.category] = [];
                    acc[component.category].push(component);
                    return acc;
                  }, {} as Record<string, any[]>)
                ).map(([category, components]) => (
                  <div key={category} className="mb-3">
                    <div className="font-medium text-sm text-gray-700 mb-1">{category}</div>
                    {components.map((component, index) => (
                      <div key={index} className="flex justify-between items-center py-1 text-sm">
                        <div className="flex-1">
                          <div className="text-gray-900">{component.name}</div>
                          {component.description && (
                            <div className="text-gray-500 text-xs">{component.description}</div>
                          )}
                        </div>
                        <div className="text-right">
                          {component.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                              {component.quantity} × £{(component.unitPrice / 100).toFixed(0)}
                            </div>
                          )}
                          <div className="font-medium">
                            £{(component.totalPrice / 100).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                <Separator className="my-3" />
                
                {/* Totals */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>£{(breakdown.subtotal / 100).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (20%)</span>
                    <span>£{(breakdown.vatAmount / 100).toFixed(0)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£{(breakdown.totalPrice / 100).toFixed(0)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main QuotePresentationStep Component 
export default function QuotePresentationStep({ data, onUpdate, isLoading }: QuotePresentationStepProps) {
  
  // Check if we have intelligent quote data
  if (!data.intelligentQuote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">Generating Your Personalized Quote</h3>
          <p className="text-gray-600">Analyzing your property and calculating optimal recommendations...</p>
        </div>
      </div>
    );
  }

  const intelligentQuote = data.intelligentQuote as IntelligentQuoteResult;
  
  // Get quote options
  const quoteOptions = [
    { tier: 'budget' as const, option: intelligentQuote.budgetOption, isRecommended: false },
    { tier: 'standard' as const, option: intelligentQuote.standardOption, isRecommended: true },
    { tier: 'premium' as const, option: intelligentQuote.premiumOption, isRecommended: false }
  ];

  const handlePackageSelect = (optionId: string) => {
    onUpdate({ 
      selectedQuoteId: optionId,
      selectedPackage: optionId 
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Phase 3: Intelligent Recommendation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Intelligent Quote is Ready</h2>
        <p className="text-gray-600 mb-4">
          Based on our analysis of your {data.bedrooms} bedroom, {data.bathrooms} bathroom {data.propertyType.toLowerCase()} 
          in {data.postcode}, we recommend a <strong>{intelligentQuote.recommendedBoilerType}</strong> boiler system.
        </p>
        
        {/* Recommendation Reason */}
        <div className="bg-white rounded-lg p-4 inline-block">
          <div className="flex items-start space-x-3 text-left">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Professional Recommendation</div>
              <div className="text-sm text-gray-600">{intelligentQuote.reasonForRecommendation}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quote Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quoteOptions.map(({ tier, option, isRecommended }) => (
          <PackageCard
            key={tier}
            tier={tier}
            option={option}
            isSelected={data.selectedQuoteId === option.id}
            isRecommended={isRecommended}
            onSelect={() => handlePackageSelect(option.id)}
            intelligentQuote={intelligentQuote}
          />
        ))}
      </div>

      {/* Alternative Options */}
      {intelligentQuote.alternativeOptions && intelligentQuote.alternativeOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-6"
        >
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Alternative Considerations
          </h3>
          <div className="space-y-2">
            {intelligentQuote.alternativeOptions.map((alternative, index) => (
              <div key={index} className="text-sm text-amber-800">
                • {alternative}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      {data.selectedQuoteId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-green-900 mb-2">Package Selected</h3>
          <p className="text-sm text-green-800">
            You've selected the {quoteOptions.find(q => q.option.id === data.selectedQuoteId)?.option.title}. 
            Continue to provide your details and schedule installation.
          </p>
        </motion.div>
      )}
    </div>
  );
}