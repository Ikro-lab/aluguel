'use client';

import { useMemo, useState } from 'react';
import { fmtMoney, FORMAS_PAGAMENTO } from '@/lib/format';

export default function FechamentoCaixa({ alugueis }) {
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));

  const doDia = useMemo(
    () => alugueis.filter((r) => new Date(r.created_at).toISOString().slice(0, 10) === data),
    [alugueis, data]
  );

  const porForma = useMemo(() => {
    const mapa = {};
    FORMAS_PAGAMENTO.forEach((f) => (mapa[f] = 0));
    doDia.forEach((r) => {
      mapa[r.forma_pagamento] = (mapa[r.forma_pagamento] || 0) + Number(r.valor_cobrado);
    });
    return mapa;
  }, [doDia]);

  const total = doDia.reduce((s, r) => s + Number(r.valor_cobrado), 0);

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Fechamento de caixa</h2>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-auto bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-1.5 text-sm"
        />
      </div>

      {doDia.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-6">Nenhum aluguel nesse dia</div>
      ) : (
        <div>
          {FORMAS_PAGAMENTO.filter((f) => porForma[f] > 0).map((f) => (
            <div key={f} className="flex justify-between items-center py-2 border-b border-[#22304d] last:border-0 text-sm">
              <span className="text-[#8996b3]">{f}</span>
              <b>{fmtMoney(porForma[f])}</b>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 mt-1 text-sm">
            <span className="font-semibold">Total do dia</span>
            <b className="text-lg">{fmtMoney(total)}</b>
          </div>
        </div>
      )}
    </div>
  );
}
