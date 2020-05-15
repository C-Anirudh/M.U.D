chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg == "block") {
        console.log('Block request received!');
        document.body.innerHTML = `<h1>&#9888; This page has been flagged as <em>Malicious</em> by the M.U.D Chrome extension.</h1>`
        sendResponse({type: "success"});
    }
});