package com.gdssoft.oa.dao.meetingNotice.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.RowMapper;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.meetingNotice.MeetingNoticeDao;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.meetingNotice.MeetingNotice;
import com.gdssoft.oa.model.meetingNotice.MeetingNoticeToDo;

public class MeetingNoticeDaoImpl extends BaseDaoImpl<MeetingNotice> implements MeetingNoticeDao{

	public MeetingNoticeDaoImpl() {
		super(MeetingNotice.class);
	}

	@Override
	public MeetingNotice updateRunId(MeetingNotice meetingNotice) {
		String hql = "update MeetingNotice mn set mn.runId=:runId where mn.noticeId=:noticeId";
		Query q = this.getSession().createQuery(hql).setParameter("runId", meetingNotice.getRunId()).setParameter("noticeId", meetingNotice.getNoticeId());
		return q.executeUpdate()>0?meetingNotice:null;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MeetingNoticeToDo> getNewFlowTaskList(final Long userId,
			final int toDoType,final String subject,final String holdDep,
			final String startDate,final String endDate,final int start,final int size) {
		
		List<MeetingNoticeToDo> resultList = (List<MeetingNoticeToDo>) jdbcTemplate
				.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+schemaName+"meeting_notice_pg.get_meeting_todolist_all(?,?,?,?,?,?,?,?,?,?)}";
						CallableStatement cs = con.prepareCall(storedProc);
						
						if (null == userId){
							cs.setNull(1, java.sql.Types.BIGINT);
						}else{
							cs.setLong(1, userId);
						}
						
						cs.setInt(2, toDoType);
						cs.setString(3, subject);
						cs.setString(4, holdDep);
						cs.setString(5, startDate);
						cs.setString(6, endDate);
						cs.setInt(7, start);
						cs.setInt(8, size);
						cs.registerOutParameter(9, java.sql.Types.INTEGER);
						cs.registerOutParameter(10,oracle.jdbc.OracleTypes.CURSOR);
						return cs;
					}
				}, new CallableStatementCallback() {
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List<MeetingNoticeToDo> taskReportList = new ArrayList<MeetingNoticeToDo>();
						cs.execute();
						int totalCounts  = Integer.parseInt(cs.getObject(9).toString());
						ResultSet rs = (ResultSet) cs.getObject(10);
						int i = 0;
						while (rs.next()) {
							MeetingNoticeToDo taskReport = new MeetingNoticeToDo();
							
							if(i == 0){
								taskReport.setTotalCounts(totalCounts);
							}
							taskReport.setDefId(rs.getLong("DEF_ID"));
							taskReport.setRunId(rs.getLong("RUN_ID"));
							taskReport.setTaskId(rs.getLong("TASK_ID"));
							taskReport.setTaskName(rs.getString("TASK_NAME"));
							taskReport.setFlowName(rs.getString("FLOW_NAME"));
							taskReport.setPiid(rs.getString("PIID"));
							
							taskReport.setActivityName(rs.getString("ACTIVITYNAME"));
							taskReport.setRunSubject(rs.getString("RUN_SUBJECT"));
							taskReport.setRunStatus(rs.getInt("run_status"));
							taskReport.setAssignUserId(rs.getLong("ASSIGN_USER_ID"));
							taskReport.setAssignUserName(rs.getString("ASSIGN_USER_NAME"));
							
							taskReport.setNoticeId(rs.getLong("notice_id"));
							taskReport.setSubject(rs.getString("subject"));
							taskReport.setMeetingDate(rs.getDate("meeting_date",Calendar.getInstance()));
							taskReport.setMeetingPlace(rs.getString("meeting_place"));
							taskReport.setHost(rs.getString("HOST"));
							taskReport.setHoldDep(rs.getString("hold_dep"));
							taskReport.setCurDepId(rs.getLong("cur_dep_id"));
							taskReport.setCurDepName(rs.getString("cur_dep_name"));
							taskReport.setCreator(rs.getString("creator"));
							taskReport.setCreateDep(rs.getString("create_dep"));
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
							
							
							taskReportList.add(taskReport);
							i++;
						}
						rs.close();
						return taskReportList;
					}
				});
		return resultList;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MeetingNoticeToDo> listAttendMeeting(Long userId,
			String subject,String holdDep,
			String startDate,String endDate,int start,int size) {
		String schame = "";
		if(null != ContextUtil.getCurrentUser()){
			schame = ContextUtil.getCurrentUser().getOwnerSchema() + '.';
		}
		StringBuffer sql=new StringBuffer("");
		sql.append("SELECT ROW_NUMBER() OVER (ORDER BY mn.meeting_date DESC) rn,mn.*,pr.subject as runsubject,pr.piid,pr.defid FROM " + schame + "MEETING_NOTICE mn ");
		sql.append("LEFT JOIN " + schame + "PROCESS_RUN pr on PR.RUNID = mn.RUNID ");
		sql.append("left join " + schame + "archives_active aa on aa.archives_id = mn.notice_id ");
		sql.append("left join " + schame + "cq_leaders_activities la on la.active_id = aa.active_id ");
		sql.append("WHERE la.leader_id = " + userId);
		if(StringUtils.isNotEmpty(subject)){
			sql.append(" and mn.subject like '%" + subject + "%'");
		}
		if(StringUtils.isNotEmpty(holdDep)){
			sql.append(" and mn.hold_Dep like '%" + holdDep + "%'");
		}
		sql.append(" order by mn.meeting_date");
		StringBuffer selectSql=new StringBuffer("");
        selectSql.append(" SELECT * FROM ( ");
        selectSql.append(sql.toString());
        selectSql.append(" ) WHERE RN BETWEEN "+(start+1)+" AND "+(start+size)+" ");
		StringBuffer countSql=new StringBuffer(""); 
        countSql.append(" SELECT COUNT(1) FROM ( ");
        countSql.append(sql.toString());
        countSql.append(" ) a");
        final int totalCounts=this.jdbcTemplate.queryForInt(countSql.toString());
        Collection<Map<String, Object>> ftr =(Collection) this.jdbcTemplate.query(selectSql.toString(),
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						MeetingNoticeToDo officeMeeting=new MeetingNoticeToDo();
						
						officeMeeting.setTotalCounts(totalCounts);
						officeMeeting.setDefId(rs.getLong("DEFID"));
						officeMeeting.setRunId(rs.getLong("RUNID"));
						officeMeeting.setPiid(rs.getString("PIID"));
						officeMeeting.setRunSubject(rs.getString("RUNSUBJECT"));
						officeMeeting.setNoticeId(rs.getLong("NOTICE_ID"));
						officeMeeting.setSubject(rs.getString("SUBJECT"));
						officeMeeting.setMeetingDate(rs.getDate("MEETING_DATE",Calendar.getInstance()));
						officeMeeting.setMeetingPlace(rs.getString("MEETING_PLACE"));
						officeMeeting.setHost(rs.getString("HOST"));
						officeMeeting.setHoldDep(rs.getString("HOLD_DEP"));
						officeMeeting.setCreator(rs.getString("CREATOR"));
						officeMeeting.setCreateDep(rs.getString("CREATE_DEP"));
						return officeMeeting;
					}
				}
		);
		List<MeetingNoticeToDo> resultList=new ArrayList(ftr);
		return resultList;
		
	}
}