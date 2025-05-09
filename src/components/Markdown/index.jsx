import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import math from "remark-math";
import katex from "rehype-katex";

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { contentFormat } from "./plugins/content";
import { blinkPlugin } from "./plugins/blink";
import { rehypeLanguage } from "./plugins/language";
import style from "./index.module.css";

import cn from "classnames";

const formatLatex = (markdown) => {
  return markdown
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\{/g, "$$")
    .replace(/\\\}/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$")
};

const CodeBlock = ({ node, children }) => {
  const language = node.properties["data-language"] || "text";
  const codeString = node.properties["data-code"] || "";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString)
      .then(() => {
        console.log({ title: "已复制", status: "success" });
      })
      .catch(err => {
        console.log({ title: "复制失败: " + err.message, status: "warning", duration: 1500 });
      });
  };

  return (
    <pre
      className={style.codeBlock}
    >
      <div
        className={style.codeBlockHeader}
      >
        <div className={style.lang} >
            {language}
        </div>
        <div  className={style.copy}  onClick={handleCopyCode}>
            复制
        </div>
      </div>
      {children}
    </pre>
  );
};

// TODO: 这个位置需要重写

const customComponents = 
  {
    pre: CodeBlock,
  }


const Markdown = ({ useBlink = true, content, children = null }) => {
  const processedContent = useMemo(() => {
    if (!content) return "";

    // 匹配图片 URL，但排除已经在 ![...](...) 中的 URL
    const imageUrlRegex = /(?<!]\()https:\/\/\S+\.(jpg|jpeg|png|gif|webp)(?!\))/gi;
    return content.replace(imageUrlRegex, (match) => `![image](${match})`);
  }, [content]);

  return (
    <div className={cn(style.markdownWrapper, "markdown-wrapper")}>
      <ReactMarkdown
        remarkRehypeOptions={{}}
        remarkPlugins={[remarkGfm, math]}
        rehypePlugins={[
          rehypeHighlight,
          contentFormat,
          katex,
          rehypeRaw,
          [blinkPlugin, { useBlink }],
          rehypeLanguage,
        ]}
        // 这里原来应该写那个customComponents
        components={customComponents}
      >
        {formatLatex(processedContent)}
      </ReactMarkdown>
      {children}
    </div>
  );
};

export default Markdown;