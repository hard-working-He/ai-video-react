import { visit } from 'unist-util-visit';
// eslint-disable-next-line no-unused-vars
export const contentFormat = (options) => {
  // const { } = options
  return function (tree) {
    visit(tree, ['text', "element"], (node) => {

      if (node.type === "text" && node.value === "\n") {
        if (node.tagName !== "code") {
          node.value = ""
        }
      }
      if (node.type === "element" && node.tagName === "a") {
        try {
          node.properties["href"] = decodeURIComponent(node.properties["href"]).replace(/(\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u007e)/g, "")
          node.properties["target"] = "_blank"
        }catch(e) {
          console.log('markdown error',e,node)
        }
    
      }
    })
    return tree
  }
}