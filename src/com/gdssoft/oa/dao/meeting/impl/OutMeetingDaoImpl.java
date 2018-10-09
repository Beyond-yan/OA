package com.gdssoft.oa.dao.meeting.impl;
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
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.meeting.OutMeetingDao;
import com.gdssoft.oa.model.meeting.MeetingToDo;
import com.gdssoft.oa.model.meeting.OutMeeting;

public class OutMeetingDaoImpl extends BaseDaoImpl<OutMeeting> implements OutMeetingDao{

	public OutMeetingDaoImpl() {
		super(OutMeeting.class);
	}

	@Override
	public OutMeeting fillRunId(OutMeeting outMeeting) {
//		int i = jdbcTemplate.update("UPDATE OUT_MEETING SET RUN_ID=? WHERE MEETING_ID=?",new Object[]{outMeeting.getRunId(),outMeeting.getMeetingId()});
		String hql = "update OutMeeting om set om.runId=:runId where om.meetingId=:meetingId";
		Query q = this.getSession().createQuery(hql).setParameter("runId", outMeeting.getRunId()).setParameter("meetingId", outMeeting.getMeetingId());
		return q.executeUpdate()>0?outMeeting:null;
//		return q.list().size()>0?outMeeting:null;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MeetingToDo> getNewFlowTaskList(final Long userId,
			final int toDoType,final String meetingName,final String attendUsers,final String holdDep,
			final String startDate,final String endDate,final int start,final int size) {
		
		List<MeetingToDo> resultList = (List<MeetingToDo>) jdbcTemplate
				.execute(new CallableStatementCreator() {
					public CallableStatement createCallableStatement(
							Connection con) throws SQLException {
						String schemaName= "";
						if(null != ContextUtil.getCurrentUser()){
				    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
						}
						String storedProc = "{call "+schemaName+"out_meeting_pg.get_meeting_todolist_all(?,?,?,?,?,?,?,?,?,?)}";
						CallableStatement cs = con.prepareCall(storedProc);
						
						if (null == userId){
							cs.setNull(1, java.sql.Types.BIGINT);
						}else{
							cs.setLong(1, userId);
						}
						
						cs.setInt(2, toDoType);
						cs.setString(3, meetingName);
						cs.setString(4, holdDep);
						cs.setString(5, startDate);
						cs.setString(6, endDate);
						cs.setInt(7, start);
						cs.setInt(8, size);
						cs.registerOutParameter(9, java.sql.Types.INTEGER);
						cs.registerOutParameter(10,oracle.jdbc.OracleTypes.CURSOR);
//						cs.setString(11, attendUsers);//参会人员
//						System.out.println("------userId---------"+userId);
//						System.out.println("------toDoType---------"+toDoType);
//						System.out.println("------meetingName---------"+meetingName);
//						System.out.println("------holdDep---------"+holdDep);
//						System.out.println("------startDate---------"+startDate);
//						System.out.println("------endDate---------"+endDate);
//						System.out.println("------start---------"+start);
//						System.out.println("------size---------"+size);
//						System.out.println("------9---------"+java.sql.Types.INTEGER);
//						System.out.println("------10---------"+oracle.jdbc.OracleTypes.CURSOR);
//						System.out.println("------11---------"+attendUsers);
						return cs;
					}
				}, new CallableStatementCallback() {
					public Object doInCallableStatement(CallableStatement cs)
							throws SQLException, DataAccessException {
						List<MeetingToDo> taskReportList = new ArrayList<MeetingToDo>();
						cs.execute();
						int totalCounts  = Integer.parseInt(cs.getObject(9).toString());
						ResultSet rs = (ResultSet) cs.getObject(10);
						int i = 0;
						while (rs.next()) {
							MeetingToDo taskReport = new MeetingToDo();
							
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
							taskReport.setAssignUn(rs.getString("assign_un"));
							
							taskReport.setMeetingId(rs.getLong("meeting_id"));
							taskReport.setMeetingName(rs.getString("meeting_name"));
							taskReport.setHoldTime(rs.getDate("hold_time",Calendar.getInstance()));
							taskReport.setHoldLocation(rs.getString("hold_location"));
							taskReport.setHost(rs.getString("HOST"));
							taskReport.setHoldDep(rs.getString("hold_dep"));
							taskReport.setAttendLeaders(rs.getString("attend_leaders"));
							taskReport.setAttendOfficers(rs.getString("attend_officers"));
							taskReport.setCurDepId(rs.getLong("cur_dep_id"));
							taskReport.setCurDepName(rs.getString("cur_dep_name"));
							
							
							
							taskReportList.add(taskReport);
							i++;
						}
						rs.close();
						return taskReportList;
					}
				});
		return resultList;
	}
	
	public void autoStopExpiredMeetings() {
		jdbcTemplate.execute(new CallableStatementCreator() {
			public CallableStatement createCallableStatement(Connection con)
					throws SQLException {
				String storedProc = "{call common_pg.auto_stop_expired_meeting}";
				CallableStatement cs = con.prepareCall(storedProc);
				return cs;
			}
		}, new CallableStatementCallback() {
			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException {
				cs.execute();
				return null;
			}

		});

	}

	@Override
	public List<OutMeeting> getPastMeetings() {
		String hql = "select om from OutMeeting om,ProcessRun pr where om.runId = pr.runId and pr.runStatus != 3 and om.holdTime < ?";
		return findByHql(hql,new Object[]{new Date()});
	}

}