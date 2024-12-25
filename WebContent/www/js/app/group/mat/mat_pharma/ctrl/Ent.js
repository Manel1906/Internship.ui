define([], function() {
	const Ent = function (grpName, header, content, footer) {
			var pr_divHeader 			= header;
			var pr_divContent 			= content;
			var pr_divFooter 			= footer;
			
			//------------------------------------------------------------------------------------
			var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
			var tmplName				= App.template.names[pr_grpName];
			var tmplCtrl				= App.template.controller;
			//------------------controllers------------------------------------------------------
			var pr_ctr_Main 			= null;
			var pr_ctr_Ent 				= null;
			var pr_ctr_List 			= null;
			

			var RIGHT_ADM	        	= 100;
			var RIGHT_A_G	        	= 102;
			var RIGHT_A_N	        	= 102;
			var RIGHT_A_M	        	= 103;
			var RIGHT_A_D	        	= 104;
			
			var RIGHT_GET	        	= 50000001;
			var RIGHT_NEW	        	= 50000002;
			var RIGHT_MOD	        	= 50000003;
			var RIGHT_DEL	        	= 50000004;

			//-----------------------------------------------------------------------------------
			
			const pr_SERVICE_CLASS		= "ServiceMatMaterial";
			const pr_SV_NEW				= "SVNew";
			const pr_SV_MOD             = "SVMod";
			const pr_SV_GET             = "SVGet";
			const pr_SV_DEL       		= "SVDel";

			
			var   self                  = this;
			
			//--------------------APIs--------------------------------------//
			this.do_lc_init		= function(){
				pr_ctr_Main 			= App.controller.UI.Main;
				pr_ctr_List 			= App.controller[pr_grpName].List;
				pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
			}

			//---------show-----------------------------------------------------------------------------
			this.do_lc_show	= function(id){
				do_lc_get_info_entity(id);
			}
			
			this.do_lc_show_for_new	= function(){
				do_lc_edit_entity(obj = {files: []}, pr_Mode_NEW);
			}
			
			//-----------------get entity-------------------------------------------------------------------------
			const do_lc_get_info_entity = (id) => {
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id: id, wChild: true});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_get_info_entity_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			
			const do_lc_get_info_entity_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						do_lc_show_entity(data);
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
						
			//----------------------------------------------------------------------------------------------
			const do_lc_show_entity = (data) => {
				if(data.inf03 && typeof data.inf03 == "string"){
					data.inf03 = JSON.parse(data.inf03);
				}

				$("#div_ent"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT		, data));
				
				do_bind_event_show_entity(data);
			}
			
			//-----------------get entity-------------------------------------------------------------------------
			const do_bind_event_show_entity = function(data){
				var listUserRight 	= App.data.user.rights;
				var isRight = listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
				if (!isRight) {
					$("#btn_edit").hide();
				}
				isRight = listUserRight.includes(RIGHT_A_D) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_DEL) 
				if (!isRight) {
					$("#btn_del").hide();
				}
				isRight = listUserRight.includes(RIGHT_A_D) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_DEL) || listUserRight.includes(RIGHT_MOD)
				if (!isRight) {
					$(".dropdown-toggle").hide();
				}
							
				if(!data.files)	data.files = [];
				let option		= {
						fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
						obj			: data//file existing here
				}
				do_gl_init_fileDropzone($("#frm_dropzone_send"), option);

				
				$(".item-file-download").off("click").on("click", function(){
					let {path} = $(this).data();
					path && window.open(path, "_blank");
				})
				
				$("#btn_edit").off("click").on("click", function(){
					do_lc_edit_entity(data, pr_Mode_MOD);
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
								lab		:  $.i18n("common_btn_can"),
							},
							OK: {
								lab			: $.i18n("common_btn_delete"),
								funct		: do_lc_del_entity,
								param		: [id],
								classBtn	: "btn-danger"
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
				$(".btn-resize-content_ds").off("click").on("click", function () {
					let $this = $(this);
					let { divtoogle } = $this.data();
					let child = $this.find("i");
					let label = $this.find(".label-resize");
					child.toggleClass("mdi-window-minimize mdi-window-maximize")
					$(divtoogle).toggle("hide");

					label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
				})
			}
			
			//-----------------edit entity-------------------------------------------------------------------------
			const do_lc_edit_entity = (data, mode) => {
				if(data){
					if(data.inf03 && typeof data.inf03 == "string"){
						data.inf03 = JSON.parse(data.inf03);
					}
					data.edit 	   = mode

					$("#div_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_NEW, data));

					App.SummerNoteController.do_lc_show("#div_show_desc"	);//text editor 
					App.SummerNoteController.do_lc_show("#div_show_effect"	);//text editor
					App.SummerNoteController.do_lc_show("#div_show_assign"	);//text editor
					App.SummerNoteController.do_lc_show("#div_show_infor"	);//text editor
									
									
					do_lc_showMod_FileUploader(data);
					
					do_lc_bind_event_edit_entity(data, mode);
				} else {
					$("#div_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_NEW, {}));
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
			
			
			//------------------------------------------------------------------------------------------------
			//----------------------------------------------------------------------------------------------
			const pr_Mode_MOD = 2;
			const pr_Mode_NEW = 1;
			const do_lc_bind_event_edit_entity = function(obj, mode){
				$("#btn_edit_entity").off("click").on("click", function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_creat"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_can"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_save_med"),
								funct	: mode==pr_Mode_NEW?self.do_lc_new:self.do_lc_mod,
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
								lab		: $.i18n("common_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_can"),
								funct	: self.do_lc_cancel,
								param	: [obj, mode],
								classBtn: "btn-danger"
							}
						}
					});
				})
				
				$("#cancel_header").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_can"),
								funct	: self.do_lc_cancel,
								param	: [obj, mode],
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
			
			
			//-----------------new entity-------------------------------------------------------------------------
			this.do_lc_new = function(obj) {
				const data = req_gl_data({
					dataZoneDom: $("#frm_entity")
				});
	
				//check data error
				if(data.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
	
				if (obj.files) {
					data.data.files = obj.files;
				}
				
				let dataMed = data.data;
				do_lc_new_entity(dataMed);
			}
			
			this.do_lc_mod = function(obj) {
				const data = req_gl_data({
					dataZoneDom: $("#frm_entity")
				});
	
				//check data error
				if(data.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
	
				if (obj.files) {
					data.data.files = obj.files;
				}
				
				data.data.id = obj.id;
				do_lc_update_entity(data.data);
			}
	
			this.do_lc_cancel = function(obj, mode) {
				if (mode==pr_Mode_MOD)
					do_lc_show_entity(obj);
				else
					$("#div_ent").html("");
			}
			//---------------new entity----------------------------------------------------------------------------------			
			const do_lc_new_entity = function(entity){
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, {obj: entity});

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_new_entity_callback, [entity]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			
			const do_lc_new_entity_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						do_lc_show_entity(data);
						pr_ctr_List.do_lc_show(true); // hard Reload list entity
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
			//-----------------update entity-------------------------------------------------------------------------
			const do_lc_update_entity = function(ent) {
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: JSON.stringify(ent)});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_update_entity_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			const do_lc_update_entity_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
						do_lc_show_entity(data);
						pr_ctr_List.do_lc_show(true);
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
			
			//------------------------------------------------------------------------------------------------
			const do_lc_del_entity = function(entityId){
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, "SVDel", {id : entityId});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_del_entity_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			const do_lc_del_entity_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					$("#div_ent").html("");
					pr_ctr_List.do_lc_show(true);
				}else{
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				}
			}
						

		}

		return Ent;
});