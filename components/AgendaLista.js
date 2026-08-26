'use client';

import { STATUS_AGENDAMENTO, TIPO_AGENDAMENTO, labelDe, corDe, isHoje, isAtrasado } from '@/lib/format';
import Badge from '@/components/Badge';

export default function AgendaLista({ agendamentos, clientes, bikes, onUpdateStatus, onDelete }) {
  const nomeCliente = (id) => clientes.find((c) => c.id === id)?.nome || '—';
  const nomeBike = (id) => bikes.find((b) => b.id === id)?.modelo || '—';

  const ordenados = [...agendamentos].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Próximos agendamentos</h2>

      {ordenados.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhum agendamento ainda</div>
      ) : (
        <div className="space-y-2">
          {ordenados.map((a) => {
            const d = new Date(a.data_hora);
            const hoje = isHoje(a.data_hora);
            const atrasado = isAtrasado(a.data_hora, a.status);
            return (
              <div key={a.id} className="bg-[#16213a] border border-[#22304d] rounded-lg p-3 text-sm">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-semibold">{labelDe(TIPO_AGENDAMENTO, a.tipo)} · {nomeCliente(a.cliente_id)}</div>
                    <div className="text-[#8996b3] text-xs mt-0.5">{nomeBike(a.bike_id)}</div>
                  </div>
                  <button
                    onClick={() => onDelete(a.id)}
                    title="Excluir"
                    className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base shrink-0"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-xs text-[#8996b3]">
                    {d.toLocaleDateString('pt-BR')} às {d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {hoje && <Badge label="Hoje" color="blue" />}
                  {atrasado && <Badge label="Atrasado" color="red" />}
                  <Badge label={labelDe(STATUS_AGENDAMENTO, a.status)} color={corDe(STATUS_AGENDAMENTO, a.status)} />
                </div>

                {a.observacao && <div className="text-[#8996b3] text-xs mt-1.5">{a.observacao}</div>}

                <select
                  value={a.status}
                  onChange={(e) => onUpdateStatus(a.id, e.target.value)}
                  className="w-full mt-2.5 bg-[#22304d] border border-[#22304d] rounded-md px-2.5 py-1.5 text-xs"
                >
                  {STATUS_AGENDAMENTO.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
