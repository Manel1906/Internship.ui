define([
	'jquery',
	'text!group/mat/material/tmpl/Ent_Header.html',
	
	],
	function($, 
			Ent_Header
			
			) {

	var CtrlEntHeader     = function (header,content,footer, grpName) {
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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		//------------------privated------------------------------------------------------
		var pr_spaces				= " &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
		var pr_SERVICE_PER_CLASS	= "ServicePerPerson"; //to change by your need
		var pr_SV_PER_SEARCH		= "SVPerLstSearch";


		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_right_add_producer	= 20302;
		
		var pr_TYP_01_MATERIAL					= 1;
		var pr_TYP_01_SERVICE					= 200;
		var pr_TYP_01_FINANCE					= 100;
		
		var pr_TYP_02_MAT_SINGLE				= 1;
		var pr_TYP_02_MAT_BOM					= 2;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;

			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			
			tmplName.ENT_HEADER						= "EntHeader";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER					, Ent_Header); 
			
		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 		= obj;
			pr_mode		= mode;

			try{
				$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER	, pr_obj));
				
				do_bind_event(obj, mode);
			}catch(e) {	
				console.log(e.toString());			
//				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.material", "CtrlEntHeader", "do_lc_show", e.toString()) ;
			}
		};

		
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			if (App.controller.HtmlEditor)  
				App.controller.HtmlEditor.do_lc_bindingEvent (".htmlEditor", "dest", "funct", mode, true);
			
			var objTyp01 = obj.typ01;
			if (objTyp01){
				$(".typ01_"+objTyp01).show();
			}
			
			$("#sel_typ01").off("change");
			$("#sel_typ01").on("change", function(){
				var optionSelected 	= $("option:selected", this);
			    var typ01 			= this.value;
				$(".hide").hide();
				$(".hide").removeAttr("selected");
				$(".typ01_"+typ01).show();
				$(".typ01_"+typ01).removeAttr("selected");
				
//				pr_ctr_EntTabs.do_lc_show_tabs_byType	($("#inp_typ01").val(), $("#inp_typ02").val());
			})
			
			
			$("#sel_typ02").off("change");
			$("#sel_typ02").on("change", function(){
				var typ02 = $("#inp_typ02").val();
				if(typ02 == pr_TYP_02_MAT_BOM){//--phuc hop luon la product
					$("#inp_typ01")	.val(pr_TYP_01_MATERIAL);	
				}
				
				pr_ctr_EntTabs.do_lc_show_tabs_byType	($("#inp_typ01").val(), $("#inp_typ02").val());
			})
			
			
			
//			do_gl_input_autocomplete_dyn("#inp_producerName", {
////				placeholder : $.i18n("mat_material_header_producer_help"),
//				
//				dataReq 	: {"typ02" : 1010004,"nbLine" : 10}, 
//				dataService : [pr_SERVICE_PER_CLASS, pr_SV_PER_SEARCH], 
//				dataRes 	: ["name01"], 
//				dataSel 	: {"#inp_producerId": "id"},
//				minLength	: 0,
//				canAdd		: false 
//			});
			
		}
		
		//-------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------
	};
	
	return CtrlEntHeader;
});