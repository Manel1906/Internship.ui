define(['jquery'], function($) {
	const ChatRoomGroup = function (grpName, header, content, footer) {
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName                = grpName?grpName:((new Date()).getTime()+"");
		var tmplName                  = App.template.names[pr_grpName];
		var tmplCtrl                  = App.template.controller;
		//------------------------------------------------------------------------------------
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Chat		 		= null;
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_DYN			= "ServiceAutUserChat";
		const pr_SV_LIST_DYN				= "SVLstForChat"; 

		const pr_SERVICE_CLASS_GROUP_DYN	= "ServiceNsoGroupChat";
		const pr_SV_GROUP_LIST_DYN			= "SVLstPagination"; 
		const pr_SV_GROUP_LIST_BY_USER		= "SVLstByUser"; 

		const pr_SERVICE_CLASS_GROUP		= "ServiceNsoGroup";
		const pr_SV_GROUP_NEW				= "SVNewRoom"; 
		const pr_SV_GROUP_GET				= "SVGet"; 
		const pr_SV_GROUP_MOD				= "SVMod"
		const pr_SV_GROUP_GET_GROUP_USER	= "SVGetGroup2User"; 

		var   self                  = this;

		const pr_TYP_CHAT_USER		= 1;
		const pr_TYP_CHAT_GROUP		= 2;
		const pr_TYP_CHAT_RELATE	= 3;

		const pr_TYP_CHAT 			= {
				[pr_TYP_CHAT_USER] 	: {typ: pr_TYP_CHAT_USER	, svClass: pr_SERVICE_CLASS_DYN			, svName: pr_SV_LIST_DYN		, divList: "#div_user_list"		, divPan: "#div_user_pagination"},
				[pr_TYP_CHAT_GROUP] : {typ: pr_TYP_CHAT_GROUP	, svClass: pr_SERVICE_CLASS_GROUP_DYN	, svName: pr_SV_GROUP_LIST_DYN	, divList: "#div_group_list"	, divPan: "#div_group_pagination"},
				[pr_TYP_CHAT_RELATE]: {typ: pr_TYP_CHAT_RELATE	, svClass: pr_SERVICE_CLASS_GROUP_DYN	, svName: pr_SV_GROUP_LIST_BY_USER	, divList: "#div_group_relate_list"	, divPan: "#div_group_relate_pagination"},
		}

		var pr_TYP_TEMPL 			= {}
		var pr_CURRENT_TYPE			= pr_TYP_CHAT_RELATE;
		var pr_SEARCH_KEY			= "";

		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;

		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 5;

		const pr_STAT_ACTIVE        = 1;
		const pr_STAT_GRP_ACTIVE    = 2;

		var pr_CURRENT_GROUP_ID     = null;
//		var pr_CURRENT_USER_ID      = null;

		const initialValues 		= {
				lstUnReadMsg : [],
				lstNewMsg : [],
				lstValidatMsg : [],
				lstRefuseMsg : [],
		}
		const TYPE_02_FILE_ALL_FORMAT		= 20;
		var pr_obj			= {files: []};

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.ChatRoom.Main;
			pr_ctr_Chat 			= App.controller.ChatRoom.Chat;
			pr_ctr_Doc 		     	= App.controller.ChatRoom.Docs;
			pr_ctr_Member  			= App.controller.ChatRoom.Member

			pr_TYP_TEMPL = {
					[pr_TYP_CHAT_USER] 		: tmplName.CHATROOM_TAB_USER,
					[pr_TYP_CHAT_GROUP] 	: tmplName.CHATROOM_TAB_GROUP,
					[pr_TYP_CHAT_RELATE] 	: tmplName.CHATROOM_TAB_GROUP_RELATE
			}
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(typShow, groupId, typchat, obj = {files: []}, mode){
			pr_SEARCH_KEY			= "";
			pr_CURRENT_TYPE  	 	= typShow?	typShow : pr_TYP_CHAT_USER;
			pr_CURRENT_GROUP_ID  	= groupId?  groupId : null; //--groupId will be the id of user to chat if pr_TYP_CHAT_USER
			pr_CURRENT_TYPE_CHAT  	= typchat?  typchat : pr_TYP_MSG_PUBLIC;

//			pr_CURRENT_USER_ID   = pr_CURRENT_TYPE == pr_TYP_CHAT_USER && groupId?  groupId : null;

			do_lc_load_view	();
			do_lc_get_list	();
			do_lc_bind_event();

			if(pr_CURRENT_GROUP_ID) {

				$("#div_member, #div_member_wait, #div_post, #div_chat, #div_files, #div_info").show();

				if (pr_CURRENT_TYPE == pr_TYP_CHAT_USER){
					$("#div_member, #div_member_wait, #div_post, #div_info").hide();
					$(".page-title-right").removeClass("d-none");
					if (groupId){
						do_lc_get_info_group_chat();
					}else{
						self.do_lc_get_group_user(pr_CURRENT_GROUP_ID);
					}
					self.do_lc_get_group_user(pr_CURRENT_GROUP_ID);
					if(initialValues.lstUnReadMsg.length > 0) self.do_lc_rebuild_list_new_msg(pr_CURRENT_GROUP_ID, pr_CURRENT_TYPE)
				} else if(pr_CURRENT_TYPE == pr_TYP_CHAT_GROUP){
					do_lc_get_info_group_chat();
				}
				else{
					do_lc_get_info_group_chat();
				}
			}

//			if(pr_CURRENT_GROUP_ID) setTimeout(do_lc_get_info_group_chat, 1000);
//			if(pr_CURRENT_USER_ID)  setTimeout(do_lc_get_group_chat, 1000);
		}



//		const do_lc_get_group_chat = () => {

//		pr_CURRENT_TYPE == pr_TYP_CHAT_USER ? $("#div_member, #div_member_wait, #div_post").hide() : $("#div_member, #div_member_wait, #div_post").show();

//		$("#div_chat").css("display", "block");
//		$("#div_files").css("display", "block");
//		$("#div_info").css("display", "none");
//		$(".page-title-right").removeClass("d-none");

//		do_lc_save_local_storage_grp(pr_CURRENT_USER_ID, pr_CURRENT_TYPE);
//		self.do_lc_get_group_user(pr_CURRENT_USER_ID);

//		//check exist new msg for user
//		if(initialValues.lstUnReadMsg.length > 0) self.do_lc_rebuild_list_new_msg(pr_CURRENT_USER_ID, pr_CURRENT_TYPE)

//		}


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
				$("#span_new_msg"		)	.removeClass("hide").text(nb_msg);
				$("#sp_nbNew_message"	)	.html(nb_msg);
				
				$("#app-title"			)	.text(`(${nb_msg}) ${$.i18n("prj_chat_header_chrome_new_msg")}`);
				favicon.attr("href"		, 	"www/img/prj/favicon/favicon.ico")
			} else {
				$("#span_new_msg"		)	.addClass("hide");
				$("#sp_nbNew_message"	)	.html("");
				
				$("#app-title"			)	.text(`Zino Chat`);
				favicon.attr("href"		, 	"www/img/prj/favicon/favicon.ico")
			}
		}

		const do_lc_show_list_new_messenge = (msg) => {

			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", pr_SV_GROUP_GET, {id: msg.objIDGrp});	

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
				if (obj.typ01 == pr_TYP_MSG_PRIVATE){
					obj.login01 = obj.msgUName;
					delete obj.msgUName;
				}
				
				pr_ctr_Chat.do_lc_show(obj);
				do_lc_save_local_storage_grp(obj.id, obj.typ01 == pr_TYP_MSG_PRIVATE? pr_TYP_CHAT_USER : pr_TYP_CHAT_GROUP);

				$(this).remove();
				$('.tooltip').removeClass("show");
				$(".chat-item").removeClass("active");

				do_lc_show_header_notif(idgrp);
			})
		}

		const do_binding_event_click_in_tab_chat = function(){
			$("#div_chat_main").off("click").on("click", function(){
				const favicon = $("link[rel='icon']");
				$("#span_new_msg"		)	.addClass("hide");
				$("#sp_nbNew_message"	)	.html("");
				
				$("#app-title"			)	.text(`Zino Chat`);
				favicon.attr("href", "www/img/prj/favicon/favicon.ico")
			})
			if(nb_msg > 0){
				$("#span_new_msg"		)	.removeClass("hide").text(nb_msg);
				$("#sp_nbNew_message"	)	.html(nb_msg);
				
				$("#app-title"			)	.text(`(${nb_msg}) ${$.i18n("prj_chat_header_chrome_new_msg")}`);
				favicon.attr("href", "www/img/prj/favicon/favicon.ico")
			} else {
				$("#span_new_msg"		)	.addClass("hide");
				$("#sp_nbNew_message"	)	.html("");
				
				$("#app-title"			)	.text(`Zino Chat`);
				favicon.attr("href", "www/img/prj/favicon/favicon.ico")
			}
			
		}

		const do_lc_show_header_notif = (idgrp) => {
			initialValues.lstUnReadMsg = initialValues.lstUnReadMsg.filter(item => item.objIDGrp !== idgrp)
			const nb_msg = initialValues.lstUnReadMsg.length;

			const favicon = $("link[rel='icon']");
			if(nb_msg > 0){
				$("#span_new_msg"		)	.removeClass("hide").text(nb_msg);
				$("#sp_nbNew_message"	)	.html(nb_msg);
				
				$("#app-title"			)	.text(`(${nb_msg}) ${$.i18n("prj_chat_header_chrome_new_msg")}`);
				favicon.attr("href"		, 	"www/img/prj/favicon/favicon.ico")
			} else {
				$("#span_new_msg"		)	.addClass("hide");
				$("#sp_nbNew_message"	)	.html("");
				
				$("#app-title"			)	.text(`Zino Chat`);
				favicon.attr("href"		, 	"www/img/prj/favicon/favicon.ico")
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
			$("#div_chatroom_person").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_GROUP, {}));
		}

		this.do_lc_get_list_chat = () => {
			do_lc_get_list(true);
		}

		const do_lc_get_list = function(hardLoad = false){
			if (!pr_CURRENT_TYPE){
				do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_USER ] 	, hardLoad);
				do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_GROUP] 	, hardLoad);
				do_get_list_ByAjax(pr_TYP_CHAT[pr_TYP_CHAT_RELATE] 	, hardLoad);
			}else{
				do_get_list_ByAjax(pr_TYP_CHAT[pr_CURRENT_TYPE] 	, hardLoad);
			}
			

			if (pr_CURRENT_TYPE == pr_TYP_CHAT_GROUP){
				$("#div_group_relate").hide(); 
				$("#div_user" ).hide(); 
				$("#div_group").show(); 
				$('.nav-item a[href="#div_group"]').tab('show');
				$('a[href$="div_group"]').tab('show');
				
			}else if(pr_CURRENT_TYPE == pr_TYP_CHAT_USER){
				$("#div_user" ).show(); 
				$("#div_group").hide(); 
				$("#div_group_relate").hide(); 
				$('.nav-item a[href="#div_user"]').tab('show');
				$('a[href$="div_user"]').tab('show');
				
			} else { 
				$("#div_user" ).hide(); 
				$("#div_group").hide(); 
				$("#div_group_relate").show(); 
				$('a[href$="div_group_relate"]').tab('show');
			}
		}

		const do_lc_bind_event = function(obj){
			$(".person-typChat").off("click").on("click", function(){
				const {typ} = $(this).data();
				if(typ){
					pr_CURRENT_TYPE 	= typ;				

					$('.nav-link.tab-person').removeClass('active');
					$(this).find('.nav-link.tab-person').addClass('active');

					do_lc_get_list		(false);
				}
			})

			$("#inp_search").off("input").on("input", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_lc_get_list, 500);
			})

			$(".btn-resize-left").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")

				let isExistClass = $(".chatroom_middle").hasClass("col-lg-3");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_left"  ).toggleClass('col-lg-3').toggleClass('col-lg-2');
						$(".chatroom_middle").toggleClass('col-lg-3').toggleClass('col-lg-4');
					}else{
						$(".chatroom_left"  ).toggleClass('col-lg-2').toggleClass('col-lg-3');
						$(".chatroom_middle").toggleClass('col-lg-3').toggleClass('col-lg-2');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-6");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_left"  ).toggleClass('col-lg-3').toggleClass('col-lg-2');
						$(".chatroom_middle").toggleClass('col-lg-6').toggleClass('col-lg-7');
					}else{
						$(".chatroom_left"  ).toggleClass('col-lg-2').toggleClass('col-lg-3');
						$(".chatroom_middle").toggleClass('col-lg-6').toggleClass('col-lg-5');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-4");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_left"  ).toggleClass('col-lg-3').toggleClass('col-lg-2');
						$(".chatroom_middle").toggleClass('col-lg-4').toggleClass('col-lg-5');
					}else{
						$(".chatroom_left"  ).toggleClass('col-lg-2').toggleClass('col-lg-3');
						$(".chatroom_middle").toggleClass('col-lg-4').toggleClass('col-lg-3');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-5");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_left"  ).toggleClass('col-lg-3').toggleClass('col-lg-2');
						$(".chatroom_middle").toggleClass('col-lg-5').toggleClass('col-lg-6');
					}else{
						$(".chatroom_left"  ).toggleClass('col-lg-2').toggleClass('col-lg-3');
						$(".chatroom_middle").toggleClass('col-lg-5').toggleClass('col-lg-4');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-7");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_left"  ).toggleClass('col-lg-3').toggleClass('col-lg-2');
						$(".chatroom_middle").toggleClass('col-lg-7').toggleClass('col-lg-8');
					}else{
						$(".chatroom_left"  ).toggleClass('col-lg-2').toggleClass('col-lg-3');
						$(".chatroom_middle").toggleClass('col-lg-7').toggleClass('col-lg-6');
					}
					return;
				}

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
				const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;

				if (!list.lst) list.lst = [];

				if (typ == pr_TYP_CHAT_RELATE){
					list.lst = list.lst.filter(item => {
						if(item.typ01 == pr_TYP_MSG_PUBLIC) return item;
						if(item.val01)  return item;
					})

					if(!list.lst.length && !pr_SEARCH_KEY){ //if don't have lst and not search, hide tab history
						$("#div_user" ).show(); 
						$("#div_group").hide(); 
						$("#div_group_relate").hide();
						$('.nav-item a').removeClass('show');
						$('.nav-item a[href="#div_user"]').tab('show');
						$('.nav-item[data-typ="3"]').addClass('hide');
					}
				}

				data.lst = list.lst.reduce((curr, userOrGrp) => {
					if (typ == pr_TYP_CHAT_USER){
						if (lstOnline && userOrGrp) 
							if(lstOnline.includes(userOrGrp.login01))	userOrGrp.isOnline = true;
					}else if (typ == pr_TYP_CHAT_GROUP && userOrGrp.val01){
						try {
							if (userOrGrp.val01) userOrGrp.val01 = JSON.parse(userOrGrp.val01);
						} catch (err) {
							console.log (err);
						}
					}else if (typ == pr_TYP_CHAT_RELATE && userOrGrp.val01){//--build avatar if have one in val01
						try {
							userOrGrp.val01 = JSON.parse(userOrGrp.val01);

							if(userOrGrp.typ01 == pr_TYP_MSG_PRIVATE){
								let uIds = Object.keys(userOrGrp.val01).slice(0, -1);

								let uIdSend = uIds.find(id => id != App.data.user.id)

								if(!uIdSend) uIdSend = App.data.user.id;

								if(userOrGrp.val01[uIdSend].img) userOrGrp.avatar = userOrGrp.val01[uIdSend].img ;

								userOrGrp.login01 = userOrGrp.val01[uIdSend].login? userOrGrp.val01[uIdSend].login : "HNV-TECH.COM";

								if(lstOnline.includes(userOrGrp.login01))	userOrGrp.isOnline = true;
							}
						} catch (err) {
							console.log (err);
						}
					}
					curr[userOrGrp.id] = userOrGrp;
					return curr;
				}, {});

				if(typ == pr_TYP_CHAT_USER)   App.data["listUser"]        = data.lst;
				if(typ == pr_TYP_CHAT_GROUP)  App.data["listGroup"]       = data.lst;
				if(typ == pr_TYP_CHAT_RELATE){
					App.data["listGroupRelate"] 	= data.lst;
					App.data["listGroupRelateOrd"] 	= list.lst;
				}
			}

			do_lc_show_list_chat(divList, typ);
		}

		const do_lc_bind_list_with_user_online = () => {
			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;

			for(let key in App.data["listUser"]){
				const user 		= App.data["listUser"][key];
				user.isOnline 	= lstOnline.includes(user.login01);
			}

			for(let key in App.data["listGroupRelate"]){
				const group 		= App.data["listGroupRelate"][key];

				if(group.typ01 == pr_TYP_MSG_PRIVATE){
					group.isOnline 	= lstOnline.includes(group.login01);
				}
			}

			do_lc_show_list_chat(pr_TYP_CHAT[pr_TYP_CHAT_RELATE].divList, pr_TYP_CHAT_RELATE);	
			do_lc_show_list_chat(pr_TYP_CHAT[pr_TYP_CHAT_USER].divList, pr_TYP_CHAT_USER);	
			pr_ctr_Member.do_lc_build_member_online();
		}

		const do_lc_show_list_chat = function(divList, typ){
			var lst =[];
			if(typ == pr_TYP_CHAT_USER)  lst  = App.data["listUser"]  ;
			if(typ == pr_TYP_CHAT_GROUP) lst  = App.data["listGroup"] ;	
			if(typ == pr_TYP_CHAT_RELATE) lst = App.data["listGroupRelateOrd"];

			if (!lst) lst =[];
			lst = do_lc_sort_UserOrGrp(Object.values(lst), typ);

			$(divList).html(tmplCtrl.req_lc_compile_tmpl(pr_TYP_TEMPL[typ], lst));			

			do_lc_bind_event_list();
		}

		const do_lc_sort_UserOrGrp = (lst, typ) => {
			if (typ == pr_TYP_CHAT_USER){
				const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
				return lst.sort((a, b) => {
					const a_isOnline = lstOnline.includes(a.login01) ? 1 : 0;
					const b_isOnline = lstOnline.includes(b.login01) ? 1 : 0;
					if (a_isOnline != b_isOnline)
						return b_isOnline - a_isOnline;
					else 
						if (a.login01!= null) return a.login01.localeCompare(b.login01)
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

		const do_lc_bind_event_list = function(){
			$("#btn_btn_new_group").off("click").on("click", function(){
				$("#div_member, #div_member_wait, #div_files, #div_post").html("");
				$("#div_chat").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_NEW, {}));

				// for mobile
				if($('.grp_btn_right'	).is(':visible')){
					$(".div_mobile"		).hide();
					$("#div_chat_main"	).show(); 
				}

				do_lc_bind_event_for_group(obj = {files: []});
			})

			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idChat} 	= $this.data();
				if(idChat){
					$(".chat-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");

					pr_CURRENT_TYPE == pr_TYP_CHAT_USER ? $("#div_member, #div_member_wait, #div_post").hide() : $("#div_member, #div_member_wait, #div_post").show();

					$("#div_chat").css("display", "block");
					$("#div_files").css("display", "block");
					$("#div_info").css("display", "none");
					$(".page-title-right").removeClass("d-none");

					do_lc_save_local_storage_grp(idChat, pr_CURRENT_TYPE);

					if(pr_CURRENT_TYPE == pr_TYP_CHAT_USER){
						$(".breadcrumb-item-chat").html(App.data["listUser"][idChat].login01);
						self.do_lc_get_group_user(idChat);
					} else{
						$(".breadcrumb-item-chat").html(App.data["listGroup"][idChat].name);						
						pr_ctr_Chat.do_lc_show(App.data["listGroup"][idChat], pr_CURRENT_TYPE);
					} 

//					//check exist new msg for user
					if(initialValues.lstUnReadMsg.length > 0) self.do_lc_rebuild_list_new_msg(idChat, pr_CURRENT_TYPE)
				}
			})

			$(".show_chat_room").off("click").on("click", function(){
				const {typ, id} 	= $(this).data();
				if(typ && id){
					window.open(`view_prj_chat_room.html?id=${id}&typ=${typ}`, '_blank')
				}
			})

			$(".chat-item-history").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idChat, typ01} 	= $this.data();
				if(idChat){
					$(".chat-item")			.removeClass("active");
					$(".chat-item-history")	.removeClass("active");
					$this					.addClass("active").removeClass("has-new-msg-item");

//					pr_CURRENT_TYPE = typ01 == pr_TYP_MSG_PRIVATE? pr_TYP_CHAT_USER : pr_TYP_CHAT_GROUP;
					//do_lc_save_local_storage_grp(idChat, pr_CURRENT_TYPE);

					typ01 == pr_TYP_MSG_PRIVATE ? $("#div_member, #div_member_wait, #div_post").hide() : $("#div_member, #div_member_wait, #div_post").show();

					$("#div_chat").css("display", "block");
					$("#div_files").css("display", "block");
					$("#div_info").css("display", "none");
					$(".page-title-right").removeClass("d-none");

					let obj = App.data["listGroupRelate"][idChat];
					
					pr_ctr_Chat.do_lc_show(obj);
					
					do_lc_save_local_storage_grp(obj.id,  pr_CURRENT_TYPE);
					do_lc_show_header_notif(idChat);
				}
			})

			$("#btn_refresh_group").off("click").on("click", function(){
				do_lc_get_list(true);
				do_lc_bind_event_list(App.data["listGroup"].lst);
			})

			$('.nav-item.person-typChat').each(function() {
				var typ                 = $(this).data('typ');
				if (typ && typ == pr_CURRENT_TYPE) {
					$('.nav-link.tab-person').removeClass('active');
					$(this).find('.nav-link.tab-person').addClass('active');
				}
			});

			if(pr_CURRENT_TYPE == pr_TYP_CHAT_USER && App.data["listUser"]){
				$("#div_group_relate").hide(); 
				$("#div_group").hide(); 
				$("#div_user" ).show(); 
				return;
			}
			if(pr_CURRENT_TYPE == pr_TYP_CHAT_GROUP && App.data["listGroup"]){
				$("#div_group_relate").hide(); 
				$("#div_user" ).hide();  
				$("#div_group").show(); 
				return;
			}

			if(pr_CURRENT_TYPE == pr_TYP_CHAT_RELATE && App.data["listGroupRelate"]){
				$("#div_user" ).hide();  
				$("#div_group").hide(); 
				$("#div_group_relate").show();
				return;
			}
		}

		this.do_lc_event_click = function(){
			$("#btn_refresh_group").click();
		}

		const do_lc_get_info_group_chat = () => {

			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", pr_SV_GROUP_GET, {id: pr_CURRENT_GROUP_ID});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_get_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_reponse_get_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];

        	if (data.typ01 == pr_TYP_MSG_PRIVATE) {
				var dataObject = JSON.parse(data.val01);
	            let uIds = Object.keys(dataObject);
	
	            let uIdSend = uIds.find(id => id != App.data.user.id);
	
	            if (!uIdSend) uIdSend = App.data.user.id;
	
	            if (data.val01[uIdSend].img) data.avatar = data.val01[uIdSend].img;
	
	            data.login01 = dataObject[uIdSend].login ? dataObject[uIdSend].login : "HNV-TECH.COM";
			}
			if(data){
					do_lc_show_roomchat(data);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		this.do_lc_mod_info_group_chat = (obj) => {
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", pr_SV_GROUP_MOD, {obj: JSON.stringify(obj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_mod_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_reponse_mod_group = function(sharedJson){
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
			obj.typ01 == pr_TYP_MSG_PRIVATE ? $("#div_member, #div_member_wait, #div_post").hide() : $("#div_member, #div_member_wait, #div_post").show();

			$("#div_chat"	).css("display", "block");
			$("#div_files"	).css("display", "block");
			$("#div_info"	).css("display", "none");

			$(".page-title-right").removeClass("d-none");

			$(".breadcrumb-item-chat").html(obj.name);
			pr_ctr_Chat.do_lc_show(obj, pr_CURRENT_TYPE);
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

		const do_lc_bind_event_for_group = function(obj){
			$("#btn_create_group").off("click").on("click", function(){
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});

				if(data.hasError)	return false;

				if (obj.files){
					data.data.files = obj.files;

					// if(obj.files.length > 0){
					// 	let val01 = {
					// 			img : obj.files[0].path01.split("%2F").join("/"),
					// 	}

					// 	data.data.val01 = JSON.stringify(val01);
					// }
				}
				do_lc_new_group(data.data);
			})

			let option	= {
				obj : obj,
				fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
		}

		const do_lc_new_group = function(group){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP_DYN, pr_SV_GROUP_NEW, {obj: JSON.stringify(group)});	

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

		this.do_lc_get_group_user = function(idUser){
			let curUserId 		= App.data.user.id;
			let avatarCurUser 	= App.data.user.per.files? App.data.user.per.files[0] : null;
		
			const ref 			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP_DYN, pr_SV_GROUP_GET_GROUP_USER, {"uId01":curUserId, "uId02": idUser});	

			let fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lc_after_group_user, [idUser]));

			let fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_group_user = function(sharedJson, iduser){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				data.iduser = iduser;
				do_lc_save_local_storage_grp(iduser, pr_CURRENT_TYPE);

				pr_ctr_Chat	.do_lc_show	(data, pr_CURRENT_TYPE);
				pr_ctr_Doc	.do_lc_show (data, pr_CURRENT_TYPE);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		this.do_lc_push_notif_validate_socket = function(msg){
			if(msg.memId == App.data.user.id){
				const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", pr_SV_GROUP_GET, {id: msg.grpId});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_show_notif_validate, [msg, true]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
		}


		this.do_lc_push_notif_not_validate_socket = function(msg){
			if(msg.memId == App.data.user.id){
				const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", pr_SV_GROUP_GET, {id: msg.grpId});	

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

		var do_lc_save_local_storage_grp = function (grpId, typ) {
			localStorage.setItem("nsoGrpChatId", grpId);
			localStorage.setItem("nsoGrpChatTyp", typ);
		}
	}

	return ChatRoomGroup;
});