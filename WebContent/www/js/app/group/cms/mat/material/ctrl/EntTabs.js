define([
	'jquery',
	'text!group/mat/material/tmpl/Ent_Tabs.html',
	
	 'group/mat/material/ctrl/EntTabDetail',
     'group/mat/material/ctrl/EntTabDoc',
     'group/mat/material/ctrl/EntTabCat',
     

	],
	function($, 
			Tmpl_Ent_Tabs     ,
			
			CtrlEntTabDetail,
			CtrlEntTabDoc,
			CtrlEntTabCat
			
	) {

	var CtrlEntTabs     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
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

		var pr_ctr_TabGroup 		= null;
		var pr_ctr_TabUnit 			= null;
		var pr_ctr_TabDoc 			= null;
		var pr_ctr_TabPriceSell 	= null;
		var pr_ctr_TabPriceBuy 		= null;
		var pr_ctr_TabDetail 		= null;
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			tmplName.ENT_TABS						= "EntTabs";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TABS, Tmpl_Ent_Tabs); 	
			//----------tab name----------------------------------------------------------------------------------------

			if (!App.controller[pr_grpName].EntTabDetail)  
				App.controller[pr_grpName].EntTabDetail		= new CtrlEntTabDetail			(null, "#div_Ent_Tab_Detail", null, pr_grpName);

			if (!App.controller[pr_grpName].EntTabDoc)  
				App.controller[pr_grpName].EntTabDoc		= new CtrlEntTabDoc				(null, null, null, pr_grpName);
			if (!App.controller[pr_grpName].EntTabCat)  
				App.controller[pr_grpName].EntTabCat		= new CtrlEntTabCat   			(null, "#div_Ent_Tab_Cat", null, pr_grpName);

			
			App.controller[pr_grpName].EntTabDetail			.do_lc_init();
			App.controller[pr_grpName].EntTabDoc			.do_lc_init();
			App.controller[pr_grpName].EntTabCat			.do_lc_init();
			
			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
			pr_ctr_TabDoc 			= App.controller[pr_grpName].EntTabDoc;
			pr_ctr_TabDetail		= App.controller[pr_grpName].EntTabDetail;
			pr_ctr_TabCat   		= App.controller[pr_grpName].EntTabCat;
			
		}     
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TABS, obj));
				//fixed max-height scroll of % height div_ContentView
				do_gl_calculateScrollBody("#div_Ent_Tabs" + " .custom-scroll-tab", 43.6);

				
				pr_ctr_TabDetail	 	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabDoc  			.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabCat    	 	.do_lc_show(pr_obj, pr_mode);
				
				this.do_lc_show_tabs_byType(obj.typ01, obj.typ02);
				
//				if(obj.typ01 == 2 && (mode == App['const'].MODE_SEL || mode == App['const'].MODE_MOD))
//					pr_ctr_TabCalendar		.do_lc_show(pr_obj, pr_mode);
//				else
//					$("#li_Calendar a, #li_Calendar").hide();
				
				do_bind_event(obj, mode);
			
			}catch(e) {		
				console.log (e);
//				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.material", "CtrlEntTabs", "do_lc_show", e.toString()) ;
			}
		};

		this.do_lc_show_tabs_byType		= function(type01, type02){			
//			pr_ctr_TabDetail	.do_lc_init_tab_byType(type01, type02);
		}
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
//			if(pr_mode == App['const'].MODE_NEW || obj.lstUnit == null || obj.lstUnit.length == 0){
//				$("#table_mat_price_sell, #table_mat_price_buy").find("tfoot tr td span").text($.i18n("mat_common_msg_mode_new"));
//			} else {
//				$("#table_mat_price_sell, #table_mat_price_buy").find("tfoot").hide();
//			}
			
			$("#table_mat_price_sell, #table_mat_price_buy").find("tfoot").hide();
		}
	};


	return CtrlEntTabs;
});