define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
	
	var EntContent 					= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		
		const pr_divContent 		= "#div_user_content";
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
		
		
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 1000;
		
		var pr_lock					= null;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;
		//------------------const object------------------------------------------------------
		//-----------------------------------------------------------------------------------
		
		var pr_type_inf_common_tab    			= 0
		var pr_type_disease_hist_tab    		= 1
		var pr_type_medical_test_tab    		= 2
		var pr_type_medical_tab    				= 3
		var pr_type_test_blood_tab    			= 4
		var pr_type_test_img_tab    			= 5
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(prj, mode, typ){               
			try{
//				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
//				if (params.id){
					do_lc_show_entity(prj, mode,typ);
//				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_show_entity = function(ent, mode, typ){
			pr_ctr_Ent.do_lc_reqRole_User();
			if(typ === pr_type_inf_common_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			}else if(typ === pr_type_disease_hist_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_ROW_ADD_LST, ent));
			}else if(typ = pr_type_disease_hist_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			}else if(typ = pr_type_medical_test_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			}else if(typ = pr_type_medical_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			}else if(typ = pr_type_test_blood_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			}else if(typ = pr_type_test_img_tab){
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
			}
			
			$("#tbody_entity_info"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_ROW		, obj));
			$("#tbody_entity_lst"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_ROW_LST	, obj));
						
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
	
	
	var EntContentSub 					= function (grpName, header, content, footer) {
			var pr_grpName				= grpName;
			var tmplName				= App.template.names[pr_grpName];
			var tmplCtrl				= App.template.controller;
			var pr_ctr_List 			= App.controller[pr_grpName].List;
			var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
			
			var pr_divHeader 			= header  ? header : null;		
			var pr_divFooter 			= footer  ? footer : null;
			
			
			const pr_divContent 		= "#div_user_content";
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
			
			
			//------------------------------------------------------------------------------------
			var pr_OBJ_TYPE				= 1000;
			
			var pr_lock					= null;
			
			const var_lc_MODE_SEL       = 0;
			const var_lc_MODE_NEW       = 1;
			const var_lc_MODE_MOD       = 2;
			//------------------const object------------------------------------------------------
			//-----------------------------------------------------------------------------------
			//---------show-----------------------------------------------------------------------------
			this.do_lc_show = function(prj, mode, typ){               
				try{
	//				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
	//				if (params.id){
						do_lc_show_entity(prj, mode,typ);
	//				}
				}catch(e) {				
					console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "Ent", "do_lc_show", e.toString()) ;
				}
			};
			
			var do_lc_show_entity = function(ent, mode, typ){
				pr_ctr_Ent.do_lc_reqRole_User();
				if(typ === pr_type_inf_common_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
				}else if(typ === pr_type_disease_hist_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_ROW_ADD_LST, ent));
				}else if(typ = pr_type_disease_hist_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
				}else if(typ = pr_type_medical_test_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
				}else if(typ = pr_type_medical_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
				}else if(typ = pr_type_test_blood_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
				}else if(typ = pr_type_test_img_tab){
					$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, ent));
				}
				
				$("#tbody_entity_info"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_ROW		, obj));
				$("#tbody_entity_lst"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT_ROW_LST	, obj));
							
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
	
	return { EntContent};
});