define([
	'text!group/per_partner/tmpl/PrjPartner_Ent.html',
	"group/per_partner/ctrl/PrjPartnerEntBlocks"
	],
	function(
			PrjPartner_Ent	,
			{PrjPartnerEntContent, PrjPartnerEntTabDocs, PrjPartnerEntTabObservation}
	){

	
	
	var PrjPartnerEnt 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_content";
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabObserv 		= "#div_prj_observation";
		const pr_divTabObservTab	= "#div_prj_observation_tab_body";
		const pr_divTabAddr	 		= "#div_prj_address";
		const pr_divTabBank	 		= "#div_prj_bank";

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//var url_header				= req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);

		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 30000;
		const pr_SERVICE_CLASS		= "ServicePerPerson"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 

		var pr_SV_MOD				= "SVMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVLckReq";
		var pr_SV_LCK_END			= "SVLckEnd";
		var pr_SV_LCK_DEL			= "SVLckDel";

		var pr_SV_VALIDATE			= "SVValidate";

		const pr_SERVICE_CLASS_PRJ			= "ServicePrjProject"; //to change by your need
		const pr_SV_NEW_FAVORITE		= "SVNewFavorite";
		const pr_SV_REMOVE_FAVORITE		= "SVRemoveFavorite";

		//------------------local variable----------------------------------------------------------
		let pr_OBS_TEMP				= {};
		let pr_docsObj				= {};

		//------------------variable pagination post------------------------------------------------------
		var pr_POST_BEGIN 			= 0;
		const pr_POST_NUMBER 		= 10;
		const pr_POST_TYPE_PRJ 		= 202;

		const pr_POST_NO_SUB 		= 1;
		const pr_POST_HAS_SUB 		= 2;

		const pr_POST_KEY_ENTER 	= 13;
		//------------------const object------------------------------------------------------
		const formatDate 			= {"en": "enShortDate", "fr": "frShortDate", "vn": "viShortDate"};
		const local 				= localStorage.language ? localStorage.language : "en";

		const typePartnerClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;

		const pr_ID_TABLE_PRJ		= 250000;

		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];

		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 100;

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const var_lc_OBS_NEW        = 1;
		const var_lc_OBS_MOD        = 2;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_Sidebar 			= null;
		var pr_ctr_Fav 				= null;
		
		var pr_DIV_CONTENT          = "#div_main_content";
		var pr_SHOW_COMMON          = false;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_Sidebar 			= App.controller.UI.Sidebar;
			pr_ctr_Fav 				= App.controller.UI.Fav;
			pr_ctr_List 			= App.controller.PrjPartner.List;
			pr_ctr_Ent				= App.controller.PrjPartner.Ent;

			if(!App.controller.PrjPartner.EntContent)			App.controller.PrjPartner.EntContent 			= new PrjPartnerEntContent			(null, null, null);
//			if(!App.controller.PrjPartner.EntTabAdress)			App.controller.PrjPartner.EntTabAdress 			= new PrjPartnerEntTabAddress	(null, null, null);
//			if(!App.controller.PrjPartner.EntTabBank)			App.controller.PrjPartner.EntTabBank			= new PrjPartnerEntTabBank	(null, null, null);
			if(!App.controller.PrjPartner.EntTabDocs)			App.controller.PrjPartner.EntTabDocs 			= new PrjPartnerEntTabDocs	(null, null, null);
			if(!App.controller.PrjPartner.EntTabObsevation)		App.controller.PrjPartner.EntTabObsevation		= new PrjPartnerEntTabObservation	(null, null, null);

			
			tmplName.PRJ_PARTNER_ENT						= "PrjPartner_Ent";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(id, mode, div){               
			try{
				if(div){
					pr_DIV_CONTENT = div;
					pr_SHOW_COMMON = true;
				}
				do_lc_load_view();

//				if (!mode) mode = var_lc_MODE_SEL;
				if(mode == var_lc_MODE_NEW){
					do_lc_show_entity({}, mode);
				}else if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
					var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
					if(!id) id = params.id;
					if (id) do_lc_get_Entity (id, mode);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.partner", "PrjPartnerEnt", "do_lc_show", e.toString()) ;
			}
		};


		this.do_lc_reqRole_User = function(mode){
			let roles = App.data.user.roles || [];
			if(roles.includes(pr_type_adm_all)){
				//to do
			}else{
				$(".isManager").remove();
				$(".info-content").off("click").removeClass("info-content");

				$(".content-observ").off("click").removeClass("content-observ");
				$(".content-info04-observ").off("click").removeClass("content-info04-observ");
				$(".content-info03-observ").off("click").removeClass("content-info03-observ");
			}
		}

		this.do_lc_ShowDiv_ByMode = function (div, mode){
			if (mode == var_lc_MODE_NEW){

				$(div).find(".info-content").addClass("hide");
				$(div).find(".content-edit").removeClass("hide");


				$(div).find("#div_avatar_partner").addClass("hide");
				$(div).find("#div_prj_avatar_file_upload").removeClass("hide");

				$(div).find(".dropdown ").addClass("hide");

				$(div).find("#div_prj_partner_date_disable").addClass("hide");

			}	else{

				$(div).find(".info-content").removeClass("hide");
				$(div).find(".content-edit").addClass("hide");				

				$(div).find("#div_avatar_partner").removeClass("hide");
				$(div).find("#div_prj_avatar_file_upload").addClass("hide");

				$(div).find(".dropdown ").removeClass("hide");

				$(div).find("#div_prj_partner_date_disable").removeClass("hide");
			}		  
		}

		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT						, PrjPartner_Ent);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_CONTENT				, PrjPartner_Ent_Content);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PERSON		, Per_Sel_List_Type_Person);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS		, Per_Sel_List_Legal_Status);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_DOMAIN		, Per_Sel_List_Legal_Domain);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PARTNER		, Per_Sel_List_Type_Partner);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_ADDRESS			, PrjPartner_Ent_Tab_Address);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_BANK				, PrjPartner_Ent_Tab_Bank);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_DOCS				, PrjPartner_Ent_Tab_Docs);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION		, PrjPartner_Ent_Tab_Observation);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION_LINE	, PrjPartner_Ent_Tab_Observation_Line);

		}

		var do_lc_get_Entity = function(id, mode){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);	
			ref["id"]		= id;
			ref["forced"]	= true;

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getPrj_response, [mode]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_getPrj_response = function(sharedJson, mode){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				do_lc_show_entity(data, mode);
			} else {   
//				window.open("view_prj_partner_list.html", "_self");
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_partner_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PARTNER_LIST);
			}
		}

		var do_lc_show_entity = function(ent, mode){
			let isFavorite 	= null;
			if(App.data.user && App.data.user['lstFav'] && App.data.user['lstFav'][pr_ID_TABLE_PRJ]) {
				const lstFav 	=  App.data.user['lstFav']
	
				if(lstFav[pr_ID_TABLE_PRJ].ids.includes(ent.id)) isFavorite = true;
			}

			ent.isFavorite = isFavorite
			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT	, ent));
			do_lc_build_page(ent, mode);
			if(pr_SHOW_COMMON) 	$(pr_DIV_CONTENT).find(".page-content").addClass('p-0');
		}

		var do_lc_build_page = function(ent, mode){
			do_lc_show_blocks(ent, mode);
			do_lc_binding_events(ent, mode);
		}

		var do_lc_show_blocks = function(ent, mode){
			App.controller.PrjPartner.EntContent 			.do_lc_show(ent, mode);
//			App.controller.PrjPartner.EntTabAdress			.do_lc_show(ent, mode);
//			App.controller.PrjPartner.EntTabBank 			.do_lc_show(ent, mode);
			App.controller.PrjPartner.EntTabDocs 			.do_lc_show(ent, mode);
			App.controller.PrjPartner.EntTabObsevation		.do_lc_show(ent, mode);

			if(mode == var_lc_MODE_NEW){
				$("#div_partner_funct").show();
			}else{
				$("#div_partner_funct").hide();
			}
		}

		var do_lc_binding_events = function (obj, mode){
			$("#btn_save").off("click").on("click",function(){
				self.do_lc_Save_Entity(pr_DIV_CONTENT, obj, var_lc_MODE_NEW); 
			})

			$("#btn_mod_favorite").off("click").on("click", function() {
				const isFav = $(this).hasClass("isFavorite");

				do_lc_mod_favorite(isFav, obj, mode);
			})
		}

		this.do_lc_modify_data = function(data, ent, mode, modeObs) {
			data.files 		=   ent.files;

			if(!ent.inf04){
				ent.inf04 = [];
			}


			if(modeObs == var_lc_OBS_NEW){
				if(data.inf04){
					ent.inf04.push(data.inf04);
					delete data.inf04;
				}
			}else{
				if(data.inf04){
					if(Array.isArray(data.inf04)){
						let inf04 = data.inf04.filter(function (el) {
							return el != null;
						});

						ent.inf04 = inf04;
						delete data.inf04;
					}else{
						var index = ent.inf04.findIndex(function(info) {
							return info.id == data.inf04.id;;
						});

						ent.inf04[index] = data.inf04;
						delete data.inf04;
					}

				}else{
					data.inf04 = [];
				}
			}
		}

		this.do_lc_Save_Entity = function (pr_divContent, ent, mode, modeObs){
			if (!pr_divContent) pr_divContent	= "#div_main_content";			

			if (!ent.files) ent.files = [];		

			let	data	= req_gl_data({
				dataZoneDom		: $(pr_divContent),				
				skipError		: true
			});

			if(data.data.length > 0 && data.hasError)	return false;

			var newObj = Object.assign({}, ent);

			self.do_lc_modify_data(data.data, newObj, mode, modeObs);

			data.data 	= $.extend(false, newObj, data.data);

			do_send_data (data, mode, modeObs);

		}

		var do_send_data= function(data, mode, modeObs){
			if(modeObs) App.MsgboxController.do_lc_close();
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, mode==var_lc_MODE_NEW? pr_SV_NEW : pr_SV_MOD);
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg_Error, [null, null, mode])); 
			fSucces.push(req_gl_funct(null	, do_lc_afterSave_EntContent	, []));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}

		var do_lc_afterSave_EntContent = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				App.data.mode 	= var_lc_MODE_SEL;				

				do_lc_show_entity(data, App.data.mode);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		//user favorite
		const do_lc_mod_favorite = (isFav, prj, mode) => {
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
						param 		: [isFav, pr_ID_TABLE_PRJ, prj, mode],
						classBtn	: "btn-primary",
						autoclose	: true
					},
					CALCEL : {
						lab 		: $.i18n("common_btn_cancel"),
					}
				}
			});
		}

		const do_lc_send_mod_inList = (isFav, parTyp, prj, mode) => {
			if(isFav) pr_ctr_Fav.do_lc_remove_myFavorites(prj, parTyp)
			else pr_ctr_Fav.do_lc_push_myFavorites(prj, parTyp)

			do_lc_show_entity(prj, mode);

			pr_ctr_Sidebar.do_lc_show_favorite()
		}
	}

	return PrjPartnerEnt;
});