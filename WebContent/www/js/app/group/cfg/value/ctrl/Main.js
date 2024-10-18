define([
        'jquery',
        
        'text!group/cfg/value/tmpl/Main.html',
        
        'group/cfg/value/ctrl/List',
        'group/cfg/value/ctrl/Ent'      
      
        ],
        function($,         		
        		Tmpl_Main, 
        		
        		CtrlList, 
        		CtrlEnt
        ) {

	var CtrlMain 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var pr_grpPath				= 'group/cfg/value';
		App.template.names[pr_grpName] = {}; //---init only one time in Main ctrl
		
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
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//---------------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			do_gl_refresh_SecuHeader();
			//---------------------------------------------------------------
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			pr_ctr_Main 							= App.controller.CfgGroup.Main;
			pr_ctr_List 							= App.controller.CfgGroup.List;
			pr_ctr_Ent								= App.controller.CfgGroup.Ent;


			
			//---------------------------------------------------------------
			
			if (!App.controller.CfgGroup)				
				 App.controller.CfgGroup					= {};
			
			if (!App.controller.CfgGroup.Main		)	
				App.controller.CfgGroup.Main 				= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.CfgGroup.List		)  
				 App.controller.CfgGroup.List				= new CtrlList				(null, null, null, null);				
			if (!App.controller.CfgGroup.Ent			)  
				 App.controller.CfgGroup.Ent				= new CtrlEnt				(null, null, null, null);

			pr_ctr_Main 									= App.controller.CfgGroup.Main;
			pr_ctr_List 									= App.controller.CfgGroup.List;
			pr_ctr_Ent										= App.controller.CfgGroup.Ent;
			
			pr_ctr_List								.do_lc_init();
			pr_ctr_Ent								.do_lc_init();
			
			tmplName.MAIN									= "Main";
			tmplCtrl								.do_lc_put_tmpl(tmplName.MAIN	, Tmpl_Main); 
			//--------------------------------------------------------------------------------------------------
		}
		
		this.do_lc_show = function(){
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				
				$("#div_main_content")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAIN, {}));	
//				do_gl_apply_right($(pr_divContent));
				
				App.controller[pr_grpName].List	.do_lc_show();
				
				var params = req_gl_Url_Params(App.data.url);
				if (params.id){
					var mode = params.mode;
					var lang = params.lang
					if (!mode) mode = App['const'].MODE_SEL;
					if (!lang) lang = App.language;
					App.controller[pr_grpName].Ent.do_lc_show_ById({id: params.id}, mode, lang);
				} else {
					App.controller[pr_grpName].Ent.do_lc_show(null);//init: obj is null	
				}
						
				//-----------------------------------------------------------------------------------------
/*				App.controller.DBoard.DBoardMain.do_lc_bind_event_resize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_resize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize	();*/
				
				App.controller.DBoard.DBoardMain.do_bind_event_btn_vertical_list('#div_List', "#div_Ent");
				App.controller.DBoard.DBoardMain.do_lc_bind_event_minimize		('#div_List', "#div_Ent");

				App.controller.DBoard.DBoardMain.do_lc_bind_event_resize();
			}catch(e) {		
				console.log(e);
//				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "cfg.", "Main", "do_lc_show", e.toString()) ;
			}
		};
	};

	return CtrlMain;
  });