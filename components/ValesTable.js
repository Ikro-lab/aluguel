'use client';

import { fmtMoney } from '@/lib/format';

export default function ValesTable({ vales, funcionarios, onDelete }) {
  const nomePorId = Object.fromEntries(funcionarios.map((f) => [f.id, f.nome]));

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold mb-3">Histórico de vales</h2>

      {vales.length === 0 ? (
        <div className="text-center text-[#9aa3b2] text-sm py-8">Nenhum vale registrado ainda</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {['Data', 'Funcionário', 'Descrição', 'Valor', ''].map((h) => (
                  <th key={h} className="text-left text-[#9aa3b2] font-semibold text-[11px] uppercase tracking-wide px-2.5 py-2 border-b border-[#2a2f3a]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vales.map((v) => {
                const d = new Date(v.created_at);
                return (
                  <tr key={v.id}>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">
                      {d.toLocaleDateString('pt-BR')}
                      <br />
                      <span className="text-[#9aa3b2] text-[11px]">{d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">{nomePorId[v.funcionario_id] || '—'}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a] text-[#9aa3b2]">{v.descricao || '—'}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a] font-bold text-[#ff5c5c]">{fmtMoney(v.valor)}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#2a2f3a]">
                      <button
                        onClick={() => onDelete(v.id)}
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
