type Segment = { label: string; pct: number; color: string };

type Props = {
  segments: Segment[];
  centerLabel?: string;
  centerSubLabel?: string;
};

const FALLBACK_PALETTE = [
  "#F59E0B",
  "#22C55E",
  "#8B5CF6",
  "#EC4899",
  "#0EA5E9",
  "#94A3B8",
];

export function ChannelDonut({
  segments,
  centerLabel = "By",
  centerSubLabel = "Channels",
}: Props) {
  if (!segments.length) {
    return (
      <div className="flex h-[180px] w-[180px] items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
        No data
      </div>
    );
  }

  const total = segments.reduce((sum, s) => sum + s.pct, 0) || 1;
  const stops: string[] = [];
  let cum = 0;
  for (const s of segments) {
    const start = (cum / total) * 100;
    cum += s.pct;
    const end = (cum / total) * 100;
    stops.push(`${s.color} ${start}% ${end}%`);
  }
  const conic = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative size-[180px] rounded-full"
        style={{ background: conic }}
      >
        <div className="absolute left-1/2 top-1/2 flex size-[106px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-card text-center text-[11px] leading-tight text-muted-foreground">
          <span>{centerLabel}</span>
          <strong className="text-foreground/80">{centerSubLabel}</strong>
        </div>
      </div>
      <div className="flex max-w-full flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span
              className="block size-[9px] shrink-0 rounded-full"
              style={{ background: s.color }}
            />
            <span className="truncate">{s.label}</span>
            <span className="font-bold text-foreground/80">
              {s.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function paletteFor(index: number): string {
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}
