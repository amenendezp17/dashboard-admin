"use client";

import { ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Cliente } from "@/lib/types";

// Rango Unicode de marcas diacríticas combinantes (construido con fromCharCode
// para evitar literales de escape ambiguos en el código fuente).
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`, "g");

function normalize(value: string): string {
  return value.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase();
}

// Sin buscar aún, montar las 52 filas de golpe es lo que se nota como
// "retraso" al abrir. Mostramos solo las primeras y el resto aparece al
// escribir — igual que cortar de raíz, en vez de fiarlo todo al filtro.
const MAX_SIN_BUSCAR = 8;

interface ClienteComboboxProps {
  id?: string;
  clientes: Cliente[];
  value: string;
  onChange: (id: string) => void;
}

/** Selector de cliente con búsqueda — un <select> plano no escala a decenas de filas. */
export function ClienteCombobox({ id, clientes, value, onChange }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = clientes.find((c) => c.id === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return clientes.slice(0, MAX_SIN_BUSCAR);
    const needle = normalize(search);
    return clientes.filter((c) => normalize(c.nombre).includes(needle));
  }, [clientes, search]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          />
        }
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.nombre : "Selecciona un cliente"}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--anchor-width) p-0">
        <Command shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Buscar cliente…" autoFocus />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {filtered.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.id}
                  data-checked={cliente.id === value}
                  onSelect={() => {
                    onChange(cliente.id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="truncate">{cliente.nombre}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">{cliente.empresa}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {!search.trim() && clientes.length > MAX_SIN_BUSCAR && (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">
                Mostrando {MAX_SIN_BUSCAR} de {clientes.length} — escribe para buscar el resto.
              </p>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
