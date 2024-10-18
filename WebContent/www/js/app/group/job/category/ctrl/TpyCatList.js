define(['jquery'],
        function($){

	var TpyCatList 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		
		//------------------------------------------------------------------------------------
		var pr_SERVICE_CLASS		= "ServiceTpyCategory"; //to change by your need
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;		
		
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		//-----------------------------------------------------------------------------------
		var varname					= "lstTpyCat";
		var url_header 				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
		
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.TpyCat.Main;
			pr_ctr_List 			= App.controller.TpyCat.List;
			
			pr_ctr_Ent				= App.controller.TpyCat.Ent;
			pr_ctr_EntHeader 		= App.controller.TpyCat.EntHeader;
			pr_ctr_EntBtn 			= App.controller.TpyCat.EntBtn;
			pr_ctr_EntTabs 			= App.controller.TpyCat.EntTabs;			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, parTyp){               
			try{
				

				$("#div_TpyCat_Project_Report_List_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_LIST_CONTENT	, {}));
				
				do_get_list_ByAjax_Dyn(div, parTyp);
//				do_get_list_ByAjax(div, parTyp);

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "tpy.cat", "TpyCatList", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------		
		function do_get_list_ByAjax(div, parTyp){	
			var ref 			= {};
			ref[svClass] 	= "ServiceTpyCategory"; 
			ref[svName]		= "SVTpyCategoryLstCat";
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;	
			ref["parTyp"]	= parTyp;

			var fSucces			= [];	
			fSucces.push(req_gl_funct(App	, do_concat_list	, [parTyp]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;		
		}
		
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, parTyp, varname){	
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVLstDyn");
			if(parTyp)	ref.typ01 	= parTyp;
						ref.manId  	= App.data.user.manId;
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			var additionalConfig = {
			}
			
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			       		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,url_header, filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);
		}
		
		function do_concat_list(sharedJson, parTyp){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
    			App.data["catsList"][parTyp]			= sharedJson[App['const'].RES_DATA];
    			App.data["catsList"][parTyp].label 		= "tpy_cat_popup_list_" + parTyp;
    			App.data["catsList"][parTyp].parTyp 	= parTyp;
			} else {
			}
		}

		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(sharedJson, div, oTable) {
			do_gl_enhance_within($(div), {div: div});
			
			$(div).find('tr').off('click')
			$(div).find('tr').on('click', function(){
				if(App.data.mode == pr_ctr_Main.var_lc_MODE_MOD || App.data.mode == pr_ctr_Main.var_lc_MODE_NEW){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				pr_ctr_Ent. do_lc_show_ById(oData, pr_ctr_Main.var_lc_MODE_SEL);
		
			});
		};
		
		//--------------------------------------------------------------------------------------------
		var doBindingEventsList = function(data, div, oTable) {
			do_gl_enhance_within($(div), {table: oTable});

			$(div).find('.table-datatable').on('click', 'tr', function(){
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				
				//Check the lock of object
				if(pr_ctr_Ent.can_lc_have_Lock()) return;
								
				//ajax to fetch data from server
				pr_ctr_Ent. do_lc_show_ById(oData, pr_ctr_Main.var_lc_MODE_SEL);	
		
			});
		};
	};

	return TpyCatList;
  });