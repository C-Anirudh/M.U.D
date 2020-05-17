/**
 * JQuery function to execute when all DOM elements are fully loaded and ready to use
 */
$(function () {
	var currURL, status;
	/**
	 * This uses the `chrome.tabs` api to fetch the current active tab in the current window.
	 * The URL of the current tab is displayed in the extension popup and is then used to predict
	 * whether the URL is malicious or not. The end result is displayed as status in the popup.
	 */
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, (tabs) => {
		currURL = document.getElementById('currentURL');
		currURL.value = tabs[0].url;
		currURL.readOnly = true;

		status = document.getElementById('currentURLStatus');
		var arr = currURL.value.split('/');
		var arr2 = arr[2].split('.');
		if (arr2[0] == "www") {
			arr2.splice(0, 1);
		}
		if (blockDict.includes(arr2.join('.'))) {
			status.innerHTML = "Un-Safe";
			status.style.color = "red";
		} else {
			status.innerHTML = "Safe";
			status.style.color = "green";
		}
	});

	/**
	 * This uses the `chrome.storage` API to fetch the list of the currently blocked URLs. If the
	 * current URL is present in the blocklist, then the block button in the extension popup changes
	 * to the unblock button.
	 */
	chrome.storage.local.get(['blockedURL'], (u) => {
		var urlList = [];
		if (typeof u.blockedURL !== 'undefined') {
			urlList = u.blockedURL.slice(0);
		}

		var arr = currURL.value.split('/');
		var result = arr[0] + "\/\/" + arr[2] + "/*";

		if (urlList.includes(result)) {
			var blockBtn = document.getElementById('blockURLBtn');
			blockBtn.innerHTML = 'Unblock';
			blockBtn.classList = 'btn btn-success'
		}
	});

	/**
	 * This checks for the click event of the Block URL button in the extension popup. When the button
	 * is clicked, the `chrome.storage` API is used to fetch the current list of blocked URLs and the
	 * current URL is appended to the list if it is not already present.
	 */
	$('#blockURLBtn').click(function () {
		chrome.storage.local.get(['blockedURL'], (u) => {
			var currList = [];
			if (typeof u.blockedURL !== 'undefined') {
				currList = u.blockedURL.slice(0);
			}

			// modification done to the URL to block the whole domain and not just that URL path
			var arr = currURL.value.split('/');
			var result = arr[0] + "\/\/" + arr[2] + "/*";

			// Check for duplicates
			if (!currList.includes(result)) {
				currList.push(result);
			} else {
				const index = currList.indexOf(result);
				if (index > -1) {
					currList.splice(index, 1);
				}
			}
			chrome.storage.local.set({
				'blockedURL': currList
			}, () => {});
		});
	});

	/**
	 * CHecks for click event on Go to Options page button
	 */
	$("#options-page").click(() => {
		chrome.runtime.openOptionsPage();
	});
});