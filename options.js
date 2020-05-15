$(function(){
    chrome.storage.local.get(['blockedURL'],function(u) {
        if (typeof u.blockedURL !== 'undefined' && u.blockedURL.length !== 0) {
            var html = "";
            for (var i = 0; i < u.blockedURL.length; i++) {
                html+="<tr>";
                html+="<th scope=\"row\">"+(i+1)+"</th>"
                html+="<td>"+u.blockedURL[i]+"</td>";
                /*html+="<td><button class=\"btn btn-success\" id=\"unblockBtn\" name=\""+i+"\" onclick>Unblock</button></td>";*/
                html+="</tr>";
            }
            document.getElementById("block-list").innerHTML = html;
        } else {
            document.getElementById('block-list').innerHTML = '<tr><th scope=\"row\"></th><td>No URLs blocked</td></tr>';
        }
        
    });
    /*$('#saveLimit').click(function(){
        var limit = $('#limit').val();
        if(limit){
            chrome.storage.sync.set({'limit': limit},function(){
                close();
            });
        }
    });*/
    /*chrome.tabs.getSelected(null, tab => {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, { code: code });
    });*/

    $('#resetList').click(function(){
        chrome.storage.local.set({'blockedURL': []},function() {
            var notifOptions = {
                type: 'basic',
                iconUrl: './assets/img/48.png',
                title: 'Block List has been Reset',
                message: 'You reset your blocked URLs list !'
            };
            chrome.notifications.create('resetNotif',notifOptions);
            window.location.reload();
        });
    });
});