define(['jquery'],
        function($) {



var JobReportEntTabReportDetail     = function (grpName,header, content, footer) {
	var pr_divHeader 			= header;
	var pr_divContent 			= content;
	var pr_divFooter 			= footer;

	//------------------------------------------------------------------------------------
	var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
	var tmplName				= App.template.names[pr_grpName];
	var tmplCtrl				= App.template.controller;
	
	//------------------controllers------------------------------------------------------
	var pr_ctr_Main 			= null;
	var pr_ctr_List 			= null;
	var pr_ctr_Ent 			    = null;
	
	const pr_custom_paths	= {
		"css"	: [
			"www/css/prj/_responsive.css"
		]
	};
	
	
	var pr_default_new_line	= {"id" : -1, "catId01" : 0};

	var pr_default_new_line_resume	= {"id" : -1, "day" : null, "cmt": ""};
	var pr_divContent_resume = "#div_Job_Report_Ent_Tab_Report_Resume";
	
	var pr_stat_draft      		= 0;
	var pr_stat_pending      	= 1;
	var pr_stat_validated     	= 2;
	
	//-----------------------------------------------------------------------------------
	var pr_object				= null;
	var pr_mode					= null;
	var pr_stat					= null;
	var self 					= this;
	//--------------------APIs--------------------------------------//
	this.do_lc_init		= function(){
		pr_ctr_Main 			= App.controller.JobReport.Main;
		pr_ctr_List 			= App.controller.JobReport.List;
		pr_ctr_Ent				= App.controller.JobReport.Ent;
	}
	
	this.do_lc_show		= function(obj, mode){
		App.controller.DBoard.DBoardMain.do_lc_bind_event_resize();
		App.router.controller.do_lc_append_custom_tags(pr_custom_paths);
		if(obj.lstRp && App.data.lstCat){
			for(var i = 0; i < obj.lstRp.length; i++){
				for(var j = 0; j < App.data.lstCat.length; j++){
					if(obj.lstRp[i].catId01 == App.data.lstCat[j].catId01){
						obj.lstRp[i].catId01_Select = App.data.lstCat[j].catId01_Select;
					}
				}
			}
		}
		do_build_report_detail(obj, mode);
	}

	this.do_lc_Save_Entity_Duplicate = function(mode, ent, oldObj) {
		if (!oldObj.lstRpResume) oldObj.lstRpResume = [];
		
		oldObj.lstRpResume.forEach((e, i) => {
			if (e.day == ent.day) {
				oldObj.lstRpResume[i] = ent;
			}
		});
		App.MsgboxController.do_lc_close();
		do_init_detail_table_resume(oldObj, mode);
	}
	
	this.do_lc_Save_Entity_Replace = function(mode, ent, oldObj, currentObj) {
		
		oldObj.lstRpResume = oldObj.lstRpResume.filter(function(rp) { 
			return rp.day != currentObj.day && rp.day != ent.day; 
			});
		oldObj.lstRpResume.push(ent);
		
		App.MsgboxController.do_lc_close();
		do_init_detail_table_resume(oldObj, mode);
	}

	this.do_lc_Save_Entity = function(div, mode, oldObj, currentObj, add) {
		var ent 			= req_gl_data({
			dataZoneDom		: $(div),
			skipError		: true
		});
		if (ent.data.lstRpResume)
			ent.data.lstRpResume.day = parseInt(ent.data.lstRpResume.day);
		
		if (add) {
			if (checkDayExist(ent.data.lstRpResume, oldObj.lstRpResume)) {
				App.MsgboxController.do_lc_close();
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_job_report_detail_resume_title"),
					content 	: $.i18n("prj_job_report_detail_resume_msg"),
					autoclose	: true,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: self.do_lc_Save_Entity_Duplicate,
							param	: [mode, ent.data.lstRpResume, oldObj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
				});	
			} else {
				oldObj.lstRpResume.push(ent.data.lstRpResume);
				App.MsgboxController.do_lc_close();
//					self.do_lc_show(oldObj, mode);
				do_init_detail_table_resume(oldObj, mode)
			}
		} else {
			App.MsgboxController.do_lc_close();
			let objMod = oldObj.lstRpResume.find(rp => rp.day == ent.data.lstRpResume.day);
			if(objMod != null){
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_job_report_detail_resume_title"),
					content 	: $.i18n("prj_job_report_detail_resume_msg"),
					autoclose	: true,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: self.do_lc_Save_Entity_Replace,
							param	: [mode, ent.data.lstRpResume, oldObj, currentObj],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
				});	
			}else{
				oldObj.lstRpResume = oldObj.lstRpResume.filter(function(rp) { 
					return rp.day != currentObj.day; 
					});
				oldObj.lstRpResume.push(ent.data.lstRpResume);
			}
			
//				self.do_lc_show(oldObj, mode);
			do_init_detail_table_resume(oldObj, mode)
		}
	}

	function checkDayExist(lstRpResume, lst) {
		if (lst) {
			for (let i = 0; i < lst.length; i++) {
				let e = lst[i];
				if (e.day == lstRpResume.day) {
					
					return true;
				}
			};
		}
		return false;
	}

	function do_build_report_detail(obj, mode){
		try{
			if(App.data.monthData == null){
				setTimeout(function(){ do_build_report_detail(obj, mode); }, 500);
				return;
			}
		
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_ENT_TAB_REPORT_DETAIL, App.data.monthData));
			
			pr_object 	= obj;
			pr_mode		= mode;
			pr_stat		= obj.stat;
			do_init_detail_table_resume(obj, mode);
			do_init_detail_table(obj, mode);
		} catch(e) {
			do_gl_show_Notify_Msg_Error("JobReport: EntTabReportDetail :" + e.toString());
			console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "job.report", "JobReportEntTabGeneral", "do_lc_show", e.toString()) ;
		}
	}

	function do_init_detail_table_resume(obj, mode){
		var pr_lst_resume			= null;
		if (obj.lstRpResume == null || obj.lstRpResume == undefined) {
			obj.lstRpResume = [];
		}
		else	pr_lst_resume = obj.lstRpResume;
		
		$(pr_divContent_resume).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME, obj.lstRpResume));

		if(obj.stat != pr_stat_draft){
			$("#div_prj_observation_tab_body").find(".action-item-observ").hide();
			$("#btn_add_obs").attr('disabled', 'disabled');
		}

		if (mode == pr_ctr_Main.var_lc_MODE_MOD || mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_SEL) {
			$(".observ-delete").off("click").on("click", function(){
				let {index} = $(this).data();
				let mem 	= pr_lst_resume[index];
				if(mem){
					pr_lst_resume.splice(index, 1);
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			})

			$(".observ-edit").off("click").on("click", function(){
				let {index} = $(this).data();
				let mem 	= pr_lst_resume[index];
				if(mem){
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_job_report_detail_resume_title"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME_LINE, mem),
						autoclose	: true,
						buttons		: {
							OK: {
								lab		: $.i18n("common_btn_save"),
								funct	: self.do_lc_Save_Entity,
								param	: ["#div_prj_partner_observ", mode, obj, mem, false],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						},
						bindEvent	: function() {
							do_gl_select_value($("#select_resume_day"), mem.day);
						}
					});	
					App.SummerNoteController.do_lc_show("#div_prj_partner_observ", {dialogsInBody: true});
				}
			})

			$("#btn_add_obs").off("click").on("click", function(){
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_job_report_detail_resume_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.JOBREPORT_END_TAB_REPORT_RESUME_LINE, {}),
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: self.do_lc_Save_Entity,
							param	: ["#div_prj_partner_observ", mode, obj, null, true],
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					},
					bindEvent	: function() {
					}
				});	
				App.SummerNoteController.do_lc_show("#div_prj_partner_observ", {dialogsInBody: true});
			})

			$(".content-observ-textarea").off("click").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".level-content")	.addClass("hide");
				$parent.find(".edit-observ")	.removeClass("hide");
				
				let sel = JSON.stringify($parent.find(".level-content").html());
				
				$parent		.find("option[value="+ sel	+"]")	.attr("selected","selected");
				
				$(".action-item-obs").removeClass("hide");
				$("#btn_add_obs").addClass("hide");
				
				$(".action-delete").show();
			})
			
			$("#a_btn_save_obs").off("click").on("click", function(){
				self.do_lc_Save_Entity(pr_divContent_resume, mode, obj);
			})
			
			$("#a_btn_cancel_obs").off("click").on("click", function(){
				self.do_lc_show(obj, mode);
			})
			$(".btn-resize").off("click").on("click", function () {
				let $this = $(this);
				let { divtoogle } = $this.data();
				let child = $this.find("i");
				let label = $this.find(".label-resize");
				child.toggleClass("mdi-window-minimize mdi-window-maximize")
				$(divtoogle).toggle("hide");

				label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
			});
		} else {
			$("#btn_add_obs").prop("disabled", true);
		}

	}

	function do_lc_bind_event_resume(){
		if(pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_SEL) {
			do_gl_enable_edit($("#div_MatMaterial_Ent_Tab_Detail"));
		}
		if(pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_SEL){
			// do_update_all_col_value();
		}
		
		$("#table_report_resume > tfoot > tr > td").removeClass("editable");
	}
	
	function do_init_detail_table(obj, mode){
		if(mode == pr_ctr_Main.var_lc_MODE_NEW){
			$("#inp_val01").val(App.data.workingDay);
		}
		obj.lstRpResume.sort((a, b) => {
			return a.day - b.day;
		});
		
		var pr_stat_pending      	= 1;
		var pr_stat_validated     	= 2;
		
		
		var cell = function(nTd, sData, oData,iRow, iCol) {
			$(nTd).removeClass("editable").addClass(App.data.monthData[iCol - 1].d_weekday);
			$(nTd).off("click");
			var weekday = App.data.monthData[iCol - 1].d_weekday;
			if(weekday != "HLD"){
				if(pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_SEL){
					if(!sData){
						$(nTd).html("0");
					}
					
					$(nTd).on("click", function(){
						var oriValue 	= parseFloat($(this).html());		
						var newValue 	= oriValue - 0.25;
						if (newValue < 0) newValue = 1;
						$(this).html(newValue);
							
						var oriRowTotal = $(this).parent().find(".total");
						var oriRowVal = parseFloat(oriRowTotal.html());
						oriRowTotal.html(oriRowVal - oriValue + newValue);
							
						do_update_col_value(iCol);
						do_update_dayoff_info();
						
								
					});
				}
			} else {
				$(nTd).html("");
			}
		}
		
		
		if (obj.stat==pr_stat_pending||obj.stat==pr_stat_validated){
			 cell = function(nTd, sData, oData,iRow, iCol) {}; //--remove event
		}
		
		var additionalConfig = {
				"catId01_Select" : { 
					fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
						var line = $(nTd).parent();
						line.attr("data-catId", oData.catId01);
						line.addClass("cra");
						if(oData.catId01 < 0){
							line.addClass("dayoff");
						} else {
							line.addClass("project");
						}
						
						let optionCats = {
								el				: $(nTd), 
								required		: true,
								dataZone		: line,
								minLength		: 0, 
								renderAttrLst	: ["catId01_Select"], 
								source			: function(request, response) {
									do_update_lst_cat(request, response);
								},
								selectCallback	: function(e) {
									oData.catId01 = e.catId01;
									line.attr("data-catId", oData.catId01);
									if(oData.catId01 < 0){
										line.addClass("dayoff");
										line.removeClass("project");
									} else {
										line.removeClass("dayoff");
										line.addClass("project");
									}
									do_update_dayoff_info();
								},
						}
						do_gl_autocomplete_new(optionCats);
						
						if(pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_SEL) {
							$(nTd).attr("contenteditable",true);
						}
				}},
				
				"q01" : { fnCreatedCell: cell},"q02" : { fnCreatedCell: cell},"q03" : { fnCreatedCell: cell},
				"q04" : { fnCreatedCell: cell},"q05" : { fnCreatedCell: cell},"q06" : { fnCreatedCell: cell},
				"q07" : { fnCreatedCell: cell},"q08" : { fnCreatedCell: cell},"q09" : { fnCreatedCell: cell},
				"q10" : { fnCreatedCell: cell},"q11" : { fnCreatedCell: cell},"q12" : { fnCreatedCell: cell},
				"q13" : { fnCreatedCell: cell},"q14" : { fnCreatedCell: cell},"q15" : { fnCreatedCell: cell},
				"q16" : { fnCreatedCell: cell},"q17" : { fnCreatedCell: cell},"q18" : { fnCreatedCell: cell},
				"q19" : { fnCreatedCell: cell},"q20" : { fnCreatedCell: cell},"q21" : { fnCreatedCell: cell},
				"q22" : { fnCreatedCell: cell},"q23" : { fnCreatedCell: cell},"q24" : { fnCreatedCell: cell},
				"q25" : { fnCreatedCell: cell},"q26" : { fnCreatedCell: cell},"q27" : { fnCreatedCell: cell},
				"q28" : { fnCreatedCell: cell},"q29" : { fnCreatedCell: cell},"q30" : { fnCreatedCell: cell},
				"q31" : { fnCreatedCell: cell},
				"row_action" : { 
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol){
						$(nTd).html(tmplCtrl.req_lc_compile_tmpl(tmplName.JOB_REPORT_DETAIL_ACTION, {}));
						if(pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_SEL) {
							$(nTd).find(".a_delete").on("click", function() {
								var table = $(this).parents("table").DataTable();
								var row = table.row( $(this).parents('tr') )
								row.remove().draw();
								do_update_all_col_value();
								do_update_dayoff_info();
							});
						}
				}},
				"total" : { fnCreatedCell: function(nTd, sData, oData,iRow, iCol){
					$(nTd).removeClass("editable");
					var totalRow = do_calcul_total_row(oData);
					$(nTd).html(totalRow);
				}}
		};
		req_gl_create_datatable(obj, "#table_report_detail", additionalConfig, pr_default_new_line, do_lc_bind_event);
		
	}
	
	function do_lc_bind_event(){
		if(pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_NEW || pr_mode == pr_ctr_Main.var_lc_MODE_SEL) {
			var maxiRow = App.data.lstCat.length;
			var row = $("#table_report_detail > tbody > tr.cra");
			if(row.length == maxiRow){
				$("#btn_add").prop("disabled", true);
			} else {
				$(".action").prop("disabled", false);
				if(pr_stat == pr_stat_draft){
					$("#btn_add").prop("disabled", false);
				}
				else{
					$("#btn_add").prop("disabled", true);
				}
				$("#btn_add").on("click", function(){
					do_lc_bind_event();
				});
			}
		}
		if(pr_mode == pr_ctr_Main.var_lc_MODE_MOD || pr_mode == pr_ctr_Main.var_lc_MODE_SEL){
			do_update_all_col_value();
		}
		
		$("#table_report_detail > tfoot > tr > td").removeClass("editable");
	}
	
	function do_update_all_col_value(){
		for(var i = 1; i < App.data.monthData.length + 1; i++){
			do_update_col_value(i);
		}
	}
	
	function do_update_col_value(iCol){
		var valueTotalCol = 0;
		var row = $("#table_report_detail > tbody > tr.cra");
		if(row.length > 0){
			for(var i = 0; i < row.length; i++){
				var cell = row[i].cells[iCol];
				try{
					valueTotalCol += parseFloat(cell.innerHTML);
				} catch(e) {}
			}
		}
		
		$("#table_report_detail tfoot").find("td:eq(" + iCol + ")").html(valueTotalCol);
		if(valueTotalCol > 1){
			$("#table_report_detail tfoot").find("td:eq(" + iCol + ")").removeClass("valid").addClass("notValid").css("background-color", "#e51414").css("color", "white");
			do_gl_show_Notify_Msg_Error ($.i18n('common_err_total'));
			$("#btn_JobReport_save").addClass("hide");
		} else {
			$("#table_report_detail tfoot").find("td:eq(" + iCol + ")").removeClass("notValid").addClass("valid").css("background-color", "white").css("color", "black");
			$("#btn_JobReport_save").removeClass("hide");
		}
	}
	
	function do_update_dayoff_info(){
//			var hldRate = parseFloat($("#inp_hldrate").val());
		
		var totalWork	= 0;
		var dayOffGet   = 0;
		
		var tdW = $("#table_report_detail > tbody > tr > td.total");
		if(tdW.length > 0){
			for(var i = 0; i < tdW.length; i++){
				totalWork += parseFloat(tdW[i].innerHTML);
			}
		}
		
		var totalDayOff = App.data.workingDay - totalWork;
		
		if(totalDayOff > 0){
//				dayOffGet = (totalWork/App.data.workingDay) * hldRate;
		} else {
//				dayOffGet   = hldRate - totalDayOff;
			totalDayOff = 0;
		} 
		
		$("#inp_val02").val(totalWork);
		$("#inp_val03").val(totalDayOff);
//			$("#inp_val04").val(dayOffGet.toFixed(2));
		
		$("#p_val02").html(totalWork);
		$("#p_val03").html(totalDayOff);
	}
	
	function do_calcul_total_row(oData){
		if(!App.data.monthData){
			setTimeout(do_get_Total_Row(oData), 250);
		}
		var total = 0;
		for(var i = 1; i < App.data.monthData.length + 1; i++){
			var iden = "q" + i.toString();
			if(i < 10){
				iden = "q0" + i.toString();
			}
			if(oData[iden]){
				try{total += parseFloat(oData[iden]);}
				catch(e){}
			}
		}
		return total;
	}
	
	var do_update_lst_cat = function(request, response){
		var tmpList = App.data.lstCat;
		
		for(var i = 0; i < tmpList.length; i++){
			tmpList[i].exist = false;
		}
		
		var row = $("#table_report_detail > tbody > tr.cra");
		
		if(row.length > 0){
			for(var i = 0; i < row.length; i++){
				var idCat = parseInt(row[i].getAttribute("data-catId"));
				for(var j = 0; j < tmpList.length; j++){
					if(tmpList[j].catId01 == idCat){
						tmpList[j].exist = true;
					}
				}
			}
		}
		
		var newList = [];
		for(var i = 0; i < tmpList.length; i++){
			if(!tmpList[i].exist){
				newList.push(tmpList[i]);
			}
		}
		response( $.ui.autocomplete.filter( newList, request.term ));
	}
}

return JobReportEntTabReportDetail;
});