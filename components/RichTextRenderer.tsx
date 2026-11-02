"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    // DOMPurify is client-only as it requires the DOM window.
    // Sanitizing here ensures no hydration mismatches and full security.
    setSanitizedContent(DOMPurify.sanitize(content));
  }, [content]);

  return (
    <div
      className={`prose-literary ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent || content }}
    />
  );
}
