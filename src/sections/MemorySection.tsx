import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Heart, Search, Filter, Calendar, Tag,
  X, Play, Music, Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockMemories } from '@/data/mockData';

const categoryColors: Record<string, string> = {
  family: 'bg-rose-100 text-rose-700',
  wedding: 'bg-pink-100 text-pink-700',
  vacation: 'bg-blue-100 text-blue-700',
  achievement: 'bg-amber-100 text-amber-700',
  hobby: 'bg-green-100 text-green-700',
  friends: 'bg-purple-100 text-purple-700',
  gardening: 'bg-emerald-100 text-emerald-700',
  beach: 'bg-cyan-100 text-cyan-700',
  birth: 'bg-red-100 text-red-700',
  grandchildren: 'bg-orange-100 text-orange-700',
  community: 'bg-teal-100 text-teal-700',
  happy: 'bg-yellow-100 text-yellow-700',
  roses: 'bg-rose-100 text-rose-700',
};

export default function MemorySection() {
  const [memories, setMemories] = useState(mockMemories);
  const [selectedMemory, setSelectedMemory] = useState<typeof mockMemories[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Get all unique tags
  const allTags = Array.from(new Set(memories.flatMap(m => m.tags)));

  // Filter memories
  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? memory.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories(prev => prev.map(m => 
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    ));
    const memory = memories.find(m => m.id === id);
    if (memory) {
      toast.success(memory.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Memories</h1>
              <p className="text-gray-600">Cherished moments and precious stories</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="h-12"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                onClick={() => setViewMode('timeline')}
                className="h-12"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tags Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedTag === tag
                    ? 'bg-purple-500 text-white'
                    : categoryColors[tag] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Memories Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
                    onClick={() => setSelectedMemory(memory)}
                  >
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100">
                      {/* Placeholder for memory image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-2" />
                          <p className="text-purple-400 text-sm">{memory.photos.length} photos</p>
                        </div>
                      </div>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(memory.id, e)}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart 
                          className={`w-5 h-5 ${memory.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} 
                        />
                      </button>

                      {/* Date Overlay */}
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {new Date(memory.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {memory.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {memory.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {memory.tags.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className={`text-xs capitalize ${categoryColors[tag] || 'bg-gray-100'}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {memory.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{memory.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredMemories
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setSelectedMemory(memory)}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Date Column */}
                        <div className="flex-shrink-0 text-center w-20">
                          <p className="text-2xl font-bold text-purple-600">
                            {new Date(memory.date).getDate()}
                          </p>
                          <p className="text-sm text-gray-500 uppercase">
                            {new Date(memory.date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(memory.date).getFullYear()}
                          </p>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {memory.title}
                              </h3>
                              <p className="text-gray-600 mb-3">
                                {memory.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {memory.tags.map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary"
                                    className={`text-xs capitalize ${categoryColors[tag] || 'bg-gray-100'}`}
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(memory.id, e)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Heart 
                                className={`w-5 h-5 ${memory.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} 
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredMemories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No memories found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Memory Detail Modal */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-purple-300" />
                  </div>
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                    {new Date(selectedMemory.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedMemory.title}
                    </h2>
                    <button
                      onClick={(e) => toggleFavorite(selectedMemory.id, e)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart 
                        className={`w-6 h-6 ${selectedMemory.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} 
                      />
                    </button>
                  </div>

                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {selectedMemory.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedMemory.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        className={`text-sm capitalize px-3 py-1 ${categoryColors[tag] || 'bg-gray-100'}`}
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Photo Gallery Placeholder */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Photos ({selectedMemory.photos.length})</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedMemory.photos.map((_, idx: number) => (
                        <div 
                          key={idx}
                          className="aspect-square rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center"
                        >
                          <ImageIcon className="w-8 h-8 text-purple-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audio Player Placeholder */}
                  {selectedMemory.audio && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                      <button className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors">
                        <Play className="w-5 h-5 text-white ml-1" />
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Audio Memory</p>
                        <p className="text-sm text-gray-500">Listen to the story</p>
                      </div>
                      <Music className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
