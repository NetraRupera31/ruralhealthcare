import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

interface SettingsProps {
  onNavigate: (screen: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Android Phone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen */}
        <div className="relative bg-[#0d3b2f] rounded-[2.5rem] overflow-hidden w-[375px] h-[812px]">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white rounded-sm">
                <div className="w-2 h-2 bg-white m-0.5"></div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="h-full overflow-y-auto px-6 pt-14 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button className="text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-white">Settings</h1>
              <div className="w-6"></div>
            </div>

            {/* Placeholder Content */}
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <h2 className="text-white mb-2">Settings Screen</h2>
                <p className="text-gray-400 text-sm">Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentScreen="settings"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
