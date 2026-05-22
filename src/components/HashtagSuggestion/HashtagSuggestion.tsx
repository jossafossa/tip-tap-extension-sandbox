import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/react";
import styles from "./HashtagSuggestion.module.scss";
import { useTokenUnderCursor } from "./useTokenUnderCursor";
import { useListKeyboard } from "./useListKeyboard";

const DEFAULT_HASHTAGS = [
  "typescript",
  "javascript",
  "react",
  "tiptap",
  "css",
  "html",
  "vite",
];

type Props = {
  editor: Editor | null;
  hashtags?: string[];
};

export const HashtagSuggestion = ({
  editor,
  hashtags = DEFAULT_HASHTAGS,
}: Props) => {
  const token = useTokenUnderCursor(editor, "#");
  const [selected, setSelected] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setSelected(0);
    setDismissed(false);
  }, [token?.from]);

  const items = token
    ? hashtags.filter((tag) =>
        tag.toLowerCase().startsWith(token.query.toLowerCase()),
      )
    : [];

  const open = !!token && !dismissed && items.length > 0;

  const pick = (tag: string) => {
    if (!editor || !token) return;
    editor
      .chain()
      .focus()
      .insertContentAt({ from: token.from, to: token.to }, `#${tag} `)
      .run();
  };

  useListKeyboard({
    editor,
    enabled: open,
    count: items.length,
    selected,
    onMove: setSelected,
    onPick: () => pick(items[selected]),
    onEscape: () => setDismissed(true),
  });

  if (!open || !token) return null;

  return createPortal(
    <div
      className={styles.popover}
      role="listbox"
      style={{
        left: token.left + window.scrollX,
        top: token.bottom + window.scrollY + 4,
      }}
    >
      {items.map((tag, i) => (
        <button
          key={tag}
          role="option"
          aria-selected={i === selected}
          className={
            i === selected ? `${styles.item} ${styles.selected}` : styles.item
          }
          onMouseDown={(e) => {
            e.preventDefault();
            pick(tag);
          }}
          onMouseEnter={() => setSelected(i)}
        >
          #{tag}
        </button>
      ))}
    </div>,
    document.body,
  );
};
