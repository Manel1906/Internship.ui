define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntTabHistMedical 					= function (grpName, header, content, footer) {
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
		
		const pr_SERVICE_CLASS		= "ServicePerClient"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		const pr_SV_LIST_PAGE		= "SVGetHistMedicine"; 
		const pr_SV_NEW				= "SVNew"; 
		const pr_SV_MOD				= "SVModHistMedicine"; 
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
			do_lc_show_info_medical 		(ent);
			do_lc_show_his_disease 			(ent);
		}
		
		var do_lc_show_info_medical 			= function(ent){
			$(pr_divContent				).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL				, ent));
			
			$(".btn-resize-content").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
			$("#btn_new_entity").off("click").on("click", function () {
				do_lc_show_his_content_new		(ent);
				do_lc_show_his_prescription		(ent);
				do_lc_show_his_test_blood		(ent);
				do_lc_show_his_test_img 		(ent);
			})
		}
		var do_lc_show_his_disease 			= function(ent){
			$("#div_entity_his_medical").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST				, ent));
			do_lc_list_ByAjax_his_disease(ent)
		}
		var do_lc_list_ByAjax_his_disease 	= function(ent){
			let divList = $("#list_his_disease");
			let divPan  = $("#div_list_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_PAGE, {	perId: ent.id  });
			
			const callbackFunct 	= data => do_get_list_ByAjax_callback(data, ent);
			
			let opt = {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: 5,
					pageRange		: 1,
					callback		: callbackFunct
			};
			
			do_gl_init_pagination_opt(opt);
		}
		var do_get_list_ByAjax_callback = function(sharedJson, ent){
			let template		=  tmplName.TMPL_ENT_TAB_HIS_MEDICAL_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#list_his_disease")	.html(tmplCtrl.req_lc_compile_tmpl(template		, { "data": data.lst }));
			
			do_lc_bind_event_his_disease(ent)
		}
		var do_lc_show_his_content_new 			= function(ent){
			$("#div_ent_his_content_new").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT_NEW		, {}));
			App.SummerNoteController.do_lc_show("#div_show_sympton");//text editor
			App.SummerNoteController.do_lc_show("#div_show_dignose");//text editor
			App.SummerNoteController.do_lc_show("#div_show_note");//text editor
			do_lc_bind_event_content_new(ent)
			
		}
		var do_lc_show_his_prescription 			= function(ent){
			$("#div_ent_his_prescription").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT		, ent));
			$("#btn_mod_prescription").off("click").on("click", function(){
				do_lc_show_entity_prescription(ent);
			});
		}
		var do_lc_show_his_test_blood 			= function(ent){
			$("#div_ent_his_test_blood").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_BLOOD				, ent));
			$("#btn_mod_allergy").off("click").on("click", function(){
				do_lc_show_entity_allergy(ent);
			});
		}
		var do_lc_show_his_test_img 			= function(ent){
			$("#div_ent_his_test_img").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_IMG				, ent));
			$("#btn_mod_allergy").off("click").on("click", function(){
				do_lc_show_entity_allergy(ent);
			});
		}
		const do_lc_show_entity_his_disease = (data) => {
			$(".info-show"						).addClass('hide');
			
			$("#a_btn_sav_hist_medical"				).removeClass("hide");
			$("#a_btn_canc_hist_medical"			).removeClass("hide");
			
			$('#btnAddChronic'					).removeClass('hide');
			$('#div_his_chronic .btnRemoveRow'	).removeClass('hide');
			$('#div_his_chronic .inf-entity'	).removeClass('hide');
			
			$('#btnAddChronic').on('click', function() {
				do_lc_bind_event_new_chronic(data);
		    });
			
			$('.btnRemoveRow>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_hist_medical').on('click', function() {
				do_lc_show_his_disease 	(data);
			});
			
			$("#a_btn_sav_chronic").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_chronic"),
				});
			
				if(obj.hasError)	return;
				
				data.inf01 			= obj.data.inf01;
				if (data.inf01)
					data.inf01		= data.inf01.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_chronic(data, do_lc_show_entity_chronic);
			});
		}
		const do_lc_show_entity_prescription = (data) => {
			$("#btn_mod_prescription"						).addClass("hide");
			$(".info-show-prescription"					).addClass('hide');
			
			$("#a_btn_sav_prescription"					).removeClass("hide");
			$("#a_btn_canc_prescription"					).removeClass("hide");
			
			$('#btnAddPrescription'						).removeClass('hide');
			$('.btnRemoveRowPrescription'		).removeClass('hide');
			$('.inf-entity-prescription'	).removeClass('hide');
			
			$('#btnAddPrescription').on('click', function() {
				do_lc_bind_event_new_prescription(data);
		    });
			
			$('.btnRemoveRowPrescription>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_prescription'	).on('click', function() {
				do_lc_show_his_prescription 	(data);
			});
			
			$("#a_btn_sav_prescription").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_prescription"),
				});
			
				if(obj.hasError)	return;
				
				data.inf02 			= obj.data.inf02;
				if (data.inf02)
					data.inf02		= data.inf02.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_prescription(data, do_lc_show_entity_prescription);
			});
		}
		const do_lc_show_entity_allergy = (data) => {
			$("#btn_mod_allergy"					).addClass("hide");
			$("#div_inf_allergy .info-show"			).addClass('hide');
			
			$("#a_btn_sav_allergy"					).removeClass("hide");
			$("#a_btn_canc_allergy"					).removeClass("hide");
			
			$('#btnAddAllergy'						).removeClass('hide');
			$('#div_inf_allergy .btnRemoveRow'		).removeClass('hide');
			$('#div_inf_allergy .inf-entity-allergy').removeClass('hide');
			
			$('#btnAddAllergy').on('click', function() {
				do_lc_bind_event_new_allergy(data);
		    });
			
			$('.btnRemoveRow>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_allergy'	).on('click', function() {
				do_lc_show_his_allergy 	(data);
			});
			
			$("#a_btn_sav_allergy").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_allergy"),
				});
			
				if(obj.hasError)	return;
				
				data.inf03 			= obj.data.inf03;
				if (data.inf03)
					data.inf03		= data.inf03.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_allergy(data, do_lc_show_entity_allergy);
			});
		}
		const do_lc_bind_event_new_prescription = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_chronic').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_PRESCRIPT_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_prescription').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRowPrescription>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
		
		const do_lc_bind_event_new_family = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_family').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_family').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRow>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
		
		const do_lc_bind_event_new_allergy = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_allergy').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_allergy').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRow>button").off("click").on("click", function () {
		        $(this).closest('tr').remove();
		    });
		};
		
		const do_lc_save_entity_prescription = function(myObject, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_prescription_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_prescription_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				
				if (callback) callback (entity);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_save_entity_allergy = function(myObject, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_allergy_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_allergy_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				
				if (callback) callback (entity);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		var do_lc_bind_event_his_disease 			= function(ent){
			$(".infor-get").off("click").on("click", function () {
				do_lc_show_his_content		(ent);
				do_lc_show_his_prescription	(ent);
		//		do_lc_show_his_test_blood		(ent);
		//		do_lc_show_his_test_img 		(ent);
			})
		}		
		var do_lc_bind_event_content_new 			= function(ent){
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
								lab		: $.i18n("common_btn_yes"),
								funct	: self.do_lc_cancel,
								param	: [ent],
								classBtn: "btn-danger"
							}
						}
					});
			})
			$("#btn_edit_entity").off("click").on("click",function(){
					App.MsgboxController.do_lc_show({
						content : $.i18n("per_person_patient_title"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("prj_user_group_new_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("prj_user_group_new_btn_save_record"),
								funct	: self.do_lc_mod,
								param	: [ent.id],
								classBtn: "btn-primary"
							}
						}
					});
			})
			
			$("#radio_remote_checkbox").off("click").on("click",function(){
			    console.log('Checked status:', $(this).prop('checked'));
			});
			$('#radio_remote_checkbox').on('change', function() {
	            if ($(this).prop('checked')) {
	                $('#hist_date')			.removeClass('hide');
	                $('#hist_date_calendar').removeClass('hide');
	            } else {
	                $('#hist_date')			.addClass('hide');
	                $('#hist_date_calendar').addClass('hide');
	            }
        	});
		}		
		var do_lc_show_his_content 			= function(ent){
			$("#div_ent_his_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_HIS_MEDICAL_CONTENT				, ent));
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
								lab		: $.i18n("common_btn_yes"),
								funct	: self.do_lc_cancel,
								param	: [ent],
								classBtn: "btn-danger"
							}
						}
					});
				})
		}
		this.do_lc_mod = function(id){
			const data = req_gl_data({
				dataZoneDom: $("#frm_entity")
			});

			if(data.hasError)	return false;

			data.data.perId = id;
			do_lc_update_entity(data.data);
		}
		const do_lc_update_entity = function(ent) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: JSON.stringify(ent),perId: ent.perId});	

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
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;


			if(ent.inf04 && typeof ent.inf04 == "string"){
				ent.inf04 = JSON.parse(ent.inf04);
			}
			
			if(ent.inf06 && typeof ent.inf06 == "string"){
				ent.inf06 = JSON.parse(ent.inf06);
			}
		}
		
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj, var_lc_MODE_SEL);
		}
	}
		
	return EntTabHistMedical;
});