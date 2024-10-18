define([
	'text!group/nso_email_camp/tmpl/EmailCam_List.html',
	'text!group/nso_email_camp/tmpl/EmailCam_List_Content.html',
	'text!group/nso_email_camp/tmpl/EmailCam_Ent_Content.html',
	'text!group/nso_email_camp/tmpl/EmailCam_New.html',
	
	],
	function(EmailCam_List, 
			EmailCam_List_Content,
			EmailCam_Ent_Content,
			EmailCam_New
			) {
	const EmailCamList = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl              = App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main             = null;
		var pr_ctr_Chat             = null;
		
		var RIGHT_U_S               = 1000005;
		//-----------------------------------------------------------------------------------
		
		const pr_SERVICE_CLASS      = "ServicePrjProject";
		const pr_SV_GET_GROUP       = "SVGet";
		const pr_SV_NEW_GROUP       = "SVNew";
		const pr_SV_MOD_GROUP       = "SVMod";
		const pr_SV_DEL_GROUP       = "SVDel";

		const pr_SERVICE_CLASS_DYN  = "ServicePrjProjectDyn";
		const pr_SV_GROUP_LIST_PAGE = "SVLstPage";
		
		var   self                  = this;
		this.pr_member_role         = null;
		
		var pr_SEARCH_KEY           = "";
		
		const pr_TYP00_GROUP_EMAIL  = 500;

		const pr_STAT_01_NEW        = 0;
		const pr_STAT_01_ACTIVE     = 1;
		const pr_STAT_01_REVIEW     = 5;
		const pr_STAT_01_DELETED    = 10;
		
		const pr_KEY_ENTER          = 13;
		const pr_NUMBER_RECORD      = 10;
		
		const pr_default_new_line	= {
				id 		: null,
				name	: null,
				ref	    : null,
		};
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PrjEmailCam.Main;
			pr_ctr_List 			= App.controller.PrjEmailCam.List
			
			tmplName.EMAIL_CAM_LIST				= "EmailCam_List";
			tmplName.EMAIL_CAM_LIST_CONTENT		= "EmailCam_List_Content";
			tmplName.EMAIL_CAM_ENT_CONTENT		= "EmailCam_Ent_Content";
			tmplName.EMAIL_CAM_NEW  			= "EmailCam_New";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(){
			do_lc_load_view();
			do_lc_get_list();
			do_lc_bind_event();
		}
		
		//---------load view-----------------------------------------------------------------------------
		const do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_CAM_LIST			, EmailCam_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_CAM_LIST_CONTENT	, EmailCam_List_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_CAM_ENT_CONTENT		, EmailCam_Ent_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.EMAIL_CAM_NEW				, EmailCam_New); 	
			
			$("#div_emailcam_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_LIST, {}));
			do_gl_apply_right($("#div_emailcam_list"));
		}
		
		//----------------------------------------------------------------------------------------------

		const do_lc_get_list = function(hardLoad = false){
			do_get_list_ByAjax(hardLoad);
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event = function(obj){
			$("#btn_btn_new_group").off("click").on("click", function(){
				$("#div_emailcam_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_NEW, {}));
				do_lc_bind_event_for_group(obj = {files: []});
			})
			
			$("#inp_search").off("input").on("input", function(e){
				pr_SEARCH_KEY	= e.target.value;
				
				do_gl_execute_debounce(do_lc_get_list);
			})
		}
		
		var do_lc_trigger_datatable = (obj) => {
			var additionalConfig = {	
					"name": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							
							do_gl_set_input_autocomplete(nTd, {								
								dataRes 		: ["name"], 
								dataReq 		: {"typ01s": pr_TYP00_GROUP_EMAIL, "stats": pr_STAT_01_ACTIVE}, 
								dataService 	: ['ServiceNsoGroup', 'SVLst'], 

								succesCallback	: function(item) {
									let table = $('#tab_group_email_for_campagne').DataTable();
									let data = table.rows().data().toArray();
									let filteredData = data.slice(1);
									
									filteredData.forEach(function(d) {
										if (d.id === item.id) return;										
										oData.id = item.id;
										line.find(".ref").html(item.ref);
									});
								},
								required		: true,
								minLength		: 0,
								autoSearch		: true,		
								canAdd			: false								
							}, oData);
						},				
					},
					
					"action" : { 
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol){
							$(nTd).html(`<div class="box-icon" style="text-align:center"><a class="a_delete"><i class="fa fa-minus-circle"></i></a></div>`);
							$(nTd).find(".a_delete").on("click", function() {
								var table = $(this).parents("table").DataTable();
								var row = table.row( $(this).parents('tr') )
								row.remove().draw();
								$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
							});
					}},
			}

			let data = {
				...obj,
				"group": obj.groups.map(function(item) {
					return item.ent02;
				})
			}

			req_gl_create_datatable(data, "#tab_group_email_for_campagne", additionalConfig, pr_default_new_line, function(){
				$("#div_group_email_for_campagne").find("#btn_add").removeAttr("disabled");
				$("#div_group_email_for_campagne").find("#btn_add").on("click", function(){
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");

				})
			});
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_get_list_ByAjax = function(hardLoad){	
			let divList = $("#div_group_list");
			let divPan  = $("#div_group_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_GROUP_LIST_PAGE, {typ00: pr_TYP00_GROUP_EMAIL, searchKey: pr_SEARCH_KEY? "%" + pr_SEARCH_KEY +"%" : "%", hardLoad, forManager : true});
			
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
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_LIST_CONTENT, {}));
				}else{
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_LIST_CONTENT, {"data" : data.lst}));			
				}
				
				do_lc_bind_event_list(data);
			}else{
				$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_LIST_CONTENT, {}));	
			}
		}
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event_list = function(data){
			$(".chat-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id: id, code} 	= $this.data();
				if(id && code){
					$(".chat-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");
					$("#div_chat").css("display", "block");
					
					do_lc_get_info_group(id, code);
				}
			})
			
			
			$("#btn_refresh_group").off("click").on("click", function(){
				do_lc_get_list(true);
				do_lc_bind_event_list();
			})
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_bind_event_for_group = function(obj){
			do_lc_trigger_datatable(obj);
			App.SummerNoteController.do_lc_show("#div_content_message", {height : 100});//text editor
			
			if(!obj.files) obj.files = [];
			let option		= {
					fileinput	: {param : {typ01: 2, typ02: 10} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_files"), option);
			
			$("#btn_create_group").off("click").on("click", function(){
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});

				if(data.hasError)	return false;

				if (obj.files){
					data.data.files = obj.files;
				}

				const groups = [];
				data.data.group.forEach(item => {	
					group 		= {"ent02": item, "entId02": item.id};
					groups.push(group);
				});


				do_lc_new_group(data.data, groups);
			})
		}
		
		//-----------------new group-------------------------------------------------------------------------
		
		const do_lc_new_group = function(data, group){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_GROUP, {obj: JSON.stringify(data), group: JSON.stringify(group)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterCreat_Group, [data]));

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
		
		const do_lc_get_info_group = (id, code) => {
			
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_GROUP, {id, code});	

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
		}
		
		const do_lc_show_info_group = (data) => {
			
			if(data.descr01 && typeof data.descr01 == "string"){
				data.descr01 = JSON.parse(data.descr01);
			}
			
			if(data.descr01 && typeof data.descr01 == "string"){
				data.descr01 = JSON.parse(data.descr01);
			}

			if(data.inf02 && typeof data.inf02 == "string"){
				data.inf02 = JSON.parse(data.inf02);
			}
			$("#div_emailcam_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_ENT_CONTENT, data));
			
			do_bind_event_show_group(data);
			do_gl_apply_right($("#div_emailcam_ent"));
		}
		
		//-----------------get group-------------------------------------------------------------------------

		const do_bind_event_show_group = function(data){
			do_lc_trigger_datatable(data);
			App.SummerNoteController.do_lc_show("#div_emailcam_ent", {height : 100});//text editor
			
			if(!data.files) data.files = [];
			let option		= {
					fileinput	: {param : {typ01: 2, typ02: 10} },//option here
					obj			: data//file existing here
			}
			do_gl_init_fileDropzone($("#div_file_dropzone"), option);
			
			$(".info-edit").off("click").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");

			})
			
			$("#a_btn_save").off("click").on("click", function(){
				data.files 	= data.files ? [...data.files].filter(Boolean) : [];
				
				let	obj	 				= req_gl_data({
					dataZoneDom		: $("#div_emailcam_ent"),
					oldObject 		: data,
				});

				if(obj.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_error_msg') );
					do_lc_show_DOM_err();
					return false;
				}

				let newGroup 			= obj.data;

				newGroup =  Object.assign(data, newGroup);

				for (let i = newGroup.group.length - 1; i >= 0; i--) {
					if (newGroup.group[i].id === "") {
						newGroup.group.splice(i, 1);
					}
				}
				
				if (newGroup.descr01.web_url && !/^https?:\/\//i.test(newGroup.descr01.web_url)) {
					newGroup.descr01.web_url = 'http://' + newGroup.descr01.web_url;
				}
				
				
				do_lc_update_chat_group(newGroup);
			})
			
//			$(".info-edit").off("click").on("click", function(){
//				let $parent = $(this).parent();
//				$parent.find(".info-content")			.addClass("hide");
//				$parent.find(".info-content-worker")	.addClass("hide");
//				$parent.find(".content-edit")	.removeClass("hide");
//
//				if($parent.find(".content-edit").length > 0){
//					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
//				}
//			})
			
			$("#a_btn_cancel").off("click").on("click", function(){
				do_lc_show_info_group(data);
			})
			
			$("#btn_add_avatar").off("click").on("click", function(){
				$("#frm_dropzone_send").removeClass("hide");
				$(this).addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
			
			$("#btn_del_group").off("click").on("click", function(){
				do_lc_del_group(data);
			})
			
			$("#btn_duplicate_group").off("click").on("click", function(){
				var newObj 		= $.extend(true, {}, data);
				newObj.id		= null;
				do_duplicate_record(newObj);
				do_lc_dupicate_group(newObj);
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
			
			$("#btn_modify_file").off("click").on("click", function(){
				$("#div_file_dropzone").removeClass("hide");
				$(this).addClass("hide");
				$(".table-responsive").addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
			
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				window.open(path, "_blank");
			})
			
		}
		
		const do_duplicate_record = (obj) => {
			if(obj.files){
				for(let i=0; i < obj.files.length; i++){
					obj.files[i].duplicate  = 1;
					obj.files[i].id 		= null;
				}
			}		
			
			obj.dtBegin =  req_gl_DateStr_From_DateObj (new Date());
			obj.dtEnd 	=  req_gl_DateStr_From_DateObj (new Date());
			obj.dtMod	=  null;
			obj.dtNew	=  null;
		}
		
		const do_lc_show_DOM_err = () =>{
			let els = $("#div_emailcam_ent").find('.inp-error');
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
		
		const do_lc_del_group = function(data){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_GROUP, {"obj" : JSON.stringify(data)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterDel_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_emailcam_ent").html("");
				do_lc_get_list(true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		//------------------------------------------------------------------------------------------------
		
		const do_lc_dupicate_group = function(data){
			if(data.prop01 && typeof data.prop01 == "string"){
				data.prop01 = JSON.parse(data.prop01);
			}
			
			if(data.prop02 && typeof data.prop02 == "string"){
				data.prop02 = JSON.parse(data.prop02);
			}
			
			$("#div_emailcam_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.EMAIL_CAM_NEW, data));
			
			do_lc_bind_event_for_group(data);
		}
	}

	return EmailCamList;
});