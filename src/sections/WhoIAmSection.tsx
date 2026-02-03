import { motion } from 'framer-motion';
import { 
  User, 
  Heart, 
  Briefcase, 
  BookOpen, 
  Edit2,
  Camera,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface WhoIAmSectionProps {
  onClose?: () => void;
}

export default function WhoIAmSection({ onClose }: WhoIAmSectionProps) {
  const { user, patientProfile, updatePatientProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(patientProfile?.identityProfile);

  const identity = patientProfile?.identityProfile;
  const affirmation = identity?.customAffirmation || identity?.affirmation || 'You are safe. You are at home. You are loved.';

  const handleSave = () => {
    if (editedProfile && patientProfile) {
      updatePatientProfile({
        ...patientProfile,
        identityProfile: editedProfile,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 overflow-y-auto"
      >
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Edit Who I Am</h1>
                <p className="text-gray-500">Update your personal information</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>

          {/* Edit Form */}
          <Card className="border-amber-200">
            <CardContent className="p-6 space-y-6">
              {/* Photo */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center overflow-hidden">
                  {identity?.photoUrl ? (
                    <img 
                      src={identity.photoUrl} 
                      alt={identity.preferredName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-amber-600" />
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Preferred Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Name or Nickname
                </label>
                <Input
                  value={editedProfile?.preferredName || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev!, preferredName: e.target.value }))}
                  placeholder="What would you like to be called?"
                  className="text-lg"
                />
              </div>

              {/* Affirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Personal Affirmation
                </label>
                <textarea
                  value={editedProfile?.customAffirmation || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev!, customAffirmation: e.target.value }))}
                  placeholder="Write something comforting..."
                  className="w-full p-3 border border-gray-200 rounded-lg text-lg min-h-[100px] focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This message will be shown to help you feel calm and safe.
                </p>
              </div>

              {/* Former Occupation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Former Occupation (Optional)
                </label>
                <Input
                  value={editedProfile?.formerOccupation || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev!, formerOccupation: e.target.value }))}
                  placeholder="What did you do for work?"
                />
              </div>

              {/* Life Story */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  A Little About You
                </label>
                <textarea
                  value={editedProfile?.lifeStory || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev!, lifeStory: e.target.value }))}
                  placeholder="Share a bit about your life..."
                  className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px] focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>

              {/* Favorite Things */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Favorite Things
                </label>
                <Input
                  value={editedProfile?.favoriteThings?.join(', ') || ''}
                  onChange={(e) => setEditedProfile(prev => ({ 
                    ...prev!, 
                    favoriteThings: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                  placeholder="Gardening, Reading, Music, Tea... (separate with commas)"
                />
              </div>

              {/* Save Button */}
              <Button 
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Your Personal Identity Card</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
            Who I Am
          </h1>
          <p className="text-xl text-gray-600">
            This is who you are. You are safe. You are loved.
          </p>
        </motion.div>

        {/* Main Identity Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-2 border-amber-300 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-8 text-center">
              {/* Photo */}
              <div className="w-40 h-40 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 bg-white">
                {identity?.photoUrl ? (
                  <img 
                    src={identity.photoUrl} 
                    alt={identity.preferredName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                    <User className="w-20 h-20 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {identity?.preferredName || user?.name || 'My Name'}
              </h2>
              <p className="text-white/80 text-lg">
                {user?.name}
              </p>
            </div>

            {/* Affirmation */}
            <div className="p-8 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-rose-500" />
                <span className="text-lg font-medium text-gray-700">Your Daily Reminder</span>
              </div>
              <p className="text-2xl sm:text-3xl text-center font-medium text-gray-800 leading-relaxed">
                "{affirmation}"
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Details Grid */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Former Occupation */}
          {identity?.formerOccupation && (
            <Card className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  Former Occupation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{identity.formerOccupation}</p>
              </CardContent>
            </Card>
          )}

          {/* Life Story */}
          {identity?.lifeStory && (
            <Card className="border-amber-200 sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  A Little About You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{identity.lifeStory}</p>
              </CardContent>
            </Card>
          )}

          {/* Favorite Things */}
          {identity?.favoriteThings && identity.favoriteThings.length > 0 && (
            <Card className="border-amber-200 sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Things You Love
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {identity.favoriteThings.map((thing, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium"
                    >
                      {thing}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Edit Button */}
        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="lg"
            className="border-amber-300 hover:bg-amber-50"
          >
            <Edit2 className="w-5 h-5 mr-2" />
            Edit My Information
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              Go Back
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
