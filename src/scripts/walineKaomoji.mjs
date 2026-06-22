const KAOMOJI = [
  "OwO",
  "|´・ω・)ノ",
  "ヾ(≧▽≦*)o",
  "(☆ω☆)",
  "(`・ω・´)",
  "￣へ￣",
  "(/ω＼)",
  "∠( ᐛ 」∠)_",
  "(๑•̀ㅂ•́)و✧",
  "→_→",
  "ฅ( ̳• ·̫ • ̳ฅ)",
  "٩(๑❛ᴗ❛๑)۶",
  "q(≧▽≦q)",
  "(ノ°ο°)ノ",
  "(´థ౪థ)",
  "ƪ(˘⌣˘)ʃ",
  "Σ(っ °Д °;)っ",
  "(つд⊂)",
  "ヽ(✿ﾟ▽ﾟ)ノ",
  "(ง •_•)ง",
  ">_<",
  "(｡･ω･｡)",
  "(￣▽￣)~*",
  "(≧∇≦)ﾉ",
];

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? start;

  textarea.setRangeText(`${text} `, start, end, "end");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.focus();
}

function enhancePopup(container) {
  const popup = container.querySelector(".wl-emoji-popup");
  const tabs = popup?.querySelector(".wl-tabs");
  if (!popup || !tabs || tabs.querySelector(".waline-kaomoji-tab")) return;

  const nativeTabs = [...tabs.querySelectorAll(".wl-tab")];
  const nativeLabels = ["Emoji", "Bilibili"];

  nativeTabs.forEach((tab, index) => {
    const label = document.createElement("span");
    label.className = "waline-emoji-tab-label";
    label.textContent = nativeLabels[index] ?? `表情 ${index + 1}`;
    tab.append(label);
  });

  const panel = document.createElement("div");
  panel.className = "waline-kaomoji-panel";
  panel.setAttribute("role", "tabpanel");

  for (const kaomoji of KAOMOJI) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = kaomoji;
    button.title = kaomoji;
    button.addEventListener("click", () => {
      const textarea = container.querySelector("#wl-edit");
      if (textarea instanceof HTMLTextAreaElement) {
        insertAtCursor(textarea, kaomoji);
      }
    });
    panel.append(button);
  }

  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "wl-tab waline-kaomoji-tab active";
  tab.textContent = "颜文字";
  tab.setAttribute("role", "tab");
  tab.addEventListener("click", () => {
    popup.classList.add("waline-kaomoji-active");
    panel.hidden = false;
    tab.classList.add("active");
    nativeTabs.forEach(nativeTab => nativeTab.classList.remove("active"));
  });

  tabs.prepend(tab);
  popup.insertBefore(panel, tabs);
  popup.classList.add("waline-kaomoji-active");
}

export function enhanceWalineKaomoji(container) {
  const handleNativeTab = event => {
    const nativeTab = event.target.closest(
      ".wl-tabs .wl-tab:not(.waline-kaomoji-tab)"
    );
    if (!nativeTab) return;

    const popup = nativeTab.closest(".wl-emoji-popup");
    popup?.classList.remove("waline-kaomoji-active");
    popup?.querySelector(".waline-kaomoji-tab")?.classList.remove("active");
  };

  container.addEventListener("click", handleNativeTab);
  const observer = new MutationObserver(() => enhancePopup(container));
  observer.observe(container, { childList: true, subtree: true });
  enhancePopup(container);

  return () => {
    observer.disconnect();
    container.removeEventListener("click", handleNativeTab);
  };
}
