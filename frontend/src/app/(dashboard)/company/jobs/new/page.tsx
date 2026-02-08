'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { LoadingButton } from '@/components/ui/loading-button';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {createMutation.isError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {(createMutation.error as Error).message}
              </div>
            )}

            <FormInput
              id="title"
              label="Job Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineering Intern"
            />

            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as JobType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormInput
              id="location"
              label="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY or Remote"
            />

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe the role, responsibilities, requirements, etc."
              />
            </div>

            <div className="flex gap-4">
              <LoadingButton type="submit" loading={createMutation.isPending}>
                Post Job
              </LoadingButton>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
