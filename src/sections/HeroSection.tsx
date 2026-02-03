import { motion } from 'framer-motion';
import { 
  Heart, Brain, Shield, Sparkles, Clock, Pill,
  ChevronRight, Star, Users, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AppView } from '@/App';

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

const features = [
  {
    icon: Pill,
    title: 'Medication Reminders',
    description: 'Never miss a dose with gentle reminders',
    color: 'from-green-400 to-green-600',
    view: 'medications' as AppView,
  },
  {
    icon: Clock,
    title: 'Daily Routines',
    description: 'Structured day with familiar activities',
    color: 'from-orange-400 to-orange-600',
    view: 'routines' as AppView,
  },
  {
    icon: Brain,
    title: 'Memory Support',
    description: 'Cherished memories and photos',
    color: 'from-purple-400 to-purple-600',
    view: 'memories' as AppView,
  },
  {
    icon: Sparkles,
    title: 'Brain Activities',
    description: 'Fun exercises to stay sharp',
    color: 'from-pink-400 to-pink-600',
    view: 'activities' as AppView,
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Emergency support when needed',
    color: 'from-red-400 to-red-600',
    view: 'safety' as AppView,
  },
  {
    icon: Heart,
    title: 'Caregiver Support',
    description: 'Resources for family caregivers',
    color: 'from-teal-400 to-teal-600',
    view: 'caregiver' as AppView,
  },
];

const testimonials = [
  {
    text: "Memoria has given my mother more independence. She feels confident managing her day.",
    author: "Sarah J.",
    role: "Caregiver",
  },
  {
    text: "The memory feature helps me remember special moments with my family.",
    author: "Margaret T.",
    role: "Patient",
  },
  {
    text: "As a therapist, I recommend Memoria to all my dementia patients and their families.",
    author: "Dr. Robert Chen",
    role: "Neurologist",
  },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4" />
              <span>Supporting Independence & Dignity</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Your Companion for{' '}
              <span className="gradient-text">Living Well</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700">
                with Dementia
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              Memoria helps maintain quality of life, independence, and dignity 
              through personalized support for patients, caregivers, and healthcare providers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                onClick={() => onNavigate('dashboard')}
                size="lg"
                className="btn-primary text-lg h-14 px-8"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Day
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onNavigate('resources')}
                variant="outline"
                size="lg"
                className="btn-secondary text-lg h-14 px-8"
              >
                <Users className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { value: '10K+', label: 'Families Supported' },
                { value: '95%', label: 'Medication Adherence' },
                { value: '4.8', label: 'User Rating', icon: Star },
                { value: '24/7', label: 'Emergency Support' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                    {stat.icon && <stat.icon className="w-5 h-5 text-amber-500 fill-amber-500" />}
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed with doctors and therapists to support 
              every aspect of dementia care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full cursor-pointer hover-lift border-0 shadow-lg"
                  onClick={() => onNavigate(feature.view)}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-amber-600 font-medium">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Memoria Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed in collaboration with healthcare professionals to provide 
              comprehensive dementia care support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Personalized Setup',
                description: 'Create a profile with preferences, medications, and routines tailored to the individual.',
                icon: Users,
              },
              {
                step: '2',
                title: 'Daily Support',
                description: 'Receive gentle reminders, engage in activities, and track wellness throughout the day.',
                icon: Clock,
              },
              {
                step: '3',
                title: 'Stay Connected',
                description: 'Caregivers receive updates and can coordinate care with healthcare providers.',
                icon: Heart,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <div className="pt-4">
                    <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                      <item.icon className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Families
            </h2>
            <p className="text-lg text-gray-600">
              Hear from those who use Memoria every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of families who are living better with dementia. 
              Every journey starts with a single step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate('dashboard')}
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 text-lg h-14 px-8 font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Begin Your Journey
              </Button>
              <Button
                onClick={() => onNavigate('safety')}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 text-lg h-14 px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency Help
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Memoria</span>
              </div>
              <p className="text-gray-400">
                Supporting independence and dignity for those living with dementia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('medications')} className="hover:text-white">Medications</button></li>
                <li><button onClick={() => onNavigate('routines')} className="hover:text-white">Routines</button></li>
                <li><button onClick={() => onNavigate('memories')} className="hover:text-white">Memories</button></li>
                <li><button onClick={() => onNavigate('activities')} className="hover:text-white">Activities</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Caregivers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white">Dashboard</button></li>
                <li><button onClick={() => onNavigate('caregiver')} className="hover:text-white">Support</button></li>
                <li><button onClick={() => onNavigate('resources')} className="hover:text-white">Resources</button></li>
                <li><button onClick={() => onNavigate('safety')} className="hover:text-white">Safety</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('safety')} className="hover:text-white">Emergency</button></li>
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Memoria. Designed with care for those living with dementia and their families.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
