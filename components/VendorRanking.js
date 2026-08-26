'use client';

import { fmtMoney } from '@/lib/format';

export default function VendorRanking({ alugueis }) {
  const porVendedor = {};
  alugueis.forEach((r) => {
    if (!porVendedor[r.vendedor]) porVendedor[r.vendedor] = { comissao: 0, qtd: 0 };
    porVendedor[r.vendedor].comissao += Number(r.comissao);
    porVendedor[r.vendedor].qtd += 1;
  });
  const nomes = Object.keys(porVendedor).sort((a, b) => porVendedor[b].comissao - porVendedor[a].comissao);

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold mb-3">Comissão por vendedor</h2>
      {nomes.length === 0 ? (
        <div className="text-center text-[#9aa3b2] text-sm py-6">Sem dados ainda</div>
      ) : (
        <div>
          {nomes.map((v) => (
            <div key={v} className="flex justify-between items-center py-2.5 border-b border-[#2a2f3a] last:border-0 text-sm">
              <span className="font-semibold">{v}</span>
              <span>
                <b>{fmtMoney(porVendedor[v].comissao)}</b>
                <span className="text-[#9aa3b2] text-xs"> · {porVendedor[v].qtd} aluguel(éis)</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
