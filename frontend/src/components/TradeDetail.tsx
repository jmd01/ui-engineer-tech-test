"use client";

import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useGetTradeQuery, useListTradesQuery } from "@/lib/api/tradesApi";
import { parseStatuses } from "@/lib/statusParams";
import {
  Badge,
  IconButton,
  PageHead,
  Skeleton,
  SkeletonStatus,
  TabList,
  panelId,
  statusColor,
  statusLabel,
  tabId,
  type TabItem,
} from "./ui";
import { TradeMetadata } from "./TradeMetadata";
import { EmailsPanel, EmailsPanelSkeleton } from "./EmailsPanel";
import { NotesPanel, NotesPanelSkeleton } from "./NotesPanel";
import { useDrawerTab } from "./TradeDrawer";

// One trade in the drawer, shown the way the reference shows an item: a
// drawer-size header with Overview / Notes tabs. Only the blotter's own data
// is shown; no Arch-only features.

const TABS: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Notes" },
];

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--bg-default);
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
`;

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  );
}

export function TradeDetail({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const listQuery = params?.toString() ?? "";
  const query = useGetTradeQuery(id);
  // The trade itself, or nothing while it loads. (currentData, not data, so a
  // previous trade is never shown under this one's URL.)
  const trade = query.currentData;

  // While the trade loads, show what the list already knows about it (the
  // header and key economics), so only emails and notes wait. On a
  // refresh or deep link the list may not have it yet; then it's a placeholder.
  const statuses = parseStatuses(params?.getAll("status") ?? []);
  const { listed } = useListTradesQuery(statuses.length > 0 ? statuses : undefined, {
    selectFromResult: ({ data }) => ({ listed: data?.find((t) => t.id === id) }),
  });
  const head = trade ?? listed;

  // The tab is held by the trades layout, so it carries over when you open
  // another trade. (Local fallback only if rendered outside that layout.)
  const shared = useDrawerTab();
  const [localTab, setLocalTab] = useState("overview");
  const tab = shared ? shared.tab : localTab;
  const setTab = shared ? shared.setTab : setLocalTab;

  const prefix = useId();
  const headingId = `${prefix}-heading`;

  const close = () => router.push(listQuery ? `/trades?${listQuery}` : "/trades");

  // Closing goes back to the list as it was (same filter).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        router.push(listQuery ? `/trades?${listQuery}` : "/trades");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listQuery, router]);

  // Focus the heading when a trade opens.
  useEffect(() => {
    if (!trade) return;
    document.getElementById(headingId)?.focus();
  }, [trade, headingId]);

  // Unchanged from before the migration: an error renders nothing (see DECISIONS).
  if (query.isError) {
    return null;
  }

  return (
    <Root aria-busy={trade ? undefined : true}>
      {trade ? null : <SkeletonStatus>Loading trade</SkeletonStatus>}
      <PageHead
        size="drawer"
        as="h1"
        headingId={headingId}
        caption={head ? head.trade_id : <Skeleton $text="meta" $width="80px" />}
        heading={head ? head.counterparty_name : <Skeleton $text="heading-lg" $width="180px" />}
        tags={
          head ? (
            <Badge $tone="subtle" $color={statusColor(head.status)}>
              {statusLabel(head.status)}
            </Badge>
          ) : (
            <Skeleton $shape="badge" />
          )
        }
        end={
          <IconButton $size="sm" aria-label="Close trade" onClick={close}>
            <CloseIcon />
          </IconButton>
        }
        tabs={
          <TabList
            items={TABS}
            value={tab}
            onChange={setTab}
            label="Trade sections"
            idPrefix={prefix}
          />
        }
      />
      <Body>
        <div
          role="tabpanel"
          id={panelId(prefix, tab)}
          aria-labelledby={tabId(prefix, tab)}
        >
          {tab === "overview" ? (
            <>
              <TradeMetadata trade={head} />
              {trade ? (
                <EmailsPanel emails={trade.emails} tradeId={trade.trade_id} />
              ) : (
                <EmailsPanelSkeleton />
              )}
            </>
          ) : null}
          {tab === "notes" ? (
            trade ? (
              <NotesPanel
                tradeId={trade.id}
                status={trade.status}
                notes={trade.notes}
              />
            ) : (
              <NotesPanelSkeleton />
            )
          ) : null}
        </div>
      </Body>
    </Root>
  );
}
