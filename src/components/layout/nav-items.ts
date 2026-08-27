import { LayoutDashboard, Settings, ShoppingCart, UserCog, Users } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/usuarios", label: "Usuarios", icon: UserCog },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];
