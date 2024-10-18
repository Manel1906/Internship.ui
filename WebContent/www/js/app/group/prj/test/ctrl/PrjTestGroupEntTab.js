define([
	'text!group/prj/test/tmpl/PrjTestUnit_Ent.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Content.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Tab_Comment.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Tab_Docs.html',
	'text!group/prj/test/tmpl/PrjTestUnit_Ent_Tab_Member.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_Task.html',

	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_History.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_New_History.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_History_List.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_History_Detail.html',

	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Popup_Unit.html',

	// 'text!group/prj/test/tmpl/PrjTestUnit_EntCreateTask.html',

	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_Task_List.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_Task_List_Element.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Popup_Multiple_Unit.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Popup_Multiple_Unit_Body.html',

	'text!group/prj/test/tmpl/PrjTestUnit_EntNew.html',
	
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_Member_Group.html',
	'text!group/prj/test/tmpl/PrjTestGroup_Ent_Tab_Member_Group_Popup.html',

	],
	function(	
			PrjTestUnit_Ent,
			PrjTestGroup_Ent_Content,
			PrjTestUnit_Ent_Tab_Comment,
			PrjTestUnit_Ent_Tab_Docs,
			PrjTestUnit_Ent_Tab_Member,
			PrjTestGroup_Ent_Tab_Task,

			PrjTestGroup_Ent_Tab_History,
			PrjTestGroup_Ent_New_History,
			PrjTestGroup_Ent_Tab_History_List,
			PrjTestGroup_Ent_Tab_History_Detail,

			PrjTestGroup_Ent_Popup_Unit,

			// PrjTestUnit_EntCreateTask,

			PrjTestGroup_Ent_Tab_Task_List,
			PrjTestGroup_Ent_Tab_Task_List_Element,
			PrjTestGroup_Popup_Multiple_Unit,
			PrjTestGroup_Popup_Multiple_Unit_Body,

			PrjTestUnit_EntNew,

			PrjTestGroup_Ent_Tab_Member_Group,
			PrjTestGroup_Ent_Tab_Member_Group_Popup
	){

	
	const pr_ENTITY_TYPE		= 20000;
	const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
	const pr_SV_GET				= "SVGet"; 
	const pr_SV_GET_LST         = "SVLst"
	const pr_SV_GET_MEMBER		= "SVGetMember"; 
	const pr_SV_SAVE_MEMBER		= "SVSaveMember"; 
	const pr_SV_SAVE_CONTENT	= "SVSaveContent"; 
	const pr_SV_NEW				= "SVNew"; 
	const pr_SV_SAVE_FILES		= "SVFileSave"; 
	const pr_SV_GET_CUSTOMER	= "SVGetCustomer"; 
	const pr_SV_SAVE_CUSTOMER	= "SVSaveCustomer"; 
	const pr_SV_SAVE_HISTORY	= "SVSaveHistory";
	const pr_SV_MOD_HISTORY		= "SVModHistory";
	const pr_SV_DEL_HISTORY		= "SVDelHistory"
	const pr_SV_GET_COMMENTS	= "SVGetComment";
	const pr_SV_SAVE_COMMENT	= "SVSaveComment";

	const pr_SV_REFRESH_CONTENT		= "SVContentRefresh";
	const pr_SV_REFRESH_TEST_GROUP 	= "SVTestGroupRefresh";

	const pr_SV_GET_INFO_WITH_CUSTOMER 		= "SVInfoWithCustomer";
	const pr_SV_UPDATE_INFO_WITH_CUSTOMER 	= "SVUpdateInfoWithCustomer";
	const pr_SV_DELETE_CUSTOMER 			= "SVDeleteCustomer";
	const pr_SV_CHANGE_TYP_CUSTOMER			= "SVChangeTypCustomer";
	const pr_SV_NEW_CUSTOMER 				= "SVNewCustomer";

	const pr_SV_DEL				= "SVDel";
	const pr_SV_MOVE_TASK		= "SVEpicAddTask";

	const pr_SERVICE_PER_CLASS	= "ServicePersonDyn";
	const pr_SV_USER_SEARCH		= "SVUserLstSearchWithAvatar";
	const pr_SV_PERSON_SEARCH	= "SVPersonLstSearchWithAvatar";

	const pr_SERVICE_AUT_CLASS	= "ServiceAutUser";
	const pr_SV_USER_LST		= "SVLst";

	const pr_SERVICE_GROUP_CLASS= "ServiceNsoGroup";
	const pr_SV_GROUP_SEARCH	= "SVLst";
	
	const pr_SERVICE_EVAL_CLASS	= "ServicePrjProjectEval";
	const pr_SV_EVAL_GET_BUDGET	= "SVPrjValReal";
	const pr_SV_EVAL_GET_PERCENT= "SVPrjValPercent";
	const pr_SV_EVALUATION		= "SVGetEvaluation";
	const pr_SV_SAVE_MOVE		= "SVTaskMove";
	
	const pr_SERVICE_DYN_CLASS		= "ServicePrjProjectDyn";
//	const pr_SV_GET_HISTORY_TASK	= "SVLstHistoryTask";
	
	const pr_SV_GET_HISTORY_TASK	= "SVGetHistoryTask";
	
	const pr_SV_SAVE_MEMBER_GROUP	= "SVSaveMemberGroup"; 
	const pr_SV_GET_MEMBER_GROUP	= "SVGetMemberGroup"; 
	
	//------------------const object------------------------------------------------------

	const pr_TYPE00_TEST			= 30;

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

	// const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;
	const tmplName				= App.template.names;
	const tmplCtrl				= App.template.controller;
	
	tmplName.PRJ_TESTGROUP_ENT							= "PrjTestGroup_Ent";
	tmplName.PRJ_TESTGROUP_ENT_CONTENT					= "PrjTestGroup_Ent_Content";
	tmplName.PRJ_TESTGROUP_ENT_TAB_COMMENT				= "PrjTestGroup_Ent_Tab_Comment";
	tmplName.PRJ_TESTGROUP_ENT_TAB_DOCS					= "PrjTestGroup_Ent_Tab_Docs";
	tmplName.PRJ_TESTGROUP_ENT_TAB_EPIC					= "PrjTestGroup_Ent_Tab_Epic";
	tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER				= "PrjTestGroup_Ent_Tab_Member";
	tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER_GROUP			= "PrjTestGroup_Ent_Tab_Member_Group";
	tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER_GROUP_POPUP	= "PrjTestGroup_Ent_Tab_Member_Group_Popup";
	tmplName.PRJ_TESTGROUP_ENT_TAB_TASK					= "PrjTestGroup_Ent_Tab_Task";

	tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY				= "PrjTestGroup_Ent_Tab_History";
	tmplName.PRJ_TESTGROUP_ENT_NEW_HISTORY				= "PrjTestGroup_Ent_New_History";
	tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY_LIST			= "PrjTestGroup_Ent_Tab_History_List";
	tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY_DETAIL		= "PrjTestGroup_Ent_Tab_History_Detail";

	tmplName.PRJ_TESTGROUP_ENT_POPUP_UNIT				= "PrjTestGroup_Ent_Popup_Unit";

	tmplName.PRJ_TESTGROUP_ENT_CREATE_EPIC				= "PrjTestGroup_EntCreateEpic";
	tmplName.PRJ_TESTGROUP_ENT_CREATE_TASK				= "PrjTestGroup_EntCreateTask";
	tmplName.PRJ_TESTGROUP_ENT_TAB_CUSTOMER				= "PrjTestGroup_Ent_Tab_Customer";
	tmplName.PRJ_TESTGROUP_ENT_TAB_EVALUATION			= "PrjTestGroup_Ent_Tab_Evaluation";
	tmplName.PRJ_TESTGROUP_ENT_CUSTOMER_INFO			= "PrjTestGroup_Ent_Customer_Info";
	tmplName.PRJ_TESTGROUP_ENT_TAB_TASK_LIST			= "PrjTestGroup_Ent_Tab_Task_List";
	tmplName.PRJ_TESTGROUP_ENT_TAB_TASK_LIST_ELEMENT	= "PrjTestGroup_Ent_Tab_Task_List_Element";
	tmplName.PRJ_TESTGROUP_ENT_TAB_EPIC_LIST			= "PrjTestGroup_Ent_Tab_Epic_List";
	tmplName.PRJ_TESTGROUP_ENT_TAB_EPIC_LIST_SHOW_CHILD	= "PrjTestGroup_Ent_Tab_Epic_List_Show_Child";
	tmplName.PRJ_TESTGROUP_ENT_CONTENT_PATH				= "PrjTestGroup_Ent_Content_Path";
	tmplName.PRJ_TESTGROUP_ENT_CONTENT_CHECK_LIST		= "PrjTestGroup_Ent_Content_Check_List";
	tmplName.PRJ_TESTGROUP_ENT_NEW						= "PrjTestGroup_EntNew";
	tmplName.PRJ_TESTGROUP_ENT_CONTENT_HISTORY			= "PrjTestGroup_Ent_Content_History";
	tmplName.PRJ_TESTGROUP_ENT_WORKFLOW_VIEW			= "PrjTestGroup_Ent_Workflow_View";
	tmplName.PRJ_WORKFLOW_POPUP_PICK_USER				= "PrjWorkflow_Popup_Pick_User";
	
	tmplName.PRJ_TESTGROUP_POPUP_MULTIPLE_TASK			= "PrjTestGroup_Popup_Multiple_Task";
	tmplName.PRJ_TESTGROUP_POPUP_MULTIPLE_TASK_BODY		= "PrjTestGroup_Popup_Multiple_Task_Body";

	var do_lc_bind_event_resize = function(){
		$(".btn-resize").off("click").on("click", function(){
			let $this 		= $(this);
			let {divtoogle} = $this.data();
			let child 		= $this.find("i");
			let label 		= $this.find(".label-resize");
			child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			$(divtoogle)	.toggle("hide");

			label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
		})
	}

	//------------------------------End Epic list-----------------------------------

	//------------------------------Start Task Task-----------------------------------
	const PrjTestUnitEntTabTask 	= function (grpName, header, content, footer) {
		//------------------------------Start Task list-----------------------------------
		const self 			= this;

//		var pr_isViewSprint = false;
		
		var pr_desrc02      = {
			task_ids : [],
			orders	: {}
		};
		
		var pr_history					= null;
		const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;
		const pr_member_lev_manager 	= 0;
		
		const do_lc_load_view = function(prj){
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_POPUP_MULTIPLE_TASK			, PrjTestGroup_Popup_Multiple_Unit);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_POPUP_MULTIPLE_TASK_BODY		, PrjTestGroup_Popup_Multiple_Unit_Body);

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_TASK					, PrjTestGroup_Ent_Tab_Task);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_TASK_LIST			, PrjTestGroup_Ent_Tab_Task_List);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_TASK_LIST_ELEMENT	, PrjTestGroup_Ent_Tab_Task_List_Element);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_NEW						, PrjTestUnit_EntNew);

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY				, PrjTestGroup_Ent_Tab_History);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_NEW_HISTORY				, PrjTestGroup_Ent_New_History);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY_LIST			, PrjTestGroup_Ent_Tab_History_List);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY_DETAIL		, PrjTestGroup_Ent_Tab_History_Detail);

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_POPUP_UNIT				, PrjTestGroup_Ent_Popup_Unit);
			
			$("#div_prj_task")	 .html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_TASK		, {}));
			$("#div_prj_history").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY	, {}));

			
			do_lc_bind_event_header_task(prj);
			do_lc_bind_event_header_history(prj);
			do_lc_bind_event_resize();

			do_gl_apply_right($("#div_prj_history"));
		}

		const do_lc_transform_descr02 = data => {
			if(!data.descr02)	return;
			const list = Object.values(data.descr02).reduce((curr, item) => {
				(item && item.trim().length) && curr.push({item}); return curr;
			}, [])

			data.descr02 = JSON.stringify(list);
		}

		const do_lc_bind_event_header_history = prj => {
			const $spanTextFilter = $("#sp_text_filter");

			$("#btn_add_history").off("click").on("click", function(){
				var obj = {files: []};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_history_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_NEW_HISTORY, {}),
					autoclose	: false,
					css			: {"width": "40%"},
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_new_history,
							param	: [prj, obj],
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
					}
				});	
			});

			$("#btn_refresh_history").off("click").on("click", function() {
				$spanTextFilter.html("");
				$(".task-filter").css("display", "none");
				do_lc_refresh_prj(prj, prj.id);
			})

			if(prj.history){
				do_lc_show_ui_history(prj, prj.history);
			}
		
		}

		const do_lc_save_new_history = function(prj, obj){
			$("#btn_msgbox_OK").attr("disabled", "disabled");
			let	data	 		= req_gl_data({
				dataZoneDom		: $("#div_create_prj_test_history")
			});

			if(data.hasError){
				$("#btn_msgbox_OK").removeAttr("disabled", "disabled");
				return false;
			}

			let objNew 			= data.data;
			objNew.parId 		= prj.id;
			objNew.parType		= pr_TYPE00_TEST;

			do_lc_create_history(objNew, prj);
		}

		const do_lc_create_history = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_SAVE_HISTORY);			
			ref["obj"]		= JSON.stringify(obj);

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_create_history, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_create_history = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				do_gl_show_Notify_Msg_Success 	($.i18n('common_ok_msg_save'));
				let data = sharedJson[App['const'].RES_DATA];
				prj = data;
				do_lc_bind_event_header_history(prj);
			}else{
//				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_history_popup"),
					content 	: $.i18n('common_err_msg_save'),
					autoclose	: false,
					css			: {"width": "40%"},
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							classBtn	: "btn-primary"
						}
					}
				});	
			}
//			App.MsgboxController.do_lc_close();
		}

		const do_lc_show_ui_history = (prj, history) => {

			if(history.length > 0) {
				history.forEach((e) => {
					try {
						e.inf01 = JSON.parse(e.inf01);
						e.inf02 = JSON.parse(e.inf02);
						do_lc_build_order(prj, e.inf02);
						do_lc_sort_data_by_order(e.inf02);
					} catch (e) {
					}
				});
				do_lc_sort_data_by_dt(history);
			};
			pr_history = history;

			$("#tabHistory").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY_LIST, history));
			do_lc_bind_event_history_prj(prj);

			do_gl_apply_right($("#tabHistory"));
		}

		const do_lc_bind_event_history_prj = function(prj){
			
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".info-content-worker")	.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				if($parent.find(".content-edit").length > 0){
					let $parents = $parent.closest(".card");
					$parents.find("#a_btn_save03, #a_btn_cancel03")	.removeClass("hide");
				}

			})
			
			$(".info-edit").on("click", function(){})

			$(".sel-stat").off("change").on("change", function(){
				let {id : idHistory} = $(this).data();
				pr_history.forEach((e) => {
					if (e.id == idHistory) {
						e.inf01.stat = parseInt($(this).val(), 10);
					}
				})
			})

			$("#a_btn_save03").off("click").on("click", function(){
				do_lc_save_prj_history(pr_history, prj);
				$("#a_btn_save03").addClass("hide");
				$("#a_btn_cancel03").addClass("hide");
			})

			$("#a_btn_cancel03").off("click").on("click", function(){
				do_lc_bind_event_header_history(prj);
				$("#a_btn_save03").addClass("hide");
				$("#a_btn_cancel03").addClass("hide");
			})

			$(".del_history").off("click").on("click", function(){
				let {id : idHistory} = $(this).data();
				do_lc_remove_history([{id : idHistory}], prj);
			});

			$(".view_history").off("click").on("click", function(){
				let {id : idHistory} = $(this).data();
				let data = null;
				prj.history.forEach((e) => {
					if (e.id == idHistory) data = e;
				});
				App.MsgboxController.do_lc_show({
					title		: $.i18n("msgbox_view_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_HISTORY_DETAIL, data),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_prj_history,
							param	: [pr_history, prj],
							autoclose	: true,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent: function() {
						do_lc_bind_event_history_detail(idHistory);
					}
				});	
			});
		}

		var do_lc_bind_event_history_detail = (idHistory) => {
			$(".sel-stat-det").off("change").on("change", function(){
				let {id : idHistoryDetail} = $(this).data();
				pr_history.forEach((history) => {
					if (history.id == idHistory) {
						history.inf02.forEach((e) => {
							if (e.id == idHistoryDetail) {
								e.stat = parseInt($(this).val(), 10);
							}
						})
					}
				});
			})
			$(".inp-cmt-det").off("change").on("change", function(){
				let {id : idHistoryDetail} = $(this).data();
				pr_history.forEach((history) => {
					if (history.id == idHistory) {
						history.inf02.forEach((e) => {
							if (e.id == idHistoryDetail) {
								e.cmt = $(this).val();
							}
						})
					}
				});
			})
		}

		var do_lc_remove_history = function(obj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_HISTORY, {obj: JSON.stringify(obj)});	
			ref["id"]		= prj.id;
			ref["code01"]	= prj.code01;
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_remove_history_success, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_remove_history_success = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				do_lc_refresh_prj(prj, prj.id);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		var do_lc_save_prj_history = function(newData, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD_HISTORY, {obj: JSON.stringify(newData)});	
			ref["id"]		= prj.id;
			ref["code01"]	= prj.code01;

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjHistory, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_prjHistory = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				do_lc_bind_event_header_history(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		const do_lc_bind_event_header_task = prj => {
			const $spanTextFilter = $("#sp_text_filter");

			$("#btn_add_task, #btn_add_task_others").off("click").on("click", function(){
				var obj = {files: []};
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_add_task_popup"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_NEW, {epics : prj.epicInf, epicSelected: prj.id, typ02: pr_TYPE02_TASK, currencys: App.data.currencys}),
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
						do_lc_bind_event_task_popup_prj(obj);
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
					const taskSearch = prj.tasks.filter(o => o.name.includes(searchKey) || o.descr01.includes(searchKey)) || [];
					do_lc_show_ui_task(prj, taskSearch);
				}

				do_gl_execute_debounce(do_lc_filter_task);
			})
			
//			if(pr_isViewSprint){
				do_lc_req_autocomplete(prj);
				
				if(prj.tasks){
//					pr_desrc02["task_ids"] = prj.des02.map(item => item.id);
					pr_desrc02 = JSON.parse(prj.descr02);
				}
				
				$("#btn_refresh_task_sprint").off("click").on("click", function() {
					do_lc_refresh_task_sprint(prj, prj.id);
				})

				$("#a_btn_save_task_sprint").off("click").on("click", function() {
					pr_desrc02['orders'] = {};
					for (let i = 0; i < pr_desrc02['task_ids'].length; i++) pr_desrc02['orders'][pr_desrc02['task_ids'][i]] = i+1;
					prj.descr02 = JSON.stringify(pr_desrc02);
					do_lc_save_list_task(prj);
					$("#a_btn_save_task_sprint, #a_btn_cancel_task_sprint").addClass("hide");
				});

				
				$("#a_btn_cancel_task_sprint").off("click").on("click", e => {
					pr_desrc02 = JSON.parse(prj.descr02);
					do_lc_show_task(prj);
					$("#a_btn_save_task_sprint, #a_btn_cancel_task_sprint").addClass("hide");
				})
				
				$("#btn_add_multiple_task").off("click").on("click", function() {
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_POPUP_MULTIPLE_TASK, {}),
						width	: "800px",
						autoclose	: false,
						buttons	: {
							OK: {
								lab		: $.i18n("prj_test_btn_add_multi_unit"),
								funct	: do_lc_before_save_list_task,
								param	: [prj],
								classBtn: "btn-success"
							}
						},
						bindEvent: function() {
							const pr_STAT_PRJ_NEW 			= prj.stat;
							do_lc_req_list_task(prj, null, pr_STAT_PRJ_NEW);
							do_lc_show_task(prj);
							do_lc_bindEvent_add_multiple_task(prj);
						}
					});				
				});
			
//			}
		}
		
		const do_lc_req_autocomplete = (prj) => {
			let el = "#inp_add_task";
			let customShowList = function(item, selOpt = ""){
				return selOpt = item.code + " - " + item.name;
			}

			let reqSelectMember = (item) => {
				if(pr_desrc02["task_ids"].some(task => task == item.id))			return false;
//				pr_desrc02["task_ids"].push(item.id);

				let order 						= parseInt($("#inp_order").val(), 10);
				if(order) 	pr_desrc02['task_ids'].splice(order - 1, 0, item.id)
				else 		pr_desrc02['task_ids'].push(item.id)
//				if (!order) order 				= pr_desrc02["task_ids"].lenght + 1;
//				pr_desrc02["orders"] 			= req_lc_orders(prj);
//				pr_desrc02["orders"][item.id] 	= order;
				item.order						= pr_desrc02['task_ids'].indexOf(item.id)+1;

				 if(($("#tabTask").find("#tbody_task").length) == 0) {
				 	$("#tabTask").html("");
				 	let html = `   <table class="table table-centered"><tbody id="tbody_task"></tbody></table>`;
				 	$("#tabTask").html(html);
				 }
				 $("#tbody_task").append(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_TASK_LIST_ELEMENT, item));
				 $(el).blur().val("");
				 $("#a_btn_save_task_sprint, #a_btn_cancel_task_sprint").removeClass("hide");
			}

			let options = {
				dataService 	: [pr_SERVICE_CLASS, "SVTestUnitListSearch"], 
				dataRes 		: ["name"],
				dataReq			: {grId: prj.grp},
				selectCallback	: reqSelectMember, 
			}
			do_gl_set_input_autocomplete(el, options);
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
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_TEST_GROUP, {id: prjId});			

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
		
		
		this.do_lc_show_prj_task = function(prj, isViewSprint){
//			if(isViewSprint) pr_isViewSprint = isViewSprint;
			do_lc_load_view(prj);
			do_lc_show_task(prj);
		}

		const do_lc_show_task = function(prj){
			if(prj.tasks){
				for(var i=0; i < prj.tasks.length; i++){
//					prj.tasks[i].descr01 = prj.tasks[i].descr01.substring(0, 200);
//					prj.tasks[i].isViewSprint = pr_isViewSprint;
					
//					if(pr_isViewSprint){
						if(prj.userRole == pr_member_lev_manager) prj.tasks[i].isManager = true;
						else  prj.tasks[i].isManager = false;
//					}
				}
			} else prj.tasks = [];

			if (prj.descr02) pr_desrc02 = JSON.parse(prj.descr02);
			
			do_lc_show_ui_task(prj, [...prj.tasks]);
		}

		const do_lc_show_ui_task = (prj, tasks) => {

			if(tasks.length > 0) {
				do_lc_build_order(prj, tasks);
				do_lc_sort_data_by_order(tasks);
			}

			$("#tabTask").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_TASK_LIST, tasks));
			do_lc_bind_event_tasks_prj(prj);

			do_gl_apply_right($("#tabTask"));
		}

		const req_lc_orders = (prj) => {
			let tmp = prj.descr02 ? JSON.parse(prj.descr02) : {};
			tmp = tmp.orders ? tmp.orders : {};
			return tmp;
		}

		const req_lc_max_order = (prj) => {
			let tmp = prj.descr02 ? JSON.parse(prj.descr02) : {};
			tmp = tmp.orders ? tmp.orders : null;
			let max = 0;
			if (tmp) {
				for (let e in tmp) {
					if (tmp[e] > max) max = tmp[e];
				}
			}
			return max;
		}

		const do_lc_build_order = (prj, tasks) => {
			let tmp = prj.descr02 ? JSON.parse(prj.descr02) : {};
			tmp = tmp.orders ? tmp.orders : null;
			if (tmp) {
				tasks.forEach((e) => {
					e.order = tmp[e.id];
				});
			}
		}

		const do_lc_sort_data_by_dt = (data) => {
			data.sort(function (a, b) {
				return new Date(b.inf01.dt1) - new Date(a.inf01.dt1);
			});
		}

		const do_lc_sort_data_by_order = (data) => {
			data.sort(function (a, b) {
				return a.order - b.order;
			});
		}

		const do_lc_sort_data = (data) => {
			data.sort(function (a, b) {
				return a.stat - b.stat || (a.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))*2-1;
			});
		}

		const do_lc_bind_event_tasks_prj = function(prj){
			$(".td-task").off("click").on("click", function(){
//				let {id : idTask} = $(this).data();
//				idTask && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${idTask}`, "VI_MAIN/"+ App.router.part.PRJ_TESTGROUP_ENT, [idTask], '_self');
//				return false;
			});

			$(".view-test").off("click").on("click", function(){
				let $this 					= $(this);
				let {id} 	= $this.data();
				if(id){
					let data = null;
					if (prj.tasks && prj.tasks.length >0) {
						prj.tasks.forEach((e) => {
							if (e.id == id) data = e;
						});
					}
					
					App.MsgboxController.do_lc_show({
						title		: $.i18n("msgbox_view_title"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_POPUP_UNIT, data),
						autoclose	: false,
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
							}
						}
					});	
				}
			});


			$(".span-delete-task").off("click").on("click", function() {
				const {id, stat} = $(this).data();
				if(stat !== pr_STAT_PRJ_NEW)	return;
				if(!id)							return;

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_del_task_popup"),
					content 	: $.i18n("prj_project_del_task_popup_content"),
					autoclose	: false,
					buttons		: {
						OK: {
							lab			: $.i18n("common_btn_ok"),
							funct		: do_lc_delete_new_task,
							param		: [id, prj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	
			});
			
			$(".remove-task").off("click").on("click", function(){
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_DEPLOY};
					do_lc_save_change_stat(params, prj);
				}
			});
			
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

		const do_lc_delete_new_task = (id, prj) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id});			

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
			objNew.parent 	= objNew.parent == 0? prj.id: objNew.parent;
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

		const do_lc_bind_event_task_popup_prj = function(obj){
			members = {};
			groups  = {};

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
			do_lc_req_autocompleteEpicTask();

//			$("#div_create_prj .tmpicker").timepicker({//timepicker
//				showMeridian: false,
//				icons		: {
//					up		: "mdi mdi-chevron-up",
//					down	: "mdi mdi-chevron-down"
//				}
//			})
			
			$("#dtpicker_Begin").datepicker().datepicker("setDate", new Date());
			$("#dtpicker_End").datepicker().datepicker("setDate", new Date());
			
			$("#tmpicker_Begin").timepicker({//timepicker
				showMeridian: false,
				defaultTime :'7:00',
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			
			$("#tmpicker_End").timepicker({//timepicker
				showMeridian: false,
				defaultTime :'19:00',
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

		const do_lc_req_autocompleteEpicTask = function(){
			let el = ".inp-name-member";
			members = {}
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
				if(item.avatar) selOpt 			+= `<div><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs'/> ${item.login01}`;
				else 			selOpt 			+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white mr-1 text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}`;
				selOpt 				+= `<a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a>`;
				selOpt 				+= `</div></div>`;
				
				$("#div_list_member").append(selOpt);
				do_lc_bind_event_autocompleteEpicTask();
				$(el).blur().val("");
			}

			let options = {
					dataService : [pr_SERVICE_PER_CLASS, pr_SV_USER_SEARCH], fSelect: reqSelectMember, appendTo: ".msg-box", customShowList: do_lc_customLst_user_autocomplete
			}
			do_gl_set_input_autocomplete(el, options);
			
			
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
				do_lc_bind_event_autocomplete_group();
			}

			let optionsG = {
				dataService 	: [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH], 
				apiUrl			: App.path.BASE_URL_API_PRIV,
				dataRes 		: ["name"],
				dataReq			: {nbLine:5, typ01s: 300},
				selectCallback	: reqSelectGroup, 
				// customShowList	: customShowListGroup,
			}
			do_gl_set_input_autocomplete(el, optionsG);
		}

		const do_lc_bind_event_autocompleteEpicTask = function(){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 	= $(this);
				let parent 	= $this.parent();
				let {id} 	= $this.data();

				if(members[id])	delete members[id];
				parent.remove();
			})
		}
		
		var do_lc_bind_event_autocomplete_group = function(){
			$(".btn-remove-group").off("click").on("click", function(){
				let $this 		= $(this);
				let parent 	    = $this.parent();
				let {id} 		= $this.data();

				if(groups[id])	delete groups[id];
				parent.remove();
			})
		}

		const do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
			if(item.avatar) return selOpt 		+= `<img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs'/> ${item.login01}`;
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

		const do_lc_refresh_prj = function(prj, prjId, prjCode){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id: prjId, code: prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_refresh_prj_success, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_refresh_prj_success = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				prj = data;
				if(!prj.history) prj.history = [];
				
				do_lc_show_ui_history(prj, prj.history);
				
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_refresh_task = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_TASK, {id: prjId});			

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
		const do_lc_before_save_list_task = (prj) => {	
			pr_desrc02['orders'] = {};
			for (let i = 0; i < pr_desrc02['task_ids'].length; i++) pr_desrc02['orders'][pr_desrc02['task_ids'][i]] = i+1;
			
			prj.descr02 = JSON.stringify(pr_desrc02);
			do_lc_save_list_task(prj);
		}
		
		const do_lc_req_list_task = (prj, searchkey, stats) => {
			$("#div_multiple_task_wait").removeClass("hide")

			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, "SVTestUnitListSearch", {grId: prj.grp, nbLine: 100, searchkey, stats});	
			
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
					
					for (let i = 0; i < data.length; i++) data[i].order = pr_desrc02['task_ids'].indexOf(data[i].id) +1;
				}				
				
				$("#tbody_multiple_task").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_POPUP_MULTIPLE_TASK_BODY, data))
				$("#div_multiple_task_wait").addClass("hide");
				do_lc_bindEvent_after_req_list_task(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		const do_lc_bindEvent_after_req_list_task = (prj) => {
			$(".task-cbx").off("change").on("change", function(){
				let isChecked 	= $(this).is(":checked");
				let id  		= $(this).data().id;
				let order		= $(this).parents().find("." + id).val();
				
				if(isChecked) {
					if(order) 	pr_desrc02['task_ids'].splice(order - 1, 0, id)
					else 		pr_desrc02['task_ids'].push(id)
					return
				}
				
				const taskInd = pr_desrc02['task_ids'].indexOf(id)
				
				if(taskInd <= -1) return
				pr_desrc02['task_ids'].splice(taskInd, 1);
				$("#tbody_task").find("tr[data-id='"+ id +"']").remove();
			});
			
			$(".task-order").off("change").on("change", function(){
				let id 		= $(this).data().id;
				let order 	= $(this).val();
				if ($(this).parents().find("tr[data-id='"+ id +"']").is(":checked")) {
					pr_desrc02['task_ids'].splice(pr_desrc02['task_ids'].indexOf(id), 1);
					if (order) 	pr_desrc02['task_ids'].splice(order-1, 0, id);
					else 		pr_desrc02['task_ids'].push(id);
				}
				
			});
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
		//------------------------------End Task list-----------------------------------
	}
	//------------------------------End Task list-----------------------------------

	//------------------------------Start Member list-----------------------------------
	var PrjTestUnitEntTabMember 	= function (grpName, header, content, footer) {
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_MEMBER_TYPE 		= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
		
		var pr_MEM_TEMP					= {};
		var members 					= {};
		const pr_member_lev_manager 	= 0;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		const pr_ENT_TYP_USER           = 1000;
		
		const pr_ctr_Ent				= App.controller.PrjTestGroup.Ent;
		const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;

		var do_lc_load_view = function(){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER			, PrjTestUnit_Ent_Tab_Member);
		}

		this.do_lc_get_list_member = function(prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER, {id: prj.id, code: prj.code01});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_list_member, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_show_list_member = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];

				const is_Me 		= data.find(m => m.entId02 == App.data.user.id);
				const isSuperAdmin 	= App.controller.PrjTestGroup.Login && App.controller.PrjTestGroup.Login.can_lc_User_SuperAdmin();
				const isOwner		= App.data.user.id === prj.autUser01;
				
				let objData 	= data.reduce((currentObj, mem)=>{
					if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
					
					if(!isSuperAdmin && !isOwner){
						if(is_Me && is_Me.typ <= mem.typ && is_Me.lev >= mem.lev)	mem.notModif = true;
					}
					
					currentObj[mem.entId02] = mem;
					return currentObj;
				}, {});

				do_lc_show_prj_member(objData, prj.id, prj.code01);
				pr_ctr_Ent.do_lc_reqRole_User();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_bind_event_members_prj = function(members, idPrj, codePrj){
			pr_MEM_TEMP = $.extend(false, {}, members);

			$("#btn_add_member").off("click").on("click", function(){
				$(".action-item-member").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member").off("click").on("click", function(){
				do_lc_save_member_prj(members, idPrj, codePrj);
			})

			$("#a_btn_cancel_member").off("click").on("click", function(){
				do_lc_show_prj_member(members, idPrj, codePrj);
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

			let el = "#inp_name_member";
			let reqSelectMember = function(item){
				if(pr_MEM_TEMP[item.id])			return false;

				let lev 		= $("#sel_member_level").val();
				let typ 		= $("#sel_member_type").val();
				let mem 		= {"lev" : lev, "typ": typ, "ent02": item, "entId02": item.id, "entId01": idPrj, "entTyp01": pr_ENT_TYP_USER};
				let strlogin 	= item.login01.length > 4?item.login01.substr(0, 4) + "..." : item.login01;
				
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
				
				if(item.avatar) selOpt 			+= `<td style='width: 50px;'><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs' alt=''/></td>`;
				else 			selOpt 			+= `<td style='width: 50px;'> <div class="rounded-circle avatar-xs text-white text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div></td>`;
				selOpt 			+= `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${strlogin}</a></h5></td>`;
				selOpt 			+= `<td>` + $.i18n(PRJ_MEMBER_LEVEL[+lev]) 	+`</td>`;
				selOpt 			+= `<td class='hide'>` + $.i18n(PRJ_MEMBER_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				do_lc_bind_event_autocomplete(pr_MEM_TEMP);
				$(el).blur().val("");
			}

			let options = {
				dataService 	: [pr_SERVICE_AUT_CLASS, pr_SV_USER_LST], 
				dataRes 		: ["login01", "name01"],
				dataReq			: {nbLine: 5, typ01s: '2,3', stats: 1},
				selectCallback	: reqSelectMember, 
				// customShowList: do_lc_customLst_user_autocomplete
			}
			do_gl_set_input_autocomplete(el, options);
		}

		var do_lc_bind_event_autocomplete = function(pr_MEM_TEMP){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 		= $(this);
				let parentTR 	= $this.closest("tr");
				let {id} 		= $this.data();

				if(pr_MEM_TEMP[id])	delete pr_MEM_TEMP[id];
				parentTR.remove();
			})
		}
		
		var do_lc_save_member_prj = function(members, idPrj, codePrj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER, {
				id: idPrj, 
				code: codePrj, 
				members: JSON.stringify(Object.values(pr_MEM_TEMP))
			});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_member, [members, idPrj, codePrj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_member = function(sharedJson, members, idPrj, codePrj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
				do_lc_show_prj_member(pr_MEM_TEMP, idPrj, codePrj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
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
				selOpt 		+= `<div class="media align-items-center"><img src='${item.avatar.urlPrev}' class='rounded-circle avatar-xs mr-2'/> ${item.login01}</div>`;
			}
			return selOpt;
		}
		
		var do_lc_show_prj_member = function(members, idPrj, codePrj){
			do_lc_load_view();
			$("#div_prj_member")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER			, members));
			do_lc_bind_event_members_prj(members, idPrj, codePrj);
			do_lc_bind_event_resize();

			do_gl_apply_right($("#div_prj_member"));
		}
		//------------------------------End list member-----------------------------------
	}

	//------------------------------Start Doc list-----------------------------------
	var PrjTestUnitEntTabDoc 	= function (grpName, header, content, footer) {
		//------------------------------Start File list-----------------------------------
		let self			= this;
		const pr_ctr_Ent	= App.controller.PrjTestGroup.Ent;
		const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;

		var do_lc_load_view = function(){
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_DOCS				, PrjTestUnit_Ent_Tab_Docs);
		}

		this.do_lc_show_prj_docs = function(prj){
			do_lc_load_view();

			$("#div_prj_docs")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_DOCS, prj));
			do_lc_bind_event_docs_prj(prj);
			do_lc_bind_event_resize();
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}

		var do_lc_bind_event_docs_prj = function(prj){
//			let	obj 		= {files:[]};
			if(!prj.files)	prj.files = [];
			let option		= {
					fileinput	: { 
						param 			: {typ01: 1, typ02: 1, filenameKept: 1},
						addRemoveLinks 	: !pr_ctr_Ent.can_lc_role_user_worker()
					},//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_docs"), option);

			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})

			$(".item-file-delete").off("click").on("click", function(){
				let id	= $(this).data("id");
				$(this).parents("tr").remove();
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
				
				newprj.files 		=   prj.files;
				
				newprj = $.extend(false, prj, newprj);

				console.log(prj.files);

				do_lc_save_files_prj(newprj);
			})

			$("#a_btn_cancel_doc").off("click").on("click", function(){
				self.do_lc_show_prj_docs(prj);
			})
		}

		var do_lc_save_files_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_FILES, {obj: JSON.stringify(prj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_files_prj, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_files_prj = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				prj.files = sharedJson[App['const'].RES_DATA].files;
				self.do_lc_show_prj_docs(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		//------------------------------End File list-----------------------------------
	}
	//------------------------------End File list-----------------------------------

	//------------------------------Start Comment list-----------------------------------
	var PrjTestUnitEntTabComment 	= function (grpName, header, content, footer) {
		//------------------variable pagination post------------------------------------------------------
		var pr_POST_BEGIN 			= 0;
		const pr_POST_NUMBER 		= 10;
		const pr_POST_TYPE_CMT 		= 110;
		const pr_POST_NO_SUB 		= 1;
		const pr_POST_HAS_SUB 		= 2;
		const pr_POST_KEY_ENTER 	= 13;
		const self					= this;
		const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;
		
		//------------------------------Start comment list-----------------------------------
		var do_lc_load_view = function(){
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_COMMENT			, PrjTestUnit_Ent_Tab_Comment);
		}

		var do_lc_show_prj_comment = function(dataCmts, prj){
			do_lc_load_view();
			$("#div_comment_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_COMMENT, dataCmts));
			
//			$(".a-delete[data-userid= '" + App.data.user.id +"']").removeClass("d-none");
			
			App.SummerNoteController.do_lc_show("#div_prj_comments", {height : 100}, true);//text editor
			
			do_lc_bind_event_comments_prj(prj);
			do_lc_bind_event_resize();
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}

		this.do_lc_get_list_comments = function(prj, reBuild = false){
			let cond 		= {
					id		: prj.id			, 
					code	: prj.code01		,
					begin	: pr_POST_BEGIN		, 
					number	: pr_POST_NUMBER	, 
					nbLevel	: pr_POST_HAS_SUB	,			
					forced	: true				, 
					reBuild,
			}

			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_COMMENTS, cond);	

			var callbackFunct = function(data) {		//data => sharedJson
				do_lc_show_comment_Dyn(data, prj);
			}

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

		var do_lc_show_comment_Dyn = function(sharedJson, prj){
			let data			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				data		= sharedJson[App['const'].RES_DATA];
			}

			do_lc_show_prj_comment(data, prj);
		}

		var do_lc_bind_event_comments_prj = function(prj){
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
				if(id)	do_lc_delete_comment(id, prj);
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
					if(comment.trim() !== "") do_lc_send_comment(prj,comment,iParent,id)
				
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

		var do_lc_send_comment = function(prj, comment, iParent, cmtId){
			let cond 		= {id: prj.id, code: prj.code01, comment, iParent, cmtId};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_COMMENT, cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSend_cmts, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_afterSend_cmts = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				data && self.do_lc_get_list_comments(prj, true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		var do_lc_delete_comment = function(idCmt, prj){
			let cond 		= {id: prj.id, code:prj.code01, cmtId: idCmt};
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoPost" , "SVNsoPostDel12H", cond);

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDelete_cmts, [idCmt, prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_afterDelete_cmts = function(sharedJson, idCmt, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				self.do_lc_get_list_comments(prj, true);
				$(".post-lement-content[data-id='"+ idCmt +"']").remove();
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
	}
	//------------------------------End comment list-----------------------------------

	//------------------------------Start Content prj-----------------------------------
	var PrjTestUnitEntTabContent 	= function (grpName, header, content, footer) {
		const self						= this;
		const pr_TYPE01_INDUSTRY		= 1;
		const pr_TYPE01_INFORMATIQUE	= 2;
		const pr_TYPE01_BUISINESS		= 3;
		const pr_TYPE01_TRAVEL			= 4;
		const pr_project				= App.controller.PrjTestGroup;

		const pr_ctr_Ent				= App.controller.PrjTestGroup.Ent;

		var dataWF						= null;
		
		var members                     = {};
		var pr_isViewSprint             = false;
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 1;
		const pr_member_lev_worker 		= 2;

		const pr_CHECK_NOT_FINISH 		= 1;
		const pr_CHECK_FINISH 			= 2;
		
		const var_lc_MODE_SEL       	= 0;
		const var_lc_MODE_NEW       	= 1;
		const var_lc_MODE_MOD      	 	= 2;

		const pr_NB_RECORD_HISTORY		= 10;

		const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;

		var pr_DEFAULT_VAL			    = 0;
		var pr_div_rating		        = ['#rating_01'];
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
		

		const do_lc_transfert_data = (data, id) => {
			let prjInd 	= data.findIndex(prj => prj.id === prj.grp);
			let prjAll 	= data[prjInd];
			data.splice(prjInd, 1);

			let mapPrj 	= new Map();

			for(let p of data){
				mapPrj.set(p.parent, p);
				p["isShow"] = p.id == id ? true : false;
			}

			const addTree = pItem => {
				if(mapPrj.has(pItem.id)){
					pItem["child"] = mapPrj.get(pItem.id);
					addTree(pItem["child"] );
				}
			}

			addTree(prjAll);
			do_lc_show_path(prjAll);
		}

		//------------------------------Start content prj-----------------------------------
		var do_lc_load_view = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT				, PrjTestGroup_Ent_Content);
			// tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT_PATH			, PrjTestUnit_Ent_Content_Path);
			// tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT_CHECK_LIST	, PrjTestUnit_Ent_Content_Check_List);
			// tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT_HISTORY		, PrjTestUnit_Ent_Content_History);
			// tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_WORKFLOW_VIEW			, PrjTestUnit_Ent_Workflow_View);
			// tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_WORKFLOW_POPUP_PICK_USER			, PrjWorkflow_Popup_Pick_User);
		}
		
		this.do_lc_show_prj_content = function(prj, mode){
			do_lc_load_view();
			do_lc_show_content(prj, mode);
			do_lc_get_path_prj(prj);
			
//			dataWF = null;
//			dataWF = do_lc_show_wf_task(prj);
		}

		var do_lc_show_content = function(prj, mode){
			$("#div_prj_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT, prj));
			
//			do_lc_show_checkList(prj);

			if(prj.stat == pr_STAT_PRJ_CLOSED){
				$("#div_star_eval").show();
				if(prj.val00 != null && prj.val00 != pr_DEFAULT_VAL) do_lc_show_evalutation(prj.val00, false);
				else do_lc_show_evalutation(pr_DEFAULT_VAL, true);
			}else{
				do_lc_show_evalutation(pr_DEFAULT_VAL, true);
			}
			
			do_lc_bind_event_content_prj(prj, mode);
			do_lc_bind_event_resize();

			do_lc_init_element(prj);

			//--- if business , load client, if not, hide div
			if(prj.typ01 == pr_TYPE01_BUISINESS){
				App.controller.PrjTestGroup.EntCustomer.do_lc_get_list_customers(prj.id);
			} else {
				$("#div_prj_customers")	.html("");
			}

			pr_ctr_Ent.do_lc_reqRole_User();
			
			if(prj.stat == pr_STAT_PRJ_DONE) {
				let $parent = $(".val05").parent();
				$parent.find(".info-edit")	.off("click");
				$parent.find(".val05")	.removeClass("content-edit");
			}
			do_gl_apply_right($("#div_prj_content"));
		}

//		const do_lc_show_checkList = (prj) => {
//			//clone list check list
//			$("#div_check_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT_CHECK_LIST, prj));
//			do_lc_bind_event_checkList(prj);
//		}
		
		const do_lc_show_evalutation =  (eval, isDef) => {
			do_gl_bar_rating_init_one("eval01", eval);
			do_gl_bar_rating_show_all(pr_div_rating, "", null, eval, null );
			req_gl_bar_rating_value(pr_div_rating, eval);
			if(isDef) $("#div_star_eval").find("a[data-rating-value='"+ 1 +"']").removeClass("br-selected br-current");
		}

//		const do_lc_bind_event_checkList = (prj) => {
//			$(".item-chk-box").off("change").on("change", function(){
//				const $this 	= $(this);
//				const isCheck 	= $this.is(":checked");
//				const {index} 	= $this.data();
//				prj.lstClone[index].stat = isCheck ? pr_CHECK_FINISH : pr_CHECK_NOT_FINISH;
//				do_lc_show_checkList(prj);
//				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
//				pr_ctr_Ent.do_lc_reqRole_User();
//			})
//
//			$(".remove-item-chk").off("click").on("click", function(){
//				const {index} 	= $(this).data();
//				index > -1 && prj.lstClone.splice(index, 1);
//				do_lc_show_checkList(prj);
//				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
//			})
//
//			$(".edit-item-chk").off("click").on("click", function() {
//				const {index} 		= $(this).data();
//				let _content_chk 	= prj.lstClone[index].item;
//				if(!_content_chk)	return false;
//
//				const do_lc_edit_chk_lst = () => {
//					const _content_chk_new = $("#inp_chk_lst").val();
//					if(!_content_chk_new || !_content_chk_new.trim().length)	return false;
//
//					prj.lstClone[index].item = _content_chk_new.trim();
//					do_lc_show_checkList(prj);
//					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
//					App.MsgboxController.do_lc_close();
//				}
//
//				App.MsgboxController.do_lc_show({
//					title 		: $.i18n("prj_project_descr02_msgbox_edit"),
//					content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" value="${_content_chk}" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
//					autoclose	: false,
//					buttons 	: {
//						UPDATE : {
//							lab 		: $.i18n("prj_project_descr02_edit"),
//							funct 		: do_lc_edit_chk_lst,
//							classBtn	: "btn-primary",
//							autoclose	: false
//						},
//						CALCEL : {
//							lab 		: $.i18n("common_btn_cancel"),
//						}
//					}
//				});
//			})
//		}

		const do_lc_init_element = function(){
			$(".tmpicker").timepicker({//timepicker
				showMeridian: false,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			});
			setTimeout(function(){
				App.SummerNoteController.do_lc_show("#div_prj_info");
			},500);
		}

		var do_lc_bind_event_content_prj = function(prj, mode){

//			let files = prj.avatar ? [prj.avatar] : [];
//			let	obj 		= {files};
			if(!prj.files)	prj.files = [];
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1}, acceptedFiles: "image/*" },//option here
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
					case pr_STAT_PRJ_DEPLOY		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
					}

					if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					do_lc_create_prj(newPrj)
				})
				
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}

					pr_project.Ent.do_lc_reqRole_User();
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

					pr_project.Ent.do_lc_reqRole_User();
				})

				$("#a_btn_save, #a_btn_save02").off("click").on("click", function(){
					// prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
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

						// newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
						// newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);

						newPrj 			= $.extend(false, prj, newPrj);
					}

					// newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;
					// newPrj.val00    = null;
					
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
					case pr_STAT_PRJ_DEPLOY		: newPrj.val05 = 100; break;
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
				})

				$("#a_btn_cancel, #a_btn_cancel02").off("click").on("click", function(){
					self.do_lc_show_prj_content(prj, null, pr_isViewSprint);
				})

				$(".btn-reload").off("click").on("click", function(){
					let {name: typLoad} = $(this).data();
					do_lc_get_content_reload(prj, typLoad);
				})

				$("#btn_refresh_content").off("click").on("click", function() {
					do_lc_refresh_content(prj, prj.id);
				});

				$("#btn_delete").off("click").on("click", function() {
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_test_group_del"),
						content 	: $.i18n("prj_test_group_del_content"),
						css			: {"max-width": "400px"},
						autoclose	: false,
						buttons		: {
							OK: {
								lab			: $.i18n("common_btn_ok"),
								funct		: do_lc_delete_content,
								param		: [prj, prj.id],
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						}
					});
				});

				$("#btn_duplicate_content").off("click").on("click", function() {
					do_lc_duplicate_content(prj);
				});

				$("#btn_add_avatar").off("click").on("click", function(){
					$("#div_prj_ent_file_avatar").removeClass("hide");
					$(this).addClass("hide");
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				});
				
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
				
				$("#btn_show_history").off("click").on("click", function() {
					do_gl_init_msgbox_annonce(`<div id="div_history_list"></div><div id="div_history_pagination"></div>`, null, $.i18n("prj_history_title"));
					do_lc_get_history(prj);
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
		
		const do_lc_get_history = function(prj){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_HISTORY_TASK, {id : prj.id});

//			const callbackFunct 	= data => do_lc_after_reqList_history(data);
//
//			const opt = {
//					divMain			: "#div_history_list",
//					divPagination	: "#div_history_pagination",
//					url_api 		: App.path.BASE_URL_API_PRIV, 
//					url_header 		: App.data["HttpSecuHeader"],
//					url_api_param 	: ref,
//					pageSize 		: pr_NB_RECORD_HISTORY,
//					pageRange		: 1,
//					callback		: callbackFunct
//			};
//
//			do_gl_init_pagination_opt(opt);
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_req_history, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_req_history = function(sharedJson){
			const data = can_gl_AjaxSuccess(sharedJson) ? sharedJson[App['const'].RES_DATA] :  {};
			if(data.cmt){
				let cmt = JSON.parse(data.cmt);
				do_lc_show_listHistory(cmt);
			}
		}

		const do_lc_show_listHistory = function(data){
			data = data.reverse();
			$("#div_history_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_CONTENT_HISTORY , data));
		}

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		var do_lc_save_prj_content = function(newPrj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(newPrj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjContent, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_prjContent = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				prj 		= $.extend(true, prj, data);

				self.do_lc_show_prj_content(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		var do_lc_get_content_reload = function(prj, typLoad){
			if(!typLoad)	return false;
			let pr_SV_NAME_RELOAD 	= typLoad === "val02" ? pr_SV_EVAL_GET_BUDGET : pr_SV_EVAL_GET_PERCENT;

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_EVAL_CLASS, pr_SV_NAME_RELOAD, {id: prj.id});	

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
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id: prjId, code : prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_del_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
				
				$(".btn-refrest-list").trigger("click");
				$("#div_task_content_main").html("");
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_del'));
				do_gl_show_Notify_Msg_Error ($.i18n('sprint_err_msg_del'));
			}
		}

		var do_lc_refresh_content = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_CONTENT, {id: prjId, code: prj.code01});			

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

				// pr_project.EntEpic		.do_lc_show_prj_epic(prj);
				pr_project.EntTask		.do_lc_show_prj_task(prj);
				// pr_project.EntDoc		.do_lc_show_prj_docs(prj);
				// pr_project.EntEval		.do_lc_get_prj_evaluation(prj);
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
			pr_project.EntDoc		.do_lc_show_prj_docs(newObj, 1);
			
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
			
			return obj;
		}
		
		const do_lc_create_prj = prj => {
			let dataSend	= {obj: JSON.stringify(prj), member : Object.values(members)};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_prj = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${data.id}&code=${data.code01}`, "VI_MAIN/"+ App.router.part.PRJ_TESTGROUP_ENT, [data.id], '_self');
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

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

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
			case pr_STAT_PRJ_DEPLOY		: newPrj.val05 = 100; break;
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

		

		//------------------------------End content prj-----------------------------------
	}

	//------------------------------Start Member list-----------------------------------
	var PrjTestGroupEntTabMemberGroup 	= function (grpName, header, content, footer) {
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_GROUP_TYPE 		= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
		
		var pr_GROUP_TEMP		     	= {};
		var pr_MEM_TEMP		        	= {};
		var allMembers 					= [];
		const pr_member_lev_manager 	= 0;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		var self                        = this;
		const pr_ctr_Ent				= App.controller.PrjTestGroup.Ent;
		const pr_ctr_Main 				= App.controller.PrjTestGroup.Main;

		var do_lc_load_view = function(){
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER_GROUP				, PrjTestGroup_Ent_Tab_Member_Group);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER_GROUP_POPUP		, PrjTestGroup_Ent_Tab_Member_Group_Popup);
		}

		this.do_lc_get_list_member = function(prj){
			pr_GROUP_TEMP   = {};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER_GROUP, {id: prj.id, code: prj.code01});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_show_list_member, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_show_list_member = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];

				const is_Me 		= data.find(m => m.entId02 == App.data.user.id);
				const isSuperAdmin 	= App.controller.UI.Login && App.controller.UI.Login.can_lc_User_SuperAdmin();
				const isOwner		= App.data.user.id === prj.autUser01;
				
				allMembers 	= data.reduce((currentObj, mem)=>{
					if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
					
					if(!isSuperAdmin && !isOwner){
						if(is_Me && is_Me.typ <= mem.typ && is_Me.lev >= mem.lev)	mem.notModif = true;
					}
					
					if(mem.entTyp02 == 1000) mem.isUser = true;
					else{
						if(mem.ent02.val01 && (typeof mem.ent02.val01 == 'string')){
							mem.ent02.val01 = JSON.parse(mem.ent02.val01);
						}
						
						pr_GROUP_TEMP[mem.entId02] = mem;
					}
					currentObj.push(mem);
					return currentObj;
				}, []);

				do_lc_show_prj_member(allMembers, prj);
				pr_ctr_Ent.do_lc_reqRole_User();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_bind_event_members_group_prj = function(allMembers, prj){
//			pr_GROUP_TEMP = $.extend(false, {}, allMembers);
			
			$("#btn_add_group").off("click").on("click", function(){
				$(".action-item-group").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member_group").off("click").on("click", function(){
				do_lc_save_member_prj(allMembers, prj);
			})

			$("#a_btn_cancel_member_group").off("click").on("click", function(){
				do_lc_show_prj_member(allMembers, prj);
			})

			$(".member-group-edit").off("click").on("click", function(){
				let $this 			= $(this);
				let {memid} 		= $this.data();
				let mem 			= pr_GROUP_TEMP[memid];
				if(mem){
					let parentTR 	= $this.closest("tr");
					parentTR.find(".content-member").addClass("hide");
					parentTR.find(".edit-member").removeClass("hide");
					let divLev 		= parentTR.find(".level-edit");
					let divTyp 		= parentTR.find(".typ-edit");
					do_lc_bindEvent_tabMemberEdit(memid, divLev, divTyp);
					$(".action-mem-group").removeClass("hide");
				}
			})

			$(".member-group-delete").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_GROUP_TEMP[memid];
				if(mem){
					delete pr_GROUP_TEMP[memid];
					$(this).closest("tr").remove();
					$(".action-mem-group").removeClass("hide");
				}
			})
			
			$(".show_mem_group").off("click").on("click", function(){
				let {memid} = $(this).data();
				let arr = Object.values(allMembers);
				
				let memGroup = arr.filter(item => item.stat == memid);
				
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_member_group"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER_GROUP_POPUP, memGroup),	
					autoclose	: false,
					buttons		: {
						Ok: {
							lab		:  $.i18n("common_btn_ok"),
						}
					},
				});	
			})
			
			

			let el = "#inp_name_group";
			let reqSelectGroup = function(item){
				if(pr_GROUP_TEMP[item.id])			return false;

				let typ 		= $("#sel_group_type").val();
				let mem 		= {"typ": typ, "ent02": item, "entId02": item.id, "entId01": prj.id, "entTyp02": 40000};
				
				let name = ""
				if(!item.name)	name = "A";
				else name =  item.name.trim().substr(0,1).toUpperCase();

				let strName = item.name.length > 10?item.name.substr(0, 10) + "..." : item.name;
				
				pr_GROUP_TEMP[item.id] = mem;
				let selOpt 		= `<tr>`;
				selOpt 			+= `<td><a data-id='${item.id}' class='text-danger btn-remove-group' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></td>`;
				
				if(!item.val01) selOpt 			+= `<td style='width: 50px;'><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div></td>`;
				else{
					if(!item.val01.img) selOpt 	+= `<td style='width: 50px;'><div class="rounded-circle avatar-xs text-primary text-uppercase bg-soft-primary text-center mr-2"><div class="text-middle">${name}</div></div></td>`;
					else                selOpt 	+= `<td style='width: 50px;'><img src='${item.val01.img}' class='rounded-circle avatar-xs' alt=''/></td>`;
				}
				selOpt 			+= `<td><h5 class='font-size-14 m-0' title="${item.name}"><a href='' class='text-dark'>${strName}</a></h5></td>`;
				selOpt 			+= `<td>` + $.i18n(PRJ_GROUP_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;

				$("#tabGroup table tbody").append(selOpt);
				do_lc_bind_event_autocomplete_group(pr_GROUP_TEMP);
				$(el).blur().val("");
			}

			let optionsG = {
				dataService 	: [pr_SERVICE_GROUP_CLASS, pr_SV_GROUP_SEARCH], 
				apiUrl			: App.path.BASE_URL_API_PRIV,
				dataRes 		: ["name"],
				dataReq			: {nbLine:5, typ01s: 300},
				selectCallback	: reqSelectGroup, 
				// customShowList	: do_lc_customLst_group_autocomplete,
			}
			do_gl_set_input_autocomplete(el, optionsG);
		}

		var do_lc_bind_event_autocomplete_group = function(pr_GROUP_TEMP){
			$(".btn-remove-group").off("click").on("click", function(){
				let $this 		= $(this);
				let parentTR 	= $this.closest("tr");
				let {id} 		= $this.data();

				if(pr_GROUP_TEMP[id])	delete pr_GROUP_TEMP[id];
				parentTR.remove();
			})
		}

		var do_lc_save_member_prj = function(allMembers, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER_GROUP, {
				id			: prj.id, 
				code		: prj.code01, 
				groups		: JSON.stringify(Object.values(pr_GROUP_TEMP))
			});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_member_group, [allMembers, prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_member_group = function(sharedJson, allMembers, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
//				do_lc_show_prj_member(members, prj);
				self.do_lc_get_list_member(prj)
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_bindEvent_tabMemberEdit = function(memid, divLev, divTyp){
			$(divLev).off("change").on("change", function(){
				pr_GROUP_TEMP[memid].lev = $(this).val();
			})

			$(divTyp).off("change").on("change", function(){
				pr_GROUP_TEMP[memid].typ = $(this).val();;
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

		var do_lc_show_prj_member = function(allMembers, prj){
			do_lc_load_view();
			$("#div_prj_member_group")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TESTGROUP_ENT_TAB_MEMBER_GROUP		, allMembers));
			do_lc_bind_event_members_group_prj(allMembers, prj);
			do_lc_bind_event_resize();

			do_gl_apply_right($("#div_prj_member_group"));
		}
		
//		const do_lc_get_member_of_group = (groupId, idPrj) => {
//			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER_GROUP, {id: idPrj});	
//
//			let fSucces		= [];
//			fSucces.push(req_gl_funct(null, do_lc_afterGet_member_group, [idPrj]));
//
//			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
//
//			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
//		}
//		
//		var do_lc_afterGet_member_group = function(sharedJson, idPrj){
//			if(can_gl_AjaxSuccess(sharedJson)) {
//				members = sharedJson.res_data;
//			} else {   
//				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
//			}
//		}
		//------------------------------End list member group-----------------------------------
	}
	//------------------------------End content prj-----------------------------------

	return { PrjTestUnitEntTabTask, PrjTestUnitEntTabMember,  PrjTestUnitEntTabDoc, PrjTestUnitEntTabComment, PrjTestUnitEntTabContent, PrjTestGroupEntTabMemberGroup};
});