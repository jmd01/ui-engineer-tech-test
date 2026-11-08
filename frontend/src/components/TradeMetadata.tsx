"use client";

import { FactsList, Module, Skeleton } from "./ui";
import { formatDate } from "@/lib/format";
import type { Trade } from "@/lib/schemas";

// "Identifiers" and "Key economics" modules, laid out like the reference's
// Evidence tab, holding the fields our API has. These fields are all on the
// list's trade too, so while the full trade loads they can usually show
// already; with no trade at all, the labels show and each value is a
// placeholder.

const loading = (width: string) => <Skeleton $text="meta" $width={width} />;

export function TradeMetadata({ trade }: { trade?: Trade }) {
  if (!trade) {
    return (
      <>
        <Module caption="Identifiers">
          <FactsList facts={[{ label: "Trade ID", value: loading("72px") }]} />
        </Module>
        <Module caption="Key economics">
          <FactsList
            facts={[
              { label: "Product", value: loading("96px") },
              { label: "Notional amount", value: loading("88px") },
              { label: "Notional currency", value: loading("32px") },
              { label: "Trade date", value: loading("80px") },
              { label: "Maturity date", value: loading("80px") },
            ]}
          />
        </Module>
      </>
    );
  }
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
