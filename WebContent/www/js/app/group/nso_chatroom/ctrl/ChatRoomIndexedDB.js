define(['jquery'], function($) {
	const ChatRoomIndexedDB    = function () {
		const self                  = this;

		const dbName                = "indDBChatRoom";
		const dbVers				= 1;
		
		const collect_Msg           = "messages";
		const collect_Mem           = "members";

		let pr_db                   = null

		this.do_lc_init = function (){
			const req   = window.indexedDB.open(dbName, dbVers);

			req.onsuccess = e => {
				pr_db = req.result;
			};

			req.onupgradeneeded = e => {
				pr_db = e.target.result;
				try{
					pr_db.createObjectStore(collect_Msg);
				}catch(e){}
				try{
					pr_db.createObjectStore(collect_Mem);
				}catch(e){}
			};
		}

		this.do_lc_req_collection = function (collectName, key, callback) {
			if(!collectName || !key) return;
			if(!pr_db) return;
			
			let prom = {};
			const objStore 	= pr_db.transaction(collectName).objectStore(collectName);
			const res 		= objStore.get(key);

			res.onsuccess = function (e){
				if (callback){
					callback(e.target.result);
				}
			}
			
			res.onerror = function(e) {
                console.log("Error Getting: ", e);
			};
		}
		
		this.do_lc_update_collection = function (collectName, key, data){
			if(!collectName || !key || !data) return;
			if(!pr_db) return;
			
			const objStore = pr_db.transaction(collectName, "readwrite").objectStore(collectName)

			objStore.put(data, key);
		}

		this.do_lc_update_record  = function (collectName, key, rec){
		    if (!collectName || !key || !rec || !rec.id) return;
		    if(!pr_db) return;
		    
		    self.do_lc_req_collection(collectName, key, function(response){
		        if (!response) response = {};
		        if (!response.data) response.data = [];
		
		        if (response.data.length === 0 || response.data[response.data.length - 1].id < rec.id) {
		            response.data.push(rec);
		        } else {
		            
		            let insertIndex = response.data.findIndex(item => item.id > rec.id);
		
		            if (insertIndex === -1) {
		                response.data.push(rec);
		            } else {
		                response.data.splice(insertIndex, 0, rec);
		            }
		        }
		
		        self.do_lc_update_collection(collectName, key, response);
		    });
		}
		
		this.do_lc_update_recordMulti  = function (collectName, key, rec){
			if(!collectName || !key || !rec) return;
			if(!pr_db) return;
			
			self.do_lc_req_collection(collectName, key, function(response){
				if(!response) response={};
				if(!response.data) response.data = [];
				
				let existingData = new Set(response.data.map(item => JSON.stringify(item)));
        		let newData = rec.filter(item => !existingData.has(JSON.stringify(item)));
				response.data = [...response.data, ...newData];
				
				self.do_lc_update_collection (collectName, key, response);
			});
		}

		this.do_lc_delete_collection = function (collectName, key) {
			if(!collectName || !key ) return;
			if(!pr_db) return;
			
			const objStore = pr_db.transaction(collectName,"readwrite").objectStore(collectName);

			objStore.delete(key);
		}
		
		this.do_lc_delete_record = function (collectName, key, recId) {
			if(!collectName || !key || !recId) return;
			if(!pr_db) return;
			
			self.do_lc_req_collection(collectName, key, function(response){
				if(!response) return;
				if(!response.data) response.data = [];
				for (var i in response.data){
					var obj = response.data[i];
					if (obj.id == recId){
						response.data.splice(i, 1); 
						break;
					}
				}
				self.do_lc_update_collection (collectName, key, response);
			});
		}

		this.do_lc_clear_collection = function (collectName) {
			if(App.data.user) return;

			if(!collectName ) return;
			if(!pr_db) return;
			
			pr_db.transaction(collectName).objectStore(collectName).clear();
		}
	};

	return ChatRoomIndexedDB;
});
