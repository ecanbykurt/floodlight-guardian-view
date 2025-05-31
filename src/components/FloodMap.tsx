
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, MapPin, Calendar, AlertTriangle } from 'lucide-react';

interface FloodLocation {
  id: number;
  coordinates: [number, number];
  name: string;
  lastFloodDate: string;
  severity: 'Minor' | 'Moderate' | 'Major' | 'Severe';
  damageLevel: number;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface FloodMapProps {
  selectedLocation: string;
  floodLocations: FloodLocation[];
}

export const FloodMap: React.FC<FloodMapProps> = ({ selectedLocation, floodLocations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFlood, setSelectedFlood] = useState<FloodLocation | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Severe': return '#dc2626';
      case 'Major': return '#ef4444';
      case 'Moderate': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find closest flood location to click
    const clickedFlood = floodLocations.find((_, index) => {
      const markerX = 100 + (index % 4) * 150;
      const markerY = 150 + Math.floor(index / 4) * 120;
      const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2));
      return distance < 30;
    });

    if (clickedFlood) {
      setSelectedFlood(clickedFlood);
      setClickPosition({ x, y });
    } else {
      setSelectedFlood(null);
      setClickPosition(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Offline Map Container */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-blue-100 cursor-pointer overflow-hidden rounded-lg"
        onClick={handleMapClick}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 600">
            {/* Rivers and waterways */}
            <path d="M0,300 Q200,280 400,320 T800,300" stroke="#3b82f6" strokeWidth="4" fill="none" opacity="0.6" />
            <path d="M100,100 Q300,120 500,100 T800,120" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.4" />
            
            {/* Roads */}
            <line x1="0" y1="200" x2="800" y2="220" stroke="#6b7280" strokeWidth="3" opacity="0.3" />
            <line x1="150" y1="0" x2="180" y2="600" stroke="#6b7280" strokeWidth="3" opacity="0.3" />
            <line x1="0" y1="400" x2="800" y2="380" stroke="#6b7280" strokeWidth="2" opacity="0.3" />
            
            {/* City blocks */}
            <rect x="200" y="150" width="80" height="60" fill="#d1d5db" opacity="0.3" />
            <rect x="350" y="200" width="100" height="80" fill="#d1d5db" opacity="0.3" />
            <rect x="500" y="120" width="90" height="70" fill="#d1d5db" opacity="0.3" />
          </svg>
        </div>

        {/* Flood Location Markers */}
        {floodLocations.map((flood, index) => {
          const markerX = 100 + (index % 4) * 150;
          const markerY = 150 + Math.floor(index / 4) * 120;
          
          return (
            <div
              key={flood.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              style={{ left: markerX, top: markerY }}
            >
              {/* Flood Zone Circle */}
              <div 
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: getSeverityColor(flood.severity) }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              
              {/* Location Label */}
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                {flood.name}
              </div>
            </div>
          );
        })}

        {/* Selected Location Indicator */}
        {selectedLocation && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            📍 {selectedLocation}
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
          <h4 className="font-medium text-sm mb-2">Flood Severity</h4>
          <div className="space-y-1">
            {[
              { label: 'Severe', color: '#dc2626' },
              { label: 'Major', color: '#ef4444' },
              { label: 'Moderate', color: '#f59e0b' },
              { label: 'Minor', color: '#3b82f6' }
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flood Details Popup */}
      {selectedFlood && clickPosition && (
        <Card 
          className="absolute z-50 w-80 p-4 bg-white shadow-xl border"
          style={{ 
            left: Math.min(clickPosition.x, window.innerWidth - 350), 
            top: Math.max(clickPosition.y - 150, 20) 
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {selectedFlood.name}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedFlood(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Flood</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm font-medium">{selectedFlood.lastFloodDate}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Severity</span>
              <Badge 
                className="text-white"
                style={{ backgroundColor: getSeverityColor(selectedFlood.severity) }}
              >
                {selectedFlood.severity}
              </Badge>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Damage Level</span>
                <span className="text-sm font-medium">{selectedFlood.damageLevel}%</span>
              </div>
              <Progress value={selectedFlood.damageLevel} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Risk</span>
              <Badge className={`${getRiskColor(selectedFlood.riskLevel)} text-white`}>
                {selectedFlood.riskLevel}
              </Badge>
            </div>
            
            <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
              {selectedFlood.description}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
