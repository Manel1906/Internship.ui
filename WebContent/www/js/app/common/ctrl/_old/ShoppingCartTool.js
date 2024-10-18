var req_gl_shoppingCart = function(){
	var obj = req_gl_LocalStorage("shoppingCart");
	if(!obj)	return {};
	return obj;
}

const do_gl_cal_distance = function(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}


var req_gl_shoppingRecentView = function(){
	var obj = req_gl_LocalStorage("shoppingRecentView");
	if(!obj)	return [];
	return obj;
}

var req_gl_shoppingCategories = function(){
	try{
		var time = req_gl_LocalStorage ("shoppingCategoriesTime");
		if (time!=null){
			var now = (new Date()).getTime();
			time = parseInt(time, 10);
			var diff = now - time;
			if (diff> 24*60*60*1000){
				do_gl_LocalStorage_Clear ( "shoppingCategories" );
				do_gl_LocalStorage_Clear ( "shoppingCategoriesTime" );
				return null;
			}
		}
		
		var obj = req_gl_LocalStorage("shoppingCategories");
		if(!obj)	return null;
		
		return obj;
	}catch(e){
		return null;
	}
	
}

var req_gl_favoriteCount = function(){
	var obj = req_gl_LocalStorage("FavoriteCount");
	if(!obj)	return {};
	return obj;
}

var req_gl_shipper_location = function(){
	var obj = req_gl_LocalStorage("shipper_loc");
	if(!obj)	return {};
	return obj;
}

//for(var i in arrUser){
//if(arrUser[i] == App.data.user.id){
//	var count = favoriteCount[App.data.user.id].count;
//}
//}
const do_gl_saveFavoriteCount =  function(FavoriteCount, user, count){
	var arrUser =  Object.keys(FavoriteCount);
	if(arrUser.length == 0){
		if(!arrUser[user.id]) FavoriteCount[user.id] = {};
		if(!FavoriteCount[user.id].count) FavoriteCount[user.id].count = count;
	}else{
		for( var i in arrUser){
			if(arrUser[i] = user.id){
				FavoriteCount[ user.id].count = count;
			}
		}
	}
	
	do_gl_LocalStorage_Save("FavoriteCount"  , FavoriteCount);
}

var req_gl_favoriteCountUpdate = function(FavoriteCount, user, count){
	var arrUser =  Object.keys(FavoriteCount);
	if(arrUser.length == 0){
		if(!arrUser[user.id]) FavoriteCount[user.id] = {};
		if(!FavoriteCount[user.id].count) FavoriteCount[user.id].count = count;
	}else{
		for( var i in arrUser){
			if(arrUser[i] == user.id){
				FavoriteCount[user.id].count += count;
			}
		}
	}
	
	do_gl_LocalStorage_Save("FavoriteCount"  , FavoriteCount);
}

const do_gl_saveShoppingCategories =  function(categories){
	do_gl_LocalStorage_Save("shoppingCategories"  , categories);
	
	var time = (new Date()).getTime();
	do_gl_LocalStorage_Save("shoppingCategoriesTime"  , time);
	
}

const do_gl_articleAdd = function(cart, socInf, need){ 
//	manId: "141"
//  price01, price02 tu sorPricing
//	disc : 
//	price: "57442" = price02 - discount
//	amount: price x quant
//	currency: "Đồng Việt Nam"
//	unit: "Gói"
//	quant: "1"
//	matId,
//	unitId
//  pricingId,

	var manInf 				= cart[need.manId];
	if (!manInf){
		manInf  			= {};
		cart[need.manId] 	= manInf;
		manInf.soc 			= socInf;//o duoi khong can gan lai em, vi day da la obj cua cart[need.manId] 
	}
	
	var lstMat = manInf.lst;
	if (!lstMat){
		 lstMat  						 = {};
		 manInf.lst 					 = lstMat;
		 manInf.price   				 = 0;		
		 manInf.amount 				     = 0;
		 manInf.disc 					 = 0;
		 manInf.quant					 = 0;
		 if(need.currencyName)	manInf.currencyName = need.currencyName;
		 else manInf.currencyName = "VNĐ";
	}
	
	var matKey = need.matId + "-" + need.unitId + "-" + need.priceId;
	
	if (!need.price ) 		need.price  	= parseFloat(need.price02) - parseFloat(need.disc);
	if (!need.amount) 		need.amount 	= parseFloat(need.price  ) * parseFloat(need.quant);
	if (!need.discTotal)  	need.discTotal 	= parseFloat(need.disc   ) * parseFloat(need.quant);
	
	if(!lstMat[matKey]){		
		if (need.quant>0) lstMat[matKey] = need; 
	}else{
		//---if delete from cart
		if (need.isDeleted){
			delete  lstMat[matKey] ;
		}else if (need.isUpdated){
			lstMat[matKey].quant 	= parseInt(need.quant);
			lstMat[matKey].amount 	= parseFloat(need.amount);
			lstMat[matKey].price 	= parseFloat(need.price);
			lstMat[matKey].discTotal= parseFloat(need.discTotal);
			if (lstMat[matKey].quant<=0) delete lstMat[matKey] 
		}else{
			lstMat[matKey].quant 	 = parseInt(lstMat[matKey].quant)    	+ parseInt(need.quant); 
			lstMat[matKey].amount 	 = parseFloat(lstMat[matKey].amount) 	+ parseFloat(need.amount); 
			lstMat[matKey].discTotal = parseFloat(lstMat[matKey].discTotal) + parseFloat(need.discTotal);
			if (lstMat[matKey].quant<=0) delete lstMat[matKey] 
		}		
	}
	
	// recalcul lstMat
	var amount 		= 0;
	var disc 		= 0;
	var quant		= 0;
	var arrayMat	= Object.keys(lstMat);
	
	for(var i in arrayMat){
		let mat	 = lstMat[arrayMat[i]];
		if(!mat || mat == null)	continue;
		amount	+= parseFloat(mat.amount);
		disc	+= parseFloat(mat.discTotal);
		quant	+= parseFloat(mat.quant);
	}
	
	manInf.manId	= need.manId;
	manInf.lst 		= lstMat;
	manInf.quant 	= quant;
	manInf.amount 	= amount;
	manInf.disc 	= disc;
	
	
	if (manInf.quant <=0){
		delete  cart[need.manId];
	}
	
	// add to LocalStorage
	do_gl_LocalStorage_Save("shoppingCart"  , cart);
}

const do_gl_validateCart =  function(cart, manId){
	delete cart[manId];
	
	// add to LocalStorage
	do_gl_LocalStorage_Save("shoppingCart"  , cart);
}

const do_gl_showCartHeader = function(){
	var cart = req_gl_shoppingCart();
	
	var amount 		= 0;
	var quant		= 0;
	var arraySoc = Object.keys(cart);
	
	for(var i in arraySoc){
		let soc	 = cart[arraySoc[i]];
		if(!soc || soc == null)	continue;
		amount	+= parseFloat(soc.amount);
		quant	+= parseFloat(soc.quant);
	}
	
//	twoDigitFixed number
	amount = Number(amount);
	amount = amount.toFixed(2);
	if (amount.match(/\./)) {
		amount = amount.replace(/\.?0+$/, '');
	}
	amount = amount.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;
	
	$(".cart_count").find("span").html(quant);
	$(".cart_price").html(amount);
	if(arraySoc.length > 0) $(".cart_currency").html(cart[arraySoc[0]].currencyName);
}

const do_gl_getCartTotal = function(){
	var cart = req_gl_shoppingCart();
	
	var amount 		= 0;
	var quant		= 0;
	var arraySoc = Object.keys(cart);
	
	for(var i in arraySoc){
		let soc	 = cart[arraySoc[i]];
		if(!soc || soc == null)	continue;
		amount	+= parseFloat(soc.amount);
		quant	+= parseFloat(soc.quant);
	}
	
//	twoDigitFixed number
	amount = Number(amount);
	amount = amount.toFixed(2);
	if (amount.match(/\./)) {
		amount = amount.replace(/\.?0+$/, '');
	}
	amount = amount.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;
	
	return {quant, amount, currency : (arraySoc.length ? cart[arraySoc[0]].currencyName : null)};
}

const do_gl_articleRecentView = function(viArticle){ 
//	var shoppingRecentView = req_gl_shoppingRecentView();
//	shoppingRecentView.unshift(viArticle);
//	if (shoppingRecentView.length>20) shoppingRecentView.pop();
//	do_gl_LocalStorage_Save("shoppingRecentView"  , shoppingRecentView);

	var exist     = false;
	var idArticle = viArticle.matId;
	var shoppingRecentView = req_gl_shoppingRecentView();
	if(shoppingRecentView.length > 0){
		for(var i in shoppingRecentView){
			if(idArticle == shoppingRecentView[i].matId){
				exist = true;
			}
		}
		
		if(!exist) shoppingRecentView.unshift(viArticle);
	}else{
		shoppingRecentView.unshift(viArticle);
	}
	
	
	if (shoppingRecentView.length>20) shoppingRecentView.pop();
	do_gl_LocalStorage_Save("shoppingRecentView"  , shoppingRecentView);
}


var req_gl_OrderFromCart = function (manId){
	var carts 		= req_gl_shoppingCart();
	var	cart		= carts[manId];
	var order		= {};
	
	var addr01 		= {};
	if (cart.soc){
		addr01.name		= cart.soc.name01;
		addr01.li01		= cart.soc.info07;
		addr01.phone	= cart.soc.info09;
	}
	

	order.addr01	= addr01;
	order.val09		= cart.amount;
	order.val05		= cart.disc;
	order.tCur		= cart.currencyName;			
	order.suplId	= manId;
	order.manId		= manId;

	order.details = [];
	var details = cart["lst"];
	for(var i in details){
		var line = details[i];
		if (!line.code) line.code ="";
		var det  = { 
				'ord'		: i,
				'code' 		: line.code,
				'name'		: line.name,
				'descr'		: line.avt,
				'quan' 		: line.quant,
				
				'val01'		: line.price01, 
				'val02'		: line.price02,
				'val05'		: line.disc, 
				'val09'		: line.amount,
				
				"unitlab"	: line.unit,
				"unitId"	: line.unitId, 
				"unitRatio"	: line.unitRatio,
				
				"parId" 	: line.matId,
				"parType"	: 20000
				} ;
		order.details .push(det);
	}
	return order;
}


function req_gl_StrTwoDigitFixed (number) {
	if(number != null){
		number = number.toFixed(2);
		return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;

	}else{
		return null;
	}
}

function req_gl_StrNDigitFixed (number, nDigit) {
	if(number != null){
		number = number.toFixed(nDigit);
		return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;

	}else{
		return null;
	}
}