'use client';

import { useState } from 'react';
import { fmtMoney } from '@/lib/format';

export default function HistoricoTable({ alugueis, vendedoresConhecidos, onDelete }) {
  const [filtro, setFiltro] = useState('');

  const filtrados = filtro ? alugueis.filter((r) => r.vendedor === filtro) : alugueis;

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold mb-3">Histórico</h2>

      <div className="flex gap-2 flex-wrap items-center mb-3.5">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-auto min-w-[160px] bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos os vendedores</option>
          {vendedoresConhecidos.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <button
          onClick={() => setFiltro('')}
          className="w-auto bg-transparent border border-[#2a2f3a] text-[#9aa3b2] hover:text-[#eef0f4] hover:border-[#ff7a1a] rounded-lg px-3 py-2 text-sm font-semibold"
        >
          Limpar filtro
        </button>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center text-[#9aa3b2] text-sm py-8">Nenhum aluguel registrado ainda</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {['Data', 'Vendedor', 'Tipo', 'Pagamento', 'Base', 'Cobrado', 'Comissão', ''].map((h) => (
                  <th key={h} className="text-left text-[#9aa3b2] font-semibold text-[11px] uppercase tracking-wide px-2.5 py-2 border-b border-[#2a2f3a]">
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
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">
                      {d.toLocaleDateString('pt-BR')}
                      <br />
                      <span className="text-[#9aa3b2] text-[11px]">{d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">{r.vendedor}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ff7a1a]/15 text-[#ffb057]">
                        {r.tipo_nome}
                      </span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#3ddc84]/15 text-[#3ddc84]">
                        {r.forma_pagamento}
                      </span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">{fmtMoney(r.valor_base)}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">{fmtMoney(r.valor_cobrado)}</td>
                    <td className={'px-2.5 py-2.5 border-b border-[#2a2f3a] font-bold ' + (comissao > 0 ? 'text-[#3ddc84]' : comissao < 0 ? 'text-[#ff5c5c]' : '')}>
                      {fmtMoney(comissao)}
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">
                      <button
                        onClick={() => onDelete(r.id)}
                        title="Excluir"
                        className="w-auto bg-transparent text-[#9aa3b2] hover:text-[#ff5c5c] p-0 m-0 text-base"
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
