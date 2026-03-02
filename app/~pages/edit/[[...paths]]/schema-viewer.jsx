"use client";

import { memo } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("json", json);

const lineNumberStyle = {
  minWidth: "2.5em",
  paddingRight: "1em",
  color: "#ccc",
  textAlign: "right",
  userSelect: "none",
};

const customStyle = {
  margin: 0,
  padding: "0.35rem",
  fontSize: "0.65rem",
  background: "transparent",
  lineHeight: "1.4",
};

export const SchemaViewer = memo(function SchemaViewer({ code }) {
  return (
    <SyntaxHighlighter
      language="json"
      style={oneLight}
      showLineNumbers
      lineNumberStyle={lineNumberStyle}
      customStyle={customStyle}
      codeTagProps={{
        className: "font-mono",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
});
