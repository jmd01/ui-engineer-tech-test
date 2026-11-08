"use client";

import styled, { css, keyframes } from "styled-components";

// A placeholder for content that is still loading. The system has the two
// colours (--skeleton-base, --skeleton-pulse) but no component or motion, so
// the shape and motion here are ours (see DECISIONS).
//
// Shapes:
// - text: a bar standing in for one line of a text style. The box takes the
//   style's line height, so a row of skeleton text is exactly as tall as the
//   text it replaces; the bar inside is the style's font size.
// - badge: the size of a Badge.
// - block: any size, given by $width / $height.
//
// Skeletons are hidden from assistive tech; mark the loading region with
// aria-busy and give it a label instead.

export type SkeletonShape = "text" | "badge" | "block";
export type SkeletonText =
  | "title"
  | "heading-lg"
  | "heading"
  | "body"
  | "body-compact"
  | "label"
  | "meta";

interface SkeletonProps {
  $shape?: SkeletonShape;
  /** For text: which text style the bar stands in for. Default "body". */
  $text?: SkeletonText;
  /** Any CSS width. Default 100% (text, block) or 64px (badge). */
  $width?: string;
  /** Block only. Any CSS height. */
  $height?: string;
}

const pulse = keyframes`
  0%, 100% { background-color: var(--skeleton-base); }
  50% { background-color: var(--skeleton-pulse); }
`;

// Fades in after a short delay, so a fast load never flashes a skeleton.
const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const DELAY = "150ms";

const fill = css`
  background-color: var(--skeleton-base);
  animation:
    ${appear} var(--duration-moderate) var(--easing-entrance) ${DELAY} both,
    ${pulse} calc(var(--duration-slowest) * 2) var(--easing-standard) ${DELAY}
      infinite;
`;

export const Skeleton = styled.span.attrs({ "aria-hidden": true })<SkeletonProps>`
  display: block;
  flex: 0 0 auto;
  max-width: 100%;
  box-sizing: border-box;

  ${({ $shape = "text", $text = "body", $width, $height }) => {
    if ($shape === "badge") {
      return css`
        ${fill}
        width: ${$width ?? "64px"};
        height: var(--control-xs-height);
        border-radius: var(--radius-small);
      `;
    }
    if ($shape === "block") {
      return css`
        ${fill}
        width: ${$width ?? "100%"};
        height: ${$height ?? "var(--control-md-height)"};
        border-radius: var(--radius-small);
      `;
    }
    return css`
      display: flex;
      align-items: center;
      width: ${$width ?? "100%"};
      height: var(--text-${$text}-line-height);

      &::before {
        content: "";
        ${fill}
        width: 100%;
        height: var(--text-${$text});
        border-radius: var(--radius-mark);
      }
    `;
  }}
`;

/** Visually hidden live text announcing the load, e.g. "Loading trade". */
export const SkeletonStatus = styled.span.attrs({ role: "status" })`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
