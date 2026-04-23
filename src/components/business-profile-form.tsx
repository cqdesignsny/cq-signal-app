"use client";

import * as React from "react";
import { Check, ImagePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Business } from "@/lib/businesses";

export function BusinessProfileForm({ business }: { business: Business }) {
  const [form, setForm] = React.useState({
    name: business.name,
    shortName: business.shortName ?? "",
    tagline: business.tagline,
    vertical: business.vertical,
    brandColor: "#D8322F",
  });
  const [saved, setSaved] = React.useState(false);

  const onChange =
    <K extends keyof typeof form>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-3">
        <Label className="text-sm font-medium">Logo</Label>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted/50 text-2xl font-semibold text-muted-foreground">
            {(form.shortName || form.name).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-1.5">
            <Button type="button" variant="outline" size="sm" disabled>
              <ImagePlus className="size-4" />
              Upload logo
              <span className="ml-2 font-mono text-[10px] uppercase text-muted-foreground">
                Soon
              </span>
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG or SVG up to 2MB. Square or wordmark both work. Transparent background recommended.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Business name
          </Label>
          <Input id="name" value={form.name} onChange={onChange("name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shortName" className="text-sm font-medium">
            Short name
          </Label>
          <Input
            id="shortName"
            value={form.shortName}
            onChange={onChange("shortName")}
            placeholder="e.g. HVOF"
          />
          <p className="text-xs text-muted-foreground">Used in the sidebar and tight spaces.</p>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="tagline" className="text-sm font-medium">
            Tagline
          </Label>
          <textarea
            id="tagline"
            value={form.tagline}
            onChange={onChange("tagline")}
            rows={2}
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vertical" className="text-sm font-medium">
            Vertical
          </Label>
          <Input
            id="vertical"
            value={form.vertical}
            onChange={onChange("vertical")}
            placeholder="Commercial B2B, Med spa, etc."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brandColor" className="text-sm font-medium">
            Brand accent
          </Label>
          <div className="flex items-center gap-3">
            <input
              id="brandColor"
              type="color"
              value={form.brandColor}
              onChange={onChange("brandColor")}
              className="h-9 w-14 cursor-pointer rounded-md border bg-transparent"
            />
            <Input
              value={form.brandColor}
              onChange={onChange("brandColor")}
              className="flex-1 font-mono uppercase"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Used on white-label PDF reports for this business.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-3 border-t pt-6">
        <Button type="submit" size="sm" className="gap-1.5">
          <Save className="size-4" />
          Save changes
        </Button>
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm text-signal transition-opacity",
            saved ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          <Check className="size-4" />
          Saved (preview only — persistence lands with the database)
        </div>
      </div>
    </form>
  );
}
