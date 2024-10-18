define([
	'text!group/user/tmpl/PrjUser_Ent_Content.html'
	],
	function(	
			PrjUser_Ent_Content
	){
	
	var PrjUserEntContent 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divContent 		= "#div_user_content";
		const pr_divTabPerInfo 		= "#div_user_info_person";
		const pr_divTabJobPosition	= "#div_user_position";
		
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
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

		tmplName.PRJ_USER_ENT_CONTENT				= "PrjUser_Ent_Content";
		
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
		
		//------------------const object------------------------------------------------------
		const typeUserClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		const societePartnerSupp	= 1010003;
		const societePartnerOther	= 1010006;
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(prj, mode){               
			try{
//				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
//				if (params.id){
					do_lc_load_view();
					do_lc_show_prj(prj, mode);
//				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_CONTENT			, PrjUser_Ent_Content);
		}	
		
		var do_lc_show_prj = function(prj, mode){
			$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_CONTENT, prj));
			
////			$(pr_divTabDocs)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_DOCS, prj));
//			$(pr_divTabPerInfo)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_PERSON_INFO, prj));
//			$("#sel_autuser_header_legalstat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_LEGAL_STAT));
//			
//			let checked_pos = do_check_user_position(prj);
//			$("#div_user_position")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_JOBPOSITION, checked_pos));
			
			let divAction = $("#a_btn_save, #a_btn_cancel, #div_prj_ent_file_upload, .action-item-doc, .item-file-delete");
			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
				do_gl_enable_edit($(pr_divTabPerInfo), ".objData", mode);
				do_gl_enable_edit($(pr_divTabJobPosition), ".objData", mode);
				
				$("#a_btn_edit, #div_img_avatar").addClass("hide");
				divAction.removeClass("hide");
			} else {
				do_gl_disable_edit($(pr_divContent));
				do_gl_disable_edit($(pr_divTabPerInfo), ".objData", mode);
				do_gl_disable_edit($(pr_divTabJobPosition), ".objData", mode);
				
				$("#a_btn_edit, #div_img_avatar").removeClass("hide");
				divAction.addClass("hide");
			}
			
			do_lc_bind_event_content_prj(prj);
		}
		
		var do_lc_bind_event_content_prj = function(prj){
			let	obj 	= {files:[].concat(prj.files ? prj.files : [])};
			let option	= {
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: obj//file existing here					
			}			
			do_gl_init_fileDropzone($(pr_divContent), option);
			$("#a_btn_edit").off('click').click(function(){
				var typeUser = prj.typ02;
//				var rightCode = rights.req_lc_Right(typeUser, RIGHT_M);
//				if(rightCode == -1){
//					do_gl_show_Notify_Msg_Error($.i18n("user_not_support_M_" + typeUser));
//					return;
//				}
				do_lc_Lock_Begin(prj);
			});	
			
			$("#a_btn_save").off("click").on("click", function(){
				let	data	= req_gl_data({
					dataZoneDom		: $("#div_main_content")
				});
				
				if(data.hasError)	return false;
				
				let newPrj 			= data.data;
				newPrj.per.info10 	= newPrj.email;
				
				if(newPrj.cats){
					newPrj.cats 		= do_generate_cats(newPrj.cats);
				}
				
				do_lc_modify_data(newPrj);
				newPrj 			= $.extend(false, prj, newPrj);
				newPrj.files	= obj.files;
				
				do_lc_save_prj_content(newPrj, prj)
			})
			
			$("#a_btn_cancel").off("click").on("click", function(){
				do_lc_cancel(prj);
			})
			
			$("#btn_aut_user_change_pass").on("click", function() {
				$("#div_ent_header_password").toggle("hide"); 
				
				let $inp_pass = $("#inp_autuser_header_pass, #inp_autuser_header_pass_match");
				if($("#div_ent_header_password").hasClass("noData")) {
					$inp_pass.removeClass("noData").addClass	("objData")
				} else {
					$inp_pass.removeClass("objData").addClass	("noData")
				}
			});
			$( "#inp_autuser_header_typ" ).change(function() {
				  if($( this ).val()==6){
					  $("#li_AutUser_Ent_Tab_Cat, #div_AutUser_Ent_Tab_Cat").removeClass("hide"		);
//					  pr_ctr_EntTabCat .do_lc_show(obj, mode);					  
					  $(".div_file_cover")									.removeClass("hide"		);
				  }
				  else{
					  $("#li_AutUser_Ent_Tab_Cat, #li_AutUser_Ent_Tab_Cat")	.addClass	("hide"		);
//					  pr_ctr_EntTabCat .do_lc_show({}, mode);
					  $(".div_file_cover")									.addClass	("hide"		);
				  }  
			});

//			do_gl_set_input_autocomplete("#supName", {
//				dataRes 	: ["login", "name"],  
//				dataReq		:{nbLine:20, typeDif: 5}, 
//				dataService : ["ServiceAutUser", "SVAutUserSearch"], 
//				dataSel 	: {"#supId": "id"}, 
//			});
			
			if(prj.typ) {
				do_gl_select_value($("#inp_autuser_header_typ"), prj.typ);
			}			
			
			if(prj.stat) {
				do_gl_select_value($("#inp_autuser_header_stat"), prj.stat);
			}			
			
			var rightSocMa = self.do_verify_user_right_soc_manage();
//			if(!rightSocMa)
//				$("#div_autuser_societe").hide();
//			else{
//				var LstAllSociete 	= App.data["LstPartner"];
//				for(var i=0; i<LstAllSociete.length; i++){
//					if(LstAllSociete[i].id == prj.manId){
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
		}
		
		var do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_NEW);
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj]));
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		function do_begin_lock(sharedJson, obj){
			//to comeback on tab curent active
//		    do_gl_req_tab_active($(pr_divContent));
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_MOD;				
				do_lc_show_prj(obj, App.data.mode);
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				pr_lock 	= null;
				var uName 	= " " + sharedJson[App['const'].RES_DATA].userName;
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_begin') + uName);
			}else{
				pr_lock = null;
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu'));
				//notify something if the lock is taken by other person
				//show lock.information
			}		
		}
		
		var do_generate_cats = function(data){
			var dataGenerated=[];
			for(var o in data){
				if(data[o]==1){
					dataGenerated.push({"catId" : o})
				}
			}
			return dataGenerated;
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
		
		var do_lc_save_prj_content = function(newPrj, prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);	
			
			if(newPrj.pass !== undefined) {
				newPrj.pass = do_encryt_password(newPrj.pass);
			}
			
			ref["obj"]		= JSON.stringify(newPrj);
			ref['lock_id'] 	= pr_lock.id;
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjContent, [prj]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_encryt_password = function(password) {
			return rq_gl_Crypto(password);
		}
		
		var do_lc_afterSave_prjContent = function(sharedJson, prj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let data 		= sharedJson[App['const'].RES_DATA];
				prj 			= $.extend(true, prj, data);
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
				do_lc_show_prj(prj, App.data.mode);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}
		
		var do_lc_cancel = function (prj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);
			ref['lock_id'	]	= pr_lock.id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock		, [prj]));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		function do_del_lock(sharedJson, prj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock = null;				
			} else {   
				pr_lock = null;
				//notify something
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu') );
			}
	
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
			do_lc_show_prj(prj, App.data.mode);
		}
		
		var do_lc_save_files_prj = function(prj){
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_SAVE_FILES);	
			ref["obj"]		= JSON.stringify(prj);
			
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_files_prj, [prj]));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		var do_lc_afterSave_files_prj = function(sharedJson, prj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				prj.docs = sharedJson[App['const'].RES_DATA].docs;
				do_lc_show_prj_docs(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
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
	
	return PrjUserEntContent;
});