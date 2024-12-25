define([],function() {
	const EntList = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent 				= null;
		var pr_ctr_List 			= null;
		
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_R	        	= 101;
		
		
		var RIGHT_GET	        	= 30000011;
		var RIGHT_NEW	        	= 30000012;
		var RIGHT_MOD	        	= 30000013;
		var RIGHT_DEL	        	= 30000014;
		//-----------------------------------------------------------------------------------
		
		const pr_SERVICE_CLASS_GROUP_DYN	= "ServiceNsoGroup";
		const pr_SV_GROUP_LIST_DYN			= "SVLstSearch"; 
		
		const pr_SERVICE_CLASS_GROUP		= "ServiceNsoGroup";
		const pr_SV_NEW_GROUP				= "SVNewWork";
		const pr_SV_MOD_GROUP               = "SVModWork";
		const pr_SV_DEL_GROUP               = "SVDelWork";
		
		var   self                  = this;
		this.pr_member_role			= null;
		
		var pr_SEARCH_KEY			= "";
		
		const pr_TYP01_ADMIN		= 2;
		
		const pr_TYP_GROUP_WORK 	= 300;
		
		const pr_KEY_ENTER			= 13;
		const pr_NUMBER_RECORD		= 10;
		
		const pr_STAT_ACTIVE    	= 1;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
			
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(hardLoad=false){
			$("#div_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST, {}));
			
			do_get_list_ByAjax(hardLoad);
			do_lc_bind_event();
		}
		
		//---------load view-----------------------------------------------------------------------------
		//----------------------------------------------------------------------------------------------
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event = function(obj){
			var listUserRight = App.data.user.rights;
			var isRight = listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_NEW)
			if (!isRight) {
				$("#btn_new_entity"	).hide();
				$("#btn_add_doc"	).hide();
			}
			if(App.data.user.typ01 == pr_TYP01_ADMIN){
				$("#btn_new_entity"	).removeClass('hide');
				$("#btn_add_doc"	).removeClass('hide');
			}
			$("#btn_new_entity").off("click").on("click", function(){
				var listUserRight = App.data.user.rights;
				var isRight = listUserRight.includes(RIGHT_A_R) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_NEW)
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
					return;
				}
				
				pr_ctr_Ent.do_lc_show_for_new ();
			})
			
			$("#btn_refresh_entity").off("click").on("click", function(){
				do_get_list_ByAjax(true);
				do_lc_bind_event_list();
			})
			$(".btn-resize_lst").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
			$(".btn-resize-list").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
			const $inputField 	= $("#inp_search");
		    const $clearIcon 	= $("#clear_icon");
		    $inputField.on("input", function() {
		        if ($inputField.val().trim() !== "") {
		            $clearIcon.removeClass("hide"); 
		        } else {
		            $clearIcon.addClass("hide");
		        }
		        pr_SEARCH_KEY	= $inputField.val();
				do_gl_execute_debounce(do_get_list_ByAjax);
		    });
		    $clearIcon.on("click", function() {
		        $inputField.val(""); 
		        $clearIcon.addClass("hide");
		        $inputField.focus(); 
		        pr_SEARCH_KEY	= $inputField.val();
				do_gl_execute_debounce(do_get_list_ByAjax);
		    });
			$(".btn-resize").off("click").on("click", function () {
				let $this 			= $(this);
				let { divtoogle } 	= $this.data();
				let child 			= $this.find("i");
				let label 			= $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
			
			$("#btn_add_doc").off("click").on("click", function(){
				if(!obj)	obj = [];
				obj.files 		= [];
				let option		= {
						fileinput	: { parallelUploads	: 10, uploadMultiple	: true},//option here
						obj			: obj//show empty box
				}
				
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_project_new_file_title"),
					width		: "500px",
					autoclose	: true,
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_DROPZONE_FILE, {}),
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_dropzone_file,
							param	: [obj],
							classBtn: "btn-primary"
						},
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: []
						}
					}
				});
				do_gl_init_fileDropzone($("#div_dropzone_send"), option);
			})
		}
		
		var do_lc_dropzone_file = function(obj){
			obj.files 		= obj.files ? [...obj.files].filter(Boolean) : [];
			if(!obj.files)	obj.files = [];
			let	data	= req_gl_data({
				dataZoneDom		: $("#div_dropzone_send"),
				skipError		: true
			});

//			if(data.hasError)	return false;

			let newobj 		= data.data;
			
			newobj.files 	= obj.files;

			do_lc_save_files(newobj);
		}	
		
		var do_lc_save_files = function(newobj){
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceNsoGroup", "SVImport", {obj: {files: newobj.files}});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_save_files_callback, [newobj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_save_files_callback = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_get_list_ByAjax();
				do_gl_show_Notify_Msg_Success($.i18n('prj_user_group_msg_success') );
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_get_list_ByAjax = function(hardLoad=false){	
			var listUserRight = App.data.user.rights;
			var isRight = listUserRight.includes(RIGHT_A_R) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_GET)
			if (!isRight) {
				do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
				return;
			}
				
			let divList = $("#div_group_list");
			let divPan  = $("#div_group_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP_DYN, pr_SV_GROUP_LIST_DYN, {typ01: pr_TYP_GROUP_WORK, searchKey: pr_SEARCH_KEY, stat01 : pr_STAT_ACTIVE, hardLoad});
			
			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divList);
			
			const opt 				= {
					divMain			: divList,
					divPagination	: divPan,
					url_api 		: App.path.BASE_URL_API_PRIV, 
					url_header 		: App.data["HttpSecuHeader"],
					url_api_param 	: ref,
					pageSize 		: pr_NUMBER_RECORD,
					pageRange		: 1,
					callback		: callbackFunct
			};
			
			do_gl_init_pagination_opt(opt);
		}
		
		//----------------------------------------------------------------------------------------------
		
		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divList){
			const isSuccess = can_gl_AjaxSuccess(sharedJson);
			if(isSuccess) {
				const list = sharedJson[App['const'].RES_DATA] || {};
				const data = { lst: {} };
				let lst = list.lst || [];
			
				if (!lst.length) {
					$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_CONTENT, {}));
					return;
				}

				for (const ent of lst) {
					try {
						ent.val01 = JSON.parse(ent.val01);
						ent.inf01 = JSON.parse(ent.inf01);
						ent.inf02 = JSON.parse(ent.inf02);
					} catch (error) {}
					data.lst[ent.id] = ent;
				}

				$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_CONTENT, { "data": data.lst }));
				do_lc_bind_event_list();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		}
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event_list = function(){
			$(".entity-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id} 			= $this.data();
				if(id){
					$(".entity-item")	.removeClass("active");
					$this			.addClass("active").removeClass("has-new-msg-item");
					$("#div_chat")	.css("display", "block");
					
					pr_ctr_Ent.do_lc_show(id);
				}
			})
		}

		var do_lc_del_files = function(prj, fileId, lineToRemove) {
			let ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_FILES, { 'id': prj.id, 'code': prj.code01, 'fileId': fileId });

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_del_files_callback, [prj, fileId, lineToRemove]));

			let fError = req_gl_funct(App, pr_ctr_Main.do_show_Msg, [$.i18n("common_err_ajax")]);

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_del_files_callback = function(sharedJson, prj, fileId, lineToRemove) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				lineToRemove.remove();
				if (prj.files)
					prj.files = prj.files.filter(f => f.id != fileId);
			} else {
				do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_get'));
			}
		}
		//----------------------------------------------------------------------------------------------
	}

	return EntList;
});