define(['jquery' ], function($) {

	var JobOffEntTabDoc     = function (grpName, header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent 				= null;

		var self                    = this;

		var pr_stat_draft      		= 0;
		var pr_stat_denied      	= 3;
		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.JobOff.Main;
			pr_ctr_List 			= App.controller.JobOff.List;
			pr_ctr_Ent				= App.controller.JobOff.Ent;
		}

		this.do_lc_show		= function(obj, mode){
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_OFF_ENT_TAB_DOC, obj));//---add all files to template, then delete them in dropzone

				do_lc_bind_event_docs(obj, mode);

				App.controller.DBoard.DBoardMain.do_lc_bind_event_resize();

			}catch(e) {
				do_gl_show_Notify_Msg_Error("JobReportEntTabDoc " + e.toString());
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntTabDoc", "do_lc_show", e.toString()) ;
			}
		};


		var do_lc_bind_event_docs = function(obj, mode){
			if(mode != pr_ctr_Main.var_lc_MODE_MOD && mode != pr_ctr_Main.var_lc_MODE_NEW){
				$("#btn_add_doc").hide();
				return;
			}

			$("#btn_add_doc").show();
			$("#btn_add_doc").off("click").on("click", function(){
				$(".action-item-doc").removeClass("hide");
				$("#div_ent_file_upload").removeClass("hide");
				$(this).addClass("hide");
				$(".item-file-delete").removeClass("hide");
			});
			
			obj.files =[];
			let option		= {
					fileinput	: { 
						parallelUploads	: 10,
						uploadMultiple	: true,
						param 			: {typ01: 2, typ02: 10, filenameKept: 1},
					},//option here
					obj					: obj//show empty box
			}
			do_gl_init_fileDropzone($("#div_document"), option);

			$(".item-file-download").off("click").on("click", function(){
				let {path} = $(this).data();
				path && window.open(path, "_blank");
			})

			$(".item-file-delete").off("click").on("click", function(){
				let fileId			= $(this).data("id");	
				var lineToRemove 	= $(this).parents("tr");

				//---MsgBox
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msgbox_confirm_delete"),
					width	: "400px",
					autoclose	: false,
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_yes"),
							funct	: do_lc_del_files_obj,
							param	: [obj, fileId, lineToRemove],
							classBtn: "btn-success"
						},
						NO: {
							lab		: $.i18n("common_btn_cancel"),
							funct	: self.do_lc_clear_timeout_viewer,
							param	: [],
							classBtn: "btn-danger"
						}
					}
				});
			})

			
		}

		var do_lc_del_files_obj = function(obj, fileId, lineToRemove){
			let ref 		= req_gl_Request_Content_Send_With_Params("ServiceTpyDocument", "SVDel", {'id':fileId});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_files_obj, [obj, fileId, lineToRemove]));

			let fError 		= req_gl_funct(App, pr_ctr_Main.do_show_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterDel_files_obj = function(sharedJson, obj, fileId, lineToRemove){
			if(can_gl_AjaxSuccess(sharedJson)) {
				lineToRemove.remove();
				if (obj.files) 
					obj.files = obj.files.filter(f => f.id != fileId);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
	}
	
	return JobOffEntTabDoc;
});