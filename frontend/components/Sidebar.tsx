import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, Magnet, Database, MessageSquare, 
  Users, Layers, Megaphone, PhoneCall, Settings, Code,
  Sun, Moon
} from 'lucide-react';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    // Added dark:bg-slate-900 and dark:border-slate-800
    <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 h-screen hidden md:flex flex-col sticky top-0 transition-colors duration-200">
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center">
          <span className="text-white dark:text-black font-bold text-xl">G</span>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">GrowEasy</span>
      </div>

      <div className="px-6 pb-4">
        {/* Added dark:bg-slate-800 and dark:border-slate-700 */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-2 shadow-sm">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">VK</div>
          <div>
            <p className="text-sm font-semibold dark:text-white">VK Test</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">OWNER</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 text-sm">
        <div>
          <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">Main</p>
          <div className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeTab === 'Dashboard'} 
              onClick={() => setActiveTab('Dashboard')}
            />
            <NavItem icon={<Magnet size={18} />} label="Generate Leads" />
            <NavItem 
              icon={<Database size={18} />} 
              label="Manage Leads" 
              active={activeTab === 'Manage Leads'} 
              onClick={() => setActiveTab('Manage Leads')}
            />
            <NavItem icon={<MessageSquare size={18} />} label="Engage Leads" />
          </div>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">Control Center</p>
          <div className="space-y-1">
            <NavItem icon={<Users size={18} />} label="Team Members" />
            <NavItem 
              icon={<Layers size={18} />} 
              label="Lead Sources" 
              active={activeTab === 'Lead Sources'} 
              onClick={() => setActiveTab('Lead Sources')}
            />
            <NavItem icon={<Megaphone size={18} />} label="Ad Accounts" />
            <NavItem icon={<PhoneCall size={18} />} label="Tele Calling" />
            <NavItem icon={<Settings size={18} />} label="CRM Fields" />
            <NavItem icon={<Code size={18} />} label="API Center" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <ThemeToggle />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        // Added dark variants for the active (green/teal) and inactive states
        active 
          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until the component is mounted in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a blank placeholder of the exact same size to prevent layout shift before hydration
  if (!mounted) {
    return <div className="h-[40px] w-full bg-gray-100 dark:bg-slate-800 rounded-lg"></div>;
  }

  // We use resolvedTheme instead of theme because the user's default might be "system"
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}