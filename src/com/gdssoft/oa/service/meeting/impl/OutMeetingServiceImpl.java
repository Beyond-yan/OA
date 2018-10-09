package com.gdssoft.oa.service.meeting.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.meeting.OutMeetingDao;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.meeting.MeetingToDo;
import com.gdssoft.oa.model.meeting.OutMeeting;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskService;
import com.gdssoft.oa.service.meeting.OutMeetingService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;

public class OutMeetingServiceImpl extends BaseServiceImpl<OutMeeting> implements OutMeetingService{
	private OutMeetingDao dao;
	
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private TaskService flowTaskService;
	
	public OutMeetingServiceImpl(OutMeetingDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public OutMeeting fillRunId(OutMeeting outMeeting) {
		return dao.fillRunId(outMeeting);
	}

	@Override
	public List<MeetingToDo> getNewFlowTaskList(Long userId, int toDoType,
			String meetingName,String attendUsers, String holdDep, String startDate,
			String endDate, int start, int size) {
		return dao.getNewFlowTaskList(userId, toDoType, meetingName, attendUsers, holdDep, startDate, endDate, start, size);
	}

	/**
	 * 由job定时完成，超时会议的终止工作
	 */
	@Override
	public void autoStopFlow() {
		logger.error("自动结束超时的外来会议流程autoStopFlow()启动。");
		autoStopExpiredMeetings();
		
//		List<OutMeeting> list = dao.getPastMeetings();
//		
//		for (OutMeeting om : list) {
//			ProcessRun processRun = processRunService.get(om.getRunId());
//			
//			for (TaskImpl taskImpl : flowTaskService.getTasksByUserId(processRun.getUserId().toString(), new PagingBean(0,Integer.MAX_VALUE))) {
//				if(taskImpl.getExecutionId().startsWith(processRun.getPiId()))
//					flowTaskService.remove(taskImpl);
//			}
//
//			processRun.setPiId(null);
//			processRun.setRunStatus(ProcessRun.RUN_STATUS_EXPIRED);
//			processRunService.stopProcessRun(processRun);
//		}
	}
	
	@Override
	public boolean cancelFlow(HttpServletRequest request) {
		
		String runId = request.getParameter("runId");
		Long flowId = Long.valueOf(runId);
		ProcessRun run = processRunService.get(flowId);
		run.setRunStatus(ProcessRun.RUN_STATUS_STOPED);
		processRunService.save(run);
		
		QueryFilter qf = new QueryFilter(request);
		qf.addFilter("Q_executionId_S_LK", run.getPiId());
		List<TaskImpl> list = flowTaskService.getAll(qf);
		for (TaskImpl taskImpl : list) {
			flowTaskService.remove(taskImpl);
		}
		
		return true;
	}
	public void autoStopExpiredMeetings(){
		dao.autoStopExpiredMeetings();
	}
}