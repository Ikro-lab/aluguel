'use client';

import { useState } from 'react';
import { TIPO_AGENDAMENTO } from '@/lib/format';

export default function AgendamentoForm({ clientes, bikes, onSubmit }) {
  const [clienteId, setClienteId] = useState('');
  const [bikeId, setBikeId] = useState('');
  const [tipo, setTipo] = useState(TIPO_AGENDAMENTO[0].value);
  const [dataHora, setDataHora] = useState('');
  const [observacao, setObservacao] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!dataHora) return;

    setSaving(true);
    await onSubmit({
      cliente_id: clienteId || null,
      bike_id: bikeId || null,
      tipo,
      data_hora: new Date(dataHora).toISOString(),
      observacao: observacao.trim() || null,
      status: 'agendado',
    });
    setSaving(false);
    setDataHora('');
    setObservacao('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Novo agendamento</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Cliente (opcional)</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          >
            <option value="">— nenhum —</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Bike (opcional)</label>
          <select
            value={bikeId}
            onChange={(e) => setBikeId(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          >
            <option value="">— nenhuma —</option>
            {bikes.map((b) => (
              <option key={b.id} value={b.id}>{b.modelo}{b.patrimonio ? ` — ${b.patrimonio}` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          >
            {TIPO_AGENDAMENTO.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Data e hora</label>
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Observação (opcional)</label>
        <input
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Ex: Cliente prefere retirar na loja"
          className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Salvando…' : 'Agendar'}
      </button>
    </form>
  );
}
