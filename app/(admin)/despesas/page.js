'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import RouteGuard from '@/components/RouteGuard';
import DespesaForm from '@/components/DespesaForm';
import DespesasResumo from '@/components/DespesasResumo';
import DespesasTable from '@/components/DespesasTable';

export default function DespesasPage() {
  return (
    <RouteGuard papeis={['administrador']}>
      <DespesasConteudo />
    </RouteGuard>
  );
}

function DespesasConteudo() {
  const { data: despesas, loading, erro, reload } = useRealtimeTable('despesas', { orderBy: 'data', ascending: false });
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  async function handleAdd(despesa) {
    const { error } = await supabase.from('despesas').insert(despesa);
    if (error) {
      showToast('Erro ao salvar: ' + error.message);
      return;
    }
    showToast('Despesa registrada');
    reload();
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('despesas').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Despesa removida');
    reload();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">🧾 Custos e Despesas</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Registre e acompanhe os custos operacionais do negócio</p>
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
          <DespesaForm onSubmit={handleAdd} />
          <DespesasResumo despesas={despesas} />
          <DespesasTable despesas={despesas} onDelete={handleDelete} />
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
