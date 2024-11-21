import React from 'react';
import { NavBar } from '@/components/NavBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen p-6'>
      <NavBar />
      <main className='flex-1 bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto'>
        {children}
      </main>
    </div>
  );
};

export default Layout;
