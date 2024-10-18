define([
	'text!group/nso_email_group/tmpl/EmailGroup_List.html',
	'text!group/nso_email_group/tmpl/EmailGroup_List_Content.html',
	'text!group/nso_email_group/tmpl/EmailGroup_Ent_Content.html',
	'text!group/nso_email_group/tmpl/EmailGroup_New.html',
	
	],
	function(EmailGroup_List, 
			EmailGroup_List_Content,
			EmailGroup_Ent_Content,
			EmailGroup_New
			) {
	const EmailGroupList = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		
		const pr_SERVICE_CLASS	            = "ServiceNsoGroup";
		const pr_SV_GET_GROUP				= "SVGet"; 
		const pr_SV_NEW_GROUP				= "SVNewWork"; 
		const pr_SV_MOD_GROUP               = "SVModWork";
		const pr_SV_DEL_GROUP               = "SVDelWork";
		const pr_SV_GROUP_LIST				= "SVLstSearch"; 
		
		var   self                  = this;
		this.pr_member_role			= null;
		
		var pr_SEARCH_KEY			= "";
		
		const pr_TYP01_GROUP_EMAIL  = 500;
		
		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 10;
		
		const pr_OBJ_TYPE			= 15000;

		const pr_STAT_GRP_ACTIVE    = 1;

		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PrjEmailGroup.Main;
			pr_ctr_List 			= App.controller.PrjEmailGroup.List
			
			tmplName.EMAIL_GROUP_LIST				= "EmailGroup_List";
			tmplName.EMAIL_GROUP_LIST_CONTENT		= "EmailGroup_List_Content";
			tmplName.EMAIL_GROUP_ENT_CONTENT		= "EmailGroup_Ent_Content";
			tmplName.EMAIL_GROUP_NEW  				= "EmailGroup_New";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(){
			do_lc_load_view();
			do_lc_get_list();
			do_lc_bind_event();
		}
		
		//---------load view-----------------------------------------------------------------------------
		const do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_GROUP_LIST				, EmailGroup_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_GROUP_LIST_CONTENT		, EmailGroup_List_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_GROUP_ENT_CONTENT		, EmailGroup_Ent_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_GROUP_NEW				, EmailGroup_New); 	
			
			$("#div_EmailGroup_List").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_LIST, {}));
			do_gl_apply_right($("#div_EmailGroup_List"));
		}
		
		//----------------------------------------------------------------------------------------------

		const do_lc_get_list = function(hardLoad = false){
			do_get_list_ByAjax(hardLoad);
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event = function(obj){
			$("#btn_btn_new_group").off("click").on("click", function(){
				$("#div_EmailGroup_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_NEW, {}));
				do_lc_bind_event_for_group(obj = {files: []});
			})
			
			$("#inp_search").off("keydown").on("keydown", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_lc_get_list);
			})
		}
		
		
		//----------------------------------------------------------------------------------------------
		
		const do_get_list_ByAjax = function(hardLoad){	
			let divList = $("#div_group_list");
			let divPan  = $("#div_group_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GROUP_LIST, {typ01s: pr_TYP01_GROUP_EMAIL,stats:pr_STAT_GRP_ACTIVE, searchKey: pr_SEARCH_KEY, hardLoad});
			
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
			let data 			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				const data		= sharedJson[App['const'].RES_DATA];

				if (!data.lst){
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_LIST_CONTENT, {}));
				}else{
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_LIST_CONTENT, {"data" : data.lst}));			
				}
				
				do_lc_bind_event_list(data);
			}else{
				$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_LIST_CONTENT, {}));	
			}
		}
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event_list = function(data){
			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: idGroup} 	= $this.data();
				if(idGroup){
					$(".chat-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");
					$("#div_chat").css("display", "block");
					
					do_lc_get_info_group(idGroup);
				}
			})
			
			
			$("#btn_refresh_group").off("click").on("click", function(){
				do_lc_get_list(true);
				do_lc_bind_event_list();
			})
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event_for_group = function(obj){
			//App.SummerNoteController.do_lc_show("#div_EmailGroup_Ent", {height : 100});//text editor
			
			
			$("#btn_create_group").off("click").on("click", function(){
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});

				if(data.hasError)	return false;

				if(!data.data.grRef){
			    	let date = new Date();
			    	let strDate = req_gl_DateStr_From_DateObj(date);

			    	data.data.grRef = "GRP_" + req_gl_DateStr_From_DateStr(strDate, null, "yyyyMMddHHmmss");
			    }
				
				do_lc_new_group(data.data);
			})
		}
		
		//-----------------new group-------------------------------------------------------------------------
		
		const do_lc_new_group = function(group){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_GROUP, {obj: JSON.stringify(group)});	

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
					do_lc_get_list(true); // hard Reload list group
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-----------------get group-------------------------------------------------------------------------
		
		const do_lc_get_info_group = (id) => {
			
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_GROUP, {id});	

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
		}
		
		const do_lc_show_info_group = (data) => {
			$("#div_EmailGroup_Ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_GROUP_ENT_CONTENT, data));
			do_bind_event_show_group(data);
			do_gl_apply_right($("#div_EmailGroup_Ent"));
		}
		
		//-----------------get group-------------------------------------------------------------------------

		const do_bind_event_show_group = function(data){
			//App.SummerNoteController.do_lc_show("#div_EmailGroup_Ent", {height : 100});//text editor
			
			$(".info-edit").off("click").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");

			})
			
			$("#a_btn_save").off("click").on("click", function(){
				data.files 	= data.files ? [...data.files].filter(Boolean) : [];
				
				let	obj	 				= req_gl_data({
					dataZoneDom		: $("#div_EmailGroup_Ent"),
					oldObject 		: data,
				});

				if(obj.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_error_msg') );
					do_lc_show_DOM_err();
					return false;
				}

				let newGroup 			= obj.data;

				newGroup =  Object.assign(data, newGroup);
				
				
				do_lc_update_chat_group(newGroup);
			})
			
			$("#a_btn_cancel").off("click").on("click", function(){
				do_lc_show_info_group(data);
			})
			
			$("#btn_del_group").off("click").on("click", function(){
				do_lc_del_group(data);
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
		
		const do_lc_show_DOM_err = () =>{
			let els = $("#div_EmailGroup_Ent").find('.inp-error');
			let parents = els.parent();
			
			els.removeClass("hide");
			parents.find('.info-content').addClass('hide');
		}
		
		//-----------------update group-------------------------------------------------------------------------

		const do_lc_update_chat_group = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD_GROUP, {obj: JSON.stringify(ent)});	

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
		
		const do_lc_del_group = function(obj){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_GROUP, {});	
			ref.id			= obj.id;
			
			var lock 		= {};			
			lock.objectType = pr_OBJ_TYPE; 	//integer
			lock.objectKey 	= obj.id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterDel_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('nso_group_email_delete_success'))
				$("#div_EmailGroup_Ent").html("");
				do_lc_get_list(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
	}

	return EmailGroupList;
});