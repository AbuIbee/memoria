import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Plus, X, Clock, Calendar, User, 
  ChevronDown, ChevronUp, Trash2, Edit2, Save,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useSupabaseAuth';
import type { Medication } from '@/types';

interface MedicationManagerProps {
  onClose: () => void;
}

const medicationForms = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'injection', label: 'Injection' },
  { value: 'patch', label: 'Patch' },
  { value: 'inhaler', label: 'Inhaler' },
  { value: 'other', label: 'Other' },
];

const frequencies = [
  { value: 'daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily' },
  { value: 'three_times_daily', label: 'Three times daily' },
  { value: 'four_times_daily', label: 'Four times daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as_needed', label: 'As needed' },
  { value: 'custom', label: 'Custom' },
];

export default function MedicationManager({ onClose }: MedicationManagerProps) {
  const { patientProfile, updatePatientProfile } = useAuth();
  const [medications, setMedications] = useState<Medication[]>(patientProfile?.medications || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Medication>>({
    name: '',
    genericName: '',
    dosage: '',
    strength: '',
    form: 'tablet',
    frequency: 'daily',
    times: ['08:00'],
    instructions: '',
    sideEffects: [],
    prescribedBy: '',
    remindersEnabled: true,
    reminderMinutesBefore: 15,
  });

  const handleAddMedication = () => {
    if (!formData.name || !formData.dosage) {
      toast.error('Please fill in medication name and dosage');
      return;
    }

    const newMedication: Medication = {
      id: `med_${Date.now()}`,
      name: formData.name,
      genericName: formData.genericName,
      dosage: formData.dosage,
      strength: formData.strength,
      form: formData.form as any,
      frequency: formData.frequency as any,
      times: formData.times || ['08:00'],
      instructions: formData.instructions || '',
      sideEffects: formData.sideEffects || [],
      prescribedBy: formData.prescribedBy || '',
      prescriptionDate: new Date(),
      startDate: new Date(),
      remindersEnabled: formData.remindersEnabled || true,
      reminderMinutesBefore: formData.reminderMinutesBefore || 15,
      takenHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    updatePatientProfile({ medications: updatedMedications });
    
    toast.success('Medication added successfully!');
    setShowAddForm(false);
    resetForm();
  };

  const handleUpdateMedication = () => {
    if (!editingId) return;

    const updatedMedications = medications.map(med =>
      med.id === editingId
        ? { ...med, ...formData, updatedAt: new Date() }
        : med
    );

    setMedications(updatedMedications);
    updatePatientProfile({ medications: updatedMedications });
    
    toast.success('Medication updated!');
    setEditingId(null);
    resetForm();
  };

  const handleDeleteMedication = (id: string) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    setMedications(updatedMedications);
    updatePatientProfile({ medications: updatedMedications });
    toast.success('Medication removed');
  };

  const startEdit = (medication: Medication) => {
    setFormData({
      name: medication.name,
      genericName: medication.genericName,
      dosage: medication.dosage,
      strength: medication.strength,
      form: medication.form,
      frequency: medication.frequency,
      times: medication.times,
      instructions: medication.instructions,
      sideEffects: medication.sideEffects,
      prescribedBy: medication.prescribedBy,
      remindersEnabled: medication.remindersEnabled,
      reminderMinutesBefore: medication.reminderMinutesBefore,
    });
    setEditingId(medication.id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      dosage: '',
      strength: '',
      form: 'tablet',
      frequency: 'daily',
      times: ['08:00'],
      instructions: '',
      sideEffects: [],
      prescribedBy: '',
      remindersEnabled: true,
      reminderMinutesBefore: 15,
    });
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...(prev.times || []), '12:00'],
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times?.map((t, i) => i === index ? value : t) || [],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Medications</h2>
              <p className="text-gray-600">Manage your prescriptions and reminders</p>
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
          {/* Add Button */}
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 h-14 border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 text-green-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Medication
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
                <Card className="border-2 border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {editingId ? 'Edit Medication' : 'Add New Medication'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Medication Name */}
                      <div className="space-y-2">
                        <Label htmlFor="med-name">Medication Name *</Label>
                        <Input
                          id="med-name"
                          placeholder="e.g., Donepezil"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      {/* Generic Name */}
                      <div className="space-y-2">
                        <Label htmlFor="generic-name">Generic Name (Optional)</Label>
                        <Input
                          id="generic-name"
                          placeholder="e.g., Donepezil Hydrochloride"
                          value={formData.genericName}
                          onChange={(e) => setFormData(prev => ({ ...prev, genericName: e.target.value }))}
                        />
                      </div>

                      {/* Dosage */}
                      <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage *</Label>
                        <Input
                          id="dosage"
                          placeholder="e.g., 10mg"
                          value={formData.dosage}
                          onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                        />
                      </div>

                      {/* Strength */}
                      <div className="space-y-2">
                        <Label htmlFor="strength">Strength (Optional)</Label>
                        <Input
                          id="strength"
                          placeholder="e.g., 10mg per tablet"
                          value={formData.strength}
                          onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
                        />
                      </div>

                      {/* Form */}
                      <div className="space-y-2">
                        <Label>Form</Label>
                        <select
                          value={formData.form}
                          onChange={(e) => setFormData(prev => ({ ...prev, form: e.target.value as any }))}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          {medicationForms.map(form => (
                            <option key={form.value} value={form.value}>{form.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Frequency */}
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          {frequencies.map(freq => (
                            <option key={freq.value} value={freq.value}>{freq.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2">
                      <Label>Time(s) to Take</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.times?.map((time, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Input
                              type="time"
                              value={time}
                              onChange={(e) => updateTimeSlot(index, e.target.value)}
                              className="w-28"
                            />
                            {formData.times!.length > 1 && (
                              <button
                                onClick={() => removeTimeSlot(index)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTimeSlot}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Time
                        </Button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <textarea
                        id="instructions"
                        placeholder="e.g., Take with food, Avoid grapefruit juice..."
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background resize-none"
                      />
                    </div>

                    {/* Prescribed By */}
                    <div className="space-y-2">
                      <Label htmlFor="prescribed-by">Prescribed By</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="prescribed-by"
                          placeholder="Doctor's name"
                          value={formData.prescribedBy}
                          onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Reminder Settings */}
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="reminders"
                          checked={formData.remindersEnabled}
                          onChange={(e) => setFormData(prev => ({ ...prev, remindersEnabled: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <Label htmlFor="reminders" className="mb-0">Enable Reminders</Label>
                      </div>
                      {formData.remindersEnabled && (
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Remind me</span>
                          <select
                            value={formData.reminderMinutesBefore}
                            onChange={(e) => setFormData(prev => ({ ...prev, reminderMinutesBefore: parseInt(e.target.value) }))}
                            className="h-8 px-2 rounded border border-input"
                          >
                            <option value={5}>5 min</option>
                            <option value={10}>10 min</option>
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={60}>1 hour</option>
                          </select>
                          <span className="text-sm text-gray-600">before</span>
                        </div>
                      )}
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
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={editingId ? handleUpdateMedication : handleAddMedication}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingId ? 'Update' : 'Save'} Medication
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Medications List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Your Medications ({medications.length})</h3>
            
            {medications.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No medications yet</h4>
                <p className="text-gray-500">Add your first medication to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((medication) => (
                  <Card
                    key={medication.id}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === medication.id ? null : medication.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                          <p className="text-sm text-gray-500">
                            {medication.dosage} • {medication.frequency.replace('_', ' ')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {medication.times.join(', ')}
                            </span>
                            {medication.remindersEnabled && (
                              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                                <Bell className="w-3 h-3 mr-1" />
                                Reminder
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(medication);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMedication(medication.id);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedId === medication.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedId === medication.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-4 space-y-3">
                            {medication.genericName && (
                              <div>
                                <span className="text-sm text-gray-500">Generic Name:</span>
                                <p className="text-gray-700">{medication.genericName}</p>
                              </div>
                            )}
                            {medication.instructions && (
                              <div>
                                <span className="text-sm text-gray-500">Instructions:</span>
                                <p className="text-gray-700">{medication.instructions}</p>
                              </div>
                            )}
                            {medication.prescribedBy && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">Prescribed by: {medication.prescribedBy}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>Started: {new Date(medication.startDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
