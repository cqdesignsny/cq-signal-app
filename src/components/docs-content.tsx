"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DocsContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-8 mt-2 font-display text-5xl tracking-tight first:mt-0 md:text-6xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-4 mt-12 border-b pb-3 font-display text-3xl tracking-tight md:text-4xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-8 font-display text-2xl tracking-tight">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="mb-2 mt-6 font-display text-lg font-semibold">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="mb-5 text-lg leading-relaxed text-muted-foreground">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-5 list-disc space-y-2 pl-6 text-lg text-muted-foreground marker:text-border">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-5 list-decimal space-y-2 pl-6 text-lg text-muted-foreground marker:text-border">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => {
          const isExternal = href?.startsWith("http");
          if (isExternal) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline underline-offset-2 transition-colors hover:text-brand/80"
              >
                {children}
              </a>
            );
          }
          return (
            <Link
              href={href || "#"}
              className="text-brand underline underline-offset-2 transition-colors hover:text-brand/80"
            >
              {children}
            </Link>
          );
        },
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
                {children}
              </code>
            );
          }
          return <code className={className}>{children}</code>;
        },
        pre: ({ children }) => (
          <pre className="mb-5 overflow-x-auto rounded-lg border bg-muted/50 p-5 font-mono text-base leading-relaxed">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-5 border-l-2 border-brand pl-5 text-lg italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="my-5 overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-base">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b bg-muted/50">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y">{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-medium text-foreground">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-muted-foreground">{children}</td>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        hr: () => <hr className="my-10 border-border" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
