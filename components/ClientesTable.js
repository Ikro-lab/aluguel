'use client';

import { useMemo, useState } from 'react';
import { fmtMoney } from '@/lib/format';

export default function ClientesTable({ clientes, alugueis, agendamentos, onDelete }) {
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [clientes, busca]);

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Clientes</h2>

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome…"
        className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px] mb-3.5"
      />

      {filtrados.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhum cliente encontrado</div>
      ) : (
        <div>
          {filtrados.map((c) => {
            const aluguelHist = alugueis.filter((a) => a.cliente_id === c.id);
            const agendaHist = agendamentos.filter((a) => a.cliente_id === c.id);
            const aberto = expandido === c.id;
            return (
              <div key={c.id} className="border-b border-[#22304d] last:border-0 py-2.5">
                <div className="flex justify-between items-center text-sm">
                  <button
                    onClick={() => setExpandido(aberto ? null : c.id)}
                    className="w-auto bg-transparent p-0 m-0 text-left font-semibold flex-1"
                  >
                    {c.nome} <span className="text-[#8996b3] font-normal text-xs">{aberto ? '▴' : '▾'}</span>
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    title="Excluir"
                    className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-[#8996b3] text-xs mt-0.5">
                  {c.telefone || '—'} {c.email ? `· ${c.email}` : ''}
                </div>

                {aberto && (
                  <div className="mt-2.5 bg-[#16213a] border border-[#22304d] rounded-lg p-3 text-xs space-y-1.5">
                    <div className="text-[#8996b3] uppercase tracking-wide font-semibold">Histórico</div>
                    {aluguelHist.length === 0 && agendaHist.length === 0 ? (
                      <div className="text-[#8996b3]">Sem registros ainda</div>
                    ) : (
                      <>
                        {aluguelHist.map((a) => (
                          <div key={a.id} className="flex justify-between">
                            <span>Aluguel · {a.tipo_nome}</span>
                            <b>{fmtMoney(a.valor_cobrado)}</b>
                          </div>
                        ))}
                        {agendaHist.map((a) => (
                          <div key={a.id} className="flex justify-between">
                            <span>Agendamento · {a.tipo}</span>
                            <span className="text-[#8996b3]">{new Date(a.data_hora).toLocaleDateString('pt-BR')}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
