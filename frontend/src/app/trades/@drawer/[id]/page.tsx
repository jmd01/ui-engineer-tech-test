"use client";

import { use } from "react";
import { TradeDetail } from "@/components/TradeDetail";

// Direct load or refresh of /trades/[id]: show the trade in the drawer, the
// same as when it's opened from the list. (Clicks from the list are handled
// by @drawer/(.)[id], so the list doesn't remount.)

export default function TradeInDrawerOnLoad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TradeDetail id={id} />;
}
