import { TradeStatusSchema, type TradeStatus } from "./schemas";

/** The list's status filter, read from the URL's repeated `status` params. */
export function parseStatuses(raw: string[]): TradeStatus[] {
  return raw.flatMap((s) => {
    const parsed = TradeStatusSchema.safeParse(s);
    return parsed.success ? [parsed.data] : [];
  });
}
