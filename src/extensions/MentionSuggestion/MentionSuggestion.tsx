import { Extension } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { createRoot, type Root } from "react-dom/client";
import { createRef } from "react";
import { MentionPopover, type PopoverHandle } from "./MentionPopover";

const NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
];

export const MentionSuggestion = Extension.create({
  name: "MentionSuggestion",
  addProseMirrorPlugins() {
    return [
      Suggestion<string>({
        editor: this.editor,
        char: "@",
        items: ({ query }) =>
          NAMES.filter((name) =>
            name.toLowerCase().startsWith(query.toLowerCase()),
          ),
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, `@${props} `)
            .run();
        },
        render: () => {
          let container: HTMLDivElement | null = null;
          let root: Root | null = null;
          const ref = createRef<PopoverHandle>();

          const renderPopover = (props: {
            items: string[];
            command: (item: string) => void;
            clientRect: (() => DOMRect | null) | null;
          }) => {
            root?.render(
              <MentionPopover
                ref={ref}
                items={props.items}
                command={props.command}
                clientRect={props.clientRect}
              />,
            );
          };

          return {
            onStart: (props) => {
              container = document.createElement("div");
              document.body.appendChild(container);
              root = createRoot(container);
              renderPopover(props);
            },
            onUpdate: renderPopover,
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                root?.unmount();
                container?.remove();
                return true;
              }
              return ref.current?.onKeyDown(event) ?? false;
            },
            onExit: () => {
              root?.unmount();
              container?.remove();
            },
          };
        },
      }),
    ];
  },
});
