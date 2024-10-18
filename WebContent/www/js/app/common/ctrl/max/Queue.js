//const FUNCT_SCOPE	= AppCommon['const'].	FUNCT_SCOPE;
//const FUNCT_NAME	= AppCommon['const'].	FUNCT_NAME;
//const FUNCT_PARAM	= AppCommon['const'].	FUNCT_PARAM;

const do_gl_queue=function(e,t,u,n,c){queue(e,t,u,n,c)},do_gl_execute=function(e,t){execute(e,t)},queue=function(o,i,l,f,_){null==_&&(_=50),function e(){if(0<o.length){var t=o.shift(),u=t[FUNCT_NAME];if(!u)return void e();var n=t[FUNCT_SCOPE],c=t[FUNCT_PARAM];setTimeout(function(){0==f.err_code||null==f.err_code?(u.apply(n,[f].concat(c)),e()):i&&execute(i)},_)}else l&&execute(l)}()},execute=function(e){try{if("function"==typeof e)e();else{var t=e[FUNCT_SCOPE],u=e[FUNCT_NAME],n=e[FUNCT_PARAM];u.apply(t,n)}}catch(e){console.log("Cannot execute Funct")}};