define([
	'group/tpy/cat_test_img/ctrl/TpyTestImgLst',
	'group/tpy/cat_test_img/ctrl/TpyTestImgMember',
	
	'text!group/tpy/cat_test_img/tmpl/TpyTestImg_Main.html',
	], function(
			TpyTestImgList,
			TpyTestImgMember,

			TpyTestImg_Main) {

	var TpyTestImgMain     		= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName?grpName:((new Date()).getTime()+"");
		var pr_grpPath				= 'group/tpy/cat_test_img';
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
			if (!App.controller.TpyTestImg) App.controller.TpyTestImg = {};
			
			
			if (!App.controller.TpyTestImg.List)  
				App.controller.TpyTestImg.List				= new TpyTestImgList		(null, null, null);
			
			if (!App.controller.TpyTestImg.Member)  
				App.controller.TpyTestImg.Member				= new TpyTestImgMember	(null, null, null);
			
			
			App.controller.TpyTestImg.List					.do_lc_init();
			App.controller.TpyTestImg.Member					.do_lc_init();
			
			tmplName.TPY_CAT_DISEASE_MAIN = "TpyTestImg_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.TPY_CAT_DISEASE_MAIN, TpyTestImg_Main); 
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
				
				
				$("#div_main_content")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TPY_CAT_DISEASE_MAIN, {}));

				App.controller.TpyTestImg.List.do_lc_show();
				$(document).prop('title',$.i18n('prj_project_sidebar_user_grp'));

			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "PrjUserGroupMain", "do_lc_show", e.toString()) ;
			}
		};
		
	};

	return TpyTestImgMain;
});