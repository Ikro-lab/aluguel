'use client';

import { useState } from 'react';
import { TEMPO_USO_OPCOES } from '@/lib/format';

const campoClasse = 'w-full bg-[#16213a] border border-[#22304d] rounded-lg px-3 py-2.5 text-[15px]';
const labelClasse = 'block text-xs text-[#8996b3] mb-1.5 font-medium';

export default function AgendamentoPublicoForm() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [tempoUso, setTempoUso] = useState(TEMPO_USO_OPCOES[0]);
  const [tipo, setTipo] = useState('retirada');
  const [endereco, setEndereco] = useState({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', cep: '', observacao: '' });
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(null);

  function setEnd(campo, valor) {
    setEndereco((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !telefone.trim() || !data || !hora) {
      setErro('Preencha nome, telefone, data e hora.');
      return;
    }
    if (tipo === 'entrega' && !endereco.rua.trim()) {
      setErro('Preencha o endereço para entrega.');
      return;
    }

    setSaving(true);
    try {
      const resp = await fetch('/api/agendamentos-publicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          telefone,
          email,
          data,
          hora,
          tempo_uso: tempoUso,
          tipo,
          endereco: tipo === 'entrega' ? endereco : null,
          observacoes,
        }),
      });
      const json = await resp.json();
      if (!json.ok) {
        setErro(json.error || 'Não foi possível agendar. Tente novamente.');
        setSaving(false);
        return;
      }
      setSucesso({ codigo: json.codigo_agendamento, data, hora, tempoUso, tipo });
    } catch {
      setErro('Não foi possível agendar. Verifique sua conexão e tente novamente.');
    }
    setSaving(false);
  }

  if (sucesso) {
    return (
      <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-6 text-center space-y-4">
        <div className="text-4xl">✅</div>
        <h2 className="text-lg font-bold">Agendamento enviado!</h2>
        <p className="text-sm text-[#8996b3]">
          Em breve entraremos em contato para confirmar. Guarde seu código:
        </p>
        <div className="bg-[#16213a] border border-[#22304d] rounded-lg py-3 text-2xl font-bold tracking-widest">
          {sucesso.codigo}
        </div>
        <div className="text-sm text-[#8996b3] space-y-1">
          <div>{new Date(`${sucesso.data}T00:00:00`).toLocaleDateString('pt-BR')} às {sucesso.hora}</div>
          <div>{sucesso.tempoUso}</div>
          <div>{sucesso.tipo === 'entrega' ? 'Entrega no endereço informado' : 'Retirada na loja'}</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClasse}>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className={campoClasse} />
        </div>
        <div>
          <label className={labelClasse}>Telefone/WhatsApp</label>
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" className={campoClasse} />
        </div>
      </div>

      <div>
        <label className={labelClasse}>E-mail (opcional)</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className={campoClasse} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClasse}>Data desejada</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} className={campoClasse} />
        </div>
        <div>
          <label className={labelClasse}>Horário desejado</label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={campoClasse} />
        </div>
      </div>

      <div>
        <label className={labelClasse}>Tempo de uso desejado</label>
        <select value={tempoUso} onChange={(e) => setTempoUso(e.target.value)} className={campoClasse}>
          {TEMPO_USO_OPCOES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasse}>Retirada ou entrega</label>
        <div className="flex gap-2">
          {[{ v: 'retirada', l: 'Retirar na loja' }, { v: 'entrega', l: 'Receber por entrega' }].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setTipo(o.v)}
              className={
                'flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold border ' +
                (tipo === o.v ? 'bg-[#3b82f6] border-[#3b82f6] text-[#f8fafc]' : 'bg-[#16213a] border-[#22304d] text-[#8996b3]')
              }
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {tipo === 'entrega' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#16213a] border border-[#22304d] rounded-lg p-3.5">
          <div className="sm:col-span-2">
            <label className={labelClasse}>Rua</label>
            <input value={endereco.rua} onChange={(e) => setEnd('rua', e.target.value)} className={campoClasse} />
          </div>
          <div>
            <label className={labelClasse}>Número</label>
            <input value={endereco.numero} onChange={(e) => setEnd('numero', e.target.value)} className={campoClasse} />
          </div>
          <div>
            <label className={labelClasse}>Complemento (opcional)</label>
            <input value={endereco.complemento} onChange={(e) => setEnd('complemento', e.target.value)} className={campoClasse} />
          </div>
          <div>
            <label className={labelClasse}>Bairro</label>
            <input value={endereco.bairro} onChange={(e) => setEnd('bairro', e.target.value)} className={campoClasse} />
          </div>
          <div>
            <label className={labelClasse}>Cidade</label>
            <input value={endereco.cidade} onChange={(e) => setEnd('cidade', e.target.value)} className={campoClasse} />
          </div>
          <div>
            <label className={labelClasse}>CEP</label>
            <input value={endereco.cep} onChange={(e) => setEnd('cep', e.target.value)} className={campoClasse} />
          </div>
          <div>
            <label className={labelClasse}>Ponto de referência (opcional)</label>
            <input value={endereco.observacao} onChange={(e) => setEnd('observacao', e.target.value)} placeholder="Ex: Portão azul" className={campoClasse} />
          </div>
        </div>
      )}

      <div>
        <label className={labelClasse}>Observações (opcional)</label>
        <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} className={campoClasse} />
      </div>

      {erro && (
        <div className="text-[#fca5a5] text-sm bg-[#241826] border border-[#f87171]/40 rounded-lg px-3 py-2">{erro}</div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-lg py-3 disabled:opacity-50"
      >
        {saving ? 'Enviando…' : 'Confirmar agendamento'}
      </button>
    </form>
  );
}
