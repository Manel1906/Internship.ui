define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntTabHistDisease 					= function (grpName, header, content, footer) {
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
		const pr_SV_GET				= "SVGetHistDisease"; 
		const pr_SV_NEW				= "SVNew"; 
		const pr_SV_MOD				= "SVModHistDisease"; 
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
			do_lc_get_his_disease 		(ent);
		}
		
		var do_lc_show_info 			= function(ent){
			$(pr_divContent				).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS				, ent));
			
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
		var do_lc_show_his_disease 			= function(ent,data){
			$("#div_his_chronic").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC, data));
			$("#btn_mod_chronic").off("click").on("click", function(){
				do_lc_show_entity_chronic(ent,data);
			});
		}
		var do_lc_show_his_family 			= function(ent,data){
			$("#div_his_family").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_FAMILY, data));
			$("#btn_mod_family").off("click").on("click", function(){
				do_lc_show_entity_family(ent,data);
			});
		}
		var do_lc_show_his_allergy 			= function(ent,data){
			$("#div_his_allergy").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_ALLERGY, data));
			$("#btn_mod_allergy").off("click").on("click", function(){
				do_lc_show_entity_allergy(ent,data);
			});
		}
		const do_lc_show_entity_chronic = (ent,data) => {
			$("#btn_mod_chronic"				).addClass("hide");
			$(".info-show"						).addClass('hide');
			
			$("#a_btn_sav_chronic"				).removeClass("hide");
			$("#a_btn_canc_chronic"				).removeClass("hide");
			
			$('#btnAddChronic'					).removeClass('hide');
			$('#div_his_chronic .btnRemoveRow'	).removeClass('hide');
			$('#div_his_chronic .inf-entity'	).removeClass('hide');
			
			$('#btnAddChronic').on('click', function() {
				do_lc_bind_event_new_chronic(ent);
		    });
			
			$('.btnRemoveRowChronic>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_chronic'	).on('click', function() {
				do_lc_show_his_disease 	(ent);
			});
			
			$("#a_btn_sav_chronic").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_chronic"),
				});
			
				if(obj.hasError)	return;
				inforChronic = {}
				idPer = ent.id
				inforChronic.inf01 			= obj.data.inf01;
				if (inforChronic.inf01)
					inforChronic.inf01		= inforChronic.inf01.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_chronic(inforChronic,idPer, do_lc_get_his_disease);
			});
		}
		const do_lc_show_entity_family = (ent) => {
			$("#btn_mod_family"						).addClass("hide");
			$(".info-show-family"					).addClass('hide');
			
			$("#a_btn_sav_family"					).removeClass("hide");
			$("#a_btn_canc_family"					).removeClass("hide");
			
			$('#btnAddFamily'						).removeClass('hide');
			$('.btnRemoveRow'		).removeClass('hide');
			$('.inf-entity-family'	).removeClass('hide');
			
			$('#btnAddFamily').on('click', function() {
				do_lc_bind_event_new_family(ent);
		    });
			
			$('.btnRemoveRowFamily>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_family'	).on('click', function() {
				do_lc_show_his_family 	(ent);
			});
			
			$("#a_btn_sav_family").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_family"),
				});
			
				if(obj.hasError)	return;
				
				inforFamily = {}
				idPer = ent.id
				inforFamily.inf02 			= obj.data.inf02;
				if (inforFamily.inf02)
					inforFamily.inf02		= inforFamily.inf02.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_family(inforFamily,idPer, do_lc_get_his_disease);
			});
		}
		const do_lc_show_entity_allergy = (ent,data) => {
			$("#btn_mod_allergy"	).addClass("hide");
			$(".info-show-allergy"	).addClass('hide');
			
			$("#a_btn_sav_allergy"	).removeClass("hide");
			$("#a_btn_canc_allergy"	).removeClass("hide");
			
			$('#btnAddAllergy'		).removeClass('hide');
			$('.btnRemoveRowAllergy').removeClass('hide');
			$('.inf-entity-allergy').removeClass('hide');
			
			$('#btnAddAllergy').on('click', function() {
				do_lc_bind_event_new_allergy(ent);
		    });
			
			$('.btnRemoveRow>button').on('click', function() {
				$(this).closest('tr').remove();
			});
			
			$('#a_btn_canc_allergy'	).on('click', function() {
				do_lc_show_his_allergy 	(ent);
			});
			
			$("#a_btn_sav_allergy").off("click").on("click", function(){
				let	obj	 			= req_gl_data({
					dataZoneDom		: $("#table_allergy"),
				});
			
				if(obj.hasError)	return;
				
				inforAllergy = {}
				idPer = ent.id
				inforAllergy.inf03 			= obj.data.inf03;
				if (inforAllergy.inf03)
					inforAllergy.inf03		= inforAllergy.inf03.filter(element => element !== null && element !== undefined);
				do_lc_save_entity_allergy(inforAllergy,idPer, do_lc_get_his_disease);
			});
		}
		const do_lc_bind_event_new_chronic = function(data) {			
		    const maxIndex 	= Math.max(0, ...$('#tbody_entity_chronic').find('input[data-name="index"]').map(function () {
		        return parseInt($(this).val()) || 0;
		    }).get()) +1;
		    
			const newRow 	= tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DISEASE_HIS_CHRONIC_ADD, { index: maxIndex });
		    const addedRow 	= $('#tbody_entity_chronic').append(newRow).find('tr').last();
		
		    addedRow.find('input[data-name="index"]').val(maxIndex).end()[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    
			$(".btnRemoveRow>button").off("click").on("click", function () {
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
		
		const do_lc_save_entity_family = function(myObject,idPer, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject,perId: idPer});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_family_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_family_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				entity.id = ent.entId
				if (callback) callback (entity);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_save_entity_allergy = function(myObject,idPer, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject,perId: idPer});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_allergy_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_allergy_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				entity.id = ent.entId
				if (callback) callback (entity);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_save_entity_chronic = function(myObject,idPer, callback){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: myObject,perId: idPer});
			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_save_entity_chronic_callback, [myObject, callback]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_save_entity_chronic_callback = function(sharedJson, entity, callback){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let ent 	= sharedJson[App['const'].RES_DATA];
				entity.id = ent.entId
				if (callback) callback (entity);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		const do_lc_get_his_disease = function(ent){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);	
			ref["perId"]		= ent.id;
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_Entity_his_disease_callback, [ent]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_Entity_his_disease_callback = function(sharedJson, ent){
			let data			= {};
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data 		= sharedJson[App['const'].RES_DATA];
			}
			do_lc_clean_data(data)
			do_lc_show_his_disease 		(ent,data);
			do_lc_show_his_family 		(ent,data);
			do_lc_show_his_allergy 		(ent,data);
		}
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;

			if(ent.inf01 && typeof ent.inf01 == "string"){
				ent.inf01 = JSON.parse(ent.inf01);
			}
			
			if(ent.inf02 && typeof ent.inf02 == "string"){
				ent.inf02 = JSON.parse(ent.inf02);
			}
			
			if(ent.inf03 && typeof ent.inf03 == "string"){
				ent.inf03 = JSON.parse(ent.inf03);
			}
		}
		
		//---------------------------------Ajax----------------------------------------------
		this.do_lc_cancel = function(obj){
			do_lc_show_entity(obj, var_lc_MODE_SEL);
		}
	}
		
	return EntTabHistDisease;
});