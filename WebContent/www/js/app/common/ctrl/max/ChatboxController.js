
//y tuong chatbox 
//buoc 1: kiem tra lich su xem da co list cac msg (luu lai toi da 20 msg) + id ref (dung vao cot I_aut_user va co val <0)
// neu lich su qua 1h thi xoa di
//buoc 2: neu khong co thi gen ra 1 id , luu vao localStorage va bat dau chat
//cach lay msg la lay theo type + id cung cap

// Reference: https://bootsnipp.com/user/snippets/vlMQr
var ChatboxController 	= function () {
	var tmplName		= App.template.names;
	var tmplCtrl		= App.template.controller;

	var pr_TYPE_MSG_CONTACT_CHAT		= 10; //5:contact
	var pr_TYPE_MSG_CONTACT_CHAT_RESP	= 11; 
	var pr_checkValidity    			= false;

	var pr_Thread_Msg_Req				= null;
	var current_User_Name				= "";

	var self = this;

	require(['text!commonTmpl/ChatBox.html'], function (tmpl) {
		tmplName.CMS_CHATBOX = 'CMS_CHATBOX';
		tmplCtrl.do_lc_put_tmpl(tmplName.CMS_CHATBOX, tmpl);
	});

	this.do_lc_show = function() {
		$("body").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_CHATBOX, {}));

		var $chatbox = $('.chatbox'),
		$chatboxTitle = $('.chatbox__title'),
		$chatboxTitleClose = $('.chatbox__title__close'),
		$chatboxCredentials = $('.chatbox__credentials');
		$chatboxTitle.on('click', function() {
			$chatbox.toggleClass('chatbox--tray');
		});
		$chatboxTitleClose.on('click', function(e) {
			e.stopPropagation();
//			$chatbox.addClass('chatbox--closed');
			var clicked = true;
			do_hideShowChatBox(clicked);
		});
		$chatbox.on('transitionend', function() {
			if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
		});
		$chatboxCredentials.on('submit', function(e) {
			e.preventDefault();
			if(pr_checkValidity)
				$chatbox.removeClass('chatbox--empty');
		});

		do_hideShowChatBox();
		do_remove_required_msg();
		do_binding_form_contact ();

		req_History();
	}

	// ---------private-----------------------------------------------------------------------------
	var do_binding_form_contact = function() {

		$("#submit_form_contact").off("click");
		$("#submit_form_contact").click(function() {

			var obj_contact = req_gl_data({
				dataZoneDom : $("#form_contact")
			});

			if(obj_contact.hasError)	return;

			obj_contact.data.from 	= obj_contact.data.name + "<" + obj_contact.data.email+">";

			obj_contact.data.typMsg = pr_TYPE_MSG_CONTACT_CHAT;

			do_send_msg(obj_contact);

			if(obj_contact.data.name && obj_contact.data.email && obj_contact.data.body) {
				pr_checkValidity = true;
				$(".chatbox__body").append(
						"<div class='chatbox__body__message chatbox__body__message--left'>"
						+ "<b>" + obj_contact.data.name +"</b>"
						+ "<p>" + obj_contact.data.body +"</p>"
						+ "</div>"
				);
			}
			/*do_gl_show_Notify_Msg_Warn($.i18n ("content_contact_not_validate_condition"));*/

		});

	};

	//--------------------------------------------------------------------------------------------------
	function do_send_msg(obj_contact) {
		var ref = req_gl_Request_Content_Send("ServiceMsgMessage", "SVNew");
		ref["msgId"	 ] = MSG_ID;

		var fSucces = [];
		fSucces.push(req_gl_funct(null, do_callback, []));

		fSucces.push(req_gl_funct(null, do_ResponseGet, [1000]));

		var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);

		obj_contact.do_lc_send_data(App.path.BASE_URL_API_PRIV, req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL), ref, fSucces, fError, "obj");

		//------------------------------------------
		MSG_LAST_CONN = new Date();
		do_MsgPut(obj_contact.data)
	}

	//-----------------------------------------------------------------------------------------------------
	function do_remove_required_msg (){
		$("input[type='text']").change(function () {
			$(".chatbox__credentials div.errMsg").remove();
			$('.chatbox__credentials').find('.form-control').removeClass('inp-error');
		})
	}

	function do_callback(sharedJson) {
		if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
//			do_gl_show_Notify_Msg_Success($.i18n ("content_contact_us_send_succes"));
//			self.do_lc_show();
			do_MsgShow();
		} else {
			do_gl_show_Notify_Msg_Error($.i18n ("content_send_not_succes"));
		}

	}

	//-----------------------------------------------------------------------
	var MSG_HIST		= [];
	var MSG_LAST_CONN	= 0;
	var MSG_ID			= 0;
	var MSG_PREFIX		= '/hnv/msg';
	var TIME_HOUR		= 1000*60*60;
	var TEMP_MSG_HIST   = [];

	function do_MsgPut(data){
		TEMP_MSG_HIST = JSON.parse(JSON.stringify(MSG_HIST));
		if(Array.isArray(data)){
			for (var i in data){
				var msg = data[i];
				var found = true;
				for(var msg_hist in MSG_HIST){
					if(msg.dt === MSG_HIST[msg_hist].dt 
							&& msg.body === MSG_HIST[msg_hist].body
							&& msg_hist != "0"
					){
						found = false;
						break;
					}
				}
				if(found) MSG_HIST.push(msg);
			}    				
		}
		else {
			MSG_HIST.push(data);
		}

		// show replied messages from Admin
		do_MsgShow_Live(data);

		setTimeout(function(param) {
			do_HistorySave();
		},  1000*60);	
	}

	function do_HistorySave(){
		var now 	= new Date().getTime();	
		localStorage.setItem(MSG_PREFIX+ '/time' 		, JSON.stringify(now));	
		localStorage.setItem(MSG_PREFIX+ '/id' 			, JSON.stringify(MSG_ID));	
		localStorage.setItem(MSG_PREFIX+ '/history' 	, JSON.stringify(MSG_HIST));	
	}

	//----------------------
	function do_MsgShow(){
		//---hien thi lai msg trong MSG_HIST

		setTimeout( function(){
			if($("#chatbox_admin_reply").length === 0){
				$(".chatbox__body").append(
						"<div id='chatbox_admin_reply' class='chatbox__body__message chatbox__body__message--right'>"
						+ "<div style='text-align: end;'><b>Wygo</b><div>"
//						+ "<img src='https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg' alt='Picture'>"
						+ "<p>" + $.i18n ("chat_box_server_reply") +"</p>"
						+ "</div>"
				);
			}
		}, 2000);
	}

	//----------------------
	function do_MsgShow_Live(data){
		for (var i in data){
			var msg = data[i];
			var found = true;
			for(var msg_hist in TEMP_MSG_HIST){
				if(msg.dt === TEMP_MSG_HIST[msg_hist].dt 
						&& msg.body === TEMP_MSG_HIST[msg_hist].body
						&& msg_hist != "0"
				){
					found = false;
					break;
				}
			}

			if(found) {
				if(msg.body){
					$(".chatbox__body").append(
							"<div class='chatbox__body__message chatbox__body__message--right'>"
							+ "<div style='text-align: end;'><b>Wygo</b><div>"
							+ "<p>" + msg.body +"</p>"
							+ "</div>"
					);
				}

			};
		}    				
	}

	//----------------------
	function req_History(){
		var now 	= new Date().getTime();	
		var time  	= localStorage.getItem(MSG_PREFIX+ '/time');
		if (!time){
			MSG_ID		= -(now%100000000);
			MSG_HIST	= [];    				
		}else{
			time = parseInt(time, 10);
			if (time < now-TIME_HOUR){
				MSG_ID		= -(now%100000000);
				MSG_HIST	= []; 
			}else{
//				MSG_HIST	= localStorage.getItem(MSG_PREFIX+ '/time');
				MSG_ID		= localStorage.getItem(MSG_PREFIX+ '/id');
				MSG_HIST	= localStorage.getItem(MSG_PREFIX+ '/history');
				if (!MSG_HIST) {
					MSG_ID	= -(now%100000000);
					MSG_HIST= [];
				}	else {
					MSG_ID	= parseInt(MSG_ID, 10);
					MSG_HIST= JSON.parse(MSG_HIST);
					do_HistoryShow();
				}

			}
		}	
	}

	function do_HistoryShow() {
		if(localStorage.getItem(MSG_PREFIX+ '/id')) {
//			MSG_HIST	= JSON.parse(localStorage.getItem(MSG_PREFIX+ '/history'));

			if(MSG_HIST.length === 0) return;

			var $chatbox = $('.chatbox');
			$chatbox.removeClass('chatbox--empty');
			for (var i in MSG_HIST){
				var msg = MSG_HIST[i];
				// messages from Admin are positioned in the right otherwise go left
				if(msg){
					if(msg.from.includes("contact@hnv-tech.com") && msg.body) {
						$(".chatbox__body").append(
								"<div class='chatbox__body__message chatbox__body__message--right'>"
								+ "<div style='text-align: end;'><b>Wygo</b><div>"
								+ "<p>" + msg.body +"</p>"
								+ "</div>"
						);
					}
					else {
						current_User_Name = MSG_HIST[0].name;
						$(".chatbox__body").append(
								"<div class='chatbox__body__message chatbox__body__message--left'>"
								+ "<b>" + current_User_Name +"</b>"
								+ "<p>" + msg.body +"</p>"
								+ "</div>"
						);
					}
				}

			}

			do_ResponseGet();
		}
	}

	// show chat-box after 30m being closed
	function do_hideShowChatBox(clicked){
		var now 	= new Date().getTime();
		var hidingTime  = localStorage.getItem(MSG_PREFIX+ '/hidingTime');
		var $chatbox 	= $('.chatbox');

		if(hidingTime){
			var timeRange = (now - parseInt(hidingTime,10));
			if(timeRange - TIME_HOUR/2 < 0){
				$chatbox.addClass('chatbox--closed');
			}
			else {
				localStorage.removeItem(MSG_PREFIX+ '/hidingTime');
			}
		}
		else if(clicked){
			localStorage.setItem(MSG_PREFIX+ '/hidingTime' 		, JSON.stringify(now));	
			$chatbox.addClass('chatbox--closed');
		}
	}


	function do_ResponseGet(timeWait){
		if (!timeWait) timeWait = 1000*10;
		if (pr_Thread_Msg_Req) clearTimeout(pr_Thread_Msg_Req);
		pr_Thread_Msg_Req = setTimeout(function(param) {
			do_fetchResponse();
		},  timeWait);	
	}

	function do_fetchResponse(){
		var ref = req_gl_Request_Content_Send("ServiceMsgMessage", "SVRespGet");
		ref["msgId"] 	= MSG_ID;
		ref["dLast"]	= MSG_LAST_CONN;

		var fSucces = [];
		fSucces.push(req_gl_funct(null, do_callback_fetchResp, []));

		var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);

		App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV,  req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL), ref, 100000, fSucces, fError) ;	

		MSG_LAST_CONN = new Date();
	}


	function do_callback_fetchResp(sharedJson) {
		if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
			var data = sharedJson[App['const'].RES_DATA];
			if (data.length<=0){
				//---chua co response
				do_ResponseGet(10000);
				// show default message because of no response from admin
				do_MsgShow();

			}else{
				//---new co listMsg thi tang timeWait
				do_ResponseGet(20000);

				do_MsgPut (data);

				// show replied messages from Admin
//				do_MsgShow_Live(data);
			}

		} else {
			do_gl_show_Notify_Msg_Error($.i18n ("content_send_not_succes"));
		}

	}
};

