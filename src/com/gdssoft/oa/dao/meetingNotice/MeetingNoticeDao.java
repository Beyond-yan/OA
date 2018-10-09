package com.gdssoft.oa.dao.meetingNotice;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.meetingNotice.MeetingNotice;
import com.gdssoft.oa.model.meetingNotice.MeetingNoticeToDo;

/**
 * 
 * @author 
 *
 */
public interface MeetingNoticeDao extends BaseDao<MeetingNotice>{

	public MeetingNotice updateRunId(MeetingNotice outMeeting);

	public List<MeetingNoticeToDo> getNewFlowTaskList(Long userId, int toDoType,
			String subject, String holdDep, String startDate,
			String endDate, int start, int size);

	public List<MeetingNoticeToDo> listAttendMeeting(Long userId,
			String subject, String holdDep, String startDate,
			String endDate, int start, int size);
	
}