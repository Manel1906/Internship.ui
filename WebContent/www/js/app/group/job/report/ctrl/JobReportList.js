define(['jquery' ], function($) {

	var JobReportList 	= function (grpName) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
		var pr_divList 						= "#div_JobReport_List";
		
		var pr_div_Rp_Draft					= "#div_JobReport_List_Report_Draft";
		var pr_div_Rp_Draft_Content			= "#div_JobReport_List_Report_Draft_Content";

		var pr_div_Rp_Pending				= "#div_JobReport_List_Report_Pending";
		var pr_div_Rp_Pending_Content		= "#div_JobReport_List_Report_Pending_Content";
		
		var pr_div_Rp_Validated				= "#div_JobReport_List_Report_Validated";
		var pr_div_Rp_Validated_Content		= "#div_JobReport_List_Report_Validated_Content";
		
		var pr_div_Rp_Denied				= "#div_JobReport_List_Report_Denied";
		var pr_div_Rp_Denied_Content		= "#div_JobReport_List_Report_Denied_Content";
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//------------------------------------------------------------------------------------
		var pr_SERVICE_CLASS		= "ServiceJobReport"; //to change by your need
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;

		var lc_rp_stat_draft			= 0;
		var lc_rp_stat_pending			= 1;
		var lc_rp_stat_validate			= 2;
		var lc_rp_stat_denied			= 3;
		var lc_rp_stat_resume_updated	= 4;
			
		//	RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 0;
		var RIGHT_U_N		= 1;
		var RIGHT_U_M		= 2;
		var RIGHT_U_D		= 3;
		
		var RIGHT_A_G		= 4;
		var RIGHT_A_N		= 5;
		var RIGHT_A_M		= 6;
		var RIGHT_A_D		= 7;
		
		var RIGHT_A_WD		= 8;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobReport.Main;
			pr_ctr_Ent				= App.controller.JobReport.Ent;
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{
				$(pr_divList	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_LIST, {}));
				
				do_get_list_rp (pr_div_Rp_Draft		, pr_div_Rp_Draft_Content		, App.data.user.id, lc_rp_stat_draft);
				do_get_list_rp (pr_div_Rp_Pending	, pr_div_Rp_Pending_Content		, App.data.user.id, lc_rp_stat_pending);
				do_get_list_rp (pr_div_Rp_Validated	, pr_div_Rp_Validated_Content	, App.data.user.id, lc_rp_stat_validate);
				do_get_list_rp (pr_div_Rp_Denied	, pr_div_Rp_Denied_Content		, App.data.user.id, lc_rp_stat_denied);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReport: EntList :" + e.toString());
			}
		};
		
		//---------------------------------------------------------------------------------------------
		//GET LIST REPORT DRAFT-----GET LIST REPORT DRAFT-----GET LIST REPORT PENDING-----GET LIST 
		//---------------------------------------------------------------------------------------------

		function do_get_list_rp (div_Rp, div_Rp_Content, uId, stat){	
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVLstDyn");
			ref["stat"] 	= stat;
			ref["uId03"]	= uId;
			
			$(div_Rp_Content).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_LIST_REPORT_DRAFT_CONTENT	, {user_visible: false}));
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			var additionalConfig = {};
			
			var colConfig   = req_gl_table_col_config($(div_Rp).find("table"), null, additionalConfig);
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			var oTable  	= req_gl_Datatable_Ajax_Dyn(div_Rp_Content, App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_rp);
		}
		
		var do_bind_list_rp = function(data, div, oTable){
			// do_gl_enhance_within($(div), {table: oTable});
			$(div).find('.table-datatableDyn tbody').off('click', 'tr');
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				var oData = oTable.fnGetData(this);
				pr_ctr_Ent. do_lc_show_ById(oData, pr_ctr_Main.var_lc_MODE_SEL);
			});
		}
	};

	return JobReportList;
  });