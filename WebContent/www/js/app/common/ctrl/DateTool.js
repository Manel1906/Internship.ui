/*
const req_gl_DateObj_From_DateStr(dStr, strFormat)
const req_gl_DateStr_From_DateObj(dObj, strFormat)
const req_gl_DateStr_From_DateStr
const req_gl_Date_LocalFormat
const req_gl_DateStr_LocalFormatFull (strDate)
const req_gl_DateStr_LocalFormatShort (strDate)
const req_gl_DayDiff

const req_gl_Date_CompareObj = function (date01, date02)

const req_gl_DateAdd (dt, interval, unit)

DateFormat.masks

 */

/*********************************************************************************/
/******************************FORMATAGE DES DATES********************************/
/*********************************************************************************/
//alert(dateFormat(new Date(),dateFormat.masks.frDate));
var DateFormat = function () {
	var	token = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	timezoneClip = /[^-+\dA-Z]/g,
	pad = function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = "0" + val;
		return val;
	};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = DateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		// by default, date has format iso
		if(isNaN(date)){
			try{
				date = date.replace(/-/g, "/");
				date = new Date(date);
			}catch(e){
				date = new Date();
			}
			//	date = date? date.replace(/-/g, "/")) : null;  
            
        }else{       	
            date = date ? new Date(date) : new Date();
        }		
		
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				M = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				m = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
						flags = {
						d:    d,
						dd:   pad(d),
						ddd:  dF.i18n.dayNames[D],
						dddd: dF.i18n.dayNames[D + 7],
						M:    M + 1,
						MM:   pad(M + 1),
						MMM:  dF.i18n.monthNames[M],
						MMMM: dF.i18n.monthNames[M + 12],
						yy:   String(y).slice(2),
						yyyy: y,
						h:    H % 12 || 12,
						hh:   pad(H % 12 || 12),
						H:    H,
						HH:   pad(H),
						m:    m,
						mm:   pad(m),
						s:    s,
						ss:   pad(s),
						l:    pad(L, 3),
						L:    pad(L > 99 ? Math.round(L / 10) : L),
						t:    H < 12 ? "a"  : "p",
								tt:   H < 12 ? "am" : "pm",
										T:    H < 12 ? "A"  : "P",
												TT:   H < 12 ? "AM" : "PM",
														Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
																o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
																S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

//Some common format strings
DateFormat.masks = {
		"default"		: 	"yyyy-MM-dd HH:mm:ss",
		
//		shortDate		:   "M/d/yy",
//		mediumDate		:   "MMM d, yyyy",
//		longDate		:   "MMM d, yyyy",
//		fullDate		:   "dddd, MMMM d, yyyy",


//		shortTime		:	"h:mm TT",
//		mediumTime		:   "h:mm:ss TT",
//		longTime		:   "h:mm:ss TT Z",
		
		isoDateTime             : "yyyy-MM-dd HH:mm:ss",
		isoDate                 : "yyyy-MM-dd",
		isoTime                 : "HH:mm:ss",
		
		isoUtcDateTime          : "UTC:yyyy-MM-dd HH:mm:ss'Z'",

		frFullDate              : "dd/MM/yyyy HH:mm:ss",
		frShortDate             : "dd/MM/yyyy",
		fr                      : "dd/MM/yyyy HH:mm:ss",
		frDate                  : "dd/MM/yyyy HH:mm",
		
		enFullDate              : "dd/MM/yyyy HH:mm:ss",
		enShortDate             : "dd/MM/yyyy",
		en                      : "dd/MM/yyyy HH:mm:ss",
		enDate                  : "d/M/yyyy HH:mm",
		
		viFullDate              : "dd/MM/yyyy HH:mm:ss",
		viShortDate             : "dd/MM/yyyy",
		vi                      : "dd/MM/yyyy HH:mm:ss",
		viDate                  : "dd/MM/yyyy HH:mm",

		vnFullDate              : "dd/MM/yyyy HH:mm:ss",
		vnShortDate             : "dd/MM/yyyy",
		vn                      : "dd/MM/yyyy HH:mm:ss",

		dbShortDate             : "yyyy-MM-dd",
		dbLongDate              : "yyyy-MM-dd HH:mm:ss",

		dbShortDateInverse      : "dd-MM-yyyy",
		

};

//Internationalization strings
DateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				]
};

//-----------------------------------------------------------------------------------------------

//Tim số ngày chênh lệch giữa 2 ngày
const req_gl_DayDiff = function (dateFrom, dateTo = new Date()) {
	let dateF 		= new Date(dateFrom);
	let dateT 		= new Date(dateTo);
	let diffTime 	= dateF - dateT;
	let diffDays 	= Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

	return diffDays;
}

//****Str to Date Obj******/
const req_gl_DateObj_From_DateStr = function (dStr, strFormat){
	if (!dStr) return null;
	dStr = dStr.trim();
	if (dStr.length<=0) return null;
	if (!strFormat)
		strFormat = DateFormat.masks.isoDateTime;
		
	var dObj = null;
	try{
		dObj = strToDate(dStr, strFormat);
	}catch(e){
		try{
			dObj = new Date(dStr);
		}catch(e){}
	}
	return dObj;
}

//****Date Obj to Str******/
const req_gl_DateStr_From_DateObj = function (dObj, strFormat){
	if (!dObj) return null;
	if (!strFormat)
		strFormat = DateFormat.masks.isoDateTime;
	
	return DateFormat(dObj, strFormat);	
}



//****Str to Str******/
const req_gl_DateStr_From_DateStr = function (dStr, strFormatSrc, strFormatDest){
	if (!dStr) return null;
	dStr = dStr.trim();
	if (dStr.length<=0) return null;
	var dObj = req_gl_DateObj_From_DateStr(dStr, strFormatSrc);
	if (!dObj) return null;
	
	if (!strFormatDest) 
		strFormatDest = DateFormat.masks.isoDateTime;
	
	return DateFormat(dObj, strFormatDest);
}

//------------------------------------------------
const req_gl_DateFormat_LocalFormat = function  (){
	var local = localStorage.language;
	if (!local) local = "en";
	var format = DateFormat.masks.enShortDate;
	if (local=="fr")
		format = DateFormat.masks.frShortDate;
	else if (local=="vn")
		format = DateFormat.masks.viShortDate;
	else if (local=="vi")
		format = DateFormat.masks.viShortDate;
	
	return format;
}

const req_gl_DateFormat_LocalShort = function  (){
	var local = localStorage.language;
	if (!local) local = "en";
	var format = DateFormat.masks.enShortDate;
	if (local=="fr")
		format = DateFormat.masks.frShortDate;
	else if (local=="vn")
		format = DateFormat.masks.viShortDate;
	else if (local=="vi")
		format = DateFormat.masks.viShortDate;
	
	return format;
}
const req_gl_DateFormat_LocalFull = function  (){
	var local 	= localStorage.language;
	if (!local) local = "en";
	var format 	= DateFormat.masks.enFullDate;
	if (local=="fr")
		format 	= DateFormat.masks.frFullDate;
	else if (local=="vn")
		format 	= DateFormat.masks.viFullDate;
	else if (local=="vi")
		format 	= DateFormat.masks.viFullDate;
	
	return format;
}

const req_gl_DateStr_LocalFormatFull = function  (strDate){
	try{
		if(strDate) {
			var local = localStorage.language;
			if (!local) local = "en";
			var format = DateFormat.masks.enFullDate;
			if (local=="fr")
				format = DateFormat.masks.frFullDate;
			else if (local=="vn")
				format = DateFormat.masks.viFullDate;
			else if (local=="vi")
				format = DateFormat.masks.viFullDate;
			
			return DateFormat(strDate, format);	
		} else {
			return strDate;
		}
	}catch(e){
		return strDate;
	}
}

const req_gl_DateStr_LocalFormatShort = function  (strDate){
	try{
		if(strDate) {
			var local = localStorage.language;
			if (!local) local = "en";
			var format = DateFormat.masks.enShortDate;
			if (local=="fr")
				format = DateFormat.masks.frShortDate;
			else if (local=="vn")
				format = DateFormat.masks.viShortDate;
			else if (local=="vi")
				format = DateFormat.masks.viShortDate;
			
			return DateFormat(strDate, format);	
		} else {
			return strDate;
		}
	}catch(e){
		return strDate;
	}
}

const req_gl_get_CurrentDateStr = function (strFormatDest) {
	const dateObj = new Date(Date.now())

	return req_gl_DateStr_From_DateObj(dateObj, strFormatDest)
}

const req_gl_Date_CompareObj = function (date01, date02){
	if (date01 && date02){		
		return date01.getTime() - date02.getTime();		
	}else if ((date01 && !date02) || (!date01 && date02)){
		return undefined;
	}
	return null;
}

//----return iso short str from a given strShortDate and lang
const req_gl_Date_ISOShortStr = function  (strShortDate, strLang){ //---return format yyyy-MM-dd
	return reqShortDateString(strShortDate, strLang);
}

const req_gl_Date_ISOLongStr = function  (strLongDate, strLang){//---return format yyyy-MM-dd HH:mm:ss
	return reqLongDateString(strLongDate, strLang);
}

const req_gl_Date_From_ISOLongStr = function (strDate){	
	return DateFormat(strDate, DateFormat.masks.dbLongDate)
}

const req_gl_Date_From_ISOShortStr = function (strDate){	
	return DateFormat(strDate, DateFormat.masks.dbShortDate)
}

const req_gl_Date_CompareStr = function (strDate01, strDate02, strDateFormat){
	return compareDate(strDate01, strDate02, strDateFormat);
}


const req_gl_Date_NbDayInMonth = function ( year, month){
	return new Date(year, month+1, 0).getDate();
}

//----private-----------------------------------------------------------
//----private-----------------------------------------------------------
function strToDate (str, format){	
	  var normalized      	= str.replace(/[^a-zA-Z0-9]/g, '-');
	  var normalizedFormat	= format.replace(/[^a-zA-Z0-9]/g, '-');
	  var formatItems     	= normalizedFormat.split('-');
	  var dateItems       	= normalized.split('-');

	  var yearIndex   	  	= formatItems.indexOf("yyyy");
	  var monthIndex  	  	= formatItems.indexOf("MM");
	  var dayIndex   	  	= formatItems.indexOf("dd");
	 
	  var hourIndex       	= formatItems.indexOf("HH");
	  var minutesIndex    	= formatItems.indexOf("mm");
	  var secondsIndex  	= formatItems.indexOf("ss");

	  var today 	= new Date();

	  var year  	= yearIndex		> -1 ? dateItems[yearIndex]    : today.getFullYear();
	  var month 	= monthIndex	> -1	? dateItems[monthIndex]-1 : today.getMonth()-1;
	  var day   	= dayIndex		> -1 ? dateItems[dayIndex]     : today.getDate();

	  var hour    	= hourIndex		> -1 ? dateItems[hourIndex]    : today.getHours();
	  var minute  	= minutesIndex	> -1 ? dateItems[minutesIndex] : today.getMinutes();
	  var second  	= secondsIndex	> -1 ? dateItems[secondsIndex]? dateItems[secondsIndex]: '00' : today.getSeconds();

	  return new Date(year,month,day,hour,minute,second);
	  
	};

function reqShortDateString (shortDate, lang){
	if (!lang){
		lang = localStorage.language;		
	}
	if (lang == "fr"){
		return frShortDateToDBDate(shortDate);
	}else if (lang == "en"){
		return enShortDateToDBDate(shortDate);
	}else if (lang=="vi" || lang == "vn"){
		return frShortDateToDBDate(shortDate);
	}else if (lang =="iso"){
		return shortDate;
	}
}

function reqLongDateString  (shortDate, lang){
	if (!lang){
		lang = localStorage.language;		
	}
	
	if (lang == "fr"){
		return frLongDateToDBDate(shortDate);
	}else if (lang == "en"){
		return enLongDateToDBDate(shortDate);
	}else if (lang=="vi" || lang == "vn"){
		return frLongDateToDBDate(shortDate);
	}else if (lang =="iso"){
		return shortDate;
	}
}
function reqNbDayInMonth 	(month,year) {
	return new Date(year, month+1, 0).getDate();
}
function compareDate		(date1, date2, dateFormat){
	if (date1 && date2){
		var d1 = strToDate(date1,dateFormat);
		var d2 = strToDate(date2,dateFormat);
		return d1.getTime() - d2.getTime();		
	}else if ((date1 && !date2) || (!date1 && date2)){
		return undefined;
	}
	return null;
}

function getDateString		(dateInp, timeInp){
	var d = dateInp.val();	
	var t = timeInp.val();	

	try {
		d = frShortDateToDBDate(d);				
	}catch (e) {
		d = DateFormat(d, DateFormat.masks.dbShortDate);			
	}		

	if (d==null){
		dateInp.addClass("error"); return null;
	}
	if (t==null){
		timeInp.addClass("error"); return null;
	}
	return d + ' ' + t + ':00';
}

function getDateFormatStandardShort(date) { //yyyy-MM-dd
	var 	d 		= new Date(date || Date.now());
	var    	day 	= '' + d.getDate();
	var 	month 	= '' + (d.getMonth() + 1);
	var		year 	= d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day ].join('-');
}

function frShortDateToDBDate(date){// dd/MM/yyyy => yyyy-MM-dd
	date = date.slice(0, 10);
	if (date.length==10){
		var res = date.split("/");
		if (res.length==3){
			/*var d = parseInt(res[0]);
			var m = parseInt(res[1]);
			var y = parseInt(res[2]);*/
			return [res[2] , res[1], res[0] ].join('-');

		}
		return null;
	}	
}//:	"dd/mm/yyyy",

function frLongDateToDBDate	(date){// dd/MM/yyyy HH:mm:ss => yyyy-MM-dd HH:mm:ss
	var part = date.split(" ");
	if (part.length==2){
		var d1 = part[0];
		var d2 = part[1];

		var res = d1.split("/");
		if (res.length==3){			
			return [res[2] , res[1], res[0] ].join('-')+" "+d2;
		}	
		return null;
	}	
}

function enShortDateToDBDate(date){// MM/dd/yyyy => yyyy-MM-dd
	date = date.slice(0, 10);
	if (date.length==10){
		var res = date.split("/");
		if (res.length==3){			
			return [res[2] , res[0], res[1]].join('-');			
		}
		return null;
	}	
}//:	"dd/mm/yyyy",

function enLongDateToDBDate	(date){// dd/MM/yyyy HH:mm:ss => yyyy-MM-dd HH:mm:ss
	var part = date.split(" ");
	if (part.length==2){
		var d1 = part[0];
		var d2 = part[1];

		var res = d1.split("/");
		if (res.length==3){			
			return [res[2] , res[0], res[1] ].join('-')+" "+d2;
		}	
		return null;
	}	
}

function getWeek (date) {
	var myDate = new Date(date);
	var onejan = new Date(myDate.getFullYear(), 0, 1);
	return Math.ceil((((myDate - onejan) / 86400000) + onejan.getDay() + 1) / 7);    
}
function getYear (date) {
	var myDate = new Date(date);
	return myDate.getFullYear();
}
function getStringMonth(date){
	var myDate = new Date(date);
	var month = myDate.getMonth();
	return getMonthStr(month);
}

function getMonthStr(month){
	switch (month) {
	case 0:
	case "00":
		return $.i18n("common_date_january");
		break;
	case 1:
	case "01":
		return $.i18n("common_date_february");
		break;
	case 2:
	case "02":
		return $.i18n("common_date_march");	
		break;
	case 3:
	case "03":
		return $.i18n("common_date_april");
		break;
	case 4:
	case "04":
		return $.i18n("common_date_may");
		break;
	case 5:
	case "05":
		return $.i18n("common_date_june");
		break;
	case 6:
	case "06":
		return $.i18n("common_date_july");
		break;
	case 7:
	case "07":
		return $.i18n("common_date_august");
		break;
	case 8:
	case "08":
		return $.i18n("common_date_september");
		break;
	case 9:
	case "09":
		return $.i18n("common_date_october");
		break;
	case 10:
	case "10":
		return $.i18n("common_date_november");
		break;
	case 11:
	case "11":
		return $.i18n("common_date_december");
		break;
	}
}

const req_gl_DateAdd = function (date, interval, units) {
	if(!(date instanceof Date))
		return undefined;
	var ret = new Date(date); //don't change original date
	var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
	switch(String(interval).toLowerCase()) {
	case 'Y' :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
	case 'M' :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
	case 'D' :  ret.setDate(ret.getDate() + units);  break;
	case 'H' :  ret.setTime(ret.getTime() + units*3600000);  break;
	case 'm' :  ret.setTime(ret.getTime() + units*60000);  break;
	case 's' :  ret.setTime(ret.getTime() + units*1000);  break;
	default  :  ret = undefined;  break;
	}
	return ret;
}
