# Audit

Part 1: your review of the trades list migration (`/trades`) against the design reference.

## 1a. Component review

The page title, status filter, trades table, status badges and base styles. Write it the way you'd leave comments on a pull request, in your own words. For each issue, it helps to cover:

- where it is
- what you expected from the system, and what the build does instead
- how you found it, if it wasn't on the screen
- how much it matters: would you block the merge, ticket it as a follow-up, or call it a nit?
- what you did about it: fixed it, deferred it, or would raise it with design

Quote values where you can (px, hex, token names, ms). Group and order the issues however makes sense to you. A few sentences each is plenty.

Paths are relative to `frontend/src`.

### Page title

**1. Heading size**
- Where: `app/trades/page.tsx:12–25`
- Expected the h1 to use `--text-title` (24px / 32px / 600), like the reference's page heading. The build mixes two text styles: the size is `--text-heading-lg` (18px), but the line height and weight come from `--text-title`.
- Severity: quick fix.
- Action: fixed. Swapped `--text-heading-lg` for `--text-title`.

### Status filter

**2. Wrong component pattern**
- Where: `components/StatusFilter.tsx:14–49`
- Expected the reference's status filter: a row of ghost tokens, with the selection shown as a removable chip ("Status · Disputed, Errored", 24px, `--bg-tint`, 6px radius) and a Clear action. The build is a segmented control: a `--bg-tint` track with pressed segments, the active one is show as raised with `--elevation-low`.
- Severity: follow-up. It needs design input - should status filters match the reference's status filter or it's segmented controls?
- Action: deferred. The filter's placement (per group in the reference, page level in the build) is page layout, so it's covered in 1b.

**3. Size and colour**
- Where: `components/StatusFilter.tsx:14–49`
- Expected 20px tokens (`--control-xs-height`) with 12px labels (`--text-meta`), 600-weight counts, and colour by status: dispute `--status-warning-fg` #BC8D03, error `--status-danger-fg` #E37360, others #4C514F. The build has a 28px track (`--control-md-height`) with 24px segments (`--control-sm-height`), 14px text (`--text-control`), and everything in `--fg-secondary`.
- Severity: follow-up. Do it with #2.
- Action: deferred. Assuming it should match the reference's status filter, the token component should take a `tone` (ghost here) and a `color` (danger, warning or neutral) so it can be reused.

### Trades table

**4. Row height**
- Where: `components/TradesTable.tsx:44`
- Expected 40px body rows (`--row-lg`). The build uses `--row-tall` (48px), an 8px difference.
- Severity: quick fix, it's a one-token swap.
- Action: fixed. Now `--row-lg`.

**5. Header row colours**
- Where: `components/TradesTable.tsx:35–41`
- Expected a white header row with `--fg-tertiary` (#8C908F) text. The build uses `--bg-subtle` (#F0F2F1) with `--fg-secondary` (#4C514F) text.
- Severity: quick fix, it's a one-line swap.
- Action: fixed. Now `--bg-default` and `--fg-tertiary`.

**6. Row hover transition**
- Where: `components/TradesTable.tsx:49`
- Expected `--duration-quick` (110ms) with `--easing-standard`. The build hard-codes `300ms ease-in`, so the hover feels sluggish. Because it's hard-coded, it also ignores reduced motion, where the system sets every duration token to 0ms.
- Found: hovering a row, then checking `transition` in DevTools.
- Severity: quick fix, it's a one-line swap.
- Action: fixed. Now `var(--duration-quick) var(--easing-standard)`.

**7. Link colour**
- Where: `components/TradesTable.tsx:62`
- Expected `--fg-link` (#00A78B). The build hard-codes `#00a88b`, which is close but bypasses the token.
- Severity: nit.
- Action: fixed. Now `var(--fg-link)`.

**8. Notional alignment**
- Where: `components/TradesTable.tsx:82, 95`
- Expected right-aligned figures with `font-variant-numeric: tabular-nums`, as in the reference. The build left-aligns them with proportional figures, so amounts don't line up down the column. The reference uses tabular figures on every cell, not just Notional.
- Severity: follow-up.
- Action: deferred.

### Status badges

**9. Filled pill instead of outlined badge**
- Where: `components/ui/Badge.tsx:31–49`
- Expected the reference badge: outlined, 6px radius, 1px `--border-default`, transparent fill, #4C514F text, 20px tall. The build is a filled pill (`--radius-pill`) with a status tint, e.g. dispute is rgba(239,184,28,.2) with #664B01 text. In the reference, status colour lives on the filter tokens, not on the badge.
- Severity: follow-up. `Badge` is shared with the detail page.
- Action: deferred to Part 2.

### Base styles

**10. Focus ring**
- Where: `lib/globalStyle.ts:26–29`
- Expected `box-shadow: var(--focus-ring)`, a 2px #181B1A ring. The build still uses the legacy theme: a `2px solid` #2352DB outline with a 2px offset, from `lib/theme.ts`.
- Found: tabbing through the filter and the table links.
- Severity: block. It's a base style the PR was meant to migrate, every focusable element shows the wrong colour, and the fix is one line.
- Action: fixed. Now `box-shadow: var(--focus-ring)`, with a transparent 2px outline kept so forced-colors mode still shows a ring. Checked by tabbing onto inactive and active filter segments: both show a 2px #181B1A ring.

**11. Loading skeleton**
- Where: `app/trades/page.tsx:37–43`
- Expected the skeleton to use the system's `--skeleton-base` (#F0F2F1) and `--skeleton-pulse` (#DFE2E1). The fill is hard-coded `#eef0ef`, the shimmer is a hard-coded white gradient, and the rows are `--row-lg` (40px) plus a 4px gap while the table rows are 48px, so the layout jumped when data arrived. Now that #4 is fixed, only the 4px gap differs.
- Found: throttling the network to Slow 3G and reloading.
- Severity: follow-up.
- Action: deferred. The system has skeleton tokens but no skeleton component that uses them; see "The system itself".

**12. Page background**
- Where: `lib/globalStyle.ts:17`
- Expected the list on `--bg-default` (#FFFFFF), as in the reference's trades view. The build puts it on `--bg-subtle` (#F0F2F1), which isn't used in the reference.
- Severity: follow-up. It ties into the page layout in 1b.
- Action: deferred.


## 1b. Closing the gap

A few paragraphs: what you'd change next to make the page feel like it belongs in Arch, in what order and why, what's missing from the system to get there, and what you'd ask design before starting.

**1. App shell.** Creating the page structure first gives a foundation for the rest of the build. Ensuring the layout fills the viewport and then ensuring the main panel and sidebar overflow correctly are worth doing first as everything builds on top of this structure.

**2. Break the reference design down into primitives.** Add any missing components (e.g. loading skeletons), extend existing components to make them reusable and take the relevant props (e.g. the status filter, button variants). Ensure this also encapsulates all component states (e.g. active, hover, focussed). 

**3. Replicate the Lattice view.** With a component library built it becomes easy to compose the components together into the UI of the Lattice page. Even with every component fixed, `/trades` is currently a heading, a filter and one flat table. The reference renders a view bar, a toolbar, then trades grouped into sections. Each section has its own status band and an "N open" count, and inside it the rows are split by status. 

**What's missing from the system.** It has skeleton colour tokens (`--skeleton-base`, `--skeleton-pulse`) but nothing else for loading. No component in the reference uses them, so there's no answer for the shape, row height, or motion (pulse or shimmer, and at what duration). Font loading is covered under "The system itself".

**What I'd ask design before starting.**
- The reference groups trades by Cleared, Bilaterals and Novations, but our API has no field for that. What should we group by: status, product type, or something the API would need to add?
- Clicking a status in one group's band filters every group, and the only sign of the filter is the toolbar chip. The token you clicked shows no selected state. Should status filtering be page level only (the toolbar chip), with each group's band filtering just that group?
- Should status colour live only on the filter tokens, with neutral badges in the table, as the reference shows?
- Are columns, sort and saved views in scope for this page, or later?
- What should loading look like?

**Tooling.** I'd also set up a Storybook gallery so each component can be browsed and checked against the reference in isolation.



## The system itself

Anything where the system looks wrong, inconsistent, or says nothing about something the product needs.

- **Font loading.** `tokens.css:3` loads Figtree with a Google Fonts `@import` inside the token stylesheet. That makes a four-request chain (HTML → CSS → Google Fonts CSS → woff2): in a Chrome trace at 4× CPU on Fast 4G the font arrived at about 1.0s and caused a layout shift when it swapped in. Suggest loading it with `next/font/google` in `app/layout.tsx`.
- **Accessibility tokens the reference uses aren't in `tokens.css`.** The reference defines `--focus-ring-inset` (a ring inside the element, for cards and the composer) and, under `@media (prefers-contrast: more)`, strengthens `--border-control`, `--fg-tertiary`, `--fg-placeholder` and both focus rings. Neither ships, so apps on the tokens get no high-contrast support.
- **Disputed has two colours in the reference.** The group band shows it as warning (`data-color="warning"`, #BC8D03), the drawer badge as danger (`data-color="danger"`, #833226 on a red tint). One status should have one colour; I'd ask design which.
- **Far more tokens than products use.** About a third of the 592 tokens appear neither in the reference nor in the blotter. Most are categories: 84 tokens (7 colours × 12 roles), of which the reference uses 20; category-01 repeats the brand mint, and olive (06) and "other" are never used. The rest: 32 unused alpha steps, chart palettes (`--sequential-*`, `--diverging-*`), a display type scale (36–72px, `--tracking-display-*`) with no text style using it, and `--breakpoint-*`, which can't work because custom properties aren't allowed in `@media` conditions. I'd ask design whether products need categories, and to confirm whether there are components already designed that use those tokens or whether they are bloat from an token generator, then prune the generated set to what we will be using.
- **To check with design: values that look generated rather than chosen.** `--category-01-hover` is tinted mint but categories 02–07 hover in neutral grey; `--status-info-tint` is 10%/20% opacity where every other tint is 20%/30%, confirm if this is intentional.
- **Skeletons: colours but no motion.** `--skeleton-base` and `--skeleton-pulse` exist, but no component or motion spec uses them yet.
