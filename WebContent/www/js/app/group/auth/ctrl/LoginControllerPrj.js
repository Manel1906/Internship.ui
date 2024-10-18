define(['jquery',        
	'text!group/auth/tmpl/Login_Content_Prj.html',
	'text!group/auth/tmpl/Register_Content_Prj.html',
	'text!group/auth/tmpl/Register_Content_Prj_Form_Client.html',
	'text!group/auth/tmpl/Register_Content_Prj_Form_Partner.html',
	'text!group/auth/tmpl/Register_Content_Prj_Form_Partner_02.html'
	
	],
	function($, Login_Content_Prj,
			Register_Content_Prj,
			Register_Content_Prj_Form_Client,
			Register_Content_Prj_Form_Partner,
			Register_Content_Prj_Form_Partner_02) {
	var LoginControllerPrj = function (FIRST_VIEW) {
		//---------------------------------------
		window.onbeforeunload = function (event) {
			doCloseSecuritySession(App.keys.KEY_STORAGE_CREDENTIAL);
			return null;
		};
		//---------------------------------------
		this.viewAfter	= FIRST_VIEW;

		var tmplName		= App.template.names;
		var tmplCtrl		= App.template.controller;
		var self 			= this;

		
		var svClass 		= AppCommon['const'].SV_CLASS;
		var svName			= AppCommon['const'].SV_NAME;
		var sessId			= AppCommon['const'].SESS_ID;
		var fVar			= AppCommon['const'].FUNCT_SCOPE;
		var fName			= AppCommon['const'].FUNCT_NAME;
		var fParam			= AppCommon['const'].FUNCT_PARAM;

		var pr_tok			= false;

		var pr_checkPasswordSignin	= false;
		var pr_checkUsernameSignin 	= false;

		var pr_new_obj_default		= {
				typ : 5,
				per : {
					typ01 : 0,
					typ02 : 0
				}
		}

		var TYP_01_MORAL    			= 1000001;
		var TYP_02_TPARTY 				= 1010006;
		var TYP_02_SUPPLIER 			= 1010003;
		var STAT_NOT_VALIDATED 			= 0;
		var pr_checkPasswordRegister 	= false;

		var pr_TIME_REFRESH_LOGIN		= 25*60*1000;
		var pr_setTime_refresh_login	= null;

		this.do_lc_show = function(savTok){
			do_lc_appVersion();
			
			pr_tok	= savTok;

			self.do_lc_Login_Guest();
			doBuildPage();
		};

		doBuildPage = function() {
			self.do_lc_Logout();
			
			if(FIRST_VIEW == "prj_usr_reset") {
				let dataParams = {
						nameGroup	: "PrjUsr"											, name			: "PwReset", 
						path		: "group/auth/ctrl/PrjUsrPwReset"					, initParams	: [null, "#login_page" , null], 
						fInit		: "do_lc_init"										, fInitParams	: [],
						fShow		: "do_lc_show"										, fShowParams	: [],
						fCallBack	: function(){}
						}
				
				do_gl_load_JSController_ByRequireJS(App.controller, dataParams);
				
			}else if(FIRST_VIEW == "prj_usr_new_confirm") {
				let dataParams = {
						nameGroup	: "PrjUsr"											, name			: "NewConfirm", 
						path		: "group/auth/ctrl/PrjUsrNewConfirm"				, initParams	: [null, "#login_page" , null], 
						fInit		: "do_lc_init"										, fInitParams	: [],
						fShow		: "do_lc_show"										, fShowParams	: [],
						fCallBack	: function(){}
						}
				
				do_gl_load_JSController_ByRequireJS(App.controller, dataParams); 	
				
			}else if(FIRST_VIEW == "prj_usr_new_confirm_simple") {
				let dataParams = {
						nameGroup	: "PrjUsr"											, name			: "NewConfirmSimple", 
						path		: "group/auth/ctrl/PrjUsrNewConfirmSimple"			, initParams	: [null, "#login_page" , null], 
						fInit		: "do_lc_init"										, fInitParams	: [],
						fShow		: "do_lc_show"										, fShowParams	: [],
						fCallBack	: function(){}
						}
				
				do_gl_load_JSController_ByRequireJS(App.controller, dataParams); 
				
			}else{
				$("#layout-wrapper, #right-bar, #rightbar-overlay").html("");

				tmplCtrl.do_lc_put_tmpl(tmplName.LOGIN_CONTENT_PRJ, Login_Content_Prj);             
				var compiledContent = tmplCtrl.req_lc_compile_tmpl (tmplName.LOGIN_CONTENT_PRJ, {"version" : appVersion});                

				$("#login_page")		.html(compiledContent);

				bindingEventsPage();
				doForgotPassWord();
			}
		};

		var submit = function () {  
			if(pr_checkUsernameSignin && pr_checkPasswordSignin) {
				//logout everything first
				self.do_lc_Logout();

//				App.network.startLoader();
				var remember = false;		
				if ( $("#inp_remember").is(":checked") ) remember = true;
				self.do_lc_Login(null, null, self.viewAfter, remember);   
//				App.network.stopLoader();  
			} else {
				do_gl_show_Notify_Msg_Error($.i18n ("login_err_authentification"));	
			}

		}.bind(this);


		
		
		//comment: server encode, client decode
		this.do_lc_Login = function (cacheHeader, login, view , remember){
			var username 	= login !=null? login 													: $("#inp_Username").val().trim();		
			var password 	= cacheHeader ? req_gl_Security_Token(App.keys.KEY_STORAGE_CREDENTIAL)  : $("#inp_Password").val();

			var	newConn		= true;			
			var header 		= "";
			var headerConn	= "";
			var hash		= "";
			var tok			= "";
			var sId			=  0;

			if (cacheHeader){
				newConn		= false;
				header		= cacheHeader;
				headerConn 	= cacheHeader;
				hash		= password;
				sId			= req_gl_Security_Session(App.keys.KEY_STORAGE_CREDENTIAL);
				tok			= hash;
			}else{
				do_gl_Security_HttpHeader_Clear();
				
				newConn		= true;
				header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
				headerConn 	= req_gl_Security_HttpHeader_New (username, password);
				hash		= rq_gl_Crypto(password);
				sId			= - (Math.floor(Math.random() * 1000) + 1);
				tok			= rq_gl_Crypto(hash+sId);
				if (pr_tok) do_gl_Security_Token_Ini_Save(App.keys.KEY_STORAGE_CREDENTIAL, tok);
			}	


			var ref 			= {};
			ref[svClass		] 	= "ServiceAuthentification"; 
			ref[svName		]	= "SVGetUserProfile"; 	//return user with rights + sessionId
			ref[sessId		]	= sId;  			//App.data.session_id;
			ref["user_login"] 	= username; 
			ref["user_tok"	] 	= tok; 

			var fSucces		= [];
			var f01 = {}; 	f01[fVar]	= App ; 	f01[fName] = App.funct.put;	f01[fParam]=['user'];
			var f02 = {}; 	f02[fVar]	= null; 	f02[fName] = loadCMS;		f02[fParam]=['user', headerConn, view, newConn, remember, hash];
			fSucces.push(f01);
			fSucces.push(f02);

			var fError 		= {};
			fError[fName] 	= reset; fError[fParam]  = [];

//			console.log ("Login:"+ hash + "  " + sId + " " + tok);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError) ;	
			
			//---refresh to keep connection
			do_lc_Login_Interval(username, hash);
		}

		//-------------------------------------------------------------------------------------------
		var do_lc_Login_Interval = function (login, hashPass){
			pr_setTime_refresh_login && clearInterval(pr_setTime_refresh_login); // clear interval

			pr_setTime_refresh_login = setInterval(() => { //and reset interval
				do_lc_Login_Refresh(login, hashPass); 				
			}, pr_TIME_REFRESH_LOGIN);
		}
		
		var do_lc_Login_Refresh = function (login, hashPass){
			if (!login||!hashPass) return;
			
			var header 		= req_gl_Security_HttpHeader (App.keys.KEY_STORAGE_CREDENTIAL);
			var sId			= - (Math.floor(Math.random() * 1000) + 1);
			var tok			= rq_gl_Crypto(hashPass+sId);
			
			if (!header) return;
			
			var ref 			= {};
			ref[svClass		] 	= "ServiceAuthentification"; 
			ref[svName		]	= "SVGetUserProfile"; 	
			ref[sessId		]	= sId;  			
			ref["user_login"] 	= login; 
			ref["user_tok"	] 	= tok; 

			var fSucces		= [];
			var f01 = {}; 	f01[fVar]	= App ; 	f01[fName] = App.funct.put				;	f01[fParam]=['user'];		
			var f02 = {}; 	f02[fVar]	= null ; 	f02[fName] = do_lc_Login_Refresh_After	;	f02[fParam]=[header, hashPass];		
			fSucces.push(f01);	
			fSucces.push(f02);	

			var fError 		= {};
			fError[fName] 	= reset; fError[fParam]  = [];

//			console.log ("Login_Refresh:"+ hashPass + "  " + sId + " " + tok);
			App.network.do_lc_ajax_bg_keepState (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError) ;	
		}
		
		var do_lc_Login_Refresh_After = function(shareJson, secuHeader, hashPass){
			//Save the user idman
			if(App.data.user.per) 
				localStorage.setItem("manId", App.data.user.per.parent);
			
			App.data.session_id 		= shareJson.session_id;
			App.data.user.headerURLSecu = req_gl_Security_HttpHeader (App.keys.KEY_STORAGE_CREDENTIAL);
			
			do_gl_Security_Login_Save	(App.keys.KEY_STORAGE_CREDENTIAL, secuHeader, App.data.user, App.data.session_id, true, hashPass)
		};

		
		//-------------------------------------------------------------------------------------------
		this.do_lc_Login_Guest = function (cacheHeader, view ){			
			var username 	= "visitor";		
			var password 	= "visitor";

			var	newConn		= true;			
			var header 		= "";
			var hash		= "";
			var tok			= "";
			var sId			= -1;
			var header 		= "";

			if (cacheHeader){
				header		= cacheHeader;
				newConn		= false;
				hash		= req_gl_Security_Token  (App.keys.KEY_STORAGE_CREDENTIAL);
				sId			= req_gl_Security_Session(App.keys.KEY_STORAGE_CREDENTIAL);
				tok			= hash;
			}else{
				do_gl_Security_HttpHeader_Clear();
				header 		= req_gl_Security_HttpHeader_New (username, password);
				newConn		= true;
				hash		= rq_gl_Crypto(password);
				tok			= rq_gl_Crypto(hash+sId);
			}	

			var ref 		= {};
			ref[svClass		] 	= "ServiceAuthentification"; 
			ref[svName		]	= "SVGetUserProfile_Guest"; 	//return user with rights + sessionId
			ref[sessId		]	= sId;  				//App.data.session_id;
			ref["user_login"] 	= username; 
			ref["user_tok"	] 	= tok ; 

			var fSucces		= [];
			var f01 = {}; 	f01[fVar]	= App ; 	f01[fName] = App.funct.put;	f01[fParam]=['user'];
			var f02 = {}; 	
			f02[fVar]	= null; 	
			
//			f02[fName] = loadCMS;
			
			f02[fParam]=['user', header, view, newConn, true, hash];
			
			fSucces.push(f01);
			fSucces.push(f02);

			var fError 		= {};
			fError[fName] 	= reset; fError[fParam]  = [];

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError) ;	
		}

		this.do_lc_Logout = function (){
			var ref 			= {};
			ref[svClass		] 	= "ServiceAuthentification"; 
			ref[svName		]	= "SVLogout"; 

			//var url_header		= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			if (url_header)
				App.network.do_lc_ajaxBackground (App.path.BASE_URL_API_PRIV, url_header, ref, 100000, null, null) ;	

			do_gl_Security_HttpHeader_Clear(App.keys.KEY_STORAGE_CREDENTIAL);

			if (!localStorage.language) localStorage.language = "en";		
//			self.do_lc_Login_Guest();
		}

		// Bind events in the page
		var bindingEventsPage = function() {             	
//			$("#frm_Login").validate({
//			submitHandler: submit
//			});

			//binding enter key for username and password input
			$("#inp_Username").keyup(function (e) {
				doCheckUsernameSignin();
				if (e.keyCode === 13)
					do_Signin();
			});	

			$('#inp_Username').on('input',function(e){
				$("#btn_Submit").attr("disabled", false);
//				$("#btn_Submit").removeClass("wygo-btn-selected");
			});

			//binding enter key for password input
			$("#inp_Password").keyup(function (e) {
				doCheckPasswordSignin();
				if (e.keyCode === 13) {
					submit();
				}
			});

			$("#btn_Submit").off("click").on("click", function () {
				doCheckUsernameSignin();
				doCheckPasswordSignin();
				submit();

			});

			$("#btn_register").off("click").on("click", function(){
				do_lc_showForm_register();
			})
			
			$(".login-language").off("click").on("click", function(){
				let {lan: language, lanid: languageId} 	= $(this).data();

				if (!language || !languageId) {
					if (localStorage && localStorage.language) {
						language 	= localStorage.language;
						languageId	= localStorage.languageId;
					} else {
						language 	= 'vn';
						languageId 	= 1;
					}
				}

				$.i18n({locale: language});
				localStorage.language 	= language;
				localStorage.languageId = languageId;
				window.location.reload();
			})

		}.bind(this);

		var reset = function(){
			do_gl_show_Notify_Msg_Error ($.i18n("login_err_authentification"));
			App.router.controller.do_lc_run(App.router.routes.CMS_MAIN);
			
//			localStorage.clear();				
			
		}

		var loadCMS = function(shareJson, nameVar, header, view, newConn, remember, hash){			
			//Check visitor / Guest denied access:
			if(self.can_lc_User_Guest() || self.can_lc_User_Client_Public()) {
				do_gl_show_Notify_Msg_Error($.i18n("common_access_deny_for_client_user"));
				App.router.controller.do_lc_run(App.router.routes.LOGOUT+'/'+App.router.routes.HOME_VIEW);
				return;
			}
			
			//Save the user idman
			if(App.data.user.per) 
				localStorage.setItem("manId", App.data.user.per.parent);
			
			if (App.data.user && App.data.user.per && App.data.user.per.info04) {
				if (typeof (App.data.user.per.info04) === "string") {
					let tmp = JSON.parse(App.data.user.per.info04);
					if (tmp && tmp.utc) {
						App.data.user.utcZone = parseFloat(tmp.utc);
					}
				}
			} 

			if (header==""||!header) header = req_gl_Security_HttpHeader (App.keys.KEY_STORAGE_CREDENTIAL);
			App.data.user.headerURLSecu = header;

			if (newConn) {
				var newHash = rq_gl_Crypto(hash+App.data.session_id);
				do_gl_Security_Login_Save		(App.keys.KEY_STORAGE_CREDENTIAL, header, App.data.user, App.data.session_id, remember, newHash)
			}else{
				do_gl_Security_Session_Open		(App.keys.KEY_STORAGE_CREDENTIAL);
			}
			
			if (view){
				App.router.controller.do_lc_run(view);
			}else{
				App.router.controller.do_lc_run(App.router.routes.HOME_VIEW);	
			}	
		};

		//--------------------------------------------------------------------------------------------------
		function doCheckUsernameSignin() {
			var content_login = $('#inp_Username').val();
			if (content_login.length == 0 ){
				$("#divCheckUserLogin").html($.i18n("msg_notify_validate_register_login"));
				pr_checkUsernameSignin = false;
				$("#inp_Username").css("border-color","#EB0D5B");

			} else{
				$("#divCheckUserLogin").empty();
				pr_checkUsernameSignin = true;
				$("#inp_Username").css("border-color","#ececec");
			}
		}

		//--------------------------------------------------------------------------------------------------
		function doCheckPasswordSignin() {
			var password = $("#inp_Password").val();

			if (password.length == 0) {
				$("#divCheckPassLogin").html($.i18n("msg_notify_validate_register_pass"));
				pr_checkPasswordSignin = false;
				$("#inp_Password").css("border-color","#EB0D5B");
			} else {
				$("#divCheckPassLogin").empty();   
				pr_checkPasswordSignin = true;
				$("#inp_Password").css("border-color","#ececec");
			}
		}

		//--------------------------------------------------------------------------------------------
		//check current user is visitor or client public
		this.can_lc_User_Guest = function() {
			return App.data.user.typ == 1;
		}
		//check current user is client public
		this.can_lc_User_Client_Public = function() {
			return App.data.user.typ == 5;
		}

		this.can_lc_User_SuperAdmin = function(){
			return App.data.user.typ == 10;
		}

		//--------------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------------

		function doForgotPassWord(){
			$("#id_btn_forget_pass").off("click").on("click",function(){
				if(pr_checkUsernameSignin){
					var obj_login = $('#inp_Username').val();
					doSendContentForgotPassWord(obj_login);
				}else{
					$("#divCheckUserLogin").html($.i18n("msg_notify_input_user_login"));
					$("#inp_Username").css("border-color","#EB0D5B");
				}	
			});
		}
		function doSendContentForgotPassWord(obj_login){

			var ref = req_gl_Request_Content_Send("ServiceAuthentification", "SVPwdResetReq");
			ref["user_login"] = obj_login;

			var header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor"); 

			var fSucces = [];		
			fSucces.push(req_gl_funct(null, showResultForgotPass, []));

			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, fError);			
		}

		function showResultForgotPass(sharedJson){
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n ("send_forgot_pass_succes"));	
				doBuildPage();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n ("send_forgot_pass_not_succes"));
			}			
		}

		//--------------------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------------
		
		var do_lc_showForm_register = function(){
			self.do_lc_Logout();

			$("#layout-wrapper, #right-bar, #rightbar-overlay").html("");
			tmplCtrl.do_lc_put_tmpl(tmplName.REGISTER_CONTENT_PRJ             , Register_Content_Prj); 

			$("#login_page")		.html(tmplCtrl.req_lc_compile_tmpl (tmplName.REGISTER_CONTENT_PRJ, {"version" : appVersion}));

			// do_bind_event_reg_partner();
			do_bind_event_reg_partner02();

			do_lc_bin_event_register();
		}
		
		var do_lc_bin_event_register = function(){

			$("#btn_login_view").off("click").on("click", function(){
				doBuildPage();
			})
			
			$("input[type=radio][name=optradio]").change(function () {
				if(this.value == "1"){
					do_bind_event_reg_client();
				} else if(this.value == "2") {
					do_bind_event_reg_partner();
				}
			});

			//-------------------------------------------------------------------
			$("#radUserPer").off("change");
			$("#radUserPer").change(function(){
				if ($(this).is(':checked') && $(this).val() == 'on'){
					doBindingInputParams("#idDocNumPer", 1);
					doBindingInputParams("#idDocNumOrg", 2);
				}
			});
			//-------------------------------------------------------------------
			$("#radUserOrg").off("change");
			$("#radUserOrg").change(function(){
				if ($(this).is(':checked') && $(this).val() == 'on'){
					doBindingInputParams("#idDocNumPer", 2);
					doBindingInputParams("#idDocNumOrg", 1);
				}
			});

		}

		function do_bind_event_reg_client(){
			tmplName.REGISTER_CONTENT_PRJ_FORM_CLIENT =  "Register_Content_Prj_Form_Client";
			tmplCtrl.do_lc_put_tmpl(tmplName.REGISTER_CONTENT_PRJ_FORM_CLIENT , Register_Content_Prj_Form_Client); 
			$("#form_register_detail").html(tmplCtrl.req_lc_compile_tmpl(tmplName.REGISTER_CONTENT_PRJ_FORM_CLIENT, {}));

			$("#txtNewPassword").keyup(function() {
				pr_checkPasswordRegister = can_lc_CheckRepeatPasswordMatch("#txtNewPassword", "#txtConfirmPassword","#divCheckPassword", "#divCheckPasswordMatch");
			});
			$("#txtConfirmPassword").keyup(function() {
				pr_checkPasswordRegister = can_lc_CheckRepeatPasswordMatch("#txtNewPassword", "#txtConfirmPassword","#divCheckPassword", "#divCheckPasswordMatch");
			});

			do_lc_checkNumber(".classDocNum");

			do_gl_init_datetimePlugin($("#form_register_detail"));
			$(".btn-show-subinfo p").off("click");
			$(".btn-show-subinfo p").on("click", function () {
				$(".sub_info").css("display","block");
				$(".btn-hide-subinfo").css("display","block");
				$(".btn-show-subinfo").css("display","none");
			});
			$(".btn-hide-subinfo p").off("click");
			$(".btn-hide-subinfo p").on("click", function () {
				$(".sub_info").css("display","none");
				$(".btn-hide-subinfo").css("display","none");
				$(".btn-show-subinfo").css("display","block");
			});
			$("#btn_Register").off("click");
			$("#btn_Register").on("click", function () {
				var obj_register = req_gl_data({
					dataZoneDom : $("#div_sendRegister")
				});

				if(obj_register.hasError){
					do_gl_show_Notify_Msg_Error($.i18n ("content_register_error"));
					return; 
				}

				pr_checkPasswordRegister = can_lc_CheckRepeatPasswordMatch("#txtNewPassword", "#txtConfirmPassword","#divCheckPassword", "#divCheckPasswordMatch");

				if(pr_checkPasswordRegister) {
					obj_register.data.pass 			= rq_gl_Crypto(obj_register.data.pass);
					obj_register.data				= $.extend(true, {}, obj_register.data, pr_new_obj_default);			
					obj_register.data.idDocNum		= obj_register.data.idDocNumPer;

					var objInfo04 = {	"i": obj_register.data.idDocNum	  ==undefined?null:obj_register.data.idDocNum,
										"d": obj_register.data.idDocDate  ==undefined?null:obj_register.data.idDocDate,
										"p": obj_register.data.idDocPlace ==undefined?null:obj_register.data.idDocPlace};

					obj_register.data.per.info04 = JSON.stringify(objInfo04);
					obj_register.data.per.info10 = obj_register.data.email;
					obj_register.data.typ        = "5" // typ user
					doRegisterUser(obj_register);
				} else {
					do_gl_show_Notify_Msg_Warn($.i18n ("content_register_not_validate_condition"));
				}	
			});
		}

		function do_bind_event_reg_partner02(){
			tmplName.REGISTER_CONTENT_PRJ_FORM_PARTNER_02 =  "Register_Content_Prj_Form_Partner_02";
			tmplCtrl.do_lc_put_tmpl(tmplName.REGISTER_CONTENT_PRJ_FORM_PARTNER_02, Register_Content_Prj_Form_Partner_02); 
			$("#form_register_detail").html(tmplCtrl.req_lc_compile_tmpl(tmplName.REGISTER_CONTENT_PRJ_FORM_PARTNER_02, {}));

			do_lc_checkNumber(".classDocNum");
			do_gl_init_datetimePlugin($("#form_register_detail"));

			$("#btn_Register").off("click");
			$("#btn_Register").on("click", function () {
				var obj_register = req_gl_data({
					dataZoneDom : $("#div_sendRegister")
				});

				if(obj_register.hasError){
					do_gl_show_Notify_Msg_Error($.i18n ("content_register_error"));
					return; 
				}

				obj_register.data				= $.extend(true, {}, obj_register.data, pr_new_obj_default);
				obj_register.data.idDocNum		= obj_register.data.idDocNumOrg;

				var objInfo04 = {	"i": obj_register.data.idDocNum==undefined?null:obj_register.data.idDocNum,
						"d": obj_register.data.idDocDate==undefined?null:obj_register.data.idDocDate,
								"p": obj_register.data.idDocPlace==undefined?null:obj_register.data.idDocPlace};
				obj_register.data.per.info04	= JSON.stringify(objInfo04);
				obj_register.data.per.typ01  	= TYP_01_MORAL;
				obj_register.data.per.typ02  	= TYP_02_TPARTY;
				
				obj_register.data.stat			= 2; // waiting validate
				obj_register.data.pass			= do_encryt_password(obj_register.data.pass);

				doRegisterPartner02(obj_register);
			});
		}

		var do_encryt_password = function(password) {
			return rq_gl_Crypto(password);
		}

		function doRegisterPartner02(obj_register) { 
			var ref 	= req_gl_Request_Content_Send("ServiceAutUser", "SVAutUserNewWADM");
			
			var header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			var sId			= -(Math.floor(Math.random() * 1000) + 1);
			ref[sessId		]	= sId;  

			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, showResultRegister02, [ref]));
			
			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			obj_register.do_lc_send_data(App.path.BASE_URL_API_PRIV, header , ref, fSucces, fError, "obj");
		}
		
		var showResultRegister02 = function (sharedJson, reference) {
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n ("content_register_succes"));
				doBuildPage();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n ("content_register_error"));
			}
		}

		function do_bind_event_reg_partner(){
			tmplName.REGISTER_CONTENT_PRJ_FORM_PARTNER =  "Register_Content_Prj_Form_Partner";
			tmplCtrl.do_lc_put_tmpl(tmplName.REGISTER_CONTENT_PRJ_FORM_PARTNER, Register_Content_Prj_Form_Partner); 
			$("#form_register_detail").html(tmplCtrl.req_lc_compile_tmpl(tmplName.REGISTER_CONTENT_PRJ_FORM_PARTNER, {}));

			do_lc_checkNumber(".classDocNum");
			do_gl_init_datetimePlugin($("#form_register_detail"));

			$("#btn_Register").off("click");
			$("#btn_Register").on("click", function () {
				var obj_register = req_gl_data({
					dataZoneDom : $("#div_sendRegister")
				});

				if(obj_register.hasError){
					do_gl_show_Notify_Msg_Error($.i18n ("content_register_error"));
					return; 
				}

				obj_register.data				= $.extend(true, {}, obj_register.data, pr_new_obj_default);
				obj_register.data.idDocNum		= obj_register.data.idDocNumOrg;

				var objInfo04 = {	"i": obj_register.data.idDocNum==undefined?null:obj_register.data.idDocNum,
						"d": obj_register.data.idDocDate==undefined?null:obj_register.data.idDocDate,
								"p": obj_register.data.idDocPlace==undefined?null:obj_register.data.idDocPlace};
				obj_register.data.per.info04	= JSON.stringify(objInfo04);
				obj_register.data.per.typ01  	= TYP_01_MORAL;
				obj_register.data.per.typ02  	= TYP_02_TPARTY;
//				obj_register.data.per.info10	= obj_register.data.email;
				doRegisterPartner(obj_register);
			});
		}

		function doRegisterUser(obj_register) { 
			var ref = req_gl_Request_Content_Send("ServiceAutUser", "SVAutUserNew");

			var header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			var sId			= -1;
			
			var fSucces = [];
			fSucces.push(req_gl_funct(null, showResultRegister, [ ref ]));

			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			obj_register.do_lc_send_data(App.path.BASE_URL_API_PRIV, header, ref, fSucces, fError, "obj");
		}
		
		function doRegisterPartner(obj_register) { 
			var ref 	= req_gl_Request_Content_Send("ServicePerPerson", "SVPersonNewSimple");
			
			var header 		= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			var sId			= -1;
			
			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, showResultRegister, [ref]));
			
			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			obj_register.do_lc_send_data(App.path.BASE_URL_API_PRIV, header , ref, fSucces, fError, "obj");
		}
		
		var showResultRegister = function (sharedJson, reference) {
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n ("content_register_succes"));
				doBuildPage();
			} else {
				do_gl_show_Notify_Msg_Error($.i18n ("content_register_error"));
			}
		}
		
		var do_Show_Login_Popup = function (stat) {
    		if(stat) {
    			$(App.constHTML.id.LOGIN_VIEW)	.addClass('open');
    			$('body')						.addClass('wygo-hidescroll');
    			$( "#inp_Username" ).focus();
    		} else {
        		$(App.constHTML.id.LOGIN_VIEW)	.removeClass('open');
    			$('body')						.removeClass('wygo-hidescroll');
    		}
    	}


		var do_lc_checkNumber = function(value){
			$(value).on("keypress keyup blur",function (event) {    
				$(this).val($(this).val().replace(/[^\d].+/, ""));
				if ((event.which < 48 || event.which > 57)) {
					event.preventDefault();
				}
			});
		}
		
		//--------------------------------------------------------------------------------------------------
		function can_lc_CheckRepeatPasswordMatch(inputPass, inputRepass, msg, reMsg) {
			var password 	= $(inputPass).val();
			var confirmPass = $(inputRepass).val();

			if (password.length == 0) {
				$(msg).html($.i18n("msg_notify_validate_change_pass"));
				$(inputPass).css("border-color","#EB0D5B");
//				return false;
			} else {
				$(msg).empty(); 
				$(inputPass).css("border-color","#ececec");
			}

			if (confirmPass.length == 0) {
				$(reMsg).html($.i18n("msg_notify_validate_change_confirm_pass"));
				$(inputRepass).css("border-color","#EB0D5B");
//				return false;
			}

			if(password.length > 0 && confirmPass.length > 0) {
				if(password == confirmPass) {
					$(reMsg).empty();	
					$(inputRepass).css("border-color","#ececec");
					return true;
				} else {
					$(reMsg).html($.i18n("msg_notify_validate_check_change_pass_match"));
					$(inputRepass).css("border-color","#EB0D5B");
//					return false;
				}
			}

			return false;
		}
		
		//----------------------------------------------------------------------------------------------------------
		var do_lc_appVersion = function(){
			var header 			= req_gl_Security_HttpHeader_New ("visitor", "visitor");
			
			var ref 			= {};
			ref[svClass		] 	= "ServiceCfgGroup"; 
			ref[svName		]	= "SVCfgGroupAppVersion"; 	

			var fSucces		= [];
			var f01 = {}; 	f01[fVar]	= null; 	f01[fName] = do_lc_saveAppVersion;	f01[fParam]=[];
			fSucces.push(f01);

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, header, ref, 100000, fSucces, null) ;	
		}
		var do_lc_saveAppVersion = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let appVers 		= sharedJson[App['const'].RES_DATA];
				localStorage.setItem("appVersion", appVers);
				if (appVersion == "1.25") return;
				if (appVers != appVersion) window.location.reload();
			} else {
			}
		}
		//-----------------------------------------------------------------------------------------

	};
	return LoginControllerPrj;
});