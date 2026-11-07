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

## Overrode (this is important to us)

Where I rejected or reworked AI output. For each: include what it suggested, what I did instead, and why. Be specific: values beat adjectives. Include any time it said something matched the reference and it didn't.

- Part 1a, page title: It suggested fixing the h1 with all five `--text-title-*` tokens, adding `--text-title-tracking` and `--text-title-transform` to size, line-height and weight. I checked the reference's `.page-head[data-size="lg"] .page-head-heading` rule and it only sets the three (24px / 32px / 600). Tracking and transform aren't used there, and their values are `normal` / `none`, so I kept the three-token fix to match the reference. The AI had reasoned from the token set rather than from what the reference actually does.
- Part 1a, one-line fixes: It marked row height (`--row-tall` → `--row-lg`), header row colours (`--bg-subtle`/`--fg-secondary` → `--bg-default`/`--fg-tertiary`), the row hover transition (`300ms ease-in` → `--duration-quick`/`--easing-standard`) and the link colour (`#00a88b` → `--fg-link`) as deferred follow-ups or nits. Each was a one-line token swap, so I decided to fix them now along with the focus ring, and checked each value in DevTools afterwards (40px rows, #FFFFFF / #8C908F header, 0.11s transition, #00A78B link).
- Part 1a, scope: Its audit mixed in several functional bugs (counts going to 0, loading logic). I cut it to design-system mismatches only, as the brief asks.
- Part 1a, reference is spec: It tagged the filter and badge "raise with design". The reference already answers both, so I made them discrepancies.
- Part 1, font loading: It left the slow-loading font claim "not measured". I had it measured before keeping it: a four-request chain (HTML → CSS → Google Fonts CSS → woff2), with the font arriving at about 1.0s at 4× CPU on Fast 4G (AUDIT, "The system itself").

## Misled

Where AI led me down a wrong path before I caught it, for example a token that doesn't exist in `tokens.css`, a match it claimed without rendering anything, or a library the brief rules out. How I noticed. Roughly what it cost me in terms of time.

- Part 1a, status filter: It flagged a visual difference in the filter section, but it was comparing the control bar at the top of the reference with the filter in the build. The real counterpart is the per-group status band (Disputed, Cpty alleged, …). I caught it early because I'd asked for a side-by-side image of each issue, so I could review its findings visually.
- Part 1a/1b, loading: It said the system had no loading pattern, and I'd written that into the audit (#11, 1b, "The system itself"). When I questioned the "what's missing from the system" section, a search of `tokens.css` for "skeleton" turned up `--skeleton-base` (#F0F2F1) and `--skeleton-pulse` (#DFE2E1). It had missed tokens that exist. The real gap is narrower: the tokens exist, but no component or motion spec in the reference uses them. I corrected all three places.

## Next time

Things I'd do differently on my next AI-assisted task, based on what I've learned from working on this test.

-
