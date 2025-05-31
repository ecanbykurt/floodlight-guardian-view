
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, AlertTriangle, Droplets } from 'lucide-react';

interface FloodEvent {
  date: string;
  severity: 'Minor' | 'Moderate' | 'Major' | 'Severe';
  damageLevel: number;
  description: string;
  season: string;
}

interface FloodHistoryProps {
  location: string;
  floodEvents: FloodEvent[];
  upcomingRisk: {
    level: 'Low' | 'Medium' | 'High';
    season: string;
    probability: number;
  };
}

export const FloodHistoryDashboard: React.FC<FloodHistoryProps> = ({ 
  location, 
  floodEvents, 
  upcomingRisk 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Severe': return 'bg-red-600';
      case 'Major': return 'bg-red-500';
      case 'Moderate': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const seasonalData = floodEvents.reduce((acc, event) => {
    acc[event.season] = (acc[event.season] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonSeason = Object.entries(seasonalData).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-4">
      {/* Location Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Droplets className="w-6 h-6 mr-2 text-blue-500" />
            Flood History for {location}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Recent Flood Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Flood Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {floodEvents.slice(0, 3).map((event, index) => (
            <div key={index} className="p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{event.date}</span>
                <Badge className={`${getSeverityColor(event.severity)} text-white`}>
                  {event.severity}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Damage Level</span>
                <div className="flex items-center space-x-2">
                  <Progress value={event.damageLevel} className="w-20 h-2" />
                  <span className="text-xs">{event.damageLevel}%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seasonal Pattern */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Seasonal Flood Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Most Common Season</span>
                <Badge variant="secondary">{mostCommonSeason?.[0] || 'N/A'}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {mostCommonSeason?.[1] || 0} flood events recorded during {mostCommonSeason?.[0] || 'this season'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(seasonalData).map(([season, count]) => (
                <div key={season} className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-sm">{season}</div>
                  <div className="text-lg font-bold text-blue-600">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Risk Assessment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Upcoming Flood Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Risk Level</span>
              <Badge className={`${getRiskColor(upcomingRisk.level)} text-white`}>
                {upcomingRisk.level}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Probability for {upcomingRisk.season}</span>
                <span>{upcomingRisk.probability}%</span>
              </div>
              <Progress value={upcomingRisk.probability} className="h-2" />
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm">
                Based on historical data, flood risk is typically {upcomingRisk.level.toLowerCase()} during {upcomingRisk.season}. 
                Stay informed and have an emergency plan ready.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
