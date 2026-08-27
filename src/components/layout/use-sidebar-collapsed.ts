"use client";

import { useSyncExternalStore } from "react";

const COLLAPSE_KEY = "nimbus-sidebar-collapsed";
const COLLAPSE_EVENT = "nimbus-sidebar-collapsed-change";

function subscribe(callback: () => void) {
  window.addEventListener(COLLAPSE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(COLLAPSE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function getSnapshot() {
  return window.localStorage.getItem(COLLAPSE_KEY) === "1";
}
function getServerSnapshot() {
  return false;
}

/** Estado "compacto" (solo iconos) compartido entre la barra lateral y la horizontal. */
export function useSidebarCollapsed(): [boolean, () => void] {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "0" : "1");
    window.dispatchEvent(new Event(COLLAPSE_EVENT));
  }

  return [collapsed, toggle];
}
