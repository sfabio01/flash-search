var suggestionList = [];
var datalist = document.getElementById("suggestions-list");

chrome.storage.sync.get('list', function(result) {
    if (result.list != null) {
        suggestionList = result.list;
    }
    for (var item of suggestionList) {
        var option = document.createElement("option");
        option.value = item;
        option.innerHTML = item;
        datalist.appendChild(option);
    }
});

document.getElementById("input-search").addEventListener("input", function (event) {
    var input = this.value;
    var suggestions = [];
    
    for (var item of suggestionList) {
        if (item.includes(input)) {
            suggestions.push(item);
        }
    }
    console.log(suggestions);
    if (suggestions.length == 1 && input != "") {
        var url = suggestions[0];
        if (!url.startsWith("https://")) {
            url = "https://" + url;
        }
        chrome.tabs.create({
            url: url,
        });
        document.getElementById("input-search").value = "";
    }
});

document.getElementById("input-search").addEventListener("keypress", function(e) {
    if (e.key == "Enter") {
        chrome.search.query({
            text: this.value,
        });
        this.value = "";
    }
    
});

document.getElementById("add-button").addEventListener("click", async function(e) {
    chrome.runtime.openOptionsPage();
    // var url = prompt("Add a new URL to the list");
    // if (url == null || url == "") return;
    // var result = await chrome.storage.sync.get('list');
    // var list = []
    // if (result.list != null) {
    //     list = result.list;
    // }
    // list.push(url);
    // await chrome.storage.sync.set({list: list});

    // // update local variables
    // suggestionList.push(url);
    // var option = document.createElement("option");
    // option.value = url;
    // option.innerHTML = url;
    // datalist.appendChild(option);
});