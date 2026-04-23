import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { findDocItem } from "./docs";

const DOCS_DIR = path.join(process.cwd(), "docs");

export async function loadDoc(
  slug: string,
): Promise<{ title: string; content: string } | null> {
  const item = findDocItem(slug);
  if (!item) return null;
  try {
    const filePath = path.join(DOCS_DIR, item.file);
    const content = await fs.readFile(filePath, "utf-8");
    return { title: item.title, content };
  } catch {
    return null;
  }
}
