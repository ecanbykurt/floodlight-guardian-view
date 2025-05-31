
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain, Bot, MessageCircle, TrendingUp, AlertCircle, ThumbsUp, Eye } from 'lucide-react';

interface RightPanelProps {
  currentStakeholder: 'B2B' | 'Citizen';
  emergencyMode: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  currentStakeholder,
  emergencyMode
}) => {
  const [agentStates, setAgentStates] = useState({
    'drone-agent': true,
    'weather-bot': true,
    'regulation-agent': false,
    'social-media-agent': true,
    'survivor-guide-agent': false
  });

  const [newReport, setNewReport] = useState('');

  const toggleAgent = (agent: string) => {
    setAgentStates(prev => ({
      ...prev,
      [agent]: !prev[agent]
    }));
  };

  const agents = [
    { id: 'drone-agent', name: 'Drone Agent', status: 'Active', activity: 'Monitoring Zone 3' },
    { id: 'weather-bot', name: 'Weather Bot', status: 'Active', activity: 'Rain forecast updated' },
    { id: 'regulation-agent', name: 'Regulation Agent', status: 'Standby', activity: 'Compliance ready' },
    { id: 'social-media-agent', name: 'Social Media Agent', status: 'Active', activity: 'Scanning reports' },
    { id: 'survivor-guide-agent', name: 'Survivor Guide', status: 'Standby', activity: 'Emergency protocols ready' }
  ];

  const communityReports = [
    { id: 1, text: 'Water rising on Main Street near the bridge', verified: true, votes: 12, time: '2 min ago' },
    { id: 2, text: 'Road closure at Highway 101 - debris blocking', verified: false, votes: 3, time: '5 min ago' },
    { id: 3, text: 'Power outage in residential area near park', verified: true, votes: 8, time: '12 min ago' }
  ];

  return (
    <div className={`w-80 ${emergencyMode ? 'bg-gray-900 text-white' : 'bg-white/50'} backdrop-blur-sm border-l border-gray-200 overflow-y-auto`}>
      <div className="p-4 space-y-4">
        
        {/* AI Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${emergencyMode ? 'bg-red-800' : 'bg-blue-50'} border-l-4 border-blue-500`}>
              <p className="text-sm">
                <strong>Current Status:</strong> Rain intensity increasing in Zone 3. 
                Expected flood risk elevation within 2 hours. Emergency teams have been alerted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Master Agent Panel - B2B Only */}
        {currentStakeholder === 'B2B' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Agent Coordination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={agent.id} className="text-sm font-medium">
                        {agent.name}
                      </Label>
                      <Badge 
                        variant={agentStates[agent.id] ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {agentStates[agent.id] ? agent.status : 'Inactive'}
                      </Badge>
                    </div>
                    <Switch
                      id={agent.id}
                      checked={agentStates[agent.id]}
                      onCheckedChange={() => toggleAgent(agent.id)}
                    />
                  </div>
                  {agentStates[agent.id] && (
                    <p className="text-xs text-gray-600 ml-2">
                      {agent.activity}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics - B2B Only */}
        {currentStakeholder === 'B2B' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Data Accuracy</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Time</span>
                  <span>2.3s</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Agent Coordination</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community Feedback */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Community Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {communityReports.map((report) => (
              <div key={report.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm">{report.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {report.verified && (
                      <Badge className="bg-green-500 text-white text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">{report.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{report.votes}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Submit New Report */}
            <div className="space-y-2">
              <Textarea
                placeholder="Report an incident or observation..."
                value={newReport}
                onChange={(e) => setNewReport(e.target.value)}
                className="text-sm"
                rows={2}
              />
              <Button 
                size="sm" 
                className="w-full"
                disabled={!newReport.trim()}
              >
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Actions */}
        {emergencyMode && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                Emergency Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="destructive" size="sm" className="w-full">
                Activate All Agents
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Send Mass Alert
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Contact Emergency Services
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
