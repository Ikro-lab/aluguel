'use client';

import { useMemo, useState } from 'react';
import { fmtMoney, FORMAS_PAGAMENTO } from '@/lib/format';

export default function NovoAluguelForm({ tipos, vendedoresConhecidos, clientes = [], bikesDisponiveis = [], onSubmit }) {
  const [vendedor, setVendedor] = useState('');
  const [tipoId, setTipoId] = useState(tipos[0]?.id || '');
  const [valorCobrado, setValorCobrado] = useState('');
  const [formaPagamento, setFormaPagamento] = useState(FORMAS_PAGAMENTO[0]);
  const [clienteId, setClienteId] = useState('');
  const [bikeId, setBikeId] = useState('');
  const [saving, setSaving] = useState(false);

  const tipoSelecionado = useMemo(
    () => tipos.find((t) => t.id === (tipoId || tipos[0]?.id)) || tipos[0],
    [tipos, tipoId]
  );
  const base = Number(tipoSelecionado?.valor_base || 0);
  const cobrado = Number(valorCobrado) || 0;
  const comissao = cobrado - base;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!vendedor.trim()) return;
    if (!tipoSelecionado) return;
    if (!valorCobrado || isNaN(cobrado) || cobrado < 0) return;

    setSaving(true);
    await onSubmit({
      vendedor: vendedor.trim(),
      tipo_id: tipoSelecionado.id,
      tipo_nome: tipoSelecionado.nome,
      valor_base: base,
      valor_cobrado: cobrado,
      comissao,
      forma_pagamento: formaPagamento,
      cliente_id: clienteId || null,
      bike_id: bikeId || null,
    });
    setSaving(false);
    setValorCobrado('');
    setClienteId('');
    setBikeId('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Novo aluguel</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Nome do vendedor</label>
          <input
            list="vendedores-list"
            value={vendedor}
            onChange={(e) => setVendedor(e.target.value)}
            placeholder="Ex: João"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
          <datalist id="vendedores-list">
            {vendedoresConhecidos.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Tipo de aluguel</label>
          <select
            value={tipoId || tipos[0]?.id}
            onChange={(e) => setTipoId(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          >
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} — base {fmtMoney(t.valor_base)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Valor cobrado do cliente (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={valorCobrado}
            onChange={(e) => setValorCobrado(e.target.value)}
            placeholder="0,00"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
          <div className="text-xs text-[#8996b3] mt-1.5">
            Valor base: <b className="text-[#60a5fa]">{fmtMoney(base)}</b>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Forma de pagamento</label>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          >
            {FORMAS_PAGAMENTO.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Cliente (opcional)</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          >
            <option value="">— avulso —</option>
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
            <option value="">— não especificar —</option>
            {bikesDisponiveis.map((b) => (
              <option key={b.id} value={b.id}>{b.modelo}{b.patrimonio ? ` — ${b.patrimonio}` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#16213a] border border-[#22304d] rounded-lg px-4 py-3.5">
        <span className="text-sm text-[#8996b3]">Comissão do vendedor</span>
        <span
          className={
            'text-xl font-bold ' +
            (comissao > 0 ? 'text-[#34d399]' : comissao < 0 ? 'text-[#f87171]' : 'text-[#8996b3]')
          }
        >
          {fmtMoney(comissao)}
        </span>
      </div>

      <button
        type="submit"
        disabled={saving || tipos.length === 0}
        className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Salvando…' : 'Registrar aluguel'}
      </button>
    </form>
  );
}
