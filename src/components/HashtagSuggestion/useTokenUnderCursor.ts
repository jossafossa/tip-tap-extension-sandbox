import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

export type Token = {
  query: string;
  from: number;
  to: number;
  left: number;
  top: number;
  bottom: number;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const useTokenUnderCursor = (
  editor: Editor | null,
  trigger: string,
): Token | null => {
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    if (!editor) return;

    const re = new RegExp(`(?:^|\\s)${escapeRegex(trigger)}([a-zA-Z0-9_-]*)$`);

    const detect = () => {
      const { from, to } = editor.state.selection;
      if (from !== to) return setToken(null);

      const $pos = editor.state.selection.$from;
      const textBefore = $pos.parent.textBetween(
        Math.max(0, $pos.parentOffset - 50),
        $pos.parentOffset,
        undefined,
        "￼",
      );
      const match = re.exec(textBefore);
      if (!match) return setToken(null);

      const tokenFrom = from - match[1].length - trigger.length;
      const coords = editor.view.coordsAtPos(tokenFrom);
      setToken({
        query: match[1],
        from: tokenFrom,
        to: from,
        left: coords.left,
        top: coords.top,
        bottom: coords.bottom,
      });
    };

    detect();
    editor.on("selectionUpdate", detect);
    editor.on("update", detect);
    return () => {
      editor.off("selectionUpdate", detect);
      editor.off("update", detect);
    };
  }, [editor, trigger]);

  return token;
};
