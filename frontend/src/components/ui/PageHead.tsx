"use client";

import styled, { css } from "styled-components";
import type { ReactNode } from "react";

// Mirrors the reference's `.page-head` at its three sizes:
// lg (page title), md (compact page), drawer (an item's header).

type Size = "lg" | "md" | "drawer";

const Root = styled.header<{ $size: Size }>`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
  ${({ $size }) =>
    $size !== "lg" &&
    css`
      border-bottom: var(--border-width-hairline) solid var(--border-divider);
    `}
`;

const Row = styled.div<{ $size: Size; $flush: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
  min-width: 0;
  ${({ $size, $flush }) =>
    $flush
      ? css`
          padding: 0;
        `
      : {
          lg: css`
            padding: var(--space-24) var(--space-gutter) var(--space-8);
          `,
          md: css`
            padding: var(--space-12) var(--space-24);
          `,
          drawer: css`
            padding: var(--space-row-y);
            align-items: flex-start;
            gap: var(--space-stack-tight);
          `,
        }[$size]}
`;

const Main = styled.div<{ $size: Size }>`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ $size }) => ($size === "drawer" ? "var(--space-4)" : "var(--space-2)")};
`;

const Back = styled.div`
  align-self: flex-start;
  margin-bottom: var(--space-4);
`;

const Caption = styled.p<{ $size: Size }>`
  margin: 0;
  color: var(--fg-secondary);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);
  ${({ $size }) =>
    $size === "drawer" &&
    css`
      color: var(--fg-tertiary);
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
    `}
`;

const Heading = styled.h1<{ $size: Size }>`
  margin: 0;
  color: var(--fg-default);

  /* Focused by code (tabIndex -1) so a newly opened item's heading is where
     focus starts. It isn't interactive, so no ring, as in the reference
     (#dwtitle:focus-visible { box-shadow: none }). */
  &[tabindex="-1"]:focus {
    outline: none;
    box-shadow: none;
  }
  ${({ $size }) =>
    ({
      lg: css`
        font-size: var(--text-title);
        line-height: var(--text-title-line-height);
        font-weight: var(--text-title-weight);
      `,
      md: css`
        font-size: var(--text-heading);
        line-height: var(--text-heading-line-height);
        font-weight: var(--text-heading-weight);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `,
      drawer: css`
        font-size: var(--text-heading-lg);
        line-height: var(--text-heading-lg-line-height);
        font-weight: var(--text-heading-lg-weight);
        letter-spacing: var(--text-heading-lg-tracking);
      `,
    })[$size]}
`;

const Meta = styled.p<{ $size: Size }>`
  margin: 0;
  color: var(--fg-secondary);
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  font-weight: var(--text-body-weight);
  ${({ $size }) =>
    $size === "drawer" &&
    css`
      margin-top: var(--space-4);
      color: var(--fg-tertiary);
      font-size: var(--text-meta);
      line-height: var(--text-meta-line-height);
      font-weight: var(--text-meta-weight);
    `}
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-4);
`;

const TabsRow = styled.div<{ $size: Size }>`
  padding: ${({ $size }) =>
    ({ lg: "0 var(--space-gutter)", md: "0 var(--space-24)", drawer: "0 var(--space-row-y)" })[$size]};
`;

const End = styled.div<{ $size: Size }>`
  flex: 0 0 auto;
  display: flex;
  align-items: ${({ $size }) => ($size === "drawer" ? "flex-start" : "center")};
  gap: ${({ $size }) => ($size === "md" ? "var(--space-4)" : "var(--space-8)")};
`;

/** "·" separator used between facts in captions and meta lines. */
export const Sep = styled.span.attrs({ "aria-hidden": true, children: "·" })`
  margin: 0 var(--space-4);
`;

interface PageHeadProps {
  heading: ReactNode;
  size?: Size;
  caption?: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode;
  end?: ReactNode;
  back?: ReactNode;
  /** A TabList shown under the heading row (the reference's page-head-tabs). */
  tabs?: ReactNode;
  /** Id for the heading, e.g. to label a drawer or to move focus to it. */
  headingId?: string;
  /** Remove the row padding (when the page already pads its content). */
  flush?: boolean;
  as?: "h1" | "h2";
}

export function PageHead({
  heading,
  size = "lg",
  caption,
  meta,
  tags,
  end,
  back,
  tabs,
  headingId,
  flush = false,
  as = "h1",
}: PageHeadProps) {
  return (
    <Root $size={size}>
      <Row $size={size} $flush={flush}>
        <Main $size={size}>
          {back ? <Back>{back}</Back> : null}
          {caption ? <Caption $size={size}>{caption}</Caption> : null}
          <Heading as={as} $size={size} id={headingId} tabIndex={headingId ? -1 : undefined}>
            {heading}
          </Heading>
          {meta ? <Meta $size={size}>{meta}</Meta> : null}
          {tags ? <Tags>{tags}</Tags> : null}
        </Main>
        {end ? <End $size={size}>{end}</End> : null}
      </Row>
      {tabs ? <TabsRow $size={size}>{tabs}</TabsRow> : null}
    </Root>
  );
}
