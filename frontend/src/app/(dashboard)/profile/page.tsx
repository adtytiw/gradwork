'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProfilePage() {
  const { session, profile, refreshProfile } = useAuth();

  // Student fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile?.studentProfile) {
      setFirstName(profile.studentProfile.firstName);
      setLastName(profile.studentProfile.lastName);
    }
    if (profile?.companyProfile) {
      setCompanyName(profile.companyProfile.companyName);
      setDescription(profile.companyProfile.description || '');
    }
  }, [profile]);

  const updateStudentMutation = useMutation({
    mutationFn: () =>
      apiClient('/users/profile/student', {
        method: 'PATCH',
        token: session?.access_token,
        body: { firstName, lastName },
      }),
    onSuccess: () => {
      setSuccess(true);
      refreshProfile();
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: () =>
      apiClient('/users/profile/company', {
        method: 'PATCH',
        token: session?.access_token,
        body: { companyName, description: description || undefined },
      }),
    onSuccess: () => {
      setSuccess(true);
      refreshProfile();
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile?.role === 'STUDENT') {
      updateStudentMutation.mutate();
    } else {
      updateCompanyMutation.mutate();
    }
  };

  const isStudent = profile?.role === 'STUDENT';
  const isLoading = updateStudentMutation.isPending || updateCompanyMutation.isPending;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Profile updated successfully!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-600">{profile?.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <p className="text-gray-600">{profile?.role}</p>
        </div>

        {isStudent ? (
          <>
            <Input
              id="firstName"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              id="lastName"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <Input
              id="companyName"
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell candidates about your company..."
              />
            </div>
          </>
        )}

        <Button type="submit" loading={isLoading}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
