import "./globals.css";
import RegisterSW from "./RegisterSW";

export const metadata = {
  title: "Controle de Aluguel de Motos",
  description: "Controle de aluguel de motos, comissão de vendedores e forma de pagamento",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aluguel Motos",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#ff7a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0f1115] text-[#eef0f4]">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
