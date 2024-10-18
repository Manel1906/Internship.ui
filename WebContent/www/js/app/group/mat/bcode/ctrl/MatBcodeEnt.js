define([
	'jquery',
	'text!group/mat/bcode/tmpl/MatBcode_Ent.html'

	],
	function($, 
			MatBcode_Ent) {


	var MatBcodeEnt     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

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

		var self 						= this;		
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= -1;// change to adapt with back office for lock tool

		var pr_SERVICE_CLASS		= "ServiceSysReport"; //to change by your need
		var pr_SV_PRINT				= "SVSysReportGen"; 

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;


		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_lock					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatBcode.Main;
			pr_ctr_List 			= App.controller.MatBcode.List;

			pr_ctr_Ent				= App.controller.MatBcode.Ent;
			pr_ctr_EntHeader 		= App.controller.MatBcode.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatBcode.EntBtn;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_obj 	= obj;
			pr_mode		= mode;

			tmplCtrl		.do_lc_put_tmpl(tmplName.MAT_BCODE_ENT	, MatBcode_Ent); 	
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_ENT, {}));

			if(!obj) obj = {};
			pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
			pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);

			do_gl_render_datatable($(pr_divContent), {
				obj: pr_obj
			});

			if(mode == App['const'].MODE_NEW) {
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
			} else if(mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
		}

		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				var data 	= sharedJson.res_data;
				var url 	= App.path.BASE_URL_API + "?" +	data.path01;
				window.open(url, "_blank");
//				App.MsgboxController.do_lc_show({
//					title	: $.i18n("mat_bcode_btn_continue_title"),
//					content : $.i18n("mat_bcode_btn_continue_msg"),
//					buttons	: {
//						OK: {
//							lab		: $.i18n("common_btn_yes"),
//						},
//						NO: {
//							lab		:  $.i18n("common_btn_no"),
//							funct	:  pr_ctr_EntHeader.doEmptyList,
//						}
//					}
//				});	
			} else {
				//TODO do something here
				//notify here
			}		
		}

		//---------print obj-----------------------------------------------------------------------------
		this.do_lc_print 	= function(lstId){
			var ref 		= {};		
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_PRINT);	
			ref['reportId']	= 1;
			ref['params']	= JSON.stringify({"matIds" : lstId, "IS_IGNORE_PAGINATION":"0"});
			ref['ext']		= "pdf";
			ref['toPrint']	= false;
			ref['printer ']	= "";

			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_SEL]));				

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

	}

	return MatBcodeEnt;
});