define(['jquery' ], function($) {
        		
	var JobOffList 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;		
		//------------------------------------------------------------------------------------
		var pr_SERVICE_CLASS		= "ServiceJobDayoffRequest"; //to change by your need
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;
		
		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		
		var url_header				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
		var self 					= this;		
		
		var pr_divList 					= "#div_JobOff_List";
		
		var pr_div_Rq_Draft		= "#div_JobOff_List_Draft_Content";
		var pr_div_Rq_Pending	= "#div_JobOff_List_Pending_Content";
		var pr_div_Rq_Denied	= "#div_JobOff_List_Denied_Content";
		var pr_div_Rq_Validated	= "#div_JobOff_List_Validated_Content";
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		var lc_rq_stat_draft		= 0;
		var lc_rq_stat_pending		= 1;
		var lc_rq_stat_validated	= 2;
		var lc_rq_stat_denied		= 3;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobOff.Main;
			pr_ctr_Ent				= App.controller.JobOff.Ent;
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{
				$(pr_divList				)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST			, {}));
				
				do_get_list_request_dyn(pr_div_Rq_Draft      	, lc_rq_stat_draft       , App.data.user.id);
				do_get_list_request_dyn(pr_div_Rq_Pending 	   	, lc_rq_stat_pending 	 , App.data.user.id);
				do_get_list_request_dyn(pr_div_Rq_Denied 	   	, lc_rq_stat_denied 	 , App.data.user.id);
				do_get_list_request_dyn(pr_div_Rq_Validated    	, lc_rq_stat_validated   , App.data.user.id);

				App.controller.UI.Main.do_lc_bind_event_resize();
			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobOff > List :" + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.off", "JobOffList", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------------------------------------------------------------------------------------------
		//LIST REQUEST DYNAMIC-----LIST REQUEST DYNAMIC-----LIST REQUEST DYNAMIC-----LIST REQUEST DYNAM
		//---------------------------------------------------------------------------------------------
		var dateFormat = function(nTd, sData, oData,iRow, iCol){
			var local = localStorage.language;
			if (!local) local = "en";
			var format = DateFormat.masks.enShortDate;
			if (local=="fr")
				format = DateFormat.masks.frShortDate;
			else if (local=="vi")
				format = DateFormat.masks.viShortDate;
				
			$(nTd).html(DateFormat(sData, format));
		}
		
		function do_get_list_request_dyn(div, stat, uId02 ){	
			$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_CONTENT	, {}));
			
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVLstDyn");
			ref["uId02"]	= uId02;
			ref["stat"]		= stat;

			var lang 		= localStorage.language;
			if (lang == null ) lang = "en";
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			var additionalConfig = {
					"dt01": {fnCreatedCell: dateFormat},
					"dt03": {fnCreatedCell: dateFormat},
					"dt04": {fnCreatedCell: dateFormat}
			};
			var colConfig   = req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			var oTable  	= req_gl_Datatable_Ajax_Dyn(div, App.path.BASE_URL_API_PRIV, url_header, filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_request);
		}
		
		var do_bind_list_request = function(data, div, oTable) {
			// do_gl_enhance_within($(div));
			$(div).find('.table-datatableDyn tbody').off('click', 'tr');
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				// do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				var oData = oTable.fnGetData(this);
				pr_ctr_Ent. do_lc_show_ById(oData, pr_ctr_Main.var_lc_MODE_SEL);
			});
		};
	};

	return JobOffList;
  });