import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, Clock, Calendar, CheckCircle2, Circle, 
  ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { mockMedications } from '@/data/mockData';

export default function MedicationSection() {
  const [medications, setMedications] = useState(mockMedications.map(m => ({ ...m, taken: false, expanded: false })));
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, taken: !m.taken } : m
    ));
    const med = medications.find(m => m.id === id);
    if (med && !med.taken) {
      toast.success(`${med.name} marked as taken!`, {
        description: `Great job keeping up with your medications.`,
      });
    }
  };

  const toggleExpand = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, expanded: !m.expanded } : m
    ));
  };

  const takenCount = medications.filter(m => m.taken).length;
  const progress = medications.length > 0 ? (takenCount / medications.length) * 100 : 0;

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      daily: 'Once daily',
      twice_daily: 'Twice daily',
      three_times_daily: 'Three times daily',
      weekly: 'Weekly',
      as_needed: 'As needed',
    };
    return labels[freq] || freq;
  };

  // Group medications by time
  const morningMeds = medications.filter(m => m.times.some(t => parseInt(t) < 12));
  const afternoonMeds = medications.filter(m => m.times.some(t => parseInt(t) >= 12 && parseInt(t) < 17));
  const eveningMeds = medications.filter(m => m.times.some(t => parseInt(t) >= 17));

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
              <p className="text-gray-600">Track and manage your daily medications</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
                  <p className="text-gray-600">
                    {takenCount} of {medications.length} medications taken
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                </div>
              </div>
              <Progress value={progress} className="h-4" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Date Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(7)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i - 3);
              const isToday = i === 3;
              const isSelected = selectedDate.toDateString() === date.toDateString();
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 p-3 rounded-xl text-center min-w-[80px] transition-all ${
                    isSelected 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <p className="text-xs uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-xl font-bold">{date.getDate()}</p>
                  {isToday && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Today</span>}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Medication Schedule */}
        <div className="space-y-6">
          {/* Morning */}
          {morningMeds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Morning Medications
                    <Badge variant="secondary" className="ml-auto">
                      {morningMeds.filter(m => m.taken).length}/{morningMeds.length} Done
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {morningMeds.map((med) => (
                    <MedicationCard 
                      key={med.id} 
                      medication={med} 
                      onToggle={() => toggleMedication(med.id)}
                      onExpand={() => toggleExpand(med.id)}
                      getFrequencyLabel={getFrequencyLabel}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Afternoon */}
          {afternoonMeds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Afternoon Medications
                    <Badge variant="secondary" className="ml-auto">
                      {afternoonMeds.filter(m => m.taken).length}/{afternoonMeds.length} Done
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {afternoonMeds.map((med) => (
                    <MedicationCard 
                      key={med.id} 
                      medication={med} 
                      onToggle={() => toggleMedication(med.id)}
                      onExpand={() => toggleExpand(med.id)}
                      getFrequencyLabel={getFrequencyLabel}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Evening */}
          {eveningMeds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    Evening Medications
                    <Badge variant="secondary" className="ml-auto">
                      {eveningMeds.filter(m => m.taken).length}/{eveningMeds.length} Done
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {eveningMeds.map((med) => (
                    <MedicationCard 
                      key={med.id} 
                      medication={med} 
                      onToggle={() => toggleMedication(med.id)}
                      onExpand={() => toggleExpand(med.id)}
                      getFrequencyLabel={getFrequencyLabel}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Medication Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Medication Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Take medications at the same time each day to build a routine.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Some medications work better with food - check the instructions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Keep a list of all medications for doctor visits.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

interface MedicationCardProps {
  medication: any;
  onToggle: () => void;
  onExpand: () => void;
  getFrequencyLabel: (freq: string) => string;
}

function MedicationCard({ medication, onToggle, onExpand, getFrequencyLabel }: MedicationCardProps) {
  return (
    <div 
      className={`border-2 rounded-xl overflow-hidden transition-all ${
        medication.taken 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-amber-300'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            medication.taken 
              ? 'bg-green-500 scale-110' 
              : 'bg-gray-200 hover:bg-amber-200'
          }`}
        >
          {medication.taken ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : (
            <Circle className="w-7 h-7 text-white" />
          )}
        </button>
        
        <div className="flex-1" onClick={onExpand}>
          <h4 className={`font-semibold text-lg ${medication.taken ? 'text-green-700 line-through' : 'text-gray-900'}`}>
            {medication.name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{medication.dosage}</span>
            <span>•</span>
            <span>{medication.times.join(', ')}</span>
          </div>
        </div>

        <button onClick={onExpand} className="p-2 hover:bg-gray-100 rounded-lg">
          {medication.expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {medication.expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 border-t border-gray-100 pt-3"
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Frequency: {getFrequencyLabel(medication.frequency)}</span>
            </div>
            {medication.instructions && (
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{medication.instructions}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Started: {new Date(medication.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
