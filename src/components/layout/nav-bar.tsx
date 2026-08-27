"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { NAV_ITEMS } from "./nav-items";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";

/** Barra de navegación horizontal fija (arriba o abajo), alternativa a la sidebar vertical. Oculta en mobile. */
export function NavBar({ position }: { position: "top" | "bottom" }) {
  const pathname = usePathname();
  const [collapsed, toggle] = useSidebarCollapsed();

  // El icono de colapsar apunta siempre hacia el borde al que se pega la barra.
  const CollapseIcon = position === "top" ? (collapsed ? ChevronDown : ChevronUp) : collapsed ? ChevronUp : ChevronDown;

  return (
    <header
      className={cn(
        "z-30 hidden h-16 w-full shrink-0 items-center gap-4 bg-sidebar px-4 md:flex",
        position === "top"
          ? "sticky top-0 border-b border-sidebar-border"
          : "fixed inset-x-0 bottom-0 border-t border-sidebar-border",
      )}
    >
      <Logo markOnly={collapsed} />

      <nav className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const link = (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                active && "bg-sidebar-accent text-sidebar-accent-foreground",
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
              <TooltipContent side={position === "top" ? "bottom" : "top"}>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={toggle}
              className="flex size-9 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
              aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            />
          }
        >
          <CollapseIcon className="size-[18px]" />
        </TooltipTrigger>
        <TooltipContent side={position === "top" ? "bottom" : "top"}>
          {collapsed ? "Expandir menú" : "Colapsar menú"}
        </TooltipContent>
      </Tooltip>
    </header>
  );
}
