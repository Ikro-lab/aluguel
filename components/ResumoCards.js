'use client';

import { fmtMoney } from '@/lib/format';

export default function ResumoCards({ alugueis }) {
  const totalFaturado = alugueis.reduce((s, r) => s + Number(r.valor_cobrado), 0);
  const totalComissao = alugueis.reduce((s, r) => s + Number(r.comissao), 0);

  const boxes = [
    { label: 'Faturado', value: fmtMoney(totalFaturado) },
    { label: 'Comissões', value: fmtMoney(totalComissao) },
    { label: 'Aluguéis', value: String(alugueis.length) },
  ];

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold mb-4">Resumo</h2>
      <div className="grid grid-cols-3 gap-3">
        {boxes.map((b) => (
          <div key={b.label} className="bg-[#1e222b] border border-[#2a2f3a] rounded-lg p-3.5 text-center">
            <div className="text-lg font-bold">{b.value}</div>
            <div className="text-[11px] text-[#9aa3b2] mt-1 uppercase tracking-wide">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
