package com.gdssoft.oa.dao.meeting;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.meeting.MeetingToDo;
import com.gdssoft.oa.model.meeting.OutMeeting;

/**
 * 
 * @author 
 *
 */
public interface OutMeetingDao extends BaseDao<OutMeeting>{

	public OutMeeting fillRunId(OutMeeting outMeeting);

	public List<MeetingToDo> getNewFlowTaskList(Long userId, int toDoType,
			String meetingName,String attendUsers, String holdDep, String startDate,
			String endDate, int start, int size);

	/**
	 * 取得今天之前要开的会议
	 * @return
	 */
	public List<OutMeeting> getPastMeetings();
	
	public void autoStopExpiredMeetings();
	
}