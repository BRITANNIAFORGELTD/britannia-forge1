// Real pricing data from CSV files for the intelligent quote engine
// Based on London Market Analysis and Professional Installation Standards

export interface BoilerData {
  make: string;
  model: string;
  boilerType: 'Combi' | 'System' | 'Regular';
  tier: 'Budget' | 'Mid-Range' | 'Premium';
  dwHKw: number;
  flowRateLpm: number;
  warrantyYears: number;
  efficiencyRating: string;
  supplyPrice: number; // in pence
}

export interface SundryItem {
  category: string;
  itemType: string;
  itemName: string;
  tier: 'Standard' | 'Premium';
  specification: string;
  priceLow: number;
  priceHigh: number;
  notes: string;
}

export interface ConversionScenario {
  scenarioId: number;
  propertyDescription: string;
  occupants: string;
  currentSystem: string;
  recommendation: string;
  recommendedSpecification: string;
}

// Real Boiler Data from Boilers_rows.csv
export const boilerDatabase: BoilerData[] = [
  // Alpha
  { make: 'Alpha', model: 'E-Tec Plus 28kW Combi', boilerType: 'Combi', tier: 'Budget', dwHKw: 28.3, flowRateLpm: 12.1, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 100000 },
  
  // Ariston
  { make: 'Ariston', model: 'Clas One 30kW Combi', boilerType: 'Combi', tier: 'Budget', dwHKw: 30, flowRateLpm: 12.5, warrantyYears: 8, efficiencyRating: 'A', supplyPrice: 92800 },
  { make: 'Ariston', model: 'E-Combi One 26kW Combi', boilerType: 'Combi', tier: 'Budget', dwHKw: 26, flowRateLpm: 10.8, warrantyYears: 2, efficiencyRating: 'A', supplyPrice: 64999 },
  { make: 'Ariston', model: 'E-Combi One 30kW Combi', boilerType: 'Combi', tier: 'Budget', dwHKw: 30, flowRateLpm: 12.5, warrantyYears: 2, efficiencyRating: 'A', supplyPrice: 70700 },
  
  // ATAG Premium
  { make: 'ATAG', model: 'iC 24kW Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 24, flowRateLpm: 10.1, warrantyYears: 14, efficiencyRating: 'A', supplyPrice: 130000 },
  { make: 'ATAG', model: 'iC 40kW Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 42, flowRateLpm: 16.2, warrantyYears: 14, efficiencyRating: 'A', supplyPrice: 148000 },
  { make: 'ATAG', model: 'iC Economiser Plus 27kW Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 27, flowRateLpm: 12.6, warrantyYears: 14, efficiencyRating: 'A', supplyPrice: 195000 },
  
  // Baxi Mid-Range
  { make: 'Baxi', model: '800 Combi 2 24kW', boilerType: 'Combi', tier: 'Mid-Range', dwHKw: 24, flowRateLpm: 10.2, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 98000 },
  { make: 'Baxi', model: '800 Combi 2 30kW', boilerType: 'Combi', tier: 'Mid-Range', dwHKw: 30, flowRateLpm: 12.2, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 136738 },
  { make: 'Baxi', model: '800 Combi 2 36kW', boilerType: 'Combi', tier: 'Mid-Range', dwHKw: 36, flowRateLpm: 15.0, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 120000 },
  { make: 'Baxi', model: '600 Combi 2 24kW', boilerType: 'Combi', tier: 'Mid-Range', dwHKw: 24, flowRateLpm: 10.2, warrantyYears: 7, efficiencyRating: 'A', supplyPrice: 78998 },
  { make: 'Baxi', model: '400 Combi 24kW', boilerType: 'Combi', tier: 'Budget', dwHKw: 24, flowRateLpm: 10.2, warrantyYears: 5, efficiencyRating: 'A', supplyPrice: 66250 },
  
  // Ideal
  { make: 'Ideal', model: 'Logic Max Combi2 C24', boilerType: 'Combi', tier: 'Mid-Range', dwHKw: 24.2, flowRateLpm: 9.9, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 134880 },
  { make: 'Ideal', model: 'Logic Max Combi2 C30', boilerType: 'Combi', tier: 'Mid-Range', dwHKw: 30.3, flowRateLpm: 12.4, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 138500 },
  { make: 'Ideal', model: 'Vogue Max Combi 26kW', boilerType: 'Combi', tier: 'Premium', dwHKw: 26, flowRateLpm: 10.6, warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 99609 },
  { make: 'Ideal', model: 'Vogue Max Combi 32kW', boilerType: 'Combi', tier: 'Premium', dwHKw: 32, flowRateLpm: 13.1, warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 159900 },
  
  // Vaillant Premium
  { make: 'Vaillant', model: 'ecoTEC plus 832 Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 32, flowRateLpm: 13.0, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 187560 },
  { make: 'Vaillant', model: 'ecoFIT pure 825 Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 25.2, flowRateLpm: 10.4, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 129500 },
  { make: 'Vaillant', model: 'ecoTEC pro 28 Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 28, flowRateLpm: 11.1, warrantyYears: 7, efficiencyRating: 'A', supplyPrice: 165000 },
  
  // Viessmann Premium
  { make: 'Viessmann', model: 'Vitodens 100-W 30kW Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 31.7, flowRateLpm: 13.4, warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 128991 },
  { make: 'Viessmann', model: 'Vitodens 050-W 25kW Combi', boilerType: 'Combi', tier: 'Premium', dwHKw: 25, flowRateLpm: 10.5, warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 87978 },
  
  // System Boilers
  { make: 'ATAG', model: 'iS 15kW System', boilerType: 'System', tier: 'Premium', dwHKw: 15, flowRateLpm: 0, warrantyYears: 18, efficiencyRating: 'A', supplyPrice: 127000 },
  { make: 'Ideal', model: 'Logic Max System2 S15', boilerType: 'System', tier: 'Mid-Range', dwHKw: 15, flowRateLpm: 0, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 148080 },
  { make: 'Ideal', model: 'Vogue Max System 32kW', boilerType: 'System', tier: 'Premium', dwHKw: 32, flowRateLpm: 0, warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 116130 },
  { make: 'Vaillant', model: 'ecoFIT pure 615 System', boilerType: 'System', tier: 'Premium', dwHKw: 15, flowRateLpm: 0, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 136599 },
  
  // Regular Boilers
  { make: 'ATAG', model: 'iR 15kW Regular', boilerType: 'Regular', tier: 'Premium', dwHKw: 15, flowRateLpm: 0, warrantyYears: 14, efficiencyRating: 'A', supplyPrice: 115000 },
  { make: 'Ideal', model: 'Logic Max Heat2 H12', boilerType: 'Regular', tier: 'Mid-Range', dwHKw: 12, flowRateLpm: 0, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 135240 }
];

// Real Sundries Data from heating_sundries_costs.csv
export const sundriesDatabase: SundryItem[] = [
  // System Protection
  { category: 'System Protection', itemType: 'Magnetic Filter', itemName: 'Adey MagnaClean Micro 2', tier: 'Standard', specification: '22mm', priceLow: 90, priceHigh: 115, notes: 'Industry standard, often bundled with new boilers.' },
  { category: 'System Protection', itemType: 'Magnetic Filter', itemName: 'Fernox TF1 Compact Filter', tier: 'Standard', specification: '22mm', priceLow: 95, priceHigh: 120, notes: 'Popular and effective alternative.' },
  { category: 'System Protection', itemType: 'Magnetic Filter', itemName: 'Adey MagnaClean Professional 3 Sense', tier: 'Premium', specification: '22mm', priceLow: 200, priceHigh: 250, notes: 'Wi-Fi connected for system monitoring.' },
  { category: 'System Protection', itemType: 'System Chemical', itemName: 'Sentinel X400 Sludge Remover', tier: 'Standard', specification: '1 Litre', priceLow: 18, priceHigh: 25, notes: 'For cleaning existing systems before flush.' },
  { category: 'System Protection', itemType: 'System Chemical', itemName: 'Sentinel X100 Inhibitor', tier: 'Standard', specification: '1 Litre', priceLow: 18, priceHigh: 25, notes: 'Market-leading corrosion inhibitor for post-clean.' },
  
  // Heating Controls
  { category: 'Heating Controls', itemType: 'Wireless Thermostat', itemName: 'Honeywell Home T4R', tier: 'Standard', specification: 'Programmable', priceLow: 130, priceHigh: 160, notes: 'Robust and popular fit and forget option.' },
  { category: 'Heating Controls', itemType: 'Wireless Thermostat', itemName: 'Drayton Digistat+ RF', tier: 'Standard', specification: 'Programmable', priceLow: 80, priceHigh: 100, notes: 'Simple, reliable, and cost-effective.' },
  { category: 'Heating Controls', itemType: 'Smart Thermostat', itemName: 'Google Nest Learning Thermostat', tier: 'Premium', specification: '3rd Gen', priceLow: 200, priceHigh: 220, notes: 'Learns user schedule to self-program.' },
  { category: 'Heating Controls', itemType: 'Smart Thermostat', itemName: 'Hive Active Heating', tier: 'Premium', specification: 'Smart Control', priceLow: 180, priceHigh: 200, notes: 'User-friendly, often offered by energy suppliers.' },
  
  // System Cleaning
  { category: 'System Cleaning', itemType: 'Service', itemName: 'Central Heating Power Flush', tier: 'Standard', specification: 'Up to 10 radiators', priceLow: 500, priceHigh: 750, notes: 'London carries a premium for labour services.' }
];

// Real Conversion Scenarios from Boiler_Conversion_Scenarios.csv
export const conversionScenarios: ConversionScenario[] = [
  { scenarioId: 1, propertyDescription: '1-bedroom flat, 1 bathroom (with shower)', occupants: '1-2 adults', currentSystem: 'Old system boiler with a 120L vented cylinder', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '24-28kW Combi, ~10-12 LPM flow rate' },
  { scenarioId: 2, propertyDescription: '2-bedroom terraced house, 1 bathroom', occupants: '2-3 people', currentSystem: 'Conventional boiler with tanks in loft and cylinder', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '30kW Combi, ~12-13 LPM flow rate' },
  { scenarioId: 3, propertyDescription: '2-bedroom apartment with no existing gas boiler', occupants: '2 adults', currentSystem: 'Electric storage heaters and standalone immersion cylinder', recommendation: 'New Gas Combi Boiler Installation', recommendedSpecification: '30kW Combi, ~12-13 LPM flow rate' },
  { scenarioId: 4, propertyDescription: '3-bedroom semi-detached house, 1 main bathroom', occupants: 'A family of 3-4', currentSystem: 'Old system boiler and a vented cylinder', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '32-35kW Combi, ~13-15 LPM flow rate' },
  { scenarioId: 5, propertyDescription: '3-bedroom house, 1 main bathroom (mixer), 1 ensuite (electric)', occupants: 'A family of 4', currentSystem: 'Conventional boiler with cylinder', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '35kW Combi, ~14-15 LPM flow rate' },
  { scenarioId: 8, propertyDescription: '3-bedroom house, 2 mixer showers', occupants: 'A family of 4', currentSystem: 'System boiler and vented cylinder', recommendation: 'System Boiler Upgrade Strongly Advised', recommendedSpecification: '24kW System Boiler with 170L unvented cylinder' },
  { scenarioId: 9, propertyDescription: '4-bedroom house, 1 bath, 1 ensuite', occupants: 'A family of 5 who value good water pressure', currentSystem: 'Old conventional boiler', recommendation: 'System Boiler Upgrade', recommendedSpecification: '28kW System Boiler with 210L unvented cylinder' },
  { scenarioId: 10, propertyDescription: '3-bedroom apartment, 1 luxury bathroom with rainfall shower', occupants: '2 adults', currentSystem: 'Electric immersion cylinder', recommendation: 'System Boiler Installation', recommendedSpecification: '24kW System Boiler with 150L-170L unvented cylinder' },
  { scenarioId: 13, propertyDescription: '4-Bed, 2-Bath, 1-Ensuite House', occupants: 'N/A', currentSystem: 'N/A', recommendation: 'System Boiler Upgrade', recommendedSpecification: '210L Cylinder' },
  { scenarioId: 14, propertyDescription: '5-Bed, 3-Bath Family Home', occupants: 'N/A', currentSystem: 'N/A', recommendation: 'System Boiler Upgrade', recommendedSpecification: '250L Cylinder' },
  { scenarioId: 15, propertyDescription: 'Property with 3+ Mixer Showers', occupants: 'N/A', currentSystem: 'N/A', recommendation: 'System Boiler Upgrade', recommendedSpecification: '300L Cylinder' },
  { scenarioId: 22, propertyDescription: 'Property where hot water is needed simultaneously in kitchen and bathrooms', occupants: 'N/A', currentSystem: 'N/A', recommendation: 'System Boiler Upgrade', recommendedSpecification: '210L+ Cylinder' },
  { scenarioId: 24, propertyDescription: 'Any property with more than two full bathrooms used regularly', occupants: 'N/A', currentSystem: 'N/A', recommendation: 'System Boiler Upgrade', recommendedSpecification: '210L+ Cylinder' }
];

// London Market Labour Costs
export const labourCosts = {
  combiInstallation: {
    simple: 120000, // £1,200 in pence
    medium: 150000, // £1,500 in pence  
    complex: 180000 // £1,800 in pence
  },
  systemInstallation: {
    simple: 150000, // £1,500 in pence
    medium: 180000, // £1,800 in pence
    complex: 220000 // £2,200 in pence
  },
  regularInstallation: {
    simple: 160000, // £1,600 in pence
    medium: 200000, // £2,000 in pence
    complex: 250000 // £2,500 in pence
  },
  flueExtension: {
    '1-2m': 15000, // £150 in pence
    '3-4m': 25000, // £250 in pence
    '5m+': 35000   // £350 in pence
  },
  condensatePump: 8000, // £80 in pence
  boilerRelocation: 80000, // £800 in pence
  parkingFees: {
    'Under 20m': 0,
    '20-50m': 2000, // £20 in pence
    'Over 50m': 4000 // £40 in pence
  }
};

// Cylinder Pricing (for System/Regular boilers)
export const cylinderPricing = {
  120: 45000, // £450 in pence
  150: 52000, // £520 in pence
  170: 58000, // £580 in pence
  210: 65000, // £650 in pence
  250: 75000, // £750 in pence
  300: 90000  // £900 in pence
};