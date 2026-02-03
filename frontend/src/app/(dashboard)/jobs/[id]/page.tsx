'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

type Job = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  type: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';
  isActive: boolean;
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    logoUrl: string | null;
    description: string | null;
  };
  _count: {
    applications: number;
  };
};

const jobTypeLabels = {
  INTERNSHIP: 'Internship',
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { session, profile } = useAuth();
  const queryClient = useQueryClient();
  const [applied, setApplied] = useState(false);

  const jobId = params.id as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiClient<Job>(`/jobs/${jobId}`),
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      apiClient('/applications', {
        method: 'POST',
        token: session?.access_token,
        body: { jobId },
      }),
    onSuccess: () => {
      setApplied(true);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  const isStudent = profile?.role === 'STUDENT';

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.back()}
        className="text-gray-500 hover:text-gray-700 mb-4"
      >
        ← Back to jobs
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company.companyName}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {jobTypeLabels[job.type]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          {job.location && <span>📍 {job.location}</span>}
          <span>👥 {job._count.applications} applicants</span>
          <span>🕒 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        {isStudent && (
          <div className="mb-6">
            {applied ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✅ Application submitted successfully!
              </div>
            ) : (
              <Button
                onClick={() => applyMutation.mutate()}
                loading={applyMutation.isPending}
                size="lg"
              >
                Apply Now
              </Button>
            )}
            {applyMutation.isError && (
              <p className="text-red-600 text-sm mt-2">
                {(applyMutation.error as Error).message}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Job Description</h2>
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-wrap text-gray-600">{job.description}</p>
          </div>
        </div>

        {job.company.description && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-3">About {job.company.companyName}</h2>
            <p className="text-gray-600">{job.company.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
