/*
   Text Segments

   Splits a message body into typed segments around AI findings so highlights
   render with `@for` + `<mark>` instead of `[innerHTML]`. Overlaps are clamped
   to the first finding that claims a character range.
*/

import { MockAIFinding, TextSegment } from '../models/review.models';

// Helpers
/** Deterministic 64-char hex digest for mock checksums. */
export function mockSha256(seed: string): string {
    let hash = 0x811c9dc5;
    let out = '';

    for (let i = 0; i < 64; i++) {
        hash = Math.imul(hash ^ seed.charCodeAt(i % seed.length), 16777619) >>> 0;
        out += (hash & 0xf).toString(16);
    }

    return out;
}

/** Resolves a phrase to its exact character range, failing loudly if absent. */
export function offsetsOf(body: string, phrase: string): { start: number; end: number } {
    const start = body.indexOf(phrase);

    if (start === -1) {
        throw new Error(`Phrase not found in body: "${phrase}"`);
    }

    return { start, end: start + phrase.length };
}

/** Builds the segment list for one message, findings sorted by offset. */
export function buildSegments(
    body: string,
    findings: readonly MockAIFinding[],
    messageId: string,
): TextSegment[] {
    const mine = findings
        .filter((f) => f.messageId === messageId)
        .slice()
        .sort((a, b) => a.start - b.start);

    // No findings → single plain segment
    if (!mine.length) {
        return [{ text: body }];
    }

    const segments: TextSegment[] = [];
    let cursor = 0;

    for (const finding of mine) {
        const start = Math.max(finding.start, cursor);
        const end = Math.min(finding.end, body.length);

        if (end <= start) continue;

        if (start > cursor) {
            segments.push({ text: body.slice(cursor, start) });
        }

        segments.push({ text: body.slice(start, end), finding });
        cursor = end;
    }

    if (cursor < body.length) {
        segments.push({ text: body.slice(cursor) });
    }

    return segments;
}
