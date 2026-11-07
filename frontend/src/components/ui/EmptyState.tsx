"use client";

import styled, { css } from "styled-components";
import type { ReactNode } from "react";

// Mirrors the reference's `.empty-state` (data-size, data-align).

const Root = styled.div<{ $size: "sm" | "md"; $align: "center" | "start" }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
  color: var(--fg-tertiary);
  ${({ $align }) =>
    $align === "start"
      ? css`
          align-items: flex-start;
          text-align: start;
        `
      : css`
          align-items: center;
          text-align: center;
        `}
  ${({ $size }) =>
    $size === "md"
      ? css`
          padding: var(--space-stack-loose) var(--space-16);
          font-size: var(--text-body);
          line-height: var(--text-body-line-height);
          font-weight: var(--text-body-weight);
        `
      : css`
          font-size: var(--text-meta);
          line-height: var(--text-meta-line-height);
          font-weight: var(--text-meta-weight);
        `}
`;

const Heading = styled.p`
  margin: 0;
  color: var(--fg-secondary);
  font-weight: var(--weight-semibold);
`;

const Text = styled.p`
  margin: 0;
`;

const Actions = styled.div<{ $align: "center" | "start" }>`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin-top: var(--space-4);
  justify-content: ${({ $align }) => ($align === "center" ? "center" : "flex-start")};
`;

interface EmptyStateProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  size?: "sm" | "md";
  align?: "center" | "start";
}

export function EmptyState({
  title,
  description,
  actions,
  size = "md",
  align = "center",
}: EmptyStateProps) {
  return (
    <Root $size={size} $align={align}>
      {title ? <Heading>{title}</Heading> : null}
      {description ? <Text>{description}</Text> : null}
      {actions ? <Actions $align={align}>{actions}</Actions> : null}
    </Root>
  );
}
