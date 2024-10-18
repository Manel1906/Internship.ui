define([
        'jquery',
        'text!group/mat/warehouse/tmpl/MatWarehouse_List.html',     
        'text!group/mat/warehouse/tmpl/MatWarehouse_List_Header.html',  
        'text!group/mat/warehouse/tmpl/MatWarehouse_List_Content.html',  
        
        'text!group/mat/warehouse/tmpl/MatWarehouse_List_Filter_Header.html',  
    	'text!group/mat/warehouse/tmpl/MatWarehouse_List_Filter_Content.html', 
    	'text!group/mat/warehouse/tmpl/MatWarehouse_List_Filter_Box.html', 

        ],
        function($, 
        		MatWarehouse_List,
        		MatWarehouse_List_Header,
        		MatWarehouse_List_Content,
        		
        		MatWarehouse_List_Filter_Header,
    			MatWarehouse_List_Filter_Content,
    			MatWarehouse_List_Filter_Box
        ) 
        {

	var MatWarehouseList 	= function (header,content,footer, grpName) {
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
		var pr_SERVICE_CLASS		= "ServiceMatWarehouse"; //to change by your need
		
		
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
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatWarehouse.Main;
			pr_ctr_List 			= App.controller.MatWarehouse.List;
			
			pr_ctr_Ent				= App.controller.MatWarehouse.Ent;
			pr_ctr_EntHeader 		= App.controller.MatWarehouse.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatWarehouse.EntBtn;
			pr_ctr_EntTabs 			= App.controller.MatWarehouse.EntTabs;			
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{
				
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_LIST			, MatWarehouse_List); 
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_LIST_HEADER		, MatWarehouse_List_Header); 		
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_LIST_CONTENT	, MatWarehouse_List_Content); 		
				
				$(pr_divHeader).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST			, {}));
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST_HEADER	, {}));
				$(pr_divFooter).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST_CONTENT	, {}));
				
				//fixed max-height scroll of % height div_ContentView
//				do_gl_calculateScrollBody(pr_divFooter, 89.5);

//				do_get_list_ByAjax		($(pr_divFooter));
				var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
				if(rightSocMa)
					do_load_view_filter();
				else
					$("#div_MatWarehouse_List_Filter").hide();
				
				do_get_list_ByAjax_Dyn	(pr_divFooter);
				

			}catch(e) {
				console.log(e);
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.warehouse", "MatWarehouseList", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_load_view_filter = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_LIST_FILTER_HEADER			, MatWarehouse_List_Filter_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_LIST_FILTER_CONTENT			, MatWarehouse_List_Filter_Content); 
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_WAREHOUSE_LIST_FILTER_BOX				, MatWarehouse_List_Filter_Box); 
			$("#div_MatWarehouse_List_Filter_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST_FILTER_HEADER	, {}));
			$("#div_MatWarehouse_List_Filter_Box")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST_FILTER_BOX		, {}));
			do_wait_bind_event_filter();
		}
		
		var do_wait_bind_event_filter = function(){
			if(App.data["LstSociete"] && App.data["LstSocieteChild"]){
				do_lc_bind_event_filter();
			}else{
				setTimeout(do_wait_bind_event_filter, 200);
			}
		}
							

		//---------private-----------------------------------------------------------------------------		
		function do_get_list_ByAjax(div, type, varname){	
			var ref				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatWarehouseList");

			var fSucces			= [];	
			fSucces.push(req_gl_funct(App	, App.funct.put		, [varname_tabtype]));
			fSucces.push(req_gl_funct(null	, do_show_list		, []));
			fSucces.push(req_gl_funct(null	, do_bind_list_event, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;		
		}
		
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, type, varname, socId){	
			var ref			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatWarehouseLstDyn");
//			ref["type"]		= pr_ctr_Main.var_lc_Type;
			
			if(socId)	ref["socId"]		= socId;
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "vn";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";

			var additionalConfig = {}
			
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, ".table-datatableDyn", undefined, do_bind_list_event);
		}
		
		//--------------------------------------------------------------------------------------------
		var do_show_list = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {				
				var tabtypes 		= App.data[varname_tabtype];

				$(pr_divFooter).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST_CONTENT	, tabtypes));	
			} else {
				//do something else
			}
		}

		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(data, div, oTable) {
			//load datatable effects after AJAX resultat
			pr_ctr_Main.do_lc_binding_pages($(pr_divHeader));
			
			if(App.data.cur_Warehouse) {
				$(div).find('.table-datatableDyn tbody tr').each(function() {
					var oData = oTable.fnGetData(this);
					
					if(App.data.cur_Warehouse.id === oData.id)	{
						do_gl_Add_Class_List($(this).parent(), $(this), "selected");
						return false;
					}
				});
			}
			
			$(div).find('.table-datatableDyn').on('click', 'tr', function(){
				//apply CSS style
				//check mod
				if(App.data.mode == App['const'].MODE_MOD || App.data.mode == App['const'].MODE_NEW) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");

				var oData = oTable.fnGetData(this);
				App.data.cur_Warehouse = oData;
								
				//ajax to fetch data from server
				pr_ctr_Ent.do_lc_show_ById(oData, App['const'].MODE_SEL);	
		
			});
		};
		
		//--------------------------------------------------------------------------------------------
		var do_lc_bind_event_filter = function(){
			do_gl_input_autocomplete("#MatWarehouse_List_Societe_Name", {
				required: true,
				source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
				selectCallback: function(item ) {
					$("#MatWarehouse_List_Societe_Id")		.val(item.id);
					$("#MatWarehouse_List_Societe_Name")		.val(item.name01);
				},
				renderAttrLst: ["name01"],
				minLength: 0,
			});

			$("#btn_mat_warehouse_filter_submit").off("click");
			$("#btn_mat_warehouse_filter_submit").on("click", function(){
				var filter = req_gl_data({
					dataZoneDom : $("#frm_filter_mat_warehouse")
				});
				
				var socId = filter.data.id;

				$("#div_MatWarehouse_List_Filter_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_WAREHOUSE_LIST_FILTER_CONTENT	, {}));
				do_get_list_ByAjax_Dyn("#div_MatWarehouse_List_Filter_Content", null, null, socId);
			});

			$("#btn_mat_warehouse_filter_reset").off("click");
			$("#btn_mat_warehouse_filter_reset").on("click", function(){
				$("#div_MatWarehouse_List_Filter_Content")	.html("");
			});
			do_gl_init_show_box($("#div_MatWarehouse_List_Filter"));
		}

		
		//--------------------------------------------------------------------------------------------
		
	
	};

	return MatWarehouseList;
  });