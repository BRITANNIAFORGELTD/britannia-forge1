// PropertyDetailsStep - Phase 2 Enhanced Mobile-First Implementation
// Postcode first, intelligent questions, no redundant checkboxes

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, Building, Building2, Bed, Bath, Users, User, UserPlus,
  Flame, Settings, Gauge, Compass, MapPin, Navigation, Shield,
  Car, Move, Check, X, Wrench, AlertCircle, Zap
} from 'lucide-react';

interface PropertyDetailsStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  isLoading?: boolean;
}

// Enhanced Selection Button with glassmorphism
const SelectionButton = ({ icon: Icon, label, value, selected, onClick, disabled = false }: any) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
    className={`
      relative p-4 rounded-xl border-2 transition-all duration-300 text-left
      ${selected 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
        : 'border-gray-200 bg-white/60 backdrop-blur-sm hover:border-blue-300 hover:bg-white/80'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <div className="flex items-center space-x-3">
      <div className={`
        p-2 rounded-lg transition-colors
        ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className={`font-medium ${selected ? 'text-blue-900' : 'text-gray-900'}`}>
          {label}
        </div>
        {value && value !== label && (
          <div className="text-sm text-gray-600">{value}</div>
        )}
      </div>
    </div>
    {selected && (
      <div className="absolute top-2 right-2">
        <Check className="w-5 h-5 text-blue-500" />
      </div>
    )}
  </motion.button>
);

export default function PropertyDetailsStep({ data, onUpdate, isLoading }: PropertyDetailsStepProps) {
  const [showFlueExtension, setShowFlueExtension] = useState(false);
  const [showCondensateMessage, setShowCondensateMessage] = useState(false);
  const [showRelocationMessage, setShowRelocationMessage] = useState(false);

  // Handle postcode validation
  const handlePostcodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    onUpdate({ postcode: upperValue });
  };

  // Handle fused switch selection
  const handleFusedSwitchSelect = (hasSwitch: boolean) => {
    onUpdate({ 
      hasFusedSwitch: hasSwitch,
      // Add £150 charge if no fused switch
      fusedSwitchCost: hasSwitch ? 0 : 150
    });
  };

  // Handle flue location selection
  const handleFlueLocationSelect = (location: string) => {
    const updates: any = { flueLocation: location };
    
    if (location.includes('External') || location.includes('Through')) {
      setShowFlueExtension(true);
    } else {
      setShowFlueExtension(false);
      updates.flueExtension = '0';
    }
    
    onUpdate(updates);
  };

  // Handle drain nearby selection
  const handleDrainSelect = (drain: string) => {
    const updates: any = { drainNearby: drain };
    
    if (drain === 'No') {
      setShowCondensateMessage(true);
      setTimeout(() => setShowCondensateMessage(false), 4000);
    } else {
      setShowCondensateMessage(false);
    }
    
    onUpdate(updates);
  };

  // Handle boiler relocation selection
  const handleRelocationSelect = (move: string) => {
    const updates: any = { moveBoiler: move };
    
    if (move === 'Yes') {
      setShowRelocationMessage(true);
      setTimeout(() => setShowRelocationMessage(false), 4000);
    } else {
      setShowRelocationMessage(false);
    }
    
    onUpdate(updates);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
        <p className="text-gray-600">Tell us about your property for an accurate quote</p>
      </div>

      {/* 1. Postcode (Top Priority) */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <Label className="text-lg font-semibold text-gray-900 mb-3 block flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            What's your postcode?
          </Label>
          <Input
            type="text"
            placeholder="e.g., SW1A 1AA"
            value={data.postcode || ''}
            onChange={(e) => handlePostcodeChange(e.target.value)}
            className="text-lg p-4 bg-white/80 border-2 border-blue-200 focus:border-blue-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            This helps us provide accurate pricing for your area
          </p>
        </CardContent>
      </Card>

      {/* 1B. NEW - Fused Switch Question */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-6">
          <Label className="text-lg font-semibold text-gray-900 mb-4 block flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-600" />
            Is there a 3-amp fused switch next to your current boiler location?
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <SelectionButton
              icon={Check}
              label="Yes"
              value="3-amp fused switch present"
              selected={data.hasFusedSwitch === true}
              onClick={() => handleFusedSwitchSelect(true)}
            />
            <SelectionButton
              icon={X}
              label="No"
              value="New switch required (+£150)"
              selected={data.hasFusedSwitch === false}
              onClick={() => handleFusedSwitchSelect(false)}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            A fused switch is legally required for boiler installation safety
          </p>
        </CardContent>
      </Card>

      {/* 2. Property Type */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">What type of property is it?</Label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'House', label: 'House', icon: Home },
            { value: 'Flat', label: 'Flat/Apartment', icon: Building }
          ].map((type) => (
            <SelectionButton
              key={type.value}
              icon={type.icon}
              label={type.label}
              value={type.value}
              selected={data.propertyType === type.value}
              onClick={() => onUpdate({ propertyType: type.value })}
            />
          ))}
        </div>
      </div>

      {/* 3. Bedrooms */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">How many bedrooms?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '1', label: '1 Bedroom', icon: Bed },
            { value: '2', label: '2 Bedrooms', icon: Bed },
            { value: '3', label: '3 Bedrooms', icon: Bed },
            { value: '4+', label: '4+ Bedrooms', icon: Bed }
          ].map((bedroom) => (
            <SelectionButton
              key={bedroom.value}
              icon={bedroom.icon}
              label={bedroom.label}
              value={bedroom.value}
              selected={data.bedrooms === bedroom.value}
              onClick={() => onUpdate({ bedrooms: bedroom.value })}
            />
          ))}
        </div>
      </div>

      {/* 4. Bathrooms */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">How many bathrooms?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '1', label: '1 Bathroom', icon: Bath },
            { value: '2', label: '2 Bathrooms', icon: Bath },
            { value: '3', label: '3 Bathrooms', icon: Bath },
            { value: '4+', label: '4+ Bathrooms', icon: Bath }
          ].map((bathroom) => (
            <SelectionButton
              key={bathroom.value}
              icon={bathroom.icon}
              label={bathroom.label}
              value={bathroom.value}
              selected={data.bathrooms === bathroom.value}
              onClick={() => onUpdate({ bathrooms: bathroom.value })}
            />
          ))}
        </div>
      </div>

      {/* 5. Occupants */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">How many people live there?</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { value: '1', label: '1 Person', icon: User },
            { value: '2', label: '2 People', icon: Users },
            { value: '3', label: '3 People', icon: Users },
            { value: '4', label: '4 People', icon: Users },
            { value: '5+', label: '5+ People', icon: UserPlus }
          ].map((occupant) => (
            <SelectionButton
              key={occupant.value}
              icon={occupant.icon}
              label={occupant.label}
              value={occupant.value}
              selected={data.occupants === occupant.value}
              onClick={() => onUpdate({ occupants: occupant.value })}
            />
          ))}
        </div>
      </div>

      {/* 6. Current Boiler Type */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">What type of boiler do you currently have?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'Combi', label: 'Combi Boiler', icon: Flame, desc: 'Heats water on demand' },
            { value: 'System', label: 'System Boiler', icon: Settings, desc: 'With hot water cylinder' },
            { value: 'Regular', label: 'Regular Boiler', icon: Gauge, desc: 'With tank and cylinder' }
          ].map((boiler) => (
            <SelectionButton
              key={boiler.value}
              icon={boiler.icon}
              label={boiler.label}
              value={boiler.desc}
              selected={data.currentBoiler === boiler.value}
              onClick={() => onUpdate({ currentBoiler: boiler.value })}
            />
          ))}
        </div>
      </div>

      {/* 7. Flue Location */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">Where is your current flue located?</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={() => handleFlueLocationSelect(flue.value)}
            />
          ))}
        </div>

        {/* Flue Extension */}
        {showFlueExtension && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Will you need flue extension work?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: '0', label: 'None' },
                { value: '1-2', label: '1-2 meters' },
                { value: '3-4', label: '3-4 meters' },
                { value: '5+', label: '5+ meters' }
              ].map((extension) => (
                <SelectionButton
                  key={extension.value}
                  icon={Wrench}
                  label={extension.label}
                  value={extension.value}
                  selected={data.flueExtension === extension.value}
                  onClick={() => onUpdate({ flueExtension: extension.value })}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 8. Drain Nearby */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
          Is there a suitable drain within 3 meters of your boiler?
        </Label>
        <div className="grid grid-cols-2 gap-4">
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
              onClick={() => handleDrainSelect(drain.value)}
            />
          ))}
        </div>
        
        {showCondensateMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-blue-700">
              <Wrench className="w-5 h-5" />
              <span className="font-medium">Condensate pump will be added to your quote</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 9. Move Boiler */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
          Do you want to move your boiler to a different location?
        </Label>
        <div className="grid grid-cols-2 gap-4">
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
              onClick={() => handleRelocationSelect(move.value)}
            />
          ))}
        </div>
        
        {showRelocationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Additional survey may be required for relocation</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 10. Parking Situation */}
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">What's the parking situation?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'driveway', label: 'Driveway/Free', icon: Car },
            { value: 'resident', label: 'Resident Permit', icon: Shield },
            { value: 'paid', label: 'Paid Parking', icon: Navigation }
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

        {/* Parking Distance */}
        {data.parkingSituation && data.parkingSituation !== 'driveway' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Distance from property to parking:
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '5', label: 'Under 20m' },
                { value: '20', label: '20-50m' },
                { value: '50', label: 'Over 50m' }
              ].map((distance) => (
                <SelectionButton
                  key={distance.value}
                  icon={MapPin}
                  label={distance.label}
                  value={distance.value}
                  selected={data.parkingDistance === distance.value}
                  onClick={() => onUpdate({ parkingDistance: distance.value })}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floor Level for Flats */}
      {data.propertyType === 'Flat' && (
        <>
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">Which floor is your flat on?</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'Ground', label: 'Ground Floor', icon: Building },
                { value: '1-2', label: '1st-2nd Floor', icon: Building2 },
                { value: '3+', label: '3rd Floor+', icon: Building2 }
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

          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-4 block">Is there a lift available?</Label>
            <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}