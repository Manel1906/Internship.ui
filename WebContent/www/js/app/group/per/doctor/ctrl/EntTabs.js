define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	
				
	var EntContent 					= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divContent 		= "#div_user_content";
		const pr_divTabPerInfo 		= "#div_user_info_person";
		const pr_divTabJobPosition	= "#div_user_position";
		const pr_divTabRights		= "#div_user_rights";
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		const pr_prjUser		    = App.controller.PrjUserClient;
		
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
			
			pr_ctr_Ent.do_lc_reqRole_User();
			
			do_lc_bind_event_content_ent(ent, mode);
			
			pr_ctr_Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
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
					
					pr_ctr_Ent.do_lc_reqRole_User();
				})
				
				$("#a_btn_save_content").off("click").on("click", function(){
					ent.files 		= ent.files ? [...ent.files].filter(Boolean) : [];
//					ent.files		= ent.files.concat(obj.files);
					pr_ctr_Ent.do_lc_Save_Entity(pr_divContent, ent);
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
	}
	
	var EntTabJobPosition = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
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
			
			pr_ctr_Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
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
	
	var EntTabInfo = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		const pr_divContent 		= "#div_user_info_person";
		
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		const pr_prjUser		    = App.controller.PrjUserClient;
		
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
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(ent, mode){               
			try{
				do_lc_show_entity(ent, mode);
			}catch(e) {				
				console.log(e);
			}
		}
		
		var do_lc_show_entity = function(ent, mode){
			
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_PERSON_INFO, ent));
			
			pr_ctr_Ent.do_lc_reqRole_User();
			
			do_lc_bind_event_content_prj(ent, mode);
			
			pr_ctr_Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
		}
		
		var do_lc_bind_event_content_prj = function(ent, mode){
			
			if(mode == var_lc_MODE_MOD || mode == var_lc_MODE_SEL){
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");
					
					$("#a_btn_save_info, #a_btn_cancel_info")	.removeClass("hide");
					
					pr_ctr_Ent.do_lc_reqRole_User();
				})
				
				$("#a_btn_save_info").off("click").on("click", function(){			
					pr_ctr_Ent.do_lc_Save_Entity(pr_divContent, ent);
				})
				
				$("#a_btn_cancel_info").off("click").on("click", function(){
					self.do_lc_show(ent, mode);
				})
			}
		}
	}
	
	return { EntContent, EntTabJobPosition, EntTabInfo};
});