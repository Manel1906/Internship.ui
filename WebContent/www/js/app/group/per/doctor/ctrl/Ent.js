define([
	'group/per/doctor/ctrl/EntTabs'
	],
	function(
			{EntContent, EntTabInfo, EntTabDoc}
	){
	
	var Ent 						= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header  	? header : null;
		var pr_divContent 			= content  	? content : null;
		var pr_divFooter 			= footer  	? footer : null;

		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabPerInfo 		= "#div_user_info_person";

		//------------------------------------------------------------------------------------
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;

		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePerDoctor"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		const pr_SV_NEW				= "SVNew"; 
		const pr_SV_MOD				= "SVMod"; 
		const pr_SV_DEL				= "SVDel"; 

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		//------------------const object------------------------------------------------------
		const TYP_01_MORAL			= 200;
		const TYP_01_NATURAL		= 100;
		
		const TYP_02_DOCTOR			= 1100;
		//-----------------------------------------------------------------------------------
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 102;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		var RIGHT_GET	        	= 40000001;
		var RIGHT_NEW	        	= 40000002;
		var RIGHT_MOD	        	= 40000003;
		var RIGHT_DEL	        	= 40000004;
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent 				= null;
		var pr_ctr_List 			= null;
		
		var pr_DIV_CONTENT          = "#div_main_content";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.UI.Main;

			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
			
			if(!App.controller[pr_grpName].EntContent)				App.controller[pr_grpName].EntContent 			= new EntContent	(grpName, null, null, null);
			if(!App.controller[pr_grpName].EntTabInfo)				App.controller[pr_grpName].EntTabInfo			= new EntTabInfo	(grpName, null, null, null);
			if(!App.controller[pr_grpName].EntTabDoc)				App.controller[pr_grpName].EntTabDoc			= new EntTabDoc		(grpName, null, null, null);
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(id, mode, div){               
			try{
				if(div){
					pr_DIV_CONTENT = div;
				}
				
				if(mode == var_lc_MODE_NEW){
					do_lc_show_entity({}, mode);
					
				}else if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
					var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
					if(!id) id = params.id;
					if (id) do_lc_get_Entity (id, mode);
				}
				
		//		self.do_lc_reqRole_User();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_reqRole_User = function(mode){
			var listUserRight = App.data.user.rights;
			if(listUserRight.includes(RIGHT_GET) || listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_A_N)) return;
			if(!listUserRight.includes(RIGHT_U_M || !listUserRight.includes(RIGHT_U_N))){
				$(".isManager"			).remove();
				$(".info-content"		).off("click").removeClass("info-content");
				$(".info-edit-content"	).off("click").removeClass("info-content");
				$(".info-edit"			).off("click").removeClass("info-edit");
				$("#btn_modify, #btn_add_avatar").addClass("hidden");
				$("#btn_entity_change_pass").attr("disabled", "disabled");
				$(".btn_check_role_all"	).addClass("disabled")
			}
			
			let typ = App.data.user.typ;
			if(typ == pr_type_adm_all || typ == pr_type_adm){
				//to do
			}else{
				$(".isManager").remove();
				$(".info-content").off("click").removeClass("info-content");
			}
		}
		
		this.do_lc_ShowDiv_ByMode = function (div, mode){
			if (mode == var_lc_MODE_NEW){
				
				$(div).find(".info-content").addClass("hide");
				$(div).find(".content-edit").removeClass("hide");
				
				
				$(div).find("#div_img_avatar").addClass("hide");
				$(div).find("#div_prj_ent_file_upload").removeClass("hide");
				
				$(div).find("#div_ent_password_btn").addClass("hide");
				$(div).find("#div_ent_header_password").show();
				
				
				$("#inp_autuser_header_pass").removeClass("noData").addClass("objData");
				$("#inp_autuser_header_pass_match").removeClass("noData").addClass("objData");
				
				
				$(div).find(".dropdown ").addClass("hide");
				
			}else{
				
				$(div).find(".info-content").removeClass("hide");
				$(div).find(".content-edit").addClass("hide");				
				
				$(div).find("#div_img_avatar").removeClass("hide");
				$(div).find("#div_prj_ent_file_upload").addClass("hide");
				
				$(div).find("#div_ent_password_btn").removeClass("hide");
				$(div).find("#div_ent_header_password").hide();
				
				$("#inp_autuser_header_pass").removeClass("objData").addClass("noData");
				$("#inp_autuser_header_pass_match").removeClass("objData").addClass("noData");
				
				$(div).find(".dropdown ").removeClass("hide");
			}		  
		}
		
		
		const do_lc_get_Entity = function(id, mode){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);	
			ref["id"]		= id;
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_Entity_callback, [mode]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_Entity_callback = function(sharedJson, mode){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				
				do_lc_clean_data	(data);
				do_lc_show_entity	(data, mode);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), () => pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_dashboard.html`));
//				window.open("view_prj_user_list.html", "_self");
//				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_user_list.html`, "VI_MAIN/"+ App.router.part.PRJ_USER_LIST);
			}
		}
		
		const do_lc_show_entity = function(ent, mode){
			if (!mode) mode = var_lc_MODE_SEL;

			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT	, ent));
			
			do_lc_build_page(ent, mode);
		}
		
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;

			if(ent?.inf04){
				ent.inf04  = JSON.parse(ent.inf04);
			}

			const do_req_inf05 = (data) => {
				if(!data) return;
				let inf05
				try {
					inf05 = JSON.parse(data);
				} catch (e) {
					return;
				}

				let inf05Arr = inf05
				if(!Array.isArray(inf05Arr)) {
					if(typeof inf05Arr !== 'object') return

					//When inf05Arr has type object => to array
					inf05Arr = Object.keys(inf05).map(k => ({ [k]: inf05[k] }));
				}

				return inf05Arr.reduce((curr, item) => {
					if(!item.k) return
					curr[item.k] = item.v.replace(/&nbsp;/gi,"").split(" ").join('');
					return curr;
				}, {});
			}

			ent.inf05 = ent.inf05? do_req_inf05(ent.inf05) : null;

			if(ent.files && !ent.avatar) {
				ent.files.forEach(e => {
					if(e.typ01 === 1 && e.typ02 === 1) {
						ent.avatar = e
					}
				})
			}
			if(ent.inf04 && typeof ent.inf04 == "string"){
				ent.inf04 = JSON.parse(ent.inf04);
			}
			
			if(ent.inf06 && typeof ent.inf06 == "string"){
				ent.inf06 = JSON.parse(ent.inf06);
			}
			if(ent.inf02 && typeof ent.inf02 == "string"){
				ent.inf02 = JSON.parse(ent.inf02);
			}
		}
		
		const do_lc_build_page = function(obj, mode){
			do_lc_show_blocks(obj, mode);
			do_lc_binding_events(obj, mode);
		}
		
		const do_lc_show_blocks = function(obj, mode){
			App.controller[pr_grpName].EntContent 		.do_lc_show(obj, mode);
			App.controller[pr_grpName].EntTabInfo 		.do_lc_show(obj, mode);
			App.controller[pr_grpName].EntTabDoc 		.do_lc_show(obj, mode);
			
			if(mode == var_lc_MODE_NEW){
				$("#div_user_funct"		).removeClass("hide");
				$("#div_user_more_info"	).addClass("hide");
			}else{
				$("#div_user_funct"		).addClass("hide");
				$("#div_user_more_info"	).removeClass("hide");
			}
		}
		
		const do_lc_binding_events = function (obj, mode){
			$("#btn_entity_save_all").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: null,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_Save_Entity,
							param	: ["#div_user_ent", obj, var_lc_MODE_NEW],
							classBtn: "btn-primary"
						}
					}
				});
//				self.do_lc_Save_Entity("#div_user_ent", obj, var_lc_MODE_NEW); 
			})
			
			$("#btn_entity_cancel").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_delete_account"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel_account"),
							funct	: null,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_can"),
							funct	: do_lc_hide_div,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})
			$("#btn_edit").off("click").on("click", function(){
				var idPer = [];
				idPer = $(this).data();
				do_lc_edit_person(idPer);
				
			})
		}
		const do_lc_edit_person = (idPer) => {
						
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id: idPer.id});	
	
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_reponse_edit_person, [idPer.id]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_reponse_edit_person = function(sharedJson, id){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					
					if(data.inf04 && typeof data.inf04 == "string"){
						data.inf04 = JSON.parse(data.inf04);
					}
					
					if(data.inf06 && typeof data.inf06 == "string"){
						data.inf06 = JSON.parse(data.inf06);
					}
					if(data.inf02 && typeof data.inf02 == "string"){
						data.inf02 = JSON.parse(data.inf02);
					}

					$(pr_DIV_CONTENT).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_MODIFY, data));

					App.SummerNoteController.do_lc_show("#div_create_introduce");//text editor 
					App.SummerNoteController.do_lc_show("#div_create_service");//text editor
					App.SummerNoteController.do_lc_show("#div_create_mission");//text editor
					App.SummerNoteController.do_lc_show("#div_create_information");//text editor
					
					do_lc_group_showMod_FileUploader(data);
					do_lc_bind_event_mod_group(data, id);
					
					console.log(data)
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		const do_lc_group_showMod_FileUploader = function (data) {
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
		
		const do_lc_bind_event_mod_group = function(obj){
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
							funct	: null,
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
			
			$("#btn_new_cancel").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save_cancel"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: null,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_cancel,
							param	: [obj],
							classBtn: "btn-danger"
						}
					}
				});
			})
			
			$("#btn_cancel_delete").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save_cancel"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: null,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_cancel,
							param	: [obj],
							classBtn: "btn-danger"
						}
					}
				});
			})
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
					do_lc_show_entity(data, var_lc_MODE_SEL);
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					
					pr_ctr_List.do_lc_show(true);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj, var_lc_MODE_SEL);
		}
		
		this.do_lc_generate_cats = function(data){
			var dataGenerated=[];
			for(var o in data){
				if(data[o]==1){
					dataGenerated.push({"catId" : o})
				}
			}
			return dataGenerated;
		}
		
		
		this.do_lc_Save_Entity = function (pr_divContent, ent, mode){
			if (!pr_divContent) pr_divContent	= "#div_main_content";
			if (!mode)			mode			= pr_SV_MOD;
			
			if (!ent.files) ent.files = [];		
			let	data	= req_gl_data({
				dataZoneDom		: $(pr_divContent),
			});
			
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return false;
			}
			
			//---clone ent data----------------------------------
			var 	obj 		= JSON.parse(JSON.stringify(ent));
			delete 	obj.pass01;
			delete 	obj.avatar;
			delete 	obj.dt01;
			delete 	obj.histories;
			delete 	obj.man;
			delete 	obj.sup;
			
			do_lc_data_send	(data, mode);
		}
		
		var do_lc_data_send= function(data, mode){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, mode==var_lc_MODE_NEW? pr_SV_NEW : pr_SV_MOD);
			ref["forPublic"]	= 0;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_data_send_callback	, [mode]));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		var do_lc_data_send_callback = function(sharedJson, mode){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				do_lc_show_entity(data, var_lc_MODE_SEL);
				do_gl_show_Notify_Msg_Success ($.i18n('common_success_update'));
			} else {   
				if(mode == var_lc_MODE_NEW) do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get_error'));
				else do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_hide_div = () => {
			pr_ctr_Main.do_lc_show();
		}
	}
	
	return Ent;
});