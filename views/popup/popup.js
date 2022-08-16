async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    document.getElementById("input-url").value = tab.url;
    document.getElementById("input-name").value = tab.title;
    let res = await chrome.storage.sync.get(null);
    for (let [key, value] of Object.entries(res)) {
        if (value == tab.url) {
            document.getElementById("input-name").value = key;
            document.getElementById("input-name").disabled = true;
            document.getElementById("create-btn").disabled = true;
            break;
        }
    }
}

getCurrentTab();

document.getElementById("create-btn").addEventListener("click", async (e) => {
    var name = document.getElementById("input-name").value;
    var url = document.getElementById("input-url").value;
    name = name.trim();
    url = url.trim();
    if (name == "" || url == "") return;
    await chrome.storage.sync.set({ [name]: url });
    document.getElementById("input-name").value = "";
});