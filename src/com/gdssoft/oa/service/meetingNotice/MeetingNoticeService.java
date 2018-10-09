package com.gdssoft.oa.service.meetingNotice;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.meetingNotice.MeetingNotice;
import com.gdssoft.oa.model.meetingNotice.MeetingNoticeToDo;

public interface MeetingNoticeService extends BaseService<MeetingNotice>{

	/**
	 * 回写runid
	 * @param meetingNotice
	 * @return
	 */
	public MeetingNotice updateRunId(MeetingNotice meetingNotice);

	public List<MeetingNoticeToDo> getNewFlowTaskList(Long userId, int toDoType,
			String subject ,String holdDep, String startDate,
			String endDate, int start, int size);
	public List<MeetingNoticeToDo> listAttendMeeting(Long userId,
			String subject ,String holdDep, String startDate,
			String endDate, int start, int size);

	public boolean cancelFlow(HttpServletRequest request);
	
}


