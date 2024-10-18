define([
	// 'group/nso_chatroom/ctrl/Webcam',
	// 'group/nso_chatroom/ctrl/Recorder',
	'prjImageViewer/viewer',
	'group/nso_chatmini/ctrl/ChatRoomSocket',
	'group/nso_chatmini/ctrl/ChatRoomMember', //cai nay minh can dung  load lstmember + avatar for msg show

	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Group_Info.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Main.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Content.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Footer.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Header.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Content_Msg_Item.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Content_Msg_Read.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Content_Msg_Read_Item.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Chat_Content_Msg_Read_Item_Content.html'
	],
	function(
			// Webcam,
			// Recorder,
			Viewer,
			ChatRoomSocket,
			ChatRoomMember,
			
			ChatRoom_Tab_Group_Info,
			ChatRoom_Tab_Chat_Main,
			ChatRoom_Tab_Chat_Content,
			ChatRoom_Tab_Chat_Footer,
			ChatRoom_Tab_Chat_Header,
			ChatRoom_Tab_Chat_Content_Msg_Item,
			ChatRoom_Tab_Chat_Content_Msg_Read,
			ChatRoom_Tab_Chat_Content_Msg_Read_Item,
			ChatRoom_Tab_Chat_Content_Msg_Read_Item_Content
	){

	const ChatRoomChat 	= function (header, content, footer) {
		var	  pr_div_content = content;
		
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const pr_SERVICE_CLASS		= "ServiceMsgMessage"; //to change by your need
		const pr_SV_LIST			= "SVChatLst";
		const pr_SV_DEL_LIST		= "SVChatLstById";
		const pr_SV_MEMBER_ROLE		= "SVMemberRole";
		const pr_SV_NEW				= "SVChatNew";
		const pr_SV_NEW_WITH_IMG	= "SVChatNewWithImg";
		const pr_SV_DEL				= "SVChatDel";
		const pr_SV_HIDE			= "SVChatHide";
		const pr_SV_GET_TOTAL 		= "SVCountTotal";
		const pr_SV_NEW_HISTORY		= "SVChatHistoryNew";
		const pr_SV_LST_HISTORY		= "SVChatHistoryLst";

		const pr_SERVICE_CLASS_GROUP= "ServiceNsoGroup"; //to change by your need
		const pr_SV_MOD_GROUP		= "SVNsoGroupModRoom";
		//------------------variable pagination post------------------------------------------------------
		const pr_MSG_NUMBER 		= 100;

		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;

		const pr_TYP_CHAT_USER		= 1;
		const pr_TYP_CHAT_GROUP		= 2;
		const pr_TYP_CHAT_CONTACT	= 3;

		const pr_KEY_ENTER 			= 13;
		const pr_KEY_ENTER_CTRL		= 10;
		const pr_KEY_ENTER_ALT		= 10;

		const pr_member_lev_manager 			= 0;

		const pr_number_msg_closest				= 10;

		const CHAT_GROUP_PRIVATE				= 401;
		const CHAT_GROUP_PUBLIC					= 402;
		
		var pr_ENT_TPY_GROUP        			= 40000;

		var pr_SEARCH_KEY			= "";
		var catIds					= "";
		var pr_TYP_POST  			= 101;
		var multiLang               = "";
		const pr_STAT_VALIDATED			= 2;
		const pr_STAT_VALIDATED_HIDDEN	= 3;
		const pr_NUMBER					= 20;
		var ios 					= null;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_User 			= null;
		var pr_crt_Socket			= null;
		var pr_ctr_Member		= null;
		
		var pr_LST_INPUT_FILE		= [];
		var pr_index_msg_search_min = 0;
		var pr_old_msg_search 		= "";

		var pr_TIME_REFRESH			= 10 * 60 * 1000;

		var pr_initialeValues_to_search = {};

		var intervalLstHistory		= null;
		var self 					= null;
		var avatarGr 				= {files: []};
		var camMode 				= "user";

		const initialeValues = {
				chatSimple 		: true,
//				isLoadMore 		: false,
				obj		   		: null,
				currentTyp 		: pr_TYP_CHAT_GROUP,
				lstMsgCurrent 	: [],
				begin			: 0,
				members			: {},
				isOwner			: false,
				isGroupUser		: false,
		}
		
		var pr_sound_chat_off = {
		}
		
		var webcam = null;
		
		var gumStream = null;				//stream from getUserMedia()
		var rec = null;							//Recorder.js object
		var input = null; 	
		var pr_interval_recording = null;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MiniChat.Main;
			pr_ctr_Person 			= App.controller.MiniChat.Person;

			tmplName.CHATROOM_TAB_GROUP_INFO							= "Mini_ChatRoom_Tab_Group_Info";
			tmplName.CHATROOM_TAB_CHAT_MAIN				     			= "Mini_ChatRoom_Tab_Chat_Main";
			tmplName.CHATROOM_TAB_CHAT_CONTENT							= "Mini_ChatRoom_Tab_Chat_Content";
			tmplName.CHATROOM_TAB_CHAT_FOOTER							= "Mini_ChatRoom_Tab_Chat_Footer";
			tmplName.CHATROOM_TAB_CHAT_HEADER							= "Mini_ChatRoom_Tab_Chat_Header";
			tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_ITEM					= "Mini_ChatRoom_Tab_Chat_Content_Msg_Item";
			tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ					= "Mini_ChatRoom_Tab_Chat_Content_Msg_Read";
			tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM			= "Mini_ChatRoom_Tab_Chat_Content_Msg_Read_Item";
			tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM_CONTENT	= "Mini_ChatRoom_Tab_Chat_Content_Msg_Read_Item_Content";

			self 					= this;
			self.var_grp_info		= null;
			
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO							, ChatRoom_Tab_Group_Info);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_MAIN				    			, ChatRoom_Tab_Chat_Main);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT							, ChatRoom_Tab_Chat_Content);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_FOOTER							, ChatRoom_Tab_Chat_Footer);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_HEADER							, ChatRoom_Tab_Chat_Header);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_ITEM					, ChatRoom_Tab_Chat_Content_Msg_Item);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ					, ChatRoom_Tab_Chat_Content_Msg_Read);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM			, ChatRoom_Tab_Chat_Content_Msg_Read_Item);
			tmplCtrl				.do_lc_put_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM_CONTENT	, ChatRoom_Tab_Chat_Content_Msg_Read_Item_Content);
			
			try{
				pr_ctr_Member	= new ChatRoomMember(this);
				
				pr_crt_Socket		= new ChatRoomSocket(this);
				pr_crt_Socket		.do_lc_init_SocketChat(App.data.user.login);
			}catch(e){
				console.log(e);
			}
		}
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(obj){      //typChat user or group         
			try{
				// ios = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
				// if(!obj)	return false;
				// webcam = Webcam;
				
				let typChat = obj.typChat;
				
				do_lc_init_new_chat(obj, typChat); 
				do_lc_build_page(obj.id);
				
				self.var_grp_id 	= obj.id;
				self.var_grp_info 	= obj;

				$(pr_div_content + " .off-chat").off("click").on("click", () => {
					$(pr_div_content).html("");
					this.do_lc_close();
				})
				
				$(pr_div_content + " .minimize-chat").off("click").on("click", () => {
					self.do_lc_show_minimize();
				})

				$(pr_div_content + " .header-chat").off("click").on("click", () => {
					self.do_lc_show_maximize();
				}) 
				
				$(pr_div_content + " .open-tab-chat").off("click").on("click", () => {
					window.open("./view_prj_chat_room.html?grpId="+obj.id, "_blank").focus();
				})
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chat", "Mini_ChatRoomChat", "do_lc_show", e.toString()) ;
			}
		};

		this.can_lc_closed = false;
		this.do_lc_close = function(){  
			if (self.can_lc_closed ) return;

			if (pr_crt_Socket){			
				var msg_Grp_End = {name : "MSG_CHAT_GROUP_END", val :{group: self.var_grp_id}};
				pr_crt_Socket.can_lc_msg_Out (msg_Grp_End);
				pr_crt_Socket.do_lc_closeSocket();
			}
			
			self.can_lc_closed = true;
			
			//---hide----
			pr_ctr_Person.do_lc_close_miniChat (self);	
				
		}
		
		this.do_lc_show_minimize = function (){
			$(pr_div_content +  " .div_chat_content ").hide();
		}
		
		this.do_lc_show_maximize = function (){
			$(pr_div_content +  " .div_chat_content ").show();
		}
		
		const do_lc_init_new_chat = (obj, typChat) => {
			//-----exit old------------------------------------------------------
			if (initialeValues.obj){
				var msg_Grp_End = {name : "MSG_CHAT_GROUP_END", val :{group: obj.id}};
				pr_crt_Socket.can_lc_msg_Out (msg_Grp_End);
			}

			//----add user to grp--------------------------------------------------
			var msg_Grp_Begin = {name : "MSG_CHAT_GROUP_BEGIN", val :{group: obj.id}};
			pr_crt_Socket.can_lc_msg_Out (msg_Grp_Begin);


			//-----------------------------------------------------------------------
			initialeValues.lstMsgCurrent	= [];
			initialeValues.obj				= obj;
			initialeValues.begin 			= 0;
			initialeValues.isGroupUser 		= obj.typ01 === pr_TYP_MSG_PRIVATE;
			pr_initialeValues_to_search		= initialeValues;
			pr_index_msg_search_min			= 0;

		}

		this.do_lc_push_msg_socket = function(msg){
			if(msg){
				let me_id 			= App.data.user.id;
				if(!initialeValues.obj){
					//khi thêm 1 msg của 1 user vào chat thì remove hết avatar read của user này
					//Ví dụ Trang thi remove icon read của Trang ở trên trước khi add msg của Trang
					$(pr_div_content + " .div_avatar_" + msg.uId).remove(); 

					do_lc_play_sound_move(msg.entId);
					pr_ctr_Person.do_lc_push_newMSG(msg);
					return;
				}
				let groupId 		= initialeValues.obj.id;

				let isCurrentChat 	= (groupId == msg.entId);
				if(isCurrentChat){
					do_lc_pushTo_zoneChat(msg);
					if(msg.files && msg.files.length > 0) $('#btn_refresh_doc').trigger("click", [true]); 

					let isCurrentWhoChat = (me_id == msg.uId);
					if(!isCurrentWhoChat){
						//khi thêm 1 msg của 1 user vào chat thì remove hết avatar read của user này
						//Ví dụ Trang thi remove icon read của Trang ở trên trước khi add msg của Trang
						$(pr_div_content + " .div_avatar_" + msg.uId).remove(); 

						pr_ctr_Person.do_lc_push_newMSG(msg, !isCurrentWhoChat);
						do_lc_play_sound_move(msg.entId);

						
					}

				}else{
					pr_ctr_Person.do_lc_push_newMSG(msg);
					do_lc_play_sound_move(msg.entId);
				}
			}
		}

		var do_lc_play_sound_move = function(entId) {
			let mute = pr_sound_chat_off[entId];
			
			if (!mute) {
				try {
					var x = document.getElementById("audio_new_msg"); 
					x.play();
					x.stop();
				} catch (error) {
				}
			}
		}

		this.do_lc_del_msg_socket = function(grpId, msgId){
			if(grpId && msgId){
				let me_id 			= App.data.user.id;
				if(!initialeValues.obj){
					return;
				}	
				if (grpId != initialeValues.obj.id) return;
				$(pr_div_content + " .li_msg_item_append_"+msgId).remove();
			}
		}
		
		//------------------------------------------------------------------------------------------------------------------
		this.do_lc_bind_list_online = () => {
			if(initialeValues.currentTyp === pr_TYP_CHAT_GROUP)	return;
			if(!initialeValues.obj)						return;

			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE
			const isOnline 	= lstOnline.includes(initialeValues.obj.name);

			do_lc_show_chat_header({isOnline})
		}


		const do_lc_pushTo_zoneChat = function(msg){
			if(msg.uId == App.data.user.id){
				msg.forMe 				    = true;
				msg.dataUser 			    = App.data.user;
				let avatar                  = App.data.user.per.files;
				if(avatar) msg.dataUser.avatar 	= App.data.user.per.files[0];

			} else {
				let memSend = initialeValues.members[msg.uIDSend];
				msg.dataUser = {login: msg.uNameSend, id: msg.uIDSend, avatar : memSend.mem.avatar?memSend.mem.avatar : null};
			}

			App.data.msgIdCurrent 	= msg.id;
			App.data.msgCurrent		= msg;

			initialeValues.lstMsgCurrent.unshift(msg);
			do_lc_show_chatroom_append(msg);
		}


		const do_lc_show_form_chat = function(){
			$(pr_div_content).find($(".div_chat"))	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_MAIN	, {}));

			if(initialeValues.currentTyp == pr_TYP_CHAT_USER)	initialeValues.obj.name = initialeValues.obj.login;
			const isOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(initialeValues.obj.name);
			$(pr_div_content + " .div_chat_main").show();

			do_lc_show_chat_header({isOnline});
			do_lc_show_chat_footer();
		}

		this.do_lc_show_chat_header_init = () => {
			do_lc_show_chat_header({});
			
		}
		
		const do_lc_show_chat_header = ({isOnline}) => {
			const isMe = initialeValues.members[App.data.user.id];
			if(isMe && (isMe.typ === pr_member_lev_manager) ){
				initialeValues.isManager = true;
			} else {
				initialeValues.isManager = false;
			}

			let memIds = Object.keys(initialeValues.members);
			let countMan = 0;
			initialeValues.canDelete = false;
			for(let i in memIds){
				let user = initialeValues.members[memIds[i]];
				if(user.typ == pr_member_lev_manager) countMan ++;
			}
			if(countMan < 2) initialeValues.canDelete = true;

			let objChatDefine = {user : initialeValues.obj, typChat : initialeValues.currentTyp};
			if(initialeValues.isGroupUser){
				if(Object.keys(initialeValues.members).length > 0){
					let le = Object.keys(initialeValues.members);
					const userChat = le['length'] > 1? Object.values(initialeValues.members).find(m => m.uId !== App.data.user.id) : initialeValues.members[App.data.user.id];
					if(userChat){
						userChat.name = userChat.mem.login;
						isOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(userChat.name);
						objChatDefine = {user : userChat, typChat : pr_TYP_CHAT_USER};
					} else{
						objChatDefine = null;
						return;
					}					
				}
			}
			
			$(pr_div_content).find($(".div_chat_header")).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_HEADER	, {isMasterKinesis : initialeValues.isMasterKinesis ,isCallKinesis : initialeValues.isCallKinesis, canDelete :initialeValues.canDelete, isManager : initialeValues.isManager, isOnline, ...objChatDefine}));
			
			do_lc_bind_event_chat_header();
		}

		const initValueCall = {
				meetingResponse : null,
				attendeeResponse: null,
				callCreated		: false,
		}
		const do_lc_bind_event_chat_header = () => {
			$(pr_div_content + " .btn_clear_chat").off("click").on("click", function(){
				do_lc_show_chatroom({user: initialeValues.obj, lstMessage: [], hasMsg: true});
				do_lc_deletet_content_chat();
			});

			$(pr_div_content + " .btn_view_info").off("click").on("click", function(){
//				$(pr_div_content + " .div_chat_main, #div_info").toggle();
				do_lc_get_total_msg(initialeValues);
			});

			$(pr_div_content + " .btn_create_video").off("click").on("click", () => {
				pr_ctr_ChatWebRTC.do_lc_show(initialeValues);
			});
			
			$(pr_div_content + " .btn_call_video").off("click").on("click", () => {
				window.open ("https://meet.google.com/new", "_blank");
			});

			$(pr_div_content + " .btn_delete_group").off("click").on("click", () => {
				do_lc_del_group();
			})

			$(pr_div_content + " .btn_show_files").off("click").on("click", () => {
				pr_ctr_Doc.do_lc_get_files(initialeValues.obj, initialeValues.currentTyp);
			});
			
			$(pr_div_content + " .btn-sound").off("click").on("click", () => {
				$(pr_div_content + " .btn-sound").addClass("hide");
				$(pr_div_content + " .btn-sound-off").removeClass("hide");
				do_lc_turn_off_sound();
			});
			
			$(pr_div_content + " .btn-sound-off").off("click").on("click", () => {
				$(pr_div_content + " .btn-sound-off").addClass("hide");
				$(pr_div_content + " .btn-sound").removeClass("hide");
				do_lc_turn_on_sound();
			});

			$(pr_div_content + " .btn_out_group").off("click").on("click", () => {
				const isMe = initialeValues.members[App.data.user.id];
				if(isMe){
					if(isMe.typ === pr_member_lev_manager){
						do_lc_owner_out_group();
					} else {
						do_gl_init_msgbox_confirm($.i18n("prj_chat_out_group_msg_confirm"), do_lc_out_group);
					}
				}
			})

		}

		const do_lc_del_list_msg_response = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success ($.i18n('common_del_success_msg') );
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}


		const do_lc_get_total_msg = function(initialeValues){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_TOTAL, {id : initialeValues.obj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_msg_total, [initialeValues]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_get_msg_total = function(sharedJson, initialeValues){
			if(can_gl_AjaxSuccess(sharedJson)) {
				initialeValues.obj.countMsg = sharedJson.res_data;
				do_lc_get_total_file(initialeValues);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_get_total_file = function(initialeValues){
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceTpyDocument", "SVTpyDocumentCountFileChat", {id : initialeValues.obj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_file_total, [initialeValues]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_get_file_total = function(sharedJson, initialeValues){
			if(can_gl_AjaxSuccess(sharedJson)) {
				initialeValues.obj.countFile = sharedJson.res_data;
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_update_chat_group = function() {
			let ent = {
				id: initialeValues.obj.id,
				files: avatarGr.files,
				typ02: parseInt($(pr_div_content + " .chat_group_typ").val(), 10),
				name: $(pr_div_content + " .chat_group_name").val()
			}
			if (avatarGr.files.length > 0) {
				ent.val01 = {img: decodeURIComponent(avatarGr.files[0].path01)}; 
			}
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_MOD_GROUP, {obj: JSON.stringify(ent)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_update_chat_group_success, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_update_chat_group_success = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					initialeValues.obj = data;
					$(pr_div_content + " .chat-item[data-id='"+data.id+"']").find("img").attr("src" , data.avatar.urlPrev);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_show_chat_footer = () => {
			$(pr_div_content).find($(".div_chat_footer")).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_FOOTER	, {simpleChat : initialeValues.chatSimple}));
			pr_ctr_Main.do_lc_show_emoji(pr_div_content);
			do_lc_bind_event_footer();
		}

		const do_lc_send_msg_chat = (lstFile, audio) => {
			$(pr_div_content + " .div_chat_list_img .btn-chat-delete-img").remove();
			
			var htmlImg   		= $(pr_div_content + " .div_chat_list_img").html() || "";
			if (htmlImg.length>0){
				htmlImg			= htmlImg.replace(/div-chat-img-parent/g, "div-chat-img"); //replace class to show
				htmlImg			= htmlImg.replace(/chat-insert-img/g	, "files_content_chat")
				htmlImg 		= "<div class='row'>"+htmlImg+"</div>";
			}
			
			//----format content msg------
			var   cont		=  initialeValues.chatSimple?   $(pr_div_content + " .inp_msg").html() || "" :  $(pr_div_content + " .inp_msg").val() || "";
				
			cont			= cont.trim();
			while (cont.indexOf("<br>") == 0){
				cont = cont.substring(4, cont.length);
			}
			if(cont.length > 3){
				while (cont.lastIndexOf("<br>") == cont.length - 4){
					cont = cont.substring(0, cont.length - 4);
				}
			}
			
			const urlify = function(text) {
		        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;   
				return text.replace(urlRegex, function(url) {
					return '<a href="' + url + '" target="_blank">' + url + '</a>';
				})
			}
			
			const do_lc_check_url = function(text){
				let href = text.includes("href");
				if(href) return true;
				return false;
			}
			
			let isUrl = do_lc_check_url(cont);
			if(!isUrl) cont = urlify(cont);
			
			//----build msg content
			if (!htmlImg || !htmlImg.length){
				const msg 		= audio? audio: cont;

				if((!msg || !msg.length) && !lstFile.files.length)	return false;
				do_lc_send_msg(msg, lstFile.files);
			} else {

				const msg 		= htmlImg + "<br>" + cont;
				//do_lc_send_msg_with_img(msg, lstFile.files, "<div class=\"div-chat-img-parent\">");
				do_lc_send_msg_with_img(msg, lstFile.files);
			}
		}

		const do_lc_send_msg_callback = (lstFile) => {
			const msg 		= $(pr_div_content + " .inp_msg").html() || "";

			if((!msg || !msg.length) && !lstFile.files.length)	return false;
			do_lc_send_msg(msg, lstFile.files);
		}

		const do_lc_bind_event_footer = (simpleChat) => {
			!initialeValues.chatSimple && App.SummerNoteController.do_lc_show(pr_div_content + " .div_chat", {height : 100}, false, );//text editor

			const fileData  = { files: [] };
			do_lc_bind_event_fileInput(fileData);

			$(pr_div_content + " .btn_send_msg").off("click").on("click", function(){
				if (rec && rec.recording){
					stopRecording();
					return;
				};

				const lstFile 	= fileData;
				do_lc_send_msg_chat(lstFile);	

				$(pr_div_content + " .inp_msg").html('');
				$('.chats-text-cont div').remove();	
				//enter function send
			})

			$(pr_div_content + " .btn_send_like_direct").off("click").on("click", function(){
				const lstFile 	= fileData;
				const msg 		= "&#128077;";
				do_lc_send_msg(msg, lstFile.files);
				//enter function send
			})

			$(pr_div_content + " .inp_msg").off("keypress").on("keypress", function(e){
				if (e.keyCode == pr_KEY_ENTER && e.shiftKey){
					return;
				}

				if (e.keyCode == pr_KEY_ENTER){
					e.preventDefault();
					const lstFile 	= fileData;
					do_lc_send_msg_chat(lstFile);

					$(pr_div_content + " .inp_msg").html('');
//					$(pr_div_content + " .inp_msg").height("35px");

					$('.chats-text-cont div').remove();	
				} 
			})

			$(pr_div_content + " .btn_add_file").off("click").on("click", function() {
				const isHide 		= $(pr_div_content + " .div_inp_file").hasClass("hide");
				$(pr_div_content + " .div_inp_file")	.toggleClass("hide");
				if(isHide){
					$(pr_div_content + " .div_inp_file form")	.click();
				} else {
					pr_LST_INPUT_FILE[0]	.removeAllFiles();
					fileData.files.length 	= 0;
				}
			})

			$(pr_div_content + " .inp_msg").bind("paste", function(event){
				var items = (event.clipboardData || event.originalEvent.clipboardData).items;
				for (index in items) {
					var item = items[index];
					if (item.kind === 'file') {
						$(pr_div_content + " .div_msg_with_img")	.removeClass("hide");

						var blob = item.getAsFile();
						do_lc_up_file_inline(pr_div_content + " .div_chat_list_img", blob);
						/*						
						var reader = new FileReader();
						reader.onload = function(e){
							var image = `<img src='${e.target.result}' class='chat-insert-img'>`;
				            $(pr_div_content + " .div_chat_list_img").append(image);

							pr_HTML_IMG_INLINE += image.replace("chat-insert-img", "chat-display-img");
							pr_LST_IMG_INLINE.push(blob);
						}
						reader.readAsDataURL(blob);*/
					}
				}
			} );

			$(pr_div_content + " .btn_trans_simple").off("click").on("click", function() {
				if(initialeValues.chatSimple)	return;
				initialeValues.chatSimple = true;
				do_lc_show_chat_footer();
			})

			$(pr_div_content + " .btn_trans_summer").off("click").on("click", function() {
				if(!initialeValues.chatSimple)	return;
				initialeValues.chatSimple = false;
				do_lc_show_chat_footer();
				$(pr_div_content + " .div_table_emoji").parent().addClass("d-none");
				$(pr_div_content + " .btn_add_file").parent().addClass("d-none");
			})

			$(pr_div_content + " .btn_add_emoji").on("click", function() {
				$(pr_div_content + " .div_table_emoji")	.toggleClass("d-none");
			})

			$(pr_div_content + " .inp_msg").off("input").on("input", function(e) {
				var tmp = $(pr_div_content + " .inp_msg").find('img');
				if (tmp.length > 0){
					for (let i = 0; i<tmp.length; i++){
						if (!tmp.get(i).src.includes("emoji")){
							$(pr_div_content + " .inp_msg").find('img').get(i).remove();
						}
					}
				}
			})

			$(pr_div_content + " .inp_msg").focus(function() {
				do_lc_read_chat();
			});

			$(pr_div_content + " .btn_capture").off("click").on("click", function() {
				if (!ios) {
					do_lc_show_webcam(() => {
						$(pr_div_content + " .div_inp_capture")	.toggleClass("hide");
					});
				} else {
					do_lc_show_webcam();
					// // take snapshot and get image data
					webcam.snap( function(data_uri) {
						var file = dataURLtoFile(data_uri, 'photo.jpeg');
						do_lc_up_file_inline(pr_div_content + " .div_chat_list_img", file);
						$(pr_div_content + " .div_msg_with_img")	.removeClass("hide");
					});
				}
			})

			$(pr_div_content + " .switch_cam").off("click").click(() => {
//				if (camMode == "user") {
//					webcam.set('constraints',{
//						facingMode: "environment"
//					});
//					camMode = "environment";
//				} else {
//					webcam.set('constraints',{
//						facingMode: "user"
//					});
//					camMode = "user";
//				}
//				webcam.attach( '#my_camera' );
				
				webcam.reset();
				if (camMode == "user") {
					webcam.set('constraints',{
						facingMode: "environment"
					});
					camMode = "environment";
				} else {
					webcam.set('constraints',{
						facingMode: "user"
					});
					camMode = "user";
				}
				webcam.attach( '#my_camera' );
				
				$(pr_div_content + " .my_camera").show();
				$(pr_div_content + " .photo_res").removeAttr("src");
				$(pr_div_content + " .take_sc").removeClass("icon-disabled");
				$(pr_div_content + " .trash").addClass("icon-disabled");
				$(pr_div_content + " .send_sc").addClass("icon-disabled");
			})

			$(pr_div_content + " .take_sc").off("click").click(()=> {
				// take snapshot and get image data
				webcam.snap( function(data_uri) {
					$(pr_div_content + " .my_camera").hide();
					// display results in page
					$(pr_div_content + " .photo_res").show();
					$(pr_div_content + " .photo_res").attr("src", data_uri);
				});

				$(pr_div_content + " .take_sc").addClass("icon-disabled");
				$(pr_div_content + " .trash").removeClass("icon-disabled");
				$(pr_div_content + " .send_sc").removeClass("icon-disabled");
			});

			$(pr_div_content + " .trash").off("click").click(()=> {
				$(pr_div_content + " .photo_res").hide();
				$(pr_div_content + " .my_camera").show();
				

				$(pr_div_content + " .take_sc").removeClass("icon-disabled");
				$(pr_div_content + " .trash").addClass("icon-disabled");
				$(pr_div_content + " .send_sc").addClass("icon-disabled");
			});

			$(pr_div_content + " .close_sc").off("click").click(()=> {
				webcam.reset();
				$(pr_div_content + " .photo_res").hide();
				$(pr_div_content + " .div_inp_capture")	.toggleClass("hide");
			});

			$(pr_div_content + " .send_sc").off("click").click(()=> {
				//
				var file = dataURLtoFile($(pr_div_content + " .photo_res").attr("src"), 'photo.jpeg');
				do_lc_up_file_inline(pr_div_content + " .div_chat_list_img", file);
				$(pr_div_content + " .div_msg_with_img")	.removeClass("hide");

				$(pr_div_content + " .trash" ).trigger("click");

				webcam.reset();
				$(pr_div_content + " .div_inp_capture")	.toggleClass("hide");
			});
			
			$(pr_div_content + " .btn_recorder").off("click").on("click", function() {
				startRecording()
			})


		}

		const dataURLtoFile = (dataurl, filename) => {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), 
				n = bstr.length, 
				u8arr = new Uint8Array(n);
				
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, {type:mime});
		}
		
		const do_lc_show_webcam = (callback) => {
			// Configure a few settings and attach camera
			webcam.set({
				width: 320,
				height: 240,
				image_format: 'jpeg',
				jpeg_quality: 90
			});
			webcam.attach( '#my_camera' , callback);
			$(pr_div_content + " .my_camera").show();
		}
		
		const do_lc_effect_message_read = () => {
			pr_ctr_Person.do_lc_effect_message_read_by_chat_room(initialeValues);
		}

		const do_lc_up_file_inline = function(divListImg, file){
			let ref = new FormData();
			ref.append('sv_class'	, 'ServiceTpyDocument');
			ref.append('sv_name'	, 'SVTpyDocumentNewPublic');
			ref.append('typ01'		, 1);
			ref.append('typ02'		, 1);
			ref.append(`file${0}`, file);

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_upload_file_inline, [divListImg]));

			let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax_form(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_upload_file_inline = function(sharedJson, divListImg){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data && data.length){
					for(let img of data){
						var image = `<div class='div-chat-img-parent'><img src='${img.path01}' class='chat-insert-img' data-path='${img.path01}'><i class='btn-chat-delete-img fa fa-times'></i></div>`;
						$(divListImg).append(image);
					}
					do_lc_bind_event_img_inline();
				}
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
			}
		}

		const do_lc_bind_event_img_inline = function () {
			$(pr_div_content + " .btn-chat-delete-img").off("click").on("click", function() {
				$(this).closest('.div-chat-img-parent').remove();
				if ($(pr_div_content + " .div_chat_list_img").html() == "") $(pr_div_content + " .div_msg_with_img").addClass("hide"); 
			})
		}

		const do_lc_bind_event_fileInput = (fileData) => {
			const options 	= {
					fileinput	: {
						maxFiles : 20,
						param	: {
							parType : 40000,
							parId   : initialeValues.obj.id,
							filenameKept: 1
						}
					},//option here
					obj			: fileData,
			}
			pr_LST_INPUT_FILE = do_gl_init_fileDropzone($(pr_div_content + " .div_chat"), options);
		}

		const do_lc_build_page = function(grpId){
			do_lc_get_relation_user_group(grpId);
		}

		this. do_lc_get_content_chat_bg = function(doScroll){ //sau khi call api thi se gan lst msg vao initialeValues de show ra
			const {obj} 	= initialeValues;
			const msgTyp 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;

			const dateLast 	= initialeValues.lstMsgCurrent.length ? initialeValues.lstMsgCurrent[initialeValues.lstMsgCurrent.length - 1].dt : null;

			const params 	= {entId: obj.id, msgTyp, begin : initialeValues.begin, nb: pr_MSG_NUMBER, dateLast};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST, params);	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, self.do_lc_getMsg_response_bg, [doScroll]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		this. do_lc_getMsg_response_bg = function(sharedJson, doScroll){
			if(can_gl_AjaxSuccess(sharedJson)) {
				try {
					
					initialeValues.lstMsgCurrent = [];
					self.do_lc_getMsg_response(sharedJson, doScroll);
					
				} catch(e) {
				}
			}
		}

		this. do_lc_get_content_chat = function(doScroll){ //sau khi call api thi se gan lst msg vao initialeValues de show ra
			const {obj} 	= initialeValues;
			const msgTyp 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;

			const dateLast 	= initialeValues.lstMsgCurrent.length ? initialeValues.lstMsgCurrent[initialeValues.lstMsgCurrent.length - 1].dt : null;

			const params 	= {entId: obj.id, msgTyp, begin : initialeValues.begin, nb: pr_MSG_NUMBER, dateLast};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST, params);	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, self.do_lc_getMsg_response, [doScroll]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		this. do_lc_getMsg_response = function(sharedJson, doScroll){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const {obj} 	= initialeValues;
				let data 		= sharedJson[App['const'].RES_DATA] || [];
				
				let isShowLoadMore = data.length == 0 || data.length < pr_MSG_NUMBER? false : true;
				
				let userData 	= {}, user_me_id = App.data.user.id, user_you_id = obj.id;

				data = do_build_info_and_filter(data);
				data = do_build_avatar_user(data);

				initialeValues.lstMsgCurrent 	= [...initialeValues.lstMsgCurrent, ...data];

				App.data.msgIdLast  			= 0;
				App.data.msgIdCurrent  			= 0;
				if (initialeValues.lstMsgCurrent.length > 0) {
					App.data.msgIdCurrent  		= initialeValues.lstMsgCurrent[0].id;
					App.data.msgCurrent  		= initialeValues.lstMsgCurrent[0];
				}

				userData 	= {user: obj, lstMessage: [...initialeValues.lstMsgCurrent].reverse(), hasMsg: initialeValues.lstMsgCurrent.length ? true: false, isShowLoadMore : isShowLoadMore};

				do_lc_show_chatroom(userData, doScroll);

				//-----get lst history---------------------------------------------------
				// Get historyLst from local
				let canCallAjax = true;
				try {
					
					canCallAjax = false;
					do_lc_lst_history_chat_success(data);

					// Call bg reload new data
					do_lc_lst_history_chat();
					
				} catch (e) {
				}

				if (canCallAjax) do_lc_lst_history_chat();

				if (intervalLstHistory != null) {
					clearInterval(intervalLstHistory);
				}
				intervalLstHistory = setInterval(() => {
					do_lc_lst_history_chat();
				}, pr_TIME_REFRESH);

			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		

		const do_build_info_and_filter = (data) => {
			var result = [];
			var user_me_id = App.data.user.id;
			data.map(o => {
				if(o.uId == user_me_id)	o.forMe = true;
				o.body = App.network.req_lc_DecodeUTF8 (o.body);
				if (o.info){
					try{
//						o.info = App.network.req_lc_DecodeUTF8 (o.info);
						o.info = JSON.parse(o.info);
						if (o.info) {
							o.files = o.info.files;
							o.hide	= o.info.hide;
						}
						
						if (!o.hide) result.push(o);
						else
							if (!o.hide[user_me_id]) result.push(o);
						
					}catch(e){
					}
				}
				
				return o;
			})
			
			return result;
		}

		const do_build_avatar_user = (data) => {

			if (!App.data["lstGrpMember_"+ self.var_grp_id] || App.data["lstGrpMember_"+ self.var_grp_id] == null) {
				setTimeout (do_build_avatar_user, 500, data);
				return;
			}

			for(let i in data){
				try{
					let userId = data[i].dataUser["id"];

					let user = App.data["lstGrpMember_"+ self.var_grp_id][userId];				

					if(user && user.mem.avatar){
						data[i].dataUser.avatar = user.mem.avatar;
					}
				}catch(e){}
			}
			return data;
		}

		const do_lc_show_chatroom_append = function(msg){
			$(pr_div_content + " .ul_lst_msg_append").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_ITEM	, msg));
			
			do_lc_bind_event_chat_content();
			do_lc_scrollBottom_toChat();
			
//			initialeValues.isLoadMore = false;
		}
		
		const do_lc_show_chatroom = function(userData, doScroll){
			$(pr_div_content + " .div_chat_msg")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT	, userData));
			
			do_lc_bind_event_chat_content();
			do_lc_read_chat();
			
			if (doScroll == undefined || doScroll == true) do_lc_scrollBottom_toChat();
		}

		
		const do_lc_bind_event_chat_content = () => {

			$(pr_div_content+" .message-item").off("click").on("click", function() {
				$(this).find(".dropdown").removeClass('hide');
			})

			$(pr_div_content +" .content-reponse").off('click').on('click', function() {
				let {user} = $(this).data();
				if(user) {
					if(initialeValues.chatSimple)  $(pr_div_content + " .inp_msg").append(`<a href="javascript:void(0)">@${user}</a>&nbsp;`);
					if(!initialeValues.chatSimple) $(pr_div_content + " .inp_msg").summernote('code', `<span style="color: #556ee6;">@${user}</span><span>&nbsp;</span>`);
				}
			})
			
			$(pr_div_content + " .content-copy").off("click").on("click", function() {
				const {body} = $(this).data();
				body && do_gl_copyToClipboard(body);
			})

			$(pr_div_content + " .content-hide").off("click").on("click", function() {
				const {id, dt, grptyp, grpid } = $(this).data();
				$(this).closest(".message-item").remove();
				id && do_lc_hide_msg(id, dt, grptyp, grpid)
			})

			$(pr_div_content + " .content-delete").off("click").on("click", function() {
				const {id, dt, grptyp, grpid } = $(this).data();
				$(`#li_msg_item_append_${id}`).remove();
				id && do_lc_del_msg(id, dt, grptyp, grpid)
			})
			

			$(pr_div_content+ " .btn_load_more").off("click").on("click", function() {
				initialeValues.begin += pr_MSG_NUMBER;
				self.do_lc_get_content_chat(false);
//				initialeValues.isLoadMore = true;
			})

			$(pr_div_content + " .files_content_chat").off("click").on("click", function() {
				const {path} = $(this).data();
				let isImage = do_lc_check_image(path);
				if(isImage){
					const viewer = new Viewer(document.getElementsByClassName('div_chat_msg')[0], {
						filterImgClass: ['msg-body-forme', 'msg-body-other'],
						hide: function () {
							viewer.destroy();
						},
					});
				}else{
					window.open(path, "_blank");
				}
			})

//			$(".div-chat-img-parent").off("click").on("click", function() {	
//				let path01 = $(this).find('img').attr('src');
//				let isImage = do_lc_check_image(path01);
//				if(isImage){
//					App.MsgboxController.do_lc_show({
//						content 	: `<img src="${path01}" class="img_group_chat_popup"/>`,
//						autoclose	: true,
//						buttons		: "none",
//					});	
//				}else{
//					window.open(path, "_blank");
//				}
//			})
		}
		
		function do_lc_turn_off_sound () {
			pr_sound_chat_off[initialeValues.obj.id] = true;
		}
		
		function do_lc_turn_on_sound () {
			pr_sound_chat_off[initialeValues.obj.id] = false;
		}

		function do_lc_getExtension_from_name(filename) {
			var parts = filename.split('.');
			return parts[parts.length - 1];
		}


		function do_lc_check_image(filename) {
			var ext = do_lc_getExtension_from_name(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'bmp':
			case 'png':
			case 'PNG':
			case 'webp':
				//etc
				return true;
			}
			return false;
		}
		
		const do_lc_hide_msg = function(id, dt, grptyp, grpid){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_HIDE, {id, dt, grptyp, grpid});	

			let fSucces		= [];
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_del_msg = function(id){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_msg, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterDel_msg = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				//const a = 3;
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_send_msg_with_img = function(msg, files){
			var info = [];
			for (var i in files){
				var fi = files[i];
				var fObj = {"fId" : fi.id, "fName": fi.name, "fUrl" : fi.path01};
				info.push(fObj);
			}			
			var infoF		= info.length==0?null:'{"files": ' + JSON.stringify(info) + '}';		
			//---------------------------------------------------------------------------

			$(pr_div_content + " .btn_send_msg").prop('disabled', true);

			const typMsg 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
			const cond 		= {msg, typMsg, entId: initialeValues.obj.id, info : infoF};

			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_WITH_IMG, cond);	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSend_msg, [files]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_send_msg = function(msg, files){
			var info = [];
			for (var i in files){
				var fi = files[i];
				var fObj = {"fId" : fi.id, "fName": fi.name, "fUrl" : fi.path01};
				info.push(fObj);
			}			
			var infoF		= '{"files": ' + JSON.stringify(info) + '}';		
			//---------------------------------------------------------------------------

			$(pr_div_content + " .btn_send_msg").prop('disabled', true);

			const typMsg 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
			const cond 		= {msg, typMsg, entId: initialeValues.obj.id, info : infoF};

			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, cond);	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSend_msg, [files]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterSend_msg = function(sharedJson, files){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				$(pr_div_content + " .inp_msg")		.val("").focus();
				!initialeValues.chatSimple && $(pr_div_content + " .inp_msg").summernote('code', '');

				pr_LST_INPUT_FILE[0].files = pr_LST_INPUT_FILE[0].files.map(f =>{
					f.notDel = true; return f;
				});
				pr_LST_INPUT_FILE[0].removeAllFiles(true);
				files.length 		= 0;
				$(pr_div_content + " .div_inp_file")	.addClass("hide");
				$(pr_div_content + " .div_msg_with_img")	.addClass("hide");
				$(pr_div_content + " .div_chat_list_img").html("");
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}

			$(pr_div_content + " .btn_send_msg").prop('disabled', false); 
		}

		const do_lc_get_relation_user_group = function(grpId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_ROLE, {groupId: grpId?grpId:initialeValues.obj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getRole_response, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_getRole_response = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 		= sharedJson[App['const'].RES_DATA];
				if(data){
					if(data.stat === 1){
						do_gl_show_Notify_Msg_Error ($.i18n("common_err_notmember"));	
					} else if(data.stat === 2) {
						do_lc_show_form_chat();
						pr_ctr_Member.do_lc_show(initialeValues);	
					}
				} else {
					do_gl_show_Notify_Msg_Error ($.i18n("common_err_notmember"));	
				}
			} else {  
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_notmember"));	
			}
		}


		const do_lc_scrollBottom_toChat = function(){
			setTimeout(() => {
				const $divScroll = $(pr_div_content + " .ul_lst_msg .simplebar-content-wrapper");
				$divScroll.animate({ scrollTop: $divScroll.prop("scrollHeight")}, 300);
			}, 100);
		}

		const do_lc_read_chat = function(){
			do_lc_effect_message_read();
			if (initialeValues.lstMsgCurrent.length==0) return;

			let lstMsgUserCurrent = null;
			for (let i = 0; i < initialeValues.lstMsgCurrent.length; i++) {
				if (initialeValues.lstMsgCurrent[i].uId == App.data.user.id) {
					lstMsgUserCurrent = initialeValues.lstMsgCurrent[i].id;
					break;
				}
			};
			// condition avoiding send newHistory too much
			if (App.data.msgIdLast == lstMsgUserCurrent) return;

			// find last msg
			for (let i = 0; i < initialeValues.lstMsgCurrent.length; i++) {
				if (initialeValues.lstMsgCurrent[i].uId != App.data.user.id) {
					App.data.msgIdLast = initialeValues.lstMsgCurrent[i].id;
					break;
				}
			};
			let obj = {
					group	: initialeValues.obj.id,
					msg		: App.data.msgIdLast 
			};
			
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_HISTORY, {obj: JSON.stringify(obj)});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_read_chat_success, []));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_read_chat_success = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {

			}
		}
		//------------------------------------------------------------------------------------------------------------------------

		const do_lc_lst_history_chat = function(){
			if (App.data.msgIdLast == App.data.msgIdCurrent) {
				if (App.data.msgCurrent) 
					if (App.data.msgCurrent.lstHistory) 
						if (App.data.msgCurrent.lstHistory.length>5 || 
							App.data.msgCurrent.lstHistory.length>=App.data.lstGrpMember.length-2) return;
			}

			let obj = {
					group	: initialeValues.obj.id,
			};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LST_HISTORY, {obj: JSON.stringify(obj)});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_lst_history_chat_success, [App.data.msgIdCurrent]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_lst_history_chat_success = function(sharedJson, msgId){
			if(can_gl_AjaxSuccess(sharedJson)) {
				
				let lst 		= sharedJson[App['const'].RES_DATA] || [];
				if (lst.length>0) do_lc_filter_user_history(lst);

				App.data.msgIdLast  			= msgId;
			}
		}

		const do_lc_filter_user_history = function (lst) {
			let lstHistoryFilter = [];
			let lstMems = Object.assign({}, initialeValues.members);
			if (lstMems) {
				for (const key in lstMems) {
					lstMems[key] = 0;
				}
			}
			// find lstHistoryFilter (lọc và chỉ giữ lại mỗi user 1 history)
			if (lst && lst.length > 0) {
				lst.forEach((e) => {
					if (lstMems[e.uId] == 0) {
						lstHistoryFilter.push(e);
						lstMems[e.uId] = 1;
					}
				})
			}

			// mapping to lstMsgCurrent
			if (lstHistoryFilter  && lstHistoryFilter.length > 0) {
				initialeValues.lstMsgCurrent.forEach((e) => {
					e.lstHistory = [];
					lstHistoryFilter.forEach((e2) => {
						if (e.id == e2.msg && e2.uId!=e.uId && e2.uId!=App.data.user.id) {
							let tmp = {
									avatar 	: initialeValues.members[e2.uId].mem,
									dt  	: e2.dt,
							}
							e.lstHistory.push(tmp);
						}
					})
					if (e.lstHistory.length == 0) e.hasHistory = false;
					else e.hasHistory = true;
				});

				userData 	= {user: initialeValues.obj, lstMessage: [...initialeValues.lstMsgCurrent].reverse(), hasMsg: initialeValues.lstMsgCurrent.length ? true: false};
				//do_lc_show_chatroom(userData);
				do_lc_show_chatroom_read(initialeValues.lstMsgCurrent);
			}
		}
		
		const do_lc_show_chatroom_read = function(lst){
			let lst_msg_read = $(pr_div_content + " .message-read");
			
			if (lst_msg_read.length > 0 ){
				for (let i = 0; i<lst_msg_read.length; i++){
					lst_msg_read[i].remove();
				}
			}
			
			let lstHasHistory = lst.filter(function(e) { return e.hasHistory; }); 
			
			if (lstHasHistory.length > 0 ){
				lstHasHistory.forEach((e) => {
					$(pr_div_content + " .li_msg_item_append_" + e.id).append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ	, e));
				})
			}
		}
		
		this.do_lc_new_chatroom_user_read = function(userid, msgid){
			if (App.data.user.id == userid) return;
			
			$(pr_div_content + " .div_avatar_" + userid).remove(); 

			let obj = Object.assign({}, initialeValues.members[userid]);
			obj.msgId = msgid;
			
			$(pr_div_content + " .li_msg_item_append_" + msgid).show();
			
			if ($(pr_div_content + " .li_msg_read_" + msgid).length > 0) {
				$(pr_div_content + " .li_msg_read_" + msgid).append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM_CONTENT, obj))
			} else {
				$(pr_div_content + " .li_msg_item_append_" + msgid).append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM	, obj))
			}
/*			$(pr_div_content + " .li_msg_item_append_" + msgid).append
			$(pr_div_content + " .li_msg_read_" + msgid).show();
			$(pr_div_content + " .li_msg_read_" + msgid).append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM	, initialeValues.members[userid].mem))
*/		
			do_lc_scrollBottom_toChat();	
		}
		
		const startRecording = function (){
		    var constraints = { audio: true, video:false }
		    
			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				var audioContext = new window.AudioContext;
				gumStream = stream;
				input = audioContext.createMediaStreamSource(stream);
				rec = new Recorder(input,{numChannels:1})
				rec.record();
				
				$(pr_div_content + " .btn_recorder i").addClass("text-danger");
				$(pr_div_content + " .btn-not-recording").addClass('hide_recording');
				$(pr_div_content + " .sound-wave").removeClass("hide_recording");

				
//				$(pr_div_content + " .chat-input-links").addClass('hide');
//				$(pr_div_content + " .recording").removeClass("hide");
//				updateDateTime();

			}).catch(function(err) {
				console.log(err);
			});
		}
		
		var updateDateTime = function() {
			var sec = null;
			sec = rec.recordingTime() | 0;
			$(pr_div_content + " .time-display").html("" + (minSecStr(sec / 60 | 0)) + ":" + (minSecStr(sec % 60)));
			pr_interval_recording = setInterval(updateDateTime, 200);
		};

		 var minSecStr = function(n) {
			 return (n < 10 ? "0" : "") + n;
		 }
		
		function stopRecording() {
			rec.stop();
			gumStream.getAudioTracks()[0].stop();
			
			$(pr_div_content + " .btn_recorder i").removeClass("text-danger");
			$(pr_div_content + " .btn-not-recording").removeClass('hide_recording');
			$(pr_div_content + " .sound-wave").addClass("hide_recording");

//			clearInterval(pr_interval_recording);
//			$(".chat-input-links").removeClass('hide');
//			$(pr_div_content + " .recording").addClass("hide");
			
			rec.exportWAV(createDownloadLink);
		}

		function blobToFile(theBlob, fileName){       
		    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
		}
		
		function createDownloadLink(blob) {
			URL = window.URL || window.webkitURL;
			
			var url = URL.createObjectURL(blob);
			var filename = new Date().getTime();
			
			var file = blobToFile(blob, filename + ".wav");
			do_lc_up_file_audio_inline(file);
		}
		
		const do_lc_up_file_audio_inline = function(file){
			let ref = new FormData();
			ref.append('sv_class'	, 'ServiceTpyDocument');
			ref.append('sv_name'	, 'SVTpyDocumentNewPublic');
			ref.append('typ01'		, 1);
			ref.append('typ02'		, 2);
			ref.append('file'		, file);
			

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_upload_file_audio, []));

			let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax_form(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_after_upload_file_audio = function(sharedJson){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data && data.length){
					for(let item of data){
						var audio = `<audio class="audio_recorder" controls src='${item.path01}'></audio>`;
					}
				}
				do_lc_send_msg_chat({ files: [] }, audio);
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
			}
		}

	};

	return ChatRoomChat;
});