define([
	'text!group/dashboard/tmpl/PrjDashboard_Ent.html',
	'text!group/dashboard/tmpl/PrjDashboard_Tab_Activity.html',
	
	'text!group/dashboard/tmpl/PrjDashboard_Tab_TaskLate.html',
	'text!group/dashboard/tmpl/PrjDashboard_Tab_UserEval.html',
	
	'text!group/dashboard/tmpl/PrjDashboard_Tab_UserInfo.html',
	'text!group/dashboard/tmpl/PrjDashboard_Tab_Social_Network.html',
	'text!group/dashboard/tmpl/PrjDashboard_Tab_Order.html',
	
	'text!group/dashboard/tmpl/PrjDashboard_Tab_TaskByDate.html',
	'text!group/dashboard/tmpl/PrjDashboard_Tab_TaskByDate_Result.html',
	
	'text!group/dashboard/tmpl/PrjDashboard_Tab_Chart_TaskByStat.html',
	'text!group/dashboard/tmpl/PrjDashboard_Tab_Chart_TaskByLevel.html',
	],
	function(	
			PrjDashboard_Ent,
			PrjDashboard_Tab_Activity,
			
			PrjDashboard_Tab_TaskLate,
			PrjDashboard_Tab_UserEval,
			
			PrjDashboard_Tab_UserInfo,
			PrjDashboard_Tab_Social_Network,
			PrjDashboard_Tab_Order,
			
			PrjDashboard_Tab_TaskByDate,
			PrjDashboard_Tab_TaskByDate_Result,
			
			PrjDashboard_Tab_Chart_TaskByStat,
			PrjDashboard_Tab_Chart_TaskByLevel
	){

	const PrjDashboardEnt 	= function (grpName, header, content, footer) {
		var pr_grpName				= grpName?grpName:"Dashboard";
		var pr_grpPath				= 'group/dashboard';
		
		const tmplName				= App.template.names[pr_grpName] = {};
		const tmplCtrl				= App.template.controller;
		
		const self 					= this;		
		//----------------------const API--------------------------------------------------------------
		const pr_ENTITY_TYPE		= 20000;
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_COUNT_NB_PRJ	= "SVCountNbPrj"; 
		const pr_SV_ROLE_RELATION	= "SVGetRelationRole"; 
		const pr_SV_GET_GLOBAL		= "SVGetTaskGlobal";
		
		
		const pr_SV_GET_KPI			= "SVGetTaskKPI";
		const pr_SV_GET_TASK_VAL	= "SVGetTaskVal";
		
		

		const pr_SERVICE_CLASS_DYN	= "ServicePrjProjectDyn";
		const pr_SV_LIST_LATE		= "SVLstLate";
		const pr_SV_LIST_ACTIVITY	= "SVLstActivity";
		const pr_SV_LIST_DYN		= "SVLstPage";

		//------------------const object------------------------------------------------------
		const pr_TYPE02_PRJ			= 0;
		const pr_TYPE02_EPIC		= 1;
		const pr_TYPE02_TASK		= 2;

		const pr_NUMBER_RECORD		= 9;
		const pr_NB_RECORD_ACTIVITY	= 4;

		const pr_STAT_PRJ_NEW 			= 100100;
		const pr_STAT_PRJ_TODO 			= 100200;
		const pr_STAT_PRJ_INPROGRESS 	= 100300;
		const pr_STAT_PRJ_DONE 			= 100400;
		const pr_STAT_PRJ_DEPLOY 		= 100700;
		const pr_STAT_PRJ_TEST 			= 100500;
		const pr_STAT_PRJ_REVIEW 		= 100600;
		const pr_STAT_PRJ_UNRESOLVED 	= 100800;
		const pr_STAT_PRJ_CLOSED 		= 100900;

		const pr_LEVEL_PRJ_1			= 1;
		const pr_LEVEL_PRJ_2			= 2;
		const pr_LEVEL_PRJ_3			= 3;
		const pr_LEVEL_PRJ_4			= 4;
		
		let   pr_DIV_CONTENT            = "#div_main_content";
		let   pr_SHOW_COMMON            = false;

		const PRJ_STAT 					= {	0		: "prj_project_stat_00"		, 1			: "prj_project_stat_01"		, 2			: "prj_project_stat_02"		, 3			: "prj_project_stat_03"		, 4			: "prj_project_stat_04"		, 5			: "prj_project_stat_05"		, 6			: "prj_project_stat_06"		, 7			: "prj_project_stat_07"		,
											100100	: "prj_project_stat_100100"	, 100200	: "prj_project_stat_100200"	, 100300	: "prj_project_stat_100300"	, 100400	: "prj_project_stat_100400"	, 100500	: "prj_project_stat_100500"	, 100600	: "prj_project_stat_100600"	, 100700	: "prj_project_stat_100700"	, 100800	: "prj_project_stat_100800"	,
										    100900	: "prj_project_stat_100900"	, undefined	: "prj_project_stat_undefined"
		};

		const strTyp = { 
		    1        : "prj_dashboard_history_typ_add"      , 2        : "prj_dashboard_history_typ_mod"        , 3        : "prj_dashboard_history_typ_del"        , 4        : "prj_dashboard_history_typ_join"       , 5        : "prj_dashboard_history_typ_modify"     , 
		    6        : "prj_dashboard_history_typ_out"      , 7        : "prj_dashboard_history_typ_comment"    , 9        : "prj_dashboard_history_typ_move"       , 10       : "prj_dashboard_history_typ_late"       , 11       : "prj_dashboard_history_typ_has_change" , 
		    12       : "prj_dashboard_history_typ_receive"  , 101      : "prj_dashboard_history_typ_new_task"   , 103      : "prj_dashboard_history_typ_add_cmt"    , 104      : "prj_dashboard_history_typ_add_task"   , 105      : "prj_dashboard_history_typ_add_mem"    , 
		    106      : "prj_dashboard_history_typ_add_file" , 107      : "prj_dashboard_history_typ_add_report" , 110      : "prj_dashboard_history_typ_mod_cont"   , 111      : "prj_dashboard_history_typ_mod_stat"   , 112      : "prj_dashboard_history_typ_mod_par"    , 
		    113      : "prj_dashboard_history_typ_mod_cmt"  , 114      : "prj_dashboard_history_typ_mod_task"   , 115      : "prj_dashboard_history_typ_mod_mem"    , 116      : "prj_dashboard_history_typ_mod_lev"    , 117      : "prj_dashboard_history_typ_mod_report" , 
		    118      : "prj_dashboard_history_typ_mod_role" , 119      : "prj_dashboard_history_typ_mod_stat_lst",120      : "prj_dashboard_history_typ_del_task"   , 125      : "prj_dashboard_history_typ_del_mem"    , 126      : "prj_dashboard_history_typ_del_file"   , 
		    127      : "prj_dashboard_history_typ_del_report","content": "prj_dashboard_history_tab_content"    , "member" : "prj_dashboard_history_tab_member"     , "prj"    : "prj_dashboard_history_tab_prj"        , "epic"   : "prj_dashboard_history_tab_epic"       , 
		    "task"   : "prj_dashboard_history_tab_task"     , "comment": "prj_dashboard_history_tab_comment"    , "file"   : "prj_dashboard_history_tab_file"       , "customer": "prj_dashboard_history_tab_customer"  , "off"    : "prj_dashboard_history_tab_day_off"    , 
		    "report" : "prj_dashboard_history_tab_report"   , "meeting": "prj_dashboard_history_tab_meeting"
		};

		const paramStats 				= {
				[pr_STAT_PRJ_NEW]			: {stat: pr_STAT_PRJ_NEW				, isShow : false	, colorBgr: "#efefef"},
				[pr_STAT_PRJ_TODO]			: {stat: pr_STAT_PRJ_TODO				, isShow : true		, colorBgr: "#e2dede"},
				[pr_STAT_PRJ_INPROGRESS]	: {stat: pr_STAT_PRJ_INPROGRESS			, isShow : true		, colorBgr: "#c7c7c7"},
				[pr_STAT_PRJ_DONE]			: {stat: pr_STAT_PRJ_DONE				, isShow : false	, colorBgr: "#D6EAF8"},
				
				[pr_STAT_PRJ_DEPLOY]		: {stat: pr_STAT_PRJ_DEPLOY				, isShow : true		, colorBgr: "#ABB2B9"},
				[pr_STAT_PRJ_TEST]			: {stat: pr_STAT_PRJ_TEST				, isShow : false	, colorBgr: "#C7D1B9"},
				[pr_STAT_PRJ_REVIEW]		: {stat: pr_STAT_PRJ_REVIEW				, isShow : true		, colorBgr: "#FCF3CF"},
				
				
				[pr_STAT_PRJ_CLOSED]		: {stat: pr_STAT_PRJ_CLOSED				, isShow : false	, colorBgr: "#A3E4D7"},
				[pr_STAT_PRJ_UNRESOLVED]	: {stat: pr_STAT_PRJ_UNRESOLVED			, isShow : false	, colorBgr: "#C6B7D9"},
		}
		
		
		var dataChartByStat 	= {};
		var dataChartByLevel 	= {};
		//------------------variable------------------------------------------------------
		var pr_ID_USER			= null;
		var pr_ID_PRJ			= null;
		var pr_ctr_Main 		= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init			= function(){
			pr_ctr_Main 										= App.controller.DBoard.DBoardMain;

			tmplName.PRJ_DASHBOARD_ENT							= "PrjDashboard_Ent";
			tmplName.PRJ_DASHBOARD_TAB_ACTIVITY					= "PrjDashboard_Tab_Activity";
			
			tmplName.PRJ_DASHBOARD_TAB_TASKLATE					= "PrjDashboard_Tab_TaskLate";
			tmplName.PRJ_DASHBOARD_TAB_USEREVAL					= "PrjDashboard_Tab_UserEval";
			
			tmplName.PRJ_DASHBOARD_TAB_USERINFO					= "PrjDashboard_Tab_UserInfo";
			tmplName.PRJ_DASHBOARD_TAB_SOCIALNETWORK			= "PrjDashboard_Tab_Social_Network";
			tmplName.PRJ_DASHBOARD_TAB_ORDER					= "PrjDashboard_Tab_Order";

			tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE				= "PrjDashboard_Tab_TaskByDate";
			tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE_RES			= "PrjDashboard_Tab_TaskByDate_Result";
			tmplName.PRJ_DASHBOARD_TAB_TASKSTAT					= "PrjDashboard_Tab_Chart_TaskByStat";
			tmplName.PRJ_DASHBOARD_TAB_TASKLEVEL				= "PrjDashboard_Tab_Chart_TaskByLevel";
			
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_ENT						, PrjDashboard_Ent);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_ACTIVITY				, PrjDashboard_Tab_Activity);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE			, PrjDashboard_Tab_TaskByDate);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKLATE				, PrjDashboard_Tab_TaskLate);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_USEREVAL				, PrjDashboard_Tab_UserEval);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE_RES		, PrjDashboard_Tab_TaskByDate_Result);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_USERINFO				, PrjDashboard_Tab_UserInfo);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_SOCIALNETWORK		, PrjDashboard_Tab_Social_Network);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_ORDER				, PrjDashboard_Tab_Order);
			
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKSTAT				, PrjDashboard_Tab_Chart_TaskByStat);
			tmplCtrl				.do_lc_put_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKLEVEL			, PrjDashboard_Tab_Chart_TaskByLevel);

		}
		
		var paramStatArr;				
	    var dataChartByStatDef;
		var dataChartByLevelDef;
		//---------show-----------------------------------------------------------------------------
		var pr_showed		= false;
		this.do_lc_show = function(id, div){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath+ "/transl", self.do_lc_show_content_callback, [id, div]);
				pr_showed = true;
			}else {
				self.do_lc_show_content_callback(id, div);
			}
		};
		
		this.do_lc_show_content_callback = function(id, div){
			try { 
				dataChartByStatDef = {
				    [pr_STAT_PRJ_NEW]        : { ord: 100, stat: pr_STAT_PRJ_NEW,        colorBgr: "#008FFB", label: $.i18n("prj_project_stat_100100"), nbTask: 0 },
				    [pr_STAT_PRJ_TODO]       : { ord: 200, stat: pr_STAT_PRJ_TODO,       colorBgr: "#3F51B5", label: $.i18n("prj_project_stat_100200"), nbTask: 0 },
				    [pr_STAT_PRJ_INPROGRESS] : { ord: 300, stat: pr_STAT_PRJ_INPROGRESS, colorBgr: "#33B2DF", label: $.i18n("prj_project_stat_100300"), nbTask: 0 },
				    [pr_STAT_PRJ_DONE]       : { ord: 400, stat: pr_STAT_PRJ_DONE,       colorBgr: "#00E396", label: $.i18n("prj_project_stat_100400"), nbTask: 0 },
				    [pr_STAT_PRJ_DEPLOY]     : { ord: 500, stat: pr_STAT_PRJ_DEPLOY,     colorBgr: "#D7263D", label: $.i18n("prj_project_stat_100700"), nbTask: 0 },
				    [pr_STAT_PRJ_TEST]       : { ord: 600, stat: pr_STAT_PRJ_TEST,       colorBgr: "#C7D1B9", label: $.i18n("prj_project_stat_100500"), nbTask: 0 },
				    [pr_STAT_PRJ_REVIEW]     : { ord: 700, stat: pr_STAT_PRJ_REVIEW,     colorBgr: "#4ECDC4", label: $.i18n("prj_project_stat_100600"), nbTask: 0 },
				    [pr_STAT_PRJ_UNRESOLVED] : { ord: 800, stat: pr_STAT_PRJ_UNRESOLVED, colorBgr: "#F86624", label: $.i18n("prj_project_stat_100800"), nbTask: 0 },
				    [pr_STAT_PRJ_CLOSED]     : { ord: 900, stat: pr_STAT_PRJ_CLOSED,     colorBgr: "#A5978B", label: $.i18n("prj_project_stat_100900"), nbTask: 0 }
				};
										
				dataChartByLevelDef = {
										[pr_LEVEL_PRJ_1]		: {colorBgr: "#008FFB", nbTask: 0, label: $.i18n("prj_project_lev_01")},
										[pr_LEVEL_PRJ_2]		: {colorBgr: "#A5978B", nbTask: 0, label: $.i18n("prj_project_lev_02")},
										[pr_LEVEL_PRJ_3]		: {colorBgr: "#33B2DF", nbTask: 0, label: $.i18n("prj_project_lev_03")},
										[pr_LEVEL_PRJ_4]		: {colorBgr: "#00E396", nbTask: 0, label: $.i18n("prj_project_lev_04")},
									};
				if(div){
					pr_DIV_CONTENT = div;
					pr_SHOW_COMMON = true;
				}
				do_lc_load_view(id);
				!!pr_ID_USER ? do_lc_get_role_relationship() : do_lc_build_page();
				$(document).prop('title',$.i18n('prj_project_sidebar_dashboard'));
			}catch(e) {		
				console.log(e);
			}
		};

		const do_lc_load_view 	= function(id){
			pr_ID_PRJ = null;
							
			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_ENT	, {}));

			let params 		= req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
			if(!id) id = params.id;
			if(id){
				pr_ID_USER 	=id;
			}
			
			if(pr_SHOW_COMMON) 	$(pr_DIV_CONTENT).find(".page-content").addClass('p-0');
		}

		const do_lc_build_page = function(){
			dataChartByStatDef = Object.values(dataChartByStatDef).sort((a, b) => a.ord - b.ord);
			dataChartByStat 	= JSON.parse(JSON.stringify(dataChartByStatDef));
			dataChartByLevel	= JSON.parse(JSON.stringify(dataChartByLevelDef));
						
			do_lc_get_user_info();
			do_lc_get_activity();
			do_lc_get_task_late();
			
			//----show kpi + task resume by date
			do_lc_build_task_byDate();
			do_get_list_ByAjax();
			
		}

		const do_lc_build_task_byDate = () => {
			$("#div_task_byDate")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE	, paramStats));
			do_lc_bind_event_task_byDate();
			do_lc_get_lst_kpi();
		}

		const do_lc_bind_event_task_byDate = () => {
			const now = new Date();
			const $dtBegin = $("#inp_dt_begin");
			$dtBegin.datepicker({
				//startDate	: new Date(Date.now() - 370 * 24 * 60 * 60 * 1000),
				endDate		: now
			});
			$dtBegin.datepicker("setDate", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

			const $dtEnd = $("#inp_dt_end");
			$dtEnd.datepicker({
				//startDate	: new Date(),
				//endDate		: new Date(Date.now() + 370 * 24 * 60 * 60 * 1000)
				endDate		: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
			});
			$dtEnd.datepicker("setDate"	, now);

			$("#inp_dt_begin, #inp_dt_end").off("change").on("change", function(){
				dataChartByStatDef = Object.values(dataChartByStatDef).sort((a, b) => a.ord - b.ord);
				dataChartByStat 	= JSON.parse(JSON.stringify(dataChartByStatDef));
				dataChartByLevel	= JSON.parse(JSON.stringify(dataChartByLevelDef));
				const opt = do_lc_req_data_form();
				// do_lc_get_lst_task_global(opt);
				do_lc_get_lst_kpi(opt);
			})
			
			// $(".prj-stat-cbx").off("change").on("change", function(){
			// 	const $this 	= $(this);
			// 	const {stat} 	= $this.data();
			// 	const isChecked = $this.is(":checked");
			// 	paramStats[stat].isShow = isChecked;

			// 	const opt = do_lc_req_data_form();
			// 	do_lc_get_lst_task_global(opt);
			// })
		}

		const do_lc_req_data_form = () => {
			const dataDate = req_gl_data({dataZoneDom: $("#div_date_period")});

			const { dtBegin, dtEnd } = dataDate.data;

			const stats 	= Object.values(paramStats).reduce((curr, stat) => {
				if(stat.isShow)	curr.push(stat.stat);
				return curr;
			}, []);

			do_lc_get_period_date(dtBegin.date, dtEnd.date);

			return {dtBegin : dtBegin.date, dtEnd : dtEnd.date, stats : JSON.stringify(stats)};
		}

		const do_lc_get_period_date = (dtBegin, dtEnd) => {
			const strDateBefore = DateFormat(dtBegin, DateFormat.masks.dbShortDateInverse);
			const strDateAfter 	= DateFormat(dtEnd, DateFormat.masks.dbShortDateInverse);

//			$("#span_periode").html(`${$.i18n('prj_dashboard_chart_dt_begin')} ${strDateBefore} ${$.i18n('prj_dashboard_chart_dt_end')} ${strDateAfter}`);
		}

		const do_lc_get_role_relationship = function() {
			let ref 	= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_ROLE_RELATION, {id: pr_ID_USER});

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_getRole_relationship_response, []));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [ $.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_getRole_relationship_response = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				do_lc_build_page();
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), () => pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_dashboard.html`, "VI_MAIN/"+ App.router.part.PRJ_DASHBOARD));
			}
		}

		const do_lc_get_task_late = function(){
			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_LATE, {typ02: pr_TYPE02_TASK});

			if(pr_ID_USER)	ref["user_id"] = pr_ID_USER;
			if (pr_ID_PRJ) ref["prj_id"] = pr_ID_PRJ;
			ref["forced"] = true;

			let callbackFunct 		= data => do_lc_show_list_ByAjax_Dyn(data);

			let opt = {
					divMain			: "#div_taskLate_list",
					divPagination	: "#div_taskLate_pagination",
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};

			do_gl_init_pagination_opt(opt);
		}

		const do_lc_show_list_ByAjax_Dyn = function(sharedJson){
			let data 		= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				data		= sharedJson[App['const'].RES_DATA];
			}
			do_lc_show_taskLate(data);
		}

		const do_lc_show_taskLate = function(data){
			$("#div_taskLate_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKLATE , data));
			do_lc_bind_event_taskLate();
		}

		const do_lc_bind_event_taskLate = function(){
			$(".btn-detail-task").off("click").on("click", function(){
				let {id: idTask, code: codeTask} = $(this).data();
				!!idTask && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${idTask}&code=${codeTask}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [idTask, codeTask]);
			})
		}

		const do_lc_get_activity = function(){
			let ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS_DYN, pr_SV_LIST_ACTIVITY);

			if(pr_ID_USER)	ref["user_id"] = pr_ID_USER;
			if (pr_ID_PRJ) ref["prj_id"] = pr_ID_PRJ;
			ref["forced"] = true;

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_after_reqList_activity, []));

			let fError 	= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [ $.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);

			// let callbackFunct 		= data => do_lc_after_reqList_activity(data);

			// let opt = {
			// 		divMain			: "#div_activity_list",
			// 		divPagination	: "#div_activity_pagination",
			// 		url_api 		: App.path.BASE_URL_API_PRIV, 
			// 		url_header 		: App.data["HttpSecuHeader"],
			// 		url_api_param 	: ref,
			// 		pageSize 		: pr_NB_RECORD_ACTIVITY,
			// 		pageRange		: 1,
			// 		callback		: callbackFunct
			// };

			// do_gl_init_pagination_opt(opt);
		}

		const do_lc_after_reqList_activity = function(sharedJson){
			let data = can_gl_AjaxSuccess(sharedJson) ? sharedJson[App['const'].RES_DATA] :  {};
			let newData = req_data_activity(data.lst);
			do_lc_show_listActivity(newData);
		}

		const req_data_activity = function(data) {
			let newData = [];
			if (data && data.length > 0) {
				data.forEach((e) => {
					try {
						let lstHistory = JSON.parse(e.inf01);
						if (lstHistory && lstHistory.length > 0) {
							// sort by date
							lstHistory.reverse();
							// keep uId = currentId
							lstHistory.forEach((history) => {
								if (history.uID == App.data.user.id && history.statOld != history.main.stat01) {
									history.parId = e.parId;

									// handle history record for html display
									/*let str = $.i18n("prj_dashboard_history_init") + " ";
									if(history.typ)		str += $.i18n(strTyp[history.typ]) + " ";
									if(history.typTab)	str += $.i18n(strTyp[history.typTab]) + " ";

									if (history.statOld != null)
										str += $.i18n("prj_dashboard_history_from") + " " + $.i18n(PRJ_STAT[history.statOld]) + " " + $.i18n("prj_dashboard_history_to") + " " + $.i18n(PRJ_STAT[history.main.stat01]) + " ";
									
									if (history.parId && history.typ != 3) str += `<a href='view_prj_project_content.html?id=${history.parId}' targer='_blank'> <i class="bx bx-right-arrow-alt font-size-16 text-primary align-middle ml-2"></i>${$.i18n("prj_dashboard_history_link_detail")}</a>`
									history.str = str;*/
									newData.push(history);
								}
							})
						}
					} catch (err) {
					}
				});
			}
			newData.sort((a, b) => new Date(b.dt) - new Date(a.dt));
			return newData;
		}

		const do_lc_show_listActivity = function(data){
			$("#div_activity_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_ACTIVITY , data));
			do_lc_bind_event_activity();
		}

		const do_lc_bind_event_activity = function(){
			$(".a_view_prj").off("click").on("click", function(){
				let {id, code} = $(this).data();
				!!id && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${id}&code=${code}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [id, code]);
			})
		}

		const do_lc_show_order = function(dataOrd){
			$("#div_user_order").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_ORDER , dataOrd));
		}

		const do_lc_get_lst_task_global = function(opt = do_lc_req_data_form()){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_GLOBAL, opt);	
			if(pr_ID_USER){
				ref["user_id"] = pr_ID_USER;
			}
			
			if(pr_ID_PRJ){
				ref["prj_id"] = pr_ID_PRJ;
			}

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_lst_global_response, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_lst_global_response = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				data && do_lc_show_chart(data);
			}
		}

		const do_lc_get_user_info = function(){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_COUNT_NB_PRJ);	
			if(pr_ID_USER){
				ref["user_id"] = pr_ID_USER;
			}
			
			if(pr_ID_PRJ){
				ref["prj_id"] = pr_ID_PRJ;
			}

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getUserInfo_response, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_getUserInfo_response = function(sharedJson){
			let data = {user: App.data.user, count: 0, eval: 0, cumul : 0, nbOrder: 0, nbOrderDone: 0, revenu: 0, avarage: 0};
			if(can_gl_AjaxSuccess(sharedJson)) {
				let {nbTask, nbDone, percentFinish, userInfo, valBring} = sharedJson;

				if(nbTask)	data.count 			= nbTask;
				if(nbDone) data.nbOrderDone 	= nbDone;
				if(valBring){
					data.cumul 					= valBring;
					data.revenu 				= valBring;
					data.avarage 				= valBring / nbTask;
				}
				if(percentFinish)	data.eval 	= Math.floor(percentFinish);
				if(userInfo)		data.user	= userInfo;
			}
			do_lc_show_user_info(data);
			do_lc_show_order(data);
		}

		//---------------------------------------------------------------------------------------------------------------------
		//---------------------------------------------------------------------------------------------------------------
		const do_lc_show_chart = (lstTask) => {
			do_lc_build_bar_chart(lstTask);
		}
		const do_lc_build_bar_chart = lstTask => {
			const options = {
					chart: {
						type: 'bar',
						height: '300px'
					},
					series: [{
						name: $.i18n('prj_project_percent') + ' (%)',
						data: lstTask.map(o => o.val05 || 0),
					}],
					xaxis: {
						categories: lstTask.map(o => o.code)
					},
					labels : lstTask.map(o => o.dtEnd),
					yaxis: {
						min: 0,
						max: 100,
						labels: {
							show: false
						}
					},
					dataLabels: {
						enabled: true,
					},
					legend : {
						show: false
					},
					tooltip: {
						theme: 'dark',
						x: {
							formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
								return `${lstTask[dataPointIndex].name} [${lstTask[dataPointIndex].parentPrj.name}]` ;
							}
						},
						y: {
							title: {
								formatter: (seriesName, { series, seriesIndex, dataPointIndex, w }) => {
									return `${$.i18n('prj_project_end_date')} : ${lstTask[dataPointIndex].dtEnd} </br>${seriesName} :`;
								},
							},
						},
					},
					fill: {
						colors: [function({ value, seriesIndex, w, dataPointIndex }) {
							if(lstTask[dataPointIndex].stat === undefined)	return "#775DD0";
							return paramStats[lstTask[dataPointIndex].stat].colorBgr;
						}]
					}
			}

			$("#stacked-column-chart").html("");

			const chart = new ApexCharts(document.querySelector("#stacked-column-chart"), options);

			chart.render();
		}

		const do_lc_show_user_info = function(infoUser){
			let infoSocialNetwork = infoUser.user.per.inf05;
			$("#div_user_info")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_USERINFO		, infoUser));
			$("#div_user_eval")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_USEREVAL		, infoUser));
			$("#div_social_network").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_SOCIALNETWORK	, infoSocialNetwork? JSON.parse(infoSocialNetwork): []));

			//re-write
			let optionRadialBars = {
					colors: ["#556ee6"],
					series: [infoUser.eval],
					labels: [$.i18n("prj_dashboard_tab_user_info_eval")]
			};
			do_gl_create_chart_radialBar_ApexChart("#radialBar-chart", optionRadialBars);

			do_lc_bind_event_userInfo();
		}

		const do_lc_bind_event_userInfo = function(){
			$("#btn_view_profile").off("click").on("click", function(){
				let idUser 		= App.data.user.id;
				let codeUser 	= App.data.user.login01;
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_aut_profile.html?id=${idUser}&code=${codeUser}`, App.router.part.PRJ_USER_PROFILE_ENT, [idUser, codeUser]);
			})

			$("#btn_view_task").off("click").on("click", function(){
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_task_list.html`, "VI_MAIN/"+ App.router.part.PRJ_TASK_LIST);
			})
		}

		const reqCountStatTask = function(obj, nbTaskToDo, nbTaskFinish, nbTaskEnCours){
			let stat = obj.stat;
			if(stat === pr_STAT_PRJ_NEW)	nbTaskToDo++;
			if(stat === pr_STAT_PRJ_DONE)	nbTaskFinish++;
			if([pr_STAT_PRJ_TODO, pr_STAT_PRJ_INPROGRESS, pr_STAT_PRJ_REVIEW].includes(stat))	nbTaskEnCours++;

			return [nbTaskToDo, nbTaskFinish, nbTaskEnCours];
		}

		const reqDataChart = function(lstPrj){
			return lstPrj.reduce(function(current, prj){
				let nbTaskToDo = 0, nbTaskEnCours = 0, nbTaskFinish = 0;
				if(prj.epics && prj.epics.length){
					for(let epic of prj.epics){
						if(epic.tasks){
							for(let task of epic.tasks){
								[nbTaskToDo, nbTaskFinish, nbTaskEnCours] = reqCountStatTask(task, nbTaskToDo, nbTaskFinish, nbTaskEnCours);
							}
						}else{
							[nbTaskToDo, nbTaskFinish, nbTaskEnCours] = reqCountStatTask(epic, nbTaskToDo, nbTaskFinish, nbTaskEnCours);
						}
					}
				}

				if(prj.tasks){
					for(let task of prj.tasks){
						[nbTaskToDo, nbTaskFinish, nbTaskEnCours] = reqCountStatTask(task, nbTaskToDo, nbTaskFinish, nbTaskEnCours);
					}
				}

				if(!(prj.tasks || prj.epics)){
					[nbTaskToDo, nbTaskFinish, nbTaskEnCours] = reqCountStatTask(prj, nbTaskToDo, nbTaskFinish, nbTaskEnCours);
				}

				current[prj.code01]= {nbTaskToDo, nbTaskEnCours, nbTaskFinish, id: prj.id, code : prj.code01};
				return current;
			}, {});
		}
	
		//---------------------------------------------------------------------------------------------------------------
		//---------------------------------------------------------------------------------------------------------------
		//build val real
		const do_lc_get_lst_kpi = function(opt = do_lc_req_data_form()){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_KPI, opt);	
			if(pr_ID_USER){
				ref["user_id"] = pr_ID_USER;
			}
			
			if(pr_ID_PRJ){
				ref["prj_id"] = pr_ID_PRJ;
			}

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_lst_kpi_response, [opt]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_get_lst_kpi_response = function(sharedJson, opt){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];
				let obj  = {
					kpi:  data.kpiTotal.toFixed(2),
					time: (data.workTimeTotal / (60 * 60 * 1000)).toFixed(2),
					nbTask: data.nbTask,
					timeAVG : (data.workTimeTotal / (60 * 60 * 1000 * data.nbTask)).toFixed(2),
				}
				$("#div_user_kpi")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE_RES	, obj));
				
				//------show chart
				do_lc_get_task_val(opt);
			} else {
				$("#div_user_kpi")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKBYDATE_RES	, {}));
			}
		}
		
		
		const do_lc_get_task_val = function(opt = do_lc_req_data_form()){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_TASK_VAL, opt);	
			if(pr_ID_USER){
				ref["user_id"] = pr_ID_USER;
			}
			
			if(pr_ID_PRJ){
				ref["prj_id"] = pr_ID_PRJ;
			}

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_task_val_resp, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_get_task_val_resp = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let set = sharedJson[App['const'].RES_DATA];
				
				data = set["stat"];
				/*for(let key in data){
					dataChartByStat[key].nbTask 	= data[key];
				}*/
				for (let key in data) {
				            let statItem = dataChartByStat.find(item => item.stat === parseInt(key));
				            if (statItem) {
				                statItem.nbTask = data[key];
				            }
				        }
				do_lc_show_chart_stat();
				
				data = set["lev"];
				for(let key in data){
					dataChartByLevel[key].nbTask 	= data[key];
				}
				do_lc_show_chart_level();
			}
		}
		
		var do_lc_show_chart_level = function() {
			$("#div_task_level")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKLEVEL	, dataChartByLevel));
			do_lc_build_chart_level(dataChartByLevel);
		}
		
		const do_lc_build_chart_level = (data) => {
			const options = {
					chart: {
						type: 'bar',
						height: '300px'
					},
					dataLabels: {
						style: {
						      colors: ["#556ee6"],
						  },
					},
					series: [{
						name: $.i18n('prj_dashboard_tab_task_level_lab'),
						data: Object.values(data).map(o => o.nbTask),
					}],
					xaxis: {
						categories: Object.values(data).map(o => o.label),
					},
					tooltip: {
						theme: 'dark',
						x: {
							formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
								return `${value}`;
							}
						},
					},
					fill: {
						colors: [function({ value, seriesIndex, w, dataPointIndex }) {
							return data[dataPointIndex+1].colorBgr;
						}]
					},
					markers: {
					   colors: ['#F44336', '#E91E63', '#9C27B0']
					},
					dataLabels: {
					  style: {
						    colors: ['#FFFFFF']
						  }
					}
			}

			const chart = new ApexCharts(document.querySelector("#div_chart_task_level_content"), options);
			chart.render();
		}

		const do_lc_show_chart_stat = () => {
			$("#div_task_stat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_DASHBOARD_TAB_TASKSTAT	, dataChartByStat));
			do_lc_build_chart_stat(dataChartByStat);
		}
		
		const do_lc_build_chart_stat = (data) => {
			const options = {
					chart: {
						type: 'bar',
						height: '300px'
					},
					dataLabels: {
						style: {
						      colors: ["#556ee6"],
						  },
					},
					series: [{
						name: $.i18n('prj_dashboard_tab_task_real_val_lab'),
						data: Object.values(data).map(o => o.nbTask),
					}],
					xaxis: {
						categories: Object.values(data).map(o => o.label),
					},
					tooltip: {
						theme: 'dark',
						x: {
							formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
								return `${value} : ${data[dataPointIndex].nbTask} ${$.i18n("prj_project_epic_number_task")}`;
							}
						},
					},
					fill: {
						colors: [function({ value, seriesIndex, w, dataPointIndex }) {
							//return data[100000 + (dataPointIndex + 1) * 100].colorBgr;
							return data[dataPointIndex].colorBgr;
						}]
					},
					dataLabels: {
					  style: {
						    colors: ['#FFFFFF']
						  }
					}
			}

			const chart = new ApexCharts(document.querySelector("#div_chart_task_stat_content"), options);
			chart.render();
		}

		//end build val real
		const do_get_list_ByAjax = function(forced){
		    let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, {searchKey: "", typ00: 10, typ01: null, typ02: 0, forced});
		    if(pr_ID_USER){ ref["user_id"] = pr_ID_USER; }

		    let fSucces		= [];
		    fSucces.push(req_gl_funct(null, do_lc_show_list_prj, []));

		    let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
		    App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_list_prj = function(sharedJson) {
		    if (can_gl_AjaxSuccess(sharedJson)) {
		        let lst = sharedJson[App['const'].RES_DATA].lst;
		        if (!lst || lst.length <= 0) return;
				
				const 	placeholder = `<img src='www/img/logo/logo.png' class='rounded-circle avatar-xs avatar-autocomplete' style='border: 0.1px solid grey; background-color: white;' alt=""> &nbsp;&nbsp;${$.i18n("prj_task_tab_filter_prj")}`,
						currentVal = $("#sel_prj_filter").val(),
						selectData = [{
						    id: '-1',
						    text: placeholder
						}, ...lst.map(item => ({
						    id: item.id,
						    text: `<img src='${item.avatar?.urlPrev || item.avatar?.url || 'www/img/logo/logo.png'}' class='rounded-circle avatar-xs avatar-autocomplete' style='${item.avatar ? '' : 'border: 0.1px solid grey; background-color: white;'}' alt=""> &nbsp;&nbsp;${item.name}`
						}))];

				$("#sel_prj_filter").select2({ 
				    width: '100%', 
				    data: selectData, 
				    placeholder, 
				    escapeMarkup: m => m 
				}).val(sharedJson.group || '-1').trigger('change.select2').val(currentVal).trigger('change.select2');

				$("#div_select_prj").removeClass("hide").find("#sel_prj_filter").off('change').on('change', () => {
				        pr_ID_PRJ = $("#sel_prj_filter").val();
				        do_lc_build_page();
				});
		    }
		};

		
	
	};

	return PrjDashboardEnt;
});