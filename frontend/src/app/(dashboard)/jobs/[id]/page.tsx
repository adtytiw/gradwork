'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { LoadingButton } from '@/components/ui/loading-button';
import { Button } from '@/components/ui/button';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const isStudent = profile?.role === 'STUDENT';

  return (
    <div className="max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        ← Back to jobs
      </Button>

      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">{job.company.companyName}</p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {jobTypeLabels[job.type]}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          {job.location && <span>📍 {job.location}</span>}
          <span>👥 {job._count.applications} applicants</span>
          <span>🕒 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        {isStudent && (
          <div className="mb-6">
            {applied ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg dark:bg-green-950 dark:border-green-800 dark:text-green-400">
                ✅ Application submitted successfully!
              </div>
            ) : (
              <LoadingButton
                onClick={() => applyMutation.mutate()}
                loading={applyMutation.isPending}
                size="lg"
              >
                Apply Now
              </LoadingButton>
            )}
            {applyMutation.isError && (
              <p className="text-destructive text-sm mt-2">
                {(applyMutation.error as Error).message}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Job Description</h2>
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-muted-foreground">{job.description}</p>
          </div>
        </div>

        {job.company.description && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-3">About {job.company.companyName}</h2>
            <p className="text-muted-foreground">{job.company.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
