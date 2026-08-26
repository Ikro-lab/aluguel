'use client';

import { useState } from 'react';
import { fmtMoney } from '@/lib/format';

export default function DespesasTable({ despesas, onDelete }) {
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const categorias = Array.from(new Set(despesas.map((d) => d.categoria))).sort();
  const filtradas = filtroCategoria ? despesas.filter((d) => d.categoria === filtroCategoria) : despesas;

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Histórico de despesas</h2>

      <div className="flex gap-2 flex-wrap items-center mb-3.5">
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="w-auto min-w-[160px] bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => setFiltroCategoria('')}
          className="w-auto bg-transparent border border-[#22304d] text-[#8996b3] hover:text-[#e7ecf7] hover:border-[#3b82f6] rounded-lg px-3 py-2 text-sm font-semibold"
        >
          Limpar filtro
        </button>
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhuma despesa registrada ainda</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {['Data', 'Categoria', 'Descrição', 'Valor', ''].map((h) => (
                  <th key={h} className="text-left text-[#8996b3] font-semibold text-[11px] uppercase tracking-wide px-2.5 py-2 border-b border-[#22304d]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((d) => (
                <tr key={d.id}>
                  <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                    {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#3b82f6]/15 text-[#60a5fa]">
                      {d.categoria}
                    </span>
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-[#22304d] text-[#8996b3]">{d.descricao || '—'}</td>
                  <td className="px-2.5 py-2.5 border-b border-[#22304d] font-bold text-[#f87171]">
                    {fmtMoney(d.valor)}
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                    <button
                      onClick={() => onDelete(d.id)}
                      title="Excluir"
                      className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
