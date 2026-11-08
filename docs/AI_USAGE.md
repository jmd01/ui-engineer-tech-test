# AI usage

This is a key part of the submission that we read closely. Remember ...

> **We are not testing whether you used AI. We are testing how you directed it.**

Keep each bullet specific. "I used Cursor for 40% of the code" is not useful. "I asked Cursor to migrate the emails panel; it matched the colours but hard-coded the spacing; I swapped in the spacing tokens and measured the result against the reference in DevTools" is.

AI tools can't see what you see. Tell us how you checked their visual claims: DevTools measurements, screenshots side by side with the reference, the Performance panel.

## Delegated

What I delegated and gave to AI to implement wholesale, and how I checked the result. 1–2 sentences each.

- An initial request to review the codebase, focussing on the frontend especially
- Install and run the project
- Part 1a: Review the task. Provide a list of issues found in code. Verify them in the browser. Create a findings document using the format described in AUDIT.md. Also provide screenshots of the ref vs build and instructions on how to verify manually. 
- Part 2, app shell and component library: the component library gave me the visual reference and confidence it could go ahead with the build of the `/trades/[id]` page accurately. I checked them by comparing computed styles against the reference element by element (top bar, nav items, buttons, badges, facts list, text area all matched exactly) and with screenshots in `docs/screenshots/`.
- Part 3, loading states: I had it build the `Skeleton` component and apply it to the table and drawer. I checked it with every API request delayed by 3s, using screenshots and measured positions. Also had it fix the Assistant streaming re-render bug. To test it, it ran a MutationObserver on the message list whilst running a chat in the browser.

## Overrode (this is important to us)

Where I rejected or reworked AI output. For each: include what it suggested, what I did instead, and why. Be specific: values beat adjectives. Include any time it said something matched the reference and it didn't.

- Part 1a, page title: It suggested fixing the h1 with all five `--text-title-*` tokens, adding `--text-title-tracking` and `--text-title-transform` to size, line-height and weight. I checked the reference's `.page-head[data-size="lg"] .page-head-heading` rule and it only sets the three (24px / 32px / 600). Tracking and transform aren't used there, and their values are `normal` / `none`, so I kept the three-token fix to match the reference. The AI had reasoned from the token set rather than from what the reference actually does.
- Part 1a, one-line fixes: It marked row height (`--row-tall` → `--row-lg`), header row colours (`--bg-subtle`/`--fg-secondary` → `--bg-default`/`--fg-tertiary`), the row hover transition (`300ms ease-in` → `--duration-quick`/`--easing-standard`) and the link colour (`#00a88b` → `--fg-link`) as deferred follow-ups or nits. Each was a one-line token swap, so I decided to fix them now along with the focus ring, and checked each value in DevTools afterwards (40px rows, #FFFFFF / #8C908F header, 0.11s transition, #00A78B link).
- Part 1a, scope: Its audit mixed in several functional bugs (counts going to 0, loading logic). I cut it to design-system mismatches only, as the brief asks.
- Part 1a, reference is spec: It tagged the filter and badge "raise with design". The reference already answers both, so I made them discrepancies.
- Part 1, font loading: It left the slow-loading font claim "not measured". I had it measured before keeping it: a four-request chain (HTML → CSS → Google Fonts CSS → woff2), with the font arriving at about 1.0s at 4× CPU on Fast 4G (AUDIT, "The system itself").
- Part 2, scope: It started extending the component library towards the list view (segmented controls, filter dropdowns, table). I pulled it back to what the detail page needs, since Part 2 is only `/trades/[id]`.
- Part 2, drawer vs page: It suggested keeping `/trades/[id]` as a full page, because the brief says to keep behaviour unless the migration needs a change. I overrode that: the brief also says it should look and behave like it belongs in the reference, and the reference opens items in a drawer over the list. We kept the URL, so links, back and refresh still work.
- Part 2, drawer behaviour: Its first drawer pushed the list narrower, replayed the slide-in every time you opened another trade, and reset to the first tab. I had it match the reference instead: the drawer slides in over the list, opening another trade swaps the content in place, and the current tab is kept. Checked in the browser: same drawer element, 0 replayed animations, tab still on Notes.
- Part 2, tab contents: It put Key economics under Overview. In the reference that's under Evidence, with Identifiers and the email, so I had it move them and check each tab's wording against the reference's DOM, not just which modules exist. Once I'd dropped the Arch-only content (see DECISIONS), the reference's Overview had nothing of ours left to show, so I named the tabs for our content instead: Overview (Identifiers, Key economics, emails) and Notes.
- Part 2, empty notes: It recommended keeping Save note always enabled, to preserve behaviour. I chose to match the reference and disable it until there's text, and recorded that in DECISIONS as a deliberate behaviour change.
- Part 3, choice of change: It proposed keyboard navigation between trades. When I asked it to argue against its own pick, it conceded the change was really six pieces (a hook, a key component, a footer, a row highlight and more), and only half matched the reference: it had put the shortcuts in the drawer, while the reference shows them on the list. Doing it properly on the list risked running past the 30 minutes, so I chose a loading state instead, which the brief names directly.
- Part 3, skeleton detail: Its plan put one skeleton over the drawer's tab content. I asked for the drawer's real layout with only the values missing: real labels, section captions and tabs, with a placeholder per value. It extended this to show the key economics from the list's data too, so only emails and notes wait. This is a much better UX and makes the app look polished.

## Misled

Where AI led me down a wrong path before I caught it, for example a token that doesn't exist in `tokens.css`, a match it claimed without rendering anything, or a library the brief rules out. How I noticed. Roughly what it cost me in terms of time.

- Part 1a, status filter: It flagged a visual difference in the filter section, but it was comparing the control bar at the top of the reference with the filter in the build. The real counterpart is the per-group status band (Disputed, Cpty alleged, …). I caught it early because I'd asked for a side-by-side image of each issue, so I could review its findings visually.
- Part 1a/1b, loading: It said the system had no loading pattern, and I'd written that into the audit (#11, 1b, "The system itself"). When I questioned the "what's missing from the system" section, a search of `tokens.css` for "skeleton" turned up `--skeleton-base` (#F0F2F1) and `--skeleton-pulse` (#DFE2E1). It had missed tokens that exist. The real gap is narrower: the tokens exist, but no component or motion spec in the reference uses them. I corrected all three places.
- Part 1a, page background: Its audit missed that the whole page sits on grey. I spotted it while building the shell: the build uses `--bg-subtle` (#F0F2F1), the reference's list is on `--bg-default` (#FFFFFF). I added it as #12 and had it recheck the list for anything else it had missed.
- Part 2, drawer tabs: It built the drawer and said it matched the reference, but had only checked which modules each tab had, not what they said. When I asked if it had really compared them, it admitted it hadn't: "Suggestion" where the reference says "Arch's suggestion", no "Assigned · arrived" line under the caption, and the counterparty in the wrong place in the header. I had it compare each tab's wording against the reference's DOM. It cost a round of rework on the drawer.
- Part 3, reading the reference: It made claims about the reference that were wrong. It proposed keyboard navigation in the drawer only, but the reference shows its shortcut hints on the list. It recommended an incorrect transition for the drawer. And it called `busypulse` the system's loading motion, but that's the reference page's own CSS for an "in progress" dot. I caught each one by asking where in the reference it happens, at the cost of several rounds of back-and-forth.

## Next time

Things I'd do differently on my next AI-assisted task, based on what I've learned from working on this test.

- Settle what "match the reference" covers before building so mine and agents view is aligned. E.g. the drawer was built to look like Arch even though some of the fields in Arch aren't available in the Blotter. Asking that question first would have saved a round of building and removing.
- Ask it to argue against its own recommendation before accepting it, and to show where in the reference something happens before trusting "the reference does X". 
- Bring my own setup, or spell it out in the prompt. At work I have subagents and skills I've built up over time. They make the agent ask for context before building, and run lint and tsc etc before it says it's done. I didn't have them here, and I couldn't tell in advance where that would fall short. It showed most when it started building before asking questions. Next time I'd put those rules in the prompt from the start. 
