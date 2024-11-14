var APP_ENV=0; //--1:PRO, 0:DEV
var APP_NAME="Zino";

var	APP_API_URL=window.location.origin;
//var	APP_API_URL="https://zino...."; //--use for mobile app

var	CDN_JS 	=""; 
var	CDN_JS 	=""; 
var	CDN_IMG ="";
var	CDN_CSS ="";

if (APP_ENV==1){
	CDN_JS 	="https://zino.pages.dev/www/js/"; 
}

var UI_URL_ROOT = "www/";
//var UI_URL_ROOT	= can_gl_MobileOrTablet() ? "" : "www/";

var COMP_DOM    = "hnv";
var AUTHOR_NAME = "hnv";
var IDEA_NAME   = "hnv";
var CLIENT_NAME = "ROOT";
var PROJ_NAME   = "Zino";

//-----load csss-----------------------------------------------		
var CSS_PATH    = {	0: ["www/css/_main_lib.css", "www/css/_main_route.css" ], 
					1: ["www/css/min/css_all.css"]};

var url_css 	= CSS_PATH[APP_ENV];
var html_head	= document.getElementsByTagName("head")[0];
for (var i=0;i<url_css.length;i++){
	html_head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" 	type="text/css" 	href="' + url_css[i] + '">');
}
//-------------------------------------------------------------
//-------------------------------------------------------------
var var_gl_params_code = [
	{k: "location", v: "VN"},
    {k: "language", v: "vi"},
    {k: "languageId", v: "1"},
    {k: "locale", v: "vi-VN"},
];

var var_gl_alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
var var_gl_colors   = [	"#0000FF", "#8A2BE2", "#A52A2A", "#5F9EA0", "#D2691E", "#6495ED", "#DC143C", "#00008B", "#008B8B", "#006400", "#8B008B", 
						"#556B2F", "#9932CC", "#483D8B", "#696969", "#B22222", "#228B22", "#808080", "#008000", "#778899", "#800000", "#0000CD", 
						"#BA55D3", "#7B68EE", "#9370DB", "#000080", "#0000FF", "#8A2BE2", "#A52A2A", "#5F9EA0", "#D2691E", "#6495ED", "#DC143C", 
						"#00008B", "#008B8B", "#006400", "#8B008B", "#556B2F", "#9932CC", "#483D8B", "#696969", "#B22222", "#228B22", "#0000CD", ];
//-------------------------------------------------------------
var appVersion      = localStorage.getItem("appVersion");
if (!appVersion) {
    appVersion = "1.25.8";
    localStorage.setItem("appVersion", appVersion);
}
//--------------------------------------------------------------
var requirejs_config = {
    urlArgs: "bust=" + appVersion,
    // Base dir for all js
    baseUrl: UI_URL_ROOT + "js",
    // paths and aliases
    paths      : {
        app			: "./app",

        common    	: "./app/common",
        commonCtrl	: "./app/common/ctrl",
        controller	: "./app/main/controller",
        template  	: "./app/main/template",

        group		: "./app/group",
        main 		: "./app/main",

        
        jquery  						: CDN_JS + "./lib/vendor/jquery-3.2.1.min", // "//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min",
        jqueryUI						: CDN_JS + "./lib/jQueryUI-PRJ/jquery-ui",
        bootstrap						: CDN_JS + "./lib/bootstrap/js/bootstrap.min",//  "//netdna.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",
        handlebars						: CDN_JS + "./lib/vendor/handlebars",// "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.4.3/handlebars.min",
        i18n							: CDN_JS + "./lib/i18n/jquery.i18n.all_full",

        fileinput    					: CDN_JS + "./lib/bootstrap-fileinput/js/fileinput.all_full",
        pathparser    					: CDN_JS + "./lib/pathparser",
        sha256    						: CDN_JS + "./lib/sha256.min",
        notify    						: CDN_JS + "./lib/notify",
        text    						: CDN_JS + "./lib/text",
        jNumberformatter    			: CDN_JS + "./lib/jquery.numberformatter-1.2.4",
        pagTool							: CDN_JS + "./lib/pagination-custom.max",
       
        prjBootstrap					: CDN_JS + "./lib/bootstrap",
        prjBootstrapDatepicker			: CDN_JS + "./lib/bootstrap-datepicker",
		prjBootstrapTimepicker			: CDN_JS + "./lib/bootstrap-timepicker",
        prjBootstrapMultiselect			: CDN_JS + "./lib/bootstrap-multiselect",
        datepicker   					: CDN_JS + "./lib/bootstrap-datepicker/js/bootstrap-datepicker.all",
        timepicker    					: CDN_JS + "./lib/bootstrap-timepicker/js/bootstrap-timepicker",
        datetimepicker					: CDN_JS + "./lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker",

        prjSummernote					: CDN_JS + "./lib/summernote",
        prjDropzone						: CDN_JS + "./lib/dropzone",
		prjEmoji						: CDN_JS + "./lib/hnv-emoji",
	//	daypilot						: CDN_JS + "./lib/daypilot/daypilot-all.min",
		daypilot						: "./lib/daypilot/litenew/daypilot-all.min",
		
		multiselectPath					: CDN_JS + "./lib/bootstrap-multiselect",
        selectChosen					: CDN_JS + "./lib/select2/select2.full",
		
        prjMetismenu					: CDN_JS + "./lib/metismenu",
		prjSimplebar					: CDN_JS + "./lib/simplebar",
		
        prjApexChart					: CDN_JS + "./lib/apexcharts",
		prjGantt						: CDN_JS + "./lib/gantt",
		prjFlowChart					: CDN_JS + "./lib/flowchart",
		prjSignatureDrawPad				: CDN_JS + "./lib/signature-draw-pad",
		prjImageViewer					: CDN_JS + "./lib/imageviewer",
		prjwebRTC						: CDN_JS + "./lib/webRTC",
		
		prjDragula						: CDN_JS + "./lib/dragula",
		prjSwiper				     	: CDN_JS + "./lib/swiper",
		prjJqueryRepete					: CDN_JS + "./lib/jquery.repeater",
		
		datatablePath  					: CDN_JS + "./lib/datatables",
		moment							: CDN_JS + "./lib/moment",
        
		jpegcamera						: CDN_JS + "./lib/jpegCamera",


		flagIcon       	: "./lib/flag-icon",
		inputMaskPath  	: "./lib/input-mask",
		colorpickerPath	: "./lib/colorpicker",
		mapPath			: "./lib/mapclustering",

        tagsinput		: "./lib/bootstrap-tagsinput",

        jqueryNumpad 	: "./lib/jquery-numpad",
        touchKeyboard	: "./lib/boootstrap-touch-keyboard",

        jqueryResizable	: "./lib/jquery-resizable",
        
        simplepeer		: "./lib/simplepeer.min",

//        msgboxPath		: "./lib/msgbox",
        
		
//      fastclick   : "./lib/fastclick",
//      fullcalendar: "./lib/fullcalendar",
//      iCheck      : "./lib/iCheck",
//      slimScrool  : "./lib/slimScroll",

//      bootstrapTour     : "./lib/bootstrap-tour/js",
//      bootstrapDialog   : "./lib/bootstrap-dialog/js",
//      bootstrapwysihtml5: "./lib/bootstrap-wysihtml5",

//        chosen: "./lib/select-chosen",
//      daterangepickerPath: "./lib/daterangepicker",
//      calendarPickmeup   : "./lib/calendar-pickmeup",

//      fileinputPath: "./lib/bootstrap-fileinput",
        
//        masonry	: "./lib/masonry",
		
//		prjNodewaves					: "./lib/node-waves",
//		prjTuiCalendar					: "./lib/tui/tui-calendar",
//		prjTuiDatepicker				: "./lib/tui/tui-date-picker",
//		prjTuiDom						: "./lib/tui/tui-dom",
//		prjTuiTimepicker				: "./lib/tui/tui-time-picker",
//		prjTuiSnippet					: "./lib/tui/tui-code-snipppet",
//		prjChance						: "./lib/chance",
//		prjMoment						: "./lib/moment",
		
		
//		prjSelect						: "./lib/select2",
//		prjChime						: "./lib/chime",
//		slick							: "./lib/slick/slick",
//		prjSJPlumb						: "./lib/jsplumb/jsplumb.min",
		
		
    },
    shim       : {
        //---------------------------------------------
        jqueryUI: {
            deps: ["bootstrap"],
        },

        "common/ctrl/BodyTool": {
            deps: [
                "jquery",
                "jqueryUI",
                "common/ctrl/FileInputTool",
                "daypilot",
                "selectChosen", //---select multi
                
//                "slimScrool/jquery.slimscroll.min",
//                "fastclick/fastclick",
                
            ],
        },

        "common/ctrl/BootstrapTool": {
            deps: [
                "selectChosen", //---select multi
                "common/ctrl/FileInputTool",
                "common/ctrl/DatatableTool",
            ],
        },

        "common/ctrl/DatatableTool": {
            deps: [
                "jquery",
                //				      'datatablePath/jquery.dataTables.min',
                "datatablePath/dataTables.bootstrap.min",
                "datatablePath/plugins/pagination/input",
                "datatablePath/plugins/pagination/select",
                "datatablePath/plugins/pagination/scrolling",
            ],
        },

        "common/ctrl/HandlebarsHelper": {
            deps: ["handlebars"],
        },

        "common/ctrl/TemplateController": {
            deps: ["jquery", "handlebars"],
        },

        "common/ctrl/UserRightTool": {
            deps: ["jquery"],
        },

        "common/ctrl/NotifyTool": {
            deps: ["jquery", "notify"],
        },

//        "common/ctrl/TourTool": {
//            deps: ["bootstrapTour/bootstrap-tour"],
//        },

        "common/ctrl/ChartTool": {
            deps: ["jquery"],
        },

        "common/ctrl/TagTool": {
            deps: ["jquery", "tagsinput/bootstrap-tagsinput"],
        },

        "common/ctrl/ResizableTool": {
            deps: [
                "jquery",
                "jqueryResizable/jquery-resizable",
                "jqueryResizable/jquery-resizableTableColumns",
            ],
        },
		"common/ctrl/PaginationTool": {
            deps: ["jquery", "pagTool"],
        },
        
        "common/ctrl/InputTool": {
            deps: ["jquery",  "jNumberformatter"] //--parse number in InputTool],
        },
        
        "common/ctrl/NetworkController": {
            deps: ["jquery"],
        },
        
        "common/ctrl/CameraController": {
            deps: ["jquery"],
        },
        
        "common/ctrl/All_Tool": {
        	deps: [
        		"jquery", 
        		"jqueryUI",
        		"notify",
        		"handlebars",
        		"pagTool", 
        		
        		"daypilot",
        		"selectChosen",
        		"fileinput",
        		
        		"jNumberformatter",
        		"datatablePath/dataTables.bootstrap.min",
                "datatablePath/plugins/pagination/input",
                "datatablePath/plugins/pagination/select",
                "datatablePath/plugins/pagination/scrolling",
                
                "prjSummernote/summernote-bs4.min",
                "prjSummernote/emoji/js/config-summernote",
                "prjSummernote/plugin/lang-emoji",
        		],
        },
        //-------------------------------------------------------
        fileinput: {
            deps: ["bootstrap"],
        },

        "common/ctrl/CameraController": {
            deps: ["fileinput"],
        },

        "common/ctrl/FileURLController": {
            deps: ["fileinput"],
        },

        "common/ctrl/FileInputTool": {
            deps: ["jquery", "fileinput"],
        },

        //---------------------------------------------
        "tagsinput/bootstrap-tagsinput": {
            deps: ["bootstrap"],
        },

        //---------------------------------------------
        handlebars: {
            deps: ["jquery"],
        },

        //---------------------------------------------
        bootstrap: {
            deps: ["jquery"],
        },

        //---------------------------------------------

//        "fastclick/fastclick"             : {
//            deps: ["jquery"],
//        },
//        "fullcalendar/fullcalendar.min"   : {
//            deps: ["jquery"],
//        },
//        "iCheck/icheck.min"               : {
//            deps: ["jquery"],
//        },
//        "slimScrool/jquery.slimscroll.min": {
//            deps: ["jquery"],
//        },

//        "bootstrapTour/bootstrap-tour": {
//            deps: ["jquery"],
//        },

//        "bootstrapDialog/bootstrap-dialog": {
//            deps: ["bootstrap"],
//        },

        "jqueryNumpad/jquery.numpad": {
            deps: ["jquery", "bootstrap"],
        },

        "touchKeyboard/jqbtk": {
            deps: ["jquery", "bootstrap"],
        },

//        "bootstrapwysihtml5/bootstrap3-wysihtml5.hnv": {
//            deps: ["jquery", "bootstrap", "common/ctrl/BodyTool"],
//        },

        "flagIcon/assets/docs": {
            deps: ["jquery", "bootstrap"],
        },

        //---------------------------------------------
        "moment/locales.newline": {
            deps: ["moment/moment.min"],
        },
        "moment/moment.min": {
            deps: ["jquery"],
        },
        "datepicker": {
            deps: ["jquery", "bootstrap"],
        },
        "timepicker": {
            deps: ["jquery", "bootstrap"],
        },
        "datetimepicker": {
            deps: [
                "jquery",
                "bootstrap",
                "moment/moment.min",
                "moment/locales.newline",
            ],
        },
//        "calendarPickmeup/pickmeup": {
//            deps: ["jquery", "bootstrap"],
//        },

        //---------------------------------------------
        //			'datatablePath/jquery.dataTables.min":{
        //				deps:['jquery']
        //			},

        "datatablePath/dataTables.bootstrap.min": {
//        	deps: ["jquery", "bootstrap"], 
        	deps: ["jquery", "bootstrap", "datatablePath/jquery.dataTables.min"],
        },
        "datatablePath/plugins/pagination/input": {
            deps: ["datatablePath/dataTables.bootstrap.min"],
        },
        "datatablePath/plugins/pagination/select": {
            deps: ["datatablePath/dataTables.bootstrap.min"],
        },
        "datatablePath/plugins/pagination/scrolling": {
            deps: ["datatablePath/dataTables.bootstrap.min"],
        },

        //---------------------------------------------

        //---------------------------------------------
        "jpegcamera/jpeg_camera_no_flash": {
            deps: ["jquery", "jpegcamera/canvas-to-blob"],
        },

        //---------------------------------------------
//        "msgboxPath/jquery.msgBox": {
//            deps: ["jquery"],
//        },

        //---------------------------------------------
        "jqueryResizable/jquery-resizable": {
            deps: ["jquery"],
        },

        "jqueryResizable/jquery-resizableTableColumns": {
            deps: ["jquery"],
        },

        //---------------------------------------------
        "i18n": {
            deps: ["jquery"],
        },

        "jNumberformatter": {
            deps: ["jquery"],
        },

        //---------------------------------------------
        "jqxScheduler/jqxScheduler.all": {
            deps: ["jquery"],
        },

        //---------------------------------------------

//        "chosen/chosen.jquery": {
//            deps: ["jquery"],
//        },

        //---------------------------------------------

//        "masonry/masonry.pkgd": {
//            deps: ["jquery"],
//        },

        //---------------------------------------------
        //			'../../../cordova' :{
        //				deps:['jquery']
        //			},
        //---------------------------------------------
        //---------------------------------------------
        "mapPath/infobox": {
            deps: [
                "https://maps.google.com/maps/api/js?key=AIzaSyBF-ao2kom3PV8ex5kDrbTJN_NRG3awnCg&language=vi&region=VN&libraries=places",
            ],
        },

        "mapPath/map": {
            deps: [
                "jquery",
                // 'mapPath/data-map',
                "https://maps.google.com/maps/api/js?key=AIzaSyBF-ao2kom3PV8ex5kDrbTJN_NRG3awnCg&language=vi&region=VN&libraries=places",
                "mapPath/markerclusterer.min",
                "mapPath/infobox",
                "mapPath/GoogleMapTool",
            ],
        },
        "goong/map"  : {
            deps: [
                'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js'
            ]
        },
        gmap3        : {
            deps: ["jquery"],
        },

        daypilot: {
            deps: ["jquery"],
        },

        //--------------------------------------------------
        "common/ctrl/hwcrypto/hwcrypto"      : {
            deps: ["jquery"],
        },
        pagTool                  			 : {
            deps: ["jquery"],
        },
        "prjJqueryRepete/jquery.repeater.min": {
            deps: ["jquery"],
        },
        //------------------crypto--------------------------------
        "hnv-secu/convert"                                  : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/hmac"                                     : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/sha1"                                     : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/pbkdf2"                                   : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/Base64Binary"                             : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/HNVEnc"                                   : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/aes"                                      : {
            deps: ["hnv-secu/core"],
        },
        "common/ctrl/CommonTool"                            : {
            deps: ["jquery"],
        },
        "prjBootstrapTimepicker/js/bootstrap-timepicker.min": {
            deps: ["jquery"],
        },

        //----------------summernote-------------------------
        "prjSummernote/summernote-bs4.min": {
            deps: ["jquery"],
        },
        "prjSummernote/emoji/js/config-summernote": {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "prjSummernote/plugin/lang-emoji"        : {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        
//        "prjSummernote/lang/lang"                : {
//            deps: ["prjSummernote/summernote-bs4.min"],
//        },
//        "prjSummernote/emoji/js/tam-emoji"        : {
//            deps: ["prjSummernote/summernote-bs4.min"],
//        },
//        "prjSummernote/file/summernote-file"      : {
//            deps: ["prjSummernote/summernote-bs4.min", "prjSummernote/lang/lang"],
//        },
        "common/ctrl/SummerNoteController"        : {
            deps: [
                "prjSummernote/summernote-bs4.min",
                "prjSummernote/emoji/js/config-summernote",
                "prjSummernote/plugin/lang-emoji",

//                "prjSummernote/lang/lang",
//                "prjSummernote/emoji/js/tam-emoji",
//                "prjSummernote/file/summernote-file",
            ],
        },

        //----------------swiper-------------------------
        "prjSwiper/global": {
            deps: ["jquery"],
        },
        "prjSwiper/swiper-bundle.min": {
            deps:['jquery']
        },

        //----------------dragula-------------------------
        "prjDragula/dragula.min": {
            deps:['jquery']
        },

        //----------------apex----------------------------
        "prjApexChart/apexcharts.min": {
            deps:['jquery']
        },

        //----------------gaintt--------------------------
        "prjGantt/ganttCfg": {
            deps:['prjGantt/dhtmlxgantt']
        },

        //-----------------multiselect------------------------------
        "prjBootstrapMultiselect/bootstrap-multiselect": {
            deps:['jquery', 'i18n', "selectChosen"]
        }
    },
    waitSeconds: 360,
};

var AppCommon = {
    version: appVersion,
    //		title 	: "Shop Manager V.1.0",

    environment: "DEV",
    //environment:"AF",
    //environment:"QUALIF",
    //environment:"PROD",
    // Globals Constants urls

    path: {
        BASE_APP   			: UI_URL_ROOT + "js/app",
        BASE_URL_UI			: "/", //'/hnv.em_v2_ui/'
        
        BASE_URL_API		: APP_API_URL,
        BASE_URL_API_CHAT 	: APP_API_URL+'/bo/api/chat',
        BASE_URL_API_PUBL 	: APP_API_URL+'/bo/api/publ',
        BASE_URL_API_PRIV 	: APP_API_URL+'/bo/api/priv',
        BASE_URL_API_LOGIN	: APP_API_URL+'/bo/api/login',
        BASE_URL_API_UPLOAD	: APP_API_URL+'/bo/api/up',
    },
    // Globals Constants keys local storage
    keys: {
        KEY_STORAGE_CREDENTIAL: "KEY_STORAGE_CREDENTIAL",
    },
    // Globals Constants routes
    router: {
        controller: null,
        routes    : {
        },
    },

    controller: {},

    template: {
        controller: null,
        names     : {},
    },

    data: {
        session_id: -1,
        user      : {
            headerURLSecu: null,
        },
    },

    "const": {
        MODE_INIT  : 0,
        MODE_NEW   : 1, //duplicate is the mode new after clone object
        MODE_MOD   : 2,
        MODE_DEL   : 3,
        MODE_SEL   : 5,
        MODE_TRANSL: 10,

        SV_CLASS: "sv_class",
        SV_NAME : "sv_name",
        SV_CODE : "sv_code",

        SESS_STAT: "sess_stat",
        SESS_ID  : "sess_id",
        USER_ID  : "user_id",
        LOCK_ID  : "lock_id",

        USER_NAME 	: "user_name",
        USER_RIGHT	: "user_right",
        USER_TOK	: "user_tok",

        RES_DATA: "res_data",
        RES_LOCK: "lock",
        REQ_DATA: "req_data",

        FUNCT_SCOPE: "fVar",
        FUNCT_NAME : "fName",
        FUNCT_PARAM: "fParams",

        /*-------------------Error code ----------------------------------*/
        /*-------------------API code to resp------------------------------*/
        SV_CODE_API_YES: 20000,
        SV_CODE_API_NO : 20001,

        SV_CODE_OK: 20000,
        SV_CODE_KO: 20001,

        SV_CODE_NOTHING: 0,
        /*-------------------Error code ----------------------------------*/

        SV_CODE_ERR_UNKNOW: 10000,
        SV_CODE_ERR_AUTHEN: 10001,
        SV_CODE_ERR_SESS  : 10002,
        SV_CODE_ERR_RIGHT : 10003,
        SV_CODE_ERR_LOCK  : 10004,
        SV_CODE_ERR_API   : 10010,

        LANGUAGE: {
            EN: "en",
            FR: "fr",
            VN: "vi",
        },

        LANGUAGE_ID: {
            EN: "2",
            FR: "3",
            VN: "1",
        },
    },

    funct: {},

    constHTML: {
        id       : {
            HEADER_VIEW       : "#div_HeaderView",
            HEADER_LOGO_VIEW  : "#div_HeaderLogoView",
            HEADER_NAVBAR_VIEW: "#div_HeaderNavbarView",

            CONTENT_VIEW           : "#layout-wrapper",
            CONTENT_BREADCRUMB_VIEW: "#div_ContentBreadcrumbView",
            CMS_CONTENT_VIEW       : "#div_CMSContentView", //main view

            FOOTER_VIEW: "#div_FooterView",

            MENU_VIEW       : "#div_MenuView",
            MENU_USERPANEL  : "#div_Menu_UserPanel",
            MENU_SEARCH     : "#div_Menu_Search",
            MENU_SIDEBARMENU: "#div_Menu_SidebarMenu",
            //items menu
            MENU_ITEM_DASHBOARD: "#li_Menu_SidebarMenu_Item_Dashboard",
            MENU_ITEM_CFG      : "#li_Menu_SidebarMenu_Item_CFG",

            SETTINGS_CONFIG_VIEW: "#div_SettingsConfigView",
            SETTINGS_LOAD_VIEW  : "#div_SettingsLoadView",

            LOGIN_VIEW: "#div_LoginView",
        },
        classBody: {
            LOGIN   : "hold-transition login-page",
            HOMEPAGE: "hold-transition skin-black sidebar-collapse sidebar-mini", //fixed
        },
    },
};

var App = {
	path: {
		
	},
	// Globals Constants routes
	router: {
		controller: null,
		routes: {
			VI_MAIN: "VI_MAIN"
		},
		part: {
		}
	},
	controller: {
	},
	template: {
		names: {
		}
	},
	"const": {

	},
	data: {
	},
	varname: {
	},
	funct: {
	},
	constHTML: {
	},
};
//----------------------------------------------------------------------------------------------------------------------------

//var var_gl_divMenuView			= "#div_MenuView";
//var var_gl_divContentView			= "#div_ContentView";
//var var_gl_divFooterView			= "#div_FooterView";
//var var_gl_divSettingsConfigView	= "#div_SettingsConfigView";
//var var_gl_divSettingsLoadView	= "#div_SettingsLoadView";
//var var_gl_divCMSContentView		= "#div_CMSContentView";

//----------------------------------------------------------------------------------------------------------------------------
window.onload = function () {
    var element = document.createElement("div");
    element.id  = "div_Preloader";
    document.body.appendChild(element);
};

const do_gl_InitApp = function (RouteController) {
    if (AppCommon.title) document.title = AppCommon.title;

    App = $.extend(true, {}, AppCommon, App);

    
    
    //----------------------------------------------------------
    App.network             	= new Network();
    App.template.controller 	= new TemplateController();
    App.SummerNoteController 	= new SummerNoteController();
    App.MsgboxController 		= new MsgboxController();

    // create global router, init after templateController
    App.router.controller = new RouteController();
    App.router.controller.do_lc_init();
    //------------------------------------------------------------------
    do_gl_lang_load(do_gl_page_show);

    do_gl_init_datepicker();
    
    do_gl_init_ctrlPress();
};

const do_gl_lang_load = function (callback) {
    try {
        //Load language
        var locale   = localStorage.getItem("locale");
        var language = localStorage.getItem("language");
        var lang_id  = localStorage.getItem("languageId");

        if (!language || !locale || !lang_id) {
            do_gl_Set_Lang_Build_UI_URL_PATH();
            locale   = localStorage.getItem("locale");
            language = localStorage.getItem("language");
            lang_id  = localStorage.getItem("languageId");
        }

        App.locale     = locale;
        App.language   = language;
        App.languageId = lang_id;

        try {
            $.fn.datepicker.defaults.language = App.language;
        } catch (e) {
        }

        $.i18n({
            locale: App.locale,
        });
        
        if (callback) callback();
        
//        $.i18n()
//         .load(App.path.BASE_APP + "/transl", App.language, App.version)
//         .done(function () {
//             if (callback) callback();
//         });
    } catch (e) {
        console.log("---Cannot load language package----");
    }
};

const do_gl_lang_append = function (fileDir, callback, params) {
    try {
        $.i18n()
         .load(App.path.BASE_APP + "/" + fileDir, App.language, App.version)
         .done(function () {
        	 if (callback){
        		 if (params) 
        			 callback.apply(null, params);
        		 else
        			 callback();
        	 }
         });
    } catch (e) {
        console.log("---Cannot append language package----");
    }
};

const do_gl_Set_Lang_Build_UI_URL_PATH = function() {
    localStorage.setItem(var_gl_params_code[1].k, var_gl_params_code[1].v);
    localStorage.setItem(var_gl_params_code[2].k, var_gl_params_code[2].v);
    localStorage.setItem(var_gl_params_code[3].k, var_gl_params_code[3].v);
}
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
const do_gl_page_show = function () {
    do_gl_page_FirstView();
    do_gl_page_Resize();
    /*---------------------------------------------------*/
    if (!can_gl_MobileOrTablet()) {
    } else {
        // Wait for device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    //------------------------------------------------------
    $("#div_Preloader").fadeOut(1000);

    setTimeout(function () {
        $("#div_Preloader").hide();
    }, 1000);
};

const do_gl_page_FirstView = function () {
    if (!localStorage.language) localStorage.language = "vi";
    App.language = localStorage.language;

    if (FIRST_VIEW) {
        App.router.controller.do_lc_run(
//            App.router.routes.ONLOAD_PRJ + "/" + FIRST_VIEW
        	App.router.routes.ONLOAD + "/" + FIRST_VIEW
        );
    } else {
//        App.router.controller.do_lc_run(App.router.routes.ONLOAD_PRJ);
        App.router.controller.do_lc_run(App.router.routes.ONLOAD);
    }
};

const do_gl_page_Resize = function () {
    var fix = 100;
    var sH  = $(window).height();

    // Sections height
    $(window).resize(function () {
        var sH = $(window).height();
    });
};

const can_gl_MobileOrTablet = function () {
    var check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
const can_gl_MobileScreen = function () {
    return window.screen.width < 600;
};
const can_gl_iOSDevices = function () {
    return (
        navigator.platform.indexOf("iPhone") != -1 ||
        navigator.platform.indexOf("iPod") != -1 ||
        navigator.platform.indexOf("iPad") != -1
    );
};

//function can_gl_iPhoneOriPod(){
//    return navigator.platform.match(/i(Phone|Pod))/i)
//}
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
var lastStatus = "";
const do_gl_conn_check = function () {
    var networkState = navigator.connection.type;
    console.log("NETWORK CHANGED : ", networkState);
    if (networkState != lastStatus) {
        lastStatus = networkState;
        console.log("Network connection switched to : ", networkState);
        //		modifyBaseUrl(networkState);
    }
};

//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

window.onload = function () {
    var element = document.createElement("div");
    element.id  = "div_Preloader";
    document.body.appendChild(element);
};

//Is fired when device is ready
function onDeviceReady() {
    document.addEventListener("offline", eventOffline, false);
    document.addEventListener("online", eventOnline, false);
    document.addEventListener("pause", eventPause, false);
    do_gl_conn_check();
}

//Is fired when connection is lost
function eventOffline() {
    do_gl_conn_check();
}

//Is fired when connection is backed up
function eventOnline() {
    do_gl_conn_check();
}

//Is fired when application is paused
function eventPause() {
    //TODO: Erase plane related localstorage stuff ? Have to dial about that
}

//----------------------------------------------------------------------------------------------------------------------------
var bib_hnv_tool = [
    "sha256", 
    "i18n",
	
    "common/ctrl/CommonTool", //--queue, require...
    
	"common/ctrl/NetworkController",
	"common/ctrl/TemplateController",
	"common/ctrl/HandlebarsHelper",
	
	"common/ctrl/SummerNoteController",
	"common/ctrl/MsgboxController_New",
	"common/ctrl/NotifyTool",
	
	"common/ctrl/SecurityTool",
	"common/ctrl/UserRightTool",
	    
    "common/ctrl/BodyTool", //---su dung noi tu 'appLTE'
    "common/ctrl/BootstrapTool",
    "common/ctrl/DatatableTool",
    "common/ctrl/DateTool",
    
    "common/ctrl/PaginationTool",
    "common/ctrl/InputTool",
    "common/ctrl/FileInputTool",
    
    "common/ctrl/ChartTool",
    "common/ctrl/BarRatingTool",
    
    "common/ctrl/RTCTool",
//    "common/ctrl/ChatboxController",
    
//  "common/ctrl/ExceptionTool",
//  "common/ctrl/FunctionTool",
//  "common/ctrl/TagTool",
//    "common/ctrl/EffectTool",
//    "common/ctrl/JSONTool",
//    "common/ctrl/MarketJobTool",
//    "common/ctrl/ScanTool",
//    "common/ctrl/SecuController",
//    "common/ctrl/ShoppingCartTool",
//    "common/ctrl/StatisticTool",
//    "common/ctrl/TourTool",
    
//    "common/ctrl/ResizableTool",
//    "common/ctrl/URLTool",
   
//    "common/ctrl/TranslationTool",
//    "common/ctrl/WebSQLTool",
];

if (APP_ENV == 1)
 bib_hnv_tool = [
	 "sha256", 
	 "i18n",
	 "common/ctrl/All_Tool"
]

var bib_hnv_tool_QR = [
//    "common/ctrl/WebSQLTool",
    "common/ctrl/QRCode/QRCodeDecode",
    "common/ctrl/QRCode/QRCodeEncode",
    "common/ctrl/hwcrypto/hwcrypto",
];


var bib_datetime = [
	"datepicker", //--neu muon them lang thi sua bootstrap-datepicker.all_full roi minimize lai
	"timepicker",
	"datetimepicker",

	//                 	    'datepickerPath/bootstrap-datepicker",
	//						'datepickerPath/locales/bootstrap-datepicker.en",
	//						'datepickerPath/locales/bootstrap-datepicker.fr",
	//						'datepickerPath/locales/bootstrap-datepicker.vn",
	//						'daterangepickerPath/daterangepicker",

	//						'calendarPickmeup/pickmeup'
	//						'luxon.min'
];

var bib_secu = [
	 "hnv-secu/sha1",
	 
//    "hnv-secu/core",
    
//    "hnv-secu/convert",
//    "hnv-secu/hmac",
   
//    "hnv-secu/pbkdf2",
//    "hnv-secu/Base64Binary",
//    "hnv-secu/HNVEnc",
//    "hnv-secu/aes",
];

var bib_others = [
    /*'cordova.js",*/
    //						'sprintf",							//--use in MsgBoxController
    //						"common/ctrl/xml2json",
//    "jNumberformatter", //--parse number in InputTool
//    "bootstrapTour/bootstrap-tour", //--help in interface
//    "jqueryNumpad/jquery.numpad",
//    "touchKeyboard/jqbtk", //--virtual keyboard for sell UI
//    "patternomaly", //--draw chart
//    "slimScrool/jquery.slimscroll.min", //--hieu ung template
//    "fastclick/fastclick", //--hieu ung template
//    "iCheck/icheck.min", //--checkbox used in MSG
//    "masonry/masonry.pkgd",
//		bootstrapwysihtml5/bootstrap3-wysihtml5.hnv' //--Text editor
];

var bib_jqxScheduler 	= ["jqxScheduler/jqxScheduler.all"];

var bib_map    			= ["mapPath/map", "mapPath/geo", "mapPath/data-map"];

var bib_prj     		= [
    "jqueryUI",
    "prjMetismenu/metisMenu.min",//--hide/show sub menu in the left side

    "prjDropzone/min/dropzone.min",
    "prjJqueryRepete/jquery.repeater.min",//use for multi dropzone, ex: create epic in project
    
    "prjBootstrap/js/bootstrap.bundle.min", //menu event
    "prjDragula/dragula.min", //--drag and drop event, use for kanban
    
//    "prjSwiper/global",  //---set in CommonTool
	"prjSwiper/swiper-bundle.min", //--touch slider used in Kanban
    
	"prjApexChart/apexcharts.min",
	"prjGantt/ganttCfg",
//	"prjGantt/dhtmlxgantt", //---dependency for ganttCfg
    
	"prjBootstrapMultiselect/bootstrap-multiselect", //---work with selectChosen
//    "prjBootstrapMultiselect/popper",

    "prjwebRTC/kvs-webrtc",
	"prjwebRTC/createSignalingChannel",
	"prjwebRTC/master",
	"prjwebRTC/viewer",
	
	"prjSimplebar/simplebar.min"
//	  "prjNodewaves/waves.min",
    //	"prjBootstrapDatepicker/js/bootstrap-datepicker.min",
    //	"prjBootstrapTimepicker/js/bootstrap-timepicker.min'
];

var bib_cordova = [
    //	'cordova.js",
];





const do_gl_init_datepicker = function () {
    try {
        $.fn.datepicker.dates["fr"] = {
            days       : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            daysShort  : ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            daysMin    : ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
            months     : ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Decembre",],
            monthsShort: ["Jan","Fév","Mar","Avr","Mai","Juin","Juillet","Août","Sep","Oct","Nov", "Dec"],
            today      : "Aujourd'hui",
            clear      : "Effacer",
            format     : "dd/mm/yyyy",
            titleFormat: "MM yyyy" /* Leverages same syntax as 'format' */,
            weekStart  : 1,
        };

        $.fn.datepicker.dates["vi"] = {
            days       : ["Chủ nhật","Thứ Hai","Thứ Ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy",],
            daysShort  : ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
            daysMin    : ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
            months     : ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai",],
            monthsShort: ["Một", "Hai","Ba","Tư","Năm","Sáu","Bảy","Tám","Chín","Mười","Một","Hai",],
            today      : "Hôm nay",
            clear      : "Xóa",
            format     : "dd/mm/yyyy",
            titleFormat: "MM yyyy" /* Leverages same syntax as 'format' */,
            weekStart  : 1,
        };
    } catch (e) {
        console.log(e);
    }
};

const do_gl_refresh_SecuHeader = function () {
    setInterval(function () {
        console.log("----Refresh Http Secu Header-----");
        App.data["HttpSecuHeader"] = req_gl_LS_SecurityHeaderBearer(
            App.keys.KEY_STORAGE_CREDENTIAL
        );
    }, 1000 * 60 * 30);
};

const do_gl_show_Notify_Msg = function (sharedJson, msg, typeNotify, modeOld, modeNew) {
    if (typeNotify) {
        if (typeNotify == 1) {
            if (!msg) msg = "OK";
            do_gl_show_Notify_Msg_Success(msg);
        } else if (typeNotify == 0) {
            if (!msg) msg = "Err";
            do_gl_show_Notify_Msg_Error(msg);
        }
    } else {
        var code = sharedJson[App["const"].SV_CODE];
        if (code == App["const"].SV_CODE_API_YES) {
            if (
                modeOld == App["const"].MODE_NEW ||
                modeOld == App["const"].MODE_MOD
            ) {
                if (!msg) {
                    msg = $.i18n("common_ok_msg_save");
                }
            } else if (modeOld == App["const"].MODE_DEL) {
                if (!msg) msg = $.i18n("common_ok_msg_del");
            }
            do_gl_show_Notify_Msg_Success(msg);
        } else if (code == App["const"].SV_CODE_API_NO) {
            if (
                modeOld == App["const"].MODE_INIT ||
                modeOld == App["const"].MODE_SEL
            ) {
                if (!msg) msg = $.i18n("common_err_msg_get");
            } else if (
                modeOld == App["const"].MODE_NEW ||
                modeOld == App["const"].MODE_MOD
            ) {
                if (!msg) msg = $.i18n("common_err_msg_save");
            } else if (modeOld == App["const"].MODE_DEL) {
                if (!msg) msg = $.i18n("common_err_msg_del");
            }

            do_gl_show_Notify_Msg_Error(msg);
        } else {
            if (!msg) msg = $.i18n("common_err_msg_unknow");
            do_gl_show_Notify_Msg_Error(msg + " (" + code + ")");
        }
    }
};

//-----event ctrl--------------------------------------------------------------------------
var ctrlIsPressed = false;
const do_gl_init_ctrlPress = function (){
	$(document).keydown(function(event){
        if(event.which=="17")
        	ctrlIsPressed = true;
    });

    $(document).keyup(function(){
    	ctrlIsPressed = false;
    });
}

//-----------------------------------------------------------------------------------------
const do_gl_bind_page= function(){
	!function() {
		"use strict";
		function s(e) {
			const $btsStyle 	= $("#bootstrap-style");
			const $appStyle 	= $("#app-style");
			const $lightMode 	= $("#light-mode-switch");
			const $darkMode  	= $("#dark-mode-switch");
			const $rtlMode 		= $("#rtl-mode-switch");
			
			if(1 == $lightMode.prop("checked") && "light-mode-switch" === e){
				$darkMode		.prop("checked", false);
				$rtlMode		.prop("checked", false);
				$btsStyle		.attr("href") 	!== "www/css/prj/bootstrap.min.css" && $btsStyle.attr("href", "www/css/prj/bootstrap.min.css");
				$appStyle		.attr("href") 	!== "www/css/prj/app.min.css" 		&& $appStyle.attr("href", "www/css/prj/app.min.css");
				sessionStorage	.setItem("is_visited", "light-mode-switch");
			} else if(1 == $darkMode.prop("checked") && "dark-mode-switch" === e){
				$lightMode		.prop("checked", false);
				$rtlMode		.prop("checked", false);
				$btsStyle		.attr("href") 	!== "www/css/prj/bootstrap-dark.min.css" 	&& $btsStyle.attr("href", "www/css/prj/bootstrap-dark.min.css");
				$appStyle		.attr("href") 	!== "www/css/prj/app-dark.min.css" 			&& $appStyle.attr("href", "www/css/prj/app-dark.min.css");
				sessionStorage	.setItem("is_visited", "dark-mode-switch");
			} else if(1 == $rtlMode.prop("checked") && "rtl-mode-switch" === e){
				$lightMode		.prop("checked", false);
				$darkMode		.prop("checked", false);
				$btsStyle		.attr("href") 	!== "www/css/prj/bootstrap.min.css" && $btsStyle.attr("href", "www/css/prj/bootstrap.min.css");
				$appStyle		.attr("href") 	!== "www/css/prj/app-rtl.min.css" 	&& $appStyle.attr("href", "www/css/prj/app-rtl.min.css");
				sessionStorage	.setItem("is_visited", "rtl-mode-switch");
			}
		}
		
		function e() {
			document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || (console.log("pressed"),
					$("body").removeClass("fullscreen-enable"))
		};
		
		$("#vertical-menu-btn").off("click").on("click", function(e) {
			e.preventDefault();
			$("body").toggleClass("sidebar-enable"),
			992 <= $(window).width() ? $("body").toggleClass("vertical-collpsed") : $("body").removeClass("vertical-collpsed")
		});
		
//		$("#side-menu").metisMenu(),
//		$("#sidebar-menu a").each(function() {
//			var e = window.location.href.split(/[?#]/)[0];
//			this.href == e && ($(this).addClass("active"),
//					$(this).parent().addClass("mm-active"),
//					$(this).parent().parent().addClass("mm-show"),
//					$(this).parent().parent().prev().addClass("mm-active"),
//					$(this).parent().parent().parent().addClass("mm-active"),
//					$(this).parent().parent().parent().parent().addClass("mm-show"),
//					$(this).parent().parent().parent().parent().parent().addClass("mm-active"))
//		}),
		$(".navbar-nav a").each(function() {
			var e = window.location.href.split(/[?#]/)[0];
			this.href == e && ($(this).addClass("active"),
					$(this).parent().addClass("active"),
					$(this).parent().parent().addClass("active"),
					$(this).parent().parent().parent().addClass("active"),
					$(this).parent().parent().parent().parent().addClass("active"))
		}),
		$('[data-toggle="fullscreen"]').on("click", function(e) {
			e.preventDefault(),
			$("body").toggleClass("fullscreen-enable"),
			document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ? document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
		}),
		document.addEventListener("fullscreenchange", e),
		document.addEventListener("webkitfullscreenchange", e),
		document.addEventListener("mozfullscreenchange", e),
		$(".right-bar-toggle").on("click", function(e) {
			$("body").toggleClass("right-bar-enabled")
		}),
		$(document).on("click", "body", function(e) {
			0 < $(e.target).closest(".right-bar-toggle, .right-bar").length || $("body").removeClass("right-bar-enabled")
		}),
		$(".dropdown-menu a.dropdown-toggle").on("click", function(e) {
			return $(this).next().hasClass("show") || $(this).parents(".dropdown-menu").first().find(".show").removeClass("show"),
			$(this).next(".dropdown-menu").toggleClass("show"), false
		}),
		$(function() {
//			$('[data-toggle="tooltip"]').tooltip()
			$('body').tooltip({ selector: '[data-toggle="tooltip"]' })
		}),
		$(function() {
			$('[data-toggle="popover"]').popover()
		}),
		function() {
			if (window.sessionStorage) {
				var e = sessionStorage.getItem("is_visited");
				e ? ($(".right-bar input:checkbox").prop("checked", false),
						$("#" + e).prop("checked", !0),
						s(e)) : sessionStorage.setItem("is_visited", "light-mode-switch")
			}
			$("#light-mode-switch, #dark-mode-switch, #rtl-mode-switch").on("change", function(e) {
				s(e.target.id)
			})
		}(),
		$(window).on("load", function() {
			$("#status").fadeOut(),
			$("#preloader").delay(350).fadeOut("slow")
		})
//		,Waves.init()
	}();

	window.outerRepeater = $(".outer-repeater").repeater({
		defaultValues: {
			"text-input": "outer-default"
		},
		show: function() {
			console.log("outer show"),
			$(this).slideDown()
		},
		hide: function(e) {
			console.log("outer delete"),
			$(this).slideUp(e)
		},
		repeaters: [{
			selector: ".inner-repeater",
			defaultValues: {
				"inner-text-input": "inner-default"
			},
			show: function() {
				console.log("inner show"),
				$(this).slideDown()
			},
			hide: function(e) {
				console.log("inner delete"),
				$(this).slideUp(e)
			}
		}]
	})
}

//-------------------------------------------------------------------------------------------------------------------------
//----LOAD REQUIREJS---------------------------------------------------------------------------------------------------------------------
requirejs.config(requirejs_config);

//---BEGIN PROGRAM----------------------------------------------------------------------------------------------------------------------
var bib = [
	'jquery',
	'main/route/CommonRouteController',
];

var bib_all = [	...bib,
				...bib_hnv_tool,
				...bib_prj,
				...bib_datetime,
				//...bib_others,
				//...bib_secu,
				];

if (can_gl_MobileOrTablet()) bib_all = [...bib_all, ...bib_cordova];

//Start the main app logic.
requirejs(bib_all, function ($, RouteController) {
	$(document).ready(function () {
		//--------------Begin app here ----------------------------------------------------------------------------------------------	
		do_gl_InitApp(RouteController);
		
		//App.data.url = decodeURIComponent(window.location.search.substring(1));
	});
});
//------------------------------------------------------------------------------