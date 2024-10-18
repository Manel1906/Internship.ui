define(['jquery'], function($) {
	const PrjSocketController = function () {
		var self						= this;
		var pushSocket 					= null;
		var urlConn						= null;

		var pr_socket_status			= 0;
		var pr_socket_time				= 0;

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
					
					var now = (new Date()).getTime();
					if (now - pr_socket_time<15*1000) return;//time to connect to WS
					
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
						pr_socket_time			= now;

						pushSocket.onopen 		= function (ev) { processOpen		(ev); };
						pushSocket.onclose 		= function (ev) { processClose		(ev); };
						pushSocket.onerror 		= function (ev) { processError		(ev); };
						pushSocket.onmessage 	= function (ev) { processMessage	(ev); };

						//------------------------------------------------------------------
						function processMessage(ev) {
							try {
								if (!APP_ENV) console.log(ev.data);
								do_lc_msg_In(ev.data);//username
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
		this.can_lc_online = function(){
			return can_lc_Connexion();
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


		const do_lc_msg_In = function(data, username){
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
			case "VIDEO_CALL_START"		: //---tell to every one I begin the video session
			case "VIDEO_CALL_SIGNAL"	: //---receive signal from offer and create a peer to receive stream
			case "VIDEO_CALL_SEND"		: //---The offer is ready 
			case "VIDEO_CALL_END"		: //---I'm out
				App.controller.ChatRoom.WebRTC.do_lc_msg_In(response);
				break;	
				//---------------------------------------------------------
				//---------------------------------------------------------	

			default:
				break;
			}
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------------------
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
				$("#span_new_msg"		).removeClass("hide");
				$("#sp_nbNew_message"	).html(nb_msg);
			}
		}

		const do_lc_push_validate_group = (msgContent) => {
			//----parse files info if there are----------

			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Group.do_lc_push_notif_validate_socket(msgContent);
			} else {
				$("#span_new_msg"		).removeClass("hide");
				$("#sp_nbNew_message"	).html(nb_msg);
			}
		}

		const do_lc_push_not_validate_group = (msgContent) => {
			//----parse files info if there are----------

			if(VIEW_PART ===  App.router.part.PRJ_CHATROOM){
				App.controller.ChatRoom.Group.do_lc_push_notif_not_validate_socket(msgContent);
			} else {
				$("#span_new_msg"		).removeClass("hide");
				$("#sp_nbNew_message"	).html(nb_msg);
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
		//-----------------------------------------------------------------------------------
		
	};

	return PrjSocketController;
});