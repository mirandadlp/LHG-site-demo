"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Rendered in the browser so the copyright year stays current without a rebuild. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null
  );
  return <>{year}</>;
}
