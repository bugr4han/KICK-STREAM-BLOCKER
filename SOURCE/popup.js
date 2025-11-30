const toggleEnabled = document.getElementById("toggleEnabled");
const categorySelect = document.getElementById("categorySelect");
const addCategory = document.getElementById("addCategory");
const categoryList = document.getElementById("categoryList");

const customInput = document.getElementById("customInput");
const addInput = document.getElementById("addInput");
const inputList = document.getElementById("inputList");

const customPublisher = document.getElementById("customPublisher");
const addPublisher = document.getElementById("addPublisher");
const publisherList = document.getElementById("publisherList");

let categories = [];
let inputs = [];
let publishers = [];

// ==============================
// STORAGE'DAN VERİLERİ ÇEK
// ==============================
chrome.storage.sync.get(
  ["enabled", "customCategories", "customInputs", "customPublishers"],
  (data) => {
    toggleEnabled.checked = data.enabled !== undefined ? data.enabled : true;
    categories = data.customCategories ?? [];
    inputs = data.customInputs ?? [];
    publishers = data.customPublishers ?? [];
    renderCategories();
    renderInputs();
    renderPublishers();
  }
);

// ==============================
// AKTİF SEKMEYİ YENİLE
// ==============================
function reloadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}

// ==============================
// CONTENT.JS'İ TETİKLE
// ==============================
function triggerContentUpdate() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          window.dispatchEvent(new Event("kickBlockerUpdate"));
        },
      });
    }
  });
}

// ==============================
// ENABLE / DISABLE SWITCH
// ==============================
toggleEnabled.addEventListener("change", () => {
  const isEnabled = toggleEnabled.checked;

  chrome.storage.sync.set({ enabled: isEnabled });
  triggerContentUpdate();

  // ❗ SADECE KAPANIRKEN REFRESH
  if (!isEnabled) {
    reloadActiveTab();
  }
});

// ==============================
// KATEGORİ EKLE
// ==============================
addCategory.addEventListener("click", () => {
  const val = categorySelect.value.trim();
  if (val && !categories.includes(val.toLowerCase())) {
    categories.push(val.toLowerCase());
    chrome.storage.sync.set({ customCategories: categories });
    renderCategories();
    triggerContentUpdate();
  }
  categorySelect.value = "";
});

// ==============================
// BAŞLIK KELİMESİ EKLE
// ==============================
addInput.addEventListener("click", () => {
  const val = customInput.value.trim();
  if (val && !inputs.includes(val.toLowerCase())) {
    inputs.push(val.toLowerCase());
    chrome.storage.sync.set({ customInputs: inputs });
    renderInputs();
    triggerContentUpdate();
  }
  customInput.value = "";
});

customInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addInput.click();
});

// ==============================
// YAYINCI EKLE
// ==============================
addPublisher.addEventListener("click", () => {
  const val = customPublisher.value.trim();
  if (val && !publishers.includes(val.toLowerCase())) {
    publishers.push(val.toLowerCase());
    chrome.storage.sync.set({ customPublishers: publishers });
    renderPublishers();
    triggerContentUpdate();
  }
  customPublisher.value = "";
});

customPublisher.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addPublisher.click();
});

// ==============================
// KATEGORİ LİSTELE + SİL (REFRESH VAR)
// ==============================
function renderCategories() {
  categoryList.innerHTML = "";
  categories.forEach((cat, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = cat;
    li.appendChild(span);

    const icon = document.createElement("i");
    icon.className = "fas fa-trash";
    icon.onclick = () => {
      categories.splice(idx, 1);
      chrome.storage.sync.set({ customCategories: categories });
      renderCategories();
      triggerContentUpdate();
      reloadActiveTab(); // 🔁 Çöp kutusu = otomatik refresh
    };

    li.appendChild(icon);
    categoryList.appendChild(li);
  });
}

// ==============================
// KELİME LİSTELE + SİL (REFRESH VAR)
// ==============================
function renderInputs() {
  inputList.innerHTML = "";
  inputs.forEach((inp, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = inp;
    li.appendChild(span);

    const icon = document.createElement("i");
    icon.className = "fas fa-trash";
    icon.onclick = () => {
      inputs.splice(idx, 1);
      chrome.storage.sync.set({ customInputs: inputs });
      renderInputs();
      triggerContentUpdate();
      reloadActiveTab(); // 🔁
    };

    li.appendChild(icon);
    inputList.appendChild(li);
  });
}

// ==============================
// YAYINCI LİSTELE + SİL (REFRESH VAR)
// ==============================
function renderPublishers() {
  publisherList.innerHTML = "";
  publishers.forEach((p, idx) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = p;
    li.appendChild(span);

    const icon = document.createElement("i");
    icon.className = "fas fa-trash";
    icon.onclick = () => {
      publishers.splice(idx, 1);
      chrome.storage.sync.set({ customPublishers: publishers });
      renderPublishers();
      triggerContentUpdate();
      reloadActiveTab(); // 🔁
    };

    li.appendChild(icon);
    publisherList.appendChild(li);
  });
}
