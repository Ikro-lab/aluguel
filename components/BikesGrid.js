'use client';

import { STATUS_BIKE } from '@/lib/format';
import Badge from '@/components/Badge';

const DIAS_ALERTA_MANUTENCAO = 90;

function precisaRevisao(bike, ordensServico) {
  const concluidas = ordensServico
    .filter((os) => os.bike_id === bike.id && os.status === 'concluida' && os.concluida_em)
    .sort((a, b) => new Date(b.concluida_em) - new Date(a.concluida_em));

  const referencia = concluidas[0]?.concluida_em || bike.created_at;
  const dias = (Date.now() - new Date(referencia).getTime()) / (1000 * 60 * 60 * 24);
  return dias > DIAS_ALERTA_MANUTENCAO;
}

export default function BikesGrid({ bikes, ordensServico, onUpdate, onDelete }) {
  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Frota</h2>

      {bikes.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhuma bike cadastrada ainda</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bikes.map((b) => {
            const statusInfo = STATUS_BIKE.find((s) => s.value === b.status) || STATUS_BIKE[0];
            const alerta = precisaRevisao(b, ordensServico);
            return (
              <div key={b.id} className="bg-[#16213a] border border-[#22304d] rounded-lg p-3.5">
                <div className="flex gap-3">
                  {b.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.foto_url} alt={b.modelo} className="w-16 h-16 rounded-md object-cover bg-[#22304d]" />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-[#22304d] flex items-center justify-center text-2xl">🛵</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-semibold truncate">{b.modelo}</div>
                      <button
                        onClick={() => onDelete(b.id)}
                        title="Excluir"
                        className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-[#8996b3] text-xs">{b.patrimonio || '—'}</div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge label={statusInfo.label} color={statusInfo.color} />
                      {alerta && <Badge label="Revisão recomendada" color="amber" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="text-[#8996b3]">Km: </span>
                    {b.km_atual ?? '—'}
                  </div>
                  <div>
                    <span className="text-[#8996b3]">Bateria: </span>
                    {b.nivel_bateria != null ? `${b.nivel_bateria}%` : '—'}
                  </div>
                </div>

                <select
                  value={b.status}
                  onChange={(e) => onUpdate(b.id, { status: e.target.value })}
                  className="w-full mt-3 bg-[#22304d] border border-[#22304d] rounded-md px-2.5 py-2 text-xs"
                >
                  {STATUS_BIKE.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
