export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Settings
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">
          Signal preferences
        </h1>
        <p className="max-w-xl text-base text-muted-foreground md:text-lg">
          Theme, account, AI provider credentials, report defaults. Coming in the next build.
        </p>
      </header>

      <div className="rounded-xl border border-dashed px-8 py-10 text-base text-muted-foreground">
        Placeholder. Theme toggle lives in the top bar. Anthropic API key (BYO),
        report branding, and notification preferences land here soon.
      </div>
    </div>
  );
}
