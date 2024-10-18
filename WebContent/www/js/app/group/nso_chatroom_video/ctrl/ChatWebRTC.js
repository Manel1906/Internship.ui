define(['jquery'], function($) {

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

		const pr_TYP_CHAT_USER		= 1;
		const pr_TYP_CHAT_GROUP		= 2;

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

		
		const do_lc_getRandomClientId = () => Math.random().toString(36).substring(2).toUpperCase();

		const configRTC = {
				// region 			: 'ap-southeast-1',
				region 			: 'eu-west-3',
				accessKeyId 	: null,
				secretAccessKey : null,
				sessionToken 	: null,
				endpoint 		: null,
				sendVideo		: true,
				sendAudio		: true,
				clientId		: null,
		}

		const initialeValues = {
				obj 		: null,
				currentTyp	: null,
				members		: {},
				role		: null,
				userCall	: null,
				clientId	: do_lc_getRandomClientId(),
		}
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.ChatRoom.Main;
			pr_ctr_Group 			= App.controller.ChatRoom.Group
			pr_ctr_Member 		= App.controller.ChatRoom.Member;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function({ obj, currentTyp, members }){              
			try{
//				$(".item-chat-div").toggleClass("d-none");
				// $("#div_chat_header").addClass("d-none");
				// $("#div_video_call").removeClass("d-none");
				$("#div_chat").addClass("col-sm-12");
				$("#div_video_call").addClass("col-sm-12");
				initialeValues.role 	= pr_ROLE_MASTER;
				do_lc_init_value(obj, currentTyp, members);
				do_lc_get_key();
				//if(!configRTC.accessKeyId || !configRTC.secretAccessKey)	return;
				do_lc_build_page_new_call();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chat", "ChatWebRTC", "do_lc_show", e.toString()) ;
			}
		};
		this.req_participate_channel = ({ obj, currentTyp, members }) => {
			do_lc_init_value(obj, currentTyp, members);
			do_lc_build_view_video_call();
			do_lc_get_key();
			do_lc_get_channel(pr_ROLE_VIEWER);
		}
		this.do_lc_new_video_call = (msg) => {
//			do_lc_get_key();
//			if(!configRTC.accessKeyId || !configRTC.secretAccessKey)	return;
//			do_lc_show_popup_new_call(msg);
			let call = 1;
			do_lc_build_group_current_call_kinesis(msg, call);
		}

		this.do_lc_finish_video_call = (msg) => {
			stopViewer(msg);
//			$(".item-chat-div").toggleClass("d-none");
			$("#div_video_call").addClass("d-none");
			$("#div_chat_header").removeClass("d-none");
			$("#div_chat").removeClass("col-sm-12");
			$("#div_video_call").removeClass("col-sm-12");
			
			let call = 2;
			do_lc_build_group_current_call_kinesis(msg, call);
		}
		
		this.do_lc_finish_video_viewer = (msg) => {
			const remoteView = $('#master .remote-view');
			if(remoteView.length){
				const hasOtherRemote = false;
				for(let i = 0; i < remoteView.length; i++){
	            	const remoteViewItem 	= remoteView[i];
	            	const { client } 		= $(remoteViewItem).data();
	            	if(client == msg.clientId){
	            		remoteViewItem.srcObject = null;
	            		continue;
	            	}
	            	
	            	if (remoteViewItem.srcObject) {
	            		hasOtherRemote = true;
	                }
	            }
				
				!hasOtherRemote && do_lc_finish_master();
			}
		}
		
		const do_lc_finish_master = () => {
			stopMaster();
//			$(".item-chat-div").toggleClass("d-none");
			$("#div_video_call").addClass("d-none");
			$("#div_chat_header").removeClass("d-none");
			$("#div_chat").removeClass("col-sm-12");
			$("#div_video_call").removeClass("col-sm-12");
		}

		const do_lc_init_value = (obj, currentTyp, members) => {
			initialeValues.obj			= obj;
			initialeValues.currentTyp 	= currentTyp;
			initialeValues.members 		= members;
		}

		const do_lc_build_page_new_call = function(){
			let nbViewer = 1;
			if(initialeValues.currentTyp === pr_TYP_CHAT_GROUP){
				nbViewer = Object.keys(initialeValues.members).length - 1;
			}
			do_lc_build_view_video_call(nbViewer);
			// do_lc_create_chanel();
		}

		const do_lc_get_key = function(){
			if(!App.data.keyChatWebRTC)	return;
			if(App.data.keyChatWebRTC.vals && App.data.keyChatWebRTC.vals.length>0){
				for(var i in App.data.keyChatWebRTC.vals){
					if(App.data.keyChatWebRTC.vals[i].code == "accessKeyId") 		configRTC.accessKeyId 		= App.data.keyChatWebRTC.vals[i].val01;
					if(App.data.keyChatWebRTC.vals[i].code == "secretAccessKey") 	configRTC.secretAccessKey 	= App.data.keyChatWebRTC.vals[i].val01;
				}
			}
		}
		
		const do_lc_build_view_video_call = (nbViewer = 1) => {
			$("#div_video_call").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_VIDEO, {role : initialeValues.role, nbViewer}));
			// $(".chat-conversation").addClass("chat_new_height");
			$(".row-multi-viewer").addClass("chat-multi-viewer-zoom-out");
			do_lc_bind_event();
		}

		const do_lc_create_chanel = async () => {
			do_lc_get_channel(pr_ROLE_MASTER);
//			const newConfig = { ...configRTC, channelName : do_lc_get_random_name() };
//			await createSignalingChannel(newConfig);//create new channel
//			do_lc_start_with_master(newConfig);//start video call master
		}
		
		const do_lc_get_channel = function(role){
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceAWSKinesis", "SVAwsKinesisConnect", {"role":role,"groupId" : initialeValues.obj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_start_video, [role]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_start_video = function(sharedJson, role){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 					= sharedJson[App['const'].RES_DATA];
				configRTC.accessKeyId 		= data.keyId;
				configRTC.secretAccessKey 	= data.keyValue;
				const newConfig 			= { ...configRTC, channelName : data.channel.channelInfo.channelName };
				if(role == pr_ROLE_MASTER)
					do_lc_start_with_master(newConfig);//start video call master
				else	do_lc_start_with_viewer(newConfig);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		const do_lc_start_with_master = (config) => {
			const localView 		= $('#master .local-view')		[0];
			const remoteView 		= $('#master .remote-view')		;

			startMaster(localView, remoteView, config, onStatsReport, event => {
			}, () => {
				do_lc_send_to_socket(config);
//				var_TIME_OUT_MASTER = setTimeout(do_lc_finish_master, pr_TIME_OUT_MASTER);
			}, () => {
//				var_TIME_OUT_MASTER && clearTimeout(var_TIME_OUT_MASTER);
			});
		}

		const do_lc_start_with_viewer = (config) => {
//			var_TIME_OUT_VIEWER && clearTimeout(var_TIME_OUT_VIEWER);
//			$(".item-chat-div").toggleClass("d-none");
			$("#div_video_call").removeClass("d-none");
			config.clientId			= initialeValues.clientId;
			initialeValues.role 	= pr_ROLE_VIEWER;
//			initialeValues.userCall = userCall;
			do_lc_build_view_video_call();

			const localView 		= $('#viewer .local-view')[0];
			const remoteView 		= $('#viewer .remote-view')[0];

			startViewer(localView, remoteView, config, onStatsReport, event => {
			});
		}

		const onStatsReport = (report) => {
			// TODO: Publish stats
		}

		const do_lc_bind_event = () => {
			$('#stop-master-button').off("click").click(do_lc_on_stop);
			$('#stop-viewer-button').off("click").click(do_lc_on_stop);
			$('.btn_zoom_video').off("click").click(do_lc_zoom);
			$('.btn_lst_video').off("click").click(do_lc_zoom_multi_view);
			$('.btn_chat_in_video').off("click").click(do_lc_zoom_div_chat);
		}

		const do_lc_zoom_multi_view = (e) => {
			if($(e.currentTarget).hasClass("bx-collapse")){
				$('.btn_lst_video').removeClass("bx-collapse");
				$('.btn_lst_video').addClass("bx-expand");
				$(".row-multi-viewer").addClass("hide");
			} else {
				$('.btn_lst_video').removeClass("bx-expand");
				$('.btn_lst_video').addClass("bx-collapse");
				$(".row-multi-viewer").removeClass("hide");
			}
		}

		const do_lc_zoom_div_chat = (e) => {
			if($(e.currentTarget).hasClass("bx-plus")){
				$('.btn_chat_in_video').removeClass("bx-plus");
				$('.btn_chat_in_video').addClass("bx-minus");

				$("#div_chat").addClass("div_chat_z_index");
				$("#div_chat_realize").addClass("div_chat_in_video");
				$("#div_chat_msg").addClass("div_chat_msg_in_video");
				$("#div_chat_footer").addClass("div_chat_footer_in_video");
			} else {
				$('.btn_chat_in_video').removeClass("bx-minus");
				$('.btn_chat_in_video').addClass("bx-plus");

				$("#div_chat").removeClass("div_chat_z_index");
				$("#div_chat_realize").removeClass("div_chat_in_video");
				$("#div_chat_msg").removeClass("div_chat_msg_in_video");
				$("#div_chat_footer").removeClass("div_chat_footer_in_video");
			}
		}

		const do_lc_on_stop = () => {
			if (!initialeValues.role)	return;

			if (initialeValues.role === pr_ROLE_MASTER) {
				stopMaster();
				$("#div_chat_header").removeClass("d-none");
				$("#div_chat").removeClass("col-sm-6");
				$("#div_video_call").removeClass("col-sm-12");
				do_lc_send_stop_channel();
				do_lc_send_finish_call();
			} else {
				stopViewer();
				do_lc_send_finish_viewer();
			}

			initialeValues.role = null;
//			$(".item-chat-div").toggleClass("d-none");
			$("#div_video_call").addClass("d-none");
			$("#div_chat_header").removeClass("d-none");
			$("#div_chat").removeClass("col-sm-12");
			$("#div_video_call").removeClass("col-sm-12");
			// $(".chat-conversation").removeClass("chat_new_height");
		}
		const do_lc_zoom = (e) => {
			let {role} = $(e.currentTarget).data();
			if(initialeValues.role=="master"){
				if(role =="master"){
					if($(e.currentTarget).hasClass("bx-zoom-in")){
						$(".row_containe_video_viewer").addClass("video_small");
						$(".row_containe_video_master").addClass("video_fullscreen");
						$(".row_containe_video_viewer").find(".btn_zoom_video").removeClass("bx-zoom-in");
						$("#div_chat").removeClass("col-sm-6");
						$("#div_video_call").removeClass("col-sm-6");
						$("#div_chat").addClass("col-sm-12");
						$("#div_video_call").addClass("col-sm-12");

						$(".row-multi-viewer").removeClass("chat-multi-viewer-zoom-out");
						$(".row-multi-viewer").addClass("chat-multi-viewer-zoom-in");

						$(".row_containe_video_master").removeClass("col-sm-6");
						$('.btn_lst_video').removeClass("hidden");
						$('.btn_chat_in_video').removeClass("hidden");

						$(".video-max").removeClass("video_max_height");
					}
					else{
						$(".row_containe_video_viewer").removeClass("video_small");
						$(".row_containe_video_master").removeClass("video_fullscreen");
						$(".row_containe_video_viewer").find(".btn_zoom_video").addClass("bx-zoom-in");
//						$("#div_chat").removeClass("col-sm-12");
//						$("#div_video_call").removeClass("col-sm-12");
//						$("#div_chat").addClass("col-sm-12");
//						$("#div_video_call").addClass("col-sm-12");

						$(".row-multi-viewer").removeClass("chat-multi-viewer-zoom-in");
						$(".row-multi-viewer").addClass("chat-multi-viewer-zoom-out");

						$(".row_containe_video_master").addClass("col-sm-6");
						$('.btn_lst_video').addClass("hidden");
						$('.btn_chat_in_video').addClass("hidden");

						// turn off chat
						$("#div_chat").removeClass("div_chat_z_index");
						$("#div_chat_realize").removeClass("div_chat_in_video");
						$("#div_chat_msg").removeClass("div_chat_msg_in_video");
						$("#div_chat_footer").removeClass("div_chat_footer_in_video");

						$(".row-multi-viewer").removeClass("hide");

						$(".video-max").addClass("video_max_height");
					}
				}
				else{
					if($(e.currentTarget).hasClass("bx-zoom-in")){
						$(".row_containe_video_master").addClass("video_small");
						$(".row_containe_video_viewer").addClass("video_fullscreen");
						$(".row_containe_video_master").find(".btn_zoom_video").removeClass("bx-zoom-in");
//						$("#div_chat").removeClass("col-6");
//						$("#div_video_call").removeClass("col-6");
//						$("#div_chat").addClass("col-12");
//						$("#div_video_call").addClass("col-12");

						$(".video-max").removeClass("video_max_height");
					}
					else{
						$(".row_containe_video_master").removeClass("video_small");
						$(".row_containe_video_viewer").removeClass("video_fullscreen");
						$(".row_containe_video_master").find(".btn_zoom_video").addClass("bx-zoom-in");
//						$("#div_chat").removeClass("col-12");
//						$("#div_video_call").removeClass("col-12");
//						$("#div_chat").addClass("col-6");
//						$("#div_video_call").addClass("col-6");

						$(".video-max").addClass("video_max_height");
					}
				}
			}
			else{
				if(role =="master"){
					if($(e.currentTarget).hasClass("bx-zoom-in")){
						$("#div_video_call").addClass("col-12");
						$(".row_containe_video_master").removeClass("col-6");
						$(".row_containe_video_master").addClass("col-12");
						$(".row_containe_video_viewer").addClass("video_small");
						$(".row_containe_video_viewer").find(".btn_zoom_video").removeClass("bx-zoom-in");
						$(".row_containe_video_master").addClass("video_fullscreen");

						$(".row_containe_video_master").removeClass("col-sm-6");
						$(".video-max").removeClass("video_max_height");
					}
					else{
						$(".row_containe_video_master").addClass("col-6");
						$(".row_containe_video_master").removeClass("col-12");
						$(".row_containe_video_viewer").removeClass("video_small");
						$(".row_containe_video_viewer").find(".btn_zoom_video").addClass("bx-zoom-in");
						$(".row_containe_video_master").removeClass("video_fullscreen");

						$(".row_containe_video_master").addClass("col-sm-6");
						$(".video-max").addClass("video_max_height");
					}
				}
				else{
					if($(e.currentTarget).hasClass("bx-zoom-in")){
						$("#div_video_call").addClass("col-12");
						$(".row_containe_video_viewer").removeClass("col-6");
						$(".row_containe_video_viewer").addClass("col-12");
						$(".row_containe_video_master").addClass("video_small");
						$(".row_containe_video_master").find(".btn_zoom_video").removeClass("bx-zoom-in");
						$(".row_containe_video_viewer").addClass("video_fullscreen");

						$(".row_containe_video_viewer").removeClass("col-sm-6");
						$(".video-max").removeClass("video_max_height");
					}
					else{
						$(".row_containe_video_viewer").addClass("col-6");
						$(".row_containe_video_viewer").removeClass("col-12");
						$(".row_containe_video_master").removeClass("video_small");
						$(".row_containe_video_master").find(".btn_zoom_video").addClass("bx-zoom-in");
						$(".row_containe_video_viewer").removeClass("video_fullscreen");

						$(".row_containe_video_viewer").addClass("col-sm-6");
						$(".video-max").addClass("video_max_height");
					}
				}
			}
			if ($(".row-multi-viewer").length >0) {
				$(".row_containe_video_viewer").removeClass("video_small");
			}

			$(e.currentTarget).toggleClass("bx-zoom-in");
			$(e.currentTarget).toggleClass("bx-zoom-out");
		}

		const do_lc_send_to_socket = (config) => {
			const msgIn = {
					name: "MSG_CHAT_START_CALL",
					val:  {
						config,
						userDes : initialeValues.obj.login,
						group 	: initialeValues.obj.id,
						typ 	: initialeValues.currentTyp
					}
			}
			if (!App.controller.ChatRoom.Socket.can_lc_msg_Out(msgIn)){
				///------ try to reconnect
//				App.controller.Home.GameCom.do_lc_conn_Init(wsUrl, wsFunctCallback, wsTimeout);

//				if (!App.controller.Home.GameCom.can_lc_msg_Out(msgIn)){
//				do_gl_show_Notify_Msg_Error ($.i18n('common_conn_loose'));
//				}
			} 
		}

		const do_lc_send_finish_call = () => {
			const msgIn = {
					name: "MSG_CHAT_FINISH_CALL",
					val:  {
						userDes : App.data.user.login,
						group 	: initialeValues.obj.id,
						typ 	: initialeValues.currentTyp
					}
			}
			if (!App.controller.ChatRoom.Socket.can_lc_msg_Out(msgIn)){
			}
		}
		
		const do_lc_send_finish_viewer = () => {
			const msgIn = {
					name: "MSG_CHAT_FINISH_VIEWER",
					val:  {
						clientId 	: initialeValues.clientId,
						userCall	: initialeValues.userCall
					}
			}
			if (!App.controller.ChatRoom.Socket.can_lc_msg_Out(msgIn)){
			}
		}
		
		const do_lc_send_stop_channel = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNsoGroupMarkKinesis", {"isStop": true,"grpId" : initialeValues.obj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_stop_video, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_stop_video = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
//				App.controller.ChatRoom.Chat.do_lc_show_chat_header_init();
//				App.controller.ChatRoom.Group.do_lc_event_click();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}


		const do_lc_get_random_name = () => new Date().getTime() + "_" + App.data.user.login + "_" + initialeValues.obj.login;

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
		
		const do_lc_build_group_current_call_kinesis = ({group, typ, userCall}, call) => {
			if(!App.data.lstGroupKinesis) App.data.lstGroupKinesis = {};
			if(!App.data.lstGroupKinesis[group]){
				App.data.lstGroupKinesis[group] = {group, typ, userCall, call};
			}else{
				App.data.lstGroupKinesis[group].call = call;
			}

			App.controller.ChatRoom.Chat.do_lc_show_chat_header_init();
			App.controller.ChatRoom.Group.do_lc_event_click();
		}

	};

	return ChatWebRTC;
});