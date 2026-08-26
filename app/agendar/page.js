import AgendamentoPublicoForm from '@/components/AgendamentoPublicoForm';

export const metadata = {
  title: 'Agendar bike elétrica — Freitas Bikes',
};

export default function AgendarPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-8 pb-16 space-y-5 w-full">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight">🛵 Freitas Bikes</h1>
        <p className="text-sm text-[#8996b3] mt-1">Agende sua bike elétrica</p>
        <p className="text-[13px] text-[#8996b3] mt-1">
          Preencha os dados abaixo — vamos confirmar seu horário em breve
        </p>
      </div>
      <AgendamentoPublicoForm />
    </main>
  );
}
