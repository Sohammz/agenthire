'use client';
import Link from 'next/link';
import AuthButton from './AuthButton';
export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">AgentHire</Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
