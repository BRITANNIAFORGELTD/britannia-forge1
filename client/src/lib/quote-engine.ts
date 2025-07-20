// Phase 3: Intelligent Quote Engine with Real CSV Data Integration
// Completely rebuilt for optimal performance and authentic pricing

import { apiRequest } from './queryClient';
import { calculateDynamicIntelligentQuote } from './dynamic-quote-engine';
import type { QuoteData, IntelligentQuoteResult, QuoteOption } from '../types/quote';

// ==== PHASE 3 CORE FUNCTIONS ====

// Intelligent boiler type determination with professional analysis
function determineBoilerTypeIntelligent(params: {
  bedrooms: number;
  bathrooms: number;
  occupants: number;
  propertyType: string;
}): { recommendedType: string; reasoning: string } {
  const { bedrooms, bathrooms, occupants } = params;
  
  // Professional demand score calculation
  const demandScore = (bedrooms * 0.6) + (bathrooms * 1.2) + (occupants * 0.3);
  
  if (bathrooms >= 3) {
    return {
      recommendedType: 'System',
      reasoning: 'Multiple bathrooms require system boiler for adequate hot water supply'
    };
  }
  
  if (demandScore >= 2.0 && bathrooms >= 2) {
    return {
      recommendedType: 'System',
      reasoning: 'High demand scenario requires system boiler with cylinder for reliable performance'
    };
  }
  
  return {
    recommendedType: 'Combi',
    reasoning: 'Combi boiler provides efficient heating and hot water for this property size'
  };
}

// Calculate boiler size based on property characteristics
function calculateBoilerSize(bedrooms: number, bathrooms: number, occupants: string, propertyType: string): number {
  const occupantCount = parseInt(occupants);
  const baseSize = (bedrooms * 3) + (bathrooms * 6) + (occupantCount * 2);
  const propertyMultiplier = propertyType === 'Flat' ? 0.9 : 1.1;
  
  return Math.min(Math.max(Math.round(baseSize * propertyMultiplier), 24), 42);
}

// Phase 3: Main intelligent quote calculation function
export async function calculateIntelligentQuote(quoteData: QuoteData): Promise<IntelligentQuoteResult> {
  console.log('🚀 Starting intelligent quote calculation with dynamic pricing...');
  
  try {
    // Use the new dynamic quote engine as primary method
    const dynamicResult = await calculateDynamicIntelligentQuote(quoteData);
    console.log('✅ Dynamic quote calculation successful');
    return dynamicResult;
  } catch (error) {
    console.error('⚠️ Dynamic calculation failed, using fallback:', error);
    
    // Fallback to local calculation if API fails
    return await calculateFallbackQuote(quoteData);
  }
}

// Fallback calculation function
async function calculateFallbackQuote(quoteData: QuoteData): Promise<IntelligentQuoteResult> {
  console.log('📊 Using fallback quote calculation...');
  
  // Analyze property requirements
  const boilerAnalysis = determineBoilerTypeIntelligent({
    bedrooms: quoteData.bedrooms,
    bathrooms: quoteData.bathrooms,
    occupants: parseInt(quoteData.occupants || "2"),
    propertyType: quoteData.propertyType
  });
  
  const recommendedSize = calculateBoilerSize(
    quoteData.bedrooms, 
    quoteData.bathrooms, 
    quoteData.occupants || "2",
    quoteData.propertyType
  );
  
  // Create three tier options with fallback data
  const budgetOption = createQuoteOption('budget', boilerAnalysis, quoteData, recommendedSize);
  const standardOption = createQuoteOption('standard', boilerAnalysis, quoteData, recommendedSize);
  const premiumOption = createQuoteOption('premium', boilerAnalysis, quoteData, recommendedSize);
  
  // Generate alternative recommendations
  const alternatives = generateAlternativeRecommendations(
    quoteData.bedrooms,
    quoteData.bathrooms,
    parseInt(quoteData.occupants || "2"),
    boilerAnalysis
  );
  
  return {
    recommendedBoilerType: boilerAnalysis.recommendedType,
    recommendedBoilerSize: recommendedSize,
    reasonForRecommendation: boilerAnalysis.reasoning,
    budgetOption,
    standardOption,
    premiumOption,
    alternativeOptions: alternatives
  };
}

// Helper function to create quote options based on tier
function createQuoteOption(
  tier: 'budget' | 'standard' | 'premium', 
  boilerAnalysis: any, 
  quoteData: QuoteData,
  recommendedSize: number
): QuoteOption {
  
  // Get authentic boiler data based on type and tier
  const boilerData = getBoilerByTier(boilerAnalysis.recommendedType, tier);
  const labourCost = calculateLabourCost(boilerAnalysis.recommendedType, quoteData.propertyType);
  const sundries = calculateSundries(tier);
  
  // Calculate cylinder if needed
  const cylinderCapacity = (boilerAnalysis.recommendedType !== 'Combi') ? 
    calculateCylinderCapacity(quoteData.bedrooms, quoteData.bathrooms, parseInt(quoteData.occupants || "2")) : 0;
  
  // Calculate pricing
  const boilerPrice = boilerData.price;
  const totalLabour = labourCost;
  const totalSundries = sundries.total;
  const cylinderCost = cylinderCapacity > 0 ? 120000 : 0; // £1200 for cylinder
  
  const subtotal = boilerPrice + totalLabour + totalSundries + cylinderCost;
  const vatAmount = Math.round(subtotal * 0.2);
  const totalPrice = subtotal + vatAmount;
  
  // Create components array
  const components = [
    { 
      category: 'Boiler', 
      name: `${boilerData.make} ${boilerData.model}`, 
      description: `${boilerData.output}kW ${boilerAnalysis.recommendedType} boiler`,
      unitPrice: boilerPrice, 
      quantity: 1, 
      totalPrice: boilerPrice 
    },
    { 
      category: 'Labour', 
      name: 'Professional Installation', 
      description: 'Complete installation with system commissioning',
      unitPrice: totalLabour, 
      quantity: 1, 
      totalPrice: totalLabour 
    },
    ...sundries.items
  ];
  
  if (cylinderCost > 0) {
    components.push({
      category: 'Cylinder',
      name: `${cylinderCapacity}L Hot Water Cylinder`,
      description: 'Unvented cylinder with expansion vessel',
      unitPrice: cylinderCost,
      quantity: 1,
      totalPrice: cylinderCost
    });
  }
  
  return {
    id: `${tier}-${Date.now()}`,
    title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Package`,
    price: totalPrice / 100, // Convert to pounds
    features: getPackageFeatures(tier, boilerAnalysis.recommendedType),
    boilerSpec: {
      make: boilerData.make,
      model: boilerData.model,
      output: boilerData.output,
      efficiency: boilerData.efficiency,
      warranty: boilerData.warranty
    },
    breakdown: {
      boilerMake: boilerData.make,
      boilerModel: boilerData.model,
      boilerWarranty: boilerData.warranty,
      heatOutputKw: boilerData.output,
      waterFlowRate: boilerData.flowRate,
      cylinderCapacity,
      labourType: getLabourType(boilerAnalysis.recommendedType),
      labourLocation: 'London Area',
      recommendationReason: boilerAnalysis.reasoning,
      parkingNote: getarkingNote(quoteData.parkingSituation),
      components,
      subtotal,
      vatAmount,
      totalPrice
    }
  };
}

// Helper function to get boiler specifications by tier
function getBoilerByTier(boilerType: string, tier: 'budget' | 'standard' | 'premium') {
  const boilers = {
    Combi: {
      budget: { 
        make: 'Baxi', 
        model: 'EcoBlue Advance 30', 
        price: 180000, 
        warranty: '7',
        output: 30,
        efficiency: '92%',
        flowRate: 12.5
      },
      standard: { 
        make: 'Worcester Bosch', 
        model: 'Greenstar 8000 Style 30', 
        price: 220000, 
        warranty: '10',
        output: 30,
        efficiency: '94%',
        flowRate: 13.4
      },
      premium: { 
        make: 'Vaillant', 
        model: 'ecoTEC plus 832', 
        price: 280000, 
        warranty: '12',
        output: 32,
        efficiency: '94%',
        flowRate: 13.7
      }
    },
    System: {
      budget: { 
        make: 'Ideal', 
        model: 'Logic Max System 30', 
        price: 200000, 
        warranty: '7',
        output: 30,
        efficiency: '92%',
        flowRate: 0
      },
      standard: { 
        make: 'Worcester Bosch', 
        model: 'Greenstar Si Compact 30', 
        price: 250000, 
        warranty: '10',
        output: 30,
        efficiency: '93%',
        flowRate: 0
      },
      premium: { 
        make: 'Vaillant', 
        model: 'ecoTEC exclusive 832', 
        price: 320000, 
        warranty: '12',
        output: 32,
        efficiency: '94%',
        flowRate: 0
      }
    }
  };
  
  return boilers[boilerType as keyof typeof boilers]?.[tier] || boilers.Combi[tier];
}

// Helper function to calculate labour costs
function calculateLabourCost(boilerType: string, propertyType: string): number {
  const baseCosts = {
    Combi: 80000,     // £800
    System: 120000,   // £1200
    Regular: 100000   // £1000
  };
  
  const propertyMultiplier = propertyType === 'Flat' ? 0.9 : 1.0;
  return Math.round((baseCosts[boilerType as keyof typeof baseCosts] || baseCosts.Combi) * propertyMultiplier);
}

// Helper function to calculate sundries with authentic pricing
function calculateSundries(tier: 'budget' | 'standard' | 'premium') {
  const sundryOptions = {
    budget: [
      { 
        category: 'Compliance', 
        name: 'Chemical Flush', 
        description: 'BS 7593:2019 compliant system cleaning',
        unitPrice: 12000, 
        quantity: 1, 
        totalPrice: 12000 
      },
      { 
        category: 'Safety', 
        name: 'Magnetic Filter', 
        description: 'System protection filter',
        unitPrice: 15000, 
        quantity: 1, 
        totalPrice: 15000 
      }
    ],
    standard: [
      { 
        category: 'Compliance', 
        name: 'Chemical Flush', 
        description: 'BS 7593:2019 compliant system cleaning',
        unitPrice: 12000, 
        quantity: 1, 
        totalPrice: 12000 
      },
      { 
        category: 'Safety', 
        name: 'Magnetic Filter', 
        description: 'System protection filter',
        unitPrice: 15000, 
        quantity: 1, 
        totalPrice: 15000 
      },
      { 
        category: 'Control', 
        name: 'Smart Thermostat', 
        description: 'Boiler Plus compliant controls',
        unitPrice: 20000, 
        quantity: 1, 
        totalPrice: 20000 
      }
    ],
    premium: [
      { 
        category: 'Compliance', 
        name: 'Chemical Flush', 
        description: 'BS 7593:2019 compliant system cleaning',
        unitPrice: 12000, 
        quantity: 1, 
        totalPrice: 12000 
      },
      { 
        category: 'Safety', 
        name: 'Magnetic Filter', 
        description: 'System protection filter',
        unitPrice: 15000, 
        quantity: 1, 
        totalPrice: 15000 
      },
      { 
        category: 'Control', 
        name: 'Smart Thermostat', 
        description: 'Boiler Plus compliant controls',
        unitPrice: 20000, 
        quantity: 1, 
        totalPrice: 20000 
      },
      { 
        category: 'Efficiency', 
        name: 'TRV Set', 
        description: 'Thermostatic radiator valves',
        unitPrice: 8000, 
        quantity: 1, 
        totalPrice: 8000 
      },
      { 
        category: 'Safety', 
        name: 'Flue Kit', 
        description: 'Premium flue components',
        unitPrice: 10000, 
        quantity: 1, 
        totalPrice: 10000 
      }
    ]
  };
  
  const items = sundryOptions[tier];
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return { items, total };
}

// Calculate cylinder capacity for system/regular boilers
function calculateCylinderCapacity(bedrooms: number, bathrooms: number, occupants: number): number {
  // Professional sizing: 35-45 litres per person
  const baseCapacity = occupants * 40;
  const bedroomAdjustment = bedrooms * 15;
  const bathroomAdjustment = bathrooms * 25;
  
  const totalCapacity = baseCapacity + bedroomAdjustment + bathroomAdjustment;
  
  // Round to standard cylinder sizes
  if (totalCapacity <= 120) return 120;
  if (totalCapacity <= 150) return 150;
  if (totalCapacity <= 180) return 180;
  if (totalCapacity <= 210) return 210;
  if (totalCapacity <= 250) return 250;
  if (totalCapacity <= 300) return 300;
  return 350;
}

// Get package features based on tier
function getPackageFeatures(tier: 'budget' | 'standard' | 'premium', boilerType: string): string[] {
  const baseFeatures = [
    'Professional installation by Gas Safe engineer',
    'Full system commissioning and testing',
    'Chemical flush and system cleanse',
    'Magnetic filter for system protection',
    `${tier.charAt(0).toUpperCase() + tier.slice(1)} quality ${boilerType.toLowerCase()} boiler`
  ];
  
  if (tier === 'standard' || tier === 'premium') {
    baseFeatures.push('Smart thermostat (Boiler Plus compliant)');
  }
  
  if (tier === 'premium') {
    baseFeatures.push('TRV set for all radiators');
    baseFeatures.push('Premium flue kit');
    baseFeatures.push('Extended warranty coverage');
  }
  
  return baseFeatures;
}

// Get labour type description
function getLabourType(boilerType: string): string {
  const labourTypes = {
    Combi: 'Combi boiler replacement with system upgrade',
    System: 'System boiler installation with new cylinder',
    Regular: 'Conventional boiler replacement'
  };
  
  return labourTypes[boilerType as keyof typeof labourTypes] || labourTypes.Combi;
}

// Generate parking notes
function getarkingNote(parkingSituation?: string): string | undefined {
  if (parkingSituation?.includes('paid') || parkingSituation?.includes('Paid')) {
    return 'Parking arrangements: Customer to provide permit or reimburse parking costs (typically £10-20/day)';
  }
  return undefined;
}

// Generate alternative recommendations
function generateAlternativeRecommendations(
  bedrooms: number, 
  bathrooms: number, 
  occupants: number, 
  boilerAnalysis: any
): string[] {
  const alternatives: string[] = [];
  
  // Alternative boiler type suggestions
  if (boilerAnalysis.recommendedType === 'Combi' && bathrooms >= 2) {
    alternatives.push('Consider a system boiler with cylinder for better performance with multiple bathrooms');
  }
  
  if (boilerAnalysis.recommendedType === 'System' && bathrooms === 1 && occupants <= 2) {
    alternatives.push('A high-output combi boiler could be suitable if hot water demand is low');
  }
  
  // Efficiency recommendations
  alternatives.push('Upgrade to premium efficiency rating for long-term energy savings');
  
  return alternatives;
}

// Export functions for use in other modules
export { calculateBoilerSize, determineBoilerTypeIntelligent };

// Legacy compatibility
export async function saveQuote(quoteData: QuoteData) {
  const response = await apiRequest("POST", "/api/quotes", quoteData);
  return response.json();
}