import styles from "./CommandHighlighter.module.scss";
import { atWordStart, createRegexHighlighter } from "../../utils";

export const CommandHighlighter = createRegexHighlighter({
  name: "CommandHighlighter",
  regex: atWordStart(/\/[a-zA-Z0-9_-]+/g),
  className: styles.command,
});
