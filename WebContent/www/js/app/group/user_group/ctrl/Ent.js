define([],function() {
	const EntList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent 				= null;
		var pr_ctr_List 			= null;

		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 101;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		
		var RIGHT_GET	        	= 30000011;
		var RIGHT_NEW	        	= 30000012;
		var RIGHT_MOD	        	= 30000013;
		var RIGHT_DEL	        	= 30000014;
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
		
		const pr_TYP01_ADMIN		= 2;
		
		const pr_TYP_MSG_PRIVATE 	= 200;
		const pr_TYP_MSG_PUBLIC 	= 201;
		
		const pr_TYP_GROUP_WORK 	= 300;
		
		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 10;
		
		
		const pr_STAT_ACTIVE    	= 1;
		
		var pr_CURRENT_GROUP_ID     = null;
		
		var pr_MANAGER              = false;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(id){
			$("#div_entity").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT, {}));
			
			do_lc_get_info_entity(id);
		}
		
		this.do_lc_show_for_new	= function(){
			$("#div_entity"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_NEW, {}));
			$("#div_entity_member"	).html("");

			App.SummerNoteController.do_lc_show("#div_create_introduce"	);//text editor 
			App.SummerNoteController.do_lc_show("#div_create_service"	);//text editor
			App.SummerNoteController.do_lc_show("#div_create_mission"	);//text editor
			App.SummerNoteController.do_lc_show("#div_create_information");//text editor
			
			do_lc_bind_event_for_entity(obj = {files: []});
		}
		
		
		this.do_lc_mod = function(obj){
			const data = req_gl_data({
				dataZoneDom: $("#frm_new_group")
			});

			if(data.hasError)	return false;

			if (obj.files){
				data.data.files = obj.files;
			}
			data.data.id = obj.id;
			do_lc_update_entity(data.data);
		}
		
		this.do_lc_cancel = function(){
			pr_ctr_Main.do_lc_show();
		}
		
		//---------load view-----------------------------------------------------------------------------
		//----------------------------------------------------------------------------------------------
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event_for_entity = function(obj){
			var listUserRight 	= App.data.user.rights;
			var isRight 		= listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
			if (!isRight) {
				return;
			}
			
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
			$("#btn_create_entity").off("click").on("click", function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_creat"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_save,
							param	: [obj],
							classBtn: "btn-primary"
						}
					}
				});
			})
			
			$("#btn_cancel_entity").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_cancel_create"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("prj_user_group_new_btn_back"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("prj_user_group_new_btn_cancel"),
							funct	: self.do_lc_cancel,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})
			
			let option	= {
					obj : obj,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
							
			let option2	= {
					obj : obj,
					fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
		}
		
		this.do_lc_save = function(obj){
			const data = req_gl_data({
				dataZoneDom: $("#frm_new_group")
			});

			if(data.hasError)	return false;

			if (obj.files){
				data.data.files = obj.files;
			}
			do_lc_new_group(data.data);
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
					do_lc_show_info_entity(data);
					do_lc_get_list_member(data);
					pr_ctr_List.do_lc_show(true); // hard Reload list group
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-----------------get group-------------------------------------------------------------------------
		
		const do_lc_get_info_entity = (id) => {
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVGet", {id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_info_entity_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_get_info_entity_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_show_info_entity(data);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				return;
			}
		}
		
		
		const do_lc_show_info_entity = (data) => {
			
			if(data.val01 && typeof data.val01 == "string"){
				data.val01 = JSON.parse(data.val01);
			}
			
			if(data.inf01 && typeof data.inf01 == "string"){
				data.inf01 = JSON.parse(data.inf01);
			}
			
			if(data.inf02 && typeof data.inf02 == "string"){
				data.inf02 = JSON.parse(data.inf02);
			}
			
			$("#div_entity").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, data));
			
			do_bind_event_show_entity(data);
			
			//----show member in this entity
			App.controller[pr_grpName].EntMember.do_lc_show(data);
		}
		
		//-----------------get group-------------------------------------------------------------------------
		const do_bind_event_show_entity = function(data){
			var listUserRight 	= App.data.user.rights;
			var isRight = listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
			if (!isRight) {
				$("#btn_edit"		).hide();
			}
			
			isRight = listUserRight.includes(RIGHT_A_D) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_DEL)
			if (!isRight) {
				$("#btn_del").hide();
			}

			//-----------------------------------------------------------------------------------------------------------------------
			
			if(!data.files)	data.files = [];
			if(data.avatar) data.files.push(data.avatar);
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: data//file existing here
			}
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);

			
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");

			})
			
			$("#a_btn_save").off("click").on("click", function(){
				data.files 	= data.files ? [...data.files].filter(Boolean) : [];
				
				let	obj	 				= req_gl_data({
					dataZoneDom		: $("#div_entity"),
					oldObject 		: data,
				});

				if(obj.hasError)	return false;

				let newGroup 			= obj.data;

				newGroup =  Object.assign(data, newGroup);
				
				newGroup.val01 = { img: newGroup.files.length > 0 ? decodeURIComponent(newGroup.files[0].path01) : null}; 
				
				do_lc_update_entity(newGroup);
			})
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".info-content-worker")	.addClass("hide");
				$parent.find(".content-edit")			.removeClass("hide");

				if($parent.find(".content-edit").length > 0){
					$("#a_btn_save, #a_btn_cancel")		.removeClass("hide");
				}
			})
			
			$("#a_btn_cancel").off("click").on("click", function(){
				do_lc_show_info_entity(data);
			})
			
			$("#btn_add_avatar").off("click").on("click", function(){
				$("#frm_dropzone_send").removeClass("hide");
				$(this).addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
			
			$("#btn_edit").off("click").on("click", function(){
				var group = [];
				group = $(this).data();
				do_lc_edit_entity(group);
				
			})
			
			$("#btn_del").off("click").on("click", function(){
				let {id} = $(this).data();
				App.MsgboxController.do_lc_show({
					title		: $.i18n("common_title_confirm"),
					content 	: $.i18n("msg_del_entity_popup_content"),
					autoclose	: false,
					css			: {
						"max-width":"450px"
					},
					buttons		: {
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						},
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_del_entity,
							param		: [id],
							classBtn	: "btn-danger"
						}
					}
				});
			})
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
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
		
		//-----------------edit group-------------------------------------------------------------------------
		
		const do_lc_edit_entity = (group) => {
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVGet", {id: group.id});	
	
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_edit_entity_callback, [group.id]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_edit_entity_callback = function(sharedJson, id){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					
					if(data.val01 && typeof data.val01 == "string"){
						data.val01 = JSON.parse(data.val01);
					}
					
					if(data.inf01 && typeof data.inf01 == "string"){
						data.inf01 = JSON.parse(data.inf01);
					}
					
					if(data.inf02 && typeof data.inf02 == "string"){
						data.inf02 = JSON.parse(data.inf02);
					}

					var listUserRight = App.data.user.rights;
					var isRight = listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
					if(!isRight){
						do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
						return;
					}

					$("#div_entity_member").html("");
					$("#div_entity").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_NEW, data));

					App.SummerNoteController.do_lc_show("#div_create_introduce");//text editor 
					App.SummerNoteController.do_lc_show("#div_create_service");//text editor
					App.SummerNoteController.do_lc_show("#div_create_mission");//text editor
					App.SummerNoteController.do_lc_show("#div_create_information");//text editor
					
					do_lc_showMod_FileUploader	(data);
					do_lc_bind_event_mod_entity	(data, id);
					
					console.log(data)
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		const do_lc_showMod_FileUploader = function (data) {
			if (!data.files) {
				data.files = [];
			}	
			
			let option	= {
					obj : data,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
							
			let option2	= {
					obj : data,
					fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
			}			
			do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
		}
		
		
		const do_lc_bind_event_mod_entity = function(obj){
			$("#btn_create_entity").off("click").on("click", function(){
				
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_mod,
							param	: [obj],
							classBtn: "btn-primary"
						}
					}
				});
			})
			
			$("#btn_cancel_entity").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save_cancel"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_cancel,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})
		}
		
		
		
		//-----------------update group-------------------------------------------------------------------------

		const do_lc_update_entity = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_MOD_GROUP, {obj: JSON.stringify(ent)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_update_entity_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_update_entity_callback = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					do_lc_show_info_entity(data);
					pr_ctr_List.do_lc_show(true); 
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//------------------------------------------------------------------------------------------------
		
		const do_lc_del_entity = function(groupId){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_DEL_GROUP, {id : groupId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_del_entity_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_del_entity_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_entity, #div_entity_member").html("");
				pr_ctr_List.do_lc_show(true); 
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		//------------------------------------------------------------------------------------------------
	}

	return EntList;
});