'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Página de destino do link "Esqueci minha senha". O Supabase coloca o token
// de recuperação na URL e o client cria a sessão sozinho (detectSessionInUrl);
// aqui só esperamos essa sessão aparecer e chamamos updateUser.
function linkComErro() {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1));
  return Boolean(params.get('error'));
}

export default function RedefinirSenhaForm() {
  // verificando | pronto | invalido
  const [estado, setEstado] = useState('verificando');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, s) => {
      if (s && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        setEstado('pronto');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (linkComErro()) {
        setEstado('invalido');
        return;
      }
      setEstado((atual) => (session ? 'pronto' : atual === 'verificando' ? 'invalido' : atual));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (senha.length < 6) {
      setErro('A senha precisa ter 6+ caracteres');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não conferem');
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setSaving(false);
      setErro(error.message);
      return;
    }

    const { data: perfil } = await supabase.from('perfis').select('papel').eq('id', data.user.id).maybeSingle();
    setSaving(false);
    router.replace(perfil?.papel === 'mecanico' ? '/manutencao' : '/');
  }

  if (estado === 'verificando') {
    return <div className="text-center text-[#8996b3] text-sm py-10">Verificando link…</div>;
  }

  if (estado === 'invalido') {
    return (
      <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4 text-center">
        <p className="text-sm text-[#fca5a5]">Esse link é inválido ou expirou.</p>
        <button
          type="button"
          onClick={() => router.replace('/login')}
          className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3"
        >
          Pedir um novo link
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <div>
        <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Nova senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Confirme a nova senha</label>
        <input
          type="password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
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
        {saving ? 'Salvando…' : 'Salvar nova senha'}
      </button>
    </form>
  );
}
