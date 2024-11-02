"use client";

import { usePathname } from "next/navigation";
import Link from "next/navigation";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Upload,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function DashboardNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const { theme, setTheme } = useTheme();

  const routes = [
    {
      href: "/dashboard",
      label: t('dashboard.title'),
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/customers",
      label: t('customer.title'),
      icon: Users,
    },
    {
      href: "/dashboard/upload",
      label: t('dashboard.uploadCsv'),
      icon: Upload,
    },
    {
      href: "/dashboard/settings",
      label: t('settings.title'),
      icon: Settings,
    },
  ];

  return (
    <nav className="space-y-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors",
            pathname === route.href ? "bg-accent" : "transparent"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </nav>
  );
}