
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Map } from '../components/Map';
import { LeftPanel } from '../components/LeftPanel';
import { RightPanel } from '../components/RightPanel';
import { BottomBar } from '../components/BottomBar';
import { AIChatbot } from '../components/AIChatbot';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const [currentStakeholder, setCurrentStakeholder] = useState<'B2B' | 'Citizen'>('B2B');
  const [selectedLayer, setSelectedLayer] = useState<string>('flood-zones');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

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

      {/* AI Chatbot Toggle Button */}
      {!chatbotOpen && (
        <Button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg border-2 border-white"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />
    </div>
  );
};

export default Index;
