define([
	'text!group/prj/test/tmpl/PrjTestUnit_Ent.html',

	'group/prj/test/ctrl/PrjTestUnitEntTab'
	],
	function(	
			PrjTestUnit_Ent,
			{				
				PrjTestUnitEntTabMember, 				
				PrjTestUnitEntTabDoc, 
				PrjTestUnitEntTabComment, 			
				PrjTestUnitEntTabContent,
			}
			
	){

	var PrjTestUnitEnt 	= function (grpName, header, content, footer) {
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
		
		const pr_SERVICE_CLASS_FAV		= "ServiceTpyFavorite";
		const pr_SV_NEW_FAVORITE		= "SVNsoNew";
		const pr_SV_REMOVE_FAVORITE		= "SVNsoMod";

		var self 						= this;
		this.pr_member_role				= null;

		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;

		const pr_ID_TABLE_PRJ			= 250000;
		
		const pr_TYP00_SPRINT          	= 10;
		
		const pr_TYP_FAV_UNLIKE         = 0;
		const pr_TYP_FAV_LIKE          	= 1;
		
		var pr_DIV_CONTENT               = "#div_main_content";
		var pr_isViewAllTask             = false;
		var pr_isViewSprint              = false;
		var pr_isViewMain                = false;
		var pr_isViewPopup               = false;
		//------------------controllers---------------
		//------------------controllers------------------------------------------------------
		const pr_project				= App.controller.PrjTestUnit;
		var pr_ctr_Main 				= null;
		var pr_ctr_Sidebar 				= null;
		var pr_ctr_Fav 					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 				= App.controller.DBoard.DBoardMain;
			pr_ctr_Sidebar 				= App.controller.UI.Sidebar;
			pr_ctr_Fav					= App.controller.UI.Fav;

			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			
			tmplName.PRJ_TESTUNIT_ENT	= pr_grpName + "PrjTestUnit_Ent";
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTUNIT_ENT, PrjTestUnit_Ent);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(id, code, divContent, typ00, isPopup = false){               
			try{
				let params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if(!id) id = params.id;
				if (id){
					pr_DIV_CONTENT = divContent;
					do_lc_get_prj(id, code);
				}else{
					App.router.controller.do_lc_run("VI_MAIN/prj_project_list", `view_prj_project_list.html`)
//					pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_TESTUNIT_LIST);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjTestUnitEnt", "do_lc_show", e.toString()) ;
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

		const do_lc_get_prj = function (id, code) {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getPrj_response, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_getPrj_response = function(sharedJson)  {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 				= sharedJson[App['const'].RES_DATA];
				data.userRole			= data.userRole [App.data.user.id];
				self.pr_member_role 	= data.userRole;

				do_lc_init_ctrl_module	();
				do_lc_show_prj			(data);
				do_lc_get_element_ofPrj	(data);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), do_lc_back_to_list);
			}
		}

		const do_lc_init_ctrl_module = function() {
			let pr_LST_MODULE = {
					EntMember 	: PrjTestUnitEntTabMember	,  
					EntComment 	: PrjTestUnitEntTabComment	, 
					EntContent 	: PrjTestUnitEntTabContent	, 
					EntDoc 		: PrjTestUnitEntTabDoc
			}

			for(let ctrlName in pr_LST_MODULE){
				if(!pr_project[ctrlName])		pr_project[ctrlName] 		= new pr_LST_MODULE[ctrlName](null, null, null);
			}
		}

		const do_lc_show_prj = function(prj) {
			let isFavorite 	= null;
			if(App.data.user && App.data.user['lstFav'] && App.data.user['lstFav'][pr_ID_TABLE_PRJ]) {
				const lstFav 	=  App.data.user['lstFav']
	
				if(lstFav[pr_ID_TABLE_PRJ].ids.includes(prj.id)) isFavorite = true;
			}

			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTUNIT_ENT, {prj, isFavorite}));

			pr_project.EntContent	.do_lc_show_prj_content(prj, null);
			do_lc_bind_event(prj);
			if(pr_isViewPopup) return;
		}
		
		const do_lc_get_element_ofPrj = prj => {
			if(pr_isViewPopup) return;
			pr_project.EntMember		.do_lc_get_list_member(prj);
			pr_project.EntComment		.do_lc_get_list_comments(prj);
		}

		const do_lc_bind_event = prj => {	
			$("#btn_mod_favorite").off("click").on("click", function() {
				const isFav = $(this).hasClass("isFavorite");

				do_lc_mod_favorite(isFav, prj);
			})
		}
		
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
			if(isFav) 	pr_ctr_Fav.do_lc_remove_myFavorites	(prj, parTyp)
			else 		pr_ctr_Fav.do_lc_push_myFavorites	(prj, parTyp)

			do_lc_show_prj(prj);
			do_lc_get_element_ofPrj(prj);

			pr_ctr_Sidebar.do_lc_show_favorite()
		}
		
		const do_lc_back_to_list = () => {
//			if(pr_isViewSprint){
//				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_sprint.html`, "VI_MAIN/"+ App.router.part.PRJ_SPRINT);
//				return;
//			}
//			pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_testUnit_list.html`, "VI_MAIN/"+ App.router.part.PRJ_TESTUNIT_LIST);
		}
	};

	return PrjTestUnitEnt;
});