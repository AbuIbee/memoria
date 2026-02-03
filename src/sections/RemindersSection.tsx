import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, X, Clock, Calendar, Pill, Activity, 
  CheckCircle2, Trash2, Edit2, Save, AlertCircle,
  Repeat
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useReminders } from '@/hooks/useReminders';
import type { Reminder } from '@/types';

interface RemindersSectionProps {
  onClose: () => void;
}

const reminderTypes = [
  { value: 'medication', label: 'Medication', icon: Pill, color: 'bg-green-500' },
  { value: 'routine', label: 'Routine', icon: Activity, color: 'bg-orange-500' },
  { value: 'appointment', label: 'Appointment', icon: Calendar, color: 'bg-blue-500' },
  { value: 'custom', label: 'Custom', icon: Bell, color: 'bg-purple-500' },
];

const notificationMethods = [
  { value: 'push', label: 'Push Notification' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS/Text' },
];

export default function RemindersSection({ onClose }: RemindersSectionProps) {
  const { 
    reminders, 
    upcomingReminders, 
    overdueReminders, 
    addReminder, 
    updateReminder, 
    deleteReminder, 
    completeReminder,
    snoozeReminder,
    requestNotificationPermission 
  } = useReminders();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'overdue'>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    type: 'custom',
    scheduledFor: new Date(),
    recurring: false,
    recurrencePattern: '',
    notificationMethods: ['push'],
  });

  const handleAddReminder = async () => {
    if (!formData.title) {
      toast.error('Please enter a reminder title');
      return;
    }

    // Request notification permission if not granted
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      toast.error('Please enable notifications to receive reminders');
    }

    addReminder({
      userId: '1', // Current user
      title: formData.title,
      description: formData.description || '',
      type: formData.type as any,
      scheduledFor: formData.scheduledFor || new Date(),
      recurring: formData.recurring || false,
      recurrencePattern: formData.recurrencePattern,
      notificationMethods: formData.notificationMethods || ['push'],
      completed: false,
    });

    setShowAddForm(false);
    resetForm();
  };

  const handleUpdateReminder = () => {
    if (!editingId) return;

    updateReminder(editingId, {
      ...formData,
      scheduledFor: formData.scheduledFor || new Date(),
    });

    setEditingId(null);
    resetForm();
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
  };

  const handleComplete = (id: string) => {
    completeReminder(id);
  };

  const handleSnooze = (id: string) => {
    snoozeReminder(id, 15);
  };

  const startEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      scheduledFor: new Date(reminder.scheduledFor),
      recurring: reminder.recurring,
      recurrencePattern: reminder.recurrencePattern,
      notificationMethods: reminder.notificationMethods,
    });
    setEditingId(reminder.id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'custom',
      scheduledFor: new Date(),
      recurring: false,
      recurrencePattern: '',
      notificationMethods: ['push'],
    });
  };

  const getFilteredReminders = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingReminders;
      case 'overdue':
        return overdueReminders;
      default:
        return reminders;
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = reminderTypes.find(t => t.value === type);
    return typeConfig?.icon || Bell;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = reminderTypes.find(t => t.value === type);
    return typeConfig?.color || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reminders</h2>
              <p className="text-gray-600">Never miss an important task</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`p-4 rounded-xl text-center transition-colors ${
                activeTab === 'all' ? 'bg-amber-100' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              <p className="text-sm text-gray-600">All Reminders</p>
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`p-4 rounded-xl text-center transition-colors ${
                activeTab === 'upcoming' ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{upcomingReminders.length}</p>
              <p className="text-sm text-gray-600">Upcoming</p>
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`p-4 rounded-xl text-center transition-colors ${
                activeTab === 'overdue' ? 'bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{overdueReminders.length}</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </button>
          </div>

          {/* Add Button */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 h-14 border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Reminder
            </Button>
          )}

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6"
              >
                <Card className="border-2 border-amber-200 bg-amber-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {editingId ? 'Edit Reminder' : 'Add New Reminder'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Reminder Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Take morning medication"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="Add more details..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                      <Label>Reminder Type</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {reminderTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                              formData.type === type.value
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <type.icon className={`w-5 h-5 ${formData.type === type.value ? 'text-amber-500' : 'text-gray-400'}`} />
                            <span className={`text-xs ${formData.type === type.value ? 'text-amber-700' : 'text-gray-600'}`}>
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={formData.scheduledFor ? new Date(formData.scheduledFor).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            const current = formData.scheduledFor ? new Date(formData.scheduledFor) : new Date();
                            date.setHours(current.getHours(), current.getMinutes());
                            setFormData(prev => ({ ...prev, scheduledFor: date }));
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={formData.scheduledFor ? new Date(formData.scheduledFor).toTimeString().slice(0, 5) : ''}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const date = formData.scheduledFor ? new Date(formData.scheduledFor) : new Date();
                            date.setHours(parseInt(hours), parseInt(minutes));
                            setFormData(prev => ({ ...prev, scheduledFor: date }));
                          }}
                        />
                      </div>
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="recurring"
                          checked={formData.recurring}
                          onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <Label htmlFor="recurring" className="mb-0 flex items-center gap-1">
                          <Repeat className="w-4 h-4" />
                          Recurring Reminder
                        </Label>
                      </div>
                      {formData.recurring && (
                        <select
                          value={formData.recurrencePattern}
                          onChange={(e) => setFormData(prev => ({ ...prev, recurrencePattern: e.target.value }))}
                          className="flex-1 h-9 px-2 rounded border border-input text-sm"
                        >
                          <option value="">Select pattern...</option>
                          <option value="daily">Every day</option>
                          <option value="weekdays">Weekdays</option>
                          <option value="weekends">Weekends</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      )}
                    </div>

                    {/* Notification Methods */}
                    <div className="space-y-2">
                      <Label>Notification Methods</Label>
                      <div className="flex flex-wrap gap-2">
                        {notificationMethods.map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => {
                              const current = formData.notificationMethods || [];
                              const updated = current.includes(method.value as any)
                                ? current.filter(m => m !== method.value)
                                : [...current, method.value as any];
                              setFormData(prev => ({ ...prev, notificationMethods: updated }));
                            }}
                            className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                              formData.notificationMethods?.includes(method.value as any)
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingId(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-amber-500 hover:bg-amber-600"
                        onClick={editingId ? handleUpdateReminder : handleAddReminder}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingId ? 'Update' : 'Save'} Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reminders List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              {activeTab === 'all' && 'All Reminders'}
              {activeTab === 'upcoming' && 'Upcoming Reminders'}
              {activeTab === 'overdue' && 'Overdue Reminders'}
              {' '}({getFilteredReminders().length})
            </h3>
            
            {getFilteredReminders().length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No reminders</h4>
                <p className="text-gray-500">Add a reminder to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getFilteredReminders().map((reminder) => {
                  const TypeIcon = getTypeIcon(reminder.type);
                  const typeColor = getTypeColor(reminder.type);
                  const isOverdue = !reminder.completed && new Date(reminder.scheduledFor) < new Date() && !reminder.snoozedUntil;

                  return (
                    <Card
                      key={reminder.id}
                      className={`border-0 shadow-md hover:shadow-lg transition-shadow ${
                        reminder.completed ? 'opacity-60' : ''
                      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg ${typeColor} flex items-center justify-center`}>
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold text-gray-900 ${reminder.completed ? 'line-through' : ''}`}>
                                {reminder.title}
                              </h4>
                              {isOverdue && (
                                <Badge className="bg-red-100 text-red-700">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                              {reminder.recurring && (
                                <Badge variant="secondary" className="text-xs">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  Recurring
                                </Badge>
                              )}
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-gray-500">{reminder.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(reminder.scheduledFor).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(reminder.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!reminder.completed && (
                              <>
                                <button
                                  onClick={() => handleComplete(reminder.id)}
                                  className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                                  title="Mark as complete"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                {isOverdue && (
                                  <button
                                    onClick={() => handleSnooze(reminder.id)}
                                    className="p-2 hover:bg-amber-50 rounded-lg text-amber-600"
                                    title="Snooze for 15 minutes"
                                  >
                                    <Clock className="w-5 h-5" />
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => startEdit(reminder)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
