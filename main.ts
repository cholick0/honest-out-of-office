// The Painfully Honest Out-of-Office — make.fun bounty entry.
//
// Writes a single painfully honest but still polite out-of-office
// auto-reply to /output/entry.txt. The gate requires UTF-8 text of
// 1 to 200 characters, not only white space, in a single sentence.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

const ENTRY =
  "I'm away until Monday and will reply slowly — my inbox is a mountain I keep calling a molehill, so thank you for your patience.";

function validateEntry(text: string): string[] {
  const problems: string[] = [];
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    problems.push(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (!text.trim()) {
    problems.push("entry must not be only white space");
  }
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length !== 1) {
    problems.push(`entry must be a single sentence, got ${sentences.length}`);
  }
  return problems;
}

function main(): void {
  const text = ENTRY.trim();
  const problems = validateEntry(text);
  if (problems.length > 0) {
    throw new Error(problems.join("; "));
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, text, "utf8");
  // Read the file back byte-for-byte and confirm it matches what we wrote.
  const roundTrip = readFileSync(OUT_PATH, "utf8");
  if (roundTrip !== text) {
    throw new Error("read-back mismatch: /output/entry.txt differs from entry");
  }
  console.log(
    `wrote ${text.length} characters (${Buffer.byteLength(text, "utf8")} bytes) to ${OUT_PATH}`,
  );
}

main();
