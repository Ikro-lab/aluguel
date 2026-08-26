import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function exigirAdministrador(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;

  const { data: userData, error: erroUser } = await supabaseAdmin.auth.getUser(token);
  if (erroUser || !userData?.user) return null;

  const { data: perfil } = await supabaseAdmin
    .from('perfis')
    .select('papel')
    .eq('id', userData.user.id)
    .maybeSingle();

  return perfil?.papel === 'administrador' ? userData.user : null;
}

export async function POST(request) {
  const admin = await exigirAdministrador(request);
  if (!admin) {
    return Response.json({ ok: false, error: 'Apenas administradores podem gerenciar usuários' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.action) {
    return Response.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });
  }

  if (body.action === 'criar') {
    const { email, senha, nome, papel, funcionario_id } = body;
    if (!email?.trim() || !senha || senha.length < 6 || !nome?.trim() || !['vendedor', 'mecanico'].includes(papel)) {
      return Response.json({ ok: false, error: 'Preencha e-mail, nome, papel e uma senha com 6+ caracteres' }, { status: 400 });
    }

    const { data: novoUsuario, error: erroCriar } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: senha,
      email_confirm: true,
    });
    if (erroCriar) {
      return Response.json({ ok: false, error: erroCriar.message }, { status: 400 });
    }

    const { error: erroPerfil } = await supabaseAdmin.from('perfis').insert({
      id: novoUsuario.user.id,
      papel,
      funcionario_id: funcionario_id || null,
      nome: nome.trim(),
    });
    if (erroPerfil) {
      return Response.json({ ok: false, error: erroPerfil.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  }

  if (body.action === 'resetar_senha') {
    const { userId, senha } = body;
    if (!userId || !senha || senha.length < 6) {
      return Response.json({ ok: false, error: 'Senha precisa ter 6+ caracteres' }, { status: 400 });
    }
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: senha });
    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 400 });
    }
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: 'Ação desconhecida' }, { status: 400 });
}
