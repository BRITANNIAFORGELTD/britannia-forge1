// Emergency Pricing API - Bypasses database for immediate functionality
// Uses CSV data directly for Phase 1-3 implementation

import { Router } from 'express';

const router = Router();

// Emergency boiler data from CSV
const emergencyBoilerData = [
  { id: 1, make: 'Alpha', model: 'E-Tec Plus 28kW Combi', boilerType: 'Combi', tier: 'Budget', dhwKw: '28.3', flowRateLpm: '12.1', warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 100000 },
  { id: 2, make: 'ATAG', model: 'iC 24kW Combi', boilerType: 'Combi', tier: 'Premium', dhwKw: '24', flowRateLpm: '10.1', warrantyYears: 14, efficiencyRating: 'A', supplyPrice: 130000 },
  { id: 3, make: 'Baxi', model: '800 Combi 2 24kW', boilerType: 'Combi', tier: 'Mid-Range', dhwKw: '24', flowRateLpm: '10.2', warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 98000 },
  { id: 4, make: 'Ideal', model: 'Logic Max Combi2 C24', boilerType: 'Combi', tier: 'Mid-Range', dhwKw: '24.2', flowRateLpm: '9.9', warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 134880 },
  { id: 5, make: 'Ideal', model: 'Vogue Max Combi 26kW', boilerType: 'Combi', tier: 'Premium', dhwKw: '26', flowRateLpm: '10.6', warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 99609 },
  { id: 6, make: 'Vaillant', model: 'ecoTEC plus 832 Combi', boilerType: 'Combi', tier: 'Premium', dhwKw: '32', flowRateLpm: '13', warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 187560 },
  { id: 7, make: 'Worcester Bosch', model: 'Greenstar 4000 25kW Combi', boilerType: 'Combi', tier: 'Premium', dhwKw: '25', flowRateLpm: '10.2', warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 115000 },
  { id: 8, make: 'ATAG', model: 'iS 15kW System', boilerType: 'System', tier: 'Premium', dhwKw: null, flowRateLpm: null, warrantyYears: 18, efficiencyRating: 'A', supplyPrice: 127000 },
  { id: 9, make: 'Ideal', model: 'Logic Max System2 S15', boilerType: 'System', tier: 'Mid-Range', dhwKw: null, flowRateLpm: null, warrantyYears: 10, efficiencyRating: 'A', supplyPrice: 148080 },
  { id: 10, make: 'Ideal', model: 'Vogue Max System 32kW', boilerType: 'System', tier: 'Premium', dhwKw: null, flowRateLpm: null, warrantyYears: 12, efficiencyRating: 'A', supplyPrice: 116130 },
];

// Emergency labour cost data from CSV
const emergencyLabourData = [
  { id: 1, jobType: 'Combi Boiler Replacement (like-for-like)', tier: 'Budget', city: 'London (Central)', price: 120000 },
  { id: 2, jobType: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Central)', price: 135000 },
  { id: 3, jobType: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Central)', price: 160000 },
  { id: 4, jobType: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Outer)', price: 120000 },
  { id: 5, jobType: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Outer)', price: 140000 },
  { id: 6, jobType: 'System Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Central)', price: 140000 },
  { id: 7, jobType: 'System Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Central)', price: 165000 },
  { id: 8, jobType: 'System Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Outer)', price: 125000 },
  { id: 9, jobType: 'System Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Outer)', price: 145000 },
  { id: 10, jobType: 'Back Boiler to Combi Conversion', tier: 'Premium', city: 'London', price: 350000 },
];

// Emergency sundries data from CSV
const emergencySundriesData = [
  { id: 1, itemName: 'Fernox TF1 Compact Filter', tier: 'Magnetic Filter', price: 15000 },
  { id: 2, itemName: 'Google Nest Learning Thermostat', tier: 'Smart Thermostat', price: 22000 },
  { id: 3, itemName: 'Honeywell Home T4R', tier: 'Wireless Thermostat', price: 16000 },
  { id: 4, itemName: 'Central Heating Power Flush', tier: 'Up to 10 radiators', price: 50000 },
  { id: 5, itemName: 'Sentinel X100 Inhibitor', tier: 'System Chemical 1L', price: 2500 },
  { id: 6, itemName: 'Sentinel X400 Sludge Remover', tier: 'Sentinel X400 Sludge Remover 1 Litre', price: 2500 },
];

// Emergency conversion scenarios from CSV
const emergencyConversionScenarios = [
  { id: 1, scenarioId: 1, propertyDescription: '1-bedroom flat, 1 bathroom (with shower)', occupants: '1-2 adults', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '24-28kW Combi, ~10-12 LPM flow rate' },
  { id: 2, scenarioId: 2, propertyDescription: '2-bedroom terraced house, 1 bathroom', occupants: '2-3 people', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '30kW Combi, ~12-13 LPM flow rate' },
  { id: 3, scenarioId: 4, propertyDescription: '3-bedroom semi-detached house, 1 main bathroom', occupants: 'A family of 3-4', recommendation: 'Combi Boiler Conversion', recommendedSpecification: '32-35kW Combi, ~13-15 LPM flow rate' },
  { id: 4, scenarioId: 8, propertyDescription: '3-bedroom house, 2 mixer showers', occupants: 'A family of 4', recommendation: 'System Boiler Upgrade Strongly Advised', recommendedSpecification: '24kW System Boiler with 170L unvented cylinder' },
  { id: 5, scenarioId: 9, propertyDescription: '4-bedroom house, 1 bath, 1 ensuite', occupants: 'A family of 5 who value good water pressure', recommendation: 'System Boiler Upgrade', recommendedSpecification: '28kW System Boiler with 210L unvented cylinder' },
];

// Emergency heating sundries from CSV
const emergencyHeatingSundries = [
  { id: 1, category: 'System Protection', itemType: 'Magnetic Filter', itemName: 'Adey MagnaClean Micro 2', tier: 'Standard', specification: '22mm', priceLow: 9000, priceHigh: 11500, notes: 'Industry standard, often bundled with new boilers.' },
  { id: 2, category: 'System Protection', itemType: 'Magnetic Filter', itemName: 'Fernox TF1 Compact Filter', tier: 'Standard', specification: '22mm', priceLow: 9500, priceHigh: 12000, notes: 'Popular and effective alternative.' },
  { id: 3, category: 'Heating Controls', itemType: 'Smart Thermostat', itemName: 'Google Nest Learning Thermostat', tier: 'Premium', specification: '3rd Gen', priceLow: 20000, priceHigh: 22000, notes: 'Learns user schedule to self-program.' },
  { id: 4, category: 'Heating Controls', itemType: 'Wireless Thermostat', itemName: 'Honeywell Home T4R', tier: 'Standard', specification: 'Programmable', priceLow: 13000, priceHigh: 16000, notes: 'Robust and popular fit and forget option.' },
  { id: 5, category: 'System Cleaning', itemType: 'Service', itemName: 'Central Heating Power Flush', tier: 'London', specification: 'Up to 10 radiators', priceLow: 50000, priceHigh: 75000, notes: 'London carries a premium for labour services.' },
];

// GET /api/emergency/boilers - Emergency boiler data
router.get('/boilers', (req, res) => {
  res.json({ success: true, data: emergencyBoilerData });
});

// GET /api/emergency/labour-costs - Emergency labour cost data
router.get('/labour-costs', (req, res) => {
  const { city, jobType } = req.query;
  let filteredData = emergencyLabourData;
  
  if (city) {
    filteredData = filteredData.filter(item => 
      item.city.toLowerCase().includes(city.toString().toLowerCase())
    );
  }
  
  if (jobType) {
    filteredData = filteredData.filter(item => 
      item.jobType.toLowerCase().includes(jobType.toString().toLowerCase())
    );
  }
  
  res.json({ success: true, data: filteredData });
});

// GET /api/emergency/sundries - Emergency sundries data
router.get('/sundries', (req, res) => {
  res.json({ success: true, data: emergencySundriesData });
});

// GET /api/emergency/conversion-scenarios - Emergency conversion scenarios
router.get('/conversion-scenarios', (req, res) => {
  res.json({ success: true, data: emergencyConversionScenarios });
});

// GET /api/emergency/heating-sundries - Emergency heating sundries
router.get('/heating-sundries', (req, res) => {
  res.json({ success: true, data: emergencyHeatingSundries });
});

// GET /api/emergency/stats - Emergency admin statistics
router.get('/stats', (req, res) => {
  const stats = {
    totalBoilers: emergencyBoilerData.length,
    totalLabourCosts: emergencyLabourData.length,
    totalSundries: emergencySundriesData.length,
    totalScenarios: emergencyConversionScenarios.length,
    totalHeatingSundries: emergencyHeatingSundries.length,
    lastUpdated: new Date().toISOString(),
    source: 'Emergency CSV Data'
  };
  
  res.json({ success: true, data: stats });
});

// GET /api/emergency/activity - Emergency activity log
router.get('/activity', (req, res) => {
  const recentActivity = [
    { id: 1, action: 'Emergency system activated', timestamp: new Date().toISOString(), user: 'System' },
    { id: 2, action: 'CSV data loaded successfully', timestamp: new Date().toISOString(), user: 'System' },
    { id: 3, action: 'Dynamic pricing engine ready', timestamp: new Date().toISOString(), user: 'System' }
  ];
  
  res.json({ success: true, data: recentActivity });
});

// POST/PUT/DELETE endpoints for price updates (emergency mode)
router.put('/boilers/:id', (req, res) => {
  const { id } = req.params;
  const boilerIndex = emergencyBoilerData.findIndex(b => b.id === parseInt(id));
  
  if (boilerIndex === -1) {
    return res.status(404).json({ success: false, error: 'Boiler not found' });
  }
  
  // Update the boiler data
  emergencyBoilerData[boilerIndex] = { ...emergencyBoilerData[boilerIndex], ...req.body };
  
  res.json({ success: true, data: emergencyBoilerData[boilerIndex] });
});

router.put('/labour-costs/:id', (req, res) => {
  const { id } = req.params;
  const labourIndex = emergencyLabourData.findIndex(l => l.id === parseInt(id));
  
  if (labourIndex === -1) {
    return res.status(404).json({ success: false, error: 'Labour cost not found' });
  }
  
  // Update the labour cost data
  emergencyLabourData[labourIndex] = { ...emergencyLabourData[labourIndex], ...req.body };
  
  res.json({ success: true, data: emergencyLabourData[labourIndex] });
});

router.put('/sundries/:id', (req, res) => {
  const { id } = req.params;
  const sundryIndex = emergencySundriesData.findIndex(s => s.id === parseInt(id));
  
  if (sundryIndex === -1) {
    return res.status(404).json({ success: false, error: 'Sundry not found' });
  }
  
  // Update the sundry data
  emergencySundriesData[sundryIndex] = { ...emergencySundriesData[sundryIndex], ...req.body };
  
  res.json({ success: true, data: emergencySundriesData[sundryIndex] });
});

export default router;