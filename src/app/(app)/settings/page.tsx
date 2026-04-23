export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-10">
      <header className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Settings
        </p>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          Signal preferences
        </h1>
        <p className="text-sm text-muted-foreground">
          Theme, account, API keys, report defaults. Coming in the next build.
        </p>
      </header>

      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        Placeholder. Theme toggle, Anthropic API key (BYO), report branding, and notification preferences land here.
      </div>
    </div>
  );
}
