// interface Node {
//   type: string;
//   tagName?: string;
//   properties?: {
//     [key: string]: any;
//     className?: string[];
//     "data-language"?: string;
//     "data-code"?: string;
//   };
//   children?: Node[];
//   value?: string;
// }

export const rehypeLanguage = () => {
  return (tree) => {
    const visit = (node) => {
      if (node.tagName === "pre") {
        const codeNode = node.children?.find(
          (child) => child.tagName === "code"
        );
        if (codeNode) {
          // 提取语言
          const langClass =
            codeNode.properties?.className?.find((cls) =>
              cls.startsWith("language-")
            );
          const language = langClass ? langClass.replace("language-", "") : "text";
          node.properties = node.properties || {};
          node.properties["data-language"] =
            language.charAt(0).toUpperCase() + language.slice(1);

          // 递归提取所有文本内容
          const extractText = (nodes) => {
            let text = "";
            for (const child of nodes) {
              if (child.type === "text") {
                text += child.value || "";
              } else if (child.children) {
                text += extractText(child.children);
              }
            }
            return text;
          };
          const codeText = extractText(codeNode.children || []);
          node.properties["data-code"] = codeText.trim(); // 存储完整原始代码文本
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
};