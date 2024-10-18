define([
	'text!group/per_partner/tmpl/PrjPartner_List.html', 
	'text!group/per_partner/tmpl/PrjPartner_List_Content.html', 
	'text!group/per_partner/tmpl/PrjPartner_List_Content_List.html', 
	], function(PrjPartner_List, 
			PrjPartner_List_Content, 
			PrjPartner_List_Content_List){

	var PrjPartnerList 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= content ? content: null;
		var pr_divFooter 			= footer  ? footer : null;

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var self 					= this;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjPartner"; //to change by your need
		const pr_SV_LIST			= "SVPrjPartnerLstDyn"; 
		
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS_DYN	= "ServicePersonDyn"; //to change by your need
		const pr_SV_LIST_DYN		= "SVPerLstPartner"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
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
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller.PrjPartner.List;
			pr_ctr_Ent				= App.controller.PrjPartner.Ent;
			
			tmplName.PRJ_PARTNER_LIST			= "PrjPartner_List";
			tmplName.PRJ_PARTNER_LIST_CONTENT	= "PrjPartner_List_Content";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, type01, type02){               
			try{
				if (type02) pr_List_Type02 = type02;
				
				doLoadView(div);
				do_get_list_ByAjax(div);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.partner", "PrjPartnerList", "do_lc_show", e.toString()) ;
			}
		};

		var doLoadView = function(div, data){	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_LIST				, PrjPartner_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_LIST_CONTENT		, PrjPartner_List_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_LIST_CONTENT_LIST	, PrjPartner_List_Content_List);
			
			if (div){
				$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_LIST, {}));
			}else
				$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_LIST, {}));
		}
		
		var do_binding_event = function(div, type01, type02, data){
			$(".div_prj_list_elem").off("click").on("click", function(){
				let {id} =  $(this).data();
				if(id){
//					window.open(`view_prj_partner_content.html?id=${id}`, "_blank")
					pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_partner_content.html?id=${id}`, "VI_MAIN/"+ App.router.part.PRJ_PARTNER_ENT, [id]);
				}
			})
			
			$(".list-partner-typ").off("click").on("click", function(){
				let $this 	= $(this);
				let {typ} 	= $this.data();
				pr_TYP_SHOW = typ == pr_TYP_LIST? pr_TYP_LIST : pr_TYP_GRID;
				
				do_get_list_ByAjax(div);
				$(".list-partner-typ").removeClass("active");
				$this.addClass("active");
			})
			
			$(".inp-search, .inp-search-responsive").off("keyup").on("keyup", function(e){
				e.preventDefault();
				if(VIEW_PART !==  App.router.part.PRJ_PARTNER_LIST)	return false;//add foreach view prj search
				
				pr_searchKey	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax, 500, [div]);
			})
			
			$("#btn_search_responsive").off("click").on("click", function(e){
				e.preventDefault();
				
				let searchNormal 	= $(".inp-search").hasClass("d-none");
				pr_searchKey 		= searchNormal? $(".inp-search").val() : $(".inp-search-responsive").val();
				
				do_get_list_ByAjax(div);
			})
		}

		var do_get_list_ByAjax = function(div){	
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN);
			ref.searchKey			= pr_searchKey;			
//			ref["type01"]			= pr_List_Type01;
//			ref["type02"]			= pr_List_Type02;
			
			var callbackFunct = function(data) {		//data => sharedJson
				do_lc_show_list_ByAjax_Dyn(data, div);
			}
			
			var opt = {
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
		
		var do_lc_show_list_ByAjax_Dyn = function(sharedJson, div){
			let template		= pr_TYP_SHOW == pr_TYP_LIST? tmplName.PRJ_PARTNER_LIST_CONTENT_LIST: tmplName.PRJ_PARTNER_LIST_CONTENT;
			let data			= {};
			
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				data		= sharedJson[App['const'].RES_DATA];
			}
			
			$("#div_prj_list")	.html(tmplCtrl.req_lc_compile_tmpl(template		, data));
			do_binding_event();
		}
	};

	return PrjPartnerList;
});