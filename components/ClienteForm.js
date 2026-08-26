'use client';

import { useState } from 'react';

export default function ClienteForm({ onSubmit }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const nomeTrim = nome.trim();
    if (!nomeTrim) return;

    setSaving(true);
    await onSubmit({
      nome: nomeTrim,
      telefone: telefone.trim() || null,
      email: email.trim() || null,
    });
    setSaving(false);
    setNome('');
    setTelefone('');
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Novo cliente</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Telefone/WhatsApp</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">E-mail (opcional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@email.com"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Salvando…' : 'Cadastrar cliente'}
      </button>
    </form>
  );
}
