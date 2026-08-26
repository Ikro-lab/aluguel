'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import ClienteForm from '@/components/ClienteForm';
import ClientesTable from '@/components/ClientesTable';

export default function ClientesPage() {
  const { data: clientes, loading: loadingClientes, erro: erroClientes, reload } = useRealtimeTable('clientes', {
    orderBy: 'nome',
    ascending: true,
  });
  const { data: alugueis, loading: loadingAlugueis, erro: erroAlugueis } = useRealtimeTable('alugueis');
  const { data: agendamentos, loading: loadingAgendamentos, erro: erroAgendamentos } = useRealtimeTable('agendamentos');
  const [toast, setToast] = useState('');

  const loading = loadingClientes || loadingAlugueis || loadingAgendamentos;
  const erro = erroClientes || erroAlugueis || erroAgendamentos;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  async function handleAdd(cliente) {
    const { error } = await supabase.from('clientes').insert(cliente);
    if (error) {
      showToast('Erro ao cadastrar: ' + error.message);
      return;
    }
    showToast('Cliente cadastrado');
    reload();
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Cliente removido');
    reload();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">🧑‍🤝‍🧑 Clientes</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Cadastro e histórico de aluguéis e agendamentos</p>
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
          <ClienteForm onSubmit={handleAdd} />
          <ClientesTable clientes={clientes} alugueis={alugueis} agendamentos={agendamentos} onDelete={handleDelete} />
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
