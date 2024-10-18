define([
        'jquery',
        'text!group/nso/offer/tmpl/Ent_Header.html',

        'group/nso/offer/ctrl/EntHeaderTodoMain',
        'group/nso/offer/ctrl/EntHeaderTimeMain',
    ],

    function (
        $,
        Tmpl_Ent_Header,
        CtrlEntHeaderTodoMain,
        CtrlEntHeaderTimeMain
    ) {
        var CtrlEntHeader = function (grpName, header, content, footer) {
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
            var pr_ctr_EntHeaderTimeMain = null;

            //-----------------------------------------------------------------------------------
            var pr_obj  = null;
            var pr_mode = null;

            var pr_map  = null;

            let dayStart = null;
            let dayEnd   = null;
            let dayGap   = null;

            var OFFER_TYP_HOUR      = 100;
            var OFFER_TYP_TODO_LIST = 101;
            //--------------------APIs--------------------------------------//
            this.do_lc_init         = function () {
                pr_ctr_Main = App.controller[pr_grpName].Main;
                pr_ctr_List = App.controller[pr_grpName].List;

                pr_ctr_Ent       = App.controller[pr_grpName].Ent;
                pr_ctr_EntHeader = App.controller[pr_grpName].EntHeader;

                //--------------------Tmpl--------------------------------------//

                tmplName.ENT_HEADER = "Tmpl_Ent_Header";
                tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER, Tmpl_Ent_Header);

                //--------------------Ctrl--------------------------------------//

                if (!App.controller[pr_grpName].EntHeaderTodoMain)
                    App.controller[pr_grpName].EntHeaderTodoMain = new CtrlEntHeaderTodoMain(null,
                        "#div_Ent_Header_Todo_Main", null, pr_grpName);
                if (!App.controller[pr_grpName].EntHeaderTimeMain)
                    App.controller[pr_grpName].EntHeaderTimeMain = new CtrlEntHeaderTimeMain(null,
                        "#div_Ent_Header_Time_Main", null, pr_grpName);

                App.controller[pr_grpName].EntHeaderTodoMain.do_lc_init();
                App.controller[pr_grpName].EntHeaderTimeMain.do_lc_init();

                pr_ctr_EntHeaderTodoMain = App.controller[pr_grpName].EntHeaderTodoMain;
                pr_ctr_EntHeaderTimeMain = App.controller[pr_grpName].EntHeaderTimeMain;
            }

            this.do_lc_show = function (obj, mode) {
                pr_obj  = obj;
                pr_mode = mode;

                try {
                    var todos = null;
                    if (pr_mode === App['const'].MODE_MOD || pr_mode === App['const'].MODE_SEL) {
                        todos = $.parseJSON(pr_obj['todos']);
                        $(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER, {...pr_obj, todos}));
                    } else {
                        $(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER, {}));
                    }

                    //fixed max-height scroll of % height div_ContentView
                    //				do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-header", 25);

                    do_bind_event(obj, mode);

                    pr_ctr_EntHeaderTodoMain.do_lc_show(todos, mode);
                    pr_ctr_EntHeaderTimeMain.do_lc_show(obj, mode);

                    do_lc_init_map();
                    do_bindingEvent();
                } catch (e) {
                    console.log(e);
                    do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeader", "do_lc_show",
                        e.toString());
                }
            };

            var do_lc_init_map = () => {
                let lat = parseFloat($("#inp_lat").val());
                let lng = parseFloat($("#inp_lng").val());

                if(!lat) lat = 15.975478706008223;
                if(!lng) lng = 108.25236569899924;

                pr_map = do_gl_showGoogleMap('div_Ent_Header_Map', {
                    "lat": lat,
                    "lng": lng
                });
            }

            //---------private-----------------------------------------------------------------------------
            var do_bind_event = function (obj, mode) {
                if (App.controller.HtmlEditor)
                    App.controller.HtmlEditor.do_lc_bindingEvent(".htmlEditor", "dest", "funct", mode, true);

                $('#btn_show_todo_list').off('click').on('click', function (e) {
                    $(pr_divContent).find('#modal_todo_main').modal('show');
                });

                $('#btn_show_time_list').off('click').on('click', function (e) {
                    $(pr_divContent).find('#modal_time_main').modal('show');
                });

                do_bind_show_Cat()
                do_bind_event_Cat()

                do_bind_choose_Typ01()
            }
            
			var do_bind_show_Cat = function () {
				const cats = $.extend(true, {}, App.data.TpyCatList.nso_offer.cats);
				$('#sel_cat').select2({
					tags: true,
					data: $.map(cats, function (item) {
						$('#sel_cat').find(`option[value=${item['id']}]`).html(item['name']);
						return {
							id: item.id,
							text: item.name
						}
					})
				})
			}

            var do_bind_event_Cat = function () {
                $('#sel_cat').off('select2:select').on('select2:select', function (e) {
                    var data = e.params.data;
                    pr_ctr_EntHeaderTodoMain.do_lc_new_list(data, App['const'].MODE_NEW);

                    if (App.controller.HtmlEditor)
                        App.controller.HtmlEditor.do_lc_bindingEvent(".htmlEditor", "dest", "funct", pr_mode, true);
                }).off('select2:unselecting').on('select2:unselecting', function (e) {
                    if (confirm($.i18n("nso_offer_ent_remove_todo"))) {
                        $(e).trigger('select2:unselect')
                    } else {
                        return false;
                    }
                }).off('select2:unselect').on('select2:unselect', function (e) {
                    var data = e.params.data;
                    pr_ctr_EntHeaderTodoMain.do_lc_remove_list(data);
                });
            }

            var do_bind_choose_Typ01 = function () {
                $("#sel_typ01").off('change').on('change', function () {
                    if ($(this).val() == OFFER_TYP_HOUR) {
                        $('#div_btn_show_time_list').attr("hidden", false)
                    } else if ($(this).val() == OFFER_TYP_TODO_LIST) {
                        $('#div_btn_show_time_list').attr("hidden", true)
                    }
                })
            }

            //--------------------------------------------------------------------------------------
            function do_bindingEvent(){
                $("#btn_map_location").on("click", function(){
                    var addr = $("#inp_addr").val();
                    if(!addr)	return;
                    getLocation(addr);
                });
            }
            function getLocation(strAddr){
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { "address": strAddr }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                        var formatted_address    = results[0].formatted_address,
                            location            = results[0].geometry.location,
                            lat                 = location.lat(),
                            lng                 = location.lng();

                        lat = parseFloat((lat).toFixed(5));
                        lng = parseFloat((lng).toFixed(5));

                        $("#inp_lat").val(lat);
                        $("#inp_lng").val(lng);
                        $("#inp_addr").val(formatted_address);

                        do_showGoogleMap(lat, lng);
                    }else{
                        pr_ctr_Main.do_show_Notify_Msg ();
                    }
                });
            }

            const do_showGoogleMap = (lat, lng) => {
                if (!lat || !lng) return;

                pr_map.setCenter(new google.maps.LatLng(lat, lng))
                pr_map.panTo(new google.maps.LatLng(lat, lng));
            }
        };


        return CtrlEntHeader;
    });