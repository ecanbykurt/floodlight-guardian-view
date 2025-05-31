
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { PersonalizedFloodDashboard } from '../components/PersonalizedFloodDashboard';
import { LeftPanel } from '../components/LeftPanel';
import { RightPanel } from '../components/RightPanel';
import { BottomBar } from '../components/BottomBar';
import { AIChatbot } from '../components/AIChatbot';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const [currentStakeholder, setCurrentStakeholder] = useState<'B2B' | 'Citizen'>('Citizen');
  const [selectedLayer, setSelectedLayer] = useState<string>('flood-zones');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'professional'>('dashboard');

  return (
    <div className={`min-h-screen flex flex-col ${emergencyMode ? 'high-contrast' : 'bg-gradient-to-br from-blue-50 to-green-50'}`}>
      <Header 
        currentStakeholder={currentStakeholder}
        setCurrentStakeholder={setCurrentStakeholder}
        emergencyMode={emergencyMode}
        setEmergencyMode={setEmergencyMode}
      />
      
      {viewMode === 'dashboard' ? (
        // Personalized Dashboard View
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Personal Flood Risk Dashboard
                </h1>
                <p className="text-gray-600">
                  Enter your location to see flood history, damage assessments, and seasonal patterns in your area
                </p>
              </div>
              <Button 
                onClick={() => setViewMode('professional')}
                variant="outline"
              >
                Professional View
              </Button>
            </div>
            <PersonalizedFloodDashboard />
          </div>
        </div>
      ) : (
        // Professional View (Original Layout)
        <div className="flex-1 flex overflow-hidden">
          <LeftPanel 
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
            currentStakeholder={currentStakeholder}
            emergencyMode={emergencyMode}
          />
          
          <div className="flex-1 relative">
            <PersonalizedFloodDashboard />
          </div>
          
          <RightPanel 
            currentStakeholder={currentStakeholder}
            emergencyMode={emergencyMode}
          />
        </div>
      )}
      
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

      {/* View Mode Toggle */}
      {viewMode === 'professional' && (
        <Button
          onClick={() => setViewMode('dashboard')}
          className="fixed top-20 right-4 z-40"
          variant="outline"
        >
          Dashboard View
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
