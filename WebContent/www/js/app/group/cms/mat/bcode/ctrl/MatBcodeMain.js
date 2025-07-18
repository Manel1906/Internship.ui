define([
        'jquery',
        
        'text!group/mat/bcode/tmpl/MatBcode_Main.html',
        'text!group/mat/bcode/tmpl/MatBcode_Receipt.html',
        'text!group/mat/bcode/tmpl/MatBcode_List.html', 
        
        'group/mat/bcode/ctrl/MatBcodeList',
        'group/mat/bcode/ctrl/MatBcodeEnt',
        'group/mat/bcode/ctrl/MatBcodeEntHeader',
        'group/mat/bcode/ctrl/MatBcodeEntBtn',
        ],
        function($,         		
				MatBcode_Main, 
				MatBcode_Receipt,
        		MatBcode_List,
        		
        		MatBcodeList, 
        		MatBcodeEnt, 
        		MatBcodeEntHeader, 
        		MatBcodeEntBtn
        ) {

	var MatBcodeMain 	= function (header,content,footer, grpName) {
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
	
		//---------------------------------------------------------------
		
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.MAT_BCODE_MAIN			= "MatBcode_Main";
			tmplName.MAT_BCODE_RECEIPT		= "MatBcode_Receipt";
			tmplName.MAT_BCODE_LIST			= "MatBcode_List";
			tmplName.MAT_BCODE_LIST_SINGLE_PRODUIT_HEADER	= "MatBcode_List_Single_Produit_Header";
			tmplName.MAT_BCODE_LIST_SINGLE_PRODUIT_CONTENT	= "MatBcode_List_Single_Produit_Content";
			tmplName.MAT_BCODE_LIST_FORMULE_PRODUIT_HEADER	= "MatBcode_List_Formule_Produit_Header";
			tmplName.MAT_BCODE_LIST_FORMULE_PRODUIT_CONTENT	= "MatBcode_List_Formule_Produit_Content";
			
			tmplName.MAT_BCODE_ENT			= "MatBcode_Ent";
			tmplName.MAT_BCODE_ENT_BTN		= "MatBcode_EntBtn";
			tmplName.MAT_BCODE_ENT_HEADER	= "MatBcode_EntHeader";
			
			if (!App.controller.MatBcode)				
				 App.controller.MatBcode			= {};
			
			if (!App.controller.MatBcode.Main)	
				App.controller.MatBcode.Main 		= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.MatBcode.List)  
				 App.controller.MatBcode.List		= new MatBcodeList			("#div_MatBcode_List", "#div_MatBcode_List_Header", "#div_MatBcode_List_Content");				
			if (!App.controller.MatBcode.Ent)  
				 App.controller.MatBcode.Ent		= new MatBcodeEnt			(null, "#div_MatBcode_Ent", null);
			if (!App.controller.MatBcode.EntBtn)  
				 App.controller.MatBcode.EntBtn		= new MatBcodeEntBtn		(null, "#div_MatBcode_Ent_Btn", null);
			if (!App.controller.MatBcode.EntHeader)  
				 App.controller.MatBcode.EntHeader	= new MatBcodeEntHeader		(null, "#div_MatBcode_Ent_Header", null);
			//----------tab name----------------------------------------------------------------------------------------
			

			App.controller.MatBcode.List			.do_lc_init();
			App.controller.MatBcode.Ent				.do_lc_init();
			App.controller.MatBcode.EntBtn			.do_lc_init();
			App.controller.MatBcode.EntHeader		.do_lc_init();
			
		}
		
		
		this.do_lc_show = function(){
			try { 
				
				do_gl_refresh_SecuHeader();
				
				
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_MAIN	, MatBcode_Main); 
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_LIST	, MatBcode_List); 
				$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_MAIN	, {}));	
				$("#div_MatBcode_List")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_LIST	, {}));
				
				App.controller	.MatBcode.List	.do_lc_show("#div_MatBcode_List_Single_Produit"	, null, 1);
				App.controller	.MatBcode.List	.do_lc_show("#div_MatBcode_List_Formule_Produit", null, 2);
				
				
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
				
//				do_gl_init_Resizable("#div_MatBcode_List");	

				App.controller.Shp.ShpMain.do_lc_bind_event_div_MaxResize('#div_MatBcode_List', '#div_MatBcode_Ent');
				App.controller.Shp.ShpMain.do_lc_bind_event_div_Minimize();
				App.controller.Shp.ShpMain.do_lc_bind_event_div_MinResize('#div_MatBcode_List', '#div_MatBcode_Ent');
			}catch(e) {				
			}
		};
		
		this.do_lc_binding_pages = function(div) {
			try {
				if(div.length>0) do_gl_enhance_within(div);
			} catch (e) {
				do_gl_show_Notify_Msg_Error(null, e);
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_Get_Cfg_Values= function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('SVCfgClass', 'SVCfgService');			
		
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ['cfg_value_01']));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}		
			
	};

	return MatBcodeMain;
  });