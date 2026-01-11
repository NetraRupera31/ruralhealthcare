import { Home, FileText, LayoutDashboard, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Sidebar({ isOpen, onClose, currentScreen, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home Screen', icon: Home },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'dashboards', label: 'Dashboards', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-20"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-72 bg-[#0d3b2f] z-30 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-semibold">Menu</h2>
            <button onClick={onClose} className="text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#4ade80] text-[#0d3b2f]'
                      : 'text-white hover:bg-[#1a5742]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
