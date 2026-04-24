type Props = {
  title: string;
  body?: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <div className="rounded-md border border-dashed border-border/70 bg-muted/20 px-5 py-6 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {body ? (
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
          {body}
        </p>
      ) : null}
    </div>
  );
}
