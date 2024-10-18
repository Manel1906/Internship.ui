define([], function(){

	const ChatRoomMember 	= function (ctrChat) {
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS					= "ServiceMsgMessage"; //to change by your need
		const pr_SV_MEMBER_LIST					= "SVMsgMemberLst";

		var self                                = this;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 						= App.controller.UI.Main;
		var pr_ctr_ChatRoomChat 				= ctrChat;
		var pr_ctr_ChatRoomGroup				= App.controller.MiniChat.Person;
		
		const initialValues = {
				members 	: {},
				group 		: {},
		}
		
		//--------------------APIs--------------------------------------//
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(values){
			const {obj : group} = values;
			try{
				initialValues.group 		= group;
				
				do_get_list_member(values, true);
				do_lc_setTime_refresh_member_lst();
			}catch(e) {				
				console.log(e); //do_gl_send_exception(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], App.network, "prj.chatmini", "ChatRoomMember", "do_lc_show", e.toString()) ;
			}
		};
		
		
		var pr_setTime_refresh_member_lst;
		var pr_TIME_REFRESH = 15 * 60 * 1000;
		var do_lc_setTime_refresh_member_lst = function(){
			if (pr_setTime_refresh_member_lst) clearInterval (pr_setTime_refresh_member_lst)
			pr_setTime_refresh_member_lst = setInterval(() => {
				do_get_list_member();
			}, pr_TIME_REFRESH);
		}
		
		const do_get_list_member = function(values, buildChatRoom){
			const ref 		= req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MEMBER_LIST, {groupId: initialValues.group.id});	

			let fSucces		= [];
			fSucces.push(req_gl_funct(null, do_lc_getMember_response, [values, buildChatRoom]));

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg_keepState (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		const do_lc_getMember_response = function(sharedJson, values, buildChatRoom){
			if (can_gl_AjaxSuccess(sharedJson)) {
				var data 		= sharedJson[App['const'].RES_DATA]; 
				
				data = (data).sort(function(a,b){
					if (a.typ == b.typ)
						return (a.mem.login.localeCompare(b.mem.login)) ;
					return a.typ - b.typ
				});

				const objData 	= data.reduce((currentObj, item)=>{
					if(!!item.mem)	currentObj[item.uId] = item;
					return currentObj;
				}, {});

				if(values)	values.members = objData;
				
				App.data["lstGrpMember_"+ pr_ctr_ChatRoomChat.var_grp_id] 		 = null;
				App.data["lstGrpMember_"+ pr_ctr_ChatRoomChat.var_grp_id] 		 = {...objData};
				App.data["lstGrpMember_"+ pr_ctr_ChatRoomChat.var_grp_id].length = Object.keys(objData).length;
				initialValues.members 											 = data;
				
				self.do_lc_build_member_online();
				
				if (buildChatRoom){
					pr_ctr_ChatRoomChat.do_lc_show_chat_header_init();
					pr_ctr_ChatRoomChat.do_lc_get_content_chat();
				}
			}else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get') );
			}
		}

		this.do_lc_build_member_online = function(){
			const lstOnline = App.controller.DBoard.DBoardMain.pr_LST_USER_ONLINE;
			for(let key in initialValues.members){
				const user 		= initialValues.members[key];
				user.isOnline 	= lstOnline.includes(user.mem.login);
			}
		}
	};

	return ChatRoomMember;
});