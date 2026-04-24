type Props = {
  body: string;
};

export function ExecSummary({ body }: Props) {
  return (
    <div className="border-l-[3px] border-signal pl-5 text-[15px] leading-[1.75] text-muted-foreground">
      {body}
    </div>
  );
}
