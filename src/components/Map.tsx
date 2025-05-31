
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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-green-100 min-h-[600px]">
      {/* Map Container with visible grid and geographic features */}
      <div 
        className="absolute inset-0 cursor-crosshair bg-cover bg-center"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), 
            linear-gradient(-45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%), 
            linear-gradient(-45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%),
            radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(239, 68, 68, 0.5) 0%, transparent 30%)
          `,
          backgroundSize: '20px 20px, 20px 20px, 20px 20px, 20px 20px, 200px 200px, 200px 200px, 150px 150px'
        }}
      >
        {/* Map Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map Overlay Indicators */}
        <div className="absolute top-4 left-4 space-y-2 z-10">
          {selectedLayer === 'flood-zones' && (
            <Badge className="bg-blue-500/90 text-white shadow-lg">📍 Flood Zones Active</Badge>
          )}
          {selectedLayer === 'rain-intensity' && (
            <Badge className="bg-green-500/90 text-white shadow-lg">🌧️ Rain Intensity Active</Badge>
          )}
          {selectedLayer === 'sensors' && (
            <Badge className="bg-purple-500/90 text-white shadow-lg">📡 Sensors Active</Badge>
          )}
        </div>

        {/* Mock Geographic Features */}
        <div className="absolute top-1/4 left-1/6 w-32 h-2 bg-blue-400 rounded-full opacity-60" title="River" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-300 rounded-full opacity-40" title="Park Area" />
        <div className="absolute bottom-1/3 left-1/3 w-40 h-4 bg-gray-400 rounded opacity-50" title="Highway" />

        {/* Mock Sensor Points */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-green-500 rounded-full animate-pulse cursor-pointer border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold" title="Sensor: Normal">✓</div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-yellow-500 rounded-full animate-pulse cursor-pointer border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold" title="Sensor: Warning">⚠</div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse cursor-pointer border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold" title="Sensor: Alert">!</div>

        {/* Mock Community Reports */}
        <div className="absolute top-2/3 left-1/3 cursor-pointer" title="Community Report">
          <div className="relative">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm border-2 border-white shadow-lg">
              📍
            </div>
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs animate-bounce">!</Badge>
          </div>
        </div>

        {/* Mock Drone Feed Indicator */}
        <div className="absolute top-1/4 right-1/4 cursor-pointer" title="Drone Feed">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white border-2 border-white shadow-lg hover:bg-blue-700 transition-colors">
            <Camera className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Zone Details Popup */}
      {clickData && (
        <Card 
          className="absolute z-50 w-80 p-4 bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200"
          style={{ 
            left: Math.min(clickData.x, (typeof window !== 'undefined' ? window.innerWidth : 800) - 350), 
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
