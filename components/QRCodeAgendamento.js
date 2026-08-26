'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeAgendamento() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const link = `${window.location.origin}/agendar`;
    setUrl(link);
    QRCode.toDataURL(link, { width: 320, margin: 1, color: { dark: '#070d1a', light: '#ffffff' } }).then(setDataUrl);
  }, [open]);

  async function copiarLink() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div className="bg-[#0f1729] border border-[#22304d] rounded-2xl p-5">
      <h2 className="text-xs uppercase tracking-wide text-[#8996b3] font-semibold mb-1">
        Agendamento público
        <button
          onClick={() => setOpen((o) => !o)}
          className="float-right normal-case tracking-normal text-[#60a5fa] font-semibold w-auto"
          style={{ background: 'none', padding: 0, margin: 0 }}
        >
          {open ? 'fechar ▴' : 'gerar QR code ▾'}
        </button>
      </h2>

      {open && (
        <div className="mt-4 flex flex-col items-center gap-3">
          {dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR code de agendamento" className="rounded-lg" />
          )}
          <div className="text-xs text-[#8996b3] break-all text-center">{url}</div>
          <div className="flex gap-2 w-full">
            <button
              onClick={copiarLink}
              className="flex-1 bg-[#22304d] hover:bg-[#2c3b5e] text-[#e7ecf7] font-semibold rounded-md px-3 py-2 text-sm"
            >
              {copiado ? 'Copiado!' : 'Copiar link'}
            </button>
            {dataUrl && (
              <a
                href={dataUrl}
                download="qrcode-agendamento.png"
                className="flex-1 bg-[#3b82f6] hover:bg-[#60a5fa] text-[#f8fafc] font-bold rounded-md px-3 py-2 text-sm text-center"
              >
                Baixar PNG
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
