type Props = {
  data: number[];
  prior?: number[];
  color?: string;
  priorColor?: string;
  height?: number;
};

const W = 700;
const PAD = { t: 20, r: 16, b: 24, l: 45 };

function formatGridLabel(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return Math.round(v).toString();
}

export function TrendChart({
  data,
  prior,
  color = "#22C55E",
  priorColor = "#94A3B8",
  height = 200,
}: Props) {
  if (!data.length) {
    return (
      <p className="py-10 text-center text-xs text-muted-foreground/80">
        No data.
      </p>
    );
  }

  const cW = W - PAD.l - PAD.r;
  const cH = height - PAD.t - PAD.b;
  const all = [...data, ...(prior ?? [])];
  const max = Math.max(...all);
  const range = max || 1;

  const tx = (i: number, len: number) =>
    PAD.l + (i / Math.max(len - 1, 1)) * cW;
  const ty = (v: number) => PAD.t + cH - (v / range) * cH;
  const pts = (d: number[]) =>
    d.map((v, i) => `${tx(i, d.length).toFixed(1)},${ty(v).toFixed(1)}`).join(" ");

  const areaPoints = `${tx(0, data.length).toFixed(1)},${PAD.t + cH} ${pts(data)} ${tx(data.length - 1, data.length).toFixed(1)},${PAD.t + cH}`;

  // Stable id since this renders server-side and we may have multiple charts
  const uid = `trend-${Math.abs(data.reduce((a, b) => a + b, 0)).toString(36)}-${data.length}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <defs>
        <linearGradient id={`af-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((g) => {
        const gy = PAD.t + (g / 4) * cH;
        const gv = max - (g / 4) * max;
        return (
          <g key={g}>
            <line
              x1={PAD.l}
              y1={gy}
              x2={W - PAD.r}
              y2={gy}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <text
              x={PAD.l - 8}
              y={gy + 4}
              textAnchor="end"
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fill="currentColor"
              opacity="0.5"
            >
              {formatGridLabel(gv)}
            </text>
          </g>
        );
      })}
      <polygon points={areaPoints} fill={`url(#af-${uid})`} />
      {prior && prior.length > 0 ? (
        <polyline
          points={pts(prior)}
          fill="none"
          stroke={priorColor}
          strokeWidth="1.5"
          strokeDasharray="5,4"
          strokeLinecap="round"
        />
      ) : null}
      <polyline
        points={pts(data)}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
