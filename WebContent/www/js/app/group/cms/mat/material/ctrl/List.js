define([
	'jquery',
	'group/mat/material/ctrl/List',
	
	'text!group/mat/material/tmpl/List.html',
	
	'text!group/mat/material/tmpl/List_Typ_App.html',
	'text!group/mat/material/tmpl/List_Typ_Node.html',  	
	'text!group/mat/material/tmpl/List_Typ_Env.html',  	
	'text!group/mat/material/tmpl/List_Typ_SA.html',  	
	'text!group/mat/material/tmpl/List_Typ_CA.html',  	
	
	'text!group/mat/material/tmpl/List_Stat_Review.html'
	

	],
	function($, 	
			CtrlList,
			
			Tmpl_List,
			
			Tmpl_List_Typ_App,
			Tmpl_List_Typ_Node,	
			Tmpl_List_Typ_Env,	
			Tmpl_List_Typ_SA,	
			Tmpl_List_Typ_CA,	
			
			Tmpl_List_Stat_Review
	) 
	{

	var CtrlList 	= function (header,content,footer, grpName) {
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
		var pr_ctr_Right 			= null;
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//-----------------------------------------------------------------------------------
		var pr_SERVICE_CLASS		= "ServiceMatMaterial"; //to change by your need
		var pr_SV_LST_DYN 			= "SVLstDyn";
		//-----------------------------------------------------------------------------------
		var varname					= "varname";
		
		var pr_TYP_01_APP			= "[10]";
		var pr_TYP_01_ENV			= "[30]";
		
		var pr_TYP_01_NODE			= "[50]";
		
		var pr_TYP_01_DBS			= "[60]";
		var pr_TYP_01_KUN			= "[70]";
		
		var pr_TYP_01_SA			= "[80]";
		var pr_TYP_01_CA			= "[100]";
		
		
		
		var pr_STAT_NEW				= "[0]";
		var pr_STAT_ACTIV			= "[1]";
		var pr_STAT_ACTIV_02		= "[2]";
		var pr_STAT_REVIEW			= "[5]";
		var pr_STAT_DELETED			= "[10]";
		
		var pr_datatables			= {};
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			
			tmplName.LIST							= "List";
			
			tmplName.LIST_TYP_NODE					= "List_Typ_Node";
			tmplName.LIST_TYP_APP					= "List_Typ_App";
			tmplName.LIST_TYP_ENV					= "List_Typ_Env";
			tmplName.LIST_TYP_KUN					= "List_Typ_Kun";
			tmplName.LIST_TYP_DBS					= "List_Typ_Dbs";
			tmplName.LIST_TYP_SA					= "List_Typ_Sa";
			tmplName.LIST_TYP_CA					= "List_Typ_Ca";
			
			tmplName.LIST_STAT_REVIEW				= "List_Stat_Review";
			
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST				, Tmpl_List); 
			
				tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_NODE	, Tmpl_List_Typ_Node); 
				tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_APP	, Tmpl_List_Typ_App); 
				tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_ENV	, Tmpl_List_Typ_Env); 
				tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_SA	, Tmpl_List_Typ_SA); 
				tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_CA	, Tmpl_List_Typ_CA); 
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT_REVIEW	, Tmpl_List_Stat_Review); 
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(){   
			$(pr_divContent)			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST, {}));
			
			self.do_lc_show_byTypeStat("#div_List_Typ_Node"	, tmplName.LIST_TYP_NODE			, 	pr_TYP_01_NODE 	, null	, pr_STAT_ACTIV);
			self.do_lc_show_byTypeStat("#div_List_Typ_App"	, tmplName.LIST_TYP_APP	 			, 	pr_TYP_01_APP 	, null	, pr_STAT_ACTIV);
			self.do_lc_show_byTypeStat("#div_List_Typ_Env"	, tmplName.LIST_TYP_ENV	 			, 	pr_TYP_01_ENV 	, null	, pr_STAT_ACTIV);
//			self.do_lc_show_byTypeStat("#div_List_Typ_Kun"	, tmplName.LIST_TYP_KUN	 			, 	pr_TYP_01_KUN 	, null	, pr_STAT_ACTIV);
//			self.do_lc_show_byTypeStat("#div_List_Typ_Dbs"	, tmplName.LIST_TYP_DBS	 			, 	pr_TYP_01_DBS 	, null	, pr_STAT_ACTIV);
			self.do_lc_show_byTypeStat("#div_List_Typ_Sa"	, tmplName.LIST_TYP_SA	 			, 	pr_TYP_01_SA 	, null	, pr_STAT_ACTIV);
			self.do_lc_show_byTypeStat("#div_List_Typ_Ca"	, tmplName.LIST_TYP_CA	 			, 	pr_TYP_01_CA 	, null	, pr_STAT_ACTIV);
			
//			self.do_lc_show_byTypeStat("#div_List_Stat_New"		, tmplName.LIST_STAT_NEW	 	, 	null, null		, pr_STAT_NEW);
			self.do_lc_show_byTypeStat("#div_List_Stat_Review"	, tmplName.LIST_STAT_REVIEW		, 	null, null		, pr_STAT_REVIEW);
//			self.do_lc_show_byTypeStat("#div_List_Stat_Deleted"	, tmplName.LIST_STAT_DELETED	, 	null, null		, pr_STAT_DELETED);
			
		};
		
		this.do_lc_show_byTypeStat = function(div, tmplName, typ01, typ02, stat01){
			$(div) 		.html(tmplCtrl.req_lc_compile_tmpl(tmplName	, {}));
			do_get_list_ByAjax_Dyn	(div, typ01, typ02, stat01);
		}
		
		this.do_lc_refresh_byTypeStat = function (typ01, typ02, stat01){
			var key			= (!typ01?"":typ01) + "_" + (!typ02?"":typ02) + "_" + (!stat01?"":stat01);
			pr_datatables [key].fnDraw();
		}
		
		var do_get_list_ByAjax_Dyn = function(div, typ01, typ02, stat01){	
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LST_DYN);
			ref.typ01 				= typ01;
			ref.typ02 				= typ02;
			ref.stat01 				= stat01; 
			
			var fileTransl			= null;
			var additionalConfig 	= {
					"stat01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.stat01 != null){
								if(oData.stat01 == 0){
									$(nTd).html($.i18n("ent_stat01_00"))
								}else if(oData.stat01 == 1){
									$(nTd).html($.i18n("ent_stat01_01"));
								}else if(oData.stat01 == 2){
									$(nTd).html($.i18n("ent_stat01_02"));
								}else if(oData.stat01 == 5){
									$(nTd).html($.i18n("ent_stat01_05"));
								}else if(oData.stat01 == 10){
									$(nTd).html($.i18n("ent_stat01_10"));
								}else {
									$(nTd).html($.i18n("ent_stat01_undef"));
								} 
							} else {
								$(nTd).html("");
							} 
						},
					},
			}
			var colConfig			= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var dataTableOption 	= {
					"canScrollY"			: true,
					"canScrollX"			: true,
//					"searchOption" 			: true,	
//					"searchOptionConfig" 	: [	{lab: $.i18n('common_search_any'), val:0}]
			};	     		
			var fError 				= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 				= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], fileTransl, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event, dataTableOption);
			
			var key					= (!typ01?"":typ01) + "_" + (!typ02?"":typ02) + "_" + (!stat01?"":stat01);
			pr_datatables [key] 	= oTable;
		}
		
		var do_bind_list_event = function(sharedJson, div, oTable) {
			$(div).find('tr').off('click')
			$(div).find('tr').on('click', function(){
				if(	App.data.mode == App['const'].MODE_MOD 	|| 
					App.data.mode == App['const'].MODE_NEW	||
					App.data.mode == App['const'].MODE_TRANSL){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				pr_ctr_Ent. do_lc_show_ById(oData.id, App['const'].MODE_SEL);
			});
		};
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
	};

	return CtrlList;
	});