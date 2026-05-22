import { Plugin } from "@tiptap/pm/state";
import { Decoration } from "@tiptap/pm/view";
import { Extension } from "@tiptap/react";
import type { Node } from "@tiptap/pm/model";
import { decorateMatches } from "../decorateMatches";

type Options = {
  name: string;
  regex: RegExp;
  className: string;
};

export const createRegexHighlighter = ({ name, regex, className }: Options) => {
  const highlight = (doc: Node) =>
    decorateMatches(doc, regex, (from, to) =>
      Decoration.inline(from, to, { class: className }),
    );

  return Extension.create({
    name,
    addProseMirrorPlugins: () => [
      new Plugin({
        state: {
          init(_, { doc }) {
            return highlight(doc);
          },
          apply(transaction, oldState) {
            if (!transaction.docChanged) return oldState;

            return highlight(transaction.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ],
  });
};
