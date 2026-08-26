import { supabase } from '@/lib/supabaseClient';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function gerarCodigo() {
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return codigo;
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });
  }

  const { nome, telefone, email, data, hora, tempo_uso, tipo, endereco, observacoes } = body;

  if (!nome?.trim() || !telefone?.trim() || !data || !hora || !tempo_uso || !tipo) {
    return Response.json({ ok: false, error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
  }
  if (tipo === 'entrega' && !endereco?.rua?.trim()) {
    return Response.json({ ok: false, error: 'Endereço obrigatório para entrega' }, { status: 400 });
  }

  const dataHora = new Date(`${data}T${hora}:00`);
  if (isNaN(dataHora.getTime()) || dataHora < new Date()) {
    return Response.json({ ok: false, error: 'Escolha uma data e hora futuras' }, { status: 400 });
  }

  const { data: clienteExistente } = await supabase
    .from('clientes')
    .select('id')
    .eq('telefone', telefone.trim())
    .limit(1)
    .maybeSingle();

  let clienteId = clienteExistente?.id;
  if (!clienteId) {
    const { data: novoCliente, error: erroCliente } = await supabase
      .from('clientes')
      .insert({ nome: nome.trim(), telefone: telefone.trim(), email: email?.trim() || null })
      .select('id')
      .single();
    if (erroCliente) {
      return Response.json({ ok: false, error: erroCliente.message }, { status: 500 });
    }
    clienteId = novoCliente.id;
  }

  const codigo_agendamento = gerarCodigo();

  const { error: erroAgendamento } = await supabase.from('agendamentos').insert({
    cliente_id: clienteId,
    tipo,
    data_hora: dataHora.toISOString(),
    status: 'aguardando_confirmacao',
    tempo_uso,
    endereco: tipo === 'entrega' ? endereco : null,
    observacao: observacoes?.trim() || null,
    codigo_agendamento,
  });

  if (erroAgendamento) {
    return Response.json({ ok: false, error: erroAgendamento.message }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY && process.env.LOJISTA_EMAIL) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const origin = new URL(request.url).origin;
      const enderecoTexto = endereco
        ? [endereco.rua, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.cep]
            .filter(Boolean)
            .join(', ')
        : null;

      await resend.emails.send({
        from: 'ERP Bikes Elétricas <onboarding@resend.dev>',
        to: process.env.LOJISTA_EMAIL,
        subject: `Novo agendamento: ${nome} — ${data} às ${hora}`,
        html: `
          <p><b>Cliente:</b> ${nome} — ${telefone}${email ? ` — ${email}` : ''}</p>
          <p><b>Data/hora:</b> ${data} às ${hora}</p>
          <p><b>Duração desejada:</b> ${tempo_uso}</p>
          <p><b>Modo:</b> ${tipo === 'entrega' ? 'Entrega' : 'Retirada na loja'}</p>
          ${enderecoTexto ? `<p><b>Endereço:</b> ${enderecoTexto}${endereco?.observacao ? ` (${endereco.observacao})` : ''}</p>` : ''}
          ${observacoes ? `<p><b>Observações:</b> ${observacoes}</p>` : ''}
          <p><b>Código do agendamento:</b> ${codigo_agendamento}</p>
          <p><a href="${origin}/agenda">Abrir agenda no ERP para confirmar</a></p>
        `,
      });
    } catch (e) {
      console.warn('Falha ao enviar e-mail de notificação:', e.message);
    }
  }

  return Response.json({ ok: true, codigo_agendamento });
}
