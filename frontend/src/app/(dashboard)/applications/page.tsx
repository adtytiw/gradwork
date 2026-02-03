'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type Application = {
  id: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  job: {
    id: string;
    title: string;
    company: {
      companyName: string;
      logoUrl: string | null;
    };
  };
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWING: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const statusLabels = {
  PENDING: 'Pending',
  REVIEWING: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export default function MyApplicationsPage() {
  const { session } = useAuth();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () =>
      apiClient<Application[]>('/applications/my', {
        token: session?.access_token,
      }),
    enabled: !!session,
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
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {!applications?.length ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-4">You haven&apos;t applied to any jobs yet.</p>
          <Link href="/jobs" className="text-blue-600 hover:underline">
            Browse available jobs →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/jobs/${app.job.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {app.job.title}
                  </Link>
                  <p className="text-gray-600 mt-1">{app.job.company.companyName}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[app.status]
                  }`}
                >
                  {statusLabels[app.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
