define([
        'jquery',
        'text!group/nso/group/tmpl/Ent_Tab_Member.html'

        ],
        function($,
        		Tmpl_ENT_TAB_MEM    		
        		) {


	var CtrlEntTab01     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
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
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		
		var pr_default_new_line	= {
				id		: -1,
				uId		: null,
				stat	: null,
				typ		: null,
				dt01	: null,
				dt02	: null
		};
		//-----------------------------------------------------------------------------------
		var pr_obj				= null;
		var pr_mode				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.ENT_TAB_MEM 	= "ENT_TAB_MEM";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_MEM, Tmpl_ENT_TAB_MEM); 	
			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
		}
		
		this.do_lc_show		= function(obj, mode){
			try{
				pr_obj 		= obj;
				pr_mode		= mode;	
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_MEM, obj));
				
				do_show_values_table(obj);
				do_bind_event (obj, mode);
			}catch(e) {	
				console.log(e);
				//do_gl_exception_send(App.path.BASE_URL_API_PRIV, "cfg.", "EntTabValue", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}
		
		//-------------------------------------------------------------------
		var do_show_values_table = function(obj) {
			var additionalConfig = {
					"id":{
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex", iRow);	
						}
					},
					"inf01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							do_gl_set_input_autocomplete(nTd, {
								dataRes 		: ["login01"],  
								dataReq			: {nbLine:10, stat:"1"}, 
								dataService 	: ["ServiceAutUser", "SVLst"], 
								selectCallback	: function(item) {
									oData.uId 	= item.id;
									oData.inf01 = item.login01;
								},
							});
						}
					},
					
					"statLab": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.stat == 0){
								$(nTd).html($.i18n("ent_mem_stat_new"))
							}else if(oData.stat == 1){
								$(nTd).html($.i18n("ent_mem_stat_active"));
							}else if(oData.stat == 5){
								$(nTd).html($.i18n("ent_mem_stat_review"));
							}else {
								$(nTd).html("");
							} 
							
							var lstStat = [
								{"val" : 0, "label" : $.i18n("ent_mem_stat_new")   , "displ" : $.i18n("ent_mem_stat_new")}, 
								{"val" : 1, "label" : $.i18n("ent_mem_stat_active"), "displ" : $.i18n("ent_mem_stat_active")}, 
								{"val" : 5, "label" : $.i18n("ent_mem_stat_review"), "displ" : $.i18n("ent_mem_stat_review")}];
							
							do_gl_set_input_autocomplete(nTd, {
								dataTab 		: {"val": "stat"}, //val => col stat
								source			: lstStat, 
								minLength		: 0,
								selectCallback	: function(item) {
									oData.stat = item.val;
								},
								focusCallback	: function(item) {
									$(nTd).select();
								},
							}, oData);
						},
					},
					
					
					"typLab": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.typ == 0){
								$(nTd).html($.i18n("ent_mem_typ_adm"))
							}else if(oData.typ == 5){
								$(nTd).html($.i18n("ent_mem_typ_agent"));
							} else {
								$(nTd).html("");
							} 
							
							var lstTyp = [
								{"val" : 0, "label" : $.i18n("ent_mem_typ_adm")		, "displ" : $.i18n("ent_mem_typ_adm")}, 
								{"val" : 5, "label" : $.i18n("ent_mem_typ_agent")	, "displ" : $.i18n("ent_mem_typ_agent")}];
							
							do_gl_set_input_autocomplete(nTd, {
								dataTab 	: {"val": "typ"}, //val => col stat
								source		: lstTyp, 
								minLength	: 0,
								selectCallback	: function(item) {
									oData.typ = item.val;
								},
								focusCallback	: function(item) {
									$(nTd).select();
								},
							}, oData);
						}, 
					},
			}
			
			req_gl_datatable ({
				tabData		: obj,
				tabId 		: "#tab_Members",
//				tabConf		: {},
				tabColConf 	: additionalConfig,
				tabScrollX	: false,
				tabScrollY	: true,
				tabLineDef	: pr_default_new_line,
				tabFCallback: do_TabBuilt_callback
			});
			
		}
		
		var do_TabBuilt_callback = function(table) {
			do_gl_disable_edit($(pr_divContent));
			
			if(pr_mode == App['const'].MODE_NEW) {
				do_gl_enable_edit($(pr_divContent));

			} else if(pr_mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
				
//					if(pr_obj.type >= 1){
//					do_gl_enable_edit($(pr_divContent));
//					}
//					if(pr_mode == App['const'].MODE_MOD && pr_obj.type < 2)
//					$(pr_divContent).find("#btn_add").hide();
//					if(pr_obj.type != 3)
//					$("#tab_CfgGroup_Values .a_delete").hide();
			}
		}
	};

	return CtrlEntTab01;
});