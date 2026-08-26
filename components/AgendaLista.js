'use client';

import { useMemo, useState } from 'react';
import { STATUS_AGENDAMENTO, TIPO_AGENDAMENTO, labelDe, corDe, isHoje, isAtrasado } from '@/lib/format';
import Badge from '@/components/Badge';

function formatarEndereco(e) {
  if (!e) return null;
  return [e.rua, e.numero, e.complemento, e.bairro, e.cidade, e.cep].filter(Boolean).join(', ');
}

export default function AgendaLista({ agendamentos, clientes, bikes, onUpdateStatus, onDelete }) {
  const [somentePendentes, setSomentePendentes] = useState(false);
  const nomeCliente = (id) => clientes.find((c) => c.id === id)?.nome || '—';
  const nomeBike = (id) => bikes.find((b) => b.id === id)?.modelo || '—';

  const pendentesQtd = agendamentos.filter((a) => a.status === 'aguardando_confirmacao').length;

  const ordenados = useMemo(() => {
    const base = somentePendentes ? agendamentos.filter((a) => a.status === 'aguardando_confirmacao') : agendamentos;
    return [...base].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
  }, [agendamentos, somentePendentes]);

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Próximos agendamentos</h2>
        <div className="flex gap-1 bg-[#16213a] border border-[#22304d] rounded-lg p-1">
          {[{ v: false, l: 'Todos' }, { v: true, l: `Pendentes${pendentesQtd ? ` (${pendentesQtd})` : ''}` }].map((o) => (
            <button
              key={String(o.v)}
              onClick={() => setSomentePendentes(o.v)}
              className={
                'w-auto rounded-md px-3 py-1 text-xs font-semibold ' +
                (somentePendentes === o.v ? 'bg-[#3b82f6] text-[#f8fafc]' : 'bg-transparent text-[#8996b3]')
              }
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {ordenados.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhum agendamento por aqui</div>
      ) : (
        <div className="space-y-2">
          {ordenados.map((a) => {
            const d = new Date(a.data_hora);
            const hoje = isHoje(a.data_hora);
            const atrasado = isAtrasado(a.data_hora, a.status);
            const enderecoTexto = formatarEndereco(a.endereco);
            const pendente = a.status === 'aguardando_confirmacao';
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
                  {a.codigo_agendamento && <Badge label={`#${a.codigo_agendamento}`} color="gray" />}
                </div>

                {a.tempo_uso && <div className="text-[#8996b3] text-xs mt-1.5">Duração desejada: {a.tempo_uso}</div>}
                {enderecoTexto && <div className="text-[#8996b3] text-xs mt-1">Entrega: {enderecoTexto}</div>}
                {a.observacao && <div className="text-[#8996b3] text-xs mt-1.5">{a.observacao}</div>}

                {pendente ? (
                  <div className="flex gap-2 mt-2.5">
                    <button
                      onClick={() => onUpdateStatus(a.id, 'confirmado')}
                      className="flex-1 bg-[#34d399] hover:bg-[#2fbd8a] text-[#08130c] font-bold rounded-md px-3 py-1.5 text-xs"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => onUpdateStatus(a.id, 'recusado')}
                      className="flex-1 bg-[#22304d] hover:bg-[#2c3b5e] text-[#fca5a5] font-bold rounded-md px-3 py-1.5 text-xs"
                    >
                      Recusar
                    </button>
                  </div>
                ) : (
                  <select
                    value={a.status}
                    onChange={(e) => onUpdateStatus(a.id, e.target.value)}
                    className="w-full mt-2.5 bg-[#22304d] border border-[#22304d] rounded-md px-2.5 py-1.5 text-xs"
                  >
                    {STATUS_AGENDAMENTO.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
