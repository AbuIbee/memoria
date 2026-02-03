import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wind, 
  Heart, 
  Sun,
  Music,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CalmingMessageProps {
  compact?: boolean;
}

const defaultMessages = {
  faith_neutral: [
    'You are safe. You are loved. Everything is okay.',
    'Breathe in peace. Breathe out worry.',
    'You are surrounded by love and care.',
    'This moment is peaceful. You are at home.',
    'You are doing wonderfully. Take your time.',
  ],
  spiritual: [
    'May peace be with you always.',
    'You are held in loving hands.',
    'Trust in the journey. You are exactly where you need to be.',
    'Light surrounds you. Love protects you.',
    'Grace and peace fill this space.',
  ],
};

export default function CalmingMessage({ compact = false }: CalmingMessageProps) {
  const { patientProfile, updatePatientProfile } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const calmingConfig = patientProfile?.calmingMessage;
  const messageType = calmingConfig?.messageType || 'faith_neutral';
  const customMessage = calmingConfig?.customMessage;

  // Get current message based on time of day
  const getCurrentMessage = () => {
    if (customMessage) return customMessage;
    
    const hour = new Date().getHours();
    const messages = defaultMessages[messageType as keyof typeof defaultMessages] || defaultMessages.faith_neutral;
    
    // Rotate message based on time of day
    const messageIndex = Math.floor(hour / 5) % messages.length;
    return messages[messageIndex];
  };

  const currentMessage = getCurrentMessage();

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (voiceEnabled) {
        window.speechSynthesis.cancel();
        setVoiceEnabled(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(currentMessage);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.onend = () => setVoiceEnabled(false);
        window.speechSynthesis.speak(utterance);
        setVoiceEnabled(true);
      }
    } else {
      toast.error('Voice playback is not supported in your browser');
    }
  };

  const handleUpdateMessageType = (type: 'faith_neutral' | 'spiritual' | 'custom') => {
    if (patientProfile) {
      updatePatientProfile({
        ...patientProfile,
        calmingMessage: {
          ...(calmingConfig || { enabled: true, showOnDashboard: true }),
          messageType: type,
        },
      });
      toast.success('Message type updated');
    }
  };

  const handleUpdateCustomMessage = (message: string) => {
    if (patientProfile) {
      updatePatientProfile({
        ...patientProfile,
        calmingMessage: {
          ...(calmingConfig || { enabled: true, showOnDashboard: true, messageType: 'custom' as const }),
          customMessage: message,
        },
      });
    }
  };

  if (compact) {
    return (
      <Card className="border-rose-200 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-rose-600 font-medium mb-1">A Gentle Reminder</p>
              <p className="text-gray-700 italic">"{currentMessage}"</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              className="flex-shrink-0"
            >
              {voiceEnabled ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-rose-500" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-rose-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">A Moment of Peace</h3>
                <p className="text-white/80 text-sm">Take a deep breath</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                className="text-white hover:bg-white/20"
              >
                {voiceEnabled ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Calming Message Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Message Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Message Style
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleUpdateMessageType('faith_neutral')}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            messageType === 'faith_neutral'
                              ? 'border-rose-400 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-rose-500" />
                            <span className="font-medium">Gentle & Comforting</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Warm, reassuring messages of safety and love
                          </p>
                        </button>
                        <button
                          onClick={() => handleUpdateMessageType('spiritual')}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            messageType === 'spiritual'
                              ? 'border-purple-400 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Sun className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">Spiritual</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Messages with a gentle spiritual tone
                          </p>
                        </button>
                        <button
                          onClick={() => handleUpdateMessageType('custom')}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            messageType === 'custom'
                              ? 'border-amber-400 bg-amber-50'
                              : 'border-gray-200 hover:border-amber-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Music className="w-5 h-5 text-amber-500" />
                            <span className="font-medium">Custom Message</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Write your own calming message
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Custom Message Input */}
                    {messageType === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Custom Message
                        </label>
                        <textarea
                          value={customMessage || ''}
                          onChange={(e) => handleUpdateCustomMessage(e.target.value)}
                          placeholder="Write something comforting..."
                          className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px] focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Message Display */}
        <div className="p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="flex justify-center gap-2 mb-4">
                <Wind className="w-6 h-6 text-rose-300" />
                <Wind className="w-6 h-6 text-pink-300" />
                <Wind className="w-6 h-6 text-purple-300" />
              </div>
              <p className="text-2xl sm:text-3xl font-medium text-gray-800 leading-relaxed mb-6">
                "{currentMessage}"
              </p>
              <div className="flex justify-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <Heart className="w-5 h-5 text-pink-400" />
                <Heart className="w-5 h-5 text-purple-400" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Breathing Exercise */}
          <div className="mt-8 pt-6 border-t border-rose-200">
            <p className="text-center text-sm text-gray-500 mb-4">Try this breathing exercise</p>
            <div className="flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 flex items-center justify-center"
              >
                <span className="text-white font-medium text-sm">Breathe</span>
              </motion.div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Breathe in as the circle grows, out as it shrinks
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
