define([
        'jquery',
        'text!group/job/holiday/tmpl/JobHoliday_Ent_Tabs.html'

        ],
        function($, 
        		JobHoliday_Ent_Tabs        		
        		) {


	var JobHolidayEntTabs     = function (header,content,footer) {
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

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		//-------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobHoliday.Main;
			pr_ctr_List 			= App.controller.JobHoliday.List;
			
			pr_ctr_Ent				= App.controller.JobHoliday.Ent;
			pr_ctr_EntHeader 		= App.controller.JobHoliday.EntHeader;
			pr_ctr_EntBtn 			= App.controller.JobHoliday.EntBtn;
			pr_ctr_EntTabs 			= App.controller.JobHoliday.EntTabs;
			
			pr_ctr_Ent01 			= App.controller.JobHoliday.EntTab01;
			
		}     
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_ENT_TABS, JobHoliday_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
				do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
							
				pr_ctr_Ent01.do_lc_show(obj, mode);
				
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_send_exception(App.path.BASE_URL_API, App.data["HttpSecuHeader"], App.network, "job.holiday", "JobHolidayEntTabs", "do_lc_show", e.toString()) ;
			}
		};
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return JobHolidayEntTabs;
});