import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Phone, 
  Heart, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface FamiliarFacesPanelProps {
  compact?: boolean;
}

export default function FamiliarFacesPanel({ compact = false }: FamiliarFacesPanelProps) {
  const { patientProfile, updatePatientProfile } = useAuth();
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFace, setNewFace] = useState({
    name: '',
    relationship: '',
    description: '',
    contactInfo: '',
    visitFrequency: '',
  });

  const familiarFaces = patientProfile?.familiarFaces || [];

  const handlePrev = () => {
    setSelectedFaceIndex((prev) => (prev === 0 ? familiarFaces.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedFaceIndex((prev) => (prev === familiarFaces.length - 1 ? 0 : prev + 1));
  };

  const handleAddFace = () => {
    if (!newFace.name || !newFace.relationship) {
      toast.error('Please enter a name and relationship');
      return;
    }

    const face = {
      id: `face_${Date.now()}`,
      name: newFace.name,
      relationship: newFace.relationship,
      description: newFace.description,
      contactInfo: newFace.contactInfo,
      visitFrequency: newFace.visitFrequency,
      isPrimaryContact: false,
    };

    if (patientProfile) {
      updatePatientProfile({
        ...patientProfile,
        familiarFaces: [...familiarFaces, face],
      });
    }

    setNewFace({ name: '', relationship: '', description: '', contactInfo: '', visitFrequency: '' });
    setShowAddDialog(false);
    toast.success(`${face.name} added to your familiar faces!`);
  };

  const handleRemoveFace = (id: string) => {
    if (patientProfile) {
      updatePatientProfile({
        ...patientProfile,
        familiarFaces: familiarFaces.filter(f => f.id !== id),
      });
      toast.success('Face removed');
    }
  };

  if (compact) {
    return (
      <Card className="border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-amber-500" />
            People Who Love You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {familiarFaces.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No familiar faces added yet</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {familiarFaces.slice(0, 4).map((face, index) => (
                <motion.div
                  key={face.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 text-center"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300 mb-2 mx-auto">
                    {face.photoUrl ? (
                      <img 
                        src={face.photoUrl} 
                        alt={face.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-amber-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{face.name}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{face.relationship}</p>
                </motion.div>
              ))}
              {familiarFaces.length > 4 && (
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 font-medium">+{familiarFaces.length - 4}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="w-6 h-6 text-amber-500" />
          People Who Love You
        </CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-amber-300 hover:bg-amber-50">
              <Plus className="w-4 h-4 mr-1" />
              Add Person
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a Familiar Face</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={newFace.name}
                  onChange={(e) => setNewFace({ ...newFace, name: e.target.value })}
                  placeholder="Enter their name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <Input
                  value={newFace.relationship}
                  onChange={(e) => setNewFace({ ...newFace, relationship: e.target.value })}
                  placeholder="e.g., Daughter, Son, Friend"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  value={newFace.description}
                  onChange={(e) => setNewFace({ ...newFace, description: e.target.value })}
                  placeholder="Something to help remember them"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                <Input
                  value={newFace.contactInfo}
                  onChange={(e) => setNewFace({ ...newFace, contactInfo: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Frequency</label>
                <Input
                  value={newFace.visitFrequency}
                  onChange={(e) => setNewFace({ ...newFace, visitFrequency: e.target.value })}
                  placeholder="e.g., Every weekend, Monthly"
                />
              </div>
              <Button 
                onClick={handleAddFace}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              >
                Add Person
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {familiarFaces.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No familiar faces added yet</p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              variant="outline"
              className="border-amber-300 hover:bg-amber-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Person
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows */}
            {familiarFaces.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}

            {/* Face Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFaceIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6 px-8"
              >
                {/* Photo */}
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-300 mb-4 shadow-lg">
                  {familiarFaces[selectedFaceIndex]?.photoUrl ? (
                    <img 
                      src={familiarFaces[selectedFaceIndex].photoUrl} 
                      alt={familiarFaces[selectedFaceIndex].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {familiarFaces[selectedFaceIndex]?.name}
                </h3>

                {/* Relationship Badge */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-4 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium">
                    {familiarFaces[selectedFaceIndex]?.relationship}
                  </span>
                  {familiarFaces[selectedFaceIndex]?.isPrimaryContact && (
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Primary Contact
                    </span>
                  )}
                </div>

                {/* Description */}
                {familiarFaces[selectedFaceIndex]?.description && (
                  <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                    {familiarFaces[selectedFaceIndex].description}
                  </p>
                )}

                {/* Details */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {familiarFaces[selectedFaceIndex]?.contactInfo && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-4 h-4 text-green-500" />
                      {familiarFaces[selectedFaceIndex].contactInfo}
                    </div>
                  )}
                  {familiarFaces[selectedFaceIndex]?.visitFrequency && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Visits: {familiarFaces[selectedFaceIndex].visitFrequency}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFace(familiarFaces[selectedFaceIndex].id)}
                  className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            {familiarFaces.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {familiarFaces.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFaceIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedFaceIndex 
                        ? 'w-6 bg-amber-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
