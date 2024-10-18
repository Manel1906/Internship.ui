define([
	'jquery',
	
	'text!group/mat/alarm/tmpl/MatAlarm_List_Valide_Header.html',  
	'text!group/mat/alarm/tmpl/MatAlarm_List_Valide_Content.html',  
	
	'text!group/mat/alarm/tmpl/MatAlarm_List_Out_Of_Stock_Header.html',  
	'text!group/mat/alarm/tmpl/MatAlarm_List_Out_Of_Stock_Content.html',  

	'text!group/mat/alarm/tmpl/MatAlarm_List_Out_Of_Date_Header.html',  
	'text!group/mat/alarm/tmpl/MatAlarm_List_Out_Of_Date_Content.html', 

	'text!group/mat/alarm/tmpl/MatAlarm_List_Alarm_Price_Waiting_Header.html',  
	'text!group/mat/alarm/tmpl/MatAlarm_List_Alarm_Price_Waiting_Content.html',

	'text!group/mat/alarm/tmpl/MatAlarm_List_Alarm_Price_Header.html',  
	'text!group/mat/alarm/tmpl/MatAlarm_List_Alarm_Price_Content.html',


	],
	function($, 
			MatAlarm_List_Valide_Header,
			MatAlarm_List_Valide_Content,
			MatAlarm_List_Out_Of_Stock_Header,
			MatAlarm_List_Out_Of_Stock_Content,
			MatAlarm_List_Out_Of_Date_Header,
			MatAlarm_List_Out_Of_Date_Content,
			MatAlarm_List_Alarm_Price_Waiting_Header,
			MatAlarm_List_Alarm_Price_Waiting_Content,
			MatAlarm_List_Alarm_Price_Header,
			MatAlarm_List_Alarm_Price_Content
	) 
	{

	var MatAlarmList 	= function (header,content,footer, grpName) {
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
		var pr_SERVICE_CLASS		= "ServiceTpyInformation"; //to change by your need

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

		//-----------------------------------------------------------------------------------
		var varname					= "lstMatAlarm";
		
		
		const var_lc_STAT_VALIDE 	 = 1;
		const var_lc_STAT_OUT_OF_STOCK = 2;
		const var_lc_STAT_OUT_OF_DATE = 3;
		const var_lc_STAT_ALARM_PRICE_WAITING = 4;
		const var_lc_STAT_ALARM_PRICE = 5;

		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.MatAlarm.Main;
			pr_ctr_List 			= App.controller.MatAlarm.List;

			pr_ctr_Ent				= App.controller.MatAlarm.Ent;
			pr_ctr_EntHeader 		= App.controller.MatAlarm.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatAlarm.EntBtn;
//			pr_ctr_EntTabs 			= App.controller.MatAlarm.EntTabs;		
		}

		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(div, stat){               
			try{
				doLoadView(div, stat);	
				do_get_list_ByAjax_Dyn(div, stat);
			}catch(e) {				
				console.log(e);
			}
		};
		
		//--------------------------------------------------------------------------------------------
		
		var doLoadView = function(div, stat){
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_VALIDE_HEADER		, MatAlarm_List_Valide_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_VALIDE_CONTENT		, MatAlarm_List_Valide_Content); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_STOCK_HEADER	, MatAlarm_List_Out_Of_Stock_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_STOCK_CONTENT	, MatAlarm_List_Out_Of_Stock_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_DATE_HEADER	, MatAlarm_List_Out_Of_Date_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_DATE_CONTENT	, MatAlarm_List_Out_Of_Date_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_WAITING_HEADER	, MatAlarm_List_Alarm_Price_Waiting_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_WAITING_CONTENT	, MatAlarm_List_Alarm_Price_Waiting_Content); 
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_HEADER	, MatAlarm_List_Alarm_Price_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_CONTENT	, MatAlarm_List_Alarm_Price_Content); 
		
			if(stat == var_lc_STAT_OUT_OF_STOCK){
				$("#div_MatAlarm_List_Out_Of_Stock_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_STOCK_HEADER		, {}));
				$("#div_MatAlarm_List_Out_Of_Stock_Content")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_STOCK_CONTENT		, {}));
			} else if(stat == var_lc_STAT_VALIDE){
				$("#div_MatAlarm_List_Valide_Header")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_VALIDE_HEADER			, {}));
				$("#div_MatAlarm_List_Valide_Content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_VALIDE_CONTENT			, {}));
			} else if(stat == var_lc_STAT_OUT_OF_DATE){
				$("#div_MatAlarm_List_Out_Of_Date_Header")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_DATE_HEADER			, {}));
				$("#div_MatAlarm_List_Out_Of_Date_Content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_OUT_OF_DATE_CONTENT			, {}));
			} else if(stat == var_lc_STAT_ALARM_PRICE_WAITING){
				$("#div_MatAlarm_List_Alarm_Price_Waiting_Header")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_WAITING_HEADER			, {}));
				$("#div_MatAlarm_List_Alarm_Price_Waiting_Content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_WAITING_CONTENT			, {}));
			} else if(stat == var_lc_STAT_ALARM_PRICE){
				$("#div_MatAlarm_List_Alarm_Price_Header")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_HEADER			, {}));
				$("#div_MatAlarm_List_Alarm_Price_Content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_ALARM_PRICE_CONTENT			, {}));
			}
		}

		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, stat, varname){	
			var ref 		= {};
			var additionalConfig = {}

			if (stat == var_lc_STAT_VALIDE){
			 	ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatAlarmLstDyn");
			} else if (stat == var_lc_STAT_OUT_OF_STOCK) {
				ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatAlarmOutOfStock");
			} else if (stat == var_lc_STAT_OUT_OF_DATE) {
				ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatAlarmOutOfDate");
				additionalConfig = {
					"dt01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.dt01 != null){
			    				$(nTd).html(App.controller.Shp.ShpMain.formatShortDate(oData.dt01));
							} else {
								$(nTd).html("");
							} 
						},
					},
				};
			} else if (stat == var_lc_STAT_ALARM_PRICE || stat == var_lc_STAT_ALARM_PRICE_WAITING) {
				ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatAlarmPrice");
			}
			
			ref["stat"]	= stat;

			var lang = localStorage.language;
			if (lang == null ) lang = "en";	

			var filename = "www/js/lib/datatables/datatable_"+lang+".json";

			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);
		}

		//--------------------------------------------------------------------------------------------
		var do_show_list = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data 		= App.data[varname]; //sharedJson[App['const'].RES_DATA];

				$("#div_MatAlarm_List_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST_CONTENT	, data));	
			} else {
				//do something else
			}
		}

		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(sharedJson, div, oTable) {
			do_gl_enhance_within($(div), {div: div});

			$(div).find('tr').off('click')
			$(div).find('tr').on('click', function(){
				if(App.data.mode == App['const'].MODE_MOD || App.data.mode == App['const'].MODE_NEW){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				pr_ctr_Ent. do_lc_show_ById(oData, App['const'].MODE_SEL);
		
			});	

		};


		//--------------------------------------------------------------------------------------------


	};

	return MatAlarmList;
	});