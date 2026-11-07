"use client";

import { FactsList, Module } from "./ui";
import { formatDate } from "@/lib/format";
import type { TradeDetail } from "@/lib/schemas";

// "Identifiers" and "Key economics" modules, laid out like the reference's
// Evidence tab, holding the fields our API has.

export function TradeMetadata({ trade }: { trade: TradeDetail }) {
  return (
    <>
      <Module caption="Identifiers">
        <FactsList facts={[{ label: "Trade ID", value: trade.trade_id }]} />
      </Module>
      <Module caption="Key economics">
        <FactsList
          facts={[
            { label: "Product", value: trade.product_type },
            // Amount formatting unchanged from before the migration.
            { label: "Notional amount", value: trade.notional_amount.toLocaleString("en-US") },
            { label: "Notional currency", value: trade.currency_code },
            { label: "Trade date", value: formatDate(trade.trade_date) },
            { label: "Maturity date", value: formatDate(trade.maturity_date) },
          ]}
        />
      </Module>
    </>
  );
}
