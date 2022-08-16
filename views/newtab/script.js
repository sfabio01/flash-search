var suggestions = {};
var datalist = document.getElementById("suggestions-list");

chrome.storage.sync.get(null, function (result) {
    if (result != null) {
        suggestions = result;
    }
    for (var item of Object.keys(suggestions)) {
        var option = document.createElement("option");
        option.value = suggestions[item];
        option.innerHTML = item;
        datalist.appendChild(option);
    }
});

document.getElementById("input-search").addEventListener("change", function (e) {
    chrome.tabs.create({
        url: this.value,
    });
    this.value = "";
})

document.getElementById("input-search").addEventListener("input", function (event) {
    var input = this.value;
    var filtered = [];
    
    for (var item of Object.keys(suggestions)) {
        if (item.toLowerCase().includes(input.toLowerCase())) {
            filtered.push(item);
        }
    }
    if (filtered.length == 1 && input != "") {
        var url = suggestions[filtered[0]];
        chrome.tabs.create({
            url: url,
        });
        document.getElementById("input-search").value = "";
    }
    if (filtered.length == 0 && input.trim() != "") {
        document.getElementById("hint-message").hidden = false;
    }
});

document.getElementById("input-search").addEventListener("keypress", function(e) {
    if (e.key == "Enter") {
        if (this.value.trim() != "") {
            chrome.search.query({
                text: this.value,
            });
            this.value = "";
        }
    }
    
});


document.getElementById("settings-button").addEventListener("click", async function (e) {
    chrome.runtime.openOptionsPage();
});