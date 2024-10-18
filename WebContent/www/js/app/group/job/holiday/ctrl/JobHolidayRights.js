/**
 * Right definitions for JOB REPORT
 */

define(['jquery'],
	function($) {

	var JobHolidayRights = function(){
		var pr_OBJ_TYPE						= 	2001000;
		var RIGHT_ADM						= 	100;
		
		this.req_lc_Right = function(rightId){
			var rightCode 	= pr_OBJ_TYPE+rightId;
			
			//Get user list right:
			var listUserRight = App.data.user.rights;
			if(!listUserRight){
				return -1;
			}
			if(listUserRight.includes(RIGHT_ADM) || listUserRight.includes(rightCode)) return rightId
			return -1;
		}
	};

	return JobHolidayRights;
  });