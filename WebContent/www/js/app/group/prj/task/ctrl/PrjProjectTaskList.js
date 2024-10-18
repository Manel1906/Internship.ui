define(['jquery'], function($) {

	const PrjProjectTaskList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SERVICE_CLASS_DYN	= "ServicePrjProjectDyn"; //to change by your need
		const pr_SV_LIST_DYN		= "SVLstPage"; 
		const pr_SV_SAVE_MOVE		= "SVTaskMove";
		const pr_SV_LST_PRJ			= "SVPrjListByUser";
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD			= 10;

		const pr_TYPE00_PRJ 			= 10;

		const pr_TYPE02_PRJ 			= 0;
		const pr_TYPE02_EPIC 			= 1;
		const pr_TYPE02_TASK 			= 2;

		const pr_STAT_PRJ_NEW 			= 100100;
		const pr_STAT_PRJ_TODO 			= 100200;
		const pr_STAT_PRJ_INPROGRESS 	= 100300;
		const pr_STAT_PRJ_DONE 			= 100400;
		const pr_STAT_PRJ_TEST 			= 100500;
		const pr_STAT_PRJ_REVIEW 		= 100600;
		const pr_STAT_PRJ_DEPLOY 		= 100700;
		const pr_STAT_PRJ_UNRESOLVED 	= 100800;
		const pr_STAT_PRJ_CLOSED 		= 100900;

		const initialValues = {
				lstPrj : []
		}

		var pr_SEARCHKEY				= "";
		var pr_GROUP					= null;
		var pr_CODE 					= null;		
		var pr_SEARCHKEY_USER			= null;
		
		var pr_DIV_CONTENT              = "#div_task_content_main";
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_PrjTask_Main        	= App.controller.PrjTask.Main;
			pr_ctr_PrjTask_List        	= App.controller.PrjTask.List;
			pr_ctr_Ent                 	= App.controller.PrjProject.Ent;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(pId, code){               
			try{
				pr_GROUP = pId;
				pr_CODE  = code;
				do_lc_load_view();
				do_get_list_ByAjax();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjProjectTaskList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			$("#div_task_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TASK_LIST_TAB, {"id" : pr_GROUP, "code" : pr_CODE}));
		}
		
		const do_binding_event_task = () => {
			$(".task-item-name").off("click").on("click", function(event){
				if($(event.target).hasClass("task-option"))	return;

				let $this = $(this);
				if ($this.hasClass('ui-draggable-dragging'))	return;

				let {id, code} = $this.data();
				pr_ctr_Ent.do_lc_show(id,code, pr_DIV_CONTENT);
				
				$(".task-item").css("background-color", "#fff")
				$(".task-item[data-id='" + id + "']").css("background-color", "#cceeff")
			});

			$(".btn-resize-list").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
			})	

//			$(".view-all-task-prj").off("click").on("click", function(){
//				let {group, code} = $(this).data();
//				if(group){
//					pr_GROUP = group;
//					do_lc_req_list_by_stat();
//					$(".inp-search, .inp-search-responsive").val(code);
//				}
//			})

			$(".remove-task").off("click").on("click", function(){
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_UNRESOLVED};
					do_lc_save_change_stat(params);
				}
			})
			
			$(".todo-task").off("click").on("click", function() {
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_INPROGRESS};
					do_lc_save_change_stat(params);
				}
			})
			
			
			$(".review-task").off("click").on("click", function() {
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_REVIEW};
					do_lc_save_change_stat(params);
				}
			})

			$(".complete-task").off("click").on("click", function() {
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					let params = {id, statFrom,  statTo: pr_STAT_PRJ_DONE};
					do_lc_save_change_stat(params);
				}
			})

			$(".close-task").off("click").on("click", function() {
				let $this 					= $(this);
				let {id, stat: statFrom} 	= $this.data();
				if(id){
					const params = {id, statFrom,  statTo: pr_STAT_PRJ_CLOSED};
					do_lc_save_change_stat(params);
				}
			})
			
			$(".btn-refrest-list").off("click").on("click", function(){
				const {id} = $(this).data();
				pr_GROUP = id;
				do_get_list_ByAjax(true);
			})
			
			$("#inp_search").off("keydown").on("keydown", function(e){
				pr_SEARCHKEY	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax);
			})

			App.router.controller.do_lc_binding_route();
			
		}


		const do_get_list_ByAjax = (forced) => {	
			let dataSend = {
				isAll           : true,
				typ00		   	: pr_TYPE00_PRJ,
				typ02           : pr_TYPE02_TASK,
				searchKey       : pr_SEARCHKEY,
				group           : pr_GROUP,
				searchUser      : pr_SEARCHKEY_USER && pr_SEARCHKEY_USER.length	? pr_SEARCHKEY_USER : null,
				wAva            : false,
				forced,
			};

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, dataSend);

			let divMain 			= "#div_prj_list_stat";
			let divPagination 		= "#div_prj_pagination_stat";

			let callbackFunct 		= data => do_lc_show_list_ByAjax_Dyn(data, divMain);

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

		const do_lc_show_list_ByAjax_Dyn = (sharedJson, div) => {
			let data 			= {};
			if (can_gl_AjaxSuccess(sharedJson)) {
				let tasks		= sharedJson[App['const'].RES_DATA];
				if(tasks.lst)	data = tasks;
			}

			$(div)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TASK_LIST_CONTENT		, data));
//			$("#project_name").html(data.lst[0].prjMain.name);
			do_binding_event_task();
		}

		const do_lc_save_change_stat = params => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MOVE, params);	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_change_stat, [params]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_change_stat = (sharedJson, params) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_save'));
				do_get_list_ByAjax(true);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		


	};

	return PrjProjectTaskList;
});