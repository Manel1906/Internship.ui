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

		var pr_div_Rq_By_User			= "#div_JobOff_List_Request_By_User";
		var pr_div_Rq_By_User_Header	= "#div_JobOff_List_Request_By_User_Header";
		var pr_div_Rq_By_User_Content	= "#div_JobOff_List_Request_By_User_Content";

		var pr_div_Rq					= "#div_JobOff_List_Request";
		var pr_div_Rq_Header			= "#div_JobOff_List_Request_Header";
		var pr_div_Rq_Content			= "#div_JobOff_List_Request_Content";
		
		var pr_div_Lst_User				= "#div_JobOff_List_User";
		var pr_div_Lst_User_Header		= "#div_JobOff_List_User_Header";
		var pr_div_Lst_User_Content		= "#div_JobOff_List_User_Content";

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_Rights 			= null;		

		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;

		var lc_rq_stat_draft		= 0;
		var lc_rq_stat_pending		= 1;
		var lc_rq_stat_validated	= 2;
		var lc_rq_stat_denied		= 3;

//		RIGHT ACTION----------------------------------------
		var RIGHT_U_G		= 1;
		var RIGHT_U_N		= 2;
		var RIGHT_U_M		= 3;
		var RIGHT_U_D		= 4;
		
		//-----------------------------------------------------------------------------------
		var pr_type_adm_all    		= 0;
		var pr_type_adm      		= 1;
		var pr_type_agent      		= 3;

		var typeMulti 				= null;
		//-----------------------------------------------------------------------------------
		//var url_header              = req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobOffMan.Main;
			pr_ctr_Ent				= App.controller.JobOffMan.Ent;
			pr_ctr_Rights			= App.controller.JobOffMan.Rights;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{
				$(pr_divList				).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST			, {}));
				$(pr_div_Lst_User_Header	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_USER_HEADER 	, {}));
				$(pr_div_Lst_User_Content	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_USER_CONTENT	, {}));

				if(App.data.user.typ01 == pr_type_adm_all || App.data.user.typ01 == pr_type_adm){
					typeMulti	= "("   + pr_type_adm 			+ ","
						+ pr_type_agent 		+ ","
						+ pr_type_adm_all 		+ ")";
				}

				do_get_list_user_dyn(pr_div_Lst_User_Content, typeMulti);

				$(pr_div_Rq_Header	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_REQUEST_HEADER 	, {}));
				$(pr_div_Rq_Content	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_REQUEST_CONTENT	, {}));

				var stat = lc_rq_stat_pending;
				do_get_list_request_dyn(pr_div_Rq_Content, 	stat, 	null);
				
				$(pr_div_Rq_By_User).hide();
					
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
			else if (local=="vn")
				format = DateFormat.masks.viShortDate;

			$(nTd).html(DateFormat(sData, format));
		}

		function do_get_list_request_dyn(div, stat, uId03 ){	
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVLstDynMan");
			ref["uId03"]	= uId03;

			ref["stat"]		= stat;

			var lang 		= localStorage.language;
			if (lang == null ) lang = "en";
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			var additionalConfig = {
					"stat": {
						fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
							var status = "Unknown";
							var statusRef = oData.stat;
							switch(statusRef){
							case lc_rq_stat_draft: 		status = $.i18n("job_report_stat_draft");
							break;
							case lc_rq_stat_pending: 	status = $.i18n("job_report_stat_pending");
							break;
							case lc_rq_stat_validated: 	status = $.i18n("job_report_stat_validate");
							break;
							case lc_rq_stat_denied: 	status = $.i18n("job_report_stat_denied");
							break;
							}
							$(nTd).html(status);
						}
					},
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
		
		//---------------------------------------------------------------------------------------------
		//GET LIST INFO USER-----GET LIST INFO USER-----GET LIST INFO USER-----GET LIST INFO USER-----G
		//---------------------------------------------------------------------------------------------
		function do_get_list_user_dyn(div,typeMulti){
			var ref 			= req_gl_Request_Content_Send("ServiceAutUser", "SVLstDyn");
			
			ref["typ01"]		= typeMulti;
			ref["stats"]		= 1; //STAT_ACTIVE
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "vn";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig	= {};
			
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			//var url_header	= req_gl_Security_HttpHeader 	(App.keys.KEY_STORAGE_CREDENTIAL);
			var oTable  	= req_gl_Datatable_Ajax_Dyn     (div, App.path.BASE_URL_API_PRIV, url_header, filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);

		}
		
		var do_bind_list_event = function(data, div, oTable){
			// do_gl_enhance_within($(div), {table: oTable});
			if(data){
				App.data.lstUserInfo = data;
			}
			
			$(div).find('.table-datatableDyn tbody').off('click', 'tr');
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				// do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				var objUser = oTable.fnGetData(this);
				var uId03 = objUser.id;
				
				let user = App.data.lstUserInfo.filter(user => user.id == uId03);
				
				$(pr_div_Rq_By_User).show();
				$(pr_div_Rq_By_User_Header	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_REQUEST_BY_USER_HEADER 	, user[0]));
				$(pr_div_Rq_By_User_Content	)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_LIST_REQUEST_BY_USER_CONTENT	, {}));
				
				do_get_list_request_dyn(pr_div_Rq_By_User, null, uId03);
				

				$('html, body').animate({
					scrollTop: $("#div_JobOff_List_Request_By_User").offset().top,
				},500,'linear');
			});
		}
	};

	return JobOffList;
	});