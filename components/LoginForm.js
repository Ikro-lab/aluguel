'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSaving(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setSaving(false);
    if (error) {
      setErro('E-mail ou senha incorretos');
      return;
    }
    router.push('/');
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
    </form>
  );
}
