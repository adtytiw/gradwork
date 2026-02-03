'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const studentNav = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Browse Jobs', href: '/jobs', icon: '💼' },
  { name: 'My Applications', href: '/applications', icon: '📋' },
  { name: 'Profile', href: '/profile', icon: '👤' },
];

const companyNav = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'My Jobs', href: '/company/jobs', icon: '💼' },
  { name: 'Applications', href: '/company/applications', icon: '📋' },
  { name: 'Profile', href: '/profile', icon: '🏢' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const navItems = profile?.role === 'COMPANY' ? companyNav : studentNav;

  return (
    <div className="flex flex-col h-full w-64 bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <Link href="/dashboard" className="text-xl font-bold">
          gradWork
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-3 text-sm text-gray-400">
          {profile?.email}
          <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded text-xs">
            {profile?.role}
          </span>
        </div>
        <button
          onClick={signOut}
          className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
