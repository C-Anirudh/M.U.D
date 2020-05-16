$(function() {
    chrome.storage.local.get(['blockedURL'],function(u) {
        if (typeof u.blockedURL !== 'undefined' && u.blockedURL.length !== 0) {
            var html = "";
            for (var i = 0; i < u.blockedURL.length; i++) {
                html+="<tr>";
                html+="<th scope=\"row\">"+(i+1)+"</th>"
                html+="<td>"+u.blockedURL[i]+"</td>";
                /*html+="<td><button class=\"btn btn-success\" id=\"unblockBtn\" name=\""+i+"\" onclick>Unblock</button></td>";*/
                html+="<td></td></tr>";
            }
            document.getElementById("block-list").innerHTML = html;
        } else {
            document.getElementById('block-list').innerHTML = '<tr><th scope=\"row\"></th><td>No URLs blocked</td></tr>';
        }
        
    });

    $('#resetList').click(function() {
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

    $('#checkURLBtn').click(function() {
        var html;
        var currURL = document.getElementById('URL').value;
        if (currURL !== undefined && currURL !== "") {
            var arr = currURL.split('/');
            var arr2 = arr[arr.length-1].split('.');
            if (arr2.includes('exe')) {
                html = '<div class="card-footer text-danger">Un-Safe</div>';
            } else {
                html = '<div class="card-footer text-success">Safe</div>';
            }
            document.getElementById("URLStatus").innerHTML = html;
        }
    });

    $('#addURLBtn').click(function() {
        var currURL = document.getElementById('URLadd').value;
        chrome.storage.local.get(['blockedURL'],function(u) {
            var currList = [];
            if (typeof u.blockedURL !== 'undefined') {
                currList = u.blockedURL.slice(0); 
            }
            var arr = currURL.split('/');
            var result = arr[0] + "\/\/" + arr[2] + "/*";
            if (!currList.includes(result)) {
                currList.push(result);
            }
            chrome.storage.local.set({'blockedURL': currList},function(){
                window.location.reload();
            });
        });
    });
});