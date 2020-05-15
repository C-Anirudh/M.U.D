$(function(){
    var currURL, status;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        currURL = document.getElementById('currentURL');
        currURL.value=tabs[0].url;
        currURL.readOnly = true;
    });
        
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
        status = document.getElementById('currentURLStatus');
        status.innerHTML = "Safe";
        status.style.color = "green";
    });

    chrome.storage.local.get(['blockedURL'],function(u) {
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

    $('#blockURLBtn').click(function(){
        chrome.storage.local.get(['blockedURL'],function(u){
            var currList = [];
            if (typeof u.blockedURL !== 'undefined') {
                currList = u.blockedURL.slice(0); 
            }
            var arr = currURL.value.split('/');
            var result = arr[0] + "\/\/" + arr[2] + "/*";
            if (!currList.includes(result)) {
                currList.push(result);
            } else {
                const index = currList.indexOf(result);
                if (index > -1) {
                    currList.splice(index, 1);
                }
            }
            chrome.storage.local.set({'blockedURL': currList},function(){
                var notifOptions = {
                    type: 'basic',
                    iconUrl: './assets/img/48.png',
                    title: 'Limit Reached!',
                    message: 'Uh oh! Looks like you\'ve reached your limit !' 
                };
                chrome.notifications.create('limitNotif',notifOptions);
            });
        });
    });
});