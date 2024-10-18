define([
        'jquery',
        
        'text!group/auth/tmpl/Usr_Pw_Reset.html'
        
        ],
        function($,         		
        		Usr_Pw_Reset
        ) {

	var PrjUsrPwReset 	= function (header, content, footer) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
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
		
		//------------------controllers------------------------------------------------------
		//------------------------------------------------------------------------------------
		var pr_checkPasswordChange	= false;
		
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.USR_PW_RESET	= "Usr_Pw_Reset";
		}
		
		
		this.do_lc_show = function(){
			try { 
				$("#page-topbar").hide();
				$("#div-menu-sidebar").hide();
				$(".main-content").css("margin", "unset");
				
				tmplCtrl.do_lc_put_tmpl(tmplName.USR_PW_RESET , Usr_Pw_Reset);  
					
				var data = {};
				var params = req_gl_Url_Params(App.data.url?App.data.url:decodeURIComponent(window.location.search.substring(1)));
				if (params!=null) {
					var login 	= params['login'];
					var code 	= params['code'];
					
					if (!login || !code) window.location.reload();
					
					data = {"login" : login, "code" : code};
				}else{
					window.location.reload();
				}
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.USR_PW_RESET, data));
				
				do_Bindings(data);
					
			} catch(e) {
				console.log(e);
			}
		};	

		//---------private-----------------------------------------------------------------------------
		function do_Bindings(data) {
			$("#txtNewPassword, #txtConfirmPassword").keyup(function() {
				doCheckRepeatPasswordMatch();
			});
			
			
			$("#btn_Submit").off('click');
			$("#btn_Submit").on('click' , function(){
				if(pr_checkPasswordChange) {
					data.pwd	= $("#txtNewPassword").val();
					
					doResetPwd_Ajax(data);
				} else {
					do_gl_show_Notify_Msg_Warn($.i18n("common_error_msg") );
				}
			});
				
		}
		
		//--------------------------------------------------------------------------------------------
		function doResetPwd_Ajax(data) {
			var ref = req_gl_Request_Content_Send('ServiceAuthentification','SVPwdReset');
			ref["user_name"]	= data.login;
			ref["user_code"]	= data.code;
			
//			var hash			= rq_gl_Crypto(data.pwd);
			ref["user_pwd"]		= rq_gl_Crypto(data.pwd); 
			
			var header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			var sId			= -1;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, doResetPwd_Ajax_Response, []));

			var fError 		= req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("cms_profile_reset_pwd_error") ]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError) ;	
		}
		
		//--------------------------------------------------------------------------------------------
		function doResetPwd_Ajax_Response(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				
				do_gl_show_Notify_Msg_Success 	($.i18n("cms_profile_reset_pwd_success") );	
				
				setTimeout(function() {
					//go to home
					window.open(HOME_URL_PATH, "_self");
				}, 1500);
				
			} else {   
				do_gl_show_Notify_Msg_Error 	($.i18n("cms_profile_reset_pwd_error") );
			}
		}
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		function doCheckRepeatPasswordMatch() {
			var password = $("#txtNewPassword").val();
			var confirmPass = $("#txtConfirmPassword").val();

			if (password.length == 0) {
				$("#divCheckPassword").html($.i18n("msg_notify_validate_change_pass"));
				pr_checkPasswordChange = false;
			} else {
				$("#divCheckPassword").empty();   
			}

			if (confirmPass.length == 0) {
				$("#divCheckPasswordMatch").html($.i18n("msg_notify_validate_change_confirm_pass"));
				pr_checkPasswordChange = false;
			}

			if(password.length > 0 && confirmPass.length > 0) {
				if(password == confirmPass) {
					$("#divCheckPasswordMatch").empty();
					pr_checkPasswordChange = true;	
				} else {
					$("#divCheckPasswordMatch").html($.i18n("msg_notify_validate_check_change_pass_match"));
					pr_checkPasswordChange = false;
				}
			}
		}
		
	};

	return PrjUsrPwReset;
  });