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

const firstImageCaptionPair = children => {
  for (let index = 0; index < children.length; index += 1) {
    const image = children[index];
    if (image?.type !== "element" || image.tagName !== "img") continue;

    const captionIndex = nextMeaningfulIndex(children, index + 1);
    const caption = children[captionIndex];
    if (caption?.type === "element" && caption.tagName === "em") {
      return { imageIndex: index, captionIndex, image, caption };
    }
  }
};

const paragraph = children => ({
  type: "element",
  tagName: "p",
  properties: {},
  children,
});

const createFigure = (image, caption, figureNumber) => ({
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
});

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
          const figure = createFigure(image, caption, figureNumber);

          parent.children.splice(index, captionIndex - index + 1, figure);
          continue;
        }

        const node = parent.children[index];
        const inlinePair =
          node?.type === "element" && node.tagName === "p"
            ? firstImageCaptionPair(node.children ?? [])
            : undefined;

        if (inlinePair) {
          figureNumber += 1;
          const before = node.children.slice(0, inlinePair.imageIndex);
          const after = node.children.slice(inlinePair.captionIndex + 1);
          const replacement = [];

          if (meaningfulChildren({ children: before }).length > 0) {
            replacement.push(paragraph(before));
          }

          replacement.push(
            createFigure(inlinePair.image, inlinePair.caption, figureNumber)
          );

          if (meaningfulChildren({ children: after }).length > 0) {
            replacement.push(paragraph(after));
          }

          parent.children.splice(index, 1, ...replacement);
          index += replacement.length - 1;
          continue;
        }

        transformParent(parent.children[index]);
      }
    };

    transformParent(tree);
  };
}
