console.log('Now we can write some javascript');

app = {};
app.searchBxId = 'search';
app.resultsBxId = 'resultsBx';

app.getHttpCall = function(){
    var httpCall = false;
    try  {
        httpCall = new XMLHttpRequest(); // Firefox, Opera 8.0+, Safari
    }catch (e){ // Internet Explorer
        try{
            httpCall = new ActiveXObject("MSXML2.XMLHTTP"); //("Msxml2.XMLHTTP");
        }catch (e){
            try {
                httpCall = new ActiveXObject("MSXML2.XMLHTTP.3.0"); //("Microsoft.XMLHTTP");
            }catch (e3){
                httpCall = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
    }
    return httpCall;
}

app.serverCall = function( pOpt ){
    if( pOpt != undefined ){
        console.log('app.serverCall');
        console.log( pOpt );
        const call = this.getHttpCall();
        let JSONObject = {};
        const callMethod = (pOpt.method != undefined) ? pOpt.method : 'post';
        const sendPost = (pOpt.sendPost != undefined) ? pOpt.sendPost : '';
        const sendGet = (pOpt.sendGet != undefined) ? pOpt.sendGet : '';

        const async = true; // asynchronic connection
        const u = null; // user
        const p = null; // password
        call.open(callMethod, sendGet, async, u, p); //data_moving.php
        call.onreadystatechange = function() {
            if (call.readyState == 4){
                JSONObject = JSON.parse(call.responseText);

                // Call back : set from passed method options
                if(pOpt.callback != undefined){
                    pOpt.callback( JSONObject.results );
                }

            }
        }
        // GET CSRF token
        const csrfToken = document.getElementsByName("_token")[0].value;
        call.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        call.setRequestHeader("X-CSRF-TOKEN", csrfToken);
        call.send( sendPost );
    }
}
app.showResults = function( pResults ){
    console.log('showResults()');
    console.log( pResults );
    const resultsBx = document.getElementById( this.resultsBxId );
    // Count results
    const cntResults = (pResults.items != undefined)? pResults.items.length : 0;

    // Add results icon
    resultsBx.innerHTML = '<div class="flex items-center">\n' +
        '                                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>\n' +
        '                                <div class="ml-4 text-lg leading-7 font-semibold text-gray-900 dark:text-white">'+ cntResults +' results of your search</div>\n' +
        '                            </div>\n' +
        '\n';

    // Build list of results
    let resultsList = '';
    if( cntResults ){
        for(let r in pResults.items){
            console.log( ' - view result '+ r );
            console.log( pResults.items[ r ] );
            resultsList += '<div style="padding: 9px; height: 200px">' +
                pResults.items[ r ].snippet.title +
                '<img src="'+ pResults.items[ r ].snippet.thumbnails.default.url +'" style="float: left">' +
                '</div>';
        }
    }else if( pResults.error != undefined ){
        // Try to read what is google saying
        resultsList += '<div style="padding: 9px; height: 200px">' +
            'Error Code: '+pResults.error.code+ '<br>Message: '+ pResults.error.message +
            '</div>';
    }

    resultsBx.innerHTML += '<div class="ml-12">\n' +
            '                                <div class="mt-2 text-gray-600 dark:text-gray-400 text-sm">\n' +
            '                                  ' + resultsList +
            '                                </div>\n' +
            '                            </div>\n';

}
app.search = function(){
    var searchBx = document.getElementById( this.searchBxId );

    // Make a server call for data
    this.serverCall({
        sendPost : 'search='+ searchBx.value
        ,sendGet : '/search'
        ,callback : function( pResults ){
            app.showResults( pResults );
        }
    });
}


