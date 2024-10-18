define([
	'text!group/prj/workflow/tmpl/PrjWorkflow_Main.html', 
	'text!group/prj/workflow/tmpl/PrjWorkflow_List_Tab.html', 
	'text!group/prj/workflow/tmpl/PrjWorkflow_List_Content.html',
	'text!group/prj/workflow/tmpl/PrjWorkflow_Popup_New.html',
	'text!group/prj/workflow/tmpl/PrjWorkflow_Ent.html',
	'text!group/prj/workflow/tmpl/PrjWorkflow_Ent_Tabs.html',
	'text!group/prj/workflow/tmpl/PrjWorkflow_Ent_Tab_History.html',
	
	
	'group/prj/workflow/ctrl/PrjWorkflowList',
	'group/prj/workflow/ctrl/PrjWorkflowEnt',
	
	
	], function(
			PrjWorkflow_Main, 
			PrjWorkflow_List_Tab,
			PrjWorkflow_List_Content,
			PrjWorkflow_Popup_New,
			PrjWorkflow_Ent,
			PrjWorkflow_Ent_Tabs,
			PrjWorkflow_Ent_Tab_History,
			
			PrjWorkflowList,
			PrjWorkflowEnt

			) {

	var PrjWorkflowMain     	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var self 					= this;
		var pr_GROUP				= null;
		var pr_ID					= null;
		var pr_CODE 				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName){
				tmplName = App.template.names[pr_grpName] = {};
			}

			if (!App.controller.PrjWorkflow) App.controller.PrjWorkflow 	= {};
			
			if (!App.controller.PrjWorkflow.Main)  
				App.controller.PrjWorkflow.Main				= this;
			
			if (!App.controller.PrjWorkflow.List)  
				App.controller.PrjWorkflow.List				= new PrjWorkflowList		(pr_grpName, null, null, null);
			
			if (!App.controller.PrjWorkflow.Ent)  
				App.controller.PrjWorkflow.Ent				= new PrjWorkflowEnt			(pr_grpName, null, null, null);
			
			
			App.controller.PrjWorkflow.List					.do_lc_init();
			App.controller.PrjWorkflow.Ent					.do_lc_init();
			
			tmplName.PRJ_WORKFLOW_MAIN								= pr_grpName + "PrjWorkflow_Main";
			tmplName.PRJ_WORKFLOW_LIST_TAB							= pr_grpName + "PrjWorkflow_List_Tab";
			tmplName.PRJ_WORKFLOW_LIST_CONTENT						= pr_grpName + "PrjWorkflow_List_Content";

			tmplName.PRJ_WORKFLOW_TAB_CHARTFLOW_MAIN 				= pr_grpName + "PrjWorkflow_Tab_ChartFlow_Main";
			tmplName.PRJ_WORKFLOW_TAB_CHARTFLOW_CREATE_ELEMENT 		= pr_grpName + "PrjWorkflow_Tab_ChartFlow_Create_Element";
			tmplName.PRJ_WORKFLOW_TAB_CHARTFLOW_DELETE_ELEMENT 		= pr_grpName + "PrjWorkflow_Tab_ChartFlow_Delete_Element";

			tmplName.PRJ_WORKFLOW_POPUP_NEW    						= pr_grpName + "PrjWorkflow_Popup_New";
			tmplName.PRJ_WORKFLOW_ENT								= pr_grpName + "PrjWorkflow_Ent";
			tmplName.PRJ_WORKFLOW_ENT_NEW							= pr_grpName + "PrjWorkflow_Ent_New";

			tmplName.PRJ_WORKFLOW_ENT_CONTENT						= pr_grpName + "PrjWorkflow_Ent_Content";
			tmplName.PRJ_WORKFLOW_ENT_CONTENT_PATH					= pr_grpName + "PrjWorkflow_Ent_Content_Path";

			tmplName.PRJ_WORKFLOW_ENT_TAB_STAT						= pr_grpName + "PrjWorkflow_Ent_Tab_Stat";
			tmplName.PRJ_WORKFLOW_ENT_TAB_MEMBER					= pr_grpName + "PrjWorkflow_Ent_Tab_Member";
			tmplName.PRJ_WORKFLOW_ENT_TAB_HISTORY					= pr_grpName + "PrjWorkflow_Ent_Tab_History";

 			
 			tmplCtrl	.do_lc_put_tmplRaw(PrjWorkflow_Ent_Tabs				, pr_grpName);
 			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_MAIN				, PrjWorkflow_Main); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_LIST_TAB			, PrjWorkflow_List_Tab);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_LIST_CONTENT		, PrjWorkflow_List_Content);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_POPUP_NEW	     	, PrjWorkflow_Popup_New);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_ENT				, PrjWorkflow_Ent);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_ENT_TAB_HISTORY	, PrjWorkflow_Ent_Tab_History);
		}     
		
		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(id, code){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath, self.do_lc_show_callback);
				pr_showed = true;
			}else {
				self.do_lc_show_callback();
			}
		};
		this.do_lc_show_callback		= function(){
			try { 
				let params              = req_gl_Url_Params();
				let {groupId, id, code} = params;

				if(groupId) pr_GROUP 	= parseInt(groupId);
				if(id) 		pr_ID 		= parseInt(id);
				if(code) 	pr_CODE 	= code;
				
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_MAIN, {}));

				App.controller.PrjWorkflow.List.do_lc_show(pr_GROUP, pr_ID, pr_CODE);
				$(document).prop('title',$.i18n('prj_project_sidebar_workflow'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjWorkflowMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return PrjWorkflowMain;
});