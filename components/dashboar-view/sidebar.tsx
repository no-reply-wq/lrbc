"use client";

import {
  LayoutDashboard,
  Target,
  Users,
  Truck,
  Receipt,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Logo } from "../logo";
import { DashboardView } from "./types";

interface DashboardSidebarProps {
  activePage: DashboardView;
  onChange: (page: DashboardView) => void;
}

const items = [
  {
    title: "Command Overview",
    value: "overview",
    icon: LayoutDashboard,
  },
  {
    title: "Sales (MeCA)",
    value: "sales",
    icon: Target,
  },
  {
    title: "NBD vs CRR Matrix",
    value: "matrix",
    icon: Users,
  },
  {
    title: "Operations",
    value: "operations",
    icon: Truck,
  },
  {
    title: "Receivables",
    value: "receivables",
    icon: Receipt,
  },
] as const;

export default function DashboardSidebar({
  activePage,
  onChange,
}: DashboardSidebarProps) {
  return (
    <Sidebar
      collapsible="none"
      className="w-48 border-r bg-sidebar"
    >
      <SidebarContent>

        <div className="px-6 py-8">
          <Logo />
        </div>

        <SidebarGroup>

          <SidebarMenu>

            {items.map((item) => (
              <SidebarMenuItem key={item.value}>
                <SidebarMenuButton
                  isActive={activePage === item.value}
                  onClick={() => onChange(item.value)}
                  className="cursor-pointer py-6"
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

          </SidebarMenu>

        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton>

              <Settings />

              <span>System Settings</span>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarFooter>
    </Sidebar>
  );
}