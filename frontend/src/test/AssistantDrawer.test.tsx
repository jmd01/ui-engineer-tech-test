import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSyncExternalStore } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ChatMessage } from "@/lib/ws";
import { AssistantDrawer } from "@/components/AssistantDrawer";
import { renderWithProviders } from "./helpers";

// A controllable stand-in for the WebSocket hook. Tokens are applied the same
// way ws.ts applies them: only the last message object is replaced.
let messages: ChatMessage[] = [];
const listeners = new Set<() => void>();
function setMessages(next: ChatMessage[]) {
  messages = next;
  listeners.forEach((l) => l());
}
function pushToken(token: string) {
  const last = messages[messages.length - 1];
  setMessages([
    ...messages.slice(0, -1),
    { ...last, content: last.content + token },
  ]);
}

vi.mock("@/lib/ws", () => ({
  useAssistantStream: () => ({
    messages: useSyncExternalStore(
      (l) => {
        listeners.add(l);
        return () => listeners.delete(l);
      },
      () => messages,
    ),
    send: () => {},
    connected: true,
  }),
}));

describe("AssistantDrawer", () => {
  it("keeps existing message nodes when tokens stream in or the user types", async () => {
    setMessages([
      { id: "u1", role: "user", content: "Summarise the disputes" },
      { id: "a1", role: "assistant", content: "There are" },
    ]);
    renderWithProviders(<AssistantDrawer />);

    const question = screen.getByText("Summarise the disputes");
    const reply = screen.getByText("There are");

    act(() => pushToken(" three"));
    act(() => pushToken(" open disputes."));
    await userEvent.type(screen.getByLabelText("Assistant message"), "ok");

    expect(screen.getByText("Summarise the disputes")).toBe(question);
    expect(screen.getByText("There are three open disputes.")).toBe(reply);
  });
});
