"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleAssistant } from "@/lib/slices/uiSlice";
import { AssistantDrawer } from "./AssistantDrawer";

// Fixed-viewport shell, following the reference: the page itself never
// scrolls; the main area scrolls on its own (the trade drawer relies on this).
// The header keeps the blotter's own items, restyled with the system tokens.

const TOPBAR_H = "52px"; // reference --topbar-h (not a system token)

const Shell = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  flex: 0 0 auto;
  height: ${TOPBAR_H};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
  padding: 0 var(--space-16);
  background: var(--bg-default);
  border-bottom: var(--border-width-hairline) solid var(--border-divider);
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--fg-default);
  text-decoration: none;
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  font-weight: var(--weight-semibold);

  span.mark {
    display: inline-block;
    width: var(--icon-size-16);
    height: var(--icon-size-16);
    border-radius: var(--radius-small);
    background: var(--brand-control);
  }
`;

// Matches the reference's primary brand button at size lg ("Ask Arch Agent").
const AssistantButton = styled.button`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  height: var(--control-lg-height);
  padding: 0 var(--space-16);
  border: var(--border-width-hairline) solid var(--brand-control);
  border-radius: var(--radius-control-lg);
  background: var(--brand-control);
  color: var(--brand-on-control);
  font-family: inherit;
  font-size: var(--text-control);
  line-height: var(--text-control-line-height);
  font-weight: var(--text-control-weight);
  white-space: nowrap;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    inset: calc(-1 * var(--border-width-hairline));
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
    transition: background var(--duration-quick) var(--easing-standard);
  }
  &:hover::after {
    background: var(--state-hover-on-fill);
  }
  &:active::after {
    background: var(--state-press-on-fill);
  }
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  overflow: clip;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-16);
`;

const NavLink = styled(Link)`
  color: var(--fg-secondary);
  text-decoration: none;
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  font-weight: var(--text-body-weight);
  transition: color var(--duration-quick) var(--easing-standard);

  &:hover,
  &[aria-current="page"] {
    color: var(--fg-default);
  }
  &[aria-current="page"] {
    font-weight: var(--weight-semibold);
  }
`;

const Main = styled.main`
  min-width: 0;
  overflow-y: auto;
`;

export function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.assistantOpen);
  const onTrades = usePathname()?.startsWith("/trades") ?? false;
  return (
    <Shell>
      <TopBar>
        <Brand href="/trades">
          <span className="mark" aria-hidden />
          <span>Yantra</span>
        </Brand>
        <Nav aria-label="Main">
          <NavLink href="/trades" aria-current={onTrades ? "page" : undefined}>
            Trades
          </NavLink>
          <AssistantButton
            type="button"
            onClick={() => dispatch(toggleAssistant())}
            aria-expanded={open}
          >
            Assistant
          </AssistantButton>
        </Nav>
      </TopBar>
      <Body>
        <Main>{children}</Main>
      </Body>
      <AssistantDrawer />
    </Shell>
  );
}
