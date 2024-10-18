define([
	'text!group/user_profile/tmpl/PrjUser_Profile_Ent_Pass.html'
	],
	function(	
			PrjUser_Profile_Ent_Pass
	){

	var PrjUserProfileEntPass 	= function (grpName, header, content, footer) {
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_pass";
		var pr_divFooter 			= footer  ? footer : null;
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var self 					= this;
		//var url_header				= req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL);

		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 1000;
		const pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		const pr_SV_GET				= "SVAutUserGet"; 
		var pr_SV_NEW				= "SVAutUserNew"; 
		var pr_SV_DEL				= "SVAutUserDel"; 

		var pr_SV_MOD				= "SVAutUserMod"; 	//if not use lock

		var pr_SV_LCK_NEW			= "SVAutUserLckReq";
		var pr_SV_LCK_END			= "SVAutUserLckEnd";
		var pr_SV_LCK_DEL			= "SVAutUserLckDel";
		//------------------const object------------------------------------------------------
		const typeUserClient		= 1010002;
		const societeListCompany	= 1010010;
		const societeListChild		= 1010011;
		const societePartnerSupp	= 1010003;
		const societePartnerOther	= 1010006;
		//-----------------------------------------------------------------------------------
		var pr_right_soc_manage		= [30002001, 30002002, 30002003, 30002004, 30002005];

		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.UI.Main;
			tmplName.PRJ_USER_PROFILE_ENT_PASS				= "PrjUser_Profile_Ent_Pass";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, type01, type02){               
			try{
				do_lc_load_view();
				do_lc_show_changePWD();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		};

		var do_lc_load_view = function(){			
			tmplCtrl.do_lc_put_tmpl(tmplName.PRJ_USER_PROFILE_ENT_PASS		, PrjUser_Profile_Ent_Pass);
		}

		var do_lc_show_changePWD = function(prj, mode){
			do_lc_show_changePWD_content(prj, mode);
		}

		var do_lc_cancel_change = function (prj){
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
			do_lc_show_changePWD(prj, App.data.mode);
		}

		var do_lc_show_changePWD_content = function(prj, mode){
			$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_USER_PROFILE_ENT_PASS, {}));

			if(mode == pr_ctr_Main.var_lc_MODE_MOD){
				$("#a_btn_pass_save, #a_btn_pass_calcel").removeClass("hide");
				$("#a_btn_pass_edit").addClass("hide");

				do_gl_enable_edit($(pr_divContent), ".objData", mode);

			} else {
				$("#a_btn_pass_save, #a_btn_pass_calcel").addClass("hide");
				$("#a_btn_pass_edit").removeClass("hide");

				do_gl_disable_edit($(pr_divContent));
			}

			do_lc_bind_event_content_prj(prj);
		}

		var do_lc_bind_event_content_prj = function(prj){
			$("#a_btn_pass_edit").off('click').click(function(){
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_MOD;				
				do_lc_show_changePWD(prj, App.data.mode);
			});	

			$("#a_btn_pass_save").off("click").on("click", function(){
				let	data	= req_gl_data({
					dataZoneDom		: $(pr_divContent)
				});

				if(data.hasError)	return false;

				if(data.data.newPwd == data.data.newPwdConf){
					do_lc_password_mod(rq_gl_Crypto(data.data.oldPwd), rq_gl_Crypto(data.data.newPwd))
				}else{
					do_gl_show_Notify_Msg_Error($.i18n("aut_profile_difference_pwd"));
				}
			})

			$("#a_btn_pass_calcel").off("click").on("click", function(){
				do_lc_cancel_change(prj);
			})
		};

		//-----------------------------------------------------------------------------------------
		var do_lc_password_mod = function(pwd_old, pwd_new) {
			var ref 			= req_gl_Request_Content_Send('ServiceAuthentification','SVPwdMod');	
			ref["user_login"]	= App.data.user.login;
			ref["user_tok"]		= rq_gl_Crypto(pwd_old+App.data.session_id);
			ref["user_pwd"]		= pwd_new; 

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lc_password_mod_callback, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_lc_password_mod_callback = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				do_gl_show_Notify_Msg_Success 	($.i18n("aut_profile_change_pwd_success") );			
			} else {   
				do_gl_show_Notify_Msg_Error 	($.i18n("aut_profile_change_pwd_error") );
			}

			self.do_lc_show({}, pr_ctr_Main.var_lc_MODE_SEL);
		}
	};

	return PrjUserProfileEntPass;
});