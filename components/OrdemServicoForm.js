'use client';

import { useMemo, useState } from 'react';
import { ORIGEM_OS, FORMAS_PAGAMENTO, fmtMoney } from '@/lib/format';

export default function OrdemServicoForm({ bikes, clientes, funcionarios, onSubmit }) {
  const [origem, setOrigem] = useState('frota');
  const [bikeId, setBikeId] = useState(bikes[0]?.id || '');
  const [clienteId, setClienteId] = useState('');
  const [bikeDescricao, setBikeDescricao] = useState('');
  const [mecanico, setMecanico] = useState('');
  const [problema, setProblema] = useState('');
  const [pecasUsadas, setPecasUsadas] = useState('');
  const [custoPeca, setCustoPeca] = useState('');
  const [custoMecanico, setCustoMecanico] = useState('');
  const [valorCobrado, setValorCobrado] = useState('');
  const [formaPagamento, setFormaPagamento] = useState(FORMAS_PAGAMENTO[0]);
  const [saving, setSaving] = useState(false);

  const custoTotal = (Number(custoPeca) || 0) + (Number(custoMecanico) || 0);
  const margem = (Number(valorCobrado) || 0) - custoTotal;

  async function handleSubmit(e) {
    e.preventDefault();
    const problemaTrim = problema.trim();
    if (!problemaTrim) return;
    if (origem === 'frota' && !bikeId) return;
    if (origem === 'cliente' && (!clienteId || !bikeDescricao.trim())) return;

    setSaving(true);
    await onSubmit({
      origem,
      bike_id: origem === 'frota' ? bikeId : null,
      cliente_id: origem === 'cliente' ? clienteId : null,
      bike_descricao: origem === 'cliente' ? bikeDescricao.trim() : null,
      mecanico: mecanico.trim() || null,
      problema: problemaTrim,
      pecas_usadas: pecasUsadas.trim() || null,
      custo_peca: Number(custoPeca) || 0,
      custo_mecanico: Number(custoMecanico) || 0,
      valor_cobrado: origem === 'cliente' ? Number(valorCobrado) || 0 : null,
      forma_pagamento: origem === 'cliente' ? formaPagamento : null,
    });
    setSaving(false);
    setProblema('');
    setPecasUsadas('');
    setCustoPeca('');
    setCustoMecanico('');
    setValorCobrado('');
    setBikeDescricao('');
  }

  const semOpcoes = origem === 'frota' && bikes.length === 0;

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Nova ordem de serviço</h2>

      <div className="flex gap-2">
        {ORIGEM_OS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setOrigem(o.value)}
            className={
              'flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold border ' +
              (origem === o.value ? 'bg-[#3b82f6] border-[#3b82f6] text-[#f8fafc]' : 'bg-[#16213a] border-[#22304d] text-[#8996b3]')
            }
          >
            {o.label}
          </button>
        ))}
      </div>

      {semOpcoes ? (
        <div className="text-center text-[#8996b3] text-sm py-6">Cadastre uma bike na Frota antes de abrir uma OS</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {origem === 'frota' ? (
              <div>
                <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Bike da frota</label>
                <select
                  value={bikeId || bikes[0]?.id}
                  onChange={(e) => setBikeId(e.target.value)}
                  className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
                >
                  {bikes.map((b) => (
                    <option key={b.id} value={b.id}>{b.modelo}{b.patrimonio ? ` — ${b.patrimonio}` : ''}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Cliente</label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
                  >
                    <option value="">Selecione…</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Bike do cliente</label>
                  <input
                    value={bikeDescricao}
                    onChange={(e) => setBikeDescricao(e.target.value)}
                    placeholder="Ex: Xiaomi M365 particular"
                    className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Mecânico</label>
            <input
              list="mecanicos-list"
              value={mecanico}
              onChange={(e) => setMecanico(e.target.value)}
              placeholder="Nome do mecânico"
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            />
            <datalist id="mecanicos-list">
              {funcionarios.map((f) => (
                <option key={f.id} value={f.nome} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Problema relatado</label>
            <input
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              placeholder="Ex: Freio traseiro não responde"
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Peças usadas (opcional)</label>
            <input
              value={pecasUsadas}
              onChange={(e) => setPecasUsadas(e.target.value)}
              placeholder="Ex: Pastilha de freio"
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Custo com peça (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={custoPeca}
                onChange={(e) => setCustoPeca(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Custo com mecânico (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={custoMecanico}
                onChange={(e) => setCustoMecanico(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
              />
            </div>
          </div>

          {origem === 'cliente' && (
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
          )}

          <div className="flex justify-between items-center bg-[#16213a] border border-[#22304d] rounded-lg px-4 py-3.5 text-sm">
            <span className="text-[#8996b3]">Custo total</span>
            <b>{fmtMoney(custoTotal)}</b>
          </div>

          {origem === 'cliente' && (
            <div className="flex justify-between items-center bg-[#16213a] border border-[#22304d] rounded-lg px-4 py-3.5">
              <span className="text-sm text-[#8996b3]">Margem (cobrado − custo)</span>
              <span className={'text-lg font-bold ' + (margem > 0 ? 'text-[#34d399]' : margem < 0 ? 'text-[#f87171]' : 'text-[#8996b3]')}>
                {fmtMoney(margem)}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Abrir ordem de serviço'}
          </button>
        </>
      )}
    </form>
  );
}
