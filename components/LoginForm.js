'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [saving, setSaving] = useState(false);
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function handleRecuperar(e) {
    e.preventDefault();
    setErro('');
    setMsg('');
    if (!email.trim()) {
      setErro('Digite seu e-mail');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setSaving(false);
    if (error) {
      setErro('Não foi possível enviar o e-mail. Tente novamente em alguns minutos.');
      return;
    }
    // Mensagem genérica de propósito: não revela se o e-mail tem conta ou não.
    setMsg('Se esse e-mail tiver conta, você vai receber um link para criar uma nova senha.');
  }

  function alternarModo() {
    setModoRecuperar(!modoRecuperar);
    setErro('');
    setMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSaving(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    if (error) {
      setSaving(false);
      setErro('E-mail ou senha incorretos');
      return;
    }

    const { data: perfil } = await supabase.from('perfis').select('papel').eq('id', data.user.id).maybeSingle();
    setSaving(false);
    router.push(perfil?.papel === 'mecanico' ? '/manutencao' : '/');
  }

  if (modoRecuperar) {
    return (
      <form onSubmit={handleRecuperar} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
        <p className="text-[13px] text-[#8996b3]">
          Digite o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.
        </p>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            autoFocus
          />
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
          {saving ? 'Enviando…' : 'Enviar link'}
        </button>
        <button type="button" onClick={alternarModo} className="w-full text-[13px] text-[#8996b3] hover:text-[#f8fafc]">
          Voltar para o login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <div>
        <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
        />
      </div>

      {erro && (
        <div className="text-[#fca5a5] text-sm bg-[#241826] border border-[#f87171]/40 rounded-lg px-3 py-2">{erro}</div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Entrando…' : 'Entrar'}
      </button>
      <button type="button" onClick={alternarModo} className="w-full text-[13px] text-[#8996b3] hover:text-[#f8fafc]">
        Esqueci minha senha
      </button>
    </form>
  );
}
