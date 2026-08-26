'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';

const LINKS = [
  { href: '/', label: 'Início', papeis: ['administrador', 'vendedor'] },
  { href: '/agenda', label: 'Agenda', papeis: ['administrador', 'vendedor', 'mecanico'] },
  { href: '/frota', label: 'Frota', papeis: ['administrador', 'vendedor', 'mecanico'] },
  { href: '/manutencao', label: 'Manutenção', papeis: ['administrador', 'vendedor', 'mecanico'] },
  { href: '/clientes', label: 'Clientes', papeis: ['administrador', 'vendedor', 'mecanico'] },
  { href: '/faturamento', label: 'Faturamento', papeis: ['administrador'] },
  { href: '/despesas', label: 'Despesas', papeis: ['administrador'] },
  { href: '/funcionarios', label: 'Funcionários', papeis: ['administrador'] },
  { href: '/usuarios', label: 'Usuários', papeis: ['administrador'] },
];

export default function NavBar() {
  const pathname = usePathname();
  const { perfil, signOut } = useAuth();
  const papel = perfil?.papel;

  const links = LINKS.filter((l) => !papel || l.papeis.includes(papel));

  return (
    <nav className="sticky top-0 z-10 bg-[#070d1a]/95 backdrop-blur border-b border-[#22304d]">
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                'whitespace-nowrap px-3.5 py-3 text-sm font-semibold border-b-2 transition-colors ' +
                (active
                  ? 'border-[#3b82f6] text-[#60a5fa]'
                  : 'border-transparent text-[#8996b3] hover:text-[#e7ecf7]')
              }
            >
              {l.label}
            </Link>
          );
        })}
        <div className="flex-1" />
        {perfil && (
          <div className="flex items-center gap-2 whitespace-nowrap pl-2">
            <span className="text-xs text-[#8996b3] hidden sm:inline">{perfil.nome}</span>
            <button
              onClick={signOut}
              className="w-auto bg-transparent text-[#8996b3] hover:text-[#f87171] text-xs font-semibold px-2 py-3"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
