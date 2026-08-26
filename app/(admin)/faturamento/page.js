'use client';

import { useMemo, useState } from 'react';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import { fmtMoney, PERIODOS, filtrarPorPeriodo } from '@/lib/format';
import RevenueChart from '@/components/RevenueChart';
import CommissionChart from '@/components/CommissionChart';
import FechamentoCaixa from '@/components/FechamentoCaixa';

export default function FaturamentoPage() {
  const { data: alugueisTodos, loading: loadingAlugueis, erro: erroAlugueis } = useRealtimeTable('alugueis');
  const { data: funcionarios, loading: loadingFuncionarios, erro: erroFuncionarios } = useRealtimeTable('funcionarios', {
    orderBy: 'nome',
    ascending: true,
  });
  const [periodo, setPeriodo] = useState('tudo');

  const loading = loadingAlugueis || loadingFuncionarios;
  const erro = erroAlugueis || erroFuncionarios;

  const alugueis = useMemo(() => filtrarPorPeriodo(alugueisTodos, periodo), [alugueisTodos, periodo]);

  const totalFaturado = alugueis.reduce((s, r) => s + Number(r.valor_cobrado), 0);
  const totalComissao = alugueis.reduce((s, r) => s + Number(r.comissao), 0);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl font-bold tracking-tight">📊 Faturamento</h1>
          <p className="text-[13px] text-[#8996b3] mt-1">Evolução do faturamento e das comissões</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="w-auto bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2 text-sm"
        >
          {PERIODOS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {erro && (
        <div className="bg-[#241826] border border-[#f87171]/40 text-[#fca5a5] rounded-xl p-4 text-sm">
          Não foi possível carregar os dados: {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#8996b3] text-sm py-10">Carregando…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-4 text-center">
              <div className="text-lg font-bold">{fmtMoney(totalFaturado)}</div>
              <div className="text-[11px] text-[#8996b3] mt-1 uppercase tracking-wide">Faturado</div>
            </div>
            <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-4 text-center">
              <div className="text-lg font-bold">{fmtMoney(totalComissao)}</div>
              <div className="text-[11px] text-[#8996b3] mt-1 uppercase tracking-wide">Comissões</div>
            </div>
          </div>

          <FechamentoCaixa alugueis={alugueisTodos} />
          <RevenueChart alugueis={alugueis} />
          <CommissionChart alugueis={alugueis} funcionarios={funcionarios} />
        </>
      )}
    </main>
  );
}
