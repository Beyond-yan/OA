package com.gdssoft.oa.dao.snconfig.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import oracle.jdbc.driver.OracleCallableStatement;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.snconfig.FileSnConfigDao;
import com.gdssoft.oa.model.snconfig.FileSnConfig;


@SuppressWarnings("unchecked")
public class FileSnConfigDaoImpl extends BaseDaoImpl<FileSnConfig> implements FileSnConfigDao{

	public FileSnConfigDaoImpl() {
		super(FileSnConfig.class);
	}
	
	/****
	 * 获取收发文编号
	 * @param defId:流程定义id
	 * @param snConfigId：编号方法
	 * @return
	 */
	public String getFlowSnNo(final Long defId,final Long snConfigId){
		String snNo = "";
		String  aa = defId.toString();
		if(null == defId || null == snConfigId ) return snNo;
		snNo = (String)this.jdbcTemplate.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+schemaName+"get_archive_no(?,?,?)}";// 调用的sql
						CallableStatement cs = con.prepareCall(storedProc);
						cs.setString(1,  String.valueOf(defId)); // 流程定义Id
						cs.setString(2, String.valueOf(snConfigId));// --查询编号办法Id
						System.out.println("我执行啦");
						// 注册输出参数的类型
						cs.registerOutParameter(3,oracle.jdbc.OracleTypes.VARCHAR);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						cs.execute();
						String resultValue = (String) cs.getObject(3);				
						return resultValue;
					}
				});
		return snNo;
	}
	
	/****
	 * 获取跨年收发文编号
	 * @param defId:流程定义id
	 * @param snConfigId：编号方法
	 * @return
	 */
	public String getFlowHistorySnNo(final Long snConfigId,final String snYear){
		String snNo = "";
		if( null == snConfigId  || StringUtils.isEmpty(snYear)) return snNo;
		snNo = (String)this.jdbcTemplate.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+schemaName+"get_archive_no_history(?,?,?)}";// 调用的sql
						CallableStatement cs = con.prepareCall(storedProc);
						cs.setString(1,  String.valueOf(snConfigId)); // 流程定义Id
						cs.setString(2, snYear);// --查询编号办法Id
						// 注册输出参数的类型
						cs.registerOutParameter(3,oracle.jdbc.OracleTypes.VARCHAR);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						cs.execute();
						String resultValue = (String) cs.getObject(3);				
						return resultValue;
					}
				});
		return snNo;
	}
	
	public List<FileSnConfig> getFileSnExcIds(String ids,String snName){
//		String hql = "from FileSnConfig where 1=1";
//		List<String> paramList = new ArrayList();
//		
//		if(ids!=null && !"".equals(ids)){
//			hql+="and id not in(?)";
//			paramList.add(ids);
//		}
//		if(snName!=null && !"".equals(snName)){
//			hql+="and snName like ?";
//			paramList.add(snName);
//		}
//		
//		return findByHql(hql, paramList.toArray());
		String conditions="";
		if(ids!=null && !"".equals(ids)){
			conditions+="and a.id not in("+ids+")";
		}
		if(snName!=null && !"".equals(snName)){
			conditions+="and a.SN_NAME like :snName";
		}
		String sql="select * from CQ_FILE_SN_CONFIG a where 1=1 "+conditions;
		Query q = getSession().createSQLQuery(sql).addEntity("a", FileSnConfig.class);
		if(snName!=null && !"".equals(snName))
			q.setParameter("snName", "%"+snName+"%");
		return q.list();
	}

}