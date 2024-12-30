define(['jquery','prjImageViewer/viewer'], function($,Viewer) {
				
	var EntContent 					= function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divContent 		= "#div_entity_content";
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		const pr_prjUser		    = App.controller.PerDoctor;
		
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
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 102;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		var RIGHT_GET	        	= 40000001;
		var RIGHT_NEW	        	= 40000002;
		var RIGHT_MOD	        	= 40000003;
		var RIGHT_DEL	        	= 40000004;
		
		//-----------------------------------------------------------------------------------
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
			var listUserRight 	= App.data.user.rights;
			var isRight 		= listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
			if (!isRight) {
				$("#btn_edit"	).hide();
			}
			if (!ent.files) ent.files = [];
			let option	= {
					parallelUploads	: 10,
		            uploadMultiple	: true,
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: ent//file existing here					
			}			
			do_gl_init_fileDropzone($(pr_divContent), option);
			
			$(".file-avatar").off("click").on("click", function() {
				const {path} = $(this).data();
				let isImage = do_lc_check_image(path);
				if(isImage){
					const viewer = new Viewer(document.getElementById('div_entity_content'), {
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
	
	
	var EntTabGroup = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_ctr_List 			= App.controller[pr_grpName].List;
		var pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divContent 		= "#div_ent_tab_group";
		
		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		
		const pr_prjUser		    = App.controller.PerDoctor;
		
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
		
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 102;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		var RIGHT_GET	        	= 40000001;
		var RIGHT_NEW	        	= 40000002;
		var RIGHT_MOD	        	= 40000003;
		var RIGHT_DEL	        	= 40000004;
		
		const pr_SERVICE_GROUP 		= "ServiceNsoGroup";
    	const pr_SV_LST 			= "SVLst";
		
    	const pr_SERVICE_PER 		= "ServicePerDoctor";
    	const pr_SV_MOD_GRP 		= "SVModWorkGroup";
    	
    	const pr_SERVICE_USER 		= "ServiceAutUser";
    	const pr_SV_GRP_WORK 		= "SVLstGrpWork";
		
		 var pr_MEM_TEMP = {};

		
		
		//---------------------------------Ajax----------------------------------------------
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(ent, mode){               
			try{
				do_lc_init_values(ent);
				do_lc_req_specialty(ent,mode);
			//	do_get_per_legalStat();
			//	do_lc_show_entity(ent, mode,id);
			}catch(e) {				
				console.log(e);
			}
		}
		const initialValues = {
		      members: {},
		      group: {},
	    };
	    const do_lc_init_values = (group) => {
  			initialValues.group = group;
  			initialValues.speci = {};
  			pr_MEM_TEMP = {};
	    };
	    
//		var do_lc_show_entity = function(ent, mode, id) {
		
//		    $(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_GROUP, initialValues.speci));
//		
//		    pr_ctr_Ent.do_lc_reqRole_User();
		
//		    do_lc_bind_event_person(initialValues.speci, mode, id);
		
//		   pr_ctr_Ent.do_lc_ShowDiv_ByMode(pr_divContent, mode);
//		};

		const do_lc_build_page = () => {
			do_lc_build_table_person();
		};
		
 		const do_lc_build_table_person = () => {
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_GROUP, initialValues.speci));
			do_lc_bind_event_person(initialValues.speci, null ,initialValues.group.id);
	    };
	    
	    const do_lc_req_specialty = function(ent, mode) {
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_USER, pr_SV_GRP_WORK, {uId: ent.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_req_entity_callback, [ent,mode]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_req_entity_callback = function(sharedJson, ent, mode){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					initialValues.speci = data
					const mem = data.reduce((acc, item) => {
					    acc[item.id] = { mem: item, uId: item.id };
					    return acc;
					}, {});
					pr_MEM_TEMP = mem
				}
				do_lc_build_page();
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
	    
	    
		var do_lc_bind_event_person = function(ent, mode,id){
			$("#btn_add_specialty").off("click").on("click", function () {
				$(".action-item-member").removeClass("hide");
				$(".btn-remove-speci").removeClass("hide");
				$(this).addClass("hide");
			});
			var listUserRight 	= App.data.user.rights;
			var isRight 		= listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
			if (!isRight) {
				$("#btn_add_specialty").hide();
			}
			$("#a_btn_save_speciality").off("click").on("click", function () {
				if (Object.keys(pr_MEM_TEMP).length === Object.keys(ent).length) {
					do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
					return;
				}
				do_lc_save_speciality(ent, id);
			});
			
			$(".btn-remove-speci").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_MEM_TEMP[memid];
				if(mem){
					delete pr_MEM_TEMP[memid];
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			})
			
			$("#a_btn_cancel_speciality").off("click").on("click", function () {
				do_lc_build_table_person();
			});
			
			$(".member-edit").off("click").on("click", function () {
				let $this = $(this);
				let { memid } = $this.data();
				let mem = pr_MEM_TEMP[memid];
				if (mem) {
				    let parentTR = $this.closest("tr");
				    parentTR.find(".content-member").addClass("hide");
				    parentTR.find(".edit-member").removeClass("hide");
				    let divLev = parentTR.find(".level-edit");
				    do_lc_bindEvent_tabMemberEdit(memid, divLev);
				    $(".action-mem").removeClass("hide");
				}
			});
			
			$(".member-delete").off("click").on("click", function () {
				let { memid } = $(this).data();
				let mem = pr_MEM_TEMP[memid];
				if (mem) {
				    delete pr_MEM_TEMP[memid];
				    $(this).closest("tr").remove();
				    $(".action-mem").removeClass("hide");
				}
			});
			
			$(".btn-resize_grp").off("click").on("click", function () {
				let $this = $(this);
				let child = $this.find("i");
				let { divtoggle } = $this.data();
				$(divtoggle).toggle("hide");
				child.toggleClass("mdi-window-minimize mdi-window-maximize");
			});
			
			let el = "#inp_name_member";
			let reqSelectMember = function (event, item) {
				if (pr_MEM_TEMP[item.id]) return false;
			
				let mem = {
				    mem: item,
				    uId: item.id,
				};
			
				pr_MEM_TEMP[item.id] = mem;
				let selOpt = `<tr>`;
				selOpt += `<td><a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></td>`;
				selOpt += `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${item.name}</a></h5></td>`;
				selOpt += `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				do_lc_bind_event_autocomplete(pr_MEM_TEMP);
				$(el).blur().val("");
			};
			
			var pr_TYP_01_WORK = 300;
			let options = {
				dataService	: [pr_SERVICE_GROUP, pr_SV_LST],
				svParams	: { wAvatar: true, nbline: 10, stat01: 1, typ01: pr_TYP_01_WORK },
			   	hintService	: [pr_SERVICE_GROUP, pr_SV_LST],
			   	hintSvParams: {  wAvatar: true, nbline: 10, stat01: 1, typ01: pr_TYP_01_WORK  },
				fSelect: reqSelectMember,
				customShowList: do_lc_customLst_user_autocomplete,
			};
			do_gl_req_autocompleteNew(el, options);
			
		    
			var do_lc_bind_event_autocomplete = function (pr_MEM_TEMP) {
				$(".btn-remove-member").off("click").on("click", function () {
					let $this = $(this);
				    let parentTR = $this.closest("tr");
					let { id } = $this.data();
			
					if (pr_MEM_TEMP[id]) delete pr_MEM_TEMP[id];
					parentTR.remove();
			  });
			};
			
			
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
		
		const do_lc_save_speciality = function (ent, idPer) {
			var ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_PER, pr_SV_MOD_GRP,
	        	{
	          		userId: idPer,
	          		grps: JSON.stringify(Object.values(pr_MEM_TEMP)),
	        	}
	      	);
	
			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_speciality, [ent, idPer]));
	
			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"),]);
	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"],ref,100000,fSucces,fError);
	    };
		
	    const do_lc_afterSave_speciality = function (sharedJson, ent, idGroup) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				initialValues.speci = Object.values(pr_MEM_TEMP).map(item => item.mem);
				do_lc_build_page();
				do_gl_show_Notify_Msg_Success($.i18n("common_success_update"));
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
	    };
					
		const do_lc_customLst_user_autocomplete = function (item, selOpt = "") {
			selOpt += `<div class="media align-items-center"> ${item.name}</div>`;
		    return selOpt;
		};
	}
	
	var EntTabDoc = function (grpName, header, content, footer) {
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		const pr_divContent			= "#div_ent_tab_doc";
		
		this.do_lc_show = function(ent){               
			ent.files = ent.files?.filter(e => e.typ01 === 2 && e.typ02 === 10) || [];
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_TAB_FILE, ent));
			$(".item-file-download").off("click").on("click", function(){
				let {path}				= $(this).data();
				path && window.open(path, "_blank");
			})
		}	
	}
	
	return { EntContent, EntTabGroup, EntTabDoc};
	});