
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Layers, Settings, Users, Mail, MessageSquare, Slack } from 'lucide-react';

interface LeftPanelProps {
  selectedLayer: string;
  setSelectedLayer: (layer: string) => void;
  currentStakeholder: 'B2B' | 'Citizen';
  emergencyMode: boolean;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  selectedLayer,
  setSelectedLayer,
  currentStakeholder,
  emergencyMode
}) => {
  const [layerStates, setLayerStates] = useState({
    'flood-zones': true,
    'rain-intensity': false,
    'infrastructure-risk': false,
    'road-closures': false,
    'power-grid': false,
    'sensors': true
  });

  const [alertThreshold, setAlertThreshold] = useState(60);

  const toggleLayer = (layer: string) => {
    setLayerStates(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
    if (!layerStates[layer]) {
      setSelectedLayer(layer);
    }
  };

  const layers = [
    { id: 'flood-zones', name: 'Flood Zones', color: 'bg-blue-500' },
    { id: 'rain-intensity', name: 'Rain Intensity', color: 'bg-green-500' },
    { id: 'infrastructure-risk', name: 'Infrastructure at Risk', color: 'bg-orange-500' },
    { id: 'road-closures', name: 'Road Closures', color: 'bg-red-500' },
    { id: 'power-grid', name: 'Power Grid', color: 'bg-yellow-500' },
    { id: 'sensors', name: 'Sensor Locations', color: 'bg-purple-500' }
  ];

  return (
    <div className={`w-80 ${emergencyMode ? 'bg-gray-900' : 'bg-white/50'} backdrop-blur-sm border-r border-gray-200 overflow-y-auto`}>
      <div className="p-4 space-y-4">
        
        {/* Map Layers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Map Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {layers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                  <Label htmlFor={layer.id} className="text-sm">
                    {layer.name}
                  </Label>
                </div>
                <Switch
                  id={layer.id}
                  checked={layerStates[layer.id]}
                  onCheckedChange={() => toggleLayer(layer.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alert Settings - B2B Only */}
        {currentStakeholder === 'B2B' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="threshold" className="text-sm mb-2 block">
                  Flood Risk Threshold: {alertThreshold}%
                </Label>
                <Input
                  id="threshold"
                  type="range"
                  min="0"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Notification Channels</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>SMS</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Slack className="w-4 h-4" />
                    <span>Slack</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stakeholder Management - B2B Only */}
        {currentStakeholder === 'B2B' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Response Team</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Municipal Coordinators</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NGO Partners</span>
                <Badge variant="outline">Inactive</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Add Stakeholder
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Citizen Quick Actions */}
        {currentStakeholder === 'Citizen' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                Report Incident
              </Button>
              <Button className="w-full" variant="outline">
                Check My Area Safety
              </Button>
              <Button className="w-full" variant="outline">
                Emergency Contacts
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Current Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Sources</span>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Agents</span>
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Weather API</span>
              <Badge className="bg-green-500 text-white">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
