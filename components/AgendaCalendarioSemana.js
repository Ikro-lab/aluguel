'use client';

import { useMemo, useState } from 'react';
import { startOfWeek, labelDe, TIPO_AGENDAMENTO } from '@/lib/format';

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function AgendaCalendarioSemana({ agendamentos, clientes }) {
  const [inicioSemana, setInicioSemana] = useState(() => startOfWeek(new Date()));

  const nomeCliente = (id) => clientes.find((c) => c.id === id)?.nome;

  const dias = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const data = new Date(inicioSemana);
      data.setDate(data.getDate() + i);
      const itens = agendamentos
        .filter((a) => new Date(a.data_hora).toDateString() === data.toDateString())
        .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
      return { data, itens };
    });
  }, [inicioSemana, agendamentos]);

  function mudarSemana(delta) {
    const nova = new Date(inicioSemana);
    nova.setDate(nova.getDate() + delta * 7);
    setInicioSemana(nova);
  }

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3.5">
        <button
          onClick={() => mudarSemana(-1)}
          className="w-auto bg-transparent border border-[#22304d] text-[#8996b3] hover:text-[#e7ecf7] rounded-lg px-3 py-1.5 text-sm"
        >
          ← Semana anterior
        </button>
        <button
          onClick={() => mudarSemana(1)}
          className="w-auto bg-transparent border border-[#22304d] text-[#8996b3] hover:text-[#e7ecf7] rounded-lg px-3 py-1.5 text-sm"
        >
          Próxima semana →
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {dias.map((dia, i) => (
          <div key={i} className="bg-[#16213a] border border-[#22304d] rounded-lg p-2.5 min-w-[140px] shrink-0">
            <div className="text-xs font-semibold text-[#8996b3] uppercase tracking-wide mb-2">
              {DIAS[i]} <span className="text-[#e7ecf7]">{dia.data.getDate()}</span>
            </div>
            {dia.itens.length === 0 ? (
              <div className="text-[11px] text-[#8996b3]">—</div>
            ) : (
              <div className="space-y-1.5">
                {dia.itens.map((a) => (
                  <div key={a.id} className="bg-[#22304d] rounded-md px-2 py-1.5 text-[11px]">
                    <div className="font-semibold">
                      {new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[#8996b3]">{labelDe(TIPO_AGENDAMENTO, a.tipo)}</div>
                    {nomeCliente(a.cliente_id) && <div>{nomeCliente(a.cliente_id)}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
