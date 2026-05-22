import styles from "./UrlHighlighter.module.scss";
import { createRegexHighlighter } from "../../utils";

export const UrlHighlighter = createRegexHighlighter({
  name: "UrlHighlighter",
  regex: /https?:\/\/[^\s]+/g,
  className: styles.url,
});
