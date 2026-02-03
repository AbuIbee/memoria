import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Users, BookOpen, Phone, Calendar, TrendingUp,
  AlertCircle, CheckCircle2, Clock, MessageCircle, 
  Star, Sparkles, Battery, Smile, Frown, Meh,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  mockCaregiver, mockMoodEntries, 
  mockAppointments
} from '@/data/mockData';

const moodIcons: Record<string, React.ElementType> = {
  very_happy: Smile,
  happy: Smile,
  neutral: Meh,
  sad: Frown,
  very_sad: Frown,
  anxious: Frown,
  agitated: Frown,
};

const moodColors: Record<string, string> = {
  very_happy: 'text-green-500',
  happy: 'text-green-400',
  neutral: 'text-gray-400',
  sad: 'text-amber-400',
  very_sad: 'text-red-400',
  anxious: 'text-purple-400',
  agitated: 'text-orange-400',
};

const moodLabels: Record<string, string> = {
  very_happy: 'Very Happy',
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  very_sad: 'Very Sad',
  anxious: 'Anxious',
  agitated: 'Agitated',
};

export default function CaregiverSection() {
  const [caregiverStress, setCaregiverStress] = useState(4);
  const [moodEntries] = useState(mockMoodEntries);
  const [showSelfCareTip, setShowSelfCareTip] = useState(true);

  const patientProgress = 75;

  const selfCareTips = [
    "Take 10 minutes for yourself today - read, meditate, or just breathe.",
    "Remember: You can't pour from an empty cup. Self-care isn't selfish.",
    "Connect with a friend or support group - you're not alone.",
    "Celebrate small wins - every day has moments of joy.",
    "It's okay to ask for help. Respite care is available.",
  ];

  const [currentTip] = useState(selfCareTips[Math.floor(Math.random() * selfCareTips.length)]);

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Caregiver Support</h1>
              <p className="text-gray-600">Resources and support for family caregivers</p>
            </div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {mockCaregiver.name[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Welcome back, {mockCaregiver.name.split(' ')[0]}!
                  </h2>
                  <p className="text-gray-600">
                    You're doing an amazing job caring for Margaret.
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-500">Caregiver since</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(mockCaregiver.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Self-Care Alert */}
        {showSelfCareTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-100 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-1">Self-Care Reminder</h3>
                    <p className="text-amber-800">{currentTip}</p>
                  </div>
                  <button 
                    onClick={() => setShowSelfCareTip(false)}
                    className="p-2 hover:bg-amber-200 rounded-full transition-colors"
                  >
                    <span className="text-amber-700">✕</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Patient Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">M</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">Margaret Johnson</h3>
                      <p className="text-gray-500">Early Stage Dementia</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Active
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Last active: 2 hours ago
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-600">85%</p>
                      <p className="text-sm text-gray-600">Medications</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-2xl font-bold text-green-600">92%</p>
                      <p className="text-sm text-gray-600">Routines</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <p className="text-2xl font-bold text-purple-600">12</p>
                      <p className="text-sm text-gray-600">Activities</p>
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">Weekly Progress</span>
                      <span className="text-sm text-gray-500">{patientProgress}%</span>
                    </div>
                    <Progress value={patientProgress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Mood Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodEntries.slice().reverse().map((entry) => {
                      const MoodIcon = moodIcons[entry.mood];
                      return (
                        <div 
                          key={entry.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <MoodIcon className={`w-6 h-6 ${moodColors[entry.mood]}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">
                                {moodLabels[entry.mood]}
                              </p>
                              <span className="text-sm text-gray-500">
                                {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                            )}
                            {entry.activities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {entry.activities.map((activity, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAppointments.slice(0, 3).map((apt) => (
                      <div 
                        key={apt.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-500 flex flex-col items-center justify-center text-white">
                          <span className="text-xs font-bold">
                            {apt.dateTime.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold">
                            {apt.dateTime.getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{apt.title}</p>
                          <p className="text-sm text-gray-500">
                            {apt.dateTime.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} • {apt.location}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Caregiver Tools */}
          <div className="space-y-6">
            {/* Stress Level Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-amber-500" />
                    Your Well-being
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-2">Current Stress Level</p>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => setCaregiverStress(level)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            level <= caregiverStress
                              ? level <= 2 
                                ? 'bg-green-500 scale-110' 
                                : level <= 3 
                                  ? 'bg-amber-500 scale-110' 
                                  : 'bg-red-500 scale-110'
                              : 'bg-gray-200'
                          }`}
                        >
                          <span className="text-white font-bold">{level}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {caregiverStress <= 2 ? 'Doing great!' : 
                       caregiverStress <= 3 ? 'Take a break soon' : 
                       'Please prioritize self-care'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Connecting to support group...')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Support Group
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Opening respite care options...')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Find Respite Care
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    onClick={() => toast.success('Medication reminder sent!')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" />
                    Send Med Reminder
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Location request sent!')}
                  >
                    <TrendingUp className="w-4 h-4 mr-3 text-blue-500" />
                    Request Location
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Opening video call...')}
                  >
                    <Phone className="w-4 h-4 mr-3 text-purple-500" />
                    Video Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Opening message...')}
                  >
                    <MessageCircle className="w-4 h-4 mr-3 text-amber-500" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                    Helpful Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Caregiver Guide', icon: BookOpen, color: 'text-blue-500' },
                    { title: 'Dementia Education', icon: AlertCircle, color: 'text-amber-500' },
                    { title: 'Legal & Financial', icon: CheckCircle2, color: 'text-green-500' },
                    { title: 'Self-Care Tips', icon: Heart, color: 'text-rose-500' },
                  ].map((resource, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      onClick={() => toast.info(`Opening ${resource.title}...`)}
                    >
                      <resource.icon className={`w-5 h-5 ${resource.color}`} />
                      <span className="font-medium text-gray-700">{resource.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Affirmation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-100 to-pink-100">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                    <p className="text-rose-800 font-medium italic">
                      "You are making a difference every single day. Your love and care matter more than you know."
                    </p>
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
