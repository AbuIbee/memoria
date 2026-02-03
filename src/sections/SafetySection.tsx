import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Phone, MapPin, AlertTriangle, Bell, 
  Users, Clock, CheckCircle2, Navigation, Heart,
  Home, Footprints, Battery, Wifi
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockSafetyEvents } from '@/data/mockData';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface SafetySectionProps {
  onEmergency: () => void;
}

export default function SafetySection({ onEmergency }: SafetySectionProps) {
  const { user } = useAuth();
  const [locationSharing, setLocationSharing] = useState(true);
  const [fallDetection, setFallDetection] = useState(true);
  const [medicationAlerts, setMedicationAlerts] = useState(true);
  const [safetyEvents] = useState(mockSafetyEvents);

  const handleEmergencyCall = () => {
    onEmergency();
  };

  const toggleFeature = (feature: string, current: boolean, setState: (v: boolean) => void) => {
    setState(!current);
    toast.success(`${feature} ${!current ? 'enabled' : 'disabled'}`, {
      description: !current 
        ? `Your caregiver will be notified of ${feature.toLowerCase()} updates.` 
        : `${feature} has been turned off.`,
    });
  };

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Safety & Emergency</h1>
              <p className="text-gray-600">Stay safe and connected with your caregivers</p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-500 to-rose-600 text-white overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Phone className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Emergency Help</h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Press the button below to immediately alert your emergency contact 
                and share your current location.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-gray-100 text-xl h-16 px-12 font-bold shadow-xl"
                onClick={handleEmergencyCall}
              >
                <AlertTriangle className="w-6 h-6 mr-3" />
                CALL FOR HELP
              </Button>
              <p className="text-white/60 text-sm mt-4">
                Emergency Contact: {user?.emergencyContact?.name || 'Not set'} • {user?.emergencyContact?.phone || 'No phone'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Safety Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    Location Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">Location Sharing Active</p>
                      <p className="text-sm text-green-600">
                        Your caregiver can see your location
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>

                  {/* Mock Map Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full" />
                      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-green-200 rounded-full" />
                      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-amber-200 rounded-full" />
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">Current Location</p>
                      <p className="text-gray-500 text-sm">Home - Living Room</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Wifi className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">GPS Active</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Battery className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">85% Battery</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Home className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">At Home</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Safety Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location Sharing Toggle */}
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleFeature('Location Sharing', locationSharing, setLocationSharing)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Location Sharing</p>
                        <p className="text-sm text-gray-500">Share location with caregivers</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full transition-colors relative ${
                      locationSharing ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        locationSharing ? 'left-7' : 'left-1'
                      }`} />
                    </div>
                  </div>

                  {/* Fall Detection Toggle */}
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleFeature('Fall Detection', fallDetection, setFallDetection)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Fall Detection</p>
                        <p className="text-sm text-gray-500">Auto-alert on detected falls</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full transition-colors relative ${
                      fallDetection ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        fallDetection ? 'left-7' : 'left-1'
                      }`} />
                    </div>
                  </div>

                  {/* Medication Alerts Toggle */}
                  <div 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleFeature('Medication Alerts', medicationAlerts, setMedicationAlerts)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Medication Alerts</p>
                        <p className="text-sm text-gray-500">Notify caregiver if meds missed</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full transition-colors relative ${
                      medicationAlerts ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        medicationAlerts ? 'left-7' : 'left-1'
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    Safety History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safetyEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`flex items-center gap-4 p-4 rounded-xl ${
                          event.resolved ? 'bg-green-50' : 'bg-amber-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.resolved ? 'bg-green-500' : 'bg-amber-500'
                        }`}>
                          {event.type === 'wandering' && <Footprints className="w-5 h-5 text-white" />}
                          {event.type === 'fall' && <AlertTriangle className="w-5 h-5 text-white" />}
                          {event.type === 'medication_missed' && <Bell className="w-5 h-5 text-white" />}
                          {event.type === 'emergency_button' && <Phone className="w-5 h-5 text-white" />}
                          {event.type === 'other' && <Shield className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 capitalize">
                            {event.type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.notes && (
                            <p className="text-sm text-gray-600 mt-1">{event.notes}</p>
                          )}
                        </div>
                        <Badge className={event.resolved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                          {event.resolved ? 'Resolved' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Emergency Contacts */}
          <div className="space-y-6">
            {/* Emergency Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-white">
                        {user?.emergencyContact?.name?.[0] || '?'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {user?.emergencyContact?.name || 'Not set'}
                    </h3>
                    <p className="text-gray-500">{user?.emergencyContact?.relationship || 'No contact'}</p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => toast.success('Calling emergency contact...')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call {user?.emergencyContact?.phone || 'No phone'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.success('Message sent to emergency contact')}
                    >
                      Send Message
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
                    <Users className="w-5 h-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Sharing live location...')}
                  >
                    <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                    Share My Location
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Recording audio note...')}
                  >
                    <Bell className="w-4 h-4 mr-3 text-amber-500" />
                    Record Voice Note
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info('Opening safe zone settings...')}
                  >
                    <Home className="w-4 h-4 mr-3 text-green-500" />
                    Set Safe Zones
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Safety Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Keep your phone charged and with you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Wear comfortable, non-slip shoes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Keep walkways clear of clutter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use night lights in hallways</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
