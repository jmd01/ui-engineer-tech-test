import { css } from "styled-components";

// The reference's shared interaction layer: a tint painted behind the content
// on hover / press / focus, so every control gets the same state colours.
// Components can override --tint-hover / --tint-press (e.g. on filled buttons).
export const tintLayer = css`
  position: relative;
  isolation: isolate;
  --tint-rest: transparent;
  --tint-hover: var(--state-hover);
  --tint-press: var(--state-press);
  --tint-focus: var(--tint-press);
  --tint: var(--tint-rest);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background: var(--tint);
    transition: background var(--duration-quick) var(--easing-standard);
  }

  &:hover {
    --tint: var(--tint-hover);
  }
  &:active {
    --tint: var(--tint-press);
  }
  &:focus-visible {
    --tint: var(--tint-focus);
  }
  &:is([disabled], [aria-disabled="true"]):is(:hover, :active) {
    --tint: transparent;
  }
`;
