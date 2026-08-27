import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LayoutPositionToggle } from "@/components/layout-position-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

const PERFIL_FICTICIO = {
  nombre: "Alex Menéndez",
  email: "alex@nimbus.app",
  rol: "Administrador",
  empresa: "Nimbus",
};

export default function AjustesPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-sm text-muted-foreground">Preferencias del panel y datos de la cuenta.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>Elige cómo se ve Nimbus en este dispositivo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navegación</CardTitle>
          <CardDescription>Elige en qué borde vive la barra de navegación (solo escritorio; en mobile siempre es un menú desplegable).</CardDescription>
        </CardHeader>
        <CardContent>
          <LayoutPositionToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Datos de la cuenta (demo, no editable).</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Nombre</Label>
            <p className="text-sm text-foreground">{PERFIL_FICTICIO.nombre}</p>
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <p className="text-sm text-foreground">{PERFIL_FICTICIO.email}</p>
          </div>
          <div className="grid gap-1.5">
            <Label>Rol</Label>
            <p className="text-sm text-foreground">{PERFIL_FICTICIO.rol}</p>
          </div>
          <div className="grid gap-1.5">
            <Label>Empresa</Label>
            <p className="text-sm text-foreground">{PERFIL_FICTICIO.empresa}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
