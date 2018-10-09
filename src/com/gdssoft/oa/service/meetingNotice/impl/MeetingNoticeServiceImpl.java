package com.gdssoft.oa.service.meetingNotice.impl;
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
import com.gdssoft.oa.dao.meetingNotice.MeetingNoticeDao;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.meetingNotice.MeetingNotice;
import com.gdssoft.oa.model.meetingNotice.MeetingNoticeToDo;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskService;
import com.gdssoft.oa.service.meetingNotice.MeetingNoticeService;

public class MeetingNoticeServiceImpl extends BaseServiceImpl<MeetingNotice> implements MeetingNoticeService{
	private MeetingNoticeDao dao;
	
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private TaskService flowTaskService;
	
	public MeetingNoticeServiceImpl(MeetingNoticeDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public MeetingNotice updateRunId(MeetingNotice meetingNotice) {
		return dao.updateRunId(meetingNotice);
	}

	@Override
	public List<MeetingNoticeToDo> getNewFlowTaskList(Long userId, int toDoType,
			String subject, String holdDep, String startDate,
			String endDate, int start, int size) {
		List<MeetingNoticeToDo> result = dao.getNewFlowTaskList(userId, toDoType, subject, holdDep, startDate, endDate, start, size);
		return result;
	}

	@Override
	public List<MeetingNoticeToDo> listAttendMeeting(Long userId,
			String subject, String holdDep, String startDate,
			String endDate, int start, int size) {
		List<MeetingNoticeToDo> result = dao.listAttendMeeting(userId, subject, holdDep, startDate, endDate, start, size);
		return result;
	}

	@Override
	public boolean cancelFlow(HttpServletRequest request) {
		
		String runId = request.getParameter("runId");
		Long flowId = Long.valueOf(runId);
		ProcessRun run = processRunService.get(flowId);
		run.setPiId(null);
		run.setRunStatus(ProcessRun.RUN_STATUS_STOPED);
		processRunService.save(run);
		
		return true;
	}
}