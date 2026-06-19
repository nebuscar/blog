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

function findMermaidBlocks() {
  const codes = Array.from(
    document.querySelectorAll<HTMLElement>(
      "pre code.language-mermaid, pre code[data-language='mermaid']"
    )
  );

  return codes
    .map(code => code.closest<HTMLElement>("pre"))
    .filter((block): block is HTMLElement => Boolean(block));
}

async function renderMermaidBlocks() {
  const blocks = findMermaidBlocks();
  if (!blocks.length) return;

  const mermaid = await loadMermaid();
  initMermaid(mermaid);

  await Promise.all(
    blocks.map(async (block, index) => {
      if (block.dataset.mermaidRendered === "true") return;

      const code = block.querySelector("code");
      const graphDefinition = code?.textContent?.trim();
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
