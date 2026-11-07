"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { DrawerFrame, DrawerTabContext } from "@/components/TradeDrawer";

// The trades area: the list (or a full trade page), with the trade drawer
// slot laid over it on the right.

const Split = styled.div`
  position: relative; /* the drawer is positioned over the list */
  /* Clip the drawer while it slides in from off-screen, so the main area
     doesn't gain a horizontal scroll. */
  overflow: clip;
  display: flex;
  height: 100%;
  min-height: 0;
`;

const Content = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  overflow-y: auto;
`;

export default function TradesLayout({
  children,
  drawer,
}: {
  children: React.ReactNode;
  drawer: React.ReactNode;
}) {
  const pathname = usePathname();
  const [tab, setTab] = useState("overview");

  // Back on the list, the drawer is closed: next time it opens on Overview.
  useEffect(() => {
    if (pathname === "/trades") setTab("overview");
  }, [pathname]);

  return (
    <DrawerTabContext.Provider value={{ tab, setTab }}>
      <Split>
        <Content>{children}</Content>
        <DrawerFrame aria-label="Trade">{drawer}</DrawerFrame>
      </Split>
    </DrawerTabContext.Provider>
  );
}
