define([
	'text!group/per_partner/tmpl/PrjPartner_Ent_Tab_Docs.html'
	],
	function(	
			PrjPartner_Ent_Tab_Docs
	){
	
	var PrjPartnerEntTabDocs = function(header, content, footer){
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
		
		tmplName.PRJ_PARTNER_ENT_TAB_DOCS				= "PrjPartner_Ent_Tab_Docs";
		
		this.do_lc_show = function(prj, mode) {
			try{
				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if (params.id){
					do_lc_load_view();
					do_lc_show_prj(prj, mode);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}
		
		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_DOCS			, PrjPartner_Ent_Tab_Docs);
		}	
		
		var do_lc_show_prj = function(prj, mode){
			$(pr_divTabDocs)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_DOCS, prj));
			
			let divActionMod = $("#a_btn_save, #a_btn_cancel, #div_prj_avatar_file_upload, .action-item-observ, .action-item-doc, #div_prj_ent_file_upload, .item-file-delete");
			let divActionSel = $("#a_btn_edit, #div_avatar_partner, #div_lst_doc");
			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
				
				divActionMod.removeClass("hide");
				divActionSel.addClass("hide");
			} else {
				do_gl_disable_edit($(pr_divContent));
				
				divActionMod.addClass("hide");
				divActionSel.removeClass("hide");
			}
			
			do_lc_bind_event_docs_prj(prj);
		}
		
		var do_lc_bind_event_docs_prj = function(prj){
//			pr_docsObj 		= {files: prj.files};
			let option		= {
					fileinput	: {param : {typ01: 1} },//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($(pr_divTabDocs), option);
			
			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				if(path)	window.open(path, "_blank");
			})
			
			$(".item-file-delete").off("click").on("click", function(){
				let id	= $(this).data("id");
				$(this).parents("tr").remove();
			})
			
			$("#btn_add_doc").off("click").on("click", function(){
				$(".action-item-doc").removeClass("hide");
				$("#div_prj_ent_file_upload").removeClass("hide");
				$(this).addClass("hide");
				$(".item-file-delete").removeClass("hide");
			})
			
			$("#a_btn_save_doc").off("click").on("click", function(){
				let	data	= req_gl_data({
					dataZoneDom		: $(pr_divTabDocs),
					skipError		: true
				});
				
				if(data.hasError)	return false;
				
				let prj 		= data.data;
				if(!prj.files)	prj.files	= [];
				prj.files		= prj.files.concat(obj.files);
				
				console.log(prj.files);
				
				do_lc_save_files_prj(prj);
			})
			
			$("#a_btn_cancel_doc").off("click").on("click", function(){
				do_lc_show_prj_docs(prj);
			})
		}
		
		var do_lc_save_files_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_SAVE_FILES);	
			ref["obj"]		= JSON.stringify(prj);
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_files_prj, [prj]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_lc_afterSave_files_prj = function(sharedJson, prj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				prj.docs = sharedJson[App['const'].RES_DATA].docs;
				do_lc_show_prj_docs(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
	}
	
	return PrjPartnerEntTabDocs;
});