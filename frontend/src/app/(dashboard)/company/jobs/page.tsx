'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

type Job = {
  id: string;
  title: string;
  location: string | null;
  type: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';
  isActive: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
};

export default function CompanyJobsPage() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['company-jobs'],
    queryFn: () =>
      apiClient<Job[]>('/jobs/company/my-jobs', {
        token: session?.access_token,
      }),
    enabled: !!session,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient(`/jobs/${id}`, {
        method: 'PATCH',
        token: session?.access_token,
        body: { isActive: !isActive },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Job Postings</h1>
        <Link href="/company/jobs/new">
          <Button>+ Post New Job</Button>
        </Link>
      </div>

      {!jobs?.length ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-4">You haven&apos;t posted any jobs yet.</p>
          <Link href="/company/jobs/new">
            <Button>Post Your First Job</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Job Title
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Applications
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{job.title}</div>
                    {job.location && (
                      <div className="text-sm text-gray-500">📍 {job.location}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{job.type}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/company/applications?jobId=${job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {job._count.applications} applicants
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        toggleMutation.mutate({ id: job.id, isActive: job.isActive })
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {job.isActive ? 'Close' : 'Reopen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
