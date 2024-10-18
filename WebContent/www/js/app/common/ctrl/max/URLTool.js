var req_gl_GetURLParameter = function(paramsArray){
//	var pathname = window.location.pathname; // Returns path only
//	var url      = window.location.href;     // Returns full URL
//	var origin   = window.location.origin;   // Returns base URL

	if (!paramsArray) return {};

	if(!App.data.url) 		App.data.url = "";
	if(App.data.url=="")	App.data.url = decodeURIComponent(window.location.search.substring(1));

	var sPageURL		= App.data.url;
	App.data.url 		= "";

	var sURLVariables 	= sPageURL?sPageURL.split('&'):[];   
	var paramsResult	= {};

	for(var j = 0; j < paramsArray.length; j++) {
		paramsResult[paramsArray[j]] = null;
	}


	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');				
		if (paramsResult[sParameterName[0]]==null) 
			paramsResult[sParameterName[0]]=sParameterName[1];				
	}

	return paramsResult;
}