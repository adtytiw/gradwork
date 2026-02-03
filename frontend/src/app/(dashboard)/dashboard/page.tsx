'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { profile } = useAuth();

  if (!profile) return null;

  const isStudent = profile.role === 'STUDENT';
  const isCompany = profile.role === 'COMPANY';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {isStudent ? profile.studentProfile?.firstName : profile.companyProfile?.companyName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isStudent && (
          <>
            <DashboardCard
              title="Browse Jobs"
              description="Find internships and entry-level positions"
              href="/jobs"
              icon="💼"
            />
            <DashboardCard
              title="My Applications"
              description="Track your job applications"
              href="/applications"
              icon="📋"
            />
            <DashboardCard
              title="My Profile"
              description="Update your resume and details"
              href="/profile"
              icon="👤"
            />
          </>
        )}

        {isCompany && (
          <>
            <DashboardCard
              title="Post a Job"
              description="Create a new job listing"
              href="/company/jobs/new"
              icon="➕"
            />
            <DashboardCard
              title="My Jobs"
              description="Manage your job postings"
              href="/company/jobs"
              icon="💼"
            />
            <DashboardCard
              title="Applications"
              description="Review candidate applications"
              href="/company/applications"
              icon="📋"
            />
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}
