import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Shield, Users, Menu, X, Home, 
  Sparkles, Clock, Pill, Phone, Bell, Bot,
  LogOut, Settings, BookOpen, Heart, User
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from '@/hooks/useSupabaseAuth';
import { RemindersProvider, useReminders } from '@/hooks/useReminders';

import AuthSection from '@/sections/AuthSection';
import HeroSection from '@/sections/HeroSection';
import DashboardSection from '@/sections/DashboardSection';
import MedicationSection from '@/sections/MedicationSection';
import RoutineSection from '@/sections/RoutineSection';
import MemorySection from '@/sections/MemorySection';
import ActivitySection from '@/sections/ActivitySection';
import SafetySection from '@/sections/SafetySection';
import CaregiverSection from '@/sections/CaregiverSection';
import ResourcesSection from '@/sections/ResourcesSection';
import MedicationManager from '@/sections/MedicationManager';
import AIAssistant from '@/sections/AIAssistant';
import RemindersSection from '@/sections/RemindersSection';
import WhoIAmSection from '@/sections/WhoIAmSection';

import './App.css';

export type AppView = 
  | 'home' 
  | 'dashboard' 
  | 'medications' 
  | 'routines' 
  | 'memories' 
  | 'activities' 
  | 'safety' 
  | 'caregiver' 
  | 'resources'
  | 'whoiam';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const navItems: NavItem[] = [
  { 
    id: 'dashboard', 
    label: 'My Day', 
    icon: Home, 
    description: 'See what\'s planned for today',
    color: 'bg-blue-500'
  },
  { 
    id: 'whoiam', 
    label: 'Who I Am', 
    icon: User, 
    description: 'Your identity and information',
    color: 'bg-amber-500'
  },
  { 
    id: 'medications', 
    label: 'Medications', 
    icon: Pill, 
    description: 'Track and manage medications',
    color: 'bg-green-500'
  },
  { 
    id: 'routines', 
    label: 'Daily Routines', 
    icon: Clock, 
    description: 'Follow your daily schedule',
    color: 'bg-orange-500'
  },
  { 
    id: 'memories', 
    label: 'My Memories', 
    icon: BookOpen, 
    description: 'View cherished memories',
    color: 'bg-purple-500'
  },
  { 
    id: 'activities', 
    label: 'Activities', 
    icon: Sparkles, 
    description: 'Brain games and exercises',
    color: 'bg-pink-500'
  },
  { 
    id: 'safety', 
    label: 'Safety', 
    icon: Shield, 
    description: 'Emergency and location features',
    color: 'bg-red-500'
  },
  { 
    id: 'caregiver', 
    label: 'Caregiver', 
    icon: Heart, 
    description: 'Support for family caregivers',
    color: 'bg-teal-500'
  },
  { 
    id: 'resources', 
    label: 'Resources', 
    icon: Users, 
    description: 'Helpful information and support',
    color: 'bg-indigo-500'
  },
];

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const { upcomingReminders, overdueReminders } = useReminders();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showMedicationManager, setShowMedicationManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Handle emergency button
  const handleEmergency = () => {
    setEmergencyMode(true);
    toast.error('Emergency Contact Alerted!', {
      description: 'Your caregiver has been notified of your location.',
      duration: 5000,
    });
    setTimeout(() => setEmergencyMode(false), 3000);
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HeroSection onNavigate={setCurrentView} />;
      case 'dashboard':
        return <DashboardSection onNavigate={setCurrentView} />;
      case 'whoiam':
        return <WhoIAmSection onClose={() => setCurrentView('dashboard')} />;
      case 'medications':
        return <MedicationSection />;
      case 'routines':
        return <RoutineSection />;
      case 'memories':
        return <MemorySection />;
      case 'activities':
        return <ActivitySection />;
      case 'safety':
        return <SafetySection onEmergency={handleEmergency} />;
      case 'caregiver':
        return <CaregiverSection />;
      case 'resources':
        return <ResourcesSection />;
      default:
        return <DashboardSection onNavigate={setCurrentView} />;
    }
  };

  // Show notification badge count
  const notificationCount = upcomingReminders.length + overdueReminders.length;

  if (!isAuthenticated) {
    return <AuthSection onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-3 interactive-element"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">Memoria</h1>
                <p className="text-xs text-gray-500">Your Care Companion</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* AI Assistant Button */}
              <button
                onClick={() => setShowAIAssistant(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">AI Help</span>
              </button>

              {/* Reminders Button */}
              <button
                onClick={() => setShowReminders(true)}
                className="relative p-2 rounded-xl bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Emergency Button */}
              <button
                onClick={handleEmergency}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  emergencyMode 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                aria-label="Emergency"
              >
                <Phone className="w-5 h-5" />
              </button>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.[0] || 'U'}
                  </span>
                </div>
              </button>

              {/* Menu Button (Mobile) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Menu"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{user?.name?.[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setShowMedicationManager(true);
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <Pill className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Manage Medications</span>
              </button>
              <button
                onClick={() => {
                  setShowReminders(true);
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <Bell className="w-5 h-5 text-amber-500" />
                <span className="text-gray-700">My Reminders</span>
                {notificationCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  toast.info('Settings coming soon!');
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Settings</span>
              </button>
              <div className="border-t border-gray-100 my-2" />
              <button
                onClick={() => {
                  logout();
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Button (Mobile) */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform lg:hidden"
      >
        <Bot className="w-7 h-7 text-white" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 bottom-0 w-72 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{user?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu</h2>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-amber-100 text-amber-800'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </nav>

                <div className="border-t border-gray-200 my-4" />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <button
                    onClick={() => {
                      setShowAIAssistant(true);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    <Bot className="w-5 h-5" />
                    <span className="font-medium">AI Assistant</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMedicationManager(true);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <Pill className="w-5 h-5" />
                    <span className="font-medium">Manage Medications</span>
                  </button>
                  <button
                    onClick={() => {
                      handleEmergency();
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">Call Emergency Contact</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'text-amber-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'fill-current' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Spacer for Mobile */}
      <div className="h-16 lg:hidden" />

      {/* Modals */}
      <AnimatePresence>
        {showMedicationManager && (
          <MedicationManager onClose={() => setShowMedicationManager(false)} />
        )}
        {showAIAssistant && (
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        )}
        {showReminders && (
          <RemindersSection onClose={() => setShowReminders(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RemindersProvider>
        <AppContent />
      </RemindersProvider>
    </AuthProvider>
  );
}

export default App;
