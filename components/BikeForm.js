'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BikeForm({ onSubmit }) {
  const [modelo, setModelo] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [nivelBateria, setNivelBateria] = useState('');
  const [foto, setFoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    const modeloTrim = modelo.trim();
    if (!modeloTrim) return;

    setSaving(true);

    let foto_url = null;
    if (foto) {
      const caminho = `${Date.now()}-${foto.name}`;
      const { error: uploadError } = await supabase.storage.from('bikes-fotos').upload(caminho, foto);
      if (uploadError) {
        setErro('Erro ao enviar foto: ' + uploadError.message);
        setSaving(false);
        return;
      }
      foto_url = supabase.storage.from('bikes-fotos').getPublicUrl(caminho).data.publicUrl;
    }

    await onSubmit({
      modelo: modeloTrim,
      patrimonio: patrimonio.trim() || null,
      km_atual: kmAtual ? Number(kmAtual) : null,
      nivel_bateria: nivelBateria ? Number(nivelBateria) : null,
      foto_url,
    });

    setSaving(false);
    setModelo('');
    setPatrimonio('');
    setKmAtual('');
    setNivelBateria('');
    setFoto(null);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Nova bike</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Modelo</label>
          <input
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Ex: Scooter X200"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Patrimônio/Série</label>
          <input
            value={patrimonio}
            onChange={(e) => setPatrimonio(e.target.value)}
            placeholder="Ex: BK-014"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Km atual (opcional)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={kmAtual}
            onChange={(e) => setKmAtual(e.target.value)}
            placeholder="0"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Nível de bateria % (opcional)</label>
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={nivelBateria}
            onChange={(e) => setNivelBateria(e.target.value)}
            placeholder="100"
            className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Foto (opcional)</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFoto(e.target.files?.[0] || null)}
          className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[13px] file:mr-3 file:bg-[#22304d] file:text-[#e7ecf7] file:border-0 file:rounded-md file:px-2.5 file:py-1.5"
        />
      </div>

      {erro && (
        <div className="text-[#fca5a5] text-xs bg-[#241826] border border-[#f87171]/40 rounded-lg px-3 py-2">
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Salvando…' : 'Cadastrar bike'}
      </button>
    </form>
  );
}
