package com.gdssoft.core;

import org.apache.commons.lang.StringUtils;
import org.hibernate.EmptyInterceptor;

import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.model.system.AppUser;

public class QueryResInterceptor extends EmptyInterceptor  {
    public String onPrepareStatement(String sql) {  
  
    	if(sql.toLowerCase().indexOf("oa_common.") !=-1)
    		return sql;
    	if(sql.toLowerCase().indexOf("oa.") !=-1)
    		return sql;
     String schemaName ="";
  	 if(null == ContextUtil.getCurrentUser()){
  		 if(AppUtil.interfaceSchema == ""){
  			 return sql;
  		 }else {
  			 schemaName=AppUtil.interfaceSchema;
    	}
  	 }else{
  		AppUser user = ContextUtil.getCurrentUser();
    	schemaName = user.getOwnerSchema().toLowerCase();
  	 } 	
    	  //根据用户的时间替换sql中的表名  
    	if(sql.indexOf("hibernate_sequence.nextval")!=-1){
    		sql = sql.replace("hibernate_sequence.nextval", Constants.PUBLIC_SCHEMA_CODE + ".hibernate_sequence.nextval");
    		return sql;
    	}
    	
    	if(sql.indexOf(schemaName + ".") != -1 || sql.indexOf(schemaName.toUpperCase() + ".") != -1)
    		return sql;
    	
		// 去除特殊子查询中的sql
		sql = sql.replaceAll("(?i)from", "from")
				.replaceAll("(?i)delete", "delete")
				.replaceAll("(?i)update", "update")
				.replaceAll("(?i)select", "select")
				.replaceAll("(?i)insert", "insert")
				.replaceAll("(?i)into", "into")
				.replaceAll("(?i)join", "join");
		sql = sql.replace(" from (", " from(");
		sql = sql.replace(" from(", "sql-repace-type-1");
		sql = sql.replace(" join (", " join(");
		sql = sql.replace(" join(", "sql-repace-type-2");
		sql = sql.replace("delete from ", "sql-repace-type-3");
		
		//执行替换
		sql = replaceSql(sql, " from ", schemaName);
		sql = replaceSql(sql, " join ", schemaName);
		if(sql.indexOf("update " + schemaName +".") == -1)
			sql = replaceSql(sql, "update ", schemaName);
		if(sql.indexOf("insert into " + schemaName +".") == -1)
			sql = replaceSql(sql, "insert into ", schemaName);
		if(sql.indexOf("delete " + schemaName +".") == -1)
			sql = replaceSql(sql, "delete ", schemaName);
		
		//解决子查询中的替换
		if(sql.indexOf("sql-repace-type-1")!=-1) 
			sql = sql.replace("sql-repace-type-1", " from(");
		if(sql.indexOf("sql-repace-type-2")!=-1)
			sql = sql.replace("sql-repace-type-2", " join (");
		if(sql.indexOf("sql-repace-type-3")!=-1 ){
			if(sql.indexOf("sql-repace-type-3" + schemaName +".") == -1)
				sql = sql.replace("sql-repace-type-3", "delete from "+ schemaName +".");
			else
				sql = sql.replace("sql-repace-type-3", "delete from ");
		}
		sql = sql.replaceAll("(?i)jbpm4", "jbpm4");
		if(sql.indexOf(", jbpm4")!=-1)
			sql = sql.replace(", jbpm4", "," + schemaName + "." + "jbpm4");
		System.out.println("------>"+sql);
        return sql;  
    }  
    private String replaceSql(String sourceSql,String replaceStr,String schemaName){
    	if(!StringUtils.isBlank(sourceSql))
    		sourceSql = sourceSql.replace(replaceStr, replaceStr + schemaName +".");
    	return sourceSql;
    }
    
//    public static void main(String[] arges){
//    	String  sql ="select from ( From ( FRom (";
//    	sql = sql.replaceAll("(?i)from (", "from");
//    	System.out.println(sql);
//    }
}
