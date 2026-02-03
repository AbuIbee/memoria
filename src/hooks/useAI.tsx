import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { AIExercise, MoodEntry, ActivitySession, MoodInsight, AIChatMessage } from '@/types';

// Simulated AI responses - in production, these would come from an AI API
const generateExercise = (type: string): AIExercise => {
  const exercises: Record<string, AIExercise[]> = {
    memory: [
      {
        id: `ex_${Date.now()}`,
        type: 'memory',
        title: 'Picture Matching Game',
        instructions: 'Find all the matching pairs of pictures. Click on two cards to reveal them.',
        difficulty: 'easy',
        content: {
          pairs: [
            { id: '1', image: 'flower', name: 'Flower' },
            { id: '2', image: 'flower', name: 'Flower' },
            { id: '3', image: 'cat', name: 'Cat' },
            { id: '4', image: 'cat', name: 'Cat' },
            { id: '5', image: 'house', name: 'House' },
            { id: '6', image: 'house', name: 'House' },
            { id: '7', image: 'sun', name: 'Sun' },
            { id: '8', image: 'sun', name: 'Sun' },
          ],
        },
        timeLimit: 180,
        aiGenerated: true,
        adaptiveLevel: 1,
      },
    ],
    attention: [
      {
        id: `ex_${Date.now()}`,
        type: 'attention',
        title: 'Spot the Difference',
        instructions: 'Look carefully at the two images and identify 5 differences.',
        difficulty: 'medium',
        content: {
          pairs: [],
        },
        timeLimit: 300,
        aiGenerated: true,
        adaptiveLevel: 2,
      },
    ],
    language: [
      {
        id: `ex_${Date.now()}`,
        type: 'language',
        title: 'Word Association',
        instructions: 'Find words that are related to the given word.',
        difficulty: 'easy',
        content: {
          words: ['Family', 'Home', 'Garden', 'Music'],
          hints: ['People you love', 'Where you live', 'Plants and flowers', 'Songs and melodies'],
        },
        timeLimit: 240,
        aiGenerated: true,
        adaptiveLevel: 1,
      },
    ],
    math: [
      {
        id: `ex_${Date.now()}`,
        type: 'math',
        title: 'Simple Calculations',
        instructions: 'Solve these simple math problems.',
        difficulty: 'easy',
        content: {
          problems: [
            { question: '5 + 3 = ?', answer: 8, hint: 'Count on your fingers' },
            { question: '10 - 4 = ?', answer: 6, hint: 'Start with 10' },
            { question: '2 + 7 = ?', answer: 9, hint: 'Add them together' },
          ],
        },
        timeLimit: 180,
        aiGenerated: true,
        adaptiveLevel: 1,
      },
    ],
    pattern: [
      {
        id: `ex_${Date.now()}`,
        type: 'pattern',
        title: 'Complete the Pattern',
        instructions: 'Look at the pattern and choose what comes next.',
        difficulty: 'medium',
        content: {
          patterns: [
            { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], options: ['🔴', '🔵', '🟢', '🟡'], correct: 1 },
            { sequence: ['1', '2', '3', '4', '5'], options: ['6', '7', '8', '9'], correct: 0 },
          ],
        },
        timeLimit: 240,
        aiGenerated: true,
        adaptiveLevel: 2,
      },
    ],
    orientation: [
      {
        id: `ex_${Date.now()}`,
        type: 'orientation',
        title: 'Time and Place Awareness',
        instructions: 'Answer these questions about today.',
        difficulty: 'easy',
        content: {
          questions: [
            { question: 'What day of the week is it today?', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], correct: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, explanation: 'Today is ' + new Date().toLocaleDateString('en-US', { weekday: 'long' }) },
            { question: 'What season is it?', options: ['Spring', 'Summer', 'Fall', 'Winter'], correct: Math.floor((new Date().getMonth() / 12) * 4) % 4, explanation: 'Current season based on the month' },
            { question: 'What year is it?', options: ['2023', '2024', '2025', '2026'], correct: 1, explanation: 'The current year is 2024' },
          ],
        },
        timeLimit: 300,
        aiGenerated: true,
        adaptiveLevel: 1,
      },
    ],
  };

  const typeExercises = exercises[type] || exercises.memory;
  return typeExercises[Math.floor(Math.random() * typeExercises.length)];
};

const generateMoodInsight = (moodEntries: MoodEntry[]): MoodInsight => {
  if (moodEntries.length === 0) {
    return {
      period: 'Last 7 days',
      averageMood: 3,
      mostCommonMood: 'neutral',
      triggers: [],
      patterns: ['Not enough data yet'],
      aiRecommendations: ['Start tracking your mood daily for better insights'],
    };
  }

  const moodScores: Record<string, number> = {
    very_happy: 5,
    happy: 4,
    calm: 4,
    neutral: 3,
    confused: 2,
    sad: 2,
    anxious: 1,
    agitated: 1,
    very_sad: 1,
  };

  const totalScore = moodEntries.reduce((sum, entry) => sum + (moodScores[entry.mood] || 3), 0);
  const averageMood = totalScore / moodEntries.length;

  const moodCounts: Record<string, number> = {};
  moodEntries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any || 'neutral';

  const allTriggers = moodEntries.flatMap(e => e.triggers || []);
  const triggerCounts: Record<string, number> = {};
  allTriggers.forEach(t => {
    triggerCounts[t] = (triggerCounts[t] || 0) + 1;
  });
  const commonTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t);

  const patterns: string[] = [];
  if (averageMood >= 4) patterns.push('Generally positive mood');
  else if (averageMood <= 2) patterns.push('May need additional support');
  else patterns.push('Mood is stable');

  const recommendations: string[] = [];
  if (mostCommonMood === 'anxious' || mostCommonMood === 'agitated') {
    recommendations.push('Try deep breathing exercises');
    recommendations.push('Listen to calming music');
    recommendations.push('Consider talking to your caregiver');
  } else if (mostCommonMood === 'sad' || mostCommonMood === 'very_sad') {
    recommendations.push('Look through your memory photos');
    recommendations.push('Do an activity you enjoy');
    recommendations.push('Reach out to a loved one');
  } else if (mostCommonMood === 'happy' || mostCommonMood === 'very_happy') {
    recommendations.push('Great! Keep doing what you\'re doing');
    recommendations.push('Share your positive mood with others');
    recommendations.push('Document what made you happy today');
  } else {
    recommendations.push('Try a brain activity to stay engaged');
    recommendations.push('Go for a gentle walk');
    recommendations.push('Listen to your favorite music');
  }

  return {
    period: 'Last 7 days',
    averageMood,
    mostCommonMood,
    triggers: commonTriggers,
    patterns,
    aiRecommendations: recommendations,
  };
};

const generateAIResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('medicine') || lowerMsg.includes('medication') || lowerMsg.includes('pill')) {
    return 'I can help you with your medications. You can view your medication schedule, mark medications as taken, or set up reminders. Would you like me to show you your medication list?';
  }
  if (lowerMsg.includes('memory') || lowerMsg.includes('remember') || lowerMsg.includes('forget')) {
    return 'Memory exercises can help keep your mind active. I can suggest some brain activities or you can look through your memory album. Would you like to try a memory game?';
  }
  if (lowerMsg.includes('sad') || lowerMsg.includes('upset') || lowerMsg.includes('feeling down')) {
    return 'I\'m sorry you\'re feeling this way. It might help to look at some happy memories, listen to your favorite music, or talk to someone you care about. Would you like me to suggest some uplifting activities?';
  }
  if (lowerMsg.includes('activity') || lowerMsg.includes('exercise') || lowerMsg.includes('game')) {
    return 'I have many activities that can help keep your mind and body active. We have memory games, puzzles, physical exercises, and creative activities. What type of activity interests you?';
  }
  if (lowerMsg.includes('family') || lowerMsg.includes('daughter') || lowerMsg.includes('son')) {
    return 'Family connections are so important. You can view your memories together or I can help you send a message to your loved ones. Would you like to look at some family photos?';
  }
  if (lowerMsg.includes('help') || lowerMsg.includes('emergency')) {
    return 'If this is an emergency, please press the red emergency button at the top of the screen. Your caregiver will be notified immediately. Is there something else I can help you with?';
  }
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return 'Hello! I\'m your Memoria assistant. I\'m here to help you with your daily activities, medications, memories, and more. What would you like to do today?';
  }
  
  return 'I\'m here to help! I can assist you with medications, daily routines, brain activities, memories, or connect you with your caregiver. What would you like help with?';
};

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your Memoria AI assistant. I\'m here to help you with daily activities, answer questions, and provide support. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const generateBrainExercise = useCallback(async (type: string): Promise<AIExercise> => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exercise = generateExercise(type);
    setIsGenerating(false);
    
    toast.success('New exercise generated!');
    return exercise;
  }, []);

  const analyzeMood = useCallback((moodEntries: MoodEntry[]): MoodInsight => {
    return generateMoodInsight(moodEntries);
  }, []);

  const getActivityRecommendations = useCallback((moodHistory: MoodEntry[], activityHistory: ActivitySession[]) => {
    const recommendations: string[] = [];
    
    if (moodHistory.length === 0) {
      recommendations.push('Try a memory game to keep your mind active');
      recommendations.push('Listen to your favorite music');
      recommendations.push('Look through your photo memories');
      return recommendations;
    }

    const recentMoods = moodHistory.slice(-7);
    const sadCount = recentMoods.filter(m => ['sad', 'very_sad', 'anxious'].includes(m.mood)).length;
    const happyCount = recentMoods.filter(m => ['happy', 'very_happy', 'calm'].includes(m.mood)).length;

    if (sadCount > 3) {
      recommendations.push('Try gentle physical activity like chair yoga');
      recommendations.push('Listen to uplifting music from your favorites');
      recommendations.push('Look at happy family photos');
    } else if (happyCount > 4) {
      recommendations.push('Great mood! Try a challenging brain puzzle');
      recommendations.push('Share your positive energy with a video call');
      recommendations.push('Document what\'s making you happy');
    } else {
      recommendations.push('Try a creative activity like drawing or knitting');
      recommendations.push('Do a memory exercise to stay sharp');
      recommendations.push('Go for a gentle walk if weather permits');
    }

    // Add recommendations based on activity history
    const recentActivities = activityHistory.slice(-7);
    if (recentActivities.length < 3) {
      recommendations.push('You haven\'t done many activities recently - try a quick brain game!');
    }

    return recommendations;
  }, []);

  const sendChatMessage = useCallback(async (message: string): Promise<string> => {
    setIsGenerating(true);
    
    // Add user message to history
    const userMessage: AIChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = generateAIResponse(message);
    
    // Add AI response to history
    const aiMessage: AIChatMessage = {
      id: `msg_${Date.now()}_ai`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, aiMessage]);
    
    setIsGenerating(false);
    return response;
  }, []);

  const clearChat = useCallback(() => {
    setChatHistory([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your Memoria AI assistant. I\'m here to help you with daily activities, answer questions, and provide support. How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    isGenerating,
    chatHistory,
    generateBrainExercise,
    analyzeMood,
    getActivityRecommendations,
    sendChatMessage,
    clearChat,
  };
}
