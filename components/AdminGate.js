'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import NavBar from '@/components/NavBar';

export default function AdminGate({ children }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [loading, session, router]);

  if (loading || !session) {
    return <div className="text-center text-[#8996b3] text-sm py-16">Carregando…</div>;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
