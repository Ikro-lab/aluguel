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
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Comissões mensais</h2>
        <select
          value={selecionado}
          onChange={(e) => setSelecionado(e.target.value)}
          className="w-auto min-w-[160px] bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-1.5 text-sm"
        >
          <option value={TODO_TIME}>Todo o time</option>
          {funcionarios.map((f) => (
            <option key={f.id} value={f.id}>{f.nome}</option>
          ))}
        </select>
      </div>
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
                formatter={(v) => [fmtMoney(v), 'Comissão']}
              />
              <Bar dataKey="comissao" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
