define([
	'jquery',
	'text!group/nso/offer/tmpl/List.html',
	'text!group/nso/offer/tmpl/List_Table.html'
],
	function ($,
		Tmpl_List,
		Tmpl_List_Table
	) {

		var CtrlList = function (grpName, header, content, footer) {

			var self = this;
			var pr_divHeader = header;
			var pr_divContent = content;
			var pr_divFooter = footer;

			//------------------------------------------------------------------------------------
			var pr_grpName = grpName;
			//------------------------------------------------------------------------------------
			var tmplName = App.template.names[pr_grpName];
			var tmplCtrl = App.template.controller;

			//---------------------------------------------------------------------------------------------------------
			//SERVICES CONFIG------SERVICES CONFIG------SERVICES CONFIG------SERVICES CONFIG------SERVICES CONFIG-----S				
			//---------------------------------------------------------------------------------------------------------
			var svClass = App['const'].SV_CLASS;
			var svName = App['const'].SV_NAME;
			var sessId = App['const'].SESS_ID;
			var userId = App['const'].USER_ID;

			var fVar = App['const'].FUNCT_SCOPE;
			var fName = App['const'].FUNCT_NAME;
			var fParam = App['const'].FUNCT_PARAM;



			var pr_SERVICE_CLASS = "ServiceNsoOffer";
			var pr_SERVICE_NSO_OFFER_LST = "SVLstDyn";

			//---------------------------------------------------------------------------------------------------------
			//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
			//---------------------------------------------------------------------------------------------------------

			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;

			var pr_obj = null;
			var pr_mode = null;

			var pr_divHeader = header;
			var pr_divContent = content;
			var pr_divFooter = footer;

			var pr_div_List_Stat = "#div_List_Stat_";

			var OFFER_STAT_DRAFT = 0;
			var OFFER_STAT_ACCEPTED = 1;
			var OFFER_STAT_COMPLETED = 2;
			var OFFER_STAT_REPORTED = 3;
			var OFFER_STAT_DELETED = 4;

			var OFFER_STAT_PRIVATE = 10;
			var OFFER_STAT_PUBLIC = 20;

			var OFFER_TYPE_HOUR = 100;
			var OFFER_TYPE_TODO_LIST = 101;
			// var OFFER_TYPE_BLOG = 101;
			// var OFFER_TYPE_OFFER = 100;
			// var OFFER_TYPE_EVAL = 102;
			//---------------------------------------------------------------------------------------------------------
			//INIT CONTROLLER------INIT CONTROLLER------INIT CONTROLLER------INIT CONTROLLER------INIT CONTROLLER-----I								
			//---------------------------------------------------------------------------------------------------------

			this.do_lc_init = function () {
				pr_ctr_Main = App.controller[pr_grpName].Main;
				pr_ctr_List = App.controller[pr_grpName].List;
				pr_ctr_Ent = App.controller[pr_grpName].Ent;
				//----------------------------------------------------------
				tmplName.LIST = "Tmpl_List";
				tmplName.LIST_TABLE = "Tmpl_List_Table";

				tmplCtrl.do_lc_put_tmpl(tmplName.LIST, Tmpl_List);
				tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TABLE, Tmpl_List_Table);

				//----------------------------------------------------------
			}
			// "nso_offer_lst_title_private"			: 	"Các bài chưa công khai",	
			// "nso_offer_lst_title_public"			    : 	"Các bài đã công khai",	
			//	"nso_offer_lst_title_draft"			    : 	"Các bài nháp",	
			//	"nso_offer_lst_title_validated"			: 	"Các bài đã được duyệt",
			//	"nso_offer_lst_title_reported"			: 	"Các bài bị phản ảnh",
			//	"nso_offer_lst_title_deleted"			: 	"Các bài bị xóa tạm thời",
			//	"nso_offer_eval_lst_title_draft"				: 	"Các đánh giá cần được duyệt",
			//	"nso_offer_eval_lst_title_validated"			: 	"Các đánh giá đã được duyệt",
			this.do_lc_show = function () {
				try {
					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST, {}));

					var typ = OFFER_TYPE_HOUR + "," + OFFER_TYPE_TODO_LIST
					var stat02 = OFFER_STAT_PRIVATE + "," + OFFER_STAT_PUBLIC

					do_get_list_offer_byStatus(typ, OFFER_STAT_DRAFT, stat02, "nso_offer_lst_title_draft");
					do_get_list_offer_byStatus(typ, OFFER_STAT_ACCEPTED, stat02, "nso_offer_lst_title_validated");
					do_get_list_offer_byStatus(typ, OFFER_STAT_REPORTED, stat02, "nso_offer_lst_title_reported");
					do_get_list_offer_byStatus(typ, OFFER_STAT_DELETED, stat02, "nso_offer_lst_title_deleted");
					do_get_list_offer_byStatus(typ, OFFER_STAT_COMPLETED, stat02, "nso_offer_lst_title_completed");

					// do_get_list_offer_byStatus(typ, null, OFFER_STAT_PRIVATE, "nso_offer_lst_title_private");
					// do_get_list_offer_byStatus(typ, null, OFFER_STAT_PUBLIC, "nso_offer_lst_title_public");


					App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
				} catch (e) {
					console.log(e);
					do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlList", "do_lc_show", e.toString());
					do_gl_show_Notify_Msg_Error("CtrlList: " + e.toString());
				}
			}


			function do_get_list_offer_byStatus(typ, status01, status02, title) {
				var div;
				if (status01 !== null) {
					div = pr_div_List_Stat + status01;
				}
				$(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST_TABLE, { 'title': title, 'status': status01 }));

				var ref = req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_NSO_OFFER_LST);
				ref["stat01"] = status01;
				ref["stat02"] = status02;
				ref["typMulti"] = typ;

				var lang = localStorage.language;
				if (lang == null) lang = "en";
				var filename = "www/js/lib/datatables/datatable_" + lang + ".json";

				var additionalConfig = {
					"typ": { fnCreatedCell: cellTyp },
					"login": { fnCreatedCell: userlogin }
				};

				var colConfig = req_gl_table_col_config($(div).find("table"), null, additionalConfig);

				var fError = req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
				var oTable = req_gl_Datatable_Ajax_Dyn(div, App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_offer);
			}

			//---------private-----------------------------------------------------------------------------		
			//	this.do_lc_show_list_ById = function(obj){
			//		
			//		$("#div_List")			.html(tmplCtrl	.req_lc_compile_tmpl(tmplName.NSO_OFFER_LIST_BY_ID							, {}));
			//		$("#div_List_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.NSO_OFFER_LIST_BY_ID_HEADER		, {}));
			//		$("#div_List_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.NSO_OFFER_LIST_BY_ID_CONTENT		, {}));
			//		
			//		var offerList = [];
			//		var offer = {};
			////		areaDetail.dtBegin = getDateShortStr(obj.dtBegin);
			////		areaDetail.dtEnd = getDateShortStr(obj.dtBegin);	
			//		offer.ref = obj.ref;
			//		offer.title = obj.title;
			//		offer.typ = obj.typ = pr_type_offer_blog? $.i18n("nso_offer_type_blog"): obj.typ = pr_type_offer_eval?$.i18n("nso_offer_type_evaluate_man"): obj.typ = pr_type_offer_event? $.i18n("nso_offer_type_event"): obj.typ;
			//		offer.login = obj.login;
			//		offerList.push(offer);
			//		
			//		req_gl_create_datatable(offerList, "#table_nso_offer",{});	
			//	}

			//---------------------------------------------------------------------------------------------

			var do_bind_list_offer = function (data, div, oTable) {
				$(div).find('.table-datatableDyn tbody').off('click', 'tr');
				$(div).find('.table-datatableDyn tbody').on('click', 'tr', function () {
					if (App.data.mode == App['const'].MODE_MOD ||
						App.data.mode == App['const'].MODE_NEW ||
						App.data.mode == App['const'].MODE_TRANSL) {
						do_gl_show_Notify_Msg_Error($.i18n('common_err_msg_sel'));
						return;
					}

					do_gl_Add_Class_List($(this).parent(), $(this), "selected");
					var oData = oTable.fnGetData(this);
					pr_ctr_Ent.do_lc_show_ById(oData, App['const'].MODE_SEL);
				});
			}

			//---------------------------------------------------------------------------------------------
			//ADDITIONAL CONFIG GET LIST-----ADDITIONAL CONFIG GET LIST-----ADDITIONAL CONFIG GET LIST----- 
			//---------------------------------------------------------------------------------------------

			var cellTyp = function (nTd, sData, oData, iRow, iCol) {
				var typ = "Unknown";
				var entTyp = oData.typ01;
				switch (entTyp) {
					case OFFER_TYPE_HOUR: typ = $.i18n("nso_offer_ent_type_hour"); break;
					case OFFER_TYPE_TODO_LIST: typ = $.i18n("nso_offer_ent_type_todo_list"); break;
					// case OFFER_TYPE_BLOG: typ = $.i18n("nso_offer_ent_type_blog"); break;
					// case OFFER_TYPE_OFFER: typ = $.i18n("nso_offer_ent_type_offer"); break;
					// case OFFER_TYPE_EVAL: typ = $.i18n("nso_offer_ent_type_eval"); break;
				}
				$(nTd).html(typ);
			}

			var userlogin = function (nTd, sData, oData, iRow, iCol) {
				$(nTd).html($.i18n(oData.login));
			}
		}

		return CtrlList;
	});