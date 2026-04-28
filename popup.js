let profiles = {};

chrome.storage.local.get("profiles", (data) => {
  profiles = data.profiles || {};
  refresh();
});

function refresh() {
  const list = document.getElementById("profileList");
  list.innerHTML = "";

  Object.keys(profiles).forEach(p => {
    let opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    list.appendChild(opt);
  });
}

// ➕ Add Profile (Auto Detect)
document.getElementById("detect").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        return {
          title: document.querySelector("input[name='productName']")?.value,
          price: document.querySelector("input[name='price']")?.value
        };
      }
    }, (res) => {
      const data = res[0].result;
      const name = prompt("Profile Name?", data.title);

      profiles[name] = data;
      chrome.storage.local.set({ profiles }, refresh);
    });
  });
};

// ⚡ Autofill
document.getElementById("autofillBtn").onclick = () => {
  const selected = profileList.value;

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: (data) => {
        document.querySelector("input[name='productName']").value = data.title;
        document.querySelector("input[name='price']").value = data.price;
      },
      args: [profiles[selected]]
    });
  });
};
