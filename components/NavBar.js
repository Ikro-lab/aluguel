'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Início' },
  { href: '/faturamento', label: 'Faturamento' },
  { href: '/despesas', label: 'Despesas' },
  { href: '/funcionarios', label: 'Funcionários' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 bg-[#0f1115]/95 backdrop-blur border-b border-[#2a2f3a]">
      <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                'whitespace-nowrap px-3.5 py-3 text-sm font-semibold border-b-2 transition-colors ' +
                (active
                  ? 'border-[#ff7a1a] text-[#ffb057]'
                  : 'border-transparent text-[#9aa3b2] hover:text-[#eef0f4]')
              }
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
