#!/usr/bin/env bun
/**
 * Generates notes-index.json from published Markdown in the Obsidian notes repo.
 *
 * Env (optional):
 *   NOTES_PUBLISH_DIR   default: publish
 *   NOTES_GITHUB_OWNER  default: xshubhamg
 *   NOTES_GITHUB_REPO   default: notes
 *   NOTES_GITHUB_BRANCH default: main
 *   NOTES_OUTPUT_FILE   default: notes-index.json
 */

import { join, relative, basename, extname } from "node:path";

const PUBLISH_DIR = Bun.env.NOTES_PUBLISH_DIR ?? "publish";
const GITHUB_OWNER = Bun.env.NOTES_GITHUB_OWNER ?? "xshubhamg";
const GITHUB_REPO = Bun.env.NOTES_GITHUB_REPO ?? "notes";
const GITHUB_BRANCH = Bun.env.NOTES_GITHUB_BRANCH ?? "main";
const OUTPUT_FILE = Bun.env.NOTES_OUTPUT_FILE ?? "notes-index.json";

type Frontmatter = Record<string, unknown>;

type NoteIndexEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  path: string;
  rawUrl: string;
};

function parseFrontmatter(source: string): {
  frontmatter: Frontmatter;
  body: string;
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {}, body: source };
  }

  const frontmatter: Frontmatter = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;

    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      frontmatter[key] = inner
        ? inner.split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        : [];
      continue;
    }

    if (value === "true") frontmatter[key] = true;
    else if (value === "false") frontmatter[key] = false;
    else frontmatter[key] = value;
  }

  return {
    frontmatter,
    body: source.slice(match[0].length),
  };
}

function slugFromPath(filePath: string): string {
  return basename(filePath, extname(filePath));
}

function rawUrlForPath(repoPath: string): string {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${repoPath.replace(/\\/g, "/")}`;
}

function isPublished(frontmatter: Frontmatter): boolean {
  if (frontmatter.published === false) return false;
  if (frontmatter.published === "false") return false;
  if (frontmatter.draft === true || frontmatter.draft === "true") return false;
  return frontmatter.published === true || frontmatter.published === "true";
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((tag) => tag.trim());
  }
  return [];
}

async function main() {
  const publishRoot = join(process.cwd(), PUBLISH_DIR);
  const glob = new Bun.Glob("**/*.md");
  const markdownFiles = glob.scan({ cwd: publishRoot, absolute: true });
  const index: NoteIndexEntry[] = [];

  for await (const absolutePath of markdownFiles) {
    const source = await Bun.file(absolutePath).text();
    const { frontmatter } = parseFrontmatter(source);

    if (!isPublished(frontmatter)) continue;

    const repoPath = relative(process.cwd(), absolutePath).replace(/\\/g, "/");
    const slug =
      (typeof frontmatter.slug === "string" && frontmatter.slug.trim()) ||
      slugFromPath(absolutePath);
    const title =
      (typeof frontmatter.title === "string" && frontmatter.title.trim()) ||
      slug;
    const description =
      (typeof frontmatter.description === "string" &&
        frontmatter.description.trim()) ||
      "";
    const date =
      (typeof frontmatter.date === "string" && frontmatter.date.trim()) ||
      new Date().toISOString().slice(0, 10);

    index.push({
      slug,
      title,
      description,
      date,
      tags: toTags(frontmatter.tags),
      path: repoPath,
      rawUrl: rawUrlForPath(repoPath),
    });
  }

  index.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return a.title.localeCompare(b.title);
  });

  await Bun.write(OUTPUT_FILE, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Wrote ${index.length} entries to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
