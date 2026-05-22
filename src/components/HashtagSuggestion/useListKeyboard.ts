import { useEffect } from "react";
import type { Editor } from "@tiptap/react";

type Options = {
  editor: Editor | null;
  enabled: boolean;
  count: number;
  selected: number;
  onMove: (next: number) => void;
  onPick: () => void;
  onEscape: () => void;
};

export const useListKeyboard = ({
  editor,
  enabled,
  count,
  selected,
  onMove,
  onPick,
  onEscape,
}: Options) => {
  useEffect(() => {
    if (!editor || !enabled || count === 0) return;

    const onKey = (e: KeyboardEvent) => {
      const handle = (action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
      };

      if (e.key === "ArrowDown") return handle(() => onMove((selected + 1) % count));
      if (e.key === "ArrowUp")
        return handle(() => onMove((selected - 1 + count) % count));
      if (e.key === "Enter") return handle(onPick);
      if (e.key === "Escape") return handle(onEscape);
    };

    const dom = editor.view.dom;
    dom.addEventListener("keydown", onKey, { capture: true });
    return () =>
      dom.removeEventListener("keydown", onKey, { capture: true });
  }, [editor, enabled, count, selected, onMove, onPick, onEscape]);
};
