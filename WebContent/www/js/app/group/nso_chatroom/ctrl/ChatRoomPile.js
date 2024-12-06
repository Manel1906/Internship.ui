define(['jquery'], function($) {
	const ChatRoomPile = function (grpName, header, content, footer) {
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Chat		 		= null;
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_DYN			= "ServiceAutUserChat";
		const pr_SV_LIST_DYN				= "SVLstForChat"; 
		
		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;
		
		
		const initialValues 		= {
				waitMsg : []
		}
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.ChatRoom.Main;
			pr_ctr_Group 			= App.controller.ChatRoom.Group
			pr_ctr_Chat 			= App.controller.ChatRoom.Chat;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(obj = {files: []}, mode){	
			do_lc_load_view();
			do_lc_get_list();
			do_lc_bind_event();
		}
		
		this.do_lc_push_newMSG = function(msg){
			const {typMsg} 		= msg;
			const typCurrent 	= pr_CURRENT_TYPE == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
			
			do_lc_get_list_new_msg(msg);
			
			if(typMsg == typCurrent){
				do_lc_show_list_chat(pr_TYP_CHAT[pr_CURRENT_TYPE].divList);
			} else {
				if(typCurrent == pr_TYP_MSG_PRIVATE){
					$(".person-typChat[data-typ='2']").find("a").addClass("has-new-msg").attr("data-msg", JSON.stringify(msg));
				}else{
					$(".person-typChat[data-typ='1']").find("a").addClass("has-new-msg").attr("data-msg", JSON.stringify(msg));
				}
			}
			do_lc_bind_add_number_new_msg_new();
		}
		
		this.do_lc_push_new_list_online = () => do_lc_bind_list_with_user_online()
		
		const do_lc_bind_add_number_new_msg_new = () => {
			const nb_msg = Object.values(initialValues.lstNewMsg).reduce((sum, lst) => sum + lst.length, 0);
			
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
		
		const do_lc_get_list_new_msg = (msg) => {
			const newMsg = do_lc_show_person_with_new_msg(msg);
			const typ = newMsg.typMsg === pr_TYP_MSG_PRIVATE ? pr_TYP_CHAT_USER : pr_TYP_CHAT_GROUP;
			
			const findIndexMsg = initialValues.lstNewMsg[typ].findIndex(msg => msg.id === newMsg.id);
			if(findIndexMsg > -1){
				initialValues.lstNewMsg[typ][findIndexMsg] = newMsg;
			} else {
				initialValues.lstNewMsg[typ].push(newMsg);
			}
		}
		
		const do_lc_show_person_with_new_msg = (msg) => {
			const objData = {
					[pr_TYP_MSG_PRIVATE]: {attrID: "uId"	, attrName: "uNameSend"},
					[pr_TYP_MSG_PUBLIC]	: {attrID: "entId"	, attrName: "objNameSend"},
			}
			const {attrID: entID, attrName: entName} = objData[msg.typMsg];
			return {id: msg[entID], login: msg[entName], hasNewMsg: true, lastMsg: msg.body, isOnline: true, typMsg: msg.typMsg};
		}
		
		const do_lc_load_view = function(){
			$("#div_chatroom_person").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_GROUP, {}));
		}
		
		this.do_lc_get_list_chat = () => {
			do_lc_get_list(true);
		}
		
		const do_lc_get_list = function(hardLoad = false){
			do_get_list_ByAjax(pr_TYP_CHAT[pr_CURRENT_TYPE], hardLoad);
		}
		
		const do_lc_bind_event = function(obj){
			$(".person-typChat").off("click").on("click", function(){
				const {typ} = $(this).data();
				if(typ){
					pr_CURRENT_TYPE 	= typ;
					$("#inp_search")	.val("");
					pr_SEARCH_KEY 		= "";
					do_lc_get_list();
				}
			})
			
			$("#inp_search").off("keydown").on("keydown", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_lc_get_list);
			})
			
			
		}
		
		const do_get_list_ByAjax = function(options, hardLoad){	
			const {typ, isActive, svClass, svName, divList, divPan} = options;
			const ref 				= req_gl_Request_Content_Send_With_Params(svClass, svName, {searchKey: pr_SEARCH_KEY, stat: pr_STAT_ACTIVE, hardLoad});
			
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
				const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
				data.lst = list.lst.reduce((curr, user) => {
					if(lstOnline.includes(user.login))	user.isOnline = true;
					curr[user.id] = user;
					return curr;
				}, {});
				
				if(typ == pr_TYP_CHAT_USER) App.data["listUser"] = data.lst;
			}
			
			pr_LIST_CURRENT_CHAT = data;
			do_lc_show_list_chat(divList);
		}
		
		const do_lc_bind_list_with_user_online = () => {
			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
			
			for(let key in pr_LIST_CURRENT_CHAT.lst){
				const user 		= pr_LIST_CURRENT_CHAT.lst[key];
				user.isOnline 	= lstOnline.includes(user.login);
			}
			
			do_lc_show_list_chat(pr_TYP_CHAT[pr_TYP_CHAT_USER].divList);
		}
		
		const do_lc_get_has_new_msg = () => {
			const lstNewMsg = initialValues.lstNewMsg[pr_CURRENT_TYPE];
			if(!lstNewMsg || !lstNewMsg.length)	return;
			
			const typCurrent = pr_CURRENT_TYPE == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
			
			const listUsers = pr_LIST_CURRENT_CHAT.lst;
			
			for(let newLsg of lstNewMsg){
				const idEnt = newLsg.id;
				if(listUsers[idEnt]) {
					listUsers[idEnt].hasNewMsg 	= true;
					listUsers[idEnt].lastMsg 	= newLsg.lastMsg;
				} else {
					listUsers[idEnt] 	= newLsg;
				}
			}
			
			const $this 	= $(".tab-person.active");
			const hasNewMsg = $this.hasClass("has-new-msg");
			if(!hasNewMsg)	return;
			$this.removeClass("has-new-msg");
		}
		
		const do_lc_show_list_chat = function(divList){
			do_lc_get_has_new_msg();
			const lstUser = pr_LIST_CURRENT_CHAT.lst? do_lc_sort_user_online(Object.values(pr_LIST_CURRENT_CHAT.lst)) : [];
//			const lstUser = do_lc_sort_user_online(Object.values(pr_LIST_CURRENT_CHAT.lst));
			$(divList).html(tmplCtrl.req_lc_compile_tmpl(pr_TYP_TEMPL[pr_CURRENT_TYPE], lstUser));
			do_lc_bind_event_list(pr_LIST_CURRENT_CHAT.lst);
		}
		
		const do_lc_sort_user_online = (lst) => {
			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
			return lst.sort((a, b) => {
				const a_isOnline = lstOnline.includes(a.login) ? 1 : 0;
				const b_isOnline = lstOnline.includes(b.login) ? 1 : 0;
				return b_isOnline - a_isOnline;
			})
		}
		
		const do_lc_bind_event_list = function(lstUser){
			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idChat} 	= $this.data();
				if(idChat){
					const indexNewMsg = initialValues.lstNewMsg[pr_CURRENT_TYPE].findIndex(msg => msg.id === idChat);
					if(indexNewMsg > -1)	initialValues.lstNewMsg[pr_CURRENT_TYPE].splice(indexNewMsg, 1);
					do_lc_bind_add_number_new_msg_new();
					
					$(".chat-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");
					
					pr_CURRENT_TYPE == pr_TYP_CHAT_USER ? $("#div_member, #div_member_wait").hide() : $("#div_member, #div_member_wait").show();
					pr_ctr_Chat.do_lc_show(lstUser[idChat], pr_CURRENT_TYPE);
					$("#div_chat").css("display", "block");
					$("#div_info").css("display", "none");
				}
			})
			
			$("#btn_new_group").off("click").on("click", function(){
				$("#div_chat").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_NEW, {}));
				do_lc_bind_event_for_group();
			})
		}
		
		const do_lc_bind_event_for_group = function(){
			$("#btn_create_group").off("click").on("click", function(){
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});

				if(data.hasError)	return false;

				data.data.files = pr_obj.files;
				do_lc_new_group(data.data);
			})
			
			let option	= {
					obj : pr_obj,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
		}
		
		const do_lc_new_group = function(group){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_GROUP_NEW, {obj: JSON.stringify(group)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterAdd_member, [group]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_afterAdd_member = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_get_list(true); // hard Reload list group
					pr_ctr_Chat.do_lc_show(data, pr_CURRENT_TYPE);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
	}

	return ChatRoomPile;
});
