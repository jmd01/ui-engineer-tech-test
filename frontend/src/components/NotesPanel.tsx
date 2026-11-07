"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button, CharCount, EmptyState, Field, Module, TextArea } from "./ui";
import { useSubmitNoteMutation } from "@/lib/api/tradesApi";
import { formatDateTime } from "@/lib/format";
import { BREAK_STATUSES, type Note, type TradeStatus } from "@/lib/schemas";

// Notes follow the reference's event log: a comment box (field, text area,
// count, primary submit) above the entries. Entries are composed from the
// reference's quoted message style (a 2px rule on the left).

const Form = styled.form`
  display: grid;
  gap: var(--space-stack-tight);
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
`;

const List = styled.ol`
  display: grid;
  gap: var(--space-stack-tight);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Entry = styled.li`
  padding-left: var(--space-row-y);
  border-left: var(--border-width-rule) solid var(--border-divider);

  p {
    margin: 0;
    color: var(--fg-default);
    font-size: var(--text-body);
    line-height: var(--text-body-line-height);
    font-weight: var(--text-body-weight);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  time {
    display: block;
    margin-top: var(--space-2);
    color: var(--fg-tertiary);
    font-size: var(--text-meta);
    line-height: var(--text-meta-line-height);
    font-weight: var(--text-meta-weight);
  }
`;

interface NotesPanelProps {
  tradeId: string;
  status: TradeStatus;
  notes: Note[];
}

export function NotesPanel({ tradeId, status, notes }: NotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [submitNote, { isLoading, error }] = useSubmitNoteMutation();

  const canSubmit = BREAK_STATUSES.has(status);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    submitNote({ tradeId, content: draft }).then((result) => {
      if (!("error" in result)) {
        setDraft("");
      }
    });
  };

  const errorText = error
    ? "status" in error
      ? `Request failed (${error.status}).`
      : "Something went wrong. Please try again."
    : undefined;

  return (
    <Module caption={`Notes (${notes.length})`}>
      {canSubmit ? (
        <Form onSubmit={onSubmit}>
          <Field
            label="Add a note"
            htmlFor="note"
            status={errorText}
            statusTone="danger"
            fill
          >
            <TextArea
              id="note"
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a note…"
              maxLength={500}
              aria-invalid={errorText ? true : undefined}
            />
          </Field>
          <FormRow>
            <CharCount>{draft.length}/500</CharCount>
            <Button
              type="submit"
              $tone="primary"
              $color="brand"
              disabled={!draft.trim()}
            >
              Save note
            </Button>
          </FormRow>
          {isLoading ? null : null}
        </Form>
      ) : null}

      {notes.length === 0 ? (
        <EmptyState
          size="sm"
          align="start"
          title="No notes yet"
          description={
            canSubmit
              ? "Add the first note to help inform future agentic processes."
              : "Notes can be added once this trade enters a break status."
          }
        />
      ) : (
        <List>
          {notes.map((n) => (
            <Entry key={n.id}>
              <p>{n.content}</p>
              <time dateTime={n.created_at}>{formatDateTime(n.created_at)}</time>
            </Entry>
          ))}
        </List>
      )}
    </Module>
  );
}
