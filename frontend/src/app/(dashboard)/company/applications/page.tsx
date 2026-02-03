'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type Application = {
  id: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
    resumeUrl: string | null;
    user: {
      email: string;
    };
  };
  job: {
    id: string;
    title: string;
  };
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWING: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function CompanyApplicationsPage() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['company-applications'],
    queryFn: () =>
      apiClient<Application[]>('/applications/received', {
        token: session?.access_token,
      }),
    enabled: !!session,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient(`/applications/${id}/status`, {
        method: 'PATCH',
        token: session?.access_token,
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
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
      <h1 className="text-2xl font-bold mb-6">Received Applications</h1>

      {!applications?.length ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No applications received yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Candidate
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Job
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Applied
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
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {app.student.firstName} {app.student.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.student.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {app.job.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          id: app.id,
                          status: e.target.value,
                        })
                      }
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWING">Reviewing</option>
                      <option value="ACCEPTED">Accept</option>
                      <option value="REJECTED">Reject</option>
                    </select>
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
