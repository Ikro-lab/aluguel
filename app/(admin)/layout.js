import AdminGate from "@/components/AdminGate";
import { AuthProvider } from "@/lib/AuthProvider";

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminGate>{children}</AdminGate>
    </AuthProvider>
  );
}
