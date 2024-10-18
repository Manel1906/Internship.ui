define([
	'jquery',
	'text!group/mat/alarm/tmpl/MatAlarm_Ent_Header.html'
	],

	function($, 
			MatAlarm_Ent_Header
			) {


	var MatAlarmEntHeader     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		var pr_SERVICE_CLASS	= "ServiceMatMaterial";
		var pr_SV_MAT_SEARCH	= "SVMatMaterialSearch";

		var pr_SERVICE_PRICE_CLASS	= "ServiceMatPrice";
		var pr_SV_PRICE_SEARCH		= "SVMatPriceLstByMat";

		var var_lc_STAT_VALIDE 	= 1;
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

		var pr_price_unit_base 		= null;

		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.MatAlarm.Main;
			pr_ctr_List 			= App.controller.MatAlarm.List;

			pr_ctr_Ent				= App.controller.MatAlarm.Ent;
			pr_ctr_EntHeader 		= App.controller.MatAlarm.EntHeader;
			pr_ctr_EntBtn 			= App.controller.MatAlarm.EntBtn;
//			pr_ctr_EntTabs 			= App.controller.MatAlarm.EntTabs;

		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{

				
				if(mode == App['const'].MODE_MOD){
					obj.unitIn = obj.info04; 
					obj.val00 = obj.val01; 

				}
				
				tmplCtrl.do_lc_put_tmpl(tmplName.MAT_ALARM_ENT_HEADER	, MatAlarm_Ent_Header); 

				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAT_ALARM_ENT_HEADER, obj));
				
				if(Object.keys(obj).length == 0){
					$("#inp_mat_val00"	).val(1);
					$("#inp_mat_val02"	).val(30);
					$("#inp_mat_val03"	).val(1);
				}
				
				if(mode == App['const'].MODE_SEL){
					$('.display-new-edit').addClass('inp-hidden');
					$("#btn_MatAlarm_cal_unitBase").hide();
				}
				
				do_bind_event(obj, mode);
				App.controller.Shp.ShpMain.do_lc_bind_event_div_Minimize();
			}catch(e) {				
				console.log(e);
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			$("#ratioIn").val(obj.val04);

			var tmp  =  $("#entId").val();

			do_gl_input_autocomplete_dyn("#inp_mat_inf01", {
				dataRes 	: ["code01"], 
				dataReq 	: {"nbLine" : 10, "searchType": 1}, 
				dataService : [pr_SERVICE_CLASS, pr_SV_MAT_SEARCH], 

				succesCallback	: do_lc_fill_info_mat,
				
				required		: true,
				minLength		: 0,
				autoSearch		: true,		
				
			});

			do_gl_input_autocomplete_dyn("#inp_mat_inf02", {
				dataRes 	: ["code03"], 
				dataReq 	: {"nbLine" : 10, "searchType": 1}, 
				dataService : [pr_SERVICE_CLASS, pr_SV_MAT_SEARCH], 

				succesCallback	: do_lc_fill_info_mat,
				
				required		: true,
				minLength		: 0,
				autoSearch		: true,		
				
			});

			do_gl_input_autocomplete_dyn("#inp_mat_inf03", {
				dataRes 	: ["name01"], 
				dataReq 	: {"nbLine" : 10, "searchType": 2}, 
				dataService : [pr_SERVICE_CLASS, pr_SV_MAT_SEARCH], 

				succesCallback	: do_lc_fill_info_mat,
				
				required		: true,
				minLength		: 0,
				autoSearch		: true,		
				
			});

			do_gl_input_autocomplete_dyn("#inp_mat_inf06", {
				dataRes 	: ["inf01"], 
				dataReq 	: {"matId" : $("#entId").val()}, 
				dataService : [pr_SERVICE_PRICE_CLASS, pr_SV_PRICE_SEARCH], 

				succesCallback : do_lc_get_ratio_in,

				required		: true,
				minLength		: 0,
				autoSearch		: true,		
				
			});

			
			$("#btn_MatAlarm_cal_unitBase").off("click");
			$("#btn_MatAlarm_cal_unitBase").on("click", function () {
				var val_unit_in = parseInt($("#inp_mat_val00").val());
				var ratio_in = parseInt($("#ratioIn").val());
				if (ratio_in){
					$("#inp_mat_val01").val(ratio_in * val_unit_in);
				}
			});
		}

		var do_bind_event_get_unit = () => {
			do_gl_input_autocomplete_dyn("#inp_mat_inf06", {
				dataRes 	: ["inf01"], 
				dataReq 	: {"matId" : $("#entId").val()}, 
				dataService : [pr_SERVICE_PRICE_CLASS, pr_SV_PRICE_SEARCH], 

				succesCallback : do_lc_get_ratio_in,

				required		: true,
				minLength		: 0,
				autoSearch		: true,		
				
			});
		}

		var do_lc_fill_info_mat = function(item){
			$("#inp_mat_inf01"	).val(item.code01);
			$("#inp_mat_inf02"	).val(item.code03);
			$("#inp_mat_inf03"	).val(item.name01);
			$("#inp_mat_inf04"	).val(item.unitBase);
			$("#entId").val(item.id);
			$("#stat").val(var_lc_STAT_VALIDE);	

			do_bind_event_get_unit();
		}

		var do_lc_get_ratio_in = function(item){
			$("#ratioIn").val(item.val00);	
		}

		var do_lc_set_field_edit = function (obj) {
			$("inp_mat_inf06").val(obj.info04); 
			$("inp_mat_val00").val(obj.val01);
		}

	};


	return MatAlarmEntHeader;
});