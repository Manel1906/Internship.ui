define([
	'group/nso_chatmini/ctrl/ChatRoomChat',	

	'text!group/nso_chatmini/tmpl/ChatRoom_Person.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_User.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Group.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Group_Relate.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Msg_New.html',
	'text!group/nso_chatmini/tmpl/ChatRoom_Tab_Msg_UnRead.html'

	],
	function(
			ChatRoomChat,
			
			ChatRoom_Person, 
			ChatRoom_Tab_User,
			ChatRoom_Tab_Group,
			ChatRoom_Tab_Group_Relate,
			ChatRoom_Tab_Msg_New,
			ChatRoom_Tab_Msg_UnRead) {
	const ChatRoomGroup = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		
		var pr_ctr_Chat		 		= [];
		var pr_ctr_Socket	 		= [];
		var pr_ctr_Chat_Id	 		= [];
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_DYN			= "ServiceAutUserDyn";
		const pr_SV_LIST_DYN				= "SVAutUserLstForChat"; 

		const pr_SERVICE_CLASS_GROUP_DYN	= "ServiceNsoGroupChat";
		const pr_SV_GROUP_LIST_DYN			= "SVNsoGroupLst"; 
		const pr_SV_GROUP_LIST_BY_USER		= "SVNsoGroupLstByUser"; 

		const pr_SERVICE_CLASS_GROUP		= "ServiceNsoGroup";
		const pr_SV_GROUP_GET_GROUP_USER	= "SVNsoGroupUser"; 

		var   self                  = this;

		const pr_TYP_CHAT_USER		= 1;
		const pr_TYP_CHAT_GROUP		= 2;
		const pr_TYP_CHAT_RELATE	= 3;

		const pr_TYP_CHAT 			= {
				[pr_TYP_CHAT_USER] 	: {typ: pr_TYP_CHAT_USER	, svClass: pr_SERVICE_CLASS_DYN			, svName: pr_SV_LIST_DYN			, divList: "#div_user_list_mini_chat"	, divPan: "#div_user_pagination_mini_chat"},
				[pr_TYP_CHAT_GROUP] : {typ: pr_TYP_CHAT_GROUP	, svClass: pr_SERVICE_CLASS_GROUP_DYN	, svName: pr_SV_GROUP_LIST_DYN		, divList: "#div_group_list_mini_chat"	, divPan: "#div_group_pagination_mini_chat"},
				[pr_TYP_CHAT_RELATE]: {typ: pr_TYP_CHAT_RELATE	, svClass: pr_SERVICE_CLASS_GROUP_DYN	, svName: pr_SV_GROUP_LIST_BY_USER	, divList: "#div_group_relate_list"		, divPan: "#div_group_relate_pagination"},
		}

		var pr_TYP_TEMPL 			= {}
		var pr_CURRENT_TYPE			= pr_TYP_CHAT_RELATE;
		var pr_SEARCH_KEY			= "";

		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;

		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 7;

		const pr_STAT_ACTIVE        = 1;
		const pr_STAT_GRP_ACTIVE    = 2;

		var pr_CURRENT_GROUP_ID     = null;
//		var pr_CURRENT_USER_ID      = null;

		const initialValues 		= {
				lstUnReadMsg 	: [],
				lstNewMsg 		: [],
				lstValidatMsg 	: [],
				lstRefuseMsg 	: [],
		}
		const TYPE_02_FILE_ALL_FORMAT		= 20;
		var pr_obj			= {files: []};

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 	= App.controller.MiniChat.Main;
			self.divBoxChat 		= null;

			tmplName.CHATROOM_GROUP				= "Mini_ChatRoom_Person";
			tmplName.CHATROOM_TAB_USER				= "Mini_ChatRoom_Tab_User";
			tmplName.CHATROOM_TAB_GROUP				= "Mini_ChatRoom_Tab_Group";
			tmplName.CHATROOM_TAB_GROUP_RELATE		= "Mini_ChatRoom_Tab_Group_Relate";
			tmplName.CHATROOM_TAB_MSG_NEW 			= "Mini_ChatRoom_Tab_Msg_New";
			tmplName.CHATROOM_TAB_MSG_UNREAD		= "Mini_ChatRoom_Tab_Msg_UnRead";

			pr_TYP_TEMPL = {
					[pr_TYP_CHAT_USER] 		: tmplName.CHATROOM_TAB_USER,
					[pr_TYP_CHAT_GROUP] 	: tmplName.CHATROOM_TAB_GROUP,
					[pr_TYP_CHAT_RELATE] 	: tmplName.CHATROOM_TAB_GROUP_RELATE
			}
			
			tmplCtrl.do_lc_put_tmpl(tmplName.CHATROOM_GROUP			, ChatRoom_Person); 
			tmplCtrl.do_lc_put_tmpl(tmplName.CHATROOM_TAB_USER			, ChatRoom_Tab_User); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.CHATROOM_TAB_GROUP		, ChatRoom_Tab_Group); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.CHATROOM_TAB_GROUP_RELATE	, ChatRoom_Tab_Group_Relate); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.CHATROOM_TAB_MSG_NEW		, ChatRoom_Tab_Msg_New);
			tmplCtrl.do_lc_put_tmpl(tmplName.CHATROOM_TAB_MSG_UNREAD	, ChatRoom_Tab_Msg_UnRead);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(typShow, groupId, obj = {files: []}, mode){
			do_lc_load_view();
			do_lc_get_list();
			do_lc_bind_event();
		}

		this.do_lc_open_chat = function (obj) {
			do_lc_show_miniChat(obj);
			
			// check exist new msg for user
			//if(initialValues.lstUnReadMsg.length > 0) self.do_lc_rebuild_list_new_msg(idChat, pr_CURRENT_TYPE)
		}
		
		this.do_lc_close_chat = function (obj) {
			do_lc_close_miniChat(obj);
		}
		
		this.do_lc_open_chat_old = function () {
			try {
				let lst 		= localStorage.getItem("hnv_prj.lstMiniChat");
				if (lst) {
					lst = JSON.parse(lst);
					lst.forEach((e) => {
						self.do_lc_open_chat(e);
					})
				}
				
			} catch (err) {
				console.log(err);
			}
		}
		
		this.do_lc_show_messge_wait_read = function(data){
			if (!App.data.GroupAvatar) App.data.GroupAvatar = {}
			var checkGroup = {};
			var lst = [];
			for (var i in data){
				var item = data[i];
				if(!App.data.GroupAvatar[item.id]) App.data.GroupAvatar[item.id] = {};
				if (checkGroup[item.id]) continue;
				else {
					if(item.val01){
						let val01 = JSON.parse(item.val01);
						let avatar = null;
						if(val01[item.msgUId]){
							avatar = val01[item.msgUId];
						}else{
							avatar = val01;
						}
						item.avatar = avatar.img;
						if(!App.data.GroupAvatar[item.id].avatar) App.data.GroupAvatar[item.id].avatar = avatar;
					}else{
						item.avatar = null;
					}
					if(!App.data.GroupAvatar[item.id].typ01) App.data.GroupAvatar[item.id].typ01  = item.typ01;
					checkGroup[item.id] = true;
					lst.push(item);
				}
			}
			initialValues.lstUnReadMsg = lst;
			do_lc_bind_add_number_new_msg_new();		
			$("#div_chatroom_new_msg").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MSG_UNREAD,  lst));
			do_bind_event_new_msg();
		}

		this.do_lc_push_newMSG = function(msg, isCurrentChat){
			if(!App.data.GroupAvatar) App.data.GroupAvatar = {};
			let newMsg = do_lc_show_person_with_new_msg(msg);
			do_lc_get_list_new_msg(newMsg);
			if(!isCurrentChat){
				if(!App.data.GroupAvatar[newMsg.objIDGrp]) do_lc_show_list_new_messenge(newMsg);
				else{
					newMsg.avatar = App.data.GroupAvatar[newMsg.objIDGrp].avatar ? App.data.GroupAvatar[newMsg.objIDGrp].avatar.img : null;
					newMsg.typ01  = App.data.GroupAvatar[newMsg.objIDGrp].typ01;
					newMsg.name   = App.data.GroupAvatar[newMsg.objIDGrp].name;
					if ($("#a_grp_"+ msg.entId).length>0){
						do_bind_event_new_msg();
						return;
					}
					$("#div_grpChat_unRead").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MSG_NEW,  newMsg))
					do_bind_event_new_msg();
				}
			}
			if(isCurrentChat) {
				initialValues.lstUnReadMsg = initialValues.lstUnReadMsg.filter(item => item.objIDGrp != msg.entId);
				do_binding_event_click_in_tab_chat();
			}

			do_lc_bind_add_number_new_msg_new(msg, isCurrentChat);
		}

		this.do_lc_push_new_list_online = () => do_lc_bind_list_with_user_online()

		this.do_lc_effect_message_read_by_chat_room = ({obj}) => do_lc_effect_message_read_by_chat_room(obj);

		const do_lc_effect_message_read_by_chat_room = (obj) => {
			initialValues.lstUnReadMsg = initialValues.lstUnReadMsg.filter(item => item.id !== obj.id);
			do_lc_bind_add_number_new_msg_new();
			$(`#a_grp_${obj.id}`).remove();
		}

		const do_lc_bind_add_number_new_msg_new = (msg, isCurrentChat) => {
			const nb_msg = initialValues.lstUnReadMsg.length;

			const favicon = $("link[rel='icon']");
			if(nb_msg > 0){
				$("#span_new_msg")	.removeClass("hide").text(nb_msg);
				$("#app-title")		.text(`(${nb_msg}) ${$.i18n("prj_chat_header_chrome_new_msg")}`);
				favicon.attr("href", "www/img/prj/favicon/favicon01.ico?v=RyyR6aw6zk")
			} else {
				$("#span_new_msg")	.addClass("hide");
				$("#app-title")		.text(`WorkAdm`);
				favicon.attr("href", "www/img/prj/favicon/favicon.ico")
			}
		}

		const do_lc_show_list_new_messenge = (msg) => {

			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNsoGroupGet", {id: msg.objIDGrp});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_get_group_new_msg, [msg]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_reponse_get_group_new_msg = function(sharedJson, msg){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];

				if(data){
					msg.typ01   = data.typ01;
					msg.name    = data.typ01 == pr_TYP_MSG_PUBLIC? data.name : "";
					let avatar = null;
					if(data.val01){
						let val01 = JSON.parse(data.val01);

						if(val01[msg.uIDSend]){
							avatar = val01[msg.uIDSend];
						}else{
							avatar = val01;
						}
						msg.avatar = avatar.img;
					}

					if(!App.data.GroupAvatar) App.data.GroupAvatar = {};
					if(!App.data.GroupAvatar[msg.objIDGrp]) App.data.GroupAvatar[msg.objIDGrp] = {};

					App.data.GroupAvatar[msg.objIDGrp].avatar   = avatar? avatar : null;
					App.data.GroupAvatar[msg.objIDGrp].typ01    = data.typ01;
					App.data.GroupAvatar[msg.objIDGrp].name     = data.name;

					if ($("#a_grp_"+ msg.objIDGrp).length>0){
						do_bind_event_new_msg();
						return;
					}

					if($("#div_grpChat_unRead").length == 0) $("#div_chatroom_new_msg").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MSG_UNREAD,  {}));
					$("#div_grpChat_unRead").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MSG_NEW,  msg));
					do_bind_event_new_msg();
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_bind_event_new_msg = function(){
			$(".new_msg").off("click").on("click", function(){
				let {idgrp, idsend, namesend, name, typ01} = $(this).data();
				let obj = initialValues.lstUnReadMsg.find(item => item.id  == idgrp)

				if(!obj.name)  obj.name = name;
				if(!obj.typ01) obj.typ01 = typ01;

				obj.typ01 == pr_TYP_MSG_PRIVATE ? $("#div_member, #div_member_wait").hide() : $("#div_member, #div_member_wait").show();
				
				do_lc_show_miniChat(obj, obj.typ01 == pr_TYP_MSG_PRIVATE? pr_TYP_CHAT_USER : pr_TYP_CHAT_GROUP);
				

				$(this).remove();
				$('.tooltip').removeClass("show");
				$(".chat-item").removeClass("active");

				do_lc_show_header_notif(idgrp);
			})
		}

		const do_binding_event_click_in_tab_chat = function(){
			$("#div_chat_main").off("click").on("click", function(){
				const favicon = $("link[rel='icon']");
				$("#span_new_msg")	.addClass("hide");
				$("#app-title")		.text(`WorkAdm`);
				favicon.attr("href", "www/img/prj/favicon/favicon.ico")
			})
		}

		const do_lc_show_header_notif = (idgrp) => {
			initialValues.lstUnReadMsg = initialValues.lstUnReadMsg.filter(item => item.objIDGrp !== idgrp)
			const nb_msg = initialValues.lstUnReadMsg.length;

			const favicon = $("link[rel='icon']");
			if(nb_msg > 0){
				$("#span_new_msg")	.removeClass("hide").text(nb_msg);
				$("#app-title")		.text(`(${nb_msg}) ${$.i18n("prj_chat_header_chrome_new_msg")}`);
				favicon.attr("href", "www/img/prj/favicon/favicon01.ico?v=RyyR6aw6zk")
			} else {
				$("#span_new_msg")	.addClass("hide");
				$("#app-title")		.text(`WorkAdm`);
				favicon.attr("href", "www/img/prj/favicon/favicon.ico")
			}
		}

		const do_lc_get_list_new_msg = (newMsg) => {
//			const newMsg = do_lc_show_person_with_new_msg(msg);
//			const typ = newMsg.typMsg === pr_TYP_MSG_PRIVATE ? pr_TYP_CHAT_USER : pr_TYP_CHAT_GROUP;

			const findIndexMsg = initialValues.lstUnReadMsg.findIndex(m => m.id === newMsg.objIDGrp);
			if(findIndexMsg > -1){
				initialValues.lstUnReadMsg[findIndexMsg] = {id: newMsg.objIDGrp, msgBody: newMsg.lastMsg, msgUId: newMsg.uIDSend, msgUName: newMsg.uNameSend, typMsg : newMsg.typMsg};
			} else {
				initialValues.lstUnReadMsg.push({id: newMsg.objIDGrp, msgBody: newMsg.lastMsg, msgUId: newMsg.uIDSend, msgUName: newMsg.uNameSend, typMsg : newMsg.typMsg});
			}
		}

		const do_lc_show_person_with_new_msg = (msg) => {
			const objData = {
					[pr_TYP_MSG_PRIVATE]: {attrID: "uId"	, attrName: "uNameSend"},
					[pr_TYP_MSG_PUBLIC]	: {attrID: "entId"	, attrName: "objNameSend"},
			}
			const {attrID: entID, attrName: entName} = objData[msg.typMsg];

			return {id: msg.id, hasNewMsg: true, lastMsg: msg.body, isOnline: true, typMsg: msg.typMsg, uIDSend : msg.uIDSend, uNameSend : msg.uNameSend, objIDGrp : msg.entId};
		}

		const do_lc_load_view = function(){
			$("#div_minichat_person").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_GROUP, {}));
		}

		this.do_lc_get_list_chat = () => {
			do_lc_get_list(true);
		}

		const do_lc_get_list = function(hardLoad = false){
			do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_USER ] , hardLoad);
			do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_GROUP] , hardLoad);
			do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_RELATE] , hardLoad);

//			if (pr_CURRENT_TYPE == pr_TYP_CHAT_GROUP){
//				$("#div_group_relate").hide(); 
//				$("#div_user_mini_chat" ).hide(); 
//				$("#div_group_mini_chat").show(); 
//				$('.nav-item a[href="#div_group_mini_chat"]').tab('show');
//			}else if(pr_CURRENT_TYPE == pr_TYP_CHAT_USER){
//				$("#div_user_mini_chat" ).show(); 
//				$("#div_group_mini_chat").hide(); 
//				$("#div_group_relate").hide(); 
//				$('.nav-item a[href="#div_user_mini_chat"]').tab('show');
//			} else { 
//				$("#div_user_mini_chat" ).hide(); 
//				$("#div_group_mini_chat").hide(); 
//				$("#div_group_relate").show(); 
//			}
		}

		const do_lc_bind_event = function(obj){
			$(".person-typChat").off("click").on("click", function(){
				const {typ} = $(this).data();
				if(typ){
					pr_CURRENT_TYPE 	= typ;				

					if(typ == pr_TYP_CHAT_USER && App.data["listUser"]){
						$("#div_group_relate").hide(); 
						$("#div_group_mini_chat").hide(); 
						$("#div_user_mini_chat" ).show(); 
						return;
					}
					if(typ == pr_TYP_CHAT_GROUP && App.data["listGroup"]){
						$("#div_group_relate").hide(); 
						$("#div_user_mini_chat" ).hide();  
						$("#div_group_mini_chat").show(); 
						return;
					}

					if(typ == pr_TYP_CHAT_RELATE && App.data["listGroupRelate"]){
						$("#div_user_mini_chat" ).hide();  
						$("#div_group_mini_chat").hide(); 
						$("#div_group_relate").show();
						do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_RELATE] , true);
						return;
					}
				}
			})

			$("#inp_search_mini_chat").off("keydown").on("keypress", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_lc_get_list);
			})
		}

		const do_get_list_ByAjax = function(options, hardLoad){	
			const {typ, isActive, svClass, svName, divList, divPan} = options;
			const ref 				= req_gl_Request_Content_Send_With_Params(svClass, svName, {searchKey: pr_SEARCH_KEY, stat : typ == pr_TYP_CHAT_RELATE? pr_STAT_GRP_ACTIVE : pr_STAT_ACTIVE, hardLoad});

			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList, typ);

			const opt 				= {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};

			do_gl_init_pagination_opt(opt);
		}

		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divList, typ){
			let data 			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				const list		= sharedJson[App['const'].RES_DATA];
				const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE

				if (!list.lst) list.lst = [];

				if (typ == pr_TYP_CHAT_RELATE){
					list.lst = list.lst.filter(item => {
						if(item.typ01 == pr_TYP_MSG_PUBLIC) return item;
						if(item.val01)  return item;
					})

					if(!list.lst.length && !pr_SEARCH_KEY){ //if don't have lst and not search, hide tab history
						$("#div_user_mini_chat" ).show(); 
						$("#div_group_mini_chat").hide(); 
						$("#div_group_relate").hide();
						$('.nav-item a').removeClass('show');
						$('.nav-item a[href="#div_user_mini_chat"]').tab('show');
						$('.nav-item[data-typ="3"]').addClass('hide');
					}
				}

				data.lst = list.lst.reduce((curr, userOrGrp) => {
					if (typ == pr_TYP_CHAT_USER){
						if (lstOnline && userOrGrp) 
							if(lstOnline.includes(userOrGrp.login))	userOrGrp.isOnline = true;
					}else if (typ == pr_TYP_CHAT_GROUP && userOrGrp.val01){
						try {
							userOrGrp.val01 = JSON.parse(userOrGrp.val01);
						} catch (error) {
						}
					}else if (typ == pr_TYP_CHAT_RELATE && userOrGrp.val01){
						try {
							userOrGrp.val01 = JSON.parse(userOrGrp.val01);

							if(userOrGrp.typ01 == pr_TYP_MSG_PRIVATE){
								let uIds = Object.keys(userOrGrp.val01).slice(0, -1);

								let uIdSend = uIds.find(id => id != App.data.user.id)

								if(!uIdSend) uIdSend = App.data.user.id;

								if(userOrGrp.val01[uIdSend].img) userOrGrp.avatar = userOrGrp.val01[uIdSend].img ;

								userOrGrp.login = userOrGrp.val01[uIdSend].login? userOrGrp.val01[uIdSend].login : "HNV-TECH.COM";

								if(lstOnline.includes(userOrGrp.login))	userOrGrp.isOnline = true;
							}
						} catch (error) {
						}
					}
					curr[userOrGrp.id] = userOrGrp;
					return curr;
				}, {});

				if(typ == pr_TYP_CHAT_USER)   App.data["listUser"]        = data.lst;
				if(typ == pr_TYP_CHAT_GROUP)  App.data["listGroup"]       = data.lst;
				if(typ == pr_TYP_CHAT_RELATE){
					App.data["listGroupRelate"] = data.lst;
					App.data["initGroupRelate"] = list.lst;
				}
			}

			do_lc_show_list_chat(divList, typ);
		}

		const do_lc_bind_list_with_user_online = () => {
			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;

			for(let key in App.data["listUser"]){
				const user 		= App.data["listUser"][key];
				user.isOnline 	= lstOnline.includes(user.login);
			}

			for(let key in App.data["listGroupRelate"]){
				const group 		= App.data["listGroupRelate"][key];

				if(group.typ01 == pr_TYP_MSG_PRIVATE){
					group.isOnline 	= lstOnline.includes(group.login);
				}
			}

			do_lc_show_list_chat(pr_TYP_CHAT[pr_TYP_CHAT_RELATE].divList, pr_TYP_CHAT_RELATE);	
			do_lc_show_list_chat(pr_TYP_CHAT[pr_TYP_CHAT_USER].divList, pr_TYP_CHAT_USER);	
			// pr_ctr_Member.do_lc_build_member_online();
		}

		const do_lc_show_list_chat = function(divList, typ){
			var lst =[];
			if(typ == pr_TYP_CHAT_USER)  lst  = App.data["listUser"]  ;
			if(typ == pr_TYP_CHAT_GROUP) lst  = App.data["listGroup"] ;	
			if(typ == pr_TYP_CHAT_RELATE) lst = App.data["listGroupRelate"];

			if (!lst) lst =[];
			lst = do_lc_sort_UserOrGrp(Object.values(lst), typ);

			$(divList).html(tmplCtrl.req_lc_compile_tmpl(pr_TYP_TEMPL[typ], lst));			

			do_lc_bind_event_list();
		}

		const do_lc_sort_UserOrGrp = (lst, typ) => {
			if (typ == pr_TYP_CHAT_USER){
				const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
				return lst.sort((a, b) => {
					const a_isOnline = lstOnline.includes(a.login) ? 1 : 0;
					const b_isOnline = lstOnline.includes(b.login) ? 1 : 0;
					if (a_isOnline != b_isOnline)
						return b_isOnline - a_isOnline;
					else 
						if (a.login!= null) return a.login.localeCompare(b.login)
				})
			} else if (typ == pr_TYP_CHAT_GROUP){
				const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
				return lst.sort((a, b) => {
					return a.name.localeCompare(b.name)
				})
			}else if (typ == pr_TYP_CHAT_RELATE){
				let listGrp  = lst;
				let groupIds = listGrp.map(item => item.id);

				let lstSort = groupIds.reduce((curr, id) => {
					let group = lst.find(item => item.id == id);
					curr.push(group)
					return curr;
				}, []);
				return lstSort;
			}
		}

		const do_lc_get_info_group_chat = () => {
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNsoGroupGet", {id: pr_CURRENT_GROUP_ID});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_get_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_reponse_get_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_show_roomchat(data);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_show_roomchat = function(obj){
			$(".page-title-right").removeClass("d-none");
			$(".breadcrumb-item-chat").html(obj.name);
			
			self.do_lc_show(obj, pr_CURRENT_TYPE);
		}

		this.do_lc_rebuild_list_new_msg = function(idChat, pr_CURRENT_TYPE){
			if(pr_CURRENT_TYPE == pr_TYP_CHAT_USER){
				let msg = initialValues.lstUnReadMsg.find(msg => msg.uIDSend == idChat);
				if(msg){
					$(".new_msg[data-idgrp='"+ msg.objIDGrp +"']").remove();
					do_lc_show_header_notif(msg.objIDGrp)
				}
			} else {
				let isExist = initialValues.lstUnReadMsg.some(msg => msg.objIDGrp == idChat);
				if(isExist){
					$(".new_msg[data-idgrp='"+ idChat +"']").remove();
					do_lc_show_header_notif(idChat)
				}
			}
		}
		const do_lc_bind_event_list = function(){
			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idChat, typchat, recent} 	= $this.data();
				
				if(idChat){ //idUser to chat if user selected-----------
					App.controller.MiniChat.Main.do_lc_close();

					$(".chat-item")			.removeClass("active");
					$this.addClass("active").removeClass("has-new-msg-item");
					$(".page-title-right").removeClass("d-none");
					
					pr_CURRENT_TYPE = typchat;
					
					
					let data 	= App.data["listUser"][idChat];
					let chkGrp	= false;
					
					if (recent){
						data = App.data["listGroupRelate"][idChat];
					} else if(typchat == pr_TYP_CHAT_GROUP){
						data = App.data["listGroup"][idChat];
					} else {
						chkGrp = true; //---check group existing firstly
					}
					
					data.idChat 	= data.id;					
					data.typChat	= typchat;
					
					if (typchat == pr_TYP_CHAT_GROUP){
						data.nameToShow = data.name;
					}else{
						data.nameToShow = data.login;
					}
					
					if (chkGrp){
						self.do_lc_get_group_user(data.login, idChat);
					
					}else{
						do_lc_show_miniChat(data);
					}
					
					// check exist new msg for user
					//if(initialValues.lstUnReadMsg.length > 0) self.do_lc_rebuild_list_new_msg(idChat, pr_CURRENT_TYPE)
				}
			})

			$(".show_chat_room").off("click").on("click", function(){
				const {typ, id} 	= $(this).data();
				if(typ && id){
					window.open(`view_prj_chat_room.html?id=${id}&typ=${typ}`, '_blank')
				}
			})
		}
		//------ to ensure that the group is created with the selected user------------------
		//------ BO will create the group if non existing------------------------------------
		this.do_lc_get_group_user = function(login, idUser){
			let curUserId 		= App.data.user.id;
			let avatarCurUser 	= App.data.user.per.files? App.data.user.per.files[0] : null;
		
			const ref 			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_GROUP_GET_GROUP_USER, {"uId01":curUserId, "uId02": idUser});	

			let fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lc_after_group_user, [login]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_group_user = function(sharedJson, login){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 		= sharedJson[App['const'].RES_DATA];
				data.nameToShow = login;
				data.typChat 	= pr_TYP_CHAT_USER;
				data.idChat 	= data.id; 
				
				do_lc_show_miniChat(data);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-------------------------------------------------------------------------------------------
		var do_lc_show_miniChat = function (data){
			if (!data) return;
			//---------------------------------------------------------
			//---check if exist or nb Max -----------------------------
			let pr_Max 		= 3;
			let arr 		= [];
			for (var i = pr_ctr_Chat.length - 1; i >=0; i--){
				var inst = pr_ctr_Chat[i];
				if (inst){
					let chkId = inst.var_grp_info.idChat;
					if (chkId == data.idChat ) {
						inst.do_lc_show_maximize();
						return;
					}
					
					if (arr.length == pr_Max-1){
						inst.do_lc_close();
					} else if (!inst.can_lc_closed){	
						arr.splice(0, 0, inst);
					} 
				}
			}
			
			//---------------------------------------------------------
			let divChatMini = pr_ctr_Main.do_lc_open_mini_chat();
			$(divChatMini).find(".header-chat").html(data.nameToShow)
			
			var crt_Chat	= new ChatRoomChat(null, divChatMini , null);
			crt_Chat		.do_lc_init(); //==> init pr_ctr_socket inside
			crt_Chat		.do_lc_show(data);
			
			
			arr.push	(crt_Chat);
			pr_ctr_Chat = arr;		

			// add info to localstorage
			do_lc_save_local_storage_minichat();


			//-----check if more than N then close socket, remove ....;
			//---do something here -------
			//var crt_Chat_ToClose = ...
			//crt_Chat_ToClose.do_lc_close(); => đóng socket, tắt div, remove khỏi []
		}

		this.do_lc_close_miniChat = function (ctr_chat){
			let arr 		= [];
			for (var i = pr_ctr_Chat.length - 1; i >=0; i--){
				var inst = pr_ctr_Chat[i];
				if (inst != ctr_chat){
					arr.push	(inst);
				}
			}
			pr_ctr_Chat = arr;	
			do_lc_save_local_storage_minichat();
		}
		
		this.do_lc_push_notif_validate_socket = function(msg){
			if(msg.memId == App.data.user.id){
				const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNsoGroupGet", {id: msg.grpId});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_show_notif_validate, [msg, true]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
		}

		this.do_lc_push_notif_not_validate_socket = function(msg){
			if(msg.memId == App.data.user.id){
				const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVNsoGroupGet", {id: msg.grpId});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_show_notif_validate, [msg, false]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
		}

		const do_lc_show_notif_validate = function(sharedJson, msg, isValide){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					if(isValide){
						const favicon = $("link[rel='icon']");

						$("#app-title")		.text(`${$.i18n("prj_chat_header_chrome_grp_validate")} ${data.name}`);
						favicon.attr("href", "www/img/prj/favicon/favicon01.ico?v=RyyR6aw6zk")

						$(".person-typChat[data-typ='2']").find("a").addClass("has-new-msg").attr("data-msg", JSON.stringify(msg.grpId));

						do_lc_play_sound_move();

					}else{
						const favicon = $("link[rel='icon']");

						$("#app-title")		.text(`${$.i18n("prj_chat_header_chrome_grp_not_validate")} ${data.name}`);
						favicon.attr("href", "www/img/prj/favicon/favicon01.ico?v=RyyR6aw6zk")

						$(".person-typChat[data-typ='2']").find("a").addClass("has-new-msg").attr("data-msg", JSON.stringify(msg.grpId));

						do_lc_play_sound_move();
					}
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_play_sound_move = function() {
			try {
				var x = document.getElementById("audio_new_msg"); 
				x.play();
			} catch (error) {
			}
		}

		var do_lc_save_local_storage_minichat = function () {
			let arr = [];
			pr_ctr_Chat.forEach((e) => {
				if (e) arr.push(e.var_grp_info);
			});
			localStorage.setItem("hnv_prj.lstMiniChat", JSON.stringify(arr));
		}
	}

	return ChatRoomGroup;
});