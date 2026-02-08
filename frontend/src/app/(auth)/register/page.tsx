'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type Role = 'STUDENT' | 'COMPANY';
type Step = 'form' | 'verify';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [role, setRole] = useState<Role>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role,
            ...(role === 'STUDENT' && { first_name: firstName, last_name: lastName }),
            ...(role === 'COMPANY' && { company_name: companyName }),
          },
        },
      });

      if (authError) throw authError;

      // Check if session exists (email confirmation disabled in Supabase)
      if (authData.session) {
        // Create profile in backend immediately
        await apiClient('/auth/register', {
          method: 'POST',
          token: authData.session.access_token,
          body: {
            email,
            role,
            ...(role === 'STUDENT' && { firstName, lastName }),
            ...(role === 'COMPANY' && { companyName }),
          },
        });
        router.push('/dashboard');
      } else {
        // Email confirmation required - show verification step
        setStep('verify');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-zinc-400">
                We sent a verification link to
              </p>
              <p className="text-white font-medium mt-1">{email}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-zinc-500 text-center">
                Click the link in your email to verify your account. If you don&apos;t see it, check your spam folder.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={resendEmail}
                disabled={loading}
                variant="outline"
                className="w-full py-3 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </Button>

              <Button
                onClick={() => setStep('form')}
                variant="ghost"
                className="w-full py-3 text-zinc-500 hover:text-zinc-300"
              >
                ← Back to registration
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-500/30 to-transparent blur-3xl opacity-50" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">g</span>
          </div>
          <span className="text-2xl font-bold text-white">gradWork</span>
        </Link>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-zinc-400">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <Label className="block text-sm font-medium text-zinc-300 mb-3">
                I am a
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`p-4 border rounded-xl text-center transition-all duration-200 ${
                    role === 'STUDENT'
                      ? 'border-violet-500 bg-violet-500/10 text-white ring-1 ring-violet-500/50'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <div className="text-2xl mb-1">🎓</div>
                  <div className="font-medium">Student</div>
                  <div className="text-xs opacity-70">Looking for jobs</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('COMPANY')}
                  className={`p-4 border rounded-xl text-center transition-all duration-200 ${
                    role === 'COMPANY'
                      ? 'border-cyan-500 bg-cyan-500/10 text-white ring-1 ring-cyan-500/50'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="font-medium">Company</div>
                  <div className="text-xs opacity-70">Hiring talent</div>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                />
              </div>

              {role === 'STUDENT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-zinc-300">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-zinc-300">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                    />
                  </div>
                </div>
              )}

              {role === 'COMPANY' && (
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-zinc-300">
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-zinc-400 hover:text-white">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-zinc-400 hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
