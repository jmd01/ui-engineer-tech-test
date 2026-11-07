"use client";

import { createContext, useContext } from "react";
import styled, { keyframes } from "styled-components";

// The reference's item drawer: a 450px side panel that slides in over the list
// (the reference's overlay mode: drawer layer, high elevation).
//
// The frame lives in the trades layout, which stays mounted while you move
// between trades. It's hidden while the drawer slot is empty, so the slide-in
// plays only when the drawer opens, not when you switch to another trade.

const DRAWER_W = "450px"; // reference --dw (not a system token)

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const DrawerFrame = styled.aside`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: var(--layer-drawer);
  width: ${DRAWER_W};
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-default);
  border-inline-start: var(--border-width-hairline) solid var(--border-divider);
  box-shadow: var(--elevation-high);
  overflow: hidden;
  /* Duration token is 0ms under prefers-reduced-motion. */
  animation: ${slideIn} var(--duration-slow) var(--easing-entrance);

  &:empty {
    display: none;
  }
`;

// The drawer's selected tab, held above the drawer so it carries over when
// you open another trade.
export const DrawerTabContext = createContext<{
  tab: string;
  setTab: (tab: string) => void;
} | null>(null);

export const useDrawerTab = () => useContext(DrawerTabContext);
