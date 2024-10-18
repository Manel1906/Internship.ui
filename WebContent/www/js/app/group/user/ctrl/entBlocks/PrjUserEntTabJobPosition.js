define([
	'text!group/user/tmpl/PrjUser_Ent_Tab_JobPosition.html'
	],
	function(	
			PrjUser_Ent_Tab_JobPosition
	){
	
	var PrjUserEntTabJobPosition = function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;		
		var pr_divFooter 			= footer  ? footer : null;
		
		const pr_divTabDocs			= "#div_prj_docs";
		const pr_divContent 		= "#div_user_content";
		const pr_divTabPerInfo 		= "#div_user_info_person";
		const pr_divTabJobPosition	= "#div_user_position";

		//------------------------------------------------------------------------------------
		var pr_ctr_Main 			= App.controller.UI.Main;
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//var url_header				= req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);
		
		tmplName.PRJ_USER_ENT_TAB_JOBPOSITION				= "PrjUser_Ent_Tab_JobPosition";
		
		var do_Get_Pos_Position = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceJobPosition', 'SVJobPositionLst');
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(App, App.funct.put, ['JobPositions']));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(prj, mode){               
			try{
				do_Get_Pos_Position();
				if(!App.data["JobPositions"]){
					setTimeout(function(){self.do_lc_show(prj, mode)}, 1000);
					console.log("do_lc_show is not ready");
					return;
				}
				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if (params.id){
					do_lc_load_view();
					do_lc_show_prj(prj, mode);
				}
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}
		
		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_ENT_TAB_JOBPOSITION			, PrjUser_Ent_Tab_JobPosition);
		}	
		
		var do_lc_show_prj = function(prj, mode){
			let checked_pos = do_check_user_position(prj);
			$(pr_divTabJobPosition).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_ENT_TAB_JOBPOSITION, checked_pos));
			
			let divAction = $("#a_btn_save, #a_btn_cancel, #div_prj_ent_file_upload, .action-item-doc, .item-file-delete");
			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
				do_gl_enable_edit($(pr_divTabJobPosition), ".objData", mode);
				divAction.removeClass("hide");
			} else {
				do_gl_disable_edit($(pr_divTabJobPosition), ".objData", mode);
				divAction.addClass("hide");
			}
			
			do_lc_bind_event_content_prj(prj);
		}
		
		var do_check_user_position = function(obj) {
			var pos 	= $.extend(true, {}, App.data["JobPositions"]);
			var userPos = obj.pos;
			$.each(pos, function(i, e) {
				$.each(userPos, function(iu, eu) {
					if(eu.id == e.id) {
						e.check = 1;
					}
				});
			});
			if(pos.remove)
				delete pos.remove
			return pos;
		}
		
		var do_lc_bind_event_content_prj = function(prj){
			
		}
	}
	
	return PrjUserEntTabJobPosition;
});