define([
        'jquery',
        
        'text!group/job/holiday/tmpl/JobHoliday_Main.html',
        
        'group/job/holiday/ctrl/JobHolidayList',
        'group/job/holiday/ctrl/JobHolidayEnt',
        'group/job/holiday/ctrl/JobHolidayEntHeader',
        'group/job/holiday/ctrl/JobHolidayEntBtn',
        'group/job/holiday/ctrl/JobHolidayEntTabs',       
        'group/job/holiday/ctrl/JobHolidayEntTab01',
        'group/job/holiday/ctrl/JobHolidayRights'  
       
      
        ],
        function($,         		
        		JobHoliday_Main, 
        		
        		JobHolidayList, 
        		JobHolidayEnt, 
        		JobHolidayEntHeader, 
        		JobHolidayEntBtn, 
        		JobHolidayEntTabs, 
        		JobHolidayEntTab01,
        		JobHolidayRights
        ) {

	var JobHolidayMain 	= function (grp,header,content,footer) {
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

		var self 					= this;	
		//------------------------------------------------------------------------------------
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		this.var_lc_URL_Aut_Header	= null;
		//---------------------------------------------------------------
		const RIGHT_G				= 1;
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			
			tmplName.JOB_HOLIDAY_MAIN			= "JobHoliday_Main";
			tmplName.JOB_HOLIDAY_LIST			= "JobHoliday_List";
			tmplName.JOB_HOLIDAY_LIST_HEADER	= "JobHoliday_ListHeader";
			tmplName.JOB_HOLIDAY_LIST_CONTENT	= "JobHoliday_ListContent";
			tmplName.JOB_HOLIDAY_ENT			= "JobHoliday_Ent";
			tmplName.JOB_HOLIDAY_ENT_BTN		= "JobHoliday_EntBtn";
			tmplName.JOB_HOLIDAY_ENT_HEADER		= "JobHoliday_EntHeader";
			tmplName.JOB_HOLIDAY_ENT_TABS		= "JobHoliday_EntTabs";
			tmplName.JOB_HOLIDAY_ENT_TAB_01		= "JobHoliday_EntTab01";
			
			if (!App.controller.JobHoliday)				
				 App.controller.JobHoliday				= {};
			
			if (!App.controller.JobHoliday.Main)	
				App.controller.JobHoliday.Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.JobHoliday.List			)  
				 App.controller.JobHoliday.List			= new JobHolidayList			("#div_JobHoliday_List", "#div_JobHoliday_List_Header", "#div_JobHoliday_List_Content");				
			if (!App.controller.JobHoliday.Ent			)  
				 App.controller.JobHoliday.Ent			= new JobHolidayEnt				(null, "#div_JobHoliday_Ent", null);
			if (!App.controller.JobHoliday.EntBtn		)  
				 App.controller.JobHoliday.EntBtn		= new JobHolidayEntBtn			(null, "#div_JobHoliday_Ent_Btn", null);
			if (!App.controller.JobHoliday.EntHeader	)  
				 App.controller.JobHoliday.EntHeader	= new JobHolidayEntHeader		(null, "#div_JobHoliday_Ent_Header", null);
			if (!App.controller.JobHoliday.EntTabs		)  
				 App.controller.JobHoliday.EntTabs		= new JobHolidayEntTabs			(null, "#div_JobHoliday_Ent_Tabs", null);
			if (!App.controller.JobHoliday.Rights)	
				 App.controller.JobHoliday.Rights 		= new JobHolidayRights			();
			
			//----------tab name----------------------------------------------------------------------------------------
			if (!App.controller.JobHoliday.EntTab01)  
				 App.controller.JobHoliday.EntTab01= new JobHolidayEntTab01	(null, "#div_JobHoliday_Ent_Tab_01", null);
			//--------------------------------------------------------------------------------------------------
			
			App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			
			App.controller.JobHoliday.List			.do_lc_init();
			App.controller.JobHoliday.Ent			.do_lc_init();
			App.controller.JobHoliday.EntBtn		.do_lc_init();
			App.controller.JobHoliday.EntHeader		.do_lc_init();
			App.controller.JobHoliday.EntTabs		.do_lc_init();
			App.controller.JobHoliday.EntTab01		.do_lc_init();
			
//			do_Get_Cfg_Values(); //begin by fetching all mandatory values
			pr_ctr_Main 			= App.controller.JobHoliday.Main;
			pr_ctr_Rights 			= App.controller.JobHoliday.Rights;
		}

		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/job/holiday';
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
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_G);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_hld_msg_user_right_error_N"));
					return;
				}

				App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
						
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_MAIN	, JobHoliday_Main); 
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_MAIN, {}));	
				
				App.controller.JobHoliday.List	.do_lc_show();
				App.controller.JobHoliday.Ent	.do_lc_show(null);	//init: obj is null	
				
//				do_gl_init_Resizable("#div_JobHoliday_List");			
			}catch(e) {				
				console.log(e);
				//do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.holiday", "JobHolidayMain", "do_lc_show", e.toString()) ;
			}

		};
		
		this.do_lc_binding_pages = function(div) {
			try {
				if(div.length>0) do_gl_enhance_within(div);
			} catch (e) {
				self.do_show_Msg(null, e);
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_Get_Cfg_Values= function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('SVCfgClass', 'SVCfgService');			
		
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ['cfg_value_01']));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	

		//--------------------------------------------------------------------------------------------
	};

	return JobHolidayMain;
  });