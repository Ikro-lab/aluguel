'use client';

import { useState } from 'react';
import { fmtMoney } from '@/lib/format';

export default function FuncionariosManager({ funcionarios, saldoPorFuncionario, vendedoresConhecidos, onAdd, onDelete }) {
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    const nomeTrim = nome.trim();
    if (!nomeTrim) return;
    setSaving(true);
    await onAdd(nomeTrim);
    setSaving(false);
    setNome('');
  }

  return (
    <div className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold">Funcionários</h2>

      {funcionarios.length === 0 ? (
        <div className="text-center text-[#9aa3b2] text-sm py-6">Nenhum funcionário cadastrado ainda</div>
      ) : (
        <div>
          {funcionarios.map((f) => {
            const saldo = saldoPorFuncionario[f.id] ?? 0;
            return (
              <div key={f.id} className="flex justify-between items-center py-2.5 border-b border-[#2a2f3a] last:border-0 text-sm">
                <span className="font-semibold">{f.nome}</span>
                <span className="flex items-center gap-3">
                  <b className={saldo < 0 ? 'text-[#ff5c5c]' : 'text-[#3ddc84]'}>{fmtMoney(saldo)}</b>
                  <button
                    onClick={() => onDelete(f.id)}
                    title="Excluir"
                    className="w-auto bg-transparent text-[#9aa3b2] hover:text-[#ff5c5c] p-0 m-0 text-base"
                  >
                    ✕
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          list="vendedores-conhecidos-list"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do funcionário"
          className="flex-1 bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
        />
        <datalist id="vendedores-conhecidos-list">
          {vendedoresConhecidos.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={saving}
          className="w-auto bg-[#ff7a1a] hover:bg-[#ffb057] text-[#101114] font-bold rounded-lg px-4 py-2.5 text-sm disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>
      <p className="text-xs text-[#9aa3b2] -mt-2">
        Use o mesmo nome usado ao registrar os aluguéis, para o saldo de comissão ficar correto.
      </p>
    </div>
  );
}
