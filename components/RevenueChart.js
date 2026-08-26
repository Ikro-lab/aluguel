'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fmtMoney, monthKey, monthLabel } from '@/lib/format';

export default function RevenueChart({ alugueis }) {
  const dados = useMemo(() => {
    const porMes = {};
    alugueis.forEach((r) => {
      const key = monthKey(r.created_at);
      if (!porMes[key]) porMes[key] = { key, faturado: 0 };
      porMes[key].faturado += Number(r.valor_cobrado);
    });
    return Object.values(porMes)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((m) => ({ ...m, label: monthLabel(m.key) }));
  }, [alugueis]);

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-4">Faturamento mensal</h2>
      {dados.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-10">Sem dados ainda</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22304d" vertical={false} />
              <XAxis dataKey="label" stroke="#8996b3" fontSize={12} tickLine={false} axisLine={{ stroke: '#22304d' }} />
              <YAxis stroke="#8996b3" fontSize={12} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => fmtMoney(v)} />
              <Tooltip
                cursor={{ fill: '#22304d55' }}
                contentStyle={{ background: '#16213a', border: '1px solid #22304d', borderRadius: 8, fontSize: 13 }}
                labelStyle={{ color: '#8996b3' }}
                formatter={(v) => [fmtMoney(v), 'Faturado']}
              />
              <Bar dataKey="faturado" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
