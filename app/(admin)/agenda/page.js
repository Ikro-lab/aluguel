'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import AgendamentoForm from '@/components/AgendamentoForm';
import AgendaLista from '@/components/AgendaLista';
import AgendaCalendarioSemana from '@/components/AgendaCalendarioSemana';
import QRCodeAgendamento from '@/components/QRCodeAgendamento';

export default function AgendaPage() {
  const { data: agendamentos, loading: loadingAgendamentos, erro: erroAgendamentos, reload } = useRealtimeTable('agendamentos');
  const { data: clientes, loading: loadingClientes, erro: erroClientes } = useRealtimeTable('clientes', { orderBy: 'nome', ascending: true });
  const { data: bikes, loading: loadingBikes, erro: erroBikes } = useRealtimeTable('bikes', { orderBy: 'modelo', ascending: true });
  const [visao, setVisao] = useState('lista');
  const [toast, setToast] = useState('');

  const loading = loadingAgendamentos || loadingClientes || loadingBikes;
  const erro = erroAgendamentos || erroClientes || erroBikes;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  async function handleAdd(agendamento) {
    const { error } = await supabase.from('agendamentos').insert(agendamento);
    if (error) {
      showToast('Erro ao agendar: ' + error.message);
      return;
    }
    showToast('Agendamento criado');
    reload();
  }

  async function handleUpdateStatus(id, status) {
    const { error } = await supabase.from('agendamentos').update({ status }).eq('id', id);
    if (error) {
      showToast('Erro ao atualizar: ' + error.message);
      return;
    }
    reload();
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('agendamentos').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Agendamento removido');
    reload();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-bold tracking-tight">📅 Agenda</h1>
          <p className="text-[13px] text-[#8996b3] mt-1">Retiradas, devoluções, entregas e manutenções</p>
        </div>
        <div className="flex gap-1 bg-[#0f1729] border border-[#22304d] rounded-lg p-1">
          {[{ v: 'lista', l: 'Lista' }, { v: 'semana', l: 'Semana' }].map((o) => (
            <button
              key={o.v}
              onClick={() => setVisao(o.v)}
              className={
                'w-auto rounded-md px-3 py-1.5 text-xs font-semibold ' +
                (visao === o.v ? 'bg-[#3b82f6] text-[#f8fafc]' : 'bg-transparent text-[#8996b3]')
              }
            >
              {o.l}
            </button>
          ))}
        </div>
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
          <QRCodeAgendamento />
          <AgendamentoForm clientes={clientes} bikes={bikes} onSubmit={handleAdd} />
          {visao === 'lista' ? (
            <AgendaLista agendamentos={agendamentos} clientes={clientes} bikes={bikes} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
          ) : (
            <AgendaCalendarioSemana agendamentos={agendamentos} clientes={clientes} />
          )}
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
