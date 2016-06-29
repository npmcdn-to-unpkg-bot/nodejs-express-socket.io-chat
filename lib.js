exports.keys = function(obj){
	var keys = [];  
	for(var pro in obj){  
		keys.push(pro);  
	}  
	var keys = JSON.stringify(keys);
	var keys = keys.replace("[", "");
	var keys = keys.replace("]", "");
	var keys = keys.replace(/"/g, "");
	return keys;
}

exports.values = function(obj){
	var values = [];  
	for(var pro in obj){  
		values.push(obj[pro]);  
	};
	var values = JSON.stringify(values);
	var values = values.replace("[", "");
	var values = values.replace("]", "");
	var values = values.replace(/"/g, "'");
	return values;
}