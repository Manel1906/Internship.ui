define(['jquery'], function($) {

	const ChatRoomMember 	= function (grpName, header, content, footer) {
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS					= "ServiceMsgMessage"; //to change by your need
		const pr_SV_MEMBER_LIST					= "SVMemberLst";
		const pr_SV_MEMBER_LIST_WAITING			= "SVMemberLstWaiting";

		const pr_SERVICE_USER_CLASS				= "ServiceAutUser";
		const pr_SV_USER_SEARCH					= "SVLst";

		const pr_SERVICE_CLASS_NSO_GROUP		= "ServiceNsoGroupChat"; //to change by your need
		const pr_SV_MEMBER_NOT_VALIDATED		= "SVDelEnt";
		const pr_SV_MEMBER_VALIDATED			= "SVValidated";
		const pr_SV_MEMBER_TRANSFORM_MAN		= "SVTransform";
		const pr_SV_MEMBER_ADD					= "SVAddMember";

		var self                                = this;
		var pr_PAGESIZE                         = 10;
		const pr_STAT_WAITING					= 1;
		const pr_STAT_VALIDATED					= 2;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 						= null;
		var pr_ctr_Chat 				= null;
		//-----------------------------------------------------------------------------------
		var pr_MEM_TEMP							= {};

		const pr_member_lev_manager 			= 0;
		const pr_member_lev_worker 				= 2;
		const pr_member_lev_owner 				= 10;

		const CHAT_GROUP_PRIVATE				= 401;
		const CHAT_GROUP_PUBLIC					= 402;

		const pr_TYP_CHAT_USER					= 1;
		var pr_Collect_Mem       	 			= "members";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_Chat 			= App.controller.ChatRoom.Chat;
			pr_ctr_Group 			= App.controller.ChatRoom.Group;
			pr_ctr_IndexedDB		= App.controller.ChatRoom.IndexedDB
		}

		var initialValues = {
				members 	: {},
				membersWait : {},
				group 		: {},
				isGroupUser : false,
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(values, showChatRoom=true, callback){
			initialValues = values;
			const {obj : group, isGroupUser} = values;

			try{
				do_lc_init_values				(group, isGroupUser);
				do_get_list_member				(values, showChatRoom, callback);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "ChatRoomMember", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_init_values = (group, isGroupUser) => {
			initialValues.group 		= group;
			initialValues.members 		= {};
			initialValues.isGroupUser 	= isGroupUser;
		}

		const do_lc_build_page = () => {
			do_lc_build_table_member();
			const isMe = initialValues.members[App.data.user.id];

			if (isMe && [pr_member_lev_manager, pr_member_lev_owner].includes(isMe.typ)) {
				do_lc_build_table_member_wait();
			}	
		}

		const do_lc_build_table_member = () => {
			var countMb = { count: Object.values(initialValues.members).filter(member => member.stat == 1).length };
			$("#div_member").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MEMBER, countMb));
			var callbackFunct = function(data, pagination) {
				$("#tab_member_detail").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MEMBER_DETAIL, data));
				do_lc_bind_event_member(initialValues.members, initialValues.group.id);
			}

			do_gl_init_pagination_noAjax("#tabMember", pr_PAGESIZE, 1, callbackFunct, undefined, Object.values(initialValues.members), Object.keys(initialValues.members).length);
			if(Object.keys(initialValues.members).length <= pr_PAGESIZE) $(".wygo-pagination").hide();
			$(".btn-resize-mem").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-maximize mdi-window-minimize")
				
				$(".btn-vertital-mem").toggle("hide");
			})	
		}

		const do_lc_bind_event_member = function(members, idGroup){
			$(".dropdown-toggle").on("click", function(){
				setTimeout(() => {
					$(".dropdown-menu").css("transform", "unset");
				}, 5);
			})

//			pr_MEM_TEMP = $.extend(false, {}, members);
			pr_MEM_TEMP ={};
			for (var i in members){
				var mem = members[i]; 
				pr_MEM_TEMP[mem.uId] = mem;
			}

			$(".btn-transform").off("click").on("click", function(){
				const {id, memid, transform} = $(this).data();
				id && do_lc_transform_member(id, memid, idGroup, transform);
			})

			$(".btn-remove-group").off("click").on("click", function(){
				const {id, memid} = $(this).data();
				id && do_lc_notValidate_member_group(id, memid, idGroup);
				id && do_lc_refresh_ids_by_socket(idGroup);
			})

			$(".div_member_detail").off("click").on("click", function(){
				const {id: idChat} 	= $(this).data();
				if(idChat){
					//show list user
				//	$('.person-typChat[data-typ="'+ pr_TYP_CHAT_USER + '"]').click();
					$('.nav-item a[href="#div_user"]').tab('show');

					//hide width chat group user
					$("#div_member, #div_member_wait, #div_post").hide();

					$("#div_chat").css("display", "block");
					$("#div_files").css("display", "block");
					$("#div_info").css("display", "none");
					$(".page-title-right").removeClass("d-none");
					
					pr_ctr_Group.do_lc_get_group_single(idChat);

//					//check exist new msg for user
					pr_ctr_Group.do_lc_rebuild_list_new_msg(idChat, pr_TYP_CHAT_USER)
				}
			})

			const el = "#inp_name_member";
			const reqSelectMember = function(event, item){
				if(pr_MEM_TEMP[item.id]&&pr_MEM_TEMP[item.id].stat==1)	return false;
				const mem 		= {"mem": item, "uId": item.id, "gId": idGroup};
				do_lc_add_member_toGroup(mem, idGroup);
				do_lc_refresh_ids_by_socket(idGroup);
				$(el).blur().val("");
			}
			// let options = {
			//     apiUrl         : App.path.BASE_URL_API_PRIV,
			//     dataService    : [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			//     dataRes        : ["login01", "name"],
			//     dataReq        : {nbline:5, stats:1},
			//     selectCallback : reqSelectMember,
			// }
			// do_gl_set_input_autocomplete(el, options);
			
			let options = {
			    dataService : [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			    svParams	: {wAvatar:true, nbline:5, stats:1},
				dataRes        : ["login01", "name"], 
			    fSelect		: reqSelectMember,
			    customShowList: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);	

			const userId = App.data.user.id;
			if(members[userId] && members[userId].lev === pr_member_lev_worker){
				$(".td-mem-action").remove();
			}

			$("#btn_refresh").off("click").on("click", function(){
				do_get_list_member_fromBE();
			})
			$("#btn_back_chat").off("click").on("click", function() {
				$("#div_chat_main, #div_info").toggle();
			})

			$(".btn-resize").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			})

			$("#btn-add-member-with-mail").on("click", function(){
				let emails 		= $("#inp_mail_member").val();

				if(!emails) return;

				let emailArr = emails.split(/[,;]+/); 

				for(let i = 0; i < emailArr.length; i++){
					emailArr[i] = emailArr[i].trim()
					let isEmail = validateEmail(emailArr[i]);
					if(!isEmail){
						$("#inp_mail_member").css("border", "1px solid red");
						do_gl_show_Notify_Msg_Error ($.i18n('validator_err_email') );
						return;
					}
				}

				emails = emailArr.join(',');
				do_lc_send_invite_with_email(emails.trim(), initialValues.group.id);
			})
		}

		function validateEmail(email) {
			const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		const do_lc_send_invite_with_email = (emails, groupId) => {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_NSO_GROUP, pr_SV_MEMBER_SEND_INVITE, {emails, groupId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_send_invite_response, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg_keepState (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_send_invite_response = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success ($.i18n("prj_chat_member_add_with_mail_succes") );
				$("#inp_mail_member").val("");
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_refresh_ids_by_socket = (idGrp) => {
			var msg_Grp_Ref = {name : "MSG_CHAT_GROUP_MEMBER", val :{group: idGrp}};
			App.controller.ChatRoom.Socket.can_lc_msg_Out (msg_Grp_Ref);
		}

		const do_lc_build_table_member_wait = () => {
			var listmb = initialValues.members;
			var lstmbwait = [];
			for (var key in listmb) {
				var member = listmb[key];
			    if (member.stat === 0) {
			        lstmbwait.push(member);
			    }
			}

			$("#div_member_wait")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_MEMBER_WAIT, lstmbwait));
			do_lc_bind_event_member_wait(initialValues.group.id);
			
			
		}

		const do_lc_bind_event_member_wait = (idGroup) => {
			$("#btn_refresh_wait").off("click").on("click", function(){
				do_get_list_member_fromBE();
			})

			$(".member-validate").off("click").on("click", function(){
				const {id, memid} = $(this).data();
				id && do_lc_validate_member_group(id, memid, idGroup);
				id && do_lc_refresh_ids_by_socket(idGroup);
			})

			$(".member-refuse").off("click").on("click", function(){
				const {id, memid} = $(this).data();
				id && do_lc_notValidate_member_group(id, memid, idGroup);
			})

			$(".btn-resize-memWait").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-maximize mdi-window-minimize")
				
				$(".btn-vertital-memWait").toggle("hide");
			})	
		}

		const do_get_list_member = function(values, buildChatRoom, callback){
			App.data["lstGrpMember"] = null;

			//---get from IndexedDB first
			const {group} 	= initialValues;

			//---show from IndexedDB first
			pr_ctr_IndexedDB.do_lc_req_collection(pr_Collect_Mem, group.key, function(res){
				if (res && res.data) App.data["lstGrpMember"] = res.data;
			});

			do_get_list_member_fromBE (values, buildChatRoom, callback);
			
			//-----refresh each 15mn----------
			if (buildChatRoom) do_lc_setTime_refresh_member_lst();
		}
		
		var pr_setTime_refresh_member_lst;
		var pr_TIME_REFRESH = 15 * 60 * 1000;
		var do_lc_setTime_refresh_member_lst = function() {
			if (pr_setTime_refresh_member_lst) clearInterval(pr_setTime_refresh_member_lst)
			pr_setTime_refresh_member_lst = setInterval(() => {
				do_get_list_member_fromBE();
			}, pr_TIME_REFRESH);
		}

		const do_get_list_member_fromBE = function(values, buildChatRoom=true, callback){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_LIST, {groupId: initialValues.group.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_get_list_member_fromBE_callback, [values, buildChatRoom, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg_keepState (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_get_list_member_fromBE_callback = function(sharedJson, values, buildChatRoom=true, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				var data 		= sharedJson[App['const'].RES_DATA]; 

				data = (data).sort(function(a,b){
					if (a.typ == b.typ)
						return (a.mem.login01.localeCompare(b.mem.login01)) ;
					return a.typ - b.typ
				});

				const objData 	= data.reduce((currentObj, item)=>{
					if(!!item.mem)	currentObj[item.uId] = item;
					return currentObj;
				}, {});

				if(values)	values.members = objData;

				App.data["lstGrpMember"] 		= {...objData};
				App.data["lstGrpMember"].length = Object.keys(objData).length;
				initialValues.members 			= objData;
				self.do_lc_build_member_online();
				
				//----put to indexedDB
				const {group} 	= initialValues;
				pr_ctr_IndexedDB.do_lc_update_collection (pr_Collect_Mem, group.key, {data: App.data["lstGrpMember"]});
				
				//----show chat content				
				if (buildChatRoom){
					pr_ctr_Chat.do_lc_show_form_chat	();
					pr_ctr_Chat.do_lc_get_content_chat	(initialValues);
				}
				
				if (callback) callback();
				
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		this.do_lc_build_member_online = function(){
			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
			for(let key in initialValues.members){
				const user 		=  initialValues.members[key];
				user.isOnline 	= lstOnline.includes(user.mem.login01);
			}
			!initialValues.isGroupUser && do_lc_build_page();
		}

		const do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
//			if(!item.avatar)	item.avatar = {path01: UI_URL_ROOT + "img/prj/users/avatar-" 		+ do_gl_reqRandom_number(1, 1) 	+ ".jpg"};
//			selOpt 		+= `<div class="media align-items-center"><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs avatar-autocomplete mr-3'/>${item.login}</div>`;
			if(!item.avatar){
				let first = item.login01.charAt(0);
				let last  = item.login01.charAt(item.login01.length - 1);
				let index = var_gl_alphabet.indexOf(first.toLowerCase());

				let textColor = var_gl_colors[index];
				let textAvatar= first + last;

				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-2" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			}else{
				selOpt 		+= `<div class="media align-items-center"><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs mr-2'/> ${item.login01}</div>`;
			}
			return selOpt;
		}

		const do_lc_add_member_toGroup = function(member, idGroup){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_NSO_GROUP, pr_SV_MEMBER_ADD, {obj: JSON.stringify(member)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterAdd_member, [member, idGroup]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterAdd_member = function(sharedJson, member, idGroup){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					let MemAdd = {};
					MemAdd[data.uId] = Object.assign({}, member, data);
					initialValues.members ={ ...initialValues.members, ...MemAdd };
//					do_lc_build_page();
					self.do_lc_build_member_online();
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_notValidate_member_group = function(idRe, memid, idGroup){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_NSO_GROUP, pr_SV_MEMBER_NOT_VALIDATED, {id: idRe, memId: memid, grpId : idGroup});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterUnValidate_member, [memid, idGroup]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_afterUnValidate_member = function(sharedJson, memid, idGroup){
			if(can_gl_AjaxSuccess(sharedJson)) {
				delete pr_MEM_TEMP[memid];
				initialValues.members = pr_MEM_TEMP;
//				do_lc_build_page();
				self.do_lc_build_member_online();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_validate_member_group = function(idRe, memid, idGroup){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_NSO_GROUP, pr_SV_MEMBER_VALIDATED, {id: idRe, memId : memid, grpId : idGroup});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterValidate_member, [memid, idGroup]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_afterValidate_member = function(sharedJson, memid, idGroup){
			if(can_gl_AjaxSuccess(sharedJson)) {
				pr_MEM_TEMP[memid].stat = pr_STAT_VALIDATED;
				initialValues.members = pr_MEM_TEMP;
//				do_lc_build_page();
				self.do_lc_build_member_online();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_transform_member = function(idRe, memid, idGroup, transform){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_NSO_GROUP, pr_SV_MEMBER_TRANSFORM_MAN, {id: idRe, typ: transform});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterTransform_toManager, [memid, idGroup, transform]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_afterTransform_toManager = function(sharedJson, memid, idGroup, transform){
			if(can_gl_AjaxSuccess(sharedJson)) {
				pr_MEM_TEMP[memid].typ = transform;
				initialValues.members = pr_MEM_TEMP;
//				do_lc_build_page();
				self.do_lc_build_member_online();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
	};

	return ChatRoomMember;
});
