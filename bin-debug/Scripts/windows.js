function echo(str) {
  //delLast();
  WScript.Echo(str);
  //lastLen = 0;
}

function delLast() {
  var str = "";
  for (var i = 0; i < 0; i++) {
    str = bs() + str;
  }  
  WScript.StdOut.Write(str);
}

function bs() {
  return String.fromCharCode(8);
}

function echoTrack(currTrack){
    echo("<track><artist><![CDATA["+currTrack.Artist+"]]></artist><album><![CDATA["+currTrack.Album+"]]></album><title><![CDATA["+currTrack.Name+"]]></title><play_count>"+currTrack.PlayedCount+"</play_count></track>");
}


/**
 * Prints the contents of the library as an xml string. 
 */
function getLibrary(){
    var mainPlaylist = iTunesApp.LibraryPlaylist;
    var tracks = mainPlaylist.Tracks;
    var numTracks = tracks.Count;
    var i;
    
    echo("<library>");
    for (i = 1; i <= numTracks; i++){
        var currTrack = tracks.Item(i);
        if (currTrack.Kind == ITTrackKindFile && ! currTrack.Podcast ){
            echoTrack(currTrack);
        }
    }
    echo("</library>");
}

function getPlaylists(){
    echo("<playlists>");
    var i = 1;
    var a = 1;
    for(i=1; i <= iTunesApp.LibrarySource.Playlists.Count; i++){
        var p = iTunesApp.LibrarySource.Playlists.Item(i);
        if(p.Tracks.Count > 0 && p.Name != "Library" && p.Name != "Podcasts" &&p.Name != "Movies"){
            echo("<playlist>");
            echo("<name>"+p.Name+"</name>");
            echo("<items>");
            for(a=1; a <= p.Tracks.Count; a++){
                var currTrack = p.Tracks.Item(a);
                if (currTrack.Kind == ITTrackKindFile && ! currTrack.Podcast ){
                    echoTrack(currTrack);
                }
            }
            echo("</items>");
            echo("</playlist>");
        }
    }
    echo("</playlists>");
}
function getPlaylist(){
    var query = WScript.Arguments.Item(1);
    var p = iTunesApp.LibrarySource.Playlists.ItemByName(query);
    echo("<playlist>");
    
    echo("<name>"+p.Name+"</name>");
    echo("<items>");
    for(a=1; a <= p.Tracks.Count; a++){
        var currTrack = p.Tracks.Item(a);
        if (currTrack.Kind == ITTrackKindFile && ! currTrack.Podcast ){
            echoTrack(currTrack);
        }
    }
    echo("</items>");
    echo("</playlist>");
}
function getSearch(){
    var query = WScript.Arguments.Item(1);

    var results = iTunesApp.LibraryPlaylist.Search(query, 0);
    echo("<results>");
    echo("<count>"+results.Count+"</count>");
    if(results.Count > 0){
        for(var i=1; i<= results.Count; i++){
            var currTrack = results.Item(i);
            if (currTrack.Kind == ITTrackKindFile && ! currTrack.Podcast ){
                echoTrack(currTrack);
            }
        }
    }
    echo("</results>");
}

function addFileToLibrary(){
    var status = iTunesApp.ConvertFile2(path);
    
    var m=status.MaxProgressValue;
    var p=status.ProgressValue;
    while(p < m){
        m=status.MaxProgressValue;
        p=status.ProgressValue;
    }
    
    echo("<add_file>1</add_file>");
}

function playlistExists(){
    var pNameQuery = WScript.Arguments.Item(1);
    var p = iTunesApp.LibrarySource.Playlists.ItemByName(pNameQuery);
    if(p){
        echo("<playlist_exists>1</playlist_exists>");
    
    }
    else{
        echo("<playlist_exists>0</playlist_exists>");
    }
}

function addSongToPlaylist(){
    var playlist = WScript.Arguments.Item(1);
    var songInfo = WScript.Arguments.Item(2);
    
    playlist = iTunesApp.LibrarySource.Playlists.ItemByName(playlist);
    var songToAdd = iTunesApp.LibraryPlaylist.Search(songInfo, 0).Item(1);
    playlist.AddTrack(songToAdd);
    echo("<add_song_to_playlist>1</add_song_to_playlist>");
    
}

function createPlaylist(){
    var name = WScript.Arguments.Item(1);
    var p = iTunesApp.CreatePlaylist(name);
    if(p){
        echo("<playlist_created>1</playlist_created>");
    }
    else{
        echo("<playlist_created>0</playlist_created>");
    }
}

function getCurrentTrack(){
    var ct = iTunesApp.CurrentTrack;
    if(ct){
        echo("<current_track>");
        echoTrack(ct);
        echo("</current_track>");
    }
    else{
        echo("<current_track>");
        echo("<error>E_POINTER</error>");
        echo("</current_track>");
    }
}

var ITTrackKindFile = 1;
var iTunesApp = WScript.CreateObject("iTunes.Application");
Command = WScript.Arguments.Item(0);
WScript.Interactive = true;

switch(Command){
    case 'library':
        getLibrary();
    break;
    
    case 'playlists':
        getPlaylists();
    break;
    
    case 'search':
        getSearch();
    break;
    
    case 'add_file':
        addFileToLibrary();
    break;
    
    case 'playlist_exists':
        playlistExists();
    break;
    
    case 'create_playlist':
        createPlaylist();
    break;
    
    case 'add_song_to_playlist':
        addSongToPlaylist();
    break;
    
    case 'get_playlist':
        getPlaylist();
    break;
    
    case 'current_track':
        getCurrentTrack();
    break;
    
    case 'stop':
        iTunesApp.Stop();
    break;
    case 'play':
        iTunesApp.Play();
    break;
    case 'next':
        iTunesApp.NextTrack();
    break;
    case 'previous':
        iTunesApp.PreviousTrack();
    break;
}