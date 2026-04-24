"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, ImagePlus, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  saveBusinessProfile,
  type ProfileFormState,
} from "@/app/app/businesses/[slug]/profile/actions";

export type BusinessProfileFormProps = {
  slug: string;
  initial: {
    name: string;
    shortName?: string | null;
    tagline?: string | null;
    vertical?: string | null;
    brandColor?: string | null;
    logoUrl?: string | null;
  };
};

const INITIAL_STATE: ProfileFormState = { ok: false };

export function BusinessProfileForm({ slug, initial }: BusinessProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveBusinessProfile,
    INITIAL_STATE,
  );

  const [brandColor, setBrandColor] = React.useState(
    initial.brandColor ?? "#D8322F",
  );
  const [logoUrl, setLogoUrl] = React.useState(initial.logoUrl ?? "");

  return (
    <form action={formAction} className="space-y-10">
      <input type="hidden" name="slug" value={slug} />

      <section className="space-y-3">
        <Label className="text-sm font-medium">Logo</Label>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-muted/50 text-2xl font-semibold text-muted-foreground">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-full w-full object-contain"
              />
            ) : (
              (initial.shortName ?? initial.name).slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="logoUrl" className="text-xs text-muted-foreground">
                Paste a logo URL (PNG, JPEG, SVG)
              </Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.svg or /HVOF-2025-logo.svg"
              />
            </div>
            <Button type="button" variant="outline" size="sm" disabled>
              <ImagePlus className="size-4" />
              Upload to Vercel Blob
              <span className="ml-2 font-mono text-[10px] uppercase text-muted-foreground">
                Soon
              </span>
            </Button>
            <p className="text-xs text-muted-foreground">
              For now paste a URL. File upload via Vercel Blob is the next wave.
              SVG, PNG, JPEG all supported.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Business name
          </Label>
          <Input id="name" name="name" defaultValue={initial.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shortName" className="text-sm font-medium">
            Short name
          </Label>
          <Input
            id="shortName"
            name="shortName"
            defaultValue={initial.shortName ?? ""}
            placeholder="e.g. HVOF"
          />
          <p className="text-xs text-muted-foreground">
            Used in the sidebar and tight spaces.
          </p>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="tagline" className="text-sm font-medium">
            Tagline
          </Label>
          <textarea
            id="tagline"
            name="tagline"
            defaultValue={initial.tagline ?? ""}
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
            name="vertical"
            defaultValue={initial.vertical ?? ""}
            placeholder="Commercial B2B, Med spa, etc."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brandColor" className="text-sm font-medium">
            Brand accent
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-9 w-14 cursor-pointer rounded-md border bg-transparent"
            />
            <Input
              id="brandColor"
              name="brandColor"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="flex-1 font-mono uppercase"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Used on white-label reports for this business.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-3 border-t pt-6">
        <Button type="submit" size="sm" className="gap-1.5" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isPending ? "Saving..." : "Save changes"}
        </Button>
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm transition-opacity",
            state.ok
              ? "text-foreground opacity-100"
              : state.message
                ? "text-destructive opacity-100"
                : "opacity-0",
          )}
          aria-live="polite"
        >
          {state.ok ? <Check className="size-4 text-brand" /> : null}
          {state.message ?? ""}
        </div>
      </div>
    </form>
  );
}
