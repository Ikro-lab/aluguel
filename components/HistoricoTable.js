'use client';

import { useState } from 'react';
import { fmtMoney } from '@/lib/format';

export default function HistoricoTable({ alugueis, vendedoresConhecidos, onDelete }) {
  const [filtro, setFiltro] = useState('');

  const filtrados = filtro ? alugueis.filter((r) => r.vendedor === filtro) : alugueis;

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Histórico</h2>

      <div className="flex gap-2 flex-wrap items-center mb-3.5">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-auto min-w-[160px] bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos os vendedores</option>
          {vendedoresConhecidos.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <button
          onClick={() => setFiltro('')}
          className="w-auto bg-transparent border border-[#22304d] text-[#8996b3] hover:text-[#e7ecf7] hover:border-[#3b82f6] rounded-lg px-3 py-2 text-sm font-semibold"
        >
          Limpar filtro
        </button>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhum aluguel registrado ainda</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {['Data', 'Vendedor', 'Tipo', 'Pagamento', 'Base', 'Cobrado', 'Comissão', ''].map((h) => (
                  <th key={h} className="text-left text-[#8996b3] font-semibold text-[11px] uppercase tracking-wide px-2.5 py-2 border-b border-[#22304d]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => {
                const d = new Date(r.created_at);
                const comissao = Number(r.comissao);
                return (
                  <tr key={r.id}>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                      {d.toLocaleDateString('pt-BR')}
                      <br />
                      <span className="text-[#8996b3] text-[11px]">{d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">{r.vendedor}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#3b82f6]/15 text-[#60a5fa]">
                        {r.tipo_nome}
                      </span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#34d399]/15 text-[#34d399]">
                        {r.forma_pagamento}
                      </span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">{fmtMoney(r.valor_base)}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">{fmtMoney(r.valor_cobrado)}</td>
                    <td className={'px-2.5 py-2.5 border-b border-[#22304d] font-bold ' + (comissao > 0 ? 'text-[#34d399]' : comissao < 0 ? 'text-[#f87171]' : '')}>
                      {fmtMoney(comissao)}
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                      <button
                        onClick={() => onDelete(r.id)}
                        title="Excluir"
                        className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
