'use client';

import { useCallback, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRealtimeTable } from '@/lib/useRealtimeTable';
import FuncionariosManager from '@/components/FuncionariosManager';
import ValeForm from '@/components/ValeForm';
import ValesTable from '@/components/ValesTable';

export default function FuncionariosPage() {
  const { data: funcionarios, loading: loadingFuncionarios, erro: erroFuncionarios, reload: reloadFuncionarios } = useRealtimeTable('funcionarios', {
    orderBy: 'nome',
    ascending: true,
  });
  const { data: alugueis, loading: loadingAlugueis, erro: erroAlugueis } = useRealtimeTable('alugueis');
  const { data: vales, loading: loadingVales, erro: erroVales, reload: reloadVales } = useRealtimeTable('vales');
  const [toast, setToast] = useState('');

  const loading = loadingFuncionarios || loadingAlugueis || loadingVales;
  const erro = erroFuncionarios || erroAlugueis || erroVales;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  const vendedoresConhecidos = useMemo(() => {
    const set = new Set(alugueis.map((a) => a.vendedor));
    return Array.from(set).sort();
  }, [alugueis]);

  const saldoPorFuncionario = useMemo(() => {
    const mapa = {};
    funcionarios.forEach((f) => {
      const comissoes = alugueis
        .filter((a) => a.vendedor === f.nome)
        .reduce((s, a) => s + Number(a.comissao), 0);
      const totalVales = vales
        .filter((v) => v.funcionario_id === f.id)
        .reduce((s, v) => s + Number(v.valor), 0);
      mapa[f.id] = comissoes - totalVales;
    });
    return mapa;
  }, [funcionarios, alugueis, vales]);

  async function handleAddFuncionario(nome) {
    const { error } = await supabase.from('funcionarios').insert({ nome });
    if (error) {
      showToast('Erro ao adicionar: ' + error.message);
      return;
    }
    showToast('Funcionário adicionado');
    reloadFuncionarios();
  }

  async function handleDeleteFuncionario(id) {
    const { error } = await supabase.from('funcionarios').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Funcionário removido');
    reloadFuncionarios();
  }

  async function handleAddVale(vale) {
    const { error } = await supabase.from('vales').insert(vale);
    if (error) {
      showToast('Erro ao registrar vale: ' + error.message);
      return;
    }
    showToast('Vale registrado');
    reloadVales();
  }

  async function handleDeleteVale(id) {
    const { error } = await supabase.from('vales').delete().eq('id', id);
    if (error) {
      showToast('Erro ao excluir: ' + error.message);
      return;
    }
    showToast('Vale removido');
    reloadVales();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-16 space-y-5 w-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight">👥 Funcionários</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">
          Saldo de comissão por funcionário e registro de vale/adiantamento
        </p>
      </div>

      {erro && (
        <div className="bg-[#241826] border border-[#f87171]/40 text-[#fca5a5] rounded-xl p-4 text-sm">
          Não foi possível carregar os dados: {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#8996b3] text-sm py-10">Carregando…</div>
      ) : (
        <>
          <FuncionariosManager
            funcionarios={funcionarios}
            saldoPorFuncionario={saldoPorFuncionario}
            vendedoresConhecidos={vendedoresConhecidos}
            onAdd={handleAddFuncionario}
            onDelete={handleDeleteFuncionario}
          />
          <ValeForm funcionarios={funcionarios} saldoPorFuncionario={saldoPorFuncionario} onSubmit={handleAddVale} />
          <ValesTable vales={vales} funcionarios={funcionarios} onDelete={handleDeleteVale} />
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
