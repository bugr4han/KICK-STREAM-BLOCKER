let enabled = true;
let customCategories = [];
let customInputs = [];
let customPublishers = [];

function removeCards() {
  if (!enabled) return;

  document.querySelectorAll("div.group\\/card").forEach((el) => {
    const text = el.innerText.toLowerCase();

    // Delete by Categories
    for (const cat of customCategories) {
      if (cat && text.includes(cat.toLowerCase())) {
        el.remove();
        return;
      }
    }

    // Delete by Title
    const titleEl = el.querySelector("a[title]");
    if (titleEl) {
      const titleText = (
        titleEl.getAttribute("title") ||
        titleEl.textContent ||
        ""
      ).toLowerCase();
      for (const val of customInputs) {
        if (val && titleText.includes(val.toLowerCase())) {
          el.remove();
          return;
        }
      }
    }

    // Delete by Nickname
    if (customPublishers.length > 0) {
      const publisherEls = el.querySelectorAll(
        'a[href^="/"] img[alt], a[title], a span'
      );
      for (const pubEl of publisherEls) {
        const pubText = (pubEl.alt || pubEl.title || pubEl.textContent || "")
          .toLowerCase()
          .trim();
        for (const val of customPublishers) {
          if (pubText.includes(val.toLowerCase())) {
            el.remove();
            return;
          }
        }
      }
    }
  });
}

chrome.storage.sync.get(
  ["enabled", "customCategories", "customInputs", "customPublishers"],
  (data) => {
    enabled = data.enabled !== undefined ? data.enabled : true;
    customCategories = data.customCategories ?? [];
    customInputs = data.customInputs ?? [];
    customPublishers = data.customPublishers ?? [];
    removeCards();
  }
);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    if (changes.enabled) enabled = changes.enabled.newValue;

    if (changes.customCategories)
      customCategories = changes.customCategories.newValue;

    if (changes.customInputs) customInputs = changes.customInputs.newValue;

    if (changes.customPublishers)
      customPublishers = changes.customPublishers.newValue;

    removeCards(); // 🔥 DEĞİŞİR DEĞİŞMEZ UYGULA
  }
});

const observer = new MutationObserver(removeCards);
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("kickBlockerUpdate", () => {
  chrome.storage.sync.get(
    ["customCategories", "customInputs", "customPublishers"],
    (data) => {
      customCategories = data.customCategories ?? [];
      customInputs = data.customInputs ?? [];
      customPublishers = data.customPublishers ?? [];
      removeCards();
    }
  );
});
