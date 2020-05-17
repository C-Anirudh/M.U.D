/**
 * JQuery function to execute when all DOM elements are fully loaded and ready to use
 */
$(function () {
	/**
	 * This uses the `chrome.storage` API to fetch the list of blocked URLs and displays them in a table
	 * in the options page
	 */
	chrome.storage.local.get(['blockedURL'], (u) => {
		if (typeof u.blockedURL !== 'undefined' && u.blockedURL.length !== 0) {
			var html = "";
			for (var i = 0; i < u.blockedURL.length; i++) {
				html += "<tr>";
				html += "<th scope=\"row\">" + (i + 1) + "</th>"
				html += "<td>" + u.blockedURL[i] + "</td>";
				html += "<td></td></tr>";
			}
			document.getElementById("block-list").innerHTML = html;
		} else {
			document.getElementById('block-list').innerHTML = '<tr><th scope=\"row\"></th><td>No URLs blocked</td><td></td></tr>';
		}

	});
	/**
	 * Checks for click event of the Reset List button. The list of blocked URLs is cleared. The user is informed
	 * through a chrome notification
	 */
	$('#resetList').click(() => {
		chrome.storage.local.set({
			'blockedURL': []
		}, () => {
			var notifOptions = {
				type: 'basic',
				iconUrl: './assets/img/48.png',
				title: 'Block List has been Reset',
				message: 'You reset your blocked URLs list !'
			};
			chrome.notifications.create('resetNotif', notifOptions);
			window.location.reload();
		});
	});

	/**
	 * Checks for click event of the Check URL button. When clicked, the URL that is given as input is
	 * checked and a status result of whether safe or unsafe is displayed
	 */
	$('#checkURLBtn').click(() => {
		var html;
		var currURL = document.getElementById('URL').value;
		if (currURL !== undefined && currURL !== "") {
			var arr = currURL.split('/');
			var arr2 = arr[2].split('.');
			if (arr2[0] == "www") {
				arr2.splice(0, 1);
			}
			if (blockDict.includes(arr2.join('.'))) {
				html = '<div class="card-footer text-danger">Un-Safe</div>';
			} else {
				html = '<div class="card-footer text-success">Safe</div>';
			}
			document.getElementById("URLStatus").innerHTML = html;
		}
	});

	/**
	 * Checks for click event of the Add URL button. When clicked, the URL that is given as input is added
	 * to the block list if it is not already present there
	 */
	$('#addURLBtn').click(() => {
		var currURL = document.getElementById('URLadd').value;
		chrome.storage.local.get(['blockedURL'], (u) => {
			var currList = [];
			if (typeof u.blockedURL !== 'undefined') {
				currList = u.blockedURL.slice(0);
			}
			var arr = currURL.split('/');
			var result = arr[0] + "\/\/" + arr[2] + "/*";
			if (!currList.includes(result)) {
				currList.push(result);
			}
			chrome.storage.local.set({
				'blockedURL': currList
			}, () => {
				window.location.reload();
			});
		});
	});
});