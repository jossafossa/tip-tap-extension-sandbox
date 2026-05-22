import styles from "./MentionHighlighter.module.scss";
import { atWordStart, createRegexHighlighter } from "../../utils";

export const MentionHighlighter = createRegexHighlighter({
  name: "MentionHighlighter",
  regex: atWordStart(/@[a-zA-Z0-9_-]+/g),
  className: styles.mention,
});
