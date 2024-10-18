function do_gl_send_exception(url, url_header, NetworkController, moduleName, className, functionName, msg) {
	var svClass 			= App['const'].SV_CLASS;
	var svName				= App['const'].SV_NAME;
	var sessId				= App['const'].SESS_ID;
	var fVar				= App['const'].FUNCT_SCOPE;
	var fName				= App['const'].FUNCT_NAME;
	var fParam				= App['const'].FUNCT_PARAM;
	var ref				= {};
	ref[svClass		] 	= "ServiceException"; 
	ref[svName		]	= "SVExceptionNew"; 
	ref[sessId		]	= App.data.session_id;
	
	if (App.data.user) uId = App.data.user.id; else  uId = -1;	
	ref['json_obj'	] 	= JSON.stringify({"userId" 	: uId,
							"module"	: moduleName,
							"date"		: DateFormat(new Date(), DateFormat.masks.dbLongDate),
							"class"		: className,
							"function"	: functionName,
							"error"		: msg});
	
	NetworkController.ajaxBackground(url, url_header, ref, 100000, null, null);
}

function do_gl_get_exception_lst(url, url_header, NetworkController, fSucces, fError) {
	var svClass 			= App['const'].SV_CLASS;
	var svName				= App['const'].SV_NAME;
	var sessId				= App['const'].SESS_ID;
	var fVar				= App['const'].FUNCT_SCOPE;
	var fName				= App['const'].FUNCT_NAME;
	var fParam				= App['const'].FUNCT_PARAM;
	
	var ref				= {};
	ref[svClass		] 	= "ServiceException";
	ref[svName		]	= "SVExceptionLst"; 
	ref[sessId		]	= App.data.session_id;
	
	NetworkController.ajaxBackground(url, url_header, ref, 100000, fSucces, fError);
}