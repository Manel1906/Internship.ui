define([],function(){
	
	var Ent 						= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header  	? header : null;
		var pr_divContent 			= content  	? content : "#div_ent_main";
		var pr_divFooter 			= footer  	? footer : null;

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
		const pr_SERVICE_CLASS		= "ServicePerClient"; //to change by your need
		const pr_SV_GET				= "SVGet"; 
		const pr_SV_NEW				= "SVNew"; 
		const pr_SV_MOD				= "SVMod"; 
		const pr_SV_DEL				= "SVDel"; 

		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		//------------------const object------------------------------------------------------
		const TYP_01_MORAL			= 200;
		const TYP_01_NATURAL		= 100;
		
		const TYP_02_CLIENT			= 2000;
		//-----------------------------------------------------------------------------------
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 102;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		var RIGHT_GET	        	= 40000101;
		var RIGHT_NEW	        	= 40000102;
		var RIGHT_MOD	        	= 40000103;
		var RIGHT_DEL	        	= 40000104;
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent 				= null;
		var pr_ctr_List 			= null;
		
		
		var pr_DIV_CONTENT          = "#div_entity";
		
		var pr_tab_typ_info    				= 1;
		var pr_tab_typ_disease_hist    		= 2;
		var pr_tab_typ_medical_hist    		= 3;
		var pr_tab_typ_medical_order    	= 4;
		var pr_tab_typ_blood_test    		= 5;
		var pr_tab_typ_img_test    			= 6;
		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.UI.Main;

			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
			
			pr_ctr_EntTabInf		= App.controller[pr_grpName].EntTabInf;
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(id, mode){               
			try{
				$(pr_DIV_CONTENT)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT	, {}));
				
				if(mode == var_lc_MODE_NEW){
					do_lc_show_entity({}, mode);
					
				}else if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
					
					var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
					if(!id) id = params.id;
					if (id) do_lc_get_Entity (id, mode);
				}
				
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		const do_lc_get_Entity = function(id, mode){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET);	
			ref["id"]		= id;
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_Entity_callback, [mode]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_Entity_callback = function(sharedJson, mode){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				
				do_lc_clean_data	(data);
				do_lc_show_entity	(data, mode);
			} else {
				do_gl_init_msgbox_annonce($.i18n("prj_project_not_right_view"), () => pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_dashboard.html`));
			}
		}
		
		const do_lc_show_entity = function(ent, mode){
			if (!mode) mode = var_lc_MODE_SEL;

			do_lc_build_page(ent, mode);
		}
		
		const do_lc_clean_data = function(ent){
			if(Object.keys(ent).length == 0) return;


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
			ent.inf05 = ent.inf05? do_req_inf05(ent.inf05) : null;

			if(ent.files && !ent.avatar) {
				ent.files.forEach(e => {
					if(e.typ01 === 1 && e.typ02 === 1) {
						ent.avatar = e
					}
				})
			}
			
			if(ent.inf04 && typeof ent.inf04 == "string"){
				ent.inf04 = JSON.parse(ent.inf04);
			}
			
			if(ent.inf06 && typeof ent.inf06 == "string"){
				ent.inf06 = JSON.parse(ent.inf06);
			}
			
			if (ent.inf08 && typeof ent.inf08 == "string") {
			    ent.inf08 = JSON.parse(ent.inf08);
			}
			
			if (ent.inf09 && typeof ent.inf09 == "string") {
				ent.inf09 = JSON.parse(ent.inf09);
			}
		}

		const do_lc_build_page = function(obj, mode){
			App.controller[pr_grpName].EntTabInfo.do_lc_show(obj, mode);
			
			do_lc_binding_events(obj, mode);
		}

		var do_lc_binding_events = function (ent, mode){
			$(".ent-tab").off("click").on("click", function(e){
				$(".ent-tab").removeClass ("ent-tab-selected");
				$(this).addClass ("ent-tab-selected");
				
				var typ = $(this).data("type");
				if(typ === pr_tab_typ_info){
					App.controller[pr_grpName].EntTabInfo			.do_lc_show(ent, mode);
					
				}else if(typ === pr_tab_typ_disease_hist){
					App.controller[pr_grpName].EntTabDiseaseHist	.do_lc_show(ent, mode);
				
				}else if(typ === pr_tab_typ_medical_hist){
					App.controller[pr_grpName].EntTabMedicalHist	.do_lc_show(ent, mode);
				
				}else if(typ === pr_tab_typ_medical_order){
					App.controller[pr_grpName].EntTabMedicalOrder	.do_lc_show(ent, mode);
				
				}else if(typ === pr_tab_typ_blood_test){
					App.controller[pr_grpName].EntTabBloodTest		.do_lc_show(ent, mode);
				
				}else if(typ === pr_tab_typ_img_test){
					App.controller[pr_grpName].EntTabImgTest		.do_lc_show(ent, mode);
				}
			});
		}
	}
	
	return Ent;
});