define([
	'text!group/user/client/tmpl/PrjUser_Ent_Tab_Person_Info.html',	
    'text!group/user/client/tmpl/PrjUser_Sel_List_Legal_Status.html'
	],
	function(	
			PrjUser_Ent_Tab_Person_Info,
			PrjUser_Sel_List_Legal_Status
	){
	
	var PrjUserEntTabPersonInfo = function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divContent 		= "#div_user_content";
		const pr_divTabPerInfo 		= "#div_user_info_person";
		const pr_divTabJobPosition	= "#div_user_position";
		
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
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
		
		tmplName.PRJ_USER_ENT_TAB_PERSON_INFO		= "PrjUser_Ent_Tab_Person_Info";
		tmplName.PRJ_USER_LEGAL_STAT				= "PrjUser_Sel_List_Legal_Status";	
		
		//---------------------------------Ajax----------------------------------------------
		var do_get_per_legalStat = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceCfgGroup', 'SVCfgGroupGet');
			ref["id"]		= 102;
			ref["withValue"]= "true";
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_get_per_legalStat_response, []));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_get_per_legalStat_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				App.data["PerLegalStat"] = [];
				$.each(data.vals, function(i, e) {
					if(e.val02 == 1) {
						App.data["PerLegalStat"].push(e);
					}
				});
				tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_LEGAL_STAT		, PrjUser_Sel_List_Legal_Status); 
				tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LEGAL_STAT	, App.data["PerLegalStat"]);
			}
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(prj, mode){               
			try{
				do_get_per_legalStat();
//				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
//				if (params.id){
					do_lc_load_view();
					do_lc_show_prj(prj, mode);
//				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}
		
		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_PERSON_INFO			, PrjUser_Ent_Tab_Person_Info);

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_LEGAL_STAT		, PrjUser_Sel_List_Legal_Status); 
			tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LEGAL_STAT	, App.data["PerLegalStat"]);
		}	
		
		var do_lc_show_prj = function(prj, mode){
			$(pr_divTabPerInfo).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_PERSON_INFO, prj));
			$("#sel_autuser_header_legalstat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LEGAL_STAT));
			
			let divAction = $("#a_btn_save, #a_btn_cancel, #div_prj_ent_file_upload, .action-item-doc, .item-file-delete");
			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
				do_gl_enable_edit($(pr_divTabPerInfo), ".objData", mode);
				divAction.removeClass("hide");
			} else {
				do_gl_disable_edit($(pr_divTabPerInfo), ".objData", mode);
				divAction.addClass("hide");
			}
			
			do_lc_bind_event_content_prj(prj);
		}
		
		var do_lc_bind_event_content_prj = function(prj){
			
		}
	}
	
	return PrjUserEntTabPersonInfo;
});