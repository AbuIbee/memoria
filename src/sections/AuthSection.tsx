import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Eye, EyeOff, Mail, Lock, User, Phone, 
  ArrowRight, CheckCircle2, UserCircle, Heart, Stethoscope,
  ArrowLeft, KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useSupabaseAuth';
import type { UserRole } from '@/types';

interface AuthSectionProps {
  onAuthSuccess: () => void;
}

export default function AuthSection({ onAuthSuccess }: AuthSectionProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const { login, signup, resetPassword, error, clearError, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    
    if (isLogin) {
      await login(email, password);
      if (!error) {
        toast.success('Welcome back!');
        onAuthSuccess();
      }
    } else {
      if (!name.trim()) {
        toast.error('Please enter your name');
        setIsSubmitting(false);
        return;
      }
      await signup(name, email, password, selectedRole, phone);
      if (!error) {
        toast.success('Account created successfully!');
        onAuthSuccess();
      }
    }
    setIsSubmitting(false);
  };

  const fillDemoCredentials = (role: 'patient' | 'caregiver') => {
    if (role === 'patient') {
      setEmail('margaret@example.com');
    } else {
      setEmail('sarah@example.com');
    }
    setPassword('password');
    toast.info(`Demo ${role} credentials filled. Click Login to continue.`);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    await resetPassword(email);
    setResetEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col justify-center"
        >
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="gradient-text">Memoria</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your compassionate companion for dementia care
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-gray-700">Track medications and daily routines</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-700">AI-powered brain exercises & activities</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-700">Preserve precious memories</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
              </div>
              <p className="text-gray-700">Stay connected with caregivers</p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-white/50 rounded-xl">
            <p className="text-sm text-gray-500 mb-2">Demo Accounts:</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemoCredentials('patient')}
                className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200 transition-colors"
              >
                Patient Demo
              </button>
              <button
                onClick={() => fillDemoCredentials('caregiver')}
                className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm hover:bg-teal-200 transition-colors"
              >
                Caregiver Demo
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Password: "password"</p>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              {/* Forgot Password Form */}
              {showForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {!resetEmailSent ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                          <KeyRound className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Reset Your Password
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full btn-primary h-12"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          'Send Reset Link'
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmailSent(false);
                          clearError();
                        }}
                        className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 py-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Check Your Email
                      </h3>
                      <p className="text-gray-500 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>. 
                        Please check your inbox and follow the instructions.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmailSent(false);
                          setIsLogin(true);
                        }}
                        className="text-amber-600 font-semibold hover:text-amber-700"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
                    </h2>
                    <p className="text-gray-500">
                      {isLogin 
                        ? 'Welcome back! Please enter your details.' 
                        : 'Join our community of care.'}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection (Signup only) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label>I am a:</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRole('patient')}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                              selectedRole === 'patient'
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <UserCircle className={`w-6 h-6 ${selectedRole === 'patient' ? 'text-amber-500' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${selectedRole === 'patient' ? 'text-amber-700' : 'text-gray-600'}`}>
                              Patient
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedRole('caregiver')}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                              selectedRole === 'caregiver'
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Heart className={`w-6 h-6 ${selectedRole === 'caregiver' ? 'text-teal-500' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${selectedRole === 'caregiver' ? 'text-teal-700' : 'text-gray-600'}`}>
                              Caregiver
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedRole('healthcare_provider')}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                              selectedRole === 'healthcare_provider'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Stethoscope className={`w-6 h-6 ${selectedRole === 'healthcare_provider' ? 'text-blue-500' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${selectedRole === 'healthcare_provider' ? 'text-blue-700' : 'text-gray-600'}`}>
                              Provider
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Name (Signup only) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone (Signup only) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    )}

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        {isLogin && (
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-amber-600 hover:text-amber-700"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full btn-primary h-12"
                      disabled={isLoading || isSubmitting}
                    >
                      {isLoading || isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Please wait...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {isLogin ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Toggle Login/Signup */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          clearError();
                        }}
                        className="ml-2 text-amber-600 font-semibold hover:text-amber-700"
                      >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
