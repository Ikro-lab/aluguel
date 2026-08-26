import "./globals.css";
import RegisterSW from "./RegisterSW";
import NavBar from "@/components/NavBar";

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
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#070d1a] text-[#e7ecf7]">
        <NavBar />
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
