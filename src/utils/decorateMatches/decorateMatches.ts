import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node } from "@tiptap/pm/model";

type Callback = (from: number, to: number) => Decoration;

export const decorateMatches = (
  doc: Node,
  regex: RegExp,
  callback: Callback,
): DecorationSet => {
  const decorations: Decoration[] = [];

  doc.descendants((node, position) => {
    if (!node.text) {
      return;
    }

    Array.from(node.text.matchAll(regex)).forEach((match) => {
      const text = match[0];
      const index = match.index || 0;
      const from = position + index;
      const to = from + text.length;

      decorations.push(callback(from, to));
    });
  });

  return DecorationSet.create(doc, decorations);
};
