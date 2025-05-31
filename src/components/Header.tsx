
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Settings, Shield, Users } from 'lucide-react';

interface HeaderProps {
  currentStakeholder: 'B2B' | 'Citizen';
  setCurrentStakeholder: (type: 'B2B' | 'Citizen') => void;
  emergencyMode: boolean;
  setEmergencyMode: (mode: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStakeholder,
  setCurrentStakeholder,
  emergencyMode,
  setEmergencyMode
}) => {
  return (
    <header className={`${emergencyMode ? 'bg-red-900 text-white' : 'bg-white/90 backdrop-blur-sm'} border-b border-gray-200 px-6 py-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FL</span>
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${emergencyMode ? 'text-white' : 'text-gray-800'}`}>
              FloodLight
            </h1>
            <p className={`text-xs ${emergencyMode ? 'text-red-200' : 'text-gray-500'}`}>
              We're watching the waters for you
            </p>
          </div>
        </div>

        {/* Stakeholder Switch */}
        <div className="flex items-center space-x-2">
          <Button
            variant={currentStakeholder === 'B2B' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentStakeholder('B2B')}
            className="flex items-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>Emergency Manager</span>
          </Button>
          <Button
            variant={currentStakeholder === 'Citizen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentStakeholder('Citizen')}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Citizen</span>
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant={emergencyMode ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setEmergencyMode(!emergencyMode)}
          >
            {emergencyMode ? 'Exit Emergency Mode' : 'Emergency Mode'}
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
              <DropdownMenuItem>Export Reports</DropdownMenuItem>
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Avatar>
            <AvatarFallback>EM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
