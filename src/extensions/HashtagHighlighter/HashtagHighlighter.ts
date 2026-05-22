import styles from "./HashtagHighlighter.module.scss";
import { atWordStart, createRegexHighlighter } from "../../utils";

export const HashtagHighlighter = createRegexHighlighter({
  name: "HashtagHighlighter",
  regex: atWordStart(/#[a-zA-Z0-9_-]+/g),
  className: styles.hashtag,
});
