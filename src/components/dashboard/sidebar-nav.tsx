"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  ClipboardList,
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
  { title: "Profile", href: "/profile", icon: User },
];

const reviewerNav: NavItem[] = [
  { title: "Dashboard", href: "/reviewer", icon: LayoutDashboard },
  { title: "My Reviews", href: "/reviewer/reviews", icon: ClipboardList },
];

const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Submissions", href: "/admin/submissions", icon: FileText },
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