/**
 * Right definitions for JOB OFF
 */

define(['jquery'],
	function($) {

	var PrjEmailGroupRights = function(){
		
		this.req_lc_Right = function(rightId){
			var listUserRight = App.data.user.rights;
			if(!listUserRight){
				return -1;
			}
			
			if(listUserRight.includes(rightId)) return rightId;
			return -1;
		}
	};

	return PrjEmailGroupRights;
  });