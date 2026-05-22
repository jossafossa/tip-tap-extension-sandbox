import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  CommandHighlighter,
  HashtagHighlighter,
  MentionHighlighter,
  UrlHighlighter,
} from "../../extensions";

export const Editor = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      MentionHighlighter,
      HashtagHighlighter,
      CommandHighlighter,
      UrlHighlighter,
    ],
    content:
      "<p>Hello @world, #hello and /run! Check https://tiptap.dev for more.</p>",
  });

  return <EditorContent editor={editor} />;
};
