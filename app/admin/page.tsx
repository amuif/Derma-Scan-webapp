import { AppLayout } from "@/components/layout/app-layout";
import { AdminInterface } from "@/components/admin/admin-interface";

export default function AdminPage() {
  return (
    <AppLayout>
      {/* <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage clinic approvals, users, content, and system analytics
          </p>
        </div> */}
        <AdminInterface />
     
    </AppLayout>
  );
}
