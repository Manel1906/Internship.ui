define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntTabInfo 					= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  	? header : null;
		var pr_divContent 			= content  	? content : "#div_entity_view";
		var pr_divFooter 			= footer  	? footer : null;
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		
		const pr_SERVICE_CLASS		= "ServicePerProducer"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		const pr_SV_NEW				= "SVNew"; 
		const pr_SV_MOD				= "SVMod"; 
		const pr_SV_DEL				= "SVDel"; 
		//------------------------------------------------------------------------------------
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const pr_STAT_ACTIVE		= 1;
		
		//------------------const object------------------------------------------------------
		//-----------------------------------------------------------------------------------
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.UI.Main;

			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(ent, mode){               
			try{
				do_lc_show_entity(ent, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_show_entity 			= function(ent, mode){
			do_lc_show_info 			(ent);
			do_lc_show_file 			(ent);
			do_lc_show_contact 			(ent);
			/*do_lc_show_insurance 		(ent);*/
						
//			pr_ctr_Ent.do_lc_reqRole_User();
//			pr_ctr_Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
		}
		
		var do_lc_show_info 			= function(ent){
			$(pr_divContent				).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO				, ent));
			$("#btn_edit").off("click").on("click", function(){
				do_lc_edit_entity(ent);
			});
		}
		var do_lc_show_file 			= function (ent){
	//		ent.files = ent.files?.filter(e => e.typ01 === 2 && e.typ02 === 10) || [];
			$("#div_inf_file"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO_FILE			, ent));
			$(".item-file-download").off("click").on("click", function(){
				let {path}				= $(this).data();
				path && window.open(path, "_blank");
			})
		}
				
		var do_lc_show_contact 			= function (ent){
			$("#div_inf_contact"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO_CONTACT		, ent));
			$("#btn_mod_contact"		).off("click").on("click", function(){
				do_lc_get_entity_contact(ent);
			})
		}
/*		var do_lc_show_insurance 		= function (ent){
			$("#div_inf_insurance"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO_INSURANCE	, ent));
			$("#btn_mod_insurance"		).off("click").on("click", function(){
				do_lc_get_entity_insurance(ent);
			})
						
		}*/
		
		const do_lc_get_entity_contact = (data) => {
			$("#btn_mod_contact"					).addClass("hide");
			$("#div_inf_contact .info-show"			).addClass('hide');
			
			$("#a_btn_sav_contact"					).removeClass("hide");
			$("#a_btn_canc_contact"					).removeClass("hide");
			
			$('#btnAddContact'						).removeClass('hide');
			$('#div_inf_contact .btnRemoveRow'		).removeClass('hide');
			$('#div_inf_contact .inf-entity'		).removeClass('hide');
			
			$('#btnAddContact').on('click', function() {
				do_lc_bind_event_new_contact(data);
		    });
			
			$('.btnRemoveRow>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_contact'	).on('click', function() {
				do_lc_show_contact 	(data);
			});
			
			$("#a_btn_sav_contact").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_contact"),
				});
				
				//check data error
				if(obj.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
				
				data.inf08 			= obj.data.inf08;
				if (data.inf08)
					data.inf08		= data.inf08.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_subInfo(data, do_lc_show_contact);
			});
		}
		
		
		const do_lc_get_entity_insurance = (data) => {
			$("#btn_mod_insurance"						).addClass("hide");
			$("#div_inf_insurance .info-show"			).addClass('hide');
			
			$("#a_btn_sav_insurance"					).removeClass("hide");
			$("#a_btn_canc_insurance"					).removeClass("hide");
			
			$('#btnAddInsurance'						).removeClass('hide');
			$('#div_inf_insurance .btnRemoveRow'		).removeClass('hide');
			$('#div_inf_insurance .inf-entity'			).removeClass('hide');
			
			$('#btnAddInsurance').on('click', function() {
				do_lc_bind_event_new_insurance(data);
		    });
			
			$('.btnRemoveRow>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			/*$('#a_btn_canc_insurance'	).on('click', function() {
				do_lc_show_insurance 	(data);
			});*/
			
			$("#a_btn_sav_insurance").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_insurance"),
				});
			
				//check data error
				if(obj.hasError){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
					return;
				}
				
				data.inf09 			= obj.data.inf09;
				if (data.inf09)
					data.inf09		= data.inf09.filter(element => element !== null && element !== undefined);
				/*do_lc_save_entity_subInfo(data, do_lc_show_insurance);*/
			});
		}
				
				
		const do_lc_save_entity_subInfo = function(myObject, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_subInfo_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_subInfo_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				
				if (callback) callback (entity);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
					
				
		const do_lc_bind_event_new_contact = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_contact').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO_CONTACT_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_contact').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRow>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
		
		const do_lc_bind_event_new_insurance = function(data) {
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_insurance').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		
		    const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO_INSURANCE_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_insurance').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			
			$(".btnRemoveRow>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
			
		const do_lc_edit_entity = (data) => {
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_INFO_MOD, data));

			do_lc_group_showMod_FileUploader(data);
			do_lc_bind_event_mod_entity(data);
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
							funct	: null,
							param	: [],
						},
						OK: {
							lab		: $.i18n("prj_user_group_new_btn_save"),
							funct	: self.do_lc_mod,
							param	: [obj],
							classBtn: "btn-primary"
						}
					}
				});
			})
			
			$("#btn_cancel_new_01,#btn_cancel_new_02").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save_cancel"),
					width	: "400px",
					autoclose	: true,
					buttons	: {
						NO: {
							lab		: $.i18n("prj_user_group_new_btn_back"),
							funct	: null,
							param	: [],
						},
						OK: {
							lab		: $.i18n("prj_user_group_new_btn_cancel"),
							funct	: self.do_lc_cancel,
							param	: [obj],
							classBtn: "btn-danger"
						}
					}
				});
			});
		}
		
		this.do_lc_mod = function(obj){
			const data = req_gl_data({
				dataZoneDom: $("#frm_new_group")
			});

			//check data error
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_data'));
				return;
			}

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
					do_lc_clean_data(data)
					do_lc_show_entity(data, var_lc_MODE_SEL);
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					
					pr_ctr_List.do_lc_show(true);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;

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
			if (ent.inf08 && typeof ent.inf08 == "string") {
			    ent.inf08 = JSON.parse(ent.inf08);
			}
			
			if (ent.inf09 && typeof ent.inf09 == "string") {
				ent.inf09 = JSON.parse(ent.inf09);
			}
		}
		
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj, var_lc_MODE_SEL);
		}
	}
		
	return EntTabInfo;
});