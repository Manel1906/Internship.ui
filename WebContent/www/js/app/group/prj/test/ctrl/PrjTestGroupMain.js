define([
	'group/prj/test/ctrl/PrjTestGroupList',
	'group/prj/test/ctrl/PrjTestGroupEnt',
	
	'text!group/prj/test/tmpl/PrjTestGroup_Main.html',
	], function(
			PrjTestGroupList,
			PrjTestGroupEnt,

			PrjTestGroup_Main) {

	var PrjTestGroupMain     		= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var self 					= this;
		var pr_GROUP				= null;
		var pr_ID					= null;
		var pr_CODE 				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.PrjTestGroup) App.controller.PrjTestGroup = {};
			
			if (!App.controller.PrjTestGroup.Main)  
				App.controller.PrjTestGroup.Main				= this;
			
			if (!App.controller.PrjTestGroup.List)  
				App.controller.PrjTestGroup.List				= new PrjTestGroupList		(pr_grpName, null, null, null);
			
			if (!App.controller.PrjTestGroup.Ent)  
				App.controller.PrjTestGroup.Ent					= new PrjTestGroupEnt		(pr_grpName, null, null, null);
			
			
			App.controller.PrjTestGroup.List				.do_lc_init();
			App.controller.PrjTestGroup.Ent					.do_lc_init();

			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_TESTGRP_MAIN						= "PrjTestGroup_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.PRJ_TESTGRP_MAIN, PrjTestGroup_Main); 
		}
		
		const 	pr_grpPath 	= 'group/prj/_transl';
		let 	pr_showed	= false;
		
		this.do_lc_show		= () => {
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath , self.do_lc_show_callback, []);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		
		this.do_lc_show_callback 		= () => {
			try {				
				let params              = req_gl_Url_Params();
				let {groupId, id, code} = params;

				if(groupId) pr_GROUP 	= parseInt(groupId);
				if(id) 		pr_ID 		= parseInt(id);
				if(code) 	pr_CODE 	= code;
				
				$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGRP_MAIN, {}));
				App.controller.PrjTestGroup.List.do_lc_show(pr_GROUP, pr_ID, pr_CODE);

				$(document).prop('title',$.i18n('prj_project_sidebar_test_group'));

			}catch(e) {				
				console.log(e);
			}
			
		};
		
	};

	return PrjTestGroupMain;
});