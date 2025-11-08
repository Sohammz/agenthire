'use client';
import Link from 'next/link';

export default function AccountSidebar({ current = 'overview' }: { current?: string }) {
  const items = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/interview', label: 'Mock Interview' },
    { href: '/dashboard/profile', label: 'My Profile' },
    { href: '/dashboard/subscriptions', label: 'Subscriptions' },
    { href: '/dashboard/settings', label: 'Settings' },
  ];

  return (
    <aside className="w-full md:w-64 border rounded p-4">
      <nav className="flex flex-col gap-2">
        {items.map(it => (
          <Link key={it.href} href={it.href} className={`px-3 py-2 rounded ${current === it.href ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-850'}`}>
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
