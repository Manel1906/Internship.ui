define([
	
	
	'group/nso_chatmini/ctrl/ChatRoomGroup',
	
	'text!group/nso_chatmini/tmpl/ChatRoom_Main.html',
    'text!group/nso_chatmini/tmpl/MiniChat_Main.html',
	], function(
			ChatRoomGroup,

			ChatRoom_Main,
            MiniChat_Main
    ) {

	var MiniChatMain     			= function (grpName, header, content, footer) {
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;
		var self 					= this;
		var var_lc_TYPE_SHOW        = null;
		var var_lc_GROUP_ID         = null;
		var pr_nbChat_Max 			= 3;
		var pr_nbChat_Count 		= 1;

		this.pr_LST_USER_ONLINE		= [];
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.MiniChat) App.controller.MiniChat = {};
			
			if (!App.controller.MiniChat.Main)  
				App.controller.MiniChat.Main				= this;

			if (!App.controller.MiniChat.Person)  
				App.controller.MiniChat.Person				= new ChatRoomGroup		(null, null, null);

			
			App.controller.MiniChat.Person					.do_lc_init();

			tmplName.CHATROOM_MAIN							= "MiniChat_ChatRoom_Main";
			tmplCtrl										.do_lc_put_tmpl(tmplName.CHATROOM_MAIN, ChatRoom_Main); 

            tmplName.PRJ_MINI_CHAT_MAIN						= "MiniChat_Main";
            tmplCtrl										.do_lc_put_tmpl(tmplName.PRJ_MINI_CHAT_MAIN			, MiniChat_Main); 
		}     
		
		this.do_lc_show		= function(divContent){
			try { 
				App.data["HttpSecuHeader"]		= req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
                do_lc_load_group();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatRoom", "ChatRoomMain", "do_lc_show", e.toString()) ;
			}
		};

		this.do_lc_close = function() {
			App.MsgboxController.do_lc_close();
		}
		
		this.do_lc_show_old = function (lst){
			App.controller.MiniChat.Person.do_lc_open_chat_old();
		}

        const do_lc_load_group = function() {
            App.MsgboxController.do_lc_show({
                title	: $.i18n("prj_minichat"),
                content : "<div id='div_minichat_person'></div>",
                buttons	: {
                    OK: {
                        autoclose	: true,
                        lab		    : $.i18n("common_btn_ok"),
                    },
                },
				bindEvent: function() {
					App.controller.MiniChat.Person.do_lc_show();
				}
            });	
        }

        this.do_lc_open_mini_chat = function(data) {
            let divChat     = "#div_mini_chat_0";
            let classBox    = "mini-chat-";

			for (let i = 1; i <= pr_nbChat_Max; i++) {
				if ($("." + classBox + i).html() == undefined) {
					pr_nbChat_Count = i;
					break;
				}
			}

			if (pr_nbChat_Count > pr_nbChat_Max) {
				pr_nbChat_Count = 1;
			}

			if (pr_nbChat_Count <= pr_nbChat_Max) {
				divChat = divChat + pr_nbChat_Count;

				$(divChat).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PRJ_MINI_CHAT_MAIN	, {"chatId" : classBox + pr_nbChat_Count })); 

				do_lc_bind_event(pr_nbChat_Count);
				let tmp = $(divChat).find(".div_chat_content");
				$(tmp).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_MAIN, {user: App.data.user}));

				pr_nbChat_Count++;
				
			}

			

			return divChat; //return id of div
        }
		

        const do_lc_bind_event = function(i) {
            $(`.close-chat.close-mini-chat-${i}`).on("click", function () {
                $(`.whatsapp-chat.mini-chat-${i}`).addClass("hide").removeClass("show");
            }),
            $(`.blantershow-chat.mini-chat-${i}`).on("click", function () {
                $(`.whatsapp-chat.mini-chat-${i}`).addClass("show").removeClass("hide");

				// for (let j = 1; j <= pr_nbChat_Max; j++) {
				// 	if (i != j)
				// 		$(`.whatsapp-chat.mini-chat-${j}`).addClass("hide").removeClass("show");
				// }
            });
              
        }
        
        this.do_lc_show_emoji = function(div){
			try{
				document.emojiSource = 'www/js/lib/hnv-emoji';
				if (!div) 
					do_gl_show_emoji ($("#i-emoji"), $("#inp_msg"));
				else 
					do_gl_show_emoji ($(div + " .i-emoji"), $(div + " .inp_msg"));
			}catch(e){
				console.log(e);
			}
		}
	};

	return MiniChatMain;
});