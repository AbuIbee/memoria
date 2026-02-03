// User Types
export type UserRole = 'patient' | 'caregiver' | 'healthcare_provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  phone?: string;
  emergencyContact?: EmergencyContact;
  preferences: UserPreferences;
}

export interface UserPreferences {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceGuidance: boolean;
  reminderFrequency: 'gentle' | 'standard' | 'frequent';
  language: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth: Date;
  diagnosisDate?: Date;
  dementiaStage: 'early' | 'moderate' | 'advanced' | 'not_diagnosed';
  primaryDoctor?: DoctorInfo;
  medications: Medication[];
  routines: Routine[];
  memories: Memory[];
  moodHistory: MoodEntry[];
  activityHistory: ActivitySession[];
  notes: Note[];
  favoriteMusic: string[];
  hobbies: string[];
  comfortItems: string[];
  allergies: string[];
  medicalConditions: string[];
  // Identity & Orientation Features
  identityProfile?: IdentityProfile;
  familiarFaces: FamiliarFace[];
  locationInfo?: LocationInfo;
  calmingMessage?: CalmingMessage;
}

// Identity Profile for "Who I Am" screen
export interface IdentityProfile {
  preferredName: string;
  photoUrl?: string;
  affirmation: string;
  customAffirmation?: string;
  lifeStory?: string;
  formerOccupation?: string;
  favoriteThings: string[];
}

// Familiar Faces for recognition support
export interface FamiliarFace {
  id: string;
  name: string;
  relationship: string;
  photoUrl?: string;
  description?: string;
  contactInfo?: string;
  visitFrequency?: string;
  isPrimaryContact: boolean;
}

// Location Information for orientation
export interface LocationInfo {
  currentLocation: string;
  address: string;
  city: string;
  state: string;
  homeDescription?: string;
  safePlaces: string[];
  emergencyExits?: string[];
}

// Calming/Spiritual Message
export interface CalmingMessage {
  enabled: boolean;
  messageType: 'faith_neutral' | 'spiritual' | 'custom';
  customMessage?: string;
  faithTradition?: string;
  showOnDashboard: boolean;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  patientIds: string[];
  stressLevel: number;
  supportNetwork: SupportContact[];
  resourcesAccessed: Resource[];
  selfCareReminders: boolean;
}

export interface DoctorInfo {
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  clinic?: string;
  address?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

// Medication Types
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  strength?: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'patch' | 'inhaler' | 'other';
  frequency: 'daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'weekly' | 'monthly' | 'as_needed' | 'custom';
  times: string[];
  instructions: string;
  sideEffects?: string[];
  prescribedBy: string;
  prescriptionDate: Date;
  startDate: Date;
  endDate?: Date;
  refillDate?: Date;
  pharmacy?: string;
  remindersEnabled: boolean;
  reminderMinutesBefore: number;
  takenHistory: MedicationLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: Date;
  scheduledFor: Date;
  taken: boolean;
  skipped?: boolean;
  notes?: string;
}

// Routine Types
export interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';
  time: string;
  days: DayOfWeek[];
  completed: boolean;
  icon: string;
  steps?: string[];
  reminders: boolean;
  reminderMinutesBefore: number;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Memory Types
export interface Memory {
  id: string;
  title: string;
  description: string;
  date: Date;
  photos: Photo[];
  audio?: AudioRecording;
  video?: VideoRecording;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isShared: boolean;
  sharedWith: string[];
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export interface AudioRecording {
  id: string;
  url: string;
  duration: number;
  transcript?: string;
  recordedAt: Date;
}

export interface VideoRecording {
  id: string;
  url: string;
  duration: number;
  thumbnail?: string;
  recordedAt: Date;
}

// Activity Types
export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  instructions: string[];
  benefits: string[];
  aiGenerated?: boolean;
  aiPrompt?: string;
}

export type ActivityCategory = 
  | 'cognitive' 
  | 'physical' 
  | 'creative' 
  | 'social' 
  | 'relaxation' 
  | 'remembrance';

export interface ActivitySession {
  id: string;
  activityId: string;
  patientId: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  score?: number;
  notes?: string;
  aiFeedback?: string;
  moodBefore?: string;
  moodAfter?: string;
}

// AI-Powered Types
export interface AIExercise {
  id: string;
  type: 'memory' | 'attention' | 'language' | 'problem_solving' | 'orientation' | 'math' | 'pattern';
  title: string;
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: ExerciseContent;
  timeLimit?: number;
  aiGenerated: boolean;
  adaptiveLevel: number;
}

export type ExerciseContent = 
  | MemoryMatchContent
  | WordGameContent
  | PuzzleContent
  | OrientationContent
  | MathContent
  | PatternContent;

export interface MemoryMatchContent {
  pairs: { id: string; image: string; name: string }[];
}

export interface WordGameContent {
  words: string[];
  hints: string[];
  scrambled?: string[];
}

export interface PuzzleContent {
  pieces: number;
  image: string;
  completedImage?: string;
}

export interface OrientationContent {
  questions: { question: string; options: string[]; correct: number; explanation?: string }[];
}

export interface MathContent {
  problems: { question: string; answer: number; hint?: string }[];
}

export interface PatternContent {
  patterns: { sequence: string[]; options: string[]; correct: number }[];
}

// Mood Tracking Types
export interface MoodEntry {
  id: string;
  patientId: string;
  mood: MoodType;
  intensity: number;
  timestamp: Date;
  triggers?: string[];
  notes?: string;
  activities: string[];
  location?: string;
  aiInsight?: string;
  aiSuggestions?: string[];
}

export type MoodType = 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad' | 'anxious' | 'agitated' | 'confused' | 'calm';

export interface MoodInsight {
  period: string;
  averageMood: number;
  mostCommonMood: MoodType;
  triggers: string[];
  patterns: string[];
  aiRecommendations: string[];
}

// Reminder Types
export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'medication' | 'routine' | 'appointment' | 'custom';
  scheduledFor: Date;
  recurring: boolean;
  recurrencePattern?: string;
  notificationMethods: ('push' | 'email' | 'sms')[];
  completed: boolean;
  snoozedUntil?: Date;
  createdAt: Date;
}

// Note Types
export interface Note {
  id: string;
  patientId: string;
  title: string;
  content: string;
  category: 'general' | 'medical' | 'behavior' | 'observation' | 'question';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  tags: string[];
}

// Safety Types
export interface SafetyEvent {
  id: string;
  patientId: string;
  type: 'wandering' | 'fall' | 'medication_missed' | 'emergency_button' | 'sos' | 'other';
  timestamp: Date;
  location?: GeoLocation;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string;
}

// Support Types
export interface SupportContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  availableHours?: string;
  isAvailable: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: 'education' | 'support_group' | 'respite_care' | 'legal' | 'financial' | 'self_care' | 'medical';
  description: string;
  url?: string;
  phone?: string;
  email?: string;
  address?: string;
  accessedAt: Date;
  isBookmarked: boolean;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  provider: string;
  specialty?: string;
  dateTime: Date;
  duration?: number;
  location: string;
  address?: string;
  notes?: string;
  reminders: boolean;
  reminderMinutesBefore: number;
  completed: boolean;
  followUpNeeded?: boolean;
  followUpDate?: Date;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'medication' | 'routine' | 'appointment' | 'activity' | 'reminder' | 'custom';
  color?: string;
  isAllDay: boolean;
  recurrence?: string;
}

// AI Chat Types
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
}

// Dashboard Stats
export interface DashboardStats {
  medicationsTakenToday: number;
  totalMedicationsToday: number;
  routinesCompletedToday: number;
  totalRoutinesToday: number;
  activitiesThisWeek: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  safetyEventsThisMonth: number;
  caregiverStressLevel: number;
  upcomingAppointments: number;
  overdueReminders: number;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  patientProfile: PatientProfile | null;
  caregiverProfile: CaregiverProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}
