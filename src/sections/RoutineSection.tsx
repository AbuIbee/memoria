import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Sun, Moon, Coffee, CheckCircle2, Circle, 
  ChevronRight, Footprints, Brain, Utensils, Bed,
  Sparkles, Music, BookOpen, Droplets
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { mockRoutines } from '@/data/mockData';

const iconMap: Record<string, React.ElementType> = {
  sun: Sun,
  moon: Moon,
  coffee: Coffee,
  footprints: Footprints,
  brain: Brain,
  utensils: Utensils,
  bed: Bed,
  sparkles: Sparkles,
  music: Music,
  book: BookOpen,
  droplets: Droplets,
  pill: Sparkles,
};

const categoryColors: Record<string, string> = {
  morning: 'from-amber-400 to-orange-500',
  afternoon: 'from-orange-400 to-red-500',
  evening: 'from-indigo-400 to-purple-500',
  night: 'from-purple-500 to-pink-500',
  custom: 'from-teal-400 to-green-500',
};

export default function RoutineSection() {
  const [routines, setRoutines] = useState(mockRoutines.map(r => ({ ...r, completed: false })));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
    const routine = routines.find(r => r.id === id);
    if (routine && !routine.completed) {
      toast.success(`Completed: ${routine.title}`, {
        description: 'Great job following your routine!',
      });
    }
  };

  const completedCount = routines.filter(r => r.completed).length;
  const progress = routines.length > 0 ? (completedCount / routines.length) * 100 : 0;

  const filteredRoutines = selectedCategory 
    ? routines.filter(r => r.category === selectedCategory)
    : routines;

  const categories = ['morning', 'afternoon', 'evening', 'night'];

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daily Routines</h1>
              <p className="text-gray-600">Follow your personalized daily schedule</p>
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
                  <p className="text-gray-600">
                    {completedCount} of {routines.length} routines completed
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                </div>
              </div>
              <Progress value={progress} className="h-4" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Routines
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Routines by Time of Day */}
        <div className="space-y-6">
          {categories.map((category, catIndex) => {
            const categoryRoutines = filteredRoutines.filter(r => r.category === category);
            if (categoryRoutines.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + catIndex * 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 capitalize">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center`}>
                        {category === 'morning' && <Sun className="w-5 h-5 text-white" />}
                        {category === 'afternoon' && <Coffee className="w-5 h-5 text-white" />}
                        {category === 'evening' && <Moon className="w-5 h-5 text-white" />}
                        {category === 'night' && <Bed className="w-5 h-5 text-white" />}
                      </div>
                      {category} Routines
                      <Badge variant="secondary" className="ml-auto">
                        {categoryRoutines.filter(r => r.completed).length}/{categoryRoutines.length} Done
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryRoutines.map((routine) => {
                      const Icon = iconMap[routine.icon] || Sparkles;
                      return (
                        <RoutineCard 
                          key={routine.id}
                          routine={routine}
                          Icon={Icon}
                          onToggle={() => toggleRoutine(routine.id)}
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Routine Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-100 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Building Healthy Routines</h3>
                  <p className="text-gray-700 mb-3">
                    Consistent daily routines help reduce anxiety and provide a sense of security. 
                    Here are some tips:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Start with simple routines and build gradually.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Do activities at the same time each day.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Celebrate small accomplishments!</span>
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

interface RoutineCardProps {
  routine: any;
  Icon: React.ElementType;
  onToggle: () => void;
}

function RoutineCard({ routine, Icon, onToggle }: RoutineCardProps) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div 
      className={`border-2 rounded-xl overflow-hidden transition-all ${
        routine.completed 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-amber-300'
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            routine.completed 
              ? 'bg-green-500 scale-110' 
              : 'bg-gray-200 hover:bg-amber-200'
          }`}
        >
          {routine.completed ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : (
            <Circle className="w-7 h-7 text-white" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${routine.completed ? 'text-green-600' : 'text-gray-400'}`} />
            <h4 className={`font-semibold text-lg ${routine.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
              {routine.title}
            </h4>
          </div>
          <p className={`text-sm ${routine.completed ? 'text-green-600' : 'text-gray-500'}`}>
            {routine.time} • {routine.description}
          </p>
        </div>

        {routine.steps && routine.steps.length > 0 && (
          <button 
            onClick={() => setShowSteps(!showSteps)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showSteps ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      {showSteps && routine.steps && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 border-t border-gray-100 pt-3"
        >
          <p className="text-sm font-medium text-gray-700 mb-2">Steps:</p>
          <ol className="space-y-2">
            {routine.steps.map((step: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
}
