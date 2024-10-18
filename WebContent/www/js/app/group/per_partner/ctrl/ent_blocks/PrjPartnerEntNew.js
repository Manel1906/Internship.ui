define([
	'text!group/per_partner/tmpl/PrjPartner_EntCreate.html',
	'text!template/per/common/Per_Sel_List_Type_Person.html',
	'text!template/per/common/Per_Sel_List_Legal_Status.html',
	'text!template/per/common/Per_Sel_List_Legal_Domain.html',
	'text!template/per/common/Per_Sel_List_Type_Partner.html'
	],
	function(PrjPartner_EntCreate,
			Per_Sel_List_Type_Person,
			Per_Sel_List_Legal_Status,
			Per_Sel_List_Legal_Domain,
			Per_Sel_List_Type_Partner) {
	var PrjPartnerEntNew     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
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
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//-----------------------------------------------------------------------------------
		const pr_SERVICE_PER_CLASS	= "ServicePersonDyn";
		const pr_SV_USER_SEARCH		= "SVUserLstSearchWithAvatar";
		
		var members 					= {};
		const pr_member_lev_manager 	= 0;
		
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		//---------------------------------Const--------------------------------------------------
		const formatDate 			= {"en": "enShortDate", "fr": "frShortDate", "vn": "viShortDate"};
		const local 				= localStorage.language ? localStorage.language : "en";

		const typePartnerClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller.PrjPartner.List;
			pr_ctr_Ent				= App.controller.PrjPartner.Ent;
			
			tmplName.PRJ_PARTNER_ENT_CREATE				= "PrjPartner_EntCreate";
			tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PERSON			= "PerPartner_Person";
			tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS			= "PerPartner_Legal_Status";
			tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_DOMAIN			= "PerPartner_Legal_Domain";
			tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PARTNER			= "PerPartner_Type_Partner";
			
			do_get_per_societe(societeListCompany);
			do_get_per_societe(societeListChild);
			doGetCfgValue('cfgValListTypePerson', 				100, 	null);		//Moral or Natural
			doGetCfgValue('cfgValListTypeLegalStatN', 			102, 	1);			//Legal Status of Moral		: SARL, SA, SAS...
			doGetCfgValue('cfgValListTypeLegalStatM', 			102,	2);			//Legal Status of Natural	: Mr, Mrs
			doGetCfgValue('cfgValListTypeDomainPartner', 		1001,	null);      //Type Domain partner: hotel, restaurant,...
			doGetCfgValue('cfgValListTypePartner',				101,	2, true);
			doGetCfgValue('cfgValListTypePartner',				101,	3, true);
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj = {}, mode){		
			if(!App.data.cfgValListTypePerson || !App.data.cfgValListTypeLegalStatM || !App.data.cfgValListTypeDomainPartner || !App.data.cfgValListTypePartner){
				setTimeout(function(){self.do_lc_show(obj, mode)}, 1000);
				console.log("do_lc_show is not ready");
				return;
			}
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_ENT_CREATE	, PrjPartner_EntCreate); 	
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PERSON	, Per_Sel_List_Type_Person);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS	, Per_Sel_List_Legal_Status);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_DOMAIN	, Per_Sel_List_Legal_Domain);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PARTNER	, Per_Sel_List_Type_Partner);
			
			var listLegalStatus   = App.data.cfgValListTypeLegalStatM;
			var listDomainPartner = App.data.cfgValListTypeDomainPartner;
			
			$("#div_main_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_ENT_CREATE	, {}));
			
			$("#sel_list_type_person")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PERSON, App.data.cfgValListTypePerson));
			$("#sel_list_legal_status")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS, listLegalStatus));
			$("#sel_list_type_domain")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_DOMAIN, listDomainPartner));
			$("#sel_list_type_partner")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_TYPE_PARTNER, App.data.cfgValListTypePartner));
			
			do_lc_bind_event(obj);
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
		
		var do_lc_bind_event = function(prjObj){
			let	obj 	= {files:[].concat(prjObj.files ? prjObj.files : [])};
			let option	= {
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: obj//file existing here					
			}			
			do_gl_init_fileDropzone($("#div_main_content"), option);
			$("#a_btn_save").off("click").on("click", function(){
				let	data	 				= req_gl_data({
					dataZoneDom		: $("#div_main_content")
				});
				
				if(data.hasError)	return false;
				
				let prj 	= data.data;
				prj.files	= obj.files;
				
				do_lc_create_prj(prj);
			})
			
			$("#sel_list_type_person").off("change").on("change", function(){
				var listLegalStatus = App.data.cfgValListTypeLegalStatM;
				if($(this).val() == 1000002){
					listLegalStatus = App.data.cfgValListTypeLegalStatN;
				} 
				$("#sel_list_legal_status").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_PARTNER_SEL_LIST_LEGAL_STATUS, listLegalStatus));
			})
			var rightSocMa = self.do_verify_user_right_soc_manage();
			if(!rightSocMa)
				$("#div_per_partner_societe").hide();
			else{
				var LstAllSociete = App.data["LstSociete"].concat(App.data["LstSocieteChild"]);
				
				do_gl_autocomplete({
					el: $("#inp_per_partner_societe"),
					required: true,
					source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
					selectCallback: function(item ) {
						$("#socId")						.val(item.id);
						$("#inp_per_partner_societe")	.val(item.name01);
					},
					renderAttrLst: ["name01"],
					minLength: 0,
				});
			}
		}.bind(this);
		
		var do_lc_create_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(prj);

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_lc_show_prj = function(sharedJson, prj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				//rediriger to view show partner
				let data = sharedJson[App['const'].RES_DATA];
				pr_ctr_Main.do_show_Notify_Msg(null, $.i18n('prj_partner_msg_new_OK'),1);
				setTimeout(() => {
//					window.open(`view_prj_partner_content.html?id=${data.id}`, "_self");
					pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_partner_content.html?id=${data.id}&code=${data.login01}`, "VI_MAIN/"+ App.router.part.PRJ_PARTNER_ENT, [data.id]);
				}, 1000);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}
		
		//-----------------------------------------------
		var do_get_per_societe = function(typeSoc) {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonLst');
			ref["typ02"]	= typeSoc;
			
			var fSucces		= [];
			if(typeSoc != societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSociete']));
			
			if(typeSoc == societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSocieteChild']));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		//---------GetCFG Value---------
		function doGetCfgValue(varname, idGroup, val02, forConcat){	
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonGetCfg');
			ref['idGroup']	= idGroup;
			ref['val02']	= val02;
			var fSucces		= [];		
			if (!forConcat) 
				fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
			else
				fSucces.push(req_gl_funct(App, App.funct.mergeArray, [varname])); 
			
			fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		function translateCFGValue(sharedJson, varname){
			var list =  App.data[varname];
			for(var i = 0; i <list.length; i++){
				list[i].name = $.i18n(list[i].val01);			
			}
		}
	}

	return PrjPartnerEntNew;
});