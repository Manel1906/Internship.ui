define([
	'jquery',
	'text!group/mat/material/tmpl/Ent_Tab_History_Action.html',  
	],
	function($,
			Ent_Tab_History_Action
	) {

	var CtrlEntTabGroup     = function (header,content,footer, grpName) {
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
		var lst_group_tempo			= [];

		var pr_default_new_line	= {
				id 		: null,
				code	: null,
				name	: null,
				manId	: null,
				mode    : 4,

		};
		var pr_tableNewLineId 	= 0;
		var pr_new_table		= undefined;
		var pr_news_line_data	= undefined;
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 20000;// change to adapt with back office for lock tool

		var pr_SERVICE_CLASS		= "ServiceMatMaterial"; //to change by your need
		var pr_SV_GROUP_SEARCH		= "SVMatGroupSearch";
		
		var pr_SV_NEW				= "SVMatMaterialNewFromGroup"; 
		var pr_SV_DEL				= "SVMatMaterialDelFromGroup"; 
		

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
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;

			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_HISTORY_ACT	, Ent_Tab_History_Action); 	
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_HISTORY_ACT, {}));
				
				do_bind_event (obj, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, "mat.material", "CtrlEntTabHistoryAct", "do_lc_show", e.toString()) ;
			}
		};
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			var additionalConfig = {
					"code": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex",iRow);
						}
					},
			}
			
			req_gl_create_datatable(obj, "#table_mat_his_action", additionalConfig, pr_default_new_line, function(){});
			
		}.bind(this);	
		
		var do_lc_set_lst_group = function(obj){
			var allGroup = App.data.group;
			if(!obj.lstGroup || obj.lstGroup.length == 0){
				obj.lstGroup = [];
				for(var key in obj.lstGroupIds){
					var id = obj.lstGroupIds[key];
					obj.lstGroup.push(App.data.group[id]);
				}
			}
		}
		
		var do_lc_add_new_group = function(obj){
			var group = req_gl_data({
				dataZoneDom		: $("#div_frm_tpy_group")
			});
			
			if(group.hasError) {
				return false;
			}
			
			var ref = req_gl_Request_Content_Send( "ServiceTpyCategory", "SVTpyCategoryNew")
			
			var sendableData	= group.req_sendable_data(ref, "obj");
			var fSucces			= [];
			fSucces.push(req_gl_funct(null	, do_lc_show_info					, [obj]));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);		
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], sendableData, 100000, fSucces, fError) ;
		}
		
		var do_lc_show_info = function(sharedJson, obj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {		
				$(".modal").modal("hide");
				do_gl_show_Notify_Msg_Success ($.i18n('msgbox_success_create_title'));
				
				var data 		= sharedJson.res_data;
				data.label = data.name + " " + data.code;
				data.displ = data.code;
				
				var oTable 		= $("#table_mat_group").DataTable();
				if(!obj.lstGroup)	obj.lstGroup = [];
				var lstCurrent 	= oTable.data();
				var value = [];
				$.each(lstCurrent, function(i, tr){
					value.push(tr);
				})
				App.data.group[data.id]	= data;
				value.push(data);
				obj.lstGroup = value;
				self.do_lc_show(obj, pr_mode);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('msgbox_error_create_title') );
			}
		}

	};

	return CtrlEntTabGroup;
});