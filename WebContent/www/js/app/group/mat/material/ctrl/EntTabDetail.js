define([
	'jquery',
	'text!group/mat/material/tmpl/Ent_Tab_Detail.html',      
	],
	function($,
			Ent_Tab_Detail 
	) {

	var CtrlEntTabDetail     		= function (header,content,footer, grpName) {
		var pr_divHeader 			= header  ? $(header) : null;
		var pr_divContent 			= content ? $(content): null;
		var pr_divFooter 			= footer  ? $(footer) : null;

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

		var pr_default_new_line	= {
				id 			: -1,
				ord			: null,
				inf01		: null,
				chiId		: null,
				parId		: null,
		};
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= -1;// change to adapt with back office for lock tool

		var pr_SERVICE_MAT_CLASS	= "ServiceMatMaterial";
		var pr_SV_MAT_SEARCH		= "SVLst";
		
		var pr_TYP_01_APP			= 10;
		var pr_TYP_01_ENV			= 30;
		
		var pr_TYP_01_NODE			= 50;
		
		var pr_TYP_01_DBS			= 60;
		var pr_TYP_01_KUN			= 70;
		
		var pr_TYP_01_SA			= 80;
		var pr_TYP_01_CA			= 100;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntTabs 			= null;
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//-----------------------------------------------------------------------------------
		
		
		var pr_TYP_01_MACHINE					= 10;
		var pr_TYP_01_APP						= 20;
		
		//-----------------------------------------------------------------------------------
		var pr_cache_unit_by_mat_id 	= {};
		var pr_cache_price_by_mat_id 	= {};
		var pr_cache_stk_by_mat_id 		= {};
		var pr_cache_time				= {};
		
		var lstBaseUnit 				= null;
		
		var pr_val_unitRef				= "";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init					= function(){
			pr_ctr_Main 				= App.controller[pr_grpName].Main;
			pr_ctr_List 				= App.controller[pr_grpName].List;

			pr_ctr_Ent					= App.controller[pr_grpName].Ent;
			pr_ctr_EntTabs 				= App.controller[pr_grpName].EntTabs;
			pr_ctr_TabDetail			= App.controller[pr_grpName].EntTabDetail;
			
			tmplName.ENT_TAB_DETAIL		= "Ent_Tab_Detail";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_DETAIL, Ent_Tab_Detail); 
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 		= obj;
			pr_mode			= mode;
			
			try{
				$("#div_Ent_Tab_Detail").html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_DETAIL, {}));
				
				do_lc_init_detail_table	(obj, mode);
				do_lc_bind_event		(obj, mode);
			}catch(e) {	
				console.log (e);
			}
		};

		
		//------------------------------------------------------------------------------------------------------------
		var do_lc_bind_event = function(obj, mode){
		
		}
		
		//---------private-----------------------------------------------------------------------------
		var do_lc_init_detail_table = function(obj, mode){
			var additionalConfig = {
					"id":{
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex", iRow);	
							
							if(oData.chiObj) do_show_result (oData.chiObj, oData, line);
						}
					},
					"view": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).html("<a href='view_mat_material.html?id="+oData.chiId+"' target='_blank'><i class ='fa fa-eye'></i></a>");
						},
					},
					
					"matName01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							do_gl_input_autocomplete_dyn(nTd, {								
								dataRes 		: ["name01", "name02", "code01"], 
								dataReq 		: {"nbLine" : 20, "searchType": 1}, //search by name 
								dataService 	: [pr_SERVICE_MAT_CLASS, pr_SV_MAT_SEARCH], 
								selectCallback	: function(item) {
									console.log(item);
									
									var line = $(nTd).parent();
									do_show_result (item, oData, line);
								},
								required		: true,
								minLength		: 0,
								autoSearch		: true,		
								
								canAdd			: false								
							}, oData);
						}

					},
					
					"matName02": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						},
					},
					
					"matTyp01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						},
					},
							
									
					"matCode01": {						
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							do_gl_input_autocomplete_dyn(nTd, {								
								dataRes 		: [ "code01", "name01", "name02"], 
								dataReq 		: {"nbLine" : 20, "searchType": 2}, //search by code 
								dataService 	: [pr_SERVICE_MAT_CLASS, pr_SV_MAT_SEARCH], 
								selectCallback	: function(item) {
									console.log(item);
									
									var line = $(nTd).parent();
									do_show_result (item, oData, line);
								},
								required		: true,
								minLength		: 0,
								autoSearch		: true,		
								
								canAdd			: false								
							}, oData);
						}
					},
					
					"statLab": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if (oData.stat01){
								oData.statLab 	= $.i18n("ent_det_stat_0"+ oData.stat01);
								$(nTd).html (oData.statLab);
							}
							
							
							var lstStat = [
								{"val" : 0, "label" : $.i18n("ent_det_stat_00") , "displ" : $.i18n("ent_det_stat_00")}, 
								{"val" : 1, "label" : $.i18n("ent_det_stat_01")	, "displ" : $.i18n("ent_det_stat_01")}, 
								{"val" : 5, "label" : $.i18n("ent_det_stat_05")	, "displ" : $.i18n("ent_det_stat_05")}];
							
							do_gl_set_input_autocomplete(nTd, {
								dataTab 		: {"val": "stat"}, //val => col stat
								source			: lstStat, 
								minLength		: 0,
								selectCallback	: function(item) {
									oData.stat01 = item.val;
								},
								focusCallback	: function(item) {
									$(nTd).select();
								},
							}, oData);
						},
					},
					"inf01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						},
					},
					
			}

			req_gl_create_datatable(obj, "#table_mat_detail_new", additionalConfig, pr_default_new_line, function(){
				if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
					do_gl_enable_edit($("#div_Ent_Tab_Detail"));
					$("#table_mat_detail_new tfoot td").attr("contenteditable", "false");//can not edit element footer
				}
			});
		}.bind(this); 

		var do_search_article = function(request, response) {
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_MAT_CLASS, pr_SV_MAT_SEARCH);	
			ref.searchkey	= request.term;
			var fSucces		= [];

			fSucces.push(req_gl_funct(null, do_search_article_response, [response]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		//-------------------------------------------------------------------------------------------------------
		var do_show_result = function(item, oData, line){
			oData.chiId 	= item.id;
			
			
			if (item.name01){ 
				oData.matName01 = item.name01; //--for search _sFilterRow in datatable
				line.find(".matName01").html(oData.matName01);
			}
			if (item.name02){ 
				oData.matName02 = item.name02;
				line.find(".matName02").html(oData.matName02);
			}
			if (item.code01){ 
				oData.matCode01	= item.code01;
				line.find(".matCode01").html(oData.matCode01);
			}
			
			if (item.typ01){ 
				oData.matTyp01 	= $.i18n("ent_typ01_"+item.typ01);
				line.find(".matTyp01").html(oData.matTyp01);
			}
		}
	};

	return CtrlEntTabDetail;
});