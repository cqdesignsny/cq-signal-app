"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * When the report is opened with `?print=1`, automatically open the print
 * dialog after a short delay so charts and fonts have time to render.
 * Browser's "Save as PDF" then does the rest.
 */
export function PrintOnLoad() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("print") !== "1") return;
    const t = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(t);
  }, [params]);

  return null;
}
