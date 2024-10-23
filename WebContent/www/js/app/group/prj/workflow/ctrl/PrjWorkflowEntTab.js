define(['jquery'], function($) {

	const pr_ENTITY_TYPE			= 20000;
	const pr_SERVICE_CLASS			= "ServicePrjProject"; //to change by your need
	const pr_SV_GET_LST        		= "SVLst";
	const pr_SV_GET					= "SVGet"; 
	const pr_SV_NEW					= "SVNew"; 
	const pr_SV_DEL					= "SVDel";

	const pr_SV_SAVE_CONTENT		= "SVSaveContent";
	const pr_SV_REFRESH_CONTENT		= "SVContentRefresh";
	
	const pr_SERVICE_PER_CLASS		= "ServiceAutUser";
	const pr_SV_USER_SEARCH			= "SVLst";

	const pr_SERVICE_DYN_CLASS		= "ServicePrjProjectDyn";
//	const pr_SV_GET_HISTORY_TASK	= "SVLstHistoryTask";
	
	const pr_SV_GET_HISTORY_TASK	= "SVGetHistoryTask";
	
	//------------------const object------------------------------------------------------

	const pr_TYPE02_PRJ				= 0;
	const pr_TYPE02_EPIC			= 1;
	const pr_TYPE02_TASK			= 2;

	const pr_STAT_PRJ_NEW 			= 100100;
	const pr_STAT_PRJ_TODO 			= 100200;
	const pr_STAT_PRJ_INPROGRESS 	= 100300;
	const pr_STAT_PRJ_DONE 			= 100400;
	const pr_STAT_PRJ_TEST 			= 100500;
	const pr_STAT_PRJ_REVIEW 		= 100600;
	const pr_STAT_PRJ_DEPLOY 		= 100700;
	const pr_STAT_PRJ_UNRESOLVED 	= 100800;
	const pr_STAT_PRJ_CLOSED 		= 100900;

	const pr_ctr_Main 				= App.controller.DBoard.DBoardMain;

	var do_lc_bindEvent_resize = function(div){
		$(".btn-resize").off("click").on("click", function(){
			do_resize(this);
		})
		
		if ($(window).width() < 800){
			if (div) do_resize($(div).find(".btn-resize"));
		}
	}
	
	var do_resize = function (ele){
		if (ele.length==0) return;
		let $this 		= $(ele);
		let {divtoogle} = $this.data();
		let child 		= $this.find("i");
		let label 		= $this.find(".label-resize");
		child			.toggleClass("mdi-window-minimize mdi-window-maximize")
		$(divtoogle)	.toggle("hide");

		label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n("prj_project_resize_max"));
	}

	var do_scrollToTop = function (){
		if(window.scrollY<50) return;
		window.scrollTo(0, 0);
	}
	
	//-------------------------------------------------------------------------------------------------------------------------------
	//------------------------------Start Member list-----------------------------------
	var PrjWorkflowEntTabMember 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		const pr_SV_GET_MEMBER		= "SVGetMember"; 
		const pr_SV_SAVE_MEMBER		= "SVSaveMember"; 
		
		//------------------------------------------------------------------------------------
		//------------------------------Start list member-----------------------------------
		const PRJ_MEMBER_LEVEL 		= {0: "prj_project_member_level_manager", 10: "prj_project_member_level_reporter", 20: "prj_project_member_level_developer", 30: "prj_project_member_level_tester", 40: "prj_project_member_level_worker", 50: "prj_project_member_level_watcher"};
		const PRJ_MEMBER_TYPE 		= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
		
		var pr_MEM_TEMP					= {};
		var members 					= {};
		
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_developer 	= 20;
		const pr_member_lev_tester 		= 30;
		const pr_member_lev_worker 		= 40;
		const pr_member_lev_watcher 	= 50;
		const pr_member_typ_low 		= 0;
		const pr_member_typ_high 		= 1;
		
		const pr_ENT_TYP_USER           = 1000;
		
		const pr_ctr_Ent				= App.controller.PrjWorkflow.Ent;
		//------------------------------------------------------------------------------------------------
		
		var do_lc_load_view = function(){
			members[App.data.user.id] = {"id": App.data.user.id, "lev": pr_member_lev_manager, "typ": pr_member_typ_high};
		}

		//------------------------------------------------------------------------------------------------
		var do_lc_bindEvent_members = function(members, prj){
			pr_MEM_TEMP = $.extend(false, {}, members);

			$("#btn_add_member").off("click").on("click", function(){
				$(".action-item-member").removeClass("hide");
				$(this).addClass("hide");
			})

			$("#a_btn_save_member").off("click").on("click", function(){
				do_lc_save_members(members, prj);
			})

			$("#a_btn_cancel_member").off("click").on("click", function(){
				do_lc_show_members(members, prj);
			})

			$(".member-edit").off("click").on("click", function(){
				let $this 			= $(this);
				let {memid} 		= $this.data();
				let mem 			= pr_MEM_TEMP[memid];
				if(mem){
					let parentTR 	= $this.closest("tr");
					parentTR.find(".content-member").addClass("hide");
					parentTR.find(".edit-member").removeClass("hide");
					let divLev 		= parentTR.find(".level-edit");
					let divTyp 		= parentTR.find(".typ-edit");
					do_lc_bindEvent_tabMemberEdit(memid, divLev, divTyp);
					$(".action-mem").removeClass("hide");
				}
			})

			$(".member-delete").off("click").on("click", function(){
				let {memid} = $(this).data();
				let mem 	= pr_MEM_TEMP[memid];
				if(mem){
					delete pr_MEM_TEMP[memid];
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			})

			let el = "#inp_name_member";
			let reqSelectMember = function(event, item){
				if(pr_MEM_TEMP[item.id])			return false;

				let lev 		= $("#sel_member_level").val();
				let typ 		= $("#sel_member_type").val();
				let mem 		= {"lev" : lev, "typ": typ, "ent02": item, "entId02": item.id, "entTyp02": pr_ENT_TYP_USER, "entId01": prj.id};
				let strlogin01 	= item.login01.length > 4?item.login01.substr(0, 4) + "..." : item.login01;
				
				let textColor   = null;
				let textAvatar  = null
				if(!item.avatar){
					let first = item.login01.charAt(0);
					let last  = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());
					
					textColor = var_gl_colors[index];
					textAvatar= first + last;
				}

				pr_MEM_TEMP[item.id] = mem;
				let selOpt 		= `<tr>`;
				selOpt 			+= `<td><a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></td>`;
				
				if(item.avatar) selOpt 			+= `<td style='width: 50px;'><img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs' alt=''/></td>`;
				else 			selOpt 			+= `<td style='width: 50px;'> <div class="rounded-circle avatar-xs text-white text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div></td>`;
				selOpt 			+= `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${strlogin01}</a></h5></td>`;
				selOpt 			+= `<td>` + $.i18n(PRJ_MEMBER_LEVEL[+lev]) 	+`</td>`;
				selOpt 			+= `<td class='hide'>` + $.i18n(PRJ_MEMBER_TYPE[+typ])	+`</td>`;
				selOpt 			+= `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				do_lc_bindEvent_autocomplete(pr_MEM_TEMP);
				$(el).blur().val("");
			}

			let options = {
					dataService : [pr_SERVICE_PER_CLASS, pr_SV_USER_SEARCH], 
					svParams	: {wAvatar:true},
					fSelect		: reqSelectMember, 
					customShowList: do_lc_customLst_user_autocomplete
			}
			do_gl_req_autocompleteNew(el, options);

			App.router.controller.do_lc_binding_route()
		}
		
		var do_lc_bindEvent_autocomplete = function(pr_MEM_TEMP){
			$(".btn-remove-member").off("click").on("click", function(){
				let $this 		= $(this);
				let parentTR 	= $this.closest("tr");
				let {id} 		= $this.data();

				if(pr_MEM_TEMP[id])	delete pr_MEM_TEMP[id];
				parentTR.remove();
			})
		}
		
		var do_lc_bindEvent_tabMemberEdit = function(memid, divLev, divTyp){
			$(divLev).off("change").on("change", function(){
				pr_MEM_TEMP[memid].lev = $(this).val();
			})

			$(divTyp).off("change").on("change", function(){
				pr_MEM_TEMP[memid].typ = $(this).val();;
			})
		}

		var do_lc_customLst_user_autocomplete = function(item, selOpt = ""){
			if(!item.avatar){
				let first = item.login01.charAt(0);
				let last  = item.login01.charAt(item.login01.length - 1);
				let index = var_gl_alphabet.indexOf(first.toLowerCase());
				
				let textColor = var_gl_colors[index];
				let textAvatar= first + last;
				
				selOpt 		+= `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-2" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			}else{
				selOpt 		+= `<div class="media align-items-center"><img src='${ item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs mr-2'/> ${item.login01}</div>`;
			}
			return selOpt;
		}
		
		//------------------------------------------------------------------------------------------------
		
		
		this.do_lc_get_members = function(prj){
			if (prj.members && prj.members.length>0){
				do_lc_show_members(prj.members, prj);
				return;
			}
			
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_MEMBER, {id: prj.id, code: prj.code01});

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_members_callback, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_get_members_callback = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA];

				do_lc_show_members(data, prj);
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}


		var do_lc_save_members = function(members, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER, {id:prj.id, code:prj.code01, members: JSON.stringify(Object.values(pr_MEM_TEMP))});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_save_members_callback, [members, prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_save_members_callback = function(sharedJson, members, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
				
				var data = []
				for (var i in pr_MEM_TEMP ) data.push(pr_MEM_TEMP[i]);
				do_lc_show_members(data, prj);
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		var do_lc_show_members = function(data, prj){
			if(typeof data === 'object' && !Array.isArray(data)) {
				data = Object.values(data)
			}
			const is_Me 		= data.find(m => m.entId02 == App.data.user.id);
			const isSuperAdmin 	= App.controller.common.Login && App.controller.common.Login.can_lc_User_SuperAdmin();
			const isOwner		= App.data.user.id === prj.autUser01;
			
			let 	members 	= data.reduce((currentObj, mem)=>{
				if(mem.entId02 == prj.autUser01)	mem.isOwner = true;
				
				if(!isSuperAdmin && !isOwner){
					if(is_Me && is_Me.typ <= mem.typ && is_Me.lev >= mem.lev)	mem.notModif = true;
				}
				
				currentObj[mem.entId02] = mem;
				return currentObj;
			}, {});
			
			do_lc_load_view();
			$("#div_prj_member")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_ENT_TAB_MEMBER			, members));
			do_lc_bindEvent_members(members, prj);
			do_lc_bindEvent_resize("#div_prj_member");
			// do_gl_handle_member_external($("#div_prj_member"));
			
			pr_ctr_Ent.do_lc_reqRole_User();
		}
		//------------------------------End list member-----------------------------------
	}
	//------------------------------Start Content prj-----------------------------------
	var PrjWorkflowEntTabContent 	= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		const self						= this;
		const pr_TYPE01_INDUSTRY		= 1;
		const pr_TYPE01_INFORMATIQUE	= 2;
		const pr_TYPE01_BUISINESS		= 3;
		const pr_TYPE01_TRAVEL			= 4;
		const pr_project				= App.controller.UI[pr_grpName];

		const pr_ctr_Ent				= App.controller.PrjWorkflow.Ent;

		const pr_TYPE02_MAIN			= 0;
		const pr_TYPE02_SUB				= 1;
		const pr_TYPE02_ELE				= 2;
		
		const pr_TYPE00_WORKFLOW		= 200;

		var dataWF						= null;
		var workflow  					= {};
		var members                     = {};
		var pr_isViewWorkflow			= false;
		const pr_member_lev_manager 	= 0;
		const pr_member_lev_reporter 	= 10;
		const pr_member_lev_worker 		= 40;

		const pr_CHECK_NOT_FINISH 		= 1;
		const pr_CHECK_FINISH 			= 2;
		
		const var_lc_MODE_SEL       	= 0;
		const var_lc_MODE_NEW       	= 1;
		const var_lc_MODE_MOD       	= 2;

		const pr_NB_RECORD_HISTORY		= 10;

		var pr_DEFAULT_VAL			    = 0;
		var pr_div_rating		        = ['#rating_01'];

		const TAB_CONTENT 				= "content";
		const TAB_MEMBER 				= "member";
		const TAB_PRJ 					= "prj";
		const TAB_EPIC 					= "epic";
		const TAB_TASK 					= "task";
		//---------------------- -------------------------------------------------
		this.do_lc_show_prj_content = function(prj, mode){
			prj['typ00'] 		= pr_TYPE00_WORKFLOW; 	
			pr_isViewWorkflow 	= true;
			do_lc_show_content(prj, mode);
		}
		

		var do_lc_show_content = function(prj, mode){
			prj.isViewWorkflow 	= pr_isViewWorkflow;

			$("#div_prj_content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_ENT_CONTENT, prj));
			
			$("#projectepic").find("option[value="+ prj.parent	+"]")	.attr("selected","selected");

			$("#btn_delete").remove();
			
			do_lc_bindEvent_content_prj(prj, mode);
			do_lc_bindEvent_resize();

			do_lc_init_element(prj);

			//--- if business , load client, if not, hide div
			$("#div_prj_customers")	.html("");

			pr_ctr_Ent.do_lc_reqRole_User();
			
			if(prj.stat == pr_STAT_PRJ_DONE) {
				let $parent = $(".val05").parent();
				$parent.find(".info-edit")	.off("click");
				$parent.find(".val05")	.removeClass("content-edit");
			}
		}
		const do_lc_show_checkList = (prj) => {
			//clone list check list
			$("#div_check_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_ENT_CONTENT_CHECK_LIST, prj));
			do_lc_bindEvent_checkList(prj);
		}

		const do_lc_init_element = function(){
			
			$(".tmpicker").timepicker({//timepicker
				showMeridian: false,
				icons		: {
					up		: "mdi mdi-chevron-up",
					down	: "mdi mdi-chevron-down"
				}
			})
			
			setTimeout(function(){
				App.SummerNoteController.do_lc_show("#div_prj_info");
			},500);
		}

		var do_lc_bindEvent_content_prj = function(prj, mode){
//			let files = prj.avatar ? [prj.avatar] : [];
//			let	obj 		= {files};
			if(!prj.files)	prj.files = [];
			let option		= {
					fileinput	: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj			: prj//file existing here
			}
			do_gl_init_fileDropzone($("#div_prj_content"), option);

			if(mode && mode == var_lc_MODE_NEW){
				$(".action-item-duplicate").remove();

				$("#div_prj_member"		).remove();
//				$("#div_prj_docs"		).remove();				
				$("#div_prj_comments"	).remove();
				$("#div_prj_epic"		).remove();
				$("#div_prj_task"		).remove();
				$("#div_prj_evaluation"	).remove();
				
//				$(".info-content").addClass("hide");			
//				$(".content-edit").removeClass("hide");
//				$("#div_prj_ent_file_avatar").removeClass("hide");
				
				$("#div_partner_funct").removeClass("hide");
				$("#btn_save").off("click").on("click", function(){
					prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
					
					let	data	 				= req_gl_data({
						dataZoneDom		: $("#div_prj_content"),
						oldObject 		: prj,
					});

					if(data.hasError)	return false;

					let newPrj 			= data.data;

					
//					newPrj.files	= newPrj.files.concat(obj.files);

					newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
					newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);

					newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;

					switch(parseInt(newPrj.stat)){
					case pr_STAT_PRJ_NEW		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_TODO		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_INPROGRESS : newPrj.val05 =  10; break;
					case pr_STAT_PRJ_REVIEW		: newPrj.val05 =  90; break;
					case pr_STAT_PRJ_DONE		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_CLOSED		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_DEPLOY		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
					}

					if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					do_lc_create_prj(newPrj, 1)
				})
				
				$(".info-edit").on("click", function(){
					let $parent = $(this).parent();
					$parent.find(".info-content")			.addClass("hide");
					$parent.find(".info-content-worker")	.addClass("hide");
					$parent.find(".content-edit")	.removeClass("hide");

					if($parent.find(".content-edit").length > 0){
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					}

					pr_ctr_Ent.do_lc_reqRole_User();
				})

				$("#btn_add_chk_lst").off("click").on("click", function() {
					const do_lc_add_chk_lst = () => {
						const _content_chk = $("#inp_chk_lst").val();
						if(!_content_chk || !_content_chk.trim().length)	return false;
	
						prj.lstClone.push({item: _content_chk.trim()});
						do_lc_show_checkList(prj);
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
						pr_ctr_Ent.do_lc_reqRole_User();
						App.MsgboxController.do_lc_close();
					}
	
					App.MsgboxController.do_lc_show({
						title 		: $.i18n("prj_project_descr02_msgbox_add"),
						content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
						autoclose	: false,
						buttons 	: {
							UPDATE : {
								lab 		: $.i18n("prj_project_descr02_add"),
								funct 		: do_lc_add_chk_lst,
								classBtn	: "btn-primary",
								autoclose	: false
							},
							CALCEL : {
								lab 		: $.i18n("common_btn_cancel"),
							}
						}
					});
				})
				
			}else{
				if(prj.userRole === pr_member_lev_manager || prj.userRole === pr_member_lev_reporter){			
					$(".info-edit").on("click", function(){
						let $parent = $(this).parent();
						$parent.find(".info-content")			.addClass("hide");
						$parent.find(".info-content-worker")	.addClass("hide");
						$parent.find(".content-edit")	.removeClass("hide");
		
						if($parent.find(".content-edit").length > 0){
							let $parents = $parent.closest(".card");
							$parents.find("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
							$parents.find("#a_btn_save02, #a_btn_cancel02")	.removeClass("hide");
		
						}
		
					})
				}else{
					if(prj.userRole[App.data.user.id]=== pr_member_lev_manager || prj.userRole[App.data.user.id] === pr_member_lev_reporter){
						$(".info-edit").on("click", function(){
							let $parent = $(this).parent();
							$parent.find(".info-content")			.addClass("hide");
							$parent.find(".info-content-worker")	.addClass("hide");
							$parent.find(".content-edit")	.removeClass("hide");
			
							if($parent.find(".content-edit").length > 0){
								let $parents = $parent.closest(".card");
								$parents.find("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
								$parents.find("#a_btn_save02, #a_btn_cancel02")	.removeClass("hide");
			
							}
			
						})													
					}
				}
				pr_ctr_Ent.do_lc_reqRole_User();
				

				$("#a_btn_save, #a_btn_save02, #a_btn_save_stats").off("click").on("click", function(){
					prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
					let	data	 				= req_gl_data({
						dataZoneDom		: $("#div_prj_content")
					});

					if(data.hasError)	return false;

					let newPrj 			= data.data;
					
					let oldStat = prj.stat; //get stat for check percent

					if(prj.userRole === pr_member_lev_worker ){
						newPrj 			= Object.assign({}, prj);
						newPrj.stat 	= data.data.stat;
						newPrj.val05 	= data.data.val05;
					}else{
						newPrj 			= $.extend(false, prj, newPrj);

//						newPrj.files	= newPrj.files.concat(obj.files);

						//newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
						//newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);
						

					}

					newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;
					newPrj.val00    = null;
					
					switch(parseInt(newPrj.stat)){
					case pr_STAT_PRJ_NEW		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_TODO		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_INPROGRESS : 
						if(oldStat != newPrj.stat){
							newPrj.val05 =  10; 
						}else {
							//todo
						}
						break;
					case pr_STAT_PRJ_REVIEW		: newPrj.val05 =  90; break;
					case pr_STAT_PRJ_DONE		: newPrj.val05 = 100; break;
					case pr_STAT_PRJ_CLOSED		: 
						newPrj.val05 = 100; 
						newPrj.val00 = App.data.curEval.eval01;
						break;
					case pr_STAT_PRJ_DEPLOY		: newPrj.val05 =   0; break;
					case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
					}


					if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

					if(newPrj.lstStatsClone) newPrj.inf03 = JSON.stringify({
						stats: newPrj.lstStatsClone
					});

					//---remove some fields before send to server
					newPrj.epicInf 	= null;
					newPrj.epicName = null;
					newPrj.epics	= null;
					newPrj.lstClone = null;
					newPrj.tasks 	= null;
					
					self.do_lc_save_prj_content(newPrj, prj)
				})

				$("#a_btn_cancel, #a_btn_cancel02, #a_btn_cancel_stats").off("click").on("click", function(){
					self.do_lc_show_prj_content(prj, null);
				})

				$(".btn-reload").off("click").on("click", function(){
					let {name: typLoad} = $(this).data();
					do_lc_get_content_reload(prj, typLoad);
				})

				$("#btn_refresh_content").off("click").on("click", function() {
					do_lc_refresh_content(prj, prj.id, prj.code01);
				})

				$("#btn_delete").off("click").on("click", function() {
					do_lc_delete_content(prj, prj.id);
				})

				$("#btn_duplicate_content").off("click").on("click", function() {
					do_lc_duplicate_content(prj);
				})

				$("#btn_add_avatar").off("click").on("click", function(){
					$("#div_prj_ent_file_avatar").removeClass("hide");
					$(this).addClass("hide");
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				})
				
				$("#btn_add_chk_lst").off("click").on("click", function() {
					const do_lc_add_chk_lst = () => {
						const _content_chk = $("#inp_chk_lst").val();
						if(!_content_chk || !_content_chk.trim().length)	return false;
	
						prj.lstClone.push({item: _content_chk.trim()});
						do_lc_show_checkList(prj);
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
						pr_ctr_Ent.do_lc_reqRole_User();
						App.MsgboxController.do_lc_close();
					}
	
					App.MsgboxController.do_lc_show({
						title 		: $.i18n("prj_project_descr02_msgbox_add"),
						content 	: `<div class="mb-4"><input class="form-control" id="inp_chk_lst" type="text" placeholder="${$.i18n("prj_project_descr02_enter_inp")}"></div>`,
						autoclose	: false,
						buttons 	: {
							UPDATE : {
								lab 		: $.i18n("prj_project_descr02_add"),
								funct 		: do_lc_add_chk_lst,
								classBtn	: "btn-primary",
								autoclose	: false
							},
							CALCEL : {
								lab 		: $.i18n("common_btn_cancel"),
							}
						}
					});
				})
				
				$("#btn_show_history").off("click").on("click", function() {
					do_gl_init_msgbox_annonce(`<div id="div_history_list"></div><div id="div_history_pagination"></div>`, null, $.i18n("prj_history_title"));
					do_lc_get_history(prj);
				})

				$("#btn_show_wf").off("click").on("click", function() {
					if (dataWF != null) {
						App.MsgboxController.do_lc_show({
							title		: $.i18n("prj_title_workflow_view"),
							content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_ENT_WORKFLOW_VIEW		, {}),	
							autoclose	: false,
							buttons		: {
								NO: {
									lab		:  $.i18n("common_btn_cancel"),
								}
							},
						});	
						do_lc_show_work_flow(dataWF);
					} else {
						do_gl_show_Notify_Msg_Error ($.i18n('workflow_err_msg_show'));
					}
				})
				
				if(prj.autUser01 == App.data.user.id){
					$("#div_star_eval a").on("click", function() {
						$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
					})
				}else{
					$("#div_star_eval a").css("pointer-events","none");
				}
			}


			$("#div_prj_content_01 img").off("click").on("click", function(){
//				const viewer = new Viewer(document.getElementById('div_prj_content_01'), {
//					hide: function () {
//						viewer.destroy();
//					},
//				});

				// let src = $(this).attr("src");
				// App.MsgboxController.do_lc_show({
				// 	content 	: `<img src="${src}" style="width: 100%;">`,
				// 	autoclose	: false,
				// 	buttons 	: {
				// 		CALCEL : {
				// 			lab 		: $.i18n("common_btn_cancel"),
				// 			classBtn	: "btn-primary",
				// 		}
				// 	}
				// });
			})
			
		};
		
		const do_lc_get_history = function(prj){
			const ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_GET_HISTORY_TASK, {id :prj.id, typ : prj.typ02});
			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_req_history, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_after_req_history = function(sharedJson){
			const data = can_gl_AjaxSuccess(sharedJson) ? sharedJson[App['const'].RES_DATA] :  {};
			if(data.cmt){
				let cmt = JSON.parse(data.cmt);
				do_lc_show_listHistory(cmt);
			}
		}

		const do_lc_show_listHistory = function(data){
			data = data.reverse();

			let obj = {arrContent:[], arrChild:[]};
			data.forEach((e) => {
				if (e.typTab == TAB_CONTENT) obj.arrContent.push(e)
				else obj.arrChild.push(e)
			});

			$("#div_history_list").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_WORKFLOW_ENT_TAB_HISTORY , obj));
		}

		const do_lc_convert_date = objDate => objDate.date.substr(0, 10) + " " + objDate.time.substr(0, 5) + ":00";

		this.do_lc_save_prj_content = function(newPrj, prj){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_CONTENT, {obj: JSON.stringify(newPrj)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterSave_prjContent, [prj]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_afterSave_prjContent = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 	= sharedJson[App['const'].RES_DATA];
				prj 		= $.extend(true, prj, data);
				self.do_lc_show_prj_content(prj);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
			}
		}

		var do_lc_get_content_reload = function(prj, typLoad){
			if(!typLoad)	return false;
			let pr_SV_NAME_RELOAD 	= typLoad === "val02" ? pr_SV_EVAL_GET_BUDGET : pr_SV_EVAL_GET_PERCENT;

			let ref 				= req_gl_Request_Content_Send_With_Params(pr_SERVICE_EVAL_CLASS, pr_SV_NAME_RELOAD, {id: prj.id, code: prj.code01});

			let fSucces				= [];
			fSucces.push(req_gl_funct(null, do_lc_after_Reload, [prj]));

			let fError 				= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		var do_lc_after_Reload = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				if(data){
					prj = $.extend(true, prj, data);
					self.do_lc_show_prj_content(prj);
				}
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		var do_lc_delete_content = function(prj, prjId){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SPRINT_DEL, {id: prjId});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_del_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_del_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				do_gl_show_Notify_Msg_Success($.i18n('common_ok_msg_del'));
				
				$(".btn-refrest-list").trigger("click");
				$("#div_task_content_main").html("");
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_del'));
				do_gl_show_Notify_Msg_Error ($.i18n('sprint_err_msg_del'));
			}
		}

		var do_lc_refresh_content = function(prj, prjId, prjCode){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_REFRESH_CONTENT, {id: prj.id, code: prj.code01});			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_after_refresh_content, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_lc_after_refresh_content = function(sharedJson, prj){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				prj = Object.assign(prj, data);
				do_lc_show_content(prj);

				pr_project.EntEpic		.do_lc_show_prj_epic(prj);
				pr_project.EntTask		.do_lc_show_prj_task(prj);
				pr_project.EntDoc		.do_lc_show_prj_docs(prj);
				pr_project.EntEval		.do_lc_get_prj_evaluation(prj);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		var do_lc_duplicate_content = function(prj){
			let m
			var newObj 			= $.extend(true,{},prj);

			//---duplicate 	record in document and detail		
			newObj = do_duplicate_record(newObj);
			
			self.do_lc_show_prj_content(newObj, var_lc_MODE_NEW)
			pr_project.EntDoc		.do_lc_show_prj_docs(newObj, var_lc_MODE_NEW);
			
		}
		
		function do_duplicate_record(obj){
			obj.id			= null;
			obj.code        = null;
			obj.name		= obj.name + " - COPY"  ;
			
			if(obj.files){
				for(let i=0; i < obj.files.length; i++){
					obj.files[i].id 		= null;
				}
			}
			
			obj.dtBegin =  req_gl_DateStr_From_DateObj (new Date());
			obj.dtEnd 	=  req_gl_DateStr_From_DateObj (new Date());
			obj.dtMod	=  null;
			obj.dtNew	=  null;
			if(obj.lstStats && obj.lstStats.length > 0) {
				obj.stat	=  obj.lstStats[0].id;
				obj.stat01	=  obj.lstStats[0].id;
			} else {
				obj.stat	=  null;
				obj.stat01	=  null;
			}
			
			return obj;
		}
		
		const do_lc_create_prj = (prj, frView) => {
			let dataSend	= {obj: JSON.stringify(prj), member : Object.values(members), frView};
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, dataSend);			

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_prj, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_prj = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${data.id}&code=${data.code01}`, "VI_MAIN/"+ App.router.part.PRJ_WORKFLOW_ENT, [data.id], '_self');
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_show_wf_task = (prj) => {
			let ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVWorkflowByTask");
			ref["id"]		= prj.id;
			ref["grId"]		= prj.grp;

			let fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_lc_show_wf_task_success, [prj]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_show_wf_task_success = (sharedJson, prj) => {
			if(can_gl_AjaxSuccess(sharedJson)) {	
				let data = sharedJson[App['const'].RES_DATA];
				dataWF = data;

				// Handle select stat field
				do_lc_handle_select_stat(data, prj);
			}
		}

		const do_lc_handle_select_stat = (data, prj) => {
			let wf  = data.descr01;
			let lstStatEnd = [];
			let haveQuickStat = false;
			try{
				let connection 			= (JSON.parse(wf)).con;
				if (connection && connection.length > 0) {
					connection.forEach((e) => {
						if (prj.stat == e.statBegin) {
							lstStatEnd.push(e.statEnd);
						}
					});
				};

				for (let i = 0; i < 8; i++) {
					$(`#stat option[value=${i}]`).hide();
				}

				if (lstStatEnd.length < 4) haveQuickStat = true;
				if (lstStatEnd.length > 0) {
					lstStatEnd.forEach((e) => {
						$(`#stat option[value=${e}]`).show();
						if (haveQuickStat) {
							$(`#quick_stat_0${e}`).removeClass("hide");
							$(`#quick_stat_0${e}`).off("click").on("click", () => {
								do_gl_select_value($("#stat"), e);
								do_lc_quick_save_stat(prj);
							});
						}
					});
				};
				
			} catch(e) {
			}
		}

		const do_lc_quick_save_stat = (prj) => {
			prj.files 	= prj.files ? [...prj.files].filter(Boolean) : [];
			let	data	 				= req_gl_data({
				dataZoneDom		: $("#div_prj_content")
			});

			if(data.hasError)	return false;

			let newPrj 			= data.data;
			
			let oldStat = prj.stat; //get stat for check percent

			if(prj && (prj.userRole == pr_member_lev_reporter || prj.userRole == pr_member_lev_worker)){
				newPrj 			= Object.assign({}, prj);
				newPrj.stat 	= data.data.stat;
				newPrj.val05 	= data.data.val05;
			}else{
//						newPrj.files	= newPrj.files.concat(obj.files);

				newPrj.dtBegin 	= do_lc_convert_date(newPrj.dtBegin);
				newPrj.dtEnd 	= do_lc_convert_date(newPrj.dtEnd);

				newPrj 			= $.extend(false, prj, newPrj);
			}

			newPrj.parent 	= newPrj.parent == 0? prj.grp: newPrj.parent;
			newPrj.val00    = null;
			
			switch(parseInt(newPrj.stat)){
			case pr_STAT_PRJ_NEW		: newPrj.val05 =   0; break;
			case pr_STAT_PRJ_TODO		: newPrj.val05 =   0; break;
			case pr_STAT_PRJ_INPROGRESS : 
				if(oldStat != newPrj.stat){
					newPrj.val05 =  10; 
				}else {
					//todo
				}
				break;
			case pr_STAT_PRJ_REVIEW		: newPrj.val05 =  90; break;
			case pr_STAT_PRJ_DONE		: newPrj.val05 = 100; break;
			case pr_STAT_PRJ_CLOSED		: 
				newPrj.val05 = 100; 
				newPrj.val00 = App.data.curEval.eval01;
				break;
			case pr_STAT_PRJ_DEPLOY		: newPrj.val05 =   0; break;
			case pr_STAT_PRJ_UNRESOLVED	: newPrj.val05 =   0; break;
			}


			if(newPrj.lstClone)	newPrj.descr02 = JSON.stringify(newPrj.lstClone);

			//---remove some fields before send to server
			newPrj.epicInf 	= null;
			newPrj.epicName = null;
			newPrj.epics	= null;
			newPrj.lstClone = null;
			newPrj.tasks 	= null;
			
			do_lc_save_prj_content(newPrj, prj)
		}

		const do_lc_show_work_flow = (prj) => {
			let wf  = prj.descr01;
			try{
				workflow 			= JSON.parse(wf);
				workflow.statWF 	= req_lc_build_objWF(workflow.con);
				do_lc_show_workflow(workflow);
			} catch(e) {
				console.log(e);
			}
		}

		const req_lc_build_objWF = (data) => {
			var statWF ={};
			if (data && data.length > 0) {
				data.forEach((e) => {
					statWF[e.i] = e.userTyp;
				});
			}
			return statWF;
		}

		const do_lc_show_workflow = function(wf) {
			do_gl_show_workflow (wf, tmplCtrl, tmplName);
		}

		//------------------------------End content prj-----------------------------------
	}
	
	var PrjWorkflowEntTabStat 		= function (grpName, header, content, footer) {
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		const self						= this;

		const pr_project				= App.controller.UI[pr_grpName];

		const pr_TYPE02_MAIN			= 0;
		
		const var_lc_MODE_SEL       = 0;
		const var_lc_MODE_NEW       = 1;
		const var_lc_MODE_MOD       = 2;

		this.do_lc_req_lstStats = (prj) => {
			const prjMain 		= prj.prjMain
			prj.lstStats 		= do_lc_req_def_stats(prjMain?prjMain.inf03:null);
		}
		
		this.do_lc_req_lstStatDef= (prj) => {
			prj.lstStatDef 		= do_lc_req_def_stats(null);
		}
		
		const do_lc_req_def_stats = (inf03) => {
			const defStats = [
				{
					id: pr_STAT_PRJ_NEW,
					lab: "new",
					trans: "prj_project_stat_100100",
					show: 1,
					ord: 1,
				},
				{
					id: pr_STAT_PRJ_TODO,
					lab: "tod",
					trans: "prj_project_stat_100200",
					show: 1,
					ord: 2,
				},{
					id: pr_STAT_PRJ_INPROGRESS,
					lab: "inp",
					trans: "prj_project_stat_100300",
					show: 1,
					ord: 3,
				},{
					id: pr_STAT_PRJ_DONE,
					lab: "don",
					trans: "prj_project_stat_100400",
					show: 1,
					ord: 4,
				},{
					id: pr_STAT_PRJ_TEST,
					lab: "tes",
					trans: "prj_project_stat_100500",
					show: 1,
					ord: 5,
				},{
					id: pr_STAT_PRJ_REVIEW,
					lab: "rev",
					trans: "prj_project_stat_100600",
					show: 1,
					ord: 6,
				},{
					id: pr_STAT_PRJ_DEPLOY,
					lab: "fai",
					trans: "prj_project_stat_100700",
					show: 1,
					ord: 7,
				},{
					id: pr_STAT_PRJ_UNRESOLVED,
					lab: "unr",
					trans: "prj_project_stat_100800",
					show: 1,
					ord: 8,
				},{
					id: pr_STAT_PRJ_CLOSED,
					lab: "clo",
					trans: "prj_project_stat_100900",
					show: 1,
					ord: 9,
				},
			]

			if(!inf03) return defStats;

			inf03 = JSON.parse(inf03)

			if(!inf03.stats) return defStats;

			return inf03.stats
		}
	}
	//------------------------------End content prj-----------------------------------

	return { PrjWorkflowEntTabContent, PrjWorkflowEntTabStat, PrjWorkflowEntTabMember};
});