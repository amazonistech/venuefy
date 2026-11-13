"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const htmlPattern = /<(?:p|div|br|b|strong|em|i|u|ol|ul|li|a)(?=[\s/>])/i;

export default function RichText({ value = "", plain = false, className = "" }) {
  const [clean, setClean] = useState(null);
  const rich = htmlPattern.test(value);
  useEffect(() => {
    if (!rich) return;
    setClean({ value, html: DOMPurify.sanitize(value, {
      ALLOWED_TAGS: plain ? [] : ["p", "div", "br", "b", "strong", "em", "i", "u", "ol", "ul", "li", "a"],
      ALLOWED_ATTR: ["href"], ALLOW_DATA_ATTR: false,
    }) });
  }, [value, rich, plain]);
  if (!value) return null;
  if (!rich) return <div className={`rich-copy ${className}`}>{value}</div>;
  return <div className={`rich-copy ${className}`} dangerouslySetInnerHTML={{ __html: clean?.value === value ? clean.html : "" }} />;
}
