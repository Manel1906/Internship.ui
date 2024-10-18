var fs = require('fs');

//input
//Nhap ten nhung file can merge
const pathFileMerge = [
	"./EmailFolder.js",
	"./EmailMenu.js",
	"./EmailMessageCompose.js",
	"./EmailMessageContent.js",
	"./EmailMessageList.js",
	"./EmailConfig.js"
]

//output
//Nhap ten file moi
const pathFileDest = "./EmailAll.js";

function reqFilePromise(path) {
	return new Promise(function(resolve, reject){
		fs.readFile(path, {encoding: 'utf8'}, function(err, data){
			if(err){
				reject(err);
			} else {
				resolve(data);
			}
		})
	})
}

async function run(){
	let allContent = [];
	
	for(let path of pathFileMerge){
		var file = await reqFilePromise(path);
		allContent.push(file);
	}
	
	return allContent;
}

run().then(function(values){
	let arrDefine 	= [];
	let arrParams 	= [];
	let arrContent 	= [];
	let arrReturn 	= [];
	
	for(let ctrl of values){
		//-----------------get define ------------------------
		let defineBegin = ctrl.indexOf("[");
		let defineEnd 	= ctrl.indexOf("]");
		
		let strDefine		= ctrl.slice(defineBegin + 1, defineEnd);
		if(strDefine && strDefine.length){
			let lstDefine = strDefine.split(",");
			arrDefine = [...arrDefine, ...lstDefine.map(t => t.trim()).filter(Boolean).filter(t => t != '\n\t')];
		}
		ctrl				= ctrl.substring(defineEnd + 1);
		
		//-----------------get params ------------------------
		let paramBegin 		= ctrl.indexOf("(");
		let paramEnd 		= ctrl.indexOf(")");
		
		let strParam		= ctrl.slice(paramBegin + 1, paramEnd);
		if(strParam && strParam.length){
			let lstParams = strParam.split(",");
			arrParams = [...arrParams, ...lstParams.map(t => t.trim()).filter(Boolean).filter(t => t != '\n\t')];
		}
		ctrl				= ctrl.substring(paramEnd + 1);
		
		//-----------------get content controller ------------------------
		let contentBegin 	= ctrl.indexOf("var");
		let contentEnd 		= ctrl.lastIndexOf("return");
		
		let strContent		= ctrl.slice(contentBegin, contentEnd);
		if(strContent && strContent.length){
			arrContent = [...arrContent, strContent];
		}
		ctrl				= ctrl.substring(contentEnd);
		//-----------------get return controller ------------------------
		let returnBegin 	= ctrl.indexOf("return");
		let returntEnd 		= ctrl.indexOf(";");
		
		let returnContent	= ctrl.slice(returnBegin + 6, returntEnd);
		if(returnContent && returnContent.length){
			arrReturn = [...arrReturn, returnContent];
		}
	}
	
	arrDefine = [... new Set(arrDefine)];
	arrParams = [... new Set(arrParams)];
	
	writeNewFile(arrDefine, arrParams, arrContent, arrReturn);
});

function writeNewFile (arrDefine, arrParams, arrContent, arrReturn){
	let ctrlMerge = "define([";
	
	ctrlMerge += arrDefine.join(",\n\t");
	ctrlMerge += "],\n\t function(";
	ctrlMerge += arrParams.join(",\n\t");
	ctrlMerge += "){" + '\n\t';
	ctrlMerge += arrContent.join('\n\t');
	ctrlMerge += '\n\t' + "return {" + arrReturn.join(",") + "};" + '\n\t';
	ctrlMerge += "});";
	
	fs.writeFileSync(pathFileDest, ctrlMerge);
	console.log("Done");
}
