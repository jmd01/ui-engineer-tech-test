"use client";

import styled from "styled-components";
import type { ReactNode } from "react";

// Mirrors the reference's `.drawer-module` (a captioned section of an item's
// detail) and `.facts-list` (label / value pairs).

const Root = styled.section`
  padding: var(--space-row-y);
  border-bottom: var(--border-width-hairline) solid var(--border-divider);

  &:last-child {
    border-bottom: 0;
  }
`;

const ModuleCaption = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: 0 0 var(--space-stack-tight);
  color: var(--fg-tertiary);
  font-size: var(--text-caption);
  line-height: var(--text-caption-line-height);
  letter-spacing: var(--text-caption-tracking);
  font-weight: var(--text-caption-weight);
  text-transform: var(--text-caption-transform);
`;

const Body = styled.div`
  display: grid;
  gap: var(--space-stack-tight);
  min-width: 0;
`;

interface ModuleProps {
  caption: ReactNode;
  children: ReactNode;
  "aria-label"?: string;
}

export function Module({ caption, children, ...rest }: ModuleProps) {
  return (
    <Root {...rest}>
      <ModuleCaption>{caption}</ModuleCaption>
      <Body>{children}</Body>
    </Root>
  );
}

const List = styled.dl`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-4) var(--space-row-y);
  margin: 0;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);

  dt {
    color: var(--fg-tertiary);
    font-size: var(--text-label);
    line-height: var(--text-label-line-height);
    font-weight: var(--text-label-weight);
  }

  dd {
    margin: 0;
    color: var(--fg-default);
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
`;

export interface Fact {
  label: string;
  value: ReactNode;
}

export function FactsList({ facts }: { facts: Fact[] }) {
  return (
    <List>
      {facts.map((f) => (
        <div key={f.label} style={{ display: "contents" }}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </List>
  );
}
