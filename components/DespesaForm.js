'use client';

import { useState } from 'react';
import { CATEGORIAS_DESPESA } from '@/lib/format';

export default function DespesaForm({ onSubmit }) {
  const [categoria, setCategoria] = useState(CATEGORIAS_DESPESA[0]);
  const [categoriaOutra, setCategoriaOutra] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const categoriaFinal = categoria === 'Outro' ? categoriaOutra.trim() : categoria;
  const valorNum = Number(valor);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!categoriaFinal) return;
    if (!valor || isNaN(valorNum) || valorNum <= 0) return;
    if (!data) return;

    setSaving(true);
    await onSubmit({
      categoria: categoriaFinal,
      descricao: descricao.trim() || null,
      valor: valorNum,
      data,
    });
    setSaving(false);
    setDescricao('');
    setValor('');
    setCategoriaOutra('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold">Nova despesa</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#9aa3b2] mb-1.5 font-medium">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
          >
            {CATEGORIAS_DESPESA.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {categoria === 'Outro' && (
            <input
              value={categoriaOutra}
              onChange={(e) => setCategoriaOutra(e.target.value)}
              placeholder="Descreva a categoria"
              className="w-full mt-2 bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
            />
          )}
        </div>

        <div>
          <label className="block text-xs text-[#9aa3b2] mb-1.5 font-medium">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#9aa3b2] mb-1.5 font-medium">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            className="w-full bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#9aa3b2] mb-1.5 font-medium">Descrição (opcional)</label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Troca de óleo da moto 3"
            className="w-full bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#ff7a1a] hover:bg-[#ffb057] text-[#101114] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Salvando…' : 'Registrar despesa'}
      </button>
    </form>
  );
}
