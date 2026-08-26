'use client';

import { fmtMoney } from '@/lib/format';

export default function ValesTable({ vales, funcionarios, onDelete }) {
  const nomePorId = Object.fromEntries(funcionarios.map((f) => [f.id, f.nome]));

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Histórico de vales</h2>

      {vales.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhum vale registrado ainda</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {['Data', 'Funcionário', 'Descrição', 'Valor', ''].map((h) => (
                  <th key={h} className="text-left text-[#8996b3] font-semibold text-[11px] uppercase tracking-wide px-2.5 py-2 border-b border-[#22304d]">
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
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                      {d.toLocaleDateString('pt-BR')}
                      <br />
                      <span className="text-[#8996b3] text-[11px]">{d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">{nomePorId[v.funcionario_id] || '—'}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d] text-[#8996b3]">{v.descricao || '—'}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d] font-bold text-[#f87171]">{fmtMoney(v.valor)}</td>
                    <td className="px-2.5 py-2.5 border-b border-[#22304d]">
                      <button
                        onClick={() => onDelete(v.id)}
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
