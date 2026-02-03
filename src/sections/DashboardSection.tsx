import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Pill, Clock, Calendar, Heart, Activity, 
  CheckCircle2, Circle, ChevronRight, Sparkles,
  MapPin, Phone, AlertCircle, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { AppView } from '@/App';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { 
  getTodaysRoutines, getTodaysMedications, getUpcomingAppointments
} from '@/data/mockData';
import TimeOrientationWidget from '@/components/TimeOrientationWidget';
import FamiliarFacesPanel from '@/components/FamiliarFacesPanel';
import CalmingMessage from '@/components/CalmingMessage';

interface DashboardSectionProps {
  onNavigate: (view: AppView) => void;
}

export default function DashboardSection({ onNavigate }: DashboardSectionProps) {
  const { user, patientProfile } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [routines, setRoutines] = useState(getTodaysRoutines().map(r => ({ ...r, completed: false })));
  const [medications, setMedications] = useState(getTodaysMedications().map(m => ({ ...m, taken: false })));
  const [appointments] = useState(getUpcomingAppointments());
  
  const preferredName = patientProfile?.identityProfile?.preferredName || user?.name?.split(' ')[0] || 'Friend';

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
    toast.success('Routine updated!');
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, taken: !m.taken } : m
    ));
    const med = medications.find(m => m.id === id);
    if (med && !(med as any).taken) {
      toast.success(`${med.name} marked as taken!`, {
        description: `Great job keeping up with your medications.`,
      });
    }
  };

  const completedRoutines = routines.filter(r => r.completed).length;
  const takenMedications = medications.filter((m: any) => m.taken).length;
  const routineProgress = routines.length > 0 ? (completedRoutines / routines.length) * 100 : 0;
  const medicationProgress = medications.length > 0 ? (takenMedications / medications.length) * 100 : 0;

  return (
    <div className="section-padding pb-24 lg:pb-12">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {greeting}, {preferredName}!
              </h1>
              <p className="text-gray-600">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{takenMedications}/{medications.length}</p>
                    <p className="text-sm text-gray-600">Meds Taken</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedRoutines}/{routines.length}</p>
                    <p className="text-sm text-gray-600">Routines Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-gray-600">Activities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-rose-50 to-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Good</p>
                    <p className="text-sm text-gray-600">Mood Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Medication Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">Medications</span>
                      <span className="text-sm text-gray-500">{Math.round(medicationProgress)}%</span>
                    </div>
                    <Progress value={medicationProgress} className="h-3" />
                  </div>

                  {/* Routine Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">Daily Routines</span>
                      <span className="text-sm text-gray-500">{Math.round(routineProgress)}%</span>
                    </div>
                    <Progress value={routineProgress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Medications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-500" />
                    Today's Medications
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('medications')}
                    className="text-amber-600"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medications.slice(0, 3).map((med: any) => (
                      <div 
                        key={med.id}
                        onClick={() => toggleMedication(med.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          med.taken 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-gray-50 border-2 border-transparent hover:border-amber-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          med.taken ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {med.taken ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Circle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${med.taken ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                            {med.name}
                          </p>
                          <p className="text-sm text-gray-500">{med.dosage} • {med.times[0]}</p>
                        </div>
                        {!med.taken && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Take Now
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Routines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Today's Routines
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('routines')}
                    className="text-amber-600"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routines.slice(0, 4).map((routine) => (
                      <div 
                        key={routine.id}
                        onClick={() => toggleRoutine(routine.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          routine.completed 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-gray-50 border-2 border-transparent hover:border-amber-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          routine.completed ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                          {routine.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${routine.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                            {routine.title}
                          </p>
                          <p className="text-sm text-gray-500">{routine.time} • {routine.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Time & Place Orientation Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <TimeOrientationWidget />
            </motion.div>

            {/* Calming Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CalmingMessage compact />
            </motion.div>

            {/* Familiar Faces */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <FamiliarFacesPanel compact />
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="flex gap-3 p-3 rounded-xl bg-blue-50">
                        <div className="w-12 h-12 rounded-lg bg-blue-500 flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-bold">
                            {apt.dateTime.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold">
                            {apt.dateTime.getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{apt.title}</p>
                          <p className="text-xs text-gray-500">
                            {apt.dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-xs text-gray-500">{apt.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => onNavigate('memories')}
                    >
                      <BookOpen className="w-6 h-6 text-rose-500" />
                      <span className="text-sm">View Memories</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => onNavigate('activities')}
                    >
                      <Activity className="w-6 h-6 text-purple-500" />
                      <span className="text-sm">Activities</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => onNavigate('safety')}
                    >
                      <MapPin className="w-6 h-6 text-green-500" />
                      <span className="text-sm">Location</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex flex-col items-center gap-2 border-red-200 hover:bg-red-50"
                      onClick={() => toast.error('Emergency contact notified!')}
                    >
                      <Phone className="w-6 h-6 text-red-500" />
                      <span className="text-sm text-red-600">Emergency</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-100 to-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Daily Tip</h4>
                      <p className="text-sm text-amber-800">
                        Take a moment to look at family photos. Reminiscing can bring joy 
                        and help maintain cognitive connections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
