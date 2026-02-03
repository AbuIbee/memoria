import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { Reminder } from '@/types';

interface RemindersContextType {
  reminders: Reminder[];
  upcomingReminders: Reminder[];
  overdueReminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  snoozeReminder: (id: string, minutes: number) => void;
  requestNotificationPermission: () => Promise<boolean>;
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

// Sample reminders
const sampleReminders: Reminder[] = [
  {
    id: '1',
    userId: '1',
    title: 'Take Donepezil',
    description: '10mg with breakfast',
    type: 'medication',
    scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    recurring: true,
    recurrencePattern: 'daily',
    notificationMethods: ['push', 'email'],
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Morning Walk',
    description: '15-minute gentle walk',
    type: 'routine',
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    recurring: true,
    recurrencePattern: 'daily',
    notificationMethods: ['push'],
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    title: 'Doctor Appointment',
    description: 'Dr. Smith - Neurology checkup',
    type: 'appointment',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    recurring: false,
    notificationMethods: ['push', 'email', 'sms'],
    completed: false,
    createdAt: new Date(),
  },
];

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      toast.success('Notifications enabled!');
      return true;
    } else {
      toast.error('Please enable notifications to receive reminders');
      return false;
    }
  }, []);

  // Show browser notification
  const showNotification = useCallback((title: string, body: string) => {
    if (notificationPermission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'memoria-reminder',
        requireInteraction: true,
      });
    }
  }, [notificationPermission]);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.completed && !reminder.snoozedUntil) {
          const reminderTime = new Date(reminder.scheduledFor);
          const timeDiff = reminderTime.getTime() - now.getTime();
          
          // Show notification if reminder is due (within last minute)
          if (timeDiff <= 0 && timeDiff > -60000) {
            showNotification(reminder.title, reminder.description || '');
            toast.info(reminder.title, {
              description: reminder.description,
              duration: 10000,
              action: {
                label: 'Complete',
                onClick: () => completeReminder(reminder.id),
              },
            });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    checkReminders();

    return () => clearInterval(interval);
  }, [reminders, showNotification]);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder_${Date.now()}`,
      createdAt: new Date(),
    };
    setReminders(prev => [...prev, newReminder]);
    toast.success('Reminder added!');
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
    toast.success('Reminder updated!');
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted!');
  }, []);

  const completeReminder = useCallback((id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
    toast.success('Reminder completed!');
  }, []);

  const snoozeReminder = useCallback((id: string, minutes: number) => {
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, snoozedUntil } : reminder
      )
    );
    toast.success(`Reminder snoozed for ${minutes} minutes`);
  }, []);

  // Filter reminders
  const now = new Date();
  const upcomingReminders = reminders.filter(
    r => !r.completed && new Date(r.scheduledFor) > now
  ).sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  const overdueReminders = reminders.filter(
    r => !r.completed && new Date(r.scheduledFor) <= now && !r.snoozedUntil
  );

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        upcomingReminders,
        overdueReminders,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        snoozeReminder,
        requestNotificationPermission,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
}

export function useReminders() {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
}
