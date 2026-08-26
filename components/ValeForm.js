'use client';

import { useMemo, useState } from 'react';
import { fmtMoney } from '@/lib/format';

export default function ValeForm({ funcionarios, saldoPorFuncionario, onSubmit }) {
  const [funcionarioId, setFuncionarioId] = useState(funcionarios[0]?.id || '');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

  const idSelecionado = funcionarioId || funcionarios[0]?.id || '';
  const saldoDisponivel = saldoPorFuncionario[idSelecionado] ?? 0;
  const valorNum = Number(valor);

  const excedeSaldo = useMemo(
    () => !isNaN(valorNum) && valorNum > 0 && valorNum > saldoDisponivel,
    [valorNum, saldoDisponivel]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!idSelecionado) return;
    if (!valor || isNaN(valorNum) || valorNum <= 0) return;
    if (excedeSaldo) {
      setErro('Valor maior que o saldo disponível do funcionário');
      return;
    }

    setSaving(true);
    await onSubmit({
      funcionario_id: idSelecionado,
      valor: valorNum,
      descricao: descricao.trim() || null,
    });
    setSaving(false);
    setValor('');
    setDescricao('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#171a21] border border-[#2a2f3a] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#9aa3b2] font-semibold">Vale / Adiantamento</h2>

      {funcionarios.length === 0 ? (
        <div className="text-center text-[#9aa3b2] text-sm py-6">Cadastre um funcionário antes de registrar um vale</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#9aa3b2] mb-1.5 font-medium">Funcionário</label>
              <select
                value={idSelecionado}
                onChange={(e) => setFuncionarioId(e.target.value)}
                className="w-full bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
              >
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
              <div className="text-xs text-[#9aa3b2] mt-1.5">
                Saldo disponível: <b className={saldoDisponivel < 0 ? 'text-[#ff5c5c]' : 'text-[#3ddc84]'}>{fmtMoney(saldoDisponivel)}</b>
              </div>
            </div>

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
          </div>

          <div>
            <label className="block text-xs text-[#9aa3b2] mb-1.5 font-medium">Descrição (opcional)</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Adiantamento quinzenal"
              className="w-full bg-[#1e222b] border border-[#2a2f3a] rounded-lg px-3 py-2.5 text-[15px]"
            />
          </div>

          {(erro || excedeSaldo) && (
            <div className="text-[#ff9a9a] text-xs bg-[#2a1616] border border-[#ff5c5c]/40 rounded-lg px-3 py-2">
              {erro || 'Valor maior que o saldo disponível do funcionário'}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || excedeSaldo}
            className="w-full bg-[#ff7a1a] hover:bg-[#ffb057] text-[#101114] font-bold rounded-lg py-3 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Registrar vale'}
          </button>
        </>
      )}
    </form>
  );
}
