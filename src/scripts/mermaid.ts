type MermaidApi = typeof import("mermaid").default;

const getTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "default";

let initializedTheme = "";
let mermaidPromise: Promise<MermaidApi> | null = null;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then(module => module.default);
  return mermaidPromise;
}

function initMermaid(mermaid: MermaidApi) {
  const theme = getTheme();
  if (theme === initializedTheme) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme,
  });
  initializedTheme = theme;
}

function getCodeText(block: HTMLElement) {
  return block.querySelector("code")?.textContent?.trim() ?? "";
}

function isMermaidDefinition(value: string) {
  return /^(---\s*\n[\s\S]*?\n---\s*)?(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|sankey-beta|xychart-beta|block-beta|packet-beta|architecture-beta)\b/i.test(
    value.trim()
  );
}

function findMermaidBlocks() {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>("pre"));

  return blocks.filter(
    block =>
      block.querySelector("code.language-mermaid, code[data-language='mermaid']") ||
      isMermaidDefinition(getCodeText(block))
  );
}

async function renderMermaidBlocks() {
  const blocks = findMermaidBlocks();
  if (!blocks.length) return;

  const mermaid = await loadMermaid();
  initMermaid(mermaid);

  await Promise.all(
    blocks.map(async (block, index) => {
      if (block.dataset.mermaidRendered === "true") return;

      const graphDefinition = getCodeText(block);
      if (!graphDefinition) return;

      const wrapper = document.createElement("div");
      wrapper.className = "mermaid-diagram";
      wrapper.setAttribute("role", "img");
      wrapper.setAttribute("aria-label", "Mermaid diagram");

      try {
        const id = `mermaid-${Date.now()}-${index}`;
        const { svg, bindFunctions } = await mermaid.render(id, graphDefinition);
        wrapper.innerHTML = svg;
        bindFunctions?.(wrapper);
        block.dataset.mermaidRendered = "true";
        block.replaceWith(wrapper);
      } catch (error) {
        block.dataset.mermaidRendered = "error";
        console.error("Mermaid render failed", error);
      }
    })
  );
}

renderMermaidBlocks();
document.addEventListener("astro:page-load", renderMermaidBlocks);
document.addEventListener("astro:after-swap", renderMermaidBlocks);
