import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Entrar — Freitas Bikes',
};

export default function LoginPage() {
  return (
    <main className="max-w-sm mx-auto px-4 py-16 space-y-5 w-full">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight">🛵 Freitas Bikes</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Entre com seu e-mail e senha</p>
      </div>
      <LoginForm />
    </main>
  );
}
