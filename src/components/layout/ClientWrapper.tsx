'use client';

import { useEffect } from 'react';
import { initializeSampleData } from '@/lib/sample-data';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export const ClientWrapper = ({ children }: ClientWrapperProps) => {
  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};