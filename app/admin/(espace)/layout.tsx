import { AdminHeader } from "@/features/admin/admin-header";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <AdminHeader />
      <main id="contenu" className="flex-1 pb-24 lg:pb-16">
        {children}
      </main>
    </>
  );
}
