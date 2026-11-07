"use client";

import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useGetTradeQuery } from "@/lib/api/tradesApi";
import {
  Badge,
  EmptyState,
  IconButton,
  PageHead,
  TabList,
  panelId,
  statusColor,
  statusLabel,
  tabId,
  type TabItem,
} from "./ui";
import { TradeMetadata } from "./TradeMetadata";
import { EmailsPanel } from "./EmailsPanel";
import { NotesPanel } from "./NotesPanel";
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
  const listQuery = useSearchParams()?.toString() ?? "";
  const query = useGetTradeQuery(id);

  // The tab is held by the trades layout, so it carries over when you open
  // another trade. (Local fallback only if rendered outside that layout.)
  const shared = useDrawerTab();
  const [localTab, setLocalTab] = useState("overview");
  const tab = shared ? shared.tab : localTab;
  const setTab = shared ? shared.setTab : setLocalTab;

  const prefix = useId();
  const headingId = `${prefix}-heading`;

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
    if (!query.data) return;
    document.getElementById(headingId)?.focus();
  }, [query.data, headingId]);

  if (query.isLoading) {
    return (
      <Root>
        <EmptyState size="md" align="start" description="Loading…" />
      </Root>
    );
  }

  // Unchanged from before the migration: an error renders nothing (see DECISIONS).
  if (query.isError || !query.data) {
    return null;
  }

  const trade = query.data;
  const close = () => router.push(listQuery ? `/trades?${listQuery}` : "/trades");

  return (
    <Root>
      <PageHead
        size="drawer"
        as="h1"
        headingId={headingId}
        caption={trade.trade_id}
        heading={trade.counterparty_name}
        tags={
          <Badge $tone="subtle" $color={statusColor(trade.status)}>
            {statusLabel(trade.status)}
          </Badge>
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
              <TradeMetadata trade={trade} />
              <EmailsPanel emails={trade.emails} tradeId={trade.trade_id} />
            </>
          ) : null}
          {tab === "notes" ? (
            <NotesPanel
              tradeId={trade.id}
              status={trade.status}
              notes={trade.notes}
            />
          ) : null}
        </div>
      </Body>
    </Root>
  );
}
