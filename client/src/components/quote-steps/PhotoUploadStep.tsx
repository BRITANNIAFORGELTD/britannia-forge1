// PhotoUploadStep - Professional Mobile-First Photo Capture
// Enhanced with camera access, delete/replace functionality, and visual guides

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Camera, Upload, X, Check, AlertCircle, Eye, 
  Zap, Droplets, Settings, Wrench, Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  isLoading?: boolean;
}

interface PhotoRequirement {
  key: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
  tips: string[];
}

const PHOTO_REQUIREMENTS: PhotoRequirement[] = [
  {
    key: 'boilerCloseup',
    title: 'Boiler Close-up',
    description: 'Clear photo of boiler controls and model number',
    icon: Zap,
    required: true,
    tips: [
      'Include the manufacturer badge and model number',
      'Make sure text is readable',
      'Include the control panel/display'
    ]
  },
  {
    key: 'boilerDistant',
    title: 'Boiler & Surroundings',
    description: 'Wide shot showing boiler position and nearby pipework',
    icon: Eye,
    required: true,
    tips: [
      'Show the full boiler and surrounding area',
      'Include visible pipework and connections',
      'Show available space around the boiler'
    ]
  },
  {
    key: 'pipework',
    title: 'Pipework & Connections',
    description: 'Close-up of gas and water connections',
    icon: Wrench,
    required: true,
    tips: [
      'Focus on gas inlet connection',
      'Show cold water inlet and hot water outlet',
      'Include any visible isolation valves'
    ]
  },
  {
    key: 'flue',
    title: 'Flue Terminal',
    description: 'External view of where flue exits building',
    icon: Home,
    required: true,
    tips: [
      'Show the external flue terminal',
      'Include surrounding wall area',
      'Note if flue goes through wall or roof'
    ]
  },
  {
    key: 'electricalMeter',
    title: 'Main Electrical Meter / Fuse Box',
    description: 'Photo of your main electrical supply',
    icon: Zap,
    required: true,
    tips: [
      'Show the main electrical meter or consumer unit',
      'Include any visible labels or markings',
      'Ensure the photo is clear and well-lit'
    ]
  },
  {
    key: 'waterStopcock',
    title: 'Main Water Stopcock',
    description: 'Photo of your main water shut-off valve',
    icon: Droplets,
    required: true,
    tips: [
      'Usually located under the kitchen sink or near front door',
      'Show the valve and surrounding pipework',
      'Include any visible labels or tags'
    ]
  },
  {
    key: 'gasMeter',
    title: 'Gas Meter',
    description: 'Photo of gas meter and emergency control valve',
    icon: Settings,
    required: true,
    tips: [
      'Include the full gas meter',
      'Show the emergency control valve (ECV)',
      'Include meter reading if visible'
    ]
  },
  {
    key: 'additional1',
    title: 'Additional Photo 1',
    description: 'Any other relevant photos (cylinder, radiators, etc.)',
    icon: Camera,
    required: false,
    tips: [
      'Hot water cylinder (if applicable)',
      'Radiator examples',
      'Any specific concerns or areas'
    ]
  },
  {
    key: 'additional2',
    title: 'Additional Photo 2',
    description: 'Extra documentation photo',
    icon: Camera,
    required: false,
    tips: [
      'Alternative angle of boiler',
      'Airing cupboard layout',
      'Access route for engineer'
    ]
  },
  {
    key: 'additional3',
    title: 'Additional Photo 3',
    description: 'Property access or special considerations',
    icon: Camera,
    required: false,
    tips: [
      'Parking area for engineer vehicle',
      'Property entrance/access route',
      'Any obstacles or special considerations'
    ]
  },
  {
    key: 'additional4',
    title: 'Additional Photo 4',
    description: 'Any other relevant details',
    icon: Camera,
    required: false,
    tips: [
      'Loft space (if applicable)',
      'Basement or cellar areas',
      'Any other relevant property features'
    ]
  }
];

const PhotoUploadCard = ({ 
  requirement, 
  photo, 
  onPhotoSelect, 
  onPhotoDelete 
}: {
  requirement: PhotoRequirement;
  photo?: File;
  onPhotoSelect: (file: File) => void;
  onPhotoDelete: () => void;
}) => {
  const [showTips, setShowTips] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }

      onPhotoSelect(file);
    }
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Photo Preview or Upload Area */}
        <div className="relative aspect-video bg-gray-50">
          {photo ? (
            // Photo Preview
            <div className="relative w-full h-full">
              <img 
                src={URL.createObjectURL(photo)}
                alt={requirement.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={triggerCamera}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Retake
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={triggerFileUpload}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onPhotoDelete}
                    className="bg-red-500/90 hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* Success indicator */}
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            </div>
          ) : (
            // Upload Area
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <requirement.icon className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{requirement.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{requirement.description}</p>
              
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button
                  onClick={triggerCamera}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={triggerFileUpload}
                  variant="outline"
                  className="border-gray-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Gallery
                </Button>
              </div>

              {requirement.required && (
                <div className="flex items-center gap-1 mt-3 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Required</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Photo Details */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{requirement.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTips(!showTips)}
              className="text-blue-600 hover:text-blue-700"
            >
              Tips
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>

          {/* Photo Tips */}
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <h5 className="font-medium text-blue-900 mb-2">Photo Tips:</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  {requirement.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default function PhotoUploadStep({ data, onUpdate, isLoading }: PhotoUploadStepProps) {
  const requiredPhotos = PHOTO_REQUIREMENTS.filter(req => req.required);
  const optionalPhotos = PHOTO_REQUIREMENTS.filter(req => !req.required);
  
  const requiredUploaded = requiredPhotos.filter(req => data.photos?.[req.key]).length;
  const totalRequired = requiredPhotos.length;

  const handlePhotoSelect = (key: string, file: File) => {
    const updatedPhotos = { ...data.photos, [key]: file };
    onUpdate({ photos: updatedPhotos });
  };

  const handlePhotoDelete = (key: string) => {
    const updatedPhotos = { ...data.photos };
    delete updatedPhotos[key];
    onUpdate({ photos: updatedPhotos });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Photos</h2>
        <p className="text-gray-600 mb-4">
          Help us provide an accurate quote with these property photos
        </p>
        
        {/* Progress */}
        <div className="bg-gray-100 rounded-full p-1 max-w-md mx-auto">
          <div 
            className="bg-blue-500 text-white text-sm font-medium text-center p-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(20, (requiredUploaded / totalRequired) * 100)}%` }}
          >
            {requiredUploaded} / {totalRequired} Required
          </div>
        </div>
      </div>

      {/* Required Photos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
          Required Photos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requiredPhotos.map((requirement) => (
            <PhotoUploadCard
              key={requirement.key}
              requirement={requirement}
              photo={data.photos?.[requirement.key]}
              onPhotoSelect={(file) => handlePhotoSelect(requirement.key, file)}
              onPhotoDelete={() => handlePhotoDelete(requirement.key)}
            />
          ))}
        </div>
      </div>

      {/* Optional Photos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Camera className="w-5 h-5 text-blue-500 mr-2" />
          Additional Photos (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {optionalPhotos.map((requirement) => (
            <PhotoUploadCard
              key={requirement.key}
              requirement={requirement}
              photo={data.photos?.[requirement.key]}
              onPhotoSelect={(file) => handlePhotoSelect(requirement.key, file)}
              onPhotoDelete={() => handlePhotoDelete(requirement.key)}
            />
          ))}
        </div>
      </div>

      {/* Photo Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Photo Guidelines
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h5 className="font-medium mb-2">For best results:</h5>
              <ul className="space-y-1">
                <li>• Use good lighting (natural light preferred)</li>
                <li>• Keep camera steady and focused</li>
                <li>• Include model numbers and labels</li>
                <li>• Show the full context of each area</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Safety first:</h5>
              <ul className="space-y-1">
                <li>• Don't remove any covers or panels</li>
                <li>• Don't touch electrical connections</li>
                <li>• Take photos from a safe distance</li>
                <li>• If unsure, ask our engineers during installation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p>
          <strong>Privacy Notice:</strong> All photos are securely stored and only used for quote assessment. 
          Photos are automatically deleted after installation completion unless you request otherwise.
        </p>
      </div>
    </div>
  );
}