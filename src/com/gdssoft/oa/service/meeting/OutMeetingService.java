package com.gdssoft.oa.service.meeting;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.meeting.MeetingToDo;
import com.gdssoft.oa.model.meeting.OutMeeting;

public interface OutMeetingService extends BaseService<OutMeeting>{

	/**
	 * 回写runid
	 * @param outMeeting
	 * @return
	 */
	public OutMeeting fillRunId(OutMeeting outMeeting);

	public List<MeetingToDo> getNewFlowTaskList(Long userId, int toDoType,
			String meetingName,String attendUsers ,String holdDep, String startDate,
			String endDate, int start, int size);

	public void autoStopFlow();

	public boolean cancelFlow(HttpServletRequest request);
	public void autoStopExpiredMeetings();
	
}


