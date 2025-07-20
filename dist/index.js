var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accessCosts: () => accessCosts,
  adminUsers: () => adminUsers,
  boilers: () => boilers,
  contactMessages: () => contactMessages,
  cylinders: () => cylinders,
  discountCodes: () => discountCodes,
  emailVerifications: () => emailVerifications,
  engineerProfiles: () => engineerProfiles,
  engineers: () => engineers,
  flueCosts: () => flueCosts,
  heatingSundries: () => heatingSundries,
  insertJobSchema: () => insertJobSchema,
  insertQuoteSchema: () => insertQuoteSchema,
  insertUserSchema: () => insertUserSchema,
  jobs: () => jobs,
  labourCosts: () => labourCosts,
  leadCosts: () => leadCosts,
  leadPurchases: () => leadPurchases,
  locations: () => locations,
  quotes: () => quotes,
  serviceRequests: () => serviceRequests,
  sessions: () => sessions,
  sundries: () => sundries,
  users: () => users
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions, users, engineers, quotes, jobs, boilers, labourCosts, sundries, cylinders, heatingSundries, discountCodes, locations, accessCosts, flueCosts, leadCosts, adminUsers, engineerProfiles, contactMessages, insertUserSchema, insertQuoteSchema, insertJobSchema, serviceRequests, leadPurchases, emailVerifications;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      fullName: varchar("full_name", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }).unique().notNull(),
      password: varchar("password", { length: 255 }).notNull(),
      phone: varchar("phone", { length: 20 }),
      address: text("address"),
      city: varchar("city", { length: 100 }),
      postcode: varchar("postcode", { length: 20 }),
      emailVerified: boolean("email_verified").default(false),
      emailVerificationToken: varchar("email_verification_token", { length: 255 }),
      emailVerificationCode: varchar("email_verification_code", { length: 6 }),
      emailVerificationExpires: timestamp("email_verification_expires"),
      resetPasswordToken: varchar("reset_password_token", { length: 255 }),
      resetPasswordExpires: timestamp("reset_password_expires"),
      userType: varchar("user_type", { length: 20 }).default("customer"),
      // customer, engineer, admin, editor
      stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
      stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    engineers = pgTable("engineers", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }).notNull(),
      phone: varchar("phone", { length: 20 }),
      postcode: varchar("postcode", { length: 10 }),
      address: text("address"),
      serviceTypes: text("service_types").array().notNull(),
      // heating, electrical, plumbing, decoration, handyman, etc.
      specialties: text("specialties").array(),
      gasSafeNumber: varchar("gas_safe_number", { length: 50 }),
      electricalQualification: varchar("electrical_qualification", { length: 100 }),
      plumbingQualification: varchar("plumbing_qualification", { length: 100 }),
      otherQualifications: text("other_qualifications").array(),
      profilePhotoUrl: varchar("profile_photo_url", { length: 500 }),
      idDocumentUrl: varchar("id_document_url", { length: 500 }),
      insuranceDocumentUrl: varchar("insurance_document_url", { length: 500 }),
      certificateUrls: text("certificate_urls").array(),
      portfolioUrls: text("portfolio_urls").array(),
      experienceYears: integer("experience_years"),
      hourlyRate: integer("hourly_rate"),
      // in pence
      about: text("about"),
      businessName: varchar("business_name", { length: 255 }),
      businessRegistrationNumber: varchar("business_registration_number", { length: 50 }),
      vatNumber: varchar("vat_number", { length: 50 }),
      bankSortCode: varchar("bank_sort_code", { length: 10 }),
      bankAccountNumber: varchar("bank_account_number", { length: 20 }),
      status: varchar("status", { length: 20 }).default("pending"),
      // pending, verified, suspended, rejected
      verificationNotes: text("verification_notes"),
      documentsRequired: text("documents_required").array(),
      lastActiveAt: timestamp("last_active_at"),
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
      totalJobs: integer("total_jobs").default(0),
      completedJobs: integer("completed_jobs").default(0),
      responseTime: integer("response_time"),
      // in minutes
      availability: varchar("availability", { length: 50 }).default("available"),
      // available, busy, unavailable
      workingHours: jsonb("working_hours"),
      serviceRadius: integer("service_radius").default(10),
      // in miles
      liabilityInsurance: decimal("liability_insurance", { precision: 10, scale: 2 }),
      insuranceExpiryDate: timestamp("insurance_expiry_date"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    quotes = pgTable("quotes", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      propertyType: varchar("property_type", { length: 50 }).notNull(),
      bedrooms: varchar("bedrooms", { length: 10 }).notNull(),
      bathrooms: varchar("bathrooms", { length: 10 }).notNull(),
      occupants: varchar("occupants", { length: 10 }),
      postcode: varchar("postcode", { length: 20 }).notNull(),
      currentBoiler: varchar("current_boiler", { length: 50 }).notNull(),
      cylinderLocation: varchar("cylinder_location", { length: 100 }),
      flueLocation: varchar("flue_location", { length: 100 }),
      flueExtension: varchar("flue_extension", { length: 50 }),
      drainNearby: boolean("drain_nearby").default(false),
      moveBoiler: boolean("move_boiler").default(false),
      parkingSituation: varchar("parking_situation", { length: 50 }),
      parkingDistance: varchar("parking_distance", { length: 50 }),
      floorLevel: varchar("floor_level", { length: 20 }),
      hasLift: boolean("has_lift"),
      accessCost: integer("access_cost"),
      flueCost: integer("flue_cost"),
      locationMultiplier: decimal("location_multiplier", { precision: 3, scale: 2 }).default("1.00"),
      photos: text("photos").array(),
      selectedPackage: varchar("selected_package", { length: 50 }),
      thermostatUpgrade: varchar("thermostat_upgrade", { length: 50 }),
      // Pricing breakdown
      boilerPrice: integer("boiler_price"),
      labourPrice: integer("labour_price"),
      sundryPrice: integer("sundry_price"),
      flueExtensionPrice: integer("flue_extension_price"),
      parkingFee: integer("parking_fee"),
      discountCode: varchar("discount_code", { length: 50 }),
      discountAmount: integer("discount_amount"),
      vatAmount: integer("vat_amount"),
      totalPrice: integer("total_price"),
      // Installation details
      preferredDate1: timestamp("preferred_date_1"),
      preferredDate2: timestamp("preferred_date_2"),
      preferredDate3: timestamp("preferred_date_3"),
      customerNotes: text("customer_notes"),
      // Boiler specifications
      recommendedBoilerSize: integer("recommended_boiler_size"),
      cylinderCapacity: integer("cylinder_capacity"),
      status: varchar("status", { length: 50 }).default("draft"),
      depositPaid: boolean("deposit_paid").default(false),
      materialsPaid: boolean("materials_paid").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    jobs = pgTable("jobs", {
      id: serial("id").primaryKey(),
      quoteId: integer("quote_id").references(() => quotes.id),
      engineerId: integer("engineer_id").references(() => engineers.id),
      status: varchar("status", { length: 50 }).default("pending"),
      scheduledDate: timestamp("scheduled_date"),
      completedDate: timestamp("completed_date"),
      beforePhotos: text("before_photos").array(),
      afterPhotos: text("after_photos").array(),
      gasSafetyCertificate: text("gas_safety_certificate"),
      customerSignature: text("customer_signature"),
      engineerSignature: text("engineer_signature"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    boilers = pgTable("boilers", {
      id: serial("id").primaryKey(),
      make: varchar("make", { length: 100 }).notNull(),
      model: varchar("model", { length: 100 }).notNull(),
      boilerType: varchar("boiler_type", { length: 50 }).notNull(),
      tier: varchar("tier", { length: 50 }).notNull(),
      dhwKw: decimal("dhw_kw", { precision: 5, scale: 2 }),
      flowRateLpm: decimal("flow_rate_lpm", { precision: 5, scale: 2 }),
      warrantyYears: integer("warranty_years"),
      efficiencyRating: varchar("efficiency_rating", { length: 10 }),
      supplyPrice: integer("supply_price"),
      createdAt: timestamp("created_at").defaultNow()
    });
    labourCosts = pgTable("labour_costs", {
      id: serial("id").primaryKey(),
      jobType: varchar("job_type", { length: 100 }).notNull(),
      tier: varchar("tier", { length: 50 }).notNull(),
      city: varchar("city", { length: 100 }).notNull(),
      price: integer("price").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    sundries = pgTable("sundries", {
      id: serial("id").primaryKey(),
      itemName: varchar("item_name", { length: 100 }).notNull(),
      tier: varchar("tier", { length: 50 }).notNull(),
      price: integer("price").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    cylinders = pgTable("cylinders", {
      id: serial("id").primaryKey(),
      make: varchar("make", { length: 100 }).notNull(),
      model: varchar("model", { length: 100 }).notNull(),
      capacity: integer("capacity").notNull(),
      // in litres
      cylinderType: varchar("cylinder_type", { length: 50 }).notNull(),
      // unvented, vented
      tier: varchar("tier", { length: 50 }).notNull(),
      // standard, premium
      supplyPrice: integer("supply_price").notNull(),
      // price in pence
      warranty: integer("warranty").notNull(),
      // warranty years
      height: integer("height"),
      // in mm
      diameter: integer("diameter"),
      // in mm
      weight: integer("weight"),
      // in kg
      maxPressure: decimal("max_pressure", { precision: 4, scale: 2 }),
      // in bar
      coilType: varchar("coil_type", { length: 50 }),
      // single, twin, solar
      createdAt: timestamp("created_at").defaultNow()
    });
    heatingSundries = pgTable("heating_sundries", {
      id: serial("id").primaryKey(),
      category: varchar("category", { length: 100 }).notNull(),
      itemType: varchar("item_type", { length: 100 }).notNull(),
      itemName: varchar("item_name", { length: 200 }).notNull(),
      tier: varchar("tier", { length: 50 }).notNull(),
      specification: varchar("specification", { length: 200 }),
      priceLow: integer("price_low").notNull(),
      // price in pence
      priceHigh: integer("price_high").notNull(),
      // price in pence
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    discountCodes = pgTable("discount_codes", {
      id: serial("id").primaryKey(),
      code: varchar("code", { length: 50 }).unique().notNull(),
      discountType: varchar("discount_type", { length: 20 }).notNull(),
      // percentage, fixed
      discountValue: integer("discount_value").notNull(),
      active: boolean("active").default(true),
      validFrom: timestamp("valid_from").defaultNow(),
      validTo: timestamp("valid_to"),
      usageLimit: integer("usage_limit"),
      usageCount: integer("usage_count").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    locations = pgTable("locations", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 100 }).notNull(),
      region: varchar("region", { length: 50 }).notNull(),
      // 'london', 'central_london', 'manchester', etc.
      priceMultiplier: decimal("price_multiplier", { precision: 3, scale: 2 }).default("1.00"),
      labourMultiplier: decimal("labour_multiplier", { precision: 3, scale: 2 }).default("1.00"),
      postcodePattern: varchar("postcode_pattern", { length: 20 }).notNull(),
      // 'SW*', 'M*', etc.
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    accessCosts = pgTable("access_costs", {
      id: serial("id").primaryKey(),
      floorLevel: varchar("floor_level", { length: 20 }).notNull(),
      // 'ground', '1st-2nd', '3rd+'
      hasLift: boolean("has_lift").notNull(),
      baseCost: decimal("base_cost", { precision: 10, scale: 2 }).notNull(),
      description: text("description"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    flueCosts = pgTable("flue_costs", {
      id: serial("id").primaryKey(),
      flueType: varchar("flue_type", { length: 30 }).notNull(),
      // 'external_wall', 'through_roof'
      extensionLength: decimal("extension_length", { precision: 3, scale: 1 }).notNull(),
      baseCost: decimal("base_cost", { precision: 10, scale: 2 }).notNull(),
      roofAccessCost: decimal("roof_access_cost", { precision: 10, scale: 2 }).default("0"),
      ladderCost: decimal("ladder_cost", { precision: 10, scale: 2 }).default("0"),
      description: text("description"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadCosts = pgTable("lead_costs", {
      id: serial("id").primaryKey(),
      serviceType: varchar("service_type", { length: 50 }).notNull(),
      // 'boiler-repair', 'electrical', etc.
      leadCost: decimal("lead_cost", { precision: 10, scale: 2 }).notNull(),
      description: text("description"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    adminUsers = pgTable("admin_users", {
      id: serial("id").primaryKey(),
      username: varchar("username", { length: 50 }).unique().notNull(),
      email: varchar("email", { length: 100 }).unique().notNull(),
      hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
      role: varchar("role", { length: 20 }).default("admin"),
      // 'admin', 'super_admin'
      isActive: boolean("is_active").default(true),
      lastLogin: timestamp("last_login"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    engineerProfiles = pgTable("engineer_profiles", {
      id: serial("id").primaryKey(),
      engineerId: integer("engineer_id").references(() => engineers.id),
      gasSafeNumber: varchar("gas_safe_number", { length: 50 }),
      gasSafeExpiry: timestamp("gas_safe_expiry"),
      insuranceProvider: varchar("insurance_provider", { length: 100 }),
      insuranceExpiry: timestamp("insurance_expiry"),
      qualifications: text("qualifications").array(),
      serviceAreas: text("service_areas").array(),
      averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
      totalJobs: integer("total_jobs").default(0),
      status: varchar("status", { length: 20 }).default("pending"),
      // 'pending', 'verified', 'suspended', 'blocked'
      verificationDate: timestamp("verification_date"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    contactMessages = pgTable("contact_messages", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }).notNull(),
      phone: varchar("phone", { length: 20 }).notNull(),
      subject: varchar("subject", { length: 255 }).notNull(),
      message: text("message").notNull(),
      photoUrls: text("photo_urls").array(),
      status: varchar("status", { length: 20 }).default("new"),
      // new, in_progress, resolved
      adminNotes: text("admin_notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertUserSchema = createInsertSchema(users).pick({
      fullName: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      city: true,
      postcode: true
    });
    insertQuoteSchema = createInsertSchema(quotes).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertJobSchema = createInsertSchema(jobs).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    serviceRequests = pgTable("service_requests", {
      id: varchar("id").primaryKey().notNull(),
      serviceType: varchar("service_type").notNull(),
      serviceName: varchar("service_name").notNull(),
      serviceIcon: varchar("service_icon").notNull(),
      customerName: varchar("customer_name").notNull(),
      customerEmail: varchar("customer_email").notNull(),
      customerPhone: varchar("customer_phone").notNull(),
      postcode: varchar("postcode").notNull(),
      urgency: varchar("urgency").notNull(),
      // 'low', 'medium', 'high'
      description: text("description").notNull(),
      photos: jsonb("photos").notNull(),
      // Array of photo URLs
      emailVerified: boolean("email_verified").default(false),
      leadPrice: integer("lead_price").default(1500),
      // £15.00 per lead (in pence)
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadPurchases = pgTable("lead_purchases", {
      id: varchar("id").primaryKey().notNull(),
      serviceRequestId: varchar("service_request_id").notNull().references(() => serviceRequests.id),
      engineerId: varchar("engineer_id").notNull(),
      // Engineer who purchased
      engineerEmail: varchar("engineer_email").notNull(),
      purchasePrice: integer("purchase_price").notNull(),
      // Amount paid in pence
      paymentStatus: varchar("payment_status").default("pending"),
      // 'pending', 'completed', 'failed'
      stripePaymentId: varchar("stripe_payment_id"),
      purchasedAt: timestamp("purchased_at").defaultNow()
    });
    emailVerifications = pgTable("email_verifications", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").notNull(),
      code: varchar("code").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      isUsed: boolean("is_used").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import { eq, and } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || void 0;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user || void 0;
      }
      async getUserByResetToken(token) {
        const [user] = await db.select().from(users).where(eq(users.resetPasswordToken, token));
        return user || void 0;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUser(id, userUpdate) {
        const [user] = await db.update(users).set({ ...userUpdate, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
        return user;
      }
      async updateUserStripeInfo(userId, stripeCustomerId, stripeSubscriptionId) {
        const [user] = await db.update(users).set({ stripeCustomerId, stripeSubscriptionId }).where(eq(users.id, userId)).returning();
        return user;
      }
      async createQuote(insertQuote) {
        const [quote] = await db.insert(quotes).values(insertQuote).returning();
        return quote;
      }
      async getQuote(id) {
        const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
        return quote || void 0;
      }
      async updateQuote(id, updateData) {
        const [quote] = await db.update(quotes).set(updateData).where(eq(quotes.id, id)).returning();
        return quote;
      }
      async getUserQuotes(userId) {
        return await db.select().from(quotes).where(eq(quotes.userId, userId));
      }
      async createJob(insertJob) {
        const [job] = await db.insert(jobs).values(insertJob).returning();
        return job;
      }
      async getJob(id) {
        const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
        return job || void 0;
      }
      async updateJob(id, updateData) {
        const [job] = await db.update(jobs).set(updateData).where(eq(jobs.id, id)).returning();
        return job;
      }
      async getUserJobs(userId) {
        return await db.select().from(jobs).where(eq(jobs.engineerId, userId));
      }
      async getBoilers() {
        return await db.select().from(boilers);
      }
      async getBoilersByType(type) {
        return await db.select().from(boilers).where(eq(boilers.boilerType, type));
      }
      async getLabourCosts() {
        return await db.select().from(labourCosts);
      }
      async getLabourCostByType(jobType, tier) {
        const [cost] = await db.select().from(labourCosts).where(eq(labourCosts.jobType, jobType));
        return cost || void 0;
      }
      async getSundries() {
        return await db.select().from(sundries);
      }
      async getSundryByName(name) {
        const [sundry] = await db.select().from(sundries).where(eq(sundries.itemName, name));
        return sundry || void 0;
      }
      async getCylinders() {
        return await db.select().from(cylinders);
      }
      async getCylindersByCapacity(capacity) {
        return await db.select().from(cylinders).where(eq(cylinders.capacity, capacity));
      }
      async getCylinderByCapacityAndTier(capacity, tier) {
        const [cylinder] = await db.select().from(cylinders).where(
          and(eq(cylinders.capacity, capacity), eq(cylinders.tier, tier))
        );
        return cylinder;
      }
      async updateCylinder(id, cylinderData) {
        const [updatedCylinder] = await db.update(cylinders).set(cylinderData).where(eq(cylinders.id, id)).returning();
        return updatedCylinder;
      }
      async getHeatingSundries() {
        return await db.select().from(heatingSundries);
      }
      async getHeatingSundriesByCategory(category) {
        return await db.select().from(heatingSundries).where(eq(heatingSundries.category, category));
      }
      async getHeatingSundryByName(itemName) {
        const [sundry] = await db.select().from(heatingSundries).where(eq(heatingSundries.itemName, itemName));
        return sundry;
      }
      async updateHeatingSundry(id, sundryData) {
        const [updatedSundry] = await db.update(heatingSundries).set(sundryData).where(eq(heatingSundries.id, id)).returning();
        return updatedSundry;
      }
      async getDiscountCode(code) {
        const [discount] = await db.select().from(discountCodes).where(eq(discountCodes.code, code));
        return discount || void 0;
      }
      // Location-based pricing methods
      async getLocations() {
        return await db.select().from(locations).where(eq(locations.isActive, true));
      }
      async getLocationByPostcode(postcode) {
        const upperPostcode = postcode.toUpperCase();
        const allLocations = await this.getLocations();
        for (const location of allLocations) {
          const pattern = location.postcodePattern.replace("*", "");
          if (upperPostcode.startsWith(pattern)) {
            return location;
          }
        }
        return void 0;
      }
      async updateLocation(id, locationData) {
        const [location] = await db.update(locations).set({ ...locationData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(locations.id, id)).returning();
        return location;
      }
      // Access costs methods
      async getAccessCosts() {
        return await db.select().from(accessCosts).where(eq(accessCosts.isActive, true));
      }
      async getAccessCost(floorLevel, hasLift) {
        const [accessCost] = await db.select().from(accessCosts).where(eq(accessCosts.floorLevel, floorLevel)).where(eq(accessCosts.hasLift, hasLift)).where(eq(accessCosts.isActive, true));
        return accessCost;
      }
      async updateAccessCost(id, accessCostData) {
        const [accessCost] = await db.update(accessCosts).set({ ...accessCostData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(accessCosts.id, id)).returning();
        return accessCost;
      }
      // Flue costs methods
      async getFlueCosts() {
        return await db.select().from(flueCosts).where(eq(flueCosts.isActive, true));
      }
      async getFlueCost(flueType, extensionLength) {
        const [flueCost] = await db.select().from(flueCosts).where(eq(flueCosts.flueType, flueType)).where(eq(flueCosts.extensionLength, extensionLength.toString())).where(eq(flueCosts.isActive, true));
        return flueCost;
      }
      async updateFlueCost(id, flueCostData) {
        const [flueCost] = await db.update(flueCosts).set({ ...flueCostData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(flueCosts.id, id)).returning();
        return flueCost;
      }
      // Lead costs methods
      async getLeadCosts() {
        return await db.select().from(leadCosts).where(eq(leadCosts.isActive, true));
      }
      async getLeadCostByService(serviceType) {
        const [leadCost] = await db.select().from(leadCosts).where(eq(leadCosts.serviceType, serviceType)).where(eq(leadCosts.isActive, true));
        return leadCost;
      }
      async updateLeadCost(id, leadCostData) {
        const [leadCost] = await db.update(leadCosts).set({ ...leadCostData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(leadCosts.id, id)).returning();
        return leadCost;
      }
      // Admin users methods
      async getAdminByUsername(username) {
        const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).where(eq(adminUsers.isActive, true));
        return admin;
      }
      async createAdminUser(adminData) {
        const [admin] = await db.insert(adminUsers).values(adminData).returning();
        return admin;
      }
      // Engineer profiles methods
      async getEngineerProfiles() {
        try {
          return await db.select().from(engineerProfiles);
        } catch (error) {
          console.error("Error fetching engineer profiles:", error);
          throw error;
        }
      }
      async getEngineerProfile(engineerId) {
        const [profile] = await db.select().from(engineerProfiles).where(eq(engineerProfiles.id, engineerId));
        return profile;
      }
      async updateEngineerProfile(id, profileData) {
        const [profile] = await db.update(engineerProfiles).set({ ...profileData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(engineerProfiles.id, id)).returning();
        return profile;
      }
      async seedPricingData() {
        const boilerData = [
          { make: "Alpha", model: "E-Tec Plus 28kW Combi", boilerType: "Combi", tier: "Budget", dhwKw: "28.3", flowRateLpm: "12.1", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 1e5 },
          { make: "ATAG", model: "iC 24kW Combi", boilerType: "Combi", tier: "Premium", dhwKw: "24", flowRateLpm: "10.1", warrantyYears: 14, efficiencyRating: "A", supplyPrice: 13e4 },
          { make: "Baxi", model: "800 Combi 2 24kW", boilerType: "Combi", tier: "Mid-Range", dhwKw: "24", flowRateLpm: "10.2", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 98e3 },
          { make: "Ideal", model: "Logic Max Combi2 C24", boilerType: "Combi", tier: "Mid-Range", dhwKw: "24.2", flowRateLpm: "9.9", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 134880 },
          { make: "Vaillant", model: "EcoTec Pro 28kW", boilerType: "Combi", tier: "Premium", dhwKw: "28", flowRateLpm: "11.5", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 145e3 },
          { make: "Worcester", model: "Greenstar 30i", boilerType: "Combi", tier: "Premium", dhwKw: "30", flowRateLpm: "12.6", warrantyYears: 12, efficiencyRating: "A", supplyPrice: 155e3 }
        ];
        for (const boiler of boilerData) {
          try {
            await db.insert(boilers).values([boiler]);
          } catch (error) {
          }
        }
        const labourData = [
          { jobType: "Combi Boiler Replacement (like-for-like)", tier: "Budget", city: "London", price: 12e4 },
          { jobType: "Combi Boiler Replacement (like-for-like)", tier: "Standard", city: "London", price: 135e3 },
          { jobType: "Combi Boiler Replacement (like-for-like)", tier: "Premium", city: "London", price: 16e4 },
          { jobType: "System Boiler Replacement (like-for-like)", tier: "Budget", city: "London", price: 125e3 },
          { jobType: "System Boiler Replacement (like-for-like)", tier: "Standard", city: "London", price: 14e4 },
          { jobType: "System Boiler Replacement (like-for-like)", tier: "Premium", city: "London", price: 165e3 },
          { jobType: "Conventional to Combi Conversion", tier: "Standard", city: "London", price: 25e4 },
          { jobType: "Conventional to Combi Conversion", tier: "Premium", city: "London", price: 28e4 }
        ];
        for (const labour of labourData) {
          try {
            await db.insert(labourCosts).values([labour]);
          } catch (error) {
          }
        }
        const sundryData = [
          { itemName: "Fernox TF1 Compact Filter", tier: "Magnetic Filter", price: 15e3 },
          { itemName: "Google Nest Learning Thermostat", tier: "Smart Thermostat", price: 22e3 },
          { itemName: "Honeywell Home T4R", tier: "Wireless Thermostat", price: 16e3 },
          { itemName: "Central Heating Power Flush", tier: "Up to 10 radiators", price: 5e4 },
          { itemName: "Flue Extension", tier: "Per meter", price: 8e3 },
          { itemName: "Parking Fee", tier: "Per meter distance", price: 500 }
        ];
        for (const sundry of sundryData) {
          try {
            await db.insert(sundries).values([sundry]);
          } catch (error) {
          }
        }
        const discountData = [
          { code: "WELCOME10", discountType: "percentage", discountValue: 10, active: true },
          { code: "NEWCUSTOMER", discountType: "fixed", discountValue: 5e4, active: true },
          { code: "SUMMER2024", discountType: "percentage", discountValue: 15, active: true }
        ];
        for (const discount of discountData) {
          try {
            await db.insert(discountCodes).values([discount]);
          } catch (error) {
          }
        }
        const locationData = [
          { name: "Central London", region: "central_london", priceMultiplier: 1.5, labourMultiplier: 1.6, postcodePattern: "W*", isActive: true },
          { name: "Central London", region: "central_london", priceMultiplier: 1.5, labourMultiplier: 1.6, postcodePattern: "WC*", isActive: true },
          { name: "Central London", region: "central_london", priceMultiplier: 1.5, labourMultiplier: 1.6, postcodePattern: "SW1*", isActive: true },
          { name: "London", region: "london", priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: "SW*", isActive: true },
          { name: "London", region: "london", priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: "SE*", isActive: true },
          { name: "London", region: "london", priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: "N*", isActive: true },
          { name: "London", region: "london", priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: "E*", isActive: true },
          { name: "Manchester", region: "manchester", priceMultiplier: 1.1, labourMultiplier: 1.1, postcodePattern: "M*", isActive: true },
          { name: "Birmingham", region: "birmingham", priceMultiplier: 1, labourMultiplier: 1, postcodePattern: "B*", isActive: true },
          { name: "Bristol", region: "bristol", priceMultiplier: 1.2, labourMultiplier: 1.2, postcodePattern: "BS*", isActive: true }
        ];
        for (const location of locationData) {
          try {
            await db.insert(locations).values([location]);
          } catch (error) {
          }
        }
        const accessData = [
          { floorLevel: "ground", hasLift: false, baseCost: 0, description: "Ground floor access", isActive: true },
          { floorLevel: "ground", hasLift: true, baseCost: 0, description: "Ground floor access with lift", isActive: true },
          { floorLevel: "1st-2nd", hasLift: true, baseCost: 5e3, description: "1st-2nd floor with lift access", isActive: true },
          { floorLevel: "1st-2nd", hasLift: false, baseCost: 15e3, description: "1st-2nd floor without lift", isActive: true },
          { floorLevel: "3rd+", hasLift: true, baseCost: 1e4, description: "3rd+ floor with lift access", isActive: true },
          { floorLevel: "3rd+", hasLift: false, baseCost: 3e4, description: "3rd+ floor without lift - special equipment required", isActive: true }
        ];
        for (const access of accessData) {
          try {
            await db.insert(accessCosts).values([access]);
          } catch (error) {
          }
        }
        const flueData = [
          { flueType: "external_wall", extensionLength: 0, baseCost: 0, roofAccessCost: 0, ladderCost: 0, description: "Standard external wall flue", isActive: true },
          { flueType: "external_wall", extensionLength: 1.5, baseCost: 8e3, roofAccessCost: 0, ladderCost: 0, description: "1-2m external wall extension", isActive: true },
          { flueType: "external_wall", extensionLength: 3.5, baseCost: 16e3, roofAccessCost: 0, ladderCost: 0, description: "3-4m external wall extension", isActive: true },
          { flueType: "external_wall", extensionLength: 5, baseCost: 24e3, roofAccessCost: 0, ladderCost: 0, description: "5m+ external wall extension", isActive: true },
          { flueType: "through_roof", extensionLength: 0, baseCost: 2e4, roofAccessCost: 15e3, ladderCost: 1e4, description: "Through roof flue - requires roof access", isActive: true },
          { flueType: "through_roof", extensionLength: 1.5, baseCost: 28e3, roofAccessCost: 15e3, ladderCost: 1e4, description: "1-2m through roof extension", isActive: true },
          { flueType: "through_roof", extensionLength: 3.5, baseCost: 36e3, roofAccessCost: 15e3, ladderCost: 1e4, description: "3-4m through roof extension", isActive: true },
          { flueType: "through_roof", extensionLength: 5, baseCost: 44e3, roofAccessCost: 15e3, ladderCost: 1e4, description: "5m+ through roof extension", isActive: true }
        ];
        for (const flue of flueData) {
          try {
            await db.insert(flueCosts).values([flue]);
          } catch (error) {
          }
        }
        const leadData = [
          { serviceType: "boiler-repair", leadCost: 1e3, description: "Boiler repair and service lead", isActive: true },
          { serviceType: "gas-safety", leadCost: 800, description: "Gas safety certificate lead", isActive: true },
          { serviceType: "landlord-safety", leadCost: 1200, description: "Landlord safety certificate lead", isActive: true },
          { serviceType: "electrician", leadCost: 1e3, description: "Electrical services lead", isActive: true },
          { serviceType: "plumber", leadCost: 800, description: "Plumbing services lead", isActive: true },
          { serviceType: "decorator", leadCost: 600, description: "Decoration and painting lead", isActive: true },
          { serviceType: "handyman", leadCost: 500, description: "General handyman lead", isActive: true }
        ];
        for (const lead of leadData) {
          try {
            await db.insert(leadCosts).values([lead]);
          } catch (error) {
          }
        }
        try {
          await db.delete(engineerProfiles);
        } catch (error) {
        }
        const engineerData = [
          {
            gasSafeNumber: "GS123456",
            gasSafeExpiry: /* @__PURE__ */ new Date("2025-03-15"),
            insuranceProvider: "Zurich Insurance",
            insuranceExpiry: /* @__PURE__ */ new Date("2025-12-31"),
            qualifications: ["Gas Safe Registered", "City & Guilds Level 3", "OFTEC Registered"],
            serviceAreas: ["London", "South London", "Surrey"],
            averageRating: "4.8",
            totalJobs: 145,
            status: "verified",
            verificationDate: /* @__PURE__ */ new Date("2024-01-15"),
            notes: "James Mitchell - Gas Engineer. All documents verified. Excellent track record. Business: Mitchell Gas Services (\xA32M public liability). Services: Boiler Installation, Gas Safety Certificates, Central Heating. Phone: 07123456789"
          },
          {
            gasSafeNumber: null,
            gasSafeExpiry: null,
            insuranceProvider: "Aviva Commercial",
            insuranceExpiry: /* @__PURE__ */ new Date("2025-08-30"),
            qualifications: ["NICEIC Approved", "City & Guilds 2391", "Part P Qualified"],
            serviceAreas: ["Manchester", "North West", "Lancashire"],
            averageRating: "4.9",
            totalJobs: 234,
            status: "verified",
            verificationDate: /* @__PURE__ */ new Date("2024-02-10"),
            notes: "Sarah Thompson - Electrician. Highly qualified electrician. All certifications current. Business: Thompson Electrical Services (\xA35M public liability). Services: Electrical Installation, Rewiring, Home Maintenance. Phone: 07987654321"
          },
          {
            gasSafeNumber: null,
            gasSafeExpiry: null,
            insuranceProvider: "NFU Mutual",
            insuranceExpiry: /* @__PURE__ */ new Date("2025-11-15"),
            qualifications: ["City & Guilds Plumbing", "CIPHE Member", "Unvented Hot Water"],
            serviceAreas: ["Birmingham", "West Midlands", "Coventry"],
            averageRating: "4.6",
            totalJobs: 89,
            status: "pending",
            verificationDate: null,
            notes: "David Rodriguez - Plumber. Awaiting verification of qualifications. Business: Rodriguez Plumbing Solutions (\xA31M public liability). Services: Bathroom Installation, Emergency Plumbing, Leak Repairs. Phone: 07456789123"
          },
          {
            gasSafeNumber: null,
            gasSafeExpiry: null,
            insuranceProvider: "Simply Business",
            insuranceExpiry: /* @__PURE__ */ new Date("2025-05-20"),
            qualifications: ["City & Guilds Painting", "CSCS Card", "NVQ Level 2"],
            serviceAreas: ["Bristol", "Bath", "South West"],
            averageRating: "4.7",
            totalJobs: 156,
            status: "documents_requested",
            verificationDate: null,
            notes: "Emma Wilson - Decorator. Need updated insurance documents and recent work photos. Business: Wilson Decorating Services (\xA31M public liability). Services: Interior Painting, Wallpaper Hanging, Kitchen Fitting. Phone: 07789123456"
          },
          {
            gasSafeNumber: "GS789012",
            gasSafeExpiry: /* @__PURE__ */ new Date("2025-08-15"),
            insuranceProvider: "AXA Commercial",
            insuranceExpiry: /* @__PURE__ */ new Date("2024-12-20"),
            qualifications: ["Gas Safe Commercial", "City & Guilds Advanced", "OFTEC Oil"],
            serviceAreas: ["East London", "Central London", "Essex"],
            averageRating: "4.4",
            totalJobs: 67,
            status: "suspended",
            verificationDate: /* @__PURE__ */ new Date("2024-01-20"),
            notes: "Michael Johnson - Gas Engineer. Suspended pending investigation of customer complaint. Insurance expires soon. Business: Johnson Gas & Heating (\xA310M public liability). Services: Commercial Heating, Gas Safety, System Maintenance. Phone: 07321654987"
          }
        ];
        for (const engineer of engineerData) {
          try {
            await db.insert(engineerProfiles).values([engineer]);
          } catch (error) {
            console.error("Error inserting engineer profile:", error);
          }
        }
        const cylinderData = [
          // Megaflo Unvented Cylinders - Standard Tier
          { make: "Heatrae Sadia", model: "Megaflo Eco 125L", capacity: 125, cylinderType: "unvented", tier: "standard", supplyPrice: 58500, warranty: 10, height: 1050, diameter: 450, weight: 45, maxPressure: 6, coilType: "single" },
          { make: "Heatrae Sadia", model: "Megaflo Eco 150L", capacity: 150, cylinderType: "unvented", tier: "standard", supplyPrice: 64500, warranty: 10, height: 1200, diameter: 450, weight: 52, maxPressure: 6, coilType: "single" },
          { make: "Heatrae Sadia", model: "Megaflo Eco 210L", capacity: 210, cylinderType: "unvented", tier: "standard", supplyPrice: 72500, warranty: 10, height: 1530, diameter: 450, weight: 68, maxPressure: 6, coilType: "single" },
          { make: "Heatrae Sadia", model: "Megaflo Eco 250L", capacity: 250, cylinderType: "unvented", tier: "standard", supplyPrice: 78500, warranty: 10, height: 1730, diameter: 450, weight: 75, maxPressure: 6, coilType: "single" },
          { make: "Heatrae Sadia", model: "Megaflo Eco 300L", capacity: 300, cylinderType: "unvented", tier: "standard", supplyPrice: 84500, warranty: 10, height: 1930, diameter: 450, weight: 82, maxPressure: 6, coilType: "single" },
          { make: "Heatrae Sadia", model: "Megaflo Eco 350L", capacity: 350, cylinderType: "unvented", tier: "standard", supplyPrice: 92500, warranty: 10, height: 2130, diameter: 450, weight: 89, maxPressure: 6, coilType: "single" },
          // Megaflo Unvented Cylinders - Premium Tier
          { make: "Heatrae Sadia", model: "Megaflo CL 125L", capacity: 125, cylinderType: "unvented", tier: "premium", supplyPrice: 68500, warranty: 15, height: 1050, diameter: 450, weight: 48, maxPressure: 6, coilType: "twin" },
          { make: "Heatrae Sadia", model: "Megaflo CL 150L", capacity: 150, cylinderType: "unvented", tier: "premium", supplyPrice: 74500, warranty: 15, height: 1200, diameter: 450, weight: 55, maxPressure: 6, coilType: "twin" },
          { make: "Heatrae Sadia", model: "Megaflo CL 210L", capacity: 210, cylinderType: "unvented", tier: "premium", supplyPrice: 82500, warranty: 15, height: 1530, diameter: 450, weight: 71, maxPressure: 6, coilType: "twin" },
          { make: "Heatrae Sadia", model: "Megaflo CL 250L", capacity: 250, cylinderType: "unvented", tier: "premium", supplyPrice: 88500, warranty: 15, height: 1730, diameter: 450, weight: 78, maxPressure: 6, coilType: "twin" },
          { make: "Heatrae Sadia", model: "Megaflo CL 300L", capacity: 300, cylinderType: "unvented", tier: "premium", supplyPrice: 94500, warranty: 15, height: 1930, diameter: 450, weight: 85, maxPressure: 6, coilType: "twin" },
          { make: "Heatrae Sadia", model: "Megaflo CL 350L", capacity: 350, cylinderType: "unvented", tier: "premium", supplyPrice: 102500, warranty: 15, height: 2130, diameter: 450, weight: 92, maxPressure: 6, coilType: "twin" },
          // Alternative Manufacturers
          { make: "OSO", model: "Super S 150L", capacity: 150, cylinderType: "unvented", tier: "premium", supplyPrice: 78500, warranty: 10, height: 1200, diameter: 450, weight: 56, maxPressure: 6, coilType: "single" },
          { make: "OSO", model: "Super S 210L", capacity: 210, cylinderType: "unvented", tier: "premium", supplyPrice: 86500, warranty: 10, height: 1530, diameter: 450, weight: 73, maxPressure: 6, coilType: "single" },
          { make: "Joule", model: "Cyclone 150L", capacity: 150, cylinderType: "unvented", tier: "standard", supplyPrice: 62500, warranty: 10, height: 1200, diameter: 450, weight: 50, maxPressure: 6, coilType: "single" },
          { make: "Joule", model: "Cyclone 210L", capacity: 210, cylinderType: "unvented", tier: "standard", supplyPrice: 70500, warranty: 10, height: 1530, diameter: 450, weight: 66, maxPressure: 6, coilType: "single" },
          // Vented Cylinders
          { make: "Copper", model: "Vented 120L", capacity: 120, cylinderType: "vented", tier: "standard", supplyPrice: 28500, warranty: 5, height: 1e3, diameter: 400, weight: 32, maxPressure: 1.5, coilType: "single" },
          { make: "Copper", model: "Vented 150L", capacity: 150, cylinderType: "vented", tier: "standard", supplyPrice: 32500, warranty: 5, height: 1200, diameter: 400, weight: 36, maxPressure: 1.5, coilType: "single" },
          { make: "Copper", model: "Vented 210L", capacity: 210, cylinderType: "vented", tier: "standard", supplyPrice: 38500, warranty: 5, height: 1530, diameter: 400, weight: 44, maxPressure: 1.5, coilType: "single" }
        ];
        for (const cylinder of cylinderData) {
          try {
            await db.insert(cylinders).values([cylinder]);
          } catch (error) {
            console.error("Error inserting cylinder:", error);
          }
        }
        const heatingSundriesData = [
          { category: "Boiler Components", itemType: "Flue Kit", itemName: "Boiler Flue Kit", tier: "standard", specification: "BS EN 14471 compliant", priceLow: 8500, priceHigh: 15e3, notes: "Essential for safe operation" },
          { category: "Boiler Components", itemType: "Flue Extension", itemName: "Flue Extension Kit", tier: "standard", specification: "0.5m extension", priceLow: 4500, priceHigh: 7500, notes: "Per 0.5m section" },
          { category: "Boiler Components", itemType: "Flue Extension", itemName: "Flue Extension Kit", tier: "premium", specification: "1m extension", priceLow: 8e3, priceHigh: 12e3, notes: "Per 1m section" },
          { category: "Boiler Components", itemType: "Condensate Pump", itemName: "Condensate Pump", tier: "standard", specification: "Standard lift pump", priceLow: 12e3, priceHigh: 18e3, notes: "Required for certain installations" },
          { category: "Boiler Components", itemType: "Condensate Pump", itemName: "Condensate Pump", tier: "premium", specification: "High lift pump", priceLow: 18e3, priceHigh: 25e3, notes: "For difficult installations" },
          { category: "System Components", itemType: "System Filter", itemName: "Magnetic System Filter", tier: "standard", specification: "BS 7593:2019 compliant", priceLow: 12e3, priceHigh: 18e3, notes: "Essential for warranty" },
          { category: "System Components", itemType: "System Filter", itemName: "Magnetic System Filter", tier: "premium", specification: "High performance filter", priceLow: 18e3, priceHigh: 25e3, notes: "Superior protection" },
          { category: "System Components", itemType: "Chemical Flush", itemName: "Chemical Flush", tier: "standard", specification: "BS 7593:2019 mandatory", priceLow: 1e4, priceHigh: 15e3, notes: "Mandatory for new installations" },
          { category: "System Components", itemType: "Inhibitor", itemName: "System Inhibitor", tier: "standard", specification: "Corrosion protection", priceLow: 3500, priceHigh: 6500, notes: "Annual top-up required" },
          { category: "Controls", itemType: "Thermostat", itemName: "Basic Thermostat", tier: "standard", specification: "Standard room thermostat", priceLow: 8e3, priceHigh: 12e3, notes: "Basic temperature control" },
          { category: "Controls", itemType: "Thermostat", itemName: "Smart Thermostat", tier: "premium", specification: "WiFi enabled, app control", priceLow: 15e3, priceHigh: 25e3, notes: "Boiler Plus compliant" },
          { category: "Controls", itemType: "TRV", itemName: "Thermostatic Radiator Valve", tier: "standard", specification: "Standard TRV", priceLow: 1500, priceHigh: 2500, notes: "Per radiator" },
          { category: "Controls", itemType: "TRV", itemName: "Smart TRV", tier: "premium", specification: "WiFi enabled TRV", priceLow: 4500, priceHigh: 7500, notes: "Per radiator, app control" },
          { category: "Controls", itemType: "Zone Valve", itemName: "Zone Valve", tier: "standard", specification: "2-port motorised valve", priceLow: 8500, priceHigh: 12500, notes: "For zoned systems" },
          { category: "Controls", itemType: "Zone Valve", itemName: "3-Port Zone Valve", tier: "standard", specification: "3-port diverter valve", priceLow: 12e3, priceHigh: 18e3, notes: "For complex zoning" },
          { category: "Pipework", itemType: "Pipework", itemName: "Copper Pipework", tier: "standard", specification: "15mm/22mm copper", priceLow: 500, priceHigh: 1200, notes: "Per metre" },
          { category: "Pipework", itemType: "Pipework", itemName: "Plastic Pipework", tier: "standard", specification: "PEX or PB pipe", priceLow: 300, priceHigh: 800, notes: "Per metre" },
          { category: "Pipework", itemType: "Fittings", itemName: "Compression Fittings", tier: "standard", specification: "Brass fittings", priceLow: 200, priceHigh: 1500, notes: "Various sizes" },
          { category: "Pipework", itemType: "Fittings", itemName: "Push-fit Fittings", tier: "standard", specification: "Quick connection", priceLow: 150, priceHigh: 1200, notes: "Various sizes" },
          { category: "Pipework", itemType: "Insulation", itemName: "Pipe Insulation", tier: "standard", specification: "Foam insulation", priceLow: 300, priceHigh: 800, notes: "Per metre" },
          { category: "Safety Equipment", itemType: "Gas Safety", itemName: "Gas Safety Valve", tier: "standard", specification: "BS EN 161 compliant", priceLow: 4500, priceHigh: 8500, notes: "Safety requirement" },
          { category: "Safety Equipment", itemType: "Carbon Monoxide", itemName: "CO Detector", tier: "standard", specification: "BS EN 50291 compliant", priceLow: 2500, priceHigh: 5500, notes: "Safety requirement" },
          { category: "Safety Equipment", itemType: "Expansion Vessel", itemName: "Expansion Vessel", tier: "standard", specification: "12L capacity", priceLow: 6500, priceHigh: 12500, notes: "System pressure control" },
          { category: "Safety Equipment", itemType: "Pressure Relief", itemName: "Pressure Relief Valve", tier: "standard", specification: "3 bar relief", priceLow: 3500, priceHigh: 6500, notes: "Safety requirement" },
          { category: "Electrical", itemType: "Electrical Work", itemName: "Electrical Supply", tier: "standard", specification: "230V supply", priceLow: 12e3, priceHigh: 25e3, notes: "New electrical supply" },
          { category: "Electrical", itemType: "Electrical Work", itemName: "Electrical Upgrade", tier: "premium", specification: "Consumer unit upgrade", priceLow: 35e3, priceHigh: 65e3, notes: "Full electrical upgrade" },
          { category: "Electrical", itemType: "Fused Spur", itemName: "Fused Spur Unit", tier: "standard", specification: "13A fused spur", priceLow: 1500, priceHigh: 3500, notes: "Boiler electrical connection" },
          { category: "Installation Materials", itemType: "Brackets", itemName: "Boiler Brackets", tier: "standard", specification: "Wall mounting brackets", priceLow: 2500, priceHigh: 5500, notes: "Wall mounting system" },
          { category: "Installation Materials", itemType: "Brackets", itemName: "Cylinder Brackets", tier: "standard", specification: "Cylinder support brackets", priceLow: 3500, priceHigh: 7500, notes: "Cylinder mounting" },
          { category: "Installation Materials", itemType: "Fixings", itemName: "Wall Fixings", tier: "standard", specification: "Heavy duty fixings", priceLow: 1e3, priceHigh: 2500, notes: "Secure mounting" },
          { category: "Installation Materials", itemType: "Sundries", itemName: "General Sundries", tier: "standard", specification: "Miscellaneous items", priceLow: 2500, priceHigh: 7500, notes: "Various small items" },
          { category: "Testing Equipment", itemType: "Testing", itemName: "Gas Tightness Test", tier: "standard", specification: "Pressure testing", priceLow: 5e3, priceHigh: 8500, notes: "Safety requirement" },
          { category: "Testing Equipment", itemType: "Testing", itemName: "System Commissioning", tier: "standard", specification: "Full system test", priceLow: 12e3, priceHigh: 18e3, notes: "Performance verification" },
          { category: "Testing Equipment", itemType: "Certification", itemName: "Gas Safety Certificate", tier: "standard", specification: "CP12 certificate", priceLow: 8500, priceHigh: 12500, notes: "Legal requirement" },
          { category: "Testing Equipment", itemType: "Certification", itemName: "Building Regulations", tier: "standard", specification: "Building control notification", priceLow: 15e3, priceHigh: 25e3, notes: "Legal requirement" }
        ];
        for (const sundry of heatingSundriesData) {
          try {
            await db.insert(heatingSundries).values([sundry]);
          } catch (error) {
            console.error("Error inserting heating sundry:", error);
          }
        }
        console.log("Complete pricing data seeded successfully");
      }
      // Service Request Methods
      async createServiceRequest(serviceRequest) {
        const [created] = await db.insert(serviceRequests).values(serviceRequest).returning();
        return created;
      }
      async getServiceRequests() {
        return await db.select().from(serviceRequests);
      }
      async getServiceLeads(filters) {
        try {
          const requestsQuery = `
        SELECT id, service_type, service_name, service_icon, customer_name, 
               customer_email, customer_phone, postcode, urgency, description, 
               created_at, lead_price 
        FROM service_requests
        ${filters.serviceType ? `WHERE service_type = '${filters.serviceType}'` : ""}
        ${filters.postcode ? `${filters.serviceType ? "AND" : "WHERE"} postcode ILIKE '%${filters.postcode}%'` : ""}
      `;
          const purchasesQuery = `
        SELECT service_request_id, engineer_email, created_at 
        FROM lead_purchases
      `;
          const requestsResult = await db.execute(requestsQuery);
          const purchasesResult = await db.execute(purchasesQuery);
          const requests = requestsResult.rows;
          const purchases = purchasesResult.rows;
          return requests.map((request) => {
            const purchase = purchases.find((p) => p.service_request_id === request.id);
            const isPurchased = !!purchase;
            if (filters.showPurchasedOnly && !isPurchased) {
              return null;
            }
            return {
              id: request.id,
              serviceType: request.service_type,
              serviceName: request.service_name,
              serviceIcon: request.service_icon,
              description: request.description,
              urgency: request.urgency,
              postcode: request.postcode,
              createdAt: request.created_at,
              leadPrice: request.lead_price,
              isPurchased,
              customerDetails: isPurchased ? {
                name: request.customer_name,
                email: request.customer_email,
                phone: request.customer_phone,
                fullAddress: request.postcode
              } : void 0
            };
          }).filter(Boolean);
        } catch (error) {
          console.error("Error in getServiceLeads:", error);
          throw error;
        }
      }
      // Lead Purchase Methods
      async purchaseLead(purchase) {
        const query = `
      INSERT INTO lead_purchases 
      (id, service_request_id, engineer_id, engineer_email, purchase_price, payment_status, stripe_payment_id)
      VALUES ('${purchase.id}', '${purchase.serviceRequestId}', '${purchase.engineerId}', '${purchase.engineerEmail}', ${purchase.purchasePrice}, '${purchase.paymentStatus}', '${purchase.stripePaymentId || "NULL"}')
      RETURNING *
    `;
        const result = await db.execute(query);
        return result.rows[0];
      }
      async getLeadPurchases() {
        return await db.select().from(leadPurchases);
      }
      // Email Verification Methods
      async createEmailVerification(email, code) {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
        const [created] = await db.insert(emailVerifications).values({
          email,
          verificationCode: code,
          isVerified: false,
          expiresAt
        }).returning();
        return created;
      }
      async verifyEmailCode(email, code) {
        const [verification] = await db.select().from(emailVerifications).where(and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.verificationCode, code),
          eq(emailVerifications.isVerified, false)
        ));
        if (verification && verification.expiresAt > /* @__PURE__ */ new Date()) {
          await db.update(emailVerifications).set({ isVerified: true }).where(eq(emailVerifications.id, verification.id));
          return true;
        }
        return false;
      }
      // Contact Message Methods
      async createContactMessage(message) {
        const [created] = await db.insert(contactMessages).values({
          name: message.name,
          email: message.email,
          phone: message.phone,
          subject: message.subject,
          message: message.message,
          photoUrls: message.photoUrls || [],
          status: message.status || "new"
        }).returning();
        return { id: created.id };
      }
      async getContactMessages() {
        return await db.select().from(contactMessages);
      }
      // Additional methods required by the interface
      async deleteUser(id) {
        await db.delete(users).where(eq(users.id, id));
      }
      async getAdminUsers() {
        return await db.select().from(users).where(eq(users.userType, "admin"));
      }
      async hashPassword(password) {
        const bcrypt2 = await import("bcrypt");
        return bcrypt2.hash(password, 10);
      }
      async getSupportTickets() {
        return [
          {
            id: 1,
            subject: "Installation Issue",
            status: "open",
            priority: "high",
            customer: "John Doe",
            created: (/* @__PURE__ */ new Date()).toISOString(),
            messages: [
              { id: 1, content: "Having trouble with boiler installation", author: "customer" }
            ]
          }
        ];
      }
      async createTicketReply(reply) {
        return {
          id: Date.now(),
          ...reply,
          created: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      async updateTicketStatus(id, status) {
        return { id, status, updated: (/* @__PURE__ */ new Date()).toISOString() };
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/uk-heating-scenarios.ts
function findBestMatchingScenario(bedrooms, bathrooms, occupants, propertyType, preferredSystem) {
  const scoreScenario = (scenario) => {
    let score = 0;
    const desc = scenario.propertyDescription.toLowerCase();
    if (desc.includes(`${bedrooms}-bed`)) score += 100;
    else if (desc.includes(`${bedrooms + 1}-bed`) || desc.includes(`${bedrooms - 1}-bed`)) score += 50;
    if (desc.includes(`${bathrooms} bath`)) score += 80;
    else if (desc.includes(`${bathrooms + 1} bath`) || desc.includes(`${bathrooms - 1} bath`)) score += 40;
    if (desc.includes(`${occupants} occ`)) score += 60;
    else if (desc.includes(`${occupants + 1} occ`) || desc.includes(`${occupants - 1} occ`)) score += 30;
    if (propertyType === "Flat" && desc.includes("flat")) score += 40;
    else if (propertyType === "House" && !desc.includes("flat")) score += 40;
    if (preferredSystem && scenario.systemType.toLowerCase().includes(preferredSystem.toLowerCase())) {
      score += 20;
    }
    return score;
  };
  let bestMatch = null;
  let bestScore = 0;
  for (const scenario of ukHeatingScenarios) {
    const score = scoreScenario(scenario);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }
  return bestScore > 50 ? bestMatch : null;
}
function getBoilerSizeRecommendations(bedrooms, bathrooms, occupants, systemType) {
  const relevantScenarios = ukHeatingScenarios.filter((scenario) => {
    const desc = scenario.propertyDescription.toLowerCase();
    const matchesSystem = scenario.systemType.toLowerCase().includes(systemType.toLowerCase());
    const roughlyMatches = desc.includes(`${bedrooms}-bed`) || desc.includes(`${bedrooms + 1}-bed`) || desc.includes(`${bedrooms - 1}-bed`);
    return matchesSystem && roughlyMatches;
  });
  if (relevantScenarios.length === 0) {
    if (systemType === "Combi") {
      return { min: 24, recommended: 28, max: 42 };
    } else {
      return { min: 18, recommended: 28, max: 40 };
    }
  }
  const powers = relevantScenarios.map((s) => s.boilerPowerKw);
  return {
    min: Math.min(...powers),
    recommended: Math.round(powers.reduce((a, b) => a + b, 0) / powers.length),
    max: Math.max(...powers)
  };
}
function getCylinderSizeRecommendations(bedrooms, bathrooms, occupants) {
  const relevantScenarios = ukHeatingScenarios.filter((scenario) => {
    const desc = scenario.propertyDescription.toLowerCase();
    const hasCylinder = scenario.cylinderSizeL !== null;
    const roughlyMatches = desc.includes(`${bedrooms}-bed`) || desc.includes(`${bedrooms + 1}-bed`) || desc.includes(`${bedrooms - 1}-bed`);
    return hasCylinder && roughlyMatches;
  });
  if (relevantScenarios.length === 0) {
    return { min: 150, recommended: 210, max: 300 };
  }
  const sizes = relevantScenarios.map((s) => s.cylinderSizeL);
  return {
    min: Math.min(...sizes),
    recommended: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
    max: Math.max(...sizes)
  };
}
var ukHeatingScenarios;
var init_uk_heating_scenarios = __esm({
  "server/uk-heating-scenarios.ts"() {
    "use strict";
    ukHeatingScenarios = [
      {
        scenarioId: "1a",
        propertyDescription: "1-Bed Flat, 1 Bath, 2 Occ.",
        systemType: "Combi",
        boilerPowerKw: 24,
        cylinderSizeL: null,
        flueType: "Standard Horizontal",
        boilerCost: 750,
        cylinderCost: 0,
        flueCost: 90,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1e3,
        totalCost: 2150
      },
      {
        scenarioId: "1b",
        propertyDescription: "1-Bed Flat, 1 Bath, 2 Occ.",
        systemType: "Combi",
        boilerPowerKw: 24,
        cylinderSizeL: null,
        flueType: "Vertical",
        boilerCost: 750,
        cylinderCost: 0,
        flueCost: 150,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1350,
        totalCost: 2560
      },
      {
        scenarioId: "2a",
        propertyDescription: "2-Bed Terrace, 1 Bath, 3 Occ.",
        systemType: "Combi",
        boilerPowerKw: 30,
        cylinderSizeL: null,
        flueType: "Standard Horizontal",
        boilerCost: 950,
        cylinderCost: 0,
        flueCost: 90,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1100,
        totalCost: 2450
      },
      {
        scenarioId: "2b",
        propertyDescription: "2-Bed Terrace, 1 Bath, 3 Occ.",
        systemType: "Combi",
        boilerPowerKw: 30,
        cylinderSizeL: null,
        flueType: "Vertical",
        boilerCost: 950,
        cylinderCost: 0,
        flueCost: 150,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1450,
        totalCost: 2860
      },
      {
        scenarioId: "3a",
        propertyDescription: "3-Bed Semi, 2 Bath, 4 Occ.",
        systemType: "Combi",
        boilerPowerKw: 35,
        cylinderSizeL: null,
        flueType: "Standard Horizontal",
        boilerCost: 1100,
        cylinderCost: 0,
        flueCost: 100,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1150,
        totalCost: 2660
      },
      {
        scenarioId: "3b",
        propertyDescription: "3-Bed Semi, 2 Bath, 4 Occ.",
        systemType: "Combi",
        boilerPowerKw: 35,
        cylinderSizeL: null,
        flueType: "Vertical",
        boilerCost: 1100,
        cylinderCost: 0,
        flueCost: 160,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1500,
        totalCost: 3070
      },
      {
        scenarioId: "4a",
        propertyDescription: "4-Bed House, 2 Bath, 5 Occ.",
        systemType: "High-Output Combi",
        boilerPowerKw: 40,
        cylinderSizeL: null,
        flueType: "Standard Horizontal",
        boilerCost: 1350,
        cylinderCost: 0,
        flueCost: 100,
        filterCost: 120,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1200,
        totalCost: 2970
      },
      {
        scenarioId: "4b",
        propertyDescription: "4-Bed House, 2 Bath, 5 Occ.",
        systemType: "High-Output Combi",
        boilerPowerKw: 40,
        cylinderSizeL: null,
        flueType: "Horizontal + 1m Ext.",
        boilerCost: 1350,
        cylinderCost: 0,
        flueCost: 150,
        filterCost: 120,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1300,
        totalCost: 3120
      },
      {
        scenarioId: "5a",
        propertyDescription: "4-Bed Detached, 2 Bath, 5 Occ.",
        systemType: "System",
        boilerPowerKw: 28,
        cylinderSizeL: 170,
        flueType: "Standard Horizontal",
        boilerCost: 1050,
        cylinderCost: 900,
        flueCost: 90,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1600,
        totalCost: 3965
      },
      {
        scenarioId: "5b",
        propertyDescription: "4-Bed Detached, 2 Bath, 5 Occ.",
        systemType: "System",
        boilerPowerKw: 28,
        cylinderSizeL: 170,
        flueType: "Vertical",
        boilerCost: 1050,
        cylinderCost: 900,
        flueCost: 150,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1900,
        totalCost: 4325
      },
      {
        scenarioId: "6a",
        propertyDescription: "4-Bed House, 3 Bath, 6 Occ.",
        systemType: "System",
        boilerPowerKw: 28,
        cylinderSizeL: 210,
        flueType: "Standard Horizontal",
        boilerCost: 1050,
        cylinderCost: 980,
        flueCost: 90,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1650,
        totalCost: 4095
      },
      {
        scenarioId: "6b",
        propertyDescription: "4-Bed House, 3 Bath, 6 Occ.",
        systemType: "System",
        boilerPowerKw: 28,
        cylinderSizeL: 210,
        flueType: "Vertical",
        boilerCost: 1050,
        cylinderCost: 980,
        flueCost: 150,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1950,
        totalCost: 4455
      },
      {
        scenarioId: "7a",
        propertyDescription: "5-Bed Family Home, 3 Bath, 6 Occ.",
        systemType: "System",
        boilerPowerKw: 30,
        cylinderSizeL: 210,
        flueType: "Standard Horizontal",
        boilerCost: 1150,
        cylinderCost: 980,
        flueCost: 100,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1700,
        totalCost: 4255
      },
      {
        scenarioId: "7b",
        propertyDescription: "5-Bed Family Home, 3 Bath, 6 Occ.",
        systemType: "System",
        boilerPowerKw: 30,
        cylinderSizeL: 210,
        flueType: "Vertical",
        boilerCost: 1150,
        cylinderCost: 980,
        flueCost: 160,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2e3,
        totalCost: 4615
      },
      {
        scenarioId: "8a",
        propertyDescription: "Large 5-Bed House, 3 Bath, 7 Occ.",
        systemType: "System",
        boilerPowerKw: 35,
        cylinderSizeL: 250,
        flueType: "Standard Horizontal",
        boilerCost: 1250,
        cylinderCost: 1150,
        flueCost: 100,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1800,
        totalCost: 4625
      },
      {
        scenarioId: "8b",
        propertyDescription: "Large 5-Bed House, 3 Bath, 7 Occ.",
        systemType: "System",
        boilerPowerKw: 35,
        cylinderSizeL: 250,
        flueType: "Vertical",
        boilerCost: 1250,
        cylinderCost: 1150,
        flueCost: 160,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2100,
        totalCost: 4985
      },
      {
        scenarioId: "9a",
        propertyDescription: "6-Bed House, 4 Bath, 8 Occ.",
        systemType: "System",
        boilerPowerKw: 35,
        cylinderSizeL: 300,
        flueType: "Standard Horizontal",
        boilerCost: 1250,
        cylinderCost: 1280,
        flueCost: 100,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1900,
        totalCost: 4855
      },
      {
        scenarioId: "9b",
        propertyDescription: "6-Bed House, 4 Bath, 8 Occ.",
        systemType: "System",
        boilerPowerKw: 35,
        cylinderSizeL: 300,
        flueType: "Vertical",
        boilerCost: 1250,
        cylinderCost: 1280,
        flueCost: 160,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2200,
        totalCost: 5215
      },
      {
        scenarioId: "10a",
        propertyDescription: "7-Bed Large Property, 5 Bath, 8+ Occ.",
        systemType: "System",
        boilerPowerKw: 40,
        cylinderSizeL: 300,
        flueType: "Standard Horizontal",
        boilerCost: 1400,
        cylinderCost: 1280,
        flueCost: 110,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2e3,
        totalCost: 5115
      },
      {
        scenarioId: "10b",
        propertyDescription: "7-Bed Large Property, 5 Bath, 8+ Occ.",
        systemType: "System",
        boilerPowerKw: 40,
        cylinderSizeL: 300,
        flueType: "Vertical",
        boilerCost: 1400,
        cylinderCost: 1280,
        flueCost: 170,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2300,
        totalCost: 5475
      },
      {
        scenarioId: "11a",
        propertyDescription: "8-Bed House / HMO, 6 Bath, 8+ Occ.",
        systemType: "System",
        boilerPowerKw: 50,
        cylinderSizeL: 400,
        flueType: "Standard Horizontal",
        boilerCost: 1800,
        cylinderCost: 2100,
        flueCost: 120,
        filterCost: 130,
        chemicalsCost: 50,
        controlsCost: 160,
        labourCost: 2200,
        totalCost: 6560
      },
      {
        scenarioId: "11b",
        propertyDescription: "8-Bed House / HMO, 6 Bath, 8+ Occ.",
        systemType: "System",
        boilerPowerKw: 50,
        cylinderSizeL: 400,
        flueType: "Vertical",
        boilerCost: 1800,
        cylinderCost: 2100,
        flueCost: 180,
        filterCost: 130,
        chemicalsCost: 50,
        controlsCost: 160,
        labourCost: 2500,
        totalCost: 6920
      },
      {
        scenarioId: "12a",
        propertyDescription: "10-Bed Large Residence, 8 Bath, 10+ Occ.",
        systemType: "System",
        boilerPowerKw: 60,
        cylinderSizeL: 500,
        flueType: "Standard Horizontal",
        boilerCost: 2200,
        cylinderCost: 2550,
        flueCost: 130,
        filterCost: 130,
        chemicalsCost: 50,
        controlsCost: 160,
        labourCost: 2500,
        totalCost: 7720
      },
      {
        scenarioId: "12b",
        propertyDescription: "10-Bed Large Residence, 8 Bath, 10+ Occ.",
        systemType: "System",
        boilerPowerKw: 60,
        cylinderSizeL: 500,
        flueType: "Vertical",
        boilerCost: 2200,
        cylinderCost: 2550,
        flueCost: 190,
        filterCost: 130,
        chemicalsCost: 50,
        controlsCost: 160,
        labourCost: 2800,
        totalCost: 8080
      },
      // Additional scenarios for flats and apartments
      {
        scenarioId: "13a",
        propertyDescription: "2-Bed Flat, 1 Bath, 2 Occ.",
        systemType: "Combi",
        boilerPowerKw: 24,
        cylinderSizeL: null,
        flueType: "Standard Horizontal",
        boilerCost: 750,
        cylinderCost: 0,
        flueCost: 90,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1e3,
        totalCost: 2150
      },
      {
        scenarioId: "13b",
        propertyDescription: "2-Bed Flat, 1 Bath, 2 Occ.",
        systemType: "Combi",
        boilerPowerKw: 24,
        cylinderSizeL: null,
        flueType: "Vertical",
        boilerCost: 750,
        cylinderCost: 0,
        flueCost: 150,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1350,
        totalCost: 2560
      },
      {
        scenarioId: "14a",
        propertyDescription: "3-Bed Flat, 2 Bath, 4 Occ.",
        systemType: "Combi",
        boilerPowerKw: 30,
        cylinderSizeL: null,
        flueType: "Standard Horizontal",
        boilerCost: 950,
        cylinderCost: 0,
        flueCost: 90,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1100,
        totalCost: 2450
      },
      {
        scenarioId: "14b",
        propertyDescription: "3-Bed Flat, 2 Bath, 4 Occ.",
        systemType: "Combi",
        boilerPowerKw: 30,
        cylinderSizeL: null,
        flueType: "Vertical",
        boilerCost: 950,
        cylinderCost: 0,
        flueCost: 150,
        filterCost: 110,
        chemicalsCost: 40,
        controlsCost: 160,
        labourCost: 1450,
        totalCost: 2860
      },
      // Regular boiler scenarios
      {
        scenarioId: "15a",
        propertyDescription: "4-Bed Period House, 2 Bath, 5 Occ.",
        systemType: "Regular",
        boilerPowerKw: 30,
        cylinderSizeL: 210,
        flueType: "Standard Horizontal",
        boilerCost: 1200,
        cylinderCost: 980,
        flueCost: 100,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1800,
        totalCost: 4405
      },
      {
        scenarioId: "15b",
        propertyDescription: "4-Bed Period House, 2 Bath, 5 Occ.",
        systemType: "Regular",
        boilerPowerKw: 30,
        cylinderSizeL: 210,
        flueType: "Vertical",
        boilerCost: 1200,
        cylinderCost: 980,
        flueCost: 160,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2100,
        totalCost: 4765
      },
      {
        scenarioId: "16a",
        propertyDescription: "5-Bed Victorian House, 3 Bath, 6 Occ.",
        systemType: "Regular",
        boilerPowerKw: 35,
        cylinderSizeL: 250,
        flueType: "Standard Horizontal",
        boilerCost: 1350,
        cylinderCost: 1150,
        flueCost: 100,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 1900,
        totalCost: 4825
      },
      {
        scenarioId: "16b",
        propertyDescription: "5-Bed Victorian House, 3 Bath, 6 Occ.",
        systemType: "Regular",
        boilerPowerKw: 35,
        cylinderSizeL: 250,
        flueType: "Vertical",
        boilerCost: 1350,
        cylinderCost: 1150,
        flueCost: 160,
        filterCost: 120,
        chemicalsCost: 45,
        controlsCost: 160,
        labourCost: 2200,
        totalCost: 5185
      }
    ];
  }
});

// server/boiler-conversion-scenarios.ts
function findBestConversionScenario(bedrooms, bathrooms, occupants, currentSystem = "existing") {
  const scoreScenario = (scenario) => {
    let score = 0;
    const descBedrooms = extractNumber(scenario.propertyDescription, /(\d+)-bedroom/);
    const descBathrooms = extractNumber(scenario.propertyDescription, /(\d+)\s+bath/);
    const descOccupants = extractOccupantsFromDescription(scenario.occupants);
    if (descBedrooms) {
      score += bedrooms === descBedrooms ? 30 : Math.max(0, 20 - Math.abs(bedrooms - descBedrooms) * 5);
    }
    if (descBathrooms) {
      score += bathrooms === descBathrooms ? 40 : Math.max(0, 30 - Math.abs(bathrooms - descBathrooms) * 10);
    }
    if (descOccupants) {
      score += occupants === descOccupants ? 20 : Math.max(0, 15 - Math.abs(occupants - descOccupants) * 3);
    }
    if (currentSystem.toLowerCase().includes("combi") && scenario.currentSystem.toLowerCase().includes("combi")) {
      score += 5;
    } else if (currentSystem.toLowerCase().includes("system") && scenario.currentSystem.toLowerCase().includes("system")) {
      score += 5;
    }
    return score;
  };
  const scoredScenarios = boilerConversionScenarios.map((scenario) => ({
    scenario,
    score: scoreScenario(scenario)
  }));
  scoredScenarios.sort((a, b) => b.score - a.score);
  return scoredScenarios.length > 0 ? scoredScenarios[0].scenario : null;
}
function extractNumber(text2, regex) {
  const match = text2.match(regex);
  return match ? parseInt(match[1]) : null;
}
function extractOccupantsFromDescription(description) {
  if (description.includes("1-2")) return 1.5;
  if (description.includes("2-3")) return 2.5;
  if (description.includes("3-4")) return 3.5;
  if (description.includes("family of 4")) return 4;
  if (description.includes("family of 5")) return 5;
  if (description.includes("couple")) return 2;
  if (description.includes("adults")) {
    const match = description.match(/(\d+)\s+adults/);
    return match ? parseInt(match[1]) : null;
  }
  return null;
}
function getConversionRecommendations(bedrooms, bathrooms, occupants, currentSystem = "existing") {
  const bestMatch = findBestConversionScenario(bedrooms, bathrooms, occupants, currentSystem);
  if (bestMatch) {
    const systemType = bestMatch.recommendation.includes("System") ? "System" : bestMatch.recommendation.includes("Regular") ? "Regular" : "Combi";
    return {
      recommendedSystem: systemType,
      boilerSize: bestMatch.kWOutput || 30,
      cylinderSize: bestMatch.cylinderSize,
      reasoning: bestMatch.reasoning,
      matchedScenario: bestMatch
    };
  }
  if (bathrooms >= 3) {
    return {
      recommendedSystem: "System",
      boilerSize: 32,
      cylinderSize: 250,
      reasoning: "3+ bathrooms require system boiler for simultaneous hot water usage"
    };
  } else if (bathrooms === 2 && (bedrooms >= 4 || occupants >= 4)) {
    return {
      recommendedSystem: "System",
      boilerSize: 28,
      cylinderSize: 210,
      reasoning: "Large 2-bathroom property with high occupancy - system boiler recommended"
    };
  } else {
    return {
      recommendedSystem: "Combi",
      boilerSize: bathrooms === 2 ? 35 : 30,
      reasoning: "Single or low-demand bathroom setup - combi boiler suitable"
    };
  }
}
var boilerConversionScenarios;
var init_boiler_conversion_scenarios = __esm({
  "server/boiler-conversion-scenarios.ts"() {
    "use strict";
    boilerConversionScenarios = [
      {
        id: "1",
        propertyDescription: "1-bedroom flat, 1 bathroom (with shower)",
        occupants: "1-2 adults",
        currentSystem: "Old system boiler with a 120L vented cylinder",
        recommendation: "Combi Boiler Conversion",
        recommendedSpecification: "24-28kW Combi, ~10-12 LPM flow rate",
        flowRateLPM: 12,
        kWOutput: 26,
        reasoning: "Single bathroom, low occupancy - combi ideal for space saving and efficiency"
      },
      {
        id: "2",
        propertyDescription: "2-bedroom terraced house, 1 bathroom",
        occupants: "2-3 people",
        currentSystem: "Conventional boiler with tanks in loft and cylinder",
        recommendation: "Combi Boiler Conversion",
        recommendedSpecification: "30kW Combi, ~12-13 LPM flow rate",
        flowRateLPM: 13,
        kWOutput: 30,
        reasoning: "Single bathroom household - combi provides good performance and removes loft tanks"
      },
      {
        id: "3",
        propertyDescription: "2-bedroom apartment with no existing gas boiler",
        occupants: "2 adults",
        currentSystem: "Electric storage heaters and standalone immersion cylinder",
        recommendation: "New Gas Combi Boiler Installation",
        recommendedSpecification: "30kW Combi, ~12-13 LPM flow rate",
        flowRateLPM: 13,
        kWOutput: 30,
        reasoning: "New gas installation - combi provides instant heating and hot water"
      },
      {
        id: "4",
        propertyDescription: "3-bedroom semi-detached house, 1 main bathroom",
        occupants: "A family of 3-4",
        currentSystem: "Old system boiler and a vented cylinder",
        recommendation: "Combi Boiler Conversion",
        recommendedSpecification: "32-35kW Combi, ~13-15 LPM flow rate",
        flowRateLPM: 14,
        kWOutput: 34,
        reasoning: "Single bathroom family home - high-power combi handles increased demand"
      },
      {
        id: "5",
        propertyDescription: "3-bedroom house, 1 main bathroom (mixer), 1 ensuite (electric)",
        occupants: "A family of 4",
        currentSystem: "Conventional boiler with cylinder",
        recommendation: "Combi Boiler Conversion",
        recommendedSpecification: "35kW Combi, ~14-15 LPM flow rate",
        flowRateLPM: 15,
        kWOutput: 35,
        reasoning: "Two bathrooms but only one on gas - powerful combi can handle main bathroom demand"
      },
      {
        id: "6",
        propertyDescription: "2-bedroom bungalow, 1 bathroom",
        occupants: "An elderly couple",
        currentSystem: "Old floor-standing regular boiler with cylinder",
        recommendation: "Combi Boiler Conversion",
        recommendedSpecification: "28-30kW Combi, ~12 LPM flow rate",
        flowRateLPM: 12,
        kWOutput: 29,
        reasoning: "Low occupancy, single bathroom - combi ideal for simplicity and efficiency"
      },
      {
        id: "7",
        propertyDescription: "2-bedroom rental property, 1 bathroom",
        occupants: "Tenants",
        currentSystem: "Inefficient system boiler and cylinder",
        recommendation: "Combi Boiler Conversion",
        recommendedSpecification: "Budget-tier 28kW Combi, ~11-12 LPM flow rate",
        flowRateLPM: 12,
        kWOutput: 28,
        reasoning: "Rental property - cost-effective combi solution with reliable performance"
      },
      {
        id: "8",
        propertyDescription: "3-bedroom house, 2 mixer showers",
        occupants: "A family of 4",
        currentSystem: "System boiler and vented cylinder",
        recommendation: "System Boiler Upgrade Strongly Advised",
        recommendedSpecification: "24kW System Boiler with 170L unvented cylinder",
        kWOutput: 24,
        cylinderSize: 170,
        reasoning: "Multiple mixer showers require simultaneous hot water - system boiler essential"
      },
      {
        id: "9",
        propertyDescription: "4-bedroom house, 1 bath, 1 ensuite",
        occupants: "A family of 5 who value good water pressure",
        currentSystem: "Old conventional boiler",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "28kW System Boiler with 210L unvented cylinder",
        kWOutput: 28,
        cylinderSize: 210,
        reasoning: "Multiple bathrooms, large family - system boiler provides consistent pressure and flow"
      },
      {
        id: "10",
        propertyDescription: "3-bedroom apartment, 1 luxury bathroom with 'rainfall' shower",
        occupants: "2 adults",
        currentSystem: "Electric immersion cylinder",
        recommendation: "System Boiler Installation",
        recommendedSpecification: "24kW System Boiler with 150L-170L unvented cylinder",
        kWOutput: 24,
        cylinderSize: 160,
        reasoning: "Luxury bathroom with high-flow shower head requires stored hot water system"
      },
      {
        id: "11",
        propertyDescription: "3-bedroom house, 1 bathroom, with plans to add an ensuite",
        occupants: "A young couple",
        currentSystem: "Old system boiler and cylinder",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "24kW System Boiler with 170L unvented cylinder",
        kWOutput: 24,
        cylinderSize: 170,
        reasoning: "Future-proofing for additional bathroom - system boiler handles expansion"
      },
      {
        id: "12",
        propertyDescription: "2-bedroom cottage with low mains water pressure",
        occupants: "2 adults",
        currentSystem: "Conventional boiler with loft tanks",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "24kW System Boiler with 150L unvented cylinder",
        kWOutput: 24,
        cylinderSize: 150,
        reasoning: "Low mains pressure - unvented cylinder provides improved flow and pressure"
      },
      {
        id: "13",
        propertyDescription: "4-Bed, 2-Bath, 1-Ensuite House",
        occupants: "Large family",
        currentSystem: "Various existing systems",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "28kW System Boiler with 210L cylinder",
        kWOutput: 28,
        cylinderSize: 210,
        reasoning: "Multiple bathrooms in large house - system boiler mandatory for simultaneous use"
      },
      {
        id: "14",
        propertyDescription: "5-Bed, 3-Bath Family Home",
        occupants: "Large family",
        currentSystem: "Various existing systems",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "32kW System Boiler with 250L cylinder",
        kWOutput: 32,
        cylinderSize: 250,
        reasoning: "3+ bathrooms require system boiler - large cylinder for high occupancy"
      },
      {
        id: "15",
        propertyDescription: "Property with 3+ Mixer Showers",
        occupants: "Various",
        currentSystem: "Various existing systems",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "32kW System Boiler with 300L cylinder",
        kWOutput: 32,
        cylinderSize: 300,
        reasoning: "Multiple mixer showers - only system boiler can provide adequate simultaneous flow"
      },
      {
        id: "16",
        propertyDescription: "Large House with Slow-Filling Baths",
        occupants: "Various",
        currentSystem: "Inadequate existing system",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "32kW System Boiler with 250L+ cylinder",
        kWOutput: 32,
        cylinderSize: 250,
        reasoning: "Large bath capacity requires substantial stored hot water volume"
      },
      {
        id: "17",
        propertyDescription: "6-Bed House with High Occupancy",
        occupants: "Large household",
        currentSystem: "Various existing systems",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "36kW System Boiler with 300L cylinder",
        kWOutput: 36,
        cylinderSize: 300,
        reasoning: "High occupancy requires maximum hot water storage and rapid recovery"
      },
      {
        id: "18",
        propertyDescription: "Home with Body-Jet Shower System",
        occupants: "Various",
        currentSystem: "Inadequate existing system",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "32kW System Boiler with 300L cylinder",
        kWOutput: 32,
        cylinderSize: 300,
        reasoning: "Body-jet systems require high flow rates - only achievable with stored hot water"
      },
      {
        id: "19",
        propertyDescription: "Small Guesthouse/HMO",
        occupants: "Multiple tenants",
        currentSystem: "Various existing systems",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "28kW System Boiler with 300L+ cylinder",
        kWOutput: 28,
        cylinderSize: 300,
        reasoning: "Multiple occupants with unpredictable usage patterns - large storage essential"
      },
      {
        id: "20",
        propertyDescription: "Property with multiple 'rainfall' showers",
        occupants: "Various",
        currentSystem: "Inadequate existing system",
        recommendation: "System Boiler Upgrade",
        recommendedSpecification: "32kW System Boiler with 300L+ cylinder",
        kWOutput: 32,
        cylinderSize: 300,
        reasoning: "Multiple high-flow shower heads - requires substantial stored hot water"
      }
    ];
  }
});

// server/intelligent-quote-engine.ts
var intelligent_quote_engine_exports = {};
__export(intelligent_quote_engine_exports, {
  calculateCylinderCapacity: () => calculateCylinderCapacity,
  calculateHeatLoad: () => calculateHeatLoad,
  calculateHotWaterDemand: () => calculateHotWaterDemand,
  calculateIntelligentQuote: () => calculateIntelligentQuote,
  calculateJobComplexity: () => calculateJobComplexity,
  calculateOptimalBoilerSize: () => calculateOptimalBoilerSize,
  determineOptimalBoilerType: () => determineOptimalBoilerType
});
function calculateHeatLoad(analysis) {
  const bedroomCount = parseInt(analysis.bedrooms.replace("+", "")) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  let radiatorCount = bedroomCount + bathroomCount;
  if (analysis.propertyType === "House") {
    radiatorCount += 3;
    radiatorCount += 1;
    if (bedroomCount >= 4) radiatorCount += 1;
    if (bedroomCount >= 5) radiatorCount += 1;
  } else {
    radiatorCount += 2;
    radiatorCount += 0.5;
  }
  let heatLoad = 0;
  if (analysis.propertyType === "House") {
    heatLoad = radiatorCount * 2;
    if (bedroomCount >= 4) heatLoad += 3;
    if (bedroomCount >= 5) heatLoad += 5;
  } else {
    heatLoad = radiatorCount * 1.7;
  }
  const minHeatLoadByProperty = {
    1: 12,
    // 1 bedroom minimum
    2: 18,
    // 2 bedroom minimum  
    3: 24,
    // 3 bedroom minimum
    4: 30,
    // 4 bedroom minimum
    5: 36
    // 5+ bedroom minimum
  };
  const minHeatLoad = minHeatLoadByProperty[Math.min(bedroomCount, 5)] || 36;
  heatLoad = Math.max(heatLoad, minHeatLoad);
  return Math.round(heatLoad);
}
function calculateHotWaterDemand(analysis) {
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  const peakBathroomDemand = bathroomCount * 10;
  const peakPersonalDemand = occupantCount * 2.5;
  const totalLitersPerMinute = Math.max(peakBathroomDemand, peakPersonalDemand);
  const hotWaterDemand = totalLitersPerMinute * 2.5;
  const simultaneousUsageBuffer = bathroomCount > 1 ? Math.min(bathroomCount * 2, 8) : 0;
  return Math.round(hotWaterDemand + simultaneousUsageBuffer);
}
function determineOptimalBoilerType(analysis) {
  const bedroomCount = parseInt(analysis.bedrooms.replace("+", "")) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  const currentBoilerType = analysis.currentBoiler.toLowerCase();
  const userPrefersCombi = currentBoilerType.includes("combi");
  const demandScore = bathroomCount + bathroomCount * 0.5;
  const COMBI_TIPPING_POINT = 2;
  console.log(`\u{1F525} GENIUS SYSTEM ANALYSIS:`, {
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    occupants: occupantCount,
    demandScore,
    tippingPoint: COMBI_TIPPING_POINT,
    userPrefersCombi
  });
  if (bathroomCount >= 6) {
    console.log(`\u{1F6A8} MANDATORY SYSTEM: 6+ bathrooms detected (${bathroomCount})`);
    return "System";
  }
  if (bedroomCount >= 6 && occupantCount >= 6) {
    console.log(`\u{1F6A8} MANDATORY SYSTEM: Very large house (${bedroomCount} bed) with high occupancy (${occupantCount} people)`);
    return "System";
  }
  if (userPrefersCombi) {
    if (bathroomCount >= 3 && bathroomCount <= 4) {
      console.log(`\u26A0\uFE0F  HIGH-OUTPUT COMBI: User prefers Combi, recommending 35-42kW high-output combi for ${bathroomCount} bathrooms`);
      return "Combi";
    }
    if (bedroomCount <= 2) {
      console.log(`\u2705 COMBI SUITABLE: User prefers Combi, small property (${bedroomCount} bed, ${bathroomCount} bath)`);
      return "Combi";
    }
    if (bedroomCount <= 3 && bathroomCount <= 3) {
      console.log(`\u2705 COMBI PREFERENCE: User prefers Combi, medium property (${bedroomCount} bed, ${bathroomCount} bath)`);
      return "Combi";
    }
  }
  if (bathroomCount === 1) {
    if (bedroomCount >= 5 && occupantCount >= 5) {
      console.log(`\u26A0\uFE0F  SYSTEM RECOMMENDED: Large single bathroom property with high occupancy`);
      return "System";
    }
    console.log(`\u2705 COMBI SUITABLE: Single bathroom property`);
    return "Combi";
  }
  if (bathroomCount === 2) {
    const simultaneousUsageLikely = occupantCount >= 4 || // Family with teenagers/children
    occupantCount >= 3 && bedroomCount >= 3 || // Multi-generational household
    bedroomCount >= 4;
    if (simultaneousUsageLikely) {
      console.log(`\u26A0\uFE0F  SYSTEM RECOMMENDED: 2 bathrooms with high simultaneous usage likelihood`);
      return "System";
    } else {
      console.log(`\u2705 HIGH-POWER COMBI: 2 bathrooms with low simultaneous usage`);
      return "Combi";
    }
  }
  if (analysis.currentBoiler.toLowerCase().includes("regular") || analysis.currentBoiler.toLowerCase().includes("conventional") || analysis.currentBoiler.toLowerCase().includes("heat only")) {
    if (bathroomCount >= 2 || bedroomCount >= 4) {
      console.log(`\u{1F527} REGULAR SYSTEM: Maintaining existing regular system for large property`);
      return "Regular";
    }
  }
  if (bedroomCount >= 5 && bathroomCount >= 3) {
    console.log(`\u{1F3F0} REGULAR SYSTEM: Premium property requires maximum capacity`);
    return "Regular";
  }
  console.log(`\u2705 DEFAULT COMBI: Standard small property`);
  return "Combi";
}
function calculateOptimalBoilerSize(analysis) {
  const heatLoad = calculateHeatLoad(analysis);
  const hotWaterDemand = calculateHotWaterDemand(analysis);
  const boilerType = determineOptimalBoilerType(analysis);
  const bedroomCount = parseInt(analysis.bedrooms.replace("+", "")) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  console.log(`\u{1F527} BOILER SIZING ANALYSIS:`, {
    heatLoad,
    hotWaterDemand,
    boilerType,
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    occupants: occupantCount
  });
  const conversionRecommendation = getConversionRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.currentBoiler
  );
  if (conversionRecommendation.matchedScenario) {
    console.log(`\u2705 CONVERSION SCENARIO MATCH:`, {
      scenario: conversionRecommendation.matchedScenario.id,
      system: conversionRecommendation.recommendedSystem,
      size: conversionRecommendation.boilerSize,
      cylinder: conversionRecommendation.cylinderSize
    });
    return conversionRecommendation.boilerSize;
  }
  const bestMatch = findBestMatchingScenario(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.propertyType,
    boilerType
  );
  if (bestMatch) {
    return bestMatch.boilerPowerKw;
  }
  const sizeRecommendations = getBoilerSizeRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount,
    boilerType
  );
  let recommendedSize = sizeRecommendations.recommended;
  if (boilerType === "Combi") {
    if (bedroomCount <= 2 && bathroomCount <= 1) {
      recommendedSize = Math.max(24, Math.min(27, Math.max(recommendedSize, heatLoad + 6)));
    } else if (bedroomCount <= 3 && bathroomCount <= 2) {
      recommendedSize = Math.max(28, Math.min(34, Math.max(recommendedSize, heatLoad + 8)));
    } else {
      recommendedSize = Math.max(35, Math.min(42, Math.max(recommendedSize, heatLoad + 10)));
    }
    if (bathroomCount >= 2) {
      recommendedSize = Math.max(recommendedSize, 32);
    }
  } else if (boilerType === "System" || boilerType === "Regular") {
    if (bedroomCount <= 2) {
      recommendedSize = Math.max(18, Math.min(30, Math.max(recommendedSize, heatLoad + 2)));
    } else if (bedroomCount <= 3) {
      recommendedSize = Math.max(24, Math.min(35, Math.max(recommendedSize, heatLoad + 3)));
    } else {
      recommendedSize = Math.max(28, Math.min(50, Math.max(recommendedSize, heatLoad + 4)));
    }
    if (bedroomCount >= 4) {
      recommendedSize = Math.max(recommendedSize, 28);
    }
    if (bedroomCount >= 5) {
      recommendedSize = Math.max(recommendedSize, 30);
    }
  }
  if (recommendedSize <= 24) return 24;
  if (recommendedSize <= 28) return 28;
  if (recommendedSize <= 30) return 30;
  if (recommendedSize <= 32) return 32;
  if (recommendedSize <= 35) return 35;
  if (recommendedSize <= 40) return 40;
  if (recommendedSize <= 42) return 42;
  if (recommendedSize <= 50) return 50;
  return 50;
}
function calculateCylinderCapacity(analysis) {
  const boilerType = determineOptimalBoilerType(analysis);
  if (boilerType === "Combi") return 0;
  const bedroomCount = parseInt(analysis.bedrooms.replace("+", "")) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  console.log(`\u{1F3FA} CYLINDER SIZING ANALYSIS:`, {
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    occupants: occupantCount,
    boilerType
  });
  const conversionRecommendation = getConversionRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.currentBoiler
  );
  if (conversionRecommendation.cylinderSize) {
    console.log(`\u2705 CONVERSION SCENARIO CYLINDER:`, {
      size: conversionRecommendation.cylinderSize,
      reasoning: conversionRecommendation.reasoning
    });
    return conversionRecommendation.cylinderSize;
  }
  const bestMatch = findBestMatchingScenario(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.propertyType,
    boilerType
  );
  if (bestMatch && bestMatch.cylinderSizeL) {
    console.log(`\u2705 UK SCENARIO CYLINDER:`, {
      size: bestMatch.cylinderSizeL,
      scenario: bestMatch.scenarioId
    });
    return bestMatch.cylinderSizeL;
  }
  const sizeRecommendations = getCylinderSizeRecommendations(
    bedroomCount,
    bathroomCount,
    occupantCount
  );
  let recommendedCapacity = sizeRecommendations.recommended;
  if (bedroomCount <= 1 && bathroomCount <= 1) {
    recommendedCapacity = Math.max(120, Math.min(150, Math.max(recommendedCapacity, occupantCount * 45 + bathroomCount * 30)));
  } else if (bedroomCount <= 2 && bathroomCount <= 1) {
    recommendedCapacity = Math.max(150, Math.min(180, Math.max(recommendedCapacity, occupantCount * 42 + bathroomCount * 35)));
  } else if (bedroomCount <= 3 && bathroomCount <= 2) {
    recommendedCapacity = Math.max(180, Math.min(250, Math.max(recommendedCapacity, occupantCount * 40 + bathroomCount * 40)));
  } else if (bedroomCount <= 4 && bathroomCount <= 2) {
    recommendedCapacity = Math.max(210, Math.min(300, Math.max(recommendedCapacity, occupantCount * 38 + bathroomCount * 45)));
  } else {
    recommendedCapacity = Math.max(300, Math.max(recommendedCapacity, occupantCount * 35 + bathroomCount * 50));
  }
  if (bathroomCount >= 2) {
    const simultaneousBuffer = Math.min(bathroomCount * 30, 90);
    recommendedCapacity += simultaneousBuffer;
  }
  if (occupantCount >= 4) {
    const peakBuffer = Math.min((occupantCount - 3) * 20, 60);
    recommendedCapacity += peakBuffer;
  }
  if (recommendedCapacity <= 125) return 120;
  if (recommendedCapacity <= 145) return 150;
  if (recommendedCapacity <= 165) return 170;
  if (recommendedCapacity <= 195) return 210;
  if (recommendedCapacity <= 235) return 250;
  if (recommendedCapacity <= 285) return 300;
  if (recommendedCapacity <= 335) return 350;
  if (recommendedCapacity <= 435) return 400;
  return 500;
}
function calculateJobComplexity(analysis) {
  const currentBoilerType = analysis.currentBoiler.toLowerCase();
  const recommendedType = determineOptimalBoilerType(analysis);
  let complexity = "Simple";
  let multiplier = 1;
  let jobType = "";
  if (currentBoilerType.includes("combi") && recommendedType === "Combi" || currentBoilerType.includes("system") && recommendedType === "System" || currentBoilerType.includes("regular") && recommendedType === "Regular") {
    complexity = "Simple";
    multiplier = 1;
    jobType = `${recommendedType} Boiler Replacement (Like-for-Like)`;
  } else if (currentBoilerType.includes("combi") && recommendedType === "System") {
    complexity = "Medium";
    multiplier = 1.3;
    jobType = "Combi to System Boiler Conversion";
  } else if (currentBoilerType.includes("system") && recommendedType === "Combi") {
    complexity = "Medium";
    multiplier = 1.3;
    jobType = "System to Combi Boiler Conversion";
  } else if (currentBoilerType.includes("regular") && recommendedType === "Combi") {
    complexity = "Complex";
    multiplier = 1.7;
    jobType = "Regular to Combi Boiler Conversion";
  } else if (currentBoilerType.includes("regular") && recommendedType === "System") {
    complexity = "Medium";
    multiplier = 1.2;
    jobType = "Regular to System Boiler Conversion";
  } else {
    complexity = "Medium";
    multiplier = 1.4;
    jobType = "Boiler Replacement (Survey Required)";
  }
  return { complexity, multiplier, jobType };
}
async function calculateIntelligentQuote(analysis) {
  try {
    const [boilers2, labourCosts2, sundries2, locations2] = await Promise.all([
      storage.getBoilers(),
      storage.getLabourCosts(),
      storage.getSundries(),
      storage.getLocations()
    ]);
    const recommendedSize = calculateOptimalBoilerSize(analysis);
    const recommendedType = determineOptimalBoilerType(analysis);
    const cylinderCapacity = calculateCylinderCapacity(analysis);
    const heatLoad = calculateHeatLoad(analysis);
    const hotWaterDemand = calculateHotWaterDemand(analysis);
    const jobComplexity = calculateJobComplexity(analysis);
    const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
    const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
    const simultaneousUsageScore = bathroomCount > 1 && occupantCount > 2 ? bathroomCount * occupantCount : 0;
    const suitableBoilers = boilers2.filter((boiler) => {
      if (boiler.boilerType !== recommendedType) return false;
      if (recommendedType === "Combi") {
        return boiler.dhwKw >= recommendedSize && boiler.dhwKw <= recommendedSize + 6;
      }
      return boiler.dhwKw >= recommendedSize - 3 && boiler.dhwKw <= recommendedSize + 5;
    });
    const budgetBoilers = suitableBoilers.filter((b) => b.tier === "Budget");
    const midRangeBoilers = suitableBoilers.filter((b) => b.tier === "Mid-Range");
    const premiumBoilers = suitableBoilers.filter((b) => b.tier === "Premium");
    const standardBoiler = budgetBoilers[0] || midRangeBoilers[0] || suitableBoilers[0];
    const premiumBoiler = midRangeBoilers[0] || premiumBoilers[0] || suitableBoilers[0];
    const luxuryBoiler = premiumBoilers[0] || suitableBoilers[0];
    const locationData = await storage.getLocationByPostcode(analysis.postcode);
    const locationMultiplier = locationData?.priceMultiplier || 1;
    const labourCost = await storage.getLabourCostByType(jobComplexity.jobType, "Standard");
    const premiumLabourCost = await storage.getLabourCostByType(jobComplexity.jobType, "Premium");
    const baseLabourPrice = labourCost?.price || 135e3;
    const premiumLabourPrice = premiumLabourCost?.price || 16e4;
    const cylinderPrice = cylinderCapacity > 0 ? cylinderCapacity <= 150 ? 11e4 : (
      // £1,100 for 120-150L
      cylinderCapacity <= 180 ? 14e4 : (
        // £1,400 for 180L  
        cylinderCapacity <= 210 ? 17e4 : (
          // £1,700 for 210L
          cylinderCapacity <= 250 ? 2e5 : (
            // £2,000 for 250L
            cylinderCapacity <= 300 ? 23e4 : (
              // £2,300 for 300L
              27e4
            )
          )
        )
      )
    ) : 0;
    const magneticSystemFilter = 15e3;
    const chemicalFlush = 12e3;
    const flueKit = 1e4;
    const smartThermostat = 2e4;
    const trvs = 8e3;
    const condensatePumpPrice = analysis.drainNearby === "No" ? 25e3 : 0;
    const basicSundries = magneticSystemFilter + chemicalFlush + flueKit + trvs;
    const premiumSundries = basicSundries + smartThermostat;
    const standardLabourFinal = Math.round(baseLabourPrice * jobComplexity.multiplier * Number(locationMultiplier));
    const premiumLabourFinal = Math.round(premiumLabourPrice * jobComplexity.multiplier * Number(locationMultiplier));
    const standardSubtotal = (standardBoiler?.supplyPrice || 12e4) + standardLabourFinal + basicSundries + cylinderPrice + condensatePumpPrice;
    const premiumSubtotal = (premiumBoiler?.supplyPrice || 15e4) + premiumLabourFinal + basicSundries + cylinderPrice + condensatePumpPrice;
    const luxurySubtotal = (luxuryBoiler?.supplyPrice || 18e4) + premiumLabourFinal + premiumSundries + cylinderPrice + condensatePumpPrice;
    const standardVat = Math.round(standardSubtotal * 0.2);
    const premiumVat = Math.round(premiumSubtotal * 0.2);
    const luxuryVat = Math.round(luxurySubtotal * 0.2);
    const quotes2 = [
      {
        tier: "Standard",
        boilerMake: standardBoiler?.make || "Baxi",
        boilerModel: standardBoiler?.model || "800 Combi 2 24kW",
        boilerType: recommendedType,
        warranty: `${standardBoiler?.warrantyYears || 10} years`,
        basePrice: standardSubtotal + standardVat,
        isRecommended: true,
        kWOutput: standardBoiler?.dhwKw || recommendedSize,
        flowRate: standardBoiler?.flowRateLpm || (recommendedType === "Combi" ? 12 : 20),
        efficiency: standardBoiler?.efficiencyRating || "A"
      },
      {
        tier: "Premium",
        boilerMake: premiumBoiler?.make || "Ideal",
        boilerModel: premiumBoiler?.model || "Logic Max Combi2 C28",
        boilerType: recommendedType,
        warranty: `${premiumBoiler?.warrantyYears || 10} years`,
        basePrice: premiumSubtotal + premiumVat,
        isRecommended: false,
        kWOutput: premiumBoiler?.dhwKw || recommendedSize,
        flowRate: premiumBoiler?.flowRateLpm || (recommendedType === "Combi" ? 14 : 22),
        efficiency: premiumBoiler?.efficiencyRating || "A"
      },
      {
        tier: "Luxury",
        boilerMake: luxuryBoiler?.make || "Vaillant",
        boilerModel: luxuryBoiler?.model || "EcoTec Pro 32kW",
        boilerType: recommendedType,
        warranty: `${luxuryBoiler?.warrantyYears || 12} years`,
        basePrice: luxurySubtotal + luxuryVat,
        isRecommended: false,
        kWOutput: luxuryBoiler?.dhwKw || recommendedSize,
        flowRate: luxuryBoiler?.flowRateLpm || (recommendedType === "Combi" ? 16 : 24),
        efficiency: luxuryBoiler?.efficiencyRating || "A"
      }
    ];
    const systemExplanation = generateSystemExplanation(recommendedType, recommendedSize, cylinderCapacity, analysis);
    const whyThisBoiler = generateBoilerExplanation(recommendedType, recommendedSize, heatLoad, hotWaterDemand);
    const alternativeOptions = generateAlternativeOptions(recommendedType, analysis);
    const installationNotes = generateInstallationNotes(jobComplexity, analysis);
    return {
      quotes: quotes2,
      analysis: {
        recommendedBoilerSize: recommendedSize,
        recommendedBoilerType: recommendedType,
        cylinderCapacity,
        heatLoadCalculation: heatLoad,
        hotWaterDemand,
        simultaneousUsageScore,
        propertyComplexity: jobComplexity.complexity,
        jobType: jobComplexity.jobType,
        installationMultiplier: jobComplexity.multiplier
      },
      priceBreakdown: {
        boilerPrice: standardBoiler?.supplyPrice || 12e4,
        labourPrice: standardLabourFinal,
        cylinderPrice,
        sundryPrice: basicSundries,
        flueExtensionPrice: 0,
        condensatePumpPrice,
        thermostatPrice: 0,
        parkingFee: 0,
        accessFee: 0,
        locationMultiplier: Number(locationMultiplier),
        subtotal: standardSubtotal,
        vatAmount: standardVat,
        totalPrice: standardSubtotal + standardVat
      },
      recommendations: {
        systemExplanation,
        whyThisBoiler,
        alternativeOptions,
        installationNotes
      }
    };
  } catch (error) {
    console.error("Error calculating intelligent quote:", error);
    throw new Error("Failed to calculate intelligent quote");
  }
}
function generateSystemExplanation(boilerType, size, cylinderCapacity, analysis) {
  const bedrooms = analysis.bedrooms;
  const bathrooms = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupants = parseInt(analysis.occupants.replace("+", "")) || 2;
  const bedroomCount = parseInt(analysis.bedrooms.replace("+", "")) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  const bestMatch = findBestMatchingScenario(
    bedroomCount,
    bathroomCount,
    occupantCount,
    analysis.propertyType,
    boilerType
  );
  if (boilerType === "Combi") {
    let explanation = `A ${size}kW combi boiler is ideal for your ${analysis.propertyType.toLowerCase()} with ${bedrooms} bedroom(s) and ${bathrooms} bathroom(s). It provides instant hot water without needing a separate cylinder, saving space and installation costs.`;
    if (bestMatch) {
      explanation += ` This specification matches proven installations in similar ${bestMatch.propertyDescription.toLowerCase()} properties across the UK.`;
    }
    return explanation;
  } else if (boilerType === "System") {
    let explanation = `A ${size}kW system boiler with ${cylinderCapacity}L cylinder is recommended for your property with ${bathrooms} bathroom(s) and ${occupants} occupant(s). This provides excellent hot water pressure and flow rates for simultaneous use across multiple outlets.`;
    if (bestMatch) {
      explanation += ` This configuration matches proven installations in similar ${bestMatch.propertyDescription.toLowerCase()} properties across the UK.`;
    }
    return explanation;
  } else {
    let explanation = `A ${size}kW regular boiler with ${cylinderCapacity}L cylinder maintains your existing system configuration while providing reliable heating and hot water for your ${bedrooms} bedroom ${analysis.propertyType.toLowerCase()}.`;
    if (bestMatch) {
      explanation += ` This specification is based on successful installations in comparable ${bestMatch.propertyDescription.toLowerCase()} properties.`;
    }
    return explanation;
  }
}
function generateBoilerExplanation(boilerType, size, heatLoad, hotWaterDemand) {
  const scenarios = ukHeatingScenarios.filter((s) => s.boilerPowerKw === size && s.systemType.toLowerCase().includes(boilerType.toLowerCase()));
  let explanation = `This ${size}kW ${boilerType.toLowerCase()} boiler is sized based on your calculated heat load of ${heatLoad}kW and hot water demand of ${hotWaterDemand}kW. The selected output ensures efficient operation while meeting peak demand periods.`;
  if (scenarios.length > 0) {
    explanation += ` This boiler size is proven effective across ${scenarios.length} similar UK property installations.`;
  }
  return explanation;
}
function generateAlternativeOptions(boilerType, analysis) {
  const alternatives = [];
  const bedroomCount = parseInt(analysis.bedrooms.replace("+", "")) || 1;
  const bathroomCount = parseInt(analysis.bathrooms.replace("+", "")) || 1;
  const occupantCount = parseInt(analysis.occupants.replace("+", "")) || 2;
  const alternativeScenarios = ukHeatingScenarios.filter((scenario) => {
    const desc = scenario.propertyDescription.toLowerCase();
    const roughMatch = desc.includes(`${bedroomCount}-bed`) || desc.includes(`${bedroomCount + 1}-bed`) || desc.includes(`${bedroomCount - 1}-bed`);
    const differentSystem = !scenario.systemType.toLowerCase().includes(boilerType.toLowerCase());
    return roughMatch && differentSystem;
  });
  if (boilerType === "Combi") {
    alternatives.push("System boiler with cylinder for higher flow rates");
    alternatives.push("Electric shower installation for additional hot water");
    const systemAlternatives = alternativeScenarios.filter((s) => s.systemType.toLowerCase().includes("system"));
    if (systemAlternatives.length > 0) {
      const avgPower = Math.round(systemAlternatives.reduce((sum, s) => sum + s.boilerPowerKw, 0) / systemAlternatives.length);
      alternatives.push(`${avgPower}kW system boiler based on similar UK installations`);
    }
  } else if (boilerType === "System") {
    alternatives.push("High-output combi boiler for space saving");
    alternatives.push("Larger cylinder for extended hot water storage");
    const combiAlternatives = alternativeScenarios.filter((s) => s.systemType.toLowerCase().includes("combi"));
    if (combiAlternatives.length > 0) {
      const avgPower = Math.round(combiAlternatives.reduce((sum, s) => sum + s.boilerPowerKw, 0) / combiAlternatives.length);
      alternatives.push(`${avgPower}kW combi boiler based on similar UK installations`);
    }
  } else {
    alternatives.push("System boiler conversion for improved efficiency");
    alternatives.push("Combi boiler conversion for space saving");
  }
  return alternatives;
}
function generateInstallationNotes(jobComplexity, analysis) {
  const notes = [];
  if (jobComplexity.complexity === "Complex") {
    notes.push("Complex installation requiring pipework modifications");
    notes.push("Additional time required for system conversion");
  }
  if (analysis.drainNearby === "No") {
    notes.push("Condensate pump required due to lack of nearby drain");
  }
  if (analysis.moveBoiler === "Yes") {
    notes.push("Boiler relocation will require additional pipework and gas supply modifications");
  }
  if (analysis.parkingSituation && analysis.parkingSituation.toLowerCase().includes("paid")) {
    notes.push("PARKING ARRANGEMENTS: This property is located in a paid parking area. Parking costs are not included in the quotation. Our engineer will work with you to arrange suitable parking - either through provision of a visitor parking permit or by calculating the required parking duration. You can choose to provide the parking ticket directly or reimburse the engineer for parking costs incurred. This flexible arrangement ensures fairness for all parties while maintaining competitive pricing.");
  }
  notes.push("All work completed to Gas Safe standards with certification");
  notes.push("System commissioning and performance testing included");
  return notes;
}
var init_intelligent_quote_engine = __esm({
  "server/intelligent-quote-engine.ts"() {
    "use strict";
    init_storage();
    init_uk_heating_scenarios();
    init_boiler_conversion_scenarios();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
init_schema();
import { createServer } from "http";
import Stripe from "stripe";
import { MailService } from "@sendgrid/mail";
import crypto2 from "crypto";
import { v4 as uuidv4 } from "uuid";

// server/auth-routes.ts
import { Router } from "express";

// server/auth.ts
init_storage();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
var SALT_ROUNDS = 12;
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
var AuthService = class {
  // Hash password
  static async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
  // Verify password
  static async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
  // Generate JWT token
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
  }
  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
  // Generate 6-digit verification code
  static generateVerificationCode() {
    return Math.floor(1e5 + Math.random() * 9e5).toString();
  }
  // Generate secure random token
  static generateSecureToken() {
    return crypto.randomBytes(32).toString("hex");
  }
  // Send verification email
  static async sendVerificationEmail(email, code) {
    console.log(`\u{1F510} EMAIL VERIFICATION CODE FOR ${email}: ${code}`);
    console.log(`\u{1F4E7} In production, this would be sent via email`);
  }
  // Send password reset email
  static async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Britannia Forge - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B5D44;">Britannia Forge - Password Reset</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF7800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Britannia Forge. Please do not reply to this email.
          </p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  }
  // Register user
  static async register(userData) {
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    const hashedPassword = await this.hashPassword(userData.password);
    const verificationCode = this.generateVerificationCode();
    const verificationToken = this.generateSecureToken();
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
      emailVerificationCode: verificationCode,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1e3),
      // 10 minutes
      emailVerified: false
    });
    await this.sendVerificationEmail(userData.email, verificationCode);
    const token = this.generateToken(user);
    return { user, token, requiresVerification: true };
  }
  // Login user
  static async login(email, password) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }
    if (!user.emailVerified) {
      const verificationCode = this.generateVerificationCode();
      await storage.updateUser(user.id, {
        emailVerificationCode: verificationCode,
        emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1e3)
      });
      await this.sendVerificationEmail(email, verificationCode);
      const token2 = this.generateToken(user);
      return { user, token: token2, requiresVerification: true };
    }
    const token = this.generateToken(user);
    return { user, token };
  }
  // Verify email with code
  static async verifyEmail(email, code) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.emailVerificationCode !== code) {
      throw new Error("Invalid verification code");
    }
    if (user.emailVerificationExpires && user.emailVerificationExpires < /* @__PURE__ */ new Date()) {
      throw new Error("Verification code has expired");
    }
    const updatedUser = await storage.updateUser(user.id, {
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });
    return updatedUser;
  }
  // Resend verification code
  static async resendVerificationCode(email) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.emailVerified) {
      throw new Error("Email is already verified");
    }
    const verificationCode = this.generateVerificationCode();
    const verificationToken = this.generateSecureToken();
    await storage.updateUser(user.id, {
      emailVerificationCode: verificationCode,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1e3)
      // 10 minutes
    });
    await this.sendVerificationEmail(email, verificationCode);
  }
  // Request password reset
  static async requestPasswordReset(email) {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const resetToken = this.generateSecureToken();
    await storage.updateUser(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1e3)
      // 1 hour
    });
    await this.sendPasswordResetEmail(email, resetToken);
  }
  // Reset password
  static async resetPassword(token, newPassword) {
    const user = await storage.getUserByResetToken(token);
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }
    if (user.resetPasswordExpires && user.resetPasswordExpires < /* @__PURE__ */ new Date()) {
      throw new Error("Reset token has expired");
    }
    const hashedPassword = await this.hashPassword(newPassword);
    const updatedUser = await storage.updateUser(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    return updatedUser;
  }
};

// server/auth-routes.ts
import { z } from "zod";
var router = Router();
var registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  userType: z.enum(["customer", "engineer"])
});
var loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});
var verifyEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().length(6, "Code must be 6 digits")
});
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
var requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      error: "Email verification required",
      requiresVerification: true
    });
  }
  next();
};
var requireAdmin = (req, res, next) => {
  if (!req.user || req.user.userType !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
      requiresAdmin: true
    });
  }
  next();
};
var requireAdminOrEditor = (req, res, next) => {
  if (!req.user || req.user.userType !== "admin" && req.user.userType !== "editor") {
    return res.status(403).json({
      error: "Admin or Editor access required",
      requiresAdminOrEditor: true
    });
  }
  next();
};
var requireEngineer = (req, res, next) => {
  if (!req.user || req.user.userType !== "engineer") {
    return res.status(403).json({
      error: "Engineer access required",
      requiresEngineer: true
    });
  }
  next();
};
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { user, token, requiresVerification } = await AuthService.register(validatedData);
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification code.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified
      },
      token,
      requiresVerification
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }
    res.status(400).json({
      error: error.message || "Registration failed"
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token, requiresVerification } = await AuthService.login(validatedData.email, validatedData.password);
    res.json({
      success: true,
      message: requiresVerification ? "Please verify your email to continue" : "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified
      },
      token,
      requiresVerification: requiresVerification || false
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }
    res.status(401).json({
      error: error.message || "Login failed"
    });
  }
});
router.post("/verify-email", async (req, res) => {
  try {
    const validatedData = verifyEmailSchema.parse(req.body);
    const user = await AuthService.verifyEmail(validatedData.email, validatedData.code);
    const token = AuthService.generateToken(user);
    res.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }
    res.status(400).json({
      error: error.message || "Email verification failed"
    });
  }
});
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    await AuthService.resendVerificationCode(email);
    res.json({
      success: true,
      message: "Verification code sent successfully"
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to send verification code"
    });
  }
});
router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    await AuthService.requestPasswordReset(email);
    res.json({
      success: true,
      message: "Password reset email sent successfully"
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to send password reset email"
    });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const user = await AuthService.resetPassword(token, newPassword);
    res.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Password reset failed"
    });
  }
});
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const user = await storage2.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postcode: user.postcode
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch user data"
    });
  }
});
router.post("/logout", authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});
var auth_routes_default = router;

// server/routes.ts
var mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil"
}) : null;
async function registerRoutes(app2) {
  app2.use("/api/auth", auth_routes_default);
  app2.post("/api/send-verification", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const verificationCode = Math.floor(1e5 + Math.random() * 9e5).toString();
      await storage.createEmailVerification(email, verificationCode);
      if (process.env.SENDGRID_API_KEY) {
        await mailService.send({
          to: email,
          from: "support@britanniaforge.co.uk",
          subject: "Verification Code for Contact Form",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3B5D44;">Verification Code</h2>
              <p>Your verification code is:</p>
              <h3 style="color: #FF7800; font-size: 24px; letter-spacing: 2px;">${verificationCode}</h3>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          `
        });
      }
      res.json({ message: "Verification code sent" });
    } catch (error) {
      console.error("Error sending verification:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });
  app2.post("/api/contact/submit", async (req, res) => {
    try {
      const { name, email, phone, subject, message, verificationCode } = req.body;
      if (!name || !email || !phone || !subject || !message || !verificationCode) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const isVerified = await storage.verifyEmailCode(email, verificationCode);
      if (!isVerified) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      const photoUrls = [];
      const contactMessage = await storage.createContactMessage({
        name,
        email,
        phone,
        subject,
        message,
        photoUrls,
        status: "new"
      });
      res.json({
        message: "Contact form submitted successfully",
        id: contactMessage.id
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.json(quote);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/quotes/:id", async (req, res) => {
    try {
      const quote = await storage.getQuote(parseInt(req.params.id));
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/quotes/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const quote = await storage.updateQuote(parseInt(req.params.id), updateData);
      res.json(quote);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/boilers", async (req, res) => {
    try {
      const boilers2 = await storage.getBoilers();
      res.json(boilers2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/labour-costs", async (req, res) => {
    try {
      const labourCosts2 = await storage.getLabourCosts();
      res.json(labourCosts2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/sundries", async (req, res) => {
    try {
      const sundries2 = await storage.getSundries();
      res.json(sundries2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/users/:userId/quotes", authenticateToken, requireEmailVerification, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (req.user.id !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const quotes2 = await storage.getUserQuotes(userId);
      res.json(quotes2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/calculate-intelligent-quote", async (req, res) => {
    try {
      const { calculateIntelligentQuote: calculateIntelligentQuote2 } = await Promise.resolve().then(() => (init_intelligent_quote_engine(), intelligent_quote_engine_exports));
      const analysisData = req.body;
      if (!analysisData.bedrooms || !analysisData.bathrooms || !analysisData.propertyType) {
        return res.status(400).json({ error: "Missing required property data" });
      }
      const result = await calculateIntelligentQuote2(analysisData);
      try {
        const surveyData = {
          propertyData: analysisData,
          recommendations: result.analysis,
          quoteResults: result.quotes.map((q) => ({
            tier: q.tier,
            boilerMake: q.boilerMake,
            boilerModel: q.boilerModel,
            boilerType: q.boilerType,
            kWOutput: q.kWOutput,
            price: q.basePrice
          })),
          priceBreakdown: result.priceBreakdown,
          calculationDate: (/* @__PURE__ */ new Date()).toISOString(),
          systemExplanation: result.recommendations.systemExplanation,
          whyThisBoiler: result.recommendations.whyThisBoiler
        };
        if (req.session) {
          req.session.lastSurveyData = surveyData;
        }
        result.surveyData = surveyData;
      } catch (surveyError) {
        console.error("Error saving survey data:", surveyError);
      }
      res.json(result);
    } catch (error) {
      console.error("Error calculating intelligent quote:", error);
      res.status(500).json({ error: "Failed to calculate intelligent quote" });
    }
  });
  app2.post("/api/quote/calculate", async (req, res) => {
    try {
      const { calculateIntelligentQuote: calculateIntelligentQuote2 } = await Promise.resolve().then(() => (init_intelligent_quote_engine(), intelligent_quote_engine_exports));
      const analysisData = req.body;
      if (!analysisData.bedrooms || !analysisData.bathrooms || !analysisData.propertyType) {
        return res.status(400).json({ error: "Missing required property data" });
      }
      const result = await calculateIntelligentQuote2(analysisData);
      res.json(result);
    } catch (error) {
      console.error("Error calculating intelligent quote:", error);
      res.status(500).json({ error: "Failed to calculate intelligent quote" });
    }
  });
  app2.get("/api/admin/stats", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const stats = {
        totalQuotes: 245,
        activeEngineers: 42,
        revenue: 125e3,
        pendingReviews: 8
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/admin/activity", authenticateToken, requireAdminOrEditor, async (req, res) => {
    const activity = [
      { description: "New engineer registration", timestamp: "2 hours ago" },
      { description: "Boiler pricing updated", timestamp: "4 hours ago" },
      { description: "Quote submitted", timestamp: "6 hours ago" },
      { description: "Engineer verified", timestamp: "8 hours ago" }
    ];
    res.json(activity);
  });
  app2.get("/api/admin/boilers", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const boilers2 = await storage.getBoilers();
      res.json(boilers2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch boilers" });
    }
  });
  app2.put("/api/admin/boilers/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update boiler" });
    }
  });
  app2.get("/api/admin/labour-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const labourCosts2 = await storage.getLabourCosts();
      res.json(labourCosts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch labour costs" });
    }
  });
  app2.put("/api/admin/labour-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update labour cost" });
    }
  });
  app2.get("/api/admin/sundries", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const sundries2 = await storage.getSundries();
      res.json(sundries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sundries" });
    }
  });
  app2.put("/api/admin/sundries/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update sundry" });
    }
  });
  app2.get("/api/admin/cylinders", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const cylinders2 = await storage.getCylinders();
      res.json(cylinders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cylinders" });
    }
  });
  app2.put("/api/admin/cylinders/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCylinder = await storage.updateCylinder(parseInt(id), req.body);
      res.json(updatedCylinder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cylinder" });
    }
  });
  app2.get("/api/admin/heating-sundries", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const heatingSundries2 = await storage.getHeatingSundries();
      res.json(heatingSundries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heating sundries" });
    }
  });
  app2.put("/api/admin/heating-sundries/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedSundry = await storage.updateHeatingSundry(parseInt(id), req.body);
      res.json(updatedSundry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update heating sundry" });
    }
  });
  app2.get("/api/admin/locations", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const locations2 = await storage.getLocations();
      res.json(locations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });
  app2.put("/api/admin/locations/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedLocation = await storage.updateLocation(parseInt(id), req.body);
      res.json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update location" });
    }
  });
  app2.get("/api/admin/access-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const accessCosts2 = await storage.getAccessCosts();
      res.json(accessCosts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch access costs" });
    }
  });
  app2.put("/api/admin/access-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAccess = await storage.updateAccessCost(parseInt(id), req.body);
      res.json(updatedAccess);
    } catch (error) {
      res.status(500).json({ message: "Failed to update access cost" });
    }
  });
  app2.get("/api/admin/flue-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const flueCosts2 = await storage.getFlueCosts();
      res.json(flueCosts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flue costs" });
    }
  });
  app2.put("/api/admin/flue-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedFlue = await storage.updateFlueCost(parseInt(id), req.body);
      res.json(updatedFlue);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flue cost" });
    }
  });
  app2.get("/api/admin/lead-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const leadCosts2 = await storage.getLeadCosts();
      res.json(leadCosts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lead costs" });
    }
  });
  app2.put("/api/admin/lead-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedLead = await storage.updateLeadCost(parseInt(id), req.body);
      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead cost" });
    }
  });
  app2.get("/api/admin/engineers", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const engineers3 = await storage.getEngineerProfiles();
      res.json(engineers3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch engineers" });
    }
  });
  app2.put("/api/admin/engineers/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEngineer = await storage.updateEngineerProfile(parseInt(id), req.body);
      res.json(updatedEngineer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update engineer" });
    }
  });
  app2.post("/api/job-requests", async (req, res) => {
    try {
      const jobRequest = {
        id: Date.now(),
        serviceType: req.body.serviceType,
        description: req.body.description,
        urgency: req.body.urgency,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerEmail: req.body.customerEmail,
        postcode: req.body.postcode,
        photos: req.body.photos || [],
        status: "pending",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        leadCost: await storage.getLeadCostByService(req.body.serviceType)
      };
      res.json(jobRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to create job request" });
    }
  });
  app2.get("/api/job-requests", async (req, res) => {
    try {
      const jobRequests = [
        {
          id: 1,
          serviceType: "boiler-repair",
          description: "Boiler not heating water properly",
          urgency: "high",
          customerName: "John Smith",
          customerPhone: "07123456789",
          postcode: "SW1A 1AA",
          leadCost: 1e3,
          status: "available",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
      res.json(jobRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job requests" });
    }
  });
  app2.post("/api/calculate-quote", async (req, res) => {
    try {
      const { propertyType, bedrooms, bathrooms, currentBoiler, occupants } = req.body;
      const boilerType = parseInt(bathrooms) > 1 ? "System" : "Combi";
      const allBoilers = await storage.getBoilers();
      const suitableBoilers = allBoilers.filter((boiler) => boiler.boilerType === boilerType);
      const jobType = currentBoiler === "Combi" && boilerType === "System" ? "Conversion (Combi to System)" : "Like-for-Like Swap";
      const labourCosts2 = await storage.getLabourCosts();
      const sundries2 = await storage.getSundries();
      const magneticFilter = sundries2.find((s) => s.itemName.includes("Filter"));
      const powerFlush = sundries2.find((s) => s.itemName.includes("Flush"));
      const tiers = ["Budget", "Mid-Range", "Premium"];
      const quotes2 = [];
      for (const tier of tiers) {
        const boiler = suitableBoilers.find((b) => b.tier === tier);
        const labour = labourCosts2.find((l) => l.jobType === jobType && l.tier === tier);
        if (boiler && labour) {
          let basePrice = Number(boiler.supplyPrice) + Number(labour.price);
          if (magneticFilter) basePrice += Number(magneticFilter.price);
          if (powerFlush) basePrice += Number(powerFlush.price);
          if (boilerType === "System") {
            const cylinderSize = bedrooms === "1-2" ? "210L" : bedrooms === "3" ? "210L" : "250L";
            const cylinder = sundries2.find((s) => s.itemName.includes(cylinderSize));
            if (cylinder) basePrice += Number(cylinder.price);
          }
          const totalPrice = Math.round(basePrice * 1.2);
          quotes2.push({
            tier,
            boilerMake: boiler.make,
            boilerModel: boiler.model,
            warranty: `${boiler.warrantyYears} Years`,
            basePrice: totalPrice,
            isRecommended: tier === "Mid-Range"
          });
        }
      }
      res.json(quotes2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/boilers", async (req, res) => {
    try {
      const boilers2 = await storage.getBoilers();
      res.json(boilers2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/sundries", async (req, res) => {
    try {
      const sundries2 = await storage.getSundries();
      res.json(sundries2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/labour-costs", async (req, res) => {
    try {
      const costs = await storage.getLabourCosts();
      res.json(costs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/discount/:code", async (req, res) => {
    try {
      const discount = await storage.getDiscountCode(req.params.code);
      if (!discount) {
        return res.status(404).json({ error: "Discount code not found" });
      }
      res.json(discount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing temporarily unavailable" });
      }
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "gbp"
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users/:userId/jobs", async (req, res) => {
    try {
      const jobs2 = await storage.getUserJobs(parseInt(req.params.userId));
      res.json(jobs2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/email/verify", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const code = crypto2.randomInt(1e5, 999999).toString();
      const verificationId = uuidv4();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      await storage.createEmailVerification({
        id: verificationId,
        email,
        code,
        expiresAt
      });
      if (process.env.SENDGRID_API_KEY) {
        await mailService.send({
          to: email,
          from: "noreply@britanniaforge.co.uk",
          subject: "Email Verification Code",
          text: `Your verification code is: ${code}`,
          html: `<p>Your verification code is: <strong>${code}</strong></p>`
        });
      }
      res.json({ success: true, verificationId });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });
  app2.post("/api/email/confirm", async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
      }
      const verification = await storage.verifyEmailCode(email, code);
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Email confirmation error:", error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });
  app2.post("/api/service-request", async (req, res) => {
    try {
      const {
        serviceType,
        serviceName,
        serviceIcon,
        customerName,
        customerEmail,
        customerPhone,
        postcode,
        urgency,
        description,
        photos,
        emailVerified
      } = req.body;
      if (!emailVerified) {
        return res.status(400).json({ error: "Email must be verified" });
      }
      const serviceRequest = await storage.createServiceRequest({
        id: uuidv4(),
        serviceType,
        serviceName,
        serviceIcon,
        customerName,
        customerEmail,
        customerPhone,
        postcode,
        urgency,
        description,
        photos,
        emailVerified
      });
      res.json({ success: true, serviceRequest });
    } catch (error) {
      console.error("Service request error:", error);
      res.status(500).json({ error: "Failed to submit service request" });
    }
  });
  app2.get("/api/engineer/leads", authenticateToken, requireEngineer, async (req, res) => {
    try {
      const { serviceType, postcode, showPurchasedOnly } = req.query;
      const leads = await storage.getServiceLeads({
        serviceType,
        postcode,
        showPurchasedOnly: showPurchasedOnly === "true"
      });
      res.json(leads);
    } catch (error) {
      console.error("Get leads error:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });
  app2.post("/api/engineer/purchase-lead/:leadId", authenticateToken, requireEngineer, async (req, res) => {
    try {
      const { leadId } = req.params;
      const engineerEmail = req.user.email;
      let paymentIntent;
      if (stripe) {
        paymentIntent = await stripe.paymentIntents.create({
          amount: 1500,
          // £15.00
          currency: "gbp",
          metadata: {
            leadId,
            engineerEmail
          }
        });
      }
      const purchase = await storage.purchaseLead({
        id: uuidv4(),
        serviceRequestId: leadId,
        engineerId: req.user.id.toString(),
        engineerEmail,
        purchasePrice: 1500,
        paymentStatus: "completed",
        stripePaymentId: paymentIntent?.id
      });
      res.json({ success: true, purchase });
    } catch (error) {
      console.error("Purchase lead error:", error);
      res.status(500).json({ error: "Failed to purchase lead" });
    }
  });
  app2.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAdminUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { fullName, email, password, userType } = req.body;
      if (userType === "editor") {
        const hashedPassword = await storage.hashPassword(password);
        const newUser = await storage.createUser({
          fullName,
          email,
          password: hashedPassword,
          userType: "editor",
          emailVerified: true
        });
        res.json({ success: true, user: newUser });
      } else {
        res.status(403).json({ message: "Can only create editor accounts" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      if (req.user.id === userId) {
        return res.status(403).json({ message: "Cannot delete your own account" });
      }
      const user = await storage.getUser(userId);
      if (user?.userType === "editor") {
        await storage.deleteUser(userId);
        res.json({ success: true });
      } else {
        res.status(403).json({ message: "Can only delete editor accounts" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.get("/api/admin/tickets", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const tickets = await storage.getSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });
  app2.post("/api/admin/tickets/:id/reply", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const reply = await storage.createTicketReply({
        ticketId: parseInt(id),
        message,
        authorId: req.user.id,
        authorName: req.user.fullName,
        authorType: req.user.userType
      });
      res.json({ success: true, reply });
    } catch (error) {
      res.status(500).json({ message: "Failed to create reply" });
    }
  });
  app2.put("/api/admin/tickets/:id/status", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ticket = await storage.updateTicketStatus(parseInt(id), status);
      res.json({ success: true, ticket });
    } catch (error) {
      res.status(500).json({ message: "Failed to update ticket status" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
