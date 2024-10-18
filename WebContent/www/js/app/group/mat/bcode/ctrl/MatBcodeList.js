define([
        'jquery',
        'text!group/mat/bcode/tmpl/MatBcode_List_Single_Produit_Header.html',     
    	'text!group/mat/bcode/tmpl/MatBcode_List_Single_Produit_Content.html',  
    	'text!group/mat/bcode/tmpl/MatBcode_List_Formule_Produit_Header.html',  
    	'text!group/mat/bcode/tmpl/MatBcode_List_Formule_Produit_Content.html',

        ],
        function($, 
        		MatBcode_List_Single_Produit_Header,
        		MatBcode_List_Single_Produit_Content,
        		MatBcode_List_Formule_Produit_Header,
        		MatBcode_List_Formule_Produit_Content
        ) 
        {

	var MatBcodeList 	= function (header,content,footer, grpName) {
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
		var pr_SERVICE_CLASS		= "ServiceMatMaterial"; //to change by your need
		
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
		var varname					= "varname";
		var pr_type_single			= 1;
		var pr_type_formule			= 2;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatBcode.Main;
			pr_ctr_List 			= App.controller.MatBcode.List;
			
			pr_ctr_Ent				= App.controller.MatBcode.Ent;
			pr_ctr_EntHeader 		= App.controller.MatBcode.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatBcode.EntBtn;
//			pr_ctr_EntTabs 			= App.controller.MatBcode.EntTabs;			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, type01, type02){               
			try{
				doLoadView(div, type01, type02);
				do_get_list_ByAjax_Dyn(div, type01, type02);
			}catch(e) {				
			}
		};

		var doLoadView = function(div, type01, type02){
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_LIST_SINGLE_PRODUIT_HEADER	, MatBcode_List_Single_Produit_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_LIST_SINGLE_PRODUIT_CONTENT	, MatBcode_List_Single_Produit_Content); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_LIST_FORMULE_PRODUIT_HEADER	, MatBcode_List_Formule_Produit_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.MAT_BCODE_LIST_FORMULE_PRODUIT_CONTENT, MatBcode_List_Formule_Produit_Content); 
			
			
			if(type02 == pr_type_single){
				$("#div_MatBcode_List_Single_Produit_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_LIST_SINGLE_PRODUIT_HEADER	, {}));
				$("#div_MatBcodel_List_Single_Produit_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_LIST_SINGLE_PRODUIT_CONTENT	, {}));
			} else if(type02 == pr_type_formule){
				$("#div_MatBcode_List_Formule_Produit_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_LIST_FORMULE_PRODUIT_HEADER	, {}));
				$("#div_MatBcode_List_Formule_Produit_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_BCODE_LIST_FORMULE_PRODUIT_CONTENT	, {}));
			}
		
			//fixed max-height scroll of % height div_ContentView
//			do_gl_calculateScrollBody("#div_MatMaterial_List", 89.5);
		}
							

		//---------private-----------------------------------------------------------------------------		
		function do_get_list_ByAjax_Dyn(div, type01, type02, varname){	
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVMatMaterialLstDyn");
			ref["typ01"]	= type01;
			ref["typ02"]	= type02;

			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	

			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig = {
					"stat": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.stat != null){
								if(oData.stat == 0){
									$(nTd).html($.i18n("mat_material_status_00"))
								}else if(oData.stat == 1){
									$(nTd).html($.i18n("mat_material_status_01"));
								}else {
									$(nTd).html($.i18n("mat_material_status_02"));
								} 
							} else {
								$(nTd).html("");
							} 
						},
					},
					
					"action": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).html('<div class="box-icon" style="text-align:center">'
							+'<a class="editable a_arrow action-btn active text-center"><i class="fa fa-arrow-right"></i></a></div>');
							
//							$(nTd).find(".a_arrow").off("click");
//							$(nTd).find(".a_arrow").on("click", function() {
//								var table = $(this).parents("table").DataTable();
//								var oData = table.row($(this).parents('tr')).data();
//								pr_ctr_EntHeader.do_lc_get_list(oData);
//								pr_ctr_EntHeader.do_lc_show_list();
//								
//							});
							
							$(nTd).off("click");
							$(nTd).on("click", function() {
								var table = $(this).parents("table").DataTable();
								var oData = table.row($(this).parents('tr')).data();
								pr_ctr_EntHeader.do_lc_get_list(oData);
								pr_ctr_EntHeader.do_lc_show_list();
								
							});
							
						}
					},
			}
			
			var taConfig	= {
					scrollX			: "true",
					sScrollX		: "100%",
				    sScrollXInner	: "500%",
				    bScrollCollapse	: true,
				    columnDefs: [
				    	{ "width": "350px", "targets": ["name01"] },
				    	{ "width": "150px", "targets": ["stat"] },
				      ]
				}
			
			
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], filename, colConfig, ref, fError, 100, null, null, do_bind_list_event, taConfig);		
		}
		
		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(data, div, oTable) {
			do_gl_enhance_within($(div));
			//load datatable effects after AJAX resultat
//			pr_ctr_Main.do_lc_binding_pages($(pr_divHeader));
	
			$(div).find('.table-datatableDyn tbody').find("tr").prop("draggable", true);
			
			$(div).find('.table-datatableDyn tbody').off('dragstart', 'tr');
			$(div).find('.table-datatableDyn tbody').on('dragstart', 'tr', function(event){
				var oData = oTable.fnGetData(this);
				var json 	= JSON.stringify(oData);
				event.originalEvent.dataTransfer.setData("data", json);
			});
		};
		//--------------------------------------------------------------------------------------------
	};

	return MatBcodeList;
  });