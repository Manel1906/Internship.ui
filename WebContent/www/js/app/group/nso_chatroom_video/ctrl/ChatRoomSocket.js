define(['jquery'], function($) {
	const PrjSocketController = function () {
		var self						= this;
		var pushSocket 					= null;
		var urlConn						= null;

		var pr_socket_status			= 0;

		var pr_receive                  = false;
		var pr_inVideoCall 				= false;
		var pr_isMaster                 = false;
		var pr_keepConn					= null;
		
		const TIME_SLEEP_60S            = 60000;
		const TIME_SLEEP_10S            = 10000;
		const TIME_SLEEP_05S            =  5000;
		
		const NUM_OF_TRIES            	=  3;
		
		var webSocketFactory = {
				connectionTries	: NUM_OF_TRIES,
				connect			: function(url) {
					if (pushSocket){
						try{
							pushSocket.close();
							pushSocket 		 = null;
							pr_socket_status = 0;
						}catch(e){
							if (!APP_ENV) console.log(ev);
						}
					}

					try {
						webSocketFactory.connectionTries--;
						if (webSocketFactory.connectionTries < 0) {
							do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose') + " URL: " + url);
							return;
						}
						
						pr_socket_status 		= 1;
						pushSocket 		 		= new WebSocket(url);

						pushSocket.onopen 		= function (ev) { processOpen		(ev); };
						pushSocket.onclose 		= function (ev) { processClose		(ev); };
						pushSocket.onerror 		= function (ev) { processError		(ev); };
						pushSocket.onmessage 	= function (ev) { processMessage	(ev); };

						//------------------------------------------------------------------
						function processMessage(ev) {
							try {
								if (!APP_ENV) console.log(ev.data);
								do_lc_req_result_socket(ev.data);//username
							} catch (e) {
								console.log(e);
							}
						}
						
						function processOpen(ev) {
							if (!APP_ENV) console.log(ev);
						}

						function processClose(ev) {
							if (!APP_ENV) console.log(ev);
						}

						function processError(ev) {
							if (!APP_ENV) console.log(ev);
							
							if (ev.target.readyState === WebSocket.CLOSED|| ev.target.readyState === WebSocket.CLOSING){
								if (pr_socket_status == 1){
									setTimeout(do_lc_initSocket, TIME_SLEEP_05S); 
								}
							}
						}	
						
					}catch(e){
						pr_socket_status = 0;
						pushSocket 		 = null;		
						
						setTimeout(webSocketFactory.connect, TIME_SLEEP_10S, urlConn); 
					}
				},
		};
		
		//----------------------------------------------------------------
		//----------------------------------------------------------------
		this.do_lc_init = function(){
			pr_ctr_Login = App.controller.Login;
			do_lc_initSocket();
		}

		this.do_lc_close = function(){
			pr_socket_status = 0;
			if (pushSocket) {
				pushSocket.close();
				pushSocket = null;
			}
		}
		
		this.can_lc_msg_Out = function (msg, tryCount=-1) {
			if (!can_lc_Connexion()){
				return false;
			}

			if (!can_lc_SendMsg()){
				if (tryCount<0){
					//---something wrong --- init socket
					self.do_lc_init();
					return false;
				}
				setTimeout(self.can_lc_msg_Out, 500, msg, tryCount--);
				return false;
			}

			try{
				pushSocket.send(JSON.stringify(msg));
				return true;
			}catch(e){
				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
				return false;
			}
		}
		//----------------------------------------------------------------
		const do_lc_initSocket = function(){
			try{
				const getUsernameAndToken 	= function() {
		            const username 			= req_gl_LS_Username		(App.keys.KEY_STORAGE_CREDENTIAL);
		            const tok 				= req_gl_LS_SecurityToken	(App.keys.KEY_STORAGE_CREDENTIAL);
		            return { username, tok };
		        }
				let { username, tok } = getUsernameAndToken();
				
				//------------------------------------------------------------------------------
				//Kiểm tra username vs token null
				if (!username||!tok) {
					({ username, tok } = getUsernameAndToken());
					if (!username||!tok) {
						pr_ctr_Login.do_lc_show();
						return;
					}
				}
				
				//------------------------------------------------------------------------------
				//Kiểm tra token hết hạn hay không
				const isTokenExpired 	= function(token) {
					const payload 		= JSON.parse(atob(token.split('.')[1]));
					const expiry 		= payload.exp * 1000;
					return Date.now() > expiry;
				}
				if (isTokenExpired(tok)) {
					pr_ctr_Login.do_lc_show();
					return;
				}
				
				//------------------------------------------------------------------------------
				var 	urlAPI 		= App.path.BASE_URL_API_CHAT;
				var 	urlSocket 	= urlAPI.replace("http","ws");
				var 	urlConn 	= urlSocket + "/" + username + "/" + tok +"/";
				
				webSocketFactory.connectionTries = NUM_OF_TRIES;
				webSocketFactory.connect(urlConn);
				
				//---keep ping to alive
				if (pr_keepConn) clearTimeout(pr_keepConn);
				pr_keepConn = setTimeout(do_lc_keep_Conn, TIME_SLEEP_60S);

			}catch(e){
				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
				console.log(e);
				
				App.router.controller.do_lc_run("VI_MAIN/prj_chatroom", "view_prj_chat_room.html");
				return;
			}
		}
		
		const do_lc_keep_Conn = function (){
			if (!can_lc_Connexion()){
				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
				return;
			}
			try{
				pushSocket.send("ping");
				pr_keepConn = setTimeout(do_lc_keep_Conn, TIME_SLEEP_60S); 
			}catch(e){
				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
				console.log(e);
				
//				self.do_gl_closeSocket();
				
				App.router.controller.do_lc_run("VI_MAIN/prj_chatroom", "view_prj_chat_room.html");
			}
			
		}
		
		// stat of socket: CONNECTING OPEN CLOSING or CLOSED
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
			
			case "MSG_CHAT_USER_READ":
				do_lc_push_new_user_read(response);
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
			// App.controller.ChatRoom.ChatWebChime.do_lc_new_video_call(msgContent);
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
			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Chat.do_lc_del_msg_socket(grpId, msgId);
			}
		}

		const do_lc_push_new_user_read = (msg) => {
			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Chat.do_lc_new_chatroom_user_read(msg.uId, msg.msgId);
			}
		}

		const do_lc_push_new_msg = (msgContent) => {
			//----parse files info if there are----------
			try {
				if (msgContent.inf05){
					msgContent.inf05 = JSON.parse(msgContent.inf05);
				}
			}catch(e){
				msgContent.inf05 = null;
			}

			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Chat.do_lc_push_msg_socket(msgContent);
			} else {
				$("#span_new_msg").removeClass("hide");
			}
		}

		const do_lc_push_validate_group = (msgContent) => {
			//----parse files info if there are----------

			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Group.do_lc_push_notif_validate_socket(msgContent);
			} else {
				$("#span_new_msg").removeClass("hide");
			}
		}

		const do_lc_push_not_validate_group = (msgContent) => {
			//----parse files info if there are----------

			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Group.do_lc_push_notif_not_validate_socket(msgContent);
			} else {
				$("#span_new_msg").removeClass("hide");
			}
		}


		const do_lc_push_list_online = (list) => {
			let lstUserOnline = list.filter(Boolean);
			if(lstUserOnline && lstUserOnline.length){
				lstUserOnline = [...new Set(lstUserOnline)];
				App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE = lstUserOnline;
				App.controller.ChatRoom.Group.do_lc_push_new_list_online();
				App.controller.ChatRoom.Chat.do_lc_bind_list_online();
			}
			if (!APP_ENV) console.log(lstUserOnline);
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

		var pr_rtc_point				= {};
		var pr_rtc_uId					= App.data.user.id;	
		var pr_rtc_rId					= null;
		var pr_rtc_cur_uId				= null;
		var pr_rtc_candidate			= {};	
		var pr_rtc_existing 			= {};
		
		var pr_rtc_servers = {
				'iceServers': [
					{ urls: "stun:stun.l.google.com:19302" },
				    { urls: "stun:stun.l.google.com:5349" },
				    { urls: "stun:stun1.l.google.com:3478" },
				    { urls: "stun:stun1.l.google.com:5349" },
				    { urls: "stun:stun2.l.google.com:19302" },
				    { urls: "stun:stun2.l.google.com:5349" },
				    { urls: "stun:stun3.l.google.com:3478" },
				    { urls: "stun:stun3.l.google.com:5349" },
				    { urls: "stun:stun4.l.google.com:19302" },
				    { urls: "stun:stun4.l.google.com:5349" },
//					{
//			            urls		: 'turn:openrelay.metered.ca:80',
//			            username	: 'openrelayproject',
//			            credentials	: 'openrelayproject'
//			        },
//					{
//						urls		: 'turn:192.158.29.39:3478?transport=udp',
//						credential	: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//						username	: '28224511:1379330808'
//					},
//					{
//						urls		: 'turn:192.158.29.39:3478?transport=tcp',
//						credential	: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//						username	: '28224511:1379330808'
//					}
					]
		};
		
		/*
		const pr_rtc_servers       		= {
				iceServers: 
					[{'urls': 'stun:stun.l.google.com:19302'},
						{'urls': 'stun:stun.services.mozilla.com'},  
						{'url': 'stun:stun.acrobits.cz:3478'},              
						{'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}],
						iceCandidatePoolSize: 10
		};
		const servers = {
				iceServers: [
					{
						urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun.services.mozilla.com', 'stun:stun.acrobits.cz:3478'],
					},
					],
					iceCandidatePoolSize: 10,
		};*/

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
		this.do_lc_rtc_init = function (roomId){
			const lstMem 	= Object.values(App.data.lstGrpMember)	
			pr_rtc_rId 		= roomId
			try {
				if(!lstMem) return;

				lstMem.forEach(m => {
					if(!m.uId || m.uId === App.data.user.id) return

					const userId = m.uId
					pr_rtc_point[userId] = {
							uId	: userId,
							rId	: roomId,
							pc	: req_gl_RTCPeerConnection(pr_rtc_servers, {optional: [{RtpDataChannels: true}]})
					};
					if (pr_rtc_point[userId].pc){
						pr_rtc_point[userId].pc.onicecandidate = do_lc_handleIceCandidate(userId, handleIceCandidate);
						pr_rtc_point[userId].pc.onaddstream    = handleRemoteStreamAdded;
						pr_rtc_point[userId].pc.onremovestream = handleRemoteStreamRemoved;
					}
				})
			} catch (e) {
				console.log('Failed to create PeerConnection, exception: ' + e.message);
				return;
			}				
		}

		const do_lc_handleIceCandidate = (userId, handleIceCandidate) => {
			return (event) => handleIceCandidate(userId, event)
		}

		var handleIceCandidate = function (userId, event){
			if (event.candidate) {
				pr_rtc_point[userId].pc.candidate = event.candidate;
				do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_point[userId].rId, 'uId' : pr_rtc_uId, "uReceiveId": userId, 'typ':'candidate', 'ice': pr_rtc_point[userId].pc.candidate}})
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

			// if(!pr_isMaster){
			// 	let m_video = document.createElement("video");  
			// 	m_video.autoplay = true;
			// 	m_video.classList.add("w-100");
			// 	m_video.classList.add("video-principal");
			// 	pr_remoteMedia.appendChild(m_video);
			// 	do_gl_attachMediaStream (m_video, pr_myMediaStream); 
			// 	pr_isMaster = true;
			// }


			var r_video = document.createElement("video");  
			r_video.autoplay = true;
			r_video.classList.add("w-100");
			r_video.classList.add("video-principal");
			//    	r_video.muted = false; 
			pr_remoteMedia.appendChild(r_video);
			do_gl_attachMediaStream (r_video, event.stream); 

			// do_gl_attachMediaStream (pr_myMedia, event.stream);
			// pr_myMedia.style.position = "absolute";
			// pr_myMedia.style.bottom = "0";
			// pr_myMedia.style.left = "unset";
			// pr_myMedia.style.right = "0";
			// pr_myMedia.style.width = "20%";
			// pr_myMedia.style.height = "15%";
			// pr_myMedia.style.top = "unset";
			// pr_myMedia.style.zIndex = "1";

			//---create new video in pr_remoteMedia, then push stream to this video		
			// var videoElement = $("#otherVideo");
			// pr_remoteMedia.append(videoElement);
			// do_gl_attachMediaStream (videoElement, event.stream);		 
			//pr_remoteMedia.srcObj  = event.stream;		

			// pr_remoteMediaStream.push(event.stream);

			// App.controller.ChatRoom.ChatWebChime_RTC.do_lc_Carousel_Video_Other();
			if(pr_inVideoCall) {
				$("#div_video_call").removeClass("d-none")
				$("#div_chat_all").removeClass("d-lg-flex")
				$("#div_chat_all").addClass("d-none")
			}
		}
		var handleRemoteStreamRemoved = function(event) {
			console.log('----------handleRemoteStreamRemoved ', event);     
		}

		var handleRemoteHangup = function(event) {
			console.log('----------handleRemoteHangup ', event);     
		}
		//------------------------------------------------------------------------------
		//------------------------------------------------------------------------------

		const do_lc_setLocalAndSendOffer = (userId, setLocalAndSendOffer) => {
			return (sessionDescription) => {
				setLocalAndSendOffer(userId, sessionDescription)
			}
		}

		this.do_lc_rtc_offer = function (userId){	
			console.log('----------doOffer '); 
			pr_rtc_existing[userId] = true;
			pr_rtc_point[userId].pc.createOffer(do_lc_setLocalAndSendOffer(userId, setLocalAndSendOffer), handleCreateOfferError);	  
		}

		const do_lc_rtc_offer_remaining = function() {
			const lstMem 	= Object.values(App.data.lstGrpMember)	
			if(!lstMem) return;

			lstMem.forEach(m => {
				if(pr_rtc_existing[m.uId] || !m.uId || m.uId === App.data.user.id) return
				self.do_lc_rtc_offer(m.uId)
			})
		}

		const do_lc_setLocalAndSendAnswer = (userId, setLocalAndSendAnswer) => {
			return (sessionDescription) => {
				setLocalAndSendAnswer(userId, sessionDescription)
			} 
		}

		this.do_lc_rtc_answer = function (userId){
			console.log('----------doAnswer '); 
			pr_rtc_existing[userId] = true;
			pr_rtc_point[userId].pc.createAnswer(do_lc_setLocalAndSendAnswer(userId, setLocalAndSendAnswer), handleCreateAnswerError, pr_sdpConstraints);
			do_lc_rtc_offer_remaining()	
		}

		this.do_lc_rtc_close = function (){
			console.log('----------doClose '); 
			pr_rtc_point.close();
			pr_rtc_point.onicecandidate = null; 
			pr_rtc_point.onaddstream = null; 


			do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'typ':'bye'}});

			pr_inVideoCall = false;

			// pr_ctr_ChatWebChime_RTC.do_lc_hide_chat();
//			App.controller.ChatRoom.Chat.do_lc_init_call_rtc();
		}

		var handleCreateOfferError = function(event) {
			console.log('createOffer() error: ', e);
		}   

		var handleCreateAnswerError = function (error) {
			console.log('createAnswer() error: ', error);
		}

		var setLocalAndSendOffer = async function (userId, sessionDescription) {
			// Set Opus as the preferred codec in SDP if Opus is present.
			sessionDescription.sdp = req_gl_preferOpus (sessionDescription.sdp);
			await pr_rtc_point[userId].pc.setLocalDescription(sessionDescription);

			do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'uReceiveId': userId, 'typ':'offer', 'sdp': sessionDescription}});     
		}   

		var setLocalAndSendAnswer = async function (userId, sessionDescription) {
			// Set Opus as the preferred codec in SDP if Opus is present.
			sessionDescription.sdp = req_gl_preferOpus (sessionDescription.sdp);
			await pr_rtc_point[userId].pc.setLocalDescription(sessionDescription);

			do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'uReceiveId': userId, 'typ':'answer', 'sdp': sessionDescription}});     
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

			const lstMem 	= Object.values(App.data.lstGrpMember)	
			if(!lstMem) return;

			lstMem.forEach(m => {
				if(!m.uId || m.uId === App.data.user.id) return

				if (pr_rtc_point[m.uId]) pr_rtc_point[m.uId].pc.addStream(stream);
			})
		}


		var handleUserMediaError = function (error) {
			console.log('navigator.getUserMedia error: ', error);
		}

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		var do_lc_handle_RTCMsg= async function (msg) {
			var uId 	= msg.uId;
			var rId 	= msg.rId;

			if (!pr_rtc_point[uId]) 	return; 
			if (!pr_myMedia && msg.typ !== 'offer' ) 	return; 
			if (uId == pr_rtc_uId || rId != pr_rtc_rId) return;

			if (msg.typ === 'candidate') {
				var candidate = req_gl_IceCandidate({
					sdpMLineIndex	: msg.ice.sdpMLineIndex,
					candidate		: msg.ice.candidate
				});

				if(pr_rtc_point[uId].pc.signalingState !== 'stable') await pr_rtc_point[uId].pc.addIceCandidate(candidate);
			} else if (msg.typ === 'offer') {  
				if (pr_inVideoCall){
					//---  đã ở trong cuộc gọi rồi, trả lại thông tin kết nối cho bên kia
					self.do_lc_show_answer(uId, msg);
				} else {
					//---  hien thị msgbox hỏi có muốn tham gia không, không muốn thì bỏ qua, nếu muốn thì gọi do_lc_show_answer
					//---  nhu vay, neu room co nhieu người, mỗi lần có người tham gia thì msg này sẽ hiện lên bên người chưa tham gia
					// pr_ctr_ChatWebChime_RTC.do_lc_show_popup_new_call(pr_rtc_point[uId], msg);
					// pr_rtc_cur_point = pr_rtc_point[uId]
					App.controller.ChatRoom.WebRTC.do_lc_show_popup_new_call(uId, msg);
				}
			} else if (msg.typ === 'answer') {
				//			pr_myMedia.muted = false
				// pr_ctr_ChatWebChime_RTC.do_lc_stop_sound_call();
				if(pr_rtc_point[uId]) {
					await pr_rtc_point[uId].pc.setRemoteDescription(req_gl_SessionDescription(msg.sdp));
				}

				//--- xem lại chỗ này
				// pr_ctr_ChatWebChime_RTC.do_lc_clear_timeout_master();
				// pr_ctr_ChatWebChime_RTC.do_lc_clear_timeout_viewer();

				pr_inVideoCall = true; //-- nhận được answer và tham gia vào => nhớ set false khi out
				// do_lc_push_new_RTC_Resp(msg)
			} else if (msg.typ === 'bye' && pr_rtc_point[uId].pc.connectionState === 'connected') {
				//handleRemoteHangup();
				App.controller.ChatRoom.Socket.do_lc_rtc_close();
			}
		}

		this.do_lc_show_answer = async (userId, msg) => {
			// ctr_ChatWebChime_RTC.do_lc_stop_sound_receive();
			// ctr_ChatWebChime_RTC.do_lc_show_chat('answer');
			await pr_rtc_point[userId].pc.setRemoteDescription(req_gl_SessionDescription(msg.sdp));
			self.do_lc_rtc_answer(userId);

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
					pr_rtc_point[uId].pc.addIceCandidate(req_gl_IceCandidate(ice));
					pr_rtc_existing[uId] = true;

					do_lc_sendMsg({'name': 'MSG_CHAT_RTC_MSG', 'val': {'rId': pr_rtc_rId, 'uId' : pr_rtc_uId, 'uReceiveId': uId, 'ice': pr_rtc_candidate}});


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