import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, UserRole, PatientProfile, CaregiverProfile, UserPreferences } from '@/types';

interface AuthContextType {
  user: User | null;
  patientProfile: PatientProfile | null;
  caregiverProfile: CaregiverProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePatientProfile: (updates: Partial<PatientProfile>) => void;
  updateCaregiverProfile: (updates: Partial<CaregiverProfile>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY_USER = 'memoria_user';
const STORAGE_KEY_PATIENT_PROFILE = 'memoria_patient_profile';
const STORAGE_KEY_CAREGIVER_PROFILE = 'memoria_caregiver_profile';

// Helper to serialize dates
const serializeDates = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return { __type: 'Date', value: obj.toISOString() };
  if (Array.isArray(obj)) return obj.map(serializeDates);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = serializeDates(obj[key]);
    }
    return result;
  }
  return obj;
};

// Helper to deserialize dates
const deserializeDates = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (obj.__type === 'Date') return new Date(obj.value);
  if (Array.isArray(obj)) return obj.map(deserializeDates);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = deserializeDates(obj[key]);
    }
    return result;
  }
  return obj;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Margaret Johnson',
    email: 'margaret@example.com',
    role: 'patient',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=margaret',
    createdAt: new Date('2023-01-15'),
    phone: '(555) 123-4567',
    preferences: {
      largeText: true,
      highContrast: false,
      reducedMotion: false,
      voiceGuidance: true,
      reminderFrequency: 'gentle',
      language: 'en',
      notificationsEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    emergencyContact: {
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      phone: '(555) 987-6543',
      email: 'sarah@example.com',
      isPrimary: true,
    },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'caregiver',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2023-01-15'),
    phone: '(555) 987-6543',
    preferences: {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
      voiceGuidance: false,
      reminderFrequency: 'standard',
      language: 'en',
      notificationsEnabled: true,
      emailNotifications: true,
      smsNotifications: true,
    },
  },
];

const defaultPreferences: UserPreferences = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  voiceGuidance: false,
  reminderFrequency: 'standard',
  language: 'en',
  notificationsEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
};

// Get default patient profile for a user
const getDefaultPatientProfile = (user: User): PatientProfile => ({
  id: `p_${user.id}`,
  userId: user.id,
  dateOfBirth: new Date('1950-03-15'),
  diagnosisDate: new Date('2022-06-10'),
  dementiaStage: 'early',
  primaryDoctor: {
    name: 'Dr. Sarah Smith',
    specialty: 'Neurology',
    phone: '(555) 234-5678',
    email: 'dr.smith@clinic.com',
    clinic: 'Memorial Neurology Center',
  },
  medications: [],
  routines: [],
  memories: [],
  moodHistory: [],
  activityHistory: [],
  notes: [],
  favoriteMusic: ['Frank Sinatra', 'Jazz Classics', 'Classical Piano'],
  hobbies: ['Gardening', 'Knitting', 'Reading'],
  comfortItems: ['Family Photos', 'Favorite Blanket', 'Tea'],
  allergies: ['Penicillin'],
  medicalConditions: ['Hypertension', 'Arthritis'],
  identityProfile: {
    preferredName: 'Maggie',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    affirmation: 'You are safe. You are at home. You are loved.',
    customAffirmation: 'You are safe. You are at home. You are loved.',
    lifeStory: 'Maggie worked as a school teacher for 35 years. She loves gardening, reading mystery novels, and spending time with her grandchildren.',
    formerOccupation: 'School Teacher',
    favoriteThings: ['Gardening', 'Mystery Novels', 'Classical Music', 'Tea', 'Family Photos'],
  },
  familiarFaces: [
    {
      id: 'f1',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      description: 'Sarah visits every weekend and brings fresh flowers.',
      contactInfo: '(555) 987-6543',
      visitFrequency: 'Weekends',
      isPrimaryContact: true,
    },
    {
      id: 'f2',
      name: 'Michael Johnson',
      relationship: 'Son',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      description: 'Michael calls every Tuesday evening.',
      contactInfo: '(555) 456-7890',
      visitFrequency: 'Monthly',
      isPrimaryContact: false,
    },
    {
      id: 'f3',
      name: 'Emma Johnson',
      relationship: 'Granddaughter',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      description: 'Emma loves to hear stories about when you were young.',
      contactInfo: '(555) 234-5678',
      visitFrequency: 'Holidays',
      isPrimaryContact: false,
    },
  ],
  locationInfo: {
    currentLocation: 'Home',
    address: '123 Oak Street',
    city: 'Raleigh',
    state: 'North Carolina',
    homeDescription: 'You live in a cozy house with a beautiful garden in the backyard. Your bedroom is upstairs.',
    safePlaces: ['Living Room', 'Kitchen', 'Garden', 'Bedroom'],
    emergencyExits: ['Front Door', 'Back Door', 'Kitchen Door'],
  },
  calmingMessage: {
    enabled: true,
    messageType: 'faith_neutral',
    customMessage: 'You are safe. You are loved. Everything is okay.',
    showOnDashboard: true,
  },
});

// Get default caregiver profile for a user
const getDefaultCaregiverProfile = (user: User): CaregiverProfile => ({
  id: `c_${user.id}`,
  userId: user.id,
  patientIds: ['1'],
  stressLevel: 3,
  supportNetwork: [],
  resourcesAccessed: [],
  selfCareReminders: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [caregiverProfile, setCaregiverProfile] = useState<CaregiverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        const savedPatientProfile = localStorage.getItem(STORAGE_KEY_PATIENT_PROFILE);
        const savedCaregiverProfile = localStorage.getItem(STORAGE_KEY_CAREGIVER_PROFILE);

        if (savedUser) {
          const parsedUser = deserializeDates(JSON.parse(savedUser));
          setUser(parsedUser);
          
          if (savedPatientProfile) {
            setPatientProfile(deserializeDates(JSON.parse(savedPatientProfile)));
          }
          if (savedCaregiverProfile) {
            setCaregiverProfile(deserializeDates(JSON.parse(savedCaregiverProfile)));
          }
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(serializeDates(user)));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    if (patientProfile) {
      localStorage.setItem(STORAGE_KEY_PATIENT_PROFILE, JSON.stringify(serializeDates(patientProfile)));
    } else {
      localStorage.removeItem(STORAGE_KEY_PATIENT_PROFILE);
    }
  }, [patientProfile]);

  useEffect(() => {
    if (caregiverProfile) {
      localStorage.setItem(STORAGE_KEY_CAREGIVER_PROFILE, JSON.stringify(serializeDates(caregiverProfile)));
    } else {
      localStorage.removeItem(STORAGE_KEY_CAREGIVER_PROFILE);
    }
  }, [caregiverProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      
      // Load profile based on role
      if (foundUser.role === 'patient') {
        setPatientProfile(getDefaultPatientProfile(foundUser));
      } else if (foundUser.role === 'caregiver') {
        setCaregiverProfile(getDefaultCaregiverProfile(foundUser));
      }
    } else {
      setError('Invalid email or password. Try: margaret@example.com or sarah@example.com with password "password"');
    }
    
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string, role: UserRole, phone?: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists');
      setIsLoading(false);
      return;
    }
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date(),
      phone,
      preferences: { ...defaultPreferences },
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    
    // Create profile based on role
    if (role === 'patient') {
      setPatientProfile({
        id: `p_${Date.now()}`,
        userId: newUser.id,
        dateOfBirth: new Date(),
        dementiaStage: 'not_diagnosed',
        medications: [],
        routines: [],
        memories: [],
        moodHistory: [],
        activityHistory: [],
        notes: [],
        favoriteMusic: [],
        hobbies: [],
        comfortItems: [],
        allergies: [],
        medicalConditions: [],
        identityProfile: {
          preferredName: name.split(' ')[0],
          affirmation: 'You are safe. You are at home. You are loved.',
          favoriteThings: [],
        },
        familiarFaces: [],
        locationInfo: {
          currentLocation: 'Home',
          address: '',
          city: '',
          state: '',
          safePlaces: ['Living Room', 'Kitchen', 'Bedroom'],
        },
        calmingMessage: {
          enabled: true,
          messageType: 'faith_neutral',
          showOnDashboard: true,
        },
      });
    } else if (role === 'caregiver') {
      setCaregiverProfile({
        id: `c_${Date.now()}`,
        userId: newUser.id,
        patientIds: [],
        stressLevel: 3,
        supportNetwork: [],
        resourcesAccessed: [],
        selfCareReminders: true,
      });
    }
    
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPatientProfile(null);
    setCaregiverProfile(null);
    setError(null);
    // Clear localStorage on logout
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_PATIENT_PROFILE);
    localStorage.removeItem(STORAGE_KEY_CAREGIVER_PROFILE);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...updates } : null;
      return updated;
    });
  }, []);

  const updatePatientProfile = useCallback((updates: Partial<PatientProfile>) => {
    setPatientProfile(prev => {
      const updated = prev ? { ...prev, ...updates } : null;
      return updated;
    });
  }, []);

  const updateCaregiverProfile = useCallback((updates: Partial<CaregiverProfile>) => {
    setCaregiverProfile(prev => {
      const updated = prev ? { ...prev, ...updates } : null;
      return updated;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        caregiverProfile,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateUser,
        updatePatientProfile,
        updateCaregiverProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
