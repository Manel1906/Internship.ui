define([
	'text!group/prj/project/tmpl/PrjProject_Ent.html',
	'text!group/prj/project/tmpl/PrjProject_Ent_New.html',
	
	
	'text!group/prj/project/tmpl/PrjProject_Ent_Tabs.html',
	
	'text!group/prj/project/tmpl/PrjProject_Ent_Tab_History.html',
	'text!group/prj/project/tmpl/PrjProject_Ent_Tab_Mem_Manager.html',
	'text!group/prj/project/tmpl/PrjProject_Ent_Tab_Mem_Manager_Content.html',
	'text!group/prj/project/tmpl/PrjProject_Appointment_Show.html',
	'text!group/prj/project/tmpl/PrjProject_Appointment_New.html',
	'text!group/prj/project/tmpl/PrjProject_Appointment.html',

	'group/prj/project/ctrl/PrjProjectEntTab',
	'group/prj/treeview/ctrl/TreeViewEntMsgbox',
	],
	function(	
			PrjProject_Ent,
			PrjProject_Ent_New,
			
			PrjProject_Ent_Tabs,
			
			PrjProject_Ent_Tab_History,
			PrjProject_Ent_Tab_Mem_Manager,
			PrjProject_Ent_Tab_Mem_Manager_Content,
			PrjProject_Appointment_Show,
			PrjProject_Appointment_New,
			PrjProject_Appointment,
			
			{
				PrjProjectEntTabEval, 
				PrjProjectEntTabEpic, 
				PrjProjectEntTabTask, 
				PrjProjectEntTabMember, 
				PrjProjectEntTabMemberGroup,
				PrjProjectEntTabReport,
				PrjProjectEntTabDoc, 
				PrjProjectEntTabComment, 
				PrjProjectEntTabStat,
				PrjProjectEntTabContent,
				PrjProjectEntTabManageMember
			},
			TreeViewEntMsgbox
	){

	var PrjProjectEnt 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS			= "ServicePrjProject"; //to change by your need
		const pr_SV_GET					= "SVGet";
		const pr_SV_NEW_FAVORITE		= "SVNewFavorite";
		const pr_SV_REMOVE_FAVORITE		= "SVRemoveFavorite";

		var self 						= this;
		this.pr_member_role				= null;

		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;

		const pr_ID_TABLE_PRJ			= 250000;
		
		const pr_TYP00_SPRINT          	= 100;
		const pr_TYP00_WORKFLOW         = 200;

		const var_lc_MODE_NEW       	= 1;
		
		var pr_DIV_CONTENT              = "#div_main_content";
		var pr_isViewAllTask            = false;
		var pr_isViewMain               = false;
		var pr_isViewPopup              = false;
		//------------------controllers-----------------------------------
		var pr_project					= App.controller.UI[pr_grpName]= {};
		var pr_ctr_Main 				= null;
		var pr_ctr_Sidebar 				= null;
		var pr_ctr_Fav 					= null;
		
		var pr_scrollToTop 				= false;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName 	= App.template.names[pr_grpName]
			}
			
			pr_ctr_Main 	= App.controller.DBoard.DBoardMain;
			pr_ctr_Sidebar 	= App.controller.UI.Sidebar;
			pr_ctr_Fav		= App.controller.UI.Fav;
			
			
			tmplName.PRJ_PROJECT_ENT							= pr_grpName + "PrjProject_Ent";
			tmplName.PRJ_PROJECT_ENT_NEW						= pr_grpName + "PrjProject_Ent_New";
			
			tmplName.PRJ_PROJECT_ENT_CONTENT					= pr_grpName + "PrjProject_Ent_Content";
			tmplName.PRJ_PROJECT_ENT_CONTENT_PATH				= pr_grpName + "PrjProject_Ent_Content_Path";
			tmplName.PRJ_PROJECT_ENT_CONTENT_CHECK_LIST			= pr_grpName + "PrjProject_Ent_Content_Check_List";
			
			tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_POPUP		= pr_grpName + "PrjProject_Ent_Tab_Budget_Popup";
			tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_HEADER_POPUP= pr_grpName + "PrjProject_Ent_Tab_Budget_Header_Popup";
			tmplName.PRJ_PROJECT_ENT_NEW_BUDGET_POPUP		    = pr_grpName + "PrjProject_Ent_New_Budget_Popup";
			tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET		    	= pr_grpName + "PrjProject_Ent_Table_Budget";
			tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_LINE			= pr_grpName + "PrjProject_Ent_Table_Budget_Line";
			tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_COPY			= pr_grpName + "PrjProject_Ent_Table_Budget-Copy";
			
			tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_PRINT			= pr_grpName + "PrjProject_Ent_Content_Print"	;
			tmplName.PRJ_PROJECT_ENT_TAB_STAT					= pr_grpName + "PrjProject_Ent_Tab_Stat";
			
			tmplName.PRJ_FILES_ENT_POPUP_SEARCH_FILE			= pr_grpName + "Prj_Files_Ent_Popup_Search_File";
			
			tmplName.PRJ_PROJECT_ENT_TAB_EPIC					= pr_grpName + "PrjProject_Ent_Tab_Epic";
			tmplName.PRJ_PROJECT_ENT_TAB_EPIC_LIST				= pr_grpName + "PrjProject_Ent_Tab_Epic_List";
			tmplName.PRJ_PROJECT_ENT_TAB_EPIC_LIST_SHOW_CHILD	= pr_grpName + "PrjProject_Ent_Tab_Epic_List_Show_Child";
			
			tmplName.PRJ_PROJECT_ENT_TAB_TASK					= pr_grpName + "PrjProject_Ent_Tab_Task";
			tmplName.PRJ_PROJECT_ENT_TAB_TASK_LIST				= pr_grpName + "PrjProject_Ent_Tab_Task_List";
			tmplName.PRJ_PROJECT_ENT_TAB_TASK_LIST_ELEMENT		= pr_grpName + "PrjProject_Ent_Tab_Task_List_Element";
			
			tmplName.PRJ_PROJECT_ENT_TAB_MEMBER					= pr_grpName + "PrjProject_Ent_Tab_Member";
			tmplName.PRJ_PROJECT_ENT_TAB_MEMBER_GROUP			= pr_grpName + "PrjProject_Ent_Tab_Member_Group";
			tmplName.PRJ_PROJECT_ENT_TAB_MEMBER_GROUP_POPUP		= pr_grpName + "PrjProject_Ent_Tab_Member_Group_Popup";
			
			tmplName.PRJ_PROJECT_ENT_TAB_COMMENT				= pr_grpName + "PrjProject_Ent_Tab_Comment";
			tmplName.PRJ_PROJECT_ENT_TAB_COMMENT_LIST			= pr_grpName + "PrjProject_Ent_Tab_Comment_List";
			tmplName.PRJ_PROJECT_ENT_TAB_DOCS					= pr_grpName + "PrjProject_Ent_Tab_Docs";
			tmplName.PRJ_PROJECT_ENT_TAB_EVALUATION				= pr_grpName + "PrjProject_Ent_Tab_Evaluation";
			tmplName.PRJ_PROJECT_ENT_TAB_HISTORY				= pr_grpName + "PrjProject_Ent_Tab_History";
			
			tmplName.PRJ_PROJECT_ENT_TAB_REPORT					= pr_grpName + "PrjProject_Ent_Tab_Report"
			tmplName.PRJ_PROJECT_ENT_TAB_REPORT_LIST			= pr_grpName + "PrjProject_Ent_Tab_Report_List";
			tmplName.PRJ_PROJECT_ENT_TAB_REPORT_LIST_ELEMENT	= pr_grpName + "PrjProject_Ent_Tab_Report_List_Element";
			tmplName.PRJ_PROJECT_ENT_TAB_REPORT_CONT			= pr_grpName + "PrjProject_Ent_Tab_Report_Content";
			tmplName.PRJ_PROJECT_ENT_TAB_REPORT_NEW				= pr_grpName + "PrjProject_Ent_Tab_Report_New";
			
			tmplName.PRJ_PROJECT_ENT_TAB_MEM_MANAGER		    = pr_grpName + "PrjProject_Ent_Tab_Mem_Manager";
			tmplName.PRJ_PROJECT_ENT_TAB_MEM_MANAGER_CONTENT	= pr_grpName + "PrjProject_Ent_Tab_Mem_Manager_Content";
			
			tmplName.PRJ_PROJECT_ENT_TAB_MANAGE_MEMBER			= pr_grpName + "PrjProject_Ent_Tab_Manage_Member";
			tmplName.PRJ_APPOINTMENT_SHOW						= pr_grpName + "PrjProject_Appointment_Show";
			tmplName.PRJ_APPOINTMENT_NEW						= pr_grpName + "PrjProject_Appointment_New";
			tmplName.PRJ_PROJECT_ENT_TAB_APPOINMENT				= pr_grpName + "PrjProject_Appointment";
			tmplName.PRJ_PROJECT_ENT_TABLE_MANAGE_MEMBER_LINE	= pr_grpName + "PrjProject_Ent_Table_Manage_Member_Line";
			tmplName.PRJ_PROJECT_ENT_TABLE_MANAGE_MEMBER_ADD	= pr_grpName + "PrjProject_Ent_Table_Manage_Member_Add";
			
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_PROJECT_ENT							, PrjProject_Ent);
			
			tmplCtrl	.do_lc_put_tmplRaw(PrjProject_Ent_New								, pr_grpName);
			
			tmplCtrl	.do_lc_put_tmplRaw(PrjProject_Ent_Tabs								, pr_grpName);
			
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_HISTORY				, PrjProject_Ent_Tab_History);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEM_MANAGER			, PrjProject_Ent_Tab_Mem_Manager);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEM_MANAGER_CONTENT	, PrjProject_Ent_Tab_Mem_Manager_Content);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_SHOW		, 				  PrjProject_Appointment_Show);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_APPOINTMENT_NEW				, 		  PrjProject_Appointment_New);
			tmplCtrl	.do_lc_put_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_APPOINMENT			, 	  PrjProject_Appointment);
			
			
			
			
			do_lc_init_ctrl_module	();			
		}
		
		const do_lc_init_ctrl_module = () => {
			let pr_LST_MODULE = {
					EntEval 		: PrjProjectEntTabEval		, 
					EntEpic 		: PrjProjectEntTabEpic		, 
					EntTask 		: PrjProjectEntTabTask		, 
					EntMember 		: PrjProjectEntTabMember	,  
					EntMemberGroup 	: PrjProjectEntTabMemberGroup, 
					EntReport 		: PrjProjectEntTabReport	,
					EntComment 		: PrjProjectEntTabComment	, 
					EntStat 		: PrjProjectEntTabStat		,
					EntContent 		: PrjProjectEntTabContent	, 
					EntDoc 			: PrjProjectEntTabDoc		,
					EntManageMember	: PrjProjectEntTabManageMember	 
			}

			for(let ctrlName in pr_LST_MODULE){
				if(!pr_project[ctrlName])		pr_project[ctrlName] 		= new pr_LST_MODULE[ctrlName](pr_grpName, null, null, null );
			}
		}
		
		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(id, code, isPopup = false){
			if (!pr_showed){
//				App.router.controller.do_lc_append_custom_tags();
				
				do_gl_lang_append (pr_grpPath, self.do_lc_show_callback, [id, code, isPopup]);
				pr_showed = true;
			}else {
				self.do_lc_show_callback(id, code, isPopup);
			}
		};
		
		this.do_lc_show_callback = function(id, code, isPopup = false){               
			try{
				let 		params 	= req_gl_Url_Params();
				if(!id) 	id 		= params.id;
				if(!code) 	code 	= params.code;
				
				if (id && code){
					if(isPopup){
						pr_DIV_CONTENT		= "#div_task_content_popup";
						pr_isViewAllTask    = true;
						pr_isViewPopup      = isPopup;
						
						App.MsgboxController.do_lc_show({
							title		: $.i18n("prj_project_sidebar_task"),
							content 	: "<div id='div_task_content_popup'></div>",	
							autoclose	: false,
							buttons		: {
								OK: {
									lab			: $.i18n("common_btn_ok"),
									autoclose	: true,
									classBtn	: "btn-primary"
								},
							},
						});	
					}else{
						pr_DIV_CONTENT 	 = "#div_main_content";
						pr_isViewMain    = true;
						pr_isViewAllTask = false;
						pr_isViewPopup	 = false;
					}
					
					do_lc_get_prj(id, code, isPopup);
				}else{
					do_lc_back_to_list();
				}
			}catch(e) {				
				console.log(e); 
				//do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjProjectEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		this.can_lc_role_user_manager = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_manager;
		}
		
		this.can_lc_role_user_reporter = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_reporter;
		}
		
		this.can_lc_role_user_worker = function() {
			return this.pr_member_role && this.pr_member_role == pr_member_lev_worker;
		}
		
		this.can_lc_access = function (uRole) {
			if(uRole === null || uRole === undefined){
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), null);
				return false;
			}
			if(uRole === pr_member_lev_manager) {
				return true;
			} else if(uRole === pr_member_lev_reporter) {
				return true;
			} else if(uRole === pr_member_lev_developer) {
				return true;
			} else if(uRole === pr_member_lev_tester) {
				return true;
			} else if(uRole === pr_member_lev_worker) {
				return true;
			} else if(uRole === pr_member_lev_watcher) {
				return true;
			} else{
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), null);
				return false;
			}
		}

		this.do_lc_reqRole_User = function(){
			if(pr_isViewPopup){
				let uRole = self.pr_member_role;
				if(![pr_member_lev_manager, pr_member_lev_watcher].includes(uRole)) {
					$(".isWatcher").remove();
					$(".info-content").off("click").removeClass("info-content");
					$(".info-edit.isManager", ".info-edit.isWatcher").off("click").removeClass("info-edit");
				} else if(uRole !== pr_member_lev_worker) {
					$(".info-edit.isWorker").off("click").removeClass("info-edit");
				}
				// $(".isManager").remove();
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				
				$("#div_content-left").removeClass("col-xl-8").addClass("col-xl-12");
				$("#div_content-right").hide();
				$("#div_prj_content_header").hide();
			} else {
				$("#div_content-left").removeClass("col-xl-12").addClass("col-xl-8");
				$("#div_content-right").show();
				$("#div_prj_content_header").show();
			} 
			
			let uRole = self.pr_member_role;

			if(uRole === null || uRole === undefined){
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), do_lc_back_to_list);
			}
			if(uRole === pr_member_lev_manager) {
				$(".hideAdm").remove();
				$(".noAdm"	).off("click");

//				$(".item-stat-show").removeAttr('disabled');
			} else if(uRole === pr_member_lev_reporter) {
				$(".hideBA").remove();
				$(".noBA").off("click");
				//$('.td-task').draggable( "destroy" );
				$(".item-stat-show").removeAttr('disabled');
			} else if(uRole === pr_member_lev_developer) {
				$(".hideDev").remove();
				$(".noDev"	).off("click");
				$(".item-stat-show").off("change");
				$("#chart_container").addClass("div_disabled");
			} else if(uRole === pr_member_lev_tester) {
				$(".hideTest").remove();
				$(".noTest"	 ).off("click");
				$(".item-stat-show").off("change");
				$("#chart_container").addClass("div_disabled");
			} else if(uRole === pr_member_lev_worker) {
				$(".hideMem").remove()
				$(".noMem"	).off("click");
				$(".item-stat-show").off("change");
				$(".info-content").off("click").removeClass("info-content");
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				$("#chart_container").addClass("div_disabled");
			} else if(uRole === pr_member_lev_watcher) {
				$(".hideGuest").remove();
				$(".noGuest"  ).off("click");
				$(".item-stat-show").off("change");
				$(".info-content").off("click").removeClass("info-content");
				$(".chat-input-section.comment-element").remove();
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				$("#chart_container").addClass("div_disabled");
			} else{
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), do_lc_back_to_list);
			}
		}
		//--------------------------------------------------------------------------------------------
		const do_lc_get_prj = (id, code, isPopup) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_prj_callback, [isPopup]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_get_prj_callback = function (sharedJson, isPopup){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 					= sharedJson[App['const'].RES_DATA];
				console.log(data);

				let is_Me					= data.members?data.members.find(m => m.entId02 === App.data.user.id):false;
				if(!is_Me) 	data.userRole	= data.userRole[App.data.user.id];
				else 		data.userRole	= is_Me ? is_Me['lev'] : pr_member_lev_watcher;
				
				if(is_Me){
					data.iduIsUse = is_Me.ent02.id
				}
				
				self.pr_member_role 		= data.userRole;
				
				//add logic for init stat for task has workflow
				if(data.wfStat){
					data.isTask			= true
					var wfData			= JSON.parse(data.wfStat)
					var lstStat					= []
					do_loop_get_wf_stats(wfData, lstStat, data.stat, self.pr_member_role)
					if(lstStat.length > 0){
						data.wfStat		= lstStat
					}else{
						lstStat.push(data.stat)
						data.wfStat		= lstStat
					}
				}


				if (!self.can_lc_access(self.pr_member_role )) return;
				
				do_lc_show_prj			(data, isPopup);
				do_lc_show_prj_others	(data, isPopup);

			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), do_lc_back_to_list);
			}
		}
		
		//add function for init stat for task have workflow
		const do_loop_get_wf_stats =   (wfData, lstStat, stat01, role) => {
			if (wfData.hasOwnProperty(stat01)) {
				if(!lstStat.includes(stat01)){
					lstStat.push(stat01)
				}
				if (wfData[stat01].hasOwnProperty(role)){
					for(var stat02 of wfData[stat01][role]){
						if(!lstStat.includes(stat02)){
							lstStat.push(stat02)
						}
					}
				}
			}else {
				if(!lstStat.includes(stat01)){
					lstStat.push(stat01)
				}
			}
		}

		//--------------------------------------------------------------------------------------------
		const do_lc_show_prj = prj => {
			let isFavorite 	= null;
			if(App.data.user && App.data.user['lstFav'] && App.data.user['lstFav'][pr_ID_TABLE_PRJ]) {
				const lstFav 	=  App.data.user['lstFav']
	
				if(lstFav[pr_ID_TABLE_PRJ].ids.includes(prj.id)) isFavorite = true;
			}

			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT, {
				prj,
				isFavorite,
				isViewAllTask 	: pr_isViewAllTask, 
				isViewMain 		: pr_isViewMain
			}));

			pr_project.EntStat		.do_lc_show_prj_stats	(prj, false, true);
			pr_project.EntContent	.do_lc_show_prj_content	(prj, null);
			
			do_lc_bind_event(prj);
		}
		
		const do_lc_bind_event = prj => {
			$("#btn_treeview").off("click").on("click", function() {
				let {id, grp, code} = $(this).data();
				if(id){
					if(!App.controller.PrjTreeView)		App.controller.PrjTreeView 		= {};
					if(!App.controller.PrjTreeView.EntMsgbox){
						App.controller.PrjTreeView.EntMsgbox 	= new TreeViewEntMsgbox();
						App.controller.PrjTreeView.EntMsgbox	.do_lc_init();
					}
					App.controller.PrjTreeView.EntMsgbox		.do_lc_show_with_id(id, grp, code);
				}
			})
			
			$("#btn_all_task").off("click").on("click", function() {
				let {id, grp, code} = $(this).data();
				App.router.controller.do_lc_run("VI_MAIN/prj_project_task_list", `view_prj_project_task_list.html?id=${id}&code=${code}`)
			})
			
			$("#btn_kanban_board").off("click").on("click", function() {
				let {id, grp} = $(this).data();
				id && App.router.controller.do_lc_run("VI_MAIN/prj_task_list", `view_prj_task_list.html?groupId=${id}`)
			})
			
			$("#btn_sprint_board").off("click").on("click", function() {
				let {id, grp, code} = $(this).data();
				App.router.controller.do_lc_run("VI_MAIN/prj_sprint", `view_prj_sprint.html?groupId=${id}&groupCode=${code}`)
			})

			$("#btn_mod_favorite").off("click").on("click", function() {
				const isFav = $(this).hasClass("isFavorite");

				do_lc_mod_favorite(isFav, prj);
			})
		}
		//---------------------------------------------------------------------------------------------------------
		
		const do_lc_show_prj_others = function (prj, isPopup= false){
			if (!isPopup){
				do_lc_get_epic_task_prj													(prj, pr_scrollToTop);
				
				pr_project.EntMemberGroup				.do_lc_get_prj_grpMembers	(prj, pr_scrollToTop);
				pr_project.EntMember					.do_lc_get_prj_members		(prj, pr_scrollToTop);
				
				if (prj.typ02 == 0) {
					pr_project.EntEval					.do_lc_get_prj_evaluation	(prj, pr_scrollToTop);
					pr_project.EntReport				.do_lc_get_prj_report		(prj, pr_scrollToTop);
				};
			}
			
			
			pr_project.EntComment						.do_lc_get_prj_comments		(prj, false, pr_scrollToTop);
			pr_project.EntDoc							.do_lc_get_prj_docs			(prj, pr_scrollToTop);
			if (prj.typ02 == 2) {
			pr_project.EntManageMember					.do_lc_get_calendar	(prj);
			}
		}

		//--------------------------------------------------------------------------------------------
		//start drag drop epic, task
		this.do_lc_show_epic_task = function (prj, pr_scrollToTop) {
			do_lc_get_epic_task_prj(prj, pr_scrollToTop);
		}
		const do_lc_get_epic_task_prj  = function (prj, pr_scrollToTop) {
			pr_project.EntEpic		.do_lc_get_prj_epic(prj, pr_scrollToTop);
			pr_project.EntTask		.do_lc_get_prj_task(prj, pr_scrollToTop);
		}
		//end drag drop epic, task
		
		//start favorite
		const do_lc_mod_favorite = (isFav, prj, isPopup) => {
			if(!isFav) {
				do_lc_send_mod_inList(isFav, pr_ID_TABLE_PRJ, prj)

				return
			}
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("prj_project_favorite_title_delete"),
				content 	: $.i18n("prj_project_favorite_title_delete_content"),
				autoclose	: false,
				buttons 	: {
					UPDATE : {
						lab 		: $.i18n("common_btn_send"),
						funct 		: do_lc_send_mod_inList,
						param 		: [isFav, pr_ID_TABLE_PRJ, prj, isPopup],
						classBtn	: "btn-primary",
						autoclose	: true
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_cancel"),
					}
				}
			});
		}

		const do_lc_send_mod_inList = (isFav, parTyp, prj, isPopup) => {
			if(isFav) pr_ctr_Fav.do_lc_remove_myFavorites(prj, parTyp)
			else pr_ctr_Fav.do_lc_push_myFavorites(prj, parTyp)

			do_lc_show_prj			(prj, isPopup);
			do_lc_show_prj_others	(prj, isPopup);

			pr_ctr_Sidebar.do_lc_show_favorite()
		}
		//end favorite
		
		//--------------------------------------------------------------------------------------------
		const do_lc_back_to_list = () => {
//			App.router.controller.do_lc_run("VI_MAIN/prj_project_list", `view_prj_project_list.html`)
			return;
		}
	};

	return PrjProjectEnt;
});