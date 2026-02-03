'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type JobType = 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';

export default function NewJobPage() {
  const router = useRouter();
  const { session } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<JobType>('INTERNSHIP');

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient('/jobs', {
        method: 'POST',
        token: session?.access_token,
        body: { title, description, location: location || undefined, type },
      }),
    onSuccess: () => {
      router.push('/company/jobs');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        {createMutation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {(createMutation.error as Error).message}
          </div>
        )}

        <Input
          id="title"
          label="Job Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Software Engineering Intern"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as JobType)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INTERNSHIP">Internship</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
          </select>
        </div>

        <Input
          id="location"
          label="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. New York, NY or Remote"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the role, responsibilities, requirements, etc."
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" loading={createMutation.isPending}>
            Post Job
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
