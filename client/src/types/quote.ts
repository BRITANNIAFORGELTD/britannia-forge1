export interface QuoteData {
  // Step 1: Property Details (Phase 2 Enhanced)
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  occupants: string;
  postcode: string;
  currentBoiler: string; // 'Combi', 'System', 'Regular', 'Electric', 'Unknown'
  cylinderLocation?: string;
  flueLocation: string;
  flueExtension: string;
  drainNearby: string; // 'Yes' or 'No'
  moveBoiler: string; // 'Yes' or 'No'
  hasFusedSwitch?: boolean; // Phase 2 mandatory field
  parkingSituation: string;
  parkingDistance: string;
  floorLevel?: string;
  hasLift?: boolean;
  
  // Step 2: Photos (Phase 2 Enhanced - 6 mandatory photos)
  photos: {
    boilerCloseup: string;
    boilerDistant: string;
    pipework: string;
    flue: string;
    gasMeter: string;
    electricalMeter: string;  // NEW Phase 2
    waterStopcock: string;    // NEW Phase 2
    optional1?: string;
    optional2?: string;
    optional3?: string;
    optional4?: string;
  };
  
  // Step 3: Quote Selection (Phase 3 Enhanced)
  selectedPackage?: string;
  selectedQuoteId?: string;
  thermostatUpgrade?: string;
  
  // Step 4: Customer Details (Phase 2 Enhanced)
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  acceptTerms?: boolean;
  smsUpdates?: boolean;
  emailUpdates?: boolean;
  preferredDate?: string;
  
  // Step 5: Payment (Deferred to Final Phase)
  paymentOption?: string;
  paymentAmount?: number;
  agreedToTerms?: boolean;
  
  // Phase 3: Intelligent Quote Engine Results (Enhanced)
  intelligentQuote?: IntelligentQuoteResult;
  
  // Special handling for Unknown boiler type
  requiresVideoCall?: boolean;
  videoCallScheduled?: boolean;
  additionalPhotosRequired?: boolean;
}

// ==== PHASE 3: INTELLIGENT QUOTE ENGINE TYPES ====

export interface BoilerProduct {
  make: string;
  model: string;
  boiler_type: 'Combi' | 'System' | 'Regular';
  tier: 'Budget' | 'Mid-Range' | 'Premium';
  dwh_kw: number;
  flow_rate_lpm: number;
  warranty_years: number;
  efficiency_rating: string;
  supply_price: number;
}

export interface DetailedPriceBreakdown {
  boilerPrice: number;
  boilerMake: string;
  boilerModel: string;
  boilerWarranty: number;
  cylinderPrice: number;
  cylinderCapacity: number;
  
  labourPrice: number;
  labourType: string;
  labourLocation: string;
  
  magneticFilterPrice: number;
  powerFlushPrice: number;
  thermostatPrice: number;
  thermostatType: string;
  
  flueExtensionPrice: number;
  flueExtensionLength: string;
  condensatePumpPrice: number;
  fusedSpurPrice: number;
  decommissioningPrice: number;
  
  subtotal: number;
  vatAmount: number;
  totalPrice: number;
  
  waterFlowRate: number;
  heatOutputKw: number;
  
  parkingNote: string;
  recommendationReason: string;
  
  components: Array<{
    category: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    mandatory: boolean;
  }>;
}

export interface QuoteOption {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  features: string[];
  boilerSpec: {
    make: string;
    model: string;
    outputKw: number;
    flowRate: number;
    warrantyYears: number;
    efficiency: string;
  };
  breakdown?: DetailedPriceBreakdown;
}

export interface IntelligentQuoteResult {
  recommendedBoilerType: 'Combi' | 'System' | 'Regular';
  recommendedSize: number;
  demandScore: number;
  combiViable: boolean;
  reasonForRecommendation: string;
  userPreferenceOverride: boolean;
  
  budgetOption: QuoteOption & { breakdown: DetailedPriceBreakdown };
  standardOption: QuoteOption & { breakdown: DetailedPriceBreakdown };
  premiumOption: QuoteOption & { breakdown: DetailedPriceBreakdown };
  
  cylinderRequired: boolean;
  cylinderCapacity: number;
  alternativeOptions: string[];
}

export interface PhotoRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  condition?: string;
  uploaded?: boolean;
}
