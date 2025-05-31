
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, MapPin, Camera, AlertTriangle, Key } from 'lucide-react';

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
  coordinates: [number, number];
}

export const Map: React.FC<MapProps> = ({ selectedLayer, emergencyMode }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [clickData, setClickData] = useState<MapClickData | null>(null);
  const [timelineValue, setTimelineValue] = useState(12);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-95.3698, 29.7604], // Houston, TX (flood-prone area)
        zoom: 10,
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current) return;

        // Add flood zones layer
        map.current.addSource('flood-zones', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-95.4, 29.8],
                      [-95.3, 29.8],
                      [-95.3, 29.7],
                      [-95.4, 29.7],
                      [-95.4, 29.8]
                    ]
                  ]
                },
                properties: { risk: 'high', name: 'Zone 1' }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [-95.35, 29.75],
                      [-95.25, 29.75],
                      [-95.25, 29.65],
                      [-95.35, 29.65],
                      [-95.35, 29.75]
                    ]
                  ]
                },
                properties: { risk: 'medium', name: 'Zone 2' }
              }
            ]
          }
        });

        map.current.addLayer({
          id: 'flood-zones-fill',
          type: 'fill',
          source: 'flood-zones',
          paint: {
            'fill-color': [
              'match',
              ['get', 'risk'],
              'high', '#ef4444',
              'medium', '#f59e0b',
              'low', '#22c55e',
              '#3b82f6'
            ],
            'fill-opacity': 0.4
          }
        });

        // Add sensors
        map.current.addSource('sensors', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [-95.37, 29.76] },
                properties: { status: 'normal', id: 1 }
              },
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [-95.33, 29.74] },
                properties: { status: 'warning', id: 2 }
              },
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [-95.35, 29.72] },
                properties: { status: 'alert', id: 3 }
              }
            ]
          }
        });

        map.current.addLayer({
          id: 'sensors',
          type: 'circle',
          source: 'sensors',
          paint: {
            'circle-color': [
              'match',
              ['get', 'status'],
              'normal', '#22c55e',
              'warning', '#f59e0b',
              'alert', '#ef4444',
              '#3b82f6'
            ],
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        setMapInitialized(true);
      });

      // Handle map clicks
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        
        const mockData: MapClickData = {
          x: e.point.x,
          y: e.point.y,
          coordinates: [lng, lat],
          zone: `Zone ${Math.floor(Math.random() * 5) + 1}`,
          waterLevel: Math.floor(Math.random() * 100),
          riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
          resources: ['Emergency Shelter (2.3km)', 'Fire Station (1.8km)', 'Hospital (4.5km)']
        };
        
        setClickData(mockData);
      });

      setTokenError(false);
    } catch (error) {
      console.error('Mapbox initialization error:', error);
      setTokenError(true);
    }

    return () => {
      map.current?.remove();
      setMapInitialized(false);
    };
  }, [mapboxToken]);

  // Update layer visibility based on selectedLayer
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    const layerVisibility = {
      'flood-zones-fill': selectedLayer === 'flood-zones',
      'sensors': selectedLayer === 'sensors' || selectedLayer === 'flood-zones'
    };

    Object.entries(layerVisibility).forEach(([layerId, visible]) => {
      if (map.current?.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    });
  }, [selectedLayer, mapInitialized]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  if (!mapboxToken) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-green-100 min-h-[600px] flex items-center justify-center">
        <Card className="w-96 p-6 bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
            </div>
            <p className="text-sm text-gray-600">
              To display the real map, please enter your Mapbox public token. 
              Get yours at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">mapbox.com</a>
            </p>
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.ey..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className={tokenError ? 'border-red-500' : ''}
              />
              {tokenError && (
                <p className="text-sm text-red-500">Invalid token. Please check your Mapbox token.</p>
              )}
            </div>
            <Button 
              onClick={() => setMapboxToken(mapboxToken)}
              className="w-full"
              disabled={!mapboxToken.startsWith('pk.')}
            >
              Initialize Map
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

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
            <div className="text-xs text-gray-500">
              Coordinates: {clickData.coordinates[1].toFixed(4)}, {clickData.coordinates[0].toFixed(4)}
            </div>
            
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
