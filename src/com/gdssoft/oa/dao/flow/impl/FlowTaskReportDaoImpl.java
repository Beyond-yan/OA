package com.gdssoft.oa.dao.flow.impl;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.hsqldb.lib.StringUtil;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.RowMapper;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.flow.FlowTaskReportDao;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.system.AppUser;

/**
 * @author tony zhang 获取收发文待办及在办件
 */
public class FlowTaskReportDaoImpl extends BaseDaoImpl<FlowTaskReport>
		implements FlowTaskReportDao {

	public FlowTaskReportDaoImpl() {
		super(FlowTaskReport.class);
	}
	/**
	 * 获取收发文待办及在办件
	 */
	public List<FlowTaskReport> getFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize) {
		List<FlowTaskReport> resultList = (List<FlowTaskReport>) jdbcTemplate
				.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						System.out.print("------------1111--------------"+new Date());
						String storedProc = "{call get_flow_todolist_all(?,?,?,?,?,?,?,?,?,?,?,?)}";// 调用的sql
						CallableStatement cs = con.prepareCall(storedProc);
						if (null == userId)
							cs.setNull(1, java.sql.Types.BIGINT);
						else
							cs.setLong(1, userId); // 登录用户
						cs.setInt(2, toDoType);// --查询类别0：待办件1：在办件
						cs.setInt(3, archiveType);// 文档类别0：发文 ,1：收文, 3：外来会议
						cs.setString(4, subject);// -- 主题
						cs.setString(5, depName);// 发文单位
						if (null == defId)
							cs.setNull(6, java.sql.Types.BIGINT);
						else
							cs.setLong(6, defId);// --流程编号
						cs.setString(7, startDate);// --开始时间
						cs.setString(8, endDate);// --结束时间
						cs.setInt(9, currentPage);
						cs.setInt(10, pageSize);
						cs.registerOutParameter(11, java.sql.Types.INTEGER);
						cs.registerOutParameter(12,
								oracle.jdbc.OracleTypes.CURSOR);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						System.out.print("------------2222--------------"+new Date());
						List<FlowTaskReport> taskReportList = new ArrayList<FlowTaskReport>();
						cs.execute();
						int totalCounts  = Integer.parseInt(cs.getObject(11).toString());
						ResultSet rs = (ResultSet) cs.getObject(12);
						int i = 0;
						while (rs.next()) {// 转换每行的返回值到Map中
							FlowTaskReport taskReport = new FlowTaskReport();
							if(i == 0)
								taskReport.setTotalCounts(totalCounts);
							taskReport.setDefId(rs.getLong("DEF_ID"));
							taskReport.setRunId(rs.getLong("RUN_ID"));
							taskReport.setTaskId(rs.getLong("TASK_ID"));
							taskReport.setTaskName(rs.getString("TASK_NAME"));
							taskReport.setActivityname(rs.getString("ACTIVITYNAME"));
							taskReport.setRunSubject(rs.getString("RUN_SUBJECT"));
							taskReport.setPreActivityname(rs.getString("PRE_ACTIVITYNAME"));
							taskReport.setPreUserId(rs.getLong("PRE_USER_ID"));
							taskReport.setPreUserName(rs.getString("PRE_USER_NAME"));
							taskReport.setAssignUserId(rs.getLong("ASSIGN_USER_ID"));
							taskReport.setAssignUserName(rs.getString("ASSIGN_USER_NAME"));
							taskReport.setArchiveId(rs.getLong("ARCHIVE_ID"));
							taskReport.setIssuerId(rs.getLong("ISSUER_ID"));
							taskReport.setIssuer(rs.getString("ISSUER"));
							taskReport.setArchCreateTime(rs.getDate("ARCH_CREATE_TIME"));
							taskReport.setSendTime(rs.getDate("SEND_TIME"));
							taskReport.setIsReply(rs.getInt("IS_REPLY"));
							taskReport.setArchivesNo(rs.getString("ARCHIVES_NO"));
							taskReport.setOrgdepName(rs.getString("ORGDEP_NAME"));
							taskReport.setIssuedep(rs.getString("ISSUEDEP"));
							taskReport.setCurDepId(rs.getLong("CUR_DEP_ID"));
							taskReport.setCurDepName(rs.getString("CUR_DEP_NAME"));
							taskReport.setFlowName(rs.getString("FLOW_NAME"));
							taskReport.setDataValue(rs.getString("DATA_VALUE"));
							taskReport.setCreatorDepId(rs.getLong("CREATOR_DEP_ID"));
							taskReport.setCreatorDepName(rs.getString("CREATOR_DEP_NAME"));
							taskReport.setPiid(rs.getString("PIID"));
							taskReport.setStatus(toDoType);
							taskReport.setPreDepId(rs.getLong("PRE_DEP_ID"));
							taskReport.setPreDepName(rs.getString("PRE_DEP_NAME"));
							taskReportList.add(taskReport);
							i++;
						}
						rs.close();
						System.out.print("------------2222--------------"+new Date());
						return taskReportList;
					}
				});
		return resultList;
	}

	public String getPreTaskInfo(Long taskId,Long runId){
		String result="";
		StringBuffer sql=new StringBuffer("");
		sql.append(" SELECT creatorid || ';' || creatorname || ';' || activityname||','||processType|| ';'||depid || ';'||depname ");
		sql.append(" FROM ( ");
		sql.append("     SELECT creatorid, creatorname, activityname ,1 orderid,PF.formid formid,'并发流程' processType,d.depid,d.depname ");
		sql.append("     FROM OA.PROCESS_FORM_NEXT_TASK pfnt,OA.PROCESS_FORM pf,OA.APP_USER au,OA.DEPARTMENT d ");
		sql.append("     WHERE pfnt.FORMID=pf.FORMID AND AU.USERID=PF.CREATORID AND AU.DEPID=d.DEPID AND pfnt.TASKID="+taskId);
		sql.append("     UNION ");
		sql.append("     SELECT   creatorid, creatorname, activityname,2 orderid,formid,'通用流程' processType,d.depid,d.depname ");
		sql.append("     FROM OA.process_form pf,OA.APP_USER au,OA.DEPARTMENT d ");
		sql.append("     WHERE AU.USERID=PF.CREATORID AND AU.DEPID=d.DEPID AND runid = "+runId);
		sql.append("     ORDER BY orderid asc, formid DESC ");
		sql.append(" ) ");
		sql.append(" WHERE ROWNUM < 2 ");
		result=(String) this.jdbcTemplate.queryForObject(sql.toString(),String.class);
		return result;
	}
	public List<FlowTaskReport> getDoingFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize,final String orgDepId,final String archiveNo,final Long signId,final String depSignNo,final String issuerName,final Long issuerDepid,final String assignUserName) {
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		AppUser appUser=ContextUtil.getCurrentUser();
		if(null != appUser){
			if(!StringUtils.isBlank(appUser.getOwnerSchema()))
				schema = appUser.getOwnerSchema()+".";
		}
		
        StringBuffer sql=new StringBuffer("");
        sql.append(" SELECT ROW_NUMBER() OVER (ORDER BY PR.CREATETIME DESC) rn,");
        sql.append(" pr.defid def_id, pr.runid run_id, jt.dbid_ task_id, jt.name_ task_name, ");
		sql.append(" jt.activity_name_ activityname, ar.subject run_subject, jt.assignee_ assign_user_id,AU.FULLNAME assign_user_name, ");
		sql.append(" ar.archivesid archive_id, ar.issuerid issuer_id, ar.issuer issuer, ");
		sql.append(" ar.createtime arch_create_time, to_number(nvl(ar.arch_checker,0)) is_reply,to_number(nvl(arch_printer,0)) is_end, ");
		sql.append(" ar.archivesno archives_no, ar.orgdep_name orgdep_name, ");
		sql.append(" d.depid cur_dep_id, d.depname cur_dep_name, ");
		sql.append(" dep.depid creator_dep_id, dep.depname creator_dep_name, ");
		sql.append(" ar.issuedep issuedep, pd.NAME flow_name, pr.piid piid, ar.limited_date limited_date, ");
		sql.append(" ar.sign_date sign_date, ar.content_format content_format, jt.create_ task_create_date ");
		sql.append(" FROM "+schema+"PROCESS_RUN PR  ");
		sql.append(" JOIN "+schema+"ARCHIVES AR ON PR.RUNID=AR.PROCESS_INS_ID ");
		sql.append(" JOIN "+schema+"JBPM4_EXECUTION JE ON JE.ID_=PR.PIID ");
		sql.append(" JOIN "+schema+"JBPM4_TASK JT ON JE.DBID_=JT.PROCINST_ ");
		sql.append(" JOIN "+schema+"APP_USER AU ON AU.USERID=JT.ASSIGNEE_ ");
		sql.append(" JOIN "+schema+"DEPARTMENT D ON AU.DEPID=D.DEPID ");
		sql.append(" JOIN "+schema+"APP_USER AU2 ON AU2.USERID=AR.ISSUERID ");
		sql.append(" JOIN "+schema+"DEPARTMENT DEP ON AU2.DEPID=DEP.DEPID ");
		sql.append(" JOIN "+schema+"PRO_DEFINITION PD ON PR.DEFID = PD.DEFID ");
		sql.append(" WHERE PR.RUNSTATUS=1 AND PR.RUNID IN( ");
		sql.append(" 	SELECT RUNID FROM "+schema+"PROCESS_FORM WHERE CREATORID="+userId);
		sql.append(" ) ");
		sql.append(" AND AR.ARCHTYPE= "+archiveType);
		if(!StringUtil.isEmpty(subject)){
			sql.append(" AND ar.subject LIKE '%"+subject+"%'");
		}
		if(!StringUtil.isEmpty(archiveNo)){
			sql.append(" AND ar.archivesno LIKE '%"+archiveNo+"%'");
		}
		if(!StringUtil.isEmpty(depName)){
			sql.append(" AND ar.issuedep LIKE '%"+depName+"%'");
		}
		if(!StringUtil.isEmpty(depSignNo)){
			sql.append(" AND ar.depsignno LIKE '%"+depSignNo+"%'");
		}
		if(!StringUtil.isEmpty(startDate)){
			sql.append(" AND TO_CHAR(pr.createtime,'yyyy-MM-dd')>='"+startDate+"'");
		}
		if(!StringUtil.isEmpty(endDate)){
			sql.append(" AND TO_CHAR(pr.createtime,'yyyy-MM-dd')<='"+endDate+"'");
		}
		if(!StringUtil.isEmpty(assignUserName)){
			sql.append(" AND AU.FULLNAME LIKE '%"+assignUserName+"%'");
		}
		if(!StringUtil.isEmpty(orgDepId)){
			sql.append(" AND ar.orgdep_id = '"+orgDepId+"'");
		}
		if(signId!=null){
			sql.append(" AND ar.sn_config_id = "+signId);
		}
		if(defId!=null){
			sql.append(" AND pd.defid = "+defId);
		}
		sql.append(" ORDER BY PR.CREATETIME DESC ");
        StringBuffer selectSql=new StringBuffer("");
        selectSql.append(" SELECT * FROM ( ");
        selectSql.append(sql.toString());
        selectSql.append(" ) WHERE RN BETWEEN "+(currentPage+1)+" AND "+(currentPage+pageSize)+" ");
        StringBuffer countSql=new StringBuffer(""); 
        countSql.append(" SELECT COUNT(1) FROM ( ");
        countSql.append(sql.toString());
        countSql.append(" ) a");
        int totalCounts=this.jdbcTemplate.queryForInt(countSql.toString());
		Collection<FlowTaskReport> ftr =(Collection) this.jdbcTemplate.query(selectSql.toString(),
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						FlowTaskReport taskReport=new FlowTaskReport();
						taskReport.setDefId(rs.getLong("DEF_ID"));
						taskReport.setRunId(rs.getLong("RUN_ID"));
						taskReport.setTaskId(rs.getLong("TASK_ID"));
						taskReport.setTaskName(rs.getString("TASK_NAME"));
						taskReport.setActivityname(rs.getString("ACTIVITYNAME"));
						taskReport.setRunSubject(rs.getString("RUN_SUBJECT"));
						taskReport.setAssignUserId(rs.getLong("ASSIGN_USER_ID"));
						taskReport.setAssignUserName(rs.getString("ASSIGN_USER_NAME"));
						taskReport.setArchiveId(rs.getLong("ARCHIVE_ID"));
						taskReport.setIssuerId(rs.getLong("ISSUER_ID"));
						taskReport.setIssuer(rs.getString("ISSUER"));
						taskReport.setArchCreateTime(rs.getDate("ARCH_CREATE_TIME"));
						taskReport.setSignDate(rs.getDate("SIGN_DATE"));
//						taskReport.setSendTime(rs.getDate("SEND_TIME"));
						taskReport.setIsReply(rs.getInt("IS_REPLY"));
//						taskReport.setIsEnd(rs.getInt("IS_END"));
						taskReport.setArchivesNo(rs.getString("ARCHIVES_NO"));
						taskReport.setOrgdepName(rs.getString("ORGDEP_NAME"));
						taskReport.setIssuedep(rs.getString("ISSUEDEP"));
						taskReport.setCurDepId(rs.getLong("CUR_DEP_ID"));
						taskReport.setCurDepName(rs.getString("CUR_DEP_NAME"));
						taskReport.setFlowName(rs.getString("FLOW_NAME"));
						taskReport.setCreatorDepId(rs.getLong("CREATOR_DEP_ID"));
						taskReport.setCreatorDepName(rs.getString("CREATOR_DEP_NAME"));
						taskReport.setPiid(rs.getString("PIID"));
						taskReport.setIsComSetting(rs.getLong("CONTENT_FORMAT"));
						taskReport.setStatus(toDoType);
						if(archiveType == 5 || archiveType == 6){//会议通知和工作通知获取时分秒
							taskReport.setLimitedDate(rs.getTimestamp("LIMITED_DATE"));
						}else{
							taskReport.setLimitedDate(rs.getDate("LIMITED_DATE"));
						}
						return taskReport;
					}
				}
		);
		List<FlowTaskReport> resultList=new ArrayList(ftr);
		if(resultList!=null&&resultList.size()>0){
			resultList.get(0).setTotalCounts(totalCounts);
		}
		return resultList;
	}
	/**
	 * 获取收发文待办及在办件
	 */
	public List<FlowTaskReport> getNewFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize,final String orgDepId,final String archiveNo,final Long signId,final String depSignNo,final String issuerName,final Long issuerDepid,final String assignUserName) {
		List<FlowTaskReport> resultList = (List<FlowTaskReport>) jdbcTemplate
				.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+ schemaName + "archives_manage_pg.get_flow_todolist_all(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";// 调用的sql
//						String storedProc = null;
//						if (toDoType == 5&& archiveType == 1) { //只针对收文在办件合并，重新写的存储过程
//							storedProc = "{call "+ schemaName + "archives_manage_pg_group.get_flow_todolist_all(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";// 调用的sql
//						} else if (toDoType == -1 && archiveType == 1) { //只针对收文分发合并，重新写的存储过程
//							storedProc = "{call "+ schemaName + "archives_manage_pg_send.get_flow_todolist_all(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";// 调用的sql
//						}else{ //通用存储过程
//						    storedProc = "{call "+ schemaName + "archives_manage_pg.get_flow_todolist_all(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";// 调用的sql
//						}
						CallableStatement cs = con.prepareCall(storedProc);
						if (null == userId)
							cs.setNull(1, java.sql.Types.BIGINT);
						else
							cs.setLong(1, userId); // 登录用户
						cs.setInt(2, toDoType);// --查询类别0：待办件1：在办件
						cs.setInt(3, archiveType);// 文档类别0：发文 ,1：收文, 3：外来会议
						
						/*author yanbo start*/
						if(!"".equals(subject) && null != subject){
							/*多个关键字组合成一个字符串 模糊查询 中间空格处理*/
							String[] list = subject.split(" ");
							String subjects = "%";
							for(int i=0; i<list.length;i++){
								subjects += list[i]+"%";
							}
							cs.setString(4, subjects);// -- 主题
						} else{
							cs.setString(4, subject);// -- 主题
						}
						/*author yanbo end*/
					
						cs.setString(5, depName);// 发文单位
						if (null == defId)
							cs.setNull(6, java.sql.Types.BIGINT);
						else
							cs.setLong(6, defId);// --流程编号
						cs.setString(7, startDate);// --开始时间
						cs.setString(8, endDate);// --结束时间
						cs.setInt(9, currentPage);
						cs.setInt(10, pageSize);
						cs.setString(11, orgDepId);
						cs.setString(12, archiveNo);
						if (null == signId)
							cs.setNull(13, java.sql.Types.BIGINT);
						else
							cs.setLong(13, signId);
						cs.setString(14, depSignNo);
						cs.setString(15, issuerName);
						if (null == issuerDepid)
							cs.setNull(16, java.sql.Types.BIGINT);
						else
							cs.setLong(16, issuerDepid);
						cs.setString(17, assignUserName);
						cs.registerOutParameter(18, java.sql.Types.INTEGER);
						cs.registerOutParameter(19,
								oracle.jdbc.OracleTypes.CURSOR);
						System.out.println("------------userId--------------"+userId);
						System.out.println("------------toDoType--------------"+toDoType);
						System.out.println("------------archiveType--------------"+archiveType);
						System.out.println("------------subject--------------"+subject);
						System.out.println("------------depName--------------"+depName);
						System.out.println("------------defId--------------"+defId);
						System.out.println("------------startDate--------------"+startDate);
						System.out.println("------------endDate--------------"+endDate);
						System.out.println("------------currentPage--------------"+currentPage);
						System.out.println("------------pageSize--------------"+pageSize);
						System.out.println("------------orgDepId--------------"+orgDepId);
						System.out.println("------------archiveNo--------------"+archiveNo);
						System.out.println("------------signId--------------"+signId);
						System.out.println("------------depSignNo--------------"+depSignNo);
						System.out.println("------------issuerName--------------"+issuerName);
						System.out.println("------------issuerDepid--------------"+issuerDepid);
						System.out.println("------------assignUserName--------------"+assignUserName);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List<FlowTaskReport> taskReportList = new ArrayList<FlowTaskReport>();
						cs.execute();
						int totalCounts  = Integer.parseInt(cs.getObject(18).toString());
						ResultSet rs = (ResultSet) cs.getObject(19);
						int i = 0;
						while (rs.next()) {// 转换每行的返回值到Map中
							FlowTaskReport taskReport = new FlowTaskReport();
							if(i == 0)
								taskReport.setTotalCounts(totalCounts);
							taskReport.setDefId(rs.getLong("DEF_ID"));
							taskReport.setRunId(rs.getLong("RUN_ID"));
							taskReport.setTaskId(rs.getLong("TASK_ID"));
							taskReport.setTaskName(rs.getString("TASK_NAME"));
							taskReport.setActivityname(rs.getString("ACTIVITYNAME"));
							taskReport.setRunSubject(rs.getString("RUN_SUBJECT"));
							taskReport.setAssignUserId(rs.getLong("ASSIGN_USER_ID"));
							taskReport.setAssignUserName(rs.getString("ASSIGN_USER_NAME"));
							taskReport.setArchiveId(rs.getLong("ARCHIVE_ID"));
							taskReport.setIssuerId(rs.getLong("ISSUER_ID"));
							taskReport.setIssuer(rs.getString("ISSUER"));
							taskReport.setArchCreateTime(rs.getDate("ARCH_CREATE_TIME"));
							
							taskReport.setSignDate(rs.getDate("SIGN_DATE"));
							
							taskReport.setSendTime(rs.getDate("SEND_TIME"));
							taskReport.setIsReply(rs.getInt("IS_REPLY"));
//							taskReport.setIsEnd(rs.getInt("IS_END"));
							taskReport.setArchivesNo(rs.getString("ARCHIVES_NO"));
							taskReport.setOrgdepName(rs.getString("ORGDEP_NAME"));
							taskReport.setIssuedep(rs.getString("ISSUEDEP"));
							taskReport.setCurDepId(rs.getLong("CUR_DEP_ID"));
							taskReport.setCurDepName(rs.getString("CUR_DEP_NAME"));
							taskReport.setFlowName(rs.getString("FLOW_NAME"));
							taskReport.setCreatorDepId(rs.getLong("CREATOR_DEP_ID"));
							taskReport.setCreatorDepName(rs.getString("CREATOR_DEP_NAME"));
							taskReport.setPiid(rs.getString("PIID"));
							taskReport.setIsComSetting(rs.getLong("CONTENT_FORMAT"));
							String preTask = rs.getString("PRE_TASK");
							if (StringUtils.isNotEmpty(preTask)) {
								String[] preTaskInfos = preTask.split(";");
								String[] processInfos=preTaskInfos[2].split(",");
								taskReport.setPreActivityname(processInfos[0]);
								if(processInfos.length>1&&processInfos[1]!=null&&"并发流程".equals(processInfos[1])){
									taskReport.setIsEnd(1);
								}else{
									taskReport.setIsEnd(0);
								}
								taskReport.setPreDepName(preTaskInfos[4]);
								taskReport.setPreUserName(preTaskInfos[1]);
								if (null != preTaskInfos[0]
										&& preTaskInfos[0] != "") {
									taskReport.setPreUserId(Long
											.parseLong(preTaskInfos[0]));
								}
								if (null != preTaskInfos[3]
										&& preTaskInfos[3] != "") {
									taskReport.setPreDepId(Long
											.parseLong(preTaskInfos[3]));
								}
							}
							taskReport.setStatus(rs.getInt("STATUS"));
							if(archiveType == 5 || archiveType == 6){//会议通知和工作通知获取时分秒
								taskReport.setLimitedDate(rs.getTimestamp("LIMITED_DATE"));
							}else{
								taskReport.setLimitedDate(rs.getDate("LIMITED_DATE"));
							}
							taskReportList.add(taskReport);
							i++;
						}
						rs.close();
						return taskReportList;
					}
				});
		System.out.println("------------end--------------"+new Date());
		return resultList;
	}

	@Override
	public List<FlowTaskReport> getNewFlowTaskListDetail(final Long runId,
			final Long userId, final int archiveType, final int currentPage, final int pageSize) {
		List<FlowTaskReport> resultList = (List<FlowTaskReport>) jdbcTemplate
				.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = storedProc = "{call "+ schemaName + "archives_manage_pg_group.get_flow_todolist_detail(?,?,?,?,?,?,?)}";// 调用的sql
						CallableStatement cs = con.prepareCall(storedProc);
						if (null == runId)
							cs.setNull(1, java.sql.Types.BIGINT);
						else
							cs.setLong(1, runId); // runId
						if (null == userId)
							cs.setNull(2, java.sql.Types.BIGINT);
						else
							cs.setLong(2, userId); // 登录用户
						cs.setInt(3, archiveType);// 文档类别0：发文 ,1：收文, 3：外来会议
						cs.setInt(4, currentPage);
						cs.setInt(5, pageSize);
						cs.registerOutParameter(6, java.sql.Types.INTEGER);
						cs.registerOutParameter(7,
								oracle.jdbc.OracleTypes.CURSOR);
						System.out.println("------------runId--------------"+runId);
						System.out.println("------------userId--------------"+userId);
						System.out.println("------------archiveType--------------"+archiveType);
						System.out.println("------------currentPage--------------"+currentPage);
						System.out.println("------------pageSize--------------"+pageSize);
						return cs;
					}
				}, new CallableStatementCallback() {
					@SuppressWarnings("unchecked")
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List<FlowTaskReport> taskReportList = new ArrayList<FlowTaskReport>();
						cs.execute();
						int totalCounts  = Integer.parseInt(cs.getObject(6).toString());
						ResultSet rs = (ResultSet) cs.getObject(7);
						int i = 0;
						while (rs.next()) {// 转换每行的返回值到Map中
							FlowTaskReport taskReport = new FlowTaskReport();
							if(i == 0)
								taskReport.setTotalCounts(totalCounts);
							taskReport.setDefId(rs.getLong("DEF_ID"));
							taskReport.setRunId(rs.getLong("RUN_ID"));
							taskReport.setTaskId(rs.getLong("TASK_ID"));
							taskReport.setActivityname(rs.getString("ACTIVITYNAME"));
							taskReport.setRunSubject(rs.getString("RUN_SUBJECT"));
							taskReport.setAssignUserId(rs.getLong("ASSIGN_USER_ID"));
							taskReport.setAssignUserName(rs.getString("ASSIGN_USER_NAME"));
							taskReport.setArchiveId(rs.getLong("ARCHIVE_ID"));
							taskReport.setIssuerId(rs.getLong("ISSUER_ID"));
							taskReport.setIssuer(rs.getString("ISSUER"));
							taskReport.setArchCreateTime(rs.getDate("ARCH_CREATE_TIME"));
							taskReport.setArchivesNo(rs.getString("ARCHIVES_NO"));
							taskReport.setOrgdepName(rs.getString("ORGDEP_NAME"));
							taskReport.setIssuedep(rs.getString("ISSUEDEP"));
							taskReport.setFlowName(rs.getString("FLOW_NAME"));
							taskReport.setPiid(rs.getString("PIID"));
							taskReport.setLimitedDate(rs.getDate("LIMITED_DATE"));
							taskReport.setSignDate(rs.getDate("SIGN_DATE"));
							taskReport.setIsComSetting(rs.getLong("CONTENT_FORMAT"));
							taskReport.setStandardApprover(rs.getString("STANDARD_APPROVER"));
							taskReport.setStandardApproveDate(rs.getDate("STANDARD_APPROVE_DATE"));
							
							taskReport.setSendTime(rs.getDate("SEND_TIME"));
							taskReport.setIsReply(rs.getInt("IS_REPLY"));
							taskReport.setCurDepId(rs.getLong("CUR_DEP_ID"));
							taskReport.setCurDepName(rs.getString("CUR_DEP_NAME"));
							taskReport.setCreatorDepId(rs.getLong("CREATOR_DEP_ID"));
							taskReport.setCreatorDepName(rs.getString("CREATOR_DEP_NAME"));
//							String preTask = rs.getString("PRE_TASK");
//							if (StringUtils.isNotEmpty(preTask)) {
//								String[] preTaskInfos = preTask.split(";");
//								taskReport.setPreActivityname(preTaskInfos[2]);
//								taskReport.setPreDepName(preTaskInfos[4]);
//								taskReport.setPreUserName(preTaskInfos[1]);
//								if (null != preTaskInfos[0]
//										&& preTaskInfos[0] != "") {
//									taskReport.setPreUserId(Long
//											.parseLong(preTaskInfos[0]));
//								}
//								if (null != preTaskInfos[3]
//										&& preTaskInfos[3] != "") {
//									taskReport.setPreDepId(Long
//											.parseLong(preTaskInfos[3]));
//								}
//							}
							taskReport.setStatus(rs.getInt("STATUS"));
							
							taskReportList.add(taskReport);
							i++;
						}
						rs.close();
						return taskReportList;
					}
				});
		System.out.println("------------end--------------"+new Date());
		return resultList;
	}
	@Override
	public List<Map<String, Object>> getOfficeMeetingTimes(String subject, String timesId,
			int currentPage, int pageSize) {
		String schame = "";
		if(null != ContextUtil.getCurrentUser()){
			schame = ContextUtil.getCurrentUser().getOwnerSchema() + '.';
		}
		StringBuffer sql=new StringBuffer("");
		sql.append("SELECT ROW_NUMBER() OVER (ORDER BY ar.createtime DESC) rn,T.*,AR.*,MT.* FROM " + schame + "ARCHIVES AR ");
		sql.append("LEFT JOIN " + schame + "MEETING_TIMES MT ON MT.TIMESID = AR.KEYWORDS ");
		sql.append("LEFT JOIN (select NVL(JV.LONG_VALUE_,'')||NVL(JV.STRING_VALUE_,'') AS currentStep,pr.RUNID,pr.DEFID,jt.activity_name_,jt.dbid_ as taskId ");
		sql.append("from " + schame + "JBPM4_VARIABLE JV ");
		sql.append("left JOIN " + schame + "JBPM4_EXECUTION JE ON JV.EXECUTION_=JE.DBID_ ");
		sql.append("left JOIN " + schame + "PROCESS_RUN PR ON PR.PIID=JE.ID_ ");
		sql.append("left JOIN " + schame + "JBPM4_TASK JT ON JT.execution_=JE.dbid_ ");
		sql.append("where JV.KEY_='currentStep') T ON T.RUNID = AR.PROCESS_INS_ID ");
		sql.append("WHERE AR.ARCHTYPE = 7 AND AR.STATUS = 1 and T.CURRENTSTEP > 3");
		if(StringUtils.isNotEmpty(subject)){
			sql.append(" and ar.subject like '%" + subject + "%'");
		}
		if(StringUtils.isNotEmpty(timesId)){
			sql.append(" and mt.timesId = " + timesId);
		}
		sql.append(" order by mt.timesId desc, ar.urgentLevel, t.CURRENTSTEP");
		StringBuffer selectSql=new StringBuffer("");
        selectSql.append(" SELECT * FROM ( ");
        selectSql.append(sql.toString());
        selectSql.append(" ) WHERE RN BETWEEN "+(currentPage+1)+" AND "+(currentPage+pageSize)+" ");
		StringBuffer countSql=new StringBuffer(""); 
        countSql.append(" SELECT COUNT(1) FROM ( ");
        countSql.append(sql.toString());
        countSql.append(" ) a");
        int totalCounts=this.jdbcTemplate.queryForInt(countSql.toString());
        Collection<Map<String, Object>> ftr =(Collection) this.jdbcTemplate.query(selectSql.toString(),
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						Map<String, Object> officeMeeting=new HashMap<String, Object>();
						officeMeeting.put("ARCHIVESID", rs.getLong("ARCHIVESID"));
						officeMeeting.put("SUBJECT", rs.getString("SUBJECT"));
						officeMeeting.put("ISSUEDEP", rs.getString("ISSUEDEP"));
						officeMeeting.put("CURRENTSTEP", rs.getString("CURRENTSTEP"));
						officeMeeting.put("ISSUER", rs.getString("ISSUER"));
						officeMeeting.put("STATUS", rs.getLong("STATUS"));
						officeMeeting.put("YEAR", rs.getLong("YEAR"));
						officeMeeting.put("TIMES", rs.getLong("TIMES"));
						officeMeeting.put("RUNID", rs.getLong("RUNID"));
						officeMeeting.put("DEFID", rs.getLong("DEFID"));
						officeMeeting.put("TASKID", rs.getLong("TASKID"));
						officeMeeting.put("PROCESS_INS_ID", rs.getLong("PROCESS_INS_ID"));
						officeMeeting.put("URGENTLEVEL", rs.getString("URGENTLEVEL"));
						officeMeeting.put("ACTIVITY_NAME", rs.getString("ACTIVITY_NAME_"));
						officeMeeting.put("PRIVACYLEVEL", rs.getString("PRIVACYLEVEL"));
						return officeMeeting;
					}
				}
		);
		List<Map<String, Object>> resultList=new ArrayList(ftr);
		if(resultList!=null&&resultList.size()>0){
			resultList.get(0).put("totalCounts", totalCounts);
		}
		return resultList;
	}

	@Override
	public List<Map<String, Object>> OfficeMeetingWleaderlist(String subject, String timesId,
			int currentPage, int pageSize) {
		String schame = "";
		if(null != ContextUtil.getCurrentUser()){
			schame = ContextUtil.getCurrentUser().getOwnerSchema() + '.';
		}
		StringBuffer sql=new StringBuffer("");
		sql.append("SELECT ROW_NUMBER() OVER (ORDER BY ar.createtime DESC) rn,T.*,AR.*,MT.* FROM " + schame + "ARCHIVES AR ");
		sql.append("LEFT JOIN " + schame + "MEETING_TIMES MT ON MT.TIMESID = AR.KEYWORDS ");
		sql.append("LEFT JOIN (select NVL(JV.LONG_VALUE_,'')||NVL(JV.STRING_VALUE_,'') AS currentStep,pr.RUNID,pr.DEFID,jt.activity_name_,jt.dbid_ as taskId ");
		sql.append("from " + schame + "JBPM4_VARIABLE JV ");
		sql.append("left JOIN " + schame + "JBPM4_EXECUTION JE ON JV.EXECUTION_=JE.DBID_ ");
		sql.append("left JOIN " + schame + "PROCESS_RUN PR ON PR.PIID=JE.ID_ ");
		sql.append("left JOIN " + schame + "JBPM4_TASK JT ON JT.execution_=JE.dbid_ ");
		sql.append("where JV.KEY_='currentStep') T ON T.RUNID = AR.PROCESS_INS_ID ");
		sql.append("WHERE AR.ARCHTYPE = 7 AND AR.STATUS = 1 and T.CURRENTSTEP = 6");
		if(StringUtils.isNotEmpty(subject)){
			sql.append(" and ar.subject like '%" + subject + "%'");
		}
		if(StringUtils.isNotEmpty(timesId)){
			sql.append(" and mt.timesId = " + timesId);
		}
		sql.append(" order by mt.timesId desc, ar.urgentLevel, t.CURRENTSTEP");
		StringBuffer selectSql=new StringBuffer("");
		selectSql.append(" SELECT * FROM ( ");
		selectSql.append(sql.toString());
		selectSql.append(" ) WHERE RN BETWEEN "+(currentPage+1)+" AND "+(currentPage+pageSize)+" ");
		StringBuffer countSql=new StringBuffer(""); 
		countSql.append(" SELECT COUNT(1) FROM ( ");
		countSql.append(sql.toString());
		countSql.append(" ) a");
		int totalCounts=this.jdbcTemplate.queryForInt(countSql.toString());
		Collection<Map<String, Object>> ftr =(Collection) this.jdbcTemplate.query(selectSql.toString(),
				new RowMapper() {
			@Override
			public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
				Map<String, Object> officeMeeting=new HashMap<String, Object>();
				officeMeeting.put("ARCHIVESID", rs.getLong("ARCHIVESID"));
				officeMeeting.put("SUBJECT", rs.getString("SUBJECT"));
				officeMeeting.put("ISSUEDEP", rs.getString("ISSUEDEP"));
				officeMeeting.put("CURRENTSTEP", rs.getString("CURRENTSTEP"));
				officeMeeting.put("ISSUER", rs.getString("ISSUER"));
				officeMeeting.put("STATUS", rs.getLong("STATUS"));
				officeMeeting.put("YEAR", rs.getLong("YEAR"));
				officeMeeting.put("TIMES", rs.getLong("TIMES"));
				officeMeeting.put("RUNID", rs.getLong("RUNID"));
				officeMeeting.put("DEFID", rs.getLong("DEFID"));
				officeMeeting.put("TASKID", rs.getLong("TASKID"));
				officeMeeting.put("PROCESS_INS_ID", rs.getLong("PROCESS_INS_ID"));
				officeMeeting.put("URGENTLEVEL", rs.getString("URGENTLEVEL"));
				officeMeeting.put("ACTIVITY_NAME", rs.getString("ACTIVITY_NAME_"));
				officeMeeting.put("PRIVACYLEVEL", rs.getString("PRIVACYLEVEL"));
				return officeMeeting;
			}
		}
				);
		List<Map<String, Object>> resultList=new ArrayList(ftr);
		if(resultList!=null&&resultList.size()>0){
			resultList.get(0).put("totalCounts", totalCounts);
		}
		return resultList;
	}

	@Override
	public List<Map<String, Object>> OfficeMeetingBGSZRlist(String subject, String timesId,
			int currentPage, int pageSize) {
		String schame = "";
		if(null != ContextUtil.getCurrentUser()){
			schame = ContextUtil.getCurrentUser().getOwnerSchema() + '.';
		}
		StringBuffer sql=new StringBuffer("");
		sql.append("SELECT ROW_NUMBER() OVER (ORDER BY ar.createtime DESC) rn,T.*,AR.*,MT.* FROM " + schame + "ARCHIVES AR ");
		sql.append("LEFT JOIN " + schame + "MEETING_TIMES MT ON MT.TIMESID = AR.KEYWORDS ");
		sql.append("LEFT JOIN (select NVL(JV.LONG_VALUE_,'')||NVL(JV.STRING_VALUE_,'') AS currentStep,pr.RUNID,pr.DEFID,jt.activity_name_,jt.dbid_ as taskId ");
		sql.append("from " + schame + "JBPM4_VARIABLE JV ");
		sql.append("left JOIN " + schame + "JBPM4_EXECUTION JE ON JV.EXECUTION_=JE.DBID_ ");
		sql.append("left JOIN " + schame + "PROCESS_RUN PR ON PR.PIID=JE.ID_ ");
		sql.append("left JOIN " + schame + "JBPM4_TASK JT ON JT.execution_=JE.dbid_ ");
		sql.append("where JV.KEY_='currentStep') T ON T.RUNID = AR.PROCESS_INS_ID ");
		sql.append("WHERE AR.ARCHTYPE = 7 AND AR.STATUS = 1 and T.CURRENTSTEP = 5");
		if(StringUtils.isNotEmpty(subject)){
			sql.append(" and ar.subject like '%" + subject + "%'");
		}
		if(StringUtils.isNotEmpty(timesId)){
			sql.append(" and mt.timesId = " + timesId);
		}
		sql.append(" order by mt.timesId desc, ar.urgentLevel, t.CURRENTSTEP");
		StringBuffer selectSql=new StringBuffer("");
		selectSql.append(" SELECT * FROM ( ");
		selectSql.append(sql.toString());
		selectSql.append(" ) WHERE RN BETWEEN "+(currentPage+1)+" AND "+(currentPage+pageSize)+" ");
		StringBuffer countSql=new StringBuffer(""); 
		countSql.append(" SELECT COUNT(1) FROM ( ");
		countSql.append(sql.toString());
		countSql.append(" ) a");
		int totalCounts=this.jdbcTemplate.queryForInt(countSql.toString());
		Collection<Map<String, Object>> ftr =(Collection) this.jdbcTemplate.query(selectSql.toString(),
				new RowMapper() {
			@Override
			public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
				Map<String, Object> officeMeeting=new HashMap<String, Object>();
				officeMeeting.put("ARCHIVESID", rs.getLong("ARCHIVESID"));
				officeMeeting.put("SUBJECT", rs.getString("SUBJECT"));
				officeMeeting.put("ISSUEDEP", rs.getString("ISSUEDEP"));
				officeMeeting.put("CURRENTSTEP", rs.getString("CURRENTSTEP"));
				officeMeeting.put("ISSUER", rs.getString("ISSUER"));
				officeMeeting.put("STATUS", rs.getLong("STATUS"));
				officeMeeting.put("YEAR", rs.getLong("YEAR"));
				officeMeeting.put("TIMES", rs.getLong("TIMES"));
				officeMeeting.put("RUNID", rs.getLong("RUNID"));
				officeMeeting.put("DEFID", rs.getLong("DEFID"));
				officeMeeting.put("TASKID", rs.getLong("TASKID"));
				officeMeeting.put("PROCESS_INS_ID", rs.getLong("PROCESS_INS_ID"));
				officeMeeting.put("URGENTLEVEL", rs.getString("URGENTLEVEL"));
				officeMeeting.put("ACTIVITY_NAME", rs.getString("ACTIVITY_NAME_"));
				officeMeeting.put("PRIVACYLEVEL", rs.getString("PRIVACYLEVEL"));
				return officeMeeting;
			}
		}
				);
		List<Map<String, Object>> resultList=new ArrayList(ftr);
		if(resultList!=null&&resultList.size()>0){
			resultList.get(0).put("totalCounts", totalCounts);
		}
		return resultList;
	}

}
