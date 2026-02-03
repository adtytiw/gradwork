'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

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

const jobTypeColors = {
  INTERNSHIP: 'bg-purple-100 text-purple-700',
  FULL_TIME: 'bg-green-100 text-green-700',
  PART_TIME: 'bg-yellow-100 text-yellow-700',
};

export default function JobsPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => apiClient<Job[]>('/jobs'),
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
        <h1 className="text-2xl font-bold">Browse Jobs</h1>
        <p className="text-gray-500">{jobs?.length || 0} jobs available</p>
      </div>

      {!jobs?.length ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{job.company.companyName}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    jobTypeColors[job.type]
                  }`}
                >
                  {jobTypeLabels[job.type]}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                {job.location && (
                  <span className="flex items-center gap-1">
                    📍 {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  👥 {job._count.applications} applicants
                </span>
                <span className="flex items-center gap-1">
                  🕒 {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
