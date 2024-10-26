define([
	'group/user/intern/ctrl/PrjUserEntTabs'
	],
	function(
			{PrjUserEntContent, PrjUserEntTabJobPosition, PrjUserEntTabPersonInfo, PrjUserEntTabRights}
	){
	
	var PrjUserEnt 	= function (grpName, header, content, footer) {
		var pr_grpName				= grpName?grpName:"PrjUserMan";
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_user_content";
		var pr_divFooter 			= footer  ? footer : null;

		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divTabPerInfo 		= "#div_user_info_person";

		//------------------------------------------------------------------------------------
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
		const pr_SV_GET				= "SVGet"; 
		const pr_SV_NEW				= "SVNew"; 
		const pr_SV_MOD				= "SVMod"; 
		const pr_SV_DEL				= "SVDel"; 

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		//------------------const object------------------------------------------------------
		const typeUserClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		const societePartnerSupp	= 1010003;
		const societePartnerOther	= 1010006;
		//-----------------------------------------------------------------------------------
		const RIGHT_U_D				= 1000004;
		const RIGHT_U_M				= 1000003;
		const RIGHT_U_N				= 1000002;
		const RIGHT_U_G				= 1000001;
		
		const RIGHT_ADM				= 100;
		const RIGHT_A_M				= 103;
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_Sidebar 			= null;
		var pr_ctr_Fav 				= null;
		
		var pr_DIV_CONTENT          = "#div_main_content";
		var pr_SHOW_COMMON          = false;
		var pr_ID_TABLE_PRJ			= 1000;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_Sidebar 			= App.controller.UI.Sidebar;
			pr_ctr_Fav 				= App.controller.UI.Fav;
			pr_ctr_List 			= App.controller.PrjUser.List;
			pr_ctr_Ent				= App.controller.PrjUser.Ent;
			
			if (!App.controller.PrjUser)					App.controller.PrjUser						= {};
			
			if (!App.controller.PrjUser.Ent)				App.controller.PrjUser.Ent 					= this;
			
			if(!App.controller.PrjUser.EntContent)			App.controller.PrjUser.EntContent 			= new PrjUserEntContent			(grpName, null, null, null);
//			if(!App.controller.PrjUser.EntTabJobPosition)	App.controller.PrjUser.EntTabJobPosition 	= new PrjUserEntTabJobPosition	(grpName, null, null, null);
			if(!App.controller.PrjUser.EntTabPersonInfo)	App.controller.PrjUser.EntTabPersonInfo		= new PrjUserEntTabPersonInfo	(grpName, null, null, null);
			if(!App.controller.PrjUser.EntTabRights	)		App.controller.PrjUser.EntTabRights			= new PrjUserEntTabRights		(grpName, null, null, null);
			
			
			do_get_per_societe(societePartnerSupp+","+societePartnerOther);
			do_get_per_legalStat();
//			do_get_pos_position();
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(id, mode, div){               
			try{
				if(div){
					pr_DIV_CONTENT = div;
					pr_SHOW_COMMON = true;
				}
				
				if(mode == var_lc_MODE_NEW){
					do_lc_show_entity({}, mode);
				}else if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
					var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
					if(!id) id = params.id;
					if (id) do_lc_get_Entity (id, mode);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_reqRole_User = function(mode){
			var listUserRight = App.data.user.rights;
			if(listUserRight.includes(RIGHT_U_M) || listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_U_N)) return;
			if(!listUserRight.includes(RIGHT_U_M || !listUserRight.includes(RIGHT_U_N))){
				$(".isManager").remove();
				$(".info-content").off("click").removeClass("info-content");
				$(".info-edit-content").off("click").removeClass("info-content");
				$(".info-edit").off("click").removeClass("info-edit");
				$("#btn_modify, #btn_add_avatar").addClass("hidden");
				$("#btn_aut_user_change_pass").attr("disabled", "disabled");
				$(".btn_check_role_all").addClass("disabled")
			}
			
			let typ = App.data.user.typ;
			if(typ == pr_type_adm_all || typ == pr_type_adm){
				//to do
			}else{
				$(".isManager").remove();
				$(".info-content").off("click").removeClass("info-content");
			}
		}
		
		this.do_lc_ShowDiv_ByMode = function (div, mode){
			if (mode == var_lc_MODE_NEW){
				
				$(div).find(".info-content").addClass("hide");
				$(div).find(".content-edit").removeClass("hide");
				
				
				$(div).find("#div_img_avatar").addClass("hide");
				$(div).find("#div_prj_ent_file_upload").removeClass("hide");
				
				$(div).find("#div_ent_password_btn").addClass("hide");
				$(div).find("#div_ent_header_password").show();
				
				
				$("#inp_autuser_header_pass").removeClass("noData").addClass("objData");
				$("#inp_autuser_header_pass_match").removeClass("noData").addClass("objData");
				
				
				$(div).find(".dropdown ").addClass("hide");
				
			}	else{
				$(div).find(".info-content").removeClass("hide");
				$(div).find(".content-edit").addClass("hide");				
				
				$(div).find("#div_img_avatar").removeClass("hide");
				$(div).find("#div_prj_ent_file_upload").addClass("hide");
				
				$(div).find("#div_ent_password_btn").removeClass("hide");
				$(div).find("#div_ent_header_password").hide();
				
				$("#inp_autuser_header_pass").removeClass("objData").addClass("noData");
				$("#inp_autuser_header_pass_match").removeClass("objData").addClass("noData");
				
				$(div).find(".dropdown ").removeClass("hide");
			}		  
		}
		
		
		
		const do_lc_get_Entity = function(id, mode){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);	
			ref["id"]		= id;
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_Entity_response, [mode]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_Entity_response = function(sharedJson, mode){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				do_lc_show_entity(data, mode);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), () => pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_dashboard.html`));
//				window.open("view_prj_user_list.html", "_self");
//				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_user_list.html`, "VI_MAIN/"+ App.router.part.PRJ_USER_LIST);
			}
			
			
		}
		
		const do_lc_show_entity = function(ent, mode){
			let isFavorite 	= null;
			if(App.data.user && App.data.user['lstFav'] && App.data.user['lstFav'][pr_ID_TABLE_PRJ]) {
				const lstFav 	=  App.data.user['lstFav']
	
				if(lstFav[pr_ID_TABLE_PRJ].ids.includes(ent.id)) isFavorite = true;
			}

			do_lc_clean_data_before_show(ent);
			ent.isFavorite = isFavorite

			$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT	, ent));
			
			if(ent.sup)
				ent.sup.name = ent.sup.name01 + ent.sup.name02 + ent.sup.name03;
			
			if(pr_SHOW_COMMON) 	$(pr_DIV_CONTENT).find(".page-content").addClass('p-0');
			
			do_lc_build_page(ent, mode);
		}
		
		const do_lc_clean_data_before_show = function(ent){
			if(Object.keys(ent).length == 0) return;
			let per 		= ent.per;
			if(per?.inf02){
				ent.inf02  = JSON.parse(per.inf02);
			}

			if(per?.inf04){
				ent.inf04  = JSON.parse(per.inf04);
			}

			const do_req_inf05 = (data) => {
				if(!data) return;
				let inf05
				try {
					inf05 = JSON.parse(data);
				} catch (e) {
					return;
				}

				let inf05Arr = inf05
				if(!Array.isArray(inf05Arr)) {
					if(typeof inf05Arr !== 'object') return

					//When inf05Arr has type object => to array
					inf05Arr = Object.keys(inf05).map(k => ({ [k]: inf05[k] }));
				}

				return inf05Arr.reduce((curr, item) => {
					if(!item.k) return
					curr[item.k] = item.v.replace(/&nbsp;/gi,"").split(" ").join('');
					return curr;
				}, {});
			}

			ent.inf05 = per? do_req_inf05(per.inf05) : null;

			if(ent.files && !ent.avatar) {
				ent.files.forEach(e => {
					if(e.typ01 === 1 && e.typ02 === 1) {
						ent.avatar = e
					}
				})
			}
		}
		
		const do_lc_build_page = function(obj, mode){
			do_lc_show_blocks(obj, mode);
			do_lc_binding_events(obj, mode);
		}
		
		const do_lc_show_blocks = function(obj, mode){
			App.controller.PrjUser.EntContent 		.do_lc_show(obj, mode);
//			App.controller.PrjUser.EntTabJobPosition.do_lc_show(obj, mode);
			App.controller.PrjUser.EntTabPersonInfo .do_lc_show(obj, mode);
			App.controller.PrjUser.EntTabRights 	.do_lc_show(obj, mode);
			
			if(mode == var_lc_MODE_NEW){
				$("#div_user_funct").removeClass("hide");
			}else{
				$("#div_user_funct").addClass("hide");
			}
		}
		
		const do_lc_binding_events = function (obj, mode){
			$("#btn_aut_user_save_all").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_save"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: self.do_lc_Save_Entity,
							param	: ["#div_user_ent", obj, var_lc_MODE_NEW],
							classBtn: "btn-primary"
						}
					}
				});
//				self.do_lc_Save_Entity("#div_user_ent", obj, var_lc_MODE_NEW); 
			})
			
			$("#btn_aut_user_cancel").off("click").on("click",function(){
				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_delete"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
						},
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_show_blocks,
							param	: [],
							classBtn: "btn-primary"
						}
					}
				});
			})
			
			$("#btn_mod_favorite").off("click").on("click", function() {
				const isFav = $(this).hasClass("isFavorite");

				do_lc_mod_favorite(isFav, obj, mode);
			})
		}
		
		//---------------------------------Ajax----------------------------------------------
		const do_get_per_legalStat = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceCfgGroup', 'SVCfgGroupGet');
			ref["id"]		= 102;
			ref["withValue"]= "true";
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_get_per_legalStat_response, []));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		const do_get_per_legalStat_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				App.data["PerLegalStat"] = [];
				$.each(data.vals, function(i, e) {
					if(e.val02 == 1) {
						App.data["PerLegalStat"].push(e);
					}
				});
			}
		}
		
		const do_get_per_societe = function(typeSoc) {
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
		
//		var do_get_pos_position = function() {
//			//ajax to get all fix values here
//			var ref 		= req_gl_Request_Content_Send('ServiceJobPosition', 'SVJobPositionLst');
//			
//			var fSucces		= [];
//			fSucces.push(req_gl_funct(App, App.funct.put, ['JobPositions']));	
//			
//			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
//			
//			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
//		}

		const do_lc_data_check = function(inp, obj) {
			var data = inp.data;
			
			if (data.pass01){
				data.pass01 	= rq_gl_Crypto(data.pass01); 
			}
			
			if (data.per) {
				data.per.name01	= req_gl_Capitalize(data.per.name01);
				data.per.name02	= req_gl_Capitalize(data.per.name02);
				data.per.name03	= req_gl_Capitalize(data.per.name03);
				
				//--info03 of user
				data.name		= data.per.name01 
								+ (data.per.name02?" " + data.per.name02:"") 
								+ (data.per.name03?" " + data.per.name03:"");
				
				data.per.info10 = data.email;
			}
				
			
			if(data.cats){
				data.cats 		= pr_prjUser.Ent.do_lc_generate_cats(newEnt.cats);
			}

			if(data.inf02){
				var objInfo02 = {	"j": data.inf02.job,
									"d": data.inf02.dtBirthday};
	
				var per = data.per;
				per.inf02 = JSON.stringify(objInfo02);
			}
			
			if(data.inf04){
				var objInfo04 = {	"i": data.inf04.idDocNum,
									"d": data.inf04.idDocDate,
									"p": data.inf04.idDocPlace};
	
				var per = data.per;
				per.inf04 = JSON.stringify(objInfo04);;
			}
			
			if(data.inf05){
				var objInfo05 = [{"k": "fb", 	"v": data.inf05.value_facebook 	== undefined?null:data.inf05.value_facebook},
                    			 {"k": "tw", 	"v": data.inf05.value_twitter 		== undefined?null:data.inf05.value_twitter},
                    			 {"k": "ln",	"v": data.inf05.value_linkedin 	== undefined?null:data.inf05.value_linkedin},
                    			 {"k": "gg", 	"v": data.inf05.value_google 		== undefined?null:data.inf05.value_google},
                    			 {"k": "ig", 	"v": data.inf05.value_instagram 	== undefined?null:data.inf05.value_instagram}];
	
				var per = data.per;
				per.inf05 = JSON.stringify(objInfo05);;
			}
			
			//----reformater uRights
			if (data.rights){
				const rights = []
				Object.keys(data.rights).map(key => {
					if(data.rights[key]) rights.push(key)
				})
				data.rights = rights.toString()
			}

			// if (data.rights){
			// 	const rights = []
			// 	Object.keys(data.rights).map(key1 => {
			// 		Object.keys(data.rights[key1]).map(key2 => {
			// 			if(data.rights[key1][key2]) {
			// 				let rIndex = rights.findIndex(e => +e.role === +key1);

			// 				if(rIndex < 0) {
			// 					rights.push({ role: key1, rights: '' })
			// 					rIndex = rights.length - 1
			// 				} else rights[rIndex].rights += `,${key2}`
			// 			}
			// 		})
			// 	})

			// 	data.rights = rights
			// }
			
			data.pos			= null;		
			
			inp.data 			= $.extend(false, obj, data);
		}
		
		this.do_lc_generate_cats = function(data){
			var dataGenerated=[];
			for(var o in data){
				if(data[o]==1){
					dataGenerated.push({"catId" : o})
				}
			}
			return dataGenerated;
		}
		
		
		this.do_lc_Save_Entity = function (pr_divContent, ent, mode){
			if (!pr_divContent) pr_divContent	= "#div_main_content";
			if (!mode)			mode			= pr_SV_MOD;
			
			if (!ent.files) ent.files = [];		
			let	data	= req_gl_data({
				dataZoneDom		: $(pr_divContent),
			});
			
			if(data.hasError){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return false;
			}
			
			
			
			//---clone ent data----------------------------------
			var 	obj 		= JSON.parse(JSON.stringify(ent));
			delete 	obj.pass01;
			delete 	obj.avatar;
			delete 	obj.dt01;
			delete 	obj.histories;
			delete 	obj.man;
			delete 	obj.sup;
			
			do_lc_data_check(data, obj);
			do_lc_data_send	(data, mode);
		}
		
		var do_lc_data_send= function(data, mode){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, mode==var_lc_MODE_NEW? pr_SV_NEW : pr_SV_MOD);
			ref["forPublic"]	= 0;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg_Success, [null, null, mode])); 
			fSucces.push(req_gl_funct(null	, do_lc_afterSave_EntContent	, [mode]));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		
		var do_lc_afterSave_EntContent = function(sharedJson, mode){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				App.data.mode 	= var_lc_MODE_SEL;				

				do_lc_show_entity(data, App.data.mode);
				do_gl_show_Notify_Msg_Success ($.i18n('common_success_update'));
			} else {   
				if(mode == var_lc_MODE_NEW) do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get_error'));
				else do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
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
	
	return PrjUserEnt;
});