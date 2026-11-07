"use client";

import styled, { css } from "styled-components";
import type { ReactNode } from "react";

// Mirrors the reference's `.field` / `.field-label` / `.field-status` and
// `.text-area.field-box`.

const Root = styled.div<{ $fill: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  ${({ $fill }) =>
    $fill
      ? css`
          max-width: none;
          margin: 0;
        `
      : css`
          max-width: 560px;
          margin-bottom: var(--space-8);
        `}
`;

const Label = styled.label`
  color: var(--fg-tertiary);
  font-size: var(--text-label);
  line-height: var(--text-label-line-height);
  font-weight: var(--text-label-weight);
`;

const Status = styled.p<{ $danger: boolean }>`
  margin: 0;
  color: ${({ $danger }) =>
    $danger ? "var(--status-danger-fg)" : "var(--fg-tertiary)"};
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);
`;

interface FieldProps {
  label: ReactNode;
  htmlFor: string;
  children: ReactNode;
  status?: ReactNode;
  statusTone?: "neutral" | "danger";
  /** Fill the container instead of the 560px field width. */
  fill?: boolean;
}

export function Field({
  label,
  htmlFor,
  children,
  status,
  statusTone = "neutral",
  fill = false,
}: FieldProps) {
  return (
    <Root $fill={fill}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {status ? <Status $danger={statusTone === "danger"}>{status}</Status> : null}
    </Root>
  );
}

const fieldBox = css`
  background: var(--bg-default);
  border: var(--border-width-hairline) solid var(--border-control);
  border-radius: var(--radius-control);
  transition: box-shadow var(--duration-quick) var(--easing-standard);

  &:hover,
  &:focus {
    border-color: var(--border-strong);
  }
  &[aria-invalid="true"] {
    border-color: var(--status-danger-border);
  }
  &:disabled {
    opacity: var(--state-disabled-opacity);
  }
  &:is(:disabled, [readonly]):is(:hover, :active) {
    box-shadow: none;
    border-color: var(--border-control);
  }
`;

export const TextArea = styled.textarea<{ $size?: "sm" | "md" | "lg" }>`
  ${fieldBox}
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: var(--space-8);
  color: var(--fg-default);
  font-family: inherit;
  font-size: var(--text-control);
  line-height: var(--text-control-line-height);
  font-weight: var(--text-control-weight);
  resize: vertical;

  &::placeholder {
    color: var(--fg-placeholder);
  }

  ${({ $size }) =>
    $size === "sm"
      ? css`
          padding: var(--space-4) var(--space-8);
          border-radius: var(--radius-small);
          font-size: var(--text-meta);
          line-height: var(--text-meta-line-height);
          font-weight: var(--text-meta-weight);
        `
      : $size === "lg"
        ? css`
            padding: var(--space-12);
            border-radius: var(--radius-control-lg);
          `
        : css``}
`;

/** Character count shown beside a field's actions, e.g. "0/1000". */
export const CharCount = styled.span`
  color: var(--fg-tertiary);
  font-size: var(--font-size-12);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);
  font-variant-numeric: tabular-nums;
`;
