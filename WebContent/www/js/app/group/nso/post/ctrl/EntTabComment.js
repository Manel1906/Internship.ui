define([
        'jquery',
        'text!group/nso/post/tmpl/Ent_Tab_Comment.html'

    ],
    function ($,
              Tmpl_Ent_Tab_Comment
    ) {


        var CtrlEntTabDoc = function (grpName, header, content, footer) {
            var pr_divHeader  = header;
            var pr_divContent = content;
            var pr_divFooter  = footer;

            //------------------------------------------------------------------------------------
            var pr_lock_type = -1; //--const based on BO
            var pr_grpName   = grpName;
            //------------------------------------------------------------------------------------
            var tmplName     = App.template.names[pr_grpName];
            var tmplCtrl     = App.template.controller;

            var svClass = App['const'].SV_CLASS;
            var svName  = App['const'].SV_NAME;
            var sessId  = App['const'].SESS_ID;
            var userId  = App['const'].USER_ID;

            var fVar   = App['const'].FUNCT_SCOPE;
            var fName  = App['const'].FUNCT_NAME;
            var fParam = App['const'].FUNCT_PARAM;

            var self = this;
            //------------------------------------------------------------------------------------

            var pr_tableNewLineId = 0;
            var pr_table          = undefined;
            var pr_news_line_data = undefined;

            var defautNumberFornso = "#,###.##";

            var pr_SERVICE_CLASS = "ServiceCtrl";


            //--------------------Cache-------------------------------------
            var pr_cache_post_by_search_key = {};
            var pr_cache_unit_by_nso_id     = {};


            //------------------controllers------------------------------------------------------
            var pr_ctr_Main    = null;
            var pr_ctr_List    = null;
            var pr_ctr_Ent     = null;
            var pr_ctr_EntTabs = null;

            var pr_PAGESIZE				= 10;


            //-----------------------------------------------------------------------------------
            var pr_obj      = null;
            var pr_mode     = null;
            //--------------------APIs--------------------------------------//
            this.do_lc_init = function () {
                pr_ctr_Main = App.controller[pr_grpName].Main;
                pr_ctr_List = App.controller[pr_grpName].List;

                pr_ctr_Ent     = App.controller[pr_grpName].Ent;
                pr_ctr_EntTabs = App.controller[pr_grpName].EntTabs;

                tmplName.CMT_MAIN				= "Cmt_Main";
                tmplName.CMT_LIST				= "Cmt_List";
                tmplName.CMT_LIST_NULL			= "Cmt_List_Not_Found";
                tmplCtrl.do_lc_put_tmplRaw(Tmpl_Ent_Tab_Comment);

            }

            this.do_lc_show = function (obj, mode) {
                try {
                    $(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMT_MAIN, {}));
                    do_lc_get_list_Pagination(obj);

                    do_bind_event(obj, mode);
                } catch (e) {
                    console.log(e);
                    do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.post", "CtrlEntTabComment", "do_lc_show", e.toString());
                }
            };

            var do_lc_get_list_Pagination = function(obj) {
                var ref = req_gl_Request_Content_Send("ServiceNsoPostPubl", "SVLstPageCmtByEnt");
                ref["entTyp"] 	= obj.entTyp;
                ref["entId"] 	= obj.entId;
                ref["entCod"] 	= obj.entCod;
                ref["number"]	= pr_PAGESIZE;

                var callbackFunct = function (data, pagination) {		//data => sharedJson
                    do_show_list(data, "#div_cmt_list_content");
                    $('html, body').animate({
                        scrollTop: $("#div_cmt_list_content").offset().top
                    }, 500);
                }

                var opt = {
                    divMain			: "#div_cmt_list_content",
                    divPagination	: "#cmt_pagination",
                    url_api 		: App.path.BASE_URL_API_PUBL,
                    url_header 		: null,
                    url_api_param 	: ref,
                    pageSize 		: pr_PAGESIZE,
                    pageRange		: 1,
                    callback		: callbackFunct
                };

                do_gl_init_pagination_opt(opt);
            }

            var do_show_list = function (sharedJson, div) {
                if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
                    let data = sharedJson[App['const'].RES_DATA];
                    if (data.lst) {
                        $(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMT_LIST, {"data": data.lst}));
                    }else {
                        $(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMT_LIST_NULL, {}));
                    }
                }else {
                    $(div).html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMT_LIST_NULL, {}));
                }
            }


            //---------private-----------------------------------------------------------------------------
            var do_bind_event = function (obj, mode) {

                pr_mode = mode;
                if (mode == App['const'].MODE_NEW) {
                } else {
                }
            }.bind(this);
        };

        return CtrlEntTabDoc;
    });