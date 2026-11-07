"use client";

import styled, { css } from "styled-components";
import { tintLayer } from "./interactive";

// Mirrors the reference's `.button` / `.icon-button`
// (data-tone, data-color, data-size).

export type ButtonTone = "primary" | "secondary" | "ghost";
export type ButtonColor = "brand" | "neutral" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleProps {
  $tone?: ButtonTone;
  $color?: ButtonColor;
  $size?: ButtonSize;
  $block?: boolean;
}

const toneColor = ({
  $tone = "secondary",
  $color = "neutral",
}: ButtonStyleProps) => {
  if ($tone === "primary") {
    const fill = {
      brand: css`
        border-color: var(--brand-control);
        background: var(--brand-control);
        color: var(--brand-on-control);
      `,
      neutral: css`
        border-color: var(--bg-inverse);
        background: var(--bg-inverse);
        color: var(--fg-inverse);
      `,
      danger: css`
        border-color: var(--status-danger-fill-strong);
        background: var(--status-danger-fill-strong);
        color: var(--status-danger-on-fill);
      `,
    }[$color];
    return css`
      ${fill}
      --tint-hover: var(--state-hover-on-fill);
      --tint-press: var(--state-press-on-fill);
      &::after {
        inset: calc(-1 * var(--border-width-hairline));
      }
    `;
  }
  if ($tone === "ghost") {
    return css`
      background: none;
      border-color: transparent;
      color: ${{
        brand: "var(--fg-link)",
        neutral: "var(--fg-secondary)",
        danger: "var(--status-danger-fg)",
      }[$color]};
    `;
  }
  // secondary
  return {
    brand: css`
      color: var(--fg-link);
      border-color: var(--brand-border-subtle);
    `,
    neutral: css``,
    danger: css`
      color: var(--status-danger-fg);
      border-color: var(--status-danger-border-subtle);
    `,
  }[$color];
};

const sizes = {
  sm: css`
    height: var(--control-sm-height);
    padding: 0 var(--space-8);
    border-radius: var(--radius-small);
    font-size: var(--text-meta);
    line-height: var(--text-meta-line-height);
    font-weight: var(--text-meta-weight);
  `,
  md: css``,
  lg: css`
    height: var(--control-lg-height);
    padding: 0 var(--space-16);
    border-radius: var(--radius-control-lg);
  `,
};

export const Button = styled.button.attrs<ButtonStyleProps>(({ type }) => ({
  type: type ?? "button",
}))<ButtonStyleProps>`
  ${tintLayer}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex: 0 0 auto;
  height: var(--control-md-height);
  padding: 0 var(--space-12);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-control);
  background: var(--bg-default);
  color: var(--fg-default);
  font-family: inherit;
  font-size: var(--text-control);
  line-height: var(--text-control-line-height);
  font-weight: var(--text-control-weight);
  white-space: nowrap;
  cursor: pointer;

  svg {
    flex: 0 0 auto;
  }

  ${({ $size = "md" }) => sizes[$size]}
  ${toneColor}
  ${({ $block }) =>
    $block &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: var(--state-disabled-opacity);
    cursor: default;
  }
  ${({ $tone = "secondary" }) =>
    $tone === "secondary" &&
    css`
      &:disabled {
        opacity: 1;
        color: var(--fg-disabled);
        border-color: var(--border-divider);
      }
    `}
`;

interface IconButtonStyleProps {
  $tone?: ButtonTone;
  $size?: ButtonSize;
}

const iconSizes = {
  sm: css`
    width: var(--control-sm-height);
    height: var(--control-sm-height);
    border-radius: var(--radius-small);
    svg {
      width: var(--control-sm-font-size);
      height: var(--control-sm-font-size);
    }
  `,
  md: css`
    svg {
      width: var(--control-md-font-size);
      height: var(--control-md-font-size);
    }
  `,
  lg: css`
    width: var(--control-lg-height);
    height: var(--control-lg-height);
    border-radius: var(--radius-control-lg);
  `,
};

/** Square icon-only button. Always pass an aria-label. */
export const IconButton = styled.button.attrs<IconButtonStyleProps>(
  ({ type }) => ({ type: type ?? "button" }),
)<IconButtonStyleProps>`
  ${tintLayer}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--control-md-height);
  height: var(--control-md-height);
  padding: 0;
  border: var(--border-width-hairline) solid transparent;
  border-radius: var(--radius-control);
  background: none;
  color: var(--fg-secondary);
  font-family: inherit;
  cursor: pointer;

  svg {
    display: block;
  }

  ${({ $size = "md" }) => iconSizes[$size]}
  ${({ $tone = "ghost" }) =>
    $tone === "secondary"
      ? css`
          border-color: var(--border-default);
          background: var(--bg-default);
        `
      : $tone === "primary"
        ? css`
            background: var(--brand-control);
            color: var(--brand-on-control);
            --tint-hover: var(--state-hover-on-fill);
            --tint-press: var(--state-press-on-fill);
          `
        : css``}

  &:disabled {
    opacity: var(--state-disabled-opacity);
    cursor: default;
  }
`;
