define([], function() {
	const EntMember = function(grpName, header, content, footer) {
		var pr_divHeader = header;
		var pr_divContent = content;
		var pr_divFooter = footer;

		//------------------------------------------------------------------------------------
		var pr_grpName 	= grpName;
		var tmplName 	= App.template.names[pr_grpName];
		var tmplCtrl 	= App.template.controller;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main = null;
		var pr_ctr_Ent 	= null;
		var pr_ctr_List = null;

		var RIGHT_ADM	        	= 100;
		var RIGHT_A_G	        	= 101;
		var RIGHT_A_N	        	= 102;
		var RIGHT_A_M	        	= 103;
		var RIGHT_A_D	        	= 104;
		
		
		var RIGHT_GET	        	= 30000011;
		var RIGHT_NEW	        	= 30000012;
		var RIGHT_MOD	        	= 30000013;
		var RIGHT_DEL	        	= 30000014;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS 		= "ServiceMsgMessage"; //to change by your need
		const pr_SV_MEMBER_LIST 	= "SVMemberLst";

		const pr_SERVICE_PER_CLASS 	= "ServiceAutUser";
		const pr_SV_USER_SEARCH 	= "SVLst";

		const pr_SERVICE_CLASS_NSO_GROUP 	= "ServiceNsoGroup"; //to change by your need
		const pr_SV_MEMBER_NOT_VALIDATED 	= "SVNsoGroupDelEnt";
		const pr_SV_MEMBER_VALIDATED 		= "SVNsoGroupValidated";
		const pr_SV_MEMBER_TRANSFORM_MAN 	= "SVNsoGroupTransform";
		const pr_SV_MEMBER_SAVE 			= "SVWorkSaveMember";

		var self 				= this;
		var pr_PAGESIZE 		= 10;
		const pr_STAT_WAITING 	= 1;
		const pr_STAT_VALIDATED = 2;
		
		//-----------------------------------------------------------------------------------
		var pr_MEM_TEMP = {};

		const pr_member_lev_manager = 0;

		const pr_SERVICE_USER_CLASS = "ServiceAutUser";
		const pr_SV_USER_BY_RELATION = "SVLstByRelation";

		const PRJ_MEMBER_LEVEL = {
			1	: "prj_project_member_level_dean", 
			2	: "prj_project_member_level_deputy", 
			10	: "prj_project_member_level_doctor",
			20	: "prj_project_member_level_pharmacist", 
			30	: "prj_project_member_level_nurse", 
			100	: "prj_project_member_level_member"
		};

		var Handlebars = require('handlebars');
		Handlebars.registerHelper("reqLevelMemberGroup", function(level) {
			if (level === undefined) return "";
			return $.i18n(PRJ_MEMBER_LEVEL[+level]);
		});

		//--------------------APIs--------------------------------------//
		this.do_lc_init = function() {
			pr_ctr_Main = App.controller[pr_grpName].Main;
			pr_ctr_List = App.controller[pr_grpName].List;
			pr_ctr_Ent 	= App.controller[pr_grpName].Ent;
		};

		const initialValues = {
			members	: {},
			group	: {},
		};

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(group) {
			try {
				initialValues.group 	= group;
				initialValues.members 	= {};
				
				do_get_list_member	();
			} catch (e) {
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "EntMember", "do_lc_show", e.toString()) ;
			}
		};
		//---------show-----------------------------------------------------------------------------
		const do_lc_build_table_member = () => {
			$("#div_entity_member").html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_MEMBER,	initialValues.members));
			do_lc_bind_event_member(initialValues.members, initialValues.group.id);
		};

		var do_lc_bind_event_member = function(members, idGroup) {
			var listUserRight 	= App.data.user.rights;
			var isRight = listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)
			if (!isRight) {
				$("#btn_edit"		).hide();
				return;
			}
			
			isRight = listUserRight.includes(RIGHT_A_D) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_DEL)
			if (!isRight) {
				$("#btn_del").hide();
				return;
			}

			//-----------------------------------------------------------------------------------------------------------------------
			pr_MEM_TEMP = $.extend(false, {}, members);

			$("#btn_add_member").off("click").on("click", function() {
				$(".action-item-member").removeClass("hide");
				$(this).addClass("hide");
			});

			$("#a_btn_save_member").off("click").on("click", function() {
				if (Object.keys(pr_MEM_TEMP).length === Object.keys(members).length) {
					do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
					return;
				}
				do_lc_save_member(members, idGroup);
			});

			$("#a_btn_cancel_member").off("click").on("click", function() {
				do_lc_build_table_member();
			});

			$(".member-edit").off("click").on("click", function() {
				let $this = $(this);
				let { memid } = $this.data();
				let mem = pr_MEM_TEMP[memid];
				if (mem) {
					let parentTR 	= $this.closest("tr");
					let divLev 		= parentTR.find(".level-edit");
					
					parentTR.find(".content-member"	)	.addClass	("hide");
					parentTR.find(".edit-member"	)	.removeClass("hide");
					
					do_lc_bindEvent_tabMemberEdit(memid, divLev);
					$(".action-mem").removeClass("hide");
				}
			});

			$(".member-delete").off("click").on("click", function() {
				let { memid } = $(this).data();
				let mem = pr_MEM_TEMP[memid];
				if (mem) {
					delete pr_MEM_TEMP[memid];
					$(this).closest("tr").remove();
					$(".action-mem").removeClass("hide");
				}
			});

			$(".btn-resize").off("click").on("click", function() {
				let $this = $(this);
				let child = $this.find("i");
				let { divtoggle } = $this.data();

				$(divtoggle).toggle("hide");
				child.toggleClass("mdi-window-minimize mdi-window-maximize");
			});

			let el = "#inp_name_member";
			let reqSelectMember = function(event, item) {
				if (pr_MEM_TEMP[item.id]) return false;

				let typ = $("#sel_member_level").val();
				let mem = {
					typ		: typ,
					mem		: item,
					uId		: item.id,
					group	: idGroup,
					stat	: pr_STAT_VALIDATED,
				};

				let textColor = null;
				let textAvatar = null;
				if (!item.avatar) {
					let first = item.login01.charAt(0);
					let last = item.login01.charAt(item.login01.length - 1);
					let index = var_gl_alphabet.indexOf(first.toLowerCase());

					textColor = var_gl_colors[index];
					textAvatar = first + last;
				}

				pr_MEM_TEMP[item.id] = mem;
				let selOpt = `<tr>`;
				selOpt += `<td><a data-id='${item.id}' class='text-danger btn-remove-member' data-toggle='tooltip' data-placement='top' title='' data-original-title='Delete'><i class='mdi mdi-close font-size-18'></i></a></td>`;

				if (item.avatar)
					selOpt += `<td style='width: 50px;'><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs' alt=''/></td>`;
				else
					selOpt += `<td style='width: 50px;'> <div class="rounded-circle avatar-xs text-white text-uppercase text-center" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div></td>`;
				selOpt += `<td><h5 class='font-size-14 m-0'><a href='' class='text-dark'>${item.login01}</a></h5></td>`;
				selOpt += `<td>` + $.i18n(PRJ_MEMBER_LEVEL[+typ]) + `</td>`;

				selOpt += `</tr>`;

				$("#tabMember table tbody").append(selOpt);
				
				$(".btn-remove-member").off("click").on("click", function() {
					let $this 		= $(this);
					let parentTR 	= $this.closest("tr");
					let { id } 		= $this.data();

					if (pr_MEM_TEMP[id]) delete pr_MEM_TEMP[id];
					parentTR.remove();
				});
							
				$(el).blur().val("");
			};
			let typ01Arr = [App.data.user.typ01, 2, 3, 4, 5];
			let typ01Str = typ01Arr.join(',');

			let options = {
				dataService		: [pr_SERVICE_PER_CLASS, pr_SV_USER_SEARCH],
				svParams		: { wAvatar: true, nbline: 20, typ01s: typ01Str, stats: 1 },
				hintService		: [pr_SERVICE_USER_CLASS, pr_SV_USER_BY_RELATION],
				hintSvParams	: { wAvatar: true, typ01s: typ01Str, stats: 1, entId01: idGroup },
				fSelect			: reqSelectMember,
				customShowList	: do_lc_customLst_user_autocomplete,
			};
			do_gl_req_autocompleteNew(el, options);
		};


		const do_get_list_member = function() {
			const ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_LIST,
				{ groupId: initialValues.group.id }
			);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_get_list_member_callback, []));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [
				$.i18n("common_err_ajax"),
			]);
			App.network.do_lc_ajax_bg_keepState(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		};


		const do_get_list_member_callback = function(sharedJson) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				const data 			= sharedJson[App["const"].RES_DATA];

				var listUserRight 	= App.data.user.rights;
				var isSuperAdmin 	= listUserRight.includes(RIGHT_A_M) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_MOD)

				let objData = data.reduce((currentObj, item) => {
					if (item.uId == App.data.user.id) item.isOwner = true;

					item.notModif = isSuperAdmin;

					if (!!item.mem) currentObj[item.uId] = item;
					return currentObj;
				}, {});

				initialValues.members = objData;
				do_lc_build_table_member();

			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		};

		const do_lc_customLst_user_autocomplete = function(item, selOpt = "") {
			if (!item.avatar) {
				let first 		= item.login01.charAt(0);
				let last 		= item.login01.charAt(item.login01.length - 1);
				let index 		= var_gl_alphabet.indexOf(first.toLowerCase());

				let textColor 	= var_gl_colors[index];
				let textAvatar 	= first + last;

				selOpt += `<div class="media align-items-center"><div class="rounded-circle avatar-xs text-white text-uppercase text-center mr-2" style="background-color: ${textColor}"><div class="text-middle">${textAvatar}</div></div> ${item.login01}</div>`;
			} else {
				selOpt += `<div class="media align-items-center"><img src='${item.avatar.urlPrev ? item.avatar.urlPrev : item.avatar.url}' class='rounded-circle avatar-xs mr-2'/> ${item.login01}</div>`;
			}
			return selOpt;
		};

		const do_lc_save_member = function(members, idGroup) {
			const ref = req_gl_Request_Content_Send_With_Params( pr_SERVICE_CLASS_NSO_GROUP, pr_SV_MEMBER_SAVE,
				{
					groupId: idGroup,
					members: JSON.stringify(Object.values(pr_MEM_TEMP)),
				}
			);

			let fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_save_member_callback, [members, idGroup]));

			let fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		};

		const do_lc_save_member_callback = function(sharedJson, members, idGroup) {
			if (can_gl_AjaxSuccess(sharedJson)) {
				initialValues.members = pr_MEM_TEMP;
				do_lc_build_table_member();
				do_gl_show_Notify_Msg_Success($.i18n("common_success_update"));
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_msg_get"));
			}
		};

		var do_lc_bindEvent_tabMemberEdit = function(memid, divLev) {
			$(divLev).off("change").on("change", function() {
				pr_MEM_TEMP[memid].typ = $(this).val();
			});
		};
	};

	return EntMember;
});
