
import React, { useState } from 'react';
import { LocationInput } from './LocationInput';
import { FloodHistoryDashboard } from './FloodHistoryDashboard';
import { FloodMap } from './FloodMap';

// Mock data for demonstration
const mockFloodData = {
  'Houston, TX': {
    events: [
      {
        date: 'August 2023',
        severity: 'Major' as const,
        damageLevel: 75,
        description: 'Hurricane flooding caused widespread damage to residential areas and infrastructure.',
        season: 'Summer'
      },
      {
        date: 'September 2022',
        severity: 'Moderate' as const,
        damageLevel: 45,
        description: 'Heavy rainfall led to street flooding and temporary evacuations.',
        season: 'Fall'
      },
      {
        date: 'June 2021',
        severity: 'Severe' as const,
        damageLevel: 90,
        description: 'Record-breaking storm surge and rainfall caused catastrophic flooding.',
        season: 'Summer'
      }
    ],
    upcomingRisk: {
      level: 'High' as const,
      season: 'Hurricane Season (June-November)',
      probability: 78
    },
    floodLocations: [
      {
        id: 1,
        coordinates: [-95.3698, 29.7604] as [number, number],
        name: 'Downtown Houston',
        lastFloodDate: 'Aug 2023',
        severity: 'Major' as const,
        damageLevel: 75,
        description: 'Historic downtown area prone to flash flooding during heavy storms.',
        riskLevel: 'High' as const
      },
      {
        id: 2,
        coordinates: [-95.4, 29.8] as [number, number],
        name: 'Memorial Park Area',
        lastFloodDate: 'Sep 2022',
        severity: 'Moderate' as const,
        damageLevel: 45,
        description: 'Residential area with recurring drainage issues.',
        riskLevel: 'Medium' as const
      },
      {
        id: 3,
        coordinates: [-95.3, 29.7] as [number, number],
        name: 'Ship Channel District',
        lastFloodDate: 'Jun 2021',
        severity: 'Severe' as const,
        damageLevel: 90,
        description: 'Industrial area heavily impacted by storm surge.',
        riskLevel: 'High' as const
      },
      {
        id: 4,
        coordinates: [-95.35, 29.75] as [number, number],
        name: 'Westside Neighborhoods',
        lastFloodDate: 'May 2022',
        severity: 'Minor' as const,
        damageLevel: 25,
        description: 'Suburban area with occasional street flooding.',
        riskLevel: 'Low' as const
      }
    ]
  },
  'New Orleans, LA': {
    events: [
      {
        date: 'September 2023',
        severity: 'Severe' as const,
        damageLevel: 85,
        description: 'Hurricane brought storm surge and extensive flooding to low-lying areas.',
        season: 'Fall'
      },
      {
        date: 'August 2022',
        severity: 'Major' as const,
        damageLevel: 70,
        description: 'Tropical storm caused pump failures and widespread flooding.',
        season: 'Summer'
      }
    ],
    upcomingRisk: {
      level: 'High' as const,
      season: 'Hurricane Season',
      probability: 85
    },
    floodLocations: [
      {
        id: 1,
        coordinates: [-90.0715, 29.9511] as [number, number],
        name: 'French Quarter',
        lastFloodDate: 'Sep 2023',
        severity: 'Major' as const,
        damageLevel: 60,
        description: 'Historic district with aging drainage infrastructure.',
        riskLevel: 'High' as const
      }
    ]
  }
};

export const PersonalizedFloodDashboard: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Houston, TX');

  const handleLocationSubmit = (location: string) => {
    setSelectedLocation(location);
  };

  const locationData = mockFloodData[selectedLocation as keyof typeof mockFloodData] || mockFloodData['Houston, TX'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel - Location Input and History */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto">
        <LocationInput 
          onLocationSubmit={handleLocationSubmit}
          currentLocation={selectedLocation}
        />
        
        <FloodHistoryDashboard
          location={selectedLocation}
          floodEvents={locationData.events}
          upcomingRisk={locationData.upcomingRisk}
        />
      </div>

      {/* Right Panel - Interactive Map */}
      <div className="lg:col-span-2">
        <FloodMap
          selectedLocation={selectedLocation}
          floodLocations={locationData.floodLocations}
        />
      </div>
    </div>
  );
};
