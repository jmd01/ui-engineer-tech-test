"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import {
  Badge,
  Button,
  CharCount,
  EmptyState,
  FactsList,
  Field,
  IconButton,
  Link,
  MessageCard,
  Module,
  PageHead,
  Sep,
  TextArea,
  statusColor,
  statusLabel,
  type BadgeColor,
  type ButtonColor,
  type ButtonTone,
} from "@/components/ui";
import type { TradeStatus } from "@/lib/schemas";

// Component gallery: every primitive in each variant and state, for checking
// against design/reference.html. Dev only.

const Page = styled.div`
  display: grid;
  gap: var(--space-32);
  max-width: 960px;
  padding: var(--space-24);
`;

const Section = styled.section`
  display: grid;
  gap: var(--space-12);
`;

const H2 = styled.h2`
  margin: 0;
  font-size: var(--text-heading-lg);
  line-height: var(--text-heading-lg-line-height);
  font-weight: var(--text-heading-lg-weight);
  letter-spacing: var(--text-heading-lg-tracking);
`;

const Note = styled.p`
  margin: 0;
  color: var(--fg-tertiary);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
`;

const Surface = styled.div`
  padding: var(--space-16);
  background: var(--bg-default);
  border: var(--border-width-hairline) solid var(--border-divider);
  border-radius: var(--radius-control);
  display: grid;
  gap: var(--space-12);
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
`;

const RowLabel = styled.span`
  width: 120px;
  color: var(--fg-tertiary);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
`;

const Narrow = styled.div`
  max-width: 480px;
`;

const CommentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const tones: ButtonTone[] = ["primary", "secondary", "ghost"];
const btnColors: ButtonColor[] = ["brand", "neutral", "danger"];
const badgeColors: BadgeColor[] = [
  "neutral",
  "brand",
  "success",
  "warning",
  "danger",
  "info",
];
const statuses: TradeStatus[] = [
  "dispute",
  "submitted",
  "confirmed",
  "deleted",
  "error",
];

function PlusIcon() {
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
      <path d="M12 5V19M5 12H19" />
    </svg>
  );
}

export default function ComponentsGallery() {
  if (process.env.NODE_ENV === "production") notFound();
  const [draft, setDraft] = useState("");

  return (
    <Page>
      <PageHead
        flush
        heading="Components"
        meta="Every ui/ primitive in each variant and state, built from the system tokens."
      />

      <Section>
        <H2>Button</H2>
        <Note>`$tone` × `$color`, size md. Hover, press and Tab to check states.</Note>
        <Surface>
          {tones.map((tone) => (
            <Row key={tone}>
              <RowLabel>{tone}</RowLabel>
              {btnColors.map((color) => (
                <Button key={color} $tone={tone} $color={color}>
                  {color}
                </Button>
              ))}
              <Button $tone={tone} disabled>
                disabled
              </Button>
            </Row>
          ))}
          {(["secondary", "primary"] as const).map((tone) => (
            <Row key={tone}>
              <RowLabel>sizes, {tone}</RowLabel>
              {(["sm", "md", "lg"] as const).map((size) => (
                <Button key={size} $size={size} $tone={tone} $color="brand">
                  {{ sm: "Small", md: "Medium", lg: "Large" }[size]}
                </Button>
              ))}
              {(["sm", "md", "lg"] as const).map((size) => (
                <IconButton key={size} aria-label="Add" $size={size} $tone={tone}>
                  <PlusIcon />
                </IconButton>
              ))}
            </Row>
          ))}
        </Surface>
      </Section>

      <Section>
        <H2>Badge</H2>
        <Note>`$tone` × `$color`. The table uses outlined neutral; the detail header uses subtle + status colour.</Note>
        <Surface>
          {(["outlined", "subtle", "plain"] as const).map((tone) => (
            <Row key={tone}>
              <RowLabel>{tone}</RowLabel>
              {badgeColors.map((color) => (
                <Badge key={color} $tone={tone} $color={color}>
                  {color}
                </Badge>
              ))}
            </Row>
          ))}
          <Row>
            <RowLabel>trade status</RowLabel>
            {statuses.map((s) => (
              <Badge key={s} $tone="subtle" $color={statusColor(s)}>
                {statusLabel(s)}
              </Badge>
            ))}
          </Row>
        </Surface>
      </Section>

      <Section>
        <H2>Link</H2>
        <Surface>
          <Row>
            <Link href="/trades">Brand link</Link>
            <Link href="/trades" $size="sm">
              Small link
            </Link>
            <Link href="/trades" $color="neutral">
              Neutral link
            </Link>
          </Row>
        </Surface>
      </Section>

      <Section>
        <H2>PageHead</H2>
        <Note>Sizes lg (page), md (compact) and drawer (an item&apos;s header).</Note>
        <Surface>
          <PageHead flush heading="Trades" meta="Page title, size lg" />
          <PageHead size="md" heading="Compact page heading" end={<Button>Action</Button>} />
          <PageHead
            size="drawer"
            caption={
              <>
                MW-273148
                <Sep />
                Deutsche Bank
              </>
            }
            heading="Swaption"
            meta="Traded 29 Jun 2025"
            tags={
              <Badge $tone="subtle" $color="danger">
                Disputed
              </Badge>
            }
            back={
              <Link href="/trades" $size="sm">
                Back to trades
              </Link>
            }
          />
        </Surface>
      </Section>

      <Section>
        <H2>Module and FactsList</H2>
        <Surface>
          <Narrow>
            <Module caption="Key economics">
              <FactsList
                facts={[
                  { label: "Product", value: "Swaption" },
                  { label: "Notional", value: "CHF 436,229,277" },
                  { label: "Trade date", value: "29 Jun 2025" },
                  { label: "Maturity date", value: "—" },
                ]}
              />
            </Module>
          </Narrow>
        </Surface>
      </Section>

      <Section>
        <H2>MessageCard</H2>
        <Note>Click the header to collapse and expand.</Note>
        <Surface>
          <Narrow>
            <MessageCard
              from="Ilana Verdansky"
              detail={
                <>
                  ilana@deutsche.example
                  <Sep />
                  29 Jun 2025, 15:07
                </>
              }
              subject="Trade MW-273148 - processing complete"
              tags={
                <Badge $tone="outlined" $color="neutral">
                  MW-273148
                </Badge>
              }
              headers={[{ label: "To", value: "Desmond Hume, Eko, John Locke" }]}
            >
              {"Hi,\n\nPlease note that trade MW-273148 has been submitted to Deutsche Bank for confirmation.\n\nThanks,\nIlana"}
            </MessageCard>
          </Narrow>
        </Surface>
      </Section>

      <Section>
        <H2>Field, TextArea and comment box</H2>
        <Surface>
          <Narrow>
            <Field label="Add a note" htmlFor="gallery-note" fill>
              <TextArea
                id="gallery-note"
                rows={3}
                maxLength={1000}
                placeholder="Write a note for the team"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </Field>
            <CommentRow style={{ marginTop: "var(--space-8)" }}>
              <CharCount>{draft.length}/1000</CharCount>
              <Button $tone="primary" $color="brand" disabled={!draft.trim()}>
                Submit
              </Button>
            </CommentRow>
          </Narrow>
          <Narrow>
            <Field
              label="With an error"
              htmlFor="gallery-error"
              status="Note can't be empty"
              statusTone="danger"
              fill
            >
              <TextArea id="gallery-error" rows={2} aria-invalid="true" />
            </Field>
          </Narrow>
          <Narrow>
            <Field label="Disabled" htmlFor="gallery-disabled" fill>
              <TextArea id="gallery-disabled" rows={2} disabled />
            </Field>
          </Narrow>
        </Surface>
      </Section>

      <Section>
        <H2>EmptyState</H2>
        <Surface>
          <EmptyState
            title="No trades match"
            description="Try clearing the status filter."
            actions={<Button>Clear filter</Button>}
          />
          <EmptyState size="sm" align="start" description="No notes yet." />
        </Surface>
      </Section>
    </Page>
  );
}
