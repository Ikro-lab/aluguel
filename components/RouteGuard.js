'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';

export default function RouteGuard({ papeis, children }) {
  const { perfil, loading } = useAuth();
  const router = useRouter();

  const negado = !loading && perfil && papeis && !papeis.includes(perfil.papel);
  const destinoSeguro = perfil?.papel === 'mecanico' ? '/manutencao' : '/';

  useEffect(() => {
    if (negado) router.replace(destinoSeguro);
  }, [negado, destinoSeguro, router]);

  if (loading) {
    return <div className="text-center text-[#8996b3] text-sm py-10">Carregando…</div>;
  }
  if (negado) {
    return <div className="text-center text-[#8996b3] text-sm py-10">Você não tem acesso a esta página.</div>;
  }

  return children;
}
