"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge, Skeleton, SkeletonStatus, statusLabel } from "./ui";
import { formatDate, formatNotional } from "@/lib/format";
import type { Trade } from "@/lib/schemas";

const Frame = styled.div`
  background: var(--bg-default);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-control);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);

  th,
  td {
    padding: var(--space-4) var(--space-8);
    border-bottom: var(--border-width-hairline) solid var(--border-divider);
    text-align: left;
    vertical-align: middle;
  }

  th:first-child,
  td:first-child {
    padding-left: var(--space-12);
  }

  th {
    height: var(--row-md);
    background: var(--bg-default);
    color: var(--fg-tertiary);
    font-weight: var(--text-meta-weight);
    white-space: nowrap;
  }

  td {
    height: var(--row-lg);
    color: var(--fg-default);
  }

  tbody tr {
    transition: background-color var(--duration-quick) var(--easing-standard);
  }

  tbody tr:hover {
    background: var(--state-hover);
  }

  /* The trade open in the drawer, as the reference marks its selected row. */
  tbody tr[data-open] td {
    background: var(--state-selected);
  }
  tbody tr[data-open] td:first-child {
    box-shadow: inset var(--border-width-rule) 0 0 var(--brand-fill);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const TradeLink = styled(Link)`
  color: var(--fg-link);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

function Head() {
  return (
    <thead>
      <tr>
        <th>Trade ID</th>
        <th>Counterparty</th>
        <th>Product</th>
        <th>Notional</th>
        <th>Trade date</th>
        <th>Status</th>
      </tr>
    </thead>
  );
}

interface TradesTableProps {
  trades: Trade[];
}

export function TradesTable({ trades }: TradesTableProps) {
  // Keep the list's filter in the trade URL, so the list behind the drawer
  // stays as it was (the filter lives in the query string).
  const qs = useSearchParams()?.toString() ?? "";
  const suffix = qs ? `?${qs}` : "";

  // The trade open in the drawer, from /trades/[id].
  const openId = usePathname()?.match(/^\/trades\/([^/]+)/)?.[1] ?? null;
  const openRow = useRef<HTMLTableRowElement>(null);

  // Keep the open trade's row in view (e.g. when a link opens a trade far down).
  useEffect(() => {
    openRow.current?.scrollIntoView({ block: "nearest" });
  }, [openId]);

  return (
    <Frame>
      <Table>
        <Head />
        <tbody>
          {trades.map((t) => (
            <tr
              key={t.id}
              data-open={t.id === openId ? "" : undefined}
              ref={t.id === openId ? openRow : undefined}
            >
              <td>
                <TradeLink
                  href={`/trades/${t.id}${suffix}`}
                  aria-current={t.id === openId ? "page" : undefined}
                >
                  {t.trade_id}
                </TradeLink>
              </td>
              <td>{t.counterparty_name}</td>
              <td>{t.product_type}</td>
              <td>{formatNotional(t.notional_amount, t.currency_code)}</td>
              <td>{formatDate(t.trade_date)}</td>
              <td>
                <Badge $tone="outlined" $color="neutral">
                  {statusLabel(t.status)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Frame>
  );
}

// Widths vary row to row so the placeholder reads as a table of real values,
// not a stack of stripes.
const COUNTERPARTY = ["148px", "112px", "176px", "128px", "160px", "104px", "140px", "120px"];
const PRODUCT = ["88px", "64px", "96px", "72px"];
const STATUS = ["64px", "72px", "56px"];

/** The table while trades load: real header, placeholder rows at full row height. */
export function TradesTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Frame aria-busy="true">
      <SkeletonStatus>Loading trades</SkeletonStatus>
      <Table aria-hidden="true">
        <Head />
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              <td>
                <Skeleton $text="meta" $width="64px" />
              </td>
              <td>
                <Skeleton $text="meta" $width={COUNTERPARTY[i % COUNTERPARTY.length]} />
              </td>
              <td>
                <Skeleton $text="meta" $width={PRODUCT[i % PRODUCT.length]} />
              </td>
              <td>
                <Skeleton $text="meta" $width="88px" />
              </td>
              <td>
                <Skeleton $text="meta" $width="72px" />
              </td>
              <td>
                <Skeleton $shape="badge" $width={STATUS[i % STATUS.length]} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Frame>
  );
}
