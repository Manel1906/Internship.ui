define([
        'jquery',
        'text!group/job/holiday/tmpl/JobHoliday_List.html',     
        'text!group/job/holiday/tmpl/JobHoliday_List_Header.html',  
        'text!group/job/holiday/tmpl/JobHoliday_List_Content.html'

        ],
        function($, 
        		JobHoliday_List,
        		JobHoliday_List_Header,
        		JobHoliday_List_Content
        ) 
        {

	var JobHolidayList 	= function (header,content,footer) {
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
		var url_header				= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);

		//------------------------------------------------------------------------------------
		var pr_SERVICE_CLASS		= "ServiceJobHoliday";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_Rights			= null;
		
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		//	RIGHT ACTION----------------------------------------
		var RIGHT_G		= 1;
		var RIGHT_N		= 2;
		var RIGHT_M		= 3;
		var RIGHT_D		= 4;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.JobHoliday.Main;
			pr_ctr_List 			= App.controller.JobHoliday.List;
			
			pr_ctr_Ent				= App.controller.JobHoliday.Ent;
			pr_ctr_EntHeader 		= App.controller.JobHoliday.EntHeader;
			pr_ctr_EntBtn 			= App.controller.JobHoliday.EntBtn;
			pr_ctr_EntTabs 			= App.controller.JobHoliday.EntTabs;
			pr_ctr_Rights			= App.controller.JobHoliday.Rights;
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{			
				App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_LIST			, JobHoliday_List); 
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_LIST_HEADER	, JobHoliday_List_Header); 		
				tmplCtrl.do_lc_put_tmpl(tmplName.JOB_HOLIDAY_LIST_CONTENT	, JobHoliday_List_Content); 		
				
				$(pr_divHeader	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_LIST			, {}));
				$(pr_divContent	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_LIST_HEADER	, {}));
				$(pr_divFooter	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_LIST_CONTENT	, {}));
				
				var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_G);
				if(rightCode == -1){
					do_gl_show_Notify_Msg_Error($.i18n("job_hld_msg_user_right_error_G"));
					return;
				} else {
					do_get_list_ByAjax_Dyn	($(pr_divFooter));
				}
			}catch(e) {				
				do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.holiday", "JobHolidayList", "do_lc_show", e.toString()) ;
			}
		};
							

		//---------private-----------------------------------------------------------------------------		
		function do_get_list_ByAjax(div, type, varname){	
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVJobHolidayLst");

			var fSucces			= [];	
			fSucces.push(req_gl_funct(App	, App.funct.put		, [varname]));
			fSucces.push(req_gl_funct(null	, do_show_list		, []));
			fSucces.push(req_gl_funct(null	, do_bind_list_event, []));

			var fError 		= req_gl_funct(App, pr_ctr_Main.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;		
		}
		
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div){	
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVLstDyn");
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json"
			
			var additionalConfig = {
					"dt": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var local = localStorage.language;
		    				if (!local) local = "en";
		    				var format = DateFormat.masks.enShortDate;
		    				if (local=="fr")
		    					format = DateFormat.masks.frShortDate;
		    				else if (local=="vn")
		    					format = DateFormat.masks.viShortDate;
		    				
		    				$(nTd).html(DateFormat(oData.dt, format));
						}}
			};

			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);

			var fError 		= req_gl_funct(App, pr_ctr_Main.do_show_Msg, [$.i18n("common_err_ajax")]);	

			var oTable 		= req_gl_Datatable_Ajax_Dyn	(div, App.path.BASE_URL_API_PRIV,url_header, filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);
		}
		
		//--------------------------------------------------------------------------------------------
		var do_show_list = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data 		= App.data[varname]; //sharedJson[App['const'].RES_DATA];

				$(pr_divFooter).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_HOLIDAY_LIST_CONTENT	, data));	
			} else {
				//do something else
			}
		}

		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(data, div, oTable) {
			do_gl_enhance_within($(div));
			
			//load datatable effects after AJAX resultat
			//pr_ctr_Main.do_lc_binding_pages($(pr_divHeader));
			$(div).find('.table-datatableDyn tbody').off('click', 'tr');
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				//console.log(oData);
				
				//Check the lock of object
				//if(pr_ctr_Ent.can_lc_have_Lock()) return;  --Question: Check lock--
								
				//ajax to fetch data from server
				pr_ctr_Ent. do_lc_show_ById(oData.id, pr_ctr_Main.var_lc_MODE_SEL);	
		
			});
		};

		
		//--------------------------------------------------------------------------------------------
		
	
	};

	return JobHolidayList;
  });