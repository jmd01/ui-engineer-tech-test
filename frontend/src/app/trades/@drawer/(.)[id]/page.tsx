"use client";

import { use } from "react";
import { TradeDetail } from "@/components/TradeDetail";

// Intercepts /trades/[id] when it's opened from the list, so the trade shows in
// the drawer over the list. The URL still changes, so back, links and refresh
// behave as before (a refresh shows the full page).

export default function TradeInDrawer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TradeDetail id={id} />;
}
