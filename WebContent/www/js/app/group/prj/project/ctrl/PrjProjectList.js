define([
	'text!group/prj/project/tmpl/PrjProject_List.html',

	'group/prj/treeview/ctrl/TreeViewEntMsgbox',
	], function(
			PrjProject_List, 

			TreeViewEntMsgbox
	){

	const PrjProjectList 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------

		var self 					= this;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_DYN	= "ServicePrjProjectDyn";
		const pr_SV_LIST_DYN		= "SVLstPage";

		const pr_SERVICE_CLASS		= "ServicePrjProject";
		const pr_SV_MAIN_DEL		= "SVDel";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		var pr_BEGIN				= 0;
		const pr_NUMBER_RECORD		= 9;

		const pr_TYP_GRID			= 1;
		const pr_TYP_LIST			= 2;
		var pr_TYP_SHOW				= 1;

		var pr_searchKey			= "";
		const pr_KEY_ENTER			= 13;

		const pr_TYPE00_PRJ 			= 10;
		const pr_TYPE02_MAIN			= 0;

		const pr_STAT_PRJ_NEW 			= 100100;
		const pr_STAT_PRJ_TODO 			= 100200;
		const pr_STAT_PRJ_INPROGRESS 	= 100300;
		const pr_STAT_PRJ_DONE 			= 100400;
		const pr_STAT_PRJ_TEST 			= 100500;
		const pr_STAT_PRJ_REVIEW 		= 100600;
		const pr_STAT_PRJ_DEPLOY 		= 100700;
		const pr_STAT_PRJ_UNRESOLVED 	= 100800;
		const pr_STAT_PRJ_CLOSED 		= 100900;
		// const pr_STAT_PRJ_STANDBY 		= 3;
		const pr_STAT_PRJ_ALL 			= 10;

		const pr_OBJ_RIGHT				= 40000;
		const RIGHT_ADM					= 100;
		const RIGHT_P_D					= 4;

		const paramStats 				= {
				[pr_STAT_PRJ_NEW]		: {stat: pr_STAT_PRJ_NEW				, isShow : true},
				[pr_STAT_PRJ_TODO]		: {stat: pr_STAT_PRJ_TODO				, isShow : true},
				[pr_STAT_PRJ_INPROGRESS]: {stat: pr_STAT_PRJ_INPROGRESS			, isShow : true},
				[pr_STAT_PRJ_DONE]		: {stat: pr_STAT_PRJ_DONE				, isShow : true},
				
				[pr_STAT_PRJ_DEPLOY]	: {stat: pr_STAT_PRJ_DEPLOY				, isShow : true},
				[pr_STAT_PRJ_TEST]		: {stat: pr_STAT_PRJ_TEST				, isShow : true},
				[pr_STAT_PRJ_REVIEW]	: {stat: pr_STAT_PRJ_REVIEW				, isShow : true},
				
				[pr_STAT_PRJ_CLOSED]	: {stat: pr_STAT_PRJ_CLOSED				, isShow : true},
				[pr_STAT_PRJ_UNRESOLVED]: {stat: pr_STAT_PRJ_UNRESOLVED			, isShow : true},
				
		}

		var pr_stats					= [
			pr_STAT_PRJ_NEW,
			pr_STAT_PRJ_TODO,
			pr_STAT_PRJ_INPROGRESS,
			pr_STAT_PRJ_DONE,
			
			pr_STAT_PRJ_DEPLOY,
			pr_STAT_PRJ_TEST,
			pr_STAT_PRJ_REVIEW,
			
			pr_STAT_PRJ_CLOSED,
			pr_STAT_PRJ_UNRESOLVED,
		];

		var pr_Type00					= pr_TYPE00_PRJ;
		var pr_Type01					= null;
		var pr_Type02					= pr_TYPE02_MAIN;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 	= App.controller.DBoard.DBoardMain;
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}

			tmplName.PRJ_PROJECT_LIST				= pr_grpName + "PrjProject_List";
			tmplName.PRJ_PROJECT_LIST_CONTENT		= pr_grpName + "PrjProject_List_Content";
			tmplName.PRJ_PROJECT_LIST_CONTENT_LIST  = pr_grpName + "PrjProject_List_Content_List";
			
			tmplCtrl	.do_lc_put_tmplRaw(PrjProject_List, pr_grpName);
		}

		//---------show-----------------------------------------------------------------------------
		var pr_grpPath 		= 'group/prj/_transl';
		var pr_showed		= false;
		this.do_lc_show = function(type00, type01, type02){
			if (!pr_showed){
				do_gl_lang_append (pr_grpPath, self.do_lc_show_callback, [type00, type01, type02]);
				pr_showed = true;
			}else {
				self.do_lc_show_callback(type00, type01, type02);
			}
		};
		
		this.do_lc_show_callback = function(type00, type01, type02){               
			try{
				if (type00) pr_Type00 = type00;
				if (type01) pr_Type01 = type01;
				if (type02) pr_Type02 = type02;

				do_lc_load_view();
				do_get_list_ByAjax();
				do_binding_event();
				$(document).prop('title',$.i18n('prj_project_sidebar_prj'));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "PrjProjectList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = (data) => {	
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PROJECT_LIST, paramStats));
		}
		
		const do_binding_event = () => {
				$('#choose_multi_stat').multiselect({
				buttonWidth: '210px', 
				buttonText: function() {
				    return $.i18n("prj_project_project_status_title");
					}
				});
				$('.multiselect').css({
				    'display': 'flex',
				    'justify-content': 'space-between',
				    'align-items': 'center'
				});

				$('.mdi-arrow-down-drop-circle-outline').css({
				    'margin-left': '8px',
				    'float': 'right'
				});


			$(".list-prj-typ").off("click").on("click", function(){
				let $this 	= $(this);
				let {typ} 	= $this.data();
				pr_TYP_SHOW = typ === pr_TYP_LIST? pr_TYP_LIST : pr_TYP_GRID;

				do_get_list_ByAjax();
				$(".list-prj-typ").removeClass("active");
				$this.addClass("active");
			})

			$(".inp-search, .inp-search-responsive").off("keyup").on("keyup", function(e){
				e.preventDefault();
				if(VIEW_PART !==  App.router.part.PRJ_PROJECT_LIST)	return false;//add foreach view prj search

				pr_searchKey	= $(this).val();
				do_lc_get_checked();
				do_gl_execute_debounce(do_get_list_ByAjax, 500, []);
			})
			
			$("#btn_search_responsive").off("click").on("click", function(e){
				let searchNormal 	= $(".inp-search").hasClass("d-none");
				pr_searchKey 		= searchNormal? $(".inp-search").val() : $(".inp-search-responsive").val();
				do_lc_get_checked();

				do_get_list_ByAjax();
			})

			$(".prj-stat-cbx").off("change").on("change", function(){
				do_lc_get_checked();
				do_get_list_ByAjax();
			})
			
			$(".prj-toggle-stat").off("click").on("click", () => {
				$(".div-stat").toggleClass("show");
			});
			
//			$("#btn_new_project").off("click").on("click", () => {
//				
//			});
		}

		const do_lc_get_checked = () => {
			if(!$("#choose_multi_stat option[value='" + pr_STAT_PRJ_ALL + "']").is(":selected")){
				let isSelecteds = $("#choose_multi_stat > option:selected");
				if(isSelecteds && isSelecteds.length){
					for(let isSelected of isSelecteds){
						pr_stats.push(+$(isSelected).val());
					}
				}
			}
		}

		const do_get_list_ByAjax = (forced) => {	
			let ref 				= req_gl_Request_Content_Send_With_Params(	pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, 
																				{	searchKey	: pr_searchKey, 
																					typ00		: pr_Type00, 
																					typ01		: pr_Type01,
																					typ02		: pr_Type02,
																					forced});
			let callbackFunct 		= data => do_lc_show_list_ByAjax_Dyn(data);

			if(pr_stats.length)	ref["stats"] = JSON.stringify(pr_stats);
					

			let opt = {
					divMain			: "#div_prj_list",
					divPagination	: "#div_prj_pagination",
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};

			do_gl_init_pagination_opt(opt);
		}

		const do_lc_show_list_ByAjax_Dyn = (sharedJson) => {
			let template		= pr_TYP_SHOW == pr_TYP_LIST? tmplName.PRJ_PROJECT_LIST_CONTENT_LIST: tmplName.PRJ_PROJECT_LIST_CONTENT;
			let data			= can_gl_AjaxSuccess(sharedJson) ? sharedJson[App['const'].RES_DATA] : {};
			$("#div_prj_list")	.html(tmplCtrl.req_lc_compile_tmpl(template		, data));
			do_lc_bind_event_list();
			pr_stats 			= [];
		}

		const do_lc_bind_event_list = () => {
			$(".btn-treeview").off("click").on("click", function() {
				let {id, code, grp} = $(this).data();
				if(id && code){
					if(!App.controller.PrjTreeView)				App.controller.PrjTreeView 		= {};
					if(!App.controller.PrjTreeView.EntMsgbox){
						App.controller.PrjTreeView.EntMsgbox 	= new TreeViewEntMsgbox();
						App.controller.PrjTreeView.EntMsgbox	.do_lc_init();
					}
					App.controller.PrjTreeView.EntMsgbox.do_lc_show_with_id(id, grp, code);
				}
			})

			$(".btn-delete").off("click").on("click", function() {
				const rightCode = do_req_check_righs(RIGHT_P_D)

				if(rightCode === -1) {
					do_gl_init_msgbox_annonce($.i18n("prj_project_del_main_error_right"));
					return
				}

				let {id, code} = $(this).data();
				id && do_gl_init_msgbox_confirm($.i18n("prj_project_del_main_confirm"), () => do_lc_del_prj_main(id, code));
			})

			App.router.controller.do_lc_binding_route();
		}

		const do_lc_del_prj_main = (id, code) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MAIN_DEL, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_del_prj_main, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_after_del_prj_main = sharedJson => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_init_msgbox_annonce($.i18n("prj_project_del_main_success"), () => do_get_list_ByAjax(true));
			} else {
				do_lc_show_msg_error_del(sharedJson);
			}
		}

		const do_req_check_righs = (rightId) => {
			const rightCode = `${rightId}`.substr(rightId.length - 1)
			
			//Get user list right:
			var listUserRight = App.data.user.rights;

			if(!listUserRight){
				return -1;
			}

			if(listUserRight.includes(RIGHT_ADM)) return rightId
			if(listUserRight.includes(RIGHT_ADM * 100 + rightCode) 
				|| listUserRight.includes(pr_OBJ_RIGHT * 1000 + rightCode)) return rightId

			return -1;
		}

		const do_lc_show_msg_error_del = resp => {
			switch (resp[App['const'].SV_CODE]) {
			case App['const'].SV_CODE_DATA_NOTFOUND:
				do_gl_init_msgbox_annonce($.i18n("prj_project_del_main_error_existe"));
				break;
			case App['const'].SV_CODE_ERR_RIGHT:
				do_gl_init_msgbox_annonce($.i18n("prj_project_del_main_error_right"));
				break;
			case App['const'].SV_CODE_DATA_NOT_DEL:
				const {ent} = resp;
				ent
				? do_gl_init_msgbox_annonce(`${$.i18n("prj_project_del_main_error_element_existe")} <a href="view_prj_project_content.html?id=${ent.id}" target="_blank">${ent.code} - ${ent.name}</a>`)
				: do_gl_init_msgbox_annonce($.i18n("prj_project_del_main_error_element_not_existe"));
				break;
			default:
				do_gl_init_msgbox_annonce($.i18n("prj_project_del_main_error_default"));
				break;
			}
		}
	};

	return PrjProjectList;
});