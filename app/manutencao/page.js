'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import OrdemServicoForm from '@/components/OrdemServicoForm';
import OrdensServicoList from '@/components/OrdensServicoList';

export default function ManutencaoPage() {
  const { data: ordensServico, loading: loadingOS, erro: erroOS, reload } = useRealtimeTable('ordens_servico', {
    orderBy: 'aberta_em',
    ascending: false,
  });
  const { data: bikes, loading: loadingBikes, erro: erroBikes } = useRealtimeTable('bikes', { orderBy: 'modelo', ascending: true });
  const { data: funcionarios, loading: loadingFuncionarios, erro: erroFuncionarios } = useRealtimeTable('funcionarios', {
    orderBy: 'nome',
    ascending: true,
  });
  const [toast, setToast] = useState('');

  const loading = loadingOS || loadingBikes || loadingFuncionarios;
  const erro = erroOS || erroBikes || erroFuncionarios;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  async function handleAdd(os) {
    const { error } = await supabase.from('ordens_servico').insert(os);
    if (error) {
      showToast('Erro ao abrir OS: ' + error.message);
      return;
    }
    await supabase.from('bikes').update({ status: 'manutencao' }).eq('id', os.bike_id);
    showToast('Ordem de serviço aberta');
    reload();
  }

  async function handleAvancar(id, novoStatus) {
    const patch = { status: novoStatus };
    if (novoStatus === 'concluida') patch.concluida_em = new Date().toISOString();

    const { data, error } = await supabase.from('ordens_servico').update(patch).eq('id', id).select().single();
    if (error) {
      showToast('Erro ao atualizar: ' + error.message);
      return;
    }
    if (novoStatus === 'concluida' && data?.bike_id) {
      await supabase.from('bikes').update({ status: 'disponivel' }).eq('id', data.bike_id);
    }
    showToast('Ordem de serviço atualizada');
    reload();
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('ordens_servico').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Ordem de serviço removida');
    reload();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">🔧 Manutenção</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Ordens de serviço e histórico por bike</p>
      </div>

      {erro && (
        <div className="bg-[#241826] border border-[#f87171]/40 text-[#fca5a5] rounded-xl p-4 text-sm">
          Não foi possível carregar os dados: {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#8996b3] text-sm py-10">Carregando…</div>
      ) : (
        <>
          <OrdemServicoForm bikes={bikes} funcionarios={funcionarios} onSubmit={handleAdd} />
          <OrdensServicoList ordensServico={ordensServico} bikes={bikes} onAvancar={handleAvancar} onDelete={handleDelete} />
        </>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#34d399] text-[#08130c] px-4 py-2.5 rounded-lg text-[13px] font-bold shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
