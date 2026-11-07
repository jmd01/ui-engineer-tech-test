"use client";

// Browsers match :focus-visible on text fields even when they are clicked, so
// CSS alone can't tell a click from a Tab. As in the reference, remember
// whether the last input was a key or a pointer, and mark text fields focused
// from the keyboard with data-focus="keyboard". The global style hides the
// focus ring on text fields without that mark.

const TEXT_FIELD =
  'input:not([type="checkbox"],[type="radio"]),textarea,[contenteditable="true"]';

const isTextField = (t: EventTarget | null): t is Element =>
  t instanceof Element && t.matches(TEXT_FIELD);

export function installKeyboardFocusMarker(): () => void {
  let byKey = false;
  const onPointerDown = () => {
    byKey = false;
  };
  const onKeyDown = () => {
    byKey = true;
  };
  const onFocusIn = (e: FocusEvent) => {
    if (!isTextField(e.target)) return;
    if (byKey) e.target.setAttribute("data-focus", "keyboard");
    else e.target.removeAttribute("data-focus");
  };
  const onFocusOut = (e: FocusEvent) => {
    if (isTextField(e.target)) e.target.removeAttribute("data-focus");
  };

  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("focusin", onFocusIn, true);
  document.addEventListener("focusout", onFocusOut, true);
  return () => {
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("focusin", onFocusIn, true);
    document.removeEventListener("focusout", onFocusOut, true);
  };
}
