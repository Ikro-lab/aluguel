'use client';

import { useState } from 'react';

export default function TiposManager({ tipos, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [edits, setEdits] = useState({});
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');

  function getEdit(t) {
    return edits[t.id] || { nome: t.nome, valor_base: t.valor_base };
  }
  function setEdit(id, field, value) {
    setEdits((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  }

  async function handleSave(t) {
    const e = getEdit(t);
    const nome = String(e.nome).trim();
    const valor = Number(e.valor_base);
    if (!nome || isNaN(valor) || valor < 0) return;
    await onUpdate(t.id, { nome, valor_base: valor });
  }

  async function handleAdd() {
    const nome = novoNome.trim();
    const valor = Number(novoValor);
    if (!nome || !novoValor || isNaN(valor) || valor < 0) return;
    await onAdd({ nome, valor_base: valor });
    setNovoNome('');
    setNovoValor('');
  }

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold mb-1">
        Tipos de aluguel
        <button
          onClick={() => setOpen((o) => !o)}
          className="float-right normal-case tracking-normal text-[#ffb057] font-semibold w-auto"
          style={{ background: 'none', padding: 0, margin: 0 }}
        >
          {open ? 'fechar ▴' : 'gerenciar ▾'}
        </button>
      </h2>

      {open && (
        <div className="mt-4">
          {tipos.map((t) => {
            const e = getEdit(t);
            return (
              <div
                key={t.id}
                className="grid grid-cols-[1fr_100px_auto_auto] gap-2 items-center py-2 border-b border-[#2a2f3a] last:border-0"
              >
                <input
                  value={e.nome}
                  onChange={(ev) => setEdit(t.id, 'nome', ev.target.value)}
                  className="bg-[#1e222b] border border-[#2a2f3a] rounded-md px-2.5 py-2 text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={e.valor_base}
                  onChange={(ev) => setEdit(t.id, 'valor_base', ev.target.value)}
                  className="bg-[#1e222b] border border-[#2a2f3a] rounded-md px-2.5 py-2 text-sm"
                />
                <button
                  onClick={() => handleSave(t)}
                  title="Salvar"
                  className="w-9 h-9 rounded-lg border border-[#2a2f3a] bg-transparent text-[#9aa3b2] hover:text-[#eef0f4] hover:border-[#ff7a1a] p-0"
                >
                  💾
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  title="Excluir"
                  disabled={tipos.length <= 1}
                  className="w-9 h-9 rounded-lg border border-[#2a2f3a] bg-transparent text-[#9aa3b2] hover:text-[#ff5c5c] hover:border-[#ff5c5c] p-0 disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            );
          })}

          <div className="grid grid-cols-[1fr_100px_auto] gap-2 items-center mt-3">
            <input
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Nome (ex: 2 horas)"
              className="bg-[#1e222b] border border-[#2a2f3a] rounded-md px-2.5 py-2.5 text-sm"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              placeholder="Valor base"
              className="bg-[#1e222b] border border-[#2a2f3a] rounded-md px-2.5 py-2.5 text-sm"
            />
            <button
              onClick={handleAdd}
              className="w-auto bg-[#ff7a1a] hover:bg-[#ffb057] text-[#101114] font-bold rounded-md px-4 py-2.5 text-sm mt-0"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
