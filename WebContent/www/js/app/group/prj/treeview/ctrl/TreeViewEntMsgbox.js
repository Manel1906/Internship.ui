define([
	'text!group/prj/treeview/tmpl/PrjTreeView_Ent_Msgbox.html',
	'text!group/prj/treeview/tmpl/PrjTreeView_Ent_Msgbox_Mem.html',
	'text!group/prj/treeview/tmpl/PrjTreeView_Ent_Msgbox_Header.html',
	], function(
			PrjTreeView_Ent_Msgbox,
			PrjTreeView_Ent_Msgbox_Mem,
			PrjTreeView_Ent_Msgbox_Header
	){
	var TreeViewEnt = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_TREE_VIEW		= "SVPrjTreeView";
		
		const pr_SV_SAVE_MEMBER_ROLE  ="SVSaveMemberRole";

		const typeSearch = true;
		const initialValues = {
				id            : null,
				prjMain       : null,
				prjSearch     : null,
		}
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 							= App.controller.DBoard.DBoardMain;
			tmplName.PRJ_TREEVIEW_ENT_MSGBOX		= "PrjTreeView_Ent_Msgbox";
			tmplName.PRJ_TREEVIEW_ENT_MSGBOX_MEM	= "PrjTreeView_Ent_Msgbox_Mem";
			tmplName.PRJ_TREEVIEW_ENT_MSGBOX_HEADER	= "PrjTreeView_Ent_Msgbox_Header";
		}

		const do_lc_load_view = () => {	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX		, PrjTreeView_Ent_Msgbox);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX_HEADER, PrjTreeView_Ent_Msgbox_Header); 
		}
		
		const do_lc_load_view_mem = () => {	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX_MEM	, PrjTreeView_Ent_Msgbox_Mem);
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX_HEADER, PrjTreeView_Ent_Msgbox_Header); 
		}

		this.do_lc_show_with_id = (id, grp, code) => {
			do_lc_init_values(id, grp, code);
			do_lc_load_view();
			do_lc_build_page();
			do_lc_get_treeview(id, grp, code);
		}
		this.do_lc_show_with_mem_id = (menid, id, grp, code) => {
			do_lc_init_values(id, grp, code);
			do_lc_load_view_mem();
			do_lc_build_page_mem();
			do_lc_get_treeview_mem(menid, id, grp, code);
		}

		const do_lc_init_values = (id, grp, code) => {
			initialValues.id = id;
			initialValues.grp = grp;
			initialValues.code = code;
		}
		
		const do_lc_build_page_mem = () => {
				App.MsgboxController.do_lc_show({
					title		: "",
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX_HEADER,{} ),	
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("common_btn_save"),
							funct	: do_lc_save_uRole,
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});	

			do_lc_bind_event_header();
		}

		const do_lc_build_page = () => {
			App.MsgboxController.do_lc_show({
				title 		: "",
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX_HEADER, {}),
				autoclose	: false,
				buttons 	: {
					UPDATE : {
						lab 		: $.i18n("common_btn_ok"),
						classBtn	: "btn-primary",
					}
				}
			});

			do_lc_bind_event_header();
		}

		const do_lc_bind_event_header = () => {
			$(".inp_search_task").off("keyup").keyup(function(){
				let searchkey = $(this).val().toLowerCase();

				do_gl_execute_debounce(()=> {
					searchkey = do_lc_nomalize(searchkey).toLowerCase();
					const data = searchkey === 0 ? initialValues.prjMain : do_lc_filter_data(searchkey);
					do_lc_show_page(data, initialValues.id, typeSearch, searchkey);
				});
			});
		}

		const do_lc_get_treeview = (id, grp, code) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_TREE_VIEW, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getTree_response, [id, grp]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_getTree_response = (sharedJson, id, grp) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data              = sharedJson[App['const'].RES_DATA];
				initialValues.prjMain 		= data;
				do_lc_show_page(data, id);
			} else {   
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
			}
		}
		
		const do_lc_get_treeview_mem = (memid, id, grp, code) => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_TREE_VIEW, {id, code});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getTree_response_mem, [memid, id, grp]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_getTree_response_mem = (sharedJson, memid, id, grp) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data              = sharedJson[App['const'].RES_DATA];
				initialValues.prjMain 		= data;
				
				do_lc_show_page_mem(memid, data, id);
			} else {   
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
			}
		}
		
		const do_lc_filter_data = (sKey) => {
			const prjSearch      = {...initialValues.prjSearch};
			const data         = prjSearch.epics;
			prjSearch.epics      = do_lc_filter_name(data, sKey);
			return prjSearch;
		}
		function do_lc_filter_name(data, sKey) {
			return data.map(item => {		  
			  if (item.epics && item.epics.length > 0) {
				item.epics = do_lc_filter_name(item.epics, sKey);
			  }
		  
			  return item;
			}).filter(item => do_lc_nomalize(item.name).includes(sKey) || (item.epics && item.epics.length > 0));
		  }

		const do_lc_show_page = (prj, id, typeSearch, searchkey) => {
			initialValues.prjSearch = {...initialValues.prjMain};
			do_lc_show_treeview_msgbox(prj);

			$("#div_tree_prj").treed();
			do_lc_display_child(id, typeSearch, searchkey);
			do_lc_bind_event(prj, id, typeSearch);
		}
		const do_lc_show_page_mem = (memid, prj, id, typeSearch, searchkey) => {
			initialValues.prjSearch = {...initialValues.prjMain};
			do_lc_show_treeview_msgbox_mem(memid, prj);

			$("#div_tree_prj").treed();
			do_lc_display_child(id, typeSearch, searchkey);
		}
		const do_lc_show_treeview_msgbox_mem = (memid, prj) => {
            prj['memid']= memid;
            do_lc_build_uRole(memid, prj);
		
			let title =  $.i18n("prj_project_member_role");
			$("#div_content_tree").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX_MEM, prj));
			$(".modal-title").html(title);
			
		}
		const do_lc_build_uRole = (memid, prj) => {
			const filteredMembers = prj.members?prj.members.filter(member => member.entId02 === memid):[];
			if (filteredMembers.length > 0) {
	           prj.uRole = filteredMembers[0];
	        }else  {
	           prj.uRole =  {"lev": -1};
	        }	
	        if (prj.epics){
				for (var i in prj.epics){
					do_lc_build_uRole(memid, prj.epics[i]);
				}	
			}
		}
		
		var do_lc_save_uRole = function(){
			var data = req_gl_data({
					dataZoneDom: $(".card-body")
				});
		
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_SAVE_MEMBER_ROLE, {id: data.data.id, code: data.data.code01, uId: data.data.memid, members: JSON.stringify(Object.values(data.data.members))} );

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_after_save_uRole, []));
			
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_after_save_uRole = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				App.MsgboxController.do_lc_close();
				do_gl_show_Notify_Msg_Success 	($.i18n('common_success_update'));
			}
		}

		const do_lc_show_treeview_msgbox = (prj) => {
			let title = prj.typ00 === 0 ? $.i18n("prj_treeview_project_title") : prj.typ00 === 1 ? $.i18n("prj_treeview_data_title") : "";
			$("#div_content_tree").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEVIEW_ENT_MSGBOX, prj));
			$(".modal-title").html(title);
			
		}
		const do_lc_display_child = (id, typeSearch, searchkey) =>{
			if(typeSearch && searchkey.length >0){
				$("#div_content_tree").find("ul").children().show();
			}else if(typeSearch){
				$(".branch").has("li[data-id='" + id + "']").click();
			}
		}
		const do_lc_bind_event = (prj, id, typeSearch) => {
			if(!typeSearch) $(".branch").has("li[data-id='" + id + "']").click();

			App.router.controller.do_lc_binding_route()
		}
		
		var do_lc_nomalize = (str) => {
			return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
		}
	};

	return TreeViewEnt;
});