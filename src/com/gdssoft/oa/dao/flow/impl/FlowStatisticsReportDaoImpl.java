package com.gdssoft.oa.dao.flow.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import oracle.jdbc.OracleTypes;

import org.apache.poi.hssf.record.formula.functions.T;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import java.io.Serializable;
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.hql.ast.QueryTranslatorImpl;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlTypeValue;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.gdssoft.core.command.CriteriaCommand;
import com.gdssoft.core.command.FieldCommandImpl;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.command.SortCommandImpl;
import com.gdssoft.core.dao.GenericDao;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.flow.FlowStatisticsReportDao;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.reports.DepartmentReport;
import com.gdssoft.oa.model.reports.ReceiveReport;
import com.gdssoft.oa.model.reports.SendReport;

public class FlowStatisticsReportDaoImpl extends BaseDaoImpl<Object> implements FlowStatisticsReportDao{
	public FlowStatisticsReportDaoImpl() {
		super(Object.class);
	}
	public FlowStatisticsReportDaoImpl(Class persistType) {
		super(persistType);
		// TODO Auto-generated constructor stub
	}

	@SuppressWarnings("unchecked")
	public List<Object> getAll(final Date beginDate,final Date endDate){
		return (List)getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
				String schemaName= "";
				if(null != ContextUtil.getCurrentUser()){
		    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
		    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
				}
				Query query = session.createSQLQuery("{call "+ schemaName +"QueryReportByCompany_test(?,?)}");   
				query.setParameter(0, "2011/12/01");
				query.setParameter(1, "2011/12/03");
				System.out.println("dd:"+query.list());
				return (List<Object>)query.list();
			}
		});
	}
	

	public List<ComPanyReport> queryReportByCompany(final String beginDate,final String endDate) { 
	  List<ComPanyReport> tempList = new ArrayList<ComPanyReport>();
	  List resultList = (List) jdbcTemplate.execute( 
	     new CallableStatementCreator() { 
	        public CallableStatement createCallableStatement(Connection con) throws SQLException {
	        	String schemaName= "";
				if(null != ContextUtil.getCurrentUser()){
		    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
		    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
				}
	           String storedProc = "{call "+ schemaName +"QueryReportByCompany (?,?,?)}";// 调用的sql 
	           CallableStatement cs = con.prepareCall(storedProc); 
	           cs.setString(1, beginDate);// 设置输入参数的值 
	           cs.setString(2, endDate);
	           //注册输出参数的类型 
	           cs.registerOutParameter(3, oracle.jdbc.OracleTypes.CURSOR);
	           return cs; 
	        } 
	     }, new CallableStatementCallback() { 
	        @SuppressWarnings("unchecked")
			public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
	           List resultsMap = new ArrayList(); 
	         
	           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
	           cs.executeQuery();
	           ResultSet rs = (ResultSet)cs.getObject(3);
	           
	           
	           while (rs.next()) {// 转换每行的返回值到Map中 
	              Map rowMap = new HashMap(); 
	              rowMap.put("department", rs.getString(1)); 
	              rowMap.put("filetype", rs.getString(2)); 
	              rowMap.put("finish", rs.getString(3)); 
	              rowMap.put("NotFinish1", rs.getString(4)); 
	              rowMap.put("NotFinish2", rs.getString(5)); 
	              rowMap.put("NotFinish3", rs.getString(6)); 
	              rowMap.put("Total", rs.getString(7)); 
	              rowMap.put("RecFinish", rs.getString(8)); 
	              rowMap.put("RecNotFinish1", rs.getString(9)); 
	              rowMap.put("RecNotFinish2", rs.getString(10)); 
	              rowMap.put("RecNotFinish3", rs.getString(11)); 
	              rowMap.put("RecTotal", rs.getString(12)); 
	              resultsMap.add(rowMap); 
	           } 
	           rs.close(); 
	           return resultsMap; 
	        } 
	  }); 
	  ComPanyReport cpr = null;
	  for (int i = 0; i < resultList.size(); i++) { 
	     Map rowMap = (Map) resultList.get(i); 
	     cpr = new ComPanyReport();
	     String department = rowMap.get("department").toString(); 
	     String filetype = rowMap.get("filetype").toString(); 
	     String finish = rowMap.get("finish").toString(); 
	     String notFinish1 = rowMap.get("NotFinish1").toString(); 
	     String notFinish2 = rowMap.get("NotFinish2").toString(); 
	     String notFinish3 = rowMap.get("NotFinish3").toString();
	     String total = rowMap.get("Total").toString(); 
	     String recFinish = rowMap.get("RecFinish").toString(); 
	     String recNotFinish1 = rowMap.get("RecNotFinish1").toString(); 
	     String recNotFinish2 = rowMap.get("RecNotFinish2").toString(); 
	     String recNotFinish3 = rowMap.get("RecNotFinish3").toString(); 
	     String recTotal = rowMap.get("RecTotal").toString(); 
	     cpr.setDepName(department);
	     cpr.setFileType(filetype);
	     cpr.setFinish(finish);
	     cpr.setNotFinish1(notFinish1);
	     cpr.setNotFinsih2(notFinish2);
	     cpr.setNotFinsih3(notFinish3);
	     cpr.setTotal(total);
	     cpr.setRecFinish(recFinish);
	     cpr.setRecNotFinish1(recNotFinish1);
	     cpr.setRecNotFinish2(recNotFinish2);
	     cpr.setRecNotFinish3(recNotFinish3);
	     cpr.setRecTotal(recTotal);
	     System.out.println("department=" + department + ";filetype=" + recTotal); 
	     tempList.add(cpr);
	  } 
	  return tempList;
	}
	@Override
	public List<DepartmentReport> queryReportByDepartment(final String depName, final String beginDate, final String endDate) { 
		  List<DepartmentReport> tempList = new ArrayList<DepartmentReport>();
		  List resultList = (List) jdbcTemplate.execute( 
		     new CallableStatementCreator() { 
		        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
		        	String schemaName= "";
					if(null != ContextUtil.getCurrentUser()){
			    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
					}
		           String storedProc = "{call "+schemaName+"QueryReportByDepartment(?,?,?,?)}";// 调用的sql 
		           CallableStatement cs = con.prepareCall(storedProc); 
		           cs.setString(1, depName);
		           cs.setString(2, beginDate);// 设置输入参数的值 
		           cs.setString(3, endDate);
		          // 注册输出参数的类型 
		          cs.registerOutParameter(4, oracle.jdbc.OracleTypes.CURSOR);
		           return cs; 
		        } 
		     }, new CallableStatementCallback() { 
		        @SuppressWarnings("unchecked")
				public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
		           List resultsMap = new ArrayList(); 
		         
		           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
		           cs.executeQuery();
		           ResultSet rs = (ResultSet)cs.getObject(4);
		           
		           while (rs.next()) {// 转换每行的返回值到Map中 
		              Map rowMap = new HashMap(); 
		              rowMap.put("department", rs.getString(1)); 
		              rowMap.put("fileName", rs.getString(2)); 
		              rowMap.put("filetype", rs.getString(3)); 
		              rowMap.put("finish", rs.getString(4)); 
		              rowMap.put("NotFinish1", rs.getString(5)); 
		              rowMap.put("NotFinish2", rs.getString(6)); 
		              rowMap.put("Total", rs.getString(7)); 
		              rowMap.put("RecFinish", rs.getString(8)); 
		              rowMap.put("RecNotFinish1", rs.getString(9)); 
		              rowMap.put("RecNotFinish2", rs.getString(10)); 
		              rowMap.put("RecTotal", rs.getString(11)); 
		              resultsMap.add(rowMap); 
		           } 
		           rs.close(); 
		           return resultsMap; 
		        } 
		  }); 
		  DepartmentReport cpr = null;
		  for (int i = 0; i < resultList.size(); i++) { 
		     Map rowMap = (Map) resultList.get(i); 
		     cpr = new DepartmentReport();
		     String department = rowMap.get("department").toString(); 
		     String fileName = rowMap.get("fileName").toString(); 
		     String filetype = rowMap.get("filetype").toString(); 
		     String finish = rowMap.get("finish").toString(); 
		     String notFinish1 = rowMap.get("NotFinish1").toString(); 
		     String notFinish2 = rowMap.get("NotFinish2").toString(); 
		     String total = rowMap.get("Total").toString(); 
		     String recFinish = rowMap.get("RecFinish").toString(); 
		     String recNotFinish1 = rowMap.get("RecNotFinish1").toString(); 
		     String recNotFinish2 = rowMap.get("RecNotFinish2").toString(); 
		     String recTotal = rowMap.get("RecTotal").toString(); 
		     cpr.setDepName(department);
		     cpr.setFileName(fileName);
		     cpr.setFileType(filetype);
		     cpr.setFinish(finish);
		     cpr.setNotFinish1(notFinish1);
		     cpr.setNotFinsih2(notFinish2);
		     cpr.setTotal(total);
		     cpr.setRecFinish(recFinish);
		     cpr.setRecNotFinish1(recNotFinish1);
		     cpr.setRecNotFinish2(recNotFinish2);
		     cpr.setRecTotal(recTotal);
		     System.out.println("department=" + department + ";fileName=" + fileName); 
		     tempList.add(cpr);
		  } 
		  return tempList;
		}
	@Override
	public List<ReceiveReport> queryReportByReceive(final String depName, final String flowName, final String flowStatus, final String beginDate,
			final String endDate,final String overDateFlag) { 
		  List<ReceiveReport> tempList = new ArrayList<ReceiveReport>();
		  List resultList = (List) jdbcTemplate.execute( 
		     new CallableStatementCreator() { 
		        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
		        	String schemaName= "";
					if(null != ContextUtil.getCurrentUser()){
			    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
					}
		           String storedProc = "{call "+schemaName+"QueryReportByReceive(?,?,?,?,?,?,?)}";// 调用的sql 
		           CallableStatement cs = con.prepareCall(storedProc); 
		           cs.setString(1, depName);
		           cs.setString(2, flowName);
		           cs.setString(3, flowStatus);
		           cs.setString(4, beginDate);// 设置输入参数的值 
		           cs.setString(5, endDate);
		           cs.setString(6, overDateFlag);
		          // 注册输出参数的类型 
		          cs.registerOutParameter(7, oracle.jdbc.OracleTypes.CURSOR);
		           return cs; 
		        } 
		     }, new CallableStatementCallback() { 
		        @SuppressWarnings("unchecked")
				public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
		           List resultsMap = new ArrayList(); 
		         
		           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
		           cs.executeQuery();
		           ResultSet rs = (ResultSet)cs.getObject(7);
		           
		           while (rs.next()) {// 转换每行的返回值到Map中 
		              Map rowMap = new HashMap(); 
		              rowMap.put("recDep", rs.getString(1)); 
		              rowMap.put("name", rs.getString(2)); 
		              rowMap.put("subject", rs.getString(3)); 
		              rowMap.put("sendDep", rs.getString(4)); 
		              rowMap.put("sender", rs.getString(5)); 
		              rowMap.put("sendTime", rs.getString(6)); 
		              rowMap.put("recTime", rs.getString(7)); 
		              rowMap.put("assigner", rs.getString(8)); 
		              rowMap.put("status", rs.getString(9)); 
		              rowMap.put("finishTime", rs.getString(10)); 
		              rowMap.put("dealTime", rs.getString(11)); 
		              resultsMap.add(rowMap); 
		           } 
		           rs.close(); 
		           return resultsMap; 
		        } 
		  }); 
		  ReceiveReport cpr = null;
		  for (int i = 0; i < resultList.size(); i++) { 
			 cpr = new ReceiveReport();
		     Map rowMap = (Map) resultList.get(i); 
		     String recDep = rowMap.get("recDep").toString(); 
		     String name = rowMap.get("name").toString(); 
		     String subject = rowMap.get("subject").toString(); 
		     String sendDep = rowMap.get("sendDep").toString(); 
		     String sender = rowMap.get("sender").toString(); 
		     String sendTime = rowMap.get("sendTime").toString(); 
		     String recTime = rowMap.get("recTime").toString(); 
		     String assigner = rowMap.get("assigner").toString(); 
		     String status = rowMap.get("status").toString(); 
		     String finishTime = rowMap.get("finishTime").toString(); 
		     String dealTime = rowMap.get("dealTime").toString(); 
		     cpr.setRecDep(recDep);
		     cpr.setName(name);
		     cpr.setSubject(subject);
		     cpr.setSendDep(sendDep);
		     cpr.setSender(sender);
		     cpr.setSendTime(sendTime);
		     cpr.setRecTime(recTime);
		     cpr.setAssigner(assigner);
		     cpr.setStatus(status);
		     cpr.setFinishTime(finishTime);
		     cpr.setDealTime(dealTime);
		    // logger.info("recDep=" + recDep + ";assigner=" + assigner); 
		     tempList.add(cpr);
		  } 
		  return tempList;
		}
	@Override
	public List<SendReport> queryReportBySend(final String depName, final String flowName, final String flowStatus, final String beginDate,
			final String endDate, final String overDateFlag) { 
		  List<SendReport> tempList = new ArrayList<SendReport>();
		  List resultList = (List) jdbcTemplate.execute( 
		     new CallableStatementCreator() { 
		        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
		        	String schemaName= "";
					if(null != ContextUtil.getCurrentUser()){
			    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
					}
		           String storedProc = "{call "+schemaName+"QueryReportBySend(?,?,?,?,?,?,?)}";// 调用的sql 
		           CallableStatement cs = con.prepareCall(storedProc); 
		           cs.setString(1, depName);
		           cs.setString(2, flowName);
		           cs.setString(3, flowStatus);
		           cs.setString(4, beginDate);// 设置输入参数的值 
		           cs.setString(5, endDate);
		           cs.setString(6, overDateFlag);
		          // 注册输出参数的类型 
		          cs.registerOutParameter(7, oracle.jdbc.OracleTypes.CURSOR);
		           return cs; 
		        } 
		     }, new CallableStatementCallback() { 
		        @SuppressWarnings("unchecked")
				public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
		           List resultsMap = new ArrayList(); 
		         
		           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
		           cs.executeQuery();
		           ResultSet rs = (ResultSet)cs.getObject(7);
		           
		           while (rs.next()) {// 转换每行的返回值到Map中 
		              Map rowMap = new HashMap(); 
		              rowMap.put("sendDep", rs.getString(1)); 
		              rowMap.put("name", rs.getString(2)); 
		              rowMap.put("subject", rs.getString(3)); 
		              rowMap.put("sender", rs.getString(4)); 
		              rowMap.put("sendTime", rs.getString(5)); 
		              rowMap.put("assigner", rs.getString(6)); 
		              rowMap.put("sendStatus", rs.getString(7)); 
		              rowMap.put("sendFinishTime", rs.getString(8)); 
		              rowMap.put("sendDealTime", rs.getString(9)); 
		              rowMap.put("receiveStatus", rs.getString(10)); 
		              resultsMap.add(rowMap); 
		           } 
		           rs.close(); 
		           return resultsMap; 
		        } 
		  }); 
		  SendReport cpr = null;
		  for (int i = 0; i < resultList.size(); i++) { 
			 cpr = new SendReport();
		     Map rowMap = (Map) resultList.get(i); 
		     String sendDep = rowMap.get("sendDep").toString(); 
		     String name = rowMap.get("name").toString(); 
		     String subject = rowMap.get("subject").toString(); 
		     String sender = rowMap.get("sender").toString(); 
		     String sendTime = rowMap.get("sendTime").toString(); 
		     String assigner = rowMap.get("assigner").toString(); 
		     String sendStatus = rowMap.get("sendStatus").toString(); 
		     String sendFinishTime = rowMap.get("sendFinishTime").toString(); 
		     String sendDealTime = rowMap.get("sendDealTime").toString(); 
		     String receiveStatus = rowMap.get("receiveStatus").toString(); 
		     cpr.setSendDep(sendDep);
		     cpr.setName(name);
		     cpr.setSubject(subject);
		     cpr.setSender(sender);
		     cpr.setSendTime(sendTime);
		     cpr.setAssigner(assigner);
		     cpr.setSendStatus(sendStatus);
		     cpr.setSendFinishTime(sendFinishTime);
		     cpr.setSendDealTime(sendDealTime);
		     cpr.setReceiveStatus(receiveStatus);
		    // logger.info("recDep=" + recDep + ";assigner=" + assigner); 
		     tempList.add(cpr);
		  } 
		  return tempList;
		}
	
	public List<ComPanyReport> queryReportByCompanyStep(final String beginDate,final String endDate) { 
		  List<ComPanyReport> tempList = new ArrayList<ComPanyReport>();
		  List resultList = (List) jdbcTemplate.execute( 
		     new CallableStatementCreator() { 
		        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
		        	String schemaName= "";
					if(null != ContextUtil.getCurrentUser()){
			    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
					}
		        	String storedProc = "{call "+schemaName+"QueryReportByCompanyStep(?,?,?)}";// 调用的sql 
		           CallableStatement cs = con.prepareCall(storedProc); 
		           cs.setString(1, beginDate);// 设置输入参数的值 
		           cs.setString(2, endDate);
		          // 注册输出参数的类型 
		          cs.registerOutParameter(3, oracle.jdbc.OracleTypes.CURSOR);
		           return cs; 
		        } 
		     }, new CallableStatementCallback() { 
		        @SuppressWarnings("unchecked")
				public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
		           List resultsMap = new ArrayList(); 
		           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
		           cs.executeQuery();
		           ResultSet rs = (ResultSet)cs.getObject(3);
		           
		           while (rs.next()) {// 转换每行的返回值到Map中 
		              Map rowMap = new HashMap(); 
		              rowMap.put("department", rs.getString(1)); 
		              rowMap.put("SendFinish", rs.getString(2)); 
		              rowMap.put("SendNotFinish1", rs.getString(3)); 
		              rowMap.put("SendTotal", rs.getString(4)); 
		              rowMap.put("RecFinish", rs.getString(5)); 
		              rowMap.put("RecNotFinish1", rs.getString(6)); 
		              rowMap.put("RecTotal", rs.getString(7));
		              resultsMap.add(rowMap); 
		           } 
		           rs.close(); 
		           return resultsMap; 
		        } 
		  }); 
		  ComPanyReport cpr = null;

		  for (int i = 0; i < resultList.size(); i++) { 
		     Map rowMap = (Map) resultList.get(i); 
		     cpr = new ComPanyReport();
		     String department = rowMap.get("department").toString(); 
		     String sendFinish = rowMap.get("SendFinish").toString(); 
		     String sendNotFinish1 = rowMap.get("SendNotFinish1").toString(); 
		     String sendTotal = rowMap.get("SendTotal").toString(); 
		     String recFinish = rowMap.get("RecFinish").toString(); 
		     String recNotFinish1 = rowMap.get("RecNotFinish1").toString();
		     String recTotal = rowMap.get("RecTotal").toString();
		     cpr.setDepName(department);
		     cpr.setSendFinish(sendFinish);
		     cpr.setSendNotFinish1(sendNotFinish1);
		     cpr.setSendTotal(sendTotal);
		     cpr.setRecFinish(recFinish);
		     cpr.setRecNotFinish1(recNotFinish1);
		     cpr.setRecTotal(recTotal);
		     tempList.add(cpr);
		  } 
		  return tempList;
		}
	
	@Override
	public List<ReceiveReport> queryReportStepBySend(final String depName, final String flowName, final String flowStatus, final String beginDate,
			final String endDate,final String overDateFlag) { 
		  List<ReceiveReport> tempList = new ArrayList<ReceiveReport>();
		  List resultList = (List) jdbcTemplate.execute( 
		     new CallableStatementCreator() { 
		        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
		        	String schemaName= "";
					if(null != ContextUtil.getCurrentUser()){
			    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
					}
		        	String storedProc = "{call "+schemaName+"QueryReportStepBySend(?,?,?,?,?,?,?)}";// 调用的sql 
		           CallableStatement cs = con.prepareCall(storedProc); 
		           cs.setString(1, depName);
		           cs.setString(2, flowName);
		           cs.setString(3, flowStatus);
		           cs.setString(4, beginDate);// 设置输入参数的值 
		           cs.setString(5, endDate);
		           cs.setString(6, overDateFlag);
		          // 注册输出参数的类型 
		           cs.registerOutParameter(7, oracle.jdbc.OracleTypes.CURSOR);
		           return cs; 
		        } 
		     }, new CallableStatementCallback() { 
		        @SuppressWarnings("unchecked")
				public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
		           List resultsMap = new ArrayList(); 
		         
		           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
		           cs.executeQuery();
		           ResultSet rs = (ResultSet)cs.getObject(7);
		           
		           while (rs.next()) {// 转换每行的返回值到Map中 
		              Map rowMap = new HashMap(); 
		              rowMap.put("sendDep", rs.getString(1)); 
		              rowMap.put("name", rs.getString(2)); 
		              rowMap.put("subject", rs.getString(3)); 
		              rowMap.put("sender", rs.getString(4)); 
		              rowMap.put("sendTime", rs.getString(5)); 
		              rowMap.put("stepDealer", rs.getString(6)); 
		              rowMap.put("stepFinishTime", rs.getString(7)); 
		              rowMap.put("preStepFinishTime", rs.getString(8)); 
		              rowMap.put("status", rs.getString(9)); 
		              rowMap.put("setpTime", rs.getString(10)); 
		              resultsMap.add(rowMap); 
		           } 
		           rs.close(); 
		           return resultsMap; 
		        } 
		  }); 
		  ReceiveReport cpr = null;
		  for (int i = 0; i < resultList.size(); i++) { 
			 cpr = new ReceiveReport();
		     Map rowMap = (Map) resultList.get(i); 
		     String sendDep = rowMap.get("sendDep").toString(); 
		     String name = rowMap.get("name").toString(); 
		     String subject = rowMap.get("subject").toString(); 
		     String sender = rowMap.get("sender").toString(); 
		     String sendTime = rowMap.get("sendTime").toString(); 
		     String stepDealer = rowMap.get("stepDealer").toString(); 
		     String stepFinishTime = rowMap.get("stepFinishTime").toString(); 
		     String preStepFinishTime = rowMap.get("preStepFinishTime").toString(); 
		     String status = rowMap.get("status").toString(); 
		     String setpTime = rowMap.get("setpTime").toString(); 
		     cpr.setSendDep(sendDep);
		     cpr.setName(name);
		     cpr.setSubject(subject);
		     cpr.setSender(sender);
		     cpr.setSendTime(sendTime);
		     cpr.setStepDealer(stepDealer);
		     cpr.setStepFinishTime(stepFinishTime);
		     cpr.setPreStepFinishTime(preStepFinishTime);
		     cpr.setStatus(status);
		     cpr.setSetpTime(setpTime);
		    // logger.info("recDep=" + recDep + ";assigner=" + assigner); 
		     tempList.add(cpr);
		  } 
		  return tempList;
		}
	
	@Override
	public List<ReceiveReport> queryReportStepByReceive(final String depName, final String flowName, final String flowStatus, final String beginDate,
			final String endDate,final String overDateFlag) {
		List<ReceiveReport> tempList = new ArrayList<ReceiveReport>();
		List resultList = (List) jdbcTemplate.execute(
				new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+schemaName+"QueryReportStepByReceive(?,?,?,?,?,?,?)}";// 调用的sql
						CallableStatement cs = con.prepareCall(storedProc);
						cs.setString(1, depName);
						cs.setString(2, flowName);
						cs.setString(3, flowStatus);
						cs.setString(4, beginDate);// 设置输入参数的值
						cs.setString(5, endDate);
						cs.setString(6, overDateFlag);
						// 注册输出参数的类型
						cs.registerOutParameter(7, oracle.jdbc.OracleTypes.CURSOR);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List resultsMap = new ArrayList();

						//ResultSet rs = cs.executeQuery();// 获取游标一行的值
						cs.executeQuery();
				        ResultSet rs = (ResultSet)cs.getObject(7);
						while (rs.next()) {// 转换每行的返回值到Map中
							Map rowMap = new HashMap();
							rowMap.put("recDep", rs.getString(1));
							rowMap.put("name", rs.getString(2));
							rowMap.put("subject", rs.getString(3));
							rowMap.put("sendDep", rs.getString(4));
							rowMap.put("sender", rs.getString(5));
							rowMap.put("sendTime", rs.getString(6));
							rowMap.put("stepDealer", rs.getString(7));
							rowMap.put("stepFinishTime", rs.getString(8));
							rowMap.put("preStepFinishTime", rs.getString(9));
							rowMap.put("status", rs.getString(10));
							rowMap.put("setpTime", rs.getString(11));
							resultsMap.add(rowMap);
						}
						rs.close();
						return resultsMap;
					}
				});
		ReceiveReport cpr = null;
		for (int i = 0; i < resultList.size(); i++) {
			cpr = new ReceiveReport();
			Map rowMap = (Map) resultList.get(i);
			String recDep = rowMap.get("recDep").toString();
			String name = rowMap.get("name").toString();
			String subject = rowMap.get("subject").toString();
			String sendDep = rowMap.get("sendDep").toString();
			String sender = rowMap.get("sender").toString();
			String sendTime = rowMap.get("sendTime").toString();
			String stepDealer = rowMap.get("stepDealer").toString();
			String stepFinishTime = rowMap.get("stepFinishTime").toString();
			String preStepFinishTime = rowMap.get("preStepFinishTime")
					.toString();
			String status = rowMap.get("status").toString();
			String setpTime = rowMap.get("setpTime").toString();
			cpr.setRecDep(recDep);
			cpr.setSendDep(sendDep);
			cpr.setName(name);
			cpr.setSubject(subject);
			cpr.setSender(sender);
			cpr.setSendTime(sendTime);
			cpr.setStepDealer(stepDealer);
			cpr.setStepFinishTime(stepFinishTime);
			cpr.setPreStepFinishTime(preStepFinishTime);
			cpr.setStatus(status);
			cpr.setSetpTime(setpTime);
			// logger.info("recDep=" + recDep + ";assigner=" + assigner);
			tempList.add(cpr);
		}
		return tempList;
	}
}
