define([
        'jquery',
        
        'text!group/job/report_man/tmpl/JobReport_Main.html',
        'text!group/job/report_man/tmpl/JobReport_Config_Working_Day.html',
        
        'text!group/job/report_man/tmpl/JobReport_List.html',
        // 'text!group/job/report_man/tmpl/JobReport_List_Report_By_User_Header.html',  
        'text!group/job/report_man/tmpl/JobReport_List_Report_By_User_Content.html',
        'text!group/job/report_man/tmpl/JobReport_List_Report_Content.html',
        // 'text!group/job/report_man/tmpl/JobReport_List_User_Header.html',  
        'text!group/job/report_man/tmpl/JobReport_List_User_Content.html',
        
        'text!group/job/report_man/tmpl/JobReport_Ent.html',
        'text!group/job/report_man/tmpl/JobReport_Ent_Btn.html',
        'text!group/job/report_man/tmpl/JobReport_Ent_Header.html',
        'text!group/job/report_man/tmpl/JobReport_Ent_Header_User_Summary.html',
        'text!group/job/report_man/tmpl/JobReport_Display_QR_Code.html',
        'text!group/job/report_man/tmpl/JobReport_Ent_Tabs.html',
        'text!group/job/report_man/tmpl/JobReport_Ent_Tab_Doc.html',
        
        'text!group/job/report_man/tmpl/JobReport_Ent_Tab_Report_Detail.html',
    	'text!group/job/report_man/tmpl/JobReport_Detail_Action.html',
    	'text!group/job/report_man/tmpl/JobReport_Ent_Tab_Report_Resume.html',
    	'text!group/job/report_man/tmpl/JobReport_Ent_Tab_Report_Resume_Line.html',
    	
    	'text!group/job/report_man/tmpl/JobReport_Popup_Note.html',
    	'text!group/job/report_man/tmpl/JobReport_Popup_Note_Result.html',
    	'text!group/job/report_man/tmpl/JobReport_Popup_Deny_Content.html',
        
        'group/job/report_man/ctrl/JobReportList',
        'group/job/report_man/ctrl/JobReportEnt',
        'group/job/report_man/ctrl/JobReportEntHeader',
        'group/job/report_man/ctrl/JobReportEntBtn',
        'group/job/report_man/ctrl/JobReportEntTabs',       
        'group/job/report_man/ctrl/JobReportEntTabReportDetail',
        'group/job/report_man/ctrl/JobReportEntTabDoc',
        'group/job/report_man/ctrl/JobReportDateTime',
      
        'group/job/report_man/ctrl/JobReportRights'
        ],
        function($,         		
        		JobReport_Main,
        		JobReport_Config_Working_Day,
        		
        		JobReport_List,
        		// JobReport_List_Report_By_User_Header,
        		JobReport_List_Report_By_User_Content,
        		JobReport_List_Report_Content,
        		// JobReport_List_User_Header,
        		JobReport_List_User_Content,
        		
        		JobReport_Ent,
        		JobReport_Ent_Btn,
        		JobReport_Ent_Header,
        		JobReport_Ent_Header_User_Summary,
        		JobReport_Display_QR_Code,
        		JobReport_Ent_Tabs,
        		JobReport_Ent_Tab_Doc,
        		
        		JobReport_Ent_Tab_Report_Detail,
    			JobReport_Detail_Action,
    			JobReport_Ent_Tab_Report_Resume,
    			JobReport_Ent_Tab_Report_Resume_Line,
    			
    			JobReport_Popup_Note,
    			JobReport_Popup_Note_Result,
    			JobReport_Popup_Deny_Content,
        		
        		JobReportList, 
        		JobReportEnt, 
        		JobReportEntHeader, 
        		JobReportEntBtn, 
        		JobReportEntTabs, 
        		JobReportEntTabReportDetail,
        		JobReportEntTabDoc,
        		JobReportDateTime,

				JobReportRights
        ) {

	var JobReportMain 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;		
		//------------------------------------------------------------------------------------
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
		
//		RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;
		
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_List				= null;
		var pr_ctr_DateTime 		= null;
	
		
		var pr_SERVICE_PRJ_CLASS	= "ServicePrjProject"; //to change by your need
		var pr_SERVICE_CLASS		= "ServiceJobReport"; //to change by your need
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){		
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}

			tmplName.JOB_REPORT_MAIN			= pr_grpName + "JobReport_Main";
			tmplName.JOB_REPORT_LIST			= pr_grpName + "JobReport_List";

			tmplName.JOB_REPORT_ENT				= pr_grpName + "JobReport_Ent";
			tmplName.JOB_REPORT_ENT_BTN			= pr_grpName + "JobReport_EntBtn";
			tmplName.JOB_REPORT_ENT_HEADER		= pr_grpName + "JobReport_EntHeader";
			tmplName.JOB_REPORT_ENT_TABS		= pr_grpName + "JobReport_EntTabs";
			
			tmplName.JOB_REPORT_ENT_HEADER_USER_SUMMARY 		= pr_grpName + "JobReport_Ent_Header_User_Summary";

			tmplName.JOB_REPORT_LIST_REPORT_DRAFT_CONTENT		= pr_grpName + "JobReport_List_Draft_Content";
			tmplName.JOB_REPORT_LIST_REPORT_PENDING_HEADER		= pr_grpName + "JobReport_List_Pending_Header";
			tmplName.JOB_REPORT_LIST_REPORT_PENDING_CONTENT		= pr_grpName + "JobReport_List_Pending_Content";
			tmplName.JOB_REPORT_LIST_REPORT_VALIDATED_HEADER	= pr_grpName + "JobReport_List_Validated_Header";
			tmplName.JOB_REPORT_LIST_REPORT_VALIDATED_CONTENT	= pr_grpName + "JobReport_List_Validated_Content";
			// tmplName.JOB_REPORT_LIST_REPORT_BY_USER_HEADER		= pr_grpName + "JobReport_List_By_User_Header";
			tmplName.JOB_REPORT_LIST_REPORT_BY_USER_CONTENT		= pr_grpName + "JobReport_List_Report_By_User_Content";
			// tmplName.JOB_REPORT_LIST_USER_HEADER				= pr_grpName + "JobReport_List_User_Header";
			tmplName.JOB_REPORT_LIST_USER_CONTENT				= pr_grpName + "JobReport_List_User_Content";
			
			tmplName.JOB_REPORT_ENT_TAB_REPORT_DETAIL			= pr_grpName + "JobReport_EntTabReportDetail";
			tmplName.JOB_REPORT_ENT_TAB_DOC						= pr_grpName + "JobReport_EntTabDoc";
			tmplName.JOB_REPORT_DETAIL_ACTION					= pr_grpName + "JobReport_Detail_Action";
			
			tmplName.JOBREPORT_END_TAB_REPORT_RESUME			= pr_grpName +"JobReport_Ent_Tab_Report_Resume";
			tmplName.JOBREPORT_END_TAB_REPORT_RESUME_LINE		= pr_grpName +"JobReport_Ent_Tab_Report_Resume_Line";
			
			tmplName.JOB_REPORT_CONFIG_WORKING_DAY				= pr_grpName + "JobReport_Config_Working_Day";
			tmplName.JOB_REPORT_DISPLAY_QR_CODE					= pr_grpName + "JobReport_Display_QR_Code";
			
			tmplName.JOB_REPORT_POPUP_NOTE						= pr_grpName + "JobReport_Popup_Note";
			tmplName.JOB_REPORT_POPUP_NOTE_RESULT				= pr_grpName + "JobReport_Popup_Note_Result";
			tmplName.JOB_REPORT_POPUP_DENY_CONTENT				= pr_grpName + "JobReport_Popup_Deny_Content";

			
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_MAIN							, JobReport_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_CONFIG_WORKING_DAY				, JobReport_Config_Working_Day);

			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST							, JobReport_List);

			// tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_REPORT_BY_USER_HEADER		, JobReport_List_Report_By_User_Header);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_REPORT_BY_USER_CONTENT		, JobReport_List_Report_By_User_Content);

			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_REPORT_DRAFT_CONTENT		, JobReport_List_Report_Content);		
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_REPORT_PENDING_CONTENT		, JobReport_List_Report_Content);			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_REPORT_VALIDATED_CONTENT	, JobReport_List_Report_Content);

			// tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_USER_HEADER				, JobReport_List_User_Header);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_LIST_USER_CONTENT				, JobReport_List_User_Content);
				
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT_HEADER						, JobReport_Ent_Header);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT_HEADER_USER_SUMMARY			, JobReport_Ent_Header_User_Summary);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_DISPLAY_QR_CODE					, JobReport_Display_QR_Code);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT_TABS						, JobReport_Ent_Tabs); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT_TAB_DOC						, JobReport_Ent_Tab_Doc);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT_TAB_REPORT_DETAIL			, JobReport_Ent_Tab_Report_Detail); 
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_DETAIL_ACTION					, JobReport_Detail_Action);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME			, JobReport_Ent_Tab_Report_Resume);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME_LINE		, JobReport_Ent_Tab_Report_Resume_Line);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT								, JobReport_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_ENT_BTN							, JobReport_Ent_Btn);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_POPUP_NOTE						, JobReport_Popup_Note);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_POPUP_NOTE_RESULT				, JobReport_Popup_Note_Result);
			tmplCtrl.do_lc_put_tmpl(tmplName.JOB_REPORT_POPUP_DENY_CONTENT				, JobReport_Popup_Deny_Content);
			
			if (!App.controller.JobReportMan)				
				 App.controller.JobReportMan				= {};
			
			if (!App.controller.JobReportMan.Main)	
				 App.controller.JobReportMan.Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.JobReportMan.List			)  
				 App.controller.JobReportMan.List			= new JobReportList				(grpName);				
			if (!App.controller.JobReportMan.Ent			)  
				 App.controller.JobReportMan.Ent			= new JobReportEnt				(grpName, null, "#div_JobReport_Ent", null);
			if (!App.controller.JobReportMan.EntBtn		)  
				 App.controller.JobReportMan.EntBtn			= new JobReportEntBtn			(grpName, null, "#div_JobReport_Ent_Btn", null);
			if (!App.controller.JobReportMan.EntHeader	)  
				 App.controller.JobReportMan.EntHeader		= new JobReportEntHeader		(grpName, null, "#div_JobReport_Ent_Header", null);
			if (!App.controller.JobReportMan.EntTabs		)  
				 App.controller.JobReportMan.EntTabs		= new JobReportEntTabs			(grpName, null, "#div_JobReport_Ent_Tabs", null);
			if (!App.controller.JobReportMan.DateTime		)  
				 App.controller.JobReportMan.DateTime		= new JobReportDateTime			(grpName, null, null, null);
			if (!App.controller.JobReportMan.Rights)	
				 App.controller.JobReportMan.Rights 		= new JobReportRights			();
			//----------tab name----------------------------------------------------------------------------------------
			if (!App.controller.JobReportMan.EntTabReportDetail)  
				 App.controller.JobReportMan.EntTabReportDetail= new JobReportEntTabReportDetail(grpName, null, "#div_JobReport_Ent_Tab_Report_Detail", null);
			if (!App.controller.JobReportMan.EntTabDoc)  
				 App.controller.JobReportMan.EntTabDoc			= new JobReportEntTabDoc(grpName, null, "#div_JobReport_Ent_Tab_Doc", null);
			//--------------------------------------------------------------------------------------------------
			
			App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
			
			App.controller.JobReportMan.List					.do_lc_init();
			App.controller.JobReportMan.Ent						.do_lc_init();
			App.controller.JobReportMan.EntBtn					.do_lc_init();
			App.controller.JobReportMan.EntHeader				.do_lc_init();
			App.controller.JobReportMan.EntTabs					.do_lc_init();
			App.controller.JobReportMan.EntTabReportDetail		.do_lc_init();
			App.controller.JobReportMan.EntTabDoc				.do_lc_init();
			
			pr_ctr_Main 	= App.controller.JobReportMan.Main;
			pr_ctr_Ent		= App.controller.JobReportMan.Ent;
			pr_ctr_List		= App.controller.JobReportMan.List;
			pr_ctr_DateTime = App.controller.JobReportMan.DateTime;
			pr_ctr_Rights	= App.controller.JobReportMan.Rights;
			
			do_get_category_data();
			
			pr_ctr_DateTime.req_lc_ReportCode();
			
		}

		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/job/report_man';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		
		this.do_lc_show_callback = function(){
			try { 
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_U_G);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
				doBindings();
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_MAIN, {}));	
				
				do_get_info_user();
				
				App.controller.JobReportMan.List	.do_lc_show();	
				App.controller.JobReportMan.Ent	.do_lc_show(null);	//init: obj is null	
				
//				do_gl_init_Resizable("#div_JobReport_List");
				App.controller.UI.Main.do_bind_event_btn_vertical_list('#div_JobReport_List', '#div_JobReport_Ent');
				App.controller.UI.Main.do_lc_bind_event_resize();
				App.controller.UI.Main.do_lc_bind_event_minimize('#div_JobReport_List', '#div_JobReport_Ent');
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReport: Main :" + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportMain", "do_lc_show", e.toString()) ;
			}

		};
		
		this.do_lc_binding_pages = function(div, option) {
			try {
				if(div.length>0) do_gl_enhance_within(div, option);
			} catch (e) {
				console.log(e);
				do_gl_show_Notify_Msg_Error(null, e);
			}
		};

		//---------------------------------------------------------------------------------------------
		//GET CATEGORY DATA-----GET CATEGORY DATA-----GET CATEGORY DATA-----GET CATEGORY DATA-----GET C
		//---------------------------------------------------------------------------------------------

		var doBindings = function() {
        	do_gl_bindingAppLTE();
        }.bind(this);
		
        var do_get_category_data = function (){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_PRJ_CLASS, "SVPrjListAll");
			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, do_create_source_category, [true] ));
			var fError 		= req_gl_funct(this, do_create_source_category, [false]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_create_source_category = function(sharedJson, ajaxStat){
			if(ajaxStat){
				var code = sharedJson[App['const'].SV_CODE];
				if(code == App['const'].SV_CODE_API_YES) {
					var lstData = sharedJson.res_data;
					var lstCat  = [];
					
					for(var i = 0; i < lstData.length; i++){
						var data = lstData[i];
						data.catId01		= lstData[i].id;
						data.catId01_Select = lstData[i].name;
						lstCat.push(data);
					}
					/*var do1 = {};
					do1.catId01			= -1;
					do1.catId01_Select  = $.i18n("job_report_dayoff_cp");
					lstCat.push(do1);
					var do2 = {};
					do2.catId01			= -2
					do2.catId01_Select 	= $.i18n("job_report_dayoff_aa");
					lstCat.push(do2);*/
					
					App.data.lstCat = lstCat;
				} else {
					do_gl_show_Notify_Msg_Error($.i18n("Error or category has nothing: SV Code:" + code));
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		
		//---------------------------------------------------------------------------------------------
		//GET INFO USER-----GET INFO USER-----GET INFO USER-----GET INFO USER-----GET INFO USER-----GET
		//---------------------------------------------------------------------------------------------
		
		function do_get_info_user(){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, 'SVInfoUser');
			ref["uId03"] 	= App.data.user.id;
			ref["codeRp"]  	= App.data.currentReportCode;
			var fSucces		= [];
			fSucces.push(req_gl_funct(this, do_create_info_user, [true]));
			var fError 		= req_gl_funct(this, do_create_info_user, [false]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_create_info_user = function(sharedJson, ajaxStat){
			App.data.lstUser = [];
			App.data.selectedUser = null;
			if(ajaxStat){
				var code = sharedJson[App['const'].SV_CODE];
				if(code == App['const'].SV_CODE_API_YES) {
					App.data.selectedUser = sharedJson.res_data;
					App.data.lstUser.push(App.data.selectedUser);
					
					pr_ctr_DateTime.req_lc_DayOff(App.data.currentReportCode, App.data.user.id);
					pr_ctr_Ent. do_lc_show_user_summary(App.data.selectedUser);
				} else {
					do_gl_show_Notify_Msg_Error($.i18n("Error do_create_info_user: SV Code:" + code));
				}
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
			}
		}
		
	}

	return JobReportMain;
  });