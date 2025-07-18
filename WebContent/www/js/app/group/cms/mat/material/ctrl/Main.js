define([
        'jquery',
        
        'text!group/mat/material/tmpl/Main.html',
        
        'group/mat/material/ctrl/List',
        'group/mat/material/ctrl/Ent',

        'group/util/html_editor/ctrl/HtmlEditorController',
        ],
        function($,         		
        		Tmpl_Main,
        		
        		CtrlList, 
        		CtrlEnt, 
        		
        		CtrlHtmlEditor       		
        ) {

	var MatMaterialMain 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var pr_grpPath				= 'group/mat/material';
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
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//------------------------------------------------------------------------------------

		this.do_lc_init		= function(){
			
			do_gl_refresh_SecuHeader();
			//--------------------------------------------------------------------------------------------------
			if (!App.controller.HtmlEditor)  
				 App.controller.HtmlEditor = new CtrlHtmlEditor();
			//--------------------------------------------------------------------------------------------------
			
			
			//-load template-------------------------------------------------------------------------------------
			
			tmplName.MAIN						= "Main";
			tmplCtrl							.do_lc_put_tmpl(tmplName.MAIN	, Tmpl_Main); 
			
			
			
			//-load controller------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName])				
				 App.controller[pr_grpName]				= {};
			
			if (!App.controller[pr_grpName].Main		)	
				App.controller[pr_grpName].Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller[pr_grpName].List		)  
				 App.controller[pr_grpName].List			= new CtrlList				(null, "#div_List", null, pr_grpName);				
			if (!App.controller[pr_grpName].Ent			)  
				 App.controller[pr_grpName].Ent				= new CtrlEnt				(null, "#div_Ent", null, pr_grpName);
		

			pr_ctr_Main 							= App.controller[pr_grpName].Main;
			pr_ctr_List 							= App.controller[pr_grpName].List;
			pr_ctr_Ent								= App.controller[pr_grpName].Ent;
			
			pr_ctr_List								.do_lc_init();
			pr_ctr_Ent								.do_lc_init();
		}
		
		this.do_lc_show = function(){
			//------------------ req lst data for show---------------------------
			do_Get_Lst_Category();
			
			//-------------------------------------------------------------------
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
		};	
		
		this.do_lc_show_callback = function(){
			try{
			 	$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAIN, {}));
//			 	do_gl_apply_right($(pr_divContent)); 
			 	
			 	//-------------------------------------------------------------------
				pr_ctr_List.do_lc_show();
				
				//-------------------------------------------------------------------
				var params = req_gl_Url_Params(App.data.url);
				if (params.id){
					var mode = params.mode;
					var lang = params.lang
					if (!mode) mode = App['const'].MODE_SEL;
					if (!lang) lang = App.language;
					App.controller[pr_grpName].Ent.do_lc_show_ById(params.id, mode, lang);
				} else {
					App.controller[pr_grpName].Ent.do_lc_show(null);	//init: obj is null
				}
				
				
				//-----------------------------------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MaxResize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MinResize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize	();
				
			}catch(e) {		
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "mat.material", "Main", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------private-----------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------
		var var_lc_TYP_PARENT_CAT = 100; //---for ref, 200: for blog
		var do_Get_Lst_Category = function(callback){
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVLst');	//manId = null
			ref["codes"]	= "REF_CMDB; REF_LIST_MACHINE";
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_Get_Lst_Category_Response, [callback]));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		//-------------------------------------------------------------------------------------
		
		var do_Get_Lst_Category_Response= function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				App.data.LstCategories = sharedJson[App['const'].RES_DATA];
			}
		}	
		//-------------------------------------------------------------------------------------
			
	};

	return MatMaterialMain;
  });