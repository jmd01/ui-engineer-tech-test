"use client";

import { useId, useState, type ReactNode } from "react";
import styled, { css } from "styled-components";
import { Skeleton } from "./Skeleton";

// Mirrors the reference's email card: a `.frame` (inset loose) whose head is a
// `.collapsible-trigger`, with `.message-card-*` parts inside.

const Frame = styled.article`
  min-width: 0;
  overflow: hidden;
  background: var(--bg-raised);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-surface);
`;

// The system's "flat" collapsible trigger: no hover tint (a tinted block over
// half an open card reads as a separate panel). Hover darkens the chevron;
// keyboard focus gets a ring drawn inside the card's edge.
const headLayout = css`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-16);
`;

const Head = styled.button`
  ${headLayout}
  border: 0;
  /* The whole summary (sender + subject) is the click target. */
  border-radius: var(--radius-surface) var(--radius-surface) 0 0;
  background: none;
  color: var(--fg-default);
  font-family: inherit;
  font-size: var(--text-heading);
  line-height: var(--text-heading-line-height);
  font-weight: var(--weight-regular);
  text-align: left;
  cursor: pointer;
  transition: color var(--duration-quick) var(--easing-standard);

  &:focus-visible {
    box-shadow: inset 0 0 0 2px var(--fg-default);
  }
`;

const From = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: var(--line-height-16);
`;

const ellipsis = css`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Who = styled.span`
  ${ellipsis}
  color: var(--fg-default);
  font-size: var(--text-body-compact);
  line-height: var(--text-body-compact-line-height);
  font-weight: var(--text-body-compact-weight);
`;

const Address = styled.span`
  ${ellipsis}
  color: var(--fg-tertiary);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);
`;

const Chevron = styled.span<{ $open: boolean }>`
  flex: 0 0 auto;
  margin-left: auto;
  display: inline-flex;
  color: var(--fg-tertiary);
  transition:
    transform var(--duration-quick) var(--easing-standard),
    color var(--duration-quick) var(--easing-standard);

  button:hover > span > & {
    color: var(--fg-default);
  }
  transform: rotate(${({ $open }) => ($open ? "0deg" : "-90deg")});
`;

const TopRow = styled.span`
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
`;

const Subject = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-stack-tight);
  color: var(--fg-default);
  font-size: var(--text-body-compact);
  line-height: var(--text-body-compact-line-height);
  font-weight: var(--text-body-compact-weight);
  overflow-wrap: anywhere;
`;

const Tags = styled.span`
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
`;

const Collapse = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows var(--duration-moderate) var(--easing-standard);

  > div {
    overflow: hidden;
    min-height: 0;
    visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
    /* Visibility flips at the end of the transition when closing (and at the
       start when opening), so the body stays visible while it collapses. */
    transition: visibility var(--duration-moderate);
  }
`;

const Body = styled.div`
  padding: 0 var(--space-16) var(--space-16);
`;

const Headers = styled.dl`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-2) var(--space-stack-tight);
  margin: 0 0 var(--space-stack-tight);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);

  dt,
  dd {
    color: var(--fg-tertiary);
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
`;

const Text = styled.div`
  margin: 0;
  padding-top: var(--space-row-y);
  border-top: var(--border-width-hairline) solid var(--border-divider);
  color: var(--fg-secondary);
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  font-weight: var(--text-body-weight);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9L12 15L18 9" />
    </svg>
  );
}

interface MessageCardProps {
  from: ReactNode;
  /** Address and/or time, shown under the sender. */
  detail?: ReactNode;
  subject?: ReactNode;
  tags?: ReactNode;
  /** Header rows such as To / Cc. */
  headers?: { label: string; value: ReactNode }[];
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function MessageCard({
  from,
  detail,
  subject,
  tags,
  headers,
  children,
  defaultOpen = true,
}: MessageCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <Frame>
      <Head
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        <TopRow>
          <From>
            <Who>{from}</Who>
            {detail ? <Address>{detail}</Address> : null}
          </From>
          <Chevron $open={open}>
            <ChevronIcon />
          </Chevron>
        </TopRow>
        {subject || tags ? (
          <Subject>
            <span>{subject}</span>
            {tags ? <Tags>{tags}</Tags> : null}
          </Subject>
        ) : null}
      </Head>
      <Collapse $open={open} id={bodyId}>
        <div>
          <Body>
            {headers && headers.length > 0 ? (
              <Headers>
                {headers.map((h) => (
                  <div key={h.label} style={{ display: "contents" }}>
                    <dt>{h.label}</dt>
                    <dd>{h.value}</dd>
                  </div>
                ))}
              </Headers>
            ) : null}
            {children ? <Text>{children}</Text> : null}
          </Body>
        </div>
      </Collapse>
    </Frame>
  );
}

// Placeholder with the card's layout: sender, address and subject, plus the
// opened body (To line and a few lines of text) when `open`.
const SkeletonHead = styled.div`
  ${headLayout}
`;

export function MessageCardSkeleton({ open = false }: { open?: boolean }) {
  return (
    <Frame aria-hidden="true">
      <SkeletonHead>
        <TopRow>
          <From>
            <Skeleton $text="body-compact" $width="120px" />
            <Skeleton $text="meta" $width="220px" />
          </From>
        </TopRow>
        <Skeleton $text="body-compact" $width="70%" />
      </SkeletonHead>
      {open ? (
        <Body>
          <Headers as="div">
            <Skeleton $text="meta" $width="160px" />
          </Headers>
          <Text as="div">
            <Skeleton $text="body" />
            <Skeleton $text="body" />
            <Skeleton $text="body" $width="60%" />
          </Text>
        </Body>
      ) : null}
    </Frame>
  );
}
