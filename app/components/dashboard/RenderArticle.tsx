import { type JSONContent } from "novel";
import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import BlockQuote from "@tiptap/extension-blockquote";
import TextStyle from "@tiptap/extension-text-style";
import CodeBlock from "@tiptap/extension-code-block";
import OrderedList from "@tiptap/extension-ordered-list";
import Bold from "@tiptap/extension-bold";
import HardBreak from "@tiptap/extension-hard-break";
import Italic from "@tiptap/extension-italic";

export function RenderArticle({ json }: { json: JSONContent }) {
  // Debugging: Log the JSON content to check its structure
  console.log("RenderArticle JSON:", JSON.stringify(json, null, 2));

  const outPut = useMemo(() => {
    // Check if json is valid before generating HTML
    if (!json || typeof json !== 'object' || !json.type) {
      console.error("Invalid JSON structure:", json);
      return "<p>Error: Invalid content</p>"; // Fallback content
    }

    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
      Link,
      Underline,
      Heading,
      ListItem,
      BulletList,
      Code,
      BlockQuote,
      TextStyle,
      CodeBlock,
      OrderedList,
      Bold,
      HardBreak,
      Italic,
    ]);
  }, [json]);

  return (
    <div
      className="m-auto w-11/12 sm:w-2/3 prose-li:marker:text-primary dark:prose-invert prose sm:prose-lg"
      dangerouslySetInnerHTML={{ __html: outPut }}
    />
  );
}
