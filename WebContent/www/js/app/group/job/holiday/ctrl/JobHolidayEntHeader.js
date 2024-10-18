define([
        'jquery',
        'text!group/job/holiday/tmpl/JobHoliday_Ent_Header.html'

        ],

        function($, 
        		JobHoliday_Ent_Header) {


	var JobHolidayEntHeader     = function (header,content,footer) {
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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
	
		//-----------------------------------------------------------------------------------
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
			
		}      
		
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_ENT_HEADER	, JobHoliday_Ent_Header);
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_ENT_HEADER, obj));
				do_bind_event(mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobHoliday: EntHeader :" + e.toString());
				do_gl_send_exception(App.path.BASE_URL_API, App.data["HttpSecuHeader"], App.network, "job.holiday", "JobHolidayEntHeader", "do_lc_show", e.toString()) ;
			}
		}
		
		function do_bind_event(mode){
			$("#inp_date").off("change");
			if(mode == pr_ctr_Main.var_lc_MODE_NEW || mode == pr_ctr_Main.var_lc_MODE_MOD){
				$("#inp_date").on("change", function(){
					var newDate = $("#inp_date").val();
					var newVal = convertToDateObj(newDate);
					var code = getCodeFromDate(newVal);
					$("#inp_code").val(code);
				});
			}
			if(mode == pr_ctr_Main.var_lc_MODE_MOD || mode == pr_ctr_Main.var_lc_MODE_NEW) {
				do_gl_enable_edit($(pr_divContent));
				$("#inp_code").prop("disabled", true);
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
		}
		
		function convertToDateObj(stringDate){
			var local = localStorage.language;
			if (!local) local = "en";
			if (local=="en"){
				return new Date(stringDate);
			} else {
				var dateParts = stringDate.split("/");
				var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
				return new Date(dateObject);
			}
		}
		
		function getCodeFromDate(newVal){
			var YYYY 	= newVal.getFullYear();
			var MM_ 	= newVal.getMonth() + 1;
			
			var MM 		= MM_.toString();
			if(MM_ < 10){
				MM = "0" + MM_.toString();
			}
			
			return MM + "/" + YYYY.toString();
		}
	
	};


	return JobHolidayEntHeader;
});