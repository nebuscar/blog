const isWhitespace = node => node?.type === "text" && node.value.trim() === "";

const meaningfulChildren = node =>
  node.children?.filter(child => !isWhitespace(child)) ?? [];

const imageFromParagraph = node => {
  if (node?.type !== "element" || node.tagName !== "p") return;

  const children = meaningfulChildren(node);
  if (children.length !== 1) return;

  const image = children[0];
  return image.type === "element" && image.tagName === "img"
    ? image
    : undefined;
};

const captionFromParagraph = node => {
  if (node?.type !== "element" || node.tagName !== "p") return;

  const children = meaningfulChildren(node);
  if (children.length !== 1) return;

  const emphasis = children[0];
  return emphasis.type === "element" && emphasis.tagName === "em"
    ? emphasis
    : undefined;
};

const nextMeaningfulIndex = (children, start) => {
  for (let index = start; index < children.length; index += 1) {
    if (!isWhitespace(children[index])) return index;
  }
  return -1;
};

export default function rehypeAutoFigure() {
  return tree => {
    let figureNumber = 0;

    const transformParent = parent => {
      if (!Array.isArray(parent.children)) return;

      for (let index = 0; index < parent.children.length; index += 1) {
        const image = imageFromParagraph(parent.children[index]);
        const captionIndex = nextMeaningfulIndex(parent.children, index + 1);
        const caption =
          captionIndex >= 0
            ? captionFromParagraph(parent.children[captionIndex])
            : undefined;

        if (image && caption) {
          figureNumber += 1;
          const figure = {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [
              image,
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: [
                  { type: "text", value: `图 ${figureNumber}：` },
                  ...caption.children,
                ],
              },
            ],
          };

          parent.children.splice(index, captionIndex - index + 1, figure);
          continue;
        }

        transformParent(parent.children[index]);
      }
    };

    transformParent(tree);
  };
}
