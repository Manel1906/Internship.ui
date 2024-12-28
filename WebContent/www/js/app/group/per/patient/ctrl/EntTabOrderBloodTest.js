define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntTabOrderBloodTest 					= function (grpName, header, content, footer) {
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
		
		const pr_SERVICE_CLASS			= "ServicePerPatient"; //to change by your need
		const pr_SERVICE_CLASS_CATE		= "ServiceTpyCategory"; //to change by your need
		const pr_SERVICE_CLASS_MEDICINE	= "ServiceMatMaterial";
		const pr_SV_LIST_MEDICINE		= "SVSearch"; 
		const pr_SV_GET_BY_ID			= "SVGetHistMedicineById"; 
		const pr_SV_GET_CAT				= "SVGet"; 
		const pr_SV_GET_LST				= "SVLstPage"; 
		const pr_SV_LIST_PAGE			= "SVGetHistMedicine"; 
		const pr_SV_NEW					= "SVNew"; 
		const pr_SV_MOD					= "SVModHistMedicine"; 
		const pr_SV_DEL					= "SVDel"; 
		//------------------------------------------------------------------------------------
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		const pr_TYP_MEDICINE 		= 200;
		const pr_TYP_NAME_MEDICINE 	= 2;
		const pr_STAT_ACTIVE		= 1;
		var   pr_id_entity			= null;
		var   pr_id_person			= null;
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
			do_lc_show_info_test_blood 		(ent);
			do_lc_show_lst_test_blood 			(ent);
		}
		
		var do_lc_show_info_test_blood 			= function(ent){
			$(pr_divContent				).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_TEST_BLOOD				, ent));
			
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
		var do_lc_show_lst_test_blood 			= function(ent){
			$("#div_entity_test_blood").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_TEST_BLOOD_LIST				, ent));
			$(".infor-get").off("click").on("click", function () {
				let {id} =  $(this).data();
			//	do_lc_get_content_medicine		(id);
				do_lc_show_content_medicine(ent)
			})
			do_lc_list_ByAjax_lst_test_blood(ent)
		}
		var do_lc_list_ByAjax_lst_test_blood 	= function(ent){
			let divList = $("#list_his_disease");
			let divPan  = $("#div_list_pagination_disease");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_PAGE, {	perId: ent.id  });
			
			const callbackFunct 	= data => do_get_list_ByAjax_callback(data, ent);
			
			let opt = {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: 9,
					pageRange		: 1,
					callback		: callbackFunct
			};
			
			do_gl_init_pagination_opt(opt);
		}
		var do_get_list_ByAjax_callback = function(sharedJson, ent){
			let template		=  tmplName.TMPL_ENT_TAB_TEST_BLOOD_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#list_medicine")	.html(tmplCtrl.req_lc_compile_tmpl(template		, { "data": data.lst }));
			
			do_lc_bind_event_lst_test_blood(ent)
		}
		const do_lc_get_content_medicine = function(id) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_BY_ID, {id: id});	
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_content_medicine_his_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_content_medicine_his_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_lc_clean_data(data)
					do_lc_show_content_medicine		(data);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		var do_lc_show_content_medicine 			= function(ent){
			$("#div_entity_content_test_blood").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_TEST_BLOOD_CONTENT		, ent));
			$("#div_entity_test_blood_files").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_TEST_BLOOD_CONTENT_FILE	, ent));
			
			$("#cancel_header").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("prj_user_group_new_btn_back"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("prj_user_group_new_btn_cancel"),
								funct	: self.do_lc_cancel,
								param	: [ent],
								classBtn: "btn-danger"
							}
						}
					});
				})
		}
		
		//----------------------------------------------------------------------------------------------
		var do_lc_handle_date = (strDate) => {
			let tmp = getDateEN(strDate);
			let res = {};
			res.dt = tmp.slice(0, 10);
			res.tm = tmp.slice(11, 16);
			return res;
		}
		var getDateEN = function(dObj) {
			return req_gl_DateStr_From_DateObj(dObj, DateFormat.masks.enFullDate);		
		}
		var do_lc_bind_event_lst_test_blood 			= function(ent){
			$(".infor-get").off("click").on("click", function () {
				let {id} =  $(this).data();
				do_lc_get_content_medicine		(id);
			})
		}	
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;


			if(ent.inf04 && typeof ent.inf04 == "string"){
				ent.inf04 = JSON.parse(ent.inf04);
			}
			
			if(ent.inf06 && typeof ent.inf06 == "string"){
				ent.inf06 = JSON.parse(ent.inf06);
			}
			if(ent.inf01 && typeof ent.inf01 == "string"){
				ent.inf01 = JSON.parse(ent.inf01);
			}
			
			if(ent.inf02 && typeof ent.inf02 == "string"){
				ent.inf02 = JSON.parse(ent.inf02);
			}
			if(ent.inf07 && typeof ent.inf07 == "string"){
				ent.inf07 = JSON.parse(ent.inf07);
			}
			if(ent.inf05 && typeof ent.inf05 == "string"){
				ent.inf05 = JSON.parse(ent.inf05);
			}
		}
		
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj, var_lc_MODE_SEL);
		}
	}
		
	return EntTabOrderBloodTest;
});