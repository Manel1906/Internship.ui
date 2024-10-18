define([
	'group/prj/sprint/ctrl/PrjSprintList',
	'group/prj/sprint/ctrl/PrjSprintEnt',
	
	'text!group/prj/sprint/tmpl/PrjSprint_Main.html', 
	'text!group/prj/sprint/tmpl/PrjSprint_List_Tab.html', 
	'text!group/prj/sprint/tmpl/PrjSprint_List_Content.html',
	'text!group/prj/sprint/tmpl/PrjSprint_Popup_New.html',
	'text!group/prj/sprint/tmpl/PrjSprint_Popup_Multiple_Task.html',
	'text!group/prj/sprint/tmpl/PrjSprint_Ent.html',
	'text!group/prj/sprint/tmpl/PrjSprint_Ent_Tabs.html',
	'text!group/prj/sprint/tmpl/PrjSprint_Ent_Tab_History.html',
	'text!group/prj/sprint/tmpl/PrjSprint_Prj_Filter.html',
	], function(
			PrjSprintList,
			PrjSprintEnt,

			PrjSprint_Main,
			PrjSprint_List_Tab,
			PrjSprint_List_Content,
			PrjSprint_Popup_New,
			PrjSprint_Popup_Multiple_Task,
			
			PrjSprint_Ent,
			PrjSprint_Ent_Tabs,
			PrjSprint_Ent_Tab_History,
			PrjSprint_Prj_Filter) {

	var PrjSprintEntMain     	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var self 					= this;
		var pr_GROUP_ID				= null;
		var pr_ID					= null;
		var pr_CODE 				= null;
		var pr_GROUP_CODE 			= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName){
				tmplName = App.template.names[pr_grpName] = {};
			}
			
			
			tmplName.PRJ_SPRINT_MAIN						= pr_grpName + "PrjSprint_Main";
			tmplName.PRJ_SPRINT_LIST_TAB					= pr_grpName + "PrjSprint_List_Tab";
			tmplName.PRJ_SPRINT_LIST_CONTENT				= pr_grpName + "PrjSprint_List_Content";
			tmplName.PRJ_SPRINT_POPUP_NEW    				= pr_grpName + "PrjSprint_Popup_New";
			tmplName.PRJ_SPRINT_PRJ_FILTER					= pr_grpName + "PrjSprint_Prj_Filter"
			
			tmplName.PRJ_SPRINT_ENT							= pr_grpName + "PrjSprint_Ent";
			
			tmplName.PRJ_SPRINT_ENT_CONTENT					= pr_grpName + "PrjSprint_Ent_Content";
			tmplName.PRJ_SPRINT_ENT_CONTENT_PATH			= pr_grpName + "PrjSprint_Ent_Content_Path";
			tmplName.PRJ_SPRINT_ENT_CONTENT_CHECK_LIST		= pr_grpName + "PrjSprint_Ent_Content_Check_List";
			
			tmplName.PRJ_SPRINT_ENT_TAB_TASK					= pr_grpName + "PrjSprint_Ent_Tab_Task";
			tmplName.PRJ_SPRINT_ENT_TAB_TASK_LIST				= pr_grpName + "PrjSprint_Ent_Tab_Task_List";
			tmplName.PRJ_SPRINT_ENT_TAB_TASK_LIST_ELEMENT		= pr_grpName + "PrjSprint_Ent_Tab_Task_List_Element";
			
			tmplName.PRJ_SPRINT_ENT_TAB_MEMBER					= pr_grpName + "PrjSprint_Ent_Tab_Member";
			tmplName.PRJ_SPRINT_ENT_TAB_MEMBER_GROUP			= pr_grpName + "PrjSprint_Ent_Tab_Member_Group";
			tmplName.PRJ_SPRINT_ENT_TAB_MEMBER_GROUP_POPUP		= pr_grpName + "PrjSprint_Ent_Tab_Member_Group_Popup";
			
			tmplName.PRJ_SPRINT_ENT_TAB_COMMENT					= pr_grpName + "PrjSprint_Ent_Tab_Comment";
			tmplName.PRJ_SPRINT_ENT_TAB_COMMENT_LIST			= pr_grpName + "PrjSprint_Ent_Tab_Comment_List";
			tmplName.PRJ_SPRINT_ENT_TAB_DOCS					= pr_grpName + "PrjSprint_Ent_Tab_Docs";
			tmplName.PRJ_SPRINT_ENT_TAB_EVALUATION				= pr_grpName + "PrjSprint_Ent_Tab_Evaluation";
			
			tmplName.PRJ_SPRINT_ENT_TAB_HISTORY					= pr_grpName + "PrjSprint_Ent_Tab_History";
			
			tmplName.PRJ_SPRINT_ENT_TAB_REPORT					= pr_grpName + "PrjSprint_Ent_Tab_Report"
			tmplName.PRJ_SPRINT_ENT_TAB_REPORT_LIST				= pr_grpName + "PrjSprint_Ent_Tab_Report_List";
			tmplName.PRJ_SPRINT_ENT_TAB_REPORT_LIST_ELEMENT		= pr_grpName + "PrjSprint_Ent_Tab_Report_List_Element";
			tmplName.PRJ_SPRINT_ENT_TAB_REPORT_CONT				= pr_grpName + "PrjSprint_Ent_Tab_Report_Content";
			tmplName.PRJ_SPRINT_ENT_TAB_REPORT_NEW				= pr_grpName + "PrjSprint_Ent_Tab_Report_New";
			
			tmplName.PRJ_SPRINT_ENT_WORKFLOW_VIEW				= pr_grpName + "PrjSprint_Ent_Workflow_View";
			tmplName.PRJ_WORKFLOW_POPUP_PICK_USER				= pr_grpName + "PrjWorkflow_Popup_Pick_User";

			tmplName.PRJ_SPRINT_POPUP_MULTIPLE_TASK				= pr_grpName + "PrjSprint_Popup_Multiple_Task";
			tmplName.PRJ_SPRINT_POPUP_MULTIPLE_TASK_BODY		= pr_grpName + "PrjSprint_Popup_Multiple_Task_Body";
			tmplName.PRJ_SPRINT_POPUP_MULTIPLE_TASK_BODY_NOTHING= pr_grpName + "PrjSprint_Popup_Multiple_Task_Body_Nothing";
			
			
			
			tmplCtrl	.do_lc_put_tmplRaw(PrjSprint_Ent_Tabs								, pr_grpName);
			tmplCtrl	.do_lc_put_tmplRaw(PrjSprint_Popup_Multiple_Task					, pr_grpName);
			
			
			
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_MAIN			, PrjSprint_Main); 
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_LIST_TAB		, PrjSprint_List_Tab);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_LIST_CONTENT	, PrjSprint_List_Content);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_POPUP_NEW	    , PrjSprint_Popup_New);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_ENT				, PrjSprint_Ent);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_ENT_TAB_HISTORY	, PrjSprint_Ent_Tab_History);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_SPRINT_PRJ_FILTER		, PrjSprint_Prj_Filter);

			
			if (!App.controller.PrjSprint) 	App.controller.PrjSprint 	= {};
			
			if (!App.controller.PrjSprint.Main)  
				App.controller.PrjSprint.Main				= this;
			
			if (!App.controller.PrjSprint.List)  
				App.controller.PrjSprint.List				= new PrjSprintList		(grpName, null, null, null);
			
			if (!App.controller.PrjSprint.Ent)  
				App.controller.PrjSprint.Ent				= new PrjSprintEnt		(grpName, null, null, null);
			
			App.controller.PrjSprint.List					.do_lc_init();
			App.controller.PrjSprint.Ent					.do_lc_init();
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
		this.do_lc_show_callback				    = function(){
			try { 
				let params              			= req_gl_Url_Params();
				let {groupId, groupCode, id, code} 	= params;

				if(groupId	) 	pr_GROUP_ID 		= parseInt(groupId);
				if(groupCode) 	pr_GROUP_CODE 		= groupCode;
				if(id		) 	pr_ID 				= parseInt(id);
				if(code		) 	pr_CODE 			= code;
				
				
				$("#div_main_content")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_MAIN, {}));

				App.controller.PrjSprint.List.do_lc_show(pr_GROUP_ID, pr_GROUP_CODE, pr_ID, pr_CODE);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjSprintEntMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return PrjSprintEntMain;
});