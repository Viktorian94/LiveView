import { BaseAppLayout } from "@/components/layout/base-app-layout";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BaseAppLayout>{children}</BaseAppLayout>
    </AuthProvider>
  );
}
