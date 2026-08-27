"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { NAV_ITEMS } from "./nav-items";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";

/** Barra lateral vertical fija (izquierda o derecha), colapsable a solo-iconos. Oculta en mobile (ver MobileNav). */
export function Sidebar({ side }: { side: "left" | "right" }) {
  const pathname = usePathname();
  const [collapsed, toggle] = useSidebarCollapsed();

  // El icono de colapsar apunta siempre hacia el borde al que se pega la barra.
  const CollapseIcon = side === "left" ? (collapsed ? ChevronsRight : ChevronsLeft) : collapsed ? ChevronsLeft : ChevronsRight;

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col bg-sidebar transition-[width] duration-150 md:flex",
        side === "left" ? "border-r border-sidebar-border" : "border-l border-sidebar-border",
        collapsed ? "w-[68px]" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
        <Logo markOnly={collapsed} />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const link = (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                active && "bg-sidebar-accent text-sidebar-accent-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <item.icon className="size-[18px] shrink-0" aria-hidden="true" />
              {!collapsed && item.label}
            </Link>
          );

          if (!collapsed) return link;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger render={link} />
              <TooltipContent side={side === "left" ? "right" : "left"}>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={toggle}
                className="flex w-full items-center justify-center rounded-md py-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
                aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
              />
            }
          >
            <CollapseIcon className="size-[18px]" />
          </TooltipTrigger>
          <TooltipContent side={side === "left" ? "right" : "left"}>
            {collapsed ? "Expandir menú" : "Colapsar menú"}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
