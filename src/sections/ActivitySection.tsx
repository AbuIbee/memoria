import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Brain, Heart, Music, Palette, Footprints, 
  Users, Clock, Star, Play, CheckCircle2, X,
  Trophy, Target, Flame
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockActivities } from '@/data/mockData';
import { useAI } from '@/hooks/useAI';

const categoryIcons: Record<string, React.ElementType> = {
  cognitive: Brain,
  physical: Footprints,
  creative: Palette,
  social: Users,
  relaxation: Music,
  remembrance: Heart,
};

const categoryColors: Record<string, string> = {
  cognitive: 'from-purple-400 to-indigo-500',
  physical: 'from-green-400 to-emerald-500',
  creative: 'from-pink-400 to-rose-500',
  social: 'from-blue-400 to-cyan-500',
  relaxation: 'from-amber-400 to-orange-500',
  remembrance: 'from-rose-400 to-red-500',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function ActivitySection() {
  const [activities] = useState(mockActivities);
  const { generateBrainExercise, isGenerating } = useAI();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<typeof mockActivities[0] | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [streak] = useState(5);
  const [totalPoints, setTotalPoints] = useState(1250);

  const categories = ['cognitive', 'physical', 'creative', 'social', 'relaxation', 'remembrance'];

  const filteredActivities = selectedCategory
    ? activities.filter(a => a.category === selectedCategory)
    : activities;

  const startActivity = (activity: typeof mockActivities[0]) => {
    setActiveActivity(activity);
    toast.info(`Starting: ${activity.title}`, {
      description: `Duration: ${activity.duration} minutes`,
    });
  };

  const completeActivity = () => {
    if (activeActivity) {
      setCompletedActivities(prev => [...prev, activeActivity.id]);
      setTotalPoints(prev => prev + 50);
      toast.success('Activity completed!', {
        description: 'You earned 50 points!',
      });
      setActiveActivity(null);
    }
  };

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activities & Exercises</h1>
              <p className="text-gray-600">Keep your mind and body active</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{streak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{completedActivities.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
          </div>
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
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Activities
            </button>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={`px-4 py-2 rounded-full font-medium transition-all capitalize flex items-center gap-2 ${
                    selectedCategory === cat
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Activity */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-2">Recommended Today</span>
                    <h2 className="text-2xl font-bold mb-2">Memory Card Matching</h2>
                    <p className="text-white/80 mb-4">
                      Exercise your memory with this fun card matching game. 
                      Perfect for keeping your mind sharp!
                    </p>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                      <span className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        10 min
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4" />
                        Easy
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    onClick={() => toast.info('Starting Memory Game...')}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Activities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredActivities.map((activity, index) => {
            const Icon = categoryIcons[activity.category];
            const isCompleted = completedActivities.includes(activity.id);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  isCompleted ? 'bg-green-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[activity.category]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge className={difficultyColors[activity.difficulty]}>
                          {activity.difficulty}
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.duration} min
                      </span>
                      <span className="capitalize">{activity.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {activity.benefits.slice(0, 2).map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full"
                      variant={isCompleted ? 'outline' : 'default'}
                      onClick={() => startActivity(activity)}
                    >
                      {isCompleted ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Do Again
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Activity
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cognitive Exercises Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Brain Training Exercises
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer border-dashed border-2 border-purple-200">
              <CardContent className="p-6" onClick={async () => {
                const exercise = await generateBrainExercise('memory');
                setExercises(prev => [...prev, exercise]);
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Generate AI Exercise
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get a personalized brain training exercise
                    </p>
                  </div>
                  <Button size="icon" className="rounded-full" disabled={isGenerating}>
                    {isGenerating ? <span className="animate-spin">⏳</span> : <Play className="w-5 h-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {exercise.title}
                          </h3>
                          {exercise.difficulty && (
                            <Badge className={difficultyColors[exercise.difficulty]}>
                              {exercise.difficulty}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {exercise.instructions}
                        </p>
                        <div className="flex items-center gap-2">
                          {exercise.type && (
                            <Badge variant="secondary" className="capitalize">
                              {exercise.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="icon" className="rounded-full">
                        <Play className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Modal */}
        <AnimatePresence>
          {activeActivity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActiveActivity(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{activeActivity.title}</h2>
                    <button
                      onClick={() => setActiveActivity(null)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">{activeActivity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activeActivity.duration} minutes
                      </span>
                      {activeActivity.difficulty && (
                        <Badge className={difficultyColors[activeActivity.difficulty]}>
                          {activeActivity.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Instructions:</h3>
                    <ol className="space-y-2">
                      {activeActivity.instructions?.map((step: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Benefits:</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeActivity.benefits?.map((benefit: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setActiveActivity(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={completeActivity}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
