define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	var EntContent 			= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divContent 		= "#div_user_content";
		const pr_divTabPerInfo 		= "#div_user_info_person";
		const pr_divTabJobPosition	= "#div_user_position";
		const pr_divTabRights		= "#div_user_rights";
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		const pr_prjUser		    = App.controller[pr_grpName];
		
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
		
		var pr_lock					= null;
		
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
					do_lc_show_entity(prj, mode);
//				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_show_entity = function(ent, mode){
			$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			
////			$(pr_divTabDocs)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_DOCS, prj));
//			$(pr_divTabPerInfo)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_PERSON_INFO, prj));
//			$("#sel_autuser_header_legalstat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LEGAL_STAT));
//			
//			let checked_pos = do_check_user_position(prj);
//			$("#div_user_position")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_JOBPOSITION, checked_pos));
			
//			let divAction = $("#a_btn_save, #a_btn_cancel, #div_prj_ent_file_upload, .action-item-doc, .item-file-delete");
//			if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_NEW){
//				do_gl_enable_edit($(pr_divContent		), ".objData", mode);
//				do_gl_enable_edit($(pr_divTabPerInfo	), ".objData", mode);
//				do_gl_enable_edit($(pr_divTabJobPosition), ".objData", mode);
//				do_gl_enable_edit($(pr_divTabRights		), ".objData", mode);
//				
//				$("#a_btn_edit, #div_img_avatar").addClass("hide");
//				divAction.removeClass("hide");
//			} else {
//				do_gl_disable_edit($(pr_divContent		 ));
//				do_gl_disable_edit($(pr_divTabPerInfo	 ), ".objData", mode);
//				do_gl_disable_edit($(pr_divTabJobPosition), ".objData", mode);
//				do_gl_disable_edit($(pr_divTabRights	 ), ".objData", mode);
//				
//				$("#a_btn_edit, #div_img_avatar").removeClass("hide");
//				divAction.addClass("hide");
//			}
			
			pr_prjUser.Ent.do_lc_reqRole_User();
			
			do_lc_bind_event_content_ent(ent, mode);
			
			pr_prjUser.Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
		}
		
		var do_lc_bind_event_content_ent = function(ent, mode){
			//let	obj 	= {files:[].concat(ent.files ? ent.files : [])};
			if (!ent.files) ent.files = [];
			let option	= {
					parallelUploads	: 10,
		            uploadMultiple	: true,
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: ent//file existing here					
			}			
			do_gl_init_fileDropzone($(pr_divContent), option);
			
			$(".files_content_user").off("click").on("click", function() {
				const {path} = $(this).data();
				let isImage = do_lc_check_image(path);
				if(isImage){
					const viewer = new Viewer(document.getElementById('div_user_content'), {
						filterImgClass: ['msg-body-forme', 'msg-body-other'],
						hide: function () {
							viewer.destroy();
						},
					});
				}else{
					window.open(path, "_blank");
				}
			})
			if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
				if(mode == var_lc_MODE_SEL){
					let el = $("#inp_autuser_header_login").parent();
					el.children().removeClass("info-edit-content");
				}
				
				$(".info-edit-content").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");
					
					$("#a_btn_save_content, #a_btn_cancel_content")	.removeClass("hide");
					
					if(!ent.supId){
						let $parent = $("#supId").parent();
						$parent.find(".info-content")	.addClass("hide");
						$parent.find(".content-edit")	.removeClass("hide");
					}
					
					pr_prjUser.Ent.do_lc_reqRole_User();
				})
				
				$("#a_btn_save_content").off("click").on("click", function(){
					ent.files 		= ent.files ? [...ent.files].filter(Boolean) : [];
//					ent.files		= ent.files.concat(obj.files);
					pr_prjUser.Ent.do_lc_Save_Entity(pr_divContent, ent);
				})
				
				$("#a_btn_cancel_content").off("click").on("click", function(){
					self.do_lc_show(ent, mode);
				})
				
				
				$("#btn_add_avatar").off("click").on("click", function(){
					$("#div_prj_ent_file_upload").removeClass("hide");
					$(".card-drop").addClass("hide");
					$("#a_btn_save_content, #a_btn_cancel_content")	.removeClass("hide");
				})
				
				$("#btn_aut_user_change_pass").on("click", function() {
					$("#div_ent_header_password").toggle("hide"); 
					
					let $inp_pass = $("#inp_autuser_header_pass, #inp_autuser_header_pass_match");
					if($("#div_ent_header_password").hasClass("noData")) {
						$("#div_ent_header_password").removeClass("noData");
						$inp_pass.removeClass("noData").addClass	("objData");
						$("#a_btn_save_content, #a_btn_cancel_content")	.removeClass("hide");
					} else {
						$("#div_ent_header_password").addClass("noData");
						$inp_pass.removeClass("objData").addClass	("noData");
						$("#a_btn_save_content, #a_btn_cancel_content")	.addClass("hide");
					}
				});
				$( "#inp_autuser_header_typ" ).change(function() {
					  if($( this ).val()==6){
						  $("#li_AutUser_Ent_Tab_Cat, #div_AutUser_Ent_Tab_Cat").removeClass("hide"		);
//						  pr_ctr_EntTabCat .do_lc_show(obj, mode);					  
						  $(".div_file_cover")									.removeClass("hide"		);
					  }
					  else{
						  $("#li_AutUser_Ent_Tab_Cat, #li_AutUser_Ent_Tab_Cat")	.addClass	("hide"		);
//						  pr_ctr_EntTabCat .do_lc_show({}, mode);
						  $(".div_file_cover")									.addClass	("hide"		);
					  }  
				});
			}

			try{
				let typ01Arr 	= [App.data.user.typ01, 2, 3, 4, 5];
				let typ01Str 	= typ01Arr.join(',');

				do_gl_set_input_autocomplete("#supName", {
					apiUrl			: App.path.BASE_URL_API_PRIV,
					dataRes 		: ["login01", "name01"],  
					dataReq			: {nbLine:5, typ01s: typ01Str},//stat:1,  // typ01: $("#inp_home_search_typ01_val").val() 
					dataService 	: ["ServiceAutUser", "SVLst"],
					dataSel 		: {"#supId": "id"}, 
					// minLength		: 3,
					// selectCallback	: function(item) {
					// },
				});
			}catch(e){
				console.log (e);
			}
			

			
//			if(ent.typ) {
//				do_gl_select_value($("#inp_autuser_header_typ"), ent.typ);
//			}			
//			
//			if(ent.stat) {
//				do_gl_select_value($("#inp_autuser_header_stat"), ent.stat);
//			}			
			
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
		function do_lc_getExtension_from_name(filename) {
			var parts = filename.split('.');
			return parts[parts.length - 1];
		}


		function do_lc_check_image(filename) {
			var ext = do_lc_getExtension_from_name(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'bmp':
			case 'png':
			case 'PNG':
			case 'webp':
				//etc
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
	
	var EntTabJobPosition = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divContent 		= "#div_user_content";
		const pr_divTabPerInfo 		= "#div_user_info_person";
		const pr_divTabJobPosition	= "#div_user_position";
		
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;

		
		
		var do_Get_Pos_Position = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceJobPosition', 'SVJobPositionLst');
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(App, App.funct.put, ['JobPositions']));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(prj, mode){               
			try{
				do_Get_Pos_Position();
				if(!App.data["JobPositions"]){
					setTimeout(function(){self.do_lc_show(prj, mode)}, 1000);
					console.log("do_lc_show is not ready");
					return;
				}
				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if (params.id){
					do_lc_show_entity(prj, mode);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		}
		
		
		var do_lc_show_entity = function(prj, mode){
			let checked_pos = do_check_user_position(prj);
			$(pr_divTabJobPosition).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_JOBPOSITION, checked_pos));
			
			let divAction = $("#a_btn_save, #a_btn_cancel, #div_prj_ent_file_upload, .action-item-doc, .item-file-delete");
			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
				do_gl_enable_edit($(pr_divTabJobPosition), ".objData", mode);
				divAction.removeClass("hide");
			} else {
				do_gl_disable_edit($(pr_divTabJobPosition), ".objData", mode);
				divAction.addClass("hide");
			}
			
			do_lc_bind_event_content_prj(prj);
			
			pr_prjUser.Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
		}
		
		var do_check_user_position = function(obj) {
			var pos 	= $.extend(true, {}, App.data["JobPositions"]);
			var userPos = obj.pos;
			$.each(pos, function(i, e) {
				$.each(userPos, function(iu, eu) {
					if(eu.id == e.id) {
						e.check = 1;
					}
				});
			});
			if(pos.remove)
				delete pos.remove
			return pos;
		}
		
		var do_lc_bind_event_content_prj = function(prj){
			
		}
	}	
	
	var EntTabPersonInfo = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		const pr_divContent 		= "#div_user_info_person";
		
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		const pr_prjUser		    = App.controller[pr_grpName];
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//var url_header				= req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;

		
		
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
				
				$("#sel_autuser_header_legalstat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LEGAL_STAT	, App.data["PerLegalStat"]));
			}
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(ent, mode){               
			try{
				do_get_per_legalStat();
				do_lc_show_entity(ent, mode);
			}catch(e) {				
				console.log(e);
			}
		}
		
		var do_lc_show_entity = function(ent, mode){
			
			
			
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_PERSON_INFO, ent));
			
			pr_prjUser.Ent.do_lc_reqRole_User();
			
			do_lc_bind_event_content_prj(ent, mode);
			
			pr_prjUser.Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
		}
		
		var do_lc_bind_event_content_prj = function(ent, mode){
			
			if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");
					
					$("#a_btn_save_info, #a_btn_cancel_info")	.removeClass("hide");
					
					pr_prjUser.Ent.do_lc_reqRole_User();
				})
				
				$("#a_btn_save_info").off("click").on("click", function(){			
					pr_prjUser.Ent.do_lc_Save_Entity(pr_divContent, ent);
				})
				
				$("#a_btn_cancel_info").off("click").on("click", function(){
					self.do_lc_show(ent, mode);
				})
			}
		}
	}
	
	var EntTabRights     = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_divHeader 			= header;
		var pr_divFooter 			= footer;
		var pr_divContent 			= "#div_user_rights";
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

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;

		const pr_prjUser		    = App.controller[pr_grpName];
		//-----------------------------------------------------------------------------------
		var pr_object				= null;
		var pr_mode					= null;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;

			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;

		}
		
		let arr_auth = [
//			{	"id1" : 1000001, "id2"	: 1000002, "id3" : 1000003, "id4" : 1000004, "id5" : 1000005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" :  1000000 , "title" :"aut_right_aut_user"},
//			
//			{	"id1" : 30000011, "id2": 30000012, "id3" : 30000013, "id4" : 30000014, "id5" : 30000015, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 30000010 , "title" :"aut_right_per_client"},					
//			
//			{	"id1" : 40000001, "id2": 40000002, "id3" : 40000003, "id4" : 40000004, "id5" : 40000005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 40000000 , "title" :"aut_right_prj_project"},
//				
//			{	"id1" : 40000101, "id2": 40000102, "id3" : 40000103, "id4" : 40000104, "id5" : 40000105, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 40000100 , "title" :"aut_right_prj_files"},
//				
//			// {	"id1"  : 2002001, "id2": 2002002, "id3" : 2002003, "id4" : 2002004, "id5" : 2002005, 
//			// 	"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//			// 	"rId" : 2002000 , "title" :"aut_right_prj_cra"},
//				
//			{	"id1" : 2002011, "id2": 2002012, "id3" : 2002013, "id4" : 2002014, "id5" : 2002015, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 2002010 , "title" :"aut_right_prj_cra_management"},
//				
//			{	"id1" : 2001001, "id2": 2001002, "id3" : 2001003, "id4" : 2001004, "id5" : 2001005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 2001000 , "title" :"aut_right_prj_hiloday_management"},
//			
//			{	"id1" : 7000001, "id2": 7000002, "id3" : 7000003, "id4" : 7000004, "id5" : 7000005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 7000000 , "title" :"aut_right_prj_project_cra_management"},
//			
//			{	"id1" : 50000001, "id2": 50000002, "id3" : 50000003, "id4" : 50000004, "id5" : 50000005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 50000000 , "title" :"aut_right_nso_email_grp"},						
//				
//			{	"id1" : 50000101, "id2": 50000102, "id3" : 50000103, "id4" : 50000104, "id5" : 50000105, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 50000100 , "title" :"aut_right_nso_email_campaign"},	
//				
//			{	"id1" : 40001001, "id2": 40001002, "id3" : 40001003, "id4" : 40001004, "id5" : 40001005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 40001000 , "title" :"aut_right_prj_test_unit"},						
//				
//			{	"id1" : 40002001, "id2": 40002002, "id3" : 40002003, "id4" : 40002004, "id5" : 40002005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 40002000 , "title" :"aut_right_prj_test_group"},
//				
//			{	"id1" : 5000001, "id2": 5000002, "id3" : 5000003, "id4" : 5000004, "id5" : 5000005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 5000000 , "title" :"aut_right_prj_news"},	
//				
//			{	"id1" : 50010001, "id2": 50010002, "id3" : 50010003, "id4" : 50010004, "id5" : 50010005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 50010000 , "title" :"aut_right_prj_news"},
				
//			{	"id1"  : 	1001, "id2": 	1002, "id3" : 	1003, "id4" : 	1004, "id5" : 	1005, 
//				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
//				"rId" : 1000 , "title" :"aut_right_sys_cfg"},	

			{	"id1" : 1000001, "id2"	: 1000002, "id3" : 1000003, "id4" : 1000004, "id5" : 1000005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" :  1000000 , "title" :"aut_right_aut_user"},
			
			{	"id1" : 30000011, "id2": 30000012, "id3" : 30000013, "id4" : 30000014, "id5" : 30000015, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 30000010 , "title" :"aut_right_department_management"},					
			
			{	"id1" : 40000001, "id2": 40000002, "id3" : 40000003, "id4" : 40000004, "id5" : 40000005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 40000000 , "title" :"aut_right_directory_of_doctors"},
				
			{	"id1" : 40000101, "id2": 40000102, "id3" : 40000103, "id4" : 40000104, "id5" : 40000105, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 40000100 , "title" :"aut_right_directory_of_patient"},
				
			// {	"id1"  : 2002001, "id2": 2002002, "id3" : 2002003, "id4" : 2002004, "id5" : 2002005, 
			// 	"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
			// 	"rId" : 2002000 , "title" :"aut_right_prj_cra"},
				
			{	"id1" : 2002011, "id2": 2002012, "id3" : 2002013, "id4" : 2002014, "id5" : 2002015, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 2002010 , "title" :"aut_right_manage_work_schedule"},
				
			{	"id1" : 2001001, "id2": 2001002, "id3" : 2001003, "id4" : 2001004, "id5" : 2001005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 2001000 , "title" :"aut_right_manage_appointment_schedules"},
			
			{	"id1" : 7000001, "id2": 7000002, "id3" : 7000003, "id4" : 7000004, "id5" : 7000005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 7000000 , "title" :"aut_right_patient_management"},
			
			{	"id1" : 50000001, "id2": 50000002, "id3" : 50000003, "id4" : 50000004, "id5" : 50000005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 50000000 , "title" :"aut_right_medication_management"},						
				
			{	"id1" : 50000101, "id2": 50000102, "id3" : 50000103, "id4" : 50000104, "id5" : 50000105, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 50000100 , "title" :"aut_right_disease_management"},	
				
			{	"id1" : 40001001, "id2": 40001002, "id3" : 40001003, "id4" : 40001004, "id5" : 40001005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 40001000 , "title" :"aut_right_medical_records"},						
				
			{	"id1" : 40002001, "id2": 40002002, "id3" : 40002003, "id4" : 40002004, "id5" : 40002005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 40002000 , "title" :"aut_right_manage_test_portfolio"},
				
			{	"id1" : 5000001, "id2": 5000002, "id3" : 5000003, "id4" : 5000004, "id5" : 5000005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 5000000 , "title" :"aut_right_manage_CDHA_portfolio"},	
				
			{	"id1" : 50010001, "id2": 50010002, "id3" : 50010003, "id4" : 50010004, "id5" : 50010005, 
				"r1"  : 0, "r2"	: 0, "r3" : 0, "r4" : 0, "r5" :0,
				"rId" : 50010000 , "title" :"aut_right_general_report"},
		]
		this.do_lc_show		= function(obj, mode){
			pr_object 	= obj;
			pr_mode		= mode;
			try {
				var arrAuth = JSON.parse(JSON.stringify(arr_auth)); //---clone arr_auth
				arrAuth 	= req_update_data(arrAuth, obj);
					
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_RIGHTS, arrAuth));
				
				do_bind_event(obj, mode);
				
				if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_NEW){
					do_gl_enable_edit($(pr_divContent), ".objData", mode);
				} else {
					do_gl_disable_edit($(pr_divContent), ".objData", mode);
				}
//				pr_prjUser.Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
				pr_prjUser.Ent.do_lc_reqRole_User();
				
				if (mode == var_lc_MODE_NEW){
					$("#div_user_rights").find(".dropdown ").hide();
					do_lc_bind_btn_role_all(true)
				}else{
					$("#div_user_rights").find(".dropdown ").show();
				}		  
				
			}catch(e) {				
				console.log(e);
			}
		};

		var do_bind_event = function(ent, mode){
			$("#btn_modify").off("click").on("click", function(){
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
				
				$("#a_btn_save_rights, #a_btn_cancel_rights").removeClass("hide");

				do_lc_bind_btn_role_all(true)
				
				$("#btn_modify").addClass("hide");
				$(".btn-resize").addClass("hide");
			})
			
			$("#a_btn_cancel_rights").off("click").on("click", function(){
				self.do_lc_show(ent, mode)
			})
			
			$("#a_btn_save_rights").off("click").on("click", function(){				
				pr_prjUser.Ent.do_lc_Save_Entity(pr_divContent, ent);
			})
			
			$(".btn-resize").off("click").on("click", function(){
				let $this 		= $(this);
				let {divtoogle} = $this.data();
				let child 		= $this.find("i");
				let label 		= $this.find(".label-resize");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle)	.toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})

			do_lc_bind_btn_role_all()
		}

		const do_lc_bind_btn_role_all = (isEditing = false) => {
			const btn_check_role_all = $(".btn_check_role_all");

			$('.cb_right').off('click')
			btn_check_role_all.off('click').removeClass("active").addClass("disabled")
			if(isEditing) {
				btn_check_role_all.each(function() {
					const rId 	= $(this).data('role')
					const lstCb = $(`.cb_${rId}:checked`)
	
					if(lstCb.length === 5) $(this).addClass("active")
				})

				$('.cb_right').on('click', function() {
					const rId 	= $(this).data('role')
					const lstCb = $(`.cb_${rId}:checked`)
	
					if(lstCb.length === 5) $(`.btn_check_role_all[data-role=${rId}]`).addClass("active")
					else $(`.btn_check_role_all[data-role=${rId}]`).removeClass("active")
				})

				btn_check_role_all.removeClass("disabled")
				btn_check_role_all.on("click", function(){				
					const rId = $(this).data('role')
	
					if($(this).hasClass("active")) {
						$(`.cb_${rId}`).prop("checked", false)
						$(this).removeClass("active")
					} else {
						$(`.cb_${rId}`).prop("checked", true)
						$(this).addClass("active")
					}
				})
			}
		}
		//---------private-----------------------------------------------------------------------------
		var req_update_data = function (arr,obj){
			if(obj.rights && obj.rights.length>0){
				let rights = obj.rights;
				for(var i = 0 ;i<rights.length;i++){
					var  index 	= rights[i]%10;
					var  rId 	= rights[i]-index;					
					
					if(rId === 100 && index === 0) continue

					if(rId === 100 && index !== 0) {
						for(var j = 0 ;j< arr.length;j++){
							arr[j][`r${index}`] = 1
						}
						continue
					}
					
					for(var j = 0 ;j< arr.length;j++){
						if(rId === arr[j].rId){							
							switch (index){
							case 1: arr[j].r1 = 1;break;
							case 2: arr[j].r2 = 1;break;
							case 3: arr[j].r3 = 1;break;
							case 4: arr[j].r4 = 1;break;
							case 5: arr[j].r5 = 1;break;
							}	
							break;
						}
					}
				}
			}
			return arr;
		}
	};
	
	return { EntContent, EntTabJobPosition, EntTabPersonInfo, EntTabRights};
	});