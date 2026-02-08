'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type Role = 'STUDENT' | 'COMPANY';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { session, user, refreshProfile, profile } = useAuth();
  const [role, setRole] = useState<Role>('STUDENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill from Supabase user metadata if available
  useEffect(() => {
    if (user?.user_metadata) {
      const meta = user.user_metadata;
      if (meta.role) setRole(meta.role as Role);
      if (meta.first_name) setFirstName(meta.first_name);
      if (meta.last_name) setLastName(meta.last_name);
      if (meta.company_name) setCompanyName(meta.company_name);
    }
  }, [user]);

  // Redirect if profile already exists
  useEffect(() => {
    if (profile) {
      router.push('/dashboard');
    }
  }, [profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) {
      setError('No active session. Please sign in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiClient('/auth/register', {
        method: 'POST',
        token: session.access_token,
        body: {
          email: session.user.email,
          role,
          ...(role === 'STUDENT' && { firstName, lastName }),
          ...(role === 'COMPANY' && { companyName }),
        },
      });

      await refreshProfile();
      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      
      // If unauthorized, suggest re-login
      if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        setError('Session expired. Please sign out and sign in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-zinc-400">
              Just a few more details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  Saving...
                </span>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
