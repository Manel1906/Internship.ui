// list variables of eval
var pr_name_eval  	= ['eval01', 'eval02', 'eval03', 'eval04', 'eval05'];

// set default value for eval 
const do_gl_bar_rating_init = function(defaultValue) {
	if(App.data.curEval == null) {
		App.data.curEval = {};
	}
	
	for (var i = 0; i < pr_name_eval.length; i++) {
		App.data.curEval[pr_name_eval[i]] = defaultValue;
	}
}

const do_gl_bar_rating_init_one = function(name, defaultValue) {
	if(App.data.curEval == null) {
		App.data.curEval = {};
	}
	
	App.data.curEval[name] = defaultValue;
}


// save value of element html to App.data.curEval
const do_gl_bar_rating_save_eval = function(div, name) {
	if(App.data.curEval == null) {
		App.data.curEval = {};
	}
	
	App.data.curEval[name] = $(div).val();
}

// show bar_rating of one element 
const do_gl_bar_rating_show = function(idDiv, div_err, theme, initialRating, readonly) {
	
	if (initialRating == undefined || initialRating == 0 || initialRating == NaN) {	
		do_gl_bar_rating_show_err(div_err);
		do_gl_bar_rating_hide_err(idDiv);
		
	} else {
		$(idDiv).barrating({
	        theme: theme == null? 'fontawesome-stars':theme,
	        initialRating: initialRating == null? 3:initialRating,
	        readonly: readonly == null? false:readonly
	    });
	}
}

// show bar_rating of all elements( list id_rating )
const do_gl_bar_rating_show_all = function(div, div_err, theme, initialRating, readonly) {
	if ( div == null || div == undefined || typeof div == undefined || div == "") {
		return 0;
	}
	
	for (var i = 0 ; i < div.length; i++) {
		do_gl_bar_rating_show(div[i], div_err, theme, initialRating, readonly);
	}
}

// get value_bar_rating of all elements with list id_rating
var req_gl_bar_rating_value = function(div_bar_rating, defaultValue) {
	if (div_bar_rating.length >  pr_name_eval.length ) {
		return 0;
	}
	
	
	for (var i = 0; i < div_bar_rating.length; i++) {		
		get_value_rating(pr_name_eval[i], div_bar_rating[i], defaultValue);
	}
}

//get value_bar_rating of one element ( default and onchange event)
var get_value_rating = function( name, idDiv, defaultValue) {
	
	if (App.data.curEval == null) {
		App.data.curEval = {}; 
	}
	App.data.curEval[name]  = defaultValue;
	
	
	$(idDiv).on('change', function () {
		var value = parseInt($(idDiv).val());
		var nameEval = "eval0" + idDiv.substring(idDiv.length - 1, idDiv.length);
		
		for (var i = 0; i < pr_name_eval.length; i++) {
			if (pr_name_eval[i] == nameEval) {
				App.data.curEval[pr_name_eval[i]] = value;
			}
		}

	});
	
}

var req_gl_bar_rating_value_one_on_change =  function (idDiv, defaultValue) {
	
	value = defaultValue;
	
	$(idDiv).on('change', function () {
		value = parseInt($(idDiv).val());
	});
	
	return value;
}


const do_gl_bar_rating_show_err = function (div) {
	$(div).show();
}

const do_gl_bar_rating_hide_err = function (div) {
	$(div).hide();
}