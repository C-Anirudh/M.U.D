chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg == "block") {
        console.log('Block request received!');
        document.body.innerHTML = 'BLOCKED';
        sendResponse({type: "success"});
    }
});