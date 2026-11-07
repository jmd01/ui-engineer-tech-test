"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: var(--family-sans);
    font-size: var(--text-body);
    line-height: var(--text-body-line-height);
    background: var(--bg-default);
    color: var(--fg-default);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    overflow: hidden; /* the shell's panes scroll, not the page */
  }

  button {
    font-family: inherit;
  }

  :focus-visible {
    outline: 2px solid transparent; /* keeps a visible ring in forced-colors mode */
    box-shadow: var(--focus-ring);
  }

  /* Text fields show the ring only when reached from the keyboard; a click
     just darkens the border. data-focus is set by lib/keyboardFocus.ts. */
  :where(input:not([type="checkbox"], [type="radio"]), textarea, [contenteditable="true"]):focus-visible:not([data-focus="keyboard"]) {
    box-shadow: none;
  }
`;
