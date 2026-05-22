import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import styles from "./MentionSuggestion.module.scss";

export type PopoverHandle = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

type Props = {
  items: string[];
  command: (item: string) => void;
  clientRect: (() => DOMRect | null) | null;
};

export const MentionPopover = forwardRef<PopoverHandle, Props>(
  ({ items, command, clientRect }, ref) => {
    const [selected, setSelected] = useState(0);

    useEffect(() => setSelected(0), [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        if (event.key === "ArrowDown") {
          setSelected((s) => (s + 1) % Math.max(items.length, 1));
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelected(
            (s) => (s - 1 + items.length) % Math.max(items.length, 1),
          );
          return true;
        }
        if (event.key === "Enter") {
          if (items.length > 0) command(items[selected]);
          return true;
        }
        return false;
      },
    }));

    const rect = clientRect?.();
    if (!rect) return null;

    const style = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    };

    return (
      <div className={styles.popover} style={style}>
        {items.length === 0 ? (
          <div className={styles.empty}>No matches</div>
        ) : (
          items.map((item, i) => (
            <button
              key={item}
              className={
                i === selected
                  ? `${styles.item} ${styles.selected}`
                  : styles.item
              }
              onMouseDown={(e) => {
                e.preventDefault();
                command(item);
              }}
            >
              {item}
            </button>
          ))
        )}
      </div>
    );
  },
);
