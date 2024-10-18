define([
	'text!group/per_partner/tmpl/PrjPartner_List02.html', 
	'text!group/per_partner/tmpl/PrjPartner_List_Content02.html', 
	], function(PrjPartner_List02, 
				PrjPartner_List_Content02){

	var PrjPartnerList02 	= function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePerPerson"; //to change by your need
		const pr_SV_LIST_DYN		= "SVLstPage"; 
		
		//------------------------------------------------------------------------------------
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//-----------------------------------------------------------------------------------
		const pr_NUMBER_RECORD		= 9;
		
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
		const pr_STAT_INACTIVE      = 0;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const RIGHT_U_N             = 1000002;
		
		var pr_DIV_CONTENT          = "#div_partner_ent";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_Ent				= App.controller.PrjPartner.Ent;
			
			tmplName.PRJ_PARTNER_LIST			= "PrjPartner_List02";
			tmplName.PRJ_PARTNER_LIST_CONTENT	= "PrjPartner_List_Content02";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, type01, type02){               
			try{
				if (type02) pr_List_Type02 = type02;
				
				doLoadView(div);
				do_get_list_ByAjax();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjPartnerList02", "do_lc_show", e.toString()) ;
			}
		};

		var doLoadView = function(div = "#div_main_content"){	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_LIST					, PrjPartner_List02); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_LIST_CONTENT			, PrjPartner_List_Content02);
			
			$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_LIST, {}));
		}
		
		var do_binding_event = function(div, type01, type02, data){
			$(".div_prj_list_elem").off("click").on("click", function(){
				let {id} =  $(this).data();
				
				id && pr_ctr_Ent.do_lc_show(id, var_lc_MODE_SEL, pr_DIV_CONTENT);
				
				$(".div_prj_list_elem").css("background-color", "#fff")
				$(".div_prj_list_elem[data-id='" + id + "']").css("background-color", "#f0ffff")
			})
			
			$("#btn_btn_new_partner").off("click").on("click", function(){
				let listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				
				if(!listUserRight.includes(RIGHT_U_N)){
					do_gl_show_Notify_Msg_Error($.i18n("job_report_msg_user_right_error"));
					return;
				}
				pr_ctr_Ent.do_lc_show({}, var_lc_MODE_NEW, pr_DIV_CONTENT);
			})
			
			$("#btn_refresh_partner").off("click").on("click", function(){
				$("#div_prj_list").html();
				$("#div_prj_pagination").html();
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
			
			$("#inp-search").off("keyup").on("keyup", function(e){
				e.preventDefault();
				if(VIEW_PART !==  App.router.part.PRJ_PARTNER)	return false;//add foreach view prj search
				
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

		var do_get_list_ByAjax = function(hardLoad = false){
			let divList = $("#div_prj_list");
			let divPan  = $("#div_prj_pagination");
			
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LIST_DYN);
			ref.searchKey			= pr_searchKey;
			ref.forced				= hardLoad;		
			
			var callbackFunct = function(data) {		//data => sharedJson
				do_lc_show_list_ByAjax_Dyn(data, divList);
			}
			
			var opt = {
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
			let template		=  tmplName.PRJ_PARTNER_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA];
			}
			
			$("#div_prj_list")	.html(tmplCtrl.req_lc_compile_tmpl(template		, data));
			do_binding_event(div);
		}
	};

	return PrjPartnerList02;
});