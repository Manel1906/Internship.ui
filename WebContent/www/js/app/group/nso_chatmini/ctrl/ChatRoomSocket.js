define([], function () {
	const PrjSocketController = function (ctr_Chat) {
		var self						= this;
		var pushSocket 					= null;
		var urlConn						= null;
		
		var pr_TIME_REFRESH_LOGIN		= 10*60*1000;
		var pr_setTime_refresh_login	= null;

		var pr_socket_status			= 0;

		var pr_receive                  = false;
		var pr_inVideoCall 				= false;
		var pr_isMaster                 = false;
		var pr_ctr_Chat					= ctr_Chat;

		var webSocketFactory = {
				connectionTries	: 3,
				connect			: function(url) {
					if (pushSocket){
						try{
							pushSocket.close();
							pushSocket 		 = null;
							pr_socket_status = 0;
						}catch(e){}
					}
					
					try {
						pr_socket_status = 1;
						pushSocket 		 = new WebSocket(url);
						
					}catch(e){
						pr_socket_status = 0;
						pushSocket 		 = null;						
					}
					
					if (!pushSocket){
						this.connectionTries--;
						if (this.connectionTries > 0) {
							setTimeout(() => this.connect(url), 2000);
						} else {
							location.reload();
							//throw new Error("Maximum number of connection trials has been reached");
						}

						return;
					}
					
					pushSocket.addEventListener("error", e => {
						// readyState === 3 is CLOSED
						if (e.target.readyState === 3) {
							this.connectionTries--;
							if (this.connectionTries > 0) {
								setTimeout(() => this.connect(url), 2000);
							} else {
								location.reload();
								//throw new Error("Maximum number of connection trials has been reached");
							}

						}
					});
									
					
					pushSocket.onopen 		= function (message) { processOpen		(message); };
					pushSocket.onmessage 	= function (message) { processMessage	(message); };
					pushSocket.onclose 		= function (message) { processClose		(message); };
					pushSocket.onerror 		= function (message) { processError		(message); };

					
					function processOpen(message) {
						console.log(message);
					}
					
					function processMessage(msg) {
						try {
							console.log(msg.data);
							do_lc_req_result_socket(msg.data);//username
						} catch (e) {
							console.log(e);
						}
					}
					function processClose(message) {
						console.log(message);
						if (pr_socket_status == 1){
							setTimeout(webSocketFactory.connect, 10000, urlConn); 
						}
					}
					
					function processError(message) {
						console.log(message);
					}	
				},
		};
		
		const do_gl_initSocket = function(username){
			const urlAPI 		= APP_API_URL + App.path.BASE_URL_API;
			const urlSocket 	= urlAPI.replace("api","chat").replace("http","ws").replace("://", authStr);
			
			try{
				var tok			= req_gl_Security_Token  (App.keys.KEY_STORAGE_CREDENTIAL);
				var salt		= req_gl_Security_Session(App.keys.KEY_STORAGE_CREDENTIAL);
				
				urlConn 		= urlSocket + "/" + username + "/" + tok +"/" + salt;
				webSocketFactory.connect(urlConn);
				
				//---keep ping to alive
				setTimeout(do_lc_keep_Conn, 60000); 
			}catch(e){
				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
				console.log(e);
				return;
			}
			
		}
		
		const do_lc_keep_Conn = function (){
			if (!can_lc_Connexion()) return;
			pushSocket.send("ping");
			setTimeout(do_lc_keep_Conn, 60000); 
		}
		
		// CONNECTING OPEN CLOSING or CLOSED
		const can_lc_Connexion = function (){
			if (pushSocket==null) return false;
			if (pushSocket.readyState === WebSocket.CLOSED || pushSocket.readyState === WebSocket.CLOSING) {
				return false;				
			}
			return true;
		}
		
		
		const can_lc_SendMsg = function (){
			if (pushSocket.readyState === WebSocket.OPEN) {
				return true;				
			}
			return false;
		}
		
		this.can_lc_msg_Out = function (msg, tryCount=0) {
			if (!can_lc_Connexion()){
				return false;
			}
			
//			if (!can_lc_Connexion()){
//				webSocketFactory.connect(urlConn);
//			}
			
//			if (!pushSocket){
//				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
//				return false;
//			}
			
			if (!can_lc_SendMsg()){
				if (tryCount>10) return;
				setTimeout(self.can_lc_msg_Out, 500, msg, tryCount++);
				return false;
			}
			
			pushSocket.send(JSON.stringify(msg));
			return true;
		}
		
		this.do_lc_init_SocketChat = function(username){
			setTimeout(() => {
				do_gl_initSocket(username);
			}, 2000);

			pr_setTime_refresh_login && clearInterval(pr_setTime_refresh_login); // clear interval

			pr_setTime_refresh_login = setInterval(() => { //and reset interval
				do_lc_send_msg_ping();
			}, pr_TIME_REFRESH_LOGIN);
		}
		
		this.do_lc_closeSocket = function(){
			pr_socket_status = 0;
			if (pushSocket) {
				pushSocket.close();
				pushSocket = null;
			}
		}
		
		
		const do_lc_req_result_socket = function(data, username){
			if(!data)		return false;
			const response 	= App.network.req_lc_DecodeUTF8(JSON.parse(data));
			
			
			//-------------------------------------------
				
			switch (response.type) {
			case "MSG_CHAT_USER_ONLINE":
				do_lc_push_list_online(response.payLoad);
				break;
				
			case "MSG_CHAT_MSG_NEW":
				do_lc_push_new_msg(response.payLoad);
				break;
				
			case "MSG_CHAT_MSG_DEL":
				do_lc_push_del_msg(response.grId, response.msgId);
				break;
			//--------------------------------------------------------------
			//--------------------------------------------------------------
				
			case "MSG_CHAT_GROUP_ACCEPT":
				do_lc_push_validate_group(response.payLoad);
				break;
				
			case "MSG_CHAT_GROUP_REFUSE":
				do_lc_push_not_validate_group(response.payLoad);
				break;
				
			//--------------------------------------------------------------
			//--------------------------------------------------------------
			case "VIDEO_CALL_START":
				do_lc_push_new_video_call(response.payLoad);
				break;
			case "VIDEO_CALL_FINISH":
				do_lc_push_finish_video_call(response.payLoad);
				break;
			case "VIDEO_FINISH_VIEWER":
				do_lc_push_finish_video_viewer(response.payLoad);
				break;
			case "MSG_CHAT_START_CALL_CHIME":
				do_lc_push_new_video_call_chime(response.payLoad);
				break;
			case "MSG_CHAT_USER_READ":
				do_lc_push_new_user_read(response.payLoad);
				break;
			//---------------------------------------------------------
			case "MSG_CHAT_RTC_MSG":
				do_lc_handle_RTCMsg(response.payLoad);
				break;			
			//---------------------------------------------------------	

			default:
				break;
			}
		}
		
		const do_lc_push_new_video_call_chime = (msgContent) => {
			App.controller.ChatRoom.ChatWebChime.do_lc_new_video_call(msgContent);
		}
		
		const do_lc_push_new_video_call = (msgContent) => {
			App.controller.ChatRoom.WebRTC.do_lc_new_video_call(msgContent);
		}
		
		const do_lc_push_finish_video_call = (msgContent) => {
			App.controller.ChatRoom.WebRTC.do_lc_finish_video_call(msgContent);
		}
		
		const do_lc_push_finish_video_viewer = (msgContent) => {
			App.controller.ChatRoom.WebRTC.do_lc_finish_video_viewer(msgContent);
		}
		
		const do_lc_push_del_msg = (grpId, msgId) => {
			// if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				pr_ctr_Chat.do_lc_del_msg_socket(grpId, msgId);
			// }
		}
		
		const do_lc_push_new_user_read = (msgContent) => {
			// if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				const msg 	=  App.network.req_lc_DecodeUTF8(JSON.parse(msgContent));
				
				pr_ctr_Chat.do_lc_new_chatroom_user_read(msg.user, msg.idMsg);
			// }
		}
		
		const do_lc_push_new_msg = (msgContent) => {
			//----parse files info if there are----------
			try {
				if (msgContent.files){
					msgContent.files = JSON.parse(msgContent.files).files;
				}
			}catch(e){
				msgContent.files = [];
			}
			
			// if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				pr_ctr_Chat.do_lc_push_msg_socket(msgContent);
			// } else {
			// 	$("#span_new_msg").removeClass("hide");
			// }
		}
		
		const do_lc_push_validate_group = (msgContent) => {
			//----parse files info if there are----------
			
			// if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.MiniChat.Person.do_lc_push_notif_validate_socket(msgContent);
			// } else {
			// 	$("#span_new_msg").removeClass("hide");
			// }
		}
		
		const do_lc_push_not_validate_group = (msgContent) => {
			//----parse files info if there are----------
			
			// if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.MiniChat.Person.do_lc_push_notif_not_validate_socket(msgContent);
			// } else {
			// 	$("#span_new_msg").removeClass("hide");
			// }
		}

		const do_lc_send_msg_ping = () => {
			let msgIn = { name: "MSG_CHAT_PING" };
			self.can_lc_msg_Out(msgIn);
		}
		
		const do_lc_push_list_online = (list) => {
			let lstUserOnline = list.filter(Boolean);
			if(lstUserOnline && lstUserOnline.length){
				lstUserOnline = [...new Set(lstUserOnline)];
				App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE = lstUserOnline;
				App.controller.MiniChat.Person.do_lc_push_new_list_online();
				
				
				pr_ctr_Chat.do_lc_bind_list_online(); // nó k tìm thấy pp.controller.MiniChat.Chat vì mình comment nórồi
			}
			console.log(lstUserOnline);
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------
		//----RTC--------------------------------------------------------------------------------------------------------------------------------------------
		//--step01	: init socket
		//--step02	: init conn point 				: do_lc_rtc_init
		//--step03	: init media device				: do_lc_userMedia_init
		//--step04-1: when call, init offer			: do_lc_rtc_offer
		//--step04-2: when receive call, init answer: do_lc_rtc_answer  ( handle from socket msg)
		
		var pr_myMedia          		= null;
		var pr_myMediaStream    		= null;
		var pr_remoteMedia         		= null;
		var pr_remoteMediaStream    	= null;
		
		var pr_rtc_point				= null;
		var pr_rtc_uId					= null;		
		var pr_rtc_rId					= null;	
		var pr_rtc_candidate			= null;	
		var pr_rtc_existing 			= {};
		const pr_rtc_servers       		= {'iceServers': 
				[{'urls': 'stun:stun.l.google.com:19302'},
				{'urls': 'stun:stun.services.mozilla.com'},  
				{'url': 'stun:stun.acrobits.cz:3478'},              
				{'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'},
		]};
			
		// pc_constraints is not currently used, but the below would allow us to enforce
		// DTLS keying for SRTP rather than SDES ... which is becoming the default soon
		// anyway. 
		const pr_pcConstraints = {
		'optional': [{
			'DtlsSrtpKeyAgreement': true
		}]
		};
		
		// Set up audio and video regardless of what devices are present.
		const pr_sdpConstraints = {
		'mandatory': {
			'OfferToReceiveAudio': true,
			'OfferToReceiveVideo': true
		}
		};
		
		const pr_mediaConstraints = {
		audio: true,
		video: true
		};
		//------------------------------------------------------------------------------    
		//------------------------------------------------------------------------------
		this.do_lc_rtc_init = function (roomId, userId){	
			pr_rtc_existing				= {};
			pr_rtc_uId					= userId;
			pr_rtc_rId					= roomId;
		
		try {
				pr_rtc_point  			= req_gl_RTCPeerConnection(pr_rtc_servers, {optional: [{RtpDataChannels: true}]});
				if (pr_rtc_point){
					pr_rtc_point.onicecandidate = handleIceCandidate;
					pr_rtc_point.onaddstream    = handleRemoteStreamAdded;
					pr_rtc_point.onremovestream = handleRemoteStreamRemoved;
				}
			} catch (e) {
				console.log('Failed to create PeerConnection, exception: ' + e.message);       
				return;
			}				
		}
			
		var handleIceCandidate = function (event){
		if (event.candidate) {
			pr_rtc_candidate = event.candidate;
					do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'typ':'candidate', 'ice': pr_rtc_candidate}})
			/*
			label: event.candidate.sdpMLineIndex,
			id: event.candidate.sdpMid,
			candidate: event.candidate.candidate
			*/
		} else {
			console.log('End of candidates.');      
		}
		}
	
		var handleRemoteStreamAdded = function (event) {
			console.log('----------handleRemoteStreamAdded ');
			
			if (!event.stream) return;
			console.log('Adding remote stream.');
			
			if(!pr_isMaster){
				let m_video = document.createElement("video");  
				m_video.autoplay = true;
				m_video.classList.add("w-100");
				m_video.classList.add("video-principal");
				pr_remoteMedia.appendChild(m_video);
				do_gl_attachMediaStream (m_video, pr_myMediaStream); 
				pr_isMaster = true;
			}
			
			
			var r_video = document.createElement("video");  
			r_video.autoplay = true;
			r_video.classList.add("w-100");
			r_video.classList.add("video-principal");
	//    	r_video.muted = false; 
			pr_remoteMedia.appendChild(r_video);
			
			
			do_gl_attachMediaStream (r_video, event.stream); 
			
			do_gl_attachMediaStream (pr_myMedia, event.stream);
	//    	pr_myMedia.style.position = "absolute";
	//    	pr_myMedia.style.bottom = "0";
	//    	pr_myMedia.style.left = "unset";
	//    	pr_myMedia.style.right = "0";
	//    	pr_myMedia.style.width = "20%";
	//    	pr_myMedia.style.height = "15%";
	//    	pr_myMedia.style.top = "unset";
	//    	pr_myMedia.style.zIndex = "1";
			
			//---create new video in pr_remoteMedia, then push stream to this video		
	//		var videoElement = $("#otherVideo");
	//		pr_remoteMedia.append(videoElement);
	//		do_gl_attachMediaStream (videoElement, event.stream);		 
	//		//pr_remoteMedia.srcObj  = event.stream;		
	//		
	//		pr_remoteMediaStream.push(event.stream);
			
			App.controller.ChatRoom.ChatWebChime_RTC.do_lc_Carousel_Video_Other();
		}
		var handleRemoteStreamRemoved = function(event) {
			console.log('----------handleRemoteStreamRemoved ', event);     
		}
		
		var handleRemoteHangup = function(event) {
			console.log('----------handleRemoteHangup ', event);     
		}
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		
		this.do_lc_rtc_offer = function (){	
			console.log('----------doOffer '); 
			pr_rtc_point.createOffer(setLocalAndSendOffer, handleCreateOfferError);	  
		}
	
		this.do_lc_rtc_answer = function (){
			console.log('----------doAnswer '); 
			pr_rtc_point.createAnswer(setLocalAndSendAnswer, handleCreateAnswerError, pr_sdpConstraints);		
		}
		
		this.do_lc_rtc_close = function (){
			console.log('----------doClose '); 
			pr_rtc_point.close();
			pr_rtc_point.onicecandidate = null; 
			pr_rtc_point.onaddstream = null; 
			
			
			do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'typ':'bye'}});
			
			pr_inVideoCall = false;
			
//			pr_ctr_ChatWebChime_RTC.do_lc_hide_chat();
//			App.controller.ChatRoom.Chat.do_lc_init_call_rtc();
		}

		var handleCreateOfferError = function(event) {
			console.log('createOffer() error: ', e);
		}   

		var handleCreateAnswerError = function (error) {
			console.log('createAnswer() error: ', e);
		}
	
		var setLocalAndSendOffer = function (sessionDescription) {
			// Set Opus as the preferred codec in SDP if Opus is present.
			sessionDescription.sdp = req_gl_preferOpus (sessionDescription.sdp);
			pr_rtc_point.setLocalDescription(sessionDescription);
		
			do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'typ':'offer', 'sdp': sessionDescription}});     
		}   

		var setLocalAndSendAnswer = function (sessionDescription) {
			// Set Opus as the preferred codec in SDP if Opus is present.
			sessionDescription.sdp = req_gl_preferOpus (sessionDescription.sdp);
			pr_rtc_point.setLocalDescription(sessionDescription);
		
			do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'typ':'answer', 'sdp': sessionDescription}});     
		}   	

		//-----------------------------------------------------------------------------
		const do_lc_sendMsg = (msg) => {
			self.can_lc_msg_Out(msg);
		}
			
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------
		
		this.do_lc_userMedia_init = function (myMedia, remoteMedia){				
			pr_myMedia 		= myMedia;
			pr_remoteMedia	= remoteMedia; // pr_remoteMedia is div contain many video to show multi remoteVideo
					
			do_gl_getUserMedia (pr_mediaConstraints, handleUserMedia, handleUserMediaError);			
		}
				
		var handleUserMedia = function (stream) {
		if (!stream) return;
		
		console.log('Adding local stream.');
		do_gl_attachMediaStream (pr_myMedia, stream);
		//pr_myMedia.srcObject   = stream;
		
		pr_myMediaStream       = stream;
		
		if (pr_rtc_point) pr_rtc_point.addStream(stream);
		}
		

		var handleUserMediaError = function (error) {
			console.log('navigator.getUserMedia error: ', error);
		}
			
		//----------------------------------------------------------------------------------------------------------------------------------------------------
		var do_lc_handle_RTCMsg= function (msg) {
			if (!pr_rtc_point) 	return; 
			if (!pr_myMedia && msg.typ !== 'offer' ) 	return; 
			
			var uId 	= msg.uId;
			var rId 	= msg.rId;
			if (uId == pr_rtc_uId || rId != pr_rtc_rId) return;
			
			if (msg.typ === 'candidate') {
				var candidate = req_gl_IceCandidate({
				sdpMLineIndex	: msg.ice.sdpMLineIndex,
				candidate		: msg.ice.candidate
				});
				pr_rtc_point.addIceCandidate(candidate);
				
			
			} else if (msg.typ === 'offer' && pr_rtc_point) {  
				
				if (pr_inVideoCall){
					//---  đã ở trong cuộc gọi rồi, trả lại thông tin kết nối cho bên kia
					self.do_lc_show_answer(pr_rtc_point, msg);
				} else {
					//---  hien thị msgbox hỏi có muốn tham gia không, không muốn thì bỏ qua, nếu muốn thì gọi do_lc_show_answer
					//---  nhu vay, neu room co nhieu người, mỗi lần có người tham gia thì msg này sẽ hiện lên bên người chưa tham gia
					pr_ctr_ChatWebChime_RTC.do_lc_show_popup_new_call(pr_rtc_point, msg);
				}
			
			} else if (msg.typ === 'answer' && pr_rtc_point) {
	//			pr_myMedia.muted = false
				pr_ctr_ChatWebChime_RTC.do_lc_stop_sound_call();
				pr_rtc_point.setRemoteDescription(req_gl_SessionDescription(msg.sdp));  
				
				//--- xem lại chỗ này
				pr_ctr_ChatWebChime_RTC.do_lc_clear_timeout_master();
				pr_ctr_ChatWebChime_RTC.do_lc_clear_timeout_viewer();
				
				pr_inVideoCall = true; //-- nhận được answer và tham gia vào => nhớ set false khi out
				
			} else if (msg.typ === 'bye' && pr_rtc_point.connectionState === 'connected') {
				//handleRemoteHangup();
				App.controller.ChatRoom.Socket.do_lc_rtc_close();
			}
		}
		
		this.do_lc_show_answer = (pr_rtc_point, msg) => {
			pr_ctr_ChatWebChime_RTC.do_lc_stop_sound_receive();
			pr_ctr_ChatWebChime_RTC.do_lc_show_chat('answer');
			pr_rtc_point.setRemoteDescription(req_gl_SessionDescription(msg.sdp));
			self.do_lc_rtc_answer();
			
			pr_inVideoCall = true; //--chap nhan tham gia vao video call
		}
		
		var do_lc_push_new_RTC_Resp = function (data) {
				var ice 	= data.ice;		
				var sdp 	= data.sdp;	
				var uId 	= data.uId;
				var rId 	= data.rId;
				
				if (uId != pr_rtc_uId && rId == pr_rtc_rId) {
					if (pr_rtc_existing[uId]) return;
					
					if (ice != undefined){
						pr_rtc_point .addIceCandidate(req_gl_IceCandidate(ice));
						pr_rtc_existing[uId] = true;
			
						do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'ice': pr_rtc_candidate}});
						
						
					} else if (sdp != undefined){
						if (sdp.type == "offer")
							pr_rtc_point 	.setRemoteDescription(new RTCSessionDescription(sdp))
											.then(() 		=> pr_rtc_point.createAnswer())
											.then(answer 	=> pr_rtc_point.setLocalDescription(answer))
											.then(() 		=> do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'sdp': pr_rtc_point.localDescription}}));
						else if (sdp.type == "answer")
							pr_rtc_point 	.setRemoteDescription(new RTCSessionDescription(sdp));
					}
				}
		};
			
		var do_lc_push_new_RTC_Video = function (data) {
				var uId 	= data.uId;
				var rId 	= data.rId;
				
				if (uId != pr_rtc_uId && rId == pr_rtc_rId) {
					//---add div video of friend and show
					var frVideo = null; //--do someThing
					//do_lc_rtc_stream_fromFriend (frVideo);
					
					App.controller.ChatRoom.VideoRTC.do_lc_new_video_call(data);
				}
		}
		
		this.do_lc_Exit_VideoChat = function (){
			pr_inVideoCall = false;    	
			do_gl_stopMediaStream (pr_myMedia);

			if (pr_rtc_point) pr_rtc_point.removeStream(pr_myMediaStream);
			pr_myMediaStream       = null;
			pr_inVideoCall 		   = false;
//			App.controller.ChatRoom.Chat.do_lc_init_call_rtc();
		}
	};

	return PrjSocketController;
});