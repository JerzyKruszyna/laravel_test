<?php

/* Get YouTube search results
 * */
$results = 'false';

if(isset($_POST['search']) && strlen($_POST['search'])){
    $searchFor = $_POST['search'];
    $gKey = 'AIzaSyApttTM0LG0SJHtAIw-Enm-kH1rQk5wFxM';
    $maxResults = 10;
    $ytLink = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults='.$maxResults.'&q='.$searchFor.'&key='.$gKey.'';

    // We ask server for address geocoding
    // create curl resource
        $ch = curl_init();

    // set url
        curl_setopt($ch, CURLOPT_URL, $ytLink);

    //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    // TRUE to force the connection to explicitly close when it has finished processing, and not be pooled for reuse.
        curl_setopt($ch, CURLOPT_FORBID_REUSE, true);

    // TRUE to force the use of a new connection instead of a cached one.
    //curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);

    // $output contains the output string
        $results = curl_exec($ch);

    // close curl resource to free up system resources
        curl_close($ch);

}


echo '{"results": '. $results .' }';
?>
