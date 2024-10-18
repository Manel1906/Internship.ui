define([
        'jquery',
        
        'text!group/mat/alarm/tmpl/MatAlarm_Main.html',
        'text!group/mat/alarm/tmpl/MatAlarm_List.html',
        
        'group/mat/alarm/ctrl/MatAlarmList',
        'group/mat/alarm/ctrl/MatAlarmEnt',
        'group/mat/alarm/ctrl/MatAlarmEntHeader',
		'group/mat/alarm/ctrl/MatAlarmEntBtn',
		'group/mat/alarm/ctrl/MatAlarmEntTabs'
       
      
        ],
        function($,         		
        		MatAlarm_Main,
        		MatAlarm_List,
        		
        		MatAlarmList,
        		MatAlarmEnt, 
        		MatAlarmEntHeader, 
				MatAlarmEntBtn,
				MatAlarmEntTabs
        ) {

	var MatAlarmMain 	= function (header,content,footer, grpName) {
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
	
		const var_lc_TYPE_01_COMMUN  = 1;
		const var_lc_TYPE_01_PARTNER = 2;
		
		
		const var_lc_STAT_VALIDE 	 = 1;
		const var_lc_STAT_OUT_OF_STOCK = 2;
		const var_lc_STAT_OUT_OF_DATE = 3;
		const var_lc_STAT_ALARM_PRICE_WAITING = 4;
		const var_lc_STAT_ALARM_PRICE = 5;

		//---------------------------------------------------------------
		
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			
			tmplName.MAT_ALARM_MAIN					= "MatAlarm_Main";
			tmplName.MAT_ALARM_LIST					= "MatAlarm_List";
			
			tmplName.MAT_ALARM_LIST_All_HEADER		= "MatAlarm_List_All_Header";
			tmplName.MAT_ALARM_LIST_All_CONTENT		= "MatAlarm_List_All_Content";
			
			tmplName.MAT_ALARM_LIST_VALIDE_HEADER			= "MatAlarm_List_Valide_Header"; 		
			tmplName.MAT_ALARM_LIST_VALIDE_CONTENT			= "MatAlarm_List_Valide_Content"; 	
			tmplName.MAT_ALARM_LIST_OUT_OF_STOCK_HEADER 	= "MatAlarm_List_Out_Of_Stock_Header"; 		
			tmplName.MAT_ALARM_LIST_OUT_OF_STOCK_CONTENT 	= "MatAlarm_List_Out_Of_Stock_Content";
			tmplName.MAT_ALARM_LIST_OUT_OF_DATE_HEADER		= "MatAlarm_List_Out_Of_Date_Header"; 		
			tmplName.MAT_ALARM_LIST_OUT_OF_DATE_CONTENT		= "MatAlarm_List_Out_Of_Date_Content"; 
			tmplName.MAT_ALARM_LIST_ALARM_PRICE_WAITING_HEADER 		= "MatAlarm_List_Alarm_Price_Waiting_Header"; 		
			tmplName.MAT_ALARM_LIST_ALARM_PRICE_WAITING_CONTENT 	= "MatAlarm_List_Alarm_Price_Waiting_Content";
			tmplName.MAT_ALARM_LIST_ALARM_PRICE_HEADER 				= "MatAlarm_List_Alarm_Price_Header"; 		
			tmplName.MAT_ALARM_LIST_ALARM_PRICE_CONTENT 			= "MatAlarm_List_Alarm_Price_Content";
			
			tmplName.MAT_ALARM_ENT					= "MatAlarm_Ent";
			tmplName.MAT_ALARM_ENT_BTN				= "MatAlarm_Ent_Btn";
			tmplName.MAT_ALARM_ENT_HEADER			= "MatAlarm_Ent_Header";
			tmplName.MAT_ALARM_ENT_TABS				= "MatAlarm_Ent_Tabs";
			tmplName.MAT_ALARM_ENT_TAB_01			= "MatAlarm_Ent_Tab01";
			tmplName.MAT_ALARM_LST_ALARMBASE			= "MatAlarm_Lst_AlarmBase";
				
			if (!App.controller.MatAlarm)				
				 App.controller.MatAlarm				= {};
			
			if (!App.controller.MatAlarm.Main)	
				App.controller.MatAlarm.Main 		= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.MatAlarm.List)  
				 App.controller.MatAlarm.List		= new MatAlarmList		(null, "#div_MatAlarm_List" , null);				
			if (!App.controller.MatAlarm.Ent)  
				 App.controller.MatAlarm.Ent			= new MatAlarmEnt		(null, "#div_MatAlarm_Ent" , null);
			if (!App.controller.MatAlarm.EntBtn)  
				 App.controller.MatAlarm.EntBtn		= new MatAlarmEntBtn		(null, "#div_MatAlarm_Ent_Btn" , null);
			if (!App.controller.MatAlarm.EntHeader)  
				 App.controller.MatAlarm.EntHeader	= new MatAlarmEntHeader	(null, "#div_MatAlarm_Ent_Header" , null);
			if (!App.controller.MatAlarm.EntTabs	)  
				 App.controller.MatAlarm.EntTabs		= new MatAlarmEntTabs	(null, "#div_MatAlarm_Ent_Tabs" , null);
			
			//--------------------------------------------------------------------------------------------------
			
			App.controller.MatAlarm.List			.do_lc_init();
			App.controller.MatAlarm.Ent			.do_lc_init();
			App.controller.MatAlarm.EntBtn		.do_lc_init();
			App.controller.MatAlarm.EntHeader	.do_lc_init();
			App.controller.MatAlarm.EntTabs		.do_lc_init();
//			App.controller.MatAlarm.EntTab01		.do_lc_init();
			
			do_Get_Lst_Base_Unit();
			
			do_gl_refresh_SecuHeader (self);
		}
		
		
		this.do_lc_show = function(){
			try { 
						
				tmplCtrl							.do_lc_put_tmpl(tmplName.MAT_ALARM_MAIN	, MatAlarm_Main); 
				tmplCtrl							.do_lc_put_tmpl(tmplName.MAT_ALARM_LIST	, MatAlarm_List); 
				
				$(pr_divContent)        .html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_MAIN, {}));	
				
				$("#div_MatAlarm_List")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_LIST, {}));
				self.do_lc_show_lst_alarm();
//				App.controller.MatAlarm.List	.do_lc_show();
				
				var params = req_gl_Url_Params(App.data.url);
				if (params.id){
					var mode = params.mode;
					var lang = params.lang
					if (!mode) mode = App['const'].MODE_SEL;
					if (!lang) lang = App.language;
					App.controller[pr_grpName].Ent.do_lc_show_ById({id: params.id}, mode, lang);
				} else {
					App.controller[pr_grpName].Ent.do_lc_show({}, this.var_lc_MODE_INIT);	//init: obj is null
				}
				
				App.controller.Shp.ShpMain.do_lc_bind_event_div_MaxResize('#div_MatAlarm_List', '#div_MatAlarm_Ent_Resize');
				App.controller.Shp.ShpMain.do_lc_bind_event_div_Minimize();
				App.controller.Shp.ShpMain.do_lc_bind_event_div_MinResize('#div_MatAlarm_List', '#div_MatAlarm_Ent_Resize');
							
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "mat.alarm", "MatAlarmMain", "do_lc_show", e.toString()) ;
			}
		};

		this.do_lc_show_lst_alarm = function(){
//				App.controller	.MatAlarm.List	.do_lc_show("#div_MatAlarm_List_All"	    , null);
				
				App.controller	.MatAlarm.List	.do_lc_show("#div_MatAlarm_List_Valide"      			, var_lc_STAT_VALIDE);
				App.controller	.MatAlarm.List	.do_lc_show("#div_MatAlarm_List_Out_Of_Stock"			, var_lc_STAT_OUT_OF_STOCK);
				App.controller	.MatAlarm.List	.do_lc_show("#div_MatAlarm_List_Out_Of_Date"			, var_lc_STAT_OUT_OF_DATE);
//				App.controller	.MatAlarm.List	.do_lc_show("#div_MatAlarm_List_Alarm_Price_Waiting"	, var_lc_STAT_ALARM_PRICE_WAITING);
				App.controller	.MatAlarm.List	.do_lc_show("#div_MatAlarm_List_Alarm_Price"			, var_lc_STAT_ALARM_PRICE);
				
		}
		
		this.do_lc_binding_pages = function(div) {
			try {
				if(div.length>0) do_gl_enhance_within(div);
			} catch (e) {
				do_gl_show_Notify_Msg_Error(null, e);
			}
		}
		
		//---------private-----------------------------------------------------------------------------
		var do_Get_Lst_Base_Unit = function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('ServiceMatUnit', 'SVMatUnitLst');			
			ref['ratio'	]	= 1;
			ref['status']	= 1;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ['lst_baseUnit']));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			console.log("do_show_Msg::" + msg);
		}		
			
	};

	return MatAlarmMain;
  });