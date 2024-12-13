define([], function() {
	const Ent = function (grpName, header, content, footer) {
			var pr_divHeader 			= header;
			var pr_divContent 			= content;
			var pr_divFooter 			= footer;
			
			//------------------------------------------------------------------------------------
			var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
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
			
			var RIGHT_GET	        	= 50000001;
			var RIGHT_NEW	        	= 50000002;
			var RIGHT_MOD	        	= 50000003;
			var RIGHT_DEL	        	= 50000004;

			//-----------------------------------------------------------------------------------
			
			const pr_SERVICE_CLASS		= "ServiceMatMaterial";
			const pr_SV_NEW				= "SVNew";
			const pr_SV_MOD             = "SVMod";
			const pr_SV_GET             = "SVGet";
			const pr_SV_DEL_GROUP       = "SVDel";

			
			var   self                  = this;
			
			
			const pr_TYP_DISEASE_SUB	= 400;
			const pr_STAT_ACTIVE    	= 1;
			
			var pr_DISEASE_TEMP			= {};
			
			//--------------------APIs--------------------------------------//
			this.do_lc_init		= function(){
				pr_ctr_Main 			= App.controller.UI.Main;
				pr_ctr_List 			= App.controller[pr_grpName].List;
				pr_ctr_Ent 				= App.controller[pr_grpName].Ent;
			}

			//---------show-----------------------------------------------------------------------------
			this.do_lc_show	= function(id){
				do_lc_get_info_entity(id);
			}
			
			this.do_lc_show_for_new	= function(){
				$("#div_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_NEW, {}));

				App.SummerNoteController.do_lc_show("#div_show_desc");//text editor 
				App.SummerNoteController.do_lc_show("#div_show_effect");//text editor
				App.SummerNoteController.do_lc_show("#div_show_assign");//text editor
				App.SummerNoteController.do_lc_show("#div_show_infor");//text editor
				
				
				do_lc_bind_event_new_entity(obj = {files: []});
			}
			
			this.do_lc_save = function(obj) {
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});
	
				if (data.hasError) return false;
	
				if (obj.files) {
					data.data.files = obj.files;
				}
				let dataMed = data.data;
				dataMed.dt03 = do_lc_convert_date(dataMed.dt03).replace("T", " ");
			    const date03 = req_gl_DateObj_From_DateStr(dataMed.dt03);
			    dataMed.dt03 = formatDateToLocalString(date03);
				do_lc_new_entity(dataMed);
			}
			
			this.do_lc_mod = function(obj) {
				const data = req_gl_data({
					dataZoneDom: $("#frm_new_group")
				});
	
				if (data.hasError) return false;
	
				if (obj.files) {
					data.data.files = obj.files;
				}
				data.data.id = obj.id;
				let dataMed = data.data;
				dataMed.dt03 = do_lc_convert_date(dataMed.dt03).replace("T", " ");
			    const date03 = req_gl_DateObj_From_DateStr(dataMed.dt03);
			    dataMed.dt03 = formatDateToLocalString(date03);
				do_lc_update_entity(dataMed);
			}
	
			this.do_lc_cancel = function() {
				pr_ctr_Main.do_lc_show();
			}
			const do_lc_convert_date = (objDate) => {
				if (objDate.time.length < 5) objDate.time = "0" + objDate.time;
				return objDate.date.substr(0, 10) + "T" + objDate.time.substr(0, 5) + ":00";
			}
			function formatDateToLocalString(date) {
			    const year = date.getFullYear();
			    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tháng phải cộng 1
			    const day = ('0' + date.getDate()).slice(-2);
			    const hours = ('0' + date.getHours()).slice(-2);
			    const minutes = ('0' + date.getMinutes()).slice(-2);
			    const seconds = ('0' + date.getSeconds()).slice(-2);
			    
			    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			}

			//-----------------get group-------------------------------------------------------------------------
			const do_lc_get_info_entity = (id) => {
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id: id, wChild: true});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_get_info_entity_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			
			const do_lc_get_info_entity_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						do_lc_show_entity(data);
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
						
			//----------------------------------------------------------------------------------------------
			const do_lc_show_entity = (data) => {
				if(data.files && data.files[0].url){
					data.fileUrl = data.files[0].url
				}
				if(data.inf03 && typeof data.inf03 == "string"){
					data.inf03 = JSON.parse(data.inf03);
				}
				

				$("#div_ent"		).html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT		, data));
				
				$(".info-edit"		).removeClass	('hide');
				$(".inf-entity"		).addClass		('hide');
				
				do_bind_event_show_entity(data);
			}
			
			//-----------------get group-------------------------------------------------------------------------
			const do_bind_event_show_entity = function(data){
				var listUserRight 	= App.data.user.rights;
				var isRight = listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
				if (!isRight) {
					$("#btn_edit").hide();
				}
				isRight = listUserRight.includes(RIGHT_A_D) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_DEL)
				if (!isRight) {
					$("#btn_del").hide();
				}
				isRight = listUserRight.includes(RIGHT_A_D) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_DEL) || listUserRight.includes(RIGHT_MOD)
				if (!isRight) {
					$(".dropdown-toggle").hide();
				}
							
				if(!data.files)	data.files = [];
				if(data.avatar) data.files.push(data.avatar);
				let option		= {
						fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
						obj			: data//file existing here
				}
				do_gl_init_fileDropzone($("#frm_dropzone_send"), option);

				
				$(".item-file-download").off("click").on("click", function(){
					let {path} = $(this).data();
					path && window.open(path, "_blank");
				})
				
				$("#btn_modify").off("click").on("click", function(){
					
					do_lc_get_entity_sub(data);
				})
				
				
				$("#a_btn_sav").off("click").on("click", function(){
								
					let parentID = data.id;
					
					let myObject = {};
					
					let	obj	 				= req_gl_data({
						dataZoneDom		: $("#tab_detail"),
						oldObject 		: myObject,
					});
					console.log(obj)
					if(obj.hasError)	return false;
					const rows = $('#tbody_entity').find('tr');
					const dataArray = [];
					
					
					for (let i = 0; i < rows.length; i++) {
					    const row = rows[i];
					    const inputs = $(row).find('input.inf-entity, select.inf-entity');
					    const dataObject = {};
					
					    inputs.each(function() {
					        const input = $(this);
					        const key = input.data('name');
					        let value = input.val();
					       	value = value.replace(/,/g, '');
					        dataObject[key] = value;
					    });
					    
						dataObject['stat' ] = pr_STAT_ACTIVE;
						dataObject['typ01'] = pr_TYP_DISEASE_SUB;
						dataObject['parId'] = parentID;
					    dataArray.push(dataObject); 
					}
									
					myObject['parId'] = parentID;
					myObject['lst'] = dataArray;
					const codes = obj.data.lst.map(item => item.code.trim()); // Lấy danh sách code (bỏ khoảng trắng nếu có)
					const hasDuplicate = codes.some((code, index) => codes.indexOf(code) !== index); // Kiểm tra trùng lặp
					
					if (hasDuplicate) {
					    do_gl_show_Notify_Msg_Error($.i18n("disease_cant_duplicate")); // Hiển thị lỗi nếu trùng lặp
					    return;
					}

					do_lc_save_entity_sub(myObject, dataArray);
				})
				
				$('#addRowBtn').on('click', function() {
					do_lc_bind_event_new_row_table(data);
			    });
				
				$("#a_btn_save").off("click").on("click", function(){
					data.files 	= data.files ? [...data.files].filter(Boolean) : [];
					
					let	obj	 				= req_gl_data({
						dataZoneDom		: $("#div_ent"),
						oldObject 		: data,
					});

					if(obj.hasError)	return false;

					let newGroup 			= obj.data;

					newGroup =  Object.assign(data, newGroup);
					
					newGroup.val01 = { img: newGroup.files.length > 0 ? decodeURIComponent(newGroup.files[0].path01) : null}; 
					
					let dataMed = data.data;
					dataMed.dt03 = do_lc_convert_date(dataMed.dt03).replace("T", " ");
				    const date03 = req_gl_DateObj_From_DateStr(dataMed.dt03);
				    dataMed.dt03 = formatDateToLocalString(date03);
					do_lc_update_chat_entity(dataMed);

				})
				
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}
				})
				
				$("#a_btn_cancel").off("click").on("click", function(){
					do_lc_show_info_entity(data);
				})
				
				$("#btn_add_avatar").off("click").on("click", function(){
					$("#frm_dropzone_send").removeClass("hide");
					$(this).addClass("hide");
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				})
				
				$("#btn_edit").off("click").on("click", function(){
					var group = [];
					group = $(this).data();
					do_lc_edit_entity(group);
					
				})
				
				$("#btn_del").off("click").on("click", function(){
					let {id} = $(this).data();
					App.MsgboxController.do_lc_show({
						title		: $.i18n("common_title_confirm"),
						content 	: $.i18n("msg_del_entity_popup_content"),
						autoclose	: false,
						css			: {
							"max-width":"450px"
						},
						buttons		: {
							NO: {
								lab		:  $.i18n("common_btn_can"),
							},
							OK: {
								lab			: $.i18n("common_btn_delete"),
								funct		: do_lc_del_entity,
								param		: [id],
								classBtn	: "btn-danger"
							}
						}
					});
				})
				
				$(".btn-resize-content").off("click").on("click", function () {
					let $this = $(this);
					let { divtoogle } = $this.data();
					let child = $this.find("i");
					let label = $this.find(".label-resize");
					child.toggleClass("mdi-window-minimize mdi-window-maximize")
					$(divtoogle).toggle("hide");

					label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
				})
				$(".btn-resize-content_ds").off("click").on("click", function () {
					let $this = $(this);
					let { divtoogle } = $this.data();
					let child = $this.find("i");
					let label = $this.find(".label-resize");
					child.toggleClass("mdi-window-minimize mdi-window-maximize")
					$(divtoogle).toggle("hide");

					label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
				})
			}
			
			const do_lc_bind_event_new_row_table = function() {
			    $("#a_btn_sav, #a_btn_canc")	.removeClass("hide");
			};
			
			const do_lc_get_entity_sub = (data) => {
						
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id: data.id});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_get_entity_sub_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			
			const do_lc_get_entity_sub_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						pr_DISEASE_TEMP = data
						$("#btn_modify").addClass("hide");
						$("#a_btn_sav").removeClass("hide");
						$("#a_btn_canc").removeClass("hide");
						$('#addRowBtn').removeClass('hide');
						$('#removeRowBtn').removeClass('hide');
						$(".info-edit").addClass('hide');
						$(".btn-resize-content_ds").addClass('hide');
						
						$('#removeRowBtn button').on('click', function() {
							$(this).closest('tr').remove();
						});
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
			
			const do_lc_save_entity_sub = function(myObject, dataArray){
				const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_SUB, {obj: myObject});
				
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_save_entity_sub_callback, {}));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
			}
			
			const do_lc_save_entity_sub_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					let data 	= sharedJson[App['const'].RES_DATA];
					
	//				$('.inf-entity').addClass('hide');
					$(".inf-entity").addClass('hide');
					$("#btn_modify").removeClass("hide");
					$("#a_btn_sav").addClass("hide");
					$("#a_btn_canc").addClass("hide");
					$("#addRowBtn").addClass("hide");
					
					$('#removeRowBtn button').on('click', function() {
						$(this).closest('tr').remove();
					});
									
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
				}
			}
			
			//-----------------edit group-------------------------------------------------------------------------
			const do_lc_edit_entity = (group) => {
							
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET, {id: group.id});	
		
				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_edit_entity_callback, [group.id]));
		
				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
		
				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			
			const do_lc_edit_entity_callback = function(sharedJson, id){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						if(data.inf03 && typeof data.inf03 == "string"){
							data.inf03 = JSON.parse(data.inf03);
						}
						var listUserRight = App.data.user.rights;
						var isRight = listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
						if(!isRight){
							do_gl_show_Notify_Msg_Error($.i18n("job_off_msg_cant_create"));
							return;
						}
						data.edit 	   = true

						$("#div_ent").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_NEW, data));
						if (data.dt03 && typeof data.dt03 === "string") {
						    const [date, time] = data.dt03.split(" ");
						    data.dt03 = { date, time };
						}
						const { date, time } = data.dt03 || {};
						if (date) {
						    const [year, month, day] = date.split("-");
						    $("#dtpicker_exp").datepicker("setDate", `${day}/${month}/${year}`);
						}
						if (time) {
						    $("#tmpicker_exp").timepicker({
						        showMeridian: false,
						        defaultTime: time,
						        icons: {
						            up: "mdi mdi-chevron-up",
						            down: "mdi mdi-chevron-down"
						        }
						    });
						}
						App.SummerNoteController.do_lc_show("#div_show_desc");//text editor 
						App.SummerNoteController.do_lc_show("#div_show_effect");//text editor
						App.SummerNoteController.do_lc_show("#div_show_assign");//text editor
						App.SummerNoteController.do_lc_show("#div_show_infor");//text editor
						
						do_lc_showMod_FileUploader(data);
						do_lc_bind_event_mod_entity(data, id);
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
			
			const do_lc_showMod_FileUploader = function (data) {
				if (!data.files) {
					data.files = [];
				}	
				
				let option	= {
						obj : data,
						fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
				}			
				do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
								
				let option2	= {
						obj : data,
						fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
				}			
				do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
			}
			
			const do_lc_bind_event_mod_entity = function(obj){
				$("#btn_create_entity").off("click").on("click", function(){
					
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_save"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_can"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_save_med"),
								funct	: self.do_lc_mod,
								param	: [obj],
								classBtn: "btn-primary"
							}
						}
					});
				})
				
				$("#btn_cancel_entity").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_save_cancel"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_yes"),
								funct	: self.do_lc_cancel,
								param	: [obj],
								classBtn: "btn-danger"
							}
						}
					});
				})
				
				$("#cancel_header").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_yes"),
								funct	: self.do_lc_cancel,
								param	: [obj],
								classBtn: "btn-danger"
							}
						}
					});
				})
				let option	= {
					obj : obj,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
				}			
				do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
								
				let option2	= {
						obj : obj,
						fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
				}			
				do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
			}
			
			//-----------------update group-------------------------------------------------------------------------
			const do_lc_update_entity = function(ent) {
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD, {obj: JSON.stringify(ent)});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_update_entity_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			const do_lc_update_entity_callback = function(sharedJson, group){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
						do_lc_show_entity(data);
						pr_ctr_List.do_lc_show(true);
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}
			
			//------------------------------------------------------------------------------------------------
			const do_lc_del_entity = function(groupId){
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, "SVDel", {id : groupId});	

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_del_entity_callback, []));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
				App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			const do_lc_del_entity_callback = function(sharedJson){
				if(can_gl_AjaxSuccess(sharedJson)) {
					$("#div_ent").html("");
					pr_ctr_List.do_lc_show(true);
				}else{
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				}
			}
			
			//------------------------------------------------------------------------------------------------
			//----------------------------------------------------------------------------------------------
			const do_lc_bind_event_new_entity = function(obj){
				$("#btn_create_entity").off("click").on("click", function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_creat"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_can"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_save_med"),
								funct	: self.do_lc_save,
								param	: [obj],
								classBtn: "btn-primary"
							}
						}
					});
				})
				
				$("#btn_cancel_entity").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_yes"),
								funct	: self.do_lc_cancel,
								param	: [],
								classBtn: "btn-danger"
							}
						}
					});
				})
				
				$("#cancel_header").off("click").on("click",function(){
					//---MsgBox
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_cancel_create"),
						width	: "400px",
						autoclose	: false,
						buttons	: {
							NO: {
								lab		: $.i18n("common_btn_cancel"),
								funct	: null,
								param	: [],
							},
							OK: {
								lab		: $.i18n("common_btn_yes"),
								funct	: self.do_lc_cancel,
								param	: [],
								classBtn: "btn-danger"
							}
						}
					});
				})
				let option	= {
					obj : obj,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here for avatar
				}			
				do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
								
				let option2	= {
						obj : obj,
						fileinput		: {param : {typ01: 2, typ02: 10} },//option here for files
				}			
				do_gl_init_fileDropzone($("#frm_dropzone_send_file"), option2);
			}
			
			
			//-----------------new group-------------------------------------------------------------------------
			const do_lc_new_entity = function(group){
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, {obj: group});

				let fSucces		= [];
				fSucces.push(req_gl_funct(null, do_lc_new_entity_callback, [group]));

				let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}
			
			const do_lc_new_entity_callback = function(sharedJson, group){
				if(can_gl_AjaxSuccess(sharedJson)) {
					const data = sharedJson[App['const'].RES_DATA];
					if(data){
						do_lc_show_entity(data);
						pr_ctr_List.do_lc_show(true); // hard Reload list group
					}
				} else {   
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
				}
			}

		}

		return Ent;
});