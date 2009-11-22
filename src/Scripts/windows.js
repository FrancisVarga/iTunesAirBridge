function echo(str) {
  WScript.Echo(str);
}

function echoTrack(currTrack){
    echo("<track><artist><![CDATA["+currTrack.Artist+"]]></artist><album><![CDATA["+currTrack.Album+"]]></album><title><![CDATA["+currTrack.Name+"]]></title><play_count>"+currTrack.PlayedCount+"</play_count></track>");
}


/**
 * Prints the contents of the library as an xml string. 
 */
function getLibrary(){
    var ITTrackKindFile = 1;
    var iTunesApp = WScript.CreateObject("iTunes.Application");

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
    var ITTrackKindFile = 1;
    var iTunesApp = WScript.CreateObject("iTunes.Application");
    
    echo("<playlists>");
    var i = 1;
    var a = 1;
    for(i=1; i <= iTunesApp.LibrarySource.Playlists.Count; i++){
        var p = iTunesApp.LibrarySource.Playlists.Item(i);
        if(p.Tracks.Count > 0 && p.Name != "Library" && p.Name != "Podcasts" &&p.Name != "Movies"){
	        echo("<playlist>");
	        echo("<name>"+p.Name+"</name>");
	        echo("<items>");
	        for(a=1; a < p.Tracks.Count+1; a++){
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

Command = WScript.Arguments.Item(0);
WScript.Interactive = true;

switch(Command){
    case 'library':
        getLibrary();
    break;
    case 'playlists':
        getPlaylists();
    break;
}