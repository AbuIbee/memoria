export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'patient' | 'caregiver' | 'healthcare_provider' | null
          phone: string | null
          avatar_url: string | null
          emergency_contact_name: string | null
          emergency_contact_relationship: string | null
          emergency_contact_phone: string | null
          emergency_contact_email: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'patient' | 'caregiver' | 'healthcare_provider' | null
          phone?: string | null
          avatar_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_relationship?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_email?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'patient' | 'caregiver' | 'healthcare_provider' | null
          phone?: string | null
          avatar_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_relationship?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_email?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      patient_profiles: {
        Row: {
          id: string
          user_id: string
          date_of_birth: string | null
          diagnosis_date: string | null
          dementia_stage: 'early' | 'moderate' | 'advanced' | 'not_diagnosed' | null
          primary_doctor_name: string | null
          primary_doctor_specialty: string | null
          primary_doctor_phone: string | null
          primary_doctor_email: string | null
          primary_doctor_clinic: string | null
          favorite_music: string[] | null
          hobbies: string[] | null
          comfort_items: string[] | null
          allergies: string[] | null
          medical_conditions: string[] | null
          identity_profile: Json
          location_info: Json
          calming_message: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date_of_birth?: string | null
          diagnosis_date?: string | null
          dementia_stage?: 'early' | 'moderate' | 'advanced' | 'not_diagnosed' | null
          primary_doctor_name?: string | null
          primary_doctor_specialty?: string | null
          primary_doctor_phone?: string | null
          primary_doctor_email?: string | null
          primary_doctor_clinic?: string | null
          favorite_music?: string[] | null
          hobbies?: string[] | null
          comfort_items?: string[] | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          identity_profile?: Json
          location_info?: Json
          calming_message?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date_of_birth?: string | null
          diagnosis_date?: string | null
          dementia_stage?: 'early' | 'moderate' | 'advanced' | 'not_diagnosed' | null
          primary_doctor_name?: string | null
          primary_doctor_specialty?: string | null
          primary_doctor_phone?: string | null
          primary_doctor_email?: string | null
          primary_doctor_clinic?: string | null
          favorite_music?: string[] | null
          hobbies?: string[] | null
          comfort_items?: string[] | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          identity_profile?: Json
          location_info?: Json
          calming_message?: Json
          created_at?: string
          updated_at?: string
        }
      }
      familiar_faces: {
        Row: {
          id: string
          patient_id: string
          name: string
          relationship: string
          photo_url: string | null
          description: string | null
          contact_info: string | null
          visit_frequency: string | null
          is_primary_contact: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          relationship: string
          photo_url?: string | null
          description?: string | null
          contact_info?: string | null
          visit_frequency?: string | null
          is_primary_contact?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          relationship?: string
          photo_url?: string | null
          description?: string | null
          contact_info?: string | null
          visit_frequency?: string | null
          is_primary_contact?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          patient_id: string
          name: string
          generic_name: string | null
          dosage: string
          strength: string | null
          form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'patch' | 'inhaler' | 'other' | null
          frequency: 'daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'weekly' | 'monthly' | 'as_needed' | 'custom' | null
          times: string[] | null
          instructions: string | null
          side_effects: string[] | null
          prescribed_by: string | null
          prescription_date: string | null
          start_date: string | null
          end_date: string | null
          refill_date: string | null
          pharmacy: string | null
          reminders_enabled: boolean
          reminder_minutes_before: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          generic_name?: string | null
          dosage: string
          strength?: string | null
          form?: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'patch' | 'inhaler' | 'other' | null
          frequency?: 'daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'weekly' | 'monthly' | 'as_needed' | 'custom' | null
          times?: string[] | null
          instructions?: string | null
          side_effects?: string[] | null
          prescribed_by?: string | null
          prescription_date?: string | null
          start_date?: string | null
          end_date?: string | null
          refill_date?: string | null
          pharmacy?: string | null
          reminders_enabled?: boolean
          reminder_minutes_before?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          generic_name?: string | null
          dosage?: string
          strength?: string | null
          form?: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'patch' | 'inhaler' | 'other' | null
          frequency?: 'daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'weekly' | 'monthly' | 'as_needed' | 'custom' | null
          times?: string[] | null
          instructions?: string | null
          side_effects?: string[] | null
          prescribed_by?: string | null
          prescription_date?: string | null
          start_date?: string | null
          end_date?: string | null
          refill_date?: string | null
          pharmacy?: string | null
          reminders_enabled?: boolean
          reminder_minutes_before?: number
          created_at?: string
          updated_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          patient_id: string
          title: string
          description: string | null
          category: 'morning' | 'afternoon' | 'evening' | 'night' | 'custom' | null
          time: string | null
          days: string[] | null
          completed: boolean
          icon: string | null
          steps: string[] | null
          reminders: boolean
          reminder_minutes_before: number
          is_recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          title: string
          description?: string | null
          category?: 'morning' | 'afternoon' | 'evening' | 'night' | 'custom' | null
          time?: string | null
          days?: string[] | null
          completed?: boolean
          icon?: string | null
          steps?: string[] | null
          reminders?: boolean
          reminder_minutes_before?: number
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          title?: string
          description?: string | null
          category?: 'morning' | 'afternoon' | 'evening' | 'night' | 'custom' | null
          time?: string | null
          days?: string[] | null
          completed?: boolean
          icon?: string | null
          steps?: string[] | null
          reminders?: boolean
          reminder_minutes_before?: number
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          patient_id: string
          taken_at: string
          scheduled_for: string | null
          taken: boolean
          skipped: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_id: string
          patient_id: string
          taken_at?: string
          scheduled_for?: string | null
          taken?: boolean
          skipped?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_id?: string
          patient_id?: string
          taken_at?: string
          scheduled_for?: string | null
          taken?: boolean
          skipped?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          patient_id: string
          title: string
          description: string | null
          memory_date: string | null
          photos: string[] | null
          audio_url: string | null
          video_url: string | null
          tags: string[] | null
          is_favorite: boolean
          is_shared: boolean
          shared_with: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          title: string
          description?: string | null
          memory_date?: string | null
          photos?: string[] | null
          audio_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          is_shared?: boolean
          shared_with?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          title?: string
          description?: string | null
          memory_date?: string | null
          photos?: string[] | null
          audio_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          is_shared?: boolean
          shared_with?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          patient_id: string
          mood: 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad' | 'anxious' | 'agitated' | 'confused' | 'calm' | null
          intensity: number | null
          triggers: string[] | null
          notes: string | null
          activities: string[] | null
          location: string | null
          ai_insight: string | null
          ai_suggestions: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          mood?: 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad' | 'anxious' | 'agitated' | 'confused' | 'calm' | null
          intensity?: number | null
          triggers?: string[] | null
          notes?: string | null
          activities?: string[] | null
          location?: string | null
          ai_insight?: string | null
          ai_suggestions?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          mood?: 'very_happy' | 'happy' | 'neutral' | 'sad' | 'very_sad' | 'anxious' | 'agitated' | 'confused' | 'calm' | null
          intensity?: number | null
          triggers?: string[] | null
          notes?: string | null
          activities?: string[] | null
          location?: string | null
          ai_insight?: string | null
          ai_suggestions?: string[] | null
          created_at?: string
        }
      }
      caregiver_patients: {
        Row: {
          id: string
          caregiver_id: string
          patient_id: string
          relationship: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          caregiver_id: string
          patient_id: string
          relationship?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          caregiver_id?: string
          patient_id?: string
          relationship?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: 'medication' | 'routine' | 'appointment' | 'custom' | null
          scheduled_for: string
          recurring: boolean
          recurrence_pattern: string | null
          notification_methods: string[] | null
          completed: boolean
          snoozed_until: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type?: 'medication' | 'routine' | 'appointment' | 'custom' | null
          scheduled_for: string
          recurring?: boolean
          recurrence_pattern?: string | null
          notification_methods?: string[] | null
          completed?: boolean
          snoozed_until?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: 'medication' | 'routine' | 'appointment' | 'custom' | null
          scheduled_for?: string
          recurring?: boolean
          recurrence_pattern?: string | null
          notification_methods?: string[] | null
          completed?: boolean
          snoozed_until?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
