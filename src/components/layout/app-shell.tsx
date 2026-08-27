"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/lib/stores/layout-store";
import { MobileNav } from "./mobile-nav";
import { NavBar } from "./nav-bar";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const position = useLayoutStore((s) => s.position);
  const isHorizontal = position === "top" || position === "bottom";

  return (
    <div className={cn("flex min-h-dvh w-full", isHorizontal && "flex-col")}>
      {position === "left" && <Sidebar side="left" />}
      {position === "top" && <NavBar position="top" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className={cn("min-w-0 flex-1 p-4 md:p-8", position === "bottom" && "md:pb-24")}>{children}</main>
      </div>

      {position === "right" && <Sidebar side="right" />}
      {position === "bottom" && <NavBar position="bottom" />}
    </div>
  );
}
