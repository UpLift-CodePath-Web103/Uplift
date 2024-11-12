import Link from 'next/link';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen p-6">
      <aside className="w-64 pr-8">
        <h1 className="text-2xl font-bold mb-4">This is the Main Dashboard</h1>
        <Link href="/journal/new">
          <h3 className="mb-2 text-blue-600 hover:underline">Create Journal Entry</h3>
        </Link>
        <h3 className="mb-4">Share Mood</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/journal" className="text-blue-600 hover:underline">Dashboard</Link>
          </li>
          <li>Breathing Exercises</li>
          <li>Motivation</li>
          <li>History</li>
          <li>
            <Link href="/" className="text-blue-600 hover:underline">Logout</Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
