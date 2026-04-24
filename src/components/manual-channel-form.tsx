"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, ImageUp, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  saveManualChannelData,
  clearManualChannelData,
  type ManualFormState,
} from "@/app/app/businesses/[slug]/connect/[integration]/actions";
import type { Integration } from "@/lib/businesses";
import type { ManualCardData } from "@/lib/manual-data";

const INITIAL_STATE: ManualFormState = { ok: false };
const MAX_SECONDARY = 4;

type Props = {
  slug: string;
  integration: Integration;
  source: string;
  initial?: ManualCardData;
};

export function ManualChannelForm({ slug, integration, source, initial }: Props) {
  const [saveState, saveAction, savePending] = useActionState(
    saveManualChannelData,
    INITIAL_STATE,
  );
  const [clearState, clearAction, clearPending] = useActionState(
    clearManualChannelData,
    INITIAL_STATE,
  );
  const message = saveState.message ?? clearState.message;
  const ok = saveState.ok || clearState.ok;

  // Pad initial.secondary to MAX_SECONDARY blank rows for editing.
  const initialSecondary = React.useMemo(() => {
    const rows = initial?.secondary ?? [];
    return Array.from({ length: MAX_SECONDARY }, (_, i) => rows[i] ?? { label: "", value: "" });
  }, [initial]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-5">
        <div className="flex items-center gap-2">
          <ImageUp className="size-4 text-brand" />
          <p className="text-sm font-medium text-foreground">
            Drop a screenshot (coming next)
          </p>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          The next wave will let you upload a screenshot from {source} and Signal
          will extract the values into this form for you. For now, type them in
          below — same effect on the dashboard and reports.
        </p>
      </div>

      <form action={saveAction} className="space-y-6">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="integration" value={integration} />

        <section className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Headline metric</Label>
            <p className="text-xs text-muted-foreground">
              The big number on the card. Pair a label like "Followers" with a
              value like "299" or "$1,047".
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="primaryLabel" className="text-xs text-muted-foreground">
                Label
              </Label>
              <Input
                id="primaryLabel"
                name="primaryLabel"
                defaultValue={initial?.primary.label ?? ""}
                placeholder="Followers, Ad spend, Open rate..."
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="primaryValue" className="text-xs text-muted-foreground">
                Value
              </Label>
              <Input
                id="primaryValue"
                name="primaryValue"
                defaultValue={initial?.primary.value ?? ""}
                placeholder="299, $1,047, 12.3%..."
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="primaryNote" className="text-xs text-muted-foreground">
              Footnote (optional)
            </Label>
            <Input
              id="primaryNote"
              name="primaryNote"
              defaultValue={initial?.primary.note ?? ""}
              placeholder="e.g. Weighted across 2 campaigns · 9,102 sends"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Secondary metrics</Label>
            <p className="text-xs text-muted-foreground">
              Up to four small stats that show under the headline. Skip rows you
              don't need.
            </p>
          </div>
          <div className="space-y-2.5">
            {initialSecondary.map((s, i) => (
              <div key={i} className="grid gap-2.5 md:grid-cols-2">
                <Input
                  name={`secondaryLabel${i}`}
                  defaultValue={s.label}
                  placeholder={`Secondary label ${i + 1}`}
                />
                <Input
                  name={`secondaryValue${i}`}
                  defaultValue={s.value}
                  placeholder="Value"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-1.5">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes for the report
          </Label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={initial?.notes ?? ""}
            rows={3}
            placeholder="What context should appear under this card on the report? Plain prose, no fluff."
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t pt-5">
          <Button
            type="submit"
            size="sm"
            disabled={savePending || clearPending}
            className="gap-1.5"
          >
            {savePending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {savePending ? "Saving..." : "Save manual data"}
          </Button>
          {message ? (
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm",
                ok ? "text-foreground" : "text-destructive",
              )}
              aria-live="polite"
            >
              {ok ? <Check className="size-4 text-brand" /> : null}
              {message}
            </span>
          ) : null}
        </div>
      </form>

      {initial ? (
        <form action={clearAction}>
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="integration" value={integration} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={savePending || clearPending}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            {clearPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Clear manual data
          </Button>
        </form>
      ) : null}
    </div>
  );
}
