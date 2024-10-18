define([
	'group/prj/sprint/ctrl/PrjSprintEntTab',
	],
	function(	
			{
				PrjSprintEntTabEval,  
				PrjSprintEntTabTask, 
				PrjSprintEntTabReport, 
				PrjSprintEntTabMember, 
				PrjSprintEntTabMemberGroup, 
				PrjSprintEntTabDoc, 
				PrjSprintEntTabComment,  
				PrjSprintEntTabContent,
				PrjSprintEntTabStat
			}
	){

	var PrjSprintEnt 	= function (grpName, header, content, footer) {
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
		
		var pr_DIV_CONTENT               = "#div_main_content";
		var pr_isViewAllTask             = false;
		var pr_isViewSprint              = false;
		var pr_isViewMain                = false;
		var pr_isViewPopup               = false;
		//------------------controllers-----------------------------------
		var pr_project					= App.controller.UI[pr_grpName]= {};
		var pr_ctr_Main 				= null;
		var pr_ctr_Sidebar 				= null;
		var pr_ctr_Fav 					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 	= App.controller.DBoard.DBoardMain;
			pr_ctr_Sidebar 	= App.controller.UI.Sidebar;
			pr_ctr_Fav		= App.controller.UI.Fav;
			
			do_lc_init_ctrl_module	();			
		}
		
		const do_lc_init_ctrl_module = () => {
			let pr_LST_MODULE = {
					EntEval 		: PrjSprintEntTabEval		, 
					EntTask 		: PrjSprintEntTabTask		, 
					EntMember 		: PrjSprintEntTabMember	,  
					EntMemberGroup 	: PrjSprintEntTabMemberGroup, 
					EntReport 		: PrjSprintEntTabReport	,
					EntComment 		: PrjSprintEntTabComment	, 
					EntContent 		: PrjSprintEntTabContent	, 
					EntDoc 			: PrjSprintEntTabDoc		,
					EntStat			: PrjSprintEntTabStat
			}
			
			for(let ctrlName in pr_LST_MODULE){
				if(!pr_project[ctrlName])		pr_project[ctrlName] 		= new pr_LST_MODULE[ctrlName](pr_grpName, null, null, null );
			}
		}
		
		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(id, code, divContent, typ00, isPopup = false){
			try{
				typ00 				= pr_TYP00_SPRINT;
				
				let 		params 	= req_gl_Url_Params();
				if(!id) 	id 		= params.id;
				if(!code) 	code 	= params.code;
				
				if (id && code){
					if(divContent){
						pr_DIV_CONTENT = divContent;
						pr_isViewMain  = false;
						if(!isPopup){
							pr_isViewSprint  	= true;
							pr_isViewWorkflow  	= false;
							pr_isViewAllTask 	= false;
							
						} else {
							pr_isViewAllTask    = true;
							pr_isViewSprint	 	= false;
							pr_isViewPopup      = isPopup;
						}
					}else{
						pr_DIV_CONTENT 	 = "#div_main_content"
						pr_isViewMain    = true;
						pr_isViewAllTask = false;
						pr_isViewSprint	 = false;
						pr_isViewPopup	 = false;
					}
					do_lc_get_prj(id, code);
				}else{
					do_lc_back_to_list();
				}
			}catch(e) {				
				console.log(e); 
				//do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjSprintEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		this.can_lc_role_user_manager = function() {
			if(this.pr_member_role == pr_member_lev_manager){
				return true
			}return false
		}
		
		this.can_lc_role_user_reporter = function() {
			if(this.pr_member_role == pr_member_lev_reporter){
				return true
			}return false
		}
		
		this.can_lc_role_user_worker = function() {
			if(this.pr_member_role == pr_member_lev_worker){
				return true
			}return false
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
				$(".hideAdm").remove()

				$(".item-stat-show").removeAttr('disabled');
			} else if(uRole === pr_member_lev_reporter) {
				$(".hideBA").remove()

				$('.td-task').draggable( "destroy" );
				$(".item-stat-show").removeAttr('disabled');
			} else if(uRole === pr_member_lev_developer) {
				$(".hideDev").remove()

				$(".item-stat-show").off("change")
				$(".info-content").off("click").removeClass("info-content");
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				$("#chart_container").addClass("div_disabled")
			} else if(uRole === pr_member_lev_tester) {
				$(".hideTest").remove()

				$(".item-stat-show").off("change")
				$(".info-content").off("click").removeClass("info-content");
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				$("#chart_container").addClass("div_disabled")
			} else if(uRole === pr_member_lev_worker) {
				$(".hideMem").remove()

				$(".item-stat-show").off("change")
				$(".info-content").off("click").removeClass("info-content");
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				$("#chart_container").addClass("div_disabled")
			} else if(uRole === pr_member_lev_watcher) {
				$(".hideGuest").remove()

				$(".item-stat-show").off("change")
				$(".info-content").off("click").removeClass("info-content");
				$(".chat-input-section.comment-element").remove()
				if($('.td-task').hasClass("ui-draggable")) $('.td-task').draggable( "destroy" );
				$("#chart_container").addClass("div_disabled")
			} else{
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), do_lc_back_to_list);
			}
		}
		//--------------------------------------------------------------------------------------------
		const do_lc_get_prj = (id, code) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_prj_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_get_prj_callback = sharedJson => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 					= sharedJson[App['const'].RES_DATA];
				
				let is_Me					= data.members?data.members.find(m => m.entId02 === App.data.user.id):false;
				if(!is_Me) 	data.userRole	= data.userRole[App.data.user.id];
				else 		data.userRole	= is_Me ? is_Me['lev'] : pr_member_lev_watcher;

				
				self.pr_member_role 		= data.userRole;

				if (!self.can_lc_access(self.pr_member_role )) return;
				
				//add params for file visible
				if(is_Me){
					data.iduIsUse				= is_Me.ent02.id
				}
				do_lc_show_prj			(data);
				do_lc_show_prj_others	(data);

			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), pr_isViewSprint ? null : do_lc_back_to_list);
			}
		}

		//--------------------------------------------------------------------------------------------
		const do_lc_show_prj = prj => {
			let isFavorite 	= null;
			prj.prjPar		= prj.prjMain;
			
			if(App.data.user && App.data.user['lstFav'] && App.data.user['lstFav'][pr_ID_TABLE_PRJ]) {
				const lstFav 	=  App.data.user['lstFav']
	
				if(lstFav[pr_ID_TABLE_PRJ].ids.includes(prj.id)) isFavorite = true;
			}

			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_ENT, {
				prj,
				isFavorite,
				isViewAllTask 	: pr_isViewAllTask, 
				isViewSprint 	: pr_isViewSprint, 
				isViewMain 		: pr_isViewMain
			}));

			pr_project.EntStat		.do_lc_req_lstStatDef	(prj); //--stat by def
			pr_project.EntContent	.do_lc_show_prj_content	(prj, null, pr_isViewSprint);
			
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
		
		const do_lc_show_prj_others = prj => {
			var scrollToTop = true;

			pr_project.EntComment						.do_lc_get_comments			(prj, false, scrollToTop);
			pr_project.EntDoc							.do_lc_show_prj_docs		(prj, scrollToTop);

			if(pr_isViewPopup) return;
			
			do_lc_show_epic_task_prj(prj, scrollToTop);
			
			pr_project.EntEval							.do_lc_get_prj_evaluation	(prj, pr_isViewSprint, scrollToTop);
			pr_project.EntMember						.do_lc_get_members			(prj, scrollToTop);
			pr_project.EntMemberGroup					.do_lc_get_grpMembers		(prj, scrollToTop);
			pr_project.EntComment						.do_lc_get_comments			(prj, false, scrollToTop);

			prj.typ02 == 0 && pr_project.EntReport		.do_lc_show_prj_report		(prj, false, scrollToTop);
		}

		//--------------------------------------------------------------------------------------------
		//start drag drop epic, task
		this.do_lc_show_epic_task = function (prj, scrollToTop) {
			do_lc_show_epic_task_prj(prj, scrollToTop);
		}
		const do_lc_show_epic_task_prj  = function (prj, scrollToTop) {
			pr_project.EntTask			.do_lc_show_prj_task(prj, pr_isViewSprint, scrollToTop);
		}
		//end drag drop epic, task
		
		//start favorite
		const do_lc_mod_favorite = (isFav, prj) => {
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
						param 		: [isFav, pr_ID_TABLE_PRJ, prj],
						classBtn	: "btn-primary",
						autoclose	: true
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_cancel"),
					}
				}
			});
		}

		const do_lc_send_mod_inList = (isFav, parTyp, prj) => {
			if(isFav) pr_ctr_Fav.do_lc_remove_myFavorites(prj, parTyp)
			else pr_ctr_Fav.do_lc_push_myFavorites(prj, parTyp)

			do_lc_show_prj(prj);
			do_lc_show_prj_others(prj);

			pr_ctr_Sidebar.do_lc_show_favorite()
		}
		//end favorite
		
		//--------------------------------------------------------------------------------------------
		const do_lc_back_to_list = () => {
//			App.router.controller.do_lc_run("VI_MAIN/prj_project_list", `view_prj_project_list.html`)
			return;
		}
	};

	return PrjSprintEnt;
});