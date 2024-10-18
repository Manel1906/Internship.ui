define([
	'text!group/user/tmpl/PrjUser_EntCreate.html',
	'text!group/user/tmpl/PrjUser_Ent_Tab_Person_Info.html',
    'text!group/user/tmpl/PrjUser_Sel_List_Legal_Status.html'
	],
	function(PrjUser_EntCreate,
			PrjUser_Ent_Tab_Person_Info,
			PrjUser_Sel_List_Legal_Status) {
	var PrjUserEntNew     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabPerInfo 		= "#div_prj_person_info";
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
		var pr_OBJ_TYPE				= 1000;
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_GET				= "SVAutUserGet"; 
		var pr_SV_NEW				= "SVAutUserNew"; 
		var pr_SV_DEL				= "SVAutUserDel"; 

		var pr_SV_MOD				= "SVAutUserMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVAutUserLckReq";
		var pr_SV_LCK_END			= "SVAutUserLckEnd";
		var pr_SV_LCK_DEL			= "SVAutUserLckDel";
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
		//---------------------------------Const--------------------------------------------------
		const typeUserClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		const societePartnerSupp	= 1010003;
		const societePartnerOther	= 1010006;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller.PrjUser.List;
			pr_ctr_Ent				= App.controller.PrjUser.Ent;
			
			tmplName.PRJ_USER_ENT_CREATE				= "PrjUser_EntCreate";
			tmplName.PRJ_USER_ENT_TAB_PERSON_INFO		= "PrjUser_Ent_Tab_Person_Info";
			tmplName.PRJ_USER_LEGAL_STAT				= "PrjUser_Sel_List_Legal_Status";
			
			//do_get_per_societe(societePartnerSupp+","+societePartnerOther);
			do_get_per_legalStat();
		}

		var pr_isLoad = true;
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj = {}, mode){		
			if(!App.data["PerLegalStat"]){ //!App.data["LstPartner"] ||
				setTimeout(function(){self.do_lc_show(obj, mode)}, 1000);
				console.log("do_lc_show is not ready");
				return;
			}

			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_CREATE			, PrjUser_EntCreate); 	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_PERSON_INFO	, PrjUser_Ent_Tab_Person_Info); 	
			
			$("#div_main_content")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_CREATE	, {}));
			$("#div_prj_info_person")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_PERSON_INFO, {}));
			$("#sel_autuser_header_legalstat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LEGAL_STAT));
			
			do_lc_bind_event(obj);
			do_lc_bind_event_perInfo(obj);
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
		
		var do_lc_bind_event = function(prj){
			let	obj 	= {files:[]};
			let option	= {
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: obj//file existing here					
			}
			do_gl_init_fileDropzone($("#div_main_content"), option);
			
			
			do_gl_set_input_autocomplete("#supName", {
				dataRes 	: ["login", "name"],  
				dataReq		: {nbLine:20, typeDif: 5}, 
				dataService : ["ServiceAutUser", "SVAutUserSearch"], 
				dataSel 	: {"#supId": "id"}, 
			});
			
			$("#a_btn_save").off("click").on("click", function(){
				let	data	= req_gl_data({
					dataZoneDom		: $("#div_main_content")
				});
				
				if(data.hasError)	return false;
				
				let prjNew		= data.data;
				do_lc_modify_data(prjNew);
				prjNew.pos		= {"1":0,"2":1,"3":0,"4":0,"5":0};
				prjNew.files	= obj.files;
				
				if(prjNew.pass !== undefined) {
					prjNew.pass = do_encryt_password(prjNew.pass);
				}
				
				do_lc_create_usr(prjNew);
			})
			
			$("#btn_aut_user_change_pass").on("click", function() {
				$("#div_ent_header_password").slideToggle();
				if($("#div_ent_header_password").hasClass("noData")) {
					$("#div_ent_header_password").removeClass("noData");
				} else {
					$("#div_ent_header_password").addClass("noData");
				}
			});
			$( "#inp_autuser_header_typ" ).change(function() {
				  if($( this ).val()==6){
					  $("#li_AutUser_Ent_Tab_Cat, #div_AutUser_Ent_Tab_Cat").removeClass("hide"		);
					  $(".div_file_cover")									.removeClass("hide"		);
				  }
				  else{
					  $("#li_AutUser_Ent_Tab_Cat, #li_AutUser_Ent_Tab_Cat")	.addClass	("hide"		);
					  $(".div_file_cover")									.addClass	("hide"		);
				  }  
			});

			
//			do_gl_set_input_autocomplete("#supName", {
//				dataRes 	: ["login", "name"],  
//				dataReq		: {nbLine:20, typeDif: 5}, 
//				dataService : ["ServiceAutUser", "SVAutUserSearch"], 
//				dataSel 	: {"#supId": "id"}, 
//			});		
//			
//			var rightSocMa = self.do_verify_user_right_soc_manage();
//			if(!rightSocMa)
//				$("#div_autuser_societe").hide();
//			else{
//				var LstAllSociete 	= App.data["LstPartner"];
//				
//				for(var i=0; i<LstAllSociete.length; i++){
//					if(LstAllSociete[i].id == App.data.user.manId){
//						$("#inp_autuser_societe")	.val(LstAllSociete[i].name);
//						break;
//					}
//				}
//				
//				if(App.data.user.manId == 1){
//					do_gl_autocomplete({
//						el				: $("#inp_autuser_societe"),
//						required		: true,
//						source			: LstAllSociete,
//						selectCallback	: function(item ) {
//							$("#manId")					.val(item.id);
//							$("#inp_autuser_societe")	.val(item.name);
//						},
//						renderAttrLst	: ["name"],
//						minLength		: 0,
//					});
//				}
//			}
		}.bind(this);
		
		var do_encryt_password = function(password) {
			return rq_gl_Crypto(password);
		}
		
		var do_lc_bind_event_perInfo = function(prj){
			
		}
		
		var do_lc_modify_data = function(data) {
			if(data.info04){
				var objInfo04 = {	"i": data.info04.idDocNum,
									"d": data.info04.idDocDate,
									"p": data.info04.idDocPlace};
	
				var per = data.per;
				per.info04 = JSON.stringify(objInfo04);;
			}
			
			if(data.info05){
				var objInfo05 = [{"k": "fb", 	"v": data.info05.value_facebook 	== undefined?null:data.info05.value_facebook},
                    			 {"k": "tw", 	"v": data.info05.value_twitter 		== undefined?null:data.info05.value_twitter},
                    			 {"k": "ln",	"v": data.info05.value_linkedin 	== undefined?null:data.info05.value_linkedin},
                    			 {"k": "gg", 	"v": data.info05.value_google 		== undefined?null:data.info05.value_google},
                    			 {"k": "ig", 	"v": data.info05.value_instagram 	== undefined?null:data.info05.value_instagram}];
	
				var per = data.per;
				per.info05 = JSON.stringify(objInfo05);;
			}
		}

		//---------------------------------Ajax----------------------------------------------
		var do_get_per_legalStat = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceCfgGroup', 'SVCfgGroupGet');
			ref["id"]		= 102;
			ref["withValue"]= "true";
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_get_per_legalStat_response, []));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_get_per_legalStat_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				App.data["PerLegalStat"] = [];
				$.each(data.vals, function(i, e) {
					if(e.val02 == 1) {
						App.data["PerLegalStat"].push(e);
					}
				});
				tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_LEGAL_STAT		, PrjUser_Sel_List_Legal_Status); 
				tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LEGAL_STAT	, App.data["PerLegalStat"]);
			}
		}
						
		var do_lc_create_usr = function(prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);			
			ref["obj"]		= JSON.stringify(prj);
			ref["forPublic"]= 0;

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_lc_show_prj = function(sharedJson, prj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				//rediriger to view show user
				let data = sharedJson[App['const'].RES_DATA];
				pr_ctr_Main.do_show_Notify_Msg(null, $.i18n('prj_user_msg_new_OK'),1);
				setTimeout(() => {
//					window.open(`view_prj_user_content.html?id=${data.id}`, "_self");
					pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_user_content.html?id=${data.id}`, "VI_MAIN/"+ App.router.part.PRJ_USER_ENT, [data.id]);
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
			if(typeSoc == societeListCompany)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSociete']));			
			else if(typeSoc == societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSocieteChild']));
			else
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstPartner']));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
	}

	return PrjUserEntNew;
});