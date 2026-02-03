'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Verifying your email...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL hash (Supabase redirects with tokens in hash)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          setStatus('Creating your profile...');
          
          // Get user metadata
          const metadata = session.user.user_metadata;
          const role = metadata?.role || 'STUDENT';

          // Create profile in backend
          try {
            await apiClient('/auth/register', {
              method: 'POST',
              token: session.access_token,
              body: {
                email: session.user.email,
                role,
                ...(role === 'STUDENT' && {
                  firstName: metadata?.first_name || 'Student',
                  lastName: metadata?.last_name || 'User',
                }),
                ...(role === 'COMPANY' && {
                  companyName: metadata?.company_name || 'Company',
                }),
              },
            });
          } catch {
            // Profile might already exist, that's okay
          }

          setStatus('Redirecting to dashboard...');
          router.push('/dashboard');
        } else {
          // Check for error in URL
          const errorDescription = searchParams.get('error_description');
          if (errorDescription) {
            setError(errorDescription);
          } else {
            setError('Unable to verify email. Please try again.');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20" />
      
      <div className="relative z-10 text-center">
        {error ? (
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 max-w-md">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-zinc-400 mb-6">{error}</p>
            <a
              href="/register"
              className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-medium"
            >
              Try Again
            </a>
          </div>
        ) : (
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">{status}</h1>
            <p className="text-zinc-400">Please wait while we set up your account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
