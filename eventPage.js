var currURL, arr, result;

var callback = (details) => {
    console.log("Before request checkpoint-1");
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        currURL = tabs[0].url;
        arr = currURL.split('/');
        result = arr[0] + "\/\/" + arr[2] + "/*";
        console.log(result + " checkpoint-2");
        chrome.storage.local.get(['blockedURL'],function(u){
            if (u.blockedURL.includes(result)) {
                console.log("Should be blocked");
                chrome.tabs.sendMessage(tabs[0].id, {msg:"block"}, function(response) {
                    if(response.type == "success"){
                        console.log('Blocked successfully');
                    }
                });
            }
        });
    });
};
var filter = {urls: ["<all_urls>"]};
var opt_extraInfoSpec = [];

chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);