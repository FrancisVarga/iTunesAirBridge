package com.imlucas.itunesbridge{
	import flash.desktop.NativeProcess;
	import flash.desktop.NativeProcessStartupInfo;
	import flash.events.Event;
	import flash.events.NativeProcessExitEvent;
	import flash.events.ProgressEvent;
	import flash.filesystem.File;
	import flash.system.Capabilities;
	import flash.utils.ByteArray;
	import flash.xml.XMLDocument;
	
	import mx.rpc.xml.SimpleXMLDecoder;
	
	public class iTunesBridge{
		public static var CSCRIPT_PATH:String = "C:/Windows/System32/cscript.exe";
		public static var CSCRIPT_FILE_PATH:String = "C:/Users/lucas/Documents/Downloads/SendAudioTracksToDevice/t.js";
		
		public static var MAC_OPEN_PATH:String = "/usr/bin/open";
		
		private var COMMAND:String;
		
		private var nativeProcess:NativeProcess;
        private var processBuffer:ByteArray;
		
		private var binFile:File;
		private var inputFilePath:String;
		
		private var onComplete:Function;
		
		public function iTunesBridge(){
			
		}
		
		public static function isWin():Boolean{
		    return (Capabilities.os.indexOf("Windows") >= 0);
		}
		
		public static function isMac():Boolean{
			return (Capabilities.os.indexOf("Mac OS") >= 0);
		}
		
		public function getLibrary(onSuccess:Function):void{
			this.COMMAND = "library";
			this.onComplete = onSuccess;
			this.sendCommand(this.COMMAND);
		}
		
		public function getPlaylists(onSuccess:Function):void{
			this.COMMAND = "playlists";
			this.onComplete = onSuccess;
			this.sendCommand(this.COMMAND);
		}
		
		private function sendCommand(command:String):void{
			this.binFile = new File();
			if(isWin()){
				this.binFile.nativePath = CSCRIPT_PATH;
				this.inputFilePath = CSCRIPT_FILE_PATH;
			}
            
			
			var npInfo:NativeProcessStartupInfo = new NativeProcessStartupInfo();
            npInfo.executable = this.binFile;
            var args:Vector.<String> = new Vector.<String>;
            args.push(this.inputFilePath);
            args.push(command);
            npInfo.arguments = args;
            
            this.processBuffer = new ByteArray();
            this.nativeProcess = new NativeProcess();
            this.nativeProcess.addEventListener(ProgressEvent.STANDARD_OUTPUT_DATA, onStandardOutputData);
            this.nativeProcess.addEventListener(NativeProcessExitEvent.EXIT, onStandardOutputClose);
            this.nativeProcess.start(npInfo);
		}
		
		private function onStandardOutputData(e:ProgressEvent):void{
            this.nativeProcess.standardOutput.readBytes(this.processBuffer, this.processBuffer.length);
        }
        
        private function onStandardOutputClose(e:Event):void{
            var output:String = new String(this.processBuffer);
            
            /**
             * CScript will output version info in the first three lines so we remove them.
             */  
            if(isWin()){
	            var outputArray:Array = output.split("\n");
	            outputArray.shift();
	            outputArray.shift();
	            outputArray.shift();
	            output = outputArray.join('');
            }

            var decoder:SimpleXMLDecoder = new SimpleXMLDecoder(true);
            var xmlDoc:XMLDocument = new XMLDocument(output);
            
            var result:Object = decoder.decodeXML(xmlDoc);
            this.onComplete(result);
        }
	}
}