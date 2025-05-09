export const blinkPlugin = (options) => {
  const { useBlink = false } = options
  return function (tree) {
    if (!useBlink) return tree
    let nodePointer = null
    let noText = true
    const findLast = (tree) => {
      for (let i = tree.children.length - 1; i >= 0; i--) {
          const node = tree.children[i]
          const parent = tree
          const isNotEmpty = (node.type === "text" && node.value.trim().length > 0) || node.children?.length > 0
          if (!isNotEmpty) continue
          if (node.type === "text") {
            nodePointer = parent
          }
          if (node.children?.length > 0) {
            findLast(node)
          }
          if (nodePointer) {
            break
          }
      }
    }
    if (tree.children.length > 0) {
      findLast(tree)
      noText = false
    } else {
      nodePointer = tree
    }
    if (nodePointer) {
      nodePointer.children.push({
        type: 'element', tagName: 'span', properties: {
          className: `blink ${noText ? "animated" : ""}`
        }, children: []
      })
    }
    return tree
  }
}