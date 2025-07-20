// Phase 1: Database Data Seeding Script
// Populates database tables with authentic CSV data

import { db } from './db';
import { 
  boilers, 
  labourCosts, 
  sundries, 
  conversionScenarios, 
  heatingSundries 
} from '@shared/schema';

// Authentic boiler data from CSV
const boilerData = [
  { make: 'Alpha', model: 'E-Tec Plus 28kW Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 28.3, flow_rate_lpm: 12.1, warranty_years: 10, efficiency_rating: 'A', supply_price: 100000 },
  { make: 'Ariston', model: 'Clas One 30kW Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 30, flow_rate_lpm: 12.5, warranty_years: 8, efficiency_rating: 'A', supply_price: 92800 },
  { make: 'Ariston', model: 'E-Combi One 26kW Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 26, flow_rate_lpm: null, warranty_years: 2, efficiency_rating: 'A', supply_price: 64999 },
  { make: 'Ariston', model: 'E-Combi One 30kW Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 30, flow_rate_lpm: null, warranty_years: 2, efficiency_rating: 'A', supply_price: 70700 },
  { make: 'Ariston', model: 'Clas System ONE 18kW', boiler_type: 'System', tier: 'Budget', dhw_kw: null, flow_rate_lpm: null, warranty_years: 8, efficiency_rating: 'A', supply_price: 77500 },
  { make: 'ATAG', model: 'iC 24kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 24, flow_rate_lpm: 10.1, warranty_years: 14, efficiency_rating: 'A', supply_price: 130000 },
  { make: 'ATAG', model: 'iC 40kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 42, flow_rate_lpm: 16.2, warranty_years: 14, efficiency_rating: 'A', supply_price: 148000 },
  { make: 'ATAG', model: 'iC Economiser Plus 27kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 27, flow_rate_lpm: 12.6, warranty_years: 14, efficiency_rating: 'A', supply_price: 195000 },
  { make: 'ATAG', model: 'iS 15kW System', boiler_type: 'System', tier: 'Premium', dhw_kw: null, flow_rate_lpm: null, warranty_years: 18, efficiency_rating: 'A', supply_price: 127000 },
  { make: 'ATAG', model: 'iR 15kW Regular', boiler_type: 'Regular', tier: 'Premium', dhw_kw: null, flow_rate_lpm: null, warranty_years: 14, efficiency_rating: 'A', supply_price: 115000 },
  { make: 'Baxi', model: '800 Combi 2 24kW', boiler_type: 'Combi', tier: 'Mid-Range', dhw_kw: 24, flow_rate_lpm: 10.2, warranty_years: 10, efficiency_rating: 'A', supply_price: 98000 },
  { make: 'Baxi', model: '800 Combi 2 30kW', boiler_type: 'Combi', tier: 'Mid-Range', dhw_kw: 30, flow_rate_lpm: 12.2, warranty_years: 10, efficiency_rating: 'A', supply_price: 136738 },
  { make: 'Baxi', model: '800 Combi 2 36kW', boiler_type: 'Combi', tier: 'Mid-Range', dhw_kw: 36, flow_rate_lpm: 15, warranty_years: 10, efficiency_rating: 'A', supply_price: 120000 },
  { make: 'Baxi', model: '600 Combi 2 24kW', boiler_type: 'Combi', tier: 'Mid-Range', dhw_kw: 24, flow_rate_lpm: 10.2, warranty_years: 7, efficiency_rating: 'A', supply_price: 78998 },
  { make: 'Baxi', model: '400 Combi 24kW', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 24, flow_rate_lpm: 10.2, warranty_years: 5, efficiency_rating: 'A', supply_price: 66250 },
  { make: 'Ferroli', model: 'BLUEHELIX RRT Tech 24C Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 24.5, flow_rate_lpm: 11.7, warranty_years: 10, efficiency_rating: 'A', supply_price: 80000 },
  { make: 'Ferroli', model: 'Modena HE 32c Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 32, flow_rate_lpm: 18.3, warranty_years: 5, efficiency_rating: 'A', supply_price: 66500 },
  { make: 'Ferroli', model: 'BLUEHELIX RRT Tech 18S System', boiler_type: 'System', tier: 'Budget', dhw_kw: null, flow_rate_lpm: null, warranty_years: 10, efficiency_rating: 'A', supply_price: 56500 },
  { make: 'Glow-worm', model: 'Energy 30c Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 30.6, flow_rate_lpm: 12.4, warranty_years: 7, efficiency_rating: 'A', supply_price: 120840 },
  { make: 'Glow-worm', model: 'Compact 24C Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 24, flow_rate_lpm: null, warranty_years: 5, efficiency_rating: 'A', supply_price: 59880 },
  { make: 'Glow-worm', model: 'Betacom4 24kW Combi', boiler_type: 'Combi', tier: 'Budget', dhw_kw: 21.2, flow_rate_lpm: null, warranty_years: 5, efficiency_rating: 'A', supply_price: 52500 },
  { make: 'Ideal', model: 'Logic Max Combi2 C24', boiler_type: 'Combi', tier: 'Mid-Range', dhw_kw: 24.2, flow_rate_lpm: 9.9, warranty_years: 10, efficiency_rating: 'A', supply_price: 134880 },
  { make: 'Ideal', model: 'Logic Max Combi2 C30', boiler_type: 'Combi', tier: 'Mid-Range', dhw_kw: 30.3, flow_rate_lpm: 12.4, warranty_years: 10, efficiency_rating: 'A', supply_price: 138500 },
  { make: 'Ideal', model: 'Vogue Max Combi 26kW', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 26, flow_rate_lpm: 10.6, warranty_years: 12, efficiency_rating: 'A', supply_price: 99609 },
  { make: 'Ideal', model: 'Vogue Max Combi 32kW', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 32, flow_rate_lpm: 13.1, warranty_years: 12, efficiency_rating: 'A', supply_price: 159900 },
  { make: 'Ideal', model: 'Logic Max System2 S15', boiler_type: 'System', tier: 'Mid-Range', dhw_kw: null, flow_rate_lpm: null, warranty_years: 10, efficiency_rating: 'A', supply_price: 148080 },
  { make: 'Ideal', model: 'Vogue Max System 32kW', boiler_type: 'System', tier: 'Premium', dhw_kw: null, flow_rate_lpm: null, warranty_years: 12, efficiency_rating: 'A', supply_price: 116130 },
  { make: 'Vaillant', model: 'ecoTEC plus 832 Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 32, flow_rate_lpm: 13, warranty_years: 10, efficiency_rating: 'A', supply_price: 187560 },
  { make: 'Vaillant', model: 'ecoFIT pure 825 Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 25.2, flow_rate_lpm: 10.4, warranty_years: 10, efficiency_rating: 'A', supply_price: 129500 },
  { make: 'Viessmann', model: 'Vitodens 100-W 30kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 31.7, flow_rate_lpm: 13.4, warranty_years: 12, efficiency_rating: 'A', supply_price: 128991 },
  { make: 'Viessmann', model: 'Vitodens 050-W 25kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 25, flow_rate_lpm: null, warranty_years: 12, efficiency_rating: 'A', supply_price: 87978 },
  { make: 'Viessmann', model: 'Vitodens 200-W 30kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 30, flow_rate_lpm: null, warranty_years: 12, efficiency_rating: 'A', supply_price: 159867 },
  { make: 'Worcester Bosch', model: 'Greenstar 4000 25kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 25, flow_rate_lpm: 10.2, warranty_years: 10, efficiency_rating: 'A', supply_price: 115000 },
  { make: 'Worcester Bosch', model: 'Greenstar 4000 30kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 30, flow_rate_lpm: 12.3, warranty_years: 10, efficiency_rating: 'A', supply_price: 138808 },
  { make: 'Worcester Bosch', model: 'Greenstar 8000 Life 30kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 32, flow_rate_lpm: 12.3, warranty_years: 12, efficiency_rating: 'A', supply_price: 175900 },
  { make: 'Worcester Bosch', model: 'Greenstar 8000 Life 35kW Combi', boiler_type: 'Combi', tier: 'Premium', dhw_kw: 34.4, flow_rate_lpm: 14.3, warranty_years: 12, efficiency_rating: 'A', supply_price: 131500 },
];

// Authentic labour cost data from CSV
const labourData = [
  { job_type: 'Annual Boiler Service', tier: 'Standard', city: 'London', price: 10000 },
  { job_type: 'Annual Boiler Service', tier: 'Standard', city: 'UK Average', price: 8500 },
  { job_type: 'Back Boiler to Combi Conversion', tier: 'Premium', city: 'London', price: 350000 },
  { job_type: 'Back Boiler to Combi Conversion', tier: 'Standard', city: 'UK Average', price: 300000 },
  { job_type: 'Central Heating Powerflush (up to 8 radiators)', tier: 'Standard', city: 'London', price: 50000 },
  { job_type: 'Central Heating Powerflush (up to 8 radiators)', tier: 'Standard', city: 'UK Average', price: 40000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Budget', city: 'Bristol', price: 92500 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'Bristol', price: 107500 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'Bristol', price: 127500 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Outer)', price: 120000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Budget', city: 'Manchester', price: 95000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Central)', price: 135000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Central)', price: 160000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Outer)', price: 140000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'Manchester', price: 110000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'Manchester', price: 130000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Budget', city: 'Birmingham', price: 90000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'Birmingham', price: 105000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'Birmingham', price: 125000 },
  { job_type: 'Combi to System Conversion', tier: 'Premium', city: 'London', price: 230000 },
  { job_type: 'Combi to System Conversion', tier: 'Standard', city: 'UK Average', price: 190000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Outer)', price: 125000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Premium', city: 'Manchester', price: 135000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Standard', city: 'Manchester', price: 115000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Budget', city: 'Manchester', price: 100000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Central)', price: 165000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Central)', price: 140000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Outer)', price: 145000 },
];

// Authentic sundries data from CSV
const sundriesData = [
  { item_name: 'Fernox TF1 Compact Filter', tier: 'Magnetic Filter', price: 15000 },
  { item_name: 'Central Heating Power Flush', tier: 'Up to 10 radiators', price: 50000 },
  { item_name: 'Copper Pipe', tier: '22mm x 3m length', price: 2800 },
  { item_name: 'Copper Pipe', tier: '15mm x 3m length', price: 1800 },
  { item_name: 'Drayton Digistat+ RF', tier: 'Wireless Thermostat', price: 10000 },
  { item_name: 'Google Nest Learning Thermostat', tier: 'Smart Thermostat', price: 22000 },
  { item_name: 'Honeywell Home T4R', tier: 'Wireless Thermostat', price: 16000 },
  { item_name: 'Sentinel X100 Inhibitor', tier: 'System Chemical 1L', price: 2500 },
  { item_name: 'Sentinel X400 Sludge Remover', tier: 'Sentinel X400 Sludge Remover 1 Litre', price: 2500 },
];

// Authentic conversion scenarios data from CSV
const conversionScenariosData = [
  { scenario_id: 1, property_description: '1-bedroom flat, 1 bathroom (with shower)', occupants: '1-2 adults', current_system: 'Old system boiler with a 120L vented cylinder', recommendation: 'Combi Boiler Conversion', recommended_specification: '24-28kW Combi, ~10-12 LPM flow rate' },
  { scenario_id: 2, property_description: '2-bedroom terraced house, 1 bathroom', occupants: '2-3 people', current_system: 'Conventional boiler with tanks in loft and cylinder', recommendation: 'Combi Boiler Conversion', recommended_specification: '30kW Combi, ~12-13 LPM flow rate' },
  { scenario_id: 3, property_description: '2-bedroom apartment with no existing gas boiler', occupants: '2 adults', current_system: 'Electric storage heaters and standalone immersion cylinder', recommendation: 'New Gas Combi Boiler Installation', recommended_specification: '30kW Combi, ~12-13 LPM flow rate' },
  { scenario_id: 4, property_description: '3-bedroom semi-detached house, 1 main bathroom', occupants: 'A family of 3-4', current_system: 'Old system boiler and a vented cylinder', recommendation: 'Combi Boiler Conversion', recommended_specification: '32-35kW Combi, ~13-15 LPM flow rate' },
  { scenario_id: 5, property_description: '3-bedroom house, 1 main bathroom (mixer), 1 ensuite (electric)', occupants: 'A family of 4', current_system: 'Conventional boiler with cylinder', recommendation: 'Combi Boiler Conversion', recommended_specification: '35kW Combi, ~14-15 LPM flow rate' },
  { scenario_id: 8, property_description: '3-bedroom house, 2 mixer showers', occupants: 'A family of 4', current_system: 'System boiler and vented cylinder', recommendation: 'System Boiler Upgrade Strongly Advised', recommended_specification: '24kW System Boiler with 170L unvented cylinder' },
  { scenario_id: 9, property_description: '4-bedroom house, 1 bath, 1 ensuite', occupants: 'A family of 5 who value good water pressure', current_system: 'Old conventional boiler', recommendation: 'System Boiler Upgrade', recommended_specification: '28kW System Boiler with 210L unvented cylinder' },
  { scenario_id: 13, property_description: '4-Bed, 2-Bath, 1-Ensuite House', occupants: null, current_system: null, recommendation: 'System Boiler Upgrade', recommended_specification: '210L Cylinder' },
  { scenario_id: 14, property_description: '5-Bed, 3-Bath Family Home', occupants: null, current_system: null, recommendation: 'System Boiler Upgrade', recommended_specification: '250L Cylinder' },
  { scenario_id: 15, property_description: 'Property with 3+ Mixer Showers', occupants: null, current_system: null, recommendation: 'System Boiler Upgrade', recommended_specification: '300L Cylinder' },
];

// Authentic heating sundries data from CSV
const heatingSundriesData = [
  { category: 'System Protection', item_type: 'Magnetic Filter', item_name: 'Adey MagnaClean Micro 2', tier: 'Standard', specification: '22mm', price_low: 9000, price_high: 11500, notes: 'Industry standard, often bundled with new boilers.' },
  { category: 'System Protection', item_type: 'Magnetic Filter', item_name: 'Fernox TF1 Compact Filter', tier: 'Standard', specification: '22mm', price_low: 9500, price_high: 12000, notes: 'Popular and effective alternative.' },
  { category: 'System Protection', item_type: 'Magnetic Filter', item_name: 'Adey MagnaClean Professional 3 Sense', tier: 'Premium', specification: '22mm', price_low: 20000, price_high: 25000, notes: 'Wi-Fi connected for system monitoring.' },
  { category: 'System Protection', item_type: 'System Chemical', item_name: 'Sentinel X400 Sludge Remover', tier: 'Standard', specification: '1 Litre', price_low: 1800, price_high: 2500, notes: 'For cleaning existing systems before flush.' },
  { category: 'System Protection', item_type: 'System Chemical', item_name: 'Sentinel X100 Inhibitor', tier: 'Standard', specification: '1 Litre', price_low: 1800, price_high: 2500, notes: 'Market-leading corrosion inhibitor for post-clean.' },
  { category: 'Heating Controls', item_type: 'Wireless Thermostat', item_name: 'Honeywell Home T4R', tier: 'Standard', specification: 'Programmable', price_low: 13000, price_high: 16000, notes: 'Robust and popular \'fit and forget\' option.' },
  { category: 'Heating Controls', item_type: 'Wireless Thermostat', item_name: 'Drayton Digistat+ RF', tier: 'Standard', specification: 'Programmable', price_low: 8000, price_high: 10000, notes: 'Simple, reliable, and cost-effective.' },
  { category: 'Heating Controls', item_type: 'Smart Thermostat', item_name: 'Google Nest Learning Thermostat', tier: 'Premium', specification: '3rd Gen', price_low: 20000, price_high: 22000, notes: 'Learns user schedule to self-program.' },
  { category: 'System Cleaning', item_type: 'Service', item_name: 'Central Heating Power Flush', tier: 'UK Average', specification: 'Up to 10 radiators', price_low: 40000, price_high: 60000, notes: 'Price varies by location and system size.' },
  { category: 'System Cleaning', item_type: 'Service', item_name: 'Central Heating Power Flush', tier: 'London', specification: 'Up to 10 radiators', price_low: 50000, price_high: 75000, notes: 'London carries a premium for labour services.' },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.delete(boilers);
    await db.delete(labourCosts);
    await db.delete(sundries);
    await db.delete(conversionScenarios);
    await db.delete(heatingSundries);

    // Seed boilers
    console.log('📊 Seeding boilers table...');
    for (const boiler of boilerData) {
      await db.insert(boilers).values({
        make: boiler.make,
        model: boiler.model,
        boilerType: boiler.boiler_type,
        tier: boiler.tier,
        dhwKw: boiler.dhw_kw?.toString(),
        flowRateLpm: boiler.flow_rate_lpm?.toString(),
        warrantyYears: boiler.warranty_years,
        efficiencyRating: boiler.efficiency_rating,
        supplyPrice: boiler.supply_price,
      });
    }

    // Seed labour costs
    console.log('🔧 Seeding labour costs table...');
    for (const labour of labourData) {
      await db.insert(labourCosts).values({
        jobType: labour.job_type,
        tier: labour.tier,
        city: labour.city,
        price: labour.price,
      });
    }

    // Seed sundries
    console.log('⚙️ Seeding sundries table...');
    for (const sundry of sundriesData) {
      await db.insert(sundries).values({
        itemName: sundry.item_name,
        tier: sundry.tier,
        price: sundry.price,
      });
    }

    // Seed conversion scenarios
    console.log('🏠 Seeding conversion scenarios table...');
    for (const scenario of conversionScenariosData) {
      await db.insert(conversionScenarios).values({
        scenarioId: scenario.scenario_id,
        propertyDescription: scenario.property_description,
        occupants: scenario.occupants,
        currentSystem: scenario.current_system,
        recommendation: scenario.recommendation,
        recommendedSpecification: scenario.recommended_specification,
      });
    }

    // Seed heating sundries
    console.log('🔥 Seeding heating sundries table...');
    for (const item of heatingSundriesData) {
      await db.insert(heatingSundries).values({
        category: item.category,
        itemType: item.item_type,
        itemName: item.item_name,
        tier: item.tier,
        specification: item.specification,
        priceLow: item.price_low,
        priceHigh: item.price_high,
        notes: item.notes,
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📈 Seeded ${boilerData.length} boilers, ${labourData.length} labour costs, ${sundriesData.length} sundries, ${conversionScenariosData.length} scenarios, ${heatingSundriesData.length} heating sundries`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}