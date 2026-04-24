import Image from "next/image";

type Props = {
  businessName: string;
  generatedAt: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ReportFooter({ businessName, generatedAt }: Props) {
  return (
    <footer className="mt-12 border-t border-border/60 pb-4 pt-7">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image
            src="/cq-signal-logo.png"
            alt="CQ Signal"
            width={100}
            height={24}
            className="h-5 w-auto opacity-90 dark:hidden"
          />
          <Image
            src="/cq-signal-logo-dark.png"
            alt="CQ Signal"
            width={100}
            height={24}
            className="hidden h-5 w-auto opacity-90 dark:inline-block"
          />
          <span className="text-xs">
            Generated for{" "}
            <a
              href="https://creativequalitymarketing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Creative Quality Marketing
            </a>
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest">
          {formatDate(generatedAt)}
        </span>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground/70">
        Confidential. Prepared exclusively for {businessName}.
      </p>
    </footer>
  );
}
