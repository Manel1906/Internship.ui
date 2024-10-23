define([
	'prjImageViewer/viewer',
	'group/prj/treeview/ctrl/TreeViewEntMsgbox',
	'group/prj/user_appointment/ctrl/PrjAppointmentList',
	],
	function(
		Viewer,
		TreeViewEntMsgbox,
		PrjAppointmentList
	){

	const pr_ENTITY_TYPE			= 20000;
	const pr_SERVICE_CLASS			= "ServicePrjProject"; //to change by your need
	const pr_SV_GET_LST        		= "SVLst";
	const pr_SV_GET					= "SVGet"; 
	const pr_SV_NEW					= "SVNew"; 
	const pr_SV_DEL					= "SVDel";

	const pr_SV_GET_REPORT			= "SVReportGet"; 
	const pr_SV_SAVE_REPORT			= "SVReportSave"; 
	const pr_SV_DEL_REPORT			= "SVReportDel";
	
	const pr_SV_SAVE_CONTENT		= "SVSaveContent";
	const pr_SV_SAVE_FILES			= "SVFileSave"; 
	const pr_SV_ADD_FILES			= "SVFileAdd"; 
	const pr_SV_DEL_FILES			= "SVFileDel"; 
	
	const pr_SV_REFRESH_EPIC		= "SVEpicRefresh";
	const pr_SV_REFRESH_TASK		= "SVTaskRefresh";
	const pr_SV_REFRESH_CONTENT		= "SVContentRefresh";
	const pr_SV_REFRESH_TASK_SPRINT = "SVSprintRefresh";

	
	
	const pr_SV_MOVE_TASK		= "SVEpicAddTask";

	const pr_SERVICE_USER_CLASS	= "ServiceAutUser";
	const pr_SV_USER_SEARCH		= "SVLst";
	const pr_SV_USER_BY_RELATION= "SVLstByRelation";

	const pr_SERVICE_GROUP_CLASS= "ServiceNsoGroup";
	const pr_SV_GROUP_SEARCH	= "SVLst";
	const pr_SV_MANAGE_MEMBER_SCHEDULE	= "SVAppointmentSave";
	const pr_SERVICE_PRJ_CLASS	= "ServicePrjProject";
	const pr_SERVICE_EVAL_CLASS	= "ServicePrjProjectEval";
	const pr_SV_EVAL_GET_BUDGET	= "SVPrjValReal";
	const pr_SV_EVAL_GET_PERCENT= "SVPrjValPercent";
	const pr_SV_EVALUATION		= "SVGetEvaluation";
	const pr_SV_TREE_VIEW		= "SVPrjTreeView";
	const pr_SV_SAVE_MOVE		= "SVTaskMove";
	
	const pr_SERVICE_DYN_CLASS		= "ServicePrjProjectDyn";
//	const pr_SV_GET_HISTORY_TASK	= "SVLstHistoryTask";
	
	const pr_SV_GET_HISTORY_TASK	= "SVGetHistoryTask";
	
	const pr_SV_CALCUL_PERCENT_SPRINT  =  "SVCalculPercentSprint";

	//------------------const object------------------------------------------------------

	const pr_TYPE02_PRJ				= 0;
	const pr_TYPE02_EPIC			= 1;
	const pr_TYPE02_TASK			= 2;

	const pr_STAT_PRJ_NEW 			= 100100;
	const pr_STAT_PRJ_TODO 			= 100200;
	const pr_STAT_PRJ_INPROGRESS 	= 100300;
	const pr_STAT_PRJ_DONE 			= 100400;
	const pr_STAT_PRJ_TEST 			= 100500;
	const pr_STAT_PRJ_REVIEW 		= 100600;
	const pr_STAT_PRJ_DEPLOY 		= 100700;
	const pr_STAT_PRJ_UNRESOLVED 	= 100800;
	const pr_STAT_PRJ_CLOSED 		= 100900;
	const pr_POST_KEY_ENTER 		= 13 ; 
	var paramStat					= null;
	var pr_members					= null;
	var pr_epics					= null;

	const pr_ctr_Main 				= App.controller.DBoard.DBoardMain;

	var do_lc_bindEvent_resize = function(div){
		$(".btn-resize").off("click").on("click", function(){
			do_resize(this);
		})
		
		if ($(window).width() < 800){
			if (div) do_resize($(div).find(".btn-resize"));
		}
	}
	
	var do_resize = function (ele){
		if (ele.length==0) return;
		let $this 		= $(ele);
		let {divtoogle} = $this.data();
		let child 		= $this.find("i");
		let label 		= $this.find(".label-resize");
		child			.toggleClass("mdi-window-minimize mdi-window-maximize")
		$(divtoogle)	.toggle("hide");

		label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
	}

	var do_scrollToTop = function (){
		if(window.scrollY<50) return;
		window.scrollTo(0, 0);
	}
	
	//-------------------------------------------------------------------------------------------------------------------------------
	const PrjProjectEntTabEval 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------

		//------------------------------------------------------------------------------------
		var self 					= this;
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_get_prj_evaluation = function(prj){
			if(prj.typ02 === pr_TYPE02_TASK)	return;

			do_lc_get_list_child(prj);
		}
		
		const do_lc_get_list_child = (prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_TREE_VIEW, {id: prj.id, code: prj.code01, forced: true});

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_getChild, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_getChild = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				do_lc_transform_data(data);
			}
		}
		
		const do_lc_transform_data = (prj) => {
			let lstEval = {
					lstLate			: [], 
					lstFinish 		: [], 
					listWanrning	: [], 
					lstClosed		: [], 
					lstUnreSolved	: [], 
					lstDeploy			: [], 
					lstInprogress	: [],
					lstReview		: [],
					lstAll			: []
			}
			do_lc_get_data_evaluation	(prj.epics, lstEval);
			do_lc_show_evaluation		(lstEval);
		}
		
		const statCheck = [pr_STAT_PRJ_TODO, pr_STAT_PRJ_INPROGRESS, pr_STAT_PRJ_REVIEW];
		const do_lc_get_data_evaluation = (childs, lstEval) => {
			for(var child of childs ) {
				if(child.typ02 !== 2) {
					if (child.epics && child.epics.length ) 
							do_lc_get_data_evaluation (child.epics, lstEval );
					continue;
				} 
					
																lstEval.lstAll			.push(child);
				if (child.stat == pr_STAT_PRJ_DONE) 			lstEval.lstFinish		.push(child);
		        if (child.stat == pr_STAT_PRJ_CLOSED) 			lstEval.lstClosed		.push(child);
		        if (child.stat == pr_STAT_PRJ_INPROGRESS) 		lstEval.lstInprogress	.push(child);
		        if (child.stat == pr_STAT_PRJ_REVIEW) 			lstEval.lstReview		.push(child);
		        if (child.stat == pr_STAT_PRJ_DEPLOY) 			lstEval.lstDeploy		.push(child);
		        if (child.stat == pr_STAT_PRJ_UNRESOLVED) 		lstEval.lstUnreSolved	.push(child);

		        if (statCheck.includes(child.stat)) {
		            let diffDays = req_gl_DayDiff(child.dtEnd);
		            if (diffDays < 0) {
		                lstEval.lstLate.push(child);
		            } else if (diffDays <= 10) {
		                lstEval.listWanrning.push(child);
		            }
		        }
			}
			pr_epics = lstEval.lstAll;
		  
		};

		var do_lc_show_evaluation = function(lstEval){
			let dataEval = {
					totalTask		: 	lstEval.lstAll			.length, 
					totalClose 		:	lstEval.lstClosed		.length, 
					totalFinish		: 	lstEval.lstFinish		.length, 
					totalLate		: 	lstEval.lstLate			.length,
					totalInprogress : 	lstEval.lstInprogress	.length,
					totalReview 	: 	lstEval.lstReview		.length,
					totalWarning	: 	lstEval.listWanrning	.length,
					totalUnreSolved	: 	lstEval.lstUnreSolved	.length,		
			}
			$("#div_prj_evaluation")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_EVALUATION	, dataEval));
			do_lc_bindEvent_resize("#div_prj_evaluation"); 
			
		}

	};

	//------------------------------Start Epic list-----------------------------------
	const PrjProjectEntTabEpic 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var members 				= {};
		const groups 				= {};
		
		const pr_ctr_Ent			= App.controller.PrjProject.Ent;
		const pr_member_lev_manager = 0;
		const pr_member_typ_high	= 1;
		
		var	  pr_prj				= null;
		//------------------------------Start Epic list-----------------------------------
		this.do_lc_get_prj_epic = function(prj, scrollToTop){
			pr_prj = prj;
			
			do_lc_load_view(prj);
			do_lc_show_epic(prj, scrollToTop);
		}
		
		const do_lc_load_view = function(prj){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};

			$("#div_prj_epic")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_EPIC, {}));
			
			do_lc_bindEvent_header_epic(prj);
			do_lc_bindEvent_resize("#div_prj_epic");
		}

		const do_lc_transform_descr02 = data => {
			if(!data.descr02)	return;
			const list = Object.values(data.descr02).reduce((curr, item) => {
				(item && item.trim().length) && curr.push({item}); return curr;
			}, [])

			data.descr02 = JSON.stringify(list);
		}

		const do_lc_bindEvent_header_epic = prj => {
			const $spanTextFilterEpic = $("#sp_text_filter_epic");

			$("#btn_add_epic, #btn_add_epic_others").off("click").on("click", function(){
				var obj = {files: []}
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_epic_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_NEW, {epics : prj.epicInf, epicSelected: prj.id,typ02: pr_TYPE02_EPIC, currencys: App.data.currencys, paramStat}),	
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_epic,
							param	: [prj, obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent	: function() {
						App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
						do_lc_bindEvent_epic_popup_prj(obj);
						do_gl_init_repeater();
					}
				});	
			});

			$("#btn_refresh_epic").off("click").on("click", function() {
				$spanTextFilterEpic.html("");
				$(".epic-filter").css("display", "none");

				do_lc_refresh_epic(prj, prj.grp);
			})

			$("#btn_filter_complete_epic").off("click").on("click", e => {
				const epicCompletes = prj.epics.filter(o => o.stat === pr_STAT_PRJ_DONE) || [];
				do_lc_show_ui_epic(prj, epicCompletes);
				$spanTextFilterEpic.html(" | " + $.i18n("prj_project_epic_search_compete"));
			})

			$("#btn_filter_not_complete_epic").off("click").on("click", e =>  {
				const epicNotCompletes = prj.epics.filter(o => o.stat !== pr_STAT_PRJ_DONE) || [];
				do_lc_show_ui_epic(prj, epicNotCompletes);
				$spanTextFilterEpic.html(" | " + $.i18n("prj_project_epic_search_not_compete"));
			})

			$("#btn_filter_search_epic").off("click").on("click", () => {
				$("#div_search_epic").toggle();
				$spanTextFilterEpic.html(" | " + $.i18n("prj_project_epic_search_inp"));
			});

			$("#inp_filter_epic").off("keyup").on("keyup", function() {
				const searchKey = $(this).val();
				const do_lc_filter_epic = () => {
					const epicSearch = prj.epics.filter(o => o.name.includes(searchKey) ) || [];
					do_lc_show_ui_epic(prj, epicSearch);
				}

				do_gl_execute_debounce(do_lc_filter_epic);
			})
		}

		const do_lc_show_epic = function(prj, scrollToTop){
			if(!prj.epics)	prj.epics = [];
			prj.epics = prj.epics.map(o =>{
				o.descr01 = o.descr01? o.descr01.substring(0, 100): "";
				return o;
			})

			prj.epics = prj.epicInf ? prj.epicInf.filter(o1 => prj.epics.some(o2 => o1.id === o2.id)) : [];

			do_lc_show_ui_epic(prj, [...prj.epics], scrollToTop);
		}

		const do_lc_show_ui_epic = (prj, epics, scrollToTop) => {
			if(epics.length > 0) do_lc_sort_data(epics);
			$("#tabEpic").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_EPIC_LIST, epics));
			
			do_lc_bindEvent_epics_prj(prj);
			
			if (scrollToTop)  do_gl_scrollToTop();;
		}

		const do_lc_sort_data = (data) => {
			data.sort(function (a, b) {
				return a.stat - b.stat || (a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))*2-1;
			});
		}

		const do_lc_bindEvent_epics_prj = function(prj){
//			$(".td-epic").off("click").on("click", function(){
//				let {id : idEpic} = $(this).data();
//				idEpic && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${idEpic}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [idEpic], '_self');
//				return false;
//			});


			$(".span-delete-epic").off("click").on("click", function() {
				const {id, code, stat} = $(this).data();
				if(stat !== pr_STAT_PRJ_NEW)	return;
				if(!id || !code)				return;
				const eIndex = prj.epics.findIndex(e => e.code01 === code);
				if(eIndex != -1 && (prj.epics[eIndex].nbTask > 0 || prj.epics[eIndex].nbEpic > 0)) {
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_epic_del_error"))
					return;
				}

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_del_epic_popup"),
					content 	: $.i18n("prj_project_del_epic_popup_content"),
					autoclose	: false,
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_delete_new_epic,
							param		: [id, code, prj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			})
			
			$(".span-show-epic").off("click").on("click", function() {
				const {id, code} = $(this).data();
				if(!id || !code) return;
				$(this).addClass('d-none');
				$(`.tab_show_epic_detail[data-id=${id}]`).removeClass('d-none');
				do_lc_show_epic_det(id, code, prj);
			})
			
			$(".span-hide-epic").off("click").on("click", function() {
				const {id} = $(this).data();
				if(!id)							return;
				$(this).addClass('d-none');
				$(`.span-show-epic[data-id=${id}]`).removeClass('d-none');
				$(`.tab_show_epic_detail[data-id=${id}]`).addClass('d-none');
			})
			
			$(".td-epic").droppable({
				hoverClass			: "hoverDrop",
				tolerance			: "pointer",
				drop				: function(event, ui) {
					event.preventDefault();
					do_lc_epic_drop(ui.draggable, this, prj);
				}
			});
			
			App.router.controller.do_lc_binding_route();
		}
		
		const do_lc_epic_drop = (divFrom, divTo, prj) => {
			const {id : idTask} = $(divFrom).data();
			const {id : idEpic} = $(divTo).data();
			if(!idTask || !idEpic){
				do_lc_show_epic_task_prj(prj);
				return;
			}
			
			const task = prj.tasks.find(t => t.id === idTask);
			const epic = prj.epics.find(e => e.id === idEpic);
			
			if(!task || !epic){
				do_lc_show_epic_task_prj(prj);
				return;
			}
			
			App.MsgboxController.do_lc_show({
				title 		: $.i18n("msgbox_confirm_title"),
				content 	: `${$.i18n("prj_task_move_to_epic_01")} <b>${task.name}</b> ${$.i18n("prj_task_move_to_epic_02")} <b>${epic.name}</b> ?`,
				autoclose	: false,
				buttons 	: {
					UPDATE : {
						lab 		: $.i18n("common_btn_ok"),
						funct 		: do_lc_add_task_to_epic,
						param 		: [idTask, idEpic, prj],
						classBtn	: "btn-primary",
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_cancel"),
					}
				}
			});
		}
		
		const do_lc_add_task_to_epic = (idTask, idEpic, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOVE_TASK, {idTask, idEpic, id : prj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_add_task_to_epic, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_after_add_task_to_epic = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				prj.epicInf = data.epicInf;
				prj.epics 	= data.epics;
				prj.tasks 	= data.tasks;
				pr_ctr_Ent.do_lc_show_epic_task(prj);
			}
		}

		const do_lc_show_epic_det = (id, code, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id, code});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_get_content_epic, [id]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_get_content_epic = function(sharedJson, id){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson.res_data;
				$(`.tab_show_epic_detail[data-id=${id}]`).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_EPIC_LIST_SHOW_CHILD, data));
				$(`.span-hide-epic[data-id=${id}]`).removeClass('d-none');
			}else{
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
			App.router.controller.do_lc_binding_route();
		}
		
		const do_lc_delete_new_epic = (id, code, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id, code, prjId: prj.id, prjCode: prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_epic, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_del_epic = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				do_lc_refresh_epic(prj, prj.grp);
			}else{
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		const do_lc_save_new_epic = function(prj, obj){
			$("#btn_msgbox_OK").attr("disabled", "disabled");
			let	data	 	= req_gl_data({
				dataZoneDom		: $("#div_create_prj")
			});

			let $projectdesc = $("#projectdesc");
			if ($projectdesc.summernote('isEmpty')){
				$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
			}

			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}

			let objNew 		= data.data;
			objNew.typ02	= pr_TYPE02_EPIC;
			objNew.files	= obj.files;

			objNew.dtBegin 	= do_lc_convert_date(objNew.dtBegin);
			objNew.dtEnd 	= do_lc_convert_date(objNew.dtEnd);

			do_lc_transform_descr02(objNew);

			do_lc_create_epic(objNew, prj);
		}

		const do_lc_convert_date = objDate => {
			return objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";
		};

		const do_lc_create_epic = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(obj);
			ref["member"]	= JSON.stringify(Object.values(members));

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_epic, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_create_epic = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
				data.descr01 = data.descr01.substring(0, 100);
				prj.epics.push(data);
				do_lc_show_ui_epic(prj, prj.epics);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		const do_lc_bindEvent_epic_popup_prj = function(obj){
			let option_ava		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_prj_avatar"), option_ava);

			let option = {
					fileinput	: {param : {typ01: 2, typ02: 10} },
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_prj_docs"), option);
			do_lc_req_autocompleteEpicTask(obj);
			
			let now = new Date();
			let tomorrow =  new Date();
			tomorrow.setDate((new Date()).getDate() + 1);
			let hours = now.getHours();
			let minutes = now.getMinutes();

			$("#dtpicker_Begin").datepicker().datepicker("setDate", now);
			$("#dtpicker_End").datepicker().datepicker("setDate", tomorrow);
			
			$("#tmpicker_Begin").timepicker({//timepicker
				showMeridian: false,
				defaultTime :`${hours}:${minutes}`,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			
			$("#tmpicker_End").timepicker({//timepicker
				showMeridian: false,
				defaultTime :`${hours}:${minutes}`,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});

			do_lc_bind_event_dtInput()
		}

		const do_lc_bind_event_dtInput = () => {
			$( "#dtpicker_Begin" ).off("change").on("change", function() {
				const sDate = $(this).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate < sDate) $( "#dtpicker_End" ).val(sDate)
			})
			$("#tmpicker_Begin").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $(this).val().split(":")
				let eTimeArr = $( "#tmpicker_End" ).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const sMinutesStr = sMinutes < 10 ? `0${sMinutes}` : sMinutes

				if(eHour < sHour) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
			})

			
			$( "#dtpicker_End" ).off("change").on("change", function() {
				const eDate = $(this).val()
				const sDate = $( "#dtpicker_Begin" ).val()

				if(eDate < sDate) $( "#dtpicker_Begin" ).val(eDate)
			})
			$("#tmpicker_End").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $( "#tmpicker_Begin" ).val().split(":")
				let eTimeArr = $(this).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const eMinutesStr = eMinutes < 10 ? `0${eMinutes}` : eMinutes

				if(eHour < sHour) $( "#tmpicker_Begin" ).val(`${eHour}:${eMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_Begin" ).val(`${sHour}:${eMinutesStr}`)
			})
		}

		const do_lc_req_autocompleteEpicTask = function(obj){
			let el = ".inp-name-member";
			
			members = {};
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			
			let reqSelectMember = function(event, item){
				if(members[item.id])			return false;
				let lev 			= $("#div_create_prj #sel_member_level").val();
				let typ 			= $("#div_create_prj #sel_member_type").val();
				let user 			= {"id": item.id, "lev": +lev, "typ": +typ};

				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}
				
				members[item.id] 	= user;

				let selOpt 			= `<div class='member-item'>`;
				if(item.avatar) selOpt 			+= `<div><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs' alt=""/> ${item.login01}`;
				else 			selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;
				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;

				$("#div_list_member").append(selOpt);
				do_lc_bindEvent_autocompleteEpicTask();
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
					dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH], 
					svParams		: {wAvatar:true, typ01s: typ01Str, stats:1}, 
					hintService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
					hintSvParams	: {wAvatar:true, typ01s: typ01Str, stats:1, entId01: pr_prj.grp}, 
					fSelect			: reqSelectMember, 
					appendTo		: ".msg-box", 
					customShowList	: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);
			
			/*
			let elG = ".inp-name-group";
			let customShowListGroup = function(item, selOpt = ""){
			    let name = ""
			    if(!item.name)	name = "A";
			    else name =  item.name.trim().substr(0,1).toUpperCase();
			     
			    if(!item.val01){
			        selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
			    }else{
			        item.val01 = JSON.parse(item.val01);
			        if(!item.val01.img) selOpt 		+=  `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
			        else selOpt 		+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-2'/>${item.name}</div>`;
			    }
			    return selOpt;
			}

			let reqSelectGroup = (event, item) => {
			    if(groups[item.id])			return false;

			    let typ 		= $("#sel_group_type").val();
			    let mem 		= {"typ": +typ, "ent02": item, "entId02": item.id, "entTyp02": 40000};
			    
			    let name = ""
			    if(!item.name)	name = "A";
			    else name =  item.name.trim().substr(0,1).toUpperCase();

			    let strName = item.name.length > 10?item.name.substr(0, 10) + "..." : item.name;
			    
			    groups[item.id] = mem;
			    let selOpt 		= `<div class='member-item'>`;
			    if(!item.val01) selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div> ${strName}`;
			    else{
			        if(!item.val01.img) selOpt 	+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div> ${strName}`;
			        else                selOpt 	+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-1' alt=''/> ${strName}`;
			    }
			    selOpt 			+= `<a data-id='${item.id}' class='text-danger btn-remove-group' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
			    selOpt 				+= `</div></div>`;
			    
			    $("#div_list_group").append(selOpt);
			    $(elG).blur().val("");
			    do_lc_bindEvent_autocomplete_group();
			}

			let optionsG = {
			    dataService : [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH], 
			    svParams	: {wAvatar:true, nbLine:5, typ01s: 300},
			    fSelect: reqSelectGroup, 
			    customShowList: customShowListGroup
			}
			do_gl_req_autocompleteNew(elG, optionsG);*/
		}

		const do_lc_bindEvent_autocompleteEpicTask = function(){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 	= $(this);
				let parent 	= $this.parent();
				let {id} 	= $this.data();

				if(members[id])	delete members[id];
				parent.remove();
			})
		}
		
		var do_lc_bindEvent_autocomplete_group = function(){
		    $(".btn-remove-group").off("click").on("click", function(){
		        let $this 		= $(this);
		        let parent 	    = $this.parent();
		        let {id} 		= $this.data();

		        if(groups[id])	delete groups[id];
		        parent.remove();
		    })
		}

		const do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
			if(item.avatar) return selOpt 		+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs' alt=""/> ${item.login01}`;
			if(!item.avatar){
				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}
				selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
				return selOpt;
			}
		}

		const do_lc_refresh_epic = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_EPIC, {id: prj.id, code: prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_refresh_epic, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_refresh_epic = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {

				prj.epicInf = sharedJson[App['const'].RES_DATA];
				do_lc_show_epic(prj);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		//------------------------------End Epic list-----------------------------------
	}
	//------------------------------End Epic list-----------------------------------

	//------------------------------Start Task Task-----------------------------------
	const PrjProjectEntTabTask 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		//------------------------------Start Task list-----------------------------------
		const self 			= this;
		var	  members 		= {};
		const groups 		= {};
	
		
		var pr_desrc02      = {
				task_ids : []
		};
		
		const pr_member_lev_manager 	= 0;
	
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		var	  pr_prj					= null;
		//--------------------------------------------------------------------------------
		
		this.do_lc_get_prj_task = function(prj, scrollToTop){
			pr_prj					= prj;
			pr_desrc02['task_ids'] 	= []

			do_lc_load_view(prj);
			
			do_lc_show_task(prj, scrollToTop);
		}
		
		const do_lc_load_view = function(prj){
	
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
	
			$("#div_prj_task")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_TASK, {}));
			
			do_lc_bindEvent_header_task(prj);
			do_lc_bindEvent_resize("#div_prj_task");
		}
	
		const do_lc_transform_descr02 = data => {
			if(!data.descr02)	return;
			const list = Object.values(data.descr02).reduce((curr, item) => {
				(item && item.trim().length) && curr.push({item}); return curr;
			}, [])
	
			data.descr02 = JSON.stringify(list);
		}
	
		const do_lc_bindEvent_header_task = prj => {
			const $spanTextFilter = $("#sp_text_filter");
	
			$("#btn_add_task, #btn_add_task_others").off("click").on("click", function(){
				var obj = {files: []};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_task_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_NEW, {epics : prj.epicInf, epicSelected: prj.id, typ02: pr_TYPE02_TASK, currencys: App.data.currencys, paramStat}),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_task,
							param	: [prj, obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
						do_lc_bindEvent_task_popup_prj(obj);
						do_gl_init_repeater();
					}
				});	
			});
	
			$("#btn_refresh_task").off("click").on("click", function() {
				$spanTextFilter.html("");
				$(".task-filter").css("display", "none");
				do_lc_refresh_task(prj, prj.id);
			})
	
			$("#btn_filter_complete_task").off("click").on("click", e => {
				const taskCompletes = prj.tasks.filter(o => o.stat === pr_STAT_PRJ_DONE) || [];
				do_lc_show_ui_task(prj, taskCompletes);
				$spanTextFilter.html(" | " + $.i18n("prj_project_task_search_compete"));
			})
	
			$("#btn_filter_not_complete_task").off("click").on("click", e =>  {
				const taskNotCompletes = prj.tasks.filter(o => o.stat !== pr_STAT_PRJ_DONE) || [];
				do_lc_show_ui_task(prj, taskNotCompletes);
				$spanTextFilter.html(" | " + $.i18n("prj_project_task_search_not_compete"));
			})
	
			$("#btn_filter_search_task").off("click").on("click", () => {
				$("#div_search_task").toggle();
				$spanTextFilter.html(" | " + $.i18n("prj_project_task_search_inp"));
			});
	
			$("#inp_filter_task").off("keyup").on("keyup", function() {
				const searchKey = $(this).val();
				const do_lc_filter_task = () => {
					const taskSearch = prj.tasks.filter(o => o.name.includes(searchKey) ) || [];
					do_lc_show_ui_task(prj, taskSearch);
				}
	
				do_gl_execute_debounce(do_lc_filter_task);
			})
		}

		const do_lc_bindEvent_add_multiple_task = (prj) => {
			$("#choose_multi_stat").multiselect({
				nonSelectedText: $.i18n("prj_sprint_non_selected"),
				numberDisplayed: 3
			});

			$(".task-stat-cbx").off("change").on("change", function(){
				let val 					= +$(this).find('input').val();
				let option					= $(`#choose_multi_stat > option[value=${val}]`)
				let isSelected 				= $(option).is(":selected");

				const sInd 					= prj.lstStats.findIndex(s => s.id === val)
				prj.lstStats[sInd].selected = isSelected ? true : false;
			})

			$("#btn_task_filter").off("click").on("click", function(){
				const search 	= $("#inp_search_task").val()
				const stats 	= prj.lstStats.filter(s => s.selected)

				const statsArr  = []
				stats.forEach(s => statsArr.push(s.id))
				
				do_lc_req_list_task(prj, search, JSON.stringify(statsArr))
			})
		}

		const do_lc_before_save_list_task = (prj) => {
			prj.descr02 = JSON.stringify(pr_desrc02);
			do_lc_save_list_task(prj);
		}

		const do_lc_req_list_task = (prj, searchkey, stats) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, "SVTaskListSearch", {grId: prj.grp, searchkey, stats});	
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_req_list_task_resp, [prj]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_req_list_task_resp = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];

				if(prj.descr02) {
					const descr02 	= JSON.parse(prj.descr02)
					if(descr02 && descr02['task_ids']) {
						data.forEach(t => {
							const checked 	= descr02['task_ids'].find(e => +e === +t.id) ? true : false
							t.checked 		= checked
						})
					}
				}

				$("#tbody_multiple_task").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_SPRINT_POPUP_MULTIPLE_TASK_BODY, data))
				do_lc_bindEvent_after_req_list_task()
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		const do_lc_bindEvent_after_req_list_task = () => {
			$(".task-cbx").off("change").on("change", function(){
				let isChecked 	= $(this).is(":checked");
				let {id} 		= $(this).data();
				
				if(isChecked) {
					pr_desrc02['task_ids'].push(id)
					return
				}
				
				const taskInd = pr_desrc02['task_ids'].findIndex(s => s === id)
				
				if(taskInd <= -1) return
				delete pr_desrc02['task_ids'][taskInd]
			})
		}
		
		const do_lc_req_autocomplete = (prj) => {
			let el = "#inp_add_task";
			let customShowList = function(item, selOpt = ""){
				return selOpt = item.name;
			}
	
			let reqSelectMember = (event, item) => {
				if(pr_desrc02["task_ids"].some(task => task == item.id))			return false;
	
				pr_desrc02["task_ids"].push(item.id);
	
				if(($("#tabTask").find("#tbody_task").length) == 0) {
					$("#tabTask").html("");
					let html = `   <table class="table table-centered"><tbody id="tbody_task"></tbody></table>`;
					$("#tabTask").html(html);
				}
				$("#tbody_task").append(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_TASK_LIST_ELEMENT, item));
				$(el).blur().val("");
				$("#a_btn_save_task_sprint, #a_btn_cancel_task_sprint").removeClass("hide");
			}
	
			let options = {
					dataService : [pr_SERVICE_CLASS, "SVTaskListSearch"], 
					fSelect: reqSelectMember, 
					customShowList,
					svParams: {grId: prj.grp}
			}
			do_gl_req_autocompleteNew(el, options);
		}
		
		const do_lc_save_list_task = (prj) => {
			
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(prj)});	
	
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_task_sprint, [prj]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
	
		var do_lc_afterSave_task_sprint = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_lc_refresh_task_sprint(prj, prj.id);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_refresh_task_sprint = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_TASK_SPRINT, {id: prjId, code:prj.code01});			
	
			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_refresh_task_sprint, [prj]));	
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
	
		const do_lc_after_refresh_task_sprint = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				prj.tasks = data;
				do_lc_show_task(prj);
				$("#a_btn_save_task_sprint, #a_btn_cancel_task_sprint").addClass("hide");
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	
		const do_lc_show_task = function(prj, scrollToTop){
			if(prj.tasks){
				for(var i=0; i < prj.tasks.length; i++){
					if(prj.tasks[i].descr01) {
						prj.tasks[i].descr01 = prj.tasks[i].descr01.substring(0, 200);
					}
				}
			} else prj.tasks = [];
	
			do_lc_show_ui_task(prj, [...prj.tasks], scrollToTop);
		}
	
		const do_lc_show_ui_task = (prj, tasks, scrollToTop) => {
	
			if(tasks.length > 0) do_lc_sort_data(tasks);
	
			$("#tabTask").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_TASK_LIST, tasks));
			
			do_lc_bindEvent_tasks_prj(prj);
			
			if (scrollToTop)  do_gl_scrollToTop();;
		}
	
		const do_lc_sort_data = (data) => {
			data.sort(function (a, b) {
				return a.stat - b.stat || (a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))*2-1;
			});
		}
	
		const do_lc_bindEvent_tasks_prj = function(prj){
			$(".span-delete-epic").off("click").on("click", function() {
				const {id, code, stat} = $(this).data();
				if(stat !== pr_STAT_PRJ_NEW)	return;
				if(!id || !code)				return;
	
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_del_task_popup"),
					content 	: $.i18n("prj_project_del_task_popup_content"),
					autoclose	: false,
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_delete_new_task,
							param		: [id, code, prj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			})
			
			$(".remove-task").off("click").on("click", function(){
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_DEPLOY};
	
					if (statFrom != pr_STAT_PRJ_NEW || statFrom != pr_STAT_PRJ_UNRESOLVED) {
						do_gl_show_Notify_Msg_Error ($.i18n('prj_cannot_delete_task') );
						return;
					}
					do_lc_save_change_stat(params, prj);
				}
			})
			
			$(".remove-task_sprint").off("click").on("click", function(){
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let index = pr_desrc02["task_ids"].indexOf(id);
					pr_desrc02["task_ids"].splice(index, 1);
					$("#tbody_task").find("tr[data-id='"+ id +"']").remove();
					$("#a_btn_save_task_sprint, #a_btn_cancel_task_sprint").removeClass("hide");
				}
			})
			
			$(".complete-task").off("click").on("click", function() {
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_DONE};
					do_lc_save_change_stat(params, prj);
				}
			})
			
			$(".close-task").off("click").on("click", function() {
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					const params = {id, statFrom,  statTo: pr_STAT_PRJ_CLOSED};
					do_lc_save_change_stat(params, prj);
				}
			})
			
			$(".td-task").draggable({
				cursor				: "move",
				revert				: true,
				containment			: "document",
				distance			: 50,
				appendTo 			: "#tabEpic",
				helper				: 'clone',
				opacity				: 0.70,
				zIndex				: 10000,
			});
	
			App.router.controller.do_lc_binding_route();
		}
		
		const do_lc_save_change_stat = (params, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MOVE, params);	
	
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_change_stat, [params, prj]));
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_change_stat = (sharedJson, params, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				const {id, statTo} = params;
				
				if(prj.tasks){
					const taskIndex = prj.tasks.findIndex(t => t.id === id);
					if(taskIndex > -1){
						prj.tasks[taskIndex].stat = statTo;
						do_lc_show_ui_task(prj, [...prj.tasks]);
					}
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
	
		const do_lc_delete_new_task = (id, code, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id, code, prjId: prj.id, prjCode: prj.code01});			
	
			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_task, [prj]));	
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
	
		const do_lc_after_del_task = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				do_lc_refresh_task(prj, prj.id);
			}else{
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}
	
		const do_lc_save_new_task = function(prj, obj){
			$("#btn_msgbox_OK").attr("disabled", "disabled");
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj")
			});
	
			let $projectdesc = $("#projectdesc");
			if ($projectdesc.summernote('isEmpty')){
				$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
			}
	
			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}
	
			let objNew 		= data.data;
			objNew.parent 	= prj.id;
			objNew.typ02	= pr_TYPE02_TASK;
			objNew.files	= obj.files;
	
			objNew.dtBegin 	= do_lc_convert_date(objNew.dtBegin);
			objNew.dtEnd 	= do_lc_convert_date(objNew.dtEnd);
	
			do_lc_transform_descr02(objNew);
	
			do_lc_create_task(objNew, prj);
		}
	
		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";
	
		const do_lc_create_task = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(obj);
			ref["member"]	= JSON.stringify(Object.values(members));
			ref["group"]	= JSON.stringify(Object.values(groups));
	
			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_task, [prj]));	
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
	
		const do_lc_after_create_task = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
				if(data.parent == prj.id){
					data.descr01 = data.descr01.substring(0, 100);
					prj.tasks.push(data);
					do_lc_show_ui_task(prj, prj.tasks);
				}
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}
	
		const do_lc_bindEvent_task_popup_prj = function(obj){
	
			let option_ava		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_prj_avatar"), option_ava);
	
			let option = {
					fileinput	: {param : {typ01: 2, typ02: 10} },
					obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_prj_docs"), option);
			do_lc_req_autocompleteEpicTask(obj);
	
	//			$("#div_create_prj .tmpicker").timepicker({//timepicker
	//				showMeridian: false,
	//				icons		: {
	//					up		: "mdi mdi-chevron-up",
	//					down	: "mdi mdi-chevron-down"
	//				}
	//			})
	
			let now = new Date();
			let tomorrow =  new Date();
			tomorrow.setDate((new Date()).getDate() + 1);
			let hours = now.getHours();
			let minutes = now.getMinutes();
			
			$("#dtpicker_Begin").datepicker().datepicker("setDate", now);
			$("#dtpicker_End").datepicker().datepicker("setDate", tomorrow);
			
			$("#tmpicker_Begin").timepicker({//timepicker
				showMeridian: false,
				defaultTime :`${hours}:${minutes}`,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			
			$("#tmpicker_End").timepicker({//timepicker
				showMeridian: false,
				defaultTime :`${hours}:${minutes}`,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});

			do_lc_bind_event_dtInput()
		}

		const do_lc_bind_event_dtInput = () => {
			$( "#dtpicker_Begin" ).off("change").on("change", function() {
				const sDate = $(this).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate < sDate) $( "#dtpicker_End" ).val(sDate)
			})
			$("#tmpicker_Begin").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $(this).val().split(":")
				let eTimeArr = $( "#tmpicker_End" ).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const sMinutesStr = sMinutes < 10 ? `0${sMinutes}` : sMinutes

				if(eHour < sHour) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
			})

			
			$( "#dtpicker_End" ).off("change").on("change", function() {
				const eDate = $(this).val()
				const sDate = $( "#dtpicker_Begin" ).val()

				if(eDate < sDate) $( "#dtpicker_Begin" ).val(eDate)
			})
			$("#tmpicker_End").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $( "#tmpicker_Begin" ).val().split(":")
				let eTimeArr = $(this).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const eMinutesStr = eMinutes < 10 ? `0${eMinutes}` : eMinutes

				if(eHour < sHour) $( "#tmpicker_Begin" ).val(`${eHour}:${eMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_Begin" ).val(`${sHour}:${eMinutesStr}`)
			})
		}
	
		const do_lc_req_autocompleteEpicTask = function(obj){
			let el = ".inp-name-member";
			members = {};
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			let reqSelectMember = function(event, item){
				if(members[item.id])			return false;
				let lev 			= $("#div_create_prj #sel_member_level").val();
				let typ 			= $("#div_create_prj #sel_member_type").val();
				let user 			= {"id": item.id, "lev": +lev, "typ": +typ};
	
				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}
				
				members[item.id] 	= user;
	
				let selOpt 			= `<div class='member-item'>`;
				if(item.avatar) selOpt 			+= `<div><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;
				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;
				
				$("#div_list_member").append(selOpt);
				do_lc_bindEvent_autocompleteEpicTask();
				$(el).blur().val("");
			}
	
			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
					dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH], 
					svParams		: {wAvatar:true, typ01s: typ01Str, stats:1}, 
					hintService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
					hintSvParams	: {wAvatar:true, typ01s: typ01Str, stats:1, entId01: pr_prj.grp}, 
					fSelect			: reqSelectMember, 
					appendTo		: ".msg-box", 
					customShowList	: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);
			
			/*
			let elG = ".inp-name-group";
			let customShowListGroup = function(item, selOpt = ""){
				let name = ""
				if(!item.name)	name = "A";
				else name =  item.name.trim().substr(0,1).toUpperCase();
				 
				if(!item.val01){
					selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
				}else{
					item.val01 = JSON.parse(item.val01);
					if(!item.val01.img) selOpt 		+=  `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
					else selOpt 		+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-2'/>${item.name}</div>`;
				}
				return selOpt;
			}
	
			let reqSelectGroup = (event, item) => {
				if(groups[item.id])			return false;
	
				let typ 		= $("#sel_group_type").val();
				let mem 		= {"typ": +typ, "ent02": item, "entId02": item.id, "entTyp02": 40000};
				
				let name = ""
				if(!item.name)	name = "A";
				else name =  item.name.trim().substr(0,1).toUpperCase();
	
				let strName = item.name.length > 10?item.name.substr(0, 10) + "..." : item.name;
				
				groups[item.id] = mem;
				let selOpt 		= `<div class='member-item'>`;
				if(!item.val01) selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div> ${strName}`;
				else{
					if(!item.val01.img) selOpt 	+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div> ${strName}`;
					else                selOpt 	+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-1' alt=''/> ${strName}`;
				}
				selOpt 			+= `<a data-id='${item.id}' class='text-danger btn-remove-group' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;
				
				$("#div_list_group").append(selOpt);
				$(elG).blur().val("");
				do_lc_bindEvent_autocomplete_group();
			}
	
			let optionsG = {
			    dataService : [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH], 
			    svParams	: {wAvatar:true, nbLine:5, typ01s: 300},
			    fSelect: reqSelectGroup, 
			    customShowList: customShowListGroup
			}
			do_gl_req_autocompleteNew(elG, optionsG);*/
		}
	
		const do_lc_bindEvent_autocompleteEpicTask = function(){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 	= $(this);
				let parent 	= $this.parent();
				let {id} 	= $this.data();
	
				if(members[id])	delete members[id];
				parent.remove();
			})
		}
		
		var do_lc_bindEvent_autocomplete_group = function(){
			$(".btn-remove-group").off("click").on("click", function(){
				let $this 		= $(this);
				let parent 	    = $this.parent();
				let {id} 		= $this.data();
	
				if(groups[id])	delete groups[id];
				parent.remove();
			})
		}
	
		const do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
			if(item.avatar) return selOpt 		+= `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
			if(!item.avatar){
				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}
				selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
				return selOpt;
			}
		}
	
		const do_lc_refresh_task = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_TASK, {id: prjId, code: prj.code01, typ02: prj.typ02});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_refresh_task, [prj]));	
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
	
		const do_lc_after_refresh_task = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				prj.tasks = data;
				do_lc_show_task(prj);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		//------------------------------End Task list-----------------------------------
	}
	//------------------------------End Task list-----------------------------------

	//------------------------------Start Report-----------------------------------
	const PrjProjectEntTabReport 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		
		const self 			= this;
		const members 		= {};
		const groups 		= {};

		var var_lc_MODE_NEW	= 1;

		
		var pr_desrc02      = {
			task_ids : []
		};
		
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;

		const pr_TYP_01_REPORT			= 1000;

		const pr_NUMBER_RECORD			= 5;

		const pr_Tab_Report				= "#tabReport"
		const pr_Tab_Report_Pag			= "#tabReportPagination"

		this.do_lc_get_prj_report 		= (prj, scrollToTop) => {
			do_lc_load_view(prj);
			do_lc_get_report(prj, false);
		}
		
		const do_lc_load_view = (prj) => {
			$("#div_prj_report")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT, {}));
			do_lc_bindEvent_resize("#div_prj_report");
		}

		const do_lc_bindEvent_header_report = (prj) => {
			const $spanTextFilter = $("#sp_text_filter");

			$("#btn_add_report, #btn_add_report_others").off("click").on("click", function(){
				var obj = {files: []};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_report_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_NEW, {}),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_report,
							param	: [prj, obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
						do_lc_bindEvent_report_popup_prj(obj);
						do_gl_init_repeater();
					}
				});	
			});

			$("#btn_refresh_report").off("click").on("click", function() {
				$("#inp_filter_report").val("");
				$spanTextFilter.html("");
				$(".task-filter").css("display", "none");
				do_lc_get_report(prj, true);
			})

			$("#btn_filter_search_report").off("click").on("click", () => {
				$("#div_search_report").toggle();
				$spanTextFilter.html(" | " + $.i18n("prj_project_report_search_inp"));
			});

			$("#inp_filter_report").off("keyup").on("keyup", function() {
				const do_lc_filter_report = () => {
					do_lc_get_report(prj, false)
					// const reportSearch = prj.lstReport.filter(o => o.inf01.includes(searchKey) || o.inf02.includes(searchKey)) || [];
					// do_lc_show_ui_report(prj, reportSearch);
				}

				do_gl_execute_debounce(do_lc_filter_report);
			})
		}
		
		const do_lc_req_autocomplete = (prj) => {
			let el = "#inp_add_report";
			let customShowList = function(item, selOpt = ""){
				return selOpt = item.name;
			}

			let reqSelectMember = (event, item) => {
				if(pr_desrc02["task_ids"].some(task => task == item.id))			return false;

				pr_desrc02["task_ids"].push(item.id);

				if(($("#tabReport").find("#tbody_task").length) == 0) {
					$("#tabReport").html("");
					let html = `   <table class="table table-centered"><tbody id="tbody_task"></tbody></table>`;
					$("#tabReport").html(html);
				}
				$("#tbody_report").append(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_LIST_ELEMENT, item));
				$(el).blur().val("");
				$("#a_btn_save_report_sprint, #a_btn_cancel_report_sprint").removeClass("hide");
			}

			let options = {
					dataService : [pr_SERVICE_CLASS, "SVTaskListSearch"], 
					fSelect: reqSelectMember, 
					customShowList, 
					svParams: {grId: prj.grp}
			}
			do_gl_req_autocompleteNew(el, options);
		}
		

		const do_lc_get_report = (prj, forced) => {
			let searchKey 		= $("#inp_filter_report").val()
			if(searchKey != null) searchKey = searchKey.trim() === "" ? null : searchKey.trim();
			let {id, code01} 		= prj;
			let dataSend			= {
				id: id,
				code: code01,
				stat: null,
				sKey: searchKey,
				typ01: pr_TYP_01_REPORT, 
				forced
			};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_REPORT, dataSend);

			let divMain 			= pr_Tab_Report;
			let divPagination 		= pr_Tab_Report_Pag;

			let callbackFunct 		= (data) => {
				do_lc_get_report_callback(data, divMain, prj);
			}

			let opt = {
				divMain			: divMain,
				divPagination	: divPagination,
				url_api 		: App.path.BASE_URL_API_PRIV, 
				url_header 		: App.data["HttpSecuHeader"],
				url_api_param 	: ref,
				pageSize 		: pr_NUMBER_RECORD,
				pageRange		: 1,
				callback		: callbackFunct
			};

			do_gl_init_pagination_opt(opt);
		}

		const do_lc_get_report_callback = (sharedJson, div, prj) => {
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];

				do_lc_show_report(div, data, prj, false)
			}
		}
		
		const do_lc_show_report = function(div, data, prj, scrollToTop){
			if(data.lst){
				prj.lstReport = data.lst

			} else prj.lstReport = [];

			do_lc_show_ui_report(prj, [...prj.lstReport], scrollToTop);
			do_lc_bindEvent_header_report(prj);
		}

		const do_lc_sort_date = (arr) => arr.sort((a, b) => new Date(b.dt01) - new Date(a.dt01)) 

		const do_lc_show_ui_report = (prj, reports, scrollToTop) => {
			if(reports.length > 0) reports = do_lc_sort_date(reports)

			$(pr_Tab_Report).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_LIST, reports));
			
			do_lc_bindEvent_reports_prj(prj);
			
			if (scrollToTop)  do_gl_scrollToTop();;
		}

		const do_lc_bindEvent_reports_prj = function(prj){
//			$(".span-delete-task").off("click").on("click", function() {
//				const {id, stat} = $(this).data();
//				if(stat !== pr_STAT_PRJ_NEW)	return;
//				if(!id)							return;
//
//				App.MsgboxController.do_lc_show({
//					title		: $.i18n("prj_project_del_task_popup"),
//					content 	: $.i18n("prj_project_del_task_popup_content"),
//					autoclose	: false,
//					buttons		: {
//						OK: {
//							lab			: $.i18n("common_btn_ok"),
//							funct		: do_lc_delete_new_report,
//							param		: [id, prj],
//							autoclose	: false,
//							classBtn	: "btn-primary"
//						},
//						NO: {
//							lab		:  $.i18n("common_btn_cancel"),
//						}
//					}
//				});	
//			})

			$(".remove-task").off("click").on("click", function(){
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_DEPLOY};

					if (statFrom != pr_STAT_PRJ_NEW || statFrom != pr_STAT_PRJ_UNRESOLVED) {
						do_gl_show_Notify_Msg_Error ($.i18n('prj_cannot_delete_task') );
						return;
					}
					do_lc_save_change_stat(params, prj);
				}
			})
			
			$(".remove-task_report").off("click").on("click", function(){
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let index = pr_desrc02["task_ids"].indexOf(id);
					pr_desrc02["task_ids"].splice(index, 1);
					$("#tbody_task").find("tr[data-id='"+ id +"']").remove();
					$("#a_btn_save_report_sprint, #a_btn_cancel_report_sprint").removeClass("hide");
				}
			})
			
						
			$(".td-report").off('click').on("click", function (){
				let $this 	= $(this);
				const {id} 	= $this.data()

				if(!id) return
				const data 	= prj.lstReport.find(r => r.id === +id)
				if(!data) return
				
//				const userRole = prj.userRole
								
//				if (userRole == pr_member_lev_manager || userRole == pr_member_lev_reporter){
					var obj = {files: []};
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_report_cont_popup"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_CONT, data),
						autoclose	: false,
						buttons		: {
							REMOVE: {
								lab		: $.i18n("prj_report_tab_remove"),
								funct	: do_lc_msg_delete_report,
								param	: [id, prj],
								autoclose	: false,
								classBtn	: "btn-danger"
							},
							COPY: {
								lab		: $.i18n("prj_project_btn_copy"),
								funct	: do_lc_copy_prj,
								param	: [prj],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
							OK: {
								lab		: $.i18n("common_btn_save"),
								funct	: do_lc_save_new_report,
								param	: [prj, obj],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						},
						bindEvent: function() {
							App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
							$(".item-file-download").off("click").on("click", function(){
								let {path} = $(this).data();
								path && window.open(path, "_blank");
							})
							do_lc_bindEvent_report_popup_prj(obj);
						}
					});
//				}
//				else {
//					var obj = {files: []};
//					App.MsgboxController.do_lc_show({
//						title		: $.i18n("prj_project_report_cont_popup"),
//						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_CONT, data),
//						autoclose	: false,
//						buttons		: {},
//						bindEvent: function() {
//							App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
//							$(".item-file-download").off("click").on("click", function(){
//								let {path} = $(this).data();
//								path && window.open(path, "_blank");
//							})
//							do_lc_bindEvent_report_popup_prj(obj);
//						}
//					});
//				}	
			})

			App.router.controller.do_lc_binding_route();
		}
		
		
//		const do_lc_delete_new_report = (id, prj) => {
//			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id});			
//
//			let fSucces		= [];		
//			fSucces.push(req_gl_funct(null, do_lc_after_del_report, [prj]));	
//
//			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
//
//			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
//		}
//		const do_lc_after_del_report = function(sharedJson, prj){
//			if(can_gl_AjaxSuccess(sharedJson)) {	
//				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
//				do_lc_refresh_report(prj, prj.id);
//			}else{
//				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
//			}
//			App.MsgboxController.do_lc_close();
//		}
		
		const do_lc_msg_delete_report = (id, prj) => {
			//Msg
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_confirm_title"),
				content : $.i18n("msgbox_confirm_delete"),
				width	: "400px",
				css: {"margin-top": "10%"},
				autoclose	: false,
				buttons	: {
					OK: {
						lab		: $.i18n("common_btn_ok"),
						funct	: do_lc_delete_report,
						param	: [id, prj],
						classBtn: "btn-primary"
					},
					NO: {
						lab		:  $.i18n("common_btn_cancel"),
					}
				}
			});
		}

		const do_lc_delete_report = (id, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_REPORT, {id});
			ref["prjPar"] = prj;
	
			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_del_report_succes, [prj]));	
	
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		const do_lc_del_report_succes = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
//				do_lc_load_view();
				do_lc_get_report(prj);
			}else{
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		const do_lc_copy_prj = (prj) => {
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj")
			});

			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}

			let objNew 		= data.data;
			objNew.typ01	= pr_TYP_01_REPORT;
			objNew.files	= [];
			
//			
			if (objNew.dt01 == null || objNew.dt02 == null) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				App.MsgboxController.do_lc_close();
			}
			else {
				objNew.dt01 	= do_lc_convert_date(objNew.dt01);
				objNew.dt02 	= do_lc_convert_date(objNew.dt02);
				
				App.MsgboxController.do_lc_close();
				var obj 		= {files: []}
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_report_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_NEW, objNew),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_report,
							param	: [prj, obj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
						do_lc_bindEvent_report_popup_prj(obj, true, var_lc_MODE_NEW);
					}
				});
			}
			
//			objNew.dt01 	= do_lc_convert_date(objNew.dt01);
//			objNew.dt02 	= do_lc_convert_date(objNew.dt02);
//
//			App.MsgboxController.do_lc_close();
//			var obj 		= {files: []}
//			App.MsgboxController.do_lc_show({
//				title		: $.i18n("prj_project_add_report_popup"),
//				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_REPORT_NEW, objNew),
//				autoclose	: false,
//				buttons		: {
//					OK: {
//						lab		: $.i18n("common_btn_save"),
//						funct	: do_lc_save_new_report,
//						param	: [prj, obj],
//						autoclose	: false,
//						classBtn	: "btn-primary"
//					},
//					NO: {
//						lab		:  $.i18n("common_btn_cancel"),
//					}
//				},
//				bindEvent: function() {
//					App.SummerNoteController.do_lc_show("#div_create_prj", {dialogsInBody: true});
//					do_lc_bindEvent_report_popup_prj(obj, true, var_lc_MODE_NEW);
//				}
//			});	
		}

		const do_lc_save_new_report = function(prj, obj){
//			$("#btn_msgbox_OK").attr("disabled", "disabled");
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj"),
				oldObject 		: {"files": prj.files}
			});
			let $projectdesc = $("#projectdesc");
			if ($projectdesc.summernote('isEmpty')){
				$projectdesc.parent().append("<div class='errMsg'>" + $.i18n("validator_err_required") + "</div>")
			}

			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}

			let objNew 		= data.data;
			objNew.typ01	= pr_TYP_01_REPORT;
			if(objNew.files) objNew.files.push(...obj.files)
			else objNew.files = obj.files

			if (objNew.dt01 == null || objNew.dt02 == null) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				App.MsgboxController.do_lc_close();
			}
			else {
				objNew.dt01 	= do_lc_convert_date(objNew.dt01);
				objNew.dt02 	= do_lc_convert_date(objNew.dt02);
				
				if (objNew.dt01 > objNew.dt02) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				} else {
					do_lc_create_report(objNew, prj);
				}
//				objNew.dt01 	= do_lc_convert_date(objNew.dt01);
//				objNew.dt02 	= do_lc_convert_date(objNew.dt02);
				
//				do_lc_create_report(objNew, prj);
			}
//			objNew.dt01 	= do_lc_convert_date(objNew.dt01);
//			objNew.dt02 	= do_lc_convert_date(objNew.dt02);
			
//			do_lc_create_report(objNew, prj);
		}

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		const do_lc_create_report = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_SAVE_REPORT);			
			ref["obj"]		= JSON.stringify(obj);
			ref["prjId"]	= prj.id;
			ref["prjCode"]	= prj.code01;

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_report, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_create_report = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
				if(data.entId == prj.id){
					const rIndex = prj.lstReport.findIndex(r => +r.id === +data.id)

					if(rIndex !== -1) prj.lstReport.splice(rIndex, 1)
					prj.lstReport.push(data);
					do_lc_show_ui_report(prj, prj.lstReport);
				}
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
			App.MsgboxController.do_lc_close();
		}

		const do_lc_bindEvent_report_popup_prj = function(obj, isCopied){
			if(!obj.files) obj.files = []

			let option = {
				fileinput	: {param : {typ01: 2, typ02: 10} },
				obj			: obj//file existing here
			}
			do_gl_init_fileDropzone($("#div_create_prj #div_report_docs"), option);

			if(!isCopied) {
				let now = new Date();
				let tomorrow =  new Date();
				tomorrow.setDate((new Date()).getDate() + 1);
				let hours = now.getHours();
				let minutes = now.getMinutes();
				
				$("#dtpicker_Begin").datepicker().datepicker("setDate", now);
				$("#dtpicker_End").datepicker().datepicker("setDate", tomorrow);
				
				$("#tmpicker_Begin").timepicker({//timepicker
					showMeridian: false,
					defaultTime :`${hours}:${minutes}`,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});
				
				$("#tmpicker_End").timepicker({//timepicker
					showMeridian: false,
					defaultTime :`${hours}:${minutes}`,
					icons		: {
						up		: "mdi mdi-chevron-up",
						down	: "mdi mdi-chevron-down"
					}
				});
				do_lc_bind_event_dtInput()

				$("#btn_edit_doc").off("click").on("click", function(){
					$("#div_report_ent_file_upload").removeClass("hide");
					$(this).addClass("hide");
				})
			}


			App.controller.PrjProject.Ent.do_lc_reqRole_User();
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".info-content-worker")	.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");
			})
		}
		
		
		const do_lc_bind_event_dtInput = () => {
			$( "#dtpicker_Begin" ).off("change").on("change", function() {
				const sDate = $(this).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate < sDate) $( "#dtpicker_End" ).val(sDate)
			})
			$("#tmpicker_Begin").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $(this).val().split(":")
				let eTimeArr = $( "#tmpicker_End" ).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const sMinutesStr = sMinutes < 10 ? `0${sMinutes}` : sMinutes

				if(eHour < sHour) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_End" ).val(`${sHour}:${sMinutesStr}`)
			})

			
			$( "#dtpicker_End" ).off("change").on("change", function() {
				const eDate = $(this).val()
				const sDate = $( "#dtpicker_Begin" ).val()

				if(eDate < sDate) $( "#dtpicker_Begin" ).val(eDate)
			})
			$("#tmpicker_End").off("change").on("change", function() {
				const sDate = $( "#dtpicker_Begin" ).val()
				const eDate = $( "#dtpicker_End" ).val()

				if(eDate != sDate) return;
				
				let sTimeArr = $( "#tmpicker_Begin" ).val().split(":")
				let eTimeArr = $(this).val().split(":")

				if(sTimeArr.length <= 0 || eTimeArr.length <= 0) return

				const sHour = +sTimeArr[0]
				const sMinutes = +sTimeArr[1]
				const eHour = +eTimeArr[0]
				const eMinutes = +eTimeArr[1]

				const eMinutesStr = eMinutes < 10 ? `0${eMinutes}` : eMinutes

				if(eHour < sHour) $( "#tmpicker_Begin" ).val(`${eHour}:${eMinutesStr}`)
				if(sHour == eHour && eMinutes < sMinutes) $( "#tmpicker_Begin" ).val(`${sHour}:${eMinutesStr}`)
			})
		}
	}
	//------------------------------------------------------------------------------------
	
	//------------------------------Start Member list-----------------------------------
	var PrjProjectEntTabMember 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		const pr_SV_GET_MEMBER		= "SVGetMember"; 
		const pr_SV_SAVE_MEMBER		= "SVSaveMember"; 
		
		//------------------------------------------------------------------------------------
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_MEMBER_TYPE 		= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
		
		var pr_MEM_TEMP					= {};
		var members 					= {};
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		const pr_ENT_TYP_USER           = 1000;
		
		const pr_ctr_Ent				= App.controller.PrjProject.Ent;
		
		var	  pr_prj					= null;
		//------------------------------------------------------------------------------------------------
		
		var do_lc_load_view = function(){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
		}

		//------------------------------------------------------------------------------------------------
		var do_lc_bindEvent_members = function(members, prj){
			pr_MEM_TEMP = $.extend(false, {}, members);

			$("#btn_add_member").off("click").on("click", function(){
				$(".action-item-member").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member").off("click").on("click", function(){
				do_lc_save_members(members, prj);
			})

			$("#a_btn_cancel_member").off("click").on("click", function(){
				do_lc_show_members(members, prj);
			})

			$(".member-edit").off("click").on("click", function(){
				let $this 			= $(this);
				let {memid} 		= $this.data();
				let mem 			= pr_MEM_TEMP[memid];
				if(mem){
					let parentTR 	= $this.closest("tr");
					parentTR.find(".content-member").addClass("hide");
					parentTR.find(".edit-member").removeClass("hide");
					let divLev 		= parentTR.find(".level-edit");
					let divTyp 		= parentTR.find(".typ-edit");
					do_lc_bindEvent_tabMemberEdit(memid, divLev, divTyp);
					$(".action-mem").removeClass("hide");
				}
			})

			$(".member-delete").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_MEM_TEMP[memid];
				if(mem){
					delete pr_MEM_TEMP[memid];
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			})
			
			$(".member-treeview").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_MEM_TEMP[memid];
				if(mem){
					
					if(!App.controller.PrjTreeView)		App.controller.PrjTreeView 		= {};
					if(!App.controller.PrjTreeView.EntMsgbox){
						App.controller.PrjTreeView.EntMsgbox 	= new TreeViewEntMsgbox();
						App.controller.PrjTreeView.EntMsgbox	.do_lc_init();
					}
					App.controller.PrjTreeView.EntMsgbox		.do_lc_show_with_mem_id(memid, prj.id, prj.id, prj.code01);
				}
			})

			let el = "#inp_name_member";
			let reqSelectMember = function(event, item){
				if(pr_MEM_TEMP[item.id])			return false;

				let lev 		= $("#sel_member_level").val();
				let typ 		= $("#sel_member_type").val();
				let mem 		= {"lev" : lev, "typ": typ, "ent02": item, "entId02": item.id, "entTyp02": pr_ENT_TYP_USER, "entId01": prj.id};
				let strlogin01 	= item.login01.length > 4?item.login01.substr(0, 4) + "..." : item.login01;
				
				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}

				pr_MEM_TEMP[item.id] = mem;
				let selOpt 		= `<tr>`;
				selOpt 			+= `<td><a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></td>`;
				
				if(item.avatar) selOpt += `<td style='width: 50px;'><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs' alt=''/></td>`;

				else 			selOpt 			+= `<td style='width: 50px;'> <div class="rounded-circle avatar-xs text-white text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div></td>`;
				selOpt 			+= `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${strlogin01}</a></h5></td>`;
				selOpt 			+= `<td>` + $.i18n(PRJ_MEMBER_LEVEL[+lev]) 	+`</td>`;
				selOpt 			+= `<td class='hide'>` + $.i18n(PRJ_MEMBER_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				do_lc_bindEvent_autocomplete(pr_MEM_TEMP);
				$(el).blur().val("");
			}

			let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str 	= typ01Arr.join(',');
			let options 	= {
					dataService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH], 
					svParams		: {wAvatar:true, typ01s: typ01Str, stats:1}, 
					hintService 	: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
					hintSvParams	: {wAvatar:true, typ01s: typ01Str, stats:1, entId01: pr_prj.grp}, 
					fSelect			: reqSelectMember, 
					customShowList	: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);

			App.router.controller.do_lc_binding_route()
		}
		
		var do_lc_bindEvent_autocomplete = function(pr_MEM_TEMP){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 		= $(this);
				let parentTR 	= $this.closest("tr");
				let {id} 		= $this.data();

				if(pr_MEM_TEMP[id])	delete pr_MEM_TEMP[id];
				parentTR.remove();
			})
		}
		
		var do_lc_bindEvent_tabMemberEdit = function(memid, divLev, divTyp){
			$(divLev).off("change").on("change", function(){
				pr_MEM_TEMP[memid].lev = $(this).val();
			})

			$(divTyp).off("change").on("change", function(){
				pr_MEM_TEMP[memid].typ = $(this).val();;
			})
		}

		var do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
			if(!item.avatar){
				let first = item.login01.charAt(0);
				let last  = item.login01.charAt(item.login01.length - 1);
				let index = var_gl_alphabet.indexOf(first.toLowerCase());
				
				let textColor = var_gl_colors[index];
				let textAvatar= first + last;
				
				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-2" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			}else{
				selOpt += `<div class="media align-items-center"><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs mr-2'/>${item.login01}</div>`;
			}
			return selOpt;
		}
		
		//------------------------------------------------------------------------------------------------
		this.do_lc_get_prj_members 	= function(prj){
			pr_prj					= prj;
			if (prj.members && prj.members.length>0){
				do_lc_show_members(prj.members, prj);
				return;
			}
			
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER, {id: prj.id, code: prj.code01, buildInfo: true});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_prj_members_callback, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_get_prj_members_callback = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				pr_members		= data;
				if ((prj.members || pr_members)?.some(member => member.entId02 === App.data.user.id && (member.lev === 0 || member.lev === 10))) $("#btn_mem_manager").removeClass('hide');

				do_lc_show_members(data, prj);
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		this.do_lc_save_members_call = function(saveMembers, unSaveMembers, prj){
			
			if(unSaveMembers.length !== 0){
				var unSaveMembersMap = new Map(unSaveMembers.map(m => [m.mem.id, m]));
				for (var i in pr_MEM_TEMP) {
				  var prItem = pr_MEM_TEMP[i];
				  
				  if (unSaveMembersMap.has(prItem.entId02)) {
				  	delete pr_MEM_TEMP[i];
				  }
				}
			}
				
			if(saveMembers.length !== 0 ){ 
				var saveMembersMap = new Map(saveMembers.map(m => [m.mem.id, m]));
				
				for (var i in pr_MEM_TEMP) {
				    var prItem = pr_MEM_TEMP[i];

				    if (saveMembersMap.has(prItem.entId02)) {
						 var mapItem = saveMembersMap.get(prItem.entId02);

			           	 if (mapItem.lev === prItem.lev) {
			                saveMembersMap.delete(prItem.entId02);
			           	 }
				    }
				   
				} 
				saveMembersMap.forEach((value) => {
					pr_MEM_TEMP[value.entId02] = {
			            ...value,
			            ent02: value.mem
			        };
			
				});
			} else{
				
				var membersMap = new Map(unSaveMembers.map(m => [m.mem.id, m]));

				for (var i in pr_MEM_TEMP) {
				    var prItem = pr_MEM_TEMP[i];

				    if (membersMap.has(prItem.entId02)) {
				         delete pr_MEM_TEMP[i];
				    }
				} 
			}					
				
			do_lc_save_members(saveMembers, prj);
			
		}

		var do_lc_save_members = function(members, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER, {id:prj.id, code:prj.code01, members: JSON.stringify(Object.values(pr_MEM_TEMP))});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_save_members_callback, [members, prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_save_members_callback = function(sharedJson, members, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
				
				var data = []
				for (var i in pr_MEM_TEMP ) data.push(pr_MEM_TEMP[i]);
				do_lc_show_members(data, prj);
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_show_members = function(data, prj){
			if(typeof data === 'object' && !Array.isArray(data)) {
				data = Object.values(data)
			}
			const is_Me 		= data.find(m => m.entId02 == App.data.user.id);
			const isSuperAdmin 	= App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
			const isOwner		= App.data.user.id === prj.autUser01;
			
			let 	members 	= data.reduce((currentObj, mem)=>{
				if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
				
				if(!isSuperAdmin && !isOwner){
					if(is_Me && is_Me.typ <= mem.typ && is_Me.lev >= mem.lev)	mem.notModif = true;
				}
				
				currentObj[mem.entId02] = mem;
				return currentObj;
			}, {});
			
			do_lc_load_view();
			$("#div_prj_member")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEMBER			, members));
			do_lc_bindEvent_members(members, prj);
			do_lc_bindEvent_resize("#div_prj_member");
			// do_gl_handle_member_external($("#div_prj_member"));
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}
		//------------------------------End list member-----------------------------------
	}
	
	//------------------------------Start Member list-----------------------------------
var PrjProjectEntTabMemberGroup = function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		const pr_SV_SAVE_MEMBER_GROUP	= "SVSaveMemberGroup"; 
		const pr_SV_GET_MEMBER_GROUP	= "SVGetMemberGroup"; 
		const pr_SV_SAVE_MEMBER			= "SVSaveMember"; 
		//------------------------------------------------------------------------------------
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_GROUP_TYPE 		= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
		
		var pr_GROUP_TEMP		     	= {};
		
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;

		const pr_ENT_TYP_GROUP          = 5000;

		
		var self                        = this;
		const pr_ctr_Ent				= App.controller.PrjProject.Ent;
		
		this.do_lc_get_prj_grpMembers = function(prj){
			
			if (prj.groups && prj.groups.length>0){
				do_lc_show_grpMembers(prj.groups, prj);
				return;
			}
			
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER_GROUP, {id: prj.id, code: prj.code01});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_prj_grpMembers_callback, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_lc_get_prj_grpMembers_callback = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				do_lc_show_grpMembers(data, prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		var do_lc_bindEvent_grpMembers = function(groups, prj){
			pr_GROUP_TEMP = $.extend(false, {}, groups);
			
			$("#btn_add_group").off("click").on("click", function(){
				$(".action-item-group").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member_group").off("click").on("click", function(){
				do_lc_save_grpMembers(groups, prj);
			})

			$("#a_btn_cancel_member_group").off("click").on("click", function(){
				do_lc_show_grpMembers(groups, prj);
			})

			$(".member-group-edit").off("click").on("click", function(){
				let $this 			= $(this);
				let {grpid} 		= $this.data();
				let grp;
				if (typeof pr_GROUP_TEMP === 'object' && pr_GROUP_TEMP !== null) {
					for (let key in pr_GROUP_TEMP) {
						/*console.log("Key:", key, "Value:", pr_GROUP_TEMP[key]);*/ // In ra từng khóa và giá trị
						if (pr_GROUP_TEMP[key].id == grpid) {
							grp = pr_GROUP_TEMP[key];
							break;
						}
					}
				}
				if(grp){
					let parentTR 	= $this.closest("tr");
					parentTR.find(".content-member").addClass("hide");
					parentTR.find(".edit-member").removeClass("hide");
					let divLev 		= parentTR.find(".level-edit");
					let divTyp 		= parentTR.find(".typ-edit");
					do_lc_bindEvent_grpMember_Edit(grp, divLev, divTyp);
					$(".action-mem-group").removeClass("hide");
				}
			})

			$(".member-group-delete").off("click").on("click", function(){
				let $this 			= $(this);
				let {grpid} 		= $this.data();
				let arr 	= Object.values(groups);
				
				let memGroup = arr.filter(item => item.id == grpid);
				let typ = 'delete';
				do_lc_get_prj_members_grp(memGroup, grpid, prj, typ)
			
			})
			
			$(".show_mem_group").off("click").on("click", function(){
				let {grpid} = $(this).data();
				let arr 	= Object.values(groups);
				
				let memGroup = arr.filter(item => item.id == grpid);
				let typ = 'show';
				do_lc_get_prj_members_grp(memGroup, grpid, prj, typ)
				
				
			})
			
			

			let el = "#inp_name_group";
			let reqSelectGroup = function(event, item){
				if(pr_GROUP_TEMP[item.id])			return false;
				let lev 		= $("#sel_group_level").val();
				let typ 		= $("#sel_group_type").val();
				let mem 		= {id:item.id, "lev":lev,"typ": typ, "ent02": item, "entId02": item.id, "entTyp02":pr_ENT_TYP_GROUP,"entId01": prj.id};
				
				let name = ""
				if(!item.name)	name = "A";
				else name =  item.name.trim().substr(0,1).toUpperCase();

				let strName = item.name.length > 10?item.name.substr(0, 10) + "..." : item.name;
				
				pr_GROUP_TEMP[item.id] = mem;
				
				
				let selOpt 		= `<tr>`;
				
				if(!item.val01) selOpt 			+= `<td style='width: 50px;'><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div></td>`;
				else{
					if(!item.val01.img) selOpt 	+= `<td style='width: 50px;'><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div></td>`;
					else                selOpt 	+= `<td style='width: 50px;'><img src='${item.val01.img}' class='rounded-circle avatar-xs' alt=''/></td>`;
				}
				selOpt 			+= `<td><h5 class='font-size-14 m-0' title="${item.name}"><a href='' class='text-dark'>${strName}</a></h5></td>`;
				
				selOpt 			+= `<td class="hide">` + $.i18n(PRJ_GROUP_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;
				
				do_lc_get_member_grp(item, item.id, prj, selOpt);
				
			}

			let options = {
					dataService : [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH],
					svParams	: {wAvatar:true, nbLine:5, typ01s: 300}, 
					fSelect: reqSelectGroup, 
					customShowList: do_lc_customLst_group_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);
		}
		
		var do_lc_get_prj_members_grp = function(memGroup, grpid, prj, typ){
		
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, "SVGetMember", {id: prj.id, code: prj.code01});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_prj_members_callback, [memGroup, grpid, prj, typ]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_get_prj_members_callback = function(sharedJson, memGroup, grpid, prj, typ){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				let members = memGroup[0].ent02.mems;
			
				let membersdata = members.map(item => {
				    let memItem = data.find(memItem => item.uId === memItem.entId02);
				    if (memItem) {
				        return {
				           ...item, lev: memItem.lev, check: 1
			        	};
				    } else {
				        return {  ...item,
				           		 check: 0,
				           		 lev: 1000  
				        };
				    }
				});
				memGroup[0].ent02.mems = membersdata;
				
				if( typ ==='show'){
					App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_member_group"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEMBER_GROUP_POPUP, memGroup[0]),	
					css         : {"max-width"	: "600px"},
					autoclose	: false,
					buttons		: {
						Cancel:{
								lab		:  $.i18n("common_btn_cancel"),
						}
					},
				});	
				} else if(typ === 'delete'){
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_member_delete_group"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEMBER_GROUP_POPUP, memGroup[0]),
						css         : {"max-width"	: "600px"},
						autoclose	: false,
						buttons		: {
							Ok: {
								lab		:  $.i18n("common_btn_delete"),
								funct	: do_lc_delete_grp,
								param 		: [grpid, membersdata, prj],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
							Cancel:{
								lab		:  $.i18n("common_btn_cancel"),
							}
						},
					});	
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		var do_lc_delete_grp = function(grpid, data, prj){
			let grp;
			let checkedMembers = [];
			let uncheckedMembers = [];
			
			data.forEach(function(member) {
			    let checkboxSelector = `.check-mem-${member.uId}`;
			    let isChecked = $(checkboxSelector).is(":checked");
			    
			    if (isChecked) {
       				checkedMembers.push(member);
			    } else if(!isChecked && member.lev < 1000){
			        uncheckedMembers.push(member);
			    }
			});
		
			App.controller.UI[pr_grpName].EntMember.do_lc_save_members_call( uncheckedMembers, checkedMembers, prj);
			if (typeof pr_GROUP_TEMP === 'object' && pr_GROUP_TEMP !== null) {
				for (let key in pr_GROUP_TEMP) {
					console.log("Key:", key, "Value:", pr_GROUP_TEMP[key]);
					if (pr_GROUP_TEMP[key].id == grpid) {
						grp = pr_GROUP_TEMP[key];
						if(grp){
							delete pr_GROUP_TEMP[key];
							groups = Object.values(pr_GROUP_TEMP);
							$(".member-group-delete").closest("tr").remove();
							$(".action-mem-group").removeClass("hide");
							App.MsgboxController.do_lc_close();
							do_lc_save_grpMembers(groups, prj);
						}
						break;
					}
				}
			}
		}
		
		var do_lc_get_member_grp = function(groups, grpid, prj, selOpt){
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVGetMember", {id: grpid});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_get_member_grp, [groups, prj, selOpt]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_lc_after_get_member_grp = function(sharedJson, groups, prj, selOpt){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				
				let memGroup ={ent02:{mems:data}};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_member_add_group"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEMBER_GROUP_POPUP, memGroup),
					css         : {"max-width"	: "600px"},
					autoclose	: false,
					buttons		: {
						Ok: {
							lab		:  $.i18n("common_btn_save"),
							funct	: do_lc_save_grp,
							param 		: [groups, data, prj, selOpt],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						Cancel:{
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
				});	
			//	do_lc_show_grpMembers(data);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		var do_lc_save_grp = function(groups, data, prj, selOpt){
			var members = req_gl_data({
					dataZoneDom: $(`.member-item`)
			});
			
			let checkedMembers = [];
			let uncheckedMembers = [];
			
			const memberMap = new Map();

			data.forEach(function(member) {
			    let checkboxSelector = `.check-mem-${member.uId}`;
			    let isChecked = $(checkboxSelector).is(":checked");
			    
			    if (isChecked) {
			        checkedMembers.push(member);
			    } else if (!isChecked && member.lev < 1000) {
			        uncheckedMembers.push(member);
			    }
			    
			    memberMap.set(parseInt(member.uId), member);
			});
			
			if(checkedMembers.length === 0){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save') );
			} else{
				let mergedData = [];
				const memMap = new Map();
				const mems = members.data.mems;
				
				for (let i = 0; i < mems.length; i++) {
				    if (mems[i] !== undefined) {
				        memMap.set(parseInt(mems[i].uId), mems[i]);
				    }
				}
				
				for (let i = 0; i < checkedMembers.length; i++) {
				    let memItem = memMap.get(checkedMembers[i].mem.id);
				    
				    if (memItem) {
				        let mergedItem = {
				            ...checkedMembers[i],
				            ...memItem,
				            lev: parseInt(memItem.lev),
				            typ: parseInt(memItem.typ),
				            uId: parseInt(memItem.uId),
				            stat: parseInt(memItem.stat),
				            entId02: parseInt(memItem.uId)
				        };
				        mergedData.push(mergedItem);
				    } else {
				        mergedData.push(checkedMembers[i]);
				    }
				}
			

				do_lc_save_grpMembers(groups, prj, selOpt);
				App.controller.UI[pr_grpName].EntMember.do_lc_save_members_call(mergedData, uncheckedMembers, prj);
			
			}
		}
			
		var do_lc_bindEvent_autocomplete_group = function(){
			$(".btn-remove-group").off("click").on("click", function(){
				let $this 		= $(this);
				let parentTR 	= $this.closest("tr");
				let {id} 		= $this.data();

				if(pr_GROUP_TEMP[id])	delete pr_GROUP_TEMP[id];
				parentTR.remove();
			})
		}
		
		var do_lc_bindEvent_grpMember_Edit = function(gId, divLev, divTyp){
			$(divLev).off("change").on("change", function(){				
				gId.lev = $(this).val();
			})

			$(divTyp).off("change").on("change", function(){
				gId.typ = $(this).val();;
			})
		}

		var do_lc_customLst_group_autocomplete = function(item, selOpt = ""){
			let name = ""
			if(!item.name)	name = "A";
			else name =  item.name.trim().substr(0,1).toUpperCase();
			 
			if(!item.val01){
				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
			}else{
				item.val01 = JSON.parse(item.val01);
				if(!item.val01.img) selOpt 		+=  `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div>${item.name}</div>`;
				else selOpt 		+= `<div class="media align-items-center"><img src='${item.val01.img}' class='rounded-circle avatar-xs mr-2'/> ${item.name}</div>`;
			}
			return selOpt;
		}
		
	

		var do_lc_save_grpMembers = function(groups, prj, selOpt){
			
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER_GROUP, {id: prj.id,code: prj.code01, groups: JSON.stringify(Object.values(pr_GROUP_TEMP))});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_save_grpMembers_callback, [groups, prj, selOpt]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		
	
		var do_lc_save_grpMembers_callback = function(sharedJson, groups, prj, selOpt){
			if(can_gl_AjaxSuccess(sharedJson)) {
				var object = sharedJson[App['const'].RES_DATA];
				let el = "#inp_name_group";
				$("#tabGroup table tbody").append(selOpt);
				do_lc_bindEvent_autocomplete_group();
				$(el).blur().val("");
				self.do_lc_get_prj_grpMembers(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save') );
			}
		}

		var do_lc_show_grpMembers = function(groups, prj){
			pr_GROUP_TEMP 	= {};
			for (var i in groups){
				var g = groups[i];
				if (g.ent02 && g.ent02.val01 && (typeof g.ent02.val01 === "string")) g.ent02.val01 = JSON.parse (g.ent02.val01); //---parse json
				
				pr_GROUP_TEMP[g.id] = g.ent02;
			}
			
			let data = groups.reduce((currentObj, mem)=>{
				
				currentObj[mem.entId02] = mem;
				return currentObj;
			}, {});
			$("#div_prj_member_group")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEMBER_GROUP		, groups));
			do_lc_bindEvent_grpMembers(data, prj);
			do_lc_bindEvent_resize("#div_prj_member_group");
			App.MsgboxController.do_lc_close();
			
			pr_ctr_Ent.do_lc_reqRole_User();//---binding event by user role
		}
		//------------------------------End list member group-----------------------------------
	}

	//------------------------------Start Doc list-----------------------------------
	var PrjProjectEntTabDoc 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		//------------------------------Start File list-----------------------------------
		let self			= this;
		const pr_ctr_Ent	= App.controller.PrjProject.Ent;

		this.do_lc_get_prj_docs = function(prj){
			$("#div_prj_docs")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_DOCS, prj));
			do_lc_bindEvent_docs_prj(prj);
			do_lc_bindEvent_resize("#div_prj_docs");
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}

		var do_lc_bindEvent_docs_prj = function(prj){
//			let	obj 		= {files:[]};
			prj.files 		= [];
			let option		= {
					fileinput	: { 
						parallelUploads	: 10,
			            uploadMultiple	: true,
						param 			: {typ01: 2, typ02: 10, filenameKept: 1},
						addRemoveLinks 	: !pr_ctr_Ent.can_lc_role_user_worker()
					},//option here
					obj			: prj//show empty box
			}
			do_gl_init_fileDropzone($("#div_prj_docs"), option);

			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})

			$(".item-file-delete").off("click").on("click", function(){
				let fileId			= $(this).data("id");	
				var lineToRemove 	= $(this).parents("tr");
				
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_delete"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_del_files_prj,
							param	: [prj, fileId, lineToRemove],
							classBtn: "btn-success"
						},
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})

			$("#btn_add_doc").off("click").on("click", function(){
				$(".action-item-doc").removeClass("hide");
				$("#div_prj_ent_file_upload").removeClass("hide");
				$(this).addClass("hide");
				$(".item-file-delete").removeClass("hide");
			})

			$("#a_btn_save_doc").off("click").on("click", function(){
				prj.files 		= prj.files ? [...prj.files].filter(Boolean) : [];
				let	data	= req_gl_data({
					dataZoneDom		: $("#div_prj_docs"),
					skipError		: true
				});

				if(data.hasError)	return false;

				let newprj 		= data.data;
				
				newprj.files 	= prj.files;
				newprj 			= $.extend(false, prj, newprj);

				console.log(prj.files);

				do_lc_save_files_prj(newprj);
			})

			$("#a_btn_cancel_doc").off("click").on("click", function(){
				self.do_lc_get_prj_docs(prj);
			})
		}

		var do_lc_save_files_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_ADD_FILES, {'id': prj.id, 'code': prj.code01, obj: {files: prj.files}});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_files_prj, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_add_loader()
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_files_prj = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				prj.files = sharedJson[App['const'].RES_DATA].files;
				self.do_lc_get_prj_docs(prj);
				App.network.do_lc_remove_loader()
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		var do_lc_del_files_prj = function(prj, fileId, lineToRemove){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_FILES, {'id': prj.id, 'code': prj.code01, 'fileId':fileId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_files_prj, [prj, fileId, lineToRemove]));

			let fError 		= req_gl_funct(App, pr_ctr_Main.do_show_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterDel_files_prj = function(sharedJson, prj, fileId, lineToRemove){
			if(can_gl_AjaxSuccess(sharedJson)) {
				lineToRemove.remove();
				if (prj.files) 
					prj.files = prj.files.filter(f => f.id != fileId);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		//------------------------------End File list-----------------------------------
	}
	//------------------------------End File list-----------------------------------

	//------------------------------Start Comment list-----------------------------------
	var PrjProjectEntTabComment 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		const pr_SV_GET_COMMENTS	= "SVGetComment";
		const pr_SV_NEW_COMMENTS	= "SVSaveComment";
		//------------------------------------------------------------------------------------
		//------------------variable pagination post------------------------------------------------------
		const pr_POST_BEGIN 			= 0;
		const pr_POST_NUMBER 		= 10;
		const pr_POST_NO_SUB 		= 1;
		const pr_POST_HAS_SUB 		= 2;
		const pr_POST_KEY_ENTER 	= 13;
		const self					= this;

		const pr_ctr_Ent			= App.controller.PrjProject.Ent;
		//------------------------------Start comment list-----------------------------------
		this.do_lc_get_prj_comments = function(prj, reBuild = false, scrollToTop){
			let cond 		= {
					id		: prj.id			, 
					code	: prj.code01			,
					begin	: pr_POST_BEGIN		, 
					number	: pr_POST_NUMBER		, 
					nbLevel	: pr_POST_HAS_SUB	,			
					forced	: true, reBuild,
			}

			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_COMMENTS, cond);	

			var callbackFunct = function(data) {		//data => sharedJson
				do_lc_show_comment_Dyn(data, prj, scrollToTop);
			}

			$("#div_prj_comments")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_COMMENT, {}));
			var opt = {
					divMain			: "#div_comment_list",
					divPagination	: "#div_comment_pagination",
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_POST_NUMBER,
					pageRange		: 1,
					callback		: callbackFunct
			};
			do_gl_init_pagination_opt(opt);
		}
		
		var do_lc_show_comments = function(dataCmts, prj, scrollToTop){
			$("#div_comment_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_COMMENT_LIST, dataCmts));
			
//			$(".a-delete[data-userid= '" + App.data.user.id +"']").removeClass("d-none");
			
			App.SummerNoteController.do_lc_show("#div_prj_comments", {height : 100}, true);//text editor
			
			do_lc_bindEvent_comments(prj);
			do_lc_bindEvent_resize("#div_comment_list");
			
			if (scrollToTop)  do_gl_scrollToTop();

			pr_ctr_Ent.do_lc_reqRole_User();
		}

		var do_lc_show_comment_Dyn = function(sharedJson, prj, scrollToTop){
			let data			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				data		= sharedJson[App['const'].RES_DATA];
			}

			do_lc_show_comments(data, prj, scrollToTop);
		}

		var do_lc_bindEvent_comments = function(prj){
			$("#btn_send_comment").off("click").on("click", function(){
				let comment = $("#inp_comment").val();
				let iParent = $("#inp_parent_reply").val();
				if(!comment || !comment.length)	return false;
				do_lc_send_comment(prj, comment, iParent);
				
				$(this).prop('disabled', true);
			})

			$(".a-reply").off("click").on("click", function(){
				let{parent, user} = $(this).data();
				parent && $("#inp_parent_reply").val(parent);
				if(user)	$("#inp_comment").summernote('code', `@${user} `);
			})
			
			$(".a-delete").off("click").on("click", function(){
				let{id} = $(this).data();
				if(id)	do_lc_del_comment(prj, id);
			})
			
			$('.a-change').off('click').on('click', function() {
			    let {id} = $(this).data();
			    let commentText = $(`#comment_text_${id}`);
			    let commentTextarea = $(`#change_comment_${id}`);

			    if (commentText.length && commentTextarea.length) {

			        commentTextarea.removeClass('hide');
			        

			        $(`.comment_action_${id}`).addClass('hide');
			        let saveButton = $(`a[data-id="${id}"]#a_btn_save_comment`);
			        let cancelButton = $(`a[data-id="${id}"]#a_btn_cancel_comment`);
			        
			        saveButton.removeClass('hide');
			        cancelButton.removeClass('hide');
			        

			        commentTextarea.summernote({
			            height: 150
			        });
			        
			        if (commentTextarea.summernote('isEmpty')) {
			            commentTextarea.summernote('code', commentText.val());
			        }
			        
			        do_lc_bindEvent_change_comment(prj,id);
			    }
			});

			
			var do_lc_bindEvent_change_comment = function(prj,id) {

			    $(`a[data-id="${id}"]#a_btn_cancel_comment`).off('click').on('click', function() {
			        let id = $(this).data('id');
			        let commentText = $(`#comment_text_${id}`);
			        let commentTextarea = $(`#change_comment_${id}`);

			        commentText.removeClass('hide');
			        commentTextarea.addClass('hide');
			        

			        commentTextarea.summernote('destroy');

			        $(`.comment_action_${id}`).removeClass('hide');
			        let saveButton = $(`a[data-id="${id}"]#a_btn_save_comment`);
			        let cancelButton = $(`a[data-id="${id}"]#a_btn_cancel_comment`);
			        
			        if (saveButton.length) {
			            saveButton.addClass('hide');
			        }

			        if (cancelButton.length) {
			            cancelButton.addClass('hide');
			        }
			    });
				
				$(`a[data-id="${id}"]#a_btn_save_comment`).off('click').on('click', function() {
					let iParent = $("#inp_parent_reply").val();

					let comment = $(`#change_comment_${id}`).val();
					if(comment.trim() !== "") do_lc_save_comment(prj,comment,iParent,id)
				
				 });
			};

			



			$("#inp_comment").off("keypress").on("keypress", function(e){
				if(e.keyCode == pr_POST_KEY_ENTER){
					$("#btn_send_comment").click();
					return;
				}
				let comment = $(this).val();
				(!comment || !comment.length) && $("#inp_parent_reply").val("");
			})
			
			$("#div_list_item img:not(.avatar-xs)").off("click").on("click", function(){
				let src = $(this).attr("src");
				App.MsgboxController.do_lc_show({
					content 	: `<img src="${src}" style="width: 100%;">`,
					autoclose	: false,
					buttons 	: {
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
							classBtn	: "btn-primary",
						}
					}
				});
			})
		};

		var do_lc_send_comment = function(prj, comment, iParent){
			let cond 		= {id: prj.id, code: prj.code01, comment, iParent};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_COMMENTS, cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_send_comment_callback, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_lc_save_comment = function(prj, comment, iParent,cmtId){
					let cond 		= {id: prj.id, code: prj.code01, comment, iParent,cmtId};
					let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_COMMENTS, cond);

					let fSucces		= [];
					fSucces.push(req_gl_funct(null, do_lc_send_comment_callback, [prj]));

					let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
					App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_send_comment_callback = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				data && self.do_lc_get_prj_comments(prj, true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		var do_lc_del_comment = function(prj, idCmt){
			let cond 		= {id: prj.id, code:prj.code01, cmtId: idCmt};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost" , "SVNsoPostDel12H", cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_del_comment_callback, [prj, idCmt]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_del_comment_callback = function(sharedJson, prj, idCmt){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				self.do_lc_get_prj_comments(prj, true);
				$(".post-lement-content[data-id='"+ idCmt +"']").remove();
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	}
	//------------------------------End comment list-----------------------------------

	//------------------------------Start Stats prj-----------------------------------
	var PrjProjectEntTabStat 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		const self						= this;

		const pr_ctr_Ent				= App.controller.PrjProject.Ent;
		const pr_project				= App.controller.UI[pr_grpName];

		const pr_TYPE02_MAIN			= 0;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;

		this.do_lc_show_prj_stats = function(prj, mode){
			do_lc_show_content(prj, mode);
		}

		const do_lc_show_content = (prj, mode) => {
			do_lc_req_set_lstStats(prj)

			if(prj.typ02 !== pr_TYPE02_MAIN) {
				$("#div_prj_container_stat").remove()
			} else {
				 do_lc_show_statList(prj);
				$(".item-stat-show").prop("disabled",true); 
			}
		}

		const do_lc_req_set_lstStats = (prj) => {
			const prjMain = prj.prjMain

			if(prj.typ02 !== pr_TYPE02_MAIN) {
				prj.lstStatsClone 	= do_lc_req_def_stats(prjMain?prjMain.inf03:null)
				prj.lstStats 		= [...prj.lstStatsClone]
			} else {
				prj.lstStatsClone 	= do_lc_req_def_stats(prj.inf03)
				prj.lstStats 		= do_lc_req_def_stats()
			}
			// add logic for check is task and init status list for task view
			if(prj.isTask){
				if(prj.wfStat){
					do_lc_init_available_stats_for_task(prj)
				}
			}
			// end logic for check is task and init status list for task view
			
			do_lc_stat_selected(prj.lstStats, prj.stat)
			paramStat = prj.lstStatsClone
			}
					
			// add function for init status list for task view
			const do_lc_init_available_stats_for_task = (prj) =>{
				for(var stat of prj.lstStats){
					if(!prj.wfStat.includes(stat.id)){
						stat.show = 0
					}
				}
			}
			// end function for init status list for task view
		
			

		const do_lc_req_def_stats = (inf03) => {
			const defStats = [
				{
					id: pr_STAT_PRJ_NEW,
					lab: "new",
					trans: "prj_project_stat_100100",
					show: 1,
					ord: 1,
				},
				{
					id: pr_STAT_PRJ_TODO,
					lab: "tod",
					trans: "prj_project_stat_100200",
					show: 1,
					ord: 2,
				},{
					id: pr_STAT_PRJ_INPROGRESS,
					lab: "inp",
					trans: "prj_project_stat_100300",
					show: 1,
					ord: 3,
				},{
					id: pr_STAT_PRJ_DONE,
					lab: "don",
					trans: "prj_project_stat_100400",
					show: 1,
					ord: 4,
				},{
					id: pr_STAT_PRJ_DEPLOY,
					lab: "fai",
					trans: "prj_project_stat_100700",
					show: 1,
					ord: 5,
				},{
					id: pr_STAT_PRJ_TEST,
					lab: "tes",
					trans: "prj_project_stat_100500",
					show: 1,
					ord: 6,
				},{
					id: pr_STAT_PRJ_REVIEW,
					lab: "rev",
					trans: "prj_project_stat_100600",
					show: 1,
					ord: 7,
				},{
					id: pr_STAT_PRJ_UNRESOLVED,
					lab: "unr",
					trans: "prj_project_stat_100800",
					show: 1,
					ord: 9,
				},{
					id: pr_STAT_PRJ_CLOSED,
					lab: "clo",
					trans: "prj_project_stat_100900",
					show: 1,
					ord: 8,
				}
			]

			if(!inf03) return defStats;

			inf03 = JSON.parse(inf03)

			if(!inf03.stats) return defStats;

			return inf03.stats
		}

		const do_lc_stat_selected = (lstStats, stat) => {
			if(!lstStats) return

			for(const s of lstStats) {
				if(+s.id === +stat) {
					s.selected = true
					return
				}
			}
		}

		const do_lc_show_statList = (prj) => {
			prj.lstStatsClone = prj.lstStatsClone.sort(function(a, b) {
				return a.ord - b.ord;
			});
			

			$("#div_prj_stats").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_STAT, prj));
			do_lc_bindEvent_statList(prj);
		}

		const do_lc_bindEvent_statList = (prj) => {
		
			$("#btn_modify_stats").off("click").on("click", function(){
				$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
				$(".item-stat-show").removeAttr('disabled');

			})
			
			$("#btn_add_stat_lst").off("click").on("click", function() {
				const do_lc_req_max_attr = (arr, attr) => {
					if(!arr || arr.length <= 0) return;
				
					var max = -Infinity;
				
					for (var i = 0; i < arr.length; i++) {
						if (+arr[i][attr] > max) {
							max = +arr[i][attr];
						}
					}
				
					return max;
				}

				const do_lc_add_stat_lst = () => {
					const _content_stat = $("#inp_stat_cnt").val();
					const _show_stat = $("#inp_stat_show").is(":checked");
					if(!_content_stat || !_content_stat.trim().length)	return false;

					prj.lstStatsClone.push({
						id: do_lc_req_max_attr(prj.lstStatsClone, "id") + 1,
						lab: _content_stat.trim(),
						trans: null,
						show: _show_stat,
						ord: do_lc_req_max_attr(prj.lstStatsClone, "ord") + 1
					});
					do_lc_show_statList(prj);
					$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
					pr_ctr_Ent.do_lc_reqRole_User();
					App.MsgboxController.do_lc_close();
				}

				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_project_stats_msgbox_add"),
					content 	: `<div class="mb-4">
										<input class="form-control mb-2" id="inp_stat_cnt" type="text" placeholder="${$.i18n("prj_project_stat_enter_inp")}">
										<div class="ms-2 d-flex align-items-center">
											<label class="mb-0 mr-2">${$.i18n("prj_project_stat_enter_show")}</label>
											<input id="inp_stat_show" type="checkbox">
										</div>
									</div>`,
					autoclose	: false,
					buttons 	: {
						UPDATE : {
							lab 		: $.i18n("prj_project_stat_add"),
							funct 		: do_lc_add_stat_lst,
							classBtn	: "btn-primary",
							autoclose	: false
						},
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
						}
					}
				});
			})

			$(".item-stat-show").off("change").on("change", function(){
				const $this 	= $(this);
				const isCheck 	= $this.is(":checked");
				const {index} 	= $this.data();
				prj.lstStatsClone[index].show = isCheck;
				do_lc_show_statList(prj);
				$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
				pr_ctr_Ent.do_lc_reqRole_User();
			})

			$(".remove-item-stat").off("click").on("click", function(){
				const {index} 	= $(this).data();
				index > -1 && prj.lstStatsClone.splice(index, 1);
				do_lc_show_statList(prj);
				$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
			})

			$(".up-item-stat").off("click").on("click", function(){
				const {index} 	= $(this).data();
				const lstStats	= prj.lstStatsClone

				if (index === 0) {
					lstStats[index].ord = lstStats[lstStats.length - 1].ord
					for (let i = 1; i < lstStats.length; i++) {
						lstStats[i].ord -= 1;
					}
				} else {
					const ordTemp = lstStats[index].ord
					lstStats[index].ord = lstStats[index - 1].ord
					lstStats[index - 1].ord = ordTemp
				}

				do_lc_show_statList(prj);
				$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
			})

			$(".down-item-stat").off("click").on("click", function(){
				const {index} 	= $(this).data();
				const lstStats	= prj.lstStatsClone

				if (index === lstStats.length - 1) {
					lstStats[index].ord = lstStats[0].ord
					for (let i = 0; i < lstStats.length - 1; i++) {
						lstStats[i].ord += 1;
					}
				} else {
					const ordTemp = lstStats[index].ord
					lstStats[index].ord = lstStats[index + 1].ord
					lstStats[index + 1].ord = ordTemp
				}

				do_lc_show_statList(prj);
				$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
			})

			$(".edit-item-stat").off("click").on("click", function() {
				const {index} 		= $(this).data();
				let _content_stat 	= prj.lstStatsClone[index].lab;
				let _show_stat 		= +prj.lstStatsClone[index].show;
				if(!_content_stat)	return false;

				const do_lc_edit_stat_lst = () => {
					const _content_stat_new = $("#inp_stat_cnt").val();
					const _show_stat_new = $("#inp_stat_show").is(":checked");
					if(!_content_stat_new || !_content_stat_new.trim().length)	return false;

//					prj.lstStatsClone[index] = {
//						...prj.lstStatsClone[index],
//						lab: _content_stat_new.trim(),
//						show: _show_stat_new,
//					}
					
					prj.lstStatsClone[index].lab = _content_stat_new.trim();
					prj.lstStatsClone[index].show= _show_stat_new;
					
					do_lc_show_statList(prj);
					$("#a_btn_save_stats, #a_btn_cancel_stats")	.removeClass("hide");
					pr_ctr_Ent.do_lc_reqRole_User();
					App.MsgboxController.do_lc_close();
				}
				
				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_project_stats_msgbox_add"),
					content 	: `<div class="mb-4">
										<input class="form-control mb-2" id="inp_stat_cnt" value="${_content_stat}" type="text" placeholder="${$.i18n("prj_project_stat_enter_inp")}">
										<div class="ms-2 d-flex align-items-center">
											<label class="mb-0 mr-2">${$.i18n("prj_project_stat_enter_show")}</label>
											<input id="inp_stat_show" type="checkbox" ${_show_stat === 1 && "checked"}>
										</div>
									</div>`,
					autoclose	: false,
					buttons 	: {
						UPDATE : {
							lab 		: $.i18n("prj_project_stat_add"),
							funct 		: do_lc_edit_stat_lst,
							classBtn	: "btn-primary",
							autoclose	: false
						},
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
						}
					}
				});
			})

			$("#a_btn_save_stats").off("click").on("click", function(){
				let newPrj 		= {};
				
				newPrj.files 	= prj.files;
				newPrj 			= $.extend(false, prj, newPrj);
				
				if(newPrj.lstStatsClone) newPrj.inf03 = JSON.stringify({
					stats: newPrj.lstStatsClone
				});
				
				do_lc_save_prj_stat(newPrj, prj);
			})
			
			$("#a_btn_cancel, #a_btn_cancel02, #a_btn_cancel_stats").off("click").on("click", function(){
				pr_project.EntStat.do_lc_show_prj_stats(prj, false)
				self.do_lc_show_prj_content(prj);
			})

		}

		const do_lc_save_prj_stat = function(newPrj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(newPrj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjStat, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_afterSave_prjStat = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				prj 		= $.extend(true, prj, data);
				self.do_lc_show_prj_stats(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
	}

	//------------------------------End Stats prj-----------------------------------

	//------------------------------Start Content prj-----------------------------------
	var PrjProjectEntTabContent 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		const self						= this;
		const pr_TYPE01_INDUSTRY		= 1;
		const pr_TYPE01_INFORMATIQUE	= 2;
		const pr_TYPE01_BUISINESS		= 3;
		const pr_TYPE01_TRAVEL			= 4;
		const pr_project				= App.controller.UI[pr_grpName];

		const pr_ctr_Ent				= App.controller.PrjProject.Ent;

		const pr_TYPE02_MAIN			= 0;
		const pr_TYPE02_SUB				= 1;
		const pr_TYPE02_ELE				= 2;
		
		const pr_TYPE00_WORKFLOW		= 200;

		var dataWF						= null;
		var workflow  					= {};
		var members                     = {};
		var pr_isViewWorkflow			= false;
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_worker 		= 40;

		const pr_CHECK_NOT_FINISH 		= 1;
		const pr_CHECK_FINISH 			= 2;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;

		const pr_NB_RECORD_HISTORY		= 10;

		var pr_DEFAULT_VAL			    = 0;
		var pr_div_rating		        = ['#rating_01'];
		const pr_NUMBER_RECORD			= 2;
		var pr_LST_MEM			= null;

		const TAB_CONTENT 			= "content";
		const TAB_MEMBER 			= "member";
		const TAB_PRJ 				= "prj";
		const TAB_EPIC 				= "epic";
		const TAB_TASK 				= "task";
		
		const PRJ_BUDGET_TYPE 		= {0: "prj_project_budget_type_member"	, 10: "prj_project_budget_type_permanent", 20: "prj_project_budget_type_hardware", 
										   30:"prj_project_budget_type_software", 40:"prj_project_budget_type_different"};
		
		var Handlebars				=  require('handlebars');
		Handlebars.registerHelper("reqLevBudget", function(typ) {
			if(typ === undefined)	return "";
			return $.i18n(PRJ_BUDGET_TYPE[+typ]);
		});
		
		Handlebars.registerHelper('monthFormat', function(dateStr){
			return do_lc_convert_month(dateStr); 
		});
		
		Handlebars.registerHelper('formatDifference', function(differenceSum) {
		    if (differenceSum > 0) {
		        return new Handlebars.SafeString('<span style="color: green;">' + differenceSum + '</span>');
		    } else {
		        return new Handlebars.SafeString('<span style="color: red;">' + differenceSum + '</span>');
		    }
		});

		
		//---------------------- -------------------------------------------------
		this.do_lc_show_prj_content = function(prj, mode, isViewSprint){
			do_lc_show_content(prj, mode);
			do_lc_get_path_prj(prj);
		}
		
		//----------------------Get Path -------------------------------------------------
		const do_lc_get_path_prj = (prj) => {
			if([pr_TYPE02_PRJ].includes(prj.typ02))	return;
			
			do_lc_show_path			(prj);
			do_lc_show_backToParent (prj);
		}

		const do_lc_show_path = function (prj){
			if (!prj.path) return;
			$("#div_prj_path").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_PATH, prj.path));
		}
		
		const do_lc_show_backToParent = function (prj){
			if(!prj.prjPar) return;
			var   cont 	= $("#btn_back").data("url");
			const url 	= cont?cont.replace("#code", prj.prjPar.code01).replace("#id", prj.prjPar.id): "";
			$("#btn_back").data("url", url)
		}
		
		const do_lc_get_percent_sprint = ({id}) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_CALCUL_PERCENT_SPRINT, {prjId : id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_percent_response, [id]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_get_percent_response = (sharedJson, id) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let val05 = sharedJson.res_data;
				$("#val05").html(val05 + "%");
			}
		}
		//------------------------------Start content prj-----------------------------------

		var do_lc_show_content = function(prj, mode){
			if(prj.epicInf){
				let epics = prj.epicInf;
				let obj = epics.reduce((currentEpic, epic)=>{
					currentEpic[epic.id] = epic;
					return currentEpic;
				}, {});

				if(obj[prj.parent]) prj.epicName = obj[prj.parent].name;
			}
			
			if(prj.wfStat){
				if(!Array.isArray(prj.wfStat)){
					prj.isTask			= true
					var wfData			= JSON.parse(prj.wfStat)
					var lstStat					= []
					if(isJsonString(prj.userRole)){
						do_loop_get_wf_stats(wfData, lstStat, prj.stat, prj.userRole[`${prj.autUser02}`])
					}else{
						do_loop_get_wf_stats(wfData, lstStat, prj.stat, prj.userRole)
					}
					if(lstStat.length > 0){
						prj.wfStat		= lstStat
					}else{
						lstStat.push(data.stat)
						prj.wfStat		= lstStat
					}
					pr_project.EntStat.  do_lc_show_prj_stats	(prj, false, true);	
				}
			}
						
			$("#div_prj_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT, prj));
			
			$("#projectepic").find("option[value="+ prj.parent	+"]")	.attr("selected","selected");

			prj.lstClone = prj.descr02 ? JSON.parse(prj.descr02) : [];
			do_lc_show_checkList(prj);

			if(prj.stat == pr_STAT_PRJ_CLOSED){
				$("#div_star_eval").show();
				if(prj.val00 != null && prj.val00 != pr_DEFAULT_VAL) do_lc_show_evalutation(prj.val00, false);
				else do_lc_show_evalutation(pr_DEFAULT_VAL, true);
			}else{
				do_lc_show_evalutation(pr_DEFAULT_VAL, true);
			}

			//$("#btn_delete").remove();
			
			do_lc_bindEvent_content_prj(prj, mode);
			do_lc_bindEvent_resize();

			do_lc_init_element(prj);

			//--- if business , load client, if not, hide div
			if(prj.typ01 == pr_TYPE01_BUISINESS){
				
			} else {
				$("#div_prj_customers")	.html("");
			}

			pr_ctr_Ent.do_lc_reqRole_User();
			
			if(prj.stat == pr_STAT_PRJ_DONE) {
				let $parent = $(".val05").parent();
				$parent.find(".info-edit")	.off("click");
				$parent.find(".val05")	.removeClass("content-edit");
			}
		}
		
		function isJsonString(str) {
			if (typeof str === "object" && str !== null) {
			       try {
			           JSON.stringify(str);
			           return true;
			       } catch (e) {
			           return false;
			       }
			   }
			   return false;
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
		
		const do_lc_show_evalutation =  (eval, isDef) => {
			do_gl_bar_rating_init_one("eval01", eval);
			do_gl_bar_rating_show_all(pr_div_rating, "", null, eval, null );
			req_gl_bar_rating_value(pr_div_rating, eval);
			if(isDef) $("#div_star_eval").find("a[data-rating-value='"+ 1 +"']").removeClass("br-selected br-current");
		}

		const do_lc_show_checkList = (prj) => {
			//clone list check list
			$("#div_check_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_CHECK_LIST, prj));
			do_lc_bindEvent_checkList(prj);
		}

		const do_lc_bindEvent_checkList = (prj) => {
			$(".item-chk-box").off("change").on("change", function(){
				const $this 	= $(this);
				const isCheck 	= $this.is(":checked");
				const {index} 	= $this.data();
				prj.lstClone[index].stat = isCheck ? pr_CHECK_FINISH : pr_CHECK_NOT_FINISH;
				do_lc_show_checkList(prj);
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				pr_ctr_Ent.do_lc_reqRole_User();
			})

			$(".remove-item-chk").off("click").on("click", function(){
				const {index} 	= $(this).data();
				index > -1 && prj.lstClone.splice(index, 1);
				do_lc_show_checkList(prj);
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})

			$(".edit-item-chk").off("click").on("click", function() {
				const {index} 		= $(this).data();
				let _content_chk 	= prj.lstClone[index].item;
				if(!_content_chk)	return false;

				const do_lc_edit_chk_lst = () => {
					const _content_chk_new = $("#inp_chk_lst").val();
					if(!_content_chk_new || !_content_chk_new.trim().length)	return false;

					prj.lstClone[index].item = _content_chk_new.trim();
					do_lc_show_checkList(prj);
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					App.MsgboxController.do_lc_close();
				}

				App.MsgboxController.do_lc_show({
					title 		: $.i18n("prj_project_descr02_msgbox_edit"),
					content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" value="${_content_chk}" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
					autoclose	: false,
					buttons 	: {
						UPDATE : {
							lab 		: $.i18n("prj_project_descr02_edit"),
							funct 		: do_lc_edit_chk_lst,
							classBtn	: "btn-primary",
							autoclose	: false
						},
						CALCEL : {
							lab 		: $.i18n("common_btn_cancel"),
						}
					}
				});
			})
		}

		const do_lc_init_element = function(){
			
			$(".tmpicker").timepicker({//timepicker
				showMeridian: false,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			})
			
			setTimeout(function(){
				App.SummerNoteController.do_lc_show("#div_prj_info");
			},500);
		}

		var do_lc_bindEvent_content_prj = function(prj, mode){
//			let files = prj.avatar ? [prj.avatar] : [];
//			let	obj 		= {files};
			if(!prj.files)	prj.files = [];
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_content"), option);

			if(mode && mode == var_lc_MODE_NEW){
				$(".action-item-duplicate").remove();

				$("#div_prj_member"		).remove();
//				$("#div_prj_docs"		).remove();				
				$("#div_prj_comments"	).remove();
				$("#div_prj_epic"		).remove();
				$("#div_prj_task"		).remove();
				$("#div_prj_evaluation"	).remove();
				
//				$(".info-content").addClass("hide");			
//				$(".content-edit").removeClass("hide");
//				$("#div_prj_ent_file_avatar").removeClass("hide");
				
				$("#div_partner_funct").removeClass("hide");
				$("#btn_save").off("click").on("click", function(){
					prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
					
					let	data	 				= req_gl_data({
						dataZoneDom		: $("#div_prj_content"),
						oldObject 		: prj,
					});

					if(data.hasError)	return false;

					let newPrj 			= data.data;

					
//					newPrj.files	= newPrj.files.concat(obj.files);

					newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
					newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);

					newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;

					switch(parseInt(newPrj.stat)){
					case pr_STAT_PRJ_NEW		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_TODO		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_INPROGRESS : newPrj.val05 =  10; break;
					case pr_STAT_PRJ_REVIEW		: newPrj.val05 =  90; break;
					case pr_STAT_PRJ_DONE		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_CLOSED		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_DEPLOY		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
					}

					if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					do_lc_create_prj(newPrj, 1)
				})
				
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}

					pr_ctr_Ent.do_lc_reqRole_User();
				})

				$("#btn_add_chk_lst").off("click").on("click", function() {
					const do_lc_add_chk_lst = () => {
						const _content_chk = $("#inp_chk_lst").val();
						if(!_content_chk || !_content_chk.trim().length)	return false;
	
						prj.lstClone.push({item: _content_chk.trim()});
						do_lc_show_checkList(prj);
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
						pr_ctr_Ent.do_lc_reqRole_User();
						App.MsgboxController.do_lc_close();
					}
	
					App.MsgboxController.do_lc_show({
						title 		: $.i18n("prj_project_descr02_msgbox_add"),
						content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
						autoclose	: false,
						buttons 	: {
							UPDATE : {
								lab 		: $.i18n("prj_project_descr02_add"),
								funct 		: do_lc_add_chk_lst,
								classBtn	: "btn-primary",
								autoclose	: false
							},
							CALCEL : {
								lab 		: $.i18n("common_btn_cancel"),
							}
						}
					});
				})
				
			}else{
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						let $parents = $parent.closest(".card");
						$parents.find("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
						$parents.find("#a_btn_save02, #a_btn_cancel02")	.removeClass("hide");

					}

					pr_ctr_Ent.do_lc_reqRole_User();
				})

				$("#a_btn_save, #a_btn_save02, #a_btn_save_stats").off("click").on("click", function(){
					prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
					let	data	 				= req_gl_data({
						dataZoneDom		: $("#div_prj_content")
					});

					if(data.hasError)	return false;

					let newPrj 			= data.data;
					let oldStat 		= prj.stat; //get stat for check percent

					if(prj && (prj.userRole == pr_member_lev_reporter || prj.userRole == pr_member_lev_worker)){
						newPrj 			= Object.assign({}, prj);
						newPrj.stat 	= data.data.stat;
						newPrj.val05 	= data.data.val05;
					}else {

						var splHrBe = newPrj.dtBegin.time.split(":")
						var splHrEn = newPrj.dtEnd.time.split(":")

						if(splHrBe[0] * 1 < 10){
							splHrBe[0] = `0${splHrBe[0]}`
						}
						if(splHrEn[0] * 1 < 10){
							splHrEn[0] = `0${splHrEn[0]}`
						}

						newPrj.dtBegin.time = splHrBe.join(":")
						newPrj.dtEnd.time 	= splHrEn.join(":")

						newPrj.dtBegin 		= do_lc_convert_date(newPrj.dtBegin);
						newPrj.dtEnd 		= do_lc_convert_date(newPrj.dtEnd);

						const db = new Date(newPrj.dtBegin.replace(" " , "T"))
						const de = new Date(newPrj.dtEnd.replace(" ", "T"))

						if (de < db) {
							$('.input-daterange').css('border', '2px solid #FF6666');
							do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_save'));
							return false;
						} else {
							$('.input-daterange').css('border', ''); 
						}

						newPrj = $.extend(false, prj, newPrj);
					}

					newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;
					newPrj.val00    = null;

					switch(parseInt(newPrj.stat)){
					case pr_STAT_PRJ_NEW		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_TODO		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_INPROGRESS : 
						if(oldStat != newPrj.stat){
							newPrj.val05 =  10; 
						}else {
							//todo
						}
						break;
					case pr_STAT_PRJ_REVIEW		: newPrj.val05 =  90; break;
					case pr_STAT_PRJ_DONE		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_CLOSED		: 
						newPrj.val05 = 100; 
						newPrj.val00 = App.data.curEval.eval01;
						break;
					case pr_STAT_PRJ_DEPLOY		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
					}


					if (newPrj.avatar){
						if (!newPrj.files) newPrj.files = [];
						newPrj.files.push(newPrj.avatar);
					}
					
					if(newPrj.lstClone && newPrj.lstClone.length>0)	
						newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					if(newPrj.lstStatsClone && newPrj.lstStatsClone.length>0) 
						newPrj.inf03 = JSON.stringify({
							stats: newPrj.lstStatsClone
						});

					//---remove some fields before send to server
					delete newPrj.tree;
					delete newPrj.epicInf; 	
					delete newPrj.epicName;
					delete newPrj.epics;
					delete newPrj.tasks; 
					
					delete newPrj.lstClone;
					delete newPrj.lstStatsClone;
					delete newPrj.lstStats;
					delete newPrj.lstReport;
					
					delete newPrj.members;
					delete newPrj.userRole;
					
					
					self.do_lc_save_prj_content(newPrj, prj)

				})

				$("#a_btn_cancel, #a_btn_cancel02, #a_btn_cancel_stats").off("click").on("click", function(){
					pr_project.EntStat.do_lc_show_prj_stats(prj, false)
					self.do_lc_show_prj_content(prj);
				})

				$(".btn-reload").off("click").on("click", function(){
					let {name: typLoad} = $(this).data();
					do_lc_get_content_reload(prj, typLoad);
				})

				$("#btn_refresh_content").off("click").on("click", function() {
					do_lc_refresh_content(prj, prj.id, prj.code01);
				})

				$("#btn_delete").off("click").on("click", function() {
					App.MsgboxController.do_lc_show({
						title 		: $.i18n("prj_project_del_task_popup"),
						content 	: $.i18n("prj_project_del_task_popup_content"),
						css			: {"max-width": "400px"},
						autoclose	: false,
						buttons 	: {
							OK : {
								lab 		: $.i18n("common_btn_ok"),
								funct 		: do_lc_delete_content,
								param		: [prj, prj.id],
								classBtn	: "btn-primary",
							},
							CANCEL : {
								lab 		: $.i18n("common_btn_cancel"),
							}
						}
					});
					
					
				})

				$("#btn_duplicate_content").off("click").on("click", function() {
					do_lc_duplicate_content(prj);
				})

				$("#btn_add_avatar").off("click").on("click", function(){
					$("#div_prj_ent_file_avatar").removeClass("hide");
					$(this).addClass("hide");
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				})
				$("#btn_search_file").off("click").on("click", function(){
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_project_find_file"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_FILES_ENT_POPUP_SEARCH_FILE, {}),
						autoclose	: false,
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
								funct		: do_lc_search_file,
								param		: [prj],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
						}
					});	
				})
				
				$("#btn_add_chk_lst").off("click").on("click", function() {
					const do_lc_add_chk_lst = () => {
						const _content_chk = $("#inp_chk_lst").val();
						if(!_content_chk || !_content_chk.trim().length)	return false;
	
						prj.lstClone.push({item: _content_chk.trim()});
						do_lc_show_checkList(prj);
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
						pr_ctr_Ent.do_lc_reqRole_User();
						App.MsgboxController.do_lc_close();
					}
	
					App.MsgboxController.do_lc_show({
						title 		: $.i18n("prj_project_descr02_msgbox_add"),
						content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
						autoclose	: false,
						buttons 	: {
							UPDATE : {
								lab 		: $.i18n("prj_project_descr02_add"),
								funct 		: do_lc_add_chk_lst,
								classBtn	: "btn-primary",
								autoclose	: false
							},
							CANCEL : {
								lab 		: $.i18n("common_btn_cancel"),
							}
						}
					});
				})
				
				$("#btn_show_history").off("click").on("click", function() {
					do_gl_init_msgbox_annonce(`<div id="div_history_list"></div><div id="div_history_pagination"></div>`, null, $.i18n("prj_history_title"));
					do_lc_get_history(prj);
				})

				$("#btn_show_wf").off("click").on("click", function() {
					if (dataWF != null) {
						App.MsgboxController.do_lc_show({
							title		: $.i18n("prj_title_workflow_view"),
							content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_WORKFLOW_VIEW		, {}),	
							autoclose	: false,
							buttons		: {
								NO: {
									lab		:  $.i18n("common_btn_cancel"),
								}
							},
						});	
						do_lc_show_work_flow(dataWF);
					} else {
						do_gl_show_Notify_Msg_Error ($.i18n('workflow_err_msg_show'));
					}
				})
				
				if(prj.autUser01 == App.data.user.id){
					$("#div_star_eval a").on("click", function() {
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					})
				}else{
					$("#div_star_eval a").css("pointer-events","none");
				}
			}

			
			$("#div_prj_content_01 img").off("click").on("click", function(){
				const viewer = new Viewer(document.getElementById('div_prj_content_01'), {
					hide: function () {
						viewer.destroy();
					},
				});

				// let src = $(this).attr("src");
				// App.MsgboxController.do_lc_show({
				// 	content 	: `<img src="${src}" style="width: 100%;">`,
				// 	autoclose	: false,
				// 	buttons 	: {
				// 		CALCEL : {
				// 			lab 		: $.i18n("common_btn_cancel"),
				// 			classBtn	: "btn-primary",
				// 		}
				// 	}
				// });
			});
			
			$("#btn_budget").off("click").on("click", function() {
				do_lc_show_budget(prj);
			});
			if ((prj.members || pr_members)?.some(member => member.entId02 === App.data.user.id && (member.lev === 0 || member.lev === 10))) $("#btn_mem_manager").removeClass('hide');

			$("#btn_mem_manager").on('click', function() {
				console.log(prj);
				prj.tree = prj.tree || {};
				prj.tree.epics = prj.tree.epics || pr_epics;
				prj.members = prj.members || pr_members;
				
				prj.lstClone = {};
				pr_LST_MEM = null;
				refreshLstStat(prj);
				do_lc_show_mem_manager(prj);
				do_lc_show_table_mem_manager();
				updateLstStat(prj);
				
				$("#choose_multi_lev option").each(function() {
			        $(this).prop('selected', true).addClass('active');
			    });
				
			    $(".task-item").removeClass('hide');
				
				$("#choose_multi_stat").multiselect({
				    buttonWidth:"210px",
				    buttonText:function(){
				        return $.i18n('prj_project_stat_title')
				    }
				});
				$("#choose_multi_lev").multiselect({
				    buttonWidth:"210px",
				    buttonText:function(){
				        return $.i18n('prj_project_lev')
				    }
				});
				$('.multiselect').css({
				    'display': 'flex',
				    'justify-content': 'space-between',
				    'align-items': 'center'
				});
				
				$(".prj-toggle-stat").off("click").on("click", () => {
					$(".div-stat").toggleClass("show");
				});

				$(".prj-toggle-search").off("click").on("click", () => {
					$(".div-search").toggleClass("show");
				});
				
				$(".task-stat-cbx").off("change").on("change", function(){
					let val 				= +$(this).find('input').val();
					let option				= $(`#choose_multi_stat > option[value=${val}]`)
					let isSelected 			= $(option).is(":selected");

					const sInd 				= prj.lstStats.findIndex(s => s.id === val)
					if (sInd !== -1) {
						prj.lstStats[sInd].show = isSelected ? true : false;
						let columnIndex = $(`th[data-stat="${val}"]`).toggle(isSelected).index();
						
						$(`#table-mem-manager tbody tr`).find(`td:eq(${columnIndex})`).toggle(isSelected);
				    }
				})
				
				$(".task-lev-cbx").off("change").on("change", function(){
					let values = $('.task-lev-cbx.active input[type="checkbox"]:checked').map(function() {
					    return $(this).val();
					}).get();
					refreshLstStat(prj);
					do_lc_show_mem_manager_content(prj, values);
					updateLstStat(prj);
					const selectedLevs = new Set($("#choose_multi_lev").val().map(String));
					const $taskItems = $('.task-item');

					const toHide = [];
					const toShow = [];

					$taskItems.each(function() {
					    const lev = $(this).data('lev').toString();
					    (selectedLevs.has(lev) ? toShow : toHide).push(this);
					});
					if (toHide.length > 0) $(toHide).addClass('hide');
					if (toShow.length > 0) $(toShow).removeClass('hide');

				})
				
				$("#inp_search").off("keyup").on("keyup", function(){
					refreshLstStat(prj);
					$(".task-lev-cbx").removeClass('active');
					$(".task-lev-cbx").addClass('active');
					
					var searchkey = $(this).val();
					var membersToUse = pr_LST_MEM ? pr_LST_MEM : prj.members;

					prj.lstClone = getEpicsForMembers(membersToUse, prj.lstStats, searchkey);
					do_lc_show_mem_manager_content(prj);
					updateLstStat(prj);
				})
				show_hide_members();
			});
			
		};
		var do_lc_search_file = (prj) => {
			let ref              = req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVFileSearch");
			ref["id"]            = prj.id;
			ref["grpId"]         = prj.grp;
			ref["code"]          = prj.code01;
			ref["searchName"]    = $("#inp_name_file").val();

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_search_file_success, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		var do_lc_search_file_success = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_list_file").html("");
				let lst 	= sharedJson[App['const'].RES_DATA];
				let divFile = "";
				lst.forEach((e) => {
								console.log(e);
					tmpl 	=  "<a href='" + e.url  + "' target='_blank' class='mr-3 text-decoration-underline'>" + e.fName + "</a><br />";
					divFile += tmpl;
				});
				$("#div_list_file").append(divFile);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const refreshLstStat = function(prj) {
		    prj.lstStats.forEach(stat => {
		        stat.show = 1;
		        stat.ord = stat.id === 100800 ? 8 : stat.id === 100900 ? 9 : stat.ord;
		    });
		}

		const updateLstStat = function(prj) {
		    prj.lstStats.forEach(stat => {
		        let isChecked   = $(`.task-stat-cbx input[value=${stat.id}]`).prop('checked');
		        stat.show = (isChecked !== null && isChecked !== undefined) ? isChecked : [100200, 100300, 100400, 100600].includes(stat.id);

		        $(`#choose_multi_stat option[value=${stat.id}]`).prop('selected', stat.show).toggleClass('active', stat.show);
		    });

		    $("#choose_multi_stat").trigger('change');
		    $("#choose_multi_stat option").each(function() {
		        let val         = +$(this).val();
		        let isSelected  = $(this).prop("selected");
		        const sInd      = prj.lstStats.findIndex(s => s.id === val);
		        if (sInd !== -1) {
		            prj.lstStats[sInd].show = isSelected ? true : false;
		            let columnIndex = $(`th[data-stat="${val}"]`).toggle(isSelected).index();
		            $(`#table-mem-manager tbody tr`).find(`td:eq(${columnIndex})`).toggle(isSelected);
		        }
		    });
		}
		
		const getEpicsForMembers 	= (members, lstStats, searchKey = null) => {
		    var paramStatArr        = [ {id: 100100, ord: 1}, {id: 100200, ord: 2}, {id: 100300, ord: 3}, {id: 100400, ord: 4}, {id: 100700, ord: 5},
		                                        {id: 100500, ord: 6}, {id: 100600, ord: 7}, {id: 100800, ord: 8}, {id: 100900, ord: 9}, 
		                                    ]
		    const memberMap         = new Map();
		    const statSet           = new Set(lstStats.map(stat => stat.id));
		    const lowerSearchKey    = searchKey ? searchKey.toLowerCase() : null;

		    members.forEach(member => {
		        const memberId      = member.ent02.id;
		        memberMap.set(memberId, {
		            memberInfo: member.ent02,
		            epicsByStat: Object.fromEntries(lstStats.map(stat => [stat.ord, []]))
		        });
		    });

		    pr_epics.forEach(epic => {
		        const matchesSearchKey  = !lowerSearchKey || (epic.name && epic.name.toLowerCase().includes(lowerSearchKey));

		        if (matchesSearchKey && Array.isArray(epic.members)) {
		            epic.members.forEach(member => {
		                const memberId  = member.ent02.id;
		                const statId    = epic.stat;

		                if (memberMap.has(memberId) && statSet.has(statId)) {
		                    const stat  = paramStatArr.find(s => s.id === statId);
		                    if (stat) {
		                        memberMap.get(memberId).epicsByStat[stat.ord].push(epic);
		                    }		                
		                }
		            });
		        }
		    });

		    return Object.fromEntries(memberMap);
		};
		
		const do_lc_show_mem_manager = function(prj) {
			prj.lstClone = getEpicsForMembers(prj.members, prj.lstStats);
			console.log(prj.lstClone);

		    App.MsgboxController.do_lc_show({
		        title		: $.i18n("prj_project_mem_manager"),
		        content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEM_MANAGER, prj),
		        autoclose	: true,
		        buttons 	: {},
		        onClose		: () => {
		            members 	= {};
		    //									membersDel  = [];
		            files		= {files: []};
		            customers   = [];
		            customersAdd= [];
		            customersDel= [];
		        },
		        css: {
		            "max-width"	: "90%",
		            "min-width"	: "350px",
		            "display"	: "flex",
		            "margin"	: "auto",
					"min-height": "100%",
					"max-height": "100%"
		        }
		    });
			
			do_lc_show_mem_manager_content(prj);
		    do_lc_show_list_mem(prj);
		};
		
		const do_lc_show_mem_manager_content = function(prj, lev) {
			lev = lev ?? ["1", "2", "3", "4"];
			const data = {prj: prj, lev: lev};
			$("#table-mem-manager-content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MEM_MANAGER_CONTENT, data));
		}
		
		const do_lc_show_list_mem = function(prj) {
		    if (!prj || !Array.isArray(prj.members) || prj.members.length === 0) return;
		    const formatName = (per) => { return per.name01 + (per.name02 ? " " + per.name02 : "") + (per.name03 ? " " + per.name03 : "");};

		    const 	placeholder = `<img src='www/img/logo/logo.png' class='rounded-circle mr-2 avatar-xs avatar-autocomplete' style='border: 0.1px solid grey; background-color: white;' alt="">${$.i18n("prj_project_list_mem")}`,
		            currentVal = $("#sel_mem_filter").val(),
		            selectData = [{
		                id: '-1',
		                text: placeholder
		            }, ...prj.members.map(item => ({
		                id: item.ent02.id,
		                text: item.ent02.avatar
		                        ? `<img src='${item.ent02.avatar.urlPrev || item.ent02.avatar.url || 'www/img/logo/logo.png'}' class='rounded-circle avatar-xs mr-2 avatar-autocomplete' style='border: 0.1px solid grey; background-color: white;' alt="">${formatName(item.ent02.per)}`
		                        : `<div class="media align-items-center"><div class='rounded-circle avatar-xs text-white mr-2 text-uppercase text-center avatar-autocomplete' style="background-color: ${var_gl_colors[var_gl_alphabet.indexOf(item.ent02.login01.charAt(0).toLowerCase())]}">
		                            <div class="text-middle">${item.ent02.login01.charAt(0) + item.ent02.login01.slice(-1)}</div></div>${formatName(item.ent02.per)}</div>`
		            }))];
		            
		    $("#sel_mem_filter").select2({ 
		        width: '100%', 
		        data: selectData, 
		        placeholder, 
		        escapeMarkup: m => m 
		    }).val(currentVal).trigger('change.select2');

		    $("#sel_mem_filter").on('change', () => {
				let memid = parseInt($("#sel_mem_filter").val());
				if (memid === -1) {
				    $("#sel_mem_filter").val(null);
				}
		        refreshLstStat(prj);
		        $(".task-lev-cbx").removeClass('active');
		        $(".task-lev-cbx").addClass('active');
		        
		        let members = memid === -1 ? prj.members : prj.members.filter(member => member.ent02.id === memid);
		        pr_LST_MEM = members;
		        prj.lstClone = getEpicsForMembers(members, prj.lstStats);
		        do_lc_show_mem_manager_content(prj);
		        do_lc_show_table_mem_manager(memid);

		        updateLstStat(prj);
		    });
		    
		};
		
		const show_hide_members = function() {
			$('.btn-hide-mem').removeClass('hide');
		    $('.btn-hide-mem').click(function() {
		        let memId = $(this).val();
		        $(`tr[data-memid="${memId}"]`).hide();
		    });
		}
		
		const do_lc_show_table_mem_manager = function(memid) {
			
			if (memid === -1 || memid === null || memid === undefined) {
			    $('.modal-content').css({
			        'max-height': '100%', 
			        'min-height': '100%', 
			    });

			    $('.modal-body  '   ).css({
					'max-height': '80%', 
			        'min-height': '80%',
				});

			    updateTableHeight();
				show_hide_members();
			} else {
			    $('.modal-content').css({
			        'max-height': '', 
			        'min-height': '', 
			    });
			    
			    $('.modal-body  '   ).css({'height': ''  });
			    
				$('.task-tab-content, .member-info').css('height', '');
				$('#table-mem-manager').css({
			        'height'    : '90%'
			    });
				$('.btn-hide-mem').addClass('hide');
			}
		};
		
		const updateTableHeight = function() {
		    const isSmallScreen = window.innerWidth < 1000 && window.innerHeight < 900;

		    if (isSmallScreen) {
		        $('#table-mem-manager').css({
		            'max-height': '65%', 
		            'min-height': '65%', 
		        });
		    } else {
		        $('#table-mem-manager').css({
		            'max-height': '95%', 
		            'min-height': '90%', 
		        });
		    }
		}
		window.addEventListener('resize', updateTableHeight);
		//------------------------POPUP-BUDGET----------------------------//
 
		var pr_BUDGET_TEM = {};
		var pr_BUDGET_TEM_COPY = {};
		const do_lc_show_budget = (prj) => {
			App.MsgboxController.do_lc_show({
				title		: $.i18n("prj_project_title_budget_view"),
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_HEADER_POPUP, pr_BUDGET_TEM),	
				autoclose	: false,
				buttons		: {
					Ok: {
						lab		:  $.i18n("common_btn_ok"),
						classBtn	: "btn-primary"
					},
				},
			});	
			do_lc_bind_event_budget(prj);	
		}
		
		const do_lc_bind_event_budget = function(prj) {
			$('.remove-btn').addClass('hide');
		    $('#a_btn_sav, #a_btn_can').addClass('hide');
		    
			$('#tab1').addClass('active show');	
			$('#li-tab-budget-detail').addClass('active');
			do_lc_show_monthPicker(prj, null);
			
			$('#hnv-main-menu li').on('click', function(){
		        $('#hnv-main-menu li').removeClass('active');
		        $('.tab-content .tab-pane').removeClass('active');
		
		        $(this).addClass('active');
		        var target = $(this).find('a').attr('href');
		        $(target).addClass('active');
			    do_lc_bind_event_overview(prj);
			    
		    });
		 
		    $('#btn_new_budget').on('click', function() {
				do_lc_get_list_budget(prj);
			});
		}
		
		//---------------------Tab-overview----------------------------
		const do_lc_bind_event_overview = (prj) => {
			$('#dtBeginMonth').datepicker({
		        viewMode: 'months',
		        format: 'mm/yyyy',
		        minViewMode: 'months',
		        language:'vn',
			});
			
		    $('#dtEndMonth').datepicker({
		        viewMode: 'months',
		        format: 'mm/yyyy',
		        minViewMode: 'months',
		        language:'vn',
			});
			
			$('#dtBeginMonth, #dtEndMonth').on('change', function() {
			    var startMonth = $('#dtBeginMonth').val();
			    var endMonth = $('#dtEndMonth').val();
			    
			     if (startMonth && endMonth) {
			        
			        var startParts = startMonth.split('/');
				    var endParts = endMonth.split('/');
				    
				    var startDate = new Date(startParts[1], startParts[0] - 1);
				    var endDate = new Date(endParts[1], endParts[0] - 1); 
			        
			        if (startDate <= endDate) {
			          do_lc_get_list_dyn_budget(prj, startMonth, endMonth);
			          $('#dtBeginMonth').datepicker('hide');
            			$('#dtEndMonth').datepicker('hide');
			        }
			    }
			});
		
				var table_tab_detail = $("#tab2")[0];
				$('.copy_codee').addClass('hide');
			 	const toPDF = function(table_tab_detail){
			 	const html = `<div class="tab-content tab-custom-st">
			 	<style>
			 		#dtBeginMonth,#dtEndMonth{
			 			display: none;
			 		}
			 		.info-edit{
			 			display: none;
			 		}
			    	.apexcharts-toolbar { display: none; }
			    	.dl-none{display: none;}
			    	.table-responsive {max-height: none !important;	overflow: visible !important;}
					 table {page-break-inside: avoid;width: 100%; }
					th, td {text-align: center;border: 1px solid #000;}
			   
				</style>
			 		${table_tab_detail.innerHTML}
			 	
			 	</div>`;
				 	const window_new = window.open();
				 	window_new.document.write(html);
				 setTimeout(()=>{
				 window_new.print();
				 window_new.close();
				 },200)
			 	
			 }
			$("#a_btn_export").off("click").on("click", function() {
				
				toPDF(table_tab_detail);
			
			});
		};
		
		
		const do_lc_get_list_dyn_budget = function(prj, startMonth, endMonth){
				const ref 				= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVBudgetLstDyn", {id :prj.id, code: prj.code01, begin: startMonth, end: endMonth});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_get_list_dyn_budget, [prj, startMonth, endMonth]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_get_list_dyn_budget = function(sharedJson, prj, startMonth, endMonth){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				data['list'] = data;
				for(let i = 0; i < data.list.length; i++){
					data.list[i].inf01 = JSON.parse(data.list[i].inf01);
				}
				do_lc_show_table_budget(data);
				
				do_lc_show_chart(data);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		
		const do_lc_convert_month = function(dateStr){
			 if (typeof dateStr !== 'string' || !dateStr.includes('/')) {
	            return '';
	         }
	         var parts = dateStr.split('/');
	         return parts[0]; 
		}
		
		const do_lc_show_table_budget = function(data){
			let totalSum = 0;
			let budgetSum = 0;
			let differenceSum = 0;
			
			for(let i = 0; i < data.list.length; i++){
		        if (data.list[i].inf01.total) {
		            totalSum += parseFloat(data.list[i].inf01.total);  
		        }
		        if (data.list[i].inf01.budget) {
		            budgetSum += parseFloat(data.list[i].inf01.budget);  
		        }
		        if (data.list[i].inf01.difference) {
		            differenceSum += parseFloat(data.list[i].inf01.difference);  
		        }
			}
			
			data['totalSum'] = totalSum;
			data['budgetSum'] = budgetSum;
			data['differenceSum'] = differenceSum;
			
			$("#table-budget").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET	, data));
		}
		
		const do_lc_show_chart = function(data){
			$("#div_chart_budget_real").html(tmplCtrl.req_lc_compile_tmpl("chart_budget_real"	, {}));
	        do_lc_build_chart_budget_real(data);
	        $("#div_chart_budget_plan1").html(tmplCtrl.req_lc_compile_tmpl("chart_budget_plan1"	, {}));
	        do_lc_build_chart_budget_plan1(data);
	        $("#div_chart_budget_plan").html(tmplCtrl.req_lc_compile_tmpl("chart_budget_plan"	, {}));
	        do_lc_build_chart_budget_plan(data);
	        $("#div_chart_budget_real1").html(tmplCtrl.req_lc_compile_tmpl("chart_budget_real1"	, {}));
			do_lc_build_chart_real1(data);
		}
		
		const do_lc_build_chart_budget_real = (data) => {
		    let arr = [];
		    let aStaff = [];
		    let aPermanent = [];
		    let aOther = [];
		    let aSoftware = [];
		    let aHardware = [];
		    
		    let staff = 0;
		    let permanent = 0;
		    let other = 0;
		    let software = 0;
		    let hardware = 0;
		    
		    for (let i = 0; i < data.list.length; i++) {
		        arr.push("Tháng " + do_lc_convert_month(data.list[i].inf02));
		        
		        for (let j = 0; j < data.list[i].inf01.list.length; j++) {
		            if (data.list[i].inf01.list[j].total !== "") {
		                if (data.list[i].inf01.list[j].typ === "0") {
		                    staff += parseFloat(data.list[i].inf01.list[j].total);
		                }
		                if (data.list[i].inf01.list[j].typ === "10") {
		                    permanent += parseFloat(data.list[i].inf01.list[j].total);
		                }
		                if (data.list[i].inf01.list[j].typ === "30") {
		                    software += parseFloat(data.list[i].inf01.list[j].total);
		                }
		                if (data.list[i].inf01.list[j].typ === "20") {
		                    hardware += parseFloat(data.list[i].inf01.list[j].total);
		                } if(data.list[i].inf01.list[j].typ === "40") {
		                    other += parseFloat(data.list[i].inf01.list[j].total);
		                }
		            }
		        }
		        
		        aStaff.push(staff);
		        aPermanent.push(permanent);
		        aOther.push(other);
		        aSoftware.push(software);
		        aHardware.push(hardware);
		    }
		    
		    const options = {
		        chart: {
		            type: 'bar',
		            height: '300px',
		            stacked: true 
		        },
		        title: {
		            text: $.i18n('prj_project_chart_budget_real'),
		            align: 'center', 
		            style: {
		                fontSize: '16px',
		                fontWeight: 'bold',
		                color: '#263238'
		            }
		        },
		        series: [
		            {
		                name: $.i18n('prj_project_budget_staff'),
		                data: aStaff,
		                color: '#B3E5FC', 
		            },
		            {
		                name: "phần mềm",
		                data: aSoftware,
		                color: '#81D4FA', 
		            },
		            {
		                name: "phần cứng",
		                data: aHardware,
		                color: '#4FC3F7',
		            },
		            {
		                name: $.i18n('prj_project_budget_permanent'),
		                data: aPermanent,
		                color: '#29B6F6', 
		            },
		            {
		                name: $.i18n('prj_project_budget_other'),
		                data: aOther,
		                color: '#039BE5',
		            }
		        ],
		        xaxis: {
		            categories: arr  
		        },
		        dataLabels: {
		            enabled: false
		        },
		        tooltip: {
		            theme: 'dark',
		            x: {
		                formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
		                    return `${value} : ${w.globals.series[seriesIndex][dataPointIndex]} ${$.i18n("prj_project_budget_unit_vnd")}`;
		                }
		            },
		        },
		        fill: {
		            colors: ['#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#039BE5']  
		        },
		        plotOptions: {
		            bar: {
		                horizontal: false,
		                borderRadius: 4,
		            }
		        }
		    };
		    
		    const chart = new ApexCharts(document.querySelector("#div_chart_budget_real"), options);
		    chart.render();
		}

		
		const do_lc_build_chart_budget_plan1 = (data) => {
			let arr = [];
		    let aStaff = [];
		    let aPermanent = [];
		    let aOther = [];
		    let aSoftware = [];
		    let aHardware = [];
		    
		    let staff = 0;
		    let permanent = 0;
		    let other = 0;
		    let software = 0;
		    let hardware = 0;
			for(let i = 0; i < data.list.length; i++){
				arr.push("Tháng " + do_lc_convert_month(data.list[i].inf02));
				
				for(let j = 0; j< data.list[i].inf01.list.length; j++ ){
					if(data.list[i].inf01.list[j].total !== ""){
						if(data.list[i].inf01.list[j].typ === "0"){
						staff += parseFloat(data.list[i].inf01.list[j].total);
						}
						if(data.list[i].inf01.list[j].typ === "10"){
							permanent += parseFloat(data.list[i].inf01.list[j].total);
						}
						if (data.list[i].inf01.list[j].typ === "30") {
		                    software += parseFloat(data.list[i].inf01.list[j].total);
		                }
		                if (data.list[i].inf01.list[j].typ === "20") {
		                    hardware += parseFloat(data.list[i].inf01.list[j].total);
		                }
						if(data.list[i].inf01.list[j].typ === "40") {
		                    other += parseFloat(data.list[i].inf01.list[j].total);
		                }
					}
					
				}
				
				aStaff.push(staff);
				aPermanent.push(permanent);
				aOther.push(other);
				aSoftware.push(software);
		        aHardware.push(hardware);
			}
			
			const options = {
				chart: {
					type: 'bar',
					height: '300px',
					stacked: false  
				},
				title: {
					text: $.i18n('prj_project_chart_budget_plan'),
					align: 'center',
					style: {
						fontSize: '16px',
						fontWeight: 'bold',
						color: '#263238'
					}
				},
				series: [
					{
						name: $.i18n('prj_project_budget_staff'),
						data: aStaff,
						color: '#B3E5FC',
					},
					{
		                name: $.i18n('prj_project_budget_soft'),
		                data: aSoftware,
		                color: '#81D4FA', 
		            },
		            {
		                name: $.i18n('prj_project_budget_hard'),
		                data: aHardware,
		                color: '#4FC3F7',
		            },
					{
						name: $.i18n('prj_project_budget_permanent'),
						data: aPermanent,
						color: '#29B6F6', 
					},
					{
						name: $.i18n('prj_project_budget_other'),
						data: aOther,
						color: '#039BE5',
					}
				],
				xaxis: {
					categories: arr   
				},
		        dataLabels: {
		          enabled: false
		        },
				tooltip: {
					theme: 'dark',
					x: {
						formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
							return `${value} : ${w.globals.series[seriesIndex][dataPointIndex]} ${$.i18n("prj_project_budget_unit_vnd")}`;
						}
					},
				},
				fill: {
					colors: ['#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#039BE5'] 
				},
				plotOptions: {
					bar: {
						horizontal: false, 
						borderRadius: 4,
						
					}
				}
			};
			
			const chart = new ApexCharts(document.querySelector("#div_chart_budget_plan1"), options);
			chart.render();
			
		};
		
		const do_lc_build_chart_budget_plan = (data) => {
			let arr = [];
			let budget =[];
			let difference = [];
			let total = [];
			for(let i = 0; i < data.list.length; i++){
				arr.push("Tháng " + do_lc_convert_month(data.list[i].inf02));
				budget.push(data.list[i].inf01.budget);
				difference.push(data.list[i].inf01.difference);
				total.push(data.list[i].inf01.total);
			}
			const options = {
				chart: {
					type: 'bar',
					height: '300px',
					stacked: false  
				},
				title: {
					text: $.i18n('prj_project_chart_budget_plan'),
					align: 'center',
					style: {
						fontSize: '16px',
						fontWeight: 'bold',
						color: '#263238'
					}
				},
				series: [
					{
						name: $.i18n('prj_project_title_budget_view'),
						data: budget,
						color: '#6DE4E8'
					},
					{
						name: $.i18n('prj_project_budget_real'),
						data: total,
						color: '#41B7D5' 
					},
					{
						name: $.i18n('prj_project_budget_difference'),
						data: difference,
						color: '#5896BB'
					}
				],
				xaxis: {
					categories: arr   
				},
		        dataLabels: {
		          enabled: false
		        },
				tooltip: {
					theme: 'dark',
					x: {
						formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
							return `${value} : ${w.globals.series[seriesIndex][dataPointIndex]} ${$.i18n("prj_project_budget_unit_vnd")}`;
						}
					},
				},
				fill: {
					colors: ['#6DE4E8', '#41B7D5','#5896BB'] 
				},
				plotOptions: {
					bar: {
						horizontal: false, 
						borderRadius: 4,
					}
				}
			};
			const chart = new ApexCharts(document.querySelector("#div_chart_budget_plan"), options);
			chart.render();
		}
		
		const do_lc_build_chart_real1 = (data) => {
			let arr = [];
			let aStaff =[];
			let aPermanent = [];
			let aOther = [];
			
			let staff =0;
			let permanent = 0;
			let other = 0;
			for(let i = 0; i < data.list.length; i++){
				arr.push("Tháng " + do_lc_convert_month(data.list[i].inf02));
				
				for(let j = 0; j< data.list[i].inf01.list.length; j++ ){
					if(data.list[i].inf01.list[j].total !== ""){
						if(data.list[i].inf01.list[j].typ === "0"){
						staff += parseFloat(data.list[i].inf01.list[j].total);
						}
						if(data.list[i].inf01.list[j].typ === "10"){
							permanent += parseFloat(data.list[i].inf01.list[j].total);
						}
						else{
							other += parseFloat(data.list[i].inf01.list[j].total);
						}
					}
					
				}
				
				aStaff.push(staff);
				aPermanent.push(permanent);
				aOther.push(other);
			}
			
			let budget =[];
			let difference = [];
			let total = [];
			for(let i = 0; i < data.list.length; i++){
				arr.push("Tháng " + do_lc_convert_month(data.list[i].inf02));
				budget.push(data.list[i].inf01.budget);
				difference.push(data.list[i].inf01.difference);
				total.push(data.list[i].inf01.total);
			}
			
			const options = {
				chart: {
					type: 'bar',
					height: '300px',
					stacked: false  
				},
				title: {
					text: $.i18n('prj_project_chart_budget_plan'),
					align: 'center',
					style: {
						fontSize: '16px',
						fontWeight: 'bold',
						color: '#263238'
					}
				},
				series: [
					{
						name: $.i18n('prj_project_title_budget_view'),
						data: budget,
						color: '#6DE4E8'
					},
					{
						name: $.i18n('prj_project_budget_real'),
						data: total,
						color: '#41B7D5' 
					},
					{
						name: $.i18n('prj_project_budget_difference'),
						data: difference,
						color: '#5896BB'
					}
				],
				xaxis: {
					categories: [$.i18n('prj_project_budget_staff'), $.i18n('prj_project_budget_permanent'), $.i18n('prj_project_budget_other')]   
				},
		        dataLabels: {
		          enabled: false
		        },
				tooltip: {
					theme: 'dark',
					x: {
						formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
							return `${value} : ${w.globals.series[seriesIndex][dataPointIndex]} ${$.i18n("prj_project_budget_unit_vnd")}`;
						}
					},
				},
				fill: {
					colors: ['#6DE4E8', '#41B7D5','#5896BB'] 
				},
				plotOptions: {
					bar: {
						horizontal: false, 
						borderRadius: 4,
						
					}
				}
			};

		
			const chart = new ApexCharts(document.querySelector("#div_chart_budget_real1"), options);
			chart.render();
		}
		
		//---------------End-tab-overview--------

		//-------------Tab-Detail-----------------
		
		//	show-schedule
		const do_lc_show_monthPicker = function(prj, list){
			$('#monthPicker').datepicker({
			        viewMode: 'months',
			        format: 'mm/yyyy',
				    minViewMode: 'months',
				    language:'vn',
			    });
			   
		    $('#monthPicker').off('click').on('changeDate', function(e) {
		    	const currentMonth = $('#monthPicker').val()
				$("#a_btn_sav, #a_btn_canc").addClass("hide");
				if (currentMonth === '') {
		        $('#tbody_budget').html(''); 
		        $('#ip_budget').val('');
		        $('#ip_total').val('');
		        $('#ip_difference').val('');
		        $('#dtBegin').val('');
		        $('#dtEnd').val('');
		        $(this).val('');
		    }
		
		    if (e.date) {
		        var selectedDate = e.date;
		        var month = selectedDate.getMonth() + 1;
		        var year = selectedDate.getFullYear();
		        
		        do_lc_show_date(month, year);
		
		        if (prj) {
		            let data = {};
		            data['id'] = prj.id;
		            data['code'] = prj.code01;
		            data['month'] = $('#monthPicker').val();
		
		            do_lc_get_budget(prj, data);
		        } else {
		            if (list && list.show_details === false) {
		                let monthYearKey = $('#monthPicker').val();
		                let listBudget = [];
		                for (let i = 0; i < list.length; i++) {
		                    if (list[i].inf02 === monthYearKey) {
		                        listBudget.push(list[i]);
		                    }
		                }
		                renderBudgetTable(listBudget);
		            }
		        }
		    }
		
		    $('#monthPicker').datepicker('hide');
		});
		
		    $('#calendar').on('click', function() {
		        $('#monthPicker').datepicker('show');
		    });
		}
		
	
		const renderBudgetTable = function(listBudget) {
		    $('#tbody_budget_new').empty();  
		    
			if (listBudget.length > 0) {
			    for (let i = 0; i < listBudget.length; i++) {
				    let newRow = `
				        <tr>
				            <td class="text-center">
				                <span class="font-size-12 edit-budget month">${listBudget[i].inf02}</span>
				            </td>
				            <td class="text-center">
				                <span class="font-size-12 edit-budget">${listBudget[i].inf01.total}</span>
				            </td>
				            <td class="text-center">
				                <button class="viewBudget" style="background: none; border: none; color: #007bff; cursor: pointer;">` + $.i18n('prj_project_budget_detail') + `</button>
				            </td>
				        </tr>
				    `;
				    
				    $('#tbody_budget_new').append(newRow);
				}
    			
				if ($('#tbody_budget_new').children().length > 0) {
				    $('#btn_new_budget').addClass('hide');
				}
				
    		}else{
			  $('#btn_new_budget').removeClass('hide');
			}
    		
		}
		
		const do_lc_show_date = function(month, year){
			var startDate = `01/${month}/${year}`;
		        
	        var nextMonth = month % 12 + 1;
	      	var nextMonthYear;

			if(nextMonth === 1) {
			    nextMonthYear = year + 1;
			} else {
			    nextMonthYear = year;
			}
			
	        var endDate = new Date(nextMonthYear, nextMonth - 1, 0);
	
	        var endDateFormatted = `${endDate.getDate() < 10 ? '0' : ''}${endDate.getDate()}/${endDate.getMonth() + 1 < 10 ? '0' : ''}${endDate.getMonth() + 1}/${endDate.getFullYear()}`;

	        $('#dtBegin').val(startDate);
	        $('#dtEnd').val(endDateFormatted);
		}
		const do_lc_bind_event_row_budget_copy = function(rowData) {
			var $lastRow = $('#tbody_budget tr:last');
			$lastRow.find('.typ_cost').val(rowData.typ);
			if(rowData.typ != 0)
			{
				$('.ip-name-member').off();
		        $('.ip-name-member').removeAttr('placeholder', $.i18n('prj_project_enter_name'));
		        $('.ip_content').removeClass('ip-name-member');
			}
			$lastRow.find('.copy-col-price').val(rowData.price);
			if (rowData.quantity) {
		        $lastRow.find('.copy-col-quantity').val(rowData.quantity);
		    }
		
		    if (rowData.total) {
		        $lastRow.find('.copy-col-total').val(rowData.total);
		    }
		
		    if (rowData.note) {
		        $lastRow.find('.copy-col-note').val(rowData.note);
		    }
			if (rowData.img) {
				let selectNameMember = $lastRow.find('.select-name-member');
				let inputNameMember = $lastRow.find('.ip-name-member');
		        let selOpt = `<div class='member-item' >`;
			      selOpt +=`<input type="text" data-group="inf01" data-gindex="list" data-name="member" class="hide row-budget inf-budget objData form-control remove-item-chk" value="${rowData.id}">`
		          if(rowData.img) {
		            selOpt += `<div><img src='${rowData.img}' class='rounded-circle avatar-xs'/> ${rowData.content}`;
		          } else {
		            selOpt += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${rowData.content}`;
		          }
		
		          selOpt += `<a data-id='${rowData.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
		          selOpt += `</div></div>`;
			        
			      selectNameMember.removeClass('hide');
			      selectNameMember.append(selOpt);
			      inputNameMember.addClass('hide');
		          do_lc_bind_event_autocomplete();
		    }
			else{
				$lastRow.find('#ip-content').val(rowData.content);
			}
			var price = parseFloat($lastRow.find('.copy-col-price').val()) || 0;
		    var quantity = parseFloat($lastRow.find('.copy-col-quantity').val()) || 0;
		    var rowTotal = price * quantity;
		    $lastRow.find('.copy-col-total').val(rowTotal);
		    var total = 0;
		    $('#tbody_budget tr').each(function() {
		        var rowTotal = parseFloat($(this).find('td').eq(5).find('input').val()) || 0;
		        total += rowTotal;
		    });
	
		    $('#ip_total').val(total);
			
		}
		const do_lc_bind_event_row_budget = function(prj) {
			    $('#tbody_budget').on('input', 'td:nth-child(4) input, td:nth-child(5) input', function() {
		        var $row = $(this).closest('tr');
		
		        var price = parseFloat($row.find('td').eq(3).find('input').val());
		        var quantity = parseFloat($row.find('td').eq(4).find('input').val());
				if (price < 0) {
		            do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_number_value'));
		            price = 0;
		            $row.find('td').eq(3).find('input').val(0);
		        }
		        
		        if (quantity < 0) {
		            do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_number_value'));
		            quantity = 0;
		            $row.find('td').eq(4).find('input').val(0);
		        }
		        var rowTotal = price * quantity;
		        $row.find('td').eq(5).find('input').val(rowTotal);
		
		        var total = 0;
		        $('#tbody_budget tr').each(function() {
		            var rowTotal = parseFloat($(this).find('td').eq(5).find('input').val()) || 0;
		            total += rowTotal;
		        });
		
		        $('#ip_total').val(total);
		    });
		
		    $('#ip_budget, #ip_total, #tbody_budget').on('input', function() {
		        var budget = parseFloat($('#ip_budget').val().replace(/,/g, ''));
		        var total = parseFloat($('#ip_total').val().replace(/,/g, '')) || 0;
		        
				if (isNaN(budget)) {
				    do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_number'));
				    return;
				}

		        var difference = budget - total;
		        $('#ip_difference').val(difference.toLocaleString('en'));
		        
		        if (difference > 0) {
		            $('#ip_difference').css('background-color', '#61f138');
		        } else if (difference < 0) {
		            $('#ip_difference').css('background-color', '#ff3b0a');
		        }
		    });
		
		    $('#tbody_budget').on('change', '.typ_cost', function() {
		        var selectedValue = $(this).val();
		        if (selectedValue !== '0') {
		            $('.ip-name-member').off();
		            $('.ip-name-member').removeAttr('placeholder', $.i18n('prj_project_enter_name'));
		            $('.ip_content').removeClass('ip-name-member');
		        } else {
		            $('.ip_content').addClass('ip-name-member');
		            $('.ip-name-member').attr('placeholder', $.i18n('prj_project_enter_name'));
		            $('.select-name-member').removeClass('hide');
		        }
		    });
			
		    $(".a_btn_copy-col").off("click").on("click", function() {
		    var $row = $(this).closest("tr");
		    var $memberElement = $row.find(".member-item");
    		var content, imgSrc,id;
			if($memberElement.length>0)
			{
				content = $memberElement.find(".media").text().trim();
				imgSrc = $memberElement.find("img").attr("src");
				id = $row.find("input[data-name='member']").val();
			}
			else{
				content = $row.find("input[data-name='content']").val();
				imgSrc = '';
				id='';
			}
		    var typ = $row.find(".typ_cost").val();
		    var price = $row.find("input[data-name='price']").val();
		    var quantity = $row.find("input[data-name='quantity']").val();
		    var total = $row.find("input[data-name='total']").val();
		    var note = $row.find("input[data-name='note']").val();
		
		    var rowData = {
		    	id :id,
		        typ: typ,
		        content: content,
		        img: imgSrc,
		        price: price,
		        quantity: quantity,
		        total: total,
		        note: note
		    };
		
		    do_lc_bind_event_new_row_table_copy(prj, rowData);
		});
		    var table_tab_detail = tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_PRINT, pr_BUDGET_TEM);
		 	const toPDF = function(table_tab_detail){
			 	const window_new = window.open();
			 	window_new.document.write(table_tab_detail);
			 setTimeout(()=>{
			 window_new.print();
			 window_new.close();
			 },200)
		 	
		 }
		$("#a_btn_export").off("click").on("click", function() {
			
			toPDF(table_tab_detail);
		
		});
		$("#a_btn_copy").off("click").on("click", function() {
			    App.MsgboxController.do_lc_show({
			        title: $.i18n("prj_project_budget_select_month"),
			        content: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_COPY, {}),
			        autoclose: true,
			        width: '30%',
			        buttons: {
			            SEND: {
			                lab: "<i class='mdi mdi-send'></i>",
			                className: 'btn-primary',
			                funct:do_lc_bind_event_edit_copy
			            }
			        }
			       
			    });
			     do_lc_bind_event_copy(prj);
			});
			
		};
		
		const do_lc_bind_event_copy = (prj) => {
		    $('#monthPickerCopy').datepicker({
		        viewMode: 'months',
		        format: 'mm/yyyy',
		        minViewMode: 'months',
		        autoclose: true
		    })
		    $('#monthPickerCopy').off('changeDate').on('changeDate', function(e) {
		        
			    if(prj) {
			        let data 		={};
    	
			        data['id'] 		= prj.id;
					data['code']	= prj.code01;
					data['month']	= $('#monthPickerCopy').val();
					
					const selectedMonth = $('#monthPickerCopy').datepicker('getDate');
		            const year = selectedMonth.getFullYear();
		            const month = selectedMonth.getMonth();
		
		            const dtBegin = new Date(year, month, 1);
		            data['dtBegin'] = formatDate(dtBegin);
		
		            const dtEnd = new Date(year, month + 1, 0);
		            data['dtEnd'] = formatDate(dtEnd);
					pr_BUDGET_TEM_COPY = data;
					do_lc_get_budget_copy(prj,data);
					
				}
		        
		    });
		    const formatDate = (date) => {
			    const day = String(date.getDate()).padStart(2, '0');
			    const month = String(date.getMonth() + 1).padStart(2, '0');
			    const year = date.getFullYear();
			    return `${day}/${month}/${year}`;
			};
		
		    $('#calendarCopy').on('click', function() {
		        $('#monthPickerCopy').datepicker('show');
		    });
		};
		
		const do_lc_bind_event_edit_copy = function(prj) {
		    if (pr_BUDGET_TEM_COPY) {
		        $("#monthPicker").val(pr_BUDGET_TEM_COPY.month);
		        $("#dtBegin").val(pr_BUDGET_TEM_COPY.dtBegin);
		        $("#dtEnd").val(pr_BUDGET_TEM_COPY.dtEnd);
		        
		        do_lc_bind_event_edit_budget();
		    }
		};
		
		
		const do_lc_get_budget_copy = function(prj, data){
				const ref 				= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVBudgetGet", {id :data.id, code: data.code, month: data.month});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_get_budget_copy, [prj]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_get_budget_copy = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				
				if(data !== null){
					data.inf01 = JSON.parse(data.inf01);
					if (data.inf01.list && Array.isArray(data.inf01.list)) {
		                for (let i = 0; i < data.inf01.list.length; i++) {
		                    data.inf01.list[i].stt = i + 1;
		                }
		            }		
				    pr_BUDGET_TEM_COPY = data;
					$("#btn_msgbox_SEND").hide();
					do_lc_bind_event_after_get_budget(data, prj);
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get_copy'));
				}else{
					$("#btn_msgbox_SEND").show();
				}
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}


			
		const do_lc_bind_event_save_budget = function(prj) {
			let	data	 				= req_gl_data({
					dataZoneDom		: $("#tab_detail")
			});
				
			data.data.inf01.budget = data.data.inf01.budget.replace(/,/g, '');
    		data.data.inf01.difference = data.data.inf01.difference.replace(/,/g, '');
    		data.data.inf01.total = data.data.inf01.total.replace(/,/g, '');
				
			data.data['id'] = prj.id;
			data.data['code'] = prj.code01;
			
			const rows = $('#tbody_budget').find('tr');
			const dataArray = [];
			
			
			for (let i = 0; i < rows.length; i++) {
			    const row = rows[i];
			    const inputs = $(row).find('input.inf-budget, select.inf-budget');
			    const dataObject = {};
			
			    inputs.each(function() {
			        const input = $(this);
			        const key = input.data('name');
			        let value = input.val();
			       	value = value.replace(/,/g, '');
			        dataObject[key] = value;
			    });
			    
				const avatarElement = $(row).find('.member-item img');
		        if (avatarElement.length > 0) {
		            dataObject.img = avatarElement.attr('src');
		        } else {
		            const login01 = $(row).find('.member-item').text().trim();
		            const first = login01.charAt(0);
		            const last = login01.charAt(login01.length - 1);
		            const textAvatar = first + last;
		            dataObject.textAvatar =textAvatar;
		        }
			
			    dataArray.push(dataObject); 
			}
			
			    data.data.inf01.list = dataArray;
			    do_lc_save_budget(prj, data.data);
			
		
		};
			
		// xu ly tim kiem member
		const do_lc_bind_event_new_row_table = function(prj) {
		    $("#a_btn_sav, #a_btn_canc")	.removeClass("hide");
	        var newRow = tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_LINE, {});
			
	        $('#tbody_budget').append(newRow);
	        let addedRow = $('#tbody_budget tr').last();
    		addedRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    do_lc_bind_event_row_budget(prj);
	        do_init_autocomplete_member(prj);
	        $('#removeRowBtn button').on('click', function() {
				$(this).closest('tr').remove();
			});
	       
		};
		const do_lc_bind_event_new_row_table_copy = function(prj,rowData) {
		    $("#a_btn_sav, #a_btn_canc")	.removeClass("hide");
	        var newRow = tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_BUDGET_LINE, {});
			
	        $('#tbody_budget').append(newRow);
	        let addedRow = $('#tbody_budget tr').last();
    		addedRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		    do_lc_bind_event_row_budget(prj);
		    do_lc_bind_event_row_budget_copy(rowData);
	        do_init_autocomplete_member(prj);
	        $('#removeRowBtn button').on('click', function() {
				$(this).closest('tr').remove();
				do_lc_bind_event_row_budget(prj);
			});
	       
		};
			
		
		const do_init_autocomplete_member = function(prj) {
			$('#tbody_budget').off('focus', '.ip-name-member').on('focus', '.ip-name-member', function() {
			    let el = $(this); 
			    let selectNameMember = $(this).closest('tr').find('.select-name-member'); 
			    
			    let members = {};
			
			    let customShowList = function(item, selOpt = ""){
			        if(item.avatar) {
			            return selOpt += `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
			        } else {
			            let textColor = null;
			            let textAvatar = null;
			            let first = item.login01.charAt(0);
			            let last = item.login01.charAt(item.login01.length - 1);
			            let index = var_gl_alphabet.indexOf(first.toLowerCase());
			            textColor = var_gl_colors[index];
			            textAvatar = first + last;
			            selOpt += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			            return selOpt;
			        }
			   }
			
			   let reqSelectMember = (event, item) => {
			      if(members[item.id]) return false;
			      let user = {"id": item.id};
			      let textColor = null;
			      let textAvatar = null;
			      if(!item.avatar){
			         let first = item.login01.charAt(0);
			         let last = item.login01.charAt(item.login01.length - 1);
			         let index = var_gl_alphabet.indexOf(first.toLowerCase());
			         textColor = var_gl_colors[index];
			         textAvatar = first + last;
			      }
			        
			      members[item.id] = user;
			
			      let selOpt = `<div class='member-item' >`;
			      selOpt +=`<input type="text" data-group="inf01" data-gindex="list" data-name="member" class="hide row-budget inf-budget objData form-control remove-item-chk" value="${item.id}">`
		          if(item.avatar) {
		            selOpt += `<div><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
		          } else {
		            selOpt += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;
		          }
		
		          selOpt += `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
		          selOpt += `</div></div>`;
			        
			      selectNameMember.removeClass('hide');
			      el.addClass('hide');
			      selectNameMember.append(selOpt); 
			        
			      el.blur().val("");
			      do_lc_bind_event_autocomplete(); 
			  }
			    
			  let typ01Arr = [App.data.user.typ01, 2, 3, 4, 5];
			  let typ01Str = typ01Arr.join(',');
			  let options = {
			      dataService: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			      svParams: {wAvatar: true, nbline: 20, typ01s: typ01Str, stats: 1}, 
			      hintService: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
			      hintSvParams: {wAvatar: true, typ01s: typ01Str, stats: 1, entId01: prj.grp},
			      fSelect: reqSelectMember, 
			      customShowList: customShowList
			  }
			
			  do_gl_req_autocompleteNew(el, options);
		   });
				
	 	};
		  
		const do_lc_bind_event_autocomplete = function() {
		    $(".btn-remove-member").off("click").on("click", function(){
		        let $this = $(this);
		        var $lastRow = $('#tbody_budget tr:last');
		        let parent = $this.closest('.member-item');
		        let $currentRow = $this.closest('tr');
		        let {id} = $this.data();
		
		        if(members[id]) delete members[id];
		        
		        parent.remove();  
		        
		        let $inputNameMember = $currentRow.find('.ip-name-member');
		        let $selectNameMember = $currentRow.find('.select-name-member');
				
				let $inputNameMemberLast = $lastRow.find('.ip-name-member');
		        let $selectNameMemberLast = $lastRow.find('.select-name-member');
				
		        $inputNameMember.removeClass('hide');
		        $selectNameMember.addClass('hide');
		        
		         $inputNameMemberLast.removeClass('hide');
		        $selectNameMemberLast.addClass('hide');
		    });
		}
	
		const do_lc_get_budget = function(prj, data){
				const ref 				= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVBudgetGet", {id :data.id, code: data.code, month: data.month});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_get_budget, [prj]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_get_budget = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				
				if(data !== null){
					data.inf01 = JSON.parse(data.inf01);
					if (data.inf01.list && Array.isArray(data.inf01.list)) {
		                for (let i = 0; i < data.inf01.list.length; i++) {
		                    data.inf01.list[i].stt = i + 1;
		                }
		            }
					$('#budget').html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_POPUP, data));
					
				    pr_BUDGET_TEM = data;
				    do_lc_bind_event_copy(prj);
					do_lc_bind_event_after_get_budget(data, prj);
				
					
				}else{
					$("#budget"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_POPUP, {}));
					
					do_lc_bind_event_edit_budget 		();
					do_lc_bind_event_budget				(prj);
					do_lc_bind_event_after_get_budget 	({}, prj);
				}
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_bind_event_edit_budget = function(){
			$('#a_btn_sav'	).removeClass('hide');
			$('.copy_code').removeClass('hide');
			$('#a_btn_canc'	).removeClass('hide');
			$('.inf-budget'	).removeClass('hide');
		    $('.remove-btn'	).removeClass('hide');
		    $('#addRowBtn'	).removeClass('hide');
			
			$('#ip_budget'	).removeAttr('disabled');
			$('.ip_hide').removeClass('hide');
			$('.edit-budget').addClass('hide');
		}
		
		const do_lc_bind_event_after_get_budget = (data, prj) => {
			do_init_autocomplete_member(prj);
			do_lc_bind_event_autocomplete(); 
     
			do_lc_bind_event_row_budget(prj);
			$('#addRowBtn').on('click', function() {
				do_lc_bind_event_new_row_table(prj);
		    });	
		
			$('.remove-btn').addClass('hide');
			$('#a_btn_sav').addClass('hide');
			$('.copy_code').addClass('hide')
			if (data && Object.keys(data).length > 0) {
		        $('.copy_codee').removeClass('hide');
		    } else {
		        $('.copy_codee').addClass('hide');
		    }

			$('#a_btn_canc').addClass('hide');
			
			if (data.inf01 && data.inf01.difference > 0) {
		       $('#ip_difference').css('background-color', '#61f138');
		    } else {
		       $('#ip_difference').css('background-color', '#ff3b0a');

		    }
			$('.edit-budget').on('click', function() {
		   		do_lc_bind_event_edit_budget();
		    });
		    
		    $('#removeRowBtn button').on('click', function() {
				$(this).closest('tr').remove();
				do_lc_bind_event_edit_budget();
				var total = 0;
			    $('#tbody_budget tr').each(function() {
			        var rowTotal = parseFloat($(this).find('td').eq(5).find('input').val()) || 0;
			        total += rowTotal;
			    });
			    $('#ip_total').val(total);
			});
		    
			
			$('#a_btn_sav').off('click').on('click', function() {
				 do_lc_bind_event_save_budget(prj);
		    });
		    
		    $('#a_btn_canc').on('click', function() {
				$("#budget").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_POPUP, pr_BUDGET_TEM));
				do_lc_bind_event_after_get_budget(data, prj);
			});
			
		}
		
		const do_lc_save_budget = function(prj, data){
				const ref 				= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVBudgetSave", {id :data.id, code: data.code, month: data.inf02, obj:JSON.stringify(data)});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_save_budget, [prj]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_save_budget = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				let data 	= sharedJson[App['const'].RES_DATA];
				data.inf01 = JSON.parse(data.inf01);
				
				if (data.inf01.list && Array.isArray(data.inf01.list)) {
	                for (let i = 0; i < data.inf01.list.length; i++) {
	                    data.inf01.list[i].stt = i + 1; 
	                }
	            }
				data.inf01.budget = parseFloat(data.inf01.budget);
				data.inf01.difference = parseFloat(data.inf01.difference);
				data.inf01.total = parseFloat(data.inf01.total);
				
				$("#budget").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_POPUP, data));
				pr_BUDGET_TEM = data;
				do_lc_bind_event_budget(prj);
				do_lc_bind_event_after_get_budget(data, prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_get_list_budget = function(prj){
				const ref 				= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVBudgetLst", {id :prj.id, code: prj.code01});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_get_list_budget, [prj]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_get_list_budget = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				
				let budget={};
				budget['list'] = data;
				
				for(i in budget.list){
					budget.list[i].inf01 = JSON.parse(budget.list[i].inf01);
				}
				
				$("#tab_detail").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_NEW_BUDGET_POPUP, budget));
				
				do_lc_bind_event_new_budget(budget.list, prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		
		const do_lc_bind_event_new_budget = function(budget, prj){
			 $('#btn_new_budget').addClass('hide');
		     $('#btn_new_budget').on('click', function() {
				$("#budget").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_CONTENT_BUDGET_POPUP, {}));
				$('#addRowBtn').removeClass('hide');
				$('#ip_budget').removeAttr('disabled');
				$("#a_btn_canc_new").removeClass("hide");
				$('#addRowBtn').on('click', function() {
					$("#a_btn_sav").removeClass("hide");
					do_lc_bind_event_new_row_table(prj);
			    });	
			    
				do_lc_bind_event_budget(prj);
			 });
			  
			 $('#a_btn_sav').on('click', function() {
				do_lc_bind_event_save_budget(prj);
			 });

			 
			$('#a_btn_canc_new').on('click', function() {
				do_lc_get_list_budget(prj);
		 	});
			 budget['show_details'] =  false;
			 do_lc_show_monthPicker(null, budget);
			
			
			$('#tbody_budget_new').on('click', '.viewBudget', function() {
				budget['show_details'] =  true;
				let currentRow = $(this).closest('tr');
				let inf02 = currentRow.find('.month').text().trim();
				let data 		={};
		        data['id'] 		= prj.id;
				data['code']	= prj.code01;
				data['month']	= inf02;
			
				do_lc_get_budget(prj,data);
				let [month, year] = inf02.split('/').map(Number);
			
		        do_lc_show_date(month, year);
		        
		        $('#monthPicker').val(inf02);
		        $('#btn_new_budget').removeClass('hide');
		        $('.copy_code').removeClass('hide');
		        do_lc_show_monthPicker(prj, null);
		        $('#a_btn_canc_new').off();
		        $('#a_btn_canc_new').attr('id', 'a_btn_canc');
		        
		        $('#btn_new_budget').on('click', function() {
					do_lc_get_list_budget(prj);
				});
				
			 	do_lc_bind_event_budget(prj);
			});
			 
		}
		
/*------------------------------------------	*/		
		
		const do_lc_get_history = function(prj){
				const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_HISTORY_TASK, {id :prj.id, typ : prj.typ02});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_req_history, [prj]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
			}

			const do_lc_after_req_history = function(sharedJson){
				const data = can_gl_AjaxSuccess(sharedJson) ? sharedJson[App['const'].RES_DATA] :  {};
				do_lc_show_listHistory(data , null , null );
			}
			const do_lc_show_listHistory = function(data, dtBegin, dtEnd) {
			    let obj = {arrChild: []};

			    data.forEach((e) => {
			        if(e.typ01 == 100 && e.typ02 == null) {
			            let cmt = JSON.parse(e.inf01);
			            cmt = cmt.reverse();

			            cmt.forEach((item) => {    
			                obj.arrChild.push(item);
			            });

			        } else {
			            e.dt = e.dt01;
			            obj.arrChild.push(e);
			        }
			    });

				if (dtBegin != null || dtEnd != null) {
				       obj.arrChild = obj.arrChild.filter((e) => {
				           let itemDate = e.dt;
						   if(itemDate >= dtBegin && itemDate <= dtEnd) {
							return itemDate ;
							}
				       });
				}

			    $("#div_history_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_HISTORY, obj));
			    do_lc_bind_event_filter_history(data);
				}
		const do_lc_bind_event_filter_history = (data) => {
				$("#inp_dt_end_history").off("change").on("change", function(){
							
					var dataDate = req_gl_data({
						dataZoneDom: $("#div_date_period")
					});
					let dtBegin = dataDate.data.dtBegin;
					let dtEnd 	= dataDate.data.dtEnd ;
					do_lc_show_listHistory(data , dtBegin , dtEnd );
										
				});
				$("#inp_filter_history").off("keypress").on("keypress", function(e){
					if(e.keyCode == pr_POST_KEY_ENTER){
						let searchKey = $(this).val().toLowerCase();
						$(".event-list").each(function() {
							var str = $(this).text();
							if (!str.includes(searchKey)) $(this).hide(); else $(this).show();
					    });
						
						//do_lc_show_listHistory(data , null , searchKey );
					}
				
				});
				$(".a_view_prj").off("click").on("click", function(){
					let {id, code , gid , gcode , typ } = $(this).data();
					if(typ == 0 ) {
						App.router.controller.do_lc_run("VI_MAIN/prj_sprint", `view_prj_sprint.html?groupId=${gid}&groupCode=${gcode}&id=${id}&code=${code}`);
					}else{
						!!id && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${id}&code=${code}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [id, code]);
					}
				});
		}

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		this.do_lc_save_prj_content = function(newPrj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(newPrj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjContent, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_prjContent = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				let data 	= sharedJson[App['const'].RES_DATA];
				prj 		= $.extend(true, prj, data);
				pr_project.EntStat.do_lc_show_prj_stats(prj, false)
				self.do_lc_show_prj_content(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		var do_lc_get_content_reload = function(prj, typLoad){
			if(!typLoad)	return false;
			let pr_SV_NAME_RELOAD 	= typLoad === "val02" ? pr_SV_EVAL_GET_BUDGET : pr_SV_EVAL_GET_PERCENT;

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_EVAL_CLASS, pr_SV_NAME_RELOAD, {id: prj.id, code: prj.code01});

			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_after_Reload, [prj]));

			let fError 				= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_after_Reload = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				if(data){
					prj = $.extend(true, prj, data);
					self.do_lc_show_prj_content(prj);
				}
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		var do_lc_delete_content = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id: prjId, code: prj.code01 });			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_del_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
				
				if (prj.prjPar){
					var url 	= "view_prj_project_content.html?id="+prj.prjPar.id+"&code="+prj.prjPar.code01;
					var route	= "VI_MAIN/prj_project_ent";
					App.router.controller.do_lc_run(route, url);
					return;
				}else{
					$("#div_main_content").html("");
				}
				
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_del'));
			}
		}

		var do_lc_refresh_content = function(prj, prjId, prjCode){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_CONTENT, {id: prj.id, code: prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_refresh_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_refresh_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				prj = Object.assign(prj, data);
				do_lc_show_content(prj);

				pr_project.EntEpic		.do_lc_get_prj_epic(prj);
				pr_project.EntTask		.do_lc_get_prj_task(prj);
				
				pr_project.EntDoc		.do_lc_get_prj_docs(prj);
				pr_project.EntEval		.do_lc_get_prj_evaluation(prj);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		var do_lc_duplicate_content = function(prj){
			let m
			var newObj 			= $.extend(true,{},prj);

			//---duplicate 	record in document and detail		
			newObj = do_duplicate_record(newObj);
			
			self.do_lc_show_prj_content(newObj, var_lc_MODE_NEW)
			pr_project.EntDoc		.do_lc_get_prj_docs(newObj, var_lc_MODE_NEW);
			
		}
		
		function do_duplicate_record(obj){
			obj.id			= null;
			obj.code        = null;
			obj.name		= obj.name + " - COPY"  ;
			
			if(obj.files){
				for(let i=0; i < obj.files.length; i++){
					obj.files[i].id 		= null;
				}
			}
			
			obj.dtBegin =  req_gl_DateStr_From_DateObj (new Date());
			obj.dtEnd 	=  req_gl_DateStr_From_DateObj (new Date());
			obj.dtMod	=  null;
			obj.dtNew	=  null;
			if(obj.lstStats && obj.lstStats.length > 0) {
				obj.stat	=  obj.lstStats[0].id;
				obj.stat01	=  obj.lstStats[0].id;
			} else {
				obj.stat	=  null;
				obj.stat01	=  null;
			}
			
			return obj;
		}
		
		const do_lc_create_prj = (prj, frView) => {
			let dataSend	= {obj: JSON.stringify(prj), member : Object.values(members), frView};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_prj = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${data.id}&code=${data.code01}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [data.id], '_self');
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_show_wf_task = (prj) => {
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVWorkflowByTask");
			ref["id"]		= prj.id;
			ref["grId"]		= prj.grp;

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_wf_task_success, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_wf_task_success = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				dataWF = data;

				// Handle select stat field
				do_lc_handle_select_stat(data, prj);
			}
		}

		const do_lc_handle_select_stat = (data, prj) => {
			let wf  = data.descr01;
			let lstStatEnd = [];
			let haveQuickStat = false;
			try{
				let connection 			= (JSON.parse(wf)).con;
				if (connection && connection.length > 0) {
					connection.forEach((e) => {
						if (prj.stat == e.statBegin) {
							lstStatEnd.push(e.statEnd);
						}
					});
				};

				for (let i = 0; i < 8; i++) {
					$(`#stat option[value=${i}]`).hide();
				}

				if (lstStatEnd.length < 4) haveQuickStat = true;
				if (lstStatEnd.length > 0) {
					lstStatEnd.forEach((e) => {
						$(`#stat option[value=${e}]`).show();
						if (haveQuickStat) {
							$(`#quick_stat_0${e}`).removeClass("hide");
							$(`#quick_stat_0${e}`).off("click").on("click", () => {
								do_gl_select_value($("#stat"), e);
								do_lc_quick_save_stat(prj);
							});
						}
					});
				};
				
			} catch(e) {
			}
		}

		const do_lc_quick_save_stat = (prj) => {
			prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
			let	data	 				= req_gl_data({
				dataZoneDom		: $("#div_prj_content")
			});

			if(data.hasError)	return false;

			let newPrj 			= data.data;
			
			let oldStat = prj.stat; //get stat for check percent

			if(prj && (prj.userRole == pr_member_lev_reporter || prj.userRole == pr_member_lev_worker)){
				newPrj 			= Object.assign({}, prj);
				newPrj.stat 	= data.data.stat;
				newPrj.val05 	= data.data.val05;
			}else{
//						newPrj.files	= newPrj.files.concat(obj.files);

				newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
				newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);

				newPrj 			= $.extend(false, prj, newPrj);
			}

			newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;
			newPrj.val00    = null;
			
			switch(parseInt(newPrj.stat)){
			case pr_STAT_PRJ_NEW		: newPrj.val05 =   0; break;
			case pr_STAT_PRJ_TODO		: newPrj.val05 =   0; break;
			case pr_STAT_PRJ_INPROGRESS : 
				if(oldStat != newPrj.stat){
					newPrj.val05 =  10; 
				}else {
					//todo
				}
				break;
			case pr_STAT_PRJ_REVIEW		: newPrj.val05 =  90; break;
			case pr_STAT_PRJ_DONE		: newPrj.val05 = 100; break;
			case pr_STAT_PRJ_CLOSED		: 
				newPrj.val05 = 100; 
				newPrj.val00 = App.data.curEval.eval01;
				break;
			case pr_STAT_PRJ_DEPLOY		: newPrj.val05 =   0; break;
			case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
			}


			if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

			//---remove some fields before send to server
			newPrj.epicInf 	= null;
			newPrj.epicName = null;
			newPrj.epics	= null;
			newPrj.lstClone = null;
			newPrj.tasks 	= null;
			
			do_lc_save_prj_content(newPrj, prj)
		}

		const do_lc_show_work_flow = (prj) => {
			let wf  = prj.descr01;
			try{
				workflow 			= JSON.parse(wf);
				workflow.statWF 	= req_lc_build_objWF(workflow.con);
				do_lc_show_workflow(workflow);
			} catch(e) {
				console.log(e);
			}
		}

		const req_lc_build_objWF = (data) => {
			var statWF ={};
			if (data && data.length > 0) {
				data.forEach((e) => {
					statWF[e.i] = e.userTyp;
				});
			}
			return statWF;
		}

		const do_lc_show_workflow = function(wf) {
			do_gl_show_workflow (wf, tmplCtrl, tmplName);
		}

		//------------------------------End content prj-----------------------------------
	}
	var PrjProjectEntTabManageMember 	= function (grpName, header, content, footer) {

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		//------------------------------Start File list-----------------------------------
		let self			= this;
		var dp_schedule						= null;
		const pr_ctr_Ent	= App.controller.PrjProject.Ent;
		const pr_SERVICE_PER_CLASS	= "ServiceAutUser";
		const pr_SV_USER_SEARCH		= "SVLst";
		var TIME_RANGE						= 3;
		let pr_lastAppointment 				= []
		let pr_cDaily 						= 0
		let pr_cWeeklyRemaining 			= 0
		let pr_dtBegin						= null
		var pr_ID							= null;
		var locale							= "vi-vi";
		var dp_nav 							= null;
		var members                     	= {};
		var obj 							= null;
		
		const previousPositions 			= {};
		var pr_ForDesktop					= true;
		var pr_ForVertial					= false;
		var pr_lstAvailableTime				=	[];
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;

		var pr_CALENDAR_TEM 					= {};
		var pr_CALENDAR_PRJ 					= {};
		this.do_lc_get_calendar = function(obj,prj){
				const ref 				= req_gl_Request_Content_Send_With_Params("ServicePrjProject", "SVCalendarGet", {id :obj.id, code: obj.code01 ? obj.code01 : obj.code, typ01: 400});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_after_get_calendar, [obj,prj]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_get_calendar = function(sharedJson, obj,prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				
				if(data !== null){
					data.inf01 = JSON.parse(data.inf01);
					if (data.inf01 && Array.isArray(data.inf01)) {
				    data.inf01.forEach((item) => {
				        if (item.avatar) {
				            item.avatar = JSON.parse(item.avatar);
				        }
				        if (item.member && item.member.trim() === "") {
			            item.member = null; 
			        }
					    });
					}
					data.name = obj.name ? obj.name : obj.inf01.list[0].name
					$('#div_prj_manage_member').html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MANAGE_MEMBER, data));
					
				     pr_CALENDAR_TEM = data;
				    if (Object.keys(pr_CALENDAR_PRJ).length === 0) {
    					pr_CALENDAR_PRJ = obj;
					}
					 pr_ctr_Ent.do_lc_reqRole_User();
					 do_lc_bindEvent_member_manage(obj,data,prj);
					 do_init_autocomplete_member(obj);
				
				}else{
					$("#div_prj_manage_member"			).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MANAGE_MEMBER, {}));
					
						do_lc_bindEvent_member_manage(obj,data);
						pr_ctr_Ent.do_lc_reqRole_User();
				//	do_lc_bind_event_budget				(prj);
				//	do_lc_bind_event_after_get_budget 	({}, prj);
				}
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		var do_lc_bindEvent_member_manage = function(prj,data,obj){
			$('#addRowBtn').on('click', function() {
				do_lc_bind_event_new_row_table(prj,data,obj);
				do_lc_bind_event_edit_schedule(prj,data,obj);
		    });	
		    $('.edit-schedule').on('click', function() {
		   		let uRole = prj.userRole;
				if(uRole === pr_member_lev_manager || uRole === pr_member_lev_reporter ){
		   			do_lc_bind_event_edit_schedule(prj,data,obj);
				}
		    });
		     $('#removeRowBtn button').off('click').on('click', function() {
	             $(this).closest('tr').remove();
	    	});
		    do_lc_bindEvent_resize("#div_prj_manage_member");
		    $('#a_btn_canc').on('click', function() {
				 $("#a_btn_sav, #a_btn_canc")	.addClass("hide");
				 $("#addRowBtn").removeClass("hide");
				 $('#tbody_calendar').find('tr.new-row').remove();
				 $("#tr-empty").addClass("hide");
				 $(".inf-schedule").addClass("hide");
				 $('.edit-schedule').removeClass('hide');
				 $('.remove-btn').addClass('hide');
				 $("#div_prj_manage_member").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MANAGE_MEMBER, data));
				 do_lc_bindEvent_member_manage(prj,data);
		    });	
			$('[id^="btn_show_schedule_"]').on('click', function() {
				var idUser = $(this).val(),
				    dtBegin = $(this).closest('tr').find('input[id^="dtBegin_"]').val(),
				    foundMember = data.inf01.find(member => member.id === idUser);
				
				if (idUser) prj.idUser = idUser;
				if (dtBegin) prj.datetBegin = dtBegin;
				if (foundMember) prj.member = foundMember;
				
				if (prj.avatarUser) prj.avatarUser = null
				let rowToDelete = $(this).closest('tr');
				prj.rowToDelete = rowToDelete
		    	App.MsgboxController.do_lc_show({
		        title: $.i18n("prj_appointment_msg_title_calendar"),
		        content: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_APPOINMENT, {}), 
		        autoclose: true,
		        buttons: "none",
		        onClose: () => {
				
	        	},
		        css: {
		            "max-width": "1500px",
		            "min-width": "600px",
		            "margin": "auto"
		        }
		    	});
		    	if(!App.controller.PrjAppoinMent)		App.controller.PrjAppoinMent 		= {};
						App.controller.PrjAppoinMent	= new PrjAppointmentList();
						App.controller.PrjAppoinMent	.do_lc_show_callback(prj,null,null,true);
			});
		}
			const do_init_autocomplete_member = function(prj) {
			$('#tbody_calendar').off('focus', '.ip-name-member').on('focus', '.ip-name-member', function() {
			    let el = $(this); 
			    let selectNameMember = $(this).closest('tr').find('.select-name-member'); 
			    
			    let members = {};
			
			    let customShowList = function(item, selOpt = ""){
			        if(item.avatar) {
			            return selOpt += `<img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
			        } else {
			            let textColor = null;
			            let textAvatar = null;
			            let first = item.login01.charAt(0);
			            let last = item.login01.charAt(item.login01.length - 1);
			            let index = var_gl_alphabet.indexOf(first.toLowerCase());
			            textColor = var_gl_colors[index];
			            textAvatar = first + last;
			            selOpt += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-1" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			            return selOpt;
			        }
			   }
			
			   let reqSelectMember = (event, item) => {
			      if(members[item.id]) return false;
			      let user = {"id": item.id};
			      let textColor = null;
			      let textAvatar = null;
			      if(!item.avatar){
			         let first = item.login01.charAt(0);
			         let last = item.login01.charAt(item.login01.length - 1);
			         let index = var_gl_alphabet.indexOf(first.toLowerCase());
			         textColor = var_gl_colors[index];
			         textAvatar = first + last;
			      }
			        
			      members[item.id] = user;
			
			      let selOpt = `<div class='member-item' >`;
			      selOpt +=`<input type="text" data-group="inf01" data-name="id" class="hide row-calendar inf-schedule objData form-control remove-item-chk" value="${item.perId}">`
			      selOpt +=`<input type="text" data-group="inf01" data-name="id" class="hide row-calendar_id inf-schedule objData form-control remove-item-chk" value="${item.id}">`
		          if(item.avatar) {
		            selOpt += `<div class='member-avatar-item' ><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs'/> ${item.login01}`;
		          } else {
		            selOpt += `<div class="member-avatar-item media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;
		          }
		
		          selOpt += `<a data-id='${item.perId}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
		          selOpt += `</div></div>`;
			        
			      selectNameMember.removeClass('hide');
			      el.addClass('hide');
			      selectNameMember.append(selOpt); 
			        
			      el.blur().val("");
			      do_lc_bind_event_autocomplete(); 
			  }
			    
			  let typ01Arr = [App.data.user.typ01, 2, 3, 4, 5];
			  let typ01Str = typ01Arr.join(',');
			  let options = {
			      dataService: [pr_SERVICE_USER_CLASS, pr_SV_USER_SEARCH],
			      svParams: {wAvatar: true, nbline: 20, typ01s: typ01Str, stats: 1}, 
			      hintService: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
			      hintSvParams: {wAvatar: true, typ01s: typ01Str, stats: 1, entId01: prj.grp},
			      fSelect: reqSelectMember, 
			      customShowList: customShowList
			  }
			
			  do_gl_req_autocompleteNew(el, options);
		   });
				
	 	};
	 	const do_lc_bind_event_autocomplete = function() {
		    $(".btn-remove-member").off("click").on("click", function(){
		        let $this = $(this);
		        let parent = $this.closest('.member-item');
		        let $currentRow = $this.closest('tr');
		        let {id} = $this.data();
		
		        if(members[id]) delete members[id];
		        
		        parent.remove();  
		        
		        let $inputNameMember = $currentRow.find('.ip-name-member');
		        let $selectNameMember = $currentRow.find('.select-name-member');
		
		        $inputNameMember.removeClass('hide');
		        $selectNameMember.addClass('hide');
		    });
		}
	 	const do_lc_bind_event_edit_schedule = function(prj,obj,dataPrj){
			 
			$("#a_btn_sav, #a_btn_canc").removeClass("hide");
	  		$("#addRowBtn").addClass("hide");
			$(".inf-schedule").removeClass("hide");
			$('.edit-schedule').addClass('hide');
			$(".remove-btn").removeClass("hide");
			$('#a_btn_sav').off('click').on('click', function() {
			
			let value = $('#btn_show_schedule').val();
			let intValue = parseInt(value, 10);
			let	data	= req_gl_data({
					dataZoneDom		: $("#div_prj_manage_member"),
					skipError		: true
				});
				if (data.data.inf01 && data.data.inf01.name) {
			    if (!data.data.name) {
			        data.data.name = data.data.inf01.name; 
			    }
				}
				let params 				= req_gl_Url_Params();
				let { id, code } = params;
				if (id || code) {
				    data.data.id = id;
				    data.data.code = code;
				} else {
				    if (Array.isArray(prj) && prj.length > 0) {
				        data.data.id = prj[0].id ? prj[0].id : prj.id;
				        data.data.code = prj[0].code01 ? prj[0].code01 : prj[0].code;
				    } else if (prj) {
				        data.data.id = prj.id ? prj.id : null;
				        data.data.code = prj.code01 ? prj.code01 : prj.code;
				    } 
				}
				data.data.typ02 = intValue
				data.data.typ01 = 300
				let rows = $('#div_prj_manage_member').find('tr');
				rows = rows.slice(1);
				const dataArray = [];
			
			
			for (let i = 0; i < rows.length; i++) {
			    const row = rows[i];
			    const inputs = $(row).find('input.inf-schedule');
			    const dataObject = {};
			
			    inputs.each(function() {
			        const input = $(this);
			        const key = input.data('name');
			        const value = input.val();
			        dataObject[key] = value;
			    });
			
			    if (dataObject.id) {
        			dataArray.push(dataObject);
    			}
			}
			if (Array.isArray(data.data.inf01)) {
			   const inf01Obj = {};
			    
			    data.data.inf01.forEach((item, index) => {
			      inf01Obj[`item${index + 1}`] = { ...item }; 
			    });
			
			    data.data.inf01 = inf01Obj;
		    }
			data.data.inf01.list = dataArray;
			do_send_new_task_schedule(data.data,prj,obj);

	    });
		}
		this.do_lc_show_data_calendar = function(prj,obj) {
			$('#removeRowBtn button').off('click').on('click', function() {
	        	$(this).closest('tr').remove();
	    	});
			$("#a_btn_sav, #a_btn_canc").removeClass("hide");
		    $("#addRowBtn").addClass("hide");
		    $("#tr-empty").removeClass("hide");
			
		    var newRow = tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_MANAGE_MEMBER_LINE, {obj: prj});
		    $(this).closest('tr').remove();
		    var $newRow = $(newRow).addClass('new-row');
		    $('#tbody_calendar').append($newRow);
		    do_lc_bind_event_edit_schedule(prj,obj)
		    if(prj[0].username){
			$('#member_name_user').addClass("hide");
			}  
			
			$('#btn_show_schedule_line').off('click').on('click', function() {
				var idUser = $(this).val(); 
				let intValue = parseInt(idUser, 10);
				 if(!intValue){
					 do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
					 return;
				 }
				prj[0].idUser = intValue
				App.MsgboxController.do_lc_show({
		        title: $.i18n("prj_appointment_msg_title_calendar"),
		        content: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_APPOINMENT, {}),
		        autoclose: true,
		        buttons: "none",
		        onClose: () => {
		            members = {};
		            files = {files: []};
		        },
		        css: {
		            "max-width": "1500px",
		            "min-width": "600px",
		            "margin": "auto"
		        }
		    	});
				if(!App.controller.PrjAppoinMent)		App.controller.PrjAppoinMent 		= {};
						App.controller.PrjAppoinMent	= new PrjAppointmentList();
						App.controller.PrjAppoinMent	.do_lc_show_callback(prj[0],null,null,true);
	        });	
		}
		
		const do_lc_bind_event_new_row_table = function(prj,data,obj) {
		    $("#a_btn_sav, #a_btn_canc").removeClass("hide");
		    $("#addRowBtn").addClass("hide");
		    $("#tr-empty").removeClass("hide");
	
		    var newRow = tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TABLE_MANAGE_MEMBER_ADD, {});
		    var $newRow = $(newRow).addClass('new-row');
		    $('#tbody_calendar').append($newRow);
			
		    do_init_autocomplete_member(prj);
		
		    $('#removeRowBtn button').off('click').on('click', function() {
		        $(this).closest('tr').remove();
		    });
		$('#btn_show_schedule_add').on('click', function() {
		   let inputValue = $('input.row-calendar_id').val();
		//   let inputValueId = $('input.row-calendar_id').val();
		   let imgSrc = null;
		   if ($('.member-item').find('.text-middle').length === 0) {
			    imgSrc = null; 
			} else {
			    imgSrc = $('.member-item img').attr('src');
			}
		   let username = $('.member-avatar-item').contents().filter(function() {
           return this.nodeType === Node.TEXT_NODE; 
    	   }).text().trim();
    	   
           prj.avatarUser = imgSrc || prj.avatarUser
           prj.username = username || prj.username
           if(prj.datetBegin){
				prj.datetBegin  =  null;
			}
			if (!inputValue) {
			    do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get_calendar'));
			    return;
			}
			if (pr_CALENDAR_PRJ.members && pr_CALENDAR_PRJ.members.length > 0) {
			    let memberFound = false;
			
			    pr_CALENDAR_PRJ.members.forEach((member) => {
			        if (member.ent02 && member.ent02.id && member.ent02.id == inputValue) {
			            memberFound = true;
			        }
			    });
			    if (!memberFound) {
			        do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get_calendar_member'));
			        return;
			    }
			} 
			const rows = $('#tbody_calendar').find('tr');
			const dataArray = [];
			
			for (let i = 0; i < rows.length; i++) {
			    const row = rows[i];
			    const inputs = $(row).find('input.inf-schedule');
			    const dataObject = {};
			
			    inputs.each(function() {
			        const input = $(this);
			        const key = input.data('name');
			        const value = input.val();
			        dataObject[key] = value;
			    });
			
			    dataArray.push(dataObject); 
			}
			
			let dateEndMax = null;
			
			dataArray.forEach(obj => {
			    if (obj.id === inputValue && obj.dtEnd) {
			        const dtEndDate = new Date(obj.dtEnd.replace(" ", "T")); 
			
			        if (!dateEndMax || dtEndDate > new Date(dateEndMax)) {
			            dateEndMax = obj.dtEnd; 
			        }
			    }
			});
			
			if (dateEndMax) {
			   prj.dateEndMax = dateEndMax
			}else{
				prj.dateEndMax = null
			}

		    if (inputValue) prj.idUser = inputValue;
		
		    if (data) {
		        let foundMember = null;
		
		        for (let i = 0; i < data.inf01.length; i++) {
		            if (data.inf01[i].id === inputValue) {
		                foundMember = data.inf01[i];
		                break;
		            }
		        }
		
		        if (foundMember) {
		            prj.member = foundMember;
		        }
		    }
		    App.MsgboxController.do_lc_show({
		        title: $.i18n("prj_appointment_msg_title_calendar"),
		        content: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_APPOINMENT, {}),
		        autoclose: true,
		        buttons: "none",
		        onClose: () => {
		            members = {};
		            files = { files: [] };
		        },
		        css: {
		            "max-width": "1500px",
		            "min-width": "600px",
		            "margin": "auto"
		        }
		    });
		
		    if (!App.controller.PrjAppoinMent) {
		        App.controller.PrjAppoinMent = new PrjAppointmentList();
		    }
		
		    App.controller.PrjAppoinMent.do_lc_show_callback(prj, null, null, true);
		    $(this).closest('tr').remove();
			});}
			
	  
		
		var do_send_new_task_schedule = function(data,prj,obj){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_PRJ_CLASS, pr_SV_MANAGE_MEMBER_SCHEDULE, {id :data.id, code: data.code,typ01:data.typ01, obj:JSON.stringify(data)});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_new_task_schedule, [data,prj,obj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		var do_lc_afterSave_new_task_schedule = function(sharedJson, member, prj,obj) {
		    if (can_gl_AjaxSuccess(sharedJson)) {
		        const data = sharedJson[App['const'].RES_DATA];
		        member.userRole = prj.userRole
		        if (data) {
		            self.do_lc_get_calendar(member,prj,obj);
		            if(prj.epicName){
		            pr_CALENDAR_PRJ = prj;
					}
		            // $("#div_prj_manage_member").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_ENT_TAB_MANAGE_MEMBER, data));
		            // do_lc_bindEvent_member_manage(prj, data);
		        }
		    } else {
		        do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get'));
		    }
		};
		
	}

	//------------------------------End Manage Member-----------------------------------

	//------------------------------End content prj-----------------------------------

	return {PrjProjectEntTabEval, PrjProjectEntTabEpic, PrjProjectEntTabTask, PrjProjectEntTabReport, PrjProjectEntTabMember, PrjProjectEntTabMemberGroup, PrjProjectEntTabDoc, PrjProjectEntTabComment, PrjProjectEntTabStat, PrjProjectEntTabContent,PrjProjectEntTabManageMember};
});