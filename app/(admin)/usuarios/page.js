'use client';

import { useRealtimeTable } from '@/lib/useRealtimeTable';
import RouteGuard from '@/components/RouteGuard';
import UsuariosManager from '@/components/UsuariosManager';

export default function UsuariosPage() {
  return (
    <RouteGuard papeis={['administrador']}>
      <UsuariosConteudo />
    </RouteGuard>
  );
}

function UsuariosConteudo() {
  const { data: perfis, loading: loadingPerfis, erro: erroPerfis, reload } = useRealtimeTable('perfis', {
    orderBy: 'nome',
    ascending: true,
  });
  const { data: funcionarios, loading: loadingFuncionarios, erro: erroFuncionarios } = useRealtimeTable('funcionarios', {
    orderBy: 'nome',
    ascending: true,
  });

  const loading = loadingPerfis || loadingFuncionarios;
  const erro = erroPerfis || erroFuncionarios;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">👤 Usuários</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Contas de acesso ao sistema (dono e funcionários)</p>
      </div>

      {erro && (
        <div className="bg-[#241826] border border-[#f87171]/40 text-[#fca5a5] rounded-xl p-4 text-sm">
          Não foi possível carregar os dados: {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#8996b3] text-sm py-10">Carregando…</div>
      ) : (
        <UsuariosManager perfis={perfis} funcionarios={funcionarios} onCriado={reload} />
      )}
    </main>
  );
}
