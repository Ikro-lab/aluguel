import RedefinirSenhaForm from '@/components/RedefinirSenhaForm';

export const metadata = {
  title: 'Nova senha — Freitas Bikes',
};

export default function RedefinirSenhaPage() {
  return (
    <main className="max-w-sm mx-auto px-4 py-16 space-y-5 w-full">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight">🛵 Freitas Bikes</h1>
        <p className="text-[13px] text-[#8996b3] mt-1">Crie uma nova senha</p>
      </div>
      <RedefinirSenhaForm />
    </main>
  );
}
