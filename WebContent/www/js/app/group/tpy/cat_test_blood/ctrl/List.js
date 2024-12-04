define([], function() {
	const List = function (grpName, header, content, footer) {
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
		var RIGHT_A_G	        	= 102;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		var RIGHT_GET	        	= 40002001;
		var RIGHT_NEW	        	= 40002002;
		var RIGHT_MOD	        	= 40002003;
		var RIGHT_DEL	        	= 40002004;
		//-----------------------------------------------------------------------------------
		
		const pr_SERVICE_CLASS_DYN	= "ServiceTpyCategory";
		const pr_SV_LIST_DYN		= "SVLstPage"; 
		
		var   self                  = this;
		var   pr_SEARCH_KEY			= "";
		
		const pr_TYP01_ADMIN		= 2;
		
		const pr_TYP_TEST_BLOOD 	= 2000;
		
		const pr_NUMBER_RECORD		= 10;
		const pr_STAT_ACTIVE    	= 1;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show	= function(hardLoad=false){
			$("#div_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST, {}));
			
			do_get_list_ByAjax(hardLoad);
			
			do_lc_bind_event();
		}
		
		//---------load view-----------------------------------------------------------------------------
		const do_lc_bind_event = function(obj){
			$("#inp_search").off("input").on("input", function(e){
				pr_SEARCH_KEY	= $(this).val();
				do_gl_execute_debounce(do_get_list_ByAjax);
			});
			
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
			
			$("#btn_add_doc").off("click").on("click", function(){
				if(!obj)	obj = [];
				obj.files = [];
				let option		= {
						fileinput	: { parallelUploads	: 10, uploadMultiple	: true},//option here
						obj			: obj//show empty box
				}
				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("common_btn_new_file_title"),
					width	: "500px",
					autoclose	: true,
					content		: tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_DROPZONE_FILE, {}),
					buttons	: {
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
			let divList = $("#div_group_list");
			let divPan  = $("#div_group_pagination");
			
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_DYN, pr_SV_LIST_DYN, {typ01s: pr_TYP_TEST_BLOOD, searchKey: pr_SEARCH_KEY, stats : pr_STAT_ACTIVE, hardLoad, wChild: true});
			
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
					do_lc_bind_event__list_header();
					return;
				}

				for (const entity of lst) {
					try {
						entity.inf = JSON.parse(entity.inf);
					} catch (error) {}
					data.lst[entity.id] = entity;
				}

				$(divList).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_LIST_CONTENT, { "data": data.lst }));
				do_lc_bind_event_list();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		}
		//----------------------------------------------------------------------------------------------
		const do_lc_bind_event_list = function(){
			var listUserRight = App.data.user.rights;
			var isRight = listUserRight.includes(RIGHT_A_N) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_NEW)
			if (!isRight) {
				$("#btn_new_entity").hide();
			}
						
			$(".entity-item").off("click").on("click", function(){
				const $this 		= $(this);
				const {id} 			= $this.data();
				
				if(id){
					$(".entity-item")	.removeClass("active");
					$this				.addClass("active").removeClass("has-new-msg-item");
					
					pr_ctr_Ent.do_lc_show(id);
				}
			})
			
			if(App.data.user.typ01 == pr_TYP01_ADMIN || App.data.user.rights.includes(RIGHT_NEW)){
				$("#btn_new_entity"		).removeClass('hide');
				$("#btn_add_doc"		).removeClass('hide');
			}
			
			$("#btn_new_entity").off("click").on("click", function(){
				var listUserRight = App.data.user.rights;
				var isRight = listUserRight.includes(RIGHT_A_N) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_NEW)
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
					return;
				}

				pr_ctr_Ent.do_lc_show_for_new();
			});
			
			const $inputField 	= $("#inp_search");
		    const $clearIcon 	= $("#clear_icon");
		    $inputField.on("input", function() {
		        if ($inputField.val().trim() !== "") {
		            $clearIcon.removeClass("hide"); 
		        } else {
		            $clearIcon.addClass("hide");
		        }
		    });
		    $clearIcon.on("click", function() {
		        $inputField.val(""); 
		        $clearIcon.addClass("hide");
		        $inputField.focus(); 
		    });

			$("#btn_refresh_entity").off("click").on("click", function(){
				do_get_list_ByAjax(true);
				do_lc_bind_event_list();
			})

			$(".btn-resize-list").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			})
		}
		
		//----------------------------------------------------------------------------------------------
		

	}

	return List;
});