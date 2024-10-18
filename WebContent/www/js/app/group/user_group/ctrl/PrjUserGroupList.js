define([
	'text!group/user_group/tmpl/PrjUserGroup_List.html',
	'text!group/user_group/tmpl/PrjUserGroup_List_Content.html',
	'text!group/user_group/tmpl/PrjUserGroup_Ent_Content.html',
	'text!group/user_group/tmpl/PrjUserGroup_New.html',
	
	],
	function(PrjUserGroup_List, 
			PrjUserGroup_List_Content,
			PrjUserGroup_Ent_Content,
			PrjUserGroup_New
			) {
	const PrjUserGroupList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Chat		 		= null;

		var RIGHT_U_S	        	= 1000005;
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_S	        	= 105;
		//-----------------------------------------------------------------------------------
		
		const pr_SERVICE_CLASS_GROUP_DYN	= "ServiceNsoGroup";
		const pr_SV_GROUP_LIST_DYN			= "SVLstSearch"; 
		
		const pr_SERVICE_CLASS_GROUP		= "ServiceNsoGroup";
		const pr_SV_NEW_GROUP				= "SVNewWork";
		const pr_SV_MOD_GROUP               = "SVModWork";
		const pr_SV_DEL_GROUP               = "SVDelWork";
		
		var   self                  = this;
		this.pr_member_role			= null;
		
		var pr_SEARCH_KEY			= "";
		
		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;
		
		const pr_TYP_GROUP_WORK 	= 300;
		
		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 10;
		
		const pr_member_lev_manager = 0;
		const pr_member_lev_reporter= 10;
		const pr_member_lev_worker 	= 40;
		
		const pr_STAT_GRP_ACTIVE    = 1;
		
		var pr_CURRENT_GROUP_ID     = null;
		
		var pr_MANAGER              = false;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PrjUserGroup.Main;
			pr_ctr_List 			= App.controller.PrjUserGroup.List
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_USER_GROUP_LIST				= "PrjUserGroup_List";
			tmplName.PRJ_USER_GROUP_LIST_CONTENT		= "PrjUserGroup_List_Content";
			tmplName.PRJ_USER_GROUP_ENT_CONTENT		    = "PrjUserGroup_Ent_Content";
			tmplName.PRJ_USER_GROUP_NEW  				= "PrjUserGroup_New";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(){
			do_lc_load_view();
			do_lc_get_list();
			do_lc_bind_event();
		}
		
		//---------load view-----------------------------------------------------------------------------
		const do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_GROUP_LIST			, PrjUserGroup_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_GROUP_LIST_CONTENT	, PrjUserGroup_List_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_GROUP_ENT_CONTENT		, PrjUserGroup_Ent_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_GROUP_NEW				, PrjUserGroup_New); 	
			
			$("#div_usergroup_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_GROUP_LIST, {}));
		}
		
		//----------------------------------------------------------------------------------------------

		const do_lc_get_list = function(hardLoad = false){
			do_get_list_ByAjax(hardLoad);
		}
		
		const do_lc_get_list_member = (group) => {
			App.controller.PrjUserGroup.Member.do_lc_show(group);
		};
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event = function(obj){
			$("#inp_search").off("keydown").on("keydown", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_lc_get_list);
			});
			
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_get_list_ByAjax = function(hardLoad){	
			let divList = $("#div_group_list");
			let divPan  = $("#div_group_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP_DYN, pr_SV_GROUP_LIST_DYN, {typ01s: pr_TYP_GROUP_WORK, searchKey: pr_SEARCH_KEY, stats : pr_STAT_GRP_ACTIVE, hardLoad});
			
			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList);
			
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
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divList){
			const isSuccess = can_gl_AjaxSuccess(sharedJson);
			if(isSuccess) {
				const list = sharedJson[App['const'].RES_DATA] || {};
				const data = { lst: {} };
				let lst = list.lst || [];
			
				
				if (!lst.length) {
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_GROUP_LIST_CONTENT, {}));
					do_lc_bind_event__list_header();
					return;
				}

				for (const userOrGrp of lst) {
					try {
						userOrGrp.val01 = JSON.parse(userOrGrp.val01);
					} catch (error) {}
					data.lst[userOrGrp.id] = userOrGrp;
				}

				App.data["listGroupWork"] = data.lst;
				$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_GROUP_LIST_CONTENT, { "data": data.lst }));
				do_lc_bind_event_list();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		}
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event_list = function(){
			do_lc_bind_event__list_header()
			
			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idGroup} 	= $this.data();
				if(idGroup){
					$(".chat-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");
					$("#div_chat").css("display", "block");
					
					do_lc_get_info_group(App.data["listGroupWork"][idGroup]);
					do_lc_get_list_member(App.data["listGroupWork"][idGroup]);
				}
			})
		}

		const do_lc_bind_event__list_header = () => {
			$("#btn_btn_new_group").off("click").on("click", function(){
				var listUserRight = App.data.user.rights;
				var isRight = listUserRight.includes(RIGHT_A_S) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_U_S)
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
					return;
				}

				$("#div_usergroup_member").html("");
				$("#div_usergroup_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_GROUP_NEW, {}));

				do_lc_bind_event_for_group(obj = {files: []});
			})

			$("#btn_refresh_group").off("click").on("click", function(){
				do_lc_get_list(true);
				do_lc_bind_event_list();
			})

			$(".btn-resize-list").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event_for_group = function(obj){
			$("#btn_create_group").off("click").on("click", function(){
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});

				if(data.hasError)	return false;

				if (obj.files){
					data.data.files = obj.files;
				}
				do_lc_new_group(data.data);
			})
			
			let option	= {
					obj : obj,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
		}
		
		//-----------------new group-------------------------------------------------------------------------
		
		const do_lc_new_group = function(group){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_NEW_GROUP, {obj: group});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterCreat_Group, [group]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_afterCreat_Group = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_show_info_group(data);
					do_lc_get_list_member(data);
					do_lc_get_list(true); // hard Reload list group
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-----------------get group-------------------------------------------------------------------------
		
		const do_lc_get_info_group = (group) => {
			
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVGet", {id: group.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_get_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_reponse_get_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_show_info_group(data);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		this.do_lc_build_role_user  = (data) => {
			do_lc_build_role_user(data);
		}
		
		const do_lc_build_role_user = (data) => {
			if(App.data["lstGrpWorkMember"]){
				const user = App.data["lstGrpWorkMember"][App.data.user.id];
				if(user) self.pr_member_role 	= user.typ;
				else self.pr_member_role 	    = pr_member_lev_worker;
			}
			
			self.do_lc_reqRole_User();
		}
		
		const do_lc_show_info_group = (data) => {
			
			if(data.val01 && typeof data.val01 == "string"){
				data.val01 = JSON.parse(data.val01);
			}
			$("#div_usergroup_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_GROUP_ENT_CONTENT, data));
			
			do_bind_event_show_group(data);
		}
		
		//-----------------get group-------------------------------------------------------------------------

		const do_bind_event_show_group = function(data){
			if(!data.files)	data.files = [];
			if(data.avatar) data.files.push(data.avatar);
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: data//file existing here
			}
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);

			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");

			})
			
			$("#a_btn_save").off("click").on("click", function(){
				data.files 	= data.files ? [...data.files].filter(Boolean) : [];
				
				let	obj	 				= req_gl_data({
					dataZoneDom		: $("#div_usergroup_ent"),
					oldObject 		: data,
				});

				if(obj.hasError)	return false;

				let newGroup 			= obj.data;

				newGroup =  Object.assign(data, newGroup);
				
				newGroup.val01 = { img: newGroup.files.length > 0 ? decodeURIComponent(newGroup.files[0].path01) : null}; 
				
				do_lc_update_chat_group(newGroup);
			})
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".info-content-worker")	.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				if($parent.find(".content-edit").length > 0){
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				}
			})
			
			$("#a_btn_cancel").off("click").on("click", function(){
				do_lc_show_info_group(data);
			})
			
			$("#btn_add_avatar").off("click").on("click", function(){
				$("#frm_dropzone_send").removeClass("hide");
				$(this).addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
			
			$("#btn_del_group").off("click").on("click", function(){
				let {id} = $(this).data();
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_user_group_btn_delete_group"),
					content 	: $.i18n("prj_project_del_user_group_popup_content"),
					autoclose	: false,
					css			: {
						"max-width":"450px"
					},
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_del_group,
							param		: [id],
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});
			})
			
			$(".btn-resize-content").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		//-----------------update group-------------------------------------------------------------------------

		const do_lc_update_chat_group = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_MOD_GROUP, {obj: JSON.stringify(ent)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_update_group_success, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		const do_lc_update_group_success = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					do_lc_show_info_group(data);
					do_lc_get_list(true);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//------------------------------------------------------------------------------------------------
		
		const do_lc_del_group = function(groupId){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_DEL_GROUP, {id : groupId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterDel_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_usergroup_ent, #div_usergroup_member").html("");
				do_lc_get_list(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		//------------------------------------------------------------------------------------------------
		
		this.can_lc_role_user_manager = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_manager;
		}
		
		this.can_lc_role_user_reporter = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_reporter;
		}
		
		this.can_lc_role_user_worker = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_worker;
		}

		this.do_lc_reqRole_User = function(){
			let uRole = self.pr_member_role;
			if(uRole === null || uRole === undefined){
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), null);
			}
			if(uRole == pr_member_lev_manager){
			}else if(uRole == pr_member_lev_reporter){
			}else if(uRole == pr_member_lev_worker){
				$(".isManager")			.remove();
				$(".info-edit")		    .off("click").removeClass("info-content");
			}else{
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), null);
			}
		}

	}

	return PrjUserGroupList;
});