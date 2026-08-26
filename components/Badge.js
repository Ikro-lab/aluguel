'use client';

const CORES = {
  blue: 'bg-[#3b82f6]/15 text-[#60a5fa]',
  green: 'bg-[#34d399]/15 text-[#34d399]',
  amber: 'bg-[#f59e0b]/15 text-[#fbbf24]',
  red: 'bg-[#f87171]/15 text-[#fca5a5]',
  gray: 'bg-[#8996b3]/15 text-[#8996b3]',
};

export default function Badge({ label, color = 'gray' }) {
  return (
    <span className={'inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ' + (CORES[color] || CORES.gray)}>
      {label}
    </span>
  );
}
