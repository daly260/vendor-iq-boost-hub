
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  TicketIcon, 
  Users, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: '🏠 Dashboard', href: '/', icon: Home },
    { name: '📚 Apprentissage', href: '/learning', icon: BookOpen },
    { name: '🏆 Classement', href: '/leaderboard', icon: Trophy },
    { name: '🎫 Support', href: '/tickets', icon: TicketIcon },
    { name: '📺 Live Sessions', href: '/live-sessions', icon: Users },
  ];

  const adminNavigation = [
    { name: '⚙️ Admin', href: '/admin', icon: Settings }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-rainbow rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold">V</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-rainbow bg-clip-text text-transparent">
                Vendor IQ Boost
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center space-x-3 p-3 bg-gradient-ocean rounded-xl text-white">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm opacity-90">Niveau {currentUser.level}</p>
              </div>
            </div>
          </div>

          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-rainbow text-white shadow-lg transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {currentUser.role === 'admin' && (
            <div className="px-3 mt-6">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-sunset text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-vibrant-blue"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-rainbow p-2 rounded-lg text-white">
                  <Trophy className="h-4 w-4" />
                  <span className="font-bold">{currentUser.points.toLocaleString()}</span>
                </div>

                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-vibrant-red rounded-full animate-pulse"></span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="p-2"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
