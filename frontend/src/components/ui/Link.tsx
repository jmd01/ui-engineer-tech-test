"use client";

import NextLink from "next/link";
import styled, { css } from "styled-components";

// Mirrors the reference's `.link` (data-size, data-color).

interface LinkStyleProps {
  $size?: "md" | "sm";
  $color?: "brand" | "neutral";
}

const linkStyles = css<LinkStyleProps>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0;
  border: 0;
  background: none;
  color: var(--fg-link);
  font-family: inherit;
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  font-weight: var(--text-body-weight);
  text-align: left;
  text-decoration: none;
  cursor: pointer;

  svg {
    flex: 0 0 auto;
  }

  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    text-decoration: underline;
    background: var(--state-press);
    border-radius: var(--radius-mark);
  }

  ${({ $size }) =>
    $size === "sm" &&
    css`
      font-size: var(--text-meta);
      line-height: var(--text-meta-line-height);
      font-weight: var(--text-meta-weight);
    `}
  ${({ $color }) =>
    $color === "neutral" &&
    css`
      color: var(--fg-default);
      text-decoration: underline;
      text-decoration-color: var(--border-strong);
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
      &:hover {
        text-decoration-color: currentColor;
      }
    `}
`;

/** Navigation link (wraps next/link). */
export const Link = styled(NextLink)<LinkStyleProps>`
  ${linkStyles}
`;
