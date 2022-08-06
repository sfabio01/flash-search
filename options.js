var storageData = {};
chrome.storage.sync.get(null, (data) => {
    if (data != null) {
        storageData = data;
        updateView();
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (newValue === undefined) {
                delete storageData[key];
            } else {
                storageData[key] = newValue;
            }
        }
        updateView();
    }
});

document.getElementById("create-btn").addEventListener("click", async (e) => {
    var name = document.getElementById("input-name").value;
    var url = document.getElementById("input-url").value;
    name = name.trim();
    url = url.trim();
    if (name == "" || url == "") return;
    if (!url.startsWith("https://")) {
        url = "https://" + url;
    }
    await chrome.storage.sync.set({ [name]: url });
    document.getElementById("input-name").value = "";
    document.getElementById("input-url").value = "";
});

var updateView = () => {
    var shortcutList = document.getElementById("shortcut-list");

    // remove all child nodes
    while (shortcutList.firstChild) {
        shortcutList.removeChild(shortcutList.firstChild);
    }
    // create list
    for (let [name, url] of Object.entries(storageData)) {
        var listItem = document.createElement("div");
        listItem.className = "list-item";

        var div1 = document.createElement("div");
        var p1 = document.createElement("p");
        p1.className = "item-name";
        p1.innerHTML = name;
        var p2 = document.createElement("p");
        p2.className = "item-url";
        p2.innerHTML = url;
        div1.appendChild(p1);
        div1.appendChild(p2);

        var div2 = document.createElement("div");
        var removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.innerHTML = '<span class="material-symbols-rounded">delete</span>';
        removeBtn.addEventListener("click", function (e) {
            removeShortcut(name);
        });
        div2.appendChild(removeBtn);

        listItem.appendChild(div1);
        listItem.appendChild(div2);
        shortcutList.appendChild(listItem);
    }
}

var removeShortcut = (name) => {
    chrome.storage.sync.remove(name);
}