"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  ClipboardList,
  CheckCircle,
  Users,
  Tag,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const authorNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Submissions", href: "/dashboard/submissions", icon: FileText },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const reviewerNav: NavItem[] = [
  { title: "Dashboard", href: "/reviewer", icon: LayoutDashboard },
  { title: "Pending Reviews", href: "/reviewer/pending", icon: ClipboardList },
  { title: "Completed Reviews", href: "/reviewer/completed", icon: CheckCircle },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Papers", href: "/admin/papers", icon: FileText },
  { title: "Categories", href: "/admin/categories", icon: Tag },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

function getNavForPath(pathname: string): { items: NavItem[]; label: string } {
  if (pathname.startsWith("/admin")) return { items: adminNav, label: "Admin" };
  if (pathname.startsWith("/reviewer")) return { items: reviewerNav, label: "Reviewer" };
  return { items: authorNav, label: "Author" };
}

export function SidebarNav() {
  const pathname = usePathname();
  const { items, label } = getNavForPath(pathname);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <span className="font-serif text-lg font-bold text-primary">RV</span>
          <span className="text-sm text-muted-foreground hidden group-data-[collapsible=icon]:hidden">
            Paperas
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="h-4 w-4" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}