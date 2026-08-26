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
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold mb-4">Faturamento mensal</h2>
      {dados.length === 0 ? (
        <div className="text-center text-[#9aa3b2] text-sm py-10">Sem dados ainda</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" vertical={false} />
              <XAxis dataKey="label" stroke="#9aa3b2" fontSize={12} tickLine={false} axisLine={{ stroke: '#2a2f3a' }} />
              <YAxis stroke="#9aa3b2" fontSize={12} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => fmtMoney(v)} />
              <Tooltip
                cursor={{ fill: '#2a2f3a55' }}
                contentStyle={{ background: '#1e222b', border: '1px solid #2a2f3a', borderRadius: 8, fontSize: 13 }}
                labelStyle={{ color: '#9aa3b2' }}
                formatter={(v) => [fmtMoney(v), 'Faturado']}
              />
              <Bar dataKey="faturado" fill="#ff7a1a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
