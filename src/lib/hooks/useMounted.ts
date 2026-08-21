"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after client-side hydration; used to gate `createPortal` calls that need `document.body`. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
