import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Sun, 
  Sunset, 
  Moon, 
  Sunrise,
  MapPin,
  Home,
  Navigation
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

export default function TimeOrientationWidget() {
  const { patientProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  const locationInfo = patientProfile?.locationInfo;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get time of day
  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { label: 'Morning', icon: Sunrise, color: 'text-amber-500', bgColor: 'bg-amber-100' };
    if (hour >= 12 && hour < 17) return { label: 'Afternoon', icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-100' };
    if (hour >= 17 && hour < 21) return { label: 'Evening', icon: Sunset, color: 'text-rose-500', bgColor: 'bg-rose-100' };
    return { label: 'Night', icon: Moon, color: 'text-indigo-500', bgColor: 'bg-indigo-100' };
  };

  const timeOfDay = getTimeOfDay();
  const TimeIcon = timeOfDay.icon;

  // Format date
  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      dayName: days[date.getDay()],
      month: months[date.getMonth()],
      date: date.getDate(),
      year: date.getFullYear(),
    };
  };

  const dateInfo = formatDate(currentTime);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="border-2 border-amber-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Time */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Current Time</p>
              <p className="text-4xl sm:text-5xl font-bold">{formatTime(currentTime)}</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl ${timeOfDay.bgColor} flex items-center justify-center`}>
              <TimeIcon className={`w-8 h-8 ${timeOfDay.color}`} />
            </div>
          </div>
        </div>

        {/* Date and Time of Day */}
        <div className="p-6 space-y-4">
          {/* Day and Date */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today is</p>
              <p className="text-xl font-semibold text-gray-800">
                {dateInfo.dayName}, {dateInfo.month} {dateInfo.date}, {dateInfo.year}
              </p>
            </div>
          </div>

          {/* Time of Day */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${timeOfDay.bgColor} flex items-center justify-center flex-shrink-0`}>
              <TimeIcon className={`w-6 h-6 ${timeOfDay.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Time of Day</p>
              <p className="text-xl font-semibold text-gray-800">
                It is {timeOfDay.label}
              </p>
            </div>
          </div>

          {/* Location */}
          {locationInfo && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">You are at</p>
                <p className="text-xl font-semibold text-gray-800">
                  {locationInfo.currentLocation} in {locationInfo.city}
                </p>
              </div>
              
              {/* Where am I? Button */}
              <Dialog open={showLocationDetails} onOpenChange={setShowLocationDetails}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-amber-300 hover:bg-amber-50 flex-shrink-0"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Where am I?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <MapPin className="w-6 h-6 text-amber-500" />
                      Where You Are
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Reassurance Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
                    >
                      <p className="text-2xl font-semibold text-green-800 text-center">
                        You are safe.
                      </p>
                      <p className="text-lg text-green-700 text-center mt-2">
                        You are at {locationInfo.currentLocation}.
                      </p>
                    </motion.div>

                    {/* Location Details */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Home className="w-5 h-5 text-amber-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">Address</p>
                          <p className="text-gray-600">{locationInfo.address}</p>
                          <p className="text-gray-600">{locationInfo.city}, {locationInfo.state}</p>
                        </div>
                      </div>

                      {locationInfo.homeDescription && (
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-1">
                            <span className="text-amber-600 text-xs">i</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">About Your Home</p>
                            <p className="text-gray-600">{locationInfo.homeDescription}</p>
                          </div>
                        </div>
                      )}

                      {locationInfo.safePlaces && locationInfo.safePlaces.length > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1">
                            <span className="text-green-600 text-xs">✓</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Safe Places</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {locationInfo.safePlaces.map((place, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                >
                                  {place}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <p className="text-sm text-amber-800 font-medium mb-2">
                        Need help?
                      </p>
                      <p className="text-amber-700">
                        Press the Emergency button at the top of the screen to contact your caregiver.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
