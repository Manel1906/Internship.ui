define([
	'group/nso_chatroom/ctrl/Webcam',
	'group/nso_chatroom/ctrl/Recorder',
	'prjImageViewer/viewer',
	],
	function(
			Webcam,
			Recorder,
			Viewer
	){

	const ChatRoomChat 	= function (grpName, header, content, footer) {
		var pr_divHeader              = header;
		var pr_divContent             = content;
		var pr_divFooter              = footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName
		const tmplName				= App.template.names[pr_grpName];
		const tmplCtrl				= App.template.controller;
		//------------------------------------------------------------------------------------

		const pr_SERVICE_CLASS			= "ServiceMsgMessage"; //to change by your need
		const pr_SV_LIST				= "SVChatLst";
		const pr_SV_DEL_LIST			= "SVChatLstById";
		const pr_SV_MEMBER_LIST			= "SVMemberLst";
		const pr_SV_MEMBER_ROLE			= "SVMemberRole";
		const pr_SV_MEMBER_JOIN			= "SVMemberJoin";
		const pr_SV_MEMBER_JOIN_PUBLIC	= "SVMemberJoinPublic";
		const pr_SV_MEMBER_CANCEL_JOIN	= "SVMemberCancelJoin";
		const pr_SV_NEW					= "SVChatNew";
		const pr_SV_NEW_WITH_IMG		= "SVChatNewWithImg";
		const pr_SV_DEL					= "SVChatDel";
		const pr_SV_HIDE				= "SVChatHide";
		const pr_SV_GET_TOTAL 			= "SVCountTotal";
		const pr_SV_NEW_HISTORY			= "SVChatHistoryNew";
		const pr_SV_LST_HISTORY			= "SVChatHistoryLst";

		const pr_SERVICE_CLASS_GROUP	= "ServiceNsoGroupChat"; //to change by your need
		const pr_SV_DEL_GROUP			= "SVDelRoom";
		const pr_SV_OUT_GROUP			= "SVOutRoom";
		const pr_SV_MOD_GROUP			= "SVModRoom";
		//------------------variable pagination post------------------------------------------------------
		const pr_MSG_NUMBER 			= 200;

		const pr_TYP_MSG_PRIVATE 		= 200;
		const pr_TYP_MSG_PUBLIC 		= 201;

		const pr_TYP_CHAT_VIDEO			= 10;
		const pr_TYP_CHAT_USER			= 1;
		const pr_TYP_CHAT_GROUP			= 2;
		const pr_TYP_CHAT_RELATE		= 3;
		const pr_RTC_CHAT_CONTACT		= 4;
		

		const pr_KEY_ENTER 				= 13;
		const pr_KEY_ENTER_CTRL			= 10;
		const pr_KEY_ENTER_ALT			= 10;

		const pr_member_lev_manager 	= 0;

		const pr_number_msg_closest		= 10;

		const CHAT_GROUP_PRIVATE		= 401;
		const CHAT_GROUP_PUBLIC			= 402;
		
		var pr_ENT_TPY_GROUP        	= 40000;

		var pr_SEARCH_KEY				= "";
		var catIds						= "";
		var pr_TYP_POST  				= 101;
		var multiLang               	= "";
		var ios 						= null;
		
		const pr_STAT_VALIDATED			= 2;
		const pr_STAT_VALIDATED_HIDDEN	= 3;
		const pr_NUMBER					= 20;
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 				= null;
		var pr_ctr_User 				= null;
		var pr_ctr_Member				= null;
		var pr_ctr_WebRTC				= null;
		var pr_ctr_IndexedDB			= null;

		var pr_LST_INPUT_FILE			= [];
		var pr_index_msg_search_min 	=  0;
		var pr_old_msg_search 			= "";

		var pr_TIME_REFRESH				= 10 * 60 * 1000;

		var pr_initialeValues_to_search = {};

		var intervalLstHistory			= null;
		var self 						= null;
		var avatarGr 					= {files: []};
		var camMode 					= "user";

		const initialeValues = {
				chatSimple 		: true,
//				isLoadMore 		: false,
				obj		   		: null,
				currentTyp 		: pr_TYP_CHAT_GROUP,
				lstMsgCurrent 	: [],
				begin			: 0,
				members			: {},
				isOwner			: false,
				isGroupUser		: false,
		}
		
		var pr_sound_chat_off = {
		}
		var pr_obj 		= null;
		var pr_typChat 	= null;
		
		var webcam 		= null;
		
		var gumStream 	= null;				//stream from getUserMedia()
		var rec 		= null;				//Recorder.js object
		var input 		= null; 	

		var pr_Collect_Msg        = "messages";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.ChatRoom.Main || App.controller.ChatRoom.ChatRoomMain;
			pr_ctr_Group 			= App.controller.ChatRoom.Group;
			pr_ctr_Doc 		     	= App.controller.ChatRoom.Docs;
			pr_ctr_Post 		    = App.controller.ChatRoom.Post;
			pr_ctr_Member 			= App.controller.ChatRoom.Member;
			pr_ctr_WebRTC 			= App.controller.ChatRoom.WebRTC;
			// pr_ctr_ChatWebChime 	= App.controller.ChatRoom.ChatWebChime;
			// pr_ctr_ChatWebChime_RTC	= App.controller.ChatRoom.ChatWebChime_RTC;
			pr_ctr_IndexedDB		= App.controller.ChatRoom.IndexedDB

			self 					= this;
			
			// do_gl_GoogleAPI_OAuthInit();
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(obj, typChat){      //typChat user or group         
			try{
				ios 		= !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent);
				if(!obj)	return false;
				webcam 		= Webcam;

				pr_obj 		= obj;
				pr_typChat 	= typChat
				
				do_lc_init_new_chat	(obj, typChat);
				do_lc_build_page	(obj, typChat);
				
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chat", "ChatRoomChat", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_init_new_chat = (obj, typChat) => {
			//-----exit old------------------------------------------------------
			if (initialeValues.obj){
				var msg_Grp_End = {name : "MSG_CHAT_GROUP_END", val :{group: obj.id}};
				App.controller.ChatRoom.Socket.can_lc_msg_Out (msg_Grp_End);
			}

			//----add user to grp--------------------------------------------------
			var msg_Grp_Begin = {name : "MSG_CHAT_GROUP_BEGIN", val :{group: obj.id}};
			App.controller.ChatRoom.Socket.can_lc_msg_Out (msg_Grp_Begin);

			//-----------------------------------------------------------------------
			initialeValues.lstMsgCurrent	= [];
			initialeValues.obj				= obj;
			initialeValues.obj.key			= obj.id ;
			initialeValues.currentTyp 		= typChat;
			initialeValues.begin 			= 0;
			initialeValues.isGroupUser 		= obj.typ01 === pr_TYP_MSG_PRIVATE;
			pr_initialeValues_to_search		= initialeValues;
			pr_index_msg_search_min			= 0;
			
			if (typChat != pr_TYP_CHAT_VIDEO){
				do_lc_show_grp_btn_mobile(typChat, initialeValues.obj);
			}else{
				$(".grp_btn_mobile").empty();
			}
		}

		const do_lc_show_grp_btn_mobile = function(typeChat, group){
			$(".grp_btn_right").show();
			
			if(typeChat === pr_TYP_CHAT_GROUP || group.typ01 ===201){
				$("#btn_chat_member").show();
				$("#btn_chat_member_waiting").show();
				$("#btn_chat_post").show();
				if( group.val01 && typeof  group.val01 !== 'object'){
					group.val01 = JSON.parse(group.val01)
				}
				let grpChat = {
				    typ01	: group.typ01,
				    val01	: group.val01,
				    name	: group.name
				};
				pr_ctr_Main.do_lc_avatar_moblie(grpChat);
			}else{ //if (typeChat==pr_TYP_CHAT_USER)
				
				$("#btn_chat_member").hide();
				$("#btn_chat_member_waiting").hide();
				$("#btn_chat_post").hide();
				
				if (group.val01 && typeof group.val01 !== 'object' ) group.val01 = JSON.parse (group.val01);
				let filteredAva = null;
				if (group.val01){
					for (var key in group.val01){
						if (key != 'img' && key!= App.data.user.id){
							filteredAva = group.val01[key];
							break;
						}
					}
				}
				
				let userChatSubset = {
				    typ01	: group.typ01,
				    avatar	: filteredAva?.img,
				    login01	: filteredAva?.login
				};
				pr_ctr_Main.do_lc_avatar_moblie(userChatSubset);
			}
			
			
			if($('.grp_btn_right').is(':visible')){
				$(".div_mobile").hide();
				$("#div_chat_main").show();
				$("#btn_chat_msg").addClass("active");
			}
			
			$("#btn_chat_msg").off("click").click(() => {
				$(".btn_mobile_custom").removeClass("active");
				$(".div_mobile").hide();
				$("#div_chat_main").show(); 
			});
			
			$("#btn_chat_member").off("click").click(() => {
				$(".btn_mobile_custom").removeClass("active");
				$(".div_mobile").hide();
				$("#div_member_global").show();
				
//				$("#div_member>div").addClass("max-height effect_shadow");
//				$("#div_member_wait>div").addClass("max-height effect_shadow");
			});
			
			$("#btn_chat_file").off("click").click(() => {
				$(".btn_mobile_custom").removeClass("active");
				$(".div_mobile").hide();
				$("#div_files").show();
				pr_ctr_Doc. do_lc_show (group, true);
//				$("#div_chat_info").removeClass("col-sm-12 col-lg-3");
//				$("#div_files>div").addClass("max-height effect_shadow");
			});

			$("#btn_chat_post").off("click").click(() => {
				$(".btn_mobile_custom").removeClass("active");
				$(".div_mobile").hide();
				$("#div_post").show(); 
				pr_ctr_Post. do_lc_show (group, true);
			});
		}
		
		this.do_lc_push_msg_socket = function(msg){
			if(msg){
				let groupId 		= initialeValues.obj.id;
				let isCurrentChat 	= (groupId == msg.entId);
				if (!isCurrentChat){
					pr_ctr_Group.do_lc_push_newMSG(msg);
					return;
				}
				//---------------------------------------------------------------------------
				if(!initialeValues.obj){
					pr_ctr_Group.do_lc_push_newMSG(msg);
					return;
				}
				if(msg.inf05) msg.files = msg.inf05.files;
				//---------------------------------------------------------------------------
				//----push to indexedDB first
				var msgToSave = Object.assign({}, msg, {})
				pr_ctr_IndexedDB.do_lc_update_record (pr_Collect_Msg, msgToSave.entId, msgToSave);
				
				
				//---------------------------------------------------------------------------
				//----play sound if not me
				let me_id 				= App.data.user.id;
				let isCurrentWhoChat 	= (me_id == msg.uId);
				if(!isCurrentWhoChat){
					do_lc_play_sound_move(msg.entId);
					
					//---show new Msg if msg is not for this group
//					pr_ctr_Group.do_lc_push_newMSG(msg, !isCurrentWhoChat);
				}
				//---------------------------------------------------------------------------
				//khi thêm 1 msg của 1 user vào chat thì remove hết avatar read của user này
				//Ví dụ Trang thi remove icon read của Trang ở trên trước khi add msg của Trang
				$("#div_avatar_" + msg.uId).remove(); 

				do_lc_pushTo_zoneChat(msg);

				//---reload file in tab docs
				if(msg.files && msg.files.length > 0) $('#btn_refresh_doc').trigger("click", [true]); 
			}
		}

		this.do_lc_del_msg_socket = function(grpId, msgId){
			if(grpId && msgId){
				//----remove from indexedDB
				pr_ctr_IndexedDB.do_lc_delete_record (pr_Collect_Msg, grpId, msgId);
				
				let me_id 			= App.data.user.id;
				if(!initialeValues.obj){
					return;
				}	
				if (grpId != initialeValues.obj.id) return;
				$("#li_msg_item_append_"+msgId).remove();
			}
		}
		
		this.do_lc_bind_list_online = () => {
			if(initialeValues.currentTyp === pr_TYP_CHAT_GROUP)	return;
			if(!initialeValues.obj)						return;

			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
			const isOnline 	= lstOnline.includes(initialeValues.obj.name);

			do_lc_show_chat_header({isOnline})
		}

		//------------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------------

		this.do_lc_show_form_chat = function(){
			$("#div_chat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_MAIN	, {}));

			if(initialeValues.currentTyp == pr_TYP_CHAT_USER)	initialeValues.obj.name = initialeValues.obj.login01;
			$("#div_chat_main_chat").show();
			if(initialeValues.currentTyp != pr_RTC_CHAT_CONTACT){
				const isOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(initialeValues.obj.name);
				do_lc_show_chat_header({isOnline});
			}
			do_lc_show_chat_footer();
		}

		this.do_lc_show_chat_header_init = () => {
//			const isOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(initialeValues.obj.name);
			do_lc_show_chat_header({});
			
		}
		
		const do_lc_show_chat_header = ({isOnline}) => {
			let objChatDefine = {user : initialeValues.obj, typChat : initialeValues.currentTyp};
			if(pr_typChat === 1){
				iduser = pr_obj.iduser;
				userChat = App.data.listUser[iduser];
				if(userChat){
						userChat.name 	= userChat.login01;
						isOnline 		= App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(userChat.name);
						objChatDefine 	= {user : userChat, typChat : pr_TYP_CHAT_USER};
					} else{
						objChatDefine = null;
						return;
				}
			}else if(pr_typChat === 2 || pr_obj.typ01 ===201){
				const isMe = initialeValues.members[App.data.user.id];
				if(isMe && (isMe.typ === pr_member_lev_manager) ){
					initialeValues.isManager = true;
				} else {
					initialeValues.isManager = false;
				}
	
				let memIds 		= Object.keys(initialeValues.members);
				let countMan 	= 0;
				
				initialeValues.canDelete = false;
				for(let i in memIds){
					let user = initialeValues.members[memIds[i]];
					if(user.typ == pr_member_lev_manager) countMan ++;
				}
				if(countMan < 2) initialeValues.canDelete = true;
	
				if(initialeValues.isGroupUser){
					if(Object.keys(initialeValues.members).length > 0){
						let 	le 			= Object.keys(initialeValues.members);
						const 	userChat 	= le['length'] > 1? Object.values(initialeValues.members).find(m => m.uId !== App.data.user.id) : initialeValues.members[App.data.user.id];
						if(userChat){
							userChat.name 	= userChat.mem.login01;
							isOnline 		= App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(userChat.name);
							objChatDefine 	= {user : userChat, typChat : pr_TYP_CHAT_USER};
						} else{
							objChatDefine = null;
							return;
						}					
					}
				}
			}else{	
				var uChat = pr_obj;
				if(uChat){
				let parsedInf01;

				    if (uChat.inf01) {
				    try {
				        parsedInf01 = JSON.parse(uChat.inf01); 
				    } catch (error) {
				        parsedInf01 = uChat.inf01.split(", "); 
				    }
					} else {
					    parsedInf01 = []; 
					}
				    
				    if (Array.isArray(parsedInf01)) {
				      uChat.name = uChat.login01|| parsedInf01[1].ulogin 
				    }
				
				    isOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE.includes(uChat.name);
				    objChatDefine = { user: uChat, typChat: pr_TYP_CHAT_USER };
					} else{
						objChatDefine = null;
						return;
				}
			}
			
			
			$("#div_chat_header").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_HEADER	, 
					{
					canDelete 		: initialeValues.canDelete, 
					isManager 		: initialeValues.isManager, 
					isOnline		: isOnline,
					user			: objChatDefine.user,
					typChat			: objChatDefine.typChat
					}
			));
			
			do_lc_bind_event_chat_header("#div_chat_header");
		}

		const do_lc_bind_event_chat_header = (pr_divContent) => {
			if (!pr_obj.files) pr_obj.files = [];
			let option	= {
					parallelUploads	: 10,
		            uploadMultiple	: true,
					fileinput		: {	maxFiles : 1, param : {typ01: 1, typ02: 1} },
					obj				: pr_obj
			}			
			do_gl_init_fileDropzone($(pr_divContent), option);
			
			$("#btn_clear_chat").off("click").on("click", function(){
				do_lc_show_chatroom({user: initialeValues.obj, lstMessage: [], hasMsg: true});
				do_lc_delete_content_chat();
			});

			$("#btn_view_info").off("click").on("click", function(){
				do_lc_show_popup_info_group(initialeValues);
			});

			$("#btn_create_video").off("click").on("click", () => {
				pr_ctr_WebRTC.do_lc_show(initialeValues);
			});
			
			$("#btn_call_video").off("click").on("click", () => {
				//---check if room not in video call--------
				App.controller.ChatRoom.WebRTC.do_lc_show		(initialeValues);
			});
			
			$("#btn_delete_group").off("click").on("click", () => {
				do_lc_del_group();
			})

			$("#btn_show_files").off("click").on("click", () => {
				pr_ctr_Doc.do_lc_get_files(initialeValues.obj, initialeValues.currentTyp);
			});
			
			$("#btn-sound").off("click").on("click", () => {
				$("#btn-sound").addClass("hide");
				$("#btn-sound-off").removeClass("hide");
				do_lc_turn_off_sound();
			});
			
			$("#btn-sound-off").off("click").on("click", () => {
				$("#btn-sound-off").addClass("hide");
				$("#btn-sound").removeClass("hide");
				do_lc_turn_on_sound();
			});
			
			$("#btn_sync_chat").off("click").on("click", () => {
				do_lc_reset_message();
			});
			
			$("#btn_mod_info").off("click").on("click", function(){
				$("#div_prj_ent_file_upload").removeClass("hide");
				$("#inp_grp_name").removeClass("hide");
				$("#a_btn_save_content, #a_btn_cancel_content")	.removeClass("hide");

				$("#h_name_ent").addClass("hide");
				$(".card-drop").addClass("hide");
			})

			$("#btn_out_group").off("click").on("click", () => {
				const isMe = initialeValues.members[App.data.user.id];
				if(isMe){
					if(isMe.typ === pr_member_lev_manager){
						do_lc_owner_out_group();
					} else {
						do_gl_init_msgbox_confirm($.i18n("prj_chat_out_group_msg_confirm"), do_lc_out_group);
					}
				}
			})

			$("#a_btn_save_content").off("click").on("click", function(){
				pr_obj.files 		= pr_obj.files ? [...pr_obj.files].filter(Boolean) : [];
				pr_obj.name			= $("#inp_grp_name").val()
//					ent.files		= ent.files.concat(obj.files);
				pr_ctr_Group.do_lc_mod_info_group_chat(pr_obj);
			})
				
			$("#a_btn_cancel_content").off("click").on("click", function(){
				self.do_lc_show(pr_obj, pr_typChat);
			})

			$(".btn-resize-middle").off("click").on("click", function(){
				let $this 		= $(this);
				let child		= $this.find("i");
				let {divtoggle} = $this.data();

				$(divtoggle)	.toggle("hide");
				child			.toggleClass("mdi-window-minimize mdi-window-maximize");
			})	

			$(".btn-resize-col").off("click").on("click", function(){
				let isExistClass = $(".chatroom_middle").hasClass("col-lg-6");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_middle").toggleClass('col-lg-6').toggleClass('col-lg-4');
						$(".chatroom_right"  ).toggleClass('col-lg-3').toggleClass('col-lg-5');
					}else{
						$(".chatroom_middle").toggleClass('col-lg-6').toggleClass('col-lg-7');
						$(".chatroom_right"  ).toggleClass('col-lg-4').toggleClass('col-lg-3');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-4");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_middle").toggleClass('col-lg-4').toggleClass('col-lg-6');
						$(".chatroom_right"  ).toggleClass('col-lg-5').toggleClass('col-lg-3');
					}else{
						$(".chatroom_middle").toggleClass('col-lg-4').toggleClass('col-lg-7');
						$(".chatroom_right"  ).toggleClass('col-lg-6').toggleClass('col-lg-3');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-5");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_middle").toggleClass('col-lg-5').toggleClass('col-lg-6');
						$(".chatroom_right"  ).toggleClass('col-lg-4').toggleClass('col-lg-3');
					}else{
						$(".chatroom_middle").toggleClass('col-lg-5').toggleClass('col-lg-7');
						$(".chatroom_right"  ).toggleClass('col-lg-5').toggleClass('col-lg-3');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-7");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_middle").toggleClass('col-lg-7').toggleClass('col-lg-4');
						$(".chatroom_right"  ).toggleClass('col-lg-2').toggleClass('col-lg-5');
					}else{
						$(".chatroom_middle").toggleClass('col-lg-7').toggleClass('col-lg-4');
						$(".chatroom_right"  ).toggleClass('col-lg-3').toggleClass('col-lg-6');
					}
					return;
				}

				isExistClass = $(".chatroom_middle").hasClass("col-lg-3");
				if(isExistClass){
					let isClassleft = $(".chatroom_left"  ).hasClass("col-lg-3");
					if(isClassleft){
						$(".chatroom_middle").toggleClass('col-lg-3').toggleClass('col-lg-6');
						$(".chatroom_right"  ).toggleClass('col-lg-6').toggleClass('col-lg-3');
					}else{
						$(".chatroom_middle").toggleClass('col-lg-3').toggleClass('col-lg-7');
						$(".chatroom_right"  ).toggleClass('col-lg-7').toggleClass('col-lg-3');
					}
					return;
				}
			})	

			$("#inp_search_chat").off("keypress").on("keypress", function(e){
				if (e.keyCode == pr_KEY_ENTER){
					e.preventDefault();

					//TODO: test performance remove highlight chat 
					// console.time('executionTime');
					// $(".ul_lst_msg_append").find(".highlight").removeClass("highlight");
					// console.timeEnd('executionTime');

					do_search_chat();
				}
			})

			$("#btn_search_chat").off("click").on("click", function(e){
				do_search_chat();
			})

			$("#btn_cancel_search_chat").off("click").on("click", function(e){
				$("#btn_cancel_search_chat").addClass("hide");
				$("#inp_search_chat").removeClass("chat-searching");
				$("#inp_search_chat").val('');
				$('.chats-text-cont div').remove();
				pr_old_msg_search = "";
				pr_index_msg_search_min 	= 0;
				do_lc_show_chatroom({user: initialeValues.obj, lstMessage: [...initialeValues.lstMsgCurrent].reverse(), hasMsg: true});
			})
			$("#btn_create_stream").off("click").on("click", function(e){
				pr_ctr_WebRTC.do_lc_show(initialeValues);
			});
			$("#btn_refresh_channel").off("click").on("click", function(e){
				pr_ctr_WebRTC.req_participate_channel(initialeValues);
			});
			
		}
		
		const do_lc_delete_content_chat = () => {
			const {obj} 	= initialeValues;

			const params 	= {entId: obj.id};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL_LIST, params);	

			const fSucces	= [];
			fSucces.push(req_gl_funct(null, do_lc_del_list_msg_response, [ obj.id]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_del_list_msg_response = function(sharedJson, grpId){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_gl_show_Notify_Msg_Success ($.i18n('common_del_success_msg') );
				
				pr_ctr_IndexedDB.do_lc_delete_collection (pr_Collect_Msg, grpId);
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		
		//-------------------------------------------------------------------------------
		//----SEARCH---------------------------------------------------------------------
		//-------------------------------------------------------------------------------
		const do_search_chat = function (){
			const msg 		= $("#inp_search_chat").val() || "";

			var userData	= {user: initialeValues.obj, lstMessage: [...initialeValues.lstMsgCurrent], hasMsg: true};
			
			if (!msg || msg.length <= 0) {
				do_lc_show_chatroom(userData, true);
				return;
			} 
			
			if (msg != pr_old_msg_search) {
				if (pr_old_msg_search.length>0) do_lc_show_chatroom(userData, true);
				
				$("#inp_search_chat"		).addClass		("chat-searching");
				$("#btn_cancel_search_chat"	).removeClass	("hide");
				pr_old_msg_search 			= msg;
				pr_index_msg_search_min 	= initialeValues.lstMsgCurrent.length-1;

				if (!pr_initialeValues_to_search || pr_initialeValues_to_search.lstMsgCurrent.length != initialeValues.lstMsgCurrent.length)
					pr_initialeValues_to_search = initialeValues;
			}
			
			setTimeout(function(){
				do_lc_chat_search_msg(msg);
			},300);
			
		};
		
		const do_lc_chat_search_msg = (msg) => {
			let ok = do_lc_chat_search_msg_in_list(pr_initialeValues_to_search.lstMsgCurrent, msg);

			if (!ok && pr_initialeValues_to_search){ 
				var msgTyp		= pr_initialeValues_to_search.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
				var entId 		= pr_initialeValues_to_search.obj.id;
//				pr_initialeValues_to_search.begin += pr_MSG_NUMBER;

				do_lc_get_more_msg_and_search(entId, msgTyp, pr_initialeValues_to_search.lstMsgCurrent.length, msg);
			}
		}
		
		const do_lc_chat_search_msg_in_list = (lstMsgCurrent, msg) => {
			if (!lstMsgCurrent || lstMsgCurrent.length<=0) return false;
			var msg_last 		= lstMsgCurrent[lstMsgCurrent.length-1];
			var msg_last_id 	= msg_last.id;
			var $div_msg_last 	= $("#li_msg_item_append_"+ msg_last_id);
			var scrollPosLast 	= $div_msg_last.position().top;
			
			for (let i = pr_index_msg_search_min; i>0; i-- ){
				//pureText to remove tab html: img, emoji,....
				var pureText = new DOMParser().parseFromString(lstMsgCurrent[i].inf04, "text/html").documentElement.textContent;
				if (pureText.includes(msg)) {
					pr_index_msg_search_min = i-1;
					
					var msg_id 		= lstMsgCurrent[i].id;
					var $div_msg 	= $("#li_msg_item_append_"+ msg_id);
					
					const 	d 		= new Date();
					let 	id 		= d.getTime();
					$div_msg.highlight(msg, "highlight", id);
					
					//-----scroll to msg
					const $divScroll = $("#ul_lst_msg .simplebar-content-wrapper"); 
					
					$divScroll.animate({scrollTop: $divScroll.scrollTop() + ($div_msg.offset().top - $divScroll.offset().top)});
					
					return true;
				}
			}
			return false;
		}

		const do_lc_get_more_msg_and_search = function(entId, msgTyp, begin, msg){
			const dtEnd 	= pr_initialeValues_to_search.lstMsgCurrent.length ? pr_initialeValues_to_search.lstMsgCurrent[pr_initialeValues_to_search.lstMsgCurrent.length - 1].dt : new Date();
			const dtBegin	= req_gl_DateAdd(dtEnd	, "M", -5 );
			const params 	= {entId, msgTyp, begin, nb: pr_MSG_NUMBER, dtBegin, dtEnd};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST, params);	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getMsg_response_search, [msg]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_getMsg_response_search = function(sharedJson, msg){
			if(can_gl_AjaxSuccess(sharedJson)) {
				if (sharedJson[App['const'].RES_DATA].length == 0) { //search until end
					pr_index_msg_search_min = 0;
					App.MsgboxController.do_lc_show({
						title		: $.i18n("prj_chat_search_title"),
						content 	: $.i18n("prj_chat_no_match_found"),
						autoclose	: true,
						buttons		: {
							OK: {
								lab			: $.i18n("msgbox_OK_title"),
								autoclose	: true,
								classBtn	: "btn-primary"
							},
						}
					});	
					return;
				} 
				
				const {obj} 	= initialeValues;
				let data 		= sharedJson[App['const'].RES_DATA] || [];
				let userData 	= {}, user_me_id = App.data.user.id, user_you_id = obj.id;

				if(data.length){					
					data = do_build_info_and_filter(data);
					data = do_build_avatar_user(data);
					
					initialeValues.lstMsgCurrent 	= [...initialeValues.lstMsgCurrent, ...data];
					userData 	= {user: obj, lstMessage: [...initialeValues.lstMsgCurrent].reverse(), hasMsg: initialeValues.lstMsgCurrent.length ? true: false, isShowLoadMore : true};

					do_lc_show_chatroom(userData, false);
					
					setTimeout(function(){
						do_lc_chat_search_msg(msg);
					},500);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		//-------------------------------------------------------------------------------
		//----------GROUP INFO------------------------------------------------------------
		//-------------------------------------------------------------------------------
		const do_lc_show_popup_info_group = function(initialeValues){
			let obj = initialeValues.obj;
			if(obj.val01 && typeof obj.val01 === 'string'){
				obj.val01 = JSON.parse(obj.val01);
			}
			initialeValues.obj.isManager = initialeValues.isManager;
			if (initialeValues.isManager) {
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_chat_group_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO_POPUP	, {obj: initialeValues.obj, hasJoin: true}),	
					autoclose	: true,
					buttons		: {
						SEND 	: {
							lab 		: "<i class='mdi mdi-send'></i>",
							funct		: do_lc_update_chat_group,
							autoclose	: true
						},
					},
					onClose		: () => {
						avatarGr		= {files: []};
					},
				});
				if(initialeValues.obj.typ02		) do_gl_select_value($("#chat_group_typ"), initialeValues.obj.typ02);
				if (initialeValues.obj.avatar) avatarGr.files.push(initialeValues.obj.avatar);
				let option	= {
					obj 			: avatarGr,
					fileinput		: {maxFiles : 1, param : {typ01: 1, typ02: 1} },//option here
				}
				do_gl_init_fileDropzone($("#frm_dropzone_send"), option);
			} else {
				App.MsgboxController.do_lc_show({
					title		: $.i18n("prj_chat_group_title"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO_POPUP	, {obj: initialeValues.obj, hasJoin: true}),	
					autoclose	: true,
					buttons		: "none",
				});
			}
		}

		const do_lc_update_chat_group = function() {
			let ent = {
				id: initialeValues.obj.id,
				files: avatarGr.files,
				typ02: parseInt($("#chat_group_typ").val(), 10),
				name: $("#chat_group_name").val()
			}
			
			//--update in server side
			/*
			if (avatarGr.files.length > 0) {
				ent.val01 = {img: decodeURIComponent(avatarGr.files[0].path01)}; 
			}*/
			
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_MOD_GROUP, {obj: JSON.stringify(ent)});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_update_chat_group_success, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_update_chat_group_success = function(sharedJson, group){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data = sharedJson[App['const'].RES_DATA];
				if(data){
					do_gl_show_Notify_Msg_Success 	($.i18n("common_success_update") );
					initialeValues.obj = data;
					$(".chat-item[data-id='"+data.id+"']").find("img").attr("src" , data.avatar.urlPrev);
				}
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		const do_lc_owner_out_group = () => {
			const lstOtherMember = Object.values(initialeValues.members).filter(m => m.uId !== App.data.user.id);
			if(!lstOtherMember || !lstOtherMember.length){
				do_lc_del_group();
			} else {
				App.MsgboxController.do_lc_show({
					title		: $.i18n("common_btn_validate"),
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_MSGBOX_CHOICE_OWNER, {members : lstOtherMember}),	
					autoclose	: false,
					buttons		: {
						OK: {
							lab		: $.i18n("prj_chat_out_group_btn_out_group"),
							funct	: () => {
								const idSel = $(".sel-owner:checked").val();
								idSel && do_lc_out_group(idSel);
							},
							autoclose	: false,
							classBtn	: "btn-primary"
						},
						NO: {
							lab		: $.i18n("prj_chat_out_group_btn_delete_group"),
							funct	: do_lc_del_group,
							classBtn: "btn-danger"
						}
					}
				});	
			}
		}

		const do_lc_out_group = function(idSel){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_OUT_GROUP, {id : initialeValues.obj.id, idSel});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterOut_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterOut_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_chat, #div_video_call, #div_member, #div_member_wait, #div_doc, #div_files").html("");
				$(".modal").length && App.MsgboxController.do_lc_close();
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_del_group = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS_GROUP, pr_SV_DEL_GROUP, {id : initialeValues.obj.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_afterDel_group, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_afterDel_group = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_chat, #div_video_call, #div_member, #div_member_wait, #div_doc").html("");
				pr_ctr_Group.do_lc_get_list_chat();
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_show_info_group = function(hasJoin = false){
			$("#div_chat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO	, {obj: initialeValues.obj, hasJoin}));
			$("#div_member, #div_member_wait, #div_files", "#div_post").html("");
			do_lc_bind_event_send_request();
		}

		const do_lc_bind_event_send_request = function(){
			$("#btn_join_group").off("click").on("click", function(){
				do_lc_join_group_private();
			})

			$("#btn_cancel_join").off("click").on("click", function(){
				do_lc_cancel_join_group();
			})

			$("#btn_refresh_join").off("click").on("click", () => do_lc_get_myRoleInGrp());
		}

		const do_lc_join_group_public = function(){
			const ref 			= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_JOIN_PUBLIC, {groupId: initialeValues.obj.id});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_join_group_public_callback, []));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_join_group_public_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				do_lc_get_myRoleInGrp();
			} else {   
			}
		}

		const do_lc_join_group_private = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_JOIN, {groupId: initialeValues.obj.id});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_join_group_private_callback, []));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_join_group_private_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_chat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO	, {obj : initialeValues.obj, hasJoin: true}));
			} else {   
				$("#div_chat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO	, {obj : initialeValues.obj}));
			}
			do_lc_bind_event_send_request();
		}

		const do_lc_cancel_join_group = function(){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_CANCEL_JOIN, {groupId: initialeValues.obj.id});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_cancel_join_group_callback, []));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_cancel_join_group_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				$("#div_chat")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_GROUP_INFO	, {obj : initialeValues.obj}));
				do_lc_bind_event_send_request();
			}
		}
		//-------------------------------------------------------------------------------
		//-------FOOTER------------------------------------------------------------------
		//-------------------------------------------------------------------------------
		const do_lc_show_chat_footer = () => {
			$("#div_chat_footer").html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_FOOTER	, {simpleChat : initialeValues.chatSimple}));
			
			pr_ctr_Main.do_lc_show_emoji();
			
			do_lc_bind_event_footer();
		}

		const do_lc_send_msg_chat = (lstFile, audio) => {
			/*$("#div_chat_list_img .btn-chat-delete-img").remove();
			
			var htmlImg   		= $("#div_chat_list_img").html() || "";
			if (htmlImg.length>0){
				htmlImg			= htmlImg.replace(/div-chat-img-parent/g, "div-chat-img"); //replace class to show
				htmlImg			= htmlImg.replace(/chat-insert-img/g	, "files_content_chat")
				htmlImg 		= "<div class='row'>"+htmlImg+"</div>";
			}*/
			var htmlImg = "";
			var files 	= [];
			$("#div_chat_list_img img").each(function(i){
				let fname 	= $(this).data("name");
				let fUrl	= $(this).data("path");
				let fId		= $(this).data("id");
				files.push({"fName":fname, "id": fId, "fUrl": fUrl});
			});
			
//			/{"files":[{"fName":"abc.PNG","fUrl":"\/files\/raw\/9000\/24\/240604\/1717502794796_quản_.PNG","id":265}]}
			
			
			if (files.length>0) {
				if (lstFile !=null) lstFile.files = [...lstFile.files, ...files];
				else lstFile = {"files": files};
			}
			
			//----format content msg------
			var   cont		=  initialeValues.chatSimple?   $("#inp_msg").html() || "" :  $("#inp_msg").val() || "";

			cont			= cont.trim();
			while (cont.indexOf("<br>") == 0){
				cont = cont.substring(4, cont.length);
			}
			if(cont.length > 3){
				while (cont.lastIndexOf("<br>") == cont.length - 4){
					cont = cont.substring(0, cont.length - 4);
				}
			}
			
			let 		isUrl 	= do_lc_check_url(cont);
			if(!isUrl) 	cont 	= urlify(cont);
			
			//----build msg content
			if (!htmlImg || !htmlImg.length){
				const msg 		= audio? audio: cont;

				if((!msg || !msg.length)&&!lstFile)	return false;
				
				do_lc_send_msg (msg, lstFile?lstFile.files:null,audio);
			} else {

				const msg 		= htmlImg + cont;
				do_lc_send_msg (msg, lstFile?lstFile.files:null,audio);
			}

		}
		
		const urlify = function(text) {
	        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;   
			return text.replace(urlRegex, function(url) {
				return '<a href="' + url + '" target="_blank">' + url + '</a>';
			})
		}
		
		const do_lc_check_url = function(text){
			let href = text.includes("href");
			if(href) return true;
			return false;
		}

		const do_lc_bind_event_footer = (simpleChat) => {
			!initialeValues.chatSimple && App.SummerNoteController.do_lc_show("#div_chat", {height : 100}, false);//text editor

			const fileData  = { files: [] };
			do_lc_bind_event_fileInput(fileData);

			$("#btn_send_msg").off("click").on("click", function(){
				if (rec && rec.recording){
					do_lc_stopRecording(true);
					return;
				};
				
				const lstFile 	= fileData;
				do_lc_send_msg_chat(lstFile);


				$('#inp_msg').html('');
				$('.chats-text-cont div').remove();	
				//enter function send
			})

			$("#btn_send_like_direct").off("click").on("click", function(){
				const lstFile 	= fileData;
				const msg 		= "&#128077;";
				do_lc_send_msg(msg, lstFile.files);
				//enter function send
			})

			$("#inp_msg").off("keypress").on("keypress", function(e){
				if (e.keyCode == pr_KEY_ENTER && e.shiftKey){
					return;
				}

				if (e.keyCode == pr_KEY_ENTER){
//					$("#btn_send_msg").click();
//					return;
					e.preventDefault();
					const lstFile 	= fileData;
					do_lc_send_msg_chat(lstFile);

					$('#inp_msg').html('');
					$('.chats-text-cont div').remove();	
				} 
			})
			$("#ul_lst_msg").focus();
			
			$("#btn_add_file").off("click").on("click", function() {
				const isHide 		= $("#div_inp_file").hasClass("hide");
				$("#div_inp_file")	.toggleClass("hide");
				if(isHide){
					$("#div_inp_file form")	.click();
				} else {
					pr_LST_INPUT_FILE[0]	.removeAllFiles();
					fileData.files.length 	= 0;
				}
			})

			$("#inp_msg").bind("paste", function(event){
				var items = (event.clipboardData || event.originalEvent.clipboardData).items;
				for (index in items) {
					var item = items[index];
					if (item.kind === 'file') {
						$("#div_msg_with_img")	.removeClass("hide");

						var blob = item.getAsFile();
						do_lc_up_file_inline("#div_chat_list_img", blob);
						/*						
						var reader = new FileReader();
						reader.onload = function(e){
							var image = `<img src='${e.target.result}' class='chat-insert-img'>`;
				            $("#div_chat_list_img").append(image);

							pr_HTML_IMG_INLINE += image.replace("chat-insert-img", "chat-display-img");
							pr_LST_IMG_INLINE.push(blob);
						}
						reader.readAsDataURL(blob);*/
					}
				}
			} );

			$("#btn_trans_simple").off("click").on("click", function() {
				if(initialeValues.chatSimple)	return;
				initialeValues.chatSimple = true;
				do_lc_show_chat_footer();
			})

			$("#btn_trans_summer").off("click").on("click", function() {
				if(!initialeValues.chatSimple)	return;
				initialeValues.chatSimple = false;
				do_lc_show_chat_footer();
				$("#div_table_emoji, #btn_add_file").parent().addClass("d-none");
			})

			$("#btn_add_emoji").on("click", function(e) {
				if (e.target.className.indexOf("emoji-menu-tab")>=0){
					e.preventDefault();
					return;
				}
				$("#div_table_emoji")	.toggleClass("d-none");
			})

			$("#inp_msg").off("input").on("input", function(e) {
				var tmp = $("#inp_msg").find('img');
				if (tmp.length > 0){
					for (let i = 0; i<tmp.length; i++){
						if (!tmp.get(i).src.includes("emoji")){
							$("#inp_msg").find('img').get(i).remove();
						}
					}
				}
			})

			$("#inp_msg").focus(function() {
				do_lc_read_chat();
			});

			$("#btn_capture").off("click").on("click", function() {
				if (!ios) {
					do_lc_show_webcam(() => {
						$("#div_inp_capture")	.toggleClass("hide");
					});
				} else {
					do_lc_show_webcam();
					// // take snapshot and get image data
					webcam.snap( function(data_uri) {
						var file = dataURLtoFile(data_uri, 'photo.jpeg');
						do_lc_up_file_inline("#div_chat_list_img", file);
						$("#div_msg_with_img")	.removeClass("hide");
					});
				}
			})

			$("#switch_cam").off("click").click(() => {
				webcam.reset();
				if (camMode == "user") {
					webcam.set('constraints',{
						facingMode: "environment"
					});
					camMode = "environment";
				} else {
					webcam.set('constraints',{
						facingMode: "user"
					});
					camMode = "user";
				}
				webcam.attach( '#my_camera' );
				
				$("#my_camera").show();
				$("#photo_res").removeAttr("src");
				$("#take_sc").removeClass("icon-disabled");
				$("#trash").addClass("icon-disabled");
				$("#send_sc").addClass("icon-disabled");
			})

			$("#take_sc").off("click").click(()=> {
				// take snapshot and get image data
				webcam.snap( function(data_uri) {
					$("#my_camera").hide();
					// display results in page
					$("#photo_res").show();
					$("#photo_res").attr("src", data_uri);
				});

				$("#take_sc").addClass("icon-disabled");
				$("#trash").removeClass("icon-disabled");
				$("#send_sc").removeClass("icon-disabled");
			});

			$("#trash").off("click").click(()=> {
				$("#photo_res").hide();
				$("#my_camera").show();
				

				$("#take_sc").removeClass("icon-disabled");
				$("#trash").addClass("icon-disabled");
				$("#send_sc").addClass("icon-disabled");
			});

			$("#close_sc").off("click").click(()=> {
				webcam.reset();
				$("#photo_res").hide();
				$("#div_inp_capture")	.toggleClass("hide");
			});

			$("#send_sc").off("click").click(()=> {
				//
				var file = dataURLtoFile($("#photo_res").attr("src"), 'photo.jpeg');
				do_lc_up_file_inline("#div_chat_list_img", file);
				$("#div_msg_with_img")	.removeClass("hide");

				$("#trash" ).trigger("click");

				webcam.reset();
				$("#div_inp_capture")	.toggleClass("hide");
			});
			
			$("#btn_recorder").off("click").on("click", function() {
				do_lc_startRecording();
			})

			$("#btn_recorder_stop").off("click").on("click", function() {
				do_lc_stopRecording(false);
			})
		}

		const dataURLtoFile = (dataurl, filename) => {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), 
				n = bstr.length, 
				u8arr = new Uint8Array(n);
				
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, {type:mime});
		}
		
		const do_lc_show_webcam = (callback) => {
			// Configure a few settings and attach camera
			webcam.set({
				width: 320,
				height: 240,
				image_format: 'jpeg',
				jpeg_quality: 90
			});
			webcam.attach( '#my_camera' , callback);
			$("#my_camera").show();
		}
		
		const do_lc_effect_message_read = () => {
			pr_ctr_Group.do_lc_effect_message_read_by_chat_room(initialeValues);
		}

		const do_lc_up_file_inline = function(divListImg, file){
			let groupId 	= initialeValues.obj.id;
			let ref 		= new FormData();
			ref.append('sv_class'	, 'ServiceTpyDocument');
			ref.append('sv_name'	, 'SVNewInChat');
			ref.append('entId'		, groupId);
			ref.append('typ01'		, 10);
			ref.append('typ02'		, 10);
			ref.append('file'		, file);
			
			const headers = {
					Authorization: App.data["HttpSecuHeader"].Authorization,
					Accept: 'multipart/form-data'
			}

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_upload_file_inline, [divListImg]));

			let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax_form(App.path.BASE_URL_API_UPLOAD, headers, ref, 100000, fSucces, fError);
		}

		const do_lc_after_upload_file_inline = function(sharedJson, divListImg){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data && data.length){
					for(let img of data){
						let rotate 	= ""; 
//						if (ios) rotate = "style='transform: rotate(-90deg);'";
						var pathPrev= img.urlPrev? img.urlPrev : img.url;
						var path 	= img.url;
						var imgId	= img.id;
						var imgName	= img.fName;
						
						var image = "<div class='div-chat-img-parent'>"+
										"<img src='"+ pathPrev+"' "+ rotate+ " class='chat-insert-img' data-path='"+ path + "' data-id='"+ imgId+ "' data-name='"+imgName+"'>"+
										"<i class='btn-chat-delete-img fa fa-times' data-id='"+ imgId+ "'></i>"+
									"</div>";
						
						//var image = `<div class='div-chat-img-parent'><img src='${pathPrev}' ${rotate} class='chat-insert-img' data-path='${path}' data-id='${imgId}' data-name='${imgName}'><i class='btn-chat-delete-img fa fa-times' data-id='${imgId}'></i></div>`;
						$(divListImg).append(image);
					}
					do_lc_bind_event_img_inline();
				}
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
			}
		}

		const do_lc_bind_event_img_inline = function () {
			$(".btn-chat-delete-img").off("click").on("click", function() {
				
				var id = $(this).data("id");
				do_lc_remove_file (id);
				
				$(this).closest('.div-chat-img-parent').remove();
				if ($("#div_chat_list_img").html() == "") $("#div_msg_with_img").addClass("hide"); 
			})
		}
		
		const do_lc_remove_file = function(id){
			const ref 		= req_gl_Request_Content_Send_With_Params("ServiceTpyDocument", "SVDelInChat", {id : id});	

			let fSucces		= [];
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_bind_event_fileInput = (fileData) => {
			let options			= {
					fileinput	: {maxFiles : 10, param : {typ01: 10, typ02: 10} },//option here
					obj			: fileData//file existing here
			}
			pr_LST_INPUT_FILE = do_gl_init_fileDropzone($("#div_chat_footer"), options);
		}

		const do_lc_build_page = function(obj, typChat){
//			if(initialeValues.currentTyp == pr_TYP_CHAT_USER){
//			do_lc_show_form_chat();
//			self.do_lc_get_content_chat();
//			} else if(initialeValues.currentTyp == pr_TYP_CHAT_GROUP){
//			}

			do_lc_get_myRoleInGrp(obj, typChat);
		}

		//--------------------------------------------------------------------------------------
		//--------CONTENT------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------
		const do_lc_load_more_chat = async () => {

			let currentMessages 	= initialeValues.lstMsgCurrent
			const {obj} 			= initialeValues;
			pr_ctr_IndexedDB.do_lc_req_collection(pr_Collect_Msg, obj.key,function(res){
				if (res && res.data){
					do_lc_old_msg(currentMessages,res.data, obj);
				}
			});
		}
		
		const do_lc_old_msg = function(currentMessages, oldMessagesCont, obj){
			if (!currentMessages) currentMessages =[];
			if (!oldMessagesCont) oldMessagesCont =[];
			
			//oldMessagesCont.sort((a, b) => new Date(b.dt01) - new Date(a.dt01));
			//currentMessages.sort((a, b) => new Date(b.dt01) - new Date(a.dt01));
	
			const currentMessageIds = new Set(currentMessages.map(msg => msg.id));
			
			//---get only message not in ZoneChat
		    let filteredOldMessages = oldMessagesCont.filter(m => !currentMessageIds.has(m.id));
		    
		    if (filteredOldMessages.length === 0){
				const msgTyp 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
				const dtEnd 	= currentMessages.length ? currentMessages[0].dt01 : new Date();
				const dtBegin	= req_gl_DateAdd(dtEnd, "M", -12 );
				const idMax		= currentMessages[0].id;
				
				const params 	= {entId: obj.id, msgTyp, nb: pr_MSG_NUMBER, dtBegin, dtEnd, idMax};
				const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST, params);	
		
				const fSucces	= [];
				fSucces.push(req_gl_funct(null, do_lc_get_oldmsgDB, [currentMessages, oldMessagesCont, obj]));
		
				const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
				App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
			
		    }else{
		    	
				var 	newMsgToShow 		= [];
				const 	oldestMessageId 	= currentMessages[0].id;
				let 	count = 1;
	
				for(const m of filteredOldMessages) {
					if(oldestMessageId <= m.id) continue;
					
					newMsgToShow	.push(m)
					currentMessages	.push(m)
					count++
					
					if(count >= pr_MSG_NUMBER) break;
				}
				
				do_lc_read_chat();
				
				//---order-----------
				currentMessages	.sort((a, b) => a.id - b.id);
				newMsgToShow	.sort((a, b) => a.id - b.id);
				
				initialeValues.lstMsgCurrent 	= currentMessages;
				let newuserData 	   			= { 
							user				: obj, 
							lstMessage 			: newMsgToShow,
							hasMsg				: newMsgToShow.length ? true: false,
							isShowLoadMore 		: true
				};
				const newContent 				= tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_OLDMSG, newuserData);
				
				$("#ul_lst_msg_append").prepend(newContent);
			}
		}


		const do_lc_get_oldmsgDB = function(sharedJson,currentMessages, data, obj){
			if(can_gl_AjaxSuccess(sharedJson)){
				data = sharedJson[App['const'].RES_DATA] || [];
				if (data.length > 0){
					do_lc_old_msg(currentMessages, data, obj);
				}else{
					$("#btn_load_more").hide();
				}
			}
		}
		//--------------------------------------------------------------------------------------
		this.do_lc_get_content_chat = function(initialeValues, doScroll){
			const {obj} 	= initialeValues;

			//---show from IndexedDB first
			pr_ctr_IndexedDB.do_lc_req_collection(pr_Collect_Msg, obj.key || obj.id, function(res){
				
				if (res && res.data){
					do_lc_showAndCheck_chatroom   (initialeValues, res.data, false, doScroll, false);
					//---get more msg and append to chat zone
					do_lc_get_content_chat_fromBE (initialeValues, doScroll, true);
				}else{
					do_lc_get_content_chat_fromBE (initialeValues, doScroll, false);
				}
//				do_lc_get_content_chat_fromBE (doScroll, false);
			});
		}

		const do_lc_get_content_chat_fromBE = function(initialeValues, doScroll, forAppend){
			const {obj} 	= initialeValues;
			const msgTyp 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;

			var	  lastMsg	= null;
			if (initialeValues.lstMsgCurrent.length>0){
				  lastMsg	= initialeValues.lstMsgCurrent[initialeValues.lstMsgCurrent.length - 1];
			}
			
			var	  idMin		= null;	
			var   dtBegin 	= null;
			if (lastMsg){
				dtBegin 	= lastMsg.dt01;
				idMin		= lastMsg.id;
			}
			
			const params 	= {entId: obj.id, msgTyp, dtBegin, idMin};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST, params);	

			const fSucces	= [];
			fSucces.push(req_gl_funct(null, do_lc_get_content_chat_callback, [initialeValues, doScroll, forAppend]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_get_content_chat_callback = function(sharedJson, initialeValues, doScroll, forAppend){
			if(can_gl_AjaxSuccess(sharedJson)) {
				let data 		= sharedJson[App['const'].RES_DATA] || [];
				
				do_lc_showAndCheck_chatroom (initialeValues, data, true, doScroll, forAppend);
				
			} else {   
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}
		
		const do_lc_showAndCheck_chatroom = function (initialeValues, data, fromBE, doScroll, forAppend){
			const {obj} 	= initialeValues;
			if (forAppend && data.length==0) return;
			
			if (data.length==0 && initialeValues.lstMsgCurrent.length === 0){
				$("#div_chat_msg")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT	, {}));
				$("#btn_load_more")	.hide();
				return;
			}
			
			let isShowLoadMore 	= data.length == 0 && !forAppend? false : true;
			let userData 		= {}, user_me_id = App.data.user.id, user_you_id = obj.id;

			//---get only message not in ZoneChat
			let currentMessages 	= initialeValues.lstMsgCurrent;
			const currentMessageIds = new Set(currentMessages.map(msg => msg.id));
			data 					= data.filter(m => !currentMessageIds.has(m.id));
			
			var dataNew = do_build_info_and_filter	(data, forAppend);
				dataNew = do_build_avatar_user		(dataNew);

			if (dataNew) initialeValues.lstMsgCurrent 	= [...initialeValues.lstMsgCurrent, ...dataNew];
			
			if (!forAppend){
				userData 	= {	user			: obj, 
								lstMessage		: [...initialeValues.lstMsgCurrent],//.reverse(), 
								hasMsg			: initialeValues.lstMsgCurrent.length ? true: false, 
								isShowLoadMore 	: isShowLoadMore};

				do_lc_show_chatroom(userData, doScroll, div_msg_last);
			
				
			}else{
				for (var msg of dataNew) {
					do_lc_pushTo_zoneChat (msg);
				}
			}
			//----save to indexedDB------
			if (fromBE) pr_ctr_IndexedDB.do_lc_update_recordMulti (pr_Collect_Msg, obj.key, data);
			
			
			//-------------------------------------------------------------------------
			var div_msg_last 	= null;
			var lastMsgIndex	= 0;
			if (initialeValues.lstMsgCurrent && initialeValues.lstMsgCurrent.length>0){
				lastMsgIndex		= initialeValues.lstMsgCurrent.length-1;
				var msg_last 		= initialeValues.lstMsgCurrent[lastMsgIndex];
				
				App.data.msgLast 	= msg_last;
				App.data.msgLastId 	= msg_last.id;
				 	div_msg_last 	= ("#li_msg_item_append_"+ App.data.msgLastId);
			}
			
			
			
			//-----get lst history---------------------------------------------------
			// Get historyLst from local
			let canCallAjax = true;
			try {
				let data = JSON.parse(localStorage.getItem("chatRoom.historyLst"));
				if (data.res_data[0].groupId == initialeValues.obj.id) {
					canCallAjax = false;
					do_lc_lst_history_chat_success(data);

					// Call bg reload new data
					do_lc_lst_history_chat();
				}
			} catch (e) {
			}
			if (canCallAjax) do_lc_lst_history_chat();

			if (intervalLstHistory != null) {
				clearInterval(intervalLstHistory);
			}
			intervalLstHistory = setInterval(() => {
				do_lc_lst_history_chat();
			}, pr_TIME_REFRESH);
		}
		
		const do_build_info_and_filter = (data, forAppend) => {
			var result 		= [];
			var user_me_id 	= App.data.user.id;
			
			var lim			= forAppend?data.length:pr_MSG_NUMBER; //forAppend => getAll
			for (var i=data.length-1; i>=0;i--){
				var o = data[i];
				if (!o) continue;
				
				if(o.uId == user_me_id)	o.forMe = true;
//				o.inf04 	= App.network.req_lc_DecodeUTF8 (o.inf04);
				if (o.inf05){
					try{
						o.inf05 = JSON.parse(o.inf05);
						o.files = o.inf05.files;
						o.hide	= o.inf05.hide;
					}catch(e){
					}
				}
				
				if 	(!o.hide) 
					result.unshift(o);//--add to pos 0
				else if (!o.hide[user_me_id]) 
					result.unshift(o);//--add to pos 0
				
				lim--;
				if (lim<=0) break;
			}
			
			return result;
		}
		
		const do_build_avatar_user = (data) => {
			if (!App.data["lstGrpMember"] || App.data["lstGrpMember"] == null) {
				setTimeout (do_build_avatar_user, 500, data);
				return data;
			}

			for(let i in data){
				try{
					let userId 	= data[i].uId;
					let user 	= App.data["lstGrpMember"][userId];				

					if(user){
						if (user.mem.avatar)  data[i].avatar = user.mem.avatar;
					}
				}catch(e){}
			}
			return data;
		}

		const do_lc_show_chatroom_append = function(msg){
			$("#ul_lst_msg_append").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_ITEM	, msg));
			
			do_lc_bind_event_chat_content();
			do_lc_scrollBottom_toChat();
			
//			initialeValues.isLoadMore = false;
		}
		
		const do_lc_show_chatroom = function(userData, doScroll, divDest){
			$("#div_chat_msg")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT	, userData));
			
			do_lc_bind_event_chat_content();
			do_lc_read_chat();
			
			if (doScroll == undefined || doScroll == true) 
				setTimeout(function(){
					if (divDest){
						var post = $(divDest).position().top;
						const $divScroll = $("#ul_lst_msg .simplebar-content-wrapper");
						$divScroll.scrollTop(post - 200);
					}else{
						do_lc_scrollBottom_toChat();
					}
				}, 50);
				
//			initialeValues.isLoadMore = false;
//			self.do_lc_init_call_rtc();
		}

		const do_lc_bind_event_chat_content = () => {

			$(".message-item").off("click").on("click", function() {
				$(this).find(".dropdown").removeClass('hide');
			})
			
			$(".message-item").off("dblclick").on("dblclick", function() {
				var body = $(this).find(".msg-body-other").text();
				if (!body)
					body = $(this).find(".msg-body-forme").text();
				
				if (body){
					do_gl_copyToClipboard(body.trim());		
					do_gl_show_Notify_Msg_Success ($.i18n('common_copyToClipboard_success') );
				}
			})
		
			
			$(".content-reponse").off('click').on('click', function() {
				let {user, msg, id} = $(this).data();
				if(user) {
					if(initialeValues.chatSimple) $("#inp_msg").append(`<span class="msg-rep"><a href="#li_msg_item_append_${id}">@${user}</a>: ${msg}</span><span>&nbsp;</span>`);
					if(!initialeValues.chatSimple) $("#inp_msg").summernote('code', `<i><span style="color: #556ee6;">@${user}</span>: ${msg}<span>&nbsp;</span></i><br/>`);
					
					var input = document.getElementById('inp_msg');
					placeCaretAtEnd (input);
				}
			})
			
			$(".content-copy").off("click").on("click", function() {
				const {body} = $(this).data();
				body && do_gl_copyToClipboard(body);
			})

			$(".content-hide").off("click").on("click", function() {
				const {id, dt } = $(this).data();
				$(this).closest(".message-item").remove();
				id && do_lc_hide_msg(id, dt)
			})

			$(".content-delete").off("click").on("click", function() {
				const {id, dt } = $(this).data();
				$(`#li_msg_item_append_${id}`).remove();
				id && do_lc_del_msg(id, dt)
			})

			$("#btn_load_more").off("click").on("click", function() {
				initialeValues.begin += pr_MSG_NUMBER;
				do_lc_load_more_chat();
//				initialeValues.isLoadMore = true;
			})

			$(".files_content_chat").off("click").on("click", function() {
				const {path} = $(this).data();
				let isImage = do_lc_check_image(path);
				if(isImage){
					const viewer = new Viewer(document.getElementById('div_chat_msg'), {
						filterImgClass: ['msg-body-forme', 'msg-body-other'],
						hide: function () {
							viewer.destroy();
						},
					});
				}else{
					window.open(path, "_blank");
				}
			})
		}
		
		const do_lc_pushTo_zoneChat = function(msg){
			if(msg.uId == App.data.user.id){
				msg.forMe 				    	= true;
				if (App.data.user.avatar)
					msg.avatar = App.data.user.avatar;

			} else {
				let memSend = initialeValues.members[msg.uId];
				if (!memSend) return; //---group chat has change
				
				if (memSend.mem && memSend.mem.avatar){
					msg.avatar 	= memSend.mem.avatar;
				}
			}

			App.data.msgLastId 		= msg.id;
			App.data.msgLast		= msg;

//			initialeValues.lstMsgCurrent.unshift(msg);
			initialeValues.lstMsgCurrent.push(msg);
			do_lc_show_chatroom_append(msg);
			
		}
		
		const do_lc_del_msg = function(id, dt){
			//----remove from indexedDB
			var group = initialeValues.obj;
			pr_ctr_IndexedDB.do_lc_delete_record (pr_Collect_Msg, group.id, id);
			
			//----send with socket
			var msgOut 	= {name : "MSG_CHAT_MSG_DEL", val:{id, dt}};
			if (App.controller.ChatRoom.Socket.can_lc_msg_Out (msgOut)){
				return;
			}
			//-----------------------------------------------
			try{
				console.log ("----Init socket");
				App.controller.ChatRoom.Socket.do_lc_init();
			}catch(e){
				console.log(e);
			}
			console.log ("----Cannot use Socket to del Msg");
			
			//----send with API----
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_DEL, {id, dt});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_del_msg_callback, [group.id, id]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}

		const do_lc_del_msg_callback = function(sharedJson, grpId, msgId){
			if(can_gl_AjaxSuccess(sharedJson)) {
				self.do_lc_del_msg_socket(grpId, msgId);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		const do_lc_hide_msg = function(id, dt){
			//----send with socket
			var msgOut 	= {name : "MSG_CHAT_MSG_HIDE", val:{id, dt}};
			if (App.controller.ChatRoom.Socket.can_lc_msg_Out (msgOut)){
				return;
			}
			
			//-----------------------------------------------
			try{
				console.log ("----Init socket");
				App.controller.ChatRoom.Socket.do_lc_init();
			}catch(e){
				console.log(e);
			}
			console.log ("----Cannot use Socket to hide Msg");
			
			//----send with API----
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_HIDE, {id, dt});	

			let fSucces		= [];
			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		const do_lc_send_msg = function(msg, files,audio){
			var inf05 = [];
			var sourceArr = files && files.length > 0 ? files : audio;
			for (var i in sourceArr){
				var fi = sourceArr[i];
				var fObj = {"id" : fi.id};//fname and furl will be updated in sv side
				inf05.push(fObj);
			}		
			var infoF		= inf05.length>0?'{"files": ' + JSON.stringify(inf05) + '}':null;		
			const typMsg 	= initialeValues.currentTyp == pr_TYP_CHAT_USER ? pr_TYP_MSG_PRIVATE : pr_TYP_MSG_PUBLIC;
			const cond 		= {msg, typMsg, entId: initialeValues.obj.id, inf05 : infoF};
			
			//---------------------------------------------------------------------------
			//---reset before sending----------------------------------------------------
			$("#div_inp_file")		.addClass("hide");
			$("#div_msg_with_img")	.addClass("hide");
			$("#div_chat_list_img")	.html("");
			$("#inp_msg")			.val("").focus();
			!initialeValues.chatSimple && $("#inp_msg").summernote('code', '');
			if (files){
				pr_LST_INPUT_FILE[0].files = pr_LST_INPUT_FILE[0].files.map(f =>{
					f.notDel = true; return f;
				});
				pr_LST_INPUT_FILE[0].removeAllFiles(true);
				files.length 		= 0;
			}
			
			//---------------------------------------------------------------------------
			//----send with socket
			var msgOut 	= {name : "MSG_CHAT_MSG_NEW", val:cond};
			if (App.controller.ChatRoom.Socket.can_lc_msg_Out (msgOut)){
				return;
			}
			//-----------------------------------------------
			console.log ("----Cannot use Socket to send Msg");
			
			//----send with API if there is problem with socket
			$("#btn_send_msg")		.prop('disabled', true);
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW, cond);	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_send_msg_callback, []));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			
			
			try{
				console.log ("----Init socket");
				App.controller.ChatRoom.Socket.do_lc_init();
			}catch(e){
				console.log(e);
			}
		}

		const do_lc_send_msg_callback = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {	
				self.do_lc_get_content_chat(initialeValues, true);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}

			$("#btn_send_msg").prop('disabled', false); 
		}

		//--------------------------------------------------------------------------------------
		const placeCaretAtEnd = function(el) {
		    el.focus();
		    if (typeof window.getSelection != "undefined"
		            && typeof document.createRange != "undefined") {
		        var range = document.createRange();
		        range.selectNodeContents(el);
		        range.collapse(false);
		        var sel = window.getSelection();
		        sel.removeAllRanges();
		        sel.addRange(range);
		    } else if (typeof document.body.createTextRange != "undefined") {
		        var textRange = document.body.createTextRange();
		        textRange.moveToElementText(el);
		        textRange.collapse(false);
		        textRange.select();
		    }
		}
		
		
		function do_lc_getExtension_from_name(filename) {
			var parts = filename.split('.');
			return parts[parts.length - 1];
		}


		function do_lc_check_image(filename) {
			var ext = do_lc_getExtension_from_name(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'gif':
			case 'bmp':
			case 'png':
			case 'PNG':
			case 'webp':
				//etc
				return true;
			}
			return false;
		}

		const do_lc_get_myRoleInGrp = function(obj, typChat){
			let ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_ROLE, {groupId: initialeValues.obj?.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_get_myRoleInGrp_callback, [obj, typChat]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_get_myRoleInGrp_callback = function(sharedJson, obj, typChat){
			if(can_gl_AjaxSuccess(sharedJson)) {
				const data 		= sharedJson[App['const'].RES_DATA];
				if(data){
					if (typChat == pr_TYP_CHAT_VIDEO){
						pr_ctr_Member	.do_lc_show(initialeValues, false, function(){ //---callback after load member
							App.controller.ChatRoom.WebRTC.do_lc_show		(initialeValues);
						});
						
						return;
					}
										
					let isManager = (data.typ == 1 || data.typ == 0);
					
					if(data.stat === 1){
						pr_ctr_Member	.do_lc_show(initialeValues, true);// => call after do_lc_show_form_chat();	+  do_lc_get_content_chat()
						pr_ctr_Doc		.do_lc_show(initialeValues.obj);
						pr_ctr_Post		.do_lc_show(initialeValues.obj,isManager);
						
					} else {
						self.do_lc_show_form_chat();	
						self.do_lc_get_content_chat(initialeValues);
					//	do_lc_show_info_group(true);
					//	$("#div_member, #div_member_wait, #div_member_wait, #div_files, #div_post").html('');
					}
					
				} else {
					do_lc_show_info_group();
					$("#div_member, #div_member_wait, #div_member_wait, #div_files, #div_post").html('');
				}
				
			} else {  
				if (initialeValues.obj.typ02 == CHAT_GROUP_PUBLIC) {
					do_lc_join_group_public();
				} else {
					do_lc_show_info_group();
				}
				$("#div_member, #div_member_wait, #div_member_wait, #div_files, #div_post").html('');
			}
		}

		//------------------------------------------------------------------------------------------------------------------------
		//------READ MSG------------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------------------
		const do_lc_read_chat = function(){
			do_lc_effect_message_read();
			if (initialeValues.lstMsgCurrent.length==0) return;

			// condition avoiding send newHistory too much
			if (App.data.msgLastId == App.data.msgReadId) return;

			App.data.msgReadId = App.data.msgLastId;
			let obj = {
					group	: initialeValues.obj.id,
					msg		: App.data.msgLastId 
			};
			
			//----- send with socket
			var msgOut = {name:"MSG_CHAT_USER_READ", val: {obj: JSON.stringify(obj)}};
			if (App.controller.ChatRoom.Socket.can_lc_msg_Out (msgOut)){
				App.controller.UI.Message.do_lc_get_CountMsgNew();
				return;
			}
			//----- send with API if there is problem with socket
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_NEW_HISTORY, {obj: JSON.stringify(obj)});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_read_chat_success, []));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_read_chat_success = function(sharedJson){
			if(can_gl_AjaxSuccess(sharedJson)) {
				App.controller.UI.Message.do_lc_get_CountMsgNew();
			}
		}
		
		const do_lc_lst_history_chat = function(){
			if (App.data.msgLast) 
				if (App.data.msgLast.lstHistory) 
					if (App.data.msgLast.lstHistory.length>5 || 
							App.data.msgLast.lstHistory.length>=App.data.lstGrpMember.length-2) return;

			let obj = {
					group	: initialeValues.obj.id,
			};
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LST_HISTORY, {obj: JSON.stringify(obj)});	

			const fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_lst_history_chat_success, [App.data.msgLastId]));

			const fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		const do_lc_lst_history_chat_success = function(sharedJson, msgId){
			if(can_gl_AjaxSuccess(sharedJson)) {
				// Save to local
				localStorage.setItem("chatRoom.historyLst",JSON.stringify(sharedJson));

				let lst 		= sharedJson[App['const'].RES_DATA] || [];
				if (lst.length>0) do_lc_filter_user_history(lst);

				App.data.msgLastId  			= msgId;
			}
		}

		const do_lc_filter_user_history = function (lst) {
			let lstHistoryFilter = [];
			let lstMems = Object.assign({}, initialeValues.members);
			if (lstMems) {
				for (const key in lstMems) {
					lstMems[key] = 0;
				}
			}
			// find lstHistoryFilter (lọc và chỉ giữ lại mỗi user 1 history)
			if (lst && lst.length > 0) {
				lst.forEach((e) => {
					if (lstMems[e.uId] == 0) {
						lstHistoryFilter.push(e);
						lstMems[e.uId] = 1;
					}
				})
			}

			// mapping to lstMsgCurrent
			if (lstHistoryFilter  && lstHistoryFilter.length > 0) {
				var count = lstHistoryFilter.length;
				for (var i=initialeValues.lstMsgCurrent.length-1;i>=0;i--){
					var msg = initialeValues.lstMsgCurrent[i];
					msg.lstHistory = [];
					
					lstHistoryFilter.forEach((e2) => {
						if (msg.id == e2.msgId && e2.uId!=msg.uId && e2.uId!=App.data.user.id) {
							let tmp = {
									mem 	: initialeValues.members[e2.uId].mem,
									dt  	: e2.dt,
							}
							msg.lstHistory.push(tmp);
							count--;
						}
					})
					
					
					if (msg.lstHistory.length == 0) msg.hasHistory = false;
					else msg.hasHistory = true;
					
					if (count<=0) break;
				}

				//do_lc_show_chatroom(userData);
				do_lc_show_chatroom_read(initialeValues.lstMsgCurrent);
			}
		}
		
		const do_lc_show_chatroom_read = function(lst){
			$(".message-read").remove();
			
			let lstHasHistory = lst.filter(function(e) { return e.hasHistory; }); 
			
			try{
				if (lstHasHistory ){
					lstHasHistory.forEach((e) => {
						
						var liMsg = $("#li_msg_item_append_" + e.id);
						var liRead= liMsg.find(".li_msg_read_" + e.id);
						if (liRead.length>0){
							liRead.remove();
						}
						liMsg.append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ	, e));
					})
				}
			}catch(e){
				console.log(e);
			}
			
		}
		
		this.do_lc_new_chatroom_user_read = function(userid, msgid){
			if (App.data.user.id == userid) return;
			
			$(".div_avatar_"			).remove(); //--some tmpl err
			$(".div_avatar_" + userid	).remove(); 

			let obj 	= Object.assign({}, initialeValues.members[userid]);
			obj.msgId 	= msgid;
			obj.uId 	= userid;
			
			var liMsg = $("#li_msg_item_append_" + msgid);
			
			if (liMsg.find(".li_msg_read_" + msgid).length==0){
				liMsg.append ("<li class='message-item message-read li_msg_read_"+msgid+"'></li>")
			}
			liMsg.find(".li_msg_read_" + msgid).append(tmplCtrl.req_lc_compile_tmpl(tmplName.CHATROOM_TAB_CHAT_CONTENT_MSG_READ_ITEM_CONTENT, obj))
			
			do_lc_scrollBottom_toChat();	
		}
		
		//------------------------------------------------------------------------------------------------------------------------
		//------AUDIO RECORD---------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------------------
		const do_lc_startRecording = function (){
		    var constraints = { audio: true, video:false }
		    
			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				var audioContext = new window.AudioContext;
				gumStream = stream;
				input = audioContext.createMediaStreamSource(stream);
				rec = new Recorder(input,{numChannels:1})
				rec.record();
				
				$("#btn_recorder i").addClass("text-danger");
				$("#btn_recorder_stop").show();
				$("#btn_recorder").hide();
				$(".btn-not-recording").addClass('hide_recording');
				$(".sound-wave").removeClass("hide_recording");

				
//				$(".chat-input-links").addClass('hide');
//				$("#recording").removeClass("hide");
//				updateDateTime();

			}).catch(function(err) {
				console.log(err);
			});
		}
		
		var updateDateTime = function() {
			var sec = null;
			sec = rec.recordingTime() | 0;
			$("#time-display").html("" + (minSecStr(sec / 60 | 0)) + ":" + (minSecStr(sec % 60)));
			pr_interval_recording = setInterval(updateDateTime, 200);
		};

		 var minSecStr = function(n) {
			 return (n < 10 ? "0" : "") + n;
		 }
		
		const do_lc_stopRecording = function (save) {
			rec.stop();
			gumStream.getAudioTracks()[0].stop();
			
			$("#btn_recorder i").removeClass("text-danger");
			$("#btn_recorder_stop").hide();
			$("#btn_recorder").show();
			
			$(".btn-not-recording").removeClass('hide_recording');
			$(".sound-wave").addClass("hide_recording");

//			clearInterval(pr_interval_recording);
//			$(".chat-input-links").removeClass('hide');
//			$("#recording").addClass("hide");
			
			if (save) rec.exportWAV(createDownloadLink);
		}

		function blobToFile(theBlob, fileName){       
		    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
		}
		
		function createDownloadLink(blob) {
			URL = window.URL || window.webkitURL;
			
			var url = URL.createObjectURL(blob);
			var filename = new Date().getTime();
			
			var file = blobToFile(blob, filename + ".wav");
			do_lc_up_file_audio_inline(file);
		}
		
		const do_lc_up_file_audio_inline = function(file){
			let groupId 	= initialeValues.obj.id;
			let ref 		= new FormData();
			ref.append('sv_class'	, 'ServiceTpyDocument');
			ref.append('sv_name'	, 'SVNewInChat');
			ref.append('entId'		, groupId);
			ref.append('typ01'		, 10);
			ref.append('typ02'		, 10);
			ref.append('file'		, file);
			
			const headers = {
					Authorization: App.data["HttpSecuHeader"].Authorization,
					Accept: 'multipart/form-data'
			}
			

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_upload_file_audio, []));

			let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax_form(App.path.BASE_URL_API_UPLOAD, headers, ref, 100000, fSucces, fError);
		}
		
		const do_lc_after_upload_file_audio = function(sharedJson){
			if (can_gl_AjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data && data.length){
			//		for(let item of data){
			//			let modifiedUrl = item.name.replace(/D:\\tmp\\/g, '').replace(/\\/g, '/');
			//			var audio = `<audio class="audio_recorder" controls src='${modifiedUrl}'></audio>`;
			//		}
				}
				do_lc_send_msg_chat({ files: [] }, data);
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
			}
		}

		const do_lc_upload_error = function (sharedJson, msg){
			do_gl_show_Notify_Msg_Error (msg);
		}
		
		//------------------------------------------------------------------------------------------------
		//------UTIL------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------
		const  do_lc_turn_off_sound = function () {
			pr_sound_chat_off[initialeValues.obj.id] = true;
		}
		
		const  do_lc_turn_on_sound = function () {
			pr_sound_chat_off[initialeValues.obj.id] = false;
		}
		
		const do_lc_play_sound_move = function(entId) {
			let mute = pr_sound_chat_off[entId];
			
			if (!mute) {
				try {
					var x = document.getElementById("audio_new_msg"); 
					x.play();
					x.stop();
				} catch (error) {
				}
			}
		}
		
		const do_lc_scrollBottom_toChat = function(){
//			setTimeout(() => {
				const $divScroll = $("#ul_lst_msg .simplebar-content-wrapper");
				$divScroll.animate({ scrollTop: $divScroll.prop("scrollHeight")}, 50);
//			}, 100);
		}
		
		const do_lc_reset_message =function(){
			const {obj} 	= initialeValues;
			pr_ctr_IndexedDB.do_lc_delete_collection(pr_Collect_Msg, obj.key);
			initialeValues.lstMsgCurrent=[];
			
			self.do_lc_get_content_chat(initialeValues);
		}
	};

	return ChatRoomChat;
});