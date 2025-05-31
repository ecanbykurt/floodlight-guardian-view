
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, MapPin, Camera, AlertTriangle } from 'lucide-react';

interface MapProps {
  selectedLayer: string;
  emergencyMode: boolean;
}

interface MapClickData {
  x: number;
  y: number;
  zone: string;
  waterLevel: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  resources: string[];
}

export const Map: React.FC<MapProps> = ({ selectedLayer, emergencyMode }) => {
  const [clickData, setClickData] = useState<MapClickData | null>(null);
  const [timelineValue, setTimelineValue] = useState(12);

  const handleMapClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Mock data based on click position
    const mockData: MapClickData = {
      x,
      y,
      zone: `Zone ${Math.floor(Math.random() * 5) + 1}`,
      waterLevel: Math.floor(Math.random() * 100),
      riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
      resources: ['Emergency Shelter (2.3km)', 'Fire Station (1.8km)', 'Hospital (4.5km)']
    };
    
    setClickData(mockData);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100">
      {/* Map Container */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(239, 68, 68, 0.4) 0%, transparent 30%)
          `
        }}
      >
        {/* Map Overlay Indicators */}
        <div className="absolute top-4 left-4 space-y-2">
          {selectedLayer === 'flood-zones' && (
            <Badge className="bg-blue-500/80 text-white">Flood Zones Active</Badge>
          )}
          {selectedLayer === 'rain-intensity' && (
            <Badge className="bg-green-500/80 text-white">Rain Intensity Active</Badge>
          )}
          {selectedLayer === 'sensors' && (
            <Badge className="bg-purple-500/80 text-white">Sensors Active</Badge>
          )}
        </div>

        {/* Mock Sensor Points */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse cursor-pointer border-2 border-white shadow-lg" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-pulse cursor-pointer border-2 border-white shadow-lg" />
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse cursor-pointer border-2 border-white shadow-lg" />

        {/* Mock Community Reports */}
        <div className="absolute top-2/3 left-1/3 cursor-pointer">
          <div className="relative">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm border-2 border-white shadow-lg">
              📍
            </div>
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">!</Badge>
          </div>
        </div>

        {/* Mock Drone Feed Indicator */}
        <div className="absolute top-1/4 right-1/4 cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white border-2 border-white shadow-lg">
            <Camera className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Zone Details Popup */}
      {clickData && (
        <Card 
          className="absolute z-50 w-80 p-4 bg-white/95 backdrop-blur-sm shadow-lg border"
          style={{ 
            left: Math.min(clickData.x, window.innerWidth - 350), 
            top: Math.max(clickData.y - 100, 20) 
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {clickData.zone} Details
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setClickData(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Water Level</span>
                <span className="text-sm font-medium">{clickData.waterLevel}%</span>
              </div>
              <Progress value={clickData.waterLevel} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Risk Level</span>
              <Badge className={`${getRiskColor(clickData.riskLevel)} text-white`}>
                {clickData.riskLevel}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Resources</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {clickData.resources.map((resource, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">24h Timeline</span>
                <span className="text-xs text-gray-500">{timelineValue}:00</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={timelineValue}
                onChange={(e) => setTimelineValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Emergency Alert Overlay */}
      {emergencyMode && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white p-2 z-40">
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-medium">EMERGENCY MODE ACTIVE - High flood risk detected in multiple zones</span>
          </div>
        </div>
      )}
    </div>
  );
};
