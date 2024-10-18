define(['jquery'], function($) {

var JobReportEntTabs     		= function (grpName, header, content, footer) {
	var pr_divHeader 			= header;
	var pr_divContent 			= content;
	var pr_divFooter 			= footer;

	//------------------------------------------------------------------------------------
	var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
	var tmplName				= App.template.names[pr_grpName];
	var tmplCtrl				= App.template.controller;

	//------------------controllers------------------------------------------------------
	var pr_ctr_Main 				= null;
	var pr_ctr_EntTabReportDetail	= null;
	var pr_ctr_EntTabDoc			= null;
	
	//-------------------------------------------------
	var pr_object				= null;
	var pr_mode					= null;
	//--------------------APIs--------------------------------------//
	this.do_lc_init		= function(){
		pr_ctr_Main 				= App.controller.JobReport.Main;
		pr_ctr_EntTabReportDetail 	= App.controller.JobReport.EntTabReportDetail;
		pr_ctr_EntTabDoc 			= App.controller.JobReport.EntTabDoc;
	}     
	this.do_lc_show		= function(obj, mode){
		pr_object 	= obj;
		pr_mode		= mode;
		
		try{
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_TABS, obj));
			pr_ctr_EntTabReportDetail.do_lc_show(obj, mode);
			pr_ctr_EntTabDoc 		 .do_lc_show(obj, mode);

		}catch(e) {
			do_gl_show_Notify_Msg_Error("JobReport: EntTabs :" + e.toString());
			console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntTabs", "do_lc_show", e.toString()) ;
		}
	};
};

return JobReportEntTabs;
});