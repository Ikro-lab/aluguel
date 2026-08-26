import "./globals.css";
import RegisterSW from "./RegisterSW";

export const metadata = {
  title: "ERP Bikes Elétricas",
  description: "Aluguel, frota, agendamentos e manutenção de bikes elétricas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bikes Elét.",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#070d1a] text-[#e7ecf7]">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
