'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import BikeForm from '@/components/BikeForm';
import BikesGrid from '@/components/BikesGrid';

export default function FrotaPage() {
  const { data: bikes, loading: loadingBikes, erro: erroBikes, reload } = useRealtimeTable('bikes', {
    orderBy: 'modelo',
    ascending: true,
  });
  const { data: ordensServico, loading: loadingOS, erro: erroOS } = useRealtimeTable('ordens_servico');
  const [toast, setToast] = useState('');

  const loading = loadingBikes || loadingOS;
  const erro = erroBikes || erroOS;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  async function handleAdd(bike) {
    const { error } = await supabase.from('bikes').insert(bike);
    if (error) {
      showToast('Erro ao cadastrar: ' + error.message);
      return;
    }
    showToast('Bike cadastrada');
    reload();
  }

  async function handleUpdate(id, patch) {
    const { error } = await supabase.from('bikes').update(patch).eq('id', id);
    if (error) {
      showToast('Erro ao atualizar: ' + error.message);
      return;
    }
    reload();
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('bikes').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Bike removida');
    reload();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">🛵 Frota</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Bikes elétricas, status e alertas de manutenção</p>
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
          <BikeForm onSubmit={handleAdd} />
          <BikesGrid bikes={bikes} ordensServico={ordensServico} onUpdate={handleUpdate} onDelete={handleDelete} />
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
