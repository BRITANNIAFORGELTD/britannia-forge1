// Enhanced Intelligent Quote Engine with Real UK Market Data
// Comprehensive boiler installation quotation system using real pricing from CSV data

import { boilerDatabase, sundriesDatabase, conversionScenarios, labourCosts, cylinderPricing, type BoilerData, type SundryItem, type ConversionScenario } from './pricing-data';

interface QuoteData {
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  occupants: string;
  postcode: string;
  currentBoiler: string;
  flueLocation: string;
  flueExtension: string;
  drainNearby: string;
  moveBoiler: string;
  parkingSituation: string;
  parkingDistance: string;
  floorLevel?: string;
  hasLift?: boolean;
}

interface IntelligentQuoteResult {
  recommendedBoilerType: 'Combi' | 'System' | 'Regular';
  recommendedBoilerSize: number;
  cylinderSize?: number;
  boilerOptions: {
    budget: BoilerRecommendation;
    midRange: BoilerRecommendation;
    premium: BoilerRecommendation;
  };
  pricingBreakdown: PricingBreakdown;
  professionalExplanation: string;
  installationComplexity: 'Simple' | 'Medium' | 'Complex';
  scenarioMatch?: ConversionScenario;
}

interface BoilerRecommendation {
  boiler: BoilerData;
  totalPrice: number;
  warrantyYears: number;
  isRecommended: boolean;
}

interface PricingBreakdown {
  boilerCost: number;
  cylinderCost?: number;
  labourCost: number;
  flueExtensionCost: number;
  sundries: {
    magneticFilter: number;
    powerFlush: number;
    thermostat: number;
    chemicals: number;
  };
  parkingCost: number;
  condensatePumpCost: number;
  boilerRelocationCost: number;
  vatAmount: number;
  totalExcVat: number;
  totalIncVat: number;
}

// Enhanced boiler type determination using real conversion scenarios
function determineBoilerType(bedrooms: string, bathrooms: string, occupants: string, currentBoiler: string, propertyType: string): 'Combi' | 'System' | 'Regular' {
  const bedroomCount = parseInt(bedrooms.replace(/\D/g, '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace(/\D/g, '')) || 1;
  const occupantCount = parseInt(occupants.replace(/\D/g, '')) || 2;
  
  // Critical scenario matching from real UK installation data
  
  // MANDATORY System Boiler scenarios:
  if (bathroomCount >= 3) return 'System'; // Scenarios 15, 24
  if (bedroomCount >= 5) return 'System'; // Scenario 14  
  if (bedroomCount >= 4 && bathroomCount >= 2) return 'System'; // Scenario 13
  if (bedroomCount === 3 && bathroomCount === 2 && occupantCount >= 4) return 'System'; // Scenario 8
  
  // Luxury scenarios requiring System boiler
  if (bedroomCount === 3 && bathroomCount === 1 && propertyType === 'Flat') return 'System'; // Scenario 10
  
  // Regular boiler preference (existing setup)
  if (currentBoiler.toLowerCase().includes('regular') || currentBoiler.toLowerCase().includes('conventional')) {
    return 'Regular';
  }
  
  // All other scenarios default to Combi (Scenarios 1-5)
  return 'Combi';
}

// Enhanced boiler sizing using real scenario data
function calculateBoilerSize(bedrooms: string, bathrooms: string, occupants: string, propertyType: string): number {
  const bedroomCount = parseInt(bedrooms.replace(/\D/g, '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace(/\D/g, '')) || 1;
  const occupantCount = parseInt(occupants.replace(/\D/g, '')) || 2;
  
  // Real scenario-based sizing from UK installations
  if (bedroomCount === 1 && bathroomCount === 1) return 24; // Scenario 1
  if (bedroomCount === 2 && bathroomCount === 1) return 30; // Scenarios 2, 3
  if (bedroomCount === 3 && bathroomCount === 1) return 32; // Scenario 4
  if (bedroomCount === 3 && bathroomCount >= 2) return 35; // Scenario 5
  if (bedroomCount === 4) return 36; // 4-bed properties
  if (bedroomCount >= 5 || bathroomCount >= 3) return 42; // Large properties
  
  // Fallback calculation
  const heatLoad = (bedroomCount * 2.5) + (bathroomCount * 3.5) + (occupantCount * 1.5);
  return Math.min(42, Math.max(24, Math.ceil(heatLoad / 2) * 2));
}

// Enhanced cylinder sizing using real scenario data
function calculateCylinderSize(bedrooms: string, bathrooms: string, occupants: string): number {
  const bedroomCount = parseInt(bedrooms.replace(/\D/g, '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace(/\D/g, '')) || 1;
  const occupantCount = parseInt(occupants.replace(/\D/g, '')) || 2;
  
  // Real scenario-based cylinder sizing
  if (bedroomCount >= 5 || bathroomCount >= 3) return 250; // Scenario 14
  if (bedroomCount === 4 && bathroomCount >= 2) return 210; // Scenario 13
  if (bathroomCount >= 3) return 300; // High-demand scenarios
  if (bedroomCount === 3 && bathroomCount === 2) return 170; // Scenario 8
  if (bedroomCount === 3 && bathroomCount === 1) return 150; // Scenarios 10, 11
  if (bedroomCount === 2) return 150; // Scenario 12
  
  // Standard calculation
  const capacity = (occupantCount * 35) + (bathroomCount * 25) + (bedroomCount * 15);
  if (capacity <= 120) return 120;
  if (capacity <= 150) return 150;
  if (capacity <= 170) return 170;
  if (capacity <= 210) return 210;
  if (capacity <= 250) return 250;
  return 300;
}

// Find matching conversion scenario
function findMatchingScenario(bedrooms: string, bathrooms: string, occupants: string, propertyType: string): ConversionScenario | undefined {
  const bedroomCount = parseInt(bedrooms.replace(/\D/g, '')) || 1;
  const bathroomCount = parseInt(bathrooms.replace(/\D/g, '')) || 1;
  
  // Direct scenario matching
  if (bedroomCount === 1 && bathroomCount === 1) return conversionScenarios.find(s => s.scenarioId === 1);
  if (bedroomCount === 2 && bathroomCount === 1) return conversionScenarios.find(s => s.scenarioId === 2);
  if (bedroomCount === 3 && bathroomCount === 1) return conversionScenarios.find(s => s.scenarioId === 4);
  if (bedroomCount === 3 && bathroomCount === 2) return conversionScenarios.find(s => s.scenarioId === 8);
  if (bedroomCount === 4 && bathroomCount >= 2) return conversionScenarios.find(s => s.scenarioId === 13);
  if (bedroomCount >= 5) return conversionScenarios.find(s => s.scenarioId === 14);
  if (bathroomCount >= 3) return conversionScenarios.find(s => s.scenarioId === 15);
  
  return undefined;
}

// Calculate installation complexity
function calculateInstallationComplexity(quoteData: QuoteData): 'Simple' | 'Medium' | 'Complex' {
  let complexityScore = 0;
  
  // Boiler relocation adds complexity
  if (quoteData.moveBoiler === 'Yes') complexityScore += 2;
  
  // Flue extension adds complexity
  const flueExtension = parseFloat(quoteData.flueExtension);
  if (flueExtension > 0) complexityScore += 1;
  if (flueExtension > 3) complexityScore += 1;
  
  // High floor adds complexity
  if (quoteData.floorLevel === '3+' && !quoteData.hasLift) complexityScore += 2;
  if (quoteData.floorLevel === '1-2' && !quoteData.hasLift) complexityScore += 1;
  
  // System/Regular boilers are more complex
  const boilerType = determineBoilerType(quoteData.bedrooms, quoteData.bathrooms, quoteData.occupants, quoteData.currentBoiler, quoteData.propertyType);
  if (boilerType === 'System') complexityScore += 1;
  if (boilerType === 'Regular') complexityScore += 2;
  
  // No drain nearby adds complexity
  if (quoteData.drainNearby === 'No') complexityScore += 1;
  
  if (complexityScore <= 2) return 'Simple';
  if (complexityScore <= 4) return 'Medium';
  return 'Complex';
}

// Find best boiler options by tier
function findBoilerOptions(boilerType: 'Combi' | 'System' | 'Regular', targetSize: number): {
  budget: BoilerData;
  midRange: BoilerData;
  premium: BoilerData;
} {
  const typeBoilers = boilerDatabase.filter(b => b.boilerType === boilerType);
  
  // Find boilers close to target size
  const suitableBoilers = typeBoilers.filter(b => 
    Math.abs(b.dwHKw - targetSize) <= 6 // Allow 6kW variance
  );
  
  // Sort by price within each tier
  const budgetBoilers = suitableBoilers.filter(b => b.tier === 'Budget').sort((a, b) => a.supplyPrice - b.supplyPrice);
  const midRangeBoilers = suitableBoilers.filter(b => b.tier === 'Mid-Range').sort((a, b) => a.supplyPrice - b.supplyPrice);
  const premiumBoilers = suitableBoilers.filter(b => b.tier === 'Premium').sort((a, b) => a.supplyPrice - b.supplyPrice);
  
  // Fallback to closest size if no exact match
  const fallbackBoilers = typeBoilers.sort((a, b) => Math.abs(a.dwHKw - targetSize) - Math.abs(b.dwHKw - targetSize));
  
  return {
    budget: budgetBoilers[0] || fallbackBoilers.find(b => b.tier === 'Budget') || fallbackBoilers[0],
    midRange: midRangeBoilers[0] || fallbackBoilers.find(b => b.tier === 'Mid-Range') || fallbackBoilers[0],
    premium: premiumBoilers[0] || fallbackBoilers.find(b => b.tier === 'Premium') || fallbackBoilers[0]
  };
}

// Calculate comprehensive pricing breakdown
function calculatePricingBreakdown(quoteData: QuoteData, boiler: BoilerData, cylinderSize?: number, complexity: 'Simple' | 'Medium' | 'Complex' = 'Medium'): PricingBreakdown {
  const boilerType = determineBoilerType(quoteData.bedrooms, quoteData.bathrooms, quoteData.occupants, quoteData.currentBoiler, quoteData.propertyType);
  
  // Boiler cost (convert from pence to pounds)
  const boilerCost = Math.round(boiler.supplyPrice / 100);
  
  // Cylinder cost
  let cylinderCost = 0;
  if (cylinderSize && (boilerType === 'System' || boilerType === 'Regular')) {
    cylinderCost = Math.round((cylinderPricing[cylinderSize as keyof typeof cylinderPricing] || 65000) / 100);
  }
  
  // Labour cost based on boiler type and complexity
  let labourCost = 0;
  if (boilerType === 'Combi') {
    labourCost = Math.round(labourCosts.combiInstallation[complexity.toLowerCase() as keyof typeof labourCosts.combiInstallation] / 100);
  } else if (boilerType === 'System') {
    labourCost = Math.round(labourCosts.systemInstallation[complexity.toLowerCase() as keyof typeof labourCosts.systemInstallation] / 100);
  } else {
    labourCost = Math.round(labourCosts.regularInstallation[complexity.toLowerCase() as keyof typeof labourCosts.regularInstallation] / 100);
  }
  
  // Flue extension cost
  let flueExtensionCost = 0;
  const flueExtension = parseFloat(quoteData.flueExtension);
  if (flueExtension > 0) {
    if (flueExtension <= 2) flueExtensionCost = 150;
    else if (flueExtension <= 4) flueExtensionCost = 250;
    else flueExtensionCost = 350;
  }
  
  // Parking cost
  let parkingCost = 0;
  if (quoteData.parkingSituation === 'paid') {
    const distance = parseInt(quoteData.parkingDistance);
    if (distance > 5 && distance <= 20) parkingCost = 20;
    else if (distance > 20) parkingCost = 40;
  }
  
  // Condensate pump cost
  let condensatePumpCost = 0;
  if (quoteData.drainNearby === 'No') {
    condensatePumpCost = Math.round(labourCosts.condensatePump / 100);
  }
  
  // Boiler relocation cost
  let boilerRelocationCost = 0;
  if (quoteData.moveBoiler === 'Yes') {
    boilerRelocationCost = Math.round(labourCosts.boilerRelocation / 100);
  }
  
  // Sundries using real pricing data
  const sundries = {
    magneticFilter: 110, // Average of Adey MagnaClean Micro 2
    powerFlush: 625,     // London average for power flush
    thermostat: 145,     // Average wireless thermostat
    chemicals: 22        // System chemicals average
  };
  
  // Calculate totals
  const totalExcVat = boilerCost + cylinderCost + labourCost + flueExtensionCost + 
                     sundries.magneticFilter + sundries.powerFlush + sundries.thermostat + 
                     sundries.chemicals + parkingCost + condensatePumpCost + boilerRelocationCost;
                     
  const vatAmount = Math.round(totalExcVat * 0.2);
  const totalIncVat = totalExcVat + vatAmount;
  
  return {
    boilerCost,
    cylinderCost: cylinderCost > 0 ? cylinderCost : undefined,
    labourCost,
    flueExtensionCost,
    sundries,
    parkingCost,
    condensatePumpCost,
    boilerRelocationCost,
    vatAmount,
    totalExcVat,
    totalIncVat
  };
}

// Generate professional explanation
function generateExplanation(quoteData: QuoteData, result: IntelligentQuoteResult): string {
  const bedroomCount = parseInt(quoteData.bedrooms.replace(/\D/g, '')) || 1;
  const bathroomCount = parseInt(quoteData.bathrooms.replace(/\D/g, '')) || 1;
  const occupantCount = parseInt(quoteData.occupants.replace(/\D/g, '')) || 2;
  
  let explanation = `Based on your ${bedroomCount}-bedroom ${quoteData.propertyType.toLowerCase()} with ${bathroomCount} bathroom${bathroomCount > 1 ? 's' : ''} and ${occupantCount} occupant${occupantCount > 1 ? 's' : ''}, `;
  
  if (result.recommendedBoilerType === 'Combi') {
    explanation += `we recommend a ${result.recommendedBoilerSize}kW Combi boiler. This provides excellent efficiency for your property size and eliminates the need for a separate hot water cylinder, saving space and reducing installation complexity.`;
  } else if (result.recommendedBoilerType === 'System') {
    explanation += `we recommend a ${result.recommendedBoilerSize}kW System boiler with a ${result.cylinderSize}L unvented cylinder. This configuration is essential for properties with ${bathroomCount >= 3 ? 'multiple bathrooms' : 'high hot water demand'}, ensuring adequate hot water pressure and capacity for simultaneous usage.`;
  } else {
    explanation += `we recommend a ${result.recommendedBoilerSize}kW Regular boiler with a ${result.cylinderSize}L cylinder. This maintains your existing system configuration while providing modern efficiency and reliability.`;
  }
  
  if (result.scenarioMatch) {
    explanation += ` This recommendation is validated against similar UK installations in our database.`;
  }
  
  // Add complexity notes
  if (result.installationComplexity === 'Complex') {
    explanation += ` Please note: This installation requires additional complexity due to `;
    const complexityFactors = [];
    if (quoteData.moveBoiler === 'Yes') complexityFactors.push('boiler relocation');
    if (parseFloat(quoteData.flueExtension) > 3) complexityFactors.push('extended flue work');
    if (quoteData.drainNearby === 'No') complexityFactors.push('condensate pump installation');
    if (quoteData.floorLevel === '3+' && !quoteData.hasLift) complexityFactors.push('high floor access');
    
    explanation += complexityFactors.join(', ') + '.';
  }
  
  return explanation;
}

// Main intelligent quote generation function
export async function generateIntelligentQuote(quoteData: QuoteData): Promise<IntelligentQuoteResult> {
  try {
    // Determine optimal boiler type and size
    const recommendedBoilerType = determineBoilerType(
      quoteData.bedrooms, 
      quoteData.bathrooms, 
      quoteData.occupants, 
      quoteData.currentBoiler, 
      quoteData.propertyType
    );
    
    const recommendedBoilerSize = calculateBoilerSize(
      quoteData.bedrooms,
      quoteData.bathrooms, 
      quoteData.occupants,
      quoteData.propertyType
    );
    
    // Calculate cylinder size if needed
    let cylinderSize: number | undefined;
    if (recommendedBoilerType === 'System' || recommendedBoilerType === 'Regular') {
      cylinderSize = calculateCylinderSize(quoteData.bedrooms, quoteData.bathrooms, quoteData.occupants);
    }
    
    // Find matching scenario
    const scenarioMatch = findMatchingScenario(quoteData.bedrooms, quoteData.bathrooms, quoteData.occupants, quoteData.propertyType);
    
    // Calculate installation complexity
    const installationComplexity = calculateInstallationComplexity(quoteData);
    
    // Find boiler options for each tier
    const boilerOptions = findBoilerOptions(recommendedBoilerType, recommendedBoilerSize);
    
    // Generate pricing for each tier
    const budgetPricing = calculatePricingBreakdown(quoteData, boilerOptions.budget, cylinderSize, installationComplexity);
    const midRangePricing = calculatePricingBreakdown(quoteData, boilerOptions.midRange, cylinderSize, installationComplexity);
    const premiumPricing = calculatePricingBreakdown(quoteData, boilerOptions.premium, cylinderSize, installationComplexity);
    
    const result: IntelligentQuoteResult = {
      recommendedBoilerType,
      recommendedBoilerSize,
      cylinderSize,
      boilerOptions: {
        budget: {
          boiler: boilerOptions.budget,
          totalPrice: budgetPricing.totalIncVat,
          warrantyYears: boilerOptions.budget.warrantyYears,
          isRecommended: false
        },
        midRange: {
          boiler: boilerOptions.midRange,
          totalPrice: midRangePricing.totalIncVat,
          warrantyYears: boilerOptions.midRange.warrantyYears,
          isRecommended: true // Mid-range is typically recommended
        },
        premium: {
          boiler: boilerOptions.premium,
          totalPrice: premiumPricing.totalIncVat,
          warrantyYears: boilerOptions.premium.warrantyYears,
          isRecommended: false
        }
      },
      pricingBreakdown: midRangePricing, // Use mid-range as default breakdown
      installationComplexity,
      scenarioMatch
    } as IntelligentQuoteResult;
    
    // Generate professional explanation
    result.professionalExplanation = generateExplanation(quoteData, result);
    
    return result;
    
  } catch (error) {
    console.error('Error generating intelligent quote:', error);
    throw new Error('Unable to generate quote at this time. Please try again.');
  }
}