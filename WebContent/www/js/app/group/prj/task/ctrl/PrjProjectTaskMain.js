define([
	'text!group/prj/task/tmpl/PrjTask_List.html',
	
	'group/prj/task/ctrl/PrjProjectTaskList',
	'group/prj/project/ctrl/PrjProjectEnt',
	
	], function(
			PrjTask_List,
			
			PrjProjectTaskList,
			PrjProjectEnt) {

	var PrjProjectTaskMain     		= function (grpName, header, content, footer) {
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
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName 	= App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_TASK_MAIN			= pr_grpName+"PrjTask_List";
			tmplName.PRJ_TASK_LIST_TAB		= pr_grpName+"PrjTask_List_Tab";
			tmplName.PRJ_TASK_LIST_CONTENT	= pr_grpName+"PrjTask_List_Content";
			
			tmplCtrl	.do_lc_put_tmplRaw(PrjTask_List								, pr_grpName);
			
			//------------------------------------------------------------------------------------------------
			
			/*
			 * [App.router.part.PRJ_PROJECT_ENT]	: {
					grpName		: "PrjProject"								, ctrlName 		: "Ent", 
					ctrlPath    : "group/prj/project/ctrl/PrjProjectEnt"	, ctrlParams 	: ["PrjProject", null, "#div_PrjProject_Ent_Header" 	, null], 
					fInit		: "do_lc_init"								, fInitParams	: [],
					fShow		: "do_lc_show"								, fShowParams	: [],
					fCallBack	: function(){},
					rights		: "view:"
				}
				///--can use
				App.controller.UI.Main.do_lc_load_Ctrl (ctrlJson)
				//---or can use
				do_gl_load_JSController_ByRequireJS(App.controller, ctrlJson);
			 */
			
			if (!App.controller.PrjProject)  				App.controller.PrjProject 		= {};
			if (!App.controller.PrjTask) 					App.controller.PrjTask 			= {};
			
			if (!App.controller.PrjProject.Ent) {
				App.controller.PrjProject.Ent				= new PrjProjectEnt				("PrjProject", null, "#div_PrjProject_Ent_Header" 	, null);
				App.controller.PrjProject.Ent.do_lc_init();
			} 
			
			if (!App.controller.PrjTask.Main)  
				App.controller.PrjTask.Main					= this;
			
			if (!App.controller.PrjTask.List) {
				App.controller.PrjTask.List					= new PrjProjectTaskList		(pr_grpName, null, null, null);
				App.controller.PrjTask.List.do_lc_init();
			} 
		}     

		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath, self.do_lc_show_callback);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};  
		
		this.do_lc_show_callback		= function(){
			try { 
				let params = req_gl_Url_Params();
				const {id, code} = params;
				if(!id || !code) return;
				pr_GROUP       = parseInt(id);
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TASK_MAIN, {}));

				App.controller.PrjTask.List.do_lc_show(pr_GROUP, code);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjProjectTaskMain", "do_lc_show", e.toString()) ;
			}
		};
	};

	return PrjProjectTaskMain;
});