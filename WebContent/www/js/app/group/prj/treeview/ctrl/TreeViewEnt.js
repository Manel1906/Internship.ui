define([
	'text!group/prj/treeview/tmpl/PrjTreeView_Ent.html',
	], function(
		PrjTreeView_Ent
	){
	var TreeViewEnt = function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SV_TREE_VIEW		= "SVPrjTreeView"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 					= App.controller.UI.Main;
			tmplName.PRJ_TREEVIEW_ENT		= "PrjTreeView_Ent";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(id){               
			try{
				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if(!id) id = params.id;
				if (id){
					do_lc_load_view();
					do_lc_get_treeview(id);
				}else{
					pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.project", "TreeViewEnt", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {	
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_TREEVIEW_ENT, PrjTreeView_Ent); 
		}
		
		const do_lc_get_treeview = id => {
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_TREE_VIEW, {id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getTree_response, [id]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_getTree_response = (sharedJson, id) => {
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				do_lc_transfert_data(data, id);
			} else {   
				pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_list.html`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_LIST);
			}
		}
		
		const do_lc_transfert_data = (data, id) => {
			let prjInd 	= data.findIndex(prj => prj.id === prj.grp);
			let prj 	= data[prjInd];
			data.splice(prjInd, 1);
			
			let mapPrj 	= new Map();
			
			for(let p of data){
				let isExist = mapPrj.has(p.parent);
				isExist ? mapPrj.get(p.parent).push(p) : mapPrj.set(p.parent, [p]);
				p["isShow"] = p.id == id ? true : false;
			}
			
			for (let child of mapPrj.values()) {
				child.sort((a, b) => {
					if(a.typ02 !== b.typ02)	return a.typ02 - b.typ02;
					let nameA = a.name.trim().toLowerCase(), nameB = b.name.trim().toLowerCase();
					return nameA > nameB ? 1 : nameA < nameB ? -1 : 0 ;
				})
			}
			
			const addTree = pItem => {
				if(mapPrj.has(pItem.id)){
					pItem["childs"] = mapPrj.get(pItem.id);
					for(let item of pItem["childs"]){
						addTree(item);
					}
				}
			}
			
			addTree(prj);
			do_lc_show_page(prj, id);
		}
		
		const do_lc_show_page = (prj, id) => {
			$("#div_main_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_TREEVIEW_ENT, prj));
			$("#div_tree_prj").treed();
			do_lc_bind_event(prj, id);
		}

		const do_lc_bind_event = (prj, id) => {
			$(".branch").has("li[data-id='" + id + "']").click();
			
			$(".prj-item").on("click", function(e){
				if (e.target !== this)	return;
				    
				let {id, code, typ00} = $(this).data();
				
				if(typ00 && typ00 == 1) id && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_file_content.html?id=${id}&code=${code}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [id]);
				else id && pr_ctr_Main.do_lc_switch_mobile_or_pc(`view_prj_project_content.html?id=${id}&code=${code}`, "VI_MAIN/"+ App.router.part.PRJ_PROJECT_ENT, [id]);
			})
		}
	};

	return TreeViewEnt;
});