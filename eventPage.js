var currURL, arr, result;

/**
 * Checks if the URL is present in the current block list. If present a message is sent to the
 * content script to block the website
 */
var callback = () => {
	console.log("Before request checkpoint-1");
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, tabs => {
		currURL = tabs[0].url;
		arr = currURL.split('/');
		result = arr[0] + "\/\/" + arr[2] + "/*";
		console.log(result + " checkpoint-2");
		chrome.storage.local.get(['blockedURL'], (u) => {
			if (u.blockedURL !== undefined) {
				if (u.blockedURL.includes(result)) {
					console.log("Should be blocked");
					chrome.tabs.sendMessage(tabs[0].id, {
						msg: "block"
					}, function (response) {
						if (response.type == "success") {
							console.log('Blocked successfully');
						}
					});
				}
			}
		});
	});
};
var filter = {
	urls: ["<all_urls>"]
};
var opt_extraInfoSpec = [];

/**
 * Event is triggered before every web request
 */
chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);