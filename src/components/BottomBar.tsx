
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CloudRain, Wifi, Clock, AlertTriangle } from 'lucide-react';

export const BottomBar: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Timestamp and Update Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Last updated: {currentTime}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Auto-refresh: 30s
          </Badge>
        </div>

        {/* System Status Indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Connected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Weather API Active</span>
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4" />
            <span>3 Active Alerts</span>
          </Button>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </div>
    </footer>
  );
};
