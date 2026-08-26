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
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Funcionários</h2>

      {funcionarios.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-6">Nenhum funcionário cadastrado ainda</div>
      ) : (
        <div>
          {funcionarios.map((f) => {
            const saldo = saldoPorFuncionario[f.id] ?? 0;
            return (
              <div key={f.id} className="flex justify-between items-center py-2.5 border-b border-[#22304d] last:border-0 text-sm">
                <span className="font-semibold">{f.nome}</span>
                <span className="flex items-center gap-3">
                  <b className={saldo < 0 ? 'text-[#f87171]' : 'text-[#34d399]'}>{fmtMoney(saldo)}</b>
                  <button
                    onClick={() => onDelete(f.id)}
                    title="Excluir"
                    className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base"
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
          className="flex-1 bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
        />
        <datalist id="vendedores-conhecidos-list">
          {vendedoresConhecidos.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={saving}
          className="w-auto bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg px-4 py-2.5 text-sm disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>
      <p className="text-xs text-[#8996b3] -mt-2">
        Use o mesmo nome usado ao registrar os aluguéis, para o saldo de comissão ficar correto.
      </p>
    </div>
  );
}
