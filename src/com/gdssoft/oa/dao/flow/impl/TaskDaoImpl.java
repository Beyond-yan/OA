package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jbpm.pvm.internal.task.TaskImpl;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.RowMapper;

import com.gdssoft.oa.dao.flow.TaskDao;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.mileages.Mileages;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;

public class TaskDaoImpl extends BaseDaoImpl<TaskImpl> implements TaskDao{
	@Resource
	public SysConfigService sysConfigService;
	@Resource
	private AppUserService appUserService;
	
	private Log logger = LogFactory.getLog(TaskDaoImpl.class);
	public TaskDaoImpl() {
		super(TaskImpl.class);
	}
	public void init(){
		Long maxId=this.jdbcTemplate.queryForLong("SELECT max(DBID_) FROM OA.JBPM4_HIST_ACTINST");
		maxId+=10000;
		int version=(int)(maxId/10000);
		StringBuffer sql=new StringBuffer();
		sql.append(" SELECT ID,SCHEMA_CODE ");
		sql.append(" FROM OA_COMMON.SYS_SCHEMA_CONFIG ");
		sql.append(" WHERE SCHEMA_CODE != 'GLJOA'");
		sql.append(" ORDER BY ID ASC");
		List<Map<Object,Object>> list=this.jdbcTemplate.queryForList(sql.toString());
		if(list!=null&&list.size()>0){
			for(Map<Object,Object> map:list){
				this.jdbcTemplate.execute("UPDATE "+map.get("SCHEMA_CODE").toString()+".JBPM4_PROPERTY SET VERSION_="+version+",VALUE_="+(maxId+Integer.valueOf(map.get("ID").toString())));
			}
		}
	}
	/**
	 * 查找个人归属任务，不包括其角色归属的任务
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<TaskImpl> getPersonTasks(String userId,PagingBean pb){
		
		StringBuffer hqlSb=new StringBuffer();
		hqlSb.append("select task from org.jbpm.pvm.internal.task.TaskImpl task  where task.assignee=?");
		hqlSb.append(" order by task.createTime desc");
		
		return findByHql(hqlSb.toString(),new Object[]{userId}, pb);
	}
	
	public TaskImpl getTasks(String piId) {
		String hql = "select task from org.jbpm.pvm.internal.task.TaskImpl task where task.executionId = ?";
		List<TaskImpl> list = findByHql(hql,new Object[]{piId});
		return list.size()>0?list.get(0):null;
		/*String sql="select task.DBID_ taskId, task.ACTIVITY_NAME_ activityname,task.NAME_ taskname from jbpm4_task task task.EXECUTION_==?";
		TaskImpl task = this.jdbcTemplate.query(sql,new Object[]{piId},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						TaskImpl task = new TaskImpl();
						Long taskId = rs.getLong("taskId");
						String activityname=rs.getString("activityname"); 
						String taskname=rs.getString("taskname");
						task.setAssignee(assignee);
						task.setTaskId(taskId);
						task.setName(activityname);
						return task;
					}
				}
		);
		return task;*/
		
	}
	/**
	 * 取得某个用户候选的任务列表
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<TaskImpl> getCandidateTasks(String userId,PagingBean pb){
		AppUser user=(AppUser)getHibernateTemplate().load(AppUser.class, new Long(userId));
		Iterator<AppRole> rolesIt=user.getRoles().iterator();
		StringBuffer groupIds=new StringBuffer();
		int i=0;
		while(rolesIt.hasNext()){
			if(i++>0)groupIds.append(",");
			groupIds.append("'"+rolesIt.next().getRoleId().toString()+"'");
		}
		StringBuffer hqlSb=new StringBuffer();
		hqlSb.append("select task from org.jbpm.pvm.internal.task.TaskImpl task left join task.participations pt ");
		hqlSb.append(" where task.assignee is null and pt.type = 'candidate' and ( pt.userId=? ");
		
		if(user.getRoles().size()>0){
			hqlSb.append(" or pt.groupId in ("+groupIds.toString()+")");
		}
		hqlSb.append(")");
		hqlSb.append(" order by task.createTime desc");
		
		return findByHql(hqlSb.toString(), new Object[]{userId,userId},pb);
	}
	
	/**
	 * 取得用户的对应的任务列表
	 * @param userId
	 * @return
	 */
	public List<TaskImpl> getTasksByUserId(String userId,PagingBean pb){
		AppUser user=(AppUser)getHibernateTemplate().load(AppUser.class, new Long(userId));
		Iterator<AppRole> rolesIt=user.getRoles().iterator();
		StringBuffer groupIds=new StringBuffer();
		int i=0;
		while(rolesIt.hasNext()){
			if(i++>0)groupIds.append(",");
			groupIds.append("'"+rolesIt.next().getRoleId().toString()+"'");
		}
		StringBuffer hqlSb=new StringBuffer();
		hqlSb.append("select distinct task from org.jbpm.pvm.internal.task.TaskImpl task left join task.participations pt where task.assignee=?");
		hqlSb.append(" or ( task.assignee is null and pt.type = 'candidate' and  ( pt.userId = ? ");
		
		if(user.getRoles().size()>0){
			hqlSb.append(" or pt.groupId in ("+groupIds.toString()+")");
		}
		hqlSb.append("))");
		hqlSb.append(" order by task.createTime desc");

		return findByHql(hqlSb.toString(), new Object[]{userId,userId},pb);
		
	}
	
	/**
	 * 通过活动名称及参数Key取得某任务列表
	 * @param activityName
	 * @param varKey
	 * @return
	 */
	public List<JbpmTask> getByActivityNameVarKeyLongVal(String activityName,String varKey,Long value){
		String sql="select task.DBID_ taskId, task.ASSIGNEE_ assignee from jbpm4_task task join jbpm4_variable var on task.EXECUTION_=var.EXECUTION_ where  task.ACTIVITY_NAME_=? and var.KEY_=? and var.LONG_VALUE_=?";//task.ASSIGNEE_ is not null and
		Collection<JbpmTask> jbpmtask =(Collection) this.jdbcTemplate.query(sql,new Object[]{activityName,varKey,value},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						JbpmTask task=new JbpmTask();
						Long taskId=rs.getLong("taskId");
						String assignee=rs.getString("assignee");
						task.setAssignee(assignee);
						task.setTaskId(taskId);
						return task;
					}
				}
		);
		return new ArrayList(jbpmtask);
	}
	@Override
	public List<Long> getGroupByTask(Long taskId) {
		String sql="select pa.GROUPID_ groupId from jbpm4_participation pa  where pa.TYPE_ = 'candidate'and pa.TASK_=?";
		Collection<String> groupIds =(Collection) this.jdbcTemplate.query(sql,new Object[]{taskId},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						String groupId=rs.getString("groupId");
						return groupId;
					}
				}
		);
		return new ArrayList(groupIds);
	}
	@Override
	public List<Long> getUserIdByTask(Long taskId) {
		String hql="from org.jbpm.pvm.internal.task.TaskImpl task where task.superTask.id=?";
		Object[] objs={taskId};
		List<TaskImpl> taskList=findByHql(hql, objs);
		List<Long> list=new ArrayList<Long>();
		for(TaskImpl task:taskList){
			list.add(new Long(task.getAssignee()));
		}
		return list;
	}
	
	
	/*public List<TaskInfo> getTasksByUserIdFromView(String isConf,String userId,String flowAssignIds,PagingBean pb,String createDateSort,String urgentDateSort){
		//获取每页分页个数
		Integer pageSize = pb.getPageSize();
		//获取开始索引
		Integer thePage = pb.start ;
		//加载当前用户
		AppUser user=(AppUser)getHibernateTemplate().load(AppUser.class, new Long(userId));
		//加载当前用户的角色组
		Iterator<AppRole> rolesIt=user.getRoles().iterator();
		StringBuffer groupIds=new StringBuffer();
		int i=0;
		while(rolesIt.hasNext()){
			if(i++>0)groupIds.append(",");
			groupIds.append(""+rolesIt.next().getRoleId().toString()+"");
		}
		//加载是否具有审批会议的角色
		AppUser au = appUserService.get(new Long(userId));
		Set<AppRole> roles =au.getRoles();
		String isConf= "";
		AppRole ar = new AppRole();
		ar.setRoleId(42L);
		if(roles.contains(ar)){
			isConf= "1";
		}else{
			isConf= "0";
		}
	
		String localhostUrl = sysConfigService.findDataValueByTkCkey(
				"linkUrl", "linkUrl").getDataValue();
		System.out.println("localhostUrl"+localhostUrl);
		//调用存储过程 生成该用户的所有 代办事项
		//jdbcTemplate.update("{call getToDoList('"+isConf+"','"+userId+"','"+flowAssignIds+"','"+groupIds.toString()+"','"+localhostUrl+"')}");
		//jdbcTemplate.update("{call getToDoList('"+isConf+"','"+userId+"','"+groupIds.toString()+"','"+localhostUrl+"')}");
		//System.out.println("{call getToDoList('"+isConf+"','"+userId+"','"+flowAssignIds+"','"+groupIds.toString()+"','"+localhostUrl+"')}")}");
		//分页查询数据开始
		try {
			jdbcTemplate.execute("{call getToDoList('"+isConf+"','"+userId+"','"+flowAssignIds+"','"+groupIds.toString()+"','"+localhostUrl+"')}");
			

			StringBuffer sb=new StringBuffer();
			//sb.append("select DBID_,ACTIVITY_NAME_,ASSIGNEE_,DUEDATE_,CREATE_,SUPERTASK_,PROCINST_,EXECUTION_ID_,SWIMLANE_,TYPE_,GROUPID_,USERID_,link,urgentlevel,folwType ");
			sb.append("select DBID_,ACTIVITY_NAME_,ASSIGNEE_,DUEDATE_,CREATE_,SUPERTASK_,PROCINST_,EXECUTION_ID_,SWIMLANE_,link,urgentlevel,folwType,daibanInfo ");
			sb.append("from ##ToDoListTempTable ");
		
			
			StringBuffer sb2=new StringBuffer();
			sb2.append("select top "+thePage+" DBID_ ");
			if(null == createDateSort || "".equals(createDateSort)){
				sb2.append("from ##ToDoListTempTable order by CREATE_ DESC ");	
			}else if(createDateSort.equals("date_desc")){
				sb2.append("from ##ToDoListTempTable order by CREATE_ DESC ");	
			}else {
				sb2.append("from ##ToDoListTempTable order by CREATE_ ASC ");	
			}
			if(null == urgentDateSort || "".equals(urgentDateSort)){
				sb2.append(",urgentlevel DESC ");	
			}else if(createDateSort.equals("urgent_desc")){
				sb2.append(",urgentlevel DESC ");	
			}else {
				sb2.append(",urgentlevel ASC ");	
			}
			String sql="";
			if(null == createDateSort || "".equals(createDateSort)){
				sql="select top "+pageSize+" * " +"from ( "+sb.toString()+" ) tg where tg.DBID_ not in ( "+sb2.toString()+") order by tg.CREATE_ DESC ";
			}else if(createDateSort.equals("date_desc")){
				sql="select top "+pageSize+" * " +"from ( "+sb.toString()+" ) tg where tg.DBID_ not in ( "+sb2.toString()+") order by tg.CREATE_ DESC ";
			}else {
				sql="select top "+pageSize+" * " +"from ( "+sb.toString()+" ) tg where tg.DBID_ not in ( "+sb2.toString()+") order by tg.CREATE_ ASC ";
			}
			if(null == urgentDateSort || "".equals(urgentDateSort)){
				sql = sql +",urgentlevel DESC ";
			}else if(createDateSort.equals("urgent_desc")){
				sql = sql +",urgentlevel DESC ";
			}else {
				sql = sql +",urgentlevel ASC ";
			}
			
			
			StringBuffer sb3=new StringBuffer();
			sb3.append("select count(*) ");
			sb3.append("from ##ToDoListTempTable ");
			//查询总记录数
			pb.setTotalItems(jdbcTemplate.queryForInt(sb3.toString()));
			System.out.println(sql);
			//查询分页数据
			List<Object> list = jdbcTemplate.queryForList(sql);
			List<TaskInfo> list2 = new ArrayList<TaskInfo>();
			for (Object iter : list) {
				TaskInfo taskInfo = new TaskInfo();
				Map<String, Object> paraMap = (Map) iter;
					//设置任务名称
					taskInfo.setTaskName(paraMap.get("ACTIVITY_NAME_").toString());
					//设置活动名称
					taskInfo.setActivityName(paraMap.get("ACTIVITY_NAME_").toString());
					//设置任务处理人
					if(paraMap.get("ASSIGNEE_")==null){
						taskInfo.setAssignee(null);
					}else {
						taskInfo.setAssignee(paraMap.get("ASSIGNEE_").toString());
					}
					if(paraMap.get("DUEDATE_")!=null){
						Date dueDate=DateUtils.parseDate(paraMap.get("DUEDATE_")
								.toString(), new String[]{Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD,"yyyy-MM-dd HH:mm:ss.S"});
						taskInfo.setDueDate(dueDate);
					}else{
						taskInfo.setDueDate(null);
					}
					if(paraMap.get("CREATE_")!=null){
						Date createTime=DateUtils.parseDate(paraMap.get("CREATE_")
								.toString(), new String[]{Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD,"yyyy-MM-dd HH:mm:ss.S"});
						taskInfo.setCreateTime(createTime);
					}else{
						taskInfo.setCreateTime(null);
					}
					System.out.println("1SUPERTASK_"+paraMap.get("SUPERTASK_"));
					if(paraMap.get("SUPERTASK_")!=null){
						List<TaskImpl> taskImpl = getTasksBySuperTaskId(paraMap.get("SUPERTASK_").toString());
						System.out.println("2SUPERTASK_"+paraMap.get("SUPERTASK_").toString());
						System.out.println("taskImpl"+taskImpl);
						System.out.println(taskImpl.get(0));
						System.out.println(taskImpl.get(0).getProcessInstance());
						taskInfo.setPdId(taskImpl.get(0).getProcessInstance().getId());
						taskInfo.setExecutionId(taskImpl.get(0).getExecutionId());
					}else {
						taskInfo.setPdId(paraMap.get("PROCINST_").toString());
						taskInfo.setExecutionId(paraMap.get("EXECUTION_ID_").toString());
					}
					if(paraMap.get("PROCINST_")==null){
						taskInfo.setPdId(null);
					}else {
						taskInfo.setPdId(paraMap.get("PROCINST_").toString());
					}
					if(paraMap.get("EXECUTION_ID_")==null){
						taskInfo.setPdId(null);
						taskInfo.setExecutionId(null);
					}else {
						taskInfo.setPdId(paraMap.get("EXECUTION_ID_").toString());
						taskInfo.setExecutionId(paraMap.get("EXECUTION_ID_").toString());
					}
				
					
					if(paraMap.get("folwType").toString().equals("0")){
						taskInfo.setTaskId(Long.valueOf(paraMap.get("DBID_").toString()));
						TaskImpl taskImpl = getTasksByDbId(paraMap.get("DBID_").toString());
						if(taskImpl.getParticipations().size()>0){//可由其他人来执行
							taskInfo.setIsMultipleTask((short)1);
						}
					}else {
						taskInfo.setLink(paraMap.get("link").toString());
					}
					
					if(paraMap.get("urgentlevel")==null){
						taskInfo.setUrgentLevel(null);
						
					}else {
						taskInfo.setUrgentLevel(paraMap.get("urgentlevel").toString());
					}
					if(paraMap.get("daibanInfo")==null){
						taskInfo.setDaiBanInfo(null);
						
					}else {
						//设置代办信息
						taskInfo.setDaiBanInfo(paraMap.get("daibanInfo").toString());
					}
					taskInfo.setType(Integer.valueOf(paraMap.get("folwType").toString()));
				list2.add(taskInfo);

			}
			System.out.println("list2size:"+list2.size());
			delTable();
			return list2;
		} catch (DataAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}*/
	
	public List<TaskInfo> getTasksByUserIdFromView(final String userId,final String flowAssignIds,final PagingBean pb,String createDateSort,String urgentDateSort){
		logger.info("start:"+pb.start);
		logger.info("pageSize:"+pb.getPageSize());
		//获取每页分页个数
		final Integer pageSize = pb.getPageSize();
		//获取开始索引
		final Integer thePage = pb.start ;
		//加载当前用户
		AppUser user=(AppUser)getHibernateTemplate().load(AppUser.class, new Long(userId));
		//加载当前用户的角色组
		Iterator<AppRole> rolesIt=user.getRoles().iterator();
		final StringBuffer groupIds=new StringBuffer();
		int i=0;
		while(rolesIt.hasNext()){
			if(i++>0)groupIds.append(",");
			groupIds.append(""+rolesIt.next().getRoleId().toString()+"");
		}
		//加载是否具有审批会议的角色
		AppUser au = appUserService.get(new Long(userId));
		Set<AppRole> roles =au.getRoles();
		String isConf= "";
		AppRole ar = new AppRole();
		ar.setRoleId(42L);
		if(roles.contains(ar)){
			isConf= "1";
		}else{
			isConf= "0";
		}
		final String isConfFinal= isConf;
		final String localhostUrl = sysConfigService.findDataValueByTkCkey(
				"linkUrl", "linkUrl").getDataValue();
		
		//分页查询数据开始
		try {
			
			List<TaskInfo> tempList = new ArrayList<TaskInfo>();
			List resultList = (List) jdbcTemplate.execute( 
				     new CallableStatementCreator() { 
				        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
				         //sql server
				        	/* String storedProc = "{?=call getToDoList_New(?,?,?,?,?,?,?)}";// 调用的sql 
				           CallableStatement cs = con.prepareCall(storedProc); 
				           cs.setString(2, isConfFinal);// 设置输入参数的值 
				           cs.setString(3, userId);
				           cs.setString(4, flowAssignIds);
				           cs.setString(5, groupIds.toString());
				           cs.setString(6, localhostUrl);
				           cs.setInt(7, thePage);
				           int endNo = thePage +pageSize-1;
				           cs.setInt(8, endNo);
				           logger.info("endNo:"+endNo);
				          // 注册输出参数的类型 
				          cs.registerOutParameter(1, Types.OTHER);*/
				        	//Oracle modify by:tony
				        	String schemaName= "";
							if(null != ContextUtil.getCurrentUser()){
					    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
					    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
							}
				        	String storedProc = "{call "+schemaName+"getToDoList_New(?,?,?,?,?,?,?,?)}";// 调用的sql 
					           CallableStatement cs = con.prepareCall(storedProc); 
					           cs.setString(1, isConfFinal);// 设置输入参数的值 
					           cs.setString(2, userId);
					           cs.setString(3, flowAssignIds);
					           cs.setString(4, groupIds.toString());
					           cs.setString(5, localhostUrl);
					           cs.setInt(6, thePage+1);
					           int endNo = thePage +pageSize;
					           cs.setInt(7, endNo);
					           logger.info("endNo:"+endNo);
					          // 注册输出参数的类型 
					          cs.registerOutParameter(8,oracle.jdbc.OracleTypes.CURSOR );
				          
				           return cs; 
				        } 
				     }, new CallableStatementCallback() { 
				        @SuppressWarnings("unchecked")
						public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
				           List resultsMap = new ArrayList(); 
				           
				           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
				           
				           //oracle modify by:tony
				           cs.executeQuery();
				           ResultSet rs = (ResultSet)cs.getObject(8);
				           
				           
				           while (rs.next()) {// 转换每行的返回值到Map中 
				              Map rowMap = new HashMap(); 
					            //查询总记录数
				              rowMap.put("TotalCount", rs.getString(1));
				              rowMap.put("ACTIVITY_NAME_", rs.getString(17)); 
				              rowMap.put("ASSIGNEE_", rs.getString(9)); 
				              rowMap.put("DUEDATE_", rs.getString(13)); 
				              rowMap.put("CREATE_", rs.getString(12)); 
				              rowMap.put("SUPERTASK_", rs.getString(19)); 
				              rowMap.put("PROCINST_", rs.getString(21)); 
				              rowMap.put("EXECUTION_ID_", rs.getString(16)); 
				              rowMap.put("DBID_", rs.getString(3)); 
				              rowMap.put("link", rs.getString(25)); 
				              rowMap.put("urgentlevel", rs.getString(24)); 
				              rowMap.put("daibanInfo", rs.getString(27)); 
				              rowMap.put("folwType", rs.getString(26)); 
				              rowMap.put("creatorName", rs.getString(28));
				              rowMap.put("depName", rs.getString(29));
				              resultsMap.add(rowMap); 
				           } 
				           rs.close(); 
				           return resultsMap; 
				        } 
				  });
			//封装结果集
			TaskInfo taskInfo = null;
			  for (int j = 0; j < resultList.size(); j++) { 
			     Map paraMap = (Map) resultList.get(j); 
			     if(paraMap.get("ACTIVITY_NAME_")==null){
			    	 continue;
			     }
			     taskInfo = new TaskInfo();
			     pb.setTotalItems(Integer.valueOf(paraMap.get("TotalCount").toString()));
			     //设置任务名称
					taskInfo.setTaskName(paraMap.get("ACTIVITY_NAME_").toString());
					//设置活动名称
					taskInfo.setActivityName(paraMap.get("ACTIVITY_NAME_").toString());
					//设置任务处理人
					if(paraMap.get("ASSIGNEE_")==null){
						taskInfo.setAssignee(null);
					}else {
						taskInfo.setAssignee(paraMap.get("ASSIGNEE_").toString());
					}
					if(paraMap.get("DUEDATE_")!=null){
						Date dueDate=DateUtils.parseDate(paraMap.get("DUEDATE_")
								.toString(), new String[]{Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD,"yyyy-MM-dd HH:mm:ss.S"});
						taskInfo.setDueDate(dueDate);
					}else{
						taskInfo.setDueDate(null);
					}
					if(paraMap.get("CREATE_")!=null){
						Date createTime=DateUtils.parseDate(paraMap.get("CREATE_")
								.toString(), new String[]{Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD,"yyyy-MM-dd HH:mm:ss.S"});
						taskInfo.setCreateTime(createTime);
					}else{
						taskInfo.setCreateTime(null);
					}
					
					if(paraMap.get("PROCINST_")==null){
						taskInfo.setPdId(null);
					}else {
						taskInfo.setPdId(paraMap.get("PROCINST_").toString());
					}
					if(paraMap.get("EXECUTION_ID_")==null){
						taskInfo.setPdId(null);
						taskInfo.setExecutionId(null);
					}else {
						taskInfo.setPdId(paraMap.get("EXECUTION_ID_").toString());
						taskInfo.setExecutionId(paraMap.get("EXECUTION_ID_").toString());
					}
				
					
					if(paraMap.get("folwType").toString().equals("0")){
						taskInfo.setTaskId(Long.valueOf(paraMap.get("DBID_").toString()));
						TaskImpl taskImpl = getTasksByDbId(paraMap.get("DBID_").toString());
						if(taskImpl.getParticipations().size()>0){//可由其他人来执行
							taskInfo.setIsMultipleTask((short)1);
						}
					}else {
						taskInfo.setLink(paraMap.get("link").toString());
					}
					
					if(paraMap.get("urgentlevel")==null){
						taskInfo.setUrgentLevel(null);
						
					}else {
						taskInfo.setUrgentLevel(paraMap.get("urgentlevel").toString());
					}
					if(paraMap.get("daibanInfo")==null){
						taskInfo.setDaiBanInfo(null);
						
					}else {
						//设置代办信息
						taskInfo.setDaiBanInfo(paraMap.get("daibanInfo").toString());
					}
					taskInfo.setType(Integer.valueOf(paraMap.get("folwType").toString()));
					if(paraMap.get("creatorName")==null){
						taskInfo.setCreatorName(null);
						
					}else {
						//设置发起人姓名
						taskInfo.setCreatorName(paraMap.get("creatorName").toString());
					}
					if(paraMap.get("depName")==null){
						taskInfo.setDepName(null);
						
					}else {
						//设置发起人部门
						taskInfo.setDepName(paraMap.get("depName").toString());
					}
			     tempList.add(taskInfo);
			  } 
			  return tempList;
			
			
		} catch (DataAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 根据父任务查找任务
	 * @param userId
	 * @return
	 */
	public List<TaskImpl> getTasksBySuperTaskId(String superId){
		
		StringBuffer hqlSb=new StringBuffer();
		hqlSb.append("select task from org.jbpm.pvm.internal.task.TaskImpl task  where task.superTask.dbid=?");
		hqlSb.append(" order by task.createTime desc");
		
		return findByHql(hqlSb.toString(),new Object[]{Long.valueOf(superId)});
	}
	/**
	 * 根据dbid查找任务
	 * @param userId
	 * @return
	 */
	public TaskImpl getTasksByDbId(String dbId){
		
		StringBuffer hqlSb=new StringBuffer();
		hqlSb.append("select task from org.jbpm.pvm.internal.task.TaskImpl task  where task.dbid=?");
		hqlSb.append(" order by task.createTime desc");
		
		return (TaskImpl)findUnique(hqlSb.toString(),new Object[]{Long.valueOf(dbId)});
	}
	/**
	 * 删除临时表
	 * @param userId
	 * @return
	 */
	public void delTable(){
		//删除临时表
		String delTempTableSql= "drop table ##ToDoListTempTable";
		jdbcTemplate.execute(delTempTableSql);
	}

	@Override
	public List<TaskInfo> getTasksByUserFromView(AppUser appUser,
			final String flowAssignIds, PagingBean pb, String createDateSort,
			String urgentDateSort) {
		logger.info("start:"+pb.start);
		logger.info("pageSize:"+pb.getPageSize());
		//获取每页分页个数
		final Integer pageSize = pb.getPageSize();
		//获取开始索引
		final Integer thePage = pb.start ;
		final StringBuffer groupIds=new StringBuffer();
		List<Long> list = appUserService.findRolesByUser(appUser.getOwnerSchema(), appUser.getUserId());
		for(int i = 0; i < list.size(); i++){
			groupIds.append("" + list.get(i).toString() + "");
		}
		final String isConfFinal= "0";
		final String localhostUrl = sysConfigService.findDataValueByTkCkeyWithSchema(appUser.getOwnerSchema(),
				"linkUrl", "linkUrl").getDataValue();
		final String userId = appUser.getUserId().toString();
		final AppUser au = appUser;
		
		//分页查询数据开始
		try {
			
			List<TaskInfo> tempList = new ArrayList<TaskInfo>();
			List resultList = (List) jdbcTemplate.execute( 
				     new CallableStatementCreator() { 
				        public CallableStatement createCallableStatement(Connection con) throws SQLException { 
				         //sql server
				        	/* String storedProc = "{?=call getToDoList_New(?,?,?,?,?,?,?)}";// 调用的sql 
				           CallableStatement cs = con.prepareCall(storedProc); 
				           cs.setString(2, isConfFinal);// 设置输入参数的值 
				           cs.setString(3, userId);
				           cs.setString(4, flowAssignIds);
				           cs.setString(5, groupIds.toString());
				           cs.setString(6, localhostUrl);
				           cs.setInt(7, thePage);
				           int endNo = thePage +pageSize-1;
				           cs.setInt(8, endNo);
				           logger.info("endNo:"+endNo);
				          // 注册输出参数的类型 
				          cs.registerOutParameter(1, Types.OTHER);*/
				        	//Oracle modify by:tony
				        	String schemaName= "";
							if(null != au){
								if(StringUtils.isNotBlank(au.getOwnerSchema())){
									schemaName = au.getOwnerSchema() + ".";
								}
							}
				        	String storedProc = "{call "+schemaName+"getToDoList_New(?,?,?,?,?,?,?,?)}";// 调用的sql 
					           CallableStatement cs = con.prepareCall(storedProc); 
					           cs.setString(1, isConfFinal);// 设置输入参数的值 
					           cs.setString(2, userId);
					           cs.setString(3, flowAssignIds);
					           cs.setString(4, groupIds.toString());
					           cs.setString(5, localhostUrl);
					           cs.setInt(6, thePage+1);
					           int endNo = thePage +pageSize;
					           cs.setInt(7, endNo);
					           logger.info("endNo:"+endNo);
					          // 注册输出参数的类型 
					          cs.registerOutParameter(8,oracle.jdbc.OracleTypes.CURSOR );
				          
				           return cs; 
				        } 
				     }, new CallableStatementCallback() { 
				        @SuppressWarnings("unchecked")
						public Object doInCallableStatement(CallableStatement cs) throws SQLException,DataAccessException { 
				           List resultsMap = new ArrayList(); 
				           
				           //ResultSet rs =  cs.executeQuery();// 获取游标一行的值 
				           
				           //oracle modify by:tony
				           cs.executeQuery();
				           ResultSet rs = (ResultSet)cs.getObject(8);
				           
				           
				           while (rs.next()) {// 转换每行的返回值到Map中 
				              Map rowMap = new HashMap(); 
					            //查询总记录数
				              rowMap.put("TotalCount", rs.getString(1));
				              rowMap.put("ACTIVITY_NAME_", rs.getString(17)); 
				              rowMap.put("ASSIGNEE_", rs.getString(9)); 
				              rowMap.put("DUEDATE_", rs.getString(13)); 
				              rowMap.put("CREATE_", rs.getString(12)); 
				              rowMap.put("SUPERTASK_", rs.getString(19)); 
				              rowMap.put("PROCINST_", rs.getString(21)); 
				              rowMap.put("EXECUTION_ID_", rs.getString(16)); 
				              rowMap.put("DBID_", rs.getString(3)); 
				              rowMap.put("link", rs.getString(25)); 
				              rowMap.put("urgentlevel", rs.getString(24)); 
				              rowMap.put("daibanInfo", rs.getString(27)); 
				              rowMap.put("folwType", rs.getString(26)); 
				              rowMap.put("creatorName", rs.getString(28));
				              rowMap.put("depName", rs.getString(29));
				              resultsMap.add(rowMap); 
				           } 
				           rs.close(); 
				           return resultsMap; 
				        } 
				  });
			//封装结果集
			TaskInfo taskInfo = null;
			  for (int j = 0; j < resultList.size(); j++) { 
			     Map paraMap = (Map) resultList.get(j); 
			     taskInfo = new TaskInfo();
			     pb.setTotalItems(Integer.valueOf(paraMap.get("TotalCount").toString()));
			   //设置任务名称
					taskInfo.setTaskName(paraMap.get("ACTIVITY_NAME_").toString());
					//设置活动名称
					taskInfo.setActivityName(paraMap.get("ACTIVITY_NAME_").toString());
					//设置任务处理人
					if(paraMap.get("ASSIGNEE_")==null){
						taskInfo.setAssignee(null);
					}else {
						taskInfo.setAssignee(paraMap.get("ASSIGNEE_").toString());
					}
					if(paraMap.get("DUEDATE_")!=null){
						Date dueDate=DateUtils.parseDate(paraMap.get("DUEDATE_")
								.toString(), new String[]{Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD,"yyyy-MM-dd HH:mm:ss.S"});
						taskInfo.setDueDate(dueDate);
					}else{
						taskInfo.setDueDate(null);
					}
					if(paraMap.get("CREATE_")!=null){
						Date createTime=DateUtils.parseDate(paraMap.get("CREATE_")
								.toString(), new String[]{Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD,"yyyy-MM-dd HH:mm:ss.S"});
						taskInfo.setCreateTime(createTime);
					}else{
						taskInfo.setCreateTime(null);
					}
					
					if(paraMap.get("PROCINST_")==null){
						taskInfo.setPdId(null);
					}else {
						taskInfo.setPdId(paraMap.get("PROCINST_").toString());
					}
					if(paraMap.get("EXECUTION_ID_")==null){
						taskInfo.setPdId(null);
						taskInfo.setExecutionId(null);
					}else {
						taskInfo.setPdId(paraMap.get("EXECUTION_ID_").toString());
						taskInfo.setExecutionId(paraMap.get("EXECUTION_ID_").toString());
					}
				
					
					if(paraMap.get("folwType").toString().equals("0")){
						taskInfo.setTaskId(Long.valueOf(paraMap.get("DBID_").toString()));
//						TaskImpl taskImpl = getTasksByDbId(paraMap.get("DBID_").toString());
						/*TaskImpl taskImpl = getTasksByDbIdAndSchema(au.getOwnerSchema(),paraMap.get("DBID_").toString());
						if(taskImpl.getParticipations().size()>0){//可由其他人来执行
							taskInfo.setIsMultipleTask((short)1);
						}*/
					}else {
						taskInfo.setLink(paraMap.get("link").toString());
					}
					
					if(paraMap.get("urgentlevel")==null){
						taskInfo.setUrgentLevel(null);
						
					}else {
						taskInfo.setUrgentLevel(paraMap.get("urgentlevel").toString());
					}
					if(paraMap.get("daibanInfo")==null){
						taskInfo.setDaiBanInfo(null);
						
					}else {
						//设置代办信息
						taskInfo.setDaiBanInfo(paraMap.get("daibanInfo").toString());
					}
					taskInfo.setType(Integer.valueOf(paraMap.get("folwType").toString()));
					if(paraMap.get("creatorName")==null){
						taskInfo.setCreatorName(null);
						
					}else {
						//设置发起人姓名
						taskInfo.setCreatorName(paraMap.get("creatorName").toString());
					}
					if(paraMap.get("depName")==null){
						taskInfo.setDepName(null);
						
					}else {
						//设置发起人部门
						taskInfo.setDepName(paraMap.get("depName").toString());
					}
			     tempList.add(taskInfo);
			  } 
			  return tempList;
			
			
		} catch (DataAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 根据dbid查找任务
	 * @param userId
	 * @return
	 */
	public TaskImpl getTasksByDbIdAndSchema(String schema, String dbId){
		StringBuffer hqlSb=new StringBuffer();
		hqlSb.append("select task from org.jbpm.pvm.internal.task.TaskImpl task  where task.dbid=?");
		hqlSb.append(" order by task.createTime desc");
		
		return (TaskImpl)findUnique(hqlSb.toString(),new Object[]{Long.valueOf(dbId)});
	}

	@Override
	public JbpmTask getByTaskId(Long taskId) {
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
			if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		String sql="select task.DBID_ taskId, task.NAME_ taskName, task.ASSIGNEE_ assignee, e.INSTANCE_ instance from " + schema + "jbpm4_task task "
				+ " left join " + schema + "jbpm4_execution e on e.dbid_ = task.execution_ "
				+ " where task.DBID_ = ? ";
		Collection<JbpmTask> jbpmtask =(Collection) this.jdbcTemplate.query(sql,new Object[]{taskId},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						JbpmTask task=new JbpmTask();
						Long taskId=rs.getLong("taskId");
						String assignee=rs.getString("assignee");
						String instance = rs.getString("instance");
						String taskName = rs.getString("taskName");
						task.setAssignee(assignee);
						task.setTaskId(taskId);
						task.setName(taskName);
						task.setInstance(instance);

						return task;
					}
				}
		);
		List<JbpmTask> tasks = new ArrayList(jbpmtask);
		if (tasks != null && tasks.size() > 0) {
			return tasks.get(0);
		}
		return null;
	}
	public List<Department> getDeptByUserIds(String userIds){
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
			if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		String sql = "select distinct d.depid depid,d.depname depname from " + schema + "app_user au "
				+ " left join " + schema + "department d on au.depid = d.depid "
				+ " where au.userid in ("+userIds+") ";
		Collection<Department> dept =(Collection) this.jdbcTemplate.query(sql,
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						Department dept=new Department();
						dept.setDepId(rs.getLong("depid"));
						dept.setDepName(rs.getString("depname"));
						return dept;
					}
				}
		);
		return new ArrayList(dept);
	}
	@Override
	public List<JbpmTask> getProTasksByTaskId(Long taskId) {
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
			if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		String sql = "select  nt.DBID_ taskId, nt.NAME_ taskName, nt.ASSIGNEE_ assignee, ne.INSTANCE_ hisactinst, au.FULLNAME fullname,d.depname depname,d.depid depid from " + schema + "jbpm4_task nt "
				+ " left join " + schema + "jbpm4_execution ne on ne.dbid_ = nt.execution_ "
				+ " left join " + schema + "jbpm4_execution oe on ne.instance_ = oe.instance_ "
				+ " left join " + schema + "jbpm4_task ot on oe.dbid_ = ot.execution_  "
				+ " left join " + schema + "app_user au on au.userid = nt.assignee_ "
				+ " left join " + schema + "department d on au.depid = d.depid "
				+ " where nt.assignee_ is not NULL and ot.DBID_ = ? "
				+ " order by d.path asc";
		Collection<JbpmTask> jbpmtask =(Collection) this.jdbcTemplate.query(sql,new Object[]{taskId},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						JbpmTask task=new JbpmTask();
						Long taskId=rs.getLong("taskId");
						String assignee=rs.getString("assignee");
						String hisactinst = rs.getString("hisactinst");
						task.setAssignee(assignee);
						task.setTaskId(taskId);
						task.setInstance(hisactinst);
						task.setName(rs.getString("taskName"));
						task.setAssigneeName(rs.getString("fullname"));
						task.setDepname(rs.getString("depname"));
						task.setDepid(rs.getLong("depid"));
						return task;
					}
				}
		);
		return new ArrayList(jbpmtask);
	}
	
	public List<JbpmTask> getLeaderForMeetingTaskByPiid(String piid) {
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
			if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		String sql = "select  nt.DBID_ taskId, nt.NAME_ taskName, nt.ASSIGNEE_ assignee, ne.INSTANCE_ hisactinst, au.FULLNAME fullname from " + schema + "jbpm4_task nt "
				+ " left join " + schema + "jbpm4_execution ne on ne.dbid_ = nt.execution_ "
				+ " left join " + schema + "jbpm4_execution oe on ne.instance_ = oe.dbid_ "
				+ " left join " + schema + "app_user au on au.userid = nt.assignee_ "
				+ " where nt.assignee_ is not NULL AND NT.ACTIVITY_NAME_ = '领导批示' and oe.ID_ = ? ";
		Collection<JbpmTask> jbpmtask =(Collection) this.jdbcTemplate.query(sql,new Object[]{piid},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						JbpmTask task=new JbpmTask();
						Long taskId=rs.getLong("taskId");
						String assignee=rs.getString("assignee");
						String hisactinst = rs.getString("hisactinst");
						task.setAssignee(assignee);
						task.setTaskId(taskId);
						task.setInstance(hisactinst);
						task.setName(rs.getString("taskName"));
						task.setAssigneeName(rs.getString("fullname"));
						return task;
					}
				}
		);
		return new ArrayList(jbpmtask);
	}
}
