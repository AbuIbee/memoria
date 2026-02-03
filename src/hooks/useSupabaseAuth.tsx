import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, UserRole, PatientProfile, CaregiverProfile, UserPreferences } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  patientProfile: PatientProfile | null;
  caregiverProfile: CaregiverProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePatientProfile: (updates: Partial<PatientProfile>) => Promise<void>;
  updateCaregiverProfile: (updates: Partial<CaregiverProfile>) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

// Convert Supabase user to our User type
const mapSupabaseUser = (sbUser: any): User => ({
  id: sbUser.id,
  name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || '',
  email: sbUser.email || '',
  role: (sbUser.user_metadata?.role as UserRole) || 'patient',
  avatar: sbUser.user_metadata?.avatar_url,
  createdAt: new Date(sbUser.created_at),
  phone: sbUser.phone,
  preferences: sbUser.user_metadata?.preferences || defaultPreferences,
  emergencyContact: sbUser.user_metadata?.emergency_contact,
});

// Convert database profile to our PatientProfile type
const mapPatientProfile = (dbProfile: any): PatientProfile => ({
  id: dbProfile.id,
  userId: dbProfile.user_id,
  dateOfBirth: dbProfile.date_of_birth ? new Date(dbProfile.date_of_birth) : new Date(),
  diagnosisDate: dbProfile.diagnosis_date ? new Date(dbProfile.diagnosis_date) : undefined,
  dementiaStage: dbProfile.dementia_stage || 'not_diagnosed',
  primaryDoctor: dbProfile.primary_doctor_name ? {
    name: dbProfile.primary_doctor_name,
    specialty: dbProfile.primary_doctor_specialty || '',
    phone: dbProfile.primary_doctor_phone || '',
    email: dbProfile.primary_doctor_email,
    clinic: dbProfile.primary_doctor_clinic,
  } : undefined,
  medications: [],
  routines: [],
  memories: [],
  moodHistory: [],
  activityHistory: [],
  notes: [],
  favoriteMusic: dbProfile.favorite_music || [],
  hobbies: dbProfile.hobbies || [],
  comfortItems: dbProfile.comfort_items || [],
  allergies: dbProfile.allergies || [],
  medicalConditions: dbProfile.medical_conditions || [],
  identityProfile: dbProfile.identity_profile ? {
    preferredName: dbProfile.identity_profile.preferredName || '',
    photoUrl: dbProfile.identity_profile.photoUrl,
    affirmation: dbProfile.identity_profile.affirmation || 'You are safe. You are at home. You are loved.',
    customAffirmation: dbProfile.identity_profile.customAffirmation,
    lifeStory: dbProfile.identity_profile.lifeStory,
    formerOccupation: dbProfile.identity_profile.formerOccupation,
    favoriteThings: dbProfile.identity_profile.favoriteThings || [],
  } : undefined,
  familiarFaces: [],
  locationInfo: dbProfile.location_info ? {
    currentLocation: dbProfile.location_info.currentLocation || 'Home',
    address: dbProfile.location_info.address || '',
    city: dbProfile.location_info.city || '',
    state: dbProfile.location_info.state || '',
    homeDescription: dbProfile.location_info.homeDescription,
    safePlaces: dbProfile.location_info.safePlaces || ['Living Room', 'Kitchen', 'Bedroom'],
    emergencyExits: dbProfile.location_info.emergencyExits,
  } : undefined,
  calmingMessage: dbProfile.calming_message ? {
    enabled: dbProfile.calming_message.enabled ?? true,
    messageType: dbProfile.calming_message.messageType || 'faith_neutral',
    customMessage: dbProfile.calming_message.customMessage,
    faithTradition: dbProfile.calming_message.faithTradition,
    showOnDashboard: dbProfile.calming_message.showOnDashboard ?? true,
  } : undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [caregiverProfile, setCaregiverProfile] = useState<CaregiverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
          await loadProfile(session.user.id, session.user.user_metadata?.role as UserRole);
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        await loadProfile(session.user.id, session.user.user_metadata?.role as UserRole);
      } else {
        setUser(null);
        setPatientProfile(null);
        setCaregiverProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string, role: UserRole) => {
    try {
      if (role === 'patient') {
        const { data, error } = await supabase
          .from('patient_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          // Profile doesn't exist, create default
          if (error.code === 'PGRST116') {
            await createDefaultPatientProfile(userId);
          } else {
            console.error('Error loading patient profile:', error);
          }
        } else if (data) {
          setPatientProfile(mapPatientProfile(data));
        }
      } else if (role === 'caregiver') {
        const { data, error } = await supabase
          .from('caregiver_patients')
          .select('*')
          .eq('caregiver_id', userId);

        if (!error && data) {
          const patientIds = (data as any[]).map((cp: any) => cp.patient_id);
          setCaregiverProfile({
            id: `c_${userId}`,
            userId: userId,
            patientIds: patientIds || [],
            stressLevel: 3,
            supportNetwork: [],
            resourcesAccessed: [],
            selfCareReminders: true,
          });
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const createDefaultPatientProfile = async (userId: string) => {
    const profileData = {
      user_id: userId,
      dementia_stage: 'not_diagnosed',
      identity_profile: {
        preferredName: '',
        affirmation: 'You are safe. You are at home. You are loved.',
        favoriteThings: [],
      },
      location_info: {
        currentLocation: 'Home',
        safePlaces: ['Living Room', 'Kitchen', 'Bedroom'],
      },
      calming_message: {
        enabled: true,
        messageType: 'faith_neutral',
        showOnDashboard: true,
      },
    };

    const { data, error } = await supabase
      .from('patient_profiles')
      .insert(profileData as any)
      .select()
      .single();

    if (!error && data) {
      setPatientProfile(mapPatientProfile(data));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else if (data.user) {
      setUser(mapSupabaseUser(data.user));
      await loadProfile(data.user.id, data.user.user_metadata?.role as UserRole);
      toast.success('Welcome back!');
    }

    setIsLoading(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole, phone?: string) => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
          phone,
          preferences: defaultPreferences,
        },
      },
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else if (data.user) {
      setUser(mapSupabaseUser(data.user));
      
      // Create profile based on role
      if (role === 'patient') {
        await createDefaultPatientProfile(data.user.id);
      }
      
      toast.success('Account created successfully! Please check your email to verify your account.');
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      setPatientProfile(null);
      setCaregiverProfile(null);
      toast.success('Signed out successfully');
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      toast.success('Password reset email sent! Please check your inbox.');
    }

    setIsLoading(false);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.name,
        phone: updates.phone,
        preferences: updates.preferences,
        emergency_contact: updates.emergencyContact,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated');
    }
  }, [user]);

  const updatePatientProfile = useCallback(async (updates: Partial<PatientProfile>) => {
    if (!user || !patientProfile) return;

    const dbUpdates: any = {};
    
    if (updates.identityProfile) {
      dbUpdates.identity_profile = updates.identityProfile;
    }
    if (updates.locationInfo) {
      dbUpdates.location_info = updates.locationInfo;
    }
    if (updates.calmingMessage) {
      dbUpdates.calming_message = updates.calmingMessage;
    }
    if (updates.favoriteMusic) {
      dbUpdates.favorite_music = updates.favoriteMusic;
    }
    if (updates.hobbies) {
      dbUpdates.hobbies = updates.hobbies;
    }
    if (updates.comfortItems) {
      dbUpdates.comfort_items = updates.comfortItems;
    }
    if (updates.allergies) {
      dbUpdates.allergies = updates.allergies;
    }
    if (updates.medicalConditions) {
      dbUpdates.medical_conditions = updates.medicalConditions;
    }

    const { error } = await (supabase
      .from('patient_profiles') as any)
      .update(dbUpdates)
      .eq('user_id', user.id);

    if (error) {
      toast.error(error.message);
    } else {
      setPatientProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated');
    }
  }, [user, patientProfile]);

  const updateCaregiverProfile = useCallback(async (updates: Partial<CaregiverProfile>) => {
    setCaregiverProfile(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id, user.role);
    }
  }, [user]);

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
        resetPassword,
        updateUser,
        updatePatientProfile,
        updateCaregiverProfile,
        clearError,
        refreshProfile,
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
