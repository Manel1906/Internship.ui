var RTCPeerConnection         = null;
var webrtcDetectedBrowser     = null;
var webrtcDetectedVersion     = null;

var do_gl_getUserMedia        = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var do_gl_attachMediaStream   = null;
var do_gl_reattachMediaStream = null;
var do_gl_createIceServer     = null;
var can_be_Firefox			  = false;

if (navigator.mozGetUserMedia) {
	console.log("This appears to be Firefox");
	can_be_Firefox 		  = true;
	webrtcDetectedBrowser = "firefox";
	webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);

	// The RTCPeerConnection object.
	RTCPeerConnection = mozRTCPeerConnection;

	// The RTCSessionDescription object.
	RTCSessionDescription = mozRTCSessionDescription;

	// The RTCIceCandidate object.
	RTCIceCandidate = mozRTCIceCandidate;

	// Get UserMedia (only difference is the prefix).
	do_gl_getUserMedia = navigator.mozGetUserMedia.bind(navigator);

	// Creates iceServer from the url for FF.
	do_gl_createIceServer = function(url, username, password) {
		var iceServer = null;
		var url_parts = url.split(':');
		if (url_parts[0].indexOf('stun') === 0) {
		  // Create iceServer with stun url.
		  iceServer = { 'url': url };
		} else if (url_parts[0].indexOf('turn') === 0 &&
				   (url.indexOf('transport=udp') !== -1 ||
					url.indexOf('?transport') === -1)) {
		  // Create iceServer with turn url.
		  // Ignore the transport parameter from TURN url.
		  var turn_url_parts = url.split("?");
		  iceServer = { 'url': turn_url_parts[0],
						'credential': password,
						'username': username };
		}
		return iceServer;
	};

	// Attach a media stream to an element.
	do_gl_attachMediaStream = function(element, stream) {
		console.log("Attaching media stream");
		element.mozSrcObject = stream;
		element.play();
	};

	do_gl_reattachMediaStream = function(to, from) {
		console.log("Reattaching media stream");
		to.mozSrcObject = from.mozSrcObject;
		to.play();
	};

	do_gl_stopMediaStream = function(element) {
		console.log("Stop media stream");
		element.stop();
	};
	
	// Fake get{Video,Audio}Tracks
	MediaStream.prototype.getVideoTracks = function() {
		return [];
	};

	MediaStream.prototype.getAudioTracks = function() {
		return [];
	};

} else if (navigator.webkitGetUserMedia) {
	console.log("This appears to be Chrome");

	webrtcDetectedBrowser = "chrome";
	webrtcDetectedVersion =  parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);

 
	// Creates iceServer from the url for Chrome.
	do_gl_createIceServer = function(url, username, password) {
		var iceServer = null;
		var url_parts = url.split(':');
		if (url_parts[0].indexOf('stun') === 0) {
		  // Create iceServer with stun url.
		  iceServer = { 'url': url };
		} else if (url_parts[0].indexOf('turn') === 0) {
			if (webrtcDetectedVersion < 28) {
				// For pre-M28 chrome versions use old TURN format.
				var url_turn_parts = url.split("turn:");
				iceServer = { 'url': 'turn:' + username + '@' + url_turn_parts[1],
						  'credential': password };
			} else {
				// For Chrome M28 & above use new TURN format.
				iceServer = { 'url': url,
						  'credential': password,
						  'username': username };
			}
		}
		return iceServer;
	};

	// The RTCPeerConnection object.
	RTCPeerConnection = webkitRTCPeerConnection;

	// Get UserMedia (only difference is the prefix).
	do_gl_getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

	// Attach a media stream to an element.
	do_gl_attachMediaStream = function(element, stream) {
		if (typeof element.srcObject !== 'undefined') {
		  element.srcObject = stream;
		} else if (typeof element.mozSrcObject !== 'undefined') {
		  element.mozSrcObject = stream;
		} else if (typeof element.src !== 'undefined') {
		  element.src = URL.createObjectURL(stream);
		} else {
		  console.log('Error attaching stream to element.');
		}
	};

	do_gl_reattachMediaStream = function(to, from) {
		to.src = from.src;
	};
	
	do_gl_stopMediaStream = function(element) {
		if (typeof element.srcObject !== 'undefined') {
			element.srcObject = null;
		} else if (typeof element.mozSrcObject !== 'undefined') {
			element.mozSrcObject = null;
		} else if (typeof element.src !== 'undefined') {
			element.src = null;
		} else {
			console.log('Error attaching stream to element.');
		}
	};

	// The representation of tracks in a stream is changed in M26.
	// Unify them for earlier Chrome versions in the coexisting period.
	if (!webkitMediaStream.prototype.getVideoTracks) {
		webkitMediaStream.prototype.getVideoTracks = function() {
			return this.videoTracks;
		};
		webkitMediaStream.prototype.getAudioTracks = function() {
		  return this.audioTracks;
		};
	}

	// New syntax of getXXXStreams method in M26.
	if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
		webkitRTCPeerConnection.prototype.getLocalStreams = function() {
			return this.localStreams;
		};
		webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
		return this.remoteStreams;
		};
	}

} else {
  console.log("Browser does not appear to be WebRTC-capable");
}

var req_gl_RTCPeerConnection = function(params) {
  if(can_be_Firefox){
    return new mozRTCPeerConnection(params);
  } else{
    try{
       return new webkitRTCPeerConnection(params);
    }catch(e){
      return new RTCPeerConnection(params);
    }
   
  }
}
var req_gl_SessionDescription= function(message) {
  if(can_be_Firefox){
    return new mozRTCSessionDescription(message);
  }else{
    return new RTCSessionDescription(message);
  }
}

var req_gl_IceCandidate= function(params) {
  if(can_be_Firefox){
    return new mozRTCIceCandidate(params);
  }else{
    return new RTCIceCandidate(params);
  }
}
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
// Set Opus as the default audio codec if it's present.
var req_gl_preferOpus = function (sdp) {
    var sdpLines 	= sdp.split('\r\n');
    var mLineIndex 	= null;
      
	// Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
          mLineIndex = i;
          break;
        }
    }
    if (mLineIndex ===null) {
        return sdp;
    }

    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('opus/48000') !== -1) {
          var opusPayload = req_gl_extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
          if (opusPayload) {
            sdpLines[mLineIndex] = req_gl_setDefaultCodec(sdpLines[mLineIndex], opusPayload);
          }
          break;
        }
    }

    // Remove CN in m line and sdp.
    sdpLines = req_gl_removeCN(sdpLines, mLineIndex);

    sdp = sdpLines.join('\r\n');
    return sdp;
}

var req_gl_extractSdp = function(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
}

    // Set the selected codec to the first in m line.
var req_gl_setDefaultCodec = function(mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
		if (index === 3) { // Format of media staarts from the fourth.
          newLine[index++] = payload; // Put target payload to the first.
        }
        if (elements[i] !== payload) {
          newLine[index++] = elements[i];
        }
    }
    return newLine.join(' ');
}

    // Strip CN from sdp before CN constraints is ready.
var req_gl_removeCN = function(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    
	// Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length - 1; i >= 0; i--) {
        var payload = req_gl_extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
        if (payload) {
          var cnPos = mLineElements.indexOf(payload);
          if (cnPos !== -1) {
            // Remove CN payload from m line.
            mLineElements.splice(cnPos, 1);
          }
          // Remove CN line in sdp
          sdpLines.splice(i, 1);
        }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
}