'use client';

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fmtMoney, monthKey, monthLabel } from '@/lib/format';

const TODO_TIME = '__todos__';

export default function CommissionChart({ alugueis, funcionarios }) {
  const [selecionado, setSelecionado] = useState(TODO_TIME);

  const alugueisFiltrados = useMemo(() => {
    if (selecionado === TODO_TIME) return alugueis;
    const funcionario = funcionarios.find((f) => f.id === selecionado);
    if (!funcionario) return alugueis;
    return alugueis.filter((r) => r.vendedor === funcionario.nome);
  }, [alugueis, funcionarios, selecionado]);

  const dados = useMemo(() => {
    const porMes = {};
    alugueisFiltrados.forEach((r) => {
      const key = monthKey(r.created_at);
      if (!porMes[key]) porMes[key] = { key, comissao: 0 };
      porMes[key].comissao += Number(r.comissao);
    });
    return Object.values(porMes)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((m) => ({ ...m, label: monthLabel(m.key) }));
  }, [alugueisFiltrados]);

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold">Comissões mensais</h2>
        <select
          value={selecionado}
          onChange={(e) => setSelecionado(e.target.value)}
          className="w-auto min-w-[160px] bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-1.5 text-sm"
        >
          <option value={TODO_TIME}>Todo o time</option>
          {funcionarios.map((f) => (
            <option key={f.id} value={f.id}>{f.nome}</option>
          ))}
        </select>
      </div>
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
                formatter={(v) => [fmtMoney(v), 'Comissão']}
              />
              <Bar dataKey="comissao" fill="#3ddc84" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
