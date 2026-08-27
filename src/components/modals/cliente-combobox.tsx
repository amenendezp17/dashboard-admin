"use client";

import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

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

// Substring simple (insensible a mayúsculas/acentos) en vez del fuzzy-match
// por defecto de cmdk: para buscar un nombre concreto, "coincide o no coincide"
// da resultados más predecibles que un scoring difuso.
function filterByNombre(value: string, search: string): number {
  return normalize(value).includes(normalize(search)) ? 1 : 0;
}

interface ClienteComboboxProps {
  id?: string;
  clientes: Cliente[];
  value: string;
  onChange: (id: string) => void;
}

/** Selector de cliente con búsqueda — un <select> plano no escala a decenas de filas. */
export function ClienteCombobox({ id, clientes, value, onChange }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = clientes.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        <Command filter={filterByNombre}>
          <CommandInput placeholder="Buscar cliente…" autoFocus />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.nombre}
                  data-checked={cliente.id === value}
                  onSelect={() => {
                    onChange(cliente.id);
                    setOpen(false);
                  }}
                >
                  <span className="truncate">{cliente.nombre}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">{cliente.empresa}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
