define([
        'jquery',
        
        'text!group/auth/tmpl/Usr_New_Confirm.html'
        
        ],
        function($,         		
        		Usr_New_Confirm
        ) {

	var PrjUsrNewConfirm 	= function (header, content, footer) {
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
			tmplName.USR_NEW_CONFIRM = "usr_new_confirm";
			
			var header 		= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
			if (header==null)
			header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			App.data.user.headerURLSecu =  header;
		}
		
		
		this.do_lc_show = function(){
			try { 
				$(App.constHTML.id.HEADER_VIEW).hide();
				$(App.constHTML.id.FOOTER_VIEW).hide();
				
				tmplCtrl.do_lc_put_tmpl(tmplName.USR_NEW_CONFIRM , Usr_New_Confirm);  
				
				var data = {};
				var params = req_gl_GetURLParameter(['login', 'code']);
				if (params!=null) {
					var login 	= params['login'];
					var code 	= params['code'];
					
					if (!login || !code) window.location.reload();
					
					data = {"login" : login, "code" : code};
				}else{
					window.location.reload();
				}
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.USR_NEW_CONFIRM, data));	
				
				do_Bindings(data);
					
			} catch(e) {
				console.log(e);
			}
		};	

		//---------private-----------------------------------------------------------------------------
		function do_Bindings(data) {
			$("#txtNewPassword").keyup(function() {
				doCheckPassword();
			});
			
			
			$("#btn_Submit").off('click');
			$("#btn_Submit").on('click' , function(){
				if(pr_checkPasswordChange) {
					data.pwd	= $("#txtNewPassword").val();
					
					doNewConfirm_Ajax(data);
				} else {
					do_gl_show_Notify_Msg_Warn($.i18n("common_error_msg") );
				}
			});
				
		}
		
		//--------------------------------------------------------------------------------------------
		function doNewConfirm_Ajax(data) {
			var sId			= -1;
			
			var hash		= rq_gl_Crypto(data.pwd);
			var tok			= rq_gl_Crypto(hash+sId);
			
			var ref = req_gl_Request_Content_Send('ServiceAuthentification','SVValidation01');
			ref["user_login"]	= data.login;
			ref["user_code"]	= data.code;
			
			ref["user_tok"	] 	= tok; 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, doNewConfirm_Ajax_Response, []));

			var fError 		= req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("content_register_confirm_error") ]);	
			var header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError) ;	
		}
		
		//--------------------------------------------------------------------------------------------
		function doNewConfirm_Ajax_Response(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {				
				
				do_gl_show_Notify_Msg_Success 	($.i18n("content_register_confirm_success") );	
				setTimeout(function() {
					//go to home
					window.open(HOME_URL_PATH, "_self");
				}, 1500);
				
			} else {   
				do_gl_show_Notify_Msg_Error 	($.i18n("content_register_confirm_error") );
			}
		}
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		function doCheckPassword() {
			var password = $("#txtNewPassword").val();

			if (password.length == 0) {
				$("#divCheckPassword").html($.i18n("msg_notify_validate_change_pass"));
				pr_checkPasswordChange = false;
			} else {
				pr_checkPasswordChange = true;
				$("#divCheckPassword").empty();   
			}
		}
	};

	return PrjUsrNewConfirm;
  });