
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, MessageCircle, Activity, X } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    zone?: string;
    severity?: 'low' | 'medium' | 'high';
    actionRequired?: boolean;
  };
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'system',
      content: 'FloodLight AI Assistant is now monitoring recent activity',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      type: 'ai',
      content: 'Hello! I\'m tracking recent flood activity. Water levels in Zone 3 have increased by 15% in the last hour. Would you like me to provide more details?',
      timestamp: new Date().toLocaleTimeString(),
      metadata: { zone: 'Zone 3', severity: 'medium', actionRequired: true }
    },
    {
      id: 3,
      type: 'ai',
      content: 'Recent updates: 🌧️ Rain intensity increasing in northern sectors. 📡 3 new sensor readings received. 🚨 1 community report verified.',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const recentActivities = [
    { time: '2 min ago', activity: 'Water level spike detected in Zone 3', severity: 'high' },
    { time: '5 min ago', activity: 'Drone Agent completed sweep of affected areas', severity: 'low' },
    { time: '8 min ago', activity: 'Community report verified: Road flooding on Main St', severity: 'medium' },
    { time: '12 min ago', activity: 'Weather Bot updated rain forecast', severity: 'low' },
    { time: '15 min ago', activity: 'New sensor data from River Monitoring Station', severity: 'medium' }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(newMessage),
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    if (input.includes('zone') || input.includes('area')) {
      return 'Currently monitoring 5 zones. Zone 3 shows elevated risk with 67% water level. Zone 1 and 2 are stable. Would you like detailed analysis for any specific zone?';
    } else if (input.includes('weather') || input.includes('rain')) {
      return '🌧️ Current weather: Moderate rain expected for next 3 hours. Precipitation rate: 12mm/hr. Wind speed: 15 km/h from southwest. This may increase flood risk in low-lying areas.';
    } else if (input.includes('alert') || input.includes('emergency')) {
      return '🚨 Current alerts: 2 active flood warnings, 1 road closure. Emergency services have been notified. Would you like me to update stakeholders or escalate any alerts?';
    } else if (input.includes('sensor') || input.includes('data')) {
      return '📡 Latest sensor data: 12 active sensors reporting. 3 showing elevated readings. Last sync: 30 seconds ago. All sensors operational with 98% uptime today.';
    }
    return 'I\'m analyzing current flood conditions and recent activity. How can I help you with monitoring the situation? You can ask about zones, weather, alerts, or sensor data.';
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getMessageBadgeColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-2xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            FloodLight AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Monitoring recent activity</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-full flex flex-col">
        {/* Recent Activity Feed */}
        <div className="p-3 bg-gray-50 border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Recent Activity
          </h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {recentActivities.slice(0, 3).map((activity, index) => (
              <div key={index} className="text-xs flex items-center justify-between">
                <span className="text-gray-600 truncate flex-1">{activity.activity}</span>
                <div className="flex items-center space-x-1 ml-2">
                  <Badge className={`text-xs px-1 py-0 ${getSeverityColor(activity.severity)}`}>
                    {activity.severity}
                  </Badge>
                  <span className="text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-600 text-center'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </span>
                    {message.metadata?.actionRequired && (
                      <Badge className={`text-xs ml-2 ${getMessageBadgeColor(message.metadata.severity)} text-white`}>
                        Action Required
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-3 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about zones, weather, alerts..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm" disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
