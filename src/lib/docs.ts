export type DocItem = {
  slug: string;
  title: string;
  file: string;
};

export type DocSection = {
  title: string;
  items: DocItem[];
};

export const docsSections: DocSection[] = [
  {
    title: "Start here",
    items: [
      { slug: "handoff", title: "Handoff (read first)", file: "HANDOFF.md" },
      { slug: "getting-started", title: "Getting started", file: "GETTING-STARTED.md" },
      { slug: "vision", title: "Vision", file: "VISION.md" },
      { slug: "changelog", title: "Changelog", file: "CHANGELOG.md" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { slug: "architecture", title: "Architecture", file: "ARCHITECTURE.md" },
      { slug: "security", title: "Security", file: "SECURITY.md" },
      { slug: "decisions", title: "Decision log", file: "DECISIONS.md" },
    ],
  },
  {
    title: "For your agents",
    items: [
      { slug: "markdown-exports", title: "Markdown exports", file: "MARKDOWN-EXPORTS.md" },
      { slug: "rest-api", title: "REST API", file: "REST-API.md" },
      { slug: "mcp-server", title: "MCP server", file: "MCP-SERVER.md" },
      { slug: "chat-api", title: "Chat API", file: "CHAT-API.md" },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "integrations", title: "Integration catalog", file: "INTEGRATIONS.md" },
    ],
  },
];

export function findDocItem(slug: string): DocItem | null {
  for (const section of docsSections) {
    for (const item of section.items) {
      if (item.slug === slug) return item;
    }
  }
  return null;
}

export function getAllDocSlugs(): string[] {
  return docsSections.flatMap((s) => s.items.map((i) => i.slug));
}
