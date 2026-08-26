'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Badge from '@/components/Badge';

const PAPEIS = [
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'mecanico', label: 'Mecânico' },
];

const CORES_PAPEL = { administrador: 'blue', vendedor: 'green', mecanico: 'amber' };
const LABEL_PAPEL = { administrador: 'Administrador', vendedor: 'Vendedor', mecanico: 'Mecânico' };

async function chamarApi(body) {
  const { data: { session } } = await supabase.auth.getSession();
  const resp = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
    body: JSON.stringify(body),
  });
  return resp.json();
}

function LinhaPerfil({ perfil }) {
  const [aberto, setAberto] = useState(false);
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    if (senha.length < 6) {
      setStatus('Mínimo 6 caracteres');
      return;
    }
    setSaving(true);
    const json = await chamarApi({ action: 'resetar_senha', userId: perfil.id, senha });
    setSaving(false);
    setStatus(json.ok ? 'Senha redefinida!' : json.error);
    if (json.ok) {
      setSenha('');
      setTimeout(() => setAberto(false), 1200);
    }
  }

  return (
    <div className="py-2.5 border-b border-[#22304d] last:border-0">
      <div className="flex justify-between items-center text-sm">
        <div>
          <div className="font-semibold">{perfil.nome}</div>
          <Badge label={LABEL_PAPEL[perfil.papel] || perfil.papel} color={CORES_PAPEL[perfil.papel] || 'gray'} />
        </div>
        {perfil.papel !== 'administrador' && (
          <button
            onClick={() => setAberto((o) => !o)}
            className="w-auto bg-transparent text-[#60a5fa] font-semibold text-xs"
          >
            {aberto ? 'fechar' : 'redefinir senha'}
          </button>
        )}
      </div>

      {aberto && (
        <form onSubmit={handleReset} className="flex gap-2 mt-2.5">
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Nova senha"
            className="flex-1 bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-auto bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg px-3 py-2 text-sm disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Confirmar'}
          </button>
        </form>
      )}
      {status && <div className="text-xs text-[#8996b3] mt-1.5">{status}</div>}
    </div>
  );
}

export default function UsuariosManager({ perfis, funcionarios, onCriado }) {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [papel, setPapel] = useState('vendedor');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [senha, setSenha] = useState('');
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setMsg('');
    if (!email.trim() || !nome.trim() || !senha) {
      setErro('Preencha e-mail, nome e senha');
      return;
    }

    setSaving(true);
    const json = await chamarApi({
      action: 'criar',
      email: email.trim(),
      senha,
      nome: nome.trim(),
      papel,
      funcionario_id: funcionarioId || null,
    });
    setSaving(false);

    if (!json.ok) {
      setErro(json.error);
      return;
    }
    setMsg('Conta criada! Repasse o e-mail e a senha pro funcionário.');
    setEmail('');
    setNome('');
    setSenha('');
    setFuncionarioId('');
    onCriado?.();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
        <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Convidar funcionário</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do funcionário"
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">E-mail de login</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="funcionario@email.com"
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Papel</label>
            <select
              value={papel}
              onChange={(e) => setPapel(e.target.value)}
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            >
              {PAPEIS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Vincular a um funcionário (opcional)</label>
            <select
              value={funcionarioId}
              onChange={(e) => setFuncionarioId(e.target.value)}
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            >
              <option value="">— nenhum —</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Senha temporária</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
          <p className="text-xs text-[#8996b3] mt-1.5">
            Repasse o e-mail e essa senha pro funcionário (ex: por WhatsApp).
          </p>
        </div>

        {erro && (
          <div className="text-[#fca5a5] text-sm bg-[#241826] border border-[#f87171]/40 rounded-lg px-3 py-2">{erro}</div>
        )}
        {msg && (
          <div className="text-[#34d399] text-sm bg-[#0f1729] border border-[#34d399]/40 rounded-lg px-3 py-2">{msg}</div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
        >
          {saving ? 'Criando…' : 'Criar conta'}
        </button>
      </form>

      <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
        <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Contas</h2>
        {perfis.length === 0 ? (
          <div className="text-center text-[#8996b3] text-sm py-6">Nenhuma conta ainda</div>
        ) : (
          perfis.map((p) => <LinhaPerfil key={p.id} perfil={p} />)
        )}
      </div>
    </>
  );
}
