define([
    'jquery',

    'text!group/nso/offer/tmpl/Ent_Header_Todo_Main.html',
    'text!group/nso/offer/tmpl/Ent_Header_Todo_List.html'
], function (
    $,
    Tmpl_Ent_Header_Todo_Main,
    Tmpl_Ent_Header_Todo_List
) {
    var CtrlEntHeaderTodoMain = function (grpName, header, content, footer) {
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

        var svClass = App['const'].SV_CLASS;
        var svName  = App['const'].SV_NAME;
        var userId  = App['const'].USER_ID;
        var sessId  = App['const'].SESS_ID;
        var fVar    = App['const'].FUNCT_SCOPE;
        var fName   = App['const'].FUNCT_NAME;
        var fParam  = App['const'].FUNCT_PARAM;

        //------------------controllers------------------------------------------------------
        var pr_ctr_Main              = null;
        var pr_ctr_List              = null;
        var pr_ctr_Ent               = null;
        var pr_ctr_EntHeader         = null;
        var pr_ctr_EntHeaderTodoMain = null;

        //-----------------------------------------------------------------------------------
        var pr_obj  = null;
        var pr_mode = null;
        var pr_cats = null;

        //--------------------APIs--------------------------------------//
        this.do_lc_init = function () {
            pr_ctr_Main = App.controller[pr_grpName].Main;
            pr_ctr_List = App.controller[pr_grpName].List;

            pr_ctr_Ent               = App.controller[pr_grpName].Ent;
            pr_ctr_EntHeader         = App.controller[pr_grpName].EntHeader;
            pr_ctr_EntHeaderTodoMain = App.controller[pr_grpName].pr_ctr_EntHeaderTodoMain;

            //--------------------Tmpl--------------------------------------//

            tmplName.ENT_HEADER_TODO_MAIN = "Tmpl_Ent_Header_Todo_Main";
            tmplName.ENT_HEADER_TODO_LIST = "Tmpl_Ent_Header_Todo_List";

            tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER_TODO_MAIN, Tmpl_Ent_Header_Todo_Main);
            tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER_TODO_LIST, Tmpl_Ent_Header_Todo_List);
        }

        this.do_lc_show = function (obj, mode) {
            pr_obj  = obj;
            pr_mode = mode;
            pr_cats = App.data.TpyCatList.nso_offer.cats

            try {
                $(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER_TODO_MAIN, {}));
                if (pr_obj !== null) {
                    pr_obj.forEach(data => {
                        if (data) {
                            data['title'] = pr_cats.find(x => x.id == data.id).name
                            self.do_lc_new_list(data, mode);
                        }
                    });
                }

                //fixed max-height scroll of % height div_ContentView
                //do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-header", 25);

                do_bind_event(obj, mode);
            } catch (e) {
                console.log(e);
                do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeaderTodoMain", "do_lc_show",
                    e.toString());
            }
        };

        this.do_lc_new_list = function (obj, mode) {
            var data = obj;
            try {
                if (mode === App['const'].MODE_NEW) {
                    data['title'] = obj['text']
                }

                $(pr_divContent).find('#main-content')
                                .append(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER_TODO_LIST, data));
            } catch (e) {
                console.log(e);
                do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeaderTodoMain", "do_lc_new_list",
                    e.toString());
            }
        }

        this.do_lc_remove_list = function (obj) {
            try {
                $(pr_divContent).find(`#div_Ent_Header_Todo_List_${obj.id}`).remove();
            } catch (e) {
                console.log(e);
                do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeaderTodoMain", "do_lc_remove_list",
                    e.toString());
            }
        }

        this.do_lc_save_todo = function () {
            $(pr_divContent).find('#modal_todo_main').modal('hide');
        }

        //---------private-----------------------------------------------------------------------------
        var do_bind_event = function (obj, mode) {
            if (App.controller.HtmlEditor)
                App.controller.HtmlEditor.do_lc_bindingEvent(".htmlEditor", "dest", "funct", mode, true);

            do_bind_save_todo()
        }

        var do_bind_save_todo = function (obj, mode) {
            $('#btn_save_todo').off('click').on('click', function () {
                self.do_lc_save_todo()
            })
        }
    };


    return CtrlEntHeaderTodoMain;
});