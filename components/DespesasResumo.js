'use client';

import { fmtMoney } from '@/lib/format';

export default function DespesasResumo({ despesas }) {
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  const totalGeral = despesas.reduce((s, d) => s + Number(d.valor), 0);
  const totalMes = despesas
    .filter((d) => d.data.slice(0, 7) === mesAtual)
    .reduce((s, d) => s + Number(d.valor), 0);

  const porCategoria = {};
  despesas.forEach((d) => {
    porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + Number(d.valor);
  });
  const categorias = Object.keys(porCategoria).sort((a, b) => porCategoria[b] - porCategoria[a]);

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-4">Resumo</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#16213a] border border-[#22304d] rounded-lg p-3.5 text-center">
          <div className="text-lg font-bold">{fmtMoney(totalMes)}</div>
          <div className="text-[11px] text-[#8996b3] mt-1 uppercase tracking-wide">Este mês</div>
        </div>
        <div className="bg-[#16213a] border border-[#22304d] rounded-lg p-3.5 text-center">
          <div className="text-lg font-bold">{fmtMoney(totalGeral)}</div>
          <div className="text-[11px] text-[#8996b3] mt-1 uppercase tracking-wide">Total geral</div>
        </div>
      </div>

      {categorias.length > 0 && (
        <div>
          {categorias.map((c) => (
            <div key={c} className="flex justify-between items-center py-2 border-b border-[#22304d] last:border-0 text-sm">
              <span className="text-[#8996b3]">{c}</span>
              <b>{fmtMoney(porCategoria[c])}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
