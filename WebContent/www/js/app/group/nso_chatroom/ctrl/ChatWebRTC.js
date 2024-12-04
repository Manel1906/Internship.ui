define(['jquery', 'simplepeer' ], function($, SimplePeer) {

	const ChatWebRTC 	= function (grpName, header, content, footer) {
		
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName                = grpName?grpName:((new Date()).getTime()+"");
		var tmplName                  = App.template.names[pr_grpName];
		var tmplCtrl                  = App.template.controller;
		//------------------------------------------------------------------------------------

		const pr_SERVICE_CLASS		= "ServiceMsgMessage"; //to change by your need
		const pr_SV_LIST			= "SVMsgChatLst";
		//------------------variable pagination post------------------------------------------------------
		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;
		const pr_SERVICE_CLASS_GROUP_DYN	= "ServiceNsoGroupChat";
		const pr_SV_GROUP_NEW				= "SVNewRoomCalendar"; 
		const pr_TYP_CHAT_USER				= 1;
		const pr_TYP_CHAT_GROUP				= 2;
		const pr_TYP_CHAT_GROUP_CALENDAR	= 4;

		const pr_ROLE_MASTER		= "master";
		const pr_ROLE_VIEWER		= "viewer";
		const pr_TIME_OUT_MASTER	= 1 * 60 * 1000; // 1 minutes
		const pr_TIME_OUT_VIEWER	= 30 * 1000; // 1 minutes
		var var_TIME_OUT_MASTER		= null;
		var var_TIME_OUT_VIEWER		= null;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_User 			= null;
		var pr_ctr_Member			= null;
		var pr_ctr_Chat 			= null;
		var pr_ctr_Group 			= null;
		
		
		const pr_rtc_configuration  	= {
				// Using From https://www.metered.ca/tools/openrelay/
				"iceServers": [
					{
						urls		: "stun:openrelay.metered.ca:80"
					},{
						urls		: "turn:openrelay.metered.ca:80",
						username	: "openrelayproject",
						credential	: "openrelayproject"
					},{
						urls		: "turn:openrelay.metered.ca:443",
						username	: "openrelayproject",
						credential	: "openrelayproject"
					},{
						urls		: "turn:openrelay.metered.ca:443?transport=tcp",
						username	: "openrelayproject",
						credential	: "openrelayproject"
					}/*, {
						urls		: "stun:stun.relay.metered.ca:80",
					},
					{
						urls		: "turn:global.relay.metered.ca:80",
						username	: "a0901b9930e7be19911ae5ce",
						credential	: "uwGYoTYOUpN6P+wr",
					},
					{
						urls		: "turn:global.relay.metered.ca:80?transport=tcp",
						username	: "a0901b9930e7be19911ae5ce",
						credential	: "uwGYoTYOUpN6P+wr",
					},
					{
						urls		: "turn:global.relay.metered.ca:443",
						username	: "a0901b9930e7be19911ae5ce",
						credential	: "uwGYoTYOUpN6P+wr",
					},
					{
						urls		: "turns:global.relay.metered.ca:443?transport=tcp",
						username	: "a0901b9930e7be19911ae5ce",
						credential	: "uwGYoTYOUpN6P+wr",
					},*/]
		};
		
		const pr_mediaConstraints = {
				audio			: true,
				video			: {
					width		: {max: 1280},
					height		: {max: 720},
					facingMode 	: {ideal: "user"}
				},
				
		};
		
		//--------------------------------------------------------------------------
		async function do_gl_RequestPost(url, header, data) {
			const response = await fetch(url, {
				method	: "POST",
				headers	: header,
				body	: JSON.stringify(data),
			});
			return response.json();
		}
		//--------------------------------------------------------------------------
		let pr_rtc_stream 		= null;
		let pr_rtc_video 		= null;
		
		let pr_rtc_stream_share	= null;
		let pr_rtc_video_share	= null;
		
		let pr_rtc_peers		= {};
		let pr_rtc_peers_share	= {};
		
		let pr_rtc_screen 		= 0;
		let pr_rtc_chat 		= 4;
		let pr_hasInit			= false;
		const do_lc_getRandomClientId = () => Math.random().toString(36).substring(2).toUpperCase();


		var initialeValues = {
				obj 			: null,
				currentTyp		: null,
				members			: {},
				role			: null,
				userCall		: null,
				clientId		: do_lc_getRandomClientId(),
		}
		//--------------------APIs--------------------------------------//
		this.do_lc_init			= function(){
			pr_ctr_Main 		= App.controller.ChatRoom.Main;
			pr_ctr_Group 		= App.controller.ChatRoom.Group
			pr_ctr_Member 		= App.controller.ChatRoom.Member;
			pr_ctr_Chat 		= App.controller.ChatRoom.Chat;
			pr_hasInit 			= false;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function({ obj, currentTyp, members,isCallCalendar }, am_master=true){              
			try{
				pr_rtc_screen		= 0;
				pr_hasInit 			= false;
				pr_rtc_stream 		= null;
				pr_rtc_video 		= null;
				pr_rtc_peers		= {};
				pr_rtc_peers_share	= {};
				
				$("#div_chat_all"	).remove();
				$("#div_video_call"	).show();
				
				do_lc_init_ServerCfg ({obj, currentTyp, members, isCallCalendar}, am_master);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chat", "ChatWebRTC", "do_lc_show", e.toString()) ;
			}
		};
		
//		var do_lc_init_ServerCfg = function ({obj, currentTyp, members, isCallCalendar}, am_master){
//			do_gl_RequestPost(
//					"https://rtc.live.cloudflare.com/v1/turn/keys/cdf9cd/credentials/generate", 
//					{
//				        'Authorization': 'Bearer a',
//						'Content-Type': 'application/json',
//				    },
//					{'ttl': 86400})
//				    .then((result) => {
//						var urls 		= result.iceServers.urls;
//						var uName 		= result.iceServers.username;
//						var pwd			= result.iceServers.credential;
//						var iceServers	= [];
//						for (var url of urls){
//							iceServers.push({
//								urls		: url,
//								username	: uName,
//								credential	: pwd,
//							})
//						}
//						
//						pr_rtc_configuration.iceServers = iceServers;
//						
//						do_lc_webRTC_initValue(obj, currentTyp, members,isCallCalendar, am_master);		
//						
//						do_lc_Page_Main_build();
//								
//						do_lc_webRTC_initMedia();
//						
//						pr_hasInit = true;
//				    })
//				    .catch((error) => {
//				        console.error("Error:", error);
//				        
//				        //---use the sv cfg default
//				        
//				        do_lc_webRTC_initValue(obj, currentTyp, members,isCallCalendar, am_master);		
//						
//						do_lc_Page_Main_build();
//								
//						do_lc_webRTC_initMedia();
//						
//						pr_hasInit = true;
//				    }
//				);
//		}
		
		const do_lc_init_ServerCfg = ({obj, currentTyp, members, isCallCalendar}, am_master) => {
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceAutCloudflare", "SVGetRTC");

			const fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_init_ServerCfg_callback, [{obj, currentTyp, members, isCallCalendar}, am_master]));

			const fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_init_ServerCfg_callback = function(sharedJson, {obj, currentTyp, members, isCallCalendar}, am_master) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				var result 	= JSON.parse(sharedJson[App['const'].RES_DATA]);
				var urls 	= result.iceServers.urls;
				var uName 	= result.iceServers.username;
				var pwd 	= result.iceServers.credential;
				var iceServers = [];
				for (var url of urls) {
					iceServers.push({
						urls: url,
						username: uName,
						credential: pwd,
					})
				}

				pr_rtc_configuration.iceServers = iceServers;
			} 
			//---use the sv cfg default if api failed

			do_lc_webRTC_initValue(obj, currentTyp, members, isCallCalendar, am_master);

			do_lc_Page_Main_build();

			do_lc_webRTC_initMedia();

			pr_hasInit = true;
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_lc_msg_In = function(response, username){
			if (!pr_hasInit) return;
			
			switch (response.type) {
				//--------------------------------------------------------------
				//--------------------------------------------------------------
			case "VIDEO_CALL_START"	: //---some one has begun chat video, I prepare peer to communicate
				do_lc_webRTC_addPeer (response.payLoad, false, initialeValues);
				break;
				
			case "VIDEO_CALL_SEND"	: //---Im offer, client is ready to receive my stream
				do_lc_webRTC_addPeer (response.payLoad, true, initialeValues);
				break;
				
			case "VIDEO_CALL_SIGNAL": //---receive signal from other and launch a peer to receive stream
				do_lc_webRTC_launchPeer (response.payLoad);
				break;
				
			
				//-----------------------------------------------------------------
			case "VIDEO_CALL_START_SHARE":
				do_lc_webRTC_addPeer_share (response.payLoad, false);
				break;
			case "VIDEO_CALL_SEND_SHARE":
				do_lc_webRTC_addPeer_share (response.payLoad, true);
				break;
			case "VIDEO_CALL_SIGNAL_SHARE":
				do_lc_webRTC_launchPeer_share (response.payLoad);
				break;
				
				
				//-----------------------------------------------------------------
			case "VIDEO_CALL_END":
				do_lc_webRTC_removePeer(response.payLoad);
				break;

			case "VIDEO_CALL_END_ALL":
				do_lc_webRTC_removePeerAll(response.payLoad);
				break;
			}
		}
		//--------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------  
		const do_lc_webRTC_initValue 	= (obj, currentTyp, members,isCallCalendar, am_master) => {
			initialeValues.obj				= obj;
			initialeValues.currentTyp 		= currentTyp;
			initialeValues.members 			= members;
			initialeValues.isCallCalendar 	= isCallCalendar;
			if (am_master) 
				initialeValues.role  	= pr_ROLE_MASTER;
			else
				initialeValues.role  	= pr_ROLE_VIEWER;
			
			
			if (!App.controller.ChatRoom.Socket.can_lc_online())
				App.controller.ChatRoom.Socket.do_lc_init();
		}

		const do_lc_webRTC_closeWhenLoosePage = function (){
			//----Observer => close WebRTC when change route------------------------------------
		    var MutationObserver 	= window.MutationObserver || window.WebKitMutationObserver;
		    const mutationHandler	= function (mutationRecords) {
				console.info("mutationHandler:");

				mutationRecords.forEach(function(mutation) {
					console.log(mutation.type);

					if (typeof mutation.removedNodes == "object") {
						var ele = $(mutation.removedNodes);
						if (ele.hasClass ("page-content"))
							do_lc_webRTC_stop(false);
					}
				});
			}
		    var myObserver 			= new MutationObserver(mutationHandler);
			var obsConfig 			= {
					childList		: true,
					characterData	: false,
					attributes		: false,
					subtree			: false
			};
			var targetNodes 		= $("#div_main_content");
			targetNodes.each(function() {
				myObserver.observe(this, obsConfig);
			});
		}
		
		
		const do_lc_webRTC_initMedia = function (){
			
			navigator.mediaDevices.getUserMedia(pr_mediaConstraints).then(stream => {
			    console.log('Received local stream');

			    pr_rtc_video 				= $("#video-master")[0];
			    pr_rtc_video.srcObject 		= stream;
				
			    pr_rtc_video.onclick 		= () => do_lc_openPictureInPicture(pr_rtc_video);
			    pr_rtc_video.ontouchstart 	= () => do_lc_openPictureInPicture(pr_rtc_video);
			    
			    pr_rtc_stream 				= stream;
			    
				
				//------check audio track----------------------
				var audioTracks= pr_rtc_stream.getAudioTracks()
				if (audioTracks.length === 0) {
				    // No audio from microphone has been captured
				}else{
					const track = audioTracks[0];
					if (track.muted) {
					    // Track is muted which means that the track is unable to provide media data.
					    // When muted, a track can't be unmuted.
					    // This track will no more provide data...
						console.log ("track.muted:" + track.muted);
					}

					if (!track.enabled) {
					    // Track is disabled (muted for telephonist) which means that the track provides silence instead of real data.
					    // When disabled, a track can be enabled again.
					    // When in that case, user can't be heard until track is enabled again.
						console.log ("track.enabled:" + track.enabled);
					}

					if (track.readyState === "ended") {
					    // Possibly a disconnection of the device
					    // When ended, a track can't be active again
					    // This track will no more provide data
						console.log ("track.readyState:" + track.readyState);
					}				
					
				    /*
				    for (let index in pr_rtc_stream.getAudioTracks()) {
				    	pr_rtc_stream.getAudioTracks()[index].enabled = true;
				    }*/
				}
				
				//-------------------------------------------------------------------
				//no video by default
			    for (let index in pr_rtc_stream.getVideoTracks()) {
			    	pr_rtc_stream.getVideoTracks()[index].enabled = false;
			    }
				
			    //----------------------------------------------------------------------------------
			    do_lc_webRTC_closeWhenLoosePage ();
				//----------------------------------------------------------------------------------
			    
				//----------------------------------------------------------------------------------
			   //--send signal: I have initialized my stream....
			    const msgOut = {
						name: "VIDEO_CALL_START",
						val:  {}
				}
				App.controller.ChatRoom.Socket.can_lc_msg_Out 	(msgOut);
				
			}).catch(e => console.log(`getusermedia error: ${e}`))
		}
		
		//------------------------------------------------------------------------------
		/**
		 * Creates a new peer connection and sets the event listeners
		 * @param {String} clientId 
		 *                 ID of the peer
		 * @param {Boolean} am_initiator 
		 *                  Set to true if the peer initiates the connection process.
		 *                  Set to false if the peer receives the connection. 
		 */
		const do_lc_webRTC_addPeer = function (resPayload, am_initiator, initialeValues) {
			var clientId 			= resPayload.uId;
			var sessId				= resPayload.inf02;
			const selectedMember 	= Object.values(initialeValues.members).find(member => member.uId === clientId);
			const user 				= selectedMember.mem
			console.log(selectedMember)
			
			pr_rtc_peers [clientId] = new SimplePeer({
		        initiator	: am_initiator,
		        stream		: pr_rtc_stream,
		        config		: pr_rtc_configuration
		    })

			pr_rtc_peers [clientId].on('signal', data => { //---if offer, this signal will be launch 
				const msgOut = {
						name	: "VIDEO_CALL_SIGNAL",
						val		:  {
							uId			: clientId,
							inf01		: data,
							inf02		: sessId,
						}
				}
				App.controller.ChatRoom.Socket.can_lc_msg_Out 	(msgOut);
			});

			pr_rtc_peers [clientId].on('stream', stream => {//----mở đường truyền, bắt đầu truyền tín hiệu
				$("#div_video_call").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_VIDEO_VIEWER, {id: clientId, user: user}));
				
		        let newVid 			= document.getElementById("video-" + clientId); 
		        newVid.srcObject 	= stream;
				newVid.playsinline 	= false;
				newVid.autoplay 	= true;
				
		        newVid.onclick 		= () => do_lc_openPictureInPicture(newVid);
		        newVid.ontouchstart = () => do_lc_openPictureInPicture(newVid);
		        
		        do_lc_bind_event_main();
		        do_lc_bind_event_sub ();
		    });
		    
			
			if (!am_initiator){
				const msgOut = {
						name	: "VIDEO_CALL_SEND",
						val		:  {
							 uId		: clientId,
							 inf02		: sessId,
						}
					}
				App.controller.ChatRoom.Socket.can_lc_msg_Out 	(msgOut);
			
			} 
		}
		
		
		const do_lc_webRTC_launchPeer= function (resPayload){
			var clientId 	= resPayload.uId;
			var signalData	= JSON.parse(resPayload.inf01);
			
			pr_rtc_peers [clientId].signal(signalData);
		}
		
		
		
		/**
		 * Remove a peer with given clientId. 
		 * Removes the video element and deletes the connection
		 * @param {String} clientId 
		 */
		const do_lc_webRTC_removePeer = function (resPayload) {
			var clientId 	= resPayload.uId;
			var sessId		= resPayload.inf02;
			
			var videoId		= "video-" + clientId;
			var divID		= "row_video_viewer_" + clientId;
		    let videoEl 	= document.getElementById(videoId);
		    let divE1		= document.getElementById(divID)
		    
		    do_lc_video_close (videoEl,divE1);
		    $('#btn-img-avatar_' 	+ clientId).hide()
			$('#text-avatar_' 		+ clientId).hide()
		    
		    if (pr_rtc_peers[clientId]) pr_rtc_peers[clientId].destroy();
		    delete pr_rtc_peers[clientId];
			
			if (pr_rtc_peers_share[clientId]) pr_rtc_peers_share[clientId].destroy();
			delete pr_rtc_peers_share[clientId];
		}
		
		const do_lc_video_close = function (videoEl,divE1) {
			if (videoEl) {
				
				if (videoEl.srcObject){
					const tracks = videoEl.srcObject.getTracks();

					tracks.forEach(function(track) {
						track.stop();
					})
				}				

				videoEl.srcObject = null;
				videoEl.parentNode.removeChild(videoEl);
			}
			
			if (divE1) divE1.parentNode.removeChild(divE1);
		}
		
		const do_lc_stream_close = function (videoEl) {
			if (videoEl) {
				if (videoEl.srcObject) {
					const tracks = videoEl.srcObject.getTracks();

					tracks.forEach(function(track) {
						track.stop();
					})
				}	

				videoEl.srcObject = null;
			}
		}
		
		const do_lc_webRTC_removePeerAll = function (returnToMain = true) {
			for (var clientId in pr_rtc_peers){
				var videoId		= "video-" + clientId;
			    let videoEl 	= document.getElementById(videoId);
			    
			    do_lc_video_close (videoEl);
			    
			    if (pr_rtc_peers[clientId]) pr_rtc_peers[clientId].destroy();
			    delete pr_rtc_peers[clientId];
			}
			
			do_lc_video_close (pr_rtc_video);
			
			for (var clientId in pr_rtc_peers_share){
			    if (pr_rtc_peers_share[clientId]) pr_rtc_peers_share[clientId].destroy();
			    delete pr_rtc_peers_share[clientId];
			}
			do_lc_video_close (pr_rtc_video_share);
			
			
	//		$("#div_main_content").removeClass("mt-custom");
			if (initialeValues.isCallCalendar){
				initialeValues.obj = null;
				initialeValues.members = null;
				App.router.controller.do_lc_run("VI_MAIN/prj_appointment_list", "view_prj_appointment_list.html");
			}
			else{
				App.router.controller.do_lc_run("VI_MAIN/prj_chatroom", "view_prj_chat_room.html");
			}
		}
		
		
		const do_lc_webRTC_stop = (returnToMain = true) => {
			const msgOut = {
					name	: "VIDEO_CALL_END",
					val		:  {}
				}
			App.controller.ChatRoom.Socket.can_lc_msg_Out 	(msgOut);
			
			do_lc_webRTC_removePeerAll (returnToMain);
			
			pr_hasInit = false;
		}
	
		//---------------------------------------------------------------------------------------------------------
		const do_lc_webRTC_setStreamForPeers = function (stream){
			for (let clientId in pr_rtc_peers) {
	    		var peer = pr_rtc_peers[clientId];
	    		for (let index in peer.streams[0].getTracks()) {
	                for (let index2 in stream.getTracks()) {
	                    if (peer.streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
	                        peer.replaceTrack(	peer	.streams[0].getTracks()[index], 
	                        					stream	.getTracks()[index2], 
	                        					peer	.streams[0]);
	                        break;
	                    }
	                }
	            }
	             $('#btn-img-avatar_' + "43").hide()
			     $('#text-avatar_' 	  + "43").hide()
	        }
			
			pr_rtc_stream 			= stream;
		    pr_rtc_video.srcObject 	= stream;
		}
		
		//-----------------------------------------------------------------------------------------------------
		const do_lc_Page_Main_build = function(){
			App.MsgboxController.do_lc_close();
			let nbViewer = 2;
			if(initialeValues.currentTyp === pr_TYP_CHAT_GROUP){
				nbViewer = Object.keys(initialeValues.members).length - 1;
			}
			console.log(App.data.user.id)
			const obj = initialeValues.members;
			user = obj[App.data.user.id].mem;
			if(initialeValues.isCallCalendar){
				$("#div_video_call_calendar").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_VIDEO, 
				{role : initialeValues.role, nbViewer, user: user}));
				$(".page-content").children(":not(#div_video_call)").addClass("hide");
				$("#div_video_call_calendar").css("margin-top", "6rem");
			}else{
				$("#div_video_call").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_VIDEO, 
				{role : initialeValues.role, nbViewer, user: user}));
			}
//			$(".row-multi-viewer").addClass("chat-multi-viewer-zoom-out");
			
			do_lc_bind_event_main();
			do_lc_bind_event_sub ();
		}
		
		const do_lc_bind_event_main = () => {
			const $btn = $('#btn-chat-message');
			$('#btn-call-stop'		).off("click").click(do_lc_webRTC_stop	);
			
			$('#btn-vid-switch'		).off("click").click(do_lc_toggleMedia	);
			
			$('#btn-chat-message').off("click").click(() => {
	          if ($("#div_chat_main_chat").is(":visible")) {
	            $("#div_chat_main_chat").hide(); 
	            $btn.css('background-color', 'rgb(60, 64, 67)');
	          } else {
				$btn.css('background-color', 'rgb(244, 106, 106)');
	            do_lc_chatMessage();
	          }
    		});
    		
			$('#btn-vid-mute'		).off("click").click(do_lc_toggleMute	);
			$('#btn-vid-showHide'	).off("click").click(do_lc_toggleVid	);
			
			$('#btn-screen-share'	).off("click").click(do_lc_toggleShare	);
			
			
		}
		
		const do_lc_bind_event_sub = () => {
			$('.btn_zoom_video'		).off("click").click(do_lc_zoom				);
			$('.btn_lst_video'		).off("click").click(do_lc_zoom_multi_view	);
			$('.btn_chat_in_video'	).off("click").click(do_lc_zoom_div_chat	);
		}
		
		const do_lc_toggleShare = function() {
			if (!pr_rtc_screen) {
				do_lc_webRTC_initScreenShare();
			} else {
				pr_rtc_screen = 0;
				$("#div_video_share").hide();
				do_lc_stream_close(pr_rtc_video_share);
			}
		};
				
		
		const do_lc_toggleMedia = function() {
		    if (pr_mediaConstraints.video.facingMode.ideal === 'user') {
		        pr_mediaConstraints.video.facingMode.ideal = 'environment';
		    } else {
		        pr_mediaConstraints.video.facingMode.ideal = 'user';
		    }

		    const tracks = pr_rtc_stream.getTracks();

		    tracks.forEach(function (track) {
		        track.stop();
		    })

		    pr_rtc_video.srcObject = null;
		    navigator.mediaDevices.getUserMedia(pr_mediaConstraints).then(stream => {
		    	do_lc_webRTC_setStreamForPeers (stream);
		    });
		}
		
		const do_lc_toggleMute = function() {
		    for (let index in pr_rtc_stream.getAudioTracks()) {
		        pr_rtc_stream.getAudioTracks()[index].enabled = !pr_rtc_stream.getAudioTracks()[index].enabled
		    }
		    
		    const $icon = $('#btn-vid-mute>i');

			if ($icon.hasClass("mdi-microphone-off")) {
			    $icon.removeClass("mdi-microphone-off").addClass("mdi-microphone");
			    $('#btn-vid-mute').css('background-color', 'rgb(60, 64, 67)'); 
			} else {
			    $icon.removeClass("mdi-microphone").addClass("mdi-microphone-off"); 
			    $('#btn-vid-mute').css('background-color', 'rgb(244,106,106)'); 
			}

		}
		const do_lc_chatMessage = function() {
		//	pr_ctr_Group.do_lc_show()
		//	pr_ctr_Main.do_lc_show()
			if(initialeValues.isCallCalendar){
	//			do_lc_new_group(initialeValues);
				pr_ctr_Chat.do_lc_show(initialeValues,pr_rtc_chat)
			}else{
				pr_ctr_Chat.do_lc_show(initialeValues,pr_rtc_chat)
			}
		}
		const do_lc_toggleVid = function() {
		    const idUser = App.data.user.id;
		    const videoTracks = pr_rtc_stream.getVideoTracks(); // Get the video tracks from the stream
		    const videoTrack = videoTracks[0]; // Work with the first video track if it exists
	    	// Check if the video track exists
	    	if (videoTrack) {
	        videoTrack.enabled = !videoTrack.enabled;
	
	        // Update the UI based on the current state of the video track
	        const isVideoEnabled = videoTrack.enabled; // Check if video is now enabled
	        const $icon = $('#btn-vid-showHide>i');
	        if (isVideoEnabled) {
	            $icon.removeClass("mdi-video-off").addClass("mdi-video");
	            $('#btn-vid-showHide').css('background-color', 'rgb(60, 64, 67)'); 
	          	$('#btn-img-avatar_' + idUser).hide();
	          	$('#text-avatar_'	 + idUser).hide();
	            $('#btn-img-avatar'		     ).hide();
				$('#text-avatar'		     ).hide();
	        } else {
	            $icon.removeClass("mdi-video").addClass("mdi-video-off");
	            $('#btn-vid-showHide').css('background-color', 'rgb(244, 106, 106)');
	          	$('#btn-img-avatar_' + idUser).show();
	          	$('#text-avatar_' +    idUser).show();
	            $('#btn-img-avatar'		     ).show();
				$('#text-avatar'		     ).show();
	        }
	    	}
		};

		
		
		/**
		 * Opens an element in Picture-in-Picture mode
		 * @param {HTMLVideoElement} el video element to put in pip mode
		 */
		var do_lc_openPictureInPicture = function (el) {
		    el.requestPictureInPicture();
		}
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------

		const do_lc_zoom_multi_view = (e) => {
			if($(e.currentTarget).hasClass("bx-collapse")){
				$('.btn_lst_video'		).removeClass("bx-collapse");
				$('.btn_lst_video'		).addClass("bx-expand");
				$(".row-multi-viewer"	).addClass("hide");
			} else {
				$('.btn_lst_video'		).removeClass("bx-expand");
				$('.btn_lst_video'		).addClass("bx-collapse");
				$(".row-multi-viewer"	).removeClass("hide");
			}
		}

		const do_lc_zoom_div_chat = (e) => {
			if($(e.currentTarget).hasClass("bx-plus")){
				$('.btn_chat_in_video'	).removeClass("bx-plus");
				$('.btn_chat_in_video'	).addClass("bx-minus");

				$("#div_chat"			).addClass("div_chat_z_index");
				$("#div_chat_realize"	).addClass("div_chat_in_video");
				$("#div_chat_msg"		).addClass("div_chat_msg_in_video");
				$("#div_chat_footer"	).addClass("div_chat_footer_in_video");
			} else {
				$('.btn_chat_in_video'	).removeClass("bx-minus");
				$('.btn_chat_in_video'	).addClass("bx-plus");

				$("#div_chat"			).removeClass("div_chat_z_index");
				$("#div_chat_realize"	).removeClass("div_chat_in_video");
				$("#div_chat_msg"		).removeClass("div_chat_msg_in_video");
				$("#div_chat_footer"	).removeClass("div_chat_footer_in_video");
			}
		}

		
		const do_lc_zoom = (e) => {
		    var divPar = $(e.currentTarget).parent();
		    var target = $(e.currentTarget);
		    
		    if (target.hasClass("bx-zoom-in")) {
		        divPar.addClass("video_fullscreen");
				$("#control-bar").addClass("displ-top");
		        $(".bx-zoom-in").hide();
		        target.show();
				
				divPar.find(".video_small").removeClass("video_small").addClass("video_center");
		    } else {
		        divPar.removeClass("video_fullscreen");
				$("#control-bar").removeClass("displ-top");
		        $(".bx-zoom-in").show();
				divPar.find(".video_center").removeClass("video_center").addClass("video_small");
		    }
		    
		    target.toggleClass("bx-zoom-in");
		    target.toggleClass("bx-zoom-out");
		}


		this.do_lc_show_popup_new_call = (userId, msg) => {
			App.MsgboxController.do_lc_show({
				title	: $.i18n("prj_chat_video_incoming_call"	),
				content : tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_POPUP_CHAT_VIDEO, msg),
				width	: "50%",
				buttons	: {
					OK: {
						lab		: $.i18n("common_btn_yes"),
						funct	: App.controller.ChatRoom.Socket.do_lc_show_answer,
						param	: [userId, msg],
						classBtn: "btn-success"
					},
					NO: {
						lab		:  $.i18n("common_btn_cancel"),
						classBtn: "btn-danger",
						funct	: () => var_TIME_OUT_VIEWER && clearTimeout(var_TIME_OUT_VIEWER),
					}
				}
			});
			
			var_TIME_OUT_VIEWER = setTimeout(App.MsgboxController.do_lc_close, pr_TIME_OUT_VIEWER);
		}
		//-------------------------------------------------------------------------------------------
		var pr_ctr_CapSreen = null;
		const do_lc_webRTC_initScreenShare = function() {
			$("#div_video_share").hide();
			pr_rtc_screen = 0;

			if (!pr_ctr_CapSreen) try {
				pr_ctr_CapSreen = new CaptureController();
			} catch (e) {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_sysCtrl"))
				return;
			}

			$("#div_video_share").show();

			navigator.mediaDevices.getDisplayMedia({ pr_ctr_CapSreen }).then(stream => {
				const [track] = stream.getVideoTracks();
				const displaySurface = track.getSettings().displaySurface;
				if (displaySurface == "browser") {
					// Focus the captured tab.
					pr_ctr_CapSreen.setFocusBehavior("focus-captured-surface");
				} else if (displaySurface == "window") {
					// Do not move focus to the captured window.
					// Keep the capturing page focused.
					pr_ctr_CapSreen.setFocusBehavior("focus-capturing-application");
				}


				pr_rtc_video_share = $("#video-ScreenShare")[0];

				pr_rtc_video_share.srcObject = stream;
				pr_rtc_stream_share = stream;

				do_lc_webRTC_setStreamForPeers_share (stream);
				//----------------------------------------------------------------------------------
				//--send signal: I have initialized my stream....
				const msgOut = {
					name: "VIDEO_CALL_START_SHARE",
					val: {}
				}
				App.controller.ChatRoom.Socket.can_lc_msg_Out(msgOut);

				pr_rtc_screen = 1;
			});


		}
		const do_lc_webRTC_addPeer_share = function(resPayload, am_initiator) {
			var clientId = resPayload.uId;
			var sessId = resPayload.inf02;

			pr_rtc_peers_share[clientId] = new SimplePeer({
				initiator	: am_initiator,
				stream		: pr_rtc_stream_share,
				config		: pr_rtc_configuration
			})

			pr_rtc_peers_share[clientId].on('signal', data => { //---if offer, this signal will be launch 
				const msgOut = {
					name: "VIDEO_CALL_SIGNAL_SHARE",
					val: {
						uId		: clientId,
						inf01	: data,
						inf02	: sessId,
					}
				}
				App.controller.ChatRoom.Socket.can_lc_msg_Out(msgOut);
			});

			pr_rtc_peers_share[clientId].on('stream', stream => {//----mở đường truyền, bắt đầu truyền tín hiệu
				$("#div_video_share").show();

				let newVid 			= document.getElementById("video-ScreenShare");
				newVid.srcObject 	= stream;
				newVid.playsinline 	= false;
				newVid.autoplay 	= true;
			});


			if (!am_initiator) {
				const msgOut = {
					name: "VIDEO_CALL_SEND_SHARE",
					val: {
						uId		: clientId,
						inf02	: sessId,
					}
				}
				App.controller.ChatRoom.Socket.can_lc_msg_Out(msgOut);
			}
		}

		const do_lc_webRTC_launchPeer_share = function(resPayload) {
			var clientId 	= resPayload.uId;
			var signalData 	= JSON.parse(resPayload.inf01);

			pr_rtc_peers_share[clientId].signal(signalData);
		}
		
		
		const do_lc_webRTC_setStreamForPeers_share = function (stream){
			for (let clientId in pr_rtc_peers_share) {
	    		var peer = pr_rtc_peers_share[clientId];
	    		for (let index in peer.streams[0].getTracks()) {
	                for (let index2 in stream.getTracks()) {
	                    if (peer.streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
	                        peer.replaceTrack(	peer	.streams[0].getTracks()[index], 
	                        					stream	.getTracks()[index2], 
	                        					peer	.streams[0]);
	                        break;
	                    }
	                }
	            }
	        }
			
			pr_rtc_stream_share 			= stream;
		    pr_rtc_video_share.srcObject 	= stream;
		}
	};

	return ChatWebRTC;
});
