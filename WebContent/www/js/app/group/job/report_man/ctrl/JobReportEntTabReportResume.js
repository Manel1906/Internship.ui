define(['jquery'], function($) {
	var JobReportEntTabReportResume = function(header, content, footer){
		var pr_divHeader 			= header  ? header : null;
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divContent 		= "#div_prj_content";
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabObserv 		= "#div_prj_observation";
		const pr_divTabObservTab	= "#div_prj_observation_tab_body";
		const pr_divTabAddr	 		= "#div_prj_address";
		const pr_divTabBank	 		= "#div_prj_bank";

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//var url_header				= req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);

		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 30000;
		const pr_SERVICE_CLASS		= "ServicePerPerson"; //to change by your need
		const pr_SV_GET				= "SVPersonGet"; 
		var pr_SV_NEW				= "SVPersonNew"; 
		var pr_SV_DEL				= "SVPersonDel"; 

		var pr_SV_MOD				= "SVPersonMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVPersonLckReq";
		var pr_SV_LCK_END			= "SVPersonLckEnd";
		var pr_SV_LCK_DEL			= "SVPersonLckDel";
		
		var pr_SV_VALIDATE			= "SVPersonValidate";
		
		//------------------local variable----------------------------------------------------------
		let pr_OBS_TEMP				= {};
		let pr_docsObj				= {};
		
		//------------------variable pagination post------------------------------------------------------
		var pr_POST_BEGIN 			= 0;
		const pr_POST_NUMBER 		= 10;
		const pr_POST_TYPE_PRJ 		= 202;
		
		const pr_POST_NO_SUB 		= 1;
		const pr_POST_HAS_SUB 		= 2;
		
		const pr_POST_KEY_ENTER 	= 13;
		//------------------const object------------------------------------------------------
		const formatDate 			= {"en": "enShortDate", "fr": "frShortDate", "vn": "viShortDate"};
		const local 				= localStorage.language ? localStorage.language : "en";

		const typePartnerClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		var pr_ctr_List 			= App.controller.PrjPartner.List;
		var pr_ctr_Ent				= App.controller.PrjPartner.Ent;
		
		this.do_lc_show = function(prj, mode) {
			try{
				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if (params.id){
					do_lc_show_prj(prj, mode);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}
		
		var do_lc_show_prj = function(prj, mode){
			$(pr_divTabObserv)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME, prj));
			$(pr_divTabObservTab)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME_LINE, prj));
			$("#lbl_prj_partner_observ_lab").html(App.data.user.login);
			
			let divActionMod = $("#a_btn_save, #a_btn_cancel, #div_prj_avatar_file_upload, .action-item-observ, .action-item-doc, #div_prj_ent_file_upload, .item-file-delete");
			let divActionSel = $("#a_btn_edit, #div_avatar_partner, #div_lst_doc");
			if(mode == pr_ctr_Main.var_lc_MODE_MOD || mode == pr_ctr_Main.var_lc_MODE_SEL){
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
				
				divActionMod.removeClass("hide");
				divActionSel.addClass("hide");
			} else {
				do_gl_disable_edit($(pr_divContent));
				
				divActionMod.addClass("hide");
				divActionSel.removeClass("hide");
			}
			
			do_lc_bind_event_observ(prj);
		}
		
		let pr_min_new_observ_id	= -1;
		var do_lc_bind_event_observ = function(prj){
			let observs	= prj.tpyInfos ? prj.tpyInfos.filter(obs => !obs.cfgVal01) : [];
			let objData = observs.reduce((currentObj, obs)=>{
				currentObj[obs.id] = obs;
				return currentObj;
			}, {});
			pr_OBS_TEMP = objData;
			
			$(".observ-edit").off("click").on("click", function(){
				let $this 			= $(this);
				let {observid} 		= $this.data();
				let mem 			= pr_OBS_TEMP[observid];
				if(mem){
					let parentTR 	= $this.closest("tr");
					parentTR.find(".content-observ").addClass("hide");
					parentTR.find(".edit-observ").removeClass("hide");
					let divLev 		= parentTR.find(".level-edit");
					let divTyp 		= parentTR.find(".typ-edit");
					
					let inpInfo02	= parentTR.find(".inp_prj_partner_observ_info02");					
					do_gl_set_input_autocomplete(inpInfo02, {
						source: [{"label" : $.i18n('per_tab_observation_event_01'),  "displ" : $.i18n('per_tab_observation_event_01')}, {"label" : $.i18n('per_tab_observation_event_02'), "displ" : $.i18n('per_tab_observation_event_02')}, {"label" : $.i18n('per_tab_observation_event_03'), "displ" : $.i18n('per_tab_observation_event_03')}, {"label" : $.i18n('per_tab_observation_event_04'), "displ" : $.i18n('per_tab_observation_event_04')}], 
							minLength: 0
					}, mem);

					let inpInfo05	= parentTR.find(".inp_prj_partner_observ_info05");
					do_gl_set_input_autocomplete(inpInfo05, {
						source: [{"label" : $.i18n('per_tab_observation_status_01'),  "displ" : $.i18n('per_tab_observation_status_01')}, {"label" : $.i18n('per_tab_observation_status_02'), "displ" : $.i18n('per_tab_observation_status_02')}, {"label" : $.i18n('per_tab_observation_status_03'), "displ" : $.i18n('per_tab_observation_status_03')}, {"label" : $.i18n('per_tab_observation_status_04'), "displ" : $.i18n('per_tab_observation_status_04')}, {"label" : $.i18n('per_tab_observation_status_05'), "displ" : $.i18n('per_tab_observation_status_05')}], 
							minLength: 0
					}, mem);
					
					do_lc_bindEvent_tabObservEdit(observid, divLev, divTyp);
					$(".action-mem").removeClass("hide");
				}
			})

			$(".observ-delete").off("click").on("click", function(){
				let {observid} = $(this).data();
				let mem 	= pr_OBS_TEMP[observid];
				if(mem){
					delete pr_OBS_TEMP[observid];
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			})
			
			$("#inp_prj_partner_observ_info05").off("blur").on("blur", function(){
				let	newObsData	= req_gl_data({
					dataZoneDom		: $("#div_prj_observation_new_line"),
					dataSelector	: ".newObsData"
				});
				if(newObsData.hasError) {
					$("#inp_prj_partner_observ_info05").val("");
					return;
				}
				let newLine	= newObsData.data;
				newLine.id	= pr_min_new_observ_id;
				newLine.lab	= App.data.user.login;
//				let lab		=App.data.user.login;
//				let info01	=$("#inp_prj_partner_observ_info01").val();
//				let info02	=$("#inp_prj_partner_observ_info02").val();
//				let info04	=$("#inp_prj_partner_observ_info04").val();
//				let info03	=$("#inp_prj_partner_observ_info03").val();
//				let info05	=$("#inp_prj_partner_observ_info05").val();
				if(!prj.tpyInfos) prj.tpyInfos = [];
				let currObsIdx = prj.tpyInfos.length;
//				let newLine	= {	lab: 	lab,
//						id:		pr_min_new_observ_id,
//						info01: info01,
//						info02: info02,
//						info04: info04,
//						info03: info03,
//						info05: info05};
				pr_min_new_observ_id--;
				prj.tpyInfos.push(newLine);
				$(pr_divTabObservTab).append(tmplCtrl.req_lc_compile_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME_LINE, {tpyInfos:[newLine]}));
				$(pr_divTabObservTab).children("tr").last().find("input.objData, textarea.objData").data("gindex", currObsIdx);
				$(".action-item-observ").removeClass("hide");
				$(".action-item-doc").removeClass("hide");
				do_lc_bind_event_observ(prj);
				$("#inp_prj_partner_observ_info01").val("");
				$("#inp_prj_partner_observ_info02").val("");
				$("#inp_prj_partner_observ_info04").val("");
				$("#inp_prj_partner_observ_info03").val("");
				$("#inp_prj_partner_observ_info05").val("");
			})
							
			do_gl_set_input_autocomplete($("#inp_prj_partner_observ_info02"), {
				source: [{"label" : $.i18n('per_tab_observation_event_01'),  "displ" : $.i18n('per_tab_observation_event_01')}, {"label" : $.i18n('per_tab_observation_event_02'), "displ" : $.i18n('per_tab_observation_event_02')}, {"label" : $.i18n('per_tab_observation_event_03'), "displ" : $.i18n('per_tab_observation_event_03')}, {"label" : $.i18n('per_tab_observation_event_04'), "displ" : $.i18n('per_tab_observation_event_04')}], 
					minLength: 0
			}, {});

			do_gl_set_input_autocomplete($("#inp_prj_partner_observ_info05"), {
				source: [{"label" : $.i18n('per_tab_observation_status_01'),  "displ" : $.i18n('per_tab_observation_status_01')}, {"label" : $.i18n('per_tab_observation_status_02'), "displ" : $.i18n('per_tab_observation_status_02')}, {"label" : $.i18n('per_tab_observation_status_03'), "displ" : $.i18n('per_tab_observation_status_03')}, {"label" : $.i18n('per_tab_observation_status_04'), "displ" : $.i18n('per_tab_observation_status_04')}, {"label" : $.i18n('per_tab_observation_status_05'), "displ" : $.i18n('per_tab_observation_status_05')}], 
					minLength: 0
			}, {});
		}

		var do_lc_bindEvent_tabObservEdit = function(observid, divLev, divTyp){
			$(divLev).off("change").on("change", function(){
				pr_OBS_TEMP[observid].lev = $(this).val();
			})

			$(divTyp).off("change").on("change", function(){
				pr_OBS_TEMP[observid].typ = $(this).val();;
			})
		}
		
	}
	
	return JobReportEntTabReportResume;
});