"use client";

import styled, { css } from "styled-components";
import type { TradeStatus } from "@/lib/schemas";

// Mirrors the reference's `.badge` (data-tone, data-color, data-size).
// The table uses outlined + neutral; the detail header uses subtle + a status colour.

export type BadgeTone = "plain" | "subtle" | "outlined";
export type BadgeColor =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

const colors: Record<BadgeColor, ReturnType<typeof css>> = {
  neutral: css`
    --badge-fill: var(--bg-tint);
    --badge-ink: var(--fg-secondary);
    --badge-line: var(--border-default);
  `,
  brand: css`
    --badge-fill: var(--brand-tint);
    --badge-ink: var(--fg-link-on-brand);
    --badge-line: var(--brand-border-subtle);
  `,
  success: css`
    --badge-fill: var(--status-success-tint);
    --badge-ink: var(--status-success-on-subtle);
    --badge-line: var(--status-success-border-subtle);
  `,
  warning: css`
    --badge-fill: var(--status-warning-tint);
    --badge-ink: var(--status-warning-on-subtle);
    --badge-line: var(--status-warning-border-subtle);
  `,
  danger: css`
    --badge-fill: var(--status-danger-tint);
    --badge-ink: var(--status-danger-on-subtle);
    --badge-line: var(--status-danger-border-subtle);
  `,
  info: css`
    --badge-fill: var(--status-info-tint);
    --badge-ink: var(--status-info-on-subtle);
    --badge-line: var(--status-info-border-subtle);
  `,
};

interface BadgeProps {
  $tone?: BadgeTone;
  $color?: BadgeColor;
  $size?: "xs" | "sm";
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  max-width: 100%;
  box-sizing: border-box;
  height: var(--control-xs-height);
  padding: 0 var(--space-4);
  border: var(--border-width-hairline) solid transparent;
  border-radius: var(--radius-small);
  background: none;
  color: var(--badge-ink);
  font-family: inherit;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  ${({ $color = "neutral" }) => colors[$color]}
  ${({ $tone = "outlined" }) =>
    $tone === "subtle"
      ? css`
          background: var(--badge-fill);
        `
      : $tone === "outlined"
        ? css`
            border-color: var(--badge-line);
          `
        : css``}
  ${({ $size }) =>
    $size === "sm" &&
    css`
      height: var(--control-sm-height);
      padding: 0 var(--space-6);
    `}
`;

/**
 * Status → badge colour. The reference only has its own statuses
 * (Disputed is danger, Confirmed is success); the others are our call.
 */
export function statusColor(status: TradeStatus): BadgeColor {
  switch (status) {
    case "dispute":
    case "error":
      return "danger";
    case "confirmed":
      return "success";
    case "submitted":
      return "info";
    case "deleted":
      return "neutral";
  }
}

/** Human label for a status, matching the reference's wording style. */
export function statusLabel(status: TradeStatus): string {
  return {
    dispute: "Disputed",
    submitted: "Submitted",
    confirmed: "Confirmed",
    deleted: "Deleted",
    error: "Errored",
  }[status];
}
