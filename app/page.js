'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import NovoAluguelForm from '@/components/NovoAluguelForm';
import TiposManager from '@/components/TiposManager';
import ResumoCards from '@/components/ResumoCards';
import VendorRanking from '@/components/VendorRanking';
import HistoricoTable from '@/components/HistoricoTable';

export default function Home() {
  const [tipos, setTipos] = useState([]);
  const [alugueis, setAlugueis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  const carregarTudo = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setErro('configuração ausente');
      setLoading(false);
      return;
    }
    setLoading(true);
    setErro(null);
    const [tiposRes, alugueisRes] = await Promise.all([
      supabase.from('tipos_aluguel').select('*').order('valor_base', { ascending: true }),
      supabase.from('alugueis').select('*').order('created_at', { ascending: false }),
    ]);

    if (tiposRes.error || alugueisRes.error) {
      setErro((tiposRes.error || alugueisRes.error).message);
    } else {
      setTipos(tiposRes.data || []);
      setAlugueis(alugueisRes.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregarTudo();

    // Realtime: mantém sincronizado se outro dispositivo/vendedor mexer nos dados
    const channel = supabase
      .channel('controle-motos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alugueis' }, () => carregarTudo())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tipos_aluguel' }, () => carregarTudo())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [carregarTudo]);

  const vendedoresConhecidos = useMemo(() => {
    const set = new Set(alugueis.map((a) => a.vendedor));
    return Array.from(set).sort();
  }, [alugueis]);

  async function handleAddAluguel(registro) {
    const { error } = await supabase.from('alugueis').insert(registro);
    if (error) {
      showToast('Erro ao salvar: ' + error.message);
      return;
    }
    showToast('Aluguel registrado');
    carregarTudo();
  }

  async function handleDeleteAluguel(id) {
    const { error } = await supabase.from('alugueis').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Registro removido');
    carregarTudo();
  }

  async function handleAddTipo(tipo) {
    const { error } = await supabase.from('tipos_aluguel').insert(tipo);
    if (error) {
      showToast('Erro ao adicionar tipo: ' + error.message);
      return;
    }
    showToast('Tipo adicionado');
    carregarTudo();
  }

  async function handleUpdateTipo(id, patch) {
    const { error } = await supabase.from('tipos_aluguel').update(patch).eq('id', id);
    if (error) {
      showToast('Erro ao atualizar tipo: ' + error.message);
      return;
    }
    showToast('Tipo atualizado');
    carregarTudo();
  }

  async function handleDeleteTipo(id) {
    if (tipos.length <= 1) {
      showToast('Mantenha ao menos um tipo cadastrado');
      return;
    }
    const { error } = await supabase.from('tipos_aluguel').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir tipo: ' + error.message);
      return;
    }
    showToast('Tipo removido (histórico é mantido)');
    carregarTudo();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">🏍️ Controle de Aluguel de Motos</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">
          Cadastre seus tipos de aluguel e valores base — o excedente cobrado é a comissão do vendedor
        </p>
      </div>

      {erro && (
        <div className="bg-[#241826] border border-[#f87171]/40 text-[#fca5a5] rounded-xl p-4 text-sm">
          {erro === 'configuração ausente' ? (
            <>Supabase ainda não configurado.</>
          ) : (
            <>Não foi possível conectar ao Supabase: {erro}</>
          )}
          <br />
          Verifique se <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> estão
          configuradas (arquivo <code>.env.local</code> local ou variáveis de ambiente na Vercel) e se o script{' '}
          <code>supabase/schema.sql</code> foi executado no seu projeto Supabase.
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#8996b3] text-sm py-10">Carregando…</div>
      ) : (
        <>
          <NovoAluguelForm tipos={tipos} vendedoresConhecidos={vendedoresConhecidos} onSubmit={handleAddAluguel} />
          <TiposManager tipos={tipos} onAdd={handleAddTipo} onUpdate={handleUpdateTipo} onDelete={handleDeleteTipo} />
          <ResumoCards alugueis={alugueis} />
          <VendorRanking alugueis={alugueis} />
          <HistoricoTable alugueis={alugueis} vendedoresConhecidos={vendedoresConhecidos} onDelete={handleDeleteAluguel} />
        </>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#34d399] text-[#08130c] px-4 py-2.5 rounded-lg text-[13px] font-bold shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
