import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDocSlugs } from "@/lib/docs";
import { loadDoc } from "@/lib/docs-server";
import { DocsContent } from "@/components/docs-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await loadDoc(slug);
  return {
    title: doc ? doc.title : "Docs",
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await loadDoc(slug);
  if (!doc) notFound();

  return (
    <div className="pb-20">
      <DocsContent content={doc.content} />
    </div>
  );
}
