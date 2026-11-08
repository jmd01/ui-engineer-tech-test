# Decisions

Use this document to log meaningful decisions. Short entries of a sentence or two are fine.

Explain what you chose, why, and what the downside is. Communicating design and technical trade-offs is a crucial part of our daily work.

Don't feel you have to include every minor decision.

---

## Part 2: Migration

Decisions you made while migrating the trade detail page: where you followed the reference, where you deviated, and why.

- **Built the app shell first.** Matched the reference's structure: fixed viewport, 52px top bar, and a main area that scrolls. Downside: it goes beyond the brief's scope for this part but I decided the trade off was worth it because building the foundations correctly at the start saves time later.
- **Component library in `components/ui`.** Built the primitives found in the reference: Button/IconButton, Badge, Link, PageHead, Module/FactsList, MessageCard, Field/TextArea and EmptyState. Props mirror the reference's `data-tone` / `data-color` / `data-size` as `$tone` / `$color` / `$size`.
- **Gallery at `/dev/components`, not Storybook.** Display every primitive in each variant and state. For the context of this tech test I needed a quick way to visually review the new component library. I would configure Storybook for a production app. 
- **Status badges:** use the outlined neutral variant in the table, and the subtle and coloured variant in the detail header. Labels use the reference's wording ("Disputed", "Errored") instead of the raw status ("dispute"). 
- **A trade opens in a drawer over the list, as in the reference, and the URL is kept.** This was the biggest design choice - should I keep the existing `/trades/[id]` or go further and migrate to a drawer pattern like Arch. I decided to replicate Arch's UX as it was so much better than a separate view per trade. It sets the build up for migrating other features from Arch such as keyboard navigation and the assistant as a drawer inside the page body. There is a risk this is seen as going beyond the scope, I think the significant UX improvement is worth it.
- **Mapped the Arch design onto the Blotter's API.** The drawer keeps the reference's header structure (caption, heading, status badge) with the Blotter's content. I left out what our API doesn't have: Arch's suggested-action heading, assignee and arrival time, the Overview tab (Arch's suggestion, reasoning, disputed fields), and fields like Cpty Trade ID, USI or fixed rate. Downside: the drawer is sparser than the reference's.
- **Emails are newest first, and only the newest starts expanded; the rest show their summary.** The latest message is at the top and open. Collapsing the rest keeps a long thread scannable, and the reference shows its recap email open.
- **Email cards use the system's "flat" collapsible trigger: no hover tint.** With the reference's tinted trigger, an open card shows a grey block over its top half that reads as a separate panel. The system's flat kind (`.collapsible-trigger[data-kind="flat"]`) turns the tint off. Hover darkens the chevron instead, and the whole summary (sender and subject) is the click target. Keyboard focus shows a 2px ring inside the card's edge.
- **Page padding moved from the shell into each page, and the page background is now white** (`--bg-default`), so the trade and the list both sit on white like the reference (AUDIT #12, fixed).
- **Notes:** comment box above the entries, as in the reference's event log. Before, the form sat below the notes.
- **Save note is disabled until there's text**, matching the reference's Submit. A small behaviour change: before, the button was always enabled and an empty note did nothing.
- **Text fields show the focus ring only from the keyboard, as in the reference.** Clicking into a field just darkens the border to `--border-strong`; tabbing in shows the 2px `--focus-ring`, the same behaviour as the reference.

## Gaps and problems in the system

Where the page needed something the system doesn't cover, or a token or component looked wrong. For each: what the page needed, what the system offers, what you did, and what you would propose. If you already covered it in `AUDIT.md`, point to it rather than repeating it.

- **No mapping from status to colour for statuses the reference doesn't show.** The system has the colours (info, neutral, success, danger) but it's not clear which status gets which. The reference only shows Disputed (danger on the drawer badge) and Confirmed (success), and nothing for our Submitted or Deleted. I'd ask design to define the mapping for every status the product uses, and to settle Disputed, which the reference colours two ways.
- **No inset focus ring token.** The email card's trigger needs its keyboard ring inside the card's edge. The reference defines `--focus-ring-inset` for this, but `tokens.css` doesn't ship it. I hard-coded `inset 0 0 0 2px var(--fg-default)` in `MessageCard.tsx`; I'd propose adding the token so it can be swapped for it.
- **No component for a note or event-log entry.** The reference's event log only ever shows "No events yet". I composed entries from the message card's quote style (2px `--border-divider` rule on the left, body text, meta timestamp) and would propose an event-entry component to design.

## Other things I noticed

Behavioural bugs or anything else outside the migration that you spotted but didn't fix, and how much each matters.

- **Notional amount is formatted without its currency** (`toLocaleString`, no currency code), while the list uses `formatNotional`.
- **A failed trade request shows nothing** (`return null` in `TradeDetail.tsx`, kept from before the migration). With a wrong or deleted trade ID the drawer simply doesn't open, with no message saying why.
- **Save note can be submitted twice**: the button isn't disabled while the request is in flight (`isLoading` is read but unused).
- **Status counts drop to 0 when you filter the list** (`trades/page.tsx`): counts come from the filtered results. It makes the filter look broken, because the other statuses read as empty.
- **The assistant opens behind an open trade drawer.** The trade drawer uses the system's drawer layer (`--layer-drawer`, 200). The assistant drawer is out of scope and still uses hard-coded `z-index: 40` (39 for its backdrop), so it opens underneath. Introduced by the migration. The fix is to move the assistant onto the system's layers too (e.g. `--layer-modal`) or close one drawer when the other opens. Not fixed, because the assistant drawer is out of scope for Part 2.
- **Escape doesn't close the assistant drawer.**

## Part 3: Finesse

What you changed, why it was worth the time, and how you checked it (tools, measurements, devices).

**Loading states that keep the layout.** A new `Skeleton` component in the library (`ui/Skeleton`), used by the trades table and the trade drawer.

- **Why:** the list's skeleton came with the repo, but with hard-coded colours, a white shimmer and a gap that made the rows jump (AUDIT #11). The drawer showed only "Loading…", then the whole trade appeared at once. Now both keep their real layout while they load, so nothing moves when the data arrives.
- **Component:** a text bar (sized from a text style, so it displays the correct line height), a badge, and a block. It uses the system's `--skeleton-base` and `--skeleton-pulse`, pulses between them, and fades in after 150ms so fast loads never flash. Reduced motion turns the motion off through the system's tokens. Bars are hidden from screen readers; the loading area is marked `aria-busy` and announces "Loading trades" / "Loading trade". It's in the `/dev` gallery next to real text at each size.
- **Table:** the real header with placeholder rows at full row height, with bar widths varying by column and a badge shape for Status.
- **Drawer:** when you open a trade from the list, the list already has its ID, counterparty, status and key economics, so those show straight away and only emails and notes wait. On a refresh or deep link the list may not have loaded, so the header and key economics are placeholders too. Emails show two placeholder cards, the first open, as the loaded list does.
- **Gap:** the system has skeleton colours but no motion. I chose a 1.4s pulse (`--duration-slowest` × 2, `--easing-standard`) and the 150ms delay; I'd ask design to define both.
- **How I checked it:** manually with a throttled Network and scripted in Chrome with every API request delayed by 3s. Table rows are 40px in both states, and the table starts at the same position. Drawer labels sit at the same position before and after loading (Trade ID at 213px both times). The header shows "UBS / MW-370902 / Disputed" while loading when opened from the list, and placeholders on a direct load. The pulse is computed at 1.4s with a 0.15s delay, and at 0s with reduced motion. No console errors. Tests pass and TypeScript compiles.

**Assistant streaming bug.** `AssistantDrawer` declared its message bubble with `styled.div` inside `messages.map`, so every render created a new component type. React then unmounted and remounted every bubble on every streamed token and every keystroke in the input.

- **Why:** the conversation was rebuilt about 20 times a second (a token every 20–80ms) while a reply streamed, and the work grew with every message. The visible symptom: you couldn't select or copy text in the conversation while a reply was streaming.
- **Change:** the bubble is now declared once, keyed by message id and memoised, so only the reply being streamed updates. Styling is unchanged; the drawer is still on the legacy theme.
- **How I checked it:** Claude ran a MutationObserver on the message list, against a production build. A 60-word reply in a two-message conversation removed 268 nodes before and 0 after, and typing went from 4 removals per keystroke to 0. A selection in an earlier reply now survives a new reply streaming in. `AssistantDrawer.test.tsx` checks that the bubbles stay the same DOM nodes, and it fails on the old code. I also turned on "Highlight updates when components render" in React DevTools and checked it visually.
- **Not changed:** the list still jumps to the bottom on every token, even when you've scrolled up to read. Fixing that changes behaviour, so I left it.

## Next

What you would do with more time.

- **Filters, grouping and table controls, built on the data the blotter has.** The reference's toolbar mostly works with the Blotter's fields: a Filter menu for Status (the API supports it), Counterparty and Instrument (client-side), with the removable chip and Clear; Group by Status or Counterparty; and sortable, reorderable, resizable columns. That would make the list far more useful to work through. I'd leave out the parts that depend on Arch data the blotter doesn't have: the All breaks / Actions views, All trades / Today / Remaining, and saved views.
- **Integrate the Assistant into the page.** Today the assistant is detached: it has no idea whether you're on the list or in a trade, and with a trade open the UI looks broken as it slides in behind the trade drawer. In the reference, Chat is a column that sits next to the trade drawer and opens on the current context. I'd move the assistant into the shell's grid as a third column, open it with the open trade (or the list and its filter) as context, and show that context as a chip the user can remove. That fixes the layering bug by layout, and makes the assistant part of reviewing a trade instead of a separate window. The API only takes `{"message": ...}`, so passing the trade along would need either a context field on the socket or the context folded into the message; I'd agree that with the backend first.
