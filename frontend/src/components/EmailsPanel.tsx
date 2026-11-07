"use client";

import styled from "styled-components";
import { Badge, EmptyState, MessageCard, Module, Sep } from "./ui";
import { formatDateTime } from "@/lib/format";
import type { Email } from "@/lib/schemas";

// Emails: one reference-style MessageCard per email inside a captioned module.

const List = styled.ol`
  display: grid;
  gap: var(--space-stack-tight);
  margin: 0;
  padding: 0;
  list-style: none;
`;

/** Newest first, so the latest word on a trade is at the top. The API returns
 * oldest first. Emails without a sent time go last, in their original order. */
function newestFirst(emails: Email[]): Email[] {
  const time = (e: Email) => (e.sent_at ? Date.parse(e.sent_at) : NaN);
  return [...emails].sort((a, b) => {
    const ta = time(a);
    const tb = time(b);
    if (Number.isNaN(ta) || Number.isNaN(tb)) {
      return Number(Number.isNaN(ta)) - Number(Number.isNaN(tb));
    }
    return tb - ta;
  });
}

export function EmailsPanel({
  emails,
  tradeId,
}: {
  emails: Email[];
  tradeId?: string;
}) {
  if (emails.length === 0) {
    return (
      <Module caption="Emails">
        <EmptyState
          size="sm"
          align="start"
          title="No emails on this trade"
          description="Emails from the counterparty will appear here once received."
        />
      </Module>
    );
  }

  return (
    <Module caption={`Emails (${emails.length})`}>
      <List>
        {newestFirst(emails).map(({ id, from_name, from_address, to, subject, body, sent_at }, i) => (
          // Only the newest email starts open; the rest show their summary.
          <li key={id}>
            <MessageCard
              defaultOpen={i === 0}
              from={from_name}
              detail={
                <>
                  {from_address}
                  <Sep />
                  {formatDateTime(sent_at)}
                </>
              }
              subject={subject ?? undefined}
              tags={
                tradeId ? (
                  <Badge $tone="outlined" $color="neutral">
                    Trade {tradeId}
                  </Badge>
                ) : undefined
              }
              headers={[{ label: "To", value: to.map((r) => r.name).join(", ") }]}
            >
              {body ?? undefined}
            </MessageCard>
          </li>
        ))}
      </List>
    </Module>
  );
}
