define([
	'group/user_group/ctrl/PrjUserGroupList',
	'group/user_group/ctrl/PrjUserGroupMember',
	
	'text!group/user_group/tmpl/PrjUserGroup_Main.html',
	], function(
			PrjUserGroupList,
			PrjUserGroupMember,

			PrjUserGroup_Main) {

	var PrjUserGroupMain     		= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var pr_grpPath				= 'group/user_group';
		App.template.names[pr_grpName] = {}; //---init only one time in Main ctrl
		
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;		
		//------------------------------------------------------------------------------------

		var var_lc_TYPE_SHOW        = null;
		var var_lc_GROUP_ID         = null;

		var RIGHT_U_S	        	= 1000005;
		var RIGHT_ADM	        	= 100;
		var RIGHT_A_S	        	= 105;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if(!tmplName) {
				App.template.names[pr_grpName] = {}
				tmplName = App.template.names[pr_grpName]
			}
			if (!App.controller.PrjUserGroup) App.controller.PrjUserGroup = {};
			
			
			if (!App.controller.PrjUserGroup.List)  
				App.controller.PrjUserGroup.List				= new PrjUserGroupList		(null, null, null);
			
			if (!App.controller.PrjUserGroup.Member)  
				App.controller.PrjUserGroup.Member				= new PrjUserGroupMember	(null, null, null);
			
			
			App.controller.PrjUserGroup.List					.do_lc_init();
			App.controller.PrjUserGroup.Member					.do_lc_init();
			
			tmplName.PRJ_USER_GROUP_MAIN = "PrjUserGroup_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.PRJ_USER_GROUP_MAIN, PrjUserGroup_Main); 
		}     
		
		this.do_lc_show = function(){
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				
				var listUserRight = App.data.user.rights;
				if(!listUserRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
				
				var isRight = listUserRight.includes(RIGHT_A_S) || listUserRight.includes(RIGHT_ADM) || listUserRight.includes(RIGHT_U_S)
				if(!isRight){
					do_gl_show_Notify_Msg_Error($.i18n("prj_project_not_right_view"));
					return;
				}
				
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_GROUP_MAIN, {}));

				App.controller.PrjUserGroup.List.do_lc_show();
				$(document).prop('title',$.i18n('prj_project_sidebar_user_grp'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjUserGroupMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return PrjUserGroupMain;
});