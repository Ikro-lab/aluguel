'use client';

import { useState } from 'react';

export default function OrdemServicoForm({ bikes, funcionarios, onSubmit }) {
  const [bikeId, setBikeId] = useState(bikes[0]?.id || '');
  const [mecanico, setMecanico] = useState('');
  const [problema, setProblema] = useState('');
  const [pecasUsadas, setPecasUsadas] = useState('');
  const [custo, setCusto] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const bikeIdSel = bikeId || bikes[0]?.id;
    const problemaTrim = problema.trim();
    if (!bikeIdSel || !problemaTrim) return;

    setSaving(true);
    await onSubmit({
      bike_id: bikeIdSel,
      mecanico: mecanico.trim() || null,
      problema: problemaTrim,
      pecas_usadas: pecasUsadas.trim() || null,
      custo: custo ? Number(custo) : 0,
    });
    setSaving(false);
    setProblema('');
    setPecasUsadas('');
    setCusto('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold">Nova ordem de serviço</h2>

      {bikes.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-6">Cadastre uma bike na Frota antes de abrir uma OS</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Bike</label>
              <select
                value={bikeId || bikes[0]?.id}
                onChange={(e) => setBikeId(e.target.value)}
                className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
              >
                {bikes.map((b) => (
                  <option key={b.id} value={b.id}>{b.modelo}{b.patrimonio ? ` — ${b.patrimonio}` : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Mecânico</label>
              <input
                list="mecanicos-list"
                value={mecanico}
                onChange={(e) => setMecanico(e.target.value)}
                placeholder="Nome do mecânico"
                className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
              />
              <datalist id="mecanicos-list">
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.nome} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Problema relatado</label>
            <input
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              placeholder="Ex: Freio traseiro não responde"
              className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Peças usadas (opcional)</label>
              <input
                value={pecasUsadas}
                onChange={(e) => setPecasUsadas(e.target.value)}
                placeholder="Ex: Pastilha de freio"
                className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8996b3] mb-1.5 font-medium">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Abrir ordem de serviço'}
          </button>
        </>
      )}
    </form>
  );
}
