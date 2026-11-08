"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useListTradesQuery } from "@/lib/api/tradesApi";
import type { TradeStatus } from "@/lib/schemas";
import { parseStatuses } from "@/lib/statusParams";
import { StatusFilter } from "@/components/StatusFilter";
import { TradesTable, TradesTableSkeleton } from "@/components/TradesTable";
import { EmptyState, Skeleton } from "@/components/ui";

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-16);
  margin-bottom: var(--space-16);

  h1 {
    margin: 0;
    font-size: var(--text-title);
    line-height: var(--text-title-line-height);
    font-weight: var(--text-title-weight);
  }
`;

const PagePad = styled.div`
  padding: var(--space-24);
`;

const FilterRow = styled.div`
  margin-bottom: var(--space-16);
`;

export default function TradesPage() {
  return (
    <Suspense
      fallback={
        // Same layout as the loaded page, so nothing moves when it renders.
        <PagePad>
          <Header>
            <h1>Trades</h1>
          </Header>
          <FilterRow>
            <Skeleton $shape="block" $width="420px" $height="var(--control-md-height)" />
          </FilterRow>
          <TradesTableSkeleton />
        </PagePad>
      }
    >
      <TradesPageInner />
    </Suspense>
  );
}

function TradesPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const statuses = parseStatuses(params.getAll("status"));

  const query = useListTradesQuery(
    statuses.length > 0 ? statuses : undefined,
  );
  const trades = query.data ?? [];

  const counts = useMemo(() => {
    const acc: Record<TradeStatus, number> = {
      dispute: 0,
      submitted: 0,
      confirmed: 0,
      deleted: 0,
      error: 0,
    };
    for (const t of trades) acc[t.status] += 1;
    return acc;
  }, [trades]);

  const setStatuses = (next: TradeStatus[]) => {
    const sp = new URLSearchParams();
    next.forEach((s) => sp.append("status", s));
    const qs = sp.toString();
    router.replace(qs ? `/trades?${qs}` : "/trades");
  };

  return (
    <PagePad>
      <Header>
        <h1>Trades</h1>
      </Header>

      <FilterRow>
        <StatusFilter
          selected={statuses}
          counts={counts}
          onChange={setStatuses}
        />
      </FilterRow>

      {query.isLoading ? (
        <TradesTableSkeleton />
      ) : query.isError ? (
        <EmptyState
          title="Failed to load trades"
          description="Check the API is running on http://localhost:8000."
        />
      ) : (
        <TradesTable trades={trades} />
      )}
    </PagePad>
  );
}
