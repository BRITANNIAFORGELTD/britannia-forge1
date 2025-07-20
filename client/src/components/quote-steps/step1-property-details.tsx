import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectionButton } from '@/components/ui/selection-button';
import { Home, Building, ArrowRight, Bath, Bed, Users, User, UserPlus, Car, Compass, Flame, Building2, Settings, Gauge, MapPin, Plug, HelpCircle, Video, Ruler, ChevronUp, ChevronDown, Check, X, Package, Droplets, Zap, Move, AlertCircle, Wrench } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { QuoteData } from '@/types/quote';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Step1Props {
  data: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
}

export function Step1PropertyDetails({ data, onUpdate, onNext }: Step1Props) {
  const [isValidatingPostcode, setIsValidatingPostcode] = useState(false);
  const [postcodeError, setPostcodeError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showVideoCallMessage, setShowVideoCallMessage] = useState(false);
  const { toast } = useToast();

  const handlePropertyTypeSelect = (type: string) => {
    onUpdate({ propertyType: type });
  };

  const handleBoilerTypeSelect = (boilerType: string) => {
    const updates: Partial<QuoteData> = { currentBoiler: boilerType };
    
    // Set flags for Unknown boiler type
    if (boilerType === 'Unknown') {
      updates.requiresVideoCall = true;
      updates.additionalPhotosRequired = true;
      updates.videoCallScheduled = false;
    } else {
      updates.requiresVideoCall = false;
      updates.additionalPhotosRequired = false;
      updates.videoCallScheduled = false;
    }
    
    onUpdate(updates);
  };

  const handleDrainNearbySelect = (drainNearby: string) => {
    const updates: Partial<QuoteData> = { drainNearby };
    
    // If no drain nearby, automatically add condensate pump cost
    if (drainNearby === 'No') {
      updates.needsCondensatePump = true;
    } else {
      updates.needsCondensatePump = false;
    }
    
    onUpdate(updates);
  };

  const handleMoveBoilerSelect = (moveBoiler: string) => {
    const updates: Partial<QuoteData> = { moveBoiler };
    
    // If moving boiler, add provisional cost and require video call
    if (moveBoiler === 'Yes') {
      updates.requiresVideoCall = true;
      updates.boilerRelocationCost = 80000; // £800 in pence
      setShowVideoCallMessage(true);
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setShowVideoCallMessage(false), 5000);
    } else {
      // Only clear video call requirement if not needed for other reasons
      if (!data.currentBoiler || data.currentBoiler !== 'Unknown') {
        updates.requiresVideoCall = false;
      }
      updates.boilerRelocationCost = 0;
      setShowVideoCallMessage(false);
    }
    
    onUpdate(updates);
  };

  const validatePostcode = async (postcode: string) => {
    if (!postcode.trim()) {
      setPostcodeError('Postcode is required');
      return false;
    }

    // Basic UK postcode format validation
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s*[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode.trim())) {
      setPostcodeError('Please enter a valid UK postcode');
      return false;
    }

    try {
      setIsValidatingPostcode(true);
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.trim()}`);
      const result = await response.json();
      
      if (result.status === 200) {
        setPostcodeError('');
        return true;
      } else {
        setPostcodeError('Invalid postcode. Please check and try again.');
        return false;
      }
    } catch (error) {
      setPostcodeError('');
      return true;
    } finally {
      setIsValidatingPostcode(false);
    }
  };

  const handlePostcodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    onUpdate({ postcode: upperValue });
    if (postcodeError) {
      setPostcodeError('');
    }
  };

  const handleSubmit = async () => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!data.postcode) errors.push('Postcode is required');
    if (!data.propertyType) errors.push('Property type is required');
    if (!data.bedrooms) errors.push('Number of bedrooms is required');
    if (!data.bathrooms) errors.push('Number of bathrooms is required');
    if (!data.occupants) errors.push('Number of occupants is required');
    if (!data.currentBoiler) errors.push('Current boiler type is required');
    if (!data.flueLocation) errors.push('Flue location is required');
    if (!data.flueExtension) errors.push('Flue extension option is required');
    if (!data.parkingSituation) errors.push('Parking situation is required');
    if (!data.parkingDistance) errors.push('Parking distance is required');
    if (!data.drainNearby) errors.push('Drain nearby option is required');
    if (!data.moveBoiler) errors.push('Boiler relocation option is required');
    
    if (data.propertyType === 'Flat') {
      if (!data.floorLevel) errors.push('Floor level is required for flats');
      if (data.hasLift === undefined) errors.push('Lift availability is required for flats');
    }

    if (data.postcode) {
      const isValidPostcode = await validatePostcode(data.postcode);
      if (!isValidPostcode) {
        errors.push('Valid postcode is required');
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Missing Information",
        description: "Please complete all required fields to continue.",
        variant: "destructive",
      });
      return;
    }

    setValidationErrors([]);
    onNext();
  };

  return (
    <GlassCard className="mb-8 fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-britannia-dark">Property Details</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step 1 of 6</span>
            <ProgressBar value={1} max={6} />
          </div>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">Tell us about your property to get accurate recommendations</p>
      </div>

      {/* Mobile-First Layout */}
      <div className="space-y-8">
        {/* 1. Postcode - First Question */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Property Location</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your postcode (e.g. SW1A 1AA)"
              value={data.postcode || ''}
              onChange={(e) => handlePostcodeChange(e.target.value)}
              className={cn(
                "w-full text-base sm:text-sm h-12 sm:h-10",
                postcodeError ? "border-red-300 focus:border-red-400" : ""
              )}
              disabled={isValidatingPostcode}
            />
            {isValidatingPostcode && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          {postcodeError && (
            <p className="text-red-500 text-xs mt-1">{postcodeError}</p>
          )}
        </div>

        {/* 2. Property Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Property Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <SelectionButton
              icon={Home}
              label="House"
              value="House"
              selected={data.propertyType === 'House'}
              onClick={() => handlePropertyTypeSelect('House')}
            />
            <SelectionButton
              icon={Building}
              label="Flat/Apartment"
              value="Flat"
              selected={data.propertyType === 'Flat'}
              onClick={() => handlePropertyTypeSelect('Flat')}
            />
          </div>
        </div>

        {/* 3. Bedrooms */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Number of Bedrooms</Label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: '1', icon: Bed },
              { value: '2', icon: Bed },
              { value: '3', icon: Bed },
              { value: '4+', icon: Bed }
            ].map((bedroom) => (
              <SelectionButton
                key={bedroom.value}
                icon={bedroom.icon}
                label={bedroom.value}
                value={bedroom.value}
                selected={data.bedrooms === bedroom.value}
                onClick={() => onUpdate({ bedrooms: bedroom.value })}
              />
            ))}
          </div>
        </div>

        {/* 4. Bathrooms */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Number of Bathrooms</Label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: '1', icon: Bath },
              { value: '2', icon: Bath },
              { value: '3', icon: Bath },
              { value: '4+', icon: Bath }
            ].map((bathroom) => (
              <SelectionButton
                key={bathroom.value}
                icon={bathroom.icon}
                label={bathroom.value}
                value={bathroom.value}
                selected={data.bathrooms === bathroom.value}
                onClick={() => onUpdate({ bathrooms: bathroom.value })}
              />
            ))}
          </div>
        </div>

        {/* 5. Occupants */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Number of Occupants</Label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: '1', icon: User },
              { value: '2', icon: Users },
              { value: '3-4', icon: Users },
              { value: '5+', icon: UserPlus }
            ].map((occupant) => (
              <SelectionButton
                key={occupant.value}
                icon={occupant.icon}
                label={occupant.value}
                value={occupant.value}
                selected={data.occupants === occupant.value}
                onClick={() => onUpdate({ occupants: occupant.value })}
              />
            ))}
          </div>
        </div>

        {/* 6. Current Boiler Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">What type of boiler do you currently have?</Label>
          <div className="space-y-3">
            {[
              { value: 'Combi', icons: [Package, Flame], label: 'Combi Boiler', description: 'Heats water instantly, no tanks needed' },
              { value: 'System', icons: [Package, Building2], label: 'System Boiler', description: 'Has a hot water cylinder, no loft tanks' },
              { value: 'Regular', icons: [Package, Building2, Droplets], label: 'Conventional Boiler', description: 'Has a cylinder AND tanks in the loft' },
              { value: 'Electric', icons: [Plug, Zap], label: 'Electric Boiler', description: 'Electric heating system' },
              { value: 'Unknown', icons: [HelpCircle, Video], label: 'Not Sure', description: 'Video call required for assessment' }
            ].map((boiler) => (
              <motion.button
                key={boiler.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleBoilerTypeSelect(boiler.value)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all duration-300 group text-left",
                  "backdrop-blur-md bg-gradient-to-br from-white/40 to-white/20",
                  "hover:from-white/60 hover:to-white/30 shadow-lg hover:shadow-xl",
                  data.currentBoiler === boiler.value
                    ? "border-orange-400 bg-gradient-to-br from-orange-100/80 to-orange-50/60 shadow-orange-200/50" 
                    : "border-white/30 hover:border-orange-200"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-300 flex-shrink-0",
                    "bg-white/20 group-hover:bg-white/30",
                    data.currentBoiler === boiler.value && "bg-orange-100/80"
                  )}>
                    <div className="flex items-center gap-1">
                      {boiler.icons.map((Icon, index) => (
                        <Icon 
                          key={index}
                          className={cn(
                            "w-4 h-4 transition-colors duration-300",
                            data.currentBoiler === boiler.value 
                              ? "text-orange-600" 
                              : "text-gray-600 group-hover:text-orange-500"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-medium text-sm sm:text-base transition-colors duration-300",
                      data.currentBoiler === boiler.value 
                        ? "text-orange-700" 
                        : "text-gray-700 group-hover:text-orange-600"
                    )}>
                      {boiler.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {boiler.description}
                    </p>
                  </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

        {/* 7. Flue Location */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Where is your boiler's flue (exhaust pipe)?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'External Wall', label: 'External Wall', icon: Compass },
              { value: 'Through Roof', label: 'Through Roof', icon: Home }
            ].map((flue) => (
              <SelectionButton
                key={flue.value}
                icon={flue.icon}
                label={flue.label}
                value={flue.value}
                selected={data.flueLocation === flue.value}
                onClick={() => onUpdate({ flueLocation: flue.value })}
              />
            ))}
          </div>
        </div>

        {/* 8. Flue Extension */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Does the flue require an extension?</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'None', label: 'None', icon: Check },
              { value: '1-2m', label: '1-2m', icon: Ruler },
              { value: '3-4m', label: '3-4m', icon: Ruler },
              { value: '5m+', label: '5m+', icon: Ruler }
            ].map((extension) => (
              <SelectionButton
                key={extension.value}
                icon={extension.icon}
                label={extension.label}
                value={extension.value}
                selected={data.flueExtension === extension.value}
                onClick={() => onUpdate({ flueExtension: extension.value })}
              />
            ))}
          </div>
        </div>

        {/* 9. Parking Situation */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">What's the parking situation?</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'Free Outside', label: 'Free Outside', icon: Car },
              { value: 'Resident Permit', label: 'Resident Permit', icon: MapPin },
              { value: 'Paid Parking', label: 'Paid Parking', icon: Car },
              { value: 'No Parking', label: 'No Parking', icon: X }
            ].map((parking) => (
              <SelectionButton
                key={parking.value}
                icon={parking.icon}
                label={parking.label}
                value={parking.value}
                selected={data.parkingSituation === parking.value}
                onClick={() => onUpdate({ parkingSituation: parking.value })}
              />
            ))}
          </div>
        </div>

        {/* 10. Parking Distance */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">How far is parking from your property?</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'Under 20m', label: 'Under 20m', icon: MapPin },
              { value: '20-50m', label: '20-50m', icon: MapPin },
              { value: 'Over 50m', label: 'Over 50m', icon: MapPin }
            ].map((distance) => (
              <SelectionButton
                key={distance.value}
                icon={distance.icon}
                label={distance.value}
                value={distance.value}
                selected={data.parkingDistance === distance.value}
                onClick={() => onUpdate({ parkingDistance: distance.value })}
              />
            ))}
          </div>
        </div>

        {/* Conditional Floor Level for Flats */}
        {data.propertyType === 'Flat' && (
          <>
            {/* 11. Floor Level */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Which floor is your flat on?</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'Ground', label: 'Ground Floor', icon: Building },
                  { value: '1st-2nd', label: '1st-2nd Floor', icon: Building2 },
                  { value: '3rd+', label: '3rd Floor+', icon: Building2 }
                ].map((floor) => (
                  <SelectionButton
                    key={floor.value}
                    icon={floor.icon}
                    label={floor.label}
                    value={floor.value}
                    selected={data.floorLevel === floor.value}
                    onClick={() => onUpdate({ floorLevel: floor.value })}
                  />
                ))}
              </div>
            </div>

            {/* 12. Lift Availability */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Is there a lift available?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: 'Yes', icon: Check },
                  { value: false, label: 'No', icon: X }
                ].map((lift) => (
                  <SelectionButton
                    key={lift.value.toString()}
                    icon={lift.icon}
                    label={lift.label}
                    value={lift.value.toString()}
                    selected={data.hasLift === lift.value}
                    onClick={() => onUpdate({ hasLift: lift.value })}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* 13. Drain Nearby - New Intelligent Question */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Is there a suitable drain (e.g., sink waste pipe) within 3 meters of the boiler's current location?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'Yes', label: 'Yes', icon: Check },
              { value: 'No', label: 'No', icon: X }
            ].map((drain) => (
              <SelectionButton
                key={drain.value}
                icon={drain.icon}
                label={drain.label}
                value={drain.value}
                selected={data.drainNearby === drain.value}
                onClick={() => handleDrainNearbySelect(drain.value)}
              />
            ))}
          </div>
          {data.drainNearby === 'No' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <Wrench className="w-4 h-4" />
                <span>A condensate pump will be automatically added to your quote (required for drainage).</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 14. Move Boiler - New Intelligent Question */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Are you planning to move your boiler to a new location?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'Yes', label: 'Yes', icon: Move },
              { value: 'No', label: 'No', icon: X }
            ].map((move) => (
              <SelectionButton
                key={move.value}
                icon={move.icon}
                label={move.label}
                value={move.value}
                selected={data.moveBoiler === move.value}
                onClick={() => handleMoveBoilerSelect(move.value)}
              />
            ))}
          </div>
          {showVideoCallMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-orange-800 text-sm font-medium">Video Call Required</p>
                  <p className="text-orange-700 text-sm mt-1">
                    Boiler relocations require a detailed assessment. A provisional cost has been added and will be finalized during a brief video call with our technical expert.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-800 text-sm font-medium">Please complete all required fields:</p>
                <ul className="text-red-700 text-sm mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 text-base font-medium"
            disabled={isValidatingPostcode}
          >
            Continue to Photos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
