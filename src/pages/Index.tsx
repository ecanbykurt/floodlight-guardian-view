
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Map } from '../components/Map';
import { LeftPanel } from '../components/LeftPanel';
import { RightPanel } from '../components/RightPanel';
import { BottomBar } from '../components/BottomBar';

const Index = () => {
  const [currentStakeholder, setCurrentStakeholder] = useState<'B2B' | 'Citizen'>('B2B');
  const [selectedLayer, setSelectedLayer] = useState<string>('flood-zones');
  const [emergencyMode, setEmergencyMode] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${emergencyMode ? 'high-contrast' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
      <Header 
        currentStakeholder={currentStakeholder}
        setCurrentStakeholder={setCurrentStakeholder}
        emergencyMode={emergencyMode}
        setEmergencyMode={setEmergencyMode}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel 
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          currentStakeholder={currentStakeholder}
          emergencyMode={emergencyMode}
        />
        
        <div className="flex-1 relative">
          <Map 
            selectedLayer={selectedLayer}
            emergencyMode={emergencyMode}
          />
        </div>
        
        <RightPanel 
          currentStakeholder={currentStakeholder}
          emergencyMode={emergencyMode}
        />
      </div>
      
      <BottomBar />
    </div>
  );
};

export default Index;
