import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Heart, Phone, Globe, Calendar,
  ChevronRight, ExternalLink, MapPin, FileText,
  Video, MessageCircle, Star, Search, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockResources } from '@/data/mockData';

const resourceCategories = [
  { id: 'all', label: 'All Resources', icon: Filter },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'support_group', label: 'Support Groups', icon: Users },
  { id: 'respite_care', label: 'Respite Care', icon: Heart },
  { id: 'legal', label: 'Legal & Financial', icon: FileText },
  { id: 'self_care', label: 'Self-Care', icon: Star },
];

const featuredArticles = [
  {
    title: 'Understanding the Stages of Dementia',
    description: 'A comprehensive guide to understanding how dementia progresses and what to expect at each stage.',
    readTime: '8 min read',
    category: 'education',
  },
  {
    title: 'Communication Tips for Caregivers',
    description: 'Learn effective strategies for communicating with loved ones experiencing memory loss.',
    readTime: '5 min read',
    category: 'education',
  },
  {
    title: 'Creating a Dementia-Friendly Home',
    description: 'Practical modifications to make your home safer and more comfortable.',
    readTime: '6 min read',
    category: 'education',
  },
  {
    title: 'Managing Caregiver Stress',
    description: 'Techniques and resources for maintaining your own well-being while caring for others.',
    readTime: '4 min read',
    category: 'self_care',
  },
];

const supportGroups = [
  {
    name: 'Alzheimer\'s Association Caregiver Group',
    schedule: 'Every Tuesday, 2:00 PM',
    location: 'Virtual & In-Person',
    phone: '(800) 272-3900',
  },
  {
    name: 'Local Memory Cafe',
    schedule: 'First Saturday of each month',
    location: 'Community Center',
    phone: '(555) 123-4567',
  },
  {
    name: 'Online Caregiver Forum',
    schedule: '24/7 Online Community',
    location: 'Virtual',
    phone: null,
  },
];

const helplines = [
  {
    name: 'Alzheimer\'s Association Helpline',
    phone: '(800) 272-3900',
    hours: '24/7',
    description: 'Crisis support, information, and referrals',
  },
  {
    name: 'Caregiver Support Line',
    phone: '(855) 327-4717',
    hours: 'Mon-Fri, 8am-8pm',
    description: 'Emotional support and resource connections',
  },
  {
    name: 'Eldercare Locator',
    phone: '(800) 677-1116',
    hours: 'Mon-Fri, 9am-8pm',
    description: 'Find local services and resources',
  },
];

export default function ResourcesSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = mockResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredArticles = featuredArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resources & Support</h1>
              <p className="text-gray-600">Information, support, and community connections</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search resources, articles, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Emergency Helplines Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold mb-2">Need Immediate Help?</h2>
                  <p className="text-white/80">
                    The Alzheimer's Association Helpline is available 24/7 for crisis support, 
                    information, and referrals.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-red-600 hover:bg-gray-100 font-bold"
                  onClick={() => toast.success('Calling helpline...')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (800) 272-3900
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Featured Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredArticles.map((article, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toast.info(`Opening: ${article.title}`)}
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{article.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {article.readTime}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{article.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resources List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    Helpful Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredResources.map((resource) => (
                      <div 
                        key={resource.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                          {resource.category === 'education' && <BookOpen className="w-6 h-6 text-white" />}
                          {resource.category === 'support_group' && <Users className="w-6 h-6 text-white" />}
                          {resource.category === 'respite_care' && <Heart className="w-6 h-6 text-white" />}
                          {resource.category === 'legal' && <FileText className="w-6 h-6 text-white" />}
                          {resource.category === 'self_care' && <Star className="w-6 h-6 text-white" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                          <div className="flex items-center gap-2">
                            {resource.url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.info(`Opening: ${resource.title}`)}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Visit Website
                              </Button>
                            )}
                            {resource.phone && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.success(`Calling: ${resource.phone}`)}
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                {resource.phone}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Helplines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-500" />
                    Helplines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {helplines.map((helpline, index) => (
                    <div key={index} className="p-4 bg-red-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-1">{helpline.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{helpline.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {helpline.hours}
                        </Badge>
                        <Button 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => toast.success(`Calling: ${helpline.phone}`)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Groups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Support Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportGroups.map((group, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-1">{group.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {group.schedule}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {group.location}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => toast.info(`Joining: ${group.name}`)}
                      >
                        {group.phone ? 'Join Group' : 'Join Online'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Online Communities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Online Communities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'ALZConnected Forum', members: '50K+ members', icon: MessageCircle },
                    { name: 'Caregiver Support Network', members: '25K+ members', icon: Users },
                    { name: 'Dementia Caregivers United', members: '30K+ members', icon: Heart },
                  ].map((community, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      onClick={() => toast.info(`Opening: ${community.name}`)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <community.icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{community.name}</p>
                        <p className="text-sm text-gray-500">{community.members}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Educational Videos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-500" />
                    Educational Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Understanding Dementia', duration: '12 min' },
                    { title: 'Caregiver Self-Care', duration: '8 min' },
                    { title: 'Communication Strategies', duration: '15 min' },
                  ].map((video, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      onClick={() => toast.info(`Playing: ${video.title}`)}
                    >
                      <div className="w-16 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Video className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{video.title}</p>
                        <p className="text-xs text-gray-500">{video.duration}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
