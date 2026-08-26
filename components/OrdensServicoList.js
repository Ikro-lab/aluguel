'use client';

import { STATUS_OS, fmtMoney } from '@/lib/format';
import Badge from '@/components/Badge';

export default function OrdensServicoList({ ordensServico, bikes, onAvancar, onDelete }) {
  const nomeBike = (id) => {
    const b = bikes.find((x) => x.id === id);
    return b ? b.modelo + (b.patrimonio ? ` — ${b.patrimonio}` : '') : '—';
  };

  const grupos = STATUS_OS.map((s) => ({
    ...s,
    itens: ordensServico.filter((os) => os.status === s.value).sort((a, b) => new Date(b.aberta_em) - new Date(a.aberta_em)),
  }));

  const proximoStatus = { aberta: 'em_andamento', em_andamento: 'concluida' };
  const rotuloAcao = { aberta: 'Iniciar', em_andamento: 'Concluir' };

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-3">Ordens de serviço</h2>

      {ordensServico.length === 0 ? (
        <div className="text-center text-[#8996b3] text-sm py-8">Nenhuma ordem de serviço registrada</div>
      ) : (
        <div className="space-y-5">
          {grupos.map((g) => (
            <div key={g.value}>
              <div className="flex items-center gap-2 mb-2">
                <Badge label={g.label} color={g.color} />
                <span className="text-[#8996b3] text-xs">{g.itens.length}</span>
              </div>
              {g.itens.length === 0 ? (
                <div className="text-[#8996b3] text-xs pl-1">Nenhuma</div>
              ) : (
                <div className="space-y-2">
                  {g.itens.map((os) => (
                    <div key={os.id} className="bg-[#16213a] border border-[#22304d] rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-semibold">{nomeBike(os.bike_id)}</div>
                        <button
                          onClick={() => onDelete(os.id)}
                          title="Excluir"
                          className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] p-0 m-0 text-base shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-[#8996b3] text-xs mt-0.5">{os.problema}</div>
                      {os.pecas_usadas && <div className="text-[#8996b3] text-xs">Peças: {os.pecas_usadas}</div>}
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-[#8996b3]">{os.mecanico || 'Sem mecânico definido'}</span>
                        <b>{fmtMoney(os.custo)}</b>
                      </div>
                      {proximoStatus[os.status] && (
                        <button
                          onClick={() => onAvancar(os.id, proximoStatus[os.status])}
                          className="w-auto mt-2.5 bg-[#22304d] hover:bg-[#2c3b5e] text-[#e7ecf7] font-semibold rounded-md px-3 py-1.5 text-xs"
                        >
                          {rotuloAcao[os.status]}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
