define([
        'jquery',
		
	
        ],
        function($
        		) {


	var MatAlarmEntTabs     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header  ? $(header) : null;
		var pr_divContent 			= content ? $(content): null;
		var pr_divFooter 			= footer  ? $(footer) : null;

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

		var pr_SERVICE_CLASS		= "ServiceTpyInformation"; //to change by your need

		//------------------------------------------------------------------------------------
		const var_lc_STAT_VALIDE 	 = 1;
		const var_lc_STAT_OUT_OF_STOCK = 2;
		const var_lc_STAT_OUT_OF_DATE = 3;
		const var_lc_STAT_ALARM_PRICE = 4;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatAlarm.Main;
			pr_ctr_List 			= App.controller.MatAlarm.List;
			
			pr_ctr_Ent				= App.controller.MatAlarm.Ent;
			pr_ctr_EntHeader 		= App.controller.MatAlarm.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatAlarm.EntBtn;
			pr_ctr_EntTabs 			= App.controller.MatAlarm.EntTabs;		
			
		}     
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				do_bind_event(obj, mode);
				App.controller.Shp.ShpMain.do_lc_bind_event_div_Minimize();

			}catch(e) {				
				console.log(e);
			}
		};
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return MatAlarmEntTabs;
});