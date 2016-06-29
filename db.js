var deasync   = require('deasync');
var lib       = require('./lib');
var mysql     = require('mysql');
var mysql_db  = mysql.createConnection({
	host      : 'localhost',
	user      : 'root',
	password  : 'root',
	database  : 'nodejs'
});

/** 
* exports.add  
* 添加数据 
* 
* @param form 表名
* @param data object 数据
*/  

exports.add = function(form,data){

	var data, isReturn = false;

	var keys   = lib.keys(data);
	var values = lib.values(data);

	// INSERT INTO house_building (ProjectID,BuildingName) VALUES (3,'this')

	mysql_db.query("INSERT INTO "+form+ "("+keys+") VALUES ("+values+")", function(err,rows,fields){
		isReturn = true;

		data = err ? err : rows.insertId.toString();
	});

	while(!isReturn){
	    deasync.runLoopOnce();
	};
	
	return data;

};

/** 
* exports.delete  
* 删除数据 
* 
* @param form  string 表名
* @param where string 条件
*/  

exports.delete = function(form,where){

	// DELETE FROM table1 WHERE

	var data, isReturn = false;

	mysql_db.query("DELETE FROM "+form+" WHERE "+where, function(err,rows,fields){
		isReturn = true;

		data = err ? err : "done";
	});

	while(!isReturn){
	    deasync.runLoopOnce();
	};

	return data;

};

/** 
* exports.update  
* 修改数据 
* 
* @param form  string 表名
* @param where string 条件
* @param set_  object 数据
*/ 

exports.update = function(form,where,set_){

	// UPDATE house_building SET BuildingName = 'she', ProjectID = 2 WHERE ProjectID = 3

	var data, isReturn = false;

	set = "";

	for(var i in set_){
		set+= i+ " = '"+set_[i]+"' ,";
	};

	set = set.substring(0,set.length-1);

	mysql_db.query("UPDATE "+form+" SET "+set+" WHERE "+where, function(err,rows,fields){
		isReturn = true;

		data = err ? err : rows;
	});

	while(!isReturn){
	    deasync.runLoopOnce();
	};

	return data;

};

/** 
* exports.select  
* 查询数据 
* 
* @param form  string 表名
* @param where string 条件
* @param order string 排序
* @param field string 字段
* @param limit string 条目
*/ 

exports.select = function(form,where,order,field,limit){

	// "SELECT id,BuildingName FROM house_building WHERE id > 0 ORDER BY CreatedTime DESC LIMIT 0,20";

	var data, isReturn = false;

	var where_sql = "WHERE "+where;
	var order_sql = "ORDER BY "+order;
	var limit_sql = "LIMIT "+limit;

	if(field == "" || field == undefined){
		var field = "*";
	}else{
		var field = field;
	};

	if(where == "" || where == undefined){
		var where = "";
	}else{
		var where = where_sql;
	};

	if(order == "" || order == undefined){
		var order = "";
	}else{
		var order = order_sql;
	};

	if(limit == "" || limit == undefined){
		var limit = "";
	}else{
		var limit = limit_sql;
	};

	mysql_db.query("SELECT "+field+" FROM "+form+" "+where+" "+order+" "+limit, function(err,rows,fields){
		isReturn = true;
		data = err ? err : rows;
	});
	while(!isReturn){
	    deasync.runLoopOnce();
	};
	return data;

};