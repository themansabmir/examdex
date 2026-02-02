"use client";

import * as React from "react";
import { cn } from "@repo/ui/lib/utils";
import { ScrollArea } from "@repo/ui";
import { Separator } from "@repo/ui";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  FileText,
  HelpCircle,
  ChevronDown,
  BookOpen,
  GraduationCap,
} from "@repo/ui";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navGroups = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        href: "/users",
        icon: Users,
      },
      {
        title: "Exams",
        href: "/exams",
        icon: BookOpen,
      },
      {
        title: "Students",
        href: "/students",
        icon: GraduationCap,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Overview",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: FileText,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Preferences",
        href: "/settings",
        icon: Settings,
      },
      {
        title: "Help",
        href: "/help",
        icon: HelpCircle,
      },
    ],
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = window.location.pathname;
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([
    "General",
    "Analytics",
    "Settings",
  ]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-card", className)}>
      <div className="space-y-4 py-4">
        {/* Logo Area */}
        <div className="px-6 py-2">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight">ExamDex</span>
          </a>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedGroups.includes(group.label) && "rotate-180"
                    )}
                  />
                </button>

                {expandedGroups.includes(group.label) && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent relative",
                            isActive
                              ? "bg-accent text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {/* Active indicator - left border accent */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                          )}
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* User Profile Toggle */}
        <div className="px-3">
          <button className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">AD</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@examdex.com</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
