let profiles = {};

chrome.storage.local.get("profiles", data => {
  profiles = data.profiles || {};
  const list = document.getElementById("profileList");
  for (let p in profiles) {
    let opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    list.appendChild(opt);
  }
});

saveProfile.onclick = () => {
  const name = prompt("Profile name?");
  profiles[name] = {
    title: title.value,
    price: price.value,
    category: category.value
  };
  chrome.storage.local.set({ profiles });
};

loadProfile.onclick = () => {
  const p = profiles[profileList.value];
  title.value = p.title;
  price.value = p.price;
  category.value = p.category;
};

autofill.onclick = () => run("single");
bulk.onclick = () => run("bulk");

function run(type) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: fill,
      args: [profiles[profileList.value], type]
    });
  });
}

function fill(data, type) {
  function apply(d) {
    document.querySelector("input[name='productName']").value = d.title;
    document.querySelector("input[name='price']").value = d.price;
  }

  if (type === "single") apply(data);

  if (type === "bulk") {
    let items = JSON.parse(localStorage.getItem("excelData") || "[]");
    items.forEach((d, i) => {
      setTimeout(() => apply(d), i * 2000);
    });
  }
}
