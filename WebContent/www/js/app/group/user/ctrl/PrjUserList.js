define(['jquery'], function($) {

	var PrjUserList 	= function (grpName, header, content, footer) {
		var pr_grpName				= grpName?grpName:"PrjUserMan";
		
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_LIST_SEARCH		= "SVLstSearch"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD		= 9;
		
		const pr_TYP_GRID			= 1;
		const pr_TYP_LIST			= 2;
		var pr_TYP_SHOW				= 1;
		
		var pr_searchKey			= "";
		
		const TYP_01_MORAL			= 1000001;
		const TYP_01_NATURAL		= 1000002;
		
		const TYP_02_AGENT			= 1010001;
		const TYP_02_CLIENT			= 1010002;
		const TYP_02_SUPPLIER		= 1010003;
		const TYP_02_PRODUCER		= 1010004;	
		const TYP_02_DOCTOR			= 1010005;
		const TYP_02_TPARTY			= 1010006;
		const TYP_02_PROSPECT		= 1010007;
		const TYP_02_CLIENT_PUBLIC	= 1010008;

		const TYP_02_COMPANY		= 1010010;
		const TYP_02_BRANCH			= 1010011;
		const TYP_02_DEPARTMENT		= 1010012;
		
		var pr_List_Type01			= TYP_01_MORAL;
		var pr_List_Type02			= TYP_02_CLIENT;
		
		const pr_STAT_ACTIVE        = 1;
		const pr_STAT_INACTIVE      = 2;
		const pr_STAT_ACTIVE_HIDDEN = 3;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const RIGHT_U_G				= 1000001;
		const RIGHT_U_N             = 1000002;
		const RIGHT_ADM	        	= 100;
		const RIGHT_A_G				= 101;
		const RIGHT_A_N	        	= 102;
		
		var pr_DIV_CONTENT          = "#div_user_ent";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_Ent				= App.controller.PrjUser.Ent;
			pr_ctr_dashboard		= App.controller.PrjDashboard.Ent
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, type01, type02){               
			try{
				if (type02) pr_List_Type02 = type02;
				
				$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LIST, {}));
				
				do_get_list_ByAjax();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserList", "do_lc_show", e.toString()) ;
			}
		};

		var do_binding_event = function(div, type01, type02, data){
			$(".user-item-name").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_U_G) || listUserRight.includes(RIGHT_ADM)|| listUserRight.includes(RIGHT_A_G);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				let {id, login} =  $(this).data();
				
//				$("#inp-search").prop('readonly', true);
				
				pr_ctr_Ent.do_lc_show(id, var_lc_MODE_SEL, pr_DIV_CONTENT);
				
				$(".task-item").css("background-color", "#fff")
				$(".task-item[data-id='" + id + "']").css("background-color", "#f0ffff")
				
				$("#inp-search").val(login);
			})
			
			$("#btn_btn_new_user").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_U_N) || listUserRight.includes(RIGHT_ADM)|| listUserRight.includes(RIGHT_A_N);
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				pr_ctr_Ent.do_lc_show({}, var_lc_MODE_NEW, pr_DIV_CONTENT);
			})
			
			$("#btn_refresh_group").off("click").on("click", function(){
				do_get_list_ByAjax(true);
			})
			
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
			
			$(".btn-view-dashboard").off("click").on("click", function(){
				let {id} =  $(this).data();
				id && pr_ctr_dashboard.do_lc_show(id, pr_DIV_CONTENT);
				
				$(".task-item").css("background-color", "#fff")
				$(".task-item[data-id='" + id + "']").css("background-color", "#f0ffff")
			})
			
			$("#inp-search").off("keyup").on("keyup", function(e){
				e.preventDefault();
				if(VIEW_PART !==  App.router.part.PRJ_USER)	return false;//add foreach view prj search
				
				pr_searchKey	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax);
			})
			
			$("#btn_search_responsive").off("click").on("click", function(e){
				e.preventDefault();
				
				let searchNormal 	= $(".inp-search").hasClass("d-none");
				pr_searchKey 		= searchNormal? $(".inp-search").val() : $(".inp-search-responsive").val();
				
				do_get_list_ByAjax();
			})
		}

		const reqStr_from_to = (m, n) => {
			var list = [m];
			
			for (var i = m + 1; i <= n; i++) {
			  list.push(i);
			}
			
			return list.toString();
		  }
		  

		var do_get_list_ByAjax = function(hardLoad = false){
			let divList = $("#div_prj_list");
			let divPan  = $("#div_prj_pagination");
			
			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_SEARCH, 
				{
					searchKey: pr_searchKey, 
					buildInfo: true, hardLoad, 
					stats: pr_STAT_ACTIVE + "," + pr_STAT_INACTIVE + "," + pr_STAT_ACTIVE_HIDDEN,
					typs: reqStr_from_to(+App.data.user.typ01, 3)
				});
			
			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList);
			
			let opt = {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};
			
			do_gl_init_pagination_opt(opt);
		}
		
		var do_lc_show_list_ByAjax_Dyn = function(sharedJson, div){
			let template		=  tmplName.PRJ_USER_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA]
			}
			
			$("#div_prj_list")	.html(tmplCtrl.req_lc_compile_tmpl(template		, data));
			do_binding_event(div);
		}
	};

	return PrjUserList;
});