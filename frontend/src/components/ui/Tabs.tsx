"use client";

import { useRef, type KeyboardEvent } from "react";
import styled from "styled-components";
import { tintLayer } from "./interactive";

// Mirrors the reference's `.tab-list` / `.tab`: text tabs with a 2px brand
// underline on the selected one. Keyboard: arrows move between tabs
// (automatic activation), Home / End jump to the ends.

const List = styled.div`
  display: flex;
  gap: var(--space-16);
`;

const Tab = styled.button`
  ${tintLayer}
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--control-md-height);
  box-sizing: border-box;
  padding: var(--space-6) 0;
  border: 0;
  border-bottom: var(--border-width-rule) solid transparent;
  background: none;
  color: var(--fg-secondary);
  font-family: inherit;
  font-size: var(--text-heading);
  line-height: var(--text-heading-line-height);
  font-weight: var(--text-heading-weight);
  cursor: pointer;

  &::after {
    inset: 0 calc(-1 * var(--space-4)) var(--space-2);
    border-radius: var(--radius-mark);
  }

  &[aria-selected="true"] {
    color: var(--fg-default);
    border-bottom-color: var(--brand-fill);
    --tint-hover: transparent;
  }
`;

export interface TabItem {
  id: string;
  label: string;
}

interface TabListProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name for the tab list. */
  label: string;
  /** Prefix for tab / panel ids, so several tab sets can share a page. */
  idPrefix: string;
}

export const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

export function TabList({ items, value, onChange, label, idPrefix }: TabListProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight"
        ? index === last ? 0 : index + 1
        : e.key === "ArrowLeft"
          ? index === 0 ? last : index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <List role="tablist" aria-label={label}>
      {items.map((item, i) => {
        const selected = item.id === value;
        return (
          <Tab
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(idPrefix, item.id)}
            aria-selected={selected}
            aria-controls={panelId(idPrefix, item.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {item.label}
          </Tab>
        );
      })}
    </List>
  );
}
