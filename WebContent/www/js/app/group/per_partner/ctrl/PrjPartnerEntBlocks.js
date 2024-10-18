define([
	'text!group/per_partner/tmpl/PrjPartner_Ent_Content.html',

	'text!group/per_partner/tmpl/Per_Sel_List_Type_Person.html',
	'text!group/per_partner/tmpl/Per_Sel_List_Legal_Status.html',
	'text!group/per_partner/tmpl/Per_Sel_List_Type_Partner.html'
	,
	'text!group/per_partner/tmpl/PrjPartner_Ent_Tab_Docs.html'
	,
	'text!group/per_partner/tmpl/PrjPartner_Ent_Tab_Observation.html',
	'text!group/per_partner/tmpl/PrjPartner_Ent_Tab_Observation_Line.html'], function(	
			PrjPartner_Ent_Content,

			Per_Sel_List_Type_Person,
			Per_Sel_List_Legal_Status,
			Per_Sel_List_Type_Partner
			,	
			PrjPartner_Ent_Tab_Docs
			,	
			PrjPartner_Ent_Tab_Observation,
			PrjPartner_Ent_Tab_Observation_Line
	){
	var PrjPartnerEntContent = function(header, content, footer){
		var pr_divHeader 			= header  ? header : null;
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divContent 		= "#div_prj_content";
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabObserv 		= "#div_prj_observation";
		const pr_divTabObservTab	= "#div_prj_observation_tab_body";
		const pr_divTabAddr	 		= "#div_prj_address";
		const pr_divTabBank	 		= "#div_prj_bank";

		const pr_prjPartner		    = App.controller.PrjPartner;

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
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];$
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;

		var self                    = this;

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		var pr_ctr_List 			= App.controller.PrjPartner.List;
		var pr_ctr_Ent				= App.controller.PrjPartner.Ent;

		tmplName.PRJ_PARTNER_ENT_CONTENT					= "PrjPartner_Ent_Content";
		tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PERSON			= "PerPartner_Person";
		tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS			= "PerPartner_Legal_Status";
		tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PARTNER			= "PerPartner_Type_Partner";

		this.do_lc_show = function(ent, mode) {
			try{
				do_lc_load_view();
				do_lc_show_ent(ent, mode);
			}catch(e) {	
				console.log(e);
			}
		}

		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_CONTENT			, PrjPartner_Ent_Content);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PERSON		, Per_Sel_List_Type_Person);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS		, Per_Sel_List_Legal_Status);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PARTNER		, Per_Sel_List_Type_Partner);
		}	

		var do_lc_show_ent = function(ent, mode){
			$(pr_divContent)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_CONTENT, ent));
//			let divActionMod = $("#a_btn_save, #a_btn_cancel, #div_prj_avatar_file_upload, .action-item-observ, .action-item-doc, #div_prj_ent_file_upload, .item-file-delete");
//			let divActionSel = $("#a_btn_edit, #div_avatar_partner, #div_lst_doc");
//			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
//			do_gl_enable_edit($(pr_divContent), ".objData", mode);

//			divActionMod.removeClass("hide");
//			divActionSel.addClass("hide");
//			} else {
//			do_gl_disable_edit($(pr_divContent));

//			divActionMod.addClass("hide");
//			divActionSel.removeClass("hide");
//			}
			pr_prjPartner.Ent.do_lc_reqRole_User();

			do_lc_bind_event_content_ent(ent, mode);

			pr_prjPartner.Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
		}

		var do_lc_bind_event_content_ent = function(ent, mode){			
			if(!ent.files)	ent.files = [];
			let option	= {
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: ent//file existing here					
			}			
			do_gl_init_fileDropzone($(pr_divContent), option);


			if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
				$(".info-edit-content").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					$("#a_btn_save_content, #a_btn_cancel_content")	.removeClass("hide");

					pr_prjPartner.Ent.do_lc_reqRole_User();

					if($("#sel_list_type_person").hasClass("hide")){
					}else{
						let $parent = $("#sel_list_legal_status").parent();
						$parent.find(".info-content")	.addClass("hide");
						$parent.find(".content-edit")	.removeClass("hide");
					}
				})

				$("#a_btn_save_content").off("click").on("click", function(){
					ent.files 		= ent.files ? [...ent.files].filter(Boolean) : [];
					pr_prjPartner.Ent.do_lc_Save_Entity(pr_divContent, ent, var_lc_MODE_MOD);
				})

				$("#a_btn_cancel_content").off("click").on("click", function(){
					self.do_lc_show(ent, mode);
				})


				$("#btn_add_avatar").off("click").on("click", function(){
					$("#div_prj_avatar_file_upload").removeClass("hide");
					$(".card-drop").addClass("hide");
					$("#a_btn_save_content, #a_btn_cancel_content")	.removeClass("hide");
				})
			}

			var rightSocMa = self.do_verify_user_right_soc_manage();
//			if(!rightSocMa)
//			$("#div_per_partner_societe").hide();
//			else{
//			var LstAllSociete = App.data["LstSociete"].concat(App.data["LstSocieteChild"]);
//			for(var i=0; i<LstAllSociete.length; i++){
//			if(LstAllSociete[i].id == ent.parent){
//			$("#inp_per_partner_societe")	.val(LstAllSociete[i].name01);
//			break;
//			}
//			}
//			do_gl_autocomplete({
//			el: $("#inp_per_partner_societe"),
//			required: true,
//			source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
//			selectCallback: function(item ) {
//			$("#socId")						.val(item.id);
//			$("#inp_per_partner_societe")	.val(item.name01);
//			},
//			renderAttrLst: ["name01"],
//			minLength: 0,
//			});
//			}
		};

		this.do_verify_user_right_soc_manage = function(){
			for(var i = 0; i< pr_right_soc_manage.length; i++){
				if(App.data.user.rights.includes(pr_right_soc_manage[i]))
					return true;
			}

			if (App.data.user.typ == pr_type_adm_all || (App.data.user.typ == pr_type_adm|| App.data.user.manId == 1))
				return true;

			return false;
		}

	}


	var PrjPartnerEntTabDocs = function(header, content, footer){
		var pr_divHeader 			= header  ? header : null;
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divContent 		= "#div_prj_content";
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

		const pr_prjPartner		    = App.controller.PrjPartner;
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 30000;
		const pr_SERVICE_CLASS		= "ServicePerPerson"; //to change by your need
		const pr_SV_GET				= "SVPersonGet"; 
		var pr_SV_NEW				= "SVPersonNew"; 
		var pr_SV_DEL				= "SVPersonDel"; 

		var pr_SV_MOD				= "SVPersonMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVPersonLckReq";
		var pr_SV_LCK_END			= "SVPersonLckEnd";
		var pr_SV_LCK_DEL			= "SVPersonLckDel";

		var pr_SV_VALIDATE			= "SVPersonValidate";

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
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];

		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		var pr_ctr_List 			= App.controller.PrjPartner.List;
		var pr_ctr_Ent				= App.controller.PrjPartner.Ent;

		tmplName.PRJ_PARTNER_ENT_TAB_DOCS				= "PrjPartner_Ent_Tab_Docs";

		this.do_lc_show = function(prj, mode) {
			try{
				do_lc_load_view();
				do_lc_show_ent(prj, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}

		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_DOCS			, PrjPartner_Ent_Tab_Docs);
		}	

		var do_lc_show_ent = function(ent, mode){
			$(pr_divTabDocs)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_DOCS, ent));

			do_lc_bind_event_docs_ent(ent, mode);
		}

		var do_lc_bind_event_docs_ent = function(ent, mode){

			if(!ent.files)	ent.files = [];
			let option	= {
					fileinput		: {param : {typ01: 2, typ02: 10} },//option here
					obj				: ent//file existing here					
			}			
			do_gl_init_fileDropzone($(pr_divTabDocs), option);	



			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				if(path)	window.open(path, "_blank");
			})

			$(".item-file-delete").off("click").on("click", function(){
				let id	= $(this).data("id");
				$(this).parents("tr").remove();
			})

			$("#btn_add_doc").off("click").on("click", function(){
				if(mode != var_lc_MODE_NEW) $(".action-item-doc").removeClass("hide");
				$("#div_prj_ent_file_upload").removeClass("hide");
				$(this).addClass("hide");
				$(".item-file-delete").removeClass("hide");
			})

			$("#a_btn_save_doc").off("click").on("click", function(){
				ent.files 		= ent.files ? [...ent.files].filter(Boolean) : [];
				pr_prjPartner.Ent.do_lc_Save_Entity(pr_divTabDocs, ent, var_lc_MODE_MOD);
			})

			$("#a_btn_cancel_doc").off("click").on("click", function(){
				do_lc_show_ent(ent);
			})
		}
	}


	var PrjPartnerEntTabObservation = function(header, content, footer){
		var pr_divHeader 			= header  ? header : null;
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divContent 		= "#div_prj_content";
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabObserv 		= "#div_prj_observation";
		const pr_divTabObservTab	= "#div_prj_observation_tab_body";
		const pr_divTabAddr	 		= "#div_prj_address";
		const pr_divTabBank	 		= "#div_prj_bank";

		const pr_prjPartner		    = App.controller.PrjPartner;
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
		const pr_SV_GET				= "SVPersonGet"; 
		var pr_SV_NEW				= "SVPersonNew"; 
		var pr_SV_DEL				= "SVPersonDel"; 

		var pr_SV_MOD				= "SVPersonMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVPersonLckReq";
		var pr_SV_LCK_END			= "SVPersonLckEnd";
		var pr_SV_LCK_DEL			= "SVPersonLckDel";

		var pr_SV_VALIDATE			= "SVPersonValidate";

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

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		const var_lc_OBS_NEW        = 1;
		const var_lc_OBS_MOD        = 2;
		//------------------const object------------------------------------------------------
		const formatDate 			= {"en": "enShortDate", "fr": "frShortDate", "vn": "viShortDate"};
		const local 				= localStorage.language ? localStorage.language : "en";

		const typePartnerClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];

		const formatFullDate 		= {"en": DateFormat.masks.enFullDate	, "fr": DateFormat.masks.frFullDate	, "vn": DateFormat.masks.viFullDate};

		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		var pr_ctr_List 			= App.controller.PrjPartner.List;
		var pr_ctr_Ent				= App.controller.PrjPartner.Ent;

		tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION				= "PrjPartner_Ent_Tab_Observation";
		tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION_LINE			= "PrjPartner_Ent_Tab_Observation_Line";

		this.do_lc_show = function(ent, mode) {
			try{
				if(mode == var_lc_MODE_NEW) return;
				do_lc_load_view();
				do_lc_show_ent(ent, mode);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}

		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION			, PrjPartner_Ent_Tab_Observation);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION_LINE		, PrjPartner_Ent_Tab_Observation_Line);
		}	

		var do_lc_show_ent = function(ent, mode){
			if(ent.inf04) ent.inf04 = JSON.parse(ent.inf04);
			$(pr_divTabObserv)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION, ent));

			let $parent = $(this).parent();
			$parent.find(".level-content")	.addClass("hide");
			$parent.find(".edit-observ")	.removeClass("hide");
			
			let sel = JSON.stringify($parent.find(".level-content").html());
			
			$parent		.find("option[value="+ sel	+"]")	.attr("selected","selected");
			
			let canDel = do_lc_verify_user_type()
			if(canDel) $(".action-delete").show();

			do_lc_bind_event_observ(ent, mode);
		}

		let pr_min_new_observ_id	= -1;
		var do_lc_bind_event_observ = function(prj, mode){
			let observs	= prj.inf04 ? prj.inf04 : [];
			let objData = observs.reduce((currentObj, obs)=>{
				currentObj[obs.id] = obs;
				return currentObj;
			}, {});
			pr_OBS_TEMP = objData;

			$("#btn_add_obs").off("click").on("click", function(){
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_partner_tab_observ_new"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION_LINE, {}),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: pr_prjPartner.Ent.do_lc_Save_Entity,
							param	: ["#div_prj_partner_observ", prj, var_lc_MODE_MOD, var_lc_OBS_NEW],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent	: function() {

					}
				});	
				
				var local = localStorage.language;
				if (!local) local = "fr";
				let newDate = DateFormat(new Date(), formatFullDate[local]);
				
				$("#inp_prj_partner_observ_date").val(newDate);
				$("#lbl_prj_partner_observ_lab").val(App.data.user.login01);
				$("#lbl_prj_partner_observ_id").val(new Date().getTime());
				
				$("#div_prj_partner_observ").find("i").hide();
				$(".level-content").addClass("hide");
				$(".level-edit").removeClass("hide");
				App.SummerNoteController.do_lc_show("#inp_prj_partner_observ_info04", {height : 100, dialogsInBody: true});//text editor
				App.SummerNoteController.do_lc_show("#inp_prj_partner_observ_info03", {height : 100, dialogsInBody: true});
			})

			$(".observ-delete").off("click").on("click", function(){
				$(".action-item-obs").removeClass("hide");
				$("#btn_add_obs").addClass("hide");
				
				let {observid} = $(this).data();
				let mem 	= pr_OBS_TEMP[observid];
				if(mem){
					delete pr_OBS_TEMP[observid];
					$(this).closest("tr").remove();

					$(".action-item-obs").removeClass("hide");
					$("#btn_add_obs").addClass("hide");
				}
			})

			$(".observ-view").off("click").on("click", function(){
				let {observid} = $(this).data();
				let info 	= pr_OBS_TEMP[observid];

				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_partner_tab_observ_sel"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_TAB_OBSERVATION_LINE, info),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: pr_prjPartner.Ent.do_lc_Save_Entity,
							param	: ["#div_prj_partner_observ", prj, var_lc_MODE_MOD, var_lc_OBS_MOD],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent	: function() {
						$(".content-observ").off("click").on("click", function(){
							let $parent = $(this).parent();
							$parent.find(".level-content")	.addClass("hide");
							$parent.find(".edit-observ")	.removeClass("hide");

							let sel = JSON.stringify($parent.find(".level-content").html());

							$parent		.find("option[value="+ sel	+"]")	.attr("selected","selected");

							pr_prjPartner.Ent.do_lc_reqRole_User();
							
							$("#btn_msgbox_OK").show();
						})
						
						$(".content-info04-observ").one("click", function(){
							let $parent = $(this).parent();
							$parent.find(".level-content")	.addClass("hide");
							$parent.find(".edit-observ")	.removeClass("hide");

							App.SummerNoteController.do_lc_show("#inp_prj_partner_observ_info04", {dialogsInBody: true});//text editor
							
							pr_prjPartner.Ent.do_lc_reqRole_User();
							
							$("#btn_msgbox_OK").show();
						})
						
						$(".content-info03-observ").one("click", function(){
							let $parent = $(this).parent();
							$parent.find(".level-content")	.addClass("hide");
							$parent.find(".edit-observ")	.removeClass("hide");

							App.SummerNoteController.do_lc_show("#inp_prj_partner_observ_info03", {dialogsInBody: true});//text editor
							
							pr_prjPartner.Ent.do_lc_reqRole_User();
							
							$("#btn_msgbox_OK").show();
						})
						
						
					}
				});	

				$(".content-info05-observ").find("option[value="+ JSON.stringify(info.info05)	+"]")	.attr("selected","selected");
				$(".content-info02-observ").find("option[value="+ JSON.stringify(info.info02)	+"]")	.attr("selected","selected");
				
				pr_prjPartner.Ent.do_lc_reqRole_User(mode);
				$("#btn_msgbox_OK").hide();
//				let canSave = do_lc_verify_user_type()
//				if(canSave){
//					$("#btn_msgbox_OK").show();
//				}else{
//					$("#btn_msgbox_OK").hide();
//				}

			})


			$("#a_btn_cancel_obs").off("click").on("click", function(){
				do_lc_show_ent(prj, mode);
			})

			$("#a_btn_save_obs").off("click").on("click", function(){
				pr_prjPartner.Ent.do_lc_Save_Entity(pr_divTabObservTab, prj, var_lc_MODE_MOD);
			})
		}
		
		var do_lc_verify_user_type = function(){
			let typ = App.data.user.typ;
			if(typ == pr_type_adm_all || typ == pr_type_adm){
				return true;
			}
			
			return false;
		}

		this.do_verify_user_right_soc_manage = function(){
			for(var i = 0; i< pr_right_soc_manage.length; i++){
				if(App.data.user.rights.includes(pr_right_soc_manage[i]))
					return true;
			}

			if (App.data.user.typ == pr_type_adm_all || (App.data.user.typ == pr_type_adm|| App.data.user.manId == 1))
				return true;

			return false;
		}
	}


	return { PrjPartnerEntContent, PrjPartnerEntTabDocs, PrjPartnerEntTabObservation};
});