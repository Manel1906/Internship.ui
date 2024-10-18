function req_gl_Translation_Obj(obj, langOpt){
	if (langOpt){
		var typ02 = obj.typ02;
		if (typ02!= langOpt){
			var objTransl = $.extend(true, {}, obj);
			objTransl.parId		= obj.id;
			objTransl.lang 		= langOpt;
			//--khac voi ben manager, khong xoa bat ky gi trong object, van su dung lai files, transl...
			
			if (obj.transl){
				for (var t in obj.transl) {
					var o = obj.transl[t];
					if (o.lang == langOpt){
						var oContent = o.cnt;
						try{
							oContent = JSON.parse(oContent);
						}catch(e) {}
						
						req_gl_sort_attr_typArr(objTransl	, 'id');
						req_gl_sort_attr_typArr(oContent	, 'id');
						
						objTransl 			= $.extend(true, objTransl, oContent);	
						objTransl.translId	= o.id;
						objTransl.id		= obj.id;
						objTransl.parId		= obj.id;
						objTransl.lang 		= langOpt;
						break;
					}
				}
			}
			return objTransl;
		}else return obj;
	}else return obj;
}

function req_gl_sort_attr_typArr (obj, byAttrName){
	if (!obj) return;
	
	for(var key in obj){
		if (obj[key] === Array ){
			do_gl_sortByKeyIntegerAsc(obj[key], byAttrName);
		}	
	}
}

function req_gl_Translation_ObjLst(objLst, langOpt){
	var lst = [];
	for (var o in objLst){
		var oN = req_gl_Translation_Obj(objLst[o], langOpt);
		lst.push(oN);
	}
	return lst;
}

function do_gl_Del_ObjAttr (obj, keyName, deep){
	for(var key in obj){
		if (key==keyName){
			delete obj[key];
			continue;
		}
		if(!(obj[key])) {
			delete obj[key]
		}else if (obj[key] === Array ){
			if (obj[key].length==0)
				delete obj[key]
		}else
		if(deep && typeof(obj[key]) === 'object'){
			do_gl_Del_ObjAttr(obj[key], keyName, deep)
		} 		
	}
}

function do_gl_Del_ObjAttrLst (obj, attrFilter, deep){
	if (attrFilter){
		if (attrFilter.constructor === Array){
			for (var attr in attrFilter) do_gl_Del_ObjAttr(obj, attrFilter[attr], deep);
		}else
			do_gl_Del_ObjAttr(obj, attrFilter, deep)
	}
}