import { Metadata } from "next";
import AdminGuard from "@/components/admin/AdminGuard";

export const metadata: Metadata = {
  title: "Admin Panel | Personal Website",
  description: "Protected admin area for managing portfolio content",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
