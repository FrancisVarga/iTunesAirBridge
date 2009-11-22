# iTunesAirBridge

## About
Uses the Adobe Air 2.0 Beta NativeProcess API to interact with iTunes.

This example app simply mimicks the iTunes interface and imports your entire 
library and all of your playlists and allows you to do simple playback.

All playack is handled by [Playdar](http://playdar.org).

The actual scripting to talk to iTunes is done in VBScript (and soon AppleScript).  
Choose to go this route as it makes it super simple for anyone to add their own
call and fiddle with things, as opposed to having to compile their own C code. 

## Requirements
 - Windows only (for right now)
 - [Adobe Air 2.0 Beta](http://labs.adobe.com/downloads/air2.html)
 - [Playdar](http://playdar.org) installed, scanned, and running
 - You have to build it youself in Flex Builder to try it
 
## TODO 
 - Applescript to talk iTunes on Mac
 
## Screenshots

![Hey, theres all my stuff from iTunes](http://github.com/imlucas/iTunesAirBridge/raw/master/src/screenshots/iTunesAirBridge-screen-1.png)

![Playdar resolving the next track](http://github.com/imlucas/iTunesAirBridge/raw/master/src/screenshots/iTunesAirBridge-screen-all-your-content-belong-to-us.png)