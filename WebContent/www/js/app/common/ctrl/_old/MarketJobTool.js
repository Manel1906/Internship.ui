var req_gl_shoppingCart = function () {
    var obj = req_gl_LocalStorage("shoppingCart");
    if (!obj) return {};
    return obj;
}

const do_gl_cal_distance = function (lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1  = Math.PI * lat1 / 180;
        var radlat2  = Math.PI * lat2 / 180;
        var theta    = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist     = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}


var req_gl_offerWorkRecentView = function () {
    var obj = req_gl_LocalStorage("offerWorkRecentView");
    if (!obj) return [];
    return obj;
}

var req_gl_blogCategories = function () {
    try {
        var time = req_gl_LocalStorage("blogCategoriesTime");
        if (time != null) {
            var now  = (new Date()).getTime();
            time     = parseInt(time, 10);
            var diff = now - time;
            if (diff > 24 * 60 * 60 * 1000) return null;
        }

        var obj = req_gl_LocalStorage("blogCategories");
        if (!obj) return null;

        return obj;
    } catch (e) {
        return null;
    }

}

var req_gl_jobCategories = function () {
    try {
        var time = req_gl_LocalStorage("jobCategoriesTime");
        if (time != null) {
            var now  = (new Date()).getTime();
            time     = parseInt(time, 10);
            var diff = now - time;
            if (diff > 24 * 60 * 60 * 1000) return null;
        }

        var obj = req_gl_LocalStorage("jobCategories");
        if (!obj) return null;

        return obj;
    } catch (e) {
        return null;
    }

}

var req_gl_skillCategories = function () {
    try {
        var time = req_gl_LocalStorage("skillCategoriesTime");
        if (time != null) {
            var now  = (new Date()).getTime();
            time     = parseInt(time, 10);
            var diff = now - time;
            if (diff > 24 * 60 * 60 * 1000) return null;
        }

        var obj = req_gl_LocalStorage("skillCategories");
        if (!obj) return null;

        return obj;
    } catch (e) {
        return null;
    }

}

var req_gl_favoriteCount = function () {
    var obj = req_gl_LocalStorage("FavoriteCount");
    if (!obj) return {};
    return obj;
}

var req_gl_shipper_location = function () {
    var obj = req_gl_LocalStorage("shipper_loc");
    if (!obj) return {};
    return obj;
}

const do_gl_saveFavoriteCount = function (FavoriteCount, user, count) {
    var arrUser = Object.keys(FavoriteCount);
    if (arrUser.length == 0) {
        if (!arrUser[user.id]) FavoriteCount[user.id] = {};
        if (!FavoriteCount[user.id].count) FavoriteCount[user.id].count = count;
    } else {
        for (var i in arrUser) {
            if (arrUser[i] == user.id) {
                FavoriteCount[user.id].count = count;
            }
        }
        if (!FavoriteCount[user.id]) FavoriteCount[user.id] = {};	// trường hợp nếu trong arrUser k có user.id đó
        if (!FavoriteCount[user.id].count) FavoriteCount[user.id].count = count;
    }

    do_gl_LocalStorage_Save(`${App.keys.KEY_STORAGE_CREDENTIAL}/FavoriteCount`, FavoriteCount);
}

var req_gl_favoriteCountUpdate = function (FavoriteCount, user, count) {
    var arrUser = Object.keys(FavoriteCount);
    if (arrUser.length == 0) {
        if (!arrUser[user.id]) FavoriteCount[user.id] = {};
        if (!FavoriteCount[user.id].count) FavoriteCount[user.id].count = count;
    } else {
        for (var i in arrUser) {
            if (arrUser[i] == user.id) {
                FavoriteCount[user.id].count += count;
            }
        }
    }

    do_gl_LocalStorage_Save(`${App.keys.KEY_STORAGE_CREDENTIAL}/FavoriteCount`, FavoriteCount);
}

const do_gl_saveBlogCategories = function (categories) {
    do_gl_LocalStorage_Save("blogCategories", categories);

    var time = (new Date()).getTime();
    do_gl_LocalStorage_Save("blogCategoriesTime", time);

}

const do_gl_saveJobCategories = function (categories) {
    do_gl_LocalStorage_Save("jobCategories", categories);

    var time = (new Date()).getTime();
    do_gl_LocalStorage_Save("jobCategoriesTime", time);
}

const do_gl_saveSkillCategories = function (categories) {
    do_gl_LocalStorage_Save("skillCategories", categories);

    var time = (new Date()).getTime();
    do_gl_LocalStorage_Save("skillCategoriesTime", time);

}

const do_gl_articleRecentView = function (viArticle) {

    var exist               = false;
    var idArticle           = viArticle.id;
    var offerWorkRecentView = req_gl_offerWorkRecentView();
    if (offerWorkRecentView.length > 0) {
        for (var i in offerWorkRecentView) {
            if (idArticle == offerWorkRecentView[i].id) {
                exist = true;
            }
        }

        if (!exist) offerWorkRecentView.unshift(viArticle);
    } else {
        offerWorkRecentView.unshift(viArticle);
    }


    if (offerWorkRecentView.length > 20) offerWorkRecentView.pop();
    do_gl_LocalStorage_Save("offerWorkRecentView", offerWorkRecentView);
}


var req_gl_OrderFromCart = function (manId) {
    var carts = req_gl_shoppingCart();
    var cart  = carts[manId];
    var order = {};

    var addr01   = {};
    addr01.name  = cart.soc.name01;
    addr01.li01  = cart.soc.info07;
    addr01.phone = cart.soc.info09;

    order.addr01 = addr01;
    order.val09  = cart.amount;
    order.val05  = cart.disc;
    order.tCur   = cart.currency;
    order.suplId = manId;
    order.manId  = manId;

    order.details = [];
    var details   = cart["lst"];
    for (var i in details) {
        var line = details[i];
        if (!line.code) line.code = "";
        var det = {
            'ord' : i,
            'code': line.code,
            'name': line.name,

            'quan': line.quant,

            'val01': line.price01,
            'val02': line.price02,
            'val05': line.disc,
            'val09': line.amount,

            "unitlab"  : line.unit,
            "unitId"   : line.unitId,
            "unitRatio": line.unitRatio,

            "parId"  : line.matId,
            "parType": 20000
        };
        order.details.push(det);
    }
    return order;
}


function req_gl_StrTwoDigitFixed(number) {
    if (number != null) {
        number = number.toFixed(2);
        return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');
        ;

    } else {
        return null;
    }
}

function req_gl_StrNDigitFixed(number, nDigit) {
    if (number != null) {
        number = number.toFixed(nDigit);
        return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');
        ;

    } else {
        return null;
    }
}