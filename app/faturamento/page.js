'use client';

import { useRealtimeTable } from '@/lib/useRealtimeTable';
import { fmtMoney } from '@/lib/format';
import RevenueChart from '@/components/RevenueChart';
import CommissionChart from '@/components/CommissionChart';

export default function FaturamentoPage() {
  const { data: alugueis, loading: loadingAlugueis, erro: erroAlugueis } = useRealtimeTable('alugueis');
  const { data: funcionarios, loading: loadingFuncionarios, erro: erroFuncionarios } = useRealtimeTable('funcionarios', {
    orderBy: 'nome',
    ascending: true,
  });

  const loading = loadingAlugueis || loadingFuncionarios;
  const erro = erroAlugueis || erroFuncionarios;

  const totalFaturado = alugueis.reduce((s, r) => s + Number(r.valor_cobrado), 0);
  const totalComissao = alugueis.reduce((s, r) => s + Number(r.comissao), 0);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">📊 Faturamento</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Evolução mensal do faturamento e das comissões</p>
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
              <div className="text-[11px] text-[#8996b3] mt-1 uppercase tracking-wide">Faturado (total)</div>
            </div>
            <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-4 text-center">
              <div className="text-lg font-bold">{fmtMoney(totalComissao)}</div>
              <div className="text-[11px] text-[#8996b3] mt-1 uppercase tracking-wide">Comissões (total)</div>
            </div>
          </div>

          <RevenueChart alugueis={alugueis} />
          <CommissionChart alugueis={alugueis} funcionarios={funcionarios} />
        </>
      )}
    </main>
  );
}
