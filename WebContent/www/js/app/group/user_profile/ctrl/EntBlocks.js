define([], function(){
	
	
	//------------------------------Start User Profile Content-----------------------------------
	var EntContent = function (grpName, header, content, footer) {
		const self 			= this;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_content";
		var pr_divFooter 			= footer  ? footer : null;
		
		this.do_lc_show_content = function(profile, mode){
			
			
			profile = do_lc_reform_data(profile);
			
			$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_CONTENT, profile));
			
			// $("#sel_autuser_header_legalstat").find("option[value = '" + profile.per.cfgVal02 + "']").attr("selected", "selected");
			// let cfgVal02Str = $("#sel_autuser_header_legalstat").find("option[value = '" + profile.per.cfgVal02 + "']").text();
			// $("#cfgVal02Str").html(cfgVal02Str);

			if (profile.per.inf04?.utc){
				$("#sel_autuser_header_utc").find("option[value = '" + profile.per.inf04.utc + "']").attr("selected", "selected");
				let utcStr = $("#sel_autuser_header_utc").find("option[value = '" + profile.per.inf04.utc + "']").text();
				$("#utcStr").html(utcStr);
			}

			if (profile.per.inf04?.lang){
				$("#sel_autuser_header_lang").find("option[value = '" + profile.per.inf04.lang + "']").attr("selected", "selected");
				let langStr = $("#sel_autuser_header_lang").find("option[value = '" + profile.per.inf04.lang + "']").text();
				$("#langStr").html(langStr);
			}
		
			do_lc_bind_event_content_profile(profile);
		}	
		
		
		var do_lc_reform_data = function(profile){
			let per 		= profile.per;
//			if(per?.inf02 && typeof per.inf02 === 'string'){
//				per.inf02  = JSON.parse(per.inf02);
//			}

			if(per.inf04 && (typeof per.inf04 === 'string')){
				per.inf04 = JSON.parse(per.inf04);
			}
			
			if(per.inf05 && (typeof per.inf05 === 'string')){
				let inf05 = JSON.parse(per.inf05);
				let obj = {};
				for(let i=0; i < inf05.length; i++){
					if(inf05[i].k === "fb") obj.fb = inf05[i].v;
					if(inf05[i].k === "tw") obj.tw = inf05[i].v;
					if(inf05[i].k === "ln") obj.ln = inf05[i].v;
					if(inf05[i].k === "gg") obj.gg = inf05[i].v;
					if(inf05[i].k === "ig") obj.ig = inf05[i].v;
				}
				
				per.inf05 = obj;
			}
			
			return profile;
		}
		
		var do_lc_bind_event_content_profile = function(profile){
			if(!profile.files)	profile.files = [];
			if (profile.avatar) profile.files = []; //--reset files
			
			if (profile.files.length==0 && profile.avatar) profile.files.push(profile.avatar);
			
			let option	= {
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
					obj				: profile//file existing here					
			}			
			do_gl_init_fileDropzone($(pr_divContent), option);
			
			$(".info-edit").on("click", function(){
				let $parent = $(this).parent();
				$parent.find(".info-content")			.addClass("hide");
				$parent.find(".content-edit")	.removeClass("hide");

				if($parent.find(".content-edit").length > 0){
					$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
				}
			})
			
			$("#a_btn_save").off("click").on("click", function(){
				profile.files 	= profile.files ? [...profile.files].filter(Boolean) : [];
				let data = req_gl_data({
					dataZoneDom : $(pr_divContent)
				});

				if(data.hasError)	{
					do_lc_show_error_input(data.data)
					return false;
				}
				
				let newProfile 		= data.data;

				if (newProfile.per) 
				newProfile.per.info10 	= newProfile.email;

				if(newProfile.inf02){
					var objInfo02 = {	"j": newProfile.inf02.job,
										"d": newProfile.inf02.dtBirthday};
		
					var per = newProfile.per;
					per.inf02 = JSON.stringify(objInfo02);
				}

				if(newProfile.inf04){
					var objInfo04 = {	"i"		: newProfile.inf04.idDocNum	==undefined?null:newProfile.inf04.idDocNum,
										"d"		: newProfile.inf04.idDocDate	==undefined?null:newProfile.inf04.idDocDate,
										"p"		: newProfile.inf04.idDocPlace	==undefined?null:newProfile.inf04.idDocPlace,
										"utc"	: newProfile.inf04.utc	==undefined?null:newProfile.inf04.utc,
										"lang"	: newProfile.inf04.lang	==undefined?null:newProfile.inf04.lang}
		
					var per = newProfile.per;
					per.inf04 = JSON.stringify(objInfo04);;
				}

				if(newProfile.inf05){
					var objInfo05 = [{"k": "fb", 	"v": newProfile.inf05.value_facebook 		== undefined?null:newProfile.inf05.value_facebook	},
									 {"k": "tw", 	"v": newProfile.inf05.value_twitter 		== undefined?null:newProfile.inf05.value_twitter	},
									 {"k": "ln",	"v": newProfile.inf05.value_linkedin 		== undefined?null:newProfile.inf05.value_linkedin	},
									 {"k": "gg", 	"v": newProfile.inf05.value_google 			== undefined?null:newProfile.inf05.value_google	},
									 {"k": "ig", 	"v": newProfile.inf05.value_instagram 		== undefined?null:newProfile.inf05.value_instagram}];
		
					var per = newProfile.per;
					per.inf05 = JSON.stringify(objInfo05);
				}

				
				newProfile 			= $.extend(false, profile, newProfile);
				// if don't mod avatar files == []
				if(newProfile.avatar){
					if(!newProfile.files) newProfile.files =[]
					newProfile.files.push(newProfile.avatar)
				}

				do_lc_info_mod(newProfile, profile)
			})

			$("#a_btn_cancel").off("click").on("click", function(){
				self.do_lc_show_content(profile);
			})
			
			$("#btn_add_avatar").off("click").on("click", function(){
				$("#div_prj_ent_file_upload").removeClass("hide");
				$(this).addClass("hide");
				$("#a_btn_save, #a_btn_cancel")	.removeClass("hide");
			})
		};

		const do_lc_show_error_input = (data) => {
			data.map(e => {
				$(e).removeClass("hide")

				$(e).parent().find(`p[data-name=${$(e).data("name")}]`).addClass("hide")
			})
		}

		//---------------------------------Ajax----------------------------------------------
		var do_lc_info_mod 	= function(newProfile, profile) {
			let ref 		= req_gl_Request_Content_Send_With_Params('ServiceAutUser','SVModSelf', {obj: JSON.stringify(newProfile)});	
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_info_mod_callback, [profile]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;

		}

		var do_lc_info_mod_callback = function(sharedJson, profile){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success 	($.i18n("aut_profile_change_info_success") );
				let data 		= sharedJson[App['const'].RES_DATA];
				localStorage.setItem(SECU_PREFIX + App.keys.KEY_STORAGE_CREDENTIAL + "/usr", JSON.stringify(data));
				
				App.data.user 	= data;
				
				profile 		= $.extend(true, profile, data);
				App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
				self.do_lc_show_content(profile, App.data.mode);
//				window.open("view_prj_user_profile.html", "_self");
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('aut_profile_change_info_error'));
			}
		}

		var do_lc_cancel = function (profile){
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
			self.do_lc_show_content(profile, App.data.mode);
		}
	}
	//------------------------------End User Profile Content-----------------------------------
	
	//------------------------------Start User Profile Content-----------------------------------
	var EntAction = function (grpName, header, content, footer) {
		const self 			= this;
		
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_action";
		var pr_divFooter 			= footer  ? footer : null;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		this.do_lc_show_action = function(prj, mode) {
			try{
				$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_ACTION, prj));
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}
	}
	//------------------------------End User Profile Content-----------------------------------
	
	//------------------------------Start User Profile Content-----------------------------------
	var EntPass = function (grpName, header, content, footer) {
		const self 			= this;
		
		var pr_divHeader 			= header  ? header : null;
		var pr_divContent 			= "#div_prj_pass";
		var pr_divFooter 			= footer  ? footer : null;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
		
		this.do_lc_show_pass = function(obj, div, type01, type02){
			try{
				do_lc_show_changePWD(obj);
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.user", "PrjUserEnt", "do_lc_show", e.toString()) ;
			}
		}
		
		var do_lc_show_changePWD = function(prj, mode){
			$(pr_divContent)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.TMPL_ENT_PASS, {}));

			do_lc_bind_event_content_prj(prj);
		}

		var do_lc_cancel_change = function (prj){
			App.data.mode 	= pr_ctr_Main.var_lc_MODE_SEL;				
			do_lc_show_changePWD(prj, App.data.mode);
		}

		var do_lc_bind_event_content_prj = function(prj){
			$("#a_btn_pass_save").off("click").on("click", function(){

				let	data	= req_gl_data({
					dataZoneDom		: $(pr_divContent)
				});
				

				profile = do_lc_reform_data(prj);
				prj["files"] = [];
				if(profile.avatar){
					prj.files.push(profile.avatar);
				}
				if(data.hasError)	return false;

				if(data.data.newPwd == data.data.newPwdConf){
					do_lc_password_mod(prj, rq_gl_Crypto(data.data.oldPwd), rq_gl_Crypto(data.data.newPwd))
				}else{
					do_gl_show_Notify_Msg_Error($.i18n("aut_profile_difference_pwd"));
				}
			})

			$("#a_btn_pass_calcel").off("click").on("click", function(){
				do_lc_cancel_change(prj);
			})
			
			
			$("#btn_aut_user_change_pass").on("click", function() {
					$("#div_ent_header_password, #a_btn_pass_save, #a_btn_pass_calcel").toggleClass("hidden"); 
					
			});
			$("#btn_aut_user_googleAPI").on("click", function() {
				do_gl_GoogleAPI_OAuth(); 
			});
			
		};

		//-----------------------------------------------------------------------------------------
		var do_lc_password_mod = function(data, pwd_old, pwd_new) {
			var ref 		= req_gl_Request_Content_Send('ServiceAutUser','SVModSelf');
			data.pass01 	= pwd_new;
			ref["obj"]		= JSON.stringify(data)
			// ref["user_login"]	= App.data.user.login;
			// ref["user_tok"]		= rq_gl_Crypto(pwd_old+App.data.session_id);
			// ref["user_pwd"]		= pwd_new; 

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lc_password_mod_callback, [data]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_lc_password_mod_callback = function(sharedJson, data){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				do_gl_show_Notify_Msg_Success 	($.i18n("aut_profile_change_info_success") );				
				// do_gl_show_Notify_Msg_Success 	($.i18n("aut_profile_change_pwd_success") );			
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('aut_profile_change_info_error'));
				// do_gl_show_Notify_Msg_Error 	($.i18n("aut_profile_change_pwd_error") );
			}

//			self.do_lc_show({}, pr_ctr_Main.var_lc_MODE_SEL);
			self.do_lc_show_pass(data);
		}
	}
	//------------------------------End User Profile Content-----------------------------------

	return {EntContent, EntAction, EntPass};
});